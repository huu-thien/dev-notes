
# UNION trong SQL

## 1. UNION là gì?
`UNION` trong SQL dùng để kết hợp kết quả của hai hoặc nhiều truy vấn `SELECT`. Nó loại bỏ các bản ghi trùng lặp và chỉ trả về các giá trị duy nhất.

## 2. Cú pháp UNION
```sql
SELECT column_name(s) FROM table1
UNION
SELECT column_name(s) FROM table2;
```

- Hai hoặc nhiều truy vấn `SELECT` được kết hợp với nhau.
- Các cột của mỗi truy vấn phải tương thích về kiểu dữ liệu và thứ tự.

## 3. Ví dụ về UNION
Giả sử bạn có hai bảng `customers` và `suppliers`, và bạn muốn lấy danh sách tất cả các tên (không trùng lặp).

```sql
SELECT name FROM customers
UNION
SELECT name FROM suppliers;
```

Lệnh này sẽ trả về danh sách các tên từ cả hai bảng mà không có sự trùng lặp.
