
# TRANSACTION trong SQL

## 1. TRANSACTION là gì?
`TRANSACTION` là một tập hợp các lệnh SQL được thực thi dưới dạng một đơn vị đơn nhất. Nếu một lệnh trong transaction bị lỗi, toàn bộ transaction có thể được "ROLLBACK" để dữ liệu không bị thay đổi.

## 2. Cú pháp TRANSACTION
```sql
START TRANSACTION;
-- Các lệnh SQL
COMMIT;  -- Lưu các thay đổi
ROLLBACK; -- Hủy bỏ các thay đổi nếu có lỗi
```

## 3. Ví dụ về TRANSACTION
Giả sử bạn muốn thực hiện hai thao tác: trừ tiền từ tài khoản A và thêm tiền vào tài khoản B. Nếu một trong hai thao tác thất bại, cả transaction phải được hủy bỏ.

```sql
START TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE account_id = 'A';
UPDATE accounts SET balance = balance + 100 WHERE account_id = 'B';

COMMIT;
```

Nếu có lỗi trong bất kỳ lệnh nào, transaction có thể được rollback:
```sql
ROLLBACK;
```
