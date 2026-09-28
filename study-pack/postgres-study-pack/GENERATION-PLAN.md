# 🗺️ Generation Plan

Kế hoạch sinh nội dung pack theo nhiều prompt/lượt kế tiếp. Mỗi phase tương ứng với một prompt sinh nội dung, đọc và tuân theo `STYLE-GUIDE.md` + `GLOSSARY.md`, và tự chấm bằng `QUALITY-CHECKLIST.md` trước khi coi là hoàn tất.

## Nguyên tắc xuyên phase

- Mỗi phase **phải** dùng lại 3 schema chuẩn đã định nghĩa (xem `00-overview/02-postgres-core-mental-model.md` sau khi được sinh).
- Không phase nào được viết lesson kiểu định nghĩa suông — luôn bắt đầu từ schema + query.
- Cuối mỗi phase, cập nhật lại `README.md` của thư mục tương ứng (danh sách file, thứ tự đọc, liên kết) nếu có thay đổi so với blueprint ban đầu.
- Không phá vỡ cấu trúc thư mục/tên file đã định trong blueprint này trừ khi có lý do kỹ thuật rõ ràng.

## Trình tự các phase

| # | Phase | Thư mục | Nội dung chính cần đạt | Trạng thái |
|---|---|---|---|---|
| 1 | Root & Overview | `00-overview/` | Định nghĩa 3 schema chuẩn đầy đủ (DDL), mental model tổng thể, ranh giới năng lực PostgreSQL | ✅ Hoàn tất |
| 2 | Storage & MVCC | `01-storage-and-mvcc/` | Heap/tuple/page, MVCC version, visibility + vacuum + freeze, WAL/checkpoint/crash recovery, transaction/snapshot | ✅ Hoàn tất |
| 3 | Planner & Execution | `02-query-planner-and-execution/` | Query lifecycle, đọc `EXPLAIN`/`EXPLAIN ANALYZE`, cardinality estimation, join strategy, sort/hash/materialize, CTE/subquery/LATERAL | ✅ Hoàn tất |
| 4 | Indexing | `03-indexing/` | B-tree cơ chế, composite/covering/column order, partial/expression index, GIN/GiST/BRIN/Hash, anti-pattern index | ✅ Hoàn tất |
| 5 | Concurrency & Locking | `04-concurrency-and-locking/` | Isolation level, row/table/advisory lock, deadlock, long transaction, upsert race condition | ✅ Hoàn tất |
| 6 | Maintenance & Bloat | `05-maintenance-and-bloat/` | Autovacuum tuning, đo & xử lý bloat, statistics freshness, fillfactor trade-off | ✅ Hoàn tất |
| 7 | Partitioning | `06-partitioning-and-large-tables/` | Khi nào cần partition, pruning theo query shape, local vs global index, retention/archival | ✅ Hoàn tất |
| 8 | Replication & HA | `07-replication-and-ha/` | Streaming replication/WAL shipping, slot & lag, read-replica consistency caveat, failover, backup/PITR | ✅ Hoàn tất |
| 9 | Connection Management | `08-connection-management/` | Chi phí connection, PgBouncer 3 mode pooling, pool sizing công thức, timeout/retry/backpressure | ✅ Hoàn tất |
| 10 | Advanced SQL Patterns | `09-advanced-sql-patterns/` | Join pattern nâng cao, LATERAL/set-returning, JSONB thực chiến, window function, upsert/MERGE/dedup, pagination/counting | ⬜ Chưa sinh |
| 11 | Troubleshooting & Anti-patterns | `10-troubleshooting-and-anti-patterns/` | 7 playbook điều tra sự cố theo evidence | ⬜ Chưa sinh |
| 12 | Learning Aids | `11-learning-aids/` | Cheatsheet, decision guide, common mistakes, câu hỏi phỏng vấn có đáp án lý luận | ⬜ Chưa sinh |
| 13 | Final Review | toàn bộ pack | Audit link chết, thuật ngữ nhất quán, schema dùng nhất quán, kiểm tra không có lesson nào định nghĩa suông, kiểm tra diagram còn thiếu | ⬜ Chưa thực hiện |

