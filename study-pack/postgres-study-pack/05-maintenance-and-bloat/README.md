# 05 — Maintenance & Bloat

## 📌 Học gì ở đây?

Đây là phase nối tiếp trực tiếp `01-storage-and-mvcc/` (visibility/vacuum/freeze) và `04-concurrency-and-locking/` (long transaction chặn cleanup). Maintenance **không phải "việc của DBA nào đó chạy cron job"** — nó là hệ quả trực tiếp của **cách ứng dụng ghi dữ liệu**: update-heavy table nào, delete pattern nào, transaction dài ở đâu, tất cả quyết định autovacuum có theo kịp hay không, và statistics có đủ tươi để planner ra quyết định đúng hay không.

❌ Hiểu lầm phổ biến nhất: "Autovacuum là đủ, không cần hiểu gì thêm — cứ để mặc định chạy."

✅ Thực tế: autovacuum mặc định được tune cho workload trung bình. Table update/delete rất nhiều (`processing_jobs`, `tasks`, `products.stock`) hoặc có transaction dài chạm vào thường xuyên cần **hiểu cơ chế** để biết khi nào default không đủ, và khi nào một triệu chứng chậm là do bloat/stale-stats chứ không phải do query/index sai.

## 📋 Thứ tự đọc

1. [`01-autovacuum-vacuum-analyze-freeze.md`](01-autovacuum-vacuum-analyze-freeze.md) — **file nền tảng**: VACUUM/ANALYZE/FREEZE khác nhau ở đâu, autovacuum trigger theo threshold nào.
2. [`02-table-bloat-and-index-bloat.md`](02-table-bloat-and-index-bloat.md) — bloat hình thành ra sao, khi nào là vấn đề thật, khi nào chỉ là free space bình thường.
3. [`03-statistics-freshness-and-planner-health.md`](03-statistics-freshness-and-planner-health.md) — stats stale làm planner sai như thế nào — nối trực tiếp với `02-query-planner-and-execution/03-cardinality-estimation-and-statistics.md`.
4. [`04-fillfactor-hot-updates-and-write-patterns.md`](04-fillfactor-hot-updates-and-write-patterns.md) — fillfactor/HOT update ảnh hưởng write amplification thế nào.
5. [`05-safe-maintenance-operations-and-anti-patterns.md`](05-safe-maintenance-operations-and-anti-patterns.md) — **file xương sống thực chiến**: khi nào chạy VACUUM/ANALYZE/REINDEX thủ công, khi nào KHÔNG.

## ⭐ File xương sống nhất

[`05-safe-maintenance-operations-and-anti-patterns.md`](05-safe-maintenance-operations-and-anti-patterns.md) — đây là nơi tổng hợp mọi quyết định thực chiến: điều gì nên làm khi database "chậm dần theo thời gian", điều gì tuyệt đối không nên làm theo phản xạ.

## ⏱️ Nếu chỉ có ít thời gian, đọc gì trước?

1. `01-autovacuum-vacuum-analyze-freeze.md` — nền tảng bắt buộc để hiểu mọi file sau.
2. `05-safe-maintenance-operations-and-anti-patterns.md` — áp dụng ngay vào vận hành production.
3. `02-table-bloat-and-index-bloat.md` — phân biệt "trông to" với "thực sự có vấn đề".

## 🗺️ Map nhanh: symptom → probable maintenance cause

| Symptom | Probable maintenance cause | Đọc file nào |
|---|---|---|
| Query chậm dần theo tuần/tháng dù data logic không tăng nhiều | Table/index bloat tích lũy do update/delete không được vacuum kịp | `02-table-bloat-and-index-bloat.md` |
| Planner chọn Seq Scan dù có index phù hợp, dù trước đó vẫn chọn Index Scan | Statistics stale, cardinality estimate lệch thực tế | `03-statistics-freshness-and-planner-health.md` |
| Table size trên đĩa lớn hơn nhiều so với ước tính dữ liệu logic | Có thể là bloat, có thể chỉ là free space dự phòng (fillfactor) — cần phân biệt | `02-`, `04-` |
| Autovacuum chạy liên tục nhưng `n_dead_tup` không giảm | Long transaction/idle in transaction giữ xid horizon cũ (xem `04-concurrency-and-locking/`) | `01-autovacuum-vacuum-analyze-freeze.md` |
| Cảnh báo `wraparound`/`xid` gần giới hạn | Autovacuum bị chặn freeze quá lâu, hoặc `autovacuum` bị tắt/tune quá yếu | `01-autovacuum-vacuum-analyze-freeze.md` |
| Update rất nhiều nhưng index vẫn phình to nhanh | HOT update bị vô hiệu (đổi cột indexed, hoặc hết chỗ trống trong page) | `04-fillfactor-hot-updates-and-write-patterns.md` |

## 🔗 Điều hướng

- ⬅️ Trước: [04 — Concurrency & Locking](../04-concurrency-and-locking/README.md)
- ➡️ Sau: [06 — Partitioning & Large Tables](../06-partitioning-and-large-tables/README.md)
