
# SUBQUERY trong SQL

## 1. SUBQUERY là gì?
`SUBQUERY` là truy vấn lồng bên trong một truy vấn khác, thường được dùng để thực hiện các phép tính phức tạp hoặc lọc dữ liệu.

## 2. Cú pháp SUBQUERY
```sql
SELECT column_name(s)
FROM table_name
WHERE column_name OPERATOR (SELECT column_name FROM another_table);
```

- `SUBQUERY` được đặt trong dấu ngoặc đơn và có thể trả về một giá trị hoặc nhiều giá trị.
- `OPERATOR` có thể là các toán tử như `=`, `>`, `IN`, `EXISTS`,...

## 3. Ví dụ về SUBQUERY
Giả sử bạn có bảng `orders` và bạn muốn tìm tất cả các khách hàng đã đặt đơn hàng có giá trị lớn hơn giá trị trung bình.

```sql
SELECT customer_id
FROM orders
WHERE amount > (SELECT AVG(amount) FROM orders);
```

Truy vấn này sẽ tìm tất cả các khách hàng có giá trị đơn hàng lớn hơn giá trị trung bình của tất cả các đơn hàng.
