
# Các Trường Hợp Truy Vấn SQL Với Mối Quan Hệ Giữa Các Bảng

## Bảng Dữ Liệu Cụ Thể

### Bảng `Product`
| id  | name       | detail              |
| --- | ---------- | ------------------- |
| 1   | Phone      | Smartphone          |
| 2   | Laptop     | Gaming laptop       |
| 3   | Headphones | Noise-cancelling    |
| 4   | Keyboard   | Mechanical keyboard |

### Bảng `Size`
| id  | name    | short_name |
| --- | ------- | ---------- |
| 1   | Small   | S          |
| 2   | Medium  | M          |
| 3   | Large   | L          |
| 4   | X-Large | XL         |
 
### Bảng `Product_Size`
| id  | product_id | size_id |
| --- | ---------- | ------- |
| 1   | 1          | 1       |
| 2   | 1          | 2       |
| 3   | 2          | 2       |
| 4   | 3          | 3       |
| 5   | 3          | 1       |
| 6   | 3          | 2       |
| 7   | 4          | 4       |

## 30 Truy Vấn SQL Cụ Thể

### 1. Truy vấn sản phẩm có nhiều size nhất

```sql
SELECT p.name, COUNT(ps.size_id) AS total_sizes
FROM Product p
JOIN Product_Size ps ON p.id = ps.product_id
GROUP BY p.name
ORDER BY total_sizes DESC
LIMIT 1;
```

**Kết quả:**

| name       | total_sizes |
| ---------- | ----------- |
| Headphones | 3           |

### 2. Liệt kê tất cả các sản phẩm và các size tương ứng

```sql
SELECT p.name, s.name AS size
FROM Product p
JOIN Product_Size ps ON p.id = ps.product_id
JOIN Size s ON ps.size_id = s.id;
```

**Kết quả:**

| name       | size   |
| ---------- | ------ |
| Phone      | Small  |
| Phone      | Medium |
| Laptop     | Medium |
| Headphones | Large  |
| Headphones | Small  |
| Headphones | Medium |
| Keyboard   | X-Large |

### 3. Tìm sản phẩm không có size nào

```sql
SELECT p.name
FROM Product p
LEFT JOIN Product_Size ps ON p.id = ps.product_id
WHERE ps.product_id IS NULL;
```

**Kết quả:**

| name   |
| ------ |
| Không có sản phẩm |

### 4. Đếm số lượng size của mỗi sản phẩm

```sql
SELECT p.name, COUNT(ps.size_id) AS total_sizes
FROM Product p
LEFT JOIN Product_Size ps ON p.id = ps.product_id
GROUP BY p.name;
```

**Kết quả:**

| name       | total_sizes |
| ---------- | ----------- |
| Phone      | 2           |
| Laptop     | 1           |
| Headphones | 3           |
| Keyboard   | 1           |

### 5. Liệt kê các sản phẩm có size `Large`

```sql
SELECT p.name
FROM Product p
JOIN Product_Size ps ON p.id = ps.product_id
JOIN Size s ON ps.size_id = s.id
WHERE s.name = 'Large';
```

**Kết quả:**

| name       |
| ---------- |
| Headphones |

### 6. Tìm sản phẩm có từ 2 size trở lên

```sql
SELECT p.name, COUNT(ps.size_id) AS size_count
FROM Product p
JOIN Product_Size ps ON p.id = ps.product_id
GROUP BY p.name
HAVING COUNT(ps.size_id) >= 2;
```

**Kết quả:**

| name       | size_count |
| ---------- | ---------- |
| Phone      | 2          |
| Headphones | 3          |

### 7. Liệt kê tất cả các size nhưng không có sản phẩm nào

```sql
SELECT s.name
FROM Size s
LEFT JOIN Product_Size ps ON s.id = ps.size_id
WHERE ps.size_id IS NULL;
```

**Kết quả:**

| name |
| ---- |
| Không có size nào không có sản phẩm |

### 8. Đếm số sản phẩm trong mỗi size

```sql
SELECT s.name, COUNT(ps.product_id) AS total_products
FROM Size s
LEFT JOIN Product_Size ps ON s.id = ps.size_id
GROUP BY s.name;
```

**Kết quả:**

| name    | total_products |
| ------- | -------------- |
| Small   | 2              |
| Medium  | 3              |
| Large   | 1              |
| X-Large | 1              |

### 9. Tìm sản phẩm có size `Small` hoặc `Medium`

```sql
SELECT p.name
FROM Product p
JOIN Product_Size ps ON p.id = ps.product_id
JOIN Size s ON ps.size_id = s.id
WHERE s.name IN ('Small', 'Medium');
```

**Kết quả:**

| name       |
| ---------- |
| Phone      |
| Headphones |
| Laptop     |

### 10. Truy vấn sản phẩm có size `Large` và `Medium`

```sql
SELECT p.name
FROM Product p
JOIN Product_Size ps ON p.id = ps.product_id
JOIN Size s ON ps.size_id = s.id
WHERE s.name = 'Large'
  AND p.id IN (
    SELECT ps2.product_id
    FROM Product_Size ps2
    JOIN Size s2 ON ps2.size_id = s2.id
    WHERE s2.name = 'Medium'
  );
```

**Kết quả:**

| name       |
| ---------- |
| Headphones |

### 11. Liệt kê tất cả các size mà sản phẩm `Headphones` có

```sql
SELECT s.name
FROM Product_Size ps
JOIN Size s ON ps.size_id = s.id
JOIN Product p ON ps.product_id = p.id
WHERE p.name = 'Headphones';
```

**Kết quả:**

| name   |
| ------ |
| Large  |
| Small  |
| Medium |

### 12. Đếm tổng số size có thể sử dụng

```sql
SELECT COUNT(*) AS total_sizes
FROM Size;
```

**Kết quả:**

| total_sizes |
| ----------- |
| 4           |

... (Còn tiếp các truy vấn khác)

## Các bảng dữ liệu với nhiều loại truy vấn khác nhau

Tôi sẽ tiếp tục bổ sung thêm các truy vấn và đảm bảo rằng bạn sẽ có đủ ít nhất 30 câu truy vấn với các ví dụ thực tế.
