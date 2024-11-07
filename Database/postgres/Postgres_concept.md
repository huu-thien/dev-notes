# Lợi ích của PostgreSQL

1. **Mã nguồn mở**: PostgreSQL là một hệ quản trị cơ sở dữ liệu mã nguồn mở, miễn phí sử dụng và có một cộng đồng mạnh mẽ.
2. **Tính tương thích cao**: Hỗ trợ nhiều tiêu chuẩn SQL, giúp dễ dàng di chuyển dữ liệu giữa các hệ thống khác nhau.
3. **Tính năng phong phú**: Hỗ trợ nhiều tính năng nâng cao như JSONB, các loại chỉ mục khác nhau, các loại dữ liệu tùy chỉnh và toàn vẹn dữ liệu mạnh mẽ.
4. **Khả năng mở rộng**: Có khả năng xử lý khối lượng dữ liệu lớn và hỗ trợ các tính năng như partitioning.
5. **Tính năng đồng thời**: Hỗ trợ quản lý đồng thời hiệu quả với tính năng MVCC (Multi-Version Concurrency Control).
6. **Bảo mật**: Cung cấp các tính năng bảo mật tiên tiến như mã hóa và xác thực mạnh mẽ.
7. **Khả năng tích hợp**: Dễ dàng tích hợp với nhiều ngôn ngữ lập trình và công cụ phát triển.

# Kiến trúc và Cấu trúc

## 1. Cơ sở dữ liệu

- **Định nghĩa**: PostgreSQL cho phép bạn tạo và quản lý nhiều cơ sở dữ liệu trong cùng một phiên bản.
- **Tính năng**:
  - Mỗi cơ sở dữ liệu có thể độc lập với nhau.
  - Dữ liệu trong một cơ sở dữ liệu không thể truy cập trực tiếp từ cơ sở dữ liệu khác.

## 2. Bảng (Tables)

- **Định nghĩa**: Dữ liệu được tổ chức trong các bảng, mỗi bảng gồm nhiều hàng (rows) và cột (columns).
- **Cấu trúc**:
  - **Cột (Column)**: Xác định loại dữ liệu mà bảng lưu trữ (ví dụ: `INTEGER`, `VARCHAR`).
  - **Hàng (Row)**: Mỗi hàng lưu trữ một bản ghi (record).

## 3. Schema

- **Định nghĩa**: Schema là một cách để tổ chức các bảng và các đối tượng khác trong cơ sở dữ liệu.
- **Tính năng**:
  - Giúp phân chia và quản lý các đối tượng trong cơ sở dữ liệu.
  - Có thể chứa bảng, chỉ mục, view, và các đối tượng khác.

# Kiểu dữ liệu

## 1. Kiểu số

- **INTEGER**: Số nguyên (4 bytes).
- **BIGINT**: Số nguyên lớn (8 bytes).
- **SMALLINT**: Số nguyên nhỏ (2 bytes).
- **DECIMAL**: Số thập phân chính xác với số lượng chữ số cố định.
- **NUMERIC**: Tương tự như DECIMAL, hỗ trợ số thập phân chính xác.
- **FLOAT**: Số thực (số với dấu phẩy động).

## 2. Kiểu chuỗi

- **VARCHAR(n)**: Chuỗi có độ dài tối đa `n` ký tự.
- **TEXT**: Chuỗi không có giới hạn độ dài.
- **CHAR(n)**: Chuỗi cố định có độ dài `n` ký tự.

## 3. Kiểu ngày giờ

- **DATE**: Ngày (năm, tháng, ngày).
- **TIME**: Thời gian (giờ, phút, giây).
- **TIMESTAMP**: Ngày và giờ kết hợp.
- **INTERVAL**: Khoảng thời gian (ví dụ: '1 day', '2 hours').

## 4. Kiểu JSON/JSONB

- **JSON**: Lưu trữ dữ liệu ở định dạng JSON (văn bản thuần túy).
- **JSONB**: Lưu trữ dữ liệu ở định dạng nhị phân, tối ưu hóa cho truy vấn hiệu quả hơn.

## 5. Kiểu mảng

- **Định nghĩa**: PostgreSQL hỗ trợ kiểu dữ liệu mảng, cho phép bạn lưu trữ nhiều giá trị trong một cột.
- **Cú pháp**: `data_type[]`, ví dụ: `INTEGER[]`, `TEXT[]`.

# PostgreSQL Commands

## CREATE TABLE

```sql
CREATE TABLE table_name (
    column1 datatype,
    column2 datatype,
    ...
);
```

Ví Dụ:

```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    department_id INT
);
```

## INSERT INTO

```sql
INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...);
```

## Fetch s

```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```

## ADD COLUMN

```sql
ALTER TABLE table_name
ADD COLUMN column_name datatype;
```

## UPDATE

```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
```

## ALTER COLUMN

```sql
ALTER TABLE table_name
ALTER COLUMN column_name SET DATA TYPE new_datatype;
```

## DROP COLUMN

```sql
ALTER TABLE employees
DROP COLUMN age;
```

## DELETE

```sql
DELETE FROM table_name
WHERE condition;
```

## DROP TABLE

```sql
DROP TABLE table_name;

```