## Quy trình thực hiện mỗi phase

1. Đọc lại `README.md`, `GLOSSARY.md`, `STYLE-GUIDE.md` (root) và `README.md` của thư mục đang sinh.
2. Xác định trước: schema nào dùng, query nào minh họa, plan/diagram nào cần vẽ — **trước khi** viết văn xuôi.
3. Viết đúng danh sách file đã quy hoạch trong blueprint (không tự đổi tên/tự thêm bớt file trừ khi có lý do và ghi chú lại).
4. Đảm bảo mọi rewrite query giữ nguyên semantics (NULL, duplicate, order, pagination).
5. Tự chấm bằng `QUALITY-CHECKLIST.md`.
6. Cập nhật link Previous/Next và mục "file quan trọng nhất" trong README thư mục nếu cần.

## Phase 1 — đã hoàn tất ✅

`00-overview/` đã có đầy đủ 5 file lesson (`00-how-to-use-this-pack.md`, `01-what-makes-postgres-different.md`, `02-postgres-core-mental-model.md`, `03-when-postgres-is-enough.md`, `04-when-postgres-needs-help.md`), cùng DDL đầy đủ của 3 schema chuẩn trong `02-postgres-core-mental-model.md#13-ba-schema-chuẩn-dùng-xuyên-suốt-pack`. `README.md` gốc và `00-overview/README.md` đã được cập nhật để phản ánh trạng thái này.

## Phase 2 — đã hoàn tất ✅

`01-storage-and-mvcc/` đã có đầy đủ 5 file lesson (`01-pages-tuples-heap.md`, `02-mvcc-row-versions.md`, `03-visibility-vacuum-freeze.md`, `04-wal-checkpoints-crash-recovery.md`, `05-transactions-and-snapshots.md`), mỗi file tái sử dụng đúng 3 schema chuẩn (chủ yếu `products`/`orders`/`order_items`/`payments`, `tasks`, `processing_jobs`/`events`). `01-storage-and-mvcc/README.md` đã được cập nhật với bảng "đọc gì trước theo mục tiêu".

## Phase 3 — đã hoàn tất ✅

`02-query-planner-and-execution/` đã có đầy đủ 6 file lesson (`01-how-postgres-executes-a-query.md`, `02-explain-explain-analyze.md`, `03-cardinality-estimation-and-statistics.md`, `04-join-strategies.md`, `05-sorting-hashing-materialization.md`, `06-cte-subquery-lateral.md`), mỗi file dùng query thật trên 3 schema chuẩn (orders/order_items/products/payments, tasks/projects/activity_logs, events/processing_jobs). `02-query-planner-and-execution/README.md` đã được cập nhật với thứ tự đọc và "nếu chỉ có ít thời gian".

## Phase 4 — đã hoàn tất ✅

`03-indexing/` đã có đầy đủ 5 file lesson (`01-btree-basics.md`, `02-multicolumn-covering-and-order.md`, `03-partial-expression-and-specialized-indexes.md`, `04-gin-gist-brin-hash-when-to-use.md`, `05-index-anti-patterns.md`), mỗi file dùng query thật trên 3 schema chuẩn, có bảng "predicate/pattern → index shape/fit", diagram leading-column/access-path, và ≥8 anti-pattern sắc bén ở file cuối. `03-indexing/README.md` đã được cập nhật với thứ tự đọc, file xương sống, "nếu chỉ có ít thời gian".

## Phase 5 — đã hoàn tất ✅

`04-concurrency-and-locking/` đã có đầy đủ 5 file lesson (`01-isolation-levels-and-anomalies.md`, `02-row-table-and-advisory-locks.md`, `03-deadlocks-and-lock-waits.md`, `04-long-transactions-and-idle-in-transaction.md`, `05-upserts-race-conditions-and-safe-concurrency-patterns.md`), dùng custom section headers theo yêu cầu riêng phase này (`Mental model`/`What actually happens`/`Transaction timeline`/`Failure modes`/`Debugging hints`/`Safe patterns`/`Interview lens`/`Why this matters in production`), mỗi file có transaction A/B timeline thật (Mermaid sequence diagram) trên schema chuẩn (`products.stock`, `processing_jobs` + `SKIP LOCKED`, `accounts` email uniqueness, `payments`/`shipments` idempotency). `04-concurrency-and-locking/README.md` đã được cập nhật với map "anomaly → nguyên nhân → pattern xử lý".

