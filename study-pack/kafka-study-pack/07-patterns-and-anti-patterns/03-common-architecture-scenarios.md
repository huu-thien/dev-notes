# Common Architecture Scenarios

## 🎯 Mục tiêu học

Sau khi đọc xong, bạn sẽ:
- Thấy được cách **map 1 scenario kiến trúc thực tế → pattern nên chọn → anti-pattern cần tránh**, tổng hợp
  toàn bộ kiến thức từ các phần trước vào tình huống cụ thể.
- Biết **requirement** thực sự đứng sau mỗi loại kiến trúc phổ biến, không chỉ tên gọi.
- Có danh sách **key design decisions** và **điều cần theo dõi ở production** cho từng scenario.

## 📖 Mục lục

- [Event-driven microservices backbone](#-event-driven-microservices-backbone)
- [CDC-based data sync](#-cdc-based-data-sync)
- [Search/index sync](#-searchindex-sync)
- [Analytics/event lake ingestion](#-analyticsevent-lake-ingestion)
- [Notification fan-out](#-notification-fan-out)
- [Payment/order/account per-entity ordering](#-paymentorderaccount-per-entity-ordering)
- [Stream enrichment pipeline](#-stream-enrichment-pipeline)
- [🎤 Interview lens](#-interview-lens)
- [✅ Key takeaways](#-key-takeaways)
- [🔗 Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 🏗️ Event-driven microservices backbone

**Requirement:** nhiều service độc lập cần biết về sự kiện xảy ra ở service khác mà không tạo dependency runtime
trực tiếp (đồng bộ, đợi phản hồi ngay).

**Recommended patterns:** integration event (không phải command) qua Kafka, event-carried state transfer khi
consumer cần xử lý độc lập, schema versioning discipline để nhiều team không phá vỡ lẫn nhau.

**Dangerous anti-patterns:** event-driven everywhere (ép cả tương tác cần phản hồi tức thời qua async), no
schema governance (nhiều team cùng dùng chung event contract không kiểm soát), generic "events" topic.

**Key design decisions:** topic theo domain nào, key theo entity nào để giữ ordering cần thiết, compatibility
mode cho schema, choreography hay orchestration cho luồng nghiệp vụ nhiều bước — xem
[`../03-design-and-architecture/08-kafka-for-microservices.md`](../03-design-and-architecture/08-kafka-for-microservices.md).

**What to watch in production:** schema compatibility errors khi 1 team deploy thay đổi, consumer lag của các
service phụ thuộc (business impact trực tiếp nếu service downstream chậm nhận event), rebalance churn nếu số
service consumer tăng nhanh.

## 🔄 CDC-based data sync

**Requirement:** đồng bộ thay đổi dữ liệu từ database nguồn sang các hệ thống khác (cache, search, service
khác) mà không cần polling định kỳ hoặc sửa code ứng dụng nguồn.

**Recommended patterns:** Debezium/CDC cho đồng bộ nội bộ, outbox pattern nếu cần business event có ngữ nghĩa
rõ ràng cho consumer bên ngoài, xử lý tường minh tombstone event.

**Dangerous anti-patterns:** CDC row change bị hiểu nhầm là business event (dùng trực tiếp CDC event cho
consumer bên ngoài mà không qua outbox), không xử lý snapshot lớn gây sốc hệ thống downstream, downstream
không idempotent trong khi tin CDC "sạch tuyệt đối".

**Key design decisions:** snapshot strategy khi khởi tạo connector lần đầu, schema evolution của table nguồn
ảnh hưởng thế nào tới consumer, ranh giới rõ ràng giữa "đồng bộ dữ liệu nội bộ" và "business event công khai" —
xem [`../04-ecosystem/05-debezium-cdc.md`](../04-ecosystem/05-debezium-cdc.md).

**What to watch in production:** connector lag (khoảng cách giữa thay đổi ở DB và event xuất hiện ở Kafka),
schema drift khi table nguồn thay đổi, tần suất tombstone event và cách downstream xử lý chúng.

## 🔍 Search/index sync

**Requirement:** giữ search index (Elasticsearch, OpenSearch...) đồng bộ với dữ liệu nguồn gần thời gian thực,
mà không phải reindex toàn bộ định kỳ.

**Recommended patterns:** Kafka Connect sink connector cho Elasticsearch, CDC làm nguồn event nếu đồng bộ từ
database, idempotent write ở tầng sink (dùng document ID ổn định để tránh trùng khi retry).

**Dangerous anti-patterns:** coi connector là black box không giám sát (không phát hiện lag hoặc lỗi write vào
index), nhồi transformation phức tạp vào SMT thay vì xử lý ở tầng ứng dụng phù hợp hơn — xem
[`../04-ecosystem/01-kafka-connect.md`](../04-ecosystem/01-kafka-connect.md).

**Key design decisions:** dùng document ID nào để write idempotent, xử lý delete/tombstone thế nào để xoá khỏi
index đúng lúc, retry/error handling khi write vào search engine thất bại tạm thời.

**What to watch in production:** connector lag riêng biệt với consumer lag thông thường, tỉ lệ lỗi write vào
search engine, độ trễ giữa thay đổi ở nguồn và khi search index phản ánh thay đổi đó.

## 📊 Analytics/event lake ingestion

**Requirement:** thu thập toàn bộ event vào data lake/warehouse để phân tích lịch sử, không cần thời gian thực
chặt chẽ như các use case operational khác.

**Recommended patterns:** Kafka Connect sink connector cho object storage/warehouse, derived topics nếu cần
enrichment trước khi ingest, retention/compaction phù hợp với nhu cầu replay lịch sử.

**Dangerous anti-patterns:** dùng chung topic operational (đã tối ưu cho latency thấp) trực tiếp cho ingestion
khối lượng lớn mà không tách biệt concern, over-partitioning "phòng hờ" cho khối lượng dữ liệu lớn khi chưa đo
throughput thực tế.

**Key design decisions:** retention/replay strategy cho phép phân tích lại dữ liệu lịch sử, format lưu trữ tối
ưu cho truy vấn phân tích (thường khác format tối ưu cho latency thấp ở topic operational), tần suất batch
ingest.

**What to watch in production:** connector lag không ảnh hưởng SLA vận hành (chấp nhận trễ cao hơn nhiều so
với use case operational), storage growth theo thời gian — xem
[`../05-operations/01-capacity-planning.md`](../05-operations/01-capacity-planning.md).

## 📣 Notification fan-out

**Requirement:** 1 sự kiện nghiệp vụ cần kích hoạt nhiều hành động thông báo khác nhau (email, SMS, push
notification, in-app) mà không làm service phát sinh sự kiện phải biết chi tiết từng kênh thông báo.

**Recommended patterns:** integration event mô tả sự kiện đã xảy ra (không phải command "gửi email"), mỗi kênh
thông báo là 1 consumer độc lập tiêu thụ cùng event, idempotent consumer để tránh gửi trùng thông báo khi
retry/duplicate.

**Dangerous anti-patterns:** no idempotency around external side effects (gửi email/SMS trùng khi consumer xử
lý lại sau restart), infinite retries khi 1 kênh thông báo lỗi tạm thời chặn toàn bộ pipeline.

**Key design decisions:** key theo entity nào (user ID thường hợp lý để giữ ordering thông báo cho cùng 1
user), retry/DLQ riêng cho từng kênh thông báo (kênh email lỗi không nên ảnh hưởng kênh push notification).

**What to watch in production:** tỉ lệ gửi trùng thông báo (dấu hiệu thiếu idempotency), DLQ theo từng kênh có
được xử lý định kỳ không.

## 💳 Payment/order/account per-entity ordering

**Requirement:** trạng thái của 1 entity nghiệp vụ (đơn hàng, tài khoản, giao dịch thanh toán) phải được xử lý
đúng thứ tự tuyệt đối trong phạm vi entity đó, nhưng không cần ordering giữa các entity khác nhau.

**Recommended patterns:** per-entity keying (dùng entity ID làm key), idempotent consumer cho side effect liên
quan tới tiền/trạng thái quan trọng, outbox pattern nếu event phải đồng bộ chặt với transaction database.

**Dangerous anti-patterns:** strict global ordering obsession (dùng 1 partition/key cố định cho toàn bộ topic
"cho chắc ordering"), hot partition do 1 entity (ví dụ 1 tài khoản giao dịch rất nhiều) áp đảo traffic.

**Key design decisions:** key chính xác là gì (order ID? account ID? cần cân nhắc entity nào thực sự cần
ordering), xử lý retry/DLQ thế nào mà không phá vỡ ordering của các message hợp lệ khác cùng entity — xem
[`../03-design-and-architecture/06-ordering-vs-scalability-tradeoffs.md`](../03-design-and-architecture/06-ordering-vs-scalability-tradeoffs.md).

**What to watch in production:** hot partition cho entity có traffic bất thường cao, duplicate side effect liên
quan tới tiền (rủi ro nghiệp vụ cao nhất trong toàn bộ pack này).

## 🔬 Stream enrichment pipeline

**Requirement:** nhiều consumer cần cùng 1 dạng dữ liệu đã được join/enrich từ nhiều nguồn khác nhau (ví dụ:
order event join với customer profile để có đầy đủ thông tin trước khi xử lý).

**Recommended patterns:** Kafka Streams/ksqlDB để enrich 1 lần, publish ra derived topic cho nhiều consumer
dùng chung, state store + changelog topic để phục hồi trạng thái an toàn sau failure.

**Dangerous anti-patterns:** derived topic cho use case chỉ có đúng 1 consumer (không cần tách pipeline riêng),
không hiểu chi phí local state/recovery khi dùng Streams cho use case đơn giản chỉ cần transform không trạng
thái — xem [`../04-ecosystem/03-kafka-streams.md`](../04-ecosystem/03-kafka-streams.md).

**Key design decisions:** windowing/join strategy phù hợp với độ trễ dữ liệu chấp nhận được giữa các nguồn, kích
thước state store và chi phí recovery khi rebalance, EOS trong Streams chỉ bảo vệ phạm vi Kafka-to-Kafka (không
bảo vệ side effect ngoài).

**What to watch in production:** thời gian recovery sau khi 1 instance Streams application restart (phụ thuộc
kích thước state cần rebuild từ changelog topic), lag của derived topic so với topic nguồn.

## 🎤 Interview lens

**"Bạn thiết kế hệ thống notification fan-out cho 1 sự kiện đặt hàng như thế nào?"**
> Câu trả lời tốt cần đi qua đủ các lớp: producer publish integration event (`OrderPlaced`, không phải command
> "gửi email"), mỗi kênh thông báo là consumer riêng, key theo user ID để giữ ordering thông báo cho cùng 1
> user, và **quan trọng nhất** — idempotent consumer để tránh gửi trùng khi có retry/rebalance.

**"CDC và event-driven architecture khác nhau ở điểm nào khi thiết kế hệ thống?"**
> Câu trả lời tốt cần phân biệt: CDC phản ánh **row-level change** ở database (mang tính kỹ thuật, gắn với cấu
> trúc bảng), còn business event mang **ngữ nghĩa nghiệp vụ** rõ ràng — CDC phù hợp cho đồng bộ nội bộ (cache,
> search), business event (qua outbox) phù hợp cho consumer bên ngoài cần hiểu ý nghĩa nghiệp vụ.

## ✅ Key takeaways

- Mỗi scenario kiến trúc có **requirement riêng biệt** quyết định pattern nào phù hợp — không có 1 công thức
  chung cho mọi trường hợp dùng Kafka.
- Anti-pattern nguy hiểm nhất khác nhau tuỳ scenario: event-driven everywhere nguy hiểm cho microservices
  backbone, nhưng over-partitioning nguy hiểm hơn cho analytics ingestion.
- "What to watch in production" luôn nên được xác định **trước khi go-live**, không phải đợi có sự cố mới nghĩ
  ra cần theo dõi gì.

## 🔗 Xem tiếp / Liên kết liên quan

- [`01-good-patterns.md`](01-good-patterns.md) — chi tiết từng pattern được nhắc trong các scenario trên.
- [`02-anti-patterns.md`](02-anti-patterns.md) — chi tiết từng anti-pattern cần tránh.
- [`../03-design-and-architecture/README.md`](../03-design-and-architecture/README.md) — nguyên tắc thiết kế
  nền tảng đứng sau các quyết định trong từng scenario.
- [`README.md`](README.md) — quay lại tổng quan phần Patterns and Anti-patterns.
