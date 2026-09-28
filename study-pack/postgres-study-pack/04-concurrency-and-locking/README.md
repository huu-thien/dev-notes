# 04 — Concurrency & Locking

## 📌 Học gì ở đây?

Đây là phase nối tiếp trực tiếp `01-storage-and-mvcc/`. MVCC giải quyết vấn đề **đọc không bị chặn bởi ghi** — nhưng MVCC **không** loại bỏ nhu cầu lock. Nhiều người hiểu sai: "PostgreSQL dùng MVCC nên không cần lo về lock." Thực tế: **ghi/ghi xung đột vẫn cần lock**, isolation level vẫn quyết định anomaly nào bạn có thể gặp, và long transaction vẫn có thể phá hỏng vacuum/replication dù MVCC hoạt động hoàn hảo.

## 📋 Thứ tự đọc

1. [`01-isolation-levels-and-anomalies.md`](01-isolation-levels-and-anomalies.md) — **file nền tảng**: snapshot semantics thực tế của READ COMMITTED/REPEATABLE READ/SERIALIZABLE, anomaly nào bị chặn ở đâu.
2. [`02-row-table-and-advisory-locks.md`](02-row-table-and-advisory-locks.md) — row lock/table lock/advisory lock, `FOR UPDATE`/`FOR SHARE`/`SKIP LOCKED`.
3. [`03-deadlocks-and-lock-waits.md`](03-deadlocks-and-lock-waits.md) — **file xương sống**: deadlock hình thành thế nào, đọc `pg_locks` ra sao — đây là loại sự cố production phổ biến nhất về concurrency.
4. [`04-long-transactions-and-idle-in-transaction.md`](04-long-transactions-and-idle-in-transaction.md) — vì sao transaction mở lâu là nguồn gốc âm thầm của bloat/replication lag.
5. [`05-upserts-race-conditions-and-safe-concurrency-patterns.md`](05-upserts-race-conditions-and-safe-concurrency-patterns.md) — pattern an toàn thực chiến: upsert, job queue, inventory reservation, idempotency.

## ⭐ File xương sống nhất

[`03-deadlocks-and-lock-waits.md`](03-deadlocks-and-lock-waits.md) — deadlock/lock wait là loại sự cố production phổ biến nhất liên quan tới concurrency, và là câu hỏi phỏng vấn kinh điển để phân biệt người hiểu internals với người chỉ biết cú pháp.

## ⏱️ Nếu chỉ có ít thời gian, đọc gì trước?

1. `03-deadlocks-and-lock-waits.md` — kỹ năng debug production thiết thực nhất.
2. `05-upserts-race-conditions-and-safe-concurrency-patterns.md` — pattern áp dụng ngay vào code.
3. `01-isolation-levels-and-anomalies.md` — nền tảng để hiểu 2 file trên đúng bản chất.

## 🗺️ Map nhanh: anomaly → nguyên nhân → pattern xử lý

| Anomaly / triệu chứng | Nguyên nhân gốc | Đọc file nào |
|---|---|---|
| Đọc lại trong cùng transaction thấy dữ liệu khác lần trước | READ COMMITTED — mỗi statement có snapshot riêng | `01-isolation-levels-and-anomalies.md` |
| Hai transaction cùng update, một bên "biến mất" kết quả | Lost update — cần `SELECT ... FOR UPDATE` hoặc constraint | `02-row-table-and-advisory-locks.md`, `05-upserts-...md` |
| Ứng dụng bị treo giữa chừng, không lỗi, không tiến triển | Đang chờ lock (không phải chậm do I/O) | `03-deadlocks-and-lock-waits.md` |
| Lỗi `deadlock detected` trong log | Hai transaction giữ lock theo thứ tự chéo nhau | `03-deadlocks-and-lock-waits.md` |
| Autovacuum không dọn được dead tuple dù chạy liên tục | Long transaction/idle in transaction giữ snapshot cũ | `04-long-transactions-and-idle-in-transaction.md` |
| Hai request tạo cùng 1 email/order trùng nhau | Race condition read-then-insert không có constraint | `05-upserts-race-conditions-and-safe-concurrency-patterns.md` |

## 🔗 Điều hướng

- ⬅️ Trước: [03 — Indexing](../03-indexing/README.md)
- ➡️ Sau: [05 — Maintenance & Bloat](../05-maintenance-and-bloat/README.md)
