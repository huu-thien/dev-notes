
# Các Loại Join Trong SQL

Trong SQL, các loại `JOIN` được sử dụng để kết hợp dữ liệu từ hai hoặc nhiều bảng dựa trên mối quan hệ giữa các cột trong các bảng đó. Dưới đây là các loại `JOIN` chính và ví dụ minh họa:

## 1. **INNER JOIN**
`INNER JOIN` trả về các bản ghi có giá trị tương ứng trong cả hai bảng.

**Ví dụ:**
```sql
SELECT A.name, B.order_id
FROM customers A
INNER JOIN orders B
ON A.customer_id = B.customer_id;
```

**Kết quả:**

| name    | order_id |
|---------|----------|
| Alice   | 1001     |
| Bob     | 1002     |

Chỉ những bản ghi có `customer_id` tương ứng trong cả hai bảng sẽ xuất hiện trong kết quả.

## 2. **LEFT JOIN (LEFT OUTER JOIN)**
`LEFT JOIN` trả về tất cả các bản ghi từ bảng bên trái (bảng A), và các bản ghi tương ứng từ bảng bên phải (bảng B). Nếu không có bản ghi tương ứng, cột của bảng B sẽ chứa `NULL`.

**Ví dụ:**
```sql
SELECT A.name, B.order_id
FROM customers A
LEFT JOIN orders B
ON A.customer_id = B.customer_id;
```

**Kết quả:**

| name    | order_id |
|---------|----------|
| Alice   | 1001     |
| Bob     | 1002     |
| Charlie | NULL     |

Tất cả các bản ghi từ bảng `customers` sẽ xuất hiện, và nếu không có bản ghi tương ứng trong bảng `orders`, cột `order_id` sẽ là `NULL`.

## 3. **RIGHT JOIN (RIGHT OUTER JOIN)**
`RIGHT JOIN` tương tự như `LEFT JOIN`, nhưng trả về tất cả các bản ghi từ bảng bên phải (bảng B), và các bản ghi tương ứng từ bảng bên trái (bảng A).

**Ví dụ:**
```sql
SELECT A.name, B.order_id
FROM customers A
RIGHT JOIN orders B
ON A.customer_id = B.customer_id;
```

**Kết quả:**

| name    | order_id |
|---------|----------|
| Alice   | 1001     |
| Bob     | 1002     |
| NULL    | 1003     |

Tất cả các bản ghi từ bảng `orders` sẽ xuất hiện, và nếu không có bản ghi tương ứng trong bảng `customers`, cột `name` sẽ là `NULL`.

## 4. **FULL OUTER JOIN**
`FULL OUTER JOIN` trả về tất cả các bản ghi khi có sự tương ứng trong một trong hai bảng. Nếu không có bản ghi tương ứng trong bảng này hay bảng kia, các cột của bảng đó sẽ chứa `NULL`.

**Ví dụ:**
```sql
SELECT A.name, B.order_id
FROM customers A
FULL OUTER JOIN orders B
ON A.customer_id = B.customer_id;
```

**Kết quả:**

| name    | order_id |
|---------|----------|
| Alice   | 1001     |
| Bob     | 1002     |
| Charlie | NULL     |
| NULL    | 1003     |

Kết quả trả về tất cả các bản ghi từ cả hai bảng, với giá trị `NULL` nếu không có bản ghi tương ứng trong bảng kia.

## 5. **CROSS JOIN**
`CROSS JOIN` trả về tất cả các kết hợp có thể có giữa các hàng trong hai bảng (tích Descartes).

**Ví dụ:**
```sql
SELECT A.name, B.order_id
FROM customers A
CROSS JOIN orders B;
```

**Kết quả:**

| name    | order_id |
|---------|----------|
| Alice   | 1001     |
| Alice   | 1002     |
| Alice   | 1003     |
| Bob     | 1001     |
| Bob     | 1002     |
| Bob     | 1003     |
| Charlie | 1001     |
| Charlie | 1002     |
| Charlie | 1003     |

Mỗi hàng từ bảng `customers` được kết hợp với tất cả các hàng từ bảng `orders`, tạo ra tất cả các cặp kết hợp có thể.

---

Các loại `JOIN` này được sử dụng dựa trên nhu cầu cụ thể khi truy vấn dữ liệu từ nhiều bảng trong cơ sở dữ liệu.
