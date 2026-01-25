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
- Trường mà xuất hiện nhiều duplicate trong DB thì nên để đằng sau
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


### Vì sao index làm chậm CUD (Create / Update / Delete)?

Index là **cấu trúc dữ liệu phụ** được duy trì song song với bảng.  
Mỗi thao tác ghi dữ liệu không chỉ cập nhật bảng mà còn phải **cập nhật tất cả index liên quan**.

- **INSERT**:  
    Mỗi index yêu cầu thêm một entry mới → tăng số lần ghi (I/O + WAL).
    
- **UPDATE**:  
    Nếu cập nhật cột có index, PostgreSQL phải:
    
    - Xóa entry cũ khỏi index
        
    - Thêm entry mới  
        → UPDATE index ≈ DELETE + INSERT.
        
- **DELETE**:  
    Row bị đánh dấu là dead tuple và entry tương ứng phải được loại khỏi index, sau đó cần VACUUM để dọn dẹp.
    

Ngoài ra, việc cập nhật index còn phát sinh:

- Ghi **WAL (Write-Ahead Log)**
    
- Lock index pages
    
- Rebalance cấu trúc index (BTREE, GIN, GiST)
    

**Kết luận:**  
Index cải thiện hiệu năng đọc (SELECT) nhưng làm giảm hiệu năng ghi (CUD).  
Càng nhiều index hoặc index càng phức tạp (GIN, GiST) thì chi phí CUD càng cao.


### VACUUM là gì?

**VACUUM** là cơ chế của PostgreSQL dùng để **dọn dẹp dead tuples** (dòng dữ liệu đã bị UPDATE hoặc DELETE nhưng chưa bị xóa vật lý).

“Chưa bị xóa vật lý” là gì?

Trong PostgreSQL, khi bạn UPDATE hoặc DELETE một row:

👉 Postgres KHÔNG xóa row đó khỏi file trên disk ngay lập tức.
Thay vào đó, nó chỉ:

đánh dấu row cũ là “dead tuple” (không còn visible với query mới)

nếu là UPDATE → tạo ra 1 row mới ở chỗ khác

📌 Row cũ vẫn nằm nguyên trên ổ đĩa
→ đó gọi là chưa bị xóa vật lý

Do PostgreSQL sử dụng **MVCC**, mỗi lần:

- `UPDATE` → tạo row mới, row cũ thành _dead_
    
- `DELETE` → row chỉ bị đánh dấu là _dead_
    

VACUUM có nhiệm vụ:

- Giải phóng không gian lưu trữ của dead tuples
    
- Làm cho không gian đó có thể tái sử dụng
    
- Cập nhật statistics để planner tối ưu query
    
- Ngăn chặn table/index bị phình to (bloat)
    

---

### Các loại VACUUM

- **VACUUM (auto hoặc manual)**
    
    - Không khóa bảng
        
    - Chạy nền, an toàn cho production
        
- **VACUUM FULL**
    
    - Rebuild lại toàn bộ bảng
        
    - Khóa bảng (blocking)
        
    - Chỉ dùng khi cần reclaim disk triệt để
        

---

### Kết luận

VACUUM là thành phần **bắt buộc** để PostgreSQL duy trì hiệu năng ghi và đọc ổn định trong dài hạn, đặc biệt với workload có nhiều UPDATE/DELETE.
