# Producer Configs và Delivery Behavior

## 🎯 Mục tiêu học

Đây **không phải** một bảng tra cứu config kiểu "copy từ doc chính thức". Sau khi đọc file này, bạn sẽ trả lời
được, với **từng config quan trọng**, đủ 4 câu hỏi:
1. Nó quyết định hành vi gì?
2. Nó tạo trade-off gì (latency / throughput / durability / ordering / duplicate risk)?
3. Cấu hình sai thì hỏng theo kiểu nào?
4. Nó tương tác với config khác ra sao?

## 📖 Mục lục

- [Bảng tổng hợp: Config → tác dụng → trade-off → failure mode](#-bảng-tổng-hợp-config--tác-dụng--trade-off--failure-mode)
- [`acks` — trade-off durability vs latency](#-acks--trade-off-durability-vs-latency)
- [`retries` + `delivery.timeout.ms` + `request.timeout.ms`](#-retries--deliverytimeoutms--requesttimeoutms)
- [`enable.idempotence` — giải quyết duplicate ở đâu, không giải quyết ở đâu](#-enableidempotence--giải-quyết-duplicate-ở-đâu-không-giải-quyết-ở-đâu)
- [`max.in.flight.requests.per.connection` — ordering vs throughput](#-maxinflightrequestsperconnection--ordering-vs-throughput)
- [`linger.ms` và `batch.size` — batching thực chiến](#-lingerms-và-batchsize--batching-thực-chiến)
- [`compression.type`](#-compressiontype)
- [`key.serializer` / `value.serializer`](#-keyserializer--valueserializer)
- [Duplicate message sources — tổng hợp](#-duplicate-message-sources--tổng-hợp)
- [Message loss sources — tổng hợp](#-message-loss-sources--tổng-hợp)
- [Ordering break sources — tổng hợp](#-ordering-break-sources--tổng-hợp)
- [Interview lens](#-interview-lens)
- [Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## ⚙️ Bảng tổng hợp: Config → tác dụng → trade-off → failure mode

| Config | Tác dụng | Trade-off chính | Failure mode khi cấu hình sai |
|---|---|---|---|
| `acks` | Producer coi ghi là "thành công" khi nào | Durability ⇄ Latency | `acks=0/1` + leader crash trước khi replicate → **mất dữ liệu** đã tưởng ghi thành công |
| `retries` | Số lần tự động gửi lại khi lỗi tạm thời | Không mất dữ liệu ⇄ Nguy cơ duplicate (nếu không có idempotence) | `retries=0` → mất dữ liệu ngay khi có lỗi mạng thoáng qua; `retries` cao + không idempotent → duplicate |
| `enable.idempotence` | Loại bỏ duplicate **do retry ở cấp 1 partition, phía producer** | Gần như miễn phí về hiệu năng, nhưng ép buộc `acks=all`, `max.in.flight ≤ 5`, `retries > 0` | Tắt cờ này mà vẫn bật retry → duplicate xảy ra âm thầm, khó phát hiện |
| `max.in.flight.requests.per.connection` | Số request được gửi song song (chưa nhận ack) trên 1 connection | Throughput ⇄ Ordering (nếu > 1 và có retry, không idempotent) | Giá trị > 5 khi bật `enable.idempotence` → **không được phép** (Kafka giới hạn cứng ở 5) |
| `linger.ms` | Thời gian chờ thêm để gom batch trước khi gửi | Latency ⇄ Throughput | `linger.ms=0` (mặc định) → gửi ngay, ít cơ hội batch, throughput thấp hơn ở tải cao; quá cao → latency tăng không cần thiết |
| `batch.size` | Kích thước batch tối đa (bytes) cho 1 partition | Throughput ⇄ Bộ nhớ producer | Quá nhỏ → batch bị "chốt" sớm, mất lợi ích gom batch; quá lớn → tốn bộ nhớ, có thể tăng latency đuôi (tail latency) |
| `compression.type` | Nén batch trước khi gửi (`none`/`gzip`/`snappy`/`lz4`/`zstd`) | CPU (producer + consumer) ⇄ Network/disk footprint | Chọn thuật toán nén nặng (`gzip`) cho hệ thống throughput cực cao, CPU-bound → producer trở thành bottleneck |
| `delivery.timeout.ms` | Tổng thời gian tối đa cho 1 record từ lúc gọi `send()` tới lúc thành công/thất bại hẳn (bao gồm cả retry) | An toàn ⇄ Độ trễ phát hiện lỗi | Đặt quá ngắn → record bị coi là fail dù broker chỉ chậm tạm thời, mất cơ hội retry đủ |
| `request.timeout.ms` | Thời gian chờ 1 request đơn lẻ trước khi coi là timeout | Phát hiện lỗi nhanh ⇄ Nhạy cảm với broker chậm tạm thời (GC pause, network jitter) | Quá ngắn → timeout giả (broker vẫn xử lý được, chỉ chậm), gây retry không cần thiết → tăng khả năng duplicate |
| `key.serializer` / `value.serializer` | Chuyển đổi object Java/app thành bytes để ghi vào Kafka | Không phải trade-off hiệu năng, mà là **tính đúng đắn dữ liệu** | Serializer không khớp giữa producer và deserializer ở consumer → lỗi deserialize hàng loạt ở phía đọc, thường phát hiện rất muộn |

## 🔐 `acks` — trade-off durability vs latency

`acks` quyết định **producer coi 1 lần ghi là thành công khi nào**, dựa trên số replica đã xác nhận:

| Giá trị | Producer coi là thành công khi | Latency | Rủi ro mất dữ liệu |
|---|---|---|---|
| `acks=0` | Không chờ gì cả — gửi xong là coi như thành công | Thấp nhất | **Cao nhất** — mất dữ liệu nếu broker không nhận được, và producer không hề biết |
| `acks=1` | Chỉ leader xác nhận đã ghi vào log của nó | Trung bình | Mất dữ liệu nếu **leader crash trước khi follower kịp replicate** |
| `acks=all` (`-1`) | Toàn bộ **ISR** xác nhận đã ghi (không phải toàn bộ replica, chỉ ISR — xem [`03-brokers-clusters-replication.md`](03-brokers-clusters-replication.md)) | Cao nhất | Thấp nhất — chỉ mất nếu **toàn bộ ISR cùng lúc chết** (rất hiếm nếu `min.insync.replicas` cấu hình hợp lý) |

📌 **`acks=all` không có nghĩa là "chờ mọi replica"** — nó có nghĩa là "chờ mọi replica **đang trong ISR**". Nếu
ISR chỉ còn 1 replica (leader) do các follower bị rớt lag, `acks=all` lúc này **tương đương `acks=1`** về mặt
durability thực tế — đây là lý do `acks=all` luôn nên đi kèm `min.insync.replicas ≥ 2` để đảm bảo có ít nhất 1
follower thực sự xác nhận, không chỉ leader.

**Interview reasoning**: khi được hỏi "hệ thống của bạn dùng `acks` gì", câu trả lời tốt luôn gắn với **loại dữ
liệu** — dữ liệu tài chính/giao dịch quan trọng gần như luôn cần `acks=all` + `min.insync.replicas=2`; dữ liệu
log/metric ít quan trọng có thể chấp nhận `acks=1` để đổi lấy latency thấp hơn.

## 🔁 `retries` + `delivery.timeout.ms` + `request.timeout.ms`

3 config này phối hợp với nhau để định nghĩa "producer sẽ cố gắng tới đâu trước khi báo lỗi hẳn":

- `request.timeout.ms`: thời gian chờ **1 lần gửi**.
- `retries`: số lần được phép gửi lại nếu request timeout hoặc gặp lỗi tạm thời (không phải lỗi logic như
  serialization error — những lỗi đó không retry được).
- `delivery.timeout.ms`: **trần tổng thời gian** cho toàn bộ vòng đời của 1 record (bao gồm tất cả các lần
  retry) — nếu vượt trần này mà vẫn chưa thành công, producer báo lỗi hẳn, không retry thêm nữa dù `retries`
  còn.

📌 Quan hệ: `delivery.timeout.ms` phải **≥** `request.timeout.ms + linger.ms` (Kafka tự validate điều này) — vì
nếu không, cấu hình sẽ mâu thuẫn logic (không đủ thời gian cho dù chỉ 1 lần gửi trọn vẹn).

**Failure mode khi cấu hình sai**: đặt `retries=0` để "tăng tốc" (không cần chờ retry) khiến **bất kỳ lỗi mạng
thoáng qua nào cũng biến thành mất dữ liệu ngay lập tức**, thay vì được retry và có cơ hội thành công.

## 🛡️ `enable.idempotence` — giải quyết duplicate ở đâu, không giải quyết ở đâu

Khi `enable.idempotence=true`, mỗi producer được gán 1 `producer ID (PID)`, và mỗi message gửi tới 1 partition
được đánh `sequence number` tăng dần. Broker lưu lại sequence number gần nhất đã ghi cho mỗi (PID, partition) —
nếu nhận được 1 request có sequence number **đã thấy trước đó**, broker biết đây là **retry của chính request
cũ**, và **loại bỏ** (không ghi thêm lần 2), nhưng vẫn trả về ack thành công cho producer.

✅ **Giải quyết được**: duplicate xảy ra do producer retry gửi lại **cùng 1 batch** tới **cùng 1 partition**
(do timeout/lỗi mạng, không phải do producer chủ động gửi lại logic nghiệp vụ).

❌ **KHÔNG giải quyết được**:
- Duplicate do **producer chủ động gửi lại** cùng 1 sự kiện nghiệp vụ nhiều lần (ví dụ retry ở tầng ứng dụng,
  không phải retry ở tầng Kafka client) — đây vẫn là 2 message hợp lệ khác nhau dưới góc nhìn của idempotent
  producer.
- Duplicate/mất dữ liệu xảy ra ở **phía consumer** (ví dụ process xong nhưng chưa commit, restart, xử lý lại) —
  đây là phạm vi hoàn toàn khác, xem [`05-consumers.md`](05-consumers.md).
- Tính nhất quán khi ghi vào **nhiều partition/topic cùng lúc** — đó là việc của **transactions**, không phải
  idempotent producer (idempotent producer chỉ đảm bảo đúng 1 partition tại 1 thời điểm).

📌 Bật `enable.idempotence=true` **tự động ép**: `acks=all`, `retries > 0`, và
`max.in.flight.requests.per.connection ≤ 5` — vì cơ chế phát hiện duplicate cần các điều kiện này để hoạt động
đúng (không thể phát hiện trùng nếu không chờ đủ ack, hoặc nếu quá nhiều request bay song song không kiểm soát
được thứ tự sequence number).

## 🔀 `max.in.flight.requests.per.connection` — ordering vs throughput

Config này quyết định **số request được phép gửi song song** (chưa nhận ack) trên 1 connection tới 1 broker.

- **Giá trị > 1** (mặc định lịch sử là 5): nhiều batch có thể "bay" cùng lúc, tăng throughput vì không cần chờ
  ack của batch trước mới gửi batch sau.
- ⚠️ **Rủi ro ordering**: nếu có > 1 request in-flight **và** một trong số các batch đó phải retry (do timeout),
  batch retry có thể được ghi **sau** một batch gửi muộn hơn nhưng thành công trước — **thứ tự trong partition
  bị đảo ngược**.
- **Với `enable.idempotence=true`**: Kafka vẫn cho phép `max.in.flight.requests.per.connection` lên tới **5**
  (không bắt buộc phải là 1) mà **vẫn giữ đúng thứ tự**, vì broker dùng sequence number để **sắp xếp lại đúng
  trật tự** trước khi ghi, kể cả khi các request tới không đúng thứ tự gửi ban đầu. Đây là lý do idempotent
  producer vừa giải quyết duplicate, vừa gián tiếp bảo vệ ordering mà không cần hy sinh hoàn toàn throughput
  (không cần ép về giá trị 1).
- **Không dùng idempotent producer + giá trị > 1 + có retry**: đây là tổ hợp **nguy hiểm nhất** cho ordering —
  không có gì đảm bảo thứ tự trong trường hợp này.

## 📦 `linger.ms` và `batch.size` — batching thực chiến

Đã giới thiệu ở [`04-producers.md`](04-producers.md); ở đây đào sâu reasoning cấu hình:

- `linger.ms=0` (mặc định): producer gửi ngay khi có thể, **không chủ động chờ** để gom thêm record — vẫn có
  thể có batch nếu nhiều record được xếp hàng đồng thời (traffic cao), nhưng không **chủ động tối ưu** cho việc
  này.
- Tăng `linger.ms` (ví dụ 5-20ms) đánh đổi **một chút latency** để đổi lấy **batch lớn hơn, throughput cao
  hơn** — đặc biệt hiệu quả khi traffic không đủ dày để tự nhiên tạo batch lớn.
- `batch.size` là **trần** cho 1 batch (theo bytes) — batch sẽ được gửi sớm hơn `linger.ms` nếu đã đầy trước đó.
- 📌 Failure mode phổ biến: đặt `linger.ms` cao (ví dụ 500ms) cho hệ thống **cần độ trễ thấp** (ví dụ giao dịch
  cần phản hồi real-time) — vô tình đánh đổi latency lấy throughput mà hệ thống không thực sự cần đánh đổi đó.

## 🗜️ `compression.type`

Nén batch giảm dung lượng truyền qua network và lưu trên đĩa, đánh đổi bằng **CPU** (cả producer khi nén, cả
consumer khi giải nén):

| Thuật toán | Tỷ lệ nén | CPU cost | Khi nào phù hợp |
|---|---|---|---|
| `none` | Không nén | Thấp nhất | Network/disk dư dả, CPU là tài nguyên khan hiếm hơn |
| `lz4` | Trung bình | Thấp | Lựa chọn cân bằng phổ biến nhất cho throughput cao |
| `snappy` | Trung bình | Thấp | Tương tự lz4, phổ biến ở hệ thống cũ hơn |
| `gzip` | Cao nhất | Cao nhất | Khi băng thông/disk là tài nguyên khan hiếm nhất, chấp nhận CPU cao hơn |
| `zstd` | Cao, cấu hình được mức độ | Trung bình-cao (tùy mức) | Cân bằng tốt giữa tỷ lệ nén và CPU ở phiên bản Kafka mới |

📌 **Nén xảy ra ở cấp batch**, không phải từng message — đây là lý do batch lớn hơn (nhờ `linger.ms`/
`batch.size` hợp lý) thường nén hiệu quả hơn (tỷ lệ nén tốt hơn với dữ liệu lớn hơn, ít overhead hơn trên mỗi
message).

## 🔤 `key.serializer` / `value.serializer`

Không phải trade-off hiệu năng — đây là vấn đề **tính đúng đắn dữ liệu**. Serializer chuyển object (String, JSON,
Avro record...) thành bytes; **deserializer phía consumer phải khớp chính xác** với serializer đã dùng.

📌 Failure mode: đổi serializer (ví dụ từ `StringSerializer` sang `AvroSerializer`) cho topic đang chạy production
mà không có chiến lược tương thích (schema evolution, dual-write, hoặc topic mới) → consumer cũ **crash hàng
loạt khi deserialize**, vì bytes trên wire không còn đúng định dạng nó mong đợi. Chi tiết về schema evolution ở
`../03-design-and-architecture/04-schema-design-avro-protobuf-json.md` (sẽ mở rộng ở lượt sau).

## 🧬 Duplicate message sources — tổng hợp

1. Producer retry (do timeout/lỗi mạng) **không có** `enable.idempotence=true`.
2. Producer ứng dụng tự retry ở tầng logic nghiệp vụ (ví dụ code tự gọi lại `send()` sau khi timeout, không
   phải Kafka client tự retry) — `enable.idempotence` **không** bảo vệ trường hợp này.
3. Consumer xử lý xong nhưng crash **trước khi commit** — xử lý lại từ offset cũ khi restart (xem
   [`05-consumers.md`](05-consumers.md)).

## 🕳️ Message loss sources — tổng hợp

1. `acks=0` hoặc `acks=1` + leader crash trước khi (hoặc trong lúc) replicate sang follower.
2. `acks=all` nhưng `min.insync.replicas` quá thấp (hoặc không đặt), ISR co lại còn 1 replica trước khi crash.
3. Consumer commit **trước khi** xử lý xong hoàn toàn (đặc biệt với `enable.auto.commit=true` xử lý bất đồng
   bộ) — xem [`05-consumers.md`](05-consumers.md) và [`08-consumer-configs-and-offset-management.md`](08-consumer-configs-and-offset-management.md).
4. `retries=0` hoặc `delivery.timeout.ms` quá ngắn — lỗi tạm thời biến thành lỗi vĩnh viễn vì không có đủ cơ
   hội retry.

## 🔢 Ordering break sources — tổng hợp

1. Không dùng key nhất quán cho dữ liệu cần ordering theo entity (partitioner phân phối vào các partition khác
   nhau).
2. `max.in.flight.requests.per.connection > 1` + có retry + **không** bật `enable.idempotence` — batch retry
   có thể được ghi sau batch gửi muộn hơn nhưng thành công trước.
3. Consumer group rebalance làm gián đoạn tạm thời việc xử lý theo thứ tự nếu logic downstream giả định 1
   consumer luôn xử lý tuần tự toàn bộ 1 luồng dữ liệu xuyên suốt (mở rộng ở
   [`09-rebalancing-and-group-behavior-basics.md`](09-rebalancing-and-group-behavior-basics.md)).

## 🎤 Interview lens

**"Làm sao để đảm bảo không mất dữ liệu khi ghi vào Kafka?"**
> Trả lời tốt: "Không có 1 config duy nhất đảm bảo điều này — cần kết hợp `acks=all`, `min.insync.replicas ≥ 2`
> ở phía broker/topic, `retries` đủ lớn với `delivery.timeout.ms` hợp lý ở phía producer, và xử lý callback/
> exception thay vì coi `send()` là fire-and-forget. Producer riêng lẻ không thể đảm bảo an toàn nếu topic
> không được cấu hình `min.insync.replicas` phù hợp — đây là sự phối hợp giữa producer config và topic config."

> ⚠️ Câu trả lời yếu: "Dùng `acks=all`" (dừng lại ở đó) — thiếu phần `min.insync.replicas`, khiến `acks=all`
> có thể suy biến về durability tương đương `acks=1` khi ISR co lại.

**"Idempotent producer có làm Kafka chậm đi không?"**
> Trả lời tốt: "Về throughput, gần như không đáng kể — chi phí thêm chỉ là vài byte metadata (producer ID,
> sequence number) mỗi request. Cái nó ép buộc là `acks=all` (vốn dĩ đã là lựa chọn đúng cho dữ liệu quan
> trọng) và giới hạn `max.in.flight ≤ 5` — với hầu hết hệ thống, đây không phải đánh đổi lớn so với lợi ích loại
> bỏ duplicate ở tầng producer-broker."

## 🔗 Xem tiếp / Liên kết liên quan

- Tiếp theo: [`08-consumer-configs-and-offset-management.md`](08-consumer-configs-and-offset-management.md) —
  đào sâu config phía consumer.
- [`04-producers.md`](04-producers.md) — mental model nền tảng trước khi đi sâu vào từng config ở đây.
- [`10-ordering-delivery-semantics.md`](10-ordering-delivery-semantics.md) — bức tranh tổng thể về delivery
  semantics, gộp cả góc nhìn producer lẫn consumer.
- [`03-brokers-clusters-replication.md`](03-brokers-clusters-replication.md) — nền tảng về ISR, cần thiết để
  hiểu đúng `acks=all` thực sự đảm bảo gì.
- [`../GLOSSARY.md`](../GLOSSARY.md) — tra cứu `idempotence`, `partitioner`, `ISR`.
