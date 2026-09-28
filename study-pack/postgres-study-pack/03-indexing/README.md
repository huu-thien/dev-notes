# 03 — Indexing

## 📌 Học gì ở đây?

Chọn đúng loại index dựa trên **query pattern thật** — predicate, ordering, selectivity, tần suất update — thay vì thêm index theo cảm tính. Đây là phase nối tiếp trực tiếp `02-query-planner-and-execution/`: bạn đã biết đọc `EXPLAIN`, biết vì sao estimate quan trọng — giờ áp dụng để hiểu **vì sao planner dùng hay bỏ qua một index cụ thể**.

⚠️ **"Có index" chưa đủ.** Một index sai thứ tự cột, sai loại, hoặc không khớp predicate thực tế trong query sẽ **không bao giờ được planner chọn** — và bạn vẫn phải trả chi phí ghi/bảo trì cho nó mỗi ngày.

## 📋 Thứ tự đọc

1. [`01-btree-basics.md`](01-btree-basics.md) — cấu trúc B-tree, cách nó phục vụ equality/range/sort, khi nào Seq Scan vẫn đúng hơn.
2. [`02-multicolumn-covering-and-order.md`](02-multicolumn-covering-and-order.md) — **file xương sống**: composite index, thứ tự cột (leading-column logic), `INCLUDE` cho covering index.
3. [`03-partial-expression-and-specialized-indexes.md`](03-partial-expression-and-specialized-indexes.md) — partial index, expression index và điều kiện để planner match được.
4. [`04-gin-gist-brin-hash-when-to-use.md`](04-gin-gist-brin-hash-when-to-use.md) — so sánh GIN (JSONB/array/fulltext), GiST (range/geometric), BRIN (append-only tương quan vật lý), Hash (equality thuần).
5. [`05-index-anti-patterns.md`](05-index-anti-patterns.md) — tổng hợp sắc bén các sai lầm index kinh điển trong production.

## ⭐ File xương sống nhất

[`02-multicolumn-covering-and-order.md`](02-multicolumn-covering-and-order.md) — sai lầm phổ biến nhất trong thực tế là đặt sai thứ tự cột trong composite index. Hiểu file này đúng nghĩa là hiểu 80% việc index có "ăn" hay không trong production.

## ⏱️ Nếu chỉ có ít thời gian, đọc gì trước?

1. `02-multicolumn-covering-and-order.md` — quyết định thứ tự cột đúng ngay từ đầu.
2. `05-index-anti-patterns.md` — tránh lãng phí tài nguyên ghi và tự tin đọc "index not used" trong production.
3. `01-btree-basics.md` — nền tảng để hiểu 2 file trên.

## 🔗 Điều hướng

- ⬅️ Trước: [02 — Query Planner & Execution](../02-query-planner-and-execution/README.md)
- ➡️ Sau: [04 — Concurrency & Locking](../04-concurrency-and-locking/README.md)
