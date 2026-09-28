# 📚 PostgreSQL Advanced Study Pack

Bộ tài liệu học PostgreSQL **nâng cao**, dùng cho backend/database engineer muốn:

- Hiểu PostgreSQL hoạt động **bên trong** như thế nào (storage, MVCC, planner, lock, vacuum), không chỉ biết viết SQL.
- Đọc được `EXPLAIN` / `EXPLAIN ANALYZE` và **giải thích được vì sao** planner chọn một plan, không phải đoán.
- Debug production issue thật: query chậm bất thường, index không được dùng, lock contention, bloat, replication lag, connection pool cạn kiệt.
- Thiết kế index, partition, pooling và replication dựa trên **trade-off**, không dựa trên "best practice" mơ hồ.
- Trả lời phỏng vấn backend/database ở mức khá sâu, với lý luận có cơ chế phía sau chứ không phải học thuộc định nghĩa.

> ⚠️ **Đây KHÔNG phải tài liệu nhập môn SQL.** Nếu bạn chưa quen `SELECT/JOIN/GROUP BY/subquery`, hãy học SQL cơ bản trước khi vào pack này.

## 🚧 Trạng thái hiện tại: Phase 1 hoàn tất — `00-overview/` đã có nội dung đầy đủ

`00-overview/` đã được viết đầy đủ, bao gồm mental model cốt lõi và **DDL đầy đủ của 3 schema chuẩn**. Các thư mục `01-` đến `11-` hiện mới có `README.md` index (chưa có lesson chi tiết) — sẽ được sinh dần ở các phase tiếp theo, theo đúng [`GENERATION-PLAN.md`](GENERATION-PLAN.md).

Vì vậy, nếu bạn thấy các thư mục con từ `01-` trở đi mới chỉ có `README.md` mà chưa có bài học đầy đủ — đó là chủ đích, không phải thiếu sót.

## 🎯 Nguyên tắc cốt lõi: example-driven, không phải definition-driven

Toàn bộ pack **bắt buộc** viết theo hướng:

- Có **schema cụ thể** (bảng, cột, khóa) trước khi giải thích khái niệm.
- Có **query SQL thật** gắn với schema đó — không phải query minh họa chung chung.
- Có **execution path / planner reasoning**: `EXPLAIN` sẽ ra plan nào, vì sao, điều kiện gì làm plan đổi.
- Có **diagram** (Mermaid/ASCII) khi cơ chế khó diễn đạt bằng văn xuôi: MVCC visibility, lock wait, join path, WAL → replica, PgBouncer flow.
- Có **anti-pattern** thực tế và cách rewrite lại truy vấn khi phù hợp.

Ví dụ về điều **không được chấp nhận**: "Nested loop join là join giữa hai bảng, mỗi row bảng ngoài quét bảng trong."
Điều **bắt buộc phải có**: ví dụ `orders` join `order_items` theo `order_id`, cho biết khi nào planner chọn nested loop (outer nhỏ + index trên `order_items.order_id`), khi nào planner bỏ nested loop để chuyển sang hash join, kèm `EXPLAIN` minh họa.

## 👤 Đối tượng phù hợp

- Backend engineer 2+ năm kinh nghiệm, đã dùng PostgreSQL trong production nhưng chưa từng đọc kỹ `EXPLAIN` hoặc chưa hiểu vacuum/MVCC.
- Người chuẩn bị phỏng vấn vị trí backend/database có câu hỏi sâu về performance, indexing, locking, replication.
- Người đang gặp sự cố production (query chậm, bloat, lock timeout, replication lag) và cần tài liệu tra cứu có hệ thống.

**Không phù hợp** cho người mới học SQL lần đầu, hoặc người chỉ cần cheatsheet cú pháp.

## 🗺️ Cách học theo thứ tự