> ⚠️ Lưu ý đặt tên file: tên file thực tế của phase này (`01-isolation-levels-and-anomalies.md`, `02-row-table-and-advisory-locks.md`, `03-deadlocks-and-lock-waits.md`, `04-long-transactions-and-idle-in-transaction.md`, `05-upserts-race-conditions-and-safe-concurrency-patterns.md`) khác nhẹ so với tên gợi ý ban đầu trong blueprint gốc (`01-isolation-levels.md`, `02-row-locks-table-locks-advisory-locks.md`, `03-deadlocks-and-contention.md`, `04-long-transactions-and-their-damage.md`, `05-upsert-race-conditions-and-consistency.md`) — đây là điều chỉnh có chủ đích theo yêu cầu chi tiết hóa của prompt sinh nội dung Phase 5, README của thư mục đã được cập nhật khớp theo tên mới.

## Phase 6 — đã hoàn tất ✅

`05-maintenance-and-bloat/` đã có đầy đủ 5 file lesson (`01-autovacuum-vacuum-analyze-freeze.md`, `02-table-bloat-and-index-bloat.md`, `03-statistics-freshness-and-planner-health.md`, `04-fillfactor-hot-updates-and-write-patterns.md`, `05-safe-maintenance-operations-and-anti-patterns.md`), dùng custom section headers theo yêu cầu riêng phase này (`Mental model`/`What actually happens`/`Symptom -> mechanism`/`Failure modes`/`Debugging hints`/`Safe maintenance patterns`/`Interview lens`/`Why this matters in production`), mỗi file phân biệt rõ reclaim-for-reuse vs shrink-on-disk vs refresh-statistics vs freeze, và nối trực tiếp với MVCC/xid horizon (`01-storage-and-mvcc/`) và long transaction (`04-concurrency-and-locking/04-`). `05-maintenance-and-bloat/README.md` đã được cập nhật với map "symptom → probable maintenance cause".

> ⚠️ Lưu ý đặt tên file: tên file thực tế của phase này (`01-autovacuum-vacuum-analyze-freeze.md`, `02-table-bloat-and-index-bloat.md`, `03-statistics-freshness-and-planner-health.md`, `04-fillfactor-hot-updates-and-write-patterns.md`, `05-safe-maintenance-operations-and-anti-patterns.md`) khác nhẹ so với tên gợi ý ban đầu trong blueprint gốc (`01-autovacuum.md`, `02-bloat-and-table-health.md`, `03-analyze-statistics-freshness.md`, `04-fillfactor-free-space-and-maintenance-tradeoffs.md`) — đây là điều chỉnh có chủ đích (thêm file thứ 5) theo yêu cầu chi tiết hóa của prompt sinh nội dung Phase 6, README của thư mục đã được cập nhật khớp theo tên mới.

## Phase 7 — đã hoàn tất ✅

`06-partitioning-and-large-tables/` đã có đầy đủ 5 file lesson (`01-when-partitioning-helps-and-when-it-does-not.md`, `02-range-list-hash-partitioning.md`, `03-partition-pruning-query-shape-and-index-strategy.md`, `04-retention-archival-and-drop-partition-patterns.md`, `05-partitioning-anti-patterns-and-operational-costs.md`), dùng custom section headers theo yêu cầu riêng phase này (`Mental model`/`What partitioning really buys you`/`Query shape and pruning`/`Failure modes`/`Debugging hints`/`Safe operational patterns`/`Interview lens`/`Why this matters in production`). Trọng tâm: partitioning là quyết định lifecycle/retention/maintenance-isolation, không phải performance mặc định; file 03 (xương sống) chứng minh chi tiết pruning phụ thuộc query shape và vì sao index vẫn bắt buộc trong từng partition; file 04 đối chiếu `DROP/DETACH PARTITION` với mass `DELETE`; file 05 tổng hợp 9 anti-pattern kèm decision tree và cost model matrix. Mọi ví dụ tái dùng `events`/`audit_logs`/`orders`/`activity_logs`/`processing_jobs` đã định nghĩa từ Phase 1, nối tiếp trực tiếp phần "table to do dữ liệu lịch sử tích lũy" ở `05-maintenance-and-bloat/` và liên hệ lại planner (`02-query-planner-and-execution/`) + indexing (`03-indexing/`). `06-partitioning-and-large-tables/README.md` đã được cập nhật với map "problem type → partitioning có giúp không → nghĩ gì trước".

