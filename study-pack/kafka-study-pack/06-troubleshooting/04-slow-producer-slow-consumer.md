# Slow Producer / Slow Consumer

## 🎯 Mục tiêu học

Sau khi đọc xong, bạn sẽ:
- Phân tách rõ **producer-side, consumer-side, và broker-induced slowness** — 3 nguồn chậm hoàn toàn khác
  nhau, dễ nhầm lẫn khi chỉ nhìn triệu chứng bề mặt.
- Biết chính xác **config nào đáng nghi ngờ đầu tiên** cho từng loại chậm.
- Có debugging workflow riêng cho 3 tình huống: producer chậm, consumer chậm, cả 2 cùng chậm.

## 📖 Mục lục

- [Symptom](#-symptom)
- [Why this happens](#-why-this-happens)
- [Likely cause families](#-likely-cause-families)
- [Config suspects](#️-config-suspects)
- [Debugging workflow](#-debugging-workflow)
- [Common false assumptions](#-common-false-assumptions)
- [Fix directions](#-fix-directions)
- [Prevention / design fix](#-prevention--design-fix)
- [❌ Anti-patterns](#-anti-patterns)
- [🧪 Mini scenarios](#-mini-scenarios)
- [🎤 Interview lens](#-interview-lens)
- [✅ Key takeaways](#-key-takeaways)
- [🔗 Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 🔍 Symptom

- Producer: `send()` mất nhiều thời gian hơn bình thường để hoàn tất (đo qua callback/future), hoặc throughput
  ghi (records/giây) giảm rõ rệt so với baseline.
- Consumer: thời gian giữa các lần `poll()` kéo dài, throughput đọc giảm, hoặc lag bắt đầu tăng dần dù traffic
  producer không đổi (liên hệ [`01-high-consumer-lag.md`](01-high-consumer-lag.md)).
- Cả 2: latency end-to-end (từ lúc producer gửi tới lúc consumer xử lý xong) tăng đáng kể.

## 🧠 Why this happens

"Chậm" trong Kafka có thể xuất phát từ **4 lớp nguyên nhân độc lập**: cấu hình client (producer/consumer),
broker đang chịu tải, network/disk vật lý, hoặc chi phí serialization/compression. Mỗi lớp có dấu hiệu và cách
điều tra khác nhau — gộp chung "chậm" thành 1 vấn đề dẫn tới tune sai config mà không cải thiện gì.

## 🗂️ Likely cause families

| Vị trí | Cause family | Cơ chế |
|---|---|---|
| **Producer-side** | `linger.ms`/`batch.size` không phù hợp | Gửi từng message riêng lẻ (batch quá nhỏ) làm tăng round-trip; hoặc `linger.ms` quá cao làm trễ gửi không cần thiết |
| **Producer-side** | `acks=all` với `min.insync.replicas` cao | Producer phải chờ nhiều replica ack hơn, tăng latency mỗi request (đánh đổi có chủ đích với data safety) |
| **Producer-side** | Compression tốn CPU | Nén (đặc biệt `gzip`) tốn CPU đáng kể mỗi batch, có thể là bottleneck nếu CPU producer hạn chế |
| **Consumer-side** | Xử lý per-record nặng | Logic nghiệp vụ trong vòng lặp xử lý tốn nhiều thời gian hơn tốc độ fetch |
| **Consumer-side** | `fetch.min.bytes`/`max.poll.records` không phù hợp | Fetch quá ít dữ liệu mỗi lần (round-trip nhiều), hoặc fetch quá nhiều khiến 1 lần xử lý vượt `max.poll.interval.ms` |
| **Broker-induced** | Broker quá tải (CPU/disk/network) | Request queue tại broker dài ra, cả producer request lẫn consumer fetch đều bị trễ dù client config không đổi |
| **Broker-induced** | Disk I/O chậm (page cache miss) | Đọc dữ liệu cũ không còn trong page cache buộc phải đọc từ disk, tăng latency fetch — xem [`../05-operations/01-capacity-planning.md`](../05-operations/01-capacity-planning.md) |
| **Network/serialization** | Message size lớn | Serialize/deserialize và truyền tải tốn thời gian tỉ lệ với kích thước payload — xem [`../03-design-and-architecture/05-message-size-throughput-latency.md`](../03-design-and-architecture/05-message-size-throughput-latency.md) |

## ⚙️ Config suspects

| Config | Ảnh hưởng nếu sai |
|---|---|
| `linger.ms` | Quá thấp → gửi nhiều batch nhỏ, giảm throughput; quá cao → tăng latency mỗi message không cần thiết |
| `batch.size` | Quá nhỏ → nhiều round-trip network; quá lớn → tốn memory buffer producer, có thể trễ nếu chờ đầy batch |
| `acks` | `acks=all` chậm hơn `acks=1` nhưng an toàn hơn — đây là trade-off có chủ đích, không phải "bug" |
| `fetch.min.bytes`/`fetch.max.wait.ms` | Fetch quá ít dữ liệu mỗi lần làm tăng round-trip; cấu hình sai có thể tạo độ trễ nhân tạo giữa các lần fetch |
| `max.poll.records` | Quá thấp → nhiều vòng `poll()` không cần thiết; quá cao → có thể vượt `max.poll.interval.ms` nếu xử lý chậm |
| `compression.type` | Cân bằng giữa CPU (nén/giải nén) và network/disk bandwidth (dữ liệu nhỏ hơn) — chọn sai thuật toán nén cho profile tải có thể làm chậm hơn là nhanh hơn |

## 🧭 Debugging workflow

**Nếu producer chậm:**
1. Đo latency `send()` qua callback — tách riêng thời gian chờ do batch (`linger.ms`) và thời gian chờ ack từ
   broker.
2. Kiểm tra CPU producer — nếu cao bất thường, nghi ngờ compression hoặc serialization tốn kém.
3. Kiểm tra broker có đang quá tải không (request queue time trên broker) — nếu có, vấn đề không nằm ở producer
   config mà ở broker.

**Nếu consumer chậm:**
1. Đo thời gian giữa các lần `poll()` — nếu thời gian xử lý 1 batch gần chạm `max.poll.interval.ms`, đây là dấu
   hiệu cảnh báo sớm cho rebalance sắp xảy ra (xem [`05-rebalance-storms.md`](05-rebalance-storms.md)).
2. Tách riêng thời gian fetch (network) và thời gian xử lý (logic nghiệp vụ) — nếu thời gian xử lý chiếm phần
   lớn, vấn đề nằm ở code, không phải Kafka config.
3. Kiểm tra downstream call latency (nếu consumer gọi ra hệ thống ngoài) riêng biệt.

**Nếu cả 2 cùng chậm:**
1. Ưu tiên kiểm tra **broker trước** — nếu cả producer và consumer cùng chậm đồng thời, khả năng cao là broker
   đang quá tải (CPU/disk/network) hoặc network giữa client-broker có vấn đề, không phải trùng hợp 2 client
   cùng có bug riêng biệt.
2. Kiểm tra metric broker: request queue time, request handler idle ratio, disk I/O, network throughput.
3. Nếu broker khoẻ mạnh nhưng cả 2 vẫn chậm, nghi ngờ vấn đề hạ tầng chung (network switch, DNS, load balancer
   nếu có).

## ⚠️ Common false assumptions

- ❌ "Producer chậm chắc do broker" — bỏ qua khả năng do chính config producer (`linger.ms` quá cao, compression
  tốn CPU) hoặc do serialization phía client.
- ❌ "Tăng `acks` xuống thấp hơn sẽ tự động nhanh hơn mà không mất gì" — quên rằng đây là đánh đổi trực tiếp với
  độ an toàn dữ liệu (xem [`03-message-loss-duplicates.md`](03-message-loss-duplicates.md)).
- ❌ "Consumer chậm nghĩa là code có bug" — quên khả năng downstream call (API/DB) mới là nơi chậm thực sự, code
  consumer tự nó không đổi gì.
- ❌ "Compression luôn giúp nhanh hơn" — compression giảm dữ liệu truyền tải nhưng tốn CPU; nếu CPU là bottleneck
  thay vì network, compression có thể làm chậm hơn.

## 🛠️ Fix directions

| Nguyên nhân | Hướng fix |
|---|---|
| Batch quá nhỏ | Tăng `linger.ms`/`batch.size` hợp lý, đo lại throughput trước/sau |
| `acks=all` chậm nhưng cần thiết | Chấp nhận latency, không hạ `acks` chỉ vì lý do hiệu năng nếu dữ liệu quan trọng |
| Compression tốn CPU | Thử đổi thuật toán nén (`lz4`/`zstd` thường nhanh hơn `gzip`), hoặc tắt nếu CPU là bottleneck rõ ràng |
| Xử lý per-record nặng | Tối ưu logic, xử lý bất đồng bộ nếu hợp lý, tách phần nặng ra khỏi hot path |
| Fetch config không phù hợp | Tune `fetch.min.bytes`, `max.poll.records` theo profile tải thực tế, đo lại sau mỗi lần đổi |
| Broker quá tải | Xem [`../05-operations/02-scaling.md`](../05-operations/02-scaling.md) — có thể cần thêm broker hoặc rebalance partition |

## 🧱 Prevention / design fix

- Instrument riêng biệt thời gian ở từng bước (batch/gửi/ack cho producer; fetch/xử lý/downstream cho consumer)
  ngay từ đầu — giúp debug nhanh hơn nhiều khi có sự cố thay vì phải thêm log giữa chừng.
- Load test với message size và traffic pattern thực tế trước khi go-live, không chỉ test với dữ liệu mẫu nhỏ.
- Xem lại chiến lược message size từ thiết kế — xem
  [`../03-design-and-architecture/05-message-size-throughput-latency.md`](../03-design-and-architecture/05-message-size-throughput-latency.md).

## ❌ Anti-patterns

### ❌ Đổi config hàng loạt mà không đo trước/sau
**Biểu hiện:** khi thấy chậm, đổi nhiều config cùng lúc (`linger.ms`, `batch.size`, `acks`, `compression`) rồi
xem tổng thể có nhanh hơn không.
**Tại sao hay làm vậy:** muốn "thử cho nhanh" thay vì điều tra từng bước.
**Tại sao là vấn đề:** không biết chính xác thay đổi nào thực sự có tác dụng, dễ giữ lại cấu hình không tối ưu
hoặc đánh đổi an toàn dữ liệu (hạ `acks`) mà không nhận ra.
**Thay vào đó nên làm:** ✅ Đổi từng config một, đo lại throughput/latency sau mỗi lần đổi.

### ❌ Kết luận "consumer có bug" mà chưa tách downstream call
**Biểu hiện:** thấy consumer xử lý chậm, lập tức nghi ngờ và review lại code logic consumer.
**Tại sao hay làm vậy:** code consumer là phần dễ truy cập và review nhất trong tầm kiểm soát trực tiếp của
team.
**Tại sao là vấn đề:** nếu downstream (DB, API ngoài) mới là nơi chậm, review code consumer không tìm ra gì và
lãng phí thời gian điều tra.
**Thay vào đó nên làm:** ✅ Đo riêng downstream call latency trước khi kết luận nguyên nhân nằm ở logic
consumer.

## 🧪 Mini scenarios

**Scenario 1 — Producer chậm do compression tốn CPU:**
Producer bật `compression.type=gzip` để tiết kiệm network bandwidth. Throughput ghi giảm rõ rệt sau khi bật.
Điều tra: CPU producer tăng cao, gzip tốn nhiều CPU hơn dự tính cho payload có tỉ lệ nén thấp (dữ liệu đã gần
như ngẫu nhiên). Fix: đổi sang `lz4` — nhanh hơn nhiều, tỉ lệ nén thấp hơn gzip nhưng chấp nhận được.

**Scenario 2 — Consumer chậm do downstream DB, không phải code:**
Consumer xử lý chậm dần, thời gian giữa các lần `poll()` tăng. Review code không thấy gì bất thường. Điều tra
sâu hơn: đo riêng thời gian gọi DB ghi kết quả, thấy DB latency tăng gấp 10 lần bình thường do 1 index bị xoá
nhầm trong migration gần đây. Fix: khôi phục index.

**Scenario 3 — Cả producer và consumer cùng chậm do broker quá tải:**
Cả throughput ghi và đọc đều giảm cùng lúc, không có thay đổi code hay config nào gần đây. Điều tra broker
metric: request queue time tăng cao, disk I/O bão hoà do 1 topic khác trên cùng broker đột nhiên tăng traffic
mạnh. Fix: rebalance partition sang broker khác bớt tải, xem thêm
[`../05-operations/02-scaling.md`](../05-operations/02-scaling.md).

## 🎤 Interview lens

**"Producer của bạn đột nhiên chậm hẳn, bạn điều tra thế nào?"**
> Câu trả lời tốt cần thể hiện khả năng **tách lớp nguyên nhân**: đo riêng thời gian chờ batch (`linger.ms`),
> thời gian chờ ack từ broker, CPU của chính producer (nghi ngờ compression/serialization), và kiểm tra broker
> có đang quá tải hay không — không kết luận ngay 1 nguyên nhân duy nhất.

**"acks=all làm producer chậm hơn — bạn có nên hạ xuống acks=1 để cải thiện hiệu năng không?"**
> Đây là câu hỏi test hiểu biết về trade-off. Câu trả lời tốt: chỉ nên hạ nếu đã xác nhận dữ liệu chấp nhận được
> rủi ro mất mát khi leader chết trước khi replicate — không nên đổi chỉ vì lý do hiệu năng đơn thuần mà chưa
> đánh giá rủi ro dữ liệu tương ứng.

## ✅ Key takeaways

- Slowness có 4 lớp nguyên nhân độc lập: producer config, consumer config, broker load, network/serialization
  — cần tách lớp trước khi tune.
- Config như `acks`, `compression.type` luôn đi kèm trade-off — không có "giá trị đúng tuyệt đối", chỉ có giá
  trị phù hợp với yêu cầu cụ thể.
- Khi cả producer và consumer cùng chậm đồng thời, ưu tiên nghi ngờ broker/hạ tầng trước khi soát riêng từng
  client.

## 🔗 Xem tiếp / Liên kết liên quan

- [`01-high-consumer-lag.md`](01-high-consumer-lag.md) — khi consumer chậm dẫn tới lag tăng.
- [`../03-design-and-architecture/05-message-size-throughput-latency.md`](../03-design-and-architecture/05-message-size-throughput-latency.md)
  — trade-off batching/compression/message size ở tầng thiết kế.
- [`../05-operations/02-scaling.md`](../05-operations/02-scaling.md) — khi broker chính là bottleneck.
- [`README.md`](README.md) — quay lại tổng quan phần Troubleshooting.
