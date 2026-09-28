# 06 — Partitioning & Large Tables

## 📌 Học gì ở đây?

Đây là phase nối tiếp trực tiếp `05-maintenance-and-bloat/` — nhiều case ở đó (`processing_jobs` tích lũy job cũ, `events`/`activity_logs` append-heavy) đã được nêu là ứng viên cần "archival hoặc partition". Phase này trả lời chính xác: partitioning giải quyết bài toán **lifecycle dữ liệu** (retention, archival, maintenance isolation, recent-window query) — **không phải** công cụ tăng tốc mặc định cho mọi bảng lớn.

❌ Hiểu lầm phổ biến nhất: "Table lớn thì phải partition để nhanh hơn."

✅ Thực tế: partitioning không tự động chữa stats tệ, query shape tệ, join design tệ, hay chọn sai index — nó chỉ thu hẹp phạm vi tìm kiếm (qua pruning) **khi và chỉ khi** query predicate khớp với partition key, và mang lại lợi ích vận hành rõ rệt nhất ở khâu retention/archival (`DROP`/`DETACH PARTITION` thay vì `DELETE` hàng loạt).

## 📋 Thứ tự đọc

1. [`01-when-partitioning-helps-and-when-it-does-not.md`](01-when-partitioning-helps-and-when-it-does-not.md) — **file định hướng**: dấu hiệu thực sự cần partition, và khi nào vấn đề nằm ở chỗ khác.
2. [`02-range-list-hash-partitioning.md`](02-range-list-hash-partitioning.md) — chọn đúng kiểu partition theo workload (time-based, category, hay spread load).
3. [`03-partition-pruning-query-shape-and-index-strategy.md`](03-partition-pruning-query-shape-and-index-strategy.md) — **file xương sống**: pruning phụ thuộc chặt vào query shape, và partitioned table vẫn cần index đúng.
4. [`04-retention-archival-and-drop-partition-patterns.md`](04-retention-archival-and-drop-partition-patterns.md) — vì sao `DROP`/`DETACH PARTITION` mạnh hơn `DELETE` hàng loạt cho retention/archival.
5. [`05-partitioning-anti-patterns-and-operational-costs.md`](05-partitioning-anti-patterns-and-operational-costs.md) — tổng hợp anti-pattern thực chiến và chi phí vận hành.

## ⭐ File xương sống nhất

[`03-partition-pruning-query-shape-and-index-strategy.md`](03-partition-pruning-query-shape-and-index-strategy.md) — phần lớn lợi ích thực tế (hoặc thất bại) của partitioning phụ thuộc vào việc query có viết đúng để planner pruning được hay không; đây cũng là câu hỏi phỏng vấn kinh điển để phân biệt người hiểu cơ chế với người chỉ biết cú pháp `PARTITION BY`.

## ⏱️ Nếu chỉ có ít thời gian, đọc gì trước?

1. `01-when-partitioning-helps-and-when-it-does-not.md` — tránh quyết định partition sai ngay từ đầu.
2. `03-partition-pruning-query-shape-and-index-strategy.md` — kỹ năng áp dụng ngay khi review query trên bảng đã partition.
3. `05-partitioning-anti-patterns-and-operational-costs.md` — tránh các sai lầm vận hành phổ biến nhất.

## 🗺️ Map nhanh: problem type → partitioning có giúp không → nếu không thì nghĩ gì trước

| Problem type | Partitioning có giúp không? | Nếu không, nên nghĩ gì trước |
|---|---|---|
| Cần xóa hàng trăm triệu dòng dữ liệu cũ định kỳ (`events`, `audit_logs`) | ✅ Có — `DROP`/`DETACH PARTITION` gần như tức thời, không tạo dead tuple hàng loạt | — |
| Query chậm do planner chọn Seq Scan dù có index | ❌ Không trực tiếp | Kiểm tra statistics freshness (`05-maintenance-and-bloat/03-`), thiết kế index (`03-indexing/`) trước |
| Table to do dữ liệu lịch sử tích lũy nhưng query chỉ cần "cửa sổ gần đây" | ✅ Có — recent-window query pruning tới ít partition, phần lớn bảng "lạnh" không bị chạm | — |
| Table to, update/delete rất nhiều trên cùng ít dòng (bloat) | ❌ Không trực tiếp | Đây là vấn đề autovacuum tuning/fillfactor (`05-maintenance-and-bloat/`), không phải partitioning |
| Query không bao giờ filter theo partition key dự kiến (ví dụ chỉ filter `user_id` trong khi định partition theo `created_at`) | ❌ Không — mọi partition đều bị quét | Xem lại partition key có khớp access pattern thật không, hoặc cân nhắc index thay vì partition |
| Cần cô lập maintenance (vacuum/reindex) cho phần dữ liệu "nóng" khỏi phần "lạnh" | ✅ Có — mỗi partition có thống kê/autovacuum riêng | — |

## 🔗 Điều hướng

- ⬅️ Trước: [05 — Maintenance & Bloat](../05-maintenance-and-bloat/README.md)
- ➡️ Sau: [07 — Replication & HA](../07-replication-and-ha/README.md)
