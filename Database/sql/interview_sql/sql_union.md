
# UNION trong SQL

## 1. UNION là gì?
**UNION** trong SQL dùng để kết hợp kết quả của hai hoặc nhiều truy vấn `SELECT`. Nó loại bỏ các bản ghi trùng lặp và chỉ trả về các giá trị duy nhất.

## 2. Cú pháp UNION

```sql
SELECT column_name(s) FROM table1
UNION
SELECT column_name(s) FROM table2;
```
- Hai hoặc nhiều truy vấn `SELECT` được kết hợp với nhau.
- Các cột của mỗi truy vấn phải tương thích về kiểu dữ liệu và thứ tự.

## 3. Ví dụ về UNION

### Giả sử bạn có hai bảng: **customers** và **suppliers**

| customers |         | suppliers |       |
| --------- | ------- | --------- | ----- |
| id        | name    | id        | name  |
| 1         | Alice   | 1         | David |
| 2         | Bob     | 2         | Eve   |
| 3         | Charlie | 3         | Frank |
| 4         | Alice   | 4         | Grace |
|           |         |           |       |

**Câu truy vấn:** 
```sql
SELECT name FROM customers
UNION
SELECT name FROM suppliers;
```

**Kết quả:**

| name            |
|-----------------|
| Alice           |
| Bob             |
| Charlie         |
| David           |
| Eve             |
| Frank           |
| Grace           | 
### 4. Ví dụ UNION với điều kiện WHERE

Lấy danh sách các khách hàng và nhà cung cấp nhưng chỉ những người có tên bắt đầu bằng chữ 'A'.

**Câu truy vấn:**
```sql
SELECT name FROM customers WHERE name LIKE 'A%'
UNION
SELECT name FROM suppliers WHERE name LIKE 'A%';
```

**Kết quả:**

| name            |
|-----------------|
| Alice           |

### 5. UNION với nhiều điều kiện kết hợp

Lấy danh sách những người có id nhỏ hơn 3 từ bảng `customers` và `suppliers`.

**Câu truy vấn:**
```sql
SELECT name FROM customers WHERE id < 3
UNION
SELECT name FROM suppliers WHERE id < 3;
```

**Kết quả:**

| name            |
|-----------------|
| Alice           |
| Bob             |
| David           |
| Eve             |

### 6. UNION với số lượng cột khác nhau (phức tạp)

Trong trường hợp nâng cao, bạn có thể thêm các giá trị cột giả bằng cách sử dụng `NULL` hoặc các giá trị cố định nếu các truy vấn có số lượng cột khác nhau.

Giả sử bạn muốn lấy dữ liệu từ bảng `products` và `suppliers` nhưng chúng có số cột khác nhau.

| products |       | suppliers |       |
| -------- | ----- | --------- | ----- |
| id       | name  | id        | name  |
| 1        | Table | 1         | David |
| 2        | Chair | 2         | Eve   |
| 3        | Lamp  | 3         | Frank |

**Câu truy vấn:**
```sql
SELECT id, name FROM products
UNION
SELECT id, name FROM suppliers;
```

**Kết quả:**

| id              | name           |
|-----------------|----------------|
| 1               | Table          |
| 2               | Chair          |
| 3               | Lamp           |
| 1               | David          |
| 2               | Eve            |
| 3               | Frank          |

## 7. UNION ALL
Nếu bạn muốn giữ lại các giá trị trùng lặp, hãy sử dụng **UNION ALL** thay vì **UNION**.

```sql
SELECT name FROM customers
UNION ALL
SELECT name FROM suppliers;
```

**Kết quả:**

| name            |
|-----------------|
| Alice           |
| Bob             |
| Charlie         |
| Alice           |
| David           |
| Eve             |
| Frank           |
| Grace           |

Như bạn thấy, `Alice` xuất hiện hai lần vì `UNION ALL` giữ lại tất cả các kết quả trùng lặp.
