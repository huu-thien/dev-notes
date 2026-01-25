# PostgreSQL EXPLAIN ANALYZE – Mastery Guide

---

## 1. EXPLAIN vs EXPLAIN ANALYZE

### 1.1 EXPLAIN

```sql
EXPLAIN SELECT * FROM users WHERE email = 'test@gmail.com';
```

- **Không chạy query thật**
    
- Chỉ hiển thị **execution plan dự kiến** của PostgreSQL Planner
    
- Dùng để hiểu _"Postgres sẽ làm gì nếu chạy"_
    

### 1.2 EXPLAIN ANALYZE (quan trọng)

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@gmail.com';
```

- **Chạy query thật**
    
- Trả về:
    
    - Plan + **thời gian thực tế**
        
    - Số rows thực tế xử lý
        
- Dùng khi:
    
    - Debug performance
        
    - So sánh trước / sau khi tối ưu index
        

⚠️ **Không dùng EXPLAIN ANALYZE trên production với query UPDATE/DELETE lớn**

---

## 2. Cấu trúc một EXPLAIN ANALYZE

Ví dụ:

```text
Seq Scan on users  (cost=0.00..431.00 rows=10 width=64)
                   (actual time=0.020..4.312 rows=1 loops=1)
  Filter: (email = 'test@gmail.com')
```

### 2.1 Cost (ước lượng)

```text
cost=0.00..431.00
```

- **Startup cost**: chi phí để bắt đầu trả row đầu tiên
    
- **Total cost**: chi phí để trả hết result
    
- Đơn vị là **cost unit nội bộ**, không phải ms
    

> Planner **chọn plan có total cost thấp nhất**

---

### 2.2 Actual Time (thực tế)

```text
actual time=0.020..4.312
```

- Thời gian thực tế (ms)
    
- Nếu **actual time >> cost** ⇒ statistics sai hoặc query vấn đề
    

---

### 2.3 Rows (ước lượng vs thực tế)

```text
rows=10 (estimated)
actual rows=1
```

❌ Ước lượng sai nhiều → Planner chọn plan sai

➡️ Fix bằng:

```sql
ANALYZE users;
```

---

## 3. Sequential Scan (Seq Scan)

### 3.1 Seq Scan là gì?

- PostgreSQL **đọc toàn bộ table** từ đầu đến cuối
    
- Check từng row xem có match condition hay không
    

```text
Seq Scan on users
```

### 3.2 Khi nào Postgres chọn Seq Scan?

✅ **Table nhỏ**

✅ Query lấy **phần lớn dữ liệu** (>20–30%)

✅ Không có index phù hợp

✅ Điều kiện không selective

```sql
SELECT * FROM orders WHERE status IN ('DONE', 'CANCELLED');
```

### 3.3 Seq Scan không xấu

> Seq Scan = bad ❌ (sai tư duy)

- Trên table nhỏ, Seq Scan **nhanh hơn Index Scan**
    
- Đọc liên tục trên disk → cache-friendly
    

---

## 4. Index Scan

### 4.1 Index Scan là gì?

- PostgreSQL:
    
    1. Scan index để tìm row id (TID)
        
    2. Fetch data từ heap
        

```text
Index Scan using idx_users_email on users
```

### 4.2 Điều kiện để Index Scan hiệu quả

✅ WHERE condition **match index**

✅ Selectivity cao (ít row trả về)

✅ Index được sử dụng đúng thứ tự

```sql
CREATE INDEX idx_users_email ON users(email);

