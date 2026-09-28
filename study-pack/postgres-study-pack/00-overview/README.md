# 00 — Overview

## 📌 Học gì ở đây?

Xây mental model tổng quát về PostgreSQL trước khi đi sâu vào từng chủ đề kỹ thuật. Phần này định nghĩa **3 schema chuẩn** sẽ được dùng xuyên suốt cả pack, và vẽ ranh giới rõ ràng: PostgreSQL mạnh ở đâu, cần công cụ hỗ trợ ở đâu.

## 📋 Thứ tự đọc

1. [`00-how-to-use-this-pack.md`](00-how-to-use-this-pack.md) — cách khai thác pack hiệu quả theo mục tiêu (query optimization / operations / interview / internals), đọc tuần tự hay tra cứu theo tình huống.
2. [`01-what-makes-postgres-different.md`](01-what-makes-postgres-different.md) — điểm khác biệt cốt lõi so với các RDBMS khác (MVCC implementation, extensibility, planner) và những gì PostgreSQL **không** magic.
3. [`02-postgres-core-mental-model.md`](02-postgres-core-mental-model.md) — **file quan trọng nhất**: định nghĩa đầy đủ DDL của 3 schema chuẩn (e-commerce, multi-tenant SaaS, event/log) + mental model tổng thể query → planner → storage → MVCC → WAL → vacuum → lock → replication → connection.
4. [`03-when-postgres-is-enough.md`](03-when-postgres-is-enough.md) — các workload PostgreSQL xử lý tốt mà không cần thêm hệ thống khác, kèm bảng use case → dấu hiệu sắp chạm giới hạn.
5. [`04-when-postgres-needs-help.md`](04-when-postgres-needs-help.md) — dấu hiệu overreach (khi bị ép làm việc không phù hợp) và công cụ bổ trợ đúng chỗ: cache, search engine, message queue, warehouse.

## ⭐ File quan trọng nhất

[`02-postgres-core-mental-model.md`](02-postgres-core-mental-model.md) — vì mọi lesson ở các thư mục `01-` đến `09-` đều tham chiếu lại schema và mental model được định nghĩa tại đây. Đây cũng là file dài nhất và cần đọc kỹ nhất trong toàn bộ `00-overview/`.

## 🤔 Vì sao overview không nên bị bỏ qua

Overview trong pack này **không phải giới thiệu chung chung** — nó chứa mental model nền tảng (cách một query thực thi qua Parser → Planner → Executor → MVCC visibility) và DDL đầy đủ của 3 schema chuẩn mà toàn bộ pack tái sử dụng. Bỏ qua phần này khiến các bài học sau (indexing, locking, partitioning...) thiếu ngữ cảnh và khó theo dõi hơn nhiều.

## 🔗 Điều hướng

- ⬅️ Trước: [Root README](../README.md)
- ➡️ Sau: [01 — Storage & MVCC](../01-storage-and-mvcc/README.md)
