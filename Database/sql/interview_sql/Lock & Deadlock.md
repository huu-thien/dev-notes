# PostgreSQL Lock & Deadlock 

## 1. Lock trong PostgreSQL là gì?

**Lock** là cơ chế đảm bảo tính nhất quán dữ liệu khi nhiều transaction truy cập cùng lúc.

PostgreSQL theo triết lý:

> **MVCC + Lock tối thiểu cần thiết → tối ưu concurrency**

Khác với một số hệ CSDL khác, PostgreSQL **không khóa khi SELECT thông thường**.

---

## 2. Hai nhóm Lock chính

### 2.1 Table-level Lock

Khóa ở mức bảng (relation), thường xuất hiện khi chạy DDL hoặc DML.

|Lock Mode|Sinh ra khi|
|---|---|
|ACCESS SHARE|SELECT|
|ROW SHARE|SELECT ... FOR UPDATE/SHARE|
|ROW EXCLUSIVE|INSERT / UPDATE / DELETE|
|SHARE|CREATE INDEX|
|EXCLUSIVE|REFRESH MATERIALIZED VIEW|
|ACCESS EXCLUSIVE|ALTER / DROP TABLE|

⚠️ **ACCESS EXCLUSIVE** là lock nguy hiểm nhất vì block toàn bộ thao tác khác.

---

### 2.2 Row-level Lock

Khóa ở mức từng row, là nguyên nhân chính gây ra deadlock.

|Câu lệnh|Kiểu lock|
|---|---|
|UPDATE / DELETE|FOR UPDATE|
|SELECT ... FOR UPDATE|FOR UPDATE|
|SELECT ... FOR SHARE|FOR SHARE|
|SELECT ... FOR NO KEY UPDATE|Nhẹ hơn FOR UPDATE|

---

## 3. SELECT ... FOR UPDATE / SHARE (Cực kỳ quan trọng)

### 3.1 FOR UPDATE

```sql
SELECT * FROM orders WHERE id = 10 FOR UPDATE;
```

- Khóa row để **update/delete**
    
- Transaction khác không thể update row này
    
- Thường dùng trong logic **trừ tiền, giữ chỗ, booking**
    

---

### 3.2 FOR SHARE

```sql
SELECT * FROM orders WHERE id = 10 FOR SHARE;
```

- Cho phép nhiều transaction cùng đọc
    
- Block UPDATE / DELETE
    

---

### 3.3 FOR NO KEY UPDATE

```sql
SELECT * FROM orders WHERE id = 10 FOR NO KEY UPDATE;
```

- Nhẹ hơn FOR UPDATE
    
- Cho phép update cột **không liên quan đến key/index**
    

👉 PostgreSQL ưu tiên dùng loại lock nhẹ nhất có thể.

---

## 4. SKIP LOCKED & NOWAIT (Production cực hay dùng)

### 4.1 NOWAIT

```sql
SELECT * FROM jobs WHERE status = 'pending'
FOR UPDATE NOWAIT;
```

- Không chờ lock
    
- Nếu bị lock → fail ngay
    

Use case: API không được phép chờ lâu

---

### 4.2 SKIP LOCKED

```sql
SELECT * FROM jobs
WHERE status = 'pending'
FOR UPDATE SKIP LOCKED
LIMIT 10;
```

- Bỏ qua row đang bị lock
    
- Rất phổ biến cho **job queue / worker**
    

🔥 Đây là pattern chuẩn cho **distributed worker**.

---

## 5. Deadlock là gì?

**Deadlock** xảy ra khi các transaction:

- Mỗi cái giữ một lock
    
- Đồng thời chờ lock của nhau
    

➡️ Tạo vòng lặp chờ vô hạn

---

## 6. Ví dụ Deadlock kinh điển

### Transaction A

```sql
BEGIN;
UPDATE users SET name = 'A' WHERE id = 1;
UPDATE users SET name = 'A' WHERE id = 2;
```

### Transaction B

```sql
BEGIN;
UPDATE users SET name = 'B' WHERE id = 2;
UPDATE users SET name = 'B' WHERE id = 1;
```

➡️ Deadlock xảy ra do **lock thứ tự khác nhau**.

PostgreSQL sẽ phát hiện và kill 1 transaction.

---

## 7. PostgreSQL phát hiện deadlock thế nào?

- Xây dựng **wait-for graph**
    
- Phát hiện chu kỳ
    
- Rollback transaction có cost thấp hơn
    

⏱ Thời gian kiểm tra: `deadlock_timeout` (mặc định ~1s)

---

## 8. Debug Lock & Deadlock trong thực tế

### 8.1 Xem session đang bị chờ

```sql
SELECT pid, usename, state, wait_event_type, wait_event, query
FROM pg_stat_activity
WHERE wait_event IS NOT NULL;
```

---

### 8.2 Xem chi tiết lock

```sql
SELECT l.pid, l.locktype, l.mode, l.granted, a.query
FROM pg_locks l
JOIN pg_stat_activity a ON l.pid = a.pid;
```

- `granted = false` → đang chờ lock
    

---

### 8.3 Xem ai block ai (Query vàng)

```sql
SELECT
  blocked.pid AS blocked_pid,
  blocking.pid AS blocking_pid,
  blocked.query AS blocked_query,
  blocking.query AS blocking_query
FROM pg_stat_activity blocked
JOIN pg_locks blocked_locks ON blocked.pid = blocked_locks.pid
JOIN pg_locks blocking_locks
  ON blocking_locks.locktype = blocked_locks.locktype
  AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
  AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
  AND blocking_locks.granted
JOIN pg_stat_activity blocking ON blocking.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

---

## 9. Best Practices tránh Deadlock

### ✅ Lock theo cùng thứ tự

- `ORDER BY id`
    
- Không đảo thứ tự giữa các transaction
    

### ✅ Transaction ngắn

- Không giữ lock trong khi xử lý logic lâu
    

### ✅ Index chuẩn

- WHERE không index → lock nhiều row hơn cần thiết
    

### ✅ Dùng lock nhẹ nhất

- FOR NO KEY UPDATE / FOR SHARE
    

### ✅ Retry transaction

- Deadlock **không phải bug**
    
- App phải retry (idempotent)
    

---

## 10. Tóm tắt 

> PostgreSQL sử dụng MVCC kết hợp với table-level và row-level lock để tối ưu concurrency. Deadlock phát sinh khi các transaction giữ lock theo thứ tự khác nhau. PostgreSQL tự động phát hiện deadlock và rollback một transaction, do đó ứng dụng cần thiết kế transaction ngắn, lock theo thứ tự cố định và có cơ chế retry.

---

📌 Keywords nên nhớ: `FOR UPDATE`, `FOR SHARE`, `FOR NO KEY UPDATE`, `SKIP LOCKED`, `NOWAIT`, `deadlock_timeout`, `pg_locks`, `pg_stat_activity`