SELECT * FROM users WHERE email = 'test@gmail.com';
```

---

## 5. Index Only Scan (Level cao hơn)

```text
Index Only Scan using idx_users_email on users
```

### Điều kiện:

- Query chỉ SELECT các cột **nằm trong index**
    
- Heap tuple đã được vacuum (visibility map clean): PostgreSQL đã xác nhận rằng toàn bộ tuple trong page đều visible với mọi transaction,
nên Index Only Scan có thể bỏ qua việc đọc heap.
    

➡️ **Nhanh nhất** vì:

- Không đọc heap
    
- Không check visibility
    

---

## 6. So sánh Seq Scan vs Index Scan

|Tiêu chí|Seq Scan|Index Scan|
|---|---|---|
|Table nhỏ|✅|❌|
|Query trả nhiều rows|✅|❌|
|Query trả ít rows|❌|✅|
|Có index phù hợp|❌|✅|
|Cache-friendly|✅|❌|

---

## 7. Các dấu hiệu cần tối ưu

### 7.1 Seq Scan trên table lớn

```text
Seq Scan on orders (actual time=0..1500 ms)
```

➡️ Cần xem:

- Có index chưa?
    
- Index có đúng thứ tự không?
    
- Condition có dùng function không?
    

❌ Bad:

```sql
WHERE lower(email) = 'test@gmail.com'
```

✅ Fix:

```sql
CREATE INDEX idx_users_lower_email ON users(lower(email));
```

---

### 7.2 Index Scan nhưng vẫn chậm

Nguyên nhân:

- Fetch heap quá nhiều
    
- Index không selective
    
- Random IO nhiều
    

➡️ Giải pháp:

- Composite index
    
- Index Only Scan
    
- Partitioning
    

---

## 8. Thứ tự đọc EXPLAIN ANALYZE (Checklist)

1. ❓ Tổng thời gian bao nhiêu?
    
2. ❓ Seq Scan hay Index Scan?
    
3. ❓ Estimated rows vs Actual rows lệch không?
    
4. ❓ Có node nào chiếm >80% thời gian?
    
5. ❓ Index có được dùng đúng không?
    

---

## 9. Best Practices thực chiến

- Luôn dùng:
    

```sql
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
```

- Sau khi insert/update nhiều:
    

```sql
VACUUM ANALYZE;
```

- Không ép planner bằng `enable_seqscan = off`
    

---

## 10. Câu hỏi phỏng vấn hay gặp

- Khi nào Seq Scan nhanh hơn Index Scan?
    
- Vì sao có index nhưng Postgres không dùng?
    
- Estimated rows sai gây hậu quả gì?
    
- Index Only Scan là gì?
    

---

## 11. JOIN trong PostgreSQL (Deep Dive)

JOIN là nơi **EXPLAIN ANALYZE thể hiện trình độ Backend Engineer rõ nhất**. Cùng một query JOIN, Postgres có thể chọn **Nested Loop / Hash Join / Merge Join** – và chọn sai là query đi từ ms → seconds.

---

## 12. Nested Loop Join

### 12.1 Nested Loop là gì?

Cách hiểu đơn giản:

> Với **mỗi row của bảng A**, PostgreSQL sẽ **scan bảng B** để tìm row match.
👉 Bảng outer và bảng inner là gì?

Outer table và Inner table là khái niệm ở mức thực thi (executor),
không phải cú pháp SQL.

Outer = bảng được duyệt trước
Inner = bảng được dùng để lookup / match cho từng row của outer

1️⃣ Hiểu bằng 1 câu đơn giản

PostgreSQL sẽ:

Lấy 1 row từ bảng outer

Dùng row đó để tìm row phù hợp trong bảng inner

➡️ Cách làm này đặc biệt quan trọng với Nested Loop Join

Pseudo code:

```text
for row_a in table_a:
  for row_b in table_b:
    if match(row_a, row_b):
      return row
