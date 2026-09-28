# 02 — Core Internals

## 🎯 Thư mục này học cái gì

Đây là nơi mở "hộp đen" của Kafka: **record thực sự đi vào log như thế nào, được replicate ra sao, consumer đọc
lại bằng cơ chế gì, vì sao rebalance gây pause, storage model giúp Kafka nhanh ra sao, và exactly-once thực chất
giới hạn tới đâu.** Nếu `01-foundation` cho bạn biết "Kafka làm gì", thì thư mục này trả lời "Kafka làm điều đó
**bằng cách nào**" — ở mức cơ chế, không phải mô tả bề mặt.

## ⚠️ Vì sao phần này khó nhưng quan trọng

Phần lớn câu hỏi phỏng vấn senior/staff và phần lớn sự cố production khó chẩn đoán (duplicate xuất hiện dù đã
bật idempotence, lag tăng đột biến không rõ lý do, cluster "unavailable" dù không mất broker nào, rebalance liên
tục dù không có deploy) đều bắt nguồn từ việc hiểu **bề mặt** thay vì hiểu **cơ chế** ở những file này. Ví dụ:
biết "ISR là các replica đồng bộ" là chưa đủ — phải hiểu ISR là **tập hợp động**, và `acks=all` chỉ an toàn tới
mức `min.insync.replicas` được cấu hình đúng.

## 📚 Thứ tự đọc đề xuất

| # | File | Trả lời câu hỏi gì |
|---|---|---|
| 1 | [`01-write-path.md`](01-write-path.md) | Record đi từ producer vào leader log như thế nào, ack theo `acks` ra sao? |
| 2 | [`02-read-path.md`](02-read-path.md) | Consumer poll/fetch/process/commit khác nhau ra sao, vì sao lag sinh ra ở đây? |
| 3 | [`03-replication-isr-leader-election.md`](03-replication-isr-leader-election.md) | ISR thực sự là gì, leader election ảnh hưởng availability/durability ra sao? |
| 4 | [`04-rebalancing.md`](04-rebalancing.md) | Vì sao rebalance pause cả group, "rebalance storm" hình thành thế nào? |
| 5 | [`05-storage-segments-indexes.md`](05-storage-segments-indexes.md) | Log/segment/index trên đĩa hoạt động ra sao, vì sao Kafka đọc/ghi nhanh? |
| 6 | [`06-exactly-once-idempotence-transactions.md`](06-exactly-once-idempotence-transactions.md) | Idempotence, transactions, exactly-once semantics khác nhau và giới hạn ở đâu? |

Đọc đúng thứ tự vì mỗi file dùng lại khái niệm của file trước: cần hiểu write path (1) và read path (2) trước
khi hiểu ISR/leader election (3) ảnh hưởng cả hai như thế nào; cần hiểu read path (2, đặc biệt vai trò `poll()`
với heartbeat) trước khi hiểu rebalancing (4); cần hiểu storage (5) để hiểu vì sao broker append/đọc nhanh ở
bước (1)-(2); và cần cả 5 file trước để hiểu đúng phạm vi của idempotence/transactions/EOS (6) — vì exactly-once
là kết quả kết hợp cơ chế ở write path, read path, và replication.

## 🧱 File nào là "xương sống"

**[`03-replication-isr-leader-election.md`](03-replication-isr-leader-election.md)** — gần như mọi câu hỏi về
"mất dữ liệu", "cluster unavailable", hay "acks=all vẫn mất data" đều bắt nguồn từ hiểu sai phần này. Đây cũng là
file kết nối trực tiếp write path và read path lại với nhau (leader nhận ghi, follower fetch để replicate,
consumer chỉ đọc từ leader).

## 🎤 Nên đọc trước khi phỏng vấn

**[`06-exactly-once-idempotence-transactions.md`](06-exactly-once-idempotence-transactions.md)** — đây là chủ đề
bị đánh tráo khái niệm nhiều nhất trong các buổi phỏng vấn Kafka ("Kafka có exactly-once không?" là câu hỏi kinh
điển mà đa số câu trả lời hời hợt sẽ lộ ngay lỗ hổng kiến thức). Đọc kỹ bảng "Mechanism → Solves what → Does not
solve" trong file đó trước khi vào phỏng vấn.

## 🧭 Điều hướng

- ⬅️ Trước: [`../01-foundation/README.md`](../01-foundation/README.md)
- ➡️ Sau: [`../03-design-and-architecture/README.md`](../03-design-and-architecture/README.md) (sẽ mở rộng ở lượt sau)
- 🔗 Tra cứu thuật ngữ: [`../GLOSSARY.md`](../GLOSSARY.md)

## 📌 Trạng thái nội dung

✅ Hoàn chỉnh — xem `../GENERATION-PLAN.md` (Lượt 3, đã tick).
