# Anti-patterns

## 🎯 Mục tiêu học

Sau khi đọc xong, bạn sẽ:
- Nhận diện được **11 anti-pattern phổ biến nhất** khi dùng Kafka trong production.
- Hiểu **vì sao team dễ rơi vào từng anti-pattern** — phần lớn không phải do thiếu hiểu biết, mà do áp lực
  ngắn hạn hợp lý tại thời điểm quyết định.
- Biết **khi nào hậu quả mới thực sự lộ ra** — nhiều anti-pattern trông vô hại lúc đầu, chỉ gây đau khi scale.
- Có **migration path cụ thể** để sửa, không chỉ biết "đừng làm vậy".

## 📖 Mục lục

- [Topic per consumer](#-topic-per-consumer)
- [Generic "events" topic](#-generic-events-topic)
- [Kafka as primary database](#-kafka-as-primary-database)
- [Infinite retries](#-infinite-retries)
- [DLQ không có replay plan](#-dlq-không-có-replay-plan)
- [No schema governance](#-no-schema-governance)
- [Over-partitioning](#-over-partitioning)
- [Strict global ordering obsession](#-strict-global-ordering-obsession)
- [Event-driven everywhere](#-event-driven-everywhere)
- [CDC row change bị hiểu nhầm là business event](#-cdc-row-change-bị-hiểu-nhầm-là-business-event)
- [No idempotency around external side effects](#-no-idempotency-around-external-side-effects)
- [🎤 Interview lens](#-interview-lens)
- [✅ Key takeaways](#-key-takeaways)
- [🔗 Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 📮 Topic per consumer

**Vì sao team hay rơi vào:** mỗi khi có 1 consumer mới cần dữ liệu hơi khác 1 chút, tạo topic riêng cho
consumer đó có vẻ "an toàn" và không ảnh hưởng ai khác.

**Nó đau ở đâu:** số lượng topic tăng phi tuyến theo số consumer thay vì theo số loại dữ liệu thực sự tồn tại;
producer phải ghi trùng dữ liệu vào nhiều topic (hoặc dùng fan-out phức tạp); mất khả năng coi topic là "nguồn
sự thật duy nhất" cho 1 loại dữ liệu.

**Khi nào mới lộ hậu quả:** khi số consumer tăng lên (10, 20 topic gần giống hệt nhau), và khi cần thay đổi
schema — phải đồng bộ thay đổi ở nhiều topic thay vì 1 nơi duy nhất.

**Cách sửa/migration path:** hợp nhất về topic theo domain/business event (xem
[`../03-design-and-architecture/01-topic-design.md`](../03-design-and-architecture/01-topic-design.md)), để
consumer tự filter/enrich phía họ, hoặc dùng derived topic (Kafka Streams/ksqlDB) nếu thực sự cần biến đổi dữ
liệu khác nhau cho từng nhóm consumer.

## 🌐 Generic "events" topic

**Vì sao team hay rơi vào:** giai đoạn đầu dự án, chưa rõ sẽ có bao nhiêu loại event, nên gộp hết vào 1 topic
`events` cho "đơn giản, linh hoạt".

**Nó đau ở đâu:** consumer phải tự filter loại event mình cần trong hàng loạt event không liên quan, tốn CPU
lãng phí; schema của topic đó thực chất là hợp của rất nhiều schema khác nhau — không consumer nào review nổi
toàn bộ; retention/compaction/access-control không thể áp dụng phù hợp riêng cho từng loại event.

**Khi nào mới lộ hậu quả:** khi số loại event trong topic đó tăng lên và có event nhạy cảm (ví dụ dữ liệu tài
chính) trộn lẫn với event công khai — không thể áp access control khác nhau cho từng loại vì chúng chung 1
topic.

**Cách sửa/migration path:** tách topic theo domain/business event thực sự, dùng naming convention rõ ràng —
xem anti-pattern "topic quá generic" đã bàn ở
[`../03-design-and-architecture/01-topic-design.md`](../03-design-and-architecture/01-topic-design.md).

## 🗄️ Kafka as primary database

**Vì sao team hay rơi vào:** Kafka có retention dài (thậm chí vô hạn với compaction), nên có cảm giác "đã lưu
trữ được lâu dài, không cần database riêng nữa".

**Nó đau ở đâu:** Kafka không hỗ trợ query tuỳ ý (chỉ đọc tuần tự theo offset hoặc theo key với compacted
topic), không có index đa chiều, không có transaction phức tạp như RDBMS — dùng Kafka thay database chính nghĩa
là mất toàn bộ khả năng truy vấn linh hoạt mà ứng dụng cần.

**Khi nào mới lộ hậu quả:** khi cần trả lời câu hỏi nghiệp vụ phức tạp ("tổng doanh thu theo khu vực trong quý
này") mà Kafka không có cách nào query trực tiếp hiệu quả — buộc phải build lại toàn bộ tầng đọc riêng (thường
là chính vì lý do này mà Kafka Streams/ksqlDB hay materialized view tồn tại).

**Cách sửa/migration path:** dùng Kafka làm log sự kiện (event log), materialize dữ liệu vào database/search
index phù hợp cho từng loại truy vấn (CQRS-style) — Kafka là "nguồn sự thật cho sự kiện", không phải "nơi trả
lời mọi câu hỏi truy vấn".

## ♾️ Infinite retries

**Vì sao team hay rơi vào:** muốn "không bao giờ mất message", nên cấu hình retry vô hạn cho mọi lỗi xử lý.

**Nó đau ở đâu:** nếu lỗi là **vĩnh viễn** (poison message, dữ liệu sai định dạng không thể xử lý), retry vô hạn
chặn toàn bộ partition mãi mãi (nếu retry tại chỗ) hoặc tiêu tốn tài nguyên vô ích (nếu retry qua topic riêng
không có giới hạn).

**Khi nào mới lộ hậu quả:** ngay khi gặp 1 poison message đầu tiên — toàn bộ pipeline phía sau message đó bị
kẹt, và không ai nhận ra cho tới khi lag tăng vọt bất thường.

**Cách sửa/migration path:** giới hạn số lần retry rõ ràng, phân biệt lỗi tạm thời và lỗi vĩnh viễn, đẩy lỗi
vĩnh viễn sang DLQ ngay thay vì tiếp tục retry — xem
[`../03-design-and-architecture/07-retry-dlq-idempotency.md`](../03-design-and-architecture/07-retry-dlq-idempotency.md).

## 📭 DLQ không có replay plan

**Vì sao team hay rơi vào:** thiết lập DLQ để "không mất message" khi có lỗi, nhưng dừng lại ở đó — chưa nghĩ
tiếp ai sẽ xử lý message trong DLQ và xử lý như thế nào.

**Nó đau ở đâu:** DLQ trở thành "nghĩa địa message" — dữ liệu tồn tại nhưng không ai động tới, business logic
liên quan tới các message đó không bao giờ hoàn tất.

**Khi nào mới lộ hậu quả:** khi audit hoặc khách hàng phát hiện 1 giao dịch/sự kiện quan trọng "biến mất" —
điều tra ra nó nằm im trong DLQ hàng tháng trời không ai xử lý.

**Cách sửa/migration path:** có quy trình rõ ràng: ai giám sát DLQ, ngưỡng alert khi DLQ có message mới, cách
replay (sau khi sửa nguyên nhân gốc) message từ DLQ trở lại pipeline chính.

## 🚫 No schema governance

**Vì sao team hay rơi vào:** giai đoạn đầu ít team, ít consumer, thay đổi schema tự do không gây vấn đề gì rõ
ràng — nên không đầu tư quy trình governance ngay từ đầu.

**Nó đau ở đâu:** khi số team/consumer tăng, 1 thay đổi schema của 1 team có thể phá vỡ consumer của team khác
mà không ai biết trước — không có cơ chế nào chặn hoặc cảnh báo.

**Khi nào mới lộ hậu quả:** khi hệ thống đã có nhiều team phụ thuộc lẫn nhau qua event contract, và 1 breaking
change được deploy không có review, gây lỗi dây chuyền qua nhiều service — xem
[`../06-troubleshooting/06-schema-and-serialization-errors.md`](../06-troubleshooting/06-schema-and-serialization-errors.md).

**Cách sửa/migration path:** áp dụng Schema Registry với compatibility mode phù hợp, có quy trình review schema
thay đổi như review code — xem
[`../04-ecosystem/02-schema-registry.md`](../04-ecosystem/02-schema-registry.md).

## ➗ Over-partitioning

**Vì sao team hay rơi vào:** nghĩ "càng nhiều partition càng dễ scale sau này", nên tạo topic với số partition
rất lớn ngay từ đầu dù traffic hiện tại nhỏ.

**Nó đau ở đâu:** mỗi partition tạo thêm overhead ở broker (file handle, metadata, replication traffic) — số
lượng partition lớn không cần thiết làm tăng chi phí vận hành cluster mà không mang lại lợi ích parallelism
tương xứng với traffic thực tế.

**Khi nào mới lộ hậu quả:** khi cluster có nhiều topic đều bị over-partition cộng dồn, tổng số partition toàn
cluster vượt ngưỡng khuyến nghị, gây chậm rebalance, chậm controller failover, tăng áp lực metadata — xem
[`../05-operations/02-scaling.md`](../05-operations/02-scaling.md).

**Cách sửa/migration path:** chọn partition count dựa trên throughput mục tiêu và consumer parallelism thực tế
cần có, không dựa trên "phòng hờ tương lai xa" — xem
[`../03-design-and-architecture/02-partition-strategy.md`](../03-design-and-architecture/02-partition-strategy.md).

## 🔗 Strict global ordering obsession

**Vì sao team hay rơi vào:** lo lắng "nếu không giữ ordering tuyệt đối, dữ liệu sẽ sai" — áp dụng ordering
toàn cục (dùng 1 partition duy nhất, hoặc key cố định) cho toàn bộ topic để "chắc chắn an toàn".

**Nó đau ở đâu:** triệt tiêu hoàn toàn khả năng song song hoá — toàn bộ topic chỉ được xử lý bởi 1 consumer duy
nhất tại 1 thời điểm, giới hạn throughput nghiêm trọng dù cluster có bao nhiêu broker/consumer đi nữa.

**Khi nào mới lộ hậu quả:** khi traffic tăng, hệ thống không thể scale được nữa vì bottleneck nằm ở đúng chỗ 1
partition/1 consumer duy nhất — không có cách nào thêm parallelism mà không phá vỡ giả định ordering đã đặt ra.

**Cách sửa/migration path:** xác định lại phạm vi ordering thực sự cần (thường chỉ cần ordering trong phạm vi 1
entity, không cần toàn cục) — xem
[`../03-design-and-architecture/06-ordering-vs-scalability-tradeoffs.md`](../03-design-and-architecture/06-ordering-vs-scalability-tradeoffs.md).

## 🌊 Event-driven everywhere

**Vì sao team hay rơi vào:** sau khi thấy lợi ích của event-driven ở 1 vài use case, áp dụng nó cho **mọi**
tương tác giữa các service, kể cả những nơi cần phản hồi đồng bộ ngay lập tức.

**Nó đau ở đâu:** những tương tác vốn cần request-response đồng bộ (ví dụ: kiểm tra tồn kho trước khi xác nhận
đơn hàng ngay lập tức) bị ép thành async qua Kafka, làm phức tạp hoá logic (cần thêm reply topic, correlation
ID, timeout handling) mà không có lợi ích decoupling tương xứng.

**Khi nào mới lộ hậu quả:** khi cần latency thấp, phản hồi tức thời cho người dùng cuối, nhưng kiến trúc buộc
phải đi qua nhiều bước async không cần thiết — trải nghiệm người dùng bị ảnh hưởng trực tiếp.

**Cách sửa/migration path:** đánh giá lại từng tương tác — chỉ dùng Kafka cho integration event (mô tả sự thật
đã xảy ra) hoặc nơi decoupling thực sự có giá trị; giữ request-response đồng bộ (REST/gRPC) cho tương tác cần
phản hồi ngay — xem
[`../03-design-and-architecture/08-kafka-for-microservices.md`](../03-design-and-architecture/08-kafka-for-microservices.md).

## 🔄 CDC row change bị hiểu nhầm là business event

**Vì sao team hay rơi vào:** CDC (Debezium) tạo ra event mỗi khi có thay đổi ở database, nhìn có vẻ giống
"business event" nên team dùng trực tiếp CDC event làm event nghiệp vụ cho consumer khác.

**Nó đau ở đâu:** row change (ví dụ `UPDATE status = 'shipped'`) không mang đầy đủ ngữ nghĩa nghiệp vụ như 1
event thực sự (`OrderShipped` với đầy đủ context); consumer phải tự suy luận ngược lại "row này thay đổi nghĩa
là gì về mặt nghiệp vụ" — dễ sai và dễ vỡ khi schema bảng thay đổi.

**Khi nào mới lộ hậu quả:** khi table nguồn thay đổi cấu trúc (thêm/xoá cột, đổi kiểu dữ liệu) vì lý do hoàn
toàn nội bộ của service sở hữu database, nhưng làm vỡ mọi consumer đang phụ thuộc trực tiếp vào CDC event —
xem [`../04-ecosystem/05-debezium-cdc.md`](../04-ecosystem/05-debezium-cdc.md).

**Cách sửa/migration path:** dùng CDC cho use case nội bộ (đồng bộ cache, search index, audit) nơi row-level
semantics chấp nhận được; với business event cần ngữ nghĩa rõ ràng cho consumer bên ngoài, dùng outbox pattern
để publish event có cấu trúc nghiệp vụ tường minh thay vì để consumer tự suy luận từ row change.

## 🔓 No idempotency around external side effects

**Vì sao team hay rơi vào:** tin tưởng Kafka "exactly-once" hoặc idempotent producer đã giải quyết đủ vấn đề
duplicate, không thiết kế thêm idempotency cho side effect ngoài Kafka (gọi API thanh toán, gửi email, ghi DB
khác).

**Nó đau ở đâu:** at-least-once delivery (mặc định và phổ biến nhất trong thực tế) nghĩa là consumer **có thể**
xử lý lại cùng 1 message sau khi restart — nếu side effect không idempotent, hậu quả là trừ tiền 2 lần, gửi
email 2 lần, ghi dữ liệu trùng.

**Khi nào mới lộ hậu quả:** khi consumer crash đúng lúc giữa "đã xử lý xong side effect" và "đã commit offset"
— hậu quả không xuất hiện thường xuyên (may mắn hiếm khi crash đúng thời điểm này) nên dễ bị bỏ qua cho tới khi
xảy ra ở production với khách hàng thật.

**Cách sửa/migration path:** thiết kế idempotency key ở tầng ứng dụng cho mọi side effect không tự nhiên
idempotent — xem
[`../06-troubleshooting/03-message-loss-duplicates.md`](../06-troubleshooting/03-message-loss-duplicates.md)
và [`01-good-patterns.md`](01-good-patterns.md#-idempotent-consumer).

## 🎤 Interview lens

**"Bạn đã từng thấy team dùng Kafka sai cách như thế nào?"**
> Câu trả lời tốt nên chọn 1-2 anti-pattern cụ thể (không liệt kê hết cả 11), giải thích rõ **vì sao lúc đầu nó
> có vẻ hợp lý** (áp lực ngắn hạn, thiếu thông tin tại thời điểm quyết định) và **khi nào hậu quả mới lộ ra** —
> thể hiện hiểu biết thực tế hơn là chỉ liệt kê "không nên làm X".

**"Kafka có thể dùng làm database chính không?"**
> Câu trả lời tốt cần phân biệt rõ: Kafka là log sự kiện tuyệt vời (append-only, replay được, retention linh
> hoạt), nhưng thiếu khả năng query đa chiều/index phức tạp mà 1 database thực sự cần — nên dùng kết hợp
> (Kafka làm nguồn sự thật cho sự kiện, materialize vào DB/search phù hợp cho từng loại truy vấn).

## ✅ Key takeaways

- Phần lớn anti-pattern **không phải do thiếu hiểu biết** mà do quyết định hợp lý trong ngắn hạn không tính
  tới chi phí dài hạn khi scale.
- Hậu quả của anti-pattern thường **không lộ ra ngay** — chỉ xuất hiện khi traffic tăng, số team/consumer tăng,
  hoặc gặp đúng edge case hiếm.
- Mỗi anti-pattern đều có migration path cụ thể — không phải "phải viết lại từ đầu", mà thường là áp dụng đúng
  pattern tương ứng ở [`01-good-patterns.md`](01-good-patterns.md).

## 🔗 Xem tiếp / Liên kết liên quan

- [`01-good-patterns.md`](01-good-patterns.md) — pattern đối lập nên áp dụng thay thế.
- [`03-common-architecture-scenarios.md`](03-common-architecture-scenarios.md) — map anti-pattern rủi ro theo
  từng loại scenario kiến trúc.
- [`../06-troubleshooting/README.md`](../06-troubleshooting/README.md) — sự cố thực tế bắt nguồn từ các
  anti-pattern này.
- [`README.md`](README.md) — quay lại tổng quan phần Patterns and Anti-patterns.
