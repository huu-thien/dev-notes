
# TRIGGER trong SQL

## 1. TRIGGER là gì?
`TRIGGER` trong SQL là các hành động tự động được thực thi khi một sự kiện cụ thể (INSERT, UPDATE, DELETE) xảy ra trên một bảng. Chúng được sử dụng để duy trì tính toàn vẹn dữ liệu hoặc thực hiện các hoạt động tự động.

## 2. Cú pháp TRIGGER
```sql
CREATE TRIGGER trigger_name
{BEFORE | AFTER} {INSERT | UPDATE | DELETE} 
ON table_name 
FOR EACH ROW
BEGIN
   -- SQL statements
END;
```

- `trigger_name`: Tên của trigger.
- `BEFORE` hoặc `AFTER`: Xác định thời điểm trigger sẽ được thực thi.
- `{INSERT | UPDATE | DELETE}`: Chỉ định sự kiện kích hoạt trigger.
- `table_name`: Tên bảng áp dụng trigger.

## 3. Ví dụ về TRIGGER
Giả sử bạn muốn tự động cập nhật trường `updated_at` mỗi khi bảng `users` được cập nhật.

```sql
CREATE TRIGGER update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
   SET NEW.updated_at = NOW();
END;
```

Khi bất kỳ bản ghi nào trong bảng `users` được cập nhật, trigger này sẽ tự động cập nhật trường `updated_at` với thời gian hiện tại.
