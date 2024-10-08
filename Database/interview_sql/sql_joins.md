
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

## Sự Khác Nhau Giữa Các Loại JOIN và Khi Nào Sử Dụng

Các loại `JOIN` trong SQL có sự khác nhau chủ yếu ở cách mà chúng kết hợp dữ liệu từ hai hoặc nhiều bảng. Mỗi loại `JOIN` có ứng dụng cụ thể dựa trên nhu cầu truy vấn dữ liệu. Dưới đây là sự khác biệt và tình huống sử dụng của từng loại `JOIN`:

### 1. **INNER JOIN**
- **Khác biệt:** `INNER JOIN` chỉ trả về các hàng mà có giá trị tương ứng ở cả hai bảng. Nếu không có sự tương ứng, hàng đó sẽ bị loại bỏ.
- **Khi nào dùng:** Sử dụng khi bạn chỉ muốn lấy các bản ghi có mặt ở cả hai bảng. Ví dụ, khi cần lấy các đơn hàng của những khách hàng hiện có trong hệ thống.

### 2. **LEFT JOIN (LEFT OUTER JOIN)**
- **Khác biệt:** `LEFT JOIN` trả về tất cả các hàng từ bảng bên trái (bảng A), và những hàng tương ứng từ bảng bên phải (bảng B). Nếu bảng B không có hàng tương ứng, giá trị sẽ là `NULL`.
- **Khi nào dùng:** Sử dụng khi bạn muốn lấy tất cả các bản ghi từ bảng chính, ngay cả khi không có dữ liệu tương ứng ở bảng phụ. Ví dụ, khi muốn lấy danh sách tất cả khách hàng và đơn hàng của họ, bao gồm cả khách hàng chưa đặt hàng.

### 3. **RIGHT JOIN (RIGHT OUTER JOIN)**
- **Khác biệt:** `RIGHT JOIN` trả về tất cả các hàng từ bảng bên phải (bảng B) và những hàng tương ứng từ bảng bên trái (bảng A). Nếu bảng A không có hàng tương ứng, giá trị sẽ là `NULL`.
- **Khi nào dùng:** Sử dụng khi bạn muốn lấy tất cả các bản ghi từ bảng phụ và chỉ những bản ghi tương ứng từ bảng chính. Ví dụ, khi muốn lấy danh sách tất cả các đơn hàng, bao gồm cả các đơn hàng mà chưa có khách hàng trong hệ thống.

### 4. **FULL OUTER JOIN**
- **Khác biệt:** `FULL OUTER JOIN` trả về tất cả các bản ghi khi có sự tương ứng ở một trong hai bảng. Nếu một bảng không có bản ghi tương ứng, giá trị sẽ là `NULL`.
- **Khi nào dùng:** Sử dụng khi bạn muốn lấy tất cả các bản ghi từ cả hai bảng, bất kể có sự tương ứng hay không. Ví dụ, khi muốn lấy danh sách tất cả khách hàng và tất cả đơn hàng, bao gồm cả các khách hàng chưa đặt hàng và các đơn hàng chưa có khách hàng.

### 5. **CROSS JOIN**
- **Khác biệt:** `CROSS JOIN` tạo ra tất cả các kết hợp có thể giữa các hàng trong hai bảng (tích Descartes). Không cần có mối quan hệ giữa các bảng.
- **Khi nào dùng:** Thường ít sử dụng trong thực tế do tạo ra số lượng kết quả rất lớn. Sử dụng khi cần tạo tất cả các kết hợp có thể giữa hai tập dữ liệu, chẳng hạn khi muốn xem mọi sự kết hợp có thể giữa sản phẩm và danh mục.

### Tổng kết:
- **`INNER JOIN`**: Khi chỉ cần các bản ghi có mặt ở cả hai bảng.
- **`LEFT JOIN`**: Khi muốn lấy tất cả các bản ghi từ bảng chính, bao gồm cả những bản ghi không có trong bảng phụ.
- **`RIGHT JOIN`**: Khi muốn lấy tất cả các bản ghi từ bảng phụ, bao gồm cả những bản ghi không có trong bảng chính.
- **`FULL OUTER JOIN`**: Khi muốn lấy tất cả các bản ghi từ cả hai bảng, bất kể có sự tương ứng hay không.
- **`CROSS JOIN`**: Khi cần tạo tất cả các kết hợp có thể giữa các hàng trong hai bảng.
