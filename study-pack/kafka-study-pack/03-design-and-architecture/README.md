# 03 — Design and Architecture

## Học được gì ở đây
Áp dụng foundation + internals vào **quyết định thiết kế thực tế**: bao nhiêu partition, key nào, schema format
nào, xử lý retry/DLQ ra sao, và khi nào Kafka là lựa chọn đúng/sai so với broker khác.

## Thứ tự đọc đề xuất
1. `01-topic-design.md` — nguyên tắc đặt tên, gộp/tách topic.
2. `02-partition-strategy.md` — chọn số lượng partition, cách nghĩ về scaling.
3. `03-key-design.md` — key ảnh hưởng ordering và phân bổ tải ra sao.
4. `04-schema-design-avro-protobuf-json.md` — chọn định dạng dữ liệu và schema evolution.
5. `05-message-size-throughput-latency.md` — trade-off giữa kích thước message, batch, latency.
6. `06-ordering-vs-scalability-tradeoffs.md` — trade-off cốt lõi khi thiết kế với Kafka.
7. `07-retry-dlq-idempotency.md` — xử lý lỗi trong luồng xử lý message.
8. `08-kafka-for-microservices.md` — Kafka trong kiến trúc microservices (event-driven).
9. `09-kafka-vs-rabbitmq-vs-sqs-pulsar.md` — so sánh khách quan với broker khác.

## File quan trọng nhất
`06-ordering-vs-scalability-tradeoffs.md` — hầu hết quyết định thiết kế sai đều bắt nguồn từ việc không nắm rõ
trade-off này.

## Vì sao đây là phần quan trọng nhất cho system design/interview

`00-overview` đến `02-core-internals` giúp bạn hiểu **Kafka hoạt động thế nào** ở mức cơ chế. Thư mục này là nơi
kiến thức đó được **chuyển hoá thành quyết định thiết kế thực tế** — đúng những câu hỏi hay gặp nhất trong
phỏng vấn system design và trong review kiến trúc thực tế: nên tạo bao nhiêu topic/partition, chọn key thế nào,
schema evolution ảnh hưởng gì, khi nào ordering phải hy sinh cho scalability, và khi nào Kafka là lựa chọn sai.
Phần lớn lỗi thiết kế Kafka trong production không tới từ việc "không hiểu internals", mà từ việc **không nối
được internals với quyết định thiết kế** — đây chính là khoảng trống mà thư mục này lấp đầy.

## Nếu chỉ có ít thời gian, đọc gì trước

Nếu chỉ đọc được 2 file, đọc theo thứ tự:
1. [`06-ordering-vs-scalability-tradeoffs.md`](06-ordering-vs-scalability-tradeoffs.md) — file xương sống, nền
   tảng tư duy cho mọi quyết định partition/key khác.
2. [`02-partition-strategy.md`](02-partition-strategy.md) — quyết định thực tế bị hỏi nhiều nhất trong cả
   phỏng vấn lẫn thiết kế thật.

## Điều hướng
- ⬅️ Trước: [`../02-core-internals/README.md`](../02-core-internals/README.md)
- ➡️ Sau: [`../04-ecosystem/README.md`](../04-ecosystem/README.md)

## Trạng thái nội dung
✅ Đã hoàn thiện đầy đủ 9 file lesson (Lượt 4) — xem `../GENERATION-PLAN.md`.
