# 10 — Troubleshooting & Anti-Patterns

## 📌 Học gì ở đây?

Luyện tư duy điều tra sự cố production theo evidence thực tế: bắt đầu từ triệu chứng, đưa ra nhiều giả thuyết, thu thập bằng chứng từ catalog/log/EXPLAIN, rồi mới kết luận nguyên nhân và khắc phục — thay vì đoán mò hoặc áp dụng "chữa cháy" mặc định.

## 📋 Thứ tự đọc

1. `01-slow-query-investigation.md` — playbook tổng quát: từ "API chậm" tới xác định query/plan gây ra.
2. `02-index-not-used.md` — các lý do phổ biến khiến planner bỏ qua index tưởng như "phải dùng".
3. `03-lock-contention.md` — xác định blocker/waiter, đọc `pg_locks`/`pg_stat_activity`.
4. `04-vacuum-bloat-incidents.md` — nhận diện sự cố do autovacuum bị chặn hoặc bloat vượt kiểm soát.
5. `05-replication-lag-incidents.md` — phân biệt nguyên nhân lag do network, do I/O replica, hay do long transaction trên replica.
6. `06-pgbouncer-and-connection-issues.md` — "pool cạn kiệt", lỗi tương thích prepared statement với transaction pooling.
7. `07-common-postgres-anti-patterns.md` — tổng hợp anti-pattern lặp lại xuyên suốt pack ở một nơi để tra cứu nhanh.

## ⭐ File quan trọng nhất

`01-slow-query-investigation.md` là playbook nền tảng; các file còn lại là biến thể chuyên sâu theo từng loại sự cố cụ thể.

## 🔗 Điều hướng

- ⬅️ Trước: [09 — Advanced SQL Patterns](../09-advanced-sql-patterns/README.md)
- ➡️ Sau: [11 — Learning Aids](../11-learning-aids/README.md)
