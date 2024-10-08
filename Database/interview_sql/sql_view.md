
# VIEW trong SQL

## 1. VIEW là gì?
`VIEW` là một bảng ảo trong SQL, tạo ra từ kết quả của một truy vấn `SELECT`. VIEW không lưu trữ dữ liệu thật, nhưng bạn có thể truy vấn từ nó như một bảng thông thường.

## 2. Cú pháp VIEW
```sql
CREATE VIEW view_name AS
SELECT column_name(s)
FROM table_name
WHERE condition;
```

- `view_name`: Tên của view.
- Truy vấn `SELECT` sẽ tạo ra dữ liệu cho view.

## 3. Ví dụ về VIEW
Giả sử bạn có bảng `employees` và muốn tạo một view hiển thị danh sách các nhân viên với lương cao hơn 50,000.

```sql
CREATE VIEW high_salary_employees AS
SELECT first_name, last_name, salary
FROM employees
WHERE salary > 50000;
```

Bạn có thể truy vấn view này như một bảng thông thường:
```sql
SELECT * FROM high_salary_employees;
```