```

EXPLAIN:

```text
Nested Loop  (actual time=0.05..1200 ms)
```

---

### 12.2 Khi nào Nested Loop nhanh?

✅ Bảng outer **rất nhỏ**

✅ Bảng inner có **index tốt**

✅ JOIN bằng **primary key / unique key**

Ví dụ tốt:

```sql
SELECT *
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE u.id = 10;
```

➡️ 1 user → index lookup orders → cực nhanh

---

### 12.3 Khi nào Nested Loop trở thành thảm họa?

❌ Outer table lớn  
❌ Inner table không có index

Ví dụ xấu:

```sql
SELECT *
FROM users u
JOIN orders o ON o.user_id = u.id;
```

- users: 1 triệu rows
    
- orders: 10 triệu rows
    

➡️ 1,000,000 × 10,000,000 = 💀

---

## 13. Hash Join (Workhorse cho Big Data)

### 13.1 Hash Join là gì?

PostgreSQL sẽ:

1. Load **bảng nhỏ hơn** vào memory
    
2. Build **hash table** trên join key
    
3. Scan bảng lớn và lookup O(1)
    

EXPLAIN:

```text
Hash Join  (actual time=50..300 ms)
  Hash Cond: (orders.user_id = users.id)
```

---

### 13.2 Khi nào Hash Join hiệu quả?

✅ JOIN bảng lớn – lớn

✅ Không có index tốt

✅ JOIN bằng equality (=)

➡️ Hash Join là **default choice cho analytics query**

---

### 13.3 Nhược điểm của Hash Join

❌ Tốn RAM

❌ Nếu vượt `work_mem` → spill ra disk → chậm

Dấu hiệu spill:

```text
Hash  (cost=...)
  Buckets: 65536  Batches: 8  Memory Usage: 1024kB
```

➡️ Fix:

```sql
SET work_mem = '128MB';
```

---

## 14. Merge Join (Bonus)

Merge Join hoạt động tốt khi:

- Hai bảng **đã được sort theo join key**
    
- Hoặc join trên index B-Tree
    

```text
Merge Join
```

Ít gặp hơn trong OLTP, hay gặp trong reporting.

---

## 15. So sánh Nested Loop vs Hash Join

|Tiêu chí|Nested Loop|Hash Join|
|---|---|---|
|Table nhỏ|✅|❌|
|Table lớn|❌|✅|
|Có index tốt|✅|❌|
|Không có index|❌|✅|
|Tốn RAM|Thấp|Cao|

---

## 16. Bitmap Index Scan

### 16.1 Bitmap Index Scan là gì?

Bitmap Index Scan dùng khi:

- WHERE condition match **nhiều index**
    
- Hoặc trả về **nhiều rows**
    

Postgres sẽ:

1. Scan index → tạo bitmap (list TID)
    
2. Merge bitmap
    
3. Fetch heap theo batch
    

EXPLAIN:

```text
Bitmap Heap Scan on orders
  Recheck Cond: (status = 'PAID')
  -> Bitmap Index Scan on idx_orders_status
```

---

### 16.2 Khi nào Bitmap Index Scan được chọn?

✅ WHERE trả về **nhiều rows**

✅ Kết hợp nhiều điều kiện AND

```sql
SELECT *
FROM orders
WHERE status = 'PAID'
  AND created_at >= now() - interval '7 days';
```

---

### 16.3 Bitmap vs Index Scan

|Tiêu chí|Index Scan|Bitmap Index Scan|
|---|---|---|
|Ít rows|✅|❌|
|Nhiều rows|❌|✅|
|Random IO|Cao|Thấp|
|Batch IO|❌|✅|

---

## 17. Thứ tự đọc JOIN trong EXPLAIN ANALYZE

1. JOIN type gì? (Nested / Hash / Merge)
    
2. Bảng nào là outer / inner?
    
3. Estimated rows vs actual rows có lệch không?
    
4. Hash có spill ra disk không?
    
5. Node nào tốn thời gian nhất?
    

---

## 18. Interview Notes (Rất hay gặp)

- Khi nào Nested Loop nhanh hơn Hash Join?
    
- Vì sao JOIN có index vẫn chậm?
    
- Bitmap Index Scan dùng khi nào?
    
- work_mem ảnh hưởng gì tới Hash Join?
    

