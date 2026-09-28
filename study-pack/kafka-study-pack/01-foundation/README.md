# 01 — Foundation

## 🎯 Thư mục này dùng để làm gì

Đây là nơi xây **nền tảng khái niệm bắt buộc** trước khi học internals (`02-core-internals`) hay thiết kế hệ
thống (`03-design-and-architecture`). Nếu `00-overview` cho bạn "bức tranh tổng thể", thì `01-foundation` là nơi
từng mảnh ghép của bức tranh đó — topic, partition, offset, broker, replication, producer, consumer, consumer
group, config vận hành, rebalance, ordering, delivery semantics, retention, compaction — được giải thích **đủ
sâu và đủ chính xác** để bạn không còn mơ hồ khi dùng chúng trong thực tế hay khi bị hỏi trong phỏng vấn.

⚠️ Đây không phải phần "học nhanh cho biết" — phần lớn các bug/production incident liên quan tới Kafka đến từ
việc hiểu sai chính những khái niệm nền tảng ở đây (ví dụ: tưởng Kafka đảm bảo ordering toàn topic, tưởng
replication là backup, tưởng exactly-once là mặc định, tưởng `enable.auto.commit=true` là an toàn).

💡 Phần producer/consumer/consumer group (file 04-09) được thiết kế theo hướng **config reasoning** — mỗi
config quan trọng đều phải trả lời: nó giải quyết vấn đề gì, tạo trade-off gì, cấu hình sai thì hỏng kiểu gì.
Đây không phải bảng liệt kê tham số, mà là tài liệu để hiểu **vì sao** hệ thống hành xử như vậy.

## 📚 Thứ tự đọc đề xuất

| # | File | Trả lời câu hỏi gì |
|---|---|---|
| 1 | [`01-events-and-event-streaming.md`](01-events-and-event-streaming.md) | "Event" khác "message"/"command" thông thường ở đâu? |
| 2 | [`02-topics-partitions-offsets.md`](02-topics-partitions-offsets.md) | Đơn vị dữ liệu cốt lõi của Kafka hoạt động ra sao? |
| 3 | [`03-brokers-clusters-replication.md`](03-brokers-clusters-replication.md) | Kafka phân tán dữ liệu và chịu lỗi ra sao (ở mức khái niệm)? |
| 4 | [`04-producers.md`](04-producers.md) | Producer ghi dữ liệu vào Kafka như thế nào, chọn partition ra sao? |
| 5 | [`05-consumers.md`](05-consumers.md) | Consumer đọc dữ liệu như thế nào — vì sao đọc/xử lý/commit là 3 bước tách biệt? |
| 6 | [`06-consumer-groups.md`](06-consumer-groups.md) | Consumer group scale việc đọc dữ liệu ra sao, giới hạn ở đâu? |
| 7 | [`07-producer-configs-and-delivery-behavior.md`](07-producer-configs-and-delivery-behavior.md) | Config nào ở producer quyết định duplicate/loss/ordering/throughput? |
| 8 | [`08-consumer-configs-and-offset-management.md`](08-consumer-configs-and-offset-management.md) | Config nào ở consumer quyết định duplicate/loss, và offset được quản lý ra sao? |
| 9 | [`09-rebalancing-and-group-behavior-basics.md`](09-rebalancing-and-group-behavior-basics.md) | Vì sao rebalance xảy ra, và nó ảnh hưởng hệ thống thế nào? |
| 10 | [`10-ordering-delivery-semantics.md`](10-ordering-delivery-semantics.md) | Kafka đảm bảo (và không đảm bảo) gì về thứ tự/delivery? |
| 11 | [`11-retention-compaction.md`](11-retention-compaction.md) | Dữ liệu tồn tại bao lâu, khi nào bị xoá/nén? |

Đọc đúng thứ tự này vì mỗi file dựa trên khái niệm của file trước — ví dụ bạn cần hiểu partition (file 2) trước
khi hiểu replication (file 3); cần hiểu producer/consumer cơ bản (file 4-6) trước khi đào sâu config (file 7-8);
cần hiểu consumer group (file 6) trước khi hiểu rebalance (file 9); và cần cả producer lẫn consumer config (file
7-8) trước khi tổng hợp lại thành ordering/delivery semantics (file 10).

## 🧱 File nào là "xương sống" của cả thư mục

**[`02-topics-partitions-offsets.md`](02-topics-partitions-offsets.md)** — vì gần như mọi khái niệm khác trong
Kafka (ordering, scaling, consumer group, replication, retention...) đều được định nghĩa **dựa trên** khái niệm
partition. Nếu chỉ có thời gian đọc 1 file trong thư mục này, hãy đọc file này trước.

Đứng thứ hai là bộ ba **[`07-producer-configs-and-delivery-behavior.md`](07-producer-configs-and-delivery-behavior.md)**
và **[`08-consumer-configs-and-offset-management.md`](08-consumer-configs-and-offset-management.md)** — đây là
nơi lý thuyết gặp thực chiến: phần lớn câu hỏi phỏng vấn và phần lớn sự cố production đều xoay quanh các config
này (`acks`, `enable.idempotence`, `enable.auto.commit`, `auto.offset.reset`...).

Đứng thứ ba là **[`10-ordering-delivery-semantics.md`](10-ordering-delivery-semantics.md)** — nơi tổng hợp lại
toàn bộ phần producer/consumer/config thành 3 khái niệm cốt lõi: ordering, delivery semantics, và mối liên hệ
duplicate/loss/reprocessing.

## 🧭 Điều hướng

- ⬅️ Trước: [`../00-overview/README.md`](../00-overview/README.md)
- ➡️ Sau: [`../02-core-internals/README.md`](../02-core-internals/README.md) (sẽ mở rộng ở lượt sau)
- 🔗 Tra cứu thuật ngữ: [`../GLOSSARY.md`](../GLOSSARY.md)

## 📌 Trạng thái nội dung

✅ Hoàn chỉnh — xem `../GENERATION-PLAN.md` (Lượt 2 + Lượt 2.1 refactor, đã tick).
