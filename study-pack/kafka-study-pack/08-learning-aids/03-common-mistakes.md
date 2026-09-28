# Common Mistakes — Sai lầm phổ biến xuyên suốt Kafka

## 🎯 Mục tiêu học
Tổng hợp những hiểu lầm lặp lại nhiều nhất trong toàn bộ pack — không phải để đọc 1 lần mà để tra lại mỗi khi
nghi ngờ bản thân đang nghĩ sai. Mỗi mục có mental model đúng và file gốc để đọc sâu.

## 📖 Mục lục
1. [Nghĩ Kafka chỉ là queue](#1-nghĩ-kafka-chỉ-là-queue)
2. [Nghĩ ordering là global](#2-nghĩ-ordering-là-global)
3. [Nghĩ partition càng nhiều càng tốt](#3-nghĩ-partition-càng-nhiều-càng-tốt)
4. [Nghĩ lag luôn là do consumer yếu](#4-nghĩ-lag-luôn-là-do-consumer-yếu)
5. [Nghĩ idempotent producer giải quyết duplicate toàn hệ thống](#5-nghĩ-idempotent-producer-giải-quyết-duplicate-toàn-hệ-thống)
6. [Nghĩ retention và compaction là cùng một thứ](#6-nghĩ-retention-và-compaction-là-cùng-một-thứ)
7. [Nghĩ replication = backup](#7-nghĩ-replication--backup)
8. [Nghĩ Schema Registry tự cứu mọi breaking change](#8-nghĩ-schema-registry-tự-cứu-mọi-breaking-change)
9. [Nghĩ Kafka Connect thay được mọi custom integration](#9-nghĩ-kafka-connect-thay-được-mọi-custom-integration)
10. [Nghĩ event-driven luôn tốt](#10-nghĩ-event-driven-luôn-tốt)
11. [Nghĩ DLQ là xong việc](#11-nghĩ-dlq-là-xong-việc)
12. [Nghĩ CDC row change = business event](#12-nghĩ-cdc-row-change--business-event)

---

## 1. Nghĩ Kafka chỉ là queue

**Sai ở đâu:** Coi Kafka như RabbitMQ/SQS — message được lấy ra là biến mất, chỉ 1 consumer xử lý 1 message.

**Vì sao dễ nghĩ vậy:** Cách dùng cơ bản nhất (producer → consumer) trông giống hàng đợi truyền thống.

**Hậu quả:** Bỏ lỡ giá trị cốt lõi của Kafka (replay, nhiều consumer group đọc độc lập cùng dữ liệu), hoặc
ngược lại — dùng Kafka cho bài toán thuần queue rồi thấy nó "nặng nề" so với nhu cầu thực.

**Mental model đúng:** Kafka là **log bất biến, có thể đọc lại nhiều lần bởi nhiều consumer group độc lập**.
Consume không xoá dữ liệu — chỉ di chuyển offset của group đó.

📎 Đọc lại: [`00-overview/01-what-is-kafka.md`](../00-overview/01-what-is-kafka.md),
[`03-design-and-architecture/09-kafka-vs-rabbitmq-vs-sqs-pulsar.md`](../03-design-and-architecture/09-kafka-vs-rabbitmq-vs-sqs-pulsar.md)

## 2. Nghĩ ordering là global

**Sai ở đâu:** Giả định message trong 1 topic được xử lý đúng thứ tự đã gửi, bất kể partition nào.

**Vì sao dễ nghĩ vậy:** "Topic" nghe như 1 hàng đợi duy nhất; ordering trong lập trình tuần tự là mặc định
trực giác.

**Hậu quả:** Bug logic khi 2 event liên quan rơi vào 2 partition khác nhau và bị xử lý sai thứ tự — đặc biệt
nguy hiểm với event kiểu "created" rồi "updated" cùng entity.

**Mental model đúng:** Ordering chỉ được đảm bảo **trong 1 partition**. Muốn giữ thứ tự cho 1 entity, phải đảm
bảo mọi event của entity đó luôn đi vào cùng 1 partition (key theo entity ID).

📎 Đọc lại: [`01-foundation/10-ordering-delivery-semantics.md`](../01-foundation/10-ordering-delivery-semantics.md),
[`03-design-and-architecture/06-ordering-vs-scalability-tradeoffs.md`](../03-design-and-architecture/06-ordering-vs-scalability-tradeoffs.md)

## 3. Nghĩ partition càng nhiều càng tốt

**Sai ở đâu:** "Cứ tạo nhiều partition cho chắc, sau này dễ scale."

**Vì sao dễ nghĩ vậy:** Partition gắn với parallelism, nên trực giác "nhiều hơn = nhanh hơn" nghe hợp lý.

**Hậu quả:** Tăng overhead metadata/file handle ở broker, tăng số round-trip khi rebalance, có thể tăng
latency end-to-end (nhiều partition nhỏ → nhiều fetch request nhỏ hơn), và **rất khó giảm lại** sau này.

**Mental model đúng:** Partition count nên xuất phát từ throughput mục tiêu và số consumer muốn scale tới, có
biên độ tăng trưởng hợp lý — không phải con số "cho an toàn".

📎 Đọc lại: [`03-design-and-architecture/02-partition-strategy.md`](../03-design-and-architecture/02-partition-strategy.md),
[`07-patterns-and-anti-patterns/02-anti-patterns.md`](../07-patterns-and-anti-patterns/02-anti-patterns.md)

## 4. Nghĩ lag luôn là do consumer yếu

**Sai ở đâu:** Thấy lag tăng là phản xạ đầu tiên "consumer chậm, cần thêm consumer/tối ưu code".

**Vì sao dễ nghĩ vậy:** Lag hiển thị trên consumer group, nên trực giác quy trách nhiệm cho consumer.

**Hậu quả:** Thêm consumer không giải quyết được nếu nguyên nhân là hot partition, downstream chậm, rebalance
storm, hay burst traffic tạm thời — lãng phí effort và có khi làm tình huống tệ hơn (rebalance thêm).

**Mental model đúng:** Lag là **symptom**, phải phân loại cause family trước: consumer chậm, hot partition,
rebalance, burst traffic, downstream chậm, config poll/fetch không phù hợp, message lớn.

📎 Đọc lại: [`06-troubleshooting/01-high-consumer-lag.md`](../06-troubleshooting/01-high-consumer-lag.md)

## 5. Nghĩ idempotent producer giải quyết duplicate toàn hệ thống

**Sai ở đâu:** Bật `enable.idempotence=true` rồi yên tâm rằng duplicate không còn là vấn đề.

**Vì sao dễ nghĩ vậy:** Tên gọi "idempotent producer" nghe như một giải pháp toàn diện.

**Hậu quả:** Duplicate vẫn xảy ra ở tầng consumer (xử lý lại sau restart, commit timing sai) hoặc ở tầng
side effect (gọi API/ghi DB 2 lần) — idempotent producer chỉ chặn duplicate do **producer retry ở broker**.

**Mental model đúng:** Idempotency phải được thiết kế ở **3 lớp riêng biệt**: producer (đã có sẵn), consumer
(dedup theo offset/key), và side effect/application (upsert thay vì insert, kiểm tra đã xử lý chưa).

📎 Đọc lại: [`02-core-internals/06-exactly-once-idempotence-transactions.md`](../02-core-internals/06-exactly-once-idempotence-transactions.md),
[`06-troubleshooting/03-message-loss-duplicates.md`](../06-troubleshooting/03-message-loss-duplicates.md)

## 6. Nghĩ retention và compaction là cùng một thứ

**Sai ở đâu:** Coi compaction như "một dạng retention dài hơn" hoặc dùng lẫn hai khái niệm.

**Vì sao dễ nghĩ vậy:** Cả hai đều liên quan đến việc "xoá dữ liệu cũ", nên dễ gộp chung tư duy.

**Hậu quả:** Bật compaction cho topic cần giữ **toàn bộ lịch sử event** (audit log) → mất event trung gian vì
compaction chỉ giữ bản ghi mới nhất theo key.

**Mental model đúng:** Retention xoá theo **thời gian/dung lượng, không quan tâm key**. Compaction giữ **bản
ghi mới nhất theo mỗi key, xoá bản cũ hơn cùng key**. Dùng compaction cho "current state" (changelog/KTable),
dùng retention cho "event history".

📎 Đọc lại: [`01-foundation/11-retention-compaction.md`](../01-foundation/11-retention-compaction.md)

## 7. Nghĩ replication = backup

**Sai ở đâu:** Tin rằng replication factor cao (VD: 3) đã đủ để "an toàn dữ liệu" như một chiến lược backup.

**Vì sao dễ nghĩ vậy:** Replication tạo nhiều bản sao dữ liệu, nghe giống mục đích của backup.

**Hậu quả:** Không có phương án khôi phục khi lỗi logic ứng dụng ghi sai dữ liệu, xoá nhầm topic, hoặc dữ liệu
bị corrupt ở tầng producer — replication chỉ replicate **chính xác** cả lỗi đó tới mọi replica.

**Mental model đúng:** Replication chống **mất dữ liệu khi broker/node chết**. Backup chống **lỗi logic, xoá
nhầm, corrupt dữ liệu** — đây là 2 lớp bảo vệ độc lập, không thay thế nhau.

📎 Đọc lại: [`02-core-internals/03-replication-isr-leader-election.md`](../02-core-internals/03-replication-isr-leader-election.md),
[`05-operations/05-failures-and-recovery.md`](../05-operations/05-failures-and-recovery.md)

## 8. Nghĩ Schema Registry tự cứu mọi breaking change

**Sai ở đâu:** Coi Schema Registry như "lá chắn tuyệt đối" chống mọi lỗi liên quan tới schema.

**Vì sao dễ nghĩ vậy:** Registry chặn được các thay đổi **không tương thích theo rule kỹ thuật** (xoá field
required, đổi type), tạo cảm giác an toàn toàn diện.

**Hậu quả:** Đổi ý nghĩa business của 1 field (VD: đổi đơn vị tiền tệ, đổi convention giá trị enum) mà không
đổi tên/type field → Registry cho qua vì compatible về mặt kỹ thuật, nhưng phá vỡ logic consumer.

**Mental model đúng:** Schema Registry kiểm soát **compatibility cấu trúc**, không kiểm soát **semantics
nghiệp vụ**. Vẫn cần review/communication khi đổi ý nghĩa dữ liệu, kể cả khi schema "tương thích".

📎 Đọc lại: [`04-ecosystem/02-schema-registry.md`](../04-ecosystem/02-schema-registry.md),
[`06-troubleshooting/06-schema-and-serialization-errors.md`](../06-troubleshooting/06-schema-and-serialization-errors.md)

## 9. Nghĩ Kafka Connect thay được mọi custom integration

**Sai ở đâu:** Cố ép mọi bài toán tích hợp vào Kafka Connect + SMT (Single Message Transform), kể cả logic
business phức tạp.

**Vì sao dễ nghĩ vậy:** Connect giảm effort rõ rệt cho tích hợp chuẩn (DB, S3, Elasticsearch), nên dễ lạm dụng
cho mọi trường hợp.

**Hậu quả:** SMT chain dài trở thành "code ẩn trong config YAML" — khó test, khó debug, khó review như code
thật.

**Mental model đúng:** Kafka Connect tốt cho tích hợp **chuẩn hoá, transform đơn giản**. Logic phức tạp/
business-specific nên là service riêng (consumer/producer tự code) để giữ khả năng test và review.

📎 Đọc lại: [`04-ecosystem/01-kafka-connect.md`](../04-ecosystem/01-kafka-connect.md)

## 10. Nghĩ event-driven luôn tốt

**Sai ở đâu:** Áp dụng kiến trúc event-driven cho mọi giao tiếp giữa service, kể cả nơi cần response đồng bộ.

**Vì sao dễ nghĩ vậy:** Event-driven là xu hướng phổ biến, gắn với "scalable" và "decoupled" — nghe như luôn
là lựa chọn cao cấp hơn.

**Hậu quả:** Debug trace khó hơn nhiều (flow bất đồng bộ qua nhiều service), độ trễ end-to-end tăng, và những
nơi thực sự cần request/response đồng bộ (VD: kiểm tra tồn kho trước khi xác nhận đơn) bị ép thành async gây
phức tạp không cần thiết.

**Mental model đúng:** Event-driven phù hợp cho **decoupling và fan-out**, không phù hợp cho mọi giao tiếp.
Nơi cần trả lời ngay, cần transaction chặt — vẫn nên dùng giao tiếp đồng bộ (RPC/HTTP).

📎 Đọc lại: [`03-design-and-architecture/08-kafka-for-microservices.md`](../03-design-and-architecture/08-kafka-for-microservices.md),
[`07-patterns-and-anti-patterns/02-anti-patterns.md`](../07-patterns-and-anti-patterns/02-anti-patterns.md)

## 11. Nghĩ DLQ là xong việc

**Sai ở đâu:** Thêm DLQ để "message lỗi có chỗ đi", coi như vấn đề đã được xử lý.

**Vì sao dễ nghĩ vậy:** DLQ giải quyết ngay vấn đề trước mắt — message lỗi không còn chặn consumer chính.

**Hậu quả:** DLQ trở thành "nghĩa địa message" nếu không ai theo dõi/replay — dữ liệu coi như mất, chỉ là mất
một cách âm thầm, khó phát hiện hơn mất message rõ ràng.

**Mental model đúng:** DLQ chỉ có giá trị khi đi kèm **kế hoạch giám sát và replay rõ ràng** — ai xem, xem khi
nào, replay bằng cách nào. Không có kế hoạch này, DLQ chỉ là expected failure che giấu problem thật.

📎 Đọc lại: [`03-design-and-architecture/07-retry-dlq-idempotency.md`](../03-design-and-architecture/07-retry-dlq-idempotency.md),
[`07-patterns-and-anti-patterns/02-anti-patterns.md`](../07-patterns-and-anti-patterns/02-anti-patterns.md)

## 12. Nghĩ CDC row change = business event

**Sai ở đâu:** Đẩy thẳng row change từ Debezium/CDC ra làm "business event" cho consumer khác dùng trực tiếp.

**Vì sao dễ nghĩ vậy:** CDC cho ra message có vẻ giống event (có before/after, có timestamp), nên dễ coi là
tương đương.

**Hậu quả:** Consumer phải tự suy luận ý nghĩa nghiệp vụ từ thay đổi cột dữ liệu thô — dễ sai khi schema DB đổi,
và business logic bị rò rỉ ra khỏi service sở hữu dữ liệu (ai cũng phải hiểu cấu trúc bảng nội bộ).

**Mental model đúng:** Row change là **sự kiện kỹ thuật ở tầng lưu trữ**, không phải business event. Cần một
lớp enrichment/transform để biến row change thành event có ý nghĩa nghiệp vụ rõ ràng trước khi expose ra ngoài.

📎 Đọc lại: [`04-ecosystem/05-debezium-cdc.md`](../04-ecosystem/05-debezium-cdc.md),
[`07-patterns-and-anti-patterns/02-anti-patterns.md`](../07-patterns-and-anti-patterns/02-anti-patterns.md)

## 🔗 Xem tiếp / Liên kết liên quan
- ⬅️ Về index: [`README.md`](README.md)
- ⬅️ Ra quyết định nhanh: [`02-decision-guide.md`](02-decision-guide.md)
- ➡️ Luyện phỏng vấn: [`04-interview-style-questions.md`](04-interview-style-questions.md)
