#### JSON và JSONB

- `PostgreSQL` hỗ trợ hai loại dữ liệu: `JSON` và `JSONB`. Mặc dù các loại dữ liệu này được cho là gần như giống hệt nhau, có một số khác biệt về hiệu suất và cách thức lưu trữ.

#### JSON

- Định nghĩa: `JSON` là kiểu dữ liệu lưu trữ dữ liệu ở định dạng `JSON` (JavaScript Object Notation). Dữ liệu được lưu trữ dưới dạng văn bản thuần túy.
- `JSON`: Kiểu dữ liệu JSON lưu trữ một bản sao chính xác của dữ liệu đầu vào( khoảng trắng , thứ tự các key trong object và các khoá trùng lặp) . Điều này dẫn đến việc truy vấn chậm vì các hàm trong PostgresSql phải phân tích cú pháp mỗi khi thực hiện truy vấn.

- Ưu điểm
  - Dễ đọc: Dữ liệu được lưu trữ dưới dạng chuỗi, dễ dàng đọc và hiểu.
  - Linh hoạt: Cho phép lưu trữ cấu trúc dữ liệu không đồng nhất.
- Nhược điểm

  - Tốc độ truy vấn: Truy vấn dữ liệu từ kiểu JSON có thể chậm hơn so với JSONB.
  - Không hỗ trợ chỉ mục: Không thể tạo chỉ mục trên các trường trong JSON, điều này có thể làm giảm hiệu suất truy vấn.

#### JSONB

- Định nghĩa: `JSONB` là kiểu dữ liệu lưu trữ dữ liệu `JSON` trong định dạng nhị phân (binary). Điều này cho phép PostgreSQL tối ưu hóa lưu trữ và truy vấn dữ liệu.
- `JSONB`: `JSONB` được lưu trữ dưới dạng định dạng nhị phân và do đó không cần phân tích cú pháp khi thực hiện truy vấn. `Jsonb` sẽ không đảm bảo thứ tự chèn,khi trùng key thì sẽ lấy giá trị cuối cùng , xoá các khoảng trắng. Một lợi thế của kiểu dữ liệu `JSONB` là hỗ trợ Index do đó tạo ra sự khác biệt lớn trong vấn đề hiệu suất khi thực hiện truy vấn. Tuy nhiên, định dạng nhị phân của `JSONB` dẫn đến sự chậm trễ nhỏ trong quá trình input data(Quá trình chuyển đổi từ JSON sang định dạng nhị phân `JSONB`, Kiểm tra khóa trùng .

- Ưu điểm
  - Hiệu suất tốt hơn: Truy vấn dữ liệu nhanh hơn do được tối ưu hóa.
  - Hỗ trợ chỉ mục: Có thể tạo chỉ mục trên các trường bên trong JSONB, giúp tăng tốc độ truy vấn.
  - Tính năng tìm kiếm: Hỗ trợ các toán tử và hàm mạnh mẽ cho việc tìm kiếm và truy vấn dữ liệu JSON.
- Nhược điểm
  - Kích thước: Dữ liệu JSONB có thể chiếm nhiều dung lượng hơn so với JSON do cần không gian cho cấu trúc nhị phân.
  -Khó đọc hơn: Dữ liệu không được lưu trữ dưới dạng văn bản, có thể khó đọc hơn so với JSON.


# Làm việc với JSONB trong PostgreSQL

## Các Toán Tử Cơ Bản

1. **Truy cập giá trị**:
   - `->`: Truy xuất giá trị JSON dưới dạng `JSONB`.
   - `->>`: Truy xuất giá trị JSON dưới dạng chuỗi (`text`).
   - `#>`: Truy xuất giá trị lồng nhau.

   **Ví dụ**:
   ```sql
   SELECT metadata->'preferences' AS preferences
   FROM users;

   SELECT metadata->'preferences'->>'color' AS favorite_color
   FROM users;
   ```

2. **So sánh JSONB**:
   - `@>`: Kiểm tra JSONB bên trái chứa JSONB bên phải.
   - `<@`: Kiểm tra JSONB bên phải chứa JSONB bên trái.
   - `=`: So sánh hai giá trị JSONB.

   **Ví dụ**:
   ```sql
   SELECT *
   FROM products
   WHERE attributes @> '{"brand": "Dell"}';
   ```

3. **Kiểm tra khóa trong JSONB**:
   - `?`: Kiểm tra khóa tồn tại trong JSONB.
   - `?|`: Kiểm tra ít nhất một khóa tồn tại.
   - `?&`: Kiểm tra tất cả các khóa tồn tại.

   **Ví dụ**:
   ```sql
   SELECT *
   FROM users
   WHERE metadata ? 'age';
   ```

## Các Hàm Xử Lý JSONB

1. **jsonb_set**: Cập nhật hoặc thêm giá trị vào JSONB.
   ```sql
   UPDATE products
   SET attributes = jsonb_set(attributes, '{features,Storage}', '"1TB"', true)
   WHERE name = 'Laptop';
   ```

2. **jsonb_array_elements**: Trích xuất các phần tử từ mảng JSONB.
   ```sql
   SELECT jsonb_array_elements(metadata->'preferences'->'category')
   FROM users;
   ```

3. **jsonb_object_keys**: Truy xuất các khóa của một JSONB object.
   ```sql
   SELECT jsonb_object_keys(metadata)
   FROM users;
   ```

4. **jsonb_build_object**: Tạo một object JSONB từ các cặp khóa-giá trị.
   ```sql
   SELECT jsonb_build_object('user', name, 'email', email)
   FROM users;
   ```

5. **jsonb_agg**: Tổng hợp các giá trị JSONB.
   ```sql
   SELECT jsonb_agg(attributes)
   FROM products;
   ```

6. **jsonb_each**: Trích xuất từng cặp khóa-giá trị từ JSONB.
   ```sql
   SELECT key, value
   FROM jsonb_each(metadata)
   WHERE id = 1;
   ```

## Ví Dụ Thực Tế

### 1. Truy xuất metadata người dùng với đơn hàng
```sql
SELECT u.id, u.name, u.metadata, json_agg(o.*) AS orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;
```

### 2. Tính tổng doanh thu theo thuộc tính sản phẩm
```sql
SELECT 
    p.attributes ->> 'brand' AS brand,
    SUM(oi.total_price) AS total_sales
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY brand;
```

### 3. Cập nhật metadata sản phẩm
```sql
UPDATE products
SET attributes = jsonb_set(attributes, '{features,SSD}', '"1TB"', true)
WHERE name = 'Laptop';
```

### 4. Truy xuất sản phẩm với thuộc tính cụ thể
```sql
SELECT *
FROM products
WHERE attributes @> '{"brand": "Apple"}';
```

### 5. Tìm kiếm theo giá trị trong mảng JSONB
```sql
SELECT id, name
FROM users
WHERE metadata #> '{preferences,category}' \? 'electronics';
```

