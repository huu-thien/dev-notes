# Producers

## 🎯 Mục tiêu học

Sau khi đọc file này, bạn sẽ:
- Biết chính xác **producer record gồm những gì**, và Kafka làm gì với nó trước khi nó "biến mất" vào log.
- Hiểu **partition selection** không phải phép màu — nó là kết quả của partitioner, key, và cấu hình.
- Hiểu **batching** và **sticky partitioner** tồn tại để giải quyết vấn đề gì (không phải chi tiết vặt).
- Biết chính xác **khi nào producer có thể tạo duplicate, khi nào có thể làm mất message** — ở mức nền, trước
  khi đi sâu vào từng config cụ thể ở [`07-producer-configs-and-delivery-behavior.md`](07-producer-configs-and-delivery-behavior.md).

## 📖 Mục lục

- [Producer record gồm những gì](#producer-record-gồm-những-gì)
- [Send path: chuyện gì xảy ra khi bạn gọi `producer.send()`](#send-path-chuyện-gì-xảy-ra-khi-bạn-gọi-producersend)
- [Partition selection mindset](#partition-selection-mindset)
- [Batching — vì sao nó tồn tại](#batching--vì-sao-nó-tồn-tại)
- [Sticky partitioner — vì sao nó tồn tại](#sticky-partitioner--vì-sao-nó-tồn-tại)
- [Retry và acks — mức nền](#retry-và-acks--mức-nền)
- [Ordering implications](#ordering-implications)
- [Failure modes](#-failure-modes)
- [Common mistakes / Anti-patterns](#-common-mistakes--anti-patterns)
- [Mini scenarios](#-mini-scenarios)
- [Key takeaways](#-key-takeaways)
- [Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 📦 Producer record gồm những gì

Một **producer record** không chỉ là "message" — nó là một cấu trúc có nhiều field, và **mỗi field ảnh hưởng
tới hành vi thực tế**, không chỉ là metadata trang trí:

| Field | Ý nghĩa | Ảnh hưởng thực tế |
|---|---|---|
| `topic` | Topic đích | Xác định log nào record sẽ được append vào |
| `key` (optional) | Dùng để chọn partition | **Quyết định ordering** — cùng key luôn vào cùng partition |
| `value` | Payload thực sự | Kích thước value ảnh hưởng batching, network, throughput |
| `partition` (optional) | Ép cứng partition đích | Nếu set, **bỏ qua hoàn toàn** partitioner — dùng khi bạn tự quản lý logic phân phối |
| `headers` (optional) | Metadata dạng key-value | Dùng cho tracing, routing logic ở downstream, không ảnh hưởng partition |
| `timestamp` (optional) | Thời điểm gắn với record | Ảnh hưởng tới time-based retention, time-based seek, và windowing ở Kafka Streams (mở rộng ở `04-ecosystem/03-kafka-streams.md`) |

📌 **Điểm hay bị bỏ qua**: nếu bạn set `partition` tường minh, bạn đang **tự chịu trách nhiệm** cho việc phân
phối đều dữ liệu — Kafka sẽ không còn "sửa giúp" bạn nếu logic đó gây lệch tải (hot partition).

## 🔄 Send path: chuyện gì xảy ra khi bạn gọi `producer.send()`

`producer.send()` **không đồng bộ ghi vào broker ngay lập tức** — nó trả về gần như tức thì vì Kafka producer
hoạt động theo mô hình **buffer + background thread**:

```
producer.send(record)
        │
        ▼
1. Serialize key/value (key.serializer, value.serializer)
        │
        ▼
2. Partitioner chọn partition đích
        │
        ▼
3. Record được xếp vào 1 "batch" trong bộ nhớ đệm (RecordAccumulator),
   theo từng partition riêng
        │
        ▼
4. Background I/O thread gửi batch đã đủ điều kiện (xem batching bên dưới)
   tới leader broker của partition đó
        │
        ▼
5. Broker trả về ack theo cấu hình `acks`
        │
        ▼
6. Callback/Future của producer.send() được hoàn tất (thành công hoặc lỗi)
```

- 💡 Vì bước 1-3 xảy ra ngay trên thread gọi `send()`, còn bước 4-5 xảy ra ở **background thread riêng**, nên
  `producer.send()` **không có nghĩa là "đã ghi vào Kafka"** — nó chỉ có nghĩa là "đã được xếp hàng để gửi".
  Đây là nguồn gốc của một anti-pattern rất phổ biến (xem phần Anti-pattern bên dưới).
- Muốn biết chắc chắn record đã được broker xác nhận, phải dùng **callback** (`send(record, callback)`) hoặc gọi
  `.get()` trên `Future` trả về (đồng bộ hóa, đánh đổi throughput lấy sự chắc chắn).

## 🧭 Partition selection mindset

Không có khái niệm "producer ghi ngẫu nhiên vào 1 partition nào đó" — luôn có 1 trong 3 luật rõ ràng:

1. **Có `partition` tường minh trong record** → dùng đúng partition đó, bỏ qua mọi logic khác.
2. **Có `key`, không có `partition` tường minh** → partitioner hash key để chọn partition — **tất định**: cùng
   key (và cùng số partition của topic) → luôn ra cùng 1 partition.
3. **Không có `key`, không có `partition`** → dùng **sticky partitioner** (mặc định từ Kafka 2.4+) để chọn 1
   partition, gửi 1 loạt batch vào đó, rồi đổi sang partition khác — mục tiêu là tối ưu batching (xem bên
   dưới), không phải round-robin tuyệt đối từng message một như các phiên bản Kafka cũ hơn.

📌 **Quy tắc cần khắc sâu**: nếu bạn cần ordering giữa các event của cùng 1 entity (ví dụ mọi event của 1
`order_id`), bạn **bắt buộc phải dùng key** = `order_id`. Không có key, Kafka không có cách nào biết "những
message này thuộc về cùng 1 entity" để giữ chúng cùng partition.

## 📥 Batching — vì sao nó tồn tại

Batching tồn tại để giải quyết một vấn đề rất cụ thể: **gửi từng message một qua network cực kỳ kém hiệu quả**
(mỗi request có overhead cố định bất kể payload lớn hay nhỏ). Batching gộp nhiều record **cùng partition đích**
thành 1 request duy nhất, giảm số round-trip và tăng throughput đáng kể.

- Batch được "chốt" và gửi đi khi thỏa **1 trong 2 điều kiện** (điều kiện nào tới trước): batch đầy (theo
  `batch.size`) hoặc đã chờ đủ lâu (theo `linger.ms`) — chi tiết reasoning đầy đủ về 2 config này (và trade-off
  latency vs throughput) ở [`07-producer-configs-and-delivery-behavior.md`](07-producer-configs-and-delivery-behavior.md).
- 💡 Batching là lý do vì sao Kafka có thể đạt throughput rất cao (hàng trăm MB/s trên 1 producer) dù mỗi
  message riêng lẻ có thể rất nhỏ — chi phí network được **chia đều** cho cả batch thay vì trả riêng cho từng
  message.

## 🧲 Sticky partitioner — vì sao nó tồn tại

Trước Kafka 2.4, khi không có key, producer dùng **round-robin tuyệt đối**: message 1 → partition 0, message 2
→ partition 1, message 3 → partition 2... Nghe có vẻ công bằng, nhưng nó phá vỡ batching: mỗi partition chỉ
nhận **1 message** trước khi batch bị "ngắt" để chuyển sang partition khác — batch nhỏ, hiệu quả thấp.

**Sticky partitioner** ra đời để giải quyết đúng vấn đề này:
- Producer "dính" (sticky) vào **1 partition** cho tới khi batch hiện tại đầy hoặc `linger.ms` hết hạn, rồi mới
  chuyển sang partition khác cho batch tiếp theo.
- Kết quả: batch lớn hơn, ít request hơn, throughput cao hơn — **đánh đổi bằng phân phối tức thời kém đều hơn**
  (tại 1 thời điểm ngắn, dữ liệu dồn vào 1 partition thay vì trải đều ngay lập tức). Về lâu dài (nhiều batch),
  phân phối vẫn gần như đều.

⚠️ **Đây không phải vấn đề nếu bạn không có key** — mục tiêu đã là "phân phối đều, không cần thứ tự", nên việc
dồn tạm thời vào 1 partition trong một batch ngắn không ảnh hưởng gì tới đúng đắn. Nó **chỉ** trở thành vấn đề
nếu bạn nhầm tưởng "không key" đồng nghĩa "phân phối tuyệt đối đều theo thời gian thực" — điều đó chưa từng
đúng ngay cả trước sticky partitioner.

## ✅ Retry và acks — mức nền

Ở mức nền, chỉ cần nắm 2 ý (chi tiết đầy đủ, bao gồm cấu hình sai gây hậu quả gì, ở
[`07-producer-configs-and-delivery-behavior.md`](07-producer-configs-and-delivery-behavior.md)):

- **`acks`** quyết định producer coi 1 lần ghi là "thành công" khi nào — chỉ leader xác nhận (`acks=1`), hay
  phải chờ toàn bộ ISR xác nhận (`acks=all`), hay không chờ gì cả (`acks=0`). Đây là **trade-off cốt lõi giữa
  latency và durability** của mọi hệ thống dùng Kafka.
- **`retries`** cho phép producer tự động gửi lại khi gặp lỗi tạm thời (timeout, broker không phản hồi kịp).
  Retry là cơ chế **cần thiết** để đạt at-least-once, nhưng cũng là **nguồn gốc chính của duplicate** nếu không
  có idempotent producer đi kèm.

## 🔢 Ordering implications

Producer là nơi **quyết định phần lớn khả năng giữ ordering** của toàn hệ thống, thông qua 2 lựa chọn:

1. **Có dùng key nhất quán không** — không có key nhất quán, không có ordering theo entity, bất kể cấu hình gì
   khác ở downstream.
2. **`max.in.flight.requests.per.connection` là bao nhiêu** — nếu > 1 (giá trị mặc định lịch sử) và có retry,
   2 batch có thể được gửi song song tới cùng 1 partition; nếu batch thứ 2 thành công trước batch thứ 1 (do
   retry batch 1), **thứ tự bị đảo ngược trong chính partition đó** — chi tiết cơ chế và cách Kafka giải quyết
   vấn đề này bằng idempotent producer ở [`07-producer-configs-and-delivery-behavior.md`](07-producer-configs-and-delivery-behavior.md).

## 🚨 Failure modes

| Tình huống | Hệ quả | Vì sao xảy ra |
|---|---|---|
| Không dùng key cho dữ liệu cần ordering theo entity | Ordering bị phá vỡ khi throughput cao (nhiều partition) | Partitioner phân phối message của cùng 1 entity vào các partition khác nhau, mỗi partition xử lý độc lập, không có ordering xuyên partition |
| `acks=0` hoặc `acks=1` + broker/leader crash trước khi replicate | **Message loss** — dữ liệu coi như "đã gửi thành công" phía producer nhưng chưa từng tồn tại bền vững trên cluster | Producer không chờ đủ xác nhận từ replica trước khi coi là thành công |
| Retry bật nhưng không có `enable.idempotence=true` | **Duplicate** — cùng 1 message có thể được ghi 2 lần nếu ack đầu tiên bị mất trên đường về (dù broker đã ghi thành công) | Producer không có cách nào phân biệt "chưa ghi" với "đã ghi nhưng ack bị mất" |
| Không dùng callback/`.get()`, coi `send()` là đồng bộ | Lỗi gửi bị **âm thầm bỏ qua** — code tưởng đã gửi thành công nhưng thực tế có thể đã fail | `send()` chỉ enqueue vào buffer, không đảm bảo đã tới broker |

## ❌ Common mistakes / Anti-patterns

| Sai lầm | Vì sao dễ mắc | Hậu quả thực tế | Cách sửa mental model |
|---|---|---|---|
| Coi `producer.send()` là lệnh đồng bộ, không xử lý callback/exception | API trông giống một lời gọi hàm bình thường, dễ quên rằng nó là async | Message bị mất âm thầm khi có lỗi (network, broker down) mà code không hề biết, log không có dấu vết | Luôn gắn callback hoặc kiểm tra `Future`, đặc biệt với dữ liệu quan trọng (không áp dụng cho log ít quan trọng có thể chấp nhận mất) |
| Không dùng key vì "đơn giản hơn", sau đó ngạc nhiên vì dữ liệu ra "sai thứ tự" | Test ở topic 1 partition không phát hiện ra vấn đề | Production nhiều partition, event của cùng 1 entity rơi vào các partition khác nhau, xử lý không đúng thứ tự nghiệp vụ | Luôn xác định rõ: dữ liệu này có cần ordering theo entity không? Nếu có, bắt buộc dùng key ngay từ đầu |
| Ép `partition` tường minh để "tự tối ưu", không tính toán phân phối đều | Muốn kiểm soát tuyệt đối việc dữ liệu đi đâu | Logic tự viết phân phối lệch, tạo hot partition mà không có cơ chế nào của Kafka tự sửa giúp | Chỉ ép partition tường minh khi thực sự cần (ví dụ migrate dữ liệu có thứ tự đặc biệt), và tự đảm bảo phân phối hợp lý |

## 🧪 Mini scenarios

**Scenario 1 — Key-based ordering:**
Hệ thống order-processing publish `OrderCreated`, `OrderPaid`, `OrderShipped` với key = `order_id`. Dù topic có
12 partition, mọi event của cùng 1 đơn hàng luôn vào **cùng 1 partition** — consumer xử lý đúng thứ tự nghiệp vụ
(`Created` trước `Paid` trước `Shipped`) mà không cần cơ chế đồng bộ nào khác.

**Scenario 2 — No-key, high throughput:**
Hệ thống thu thập log clickstream (không cần ordering giữa các sự kiện của người dùng khác nhau, và thậm chí
trong cùng 1 người dùng cũng không quá nhạy cảm về thứ tự tuyệt đối) không dùng key — sticky partitioner giúp
mỗi batch đầy hơn, throughput tổng thể cao hơn đáng kể so với việc ép ordering không cần thiết.

**Scenario 3 — Retry gây hành vi bất ngờ:**
Producer gửi record `PaymentConfirmed` nhưng gặp timeout mạng ngắn (broker thực ra **đã ghi thành công**, chỉ
là ack bị trễ). Producer tự động retry (do `retries > 0`, không bật `enable.idempotence`), tạo ra **2 bản ghi
trùng nhau** trong cùng partition. ❌ Team ban đầu tưởng đây là "bug ngẫu nhiên hiếm gặp", nhưng thực chất là hệ
quả tất định của retry không có idempotency — đây chính là lý do `enable.idempotence=true` gần như luôn nên
bật (chi tiết ở file tiếp theo).

## ✅ Key takeaways

- Producer record có nhiều field ảnh hưởng hành vi thực tế — `key` là field quan trọng nhất vì nó quyết định
  ordering.
- `send()` là **bất đồng bộ** — không xử lý callback/Future đồng nghĩa với việc chấp nhận mất dữ liệu âm thầm
  khi có lỗi.
- Batching và sticky partitioner tồn tại để tối ưu throughput, đánh đổi bằng độ trễ nhỏ và phân phối tức thời
  kém đều hơn (không ảnh hưởng đúng đắn nếu không cần ordering).
- Producer là nơi quyết định phần lớn khả năng giữ ordering (qua key) và là 1 trong 2 nguồn gốc chính của
  duplicate (qua retry không idempotent).

## 🔗 Xem tiếp / Liên kết liên quan

- Tiếp theo: [`05-consumers.md`](05-consumers.md) — phía đọc dữ liệu hoạt động ra sao.
- Đào sâu config: [`07-producer-configs-and-delivery-behavior.md`](07-producer-configs-and-delivery-behavior.md)
  — `acks`, `retries`, `enable.idempotence`, `max.in.flight.requests.per.connection`, `linger.ms`, `batch.size`...
- [`02-topics-partitions-offsets.md`](02-topics-partitions-offsets.md) — nền tảng về partition/ordering mà
  partitioner dựa vào.
- [`10-ordering-delivery-semantics.md`](10-ordering-delivery-semantics.md) — bức tranh đầy đủ về ordering và
  delivery semantics, gộp cả góc nhìn producer lẫn consumer.