> ⚠️ Lưu ý đặt tên file: tên file thực tế của phase này (`01-when-partitioning-helps-and-when-it-does-not.md`, `02-range-list-hash-partitioning.md`, `03-partition-pruning-query-shape-and-index-strategy.md`, `04-retention-archival-and-drop-partition-patterns.md`, `05-partitioning-anti-patterns-and-operational-costs.md`) khác so với tên gợi ý ban đầu trong blueprint gốc (`01-when-partitioning-helps.md`, `02-partition-pruning-and-query-shape.md`, `03-global-vs-local-index-thinking.md`, `04-retention-archival-and-drop-partition-patterns.md` — chỉ 4 file) — đây là điều chỉnh có chủ đích (tách thêm file range/list/hash riêng và thêm file anti-pattern capstone) theo yêu cầu chi tiết hóa của prompt sinh nội dung Phase 7, README của thư mục đã được cập nhật khớp theo tên mới.

## Phase 8 — đã hoàn tất ✅

`07-replication-and-ha/` đã có đầy đủ 5 file lesson (`01-streaming-replication-and-wal-shipping.md`, `02-replication-lag-slots-and-backpressure.md`, `03-read-replicas-consistency-and-routing.md`, `04-failover-promotion-and-ha-trade-offs.md`, `05-backup-base-backup-and-point-in-time-recovery.md`), dùng custom section headers theo yêu cầu riêng phase này (`Mental model`/`What actually happens`/`Failure modes`/`Debugging hints`/`Safe HA/DR patterns`/`Read consistency caveats`/`Interview lens`/`Why this matters in production`). Trọng tâm: replication là WAL-replay, không phải "đồng bộ real-time"; file 02 (xương sống) tách lag thành 4 giai đoạn send/write/flush/replay và làm rõ replication slot vừa bảo vệ vừa có thể gây phình đĩa primary; file 03 làm rõ read-after-write caveat và routing an toàn (đặc biệt phản ví dụ claim `processing_jobs` từ replica); file 04 phân biệt RPO/RTO, sync/async trade-off, và app behavior sau failover (idempotency); file 05 khẳng định dứt khoát "replication is not backup" và PITR chỉ có giá trị nếu restore được diễn tập. Mọi ví dụ tái dùng `orders`/`payments`/`accounts`/`activity_logs`/`events`/`processing_jobs`/`products.stock` đã định nghĩa từ Phase 1, nối tiếp trực tiếp WAL/checkpoint/redo (`01-storage-and-mvcc/04-`), long-transaction (`04-concurrency-and-locking/04-`), và retention/archival (`06-partitioning-and-large-tables/04-`). `07-replication-and-ha/README.md` đã được cập nhật với map "problem → replica/HA/PITR có giúp không → caveat lớn nhất".

> ⚠️ Lưu ý đặt tên file: tên file thực tế của phase này (`01-streaming-replication-and-wal-shipping.md`, `02-replication-lag-slots-and-backpressure.md`, `03-read-replicas-consistency-and-routing.md`, `04-failover-promotion-and-ha-trade-offs.md`, `05-backup-base-backup-and-point-in-time-recovery.md`) khác nhẹ so với tên gợi ý ban đầu trong blueprint gốc/README cũ (`01-streaming-replication-and-wal-shipping.md`, `02-replication-slots-and-lag.md`, `03-read-replicas-and-consistency-caveats.md`, `04-failover-promotion-and-ha-tradeoffs.md`, `05-backup-restore-pitr.md`) — đây là điều chỉnh có chủ đích theo yêu cầu chi tiết hóa của prompt sinh nội dung Phase 8, README của thư mục đã được cập nhật khớp theo tên mới.

