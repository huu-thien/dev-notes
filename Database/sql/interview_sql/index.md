### 🎯 Các loại Index phổ biến trong Database (ví dụ với bảng `users`)

Giả sử ta có bảng `users`:

```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 1️⃣ Normal Index (Single Column Index)

👉 Chỉ mục cơ bản nhất, dùng để **tăng tốc query theo 1 cột**.

```sql
CREATE INDEX idx_username ON users(username);
```

📌 Dùng khi:

- Hay `WHERE username = ...`
    
- Hay `ORDER BY username`
    

🧠 Ghi nhớ nhanh:

> Query nhiều theo cột nào → index cột đó.

---

## 2️⃣ Unique Index (Chỉ mục duy nhất)

👉 Vừa **tăng tốc query**, vừa **đảm bảo dữ liệu không bị trùng**.

```sql
CREATE UNIQUE INDEX idx_email_unique ON users(email);
```

📌 Dùng khi:

- Email, phone, username (nếu unique)
    
- Không muốn user đăng ký 2 acc cùng email 😤
    

⚠️ Insert trùng → DB auto block, không cần check tay ở code.

---

## 3️⃣ Primary Key Index (Chỉ mục khóa chính)

👉 Boss của mọi index 😎  
Tự động có khi khai báo `PRIMARY KEY`.

```sql
PRIMARY KEY (id)
```

📌 Đặc điểm:

- Luôn là **UNIQUE**
    
- Luôn được **index**
    
- Dùng để join, tìm record cực nhanh
    

🧠 Best practice:

> Join table = join bằng Primary Key / Foreign Key

---

## 4️⃣ Full-text Index (Chỉ mục toàn văn)

👉 Dành cho **search text** kiểu Google, không phải `LIKE '%abc%'` cùi bắp.

```sql
CREATE FULLTEXT INDEX idx_fulltext_username
ON users(username);
```

📌 Dùng khi:

- Search theo keyword
    
- Tìm gần đúng, ranking kết quả
    

💡 Ví dụ use case:

- Search user
    
- Search bài viết, comment
    

⚠️ Lưu ý:

- Không dùng cho so sánh `=`
    
- Mỗi DB engine support khác nhau (MySQL, Postgres khác cách)
    

---

## 5️⃣ Composite Index (Multi-column Index)

👉 Index cho **nhiều cột cùng lúc**.

```sql
CREATE INDEX idx_username_email
ON users(username, email);

EXPLAIN ANALYZE SELECT * FROM users WHERE username = 'a' AND email = 'thien'
```

### 📌 Execution Plan: Index Scan using `idx_username_email`

`Index Scan using idx_username_email on users (cost=0.15..8.17 rows=1 width=80) (actual time=0.007..0.008 rows=0 loops=1)   Index Cond: ((username = 'a') AND (email = 'thien')) Planning Time: 0.086 ms Execution Time: 0.024 ms`

---

## 1. Loại scan được sử dụng

**Index Scan** trên bảng `users` thông qua index `idx_username_email`.

➡️ Điều này cho thấy PostgreSQL **truy cập trực tiếp index**, không cần scan bảng (Sequential Scan).

---

## 2. Điều kiện sử dụng index

`Index Cond: ((username = 'a') AND (email = 'thien'))`

- Điều kiện WHERE **khớp hoàn toàn với thứ tự cột** trong composite index `(username, email)`
    
- Index được tận dụng **tối đa** (left-most prefix rule)
    

➡️ Đây là case **lý tưởng nhất** cho composite index.

---

## 3. Ước lượng của planner (cost, rows)

`cost=0.15..8.17 rows=1`

- `cost`: chi phí ước lượng để thực thi query
    
- `rows=1`: PostgreSQL dự đoán sẽ trả về **1 dòng**
    

➡️ Ước lượng này dựa trên **statistics** của bảng và index.

---

## 4. Kết quả thực tế khi chạy (actual)

`(actual time=0.007..0.008 rows=0 loops=1)`

- Query chạy **rất nhanh** (~0.008 ms)
    
- Không có bản ghi nào thỏa điều kiện (`rows=0`)
    

➡️ Index vẫn được dùng đúng, chỉ là **dữ liệu không tồn tại**.

---

## 5. Planning Time vs Execution Time

`Planning Time: 0.086 ms Execution Time: 0.024 ms`

- Thời gian lập kế hoạch > thời gian thực thi
    
- Điều này thường xảy ra với:
    
    - Query đơn giản
        
    - Bảng nhỏ
        
    - Index hiệu quả
        

---

## 6. Kết luận

- PostgreSQL đã chọn **Index Scan** thay vì Bitmap Scan hoặc Sequential Scan
    
- Composite index `idx_username_email (username, email)` được sử dụng **đúng mục đích**
    
- Query có hiệu năng tốt, không cần tối ưu thêm ở mức index
    

---

## 7. Best practice rút ra

- Composite index chỉ phát huy tối đa khi:
    
    - Điều kiện WHERE **bắt đầu từ cột bên trái**
        
    - So sánh bằng (`=`) thay vì `LIKE '%...'`

📌 Nguyên tắc vàng (VERY IMPORTANT 🔥):  
**Index hoạt động theo thứ tự từ trái sang phải  (left-most rule)**
- Trường mà xuất hiện nhiều trong DB thì nên để đằng sau
- Trường nào ít xuất hiện trùng lặp trong DB thì nên để trước

|Query|Có dùng index không|
|---|---|
|`WHERE username = ?`|✅|
|`WHERE username = ? AND email = ?`|✅|
|`WHERE email = ?`|❌|

🧠 Rule nhớ nhanh:

> Query hay filter theo combo cột nào → composite index theo đúng thứ tự đó.

```sql
SELECT count(DISTINCT username)/count(1) AS "rateUsername",

	count(DISTINCT email)/count(1) AS "rateEmail"

FROM users
```

=> cao hơn thì cột đó nằm bên trái