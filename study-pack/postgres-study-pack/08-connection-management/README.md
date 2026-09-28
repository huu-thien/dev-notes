# 08 — Connection Management

## 🎯 Mục tiêu học

Sau phase này bạn phải bỏ được suy nghĩ "connection chỉ là một socket TCP nên rất rẻ" và thay bằng mental model chính xác: mỗi PostgreSQL connection là một **OS process riêng** với chi phí bộ nhớ/CPU/context-switch thật. Bạn phải phân biệt được 5 khái niệm hay bị gộp lẫn: app concurrency, active DB work, open idle connections, queued requests, và database bị saturated — và biết chính xác pooling giải quyết cái nào, không giải quyết cái nào.

## 📌 Vì sao connection management thường bị đánh giá thấp

- "Cứ tăng `max_connections`" là phản xạ phổ biến khi gặp lỗi "too many connections" — mà không hiểu điều đó có thể khiến database **chậm hơn**, không phải nhanh hơn.
- "Lắp PgBouncer vào là xong" bỏ qua việc transaction pooling **phá vỡ ngầm** nhiều giả định của ứng dụng (session state, prepared statement, advisory lock) mà không có lỗi rõ ràng lúc test, chỉ lộ ra dưới tải thật.
- "Pool to hơn luôn an toàn hơn" ngược lại với thực tế: pool quá to có thể **che giấu** tình trạng quá tải cho tới khi database sụp hoàn toàn thay vì báo lỗi sớm và có kiểm soát.
- "Failover là chuyện infra" bỏ qua việc client/app phải tự xử lý stale connection, retry an toàn, và outcome không chắc chắn (đã commit hay chưa) sau khi promotion xảy ra.

## 📋 Thứ tự đọc khuyến nghị

1. [`01-why-connections-are-expensive-in-postgres.md`](01-why-connections-are-expensive-in-postgres.md) — nền tảng: backend-per-connection model, chi phí thật của mỗi connection.
2. [`02-pgbouncer-session-vs-transaction-vs-statement-pooling.md`](02-pgbouncer-session-vs-transaction-vs-statement-pooling.md) — 3 chế độ pooling khác nhau ở đâu, mode nào phù hợp app nào.
3. [`03-pool-sizing-queueing-and-backpressure.md`](03-pool-sizing-queueing-and-backpressure.md) — pool size theo concurrency budget, queue nằm ở đâu.
4. [`04-prepared-statements-session-state-and-pooling-caveats.md`](04-prepared-statements-session-state-and-pooling-caveats.md) — feature nào "vỡ" khi qua transaction pooling.
5. [`05-failover-timeouts-and-connection-management-anti-patterns.md`](05-failover-timeouts-and-connection-management-anti-patterns.md) — timeout layering, retry an toàn, stale connection sau failover.

## ⭐ File xương sống

[`02-pgbouncer-session-vs-transaction-vs-statement-pooling.md`](02-pgbouncer-session-vs-transaction-vs-statement-pooling.md) — mọi caveat về session state (file 04), mọi quyết định sizing (file 03), và mọi hành vi sau failover (file 05) đều bắt nguồn từ việc hiểu đúng cơ chế gán server connection của từng pooling mode.

## ⏱️ Nếu chỉ có ít thời gian

Đọc `01-why-connections-are-expensive-in-postgres.md` và `02-pgbouncer-session-vs-transaction-vs-statement-pooling.md` trước — đây là cặp bài học nền tảng nhất, giải thích vì sao pooling tồn tại và tại sao không phải mode nào cũng "chỉ có lợi".

## 🗺️ Map: symptom → likely connection/pool issue → what to investigate first

| Symptom | Likely connection/pool issue | What to investigate first |
|---|---|---|
| Lỗi "too many connections" liên tục | `max_connections` bị chạm trần do connection churn hoặc thiếu pooling | Đếm connection thực tế đang mở (`pg_stat_activity`), phân biệt active vs idle |
| Database chậm hẳn dưới tải cao dù CPU/disk còn dư | Quá nhiều active backend cùng lúc gây contention (không phải thiếu tài nguyên) | Số lượng backend đang `active` (không phải `idle`) trong `pg_stat_activity` |
| App timeout khi gọi DB nhưng DB có vẻ "rảnh" | Request đang xếp hàng ở tầng pool (pool acquire timeout), chưa chạm tới DB | Log/metric của pool (PgBouncer `SHOW POOLS`) — cột `cl_waiting` |
| Query chạy đúng trên connection trực tiếp nhưng lỗi lạ khi qua PgBouncer | Transaction pooling phá vỡ session state (prepared statement, temp table, `SET`) | Kiểm tra pooling mode đang dùng và feature nào app đang lệ thuộc session |
| Sau failover, hàng loạt request lỗi rồi dồn dập retry | Stale connection tới primary cũ + retry storm không kiểm soát | Log lỗi kết nối quanh thời điểm failover, chính sách retry/backoff hiện tại |
| Tăng pool size nhưng vẫn chậm, đôi khi tệ hơn | Nút thắt thật là query chậm hoặc DB đã saturated, pool to chỉ dồn thêm tải | `pg_stat_activity` xem query nào đang chạy lâu, CPU/IO trên DB server |

## 🔗 Điều hướng

- ⬅️ Trước: [07 — Replication & HA](../07-replication-and-ha/README.md)
- ➡️ Sau: [09 — Advanced SQL Patterns](../09-advanced-sql-patterns/README.md) — sẽ mở rộng ở phần sau.
