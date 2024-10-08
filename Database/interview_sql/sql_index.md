
# INDEX trong SQL

## 1. INDEX là gì?
`INDEX` là một cấu trúc dữ liệu được sử dụng để tăng tốc độ truy vấn trong bảng, đặc biệt trên các cột có dữ liệu lớn. INDEX giúp tìm kiếm và truy vấn dữ liệu nhanh hơn.

## 2. Cú pháp INDEX
```sql
CREATE INDEX index_name
ON table_name (column_name);
```

- `index_name`: Tên của chỉ mục (index).
- `table_name`: Bảng mà chỉ mục sẽ được tạo.
- `column_name`: Cột mà chỉ mục sẽ được áp dụng.

## 3. Ví dụ về INDEX
Giả sử bạn có bảng `employees` và muốn tạo index trên cột `last_name` để tăng tốc độ tìm kiếm.

```sql
CREATE INDEX idx_lastname
ON employees (last_name);
```

Khi bạn tìm kiếm theo `last_name`, truy vấn sẽ nhanh hơn nhờ vào chỉ mục.
