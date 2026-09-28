# 04 — Ecosystem

## 🎯 Mục tiêu học
Phần này trả lời: sau khi đã hiểu Kafka core (broker, partition, replication, exactly-once — xem
[`../02-core-internals`](../02-core-internals)) và biết cách thiết kế hệ thống dùng Kafka
([`../03-design-and-architecture`](../03-design-and-architecture)), **hệ sinh thái xung quanh Kafka giải quyết
bài toán gì**, và quan trọng hơn — **khi nào nên dùng, khi nào không nên**.

Đây **không phải** phần liệt kê "Kafka có những tool gì" kiểu catalog/brochure. Mỗi file đều phải trả lời rõ:
bài toán thực sự component đó giải quyết, giới hạn, trade-off, anti-pattern, và operational burden thật khi vận
hành production.

## 🧠 Vì sao ecosystem quan trọng sau khi đã hiểu internals/design

Hiểu broker internals và design nguyên tắc (topic, partition, key, schema, ordering) cho bạn nền tảng để
**thiết kế đúng** một hệ thống dùng Kafka. Nhưng thực tế, rất ít team tự viết producer/consumer thuần cho mọi
nhu cầu tích hợp — phần lớn hệ thống production dùng ít nhất 1 trong 5 thành phần ở đây:

- **Kafka Connect** — thay vì tự viết code đưa dữ liệu vào/ra Kafka cho mỗi hệ thống ngoài.
- **Schema Registry** — thay vì hy vọng producer/consumer "tự đồng bộ" cấu trúc dữ liệu với nhau.
- **Kafka Streams / ksqlDB** — thay vì tự xây dựng hạ tầng quản lý state cho xử lý có trạng thái.
- **Debezium/CDC** — thay vì polling database định kỳ để phát hiện thay đổi.

📌 Vấn đề thực tế không phải "biết các tool này tồn tại", mà là **biết ranh giới**: mỗi component đều rất hấp
dẫn để dùng cho mọi việc, nhưng đều có giới hạn rõ ràng và dễ bị lạm dụng (business logic nhét vào SMT, pipeline
phức tạp nhét vào ksqlDB, CDC dùng thay business event...). Phần ecosystem này tồn tại để bạn tránh đúng những
sai lầm phổ biến đó.

## 📚 Thứ tự đọc đề xuất

1. [`01-kafka-connect.md`](01-kafka-connect.md) — nền tảng cho việc tích hợp dữ liệu vào/ra Kafka; Debezium (bài
   5) cũng chạy trên nền Connect, nên đọc file này trước.
2. [`02-schema-registry.md`](02-schema-registry.md) — schema governance là mối quan tâm xuyên suốt mọi thành
   phần khác trong ecosystem.
3. [`03-kafka-streams.md`](03-kafka-streams.md) — nền tảng xử lý stream có trạng thái.
4. [`04-ksqldb.md`](04-ksqldb.md) — lớp SQL đặt trên Kafka Streams, nên đọc sau khi đã hiểu Streams.
5. [`05-debezium-cdc.md`](05-debezium-cdc.md) — kết hợp Connect + Schema Registry, nên đọc sau cùng để thấy rõ
   cách các thành phần trước liên kết với nhau trong 1 use case thực tế.

## 🧱 File nào là xương sống

**`02-schema-registry.md`** — vì schema là hợp đồng xuyên suốt mọi thành phần khác: Connect serialize/
deserialize qua registry, Streams/ksqlDB xử lý dữ liệu tuân theo schema, CDC event cũng cần schema governance
khi DDL nguồn thay đổi. Hiểu sai schema evolution là nguyên nhân phổ biến nhất gây lỗi production trong hệ event
(xem thêm `../06-troubleshooting/README.md` khi được mở rộng).

## ⏱️ Nếu chỉ có ít thời gian, nên đọc gì trước

Đọc **`01-kafka-connect.md`** và **`02-schema-registry.md`** trước tiên. Lý do: đây là 2 thành phần có xác suất
cao nhất bạn sẽ chạm vào trong bất kỳ hệ thống Kafka production nào (tích hợp dữ liệu + schema governance), và
là nền tảng để hiểu 3 file còn lại (Streams/ksqlDB/Debezium đều dựa trên hoặc tương tác chặt với Connect và
Schema Registry).

## 🔗 Điều hướng
- ⬅️ Trước: [`../03-design-and-architecture/README.md`](../03-design-and-architecture/README.md)
- ➡️ Sau: [`../05-operations/README.md`](../05-operations/README.md)

## Trạng thái nội dung
✅ Đã có lesson content chi tiết cho toàn bộ 5 file (01-05) — xem [`../GENERATION-PLAN.md`](../GENERATION-PLAN.md)
(Lượt 5 — hoàn thành).
