# 02 — Query Planner & Execution

## 📌 Học gì ở đây?

Đây là phase **quan trọng nhất cho query tuning thực chiến**. Toàn bộ pack trước (`00-overview/`, `01-storage-and-mvcc/`) xây mental model về nơi dữ liệu nằm và cách MVCC/visibility hoạt động. Phase này trả lời câu hỏi bạn sẽ gặp mỗi ngày khi tối ưu query: **Postgres biến một câu SQL thành kế hoạch thực thi như thế nào, và vì sao nó chọn plan này chứ không phải plan khác.**

Không hiểu phase này thì `03-indexing/` (thêm index đúng chỗ), `04-concurrency-and-locking/` (đọc lock trong EXPLAIN), `06-partitioning-and-large-tables/` (đọc partition pruning) đều chỉ là học vẹt.

## 📋 Thứ tự đọc

1. [`01-how-postgres-executes-a-query.md`](01-how-postgres-executes-a-query.md) — lifecycle parse → rewrite → plan → execute; planner ước lượng, executor mới thật sự chạm dữ liệu.
2. [`02-explain-explain-analyze.md`](02-explain-explain-analyze.md) — **file xương sống**: cách đọc `EXPLAIN`/`EXPLAIN ANALYZE` như một kỹ năng suy luận, không phải học thuộc ký hiệu.
3. [`03-cardinality-estimation-and-statistics.md`](03-cardinality-estimation-and-statistics.md) — vì sao ước lượng số dòng sai là nguyên nhân gốc của phần lớn plan tệ.
4. [`04-join-strategies.md`](04-join-strategies.md) — Nested Loop / Hash Join / Merge Join: dùng khi nào, hỏng khi nào.
5. [`05-sorting-hashing-materialization.md`](05-sorting-hashing-materialization.md) — chi phí ẩn phía sau ORDER BY, GROUP BY, DISTINCT, CTE.
6. [`06-cte-subquery-lateral.md`](06-cte-subquery-lateral.md) — CTE/subquery/LATERAL nhìn từ góc độ planner, không chỉ cú pháp.

## ⭐ File xương sống nhất

[`02-explain-explain-analyze.md`](02-explain-explain-analyze.md) — mọi lý luận ở `03-`, `04-`, `05-` đều quy về việc bạn đọc được `EXPLAIN ANALYZE` và phát hiện chỗ estimate lệch khỏi actual.

## ⏱️ Nếu chỉ có ít thời gian, đọc gì trước?

1. `02-explain-explain-analyze.md` — kỹ năng dùng hàng ngày.
2. `03-cardinality-estimation-and-statistics.md` — nguyên nhân gốc của hầu hết plan tệ.
3. `04-join-strategies.md` — nhận diện join strategy sai trong EXPLAIN.

Phần còn lại (`01-`, `05-`, `06-`) có thể đọc sau khi đã quen thao tác `EXPLAIN` hàng ngày.

## 🔗 Điều hướng

- ⬅️ Trước: [01 — Storage & MVCC](../01-storage-and-mvcc/README.md)
- ➡️ Sau: [03 — Indexing](../03-indexing/README.md)
