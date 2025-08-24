
# SQL Query Examples with Tables and Results

## Bảng dữ liệu

### 1. Bảng `Product`
| id  | name          | detail                |
|-----|---------------|-----------------------|
| 1   | Laptop        | High-end gaming laptop|
| 2   | Smartphone    | Latest model smartphone|
| 3   | Tablet        | Lightweight and powerful|
| 4   | Headphones    | Noise-cancelling model|

### 2. Bảng `Size`
| id  | name          | short_name |
|-----|---------------|------------|
| 1   | Small         | S          |
| 2   | Medium        | M          |
| 3   | Large         | L          |
| 4   | Extra Large   | XL         |

### 3. Bảng `Product_Size`
| id  | product_id    | size_id    |
|-----|---------------|------------|
| 1   | 1             | 2          |
| 2   | 1             | 3          |
| 3   | 2             | 1          |
| 4   | 3             | 4          |
| 5   | 4             | 1          |
| 6   | 4             | 2          |

## Các truy vấn và kết quả

### 1. Đếm số lượng sản phẩm theo mỗi kích cỡ
```sql
SELECT Size.name, COUNT(Product_Size.product_id) AS product_count
FROM Size
JOIN Product_Size ON Size.id = Product_Size.size_id
GROUP BY Size.name;
```

**Kết quả**:
| name        | product_count |
|-------------|----------------|
| Small       | 2              |
| Medium      | 2              |
| Large       | 1              |
| Extra Large | 1              |

---

### 2. Tìm sản phẩm có nhiều kích cỡ nhất
```sql
SELECT Product.name, COUNT(Product_Size.size_id) AS size_count
FROM Product
JOIN Product_Size ON Product.id = Product_Size.product_id
GROUP BY Product.name
ORDER BY size_count DESC
LIMIT 1;
```

**Kết quả**:
| name   | size_count |
|--------|------------|
| Laptop | 2          |

---

### 3. Liệt kê sản phẩm với kích cỡ cụ thể
```sql
SELECT Product.name, Size.name AS size_name
FROM Product
JOIN Product_Size ON Product.id = Product_Size.product_id
JOIN Size ON Size.id = Product_Size.size_id
WHERE Size.short_name = 'M';
```

**Kết quả**:
| name       | size_name |
|------------|-----------|
| Laptop     | Medium    |
| Headphones | Medium    |

---

### 4. Đếm tổng số sản phẩm
```sql
SELECT COUNT(*) AS total_products
FROM Product;
```

**Kết quả**:
| total_products |
|----------------|
| 4              |

---

### 5. Tìm sản phẩm không có kích cỡ lớn
```sql
SELECT Product.name
FROM Product
WHERE Product.id NOT IN (
  SELECT product_id FROM Product_Size WHERE size_id = 3
);
```

**Kết quả**:
| name       |
|------------|
| Smartphone |
| Tablet     |
| Headphones |

---

### 6. Tìm kích cỡ không có sản phẩm nào
```sql
SELECT Size.name
FROM Size
LEFT JOIN Product_Size ON Size.id = Product_Size.size_id
WHERE Product_Size.product_id IS NULL;
```

**Kết quả**:
| name        |
|-------------|
| Extra Large |

---

### 7. Liệt kê tất cả các sản phẩm và kích cỡ của chúng
```sql
SELECT Product.name, GROUP_CONCAT(Size.short_name) AS sizes
FROM Product
JOIN Product_Size ON Product.id = Product_Size.product_id
JOIN Size ON Size.id = Product_Size.size_id
GROUP BY Product.name;
```

**Kết quả**:
| name       | sizes    |
|------------|----------|
| Laptop     | M,L      |
| Smartphone | S        |
| Tablet     | XL       |
| Headphones | S,M      |

---

### 8. Đếm số lượng kích cỡ mà mỗi sản phẩm có
```sql
SELECT Product.name, COUNT(Product_Size.size_id) AS size_count
FROM Product
JOIN Product_Size ON Product.id = Product_Size.product_id
GROUP BY Product.name;
```

**Kết quả**:
| name       | size_count |
|------------|------------|
| Laptop     | 2          |
| Smartphone | 1          |
| Tablet     | 1          |
| Headphones | 2          |

---

### 9. Liệt kê sản phẩm theo thứ tự số lượng kích cỡ giảm dần
```sql
SELECT Product.name, COUNT(Product_Size.size_id) AS size_count
FROM Product
JOIN Product_Size ON Product.id = Product_Size.product_id
GROUP BY Product.name
ORDER BY size_count DESC;
```

**Kết quả**:
| name       | size_count |
|------------|------------|
| Laptop     | 2          |
| Headphones | 2          |
| Smartphone | 1          |
| Tablet     | 1          |

---

### 10. Liệt kê sản phẩm chỉ có một kích cỡ
```sql
SELECT Product.name
FROM Product
JOIN Product_Size ON Product.id = Product_Size.product_id
GROUP BY Product.name
HAVING COUNT(Product_Size.size_id) = 1;
```

**Kết quả**:
| name       |
|------------|
| Smartphone |
| Tablet     |
```

# End of file
