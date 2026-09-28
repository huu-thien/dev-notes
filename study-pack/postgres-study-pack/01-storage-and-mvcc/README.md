# 01 — Storage & MVCC

## 📌 Học gì ở đây?

Đây là **nền tảng quan trọng nhất** của toàn bộ pack, ngay sau `00-overview/`. Mọi chủ đề ở `02-` (planner), `03-` (indexing), `04-` (locking), `05-` (bloat), `07-` (replication) đều giả định bạn đã hiểu: dữ liệu thật sự nằm ở đâu (heap/page/tuple), MVCC tạo phiên bản row như thế nào, visibility quyết định ai thấy gì, vacuum/freeze dọn dẹp ra sao, WAL/checkpoint đảm bảo durability/crash recovery thế nào, và transaction/snapshot ảnh hưởng tới correctness ra sao.

## 📋 Thứ tự đọc

1. [`01-pages-tuples-heap.md`](01-pages-tuples-heap.md) — đơn vị lưu trữ vật lý: page, tuple header, heap layout, `ctid`.
2. [`02-mvcc-row-versions.md`](02-mvcc-row-versions.md) — **file xương sống nhất**: cách `INSERT`/`UPDATE`/`DELETE` tạo/đánh dấu phiên bản tuple, `xmin`/`xmax`, HOT update.
3. [`03-visibility-vacuum-freeze.md`](03-visibility-vacuum-freeze.md) — visibility rule, dead tuple, vacuum, autovacuum, freeze, XID wraparound.
4. [`04-wal-checkpoints-crash-recovery.md`](04-wal-checkpoints-crash-recovery.md) — WAL ghi trước data, checkpoint, crash recovery replay.
5. [`05-transactions-and-snapshots.md`](05-transactions-and-snapshots.md) — transaction boundary, statement-level vs transaction-level snapshot, isolation level ở mức thực dụng.

## ⭐ File xương sống nhất

[`02-mvcc-row-versions.md`](02-mvcc-row-versions.md) — MVCC là cơ chế duy nhất giải thích được gần như mọi hành vi "khó hiểu" ở các phase sau: vì sao Index Only Scan cần visibility map (`03-indexing/`), vì sao vacuum quan trọng (`05-maintenance-and-bloat/`), vì sao lock vẫn cần thiết dù có MVCC (`04-concurrency-and-locking/`).

## 🎯 Đọc gì trước nếu mục tiêu của bạn là...

| Mục tiêu | Đọc kỹ trước | Có thể đọc lướt lần đầu |
|---|---|---|
| **Query tuning** (tối ưu index, đọc EXPLAIN) | `01-`, `02-` (để hiểu vì sao heap fetch tốn chi phí, vì sao Index Only Scan cần visibility map) | `04-` (WAL/crash recovery ít liên quan trực tiếp tới tuning) |
| **Concurrency** (xử lý race condition, thiết kế transaction đúng) | `02-`, `05-` (MVCC + snapshot là nền tảng bắt buộc) | `01-` (chi tiết page layout ít quan trọng hơn ở góc độ này) |
| **Operations** (vận hành, tránh sự cố production) | `03-`, `04-` (vacuum/bloat và WAL/checkpoint là nguồn gốc nhiều sự cố thật) | Có thể đọc `01-`/`02-` ở mức tổng quan nếu đã quen MVCC |

## 🔗 Điều hướng

- ⬅️ Trước: [00 — Overview](../00-overview/README.md)
- ➡️ Sau: [02 — Query Planner & Execution](../02-query-planner-and-execution/README.md)
