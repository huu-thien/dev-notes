
# `GROUP BY` và `HAVING` trong SQL

## 1. `GROUP BY` là gì?

`GROUP BY` được sử dụng để nhóm các hàng có cùng giá trị trong các cột cụ thể. Khi dữ liệu được nhóm lại, bạn có thể áp dụng các hàm tổng hợp như `SUM()`, `COUNT()`, `AVG()`, `MAX()`, và `MIN()` để tính toán các giá trị dựa trên nhóm đó.

### Cú pháp của `GROUP BY`:

```sql
SELECT column_name(s), aggregate_function(column_name)
FROM table_name
WHERE condition
GROUP BY column_name(s);
```

- `column_name(s)`: Các cột bạn muốn nhóm theo.
- `aggregate_function`: Các hàm tổng hợp như `SUM()`, `COUNT()`, `AVG()`,...
- `table_name`: Tên bảng chứa dữ liệu.

## Ví dụ về `GROUP BY`

Giả sử có bảng `Orders` với thông tin về đơn hàng:

| OrderID | CustomerID | Amount |
|---------|------------|--------|
| 1       | 101        | 50     |
| 2       | 102        | 150    |
| 3       | 101        | 100    |
| 4       | 103        | 75     |
| 5       | 102        | 200    |

Nếu bạn muốn tính tổng số tiền (`Amount`) mà mỗi khách hàng (`CustomerID`) đã chi tiêu:

```sql
SELECT CustomerID, SUM(Amount) AS TotalAmount
FROM Orders
GROUP BY CustomerID;
```

**Kết quả:**

| CustomerID | TotalAmount |
|------------|-------------|
| 101        | 150         |
| 102        | 350         |
| 103        | 75          |

Ở đây:
- Khách hàng `101` chi tổng cộng 150.
- Khách hàng `102` chi tổng cộng 350.
- Khách hàng `103` chi tổng cộng 75.

## 2. `HAVING` là gì?

`HAVING` được sử dụng để lọc các nhóm được tạo ra bởi `GROUP BY`. Nó tương tự như `WHERE`, nhưng `WHERE` lọc các hàng trước khi thực hiện `GROUP BY`, còn `HAVING` lọc các nhóm sau khi đã nhóm xong.

### Cú pháp của `HAVING`:

```sql
SELECT column_name(s), aggregate_function(column_name)
FROM table_name
WHERE condition
GROUP BY column_name(s)
HAVING condition;
```

- `condition`: Điều kiện áp dụng lên các nhóm sau khi đã nhóm.

## Ví dụ về `HAVING`

Nếu bạn muốn tìm những khách hàng có tổng số tiền đơn hàng lớn hơn 200:

```sql
SELECT CustomerID, SUM(Amount) AS TotalAmount
FROM Orders
GROUP BY CustomerID
HAVING SUM(Amount) > 200;
```

**Kết quả:**

| CustomerID | TotalAmount |
|------------|-------------|
| 102        | 350         |

Chỉ khách hàng `102` có tổng số tiền đơn hàng lớn hơn 200.

## 3. Sự khác biệt giữa `WHERE` và `HAVING`

- `WHERE` lọc các hàng trước khi nhóm.
- `HAVING` lọc các nhóm sau khi đã nhóm.

### Ví dụ:

Nếu bạn muốn tìm những đơn hàng có giá trị lớn hơn 50, sau đó nhóm chúng theo khách hàng:

```sql
SELECT CustomerID, SUM(Amount) AS TotalAmount
FROM Orders
WHERE Amount > 50
GROUP BY CustomerID
HAVING SUM(Amount) > 100;
```

**Kết quả:**

| CustomerID | TotalAmount |
|------------|-------------|
| 102        | 350         |

Trong ví dụ này:
- `WHERE Amount > 50`: lọc những đơn hàng có giá trị lớn hơn 50.
- `GROUP BY CustomerID`: nhóm các đơn hàng theo khách hàng.
- `HAVING SUM(Amount) > 100`: chỉ giữ lại những khách hàng có tổng số tiền lớn hơn 100.

## 4. Kết luận

- `GROUP BY` giúp nhóm các hàng dựa trên các giá trị chung.
- `HAVING` lọc các nhóm sau khi đã nhóm.
- `HAVING` thường được dùng để lọc các nhóm dựa trên các hàm tổng hợp như `SUM()`, `COUNT()`,...