1. **[00 — Overview](00-overview/README.md)** — mental model tổng quát, biết pack này dạy gì và không dạy gì.
2. **[01 — Storage & MVCC](01-storage-and-mvcc/README.md)** — nền tảng bắt buộc: tuple, heap, visibility, WAL, vacuum. Mọi phần sau đều dựa vào đây.
3. **[02 — Query Planner & Execution](02-query-planner-and-execution/README.md)** — đọc plan, hiểu cost, cardinality, join strategy.
4. **[03 — Indexing](03-indexing/README.md)** — chọn đúng loại index dựa trên query pattern thật.
5. **[04 — Concurrency & Locking](04-concurrency-and-locking/README.md)** — isolation, lock, deadlock, race condition.
6. **[05 — Maintenance & Bloat](05-maintenance-and-bloat/README.md)** — autovacuum, bloat, statistics.
7. **[06 — Partitioning & Large Tables](06-partitioning-and-large-tables/README.md)** — khi nào partition thực sự giúp.
8. **[07 — Replication & HA](07-replication-and-ha/README.md)** — WAL streaming, lag, failover, backup/PITR.
9. **[08 — Connection Management](08-connection-management/README.md)** — PgBouncer, pool sizing, backpressure.
10. **[09 — Advanced SQL Patterns](09-advanced-sql-patterns/README.md)** — LATERAL, JSONB, window functions, upsert, pagination.
11. **[10 — Troubleshooting & Anti-Patterns](10-troubleshooting-and-anti-patterns/README.md)** — playbook điều tra sự cố thật.
12. **[11 — Learning Aids](11-learning-aids/README.md)** — cheatsheet, decision guide, câu hỏi phỏng vấn.

Bạn có thể học tuần tự (khuyến nghị lần đầu) hoặc nhảy thẳng vào phần cần thiết khi tra cứu (ví dụ đang gặp sự cố lock contention → đọc thẳng `04-concurrency-and-locking/` rồi `10-troubleshooting-and-anti-patterns/`).

## 🧱 Ba schema ví dụ dùng xuyên suốt pack

Toàn bộ ví dụ trong pack (trừ khi nói rõ khác) sẽ dùng lại ba schema sau, để bạn quen thuộc với cấu trúc và tập trung vào cơ chế thay vì phải học schema mới mỗi bài:

### Schema 1 — E-commerce
`users`, `orders`, `order_items`, `products`, `payments`, `shipments`
→ Dùng để minh họa: join nhiều bảng, index trên khóa ngoại, pagination, upsert khi checkout, lock khi cập nhật tồn kho.

### Schema 2 — Multi-tenant SaaS
`tenants`, `accounts`, `projects`, `tasks`, `activity_logs`
→ Dùng để minh họa: composite index có `tenant_id` đứng đầu, partitioning theo tenant hoặc thời gian, row-level access pattern, bloat do update tần suất cao trên `tasks`.

### Schema 3 — Event/log style
`events`, `event_payloads`, `audit_logs`, `processing_jobs`
→ Dùng để minh họa: JSONB trên `event_payloads`, time-based partitioning, append-heavy write pattern, retention/archival, BRIN index.

📌 DDL đầy đủ của ba schema này đã được định nghĩa tại [`00-overview/02-postgres-core-mental-model.md`](00-overview/02-postgres-core-mental-model.md#13-ba-schema-chuẩn-dùng-xuyên-suốt-pack), và mọi lesson từ đây trở đi phải tham chiếu lại đúng cấu trúc này thay vì tự bịa schema mới.

## 📂 Cấu trúc thư mục

```text
postgres-study-pack/
├── README.md                          ← bạn đang ở đây
├── GLOSSARY.md                        ← thuật ngữ chuẩn hóa
├── STYLE-GUIDE.md                     ← quy tắc viết lesson
├── GENERATION-PLAN.md                 ← kế hoạch sinh nội dung theo phase
├── QUALITY-CHECKLIST.md               ← checklist review từng file
├── 00-overview/
├── 01-storage-and-mvcc/
├── 02-query-planner-and-execution/
├── 03-indexing/
├── 04-concurrency-and-locking/
├── 05-maintenance-and-bloat/
├── 06-partitioning-and-large-tables/
├── 07-replication-and-ha/
├── 08-connection-management/
├── 09-advanced-sql-patterns/
├── 10-troubleshooting-and-anti-patterns/
└── 11-learning-aids/
```

## 🔗 Tài liệu blueprint liên quan

- [GLOSSARY.md](GLOSSARY.md) — tra cứu thuật ngữ trước khi đọc lesson.
- [STYLE-GUIDE.md](STYLE-GUIDE.md) — quy tắc bắt buộc khi viết/đánh giá bất kỳ file nào trong pack.
- [GENERATION-PLAN.md](GENERATION-PLAN.md) — lộ trình sinh nội dung, biết prompt tiếp theo nên làm gì.
- [QUALITY-CHECKLIST.md](QUALITY-CHECKLIST.md) — dùng để tự kiểm tra một file lesson đã đạt chuẩn chưa.
