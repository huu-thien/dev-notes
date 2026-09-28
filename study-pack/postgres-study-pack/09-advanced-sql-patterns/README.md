# 09 — Advanced SQL Patterns

## 📌 Học gì ở đây?

Áp dụng các pattern SQL nâng cao vào schema nghiệp vụ thực tế: join pattern phức tạp hơn inner/left cơ bản, LATERAL cho bài toán "top N per group", JSONB dùng đúng chỗ, window function cho phân tích theo nhóm, upsert/MERGE/dedup an toàn về concurrency, và pagination/counting hiệu quả ở bảng lớn.

## 📋 Thứ tự đọc

1. `01-join-patterns.md` — semi-join/anti-join qua `EXISTS`/`NOT EXISTS`, self-join, join có điều kiện phức tạp.
2. `02-lateral-and-set-returning-patterns.md` — LATERAL cho "N đơn hàng gần nhất mỗi user", gọi set-returning function theo hàng.
3. `03-jsonb-practical-usage.md` — khi nào dùng JSONB hợp lý, index GIN trên JSONB, truy vấn theo key động.
4. `04-window-functions.md` — `ROW_NUMBER`, `RANK`, running total, so sánh với `GROUP BY`.
5. `05-upsert-merge-dedup-patterns.md` — `INSERT ... ON CONFLICT`, `MERGE`, loại bỏ duplicate an toàn.
6. `06-pagination-and-counting.md` — offset pagination vs keyset pagination, chi phí `COUNT(*)` chính xác trên bảng lớn.

## ⭐ File quan trọng nhất

`01-join-patterns.md`, `02-lateral-and-set-returning-patterns.md` và `06-pagination-and-counting.md` — đây là nhóm pattern xuất hiện thường xuyên nhất trong code review thực tế và trong phỏng vấn.

## 🔗 Điều hướng

- ⬅️ Trước: [08 — Connection Management](../08-connection-management/README.md)
- ➡️ Sau: [10 — Troubleshooting & Anti-Patterns](../10-troubleshooting-and-anti-patterns/README.md)
