# Khi nào nên dùng Kafka?

## 🎯 Mục tiêu học

Sau khi đọc file này, bạn sẽ:
- Nhận diện được các **dấu hiệu hệ thống thực sự cần Kafka**, thay vì chọn Kafka vì nó phổ biến.
- Biết 6 nhóm use case mà Kafka giải quyết tốt, và **vì sao** log-based architecture phù hợp với từng nhóm.
- Hiểu rõ **cái giá phải trả** ngay cả khi Kafka là lựa chọn đúng — không có quyết định kiến trúc nào miễn phí.
- Có thể phân tích một architecture interview question theo hướng "khi nào Kafka hợp lý".

## 📖 Mục lục

- [Dấu hiệu hệ thống cần Kafka](#-dấu-hiệu-hệ-thống-cần-kafka)
- [6 nhóm use case Kafka giải quyết tốt](#-6-nhóm-use-case-kafka-giải-quyết-tốt)
- [Bảng: Use case → vì sao Kafka phù hợp → cái giá phải trả](#-bảng-use-case--vì-sao-kafka-phù-hợp--cái-giá-phải-trả)
- [Mini scenarios](#-mini-scenarios)
- [Architecture interview scenario](#-architecture-interview-scenario)
- [Trade-off tổng quát khi chọn Kafka](#️-trade-off-tổng-quát-khi-chọn-kafka)
- [Common mistakes khi đánh giá "có nên dùng Kafka"](#-common-mistakes-khi-đánh-giá-có-nên-dùng-kafka)
- [Key takeaways](#-key-takeaways)
- [Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 🔍 Dấu hiệu hệ thống cần Kafka

Trước khi liệt kê use case cụ thể, hãy tự hỏi các câu sau về hệ thống bạn đang thiết kế. Càng nhiều câu trả lời
"có", Kafka càng có khả năng là lựa chọn đúng:

- ❓ Có **nhiều hơn một bên độc lập** cần biết về cùng một sự kiện (không phải chỉ 1 producer → 1 consumer)?
- ❓ Các bên tiêu thụ có **tốc độ xử lý khác nhau đáng kể** (real-time vs batch hàng ngày)?
- ❓ Có khả năng trong tương lai sẽ cần **thêm consumer mới** mà không muốn đổi code ở phía producer?
- ❓ Có nhu cầu **đọc lại dữ liệu cũ** (replay) để build lại state, debug, hoặc phục vụ consumer mới xuất hiện?
- ❓ Hệ thống cần **audit trail** đáng tin cậy về "điều gì đã xảy ra, theo thứ tự nào"?
- ❓ Throughput dự kiến đủ lớn (hàng nghìn đến hàng triệu event/giây) để lợi ích scale-out có ý nghĩa?

Nếu phần lớn câu trả lời là "không" — ví dụ chỉ có 1 producer, 1 consumer, xử lý ngay lập tức, không cần lịch
sử — Kafka **có thể vẫn chạy được**, nhưng bạn nên đọc `03-when-not-to-use-kafka.md` trước khi quyết định.

## 🧩 6 nhóm use case Kafka giải quyết tốt

### 1. Event-driven architecture
Các service publish event khi có việc gì đó xảy ra ("OrderCreated", "PaymentFailed"), các service khác tự lắng
nghe và phản ứng — không có service nào gọi trực tiếp service nào. Kafka phù hợp vì **producer không cần biết
consumer nào tồn tại**, giúp thêm/bớt service không đòi hỏi đổi code ở nơi phát sinh sự kiện.

### 2. Async decoupling ở quy mô lớn
Khác với queue đơn giản (1 producer, thường 1-vài consumer), khi số lượng consumer độc lập và throughput đều
lớn, Kafka cho phép decoupling **mà vẫn giữ được thứ tự cần thiết** (trong partition) và khả năng scale đọc theo
chiều ngang (nhiều consumer instance trong 1 group).

### 3. Audit log / event sourcing
Vì dữ liệu là log bất biến, có thứ tự, Kafka tự nhiên phù hợp để lưu **lịch sử đầy đủ các thay đổi** — nền tảng
cho event sourcing, nơi trạng thái hiện tại được suy ra từ việc replay toàn bộ event, thay vì chỉ lưu trạng thái
cuối cùng.

### 4. Stream processing
Khi cần xử lý dữ liệu **liên tục** (tính tổng chạy, phát hiện bất thường real-time, join nhiều stream với nhau)
thay vì xử lý theo batch định kỳ, Kafka + Kafka Streams/ksqlDB (xem `../04-ecosystem/`) cung cấp nền tảng cho
việc này mà không cần tự xây dựng cơ chế theo dõi trạng thái đọc.

### 5. CDC (Change Data Capture) / data pipeline
Khi cần đồng bộ thay đổi từ database sang nhiều hệ thống đích (data warehouse, search index, cache) mà không
muốn mỗi hệ thống đích tự poll database, Kafka (kết hợp Debezium — xem `../04-ecosystem/05-debezium-cdc.md`)
đóng vai trò lớp trung gian phát tán thay đổi một cách đáng tin cậy và có thứ tự.

### 6. Fan-out cho nhiều downstream consumers + khả năng replay
Khi cùng một luồng dữ liệu cần được nhiều hệ thống tiêu thụ **độc lập, ở tốc độ khác nhau**, và có khả năng một
consumer mới xuất hiện sau này cần "bắt kịp" toàn bộ lịch sử — đây là use case mà log abstraction (không phải
queue) mới giải quyết tự nhiên.

## 📊 Bảng: Use case → vì sao Kafka phù hợp → cái giá phải trả

| Use case | Vì sao Kafka phù hợp | Cái giá phải trả |
|---|---|---|
| Event-driven architecture | Producer/consumer không phụ thuộc lẫn nhau; dễ mở rộng số lượng service lắng nghe | Cần thiết kế schema event ổn định lâu dài (xem `../03-design-and-architecture/04-schema-design-avro-protobuf-json.md`); debug flow khó hơn gọi trực tiếp |
| Async decoupling quy mô lớn | Scale đọc/ghi ngang hàng bằng partition; consumer group song song hóa tự nhiên | Cần hiểu rõ partition strategy để tránh hot partition; vận hành cluster phức tạp hơn queue đơn giản |
| Audit/event log | Dữ liệu bất biến, có thứ tự, tồn tại lâu dài theo retention | Retention dài đồng nghĩa chi phí lưu trữ disk tăng; cần chiến lược compaction hợp lý |
| Stream processing | Xử lý liên tục dựa trên log thay vì batch định kỳ | Cần thêm layer (Kafka Streams/ksqlDB), tăng độ phức tạp vận hành và học tập |
| CDC/data pipeline | Một nguồn thay đổi, nhiều đích tiêu thụ độc lập, đảm bảo thứ tự thay đổi | Cần vận hành thêm Kafka Connect + connector; xử lý schema evolution từ phía database |
| Fan-out + replay | Nhiều consumer group đọc độc lập; consumer mới có thể replay lịch sử | Retention/replay đòi hỏi disk lớn hơn; cần kỷ luật thiết kế event immutable, không mang state tạm thời |

## 🧪 Mini scenarios

**Scenario 1 — Event-driven e-commerce:**
Hệ thống thương mại điện tử có 5 service: `orders`, `billing`, `inventory`, `shipping`, `notification`. Mỗi khi
đơn hàng thay đổi trạng thái, `orders` publish event vào topic `order-events`. Bốn service còn lại là 4 consumer
group độc lập. 6 tháng sau, công ty thêm service `analytics` để tính báo cáo doanh thu real-time — chỉ cần thêm
1 consumer group mới, không đổi gì ở `orders`. ✅ Đây là use case lý tưởng: nhiều consumer độc lập, khả năng mở
rộng không cần đổi producer.

**Scenario 2 — CDC pipeline đồng bộ dữ liệu:**
Một hệ thống có database chính (PostgreSQL) cần đồng bộ dữ liệu sang Elasticsearch (tìm kiếm) và data warehouse
(báo cáo). Thay vì viết 2 job poll database riêng biệt (dễ trễ, dễ trùng lặp, tải thêm cho DB), team dùng
Debezium capture thay đổi từ PostgreSQL, đẩy vào Kafka, rồi 2 connector khác nhau đẩy tiếp vào Elasticsearch và
data warehouse. ✅ Một nguồn thay đổi, nhiều đích tiêu thụ độc lập — đúng thế mạnh của Kafka.

**Scenario 3 — Stream processing phát hiện gian lận:**
Hệ thống thanh toán cần phát hiện giao dịch bất thường trong **thời gian thực** (ví dụ: 5 giao dịch trong 1 phút
từ cùng 1 thẻ ở các địa điểm khác nhau). Dữ liệu giao dịch được đẩy vào topic `transactions`, một Kafka Streams
application join/aggregate theo cửa sổ thời gian (time window) để phát hiện pattern bất thường và publish cảnh
báo vào topic `fraud-alerts`. ✅ Đây là bài toán xử lý liên tục theo thời gian thực — khó làm gọn gàng bằng
batch job định kỳ.

## 🏛️ Architecture interview scenario

> **Câu hỏi:** "Thiết kế hệ thống ghi nhận và xử lý sự kiện người dùng (user activity tracking) cho một nền tảng
> có 10 triệu người dùng hoạt động/ngày, cần phục vụ: dashboard real-time, machine learning pipeline (batch,
> chạy hàng đêm), và hệ thống gửi thông báo (near real-time). Bạn sẽ dùng Kafka ở đâu và vì sao?"

**Hướng phân tích tốt (không phải "đáp án mẫu" để học thuộc):**

1. Xác định rằng có **3 consumer với tốc độ khác nhau hoàn toàn** (real-time dashboard, batch ML, near
   real-time notification) cùng tiêu thụ **một nguồn sự kiện chung** (user activity) → đây chính là dấu hiệu
   kinh điển cho fan-out + đa tốc độ tiêu thụ.
2. Đề xuất: 1 topic `user-activity-events` (hoặc tách theo domain nếu volume rất lớn — xem
   `../03-design-and-architecture/01-topic-design.md`), producer là service ghi nhận activity, 3 consumer group
   độc lập cho 3 hệ thống trên.
3. Chỉ ra trade-off: cần xác định retention đủ dài để ML batch job (chạy hàng đêm) không bị mất dữ liệu nếu job
   trễ; cần partition key hợp lý (ví dụ theo `user_id`) để cân bằng tải mà vẫn giữ thứ tự sự kiện của từng user
   nếu cần.
4. Thể hiện rằng bạn hiểu **Kafka không phải nơi xử lý logic nghiệp vụ** — nó là lớp vận chuyển và lưu trữ sự
   kiện; logic dashboard/ML/notification vẫn nằm ở service tiêu thụ tương ứng.

💡 Điều interviewer thực sự muốn thấy: bạn nhận diện đúng **loại bài toán** (fan-out, đa tốc độ, cần replay cho
ML) dẫn tới Kafka, chứ không phải bạn "biết vẽ sơ đồ có chữ Kafka ở giữa".

## ⚖️ Trade-off tổng quát khi chọn Kafka

Ngay cả khi use case phù hợp, chọn Kafka vẫn là một quyết định có cái giá:

- ✅ Decoupling, replay, fan-out mạnh
  ❌ Chi phí vận hành cluster (broker, monitoring, capacity planning — xem `../05-operations/`) cao hơn hẳn
  queue đơn giản hoặc gọi HTTP trực tiếp.
- ✅ Scale throughput tốt qua partition
  ❌ Partition strategy sai (xem `../03-design-and-architecture/02-partition-strategy.md`) có thể tạo hot
  partition, làm mất đi lợi ích scale.
- ✅ Đảm bảo thứ tự trong partition, hỗ trợ audit trail đáng tin cậy
  ❌ Không có global ordering toàn topic; team phải thiết kế key đúng nếu ordering theo entity là yêu cầu bắt
  buộc.
- ✅ Retention dài cho phép replay
  ❌ Chi phí lưu trữ tăng theo retention; cần cân nhắc compaction/tiering (xem `../02-core-internals/` và
  `../05-operations/01-capacity-planning.md`).

## ❌ Common mistakes khi đánh giá "có nên dùng Kafka"

| Sai lầm | Vì sao dễ mắc | Hậu quả |
|---|---|---|
| Chọn Kafka vì "công ty lớn nào cũng dùng Kafka" | Hiệu ứng đám đông, muốn CV đẹp | Chọn công cụ không khớp bài toán, tốn chi phí vận hành không cần thiết |
| Chỉ nhìn throughput mà bỏ qua số lượng consumer độc lập | Throughput là con số dễ đo, "số consumer" bị xem nhẹ | Bỏ lỡ trường hợp 1 producer/1 consumer tốc độ cao — RabbitMQ/SQS có thể đơn giản và rẻ hơn |
| Không hỏi "có cần replay không" trước khi chọn | Replay là tính năng dễ bị coi là "extra", không phải yêu cầu ban đầu | Thiết kế retention/compaction sai ngay từ đầu, phải sửa lại tốn kém sau này |

## ✅ Key takeaways

- Kafka phù hợp nhất khi có **nhiều consumer độc lập, tốc độ tiêu thụ khác nhau, và/hoặc cần replay**.
- 6 nhóm use case mạnh: event-driven architecture, async decoupling quy mô lớn, audit/event log, stream
  processing, CDC/data pipeline, fan-out + replay.
- Ngay cả khi use case phù hợp, vẫn phải trả giá bằng độ phức tạp vận hành — "phù hợp" không có nghĩa là "miễn
  phí".
- Khi phân tích architecture interview, điều quan trọng là nhận diện đúng **loại bài toán** dẫn tới Kafka, không
  phải chỉ vẽ sơ đồ có Kafka ở giữa.

## 🔗 Xem tiếp / Liên kết liên quan

- Tiếp theo: [`03-when-not-to-use-kafka.md`](03-when-not-to-use-kafka.md) — mặt còn lại của quyết định: khi nào
  Kafka là lựa chọn tồi.
- [`01-what-is-kafka.md`](01-what-is-kafka.md) — nền tảng để hiểu vì sao các use case này phù hợp với log
  abstraction.
- `../03-design-and-architecture/` (sẽ mở rộng ở lượt sau) — áp dụng cụ thể các use case này vào thiết kế thật.
- `../07-patterns-and-anti-patterns/` (sẽ mở rộng ở lượt sau) — pattern kiến trúc chi tiết hơn cho từng use case.