## Phase 9 — đã hoàn tất ✅

`08-connection-management/` đã có đầy đủ 5 file lesson (`01-why-connections-are-expensive-in-postgres.md`, `02-pgbouncer-session-vs-transaction-vs-statement-pooling.md`, `03-pool-sizing-queueing-and-backpressure.md`, `04-prepared-statements-session-state-and-pooling-caveats.md`, `05-failover-timeouts-and-connection-management-anti-patterns.md`), dùng custom section headers theo yêu cầu riêng phase này (`Mental model`/`What actually happens`/`Connection lifecycle`/`Failure modes`/`Debugging hints`/`Safe pooling patterns`/`Interview lens`/`Why this matters in production`). Trọng tâm: pooling chỉ giảm chi phí connection churn và điều tiết concurrency, không chữa query chậm; file 02 (xương sống) làm rõ 3 chế độ pooling PgBouncer và ma trận tương thích với session state; file 03 phân biệt 5 khái niệm (app concurrency/active DB work/idle connections/queued requests/saturated database) qua 3 case thực tế (web API burst, `processing_jobs` worker, dashboard query dài); file 04 chứng minh cụ thể vì sao prepared statement/temp table/advisory lock/SET vỡ dưới transaction pooling; file 05 nối trực tiếp với `07-replication-and-ha/04-failover-promotion-and-ha-trade-offs.md` để xử lý stale connection sau failover, timeout-layer stack, retry storm, và unknown-commit-outcome/idempotency. `08-connection-management/README.md` đã được cập nhật với map "symptom → likely connection/pool issue → what to investigate first".

> ⚠️ Lưu ý đặt tên file: tên file thực tế của phase này (`01-why-connections-are-expensive-in-postgres.md`, `02-pgbouncer-session-vs-transaction-vs-statement-pooling.md`, `03-pool-sizing-queueing-and-backpressure.md`, `04-prepared-statements-session-state-and-pooling-caveats.md`, `05-failover-timeouts-and-connection-management-anti-patterns.md`) khác so với README stub cũ (`01-why-connections-are-expensive.md`, `02-pgbouncer-session-transaction-statement-pooling.md`, `03-app-connection-pool-sizing.md`, `04-timeouts-retries-and-backpressure.md` — chỉ 4 file) — đây là điều chỉnh có chủ đích (tách thêm file prepared-statements/session-state riêng, và tách failover/timeout thành file capstone riêng) theo yêu cầu chi tiết hóa của prompt sinh nội dung Phase 9, README của thư mục đã được cập nhật khớp theo tên mới.

## Prompt kế tiếp nên chạy

> **Phase 10: Advanced SQL Patterns** — Sinh đầy đủ file trong `09-advanced-sql-patterns/`:
> `01-join-patterns.md`, `02-lateral-and-set-returning-patterns.md`, `03-jsonb-practical-usage.md`, `04-window-functions.md`, `05-upsert-merge-dedup-patterns.md`, `06-pagination-and-counting.md`.
> Mỗi file phải tái sử dụng đúng 3 schema đã định nghĩa ở `00-overview/02-postgres-core-mental-model.md`, nối tiếp trực tiếp join strategy/planner (`02-query-planner-and-execution/04-`, `06-`), index shape phù hợp cho từng pattern (`03-indexing/`), race-condition/upsert đã học ở `04-concurrency-and-locking/05-`, và pool/connection behavior khi bàn pagination/report query dài (`08-connection-management/03-`). Cần làm rõ: join pattern nào cần LATERAL mà JOIN thường không diễn đạt được, JSONB nên dùng khi nào (và khi nào KHÔNG nên), window function vs GROUP BY, `MERGE`/`ON CONFLICT` semantics khác nhau ở đâu, và keyset pagination vs offset pagination trade-off thật (kèm bẫy `COUNT(*)` trên bảng lớn).
