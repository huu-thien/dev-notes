# Câu hỏi thường gặp về SQL

## 1. SQL là gì?

- **SQL là gì và các chức năng chính của nó là gì?**

  **SQL (Structured Query Language)** là ngôn ngữ tiêu chuẩn được sử dụng để quản lý và thao tác dữ liệu trong hệ quản trị cơ sở dữ liệu quan hệ (RDBMS). Các chức năng chính của SQL bao gồm:
  - **Truy vấn dữ liệu:** Sử dụng câu lệnh `SELECT` để lấy dữ liệu từ các bảng.
  - **Thay đổi dữ liệu:** Sử dụng các câu lệnh `INSERT`, `UPDATE`, và `DELETE` để thay đổi dữ liệu trong các bảng.
  - **Quản lý cấu trúc cơ sở dữ liệu:** Sử dụng các câu lệnh `CREATE`, `ALTER`, và `DROP` để tạo, thay đổi và xóa các bảng và đối tượng cơ sở dữ liệu.
  - **Quản lý quyền truy cập:** Sử dụng các câu lệnh `GRANT` và `REVOKE` để cấp và thu hồi quyền truy cập dữ liệu.

## 2. Các loại câu lệnh SQL cơ bản

- **Các loại câu lệnh SQL cơ bản là gì?**

  - **DML (Data Manipulation Language):** Bao gồm các câu lệnh để thao tác dữ liệu, như `SELECT`, `INSERT`, `UPDATE`, và `DELETE`.
  - **DDL (Data Definition Language):** Bao gồm các câu lệnh để quản lý cấu trúc cơ sở dữ liệu, như `CREATE`, `ALTER`, và `DROP`.
  - **DCL (Data Control Language):** Bao gồm các câu lệnh để quản lý quyền truy cập, như `GRANT` và `REVOKE`.
  - **TCL (Transaction Control Language):** Bao gồm các câu lệnh để quản lý giao dịch, như `COMMIT`, `ROLLBACK`, và `SAVEPOINT`.

## 3. Các câu lệnh SQL phổ biến

- **Câu lệnh `SELECT` là gì và cách sử dụng nó?**

  Câu lệnh `SELECT` được sử dụng để truy vấn dữ liệu từ một hoặc nhiều bảng trong cơ sở dữ liệu. Bạn có thể chỉ định các cột cụ thể để lấy dữ liệu, cũng như các điều kiện và thứ tự sắp xếp.

  ```sql
  SELECT column1, column2
  FROM table_name
  WHERE condition
  ORDER BY column1;
  ```

- **Câu lệnh `INSERT` là gì và cách sử dụng nó?**
Câu lệnh `INSERT` được sử dụng để thêm dữ liệu mới vào bảng. Bạn có thể chỉ định các cột và giá trị tương ứng để chèn.

```sql
INSERT INTO table_name (column1, column2)
VALUES (value1, value2);
```

- **Câu lệnh `UPDATE` là gì và cách sử dụng nó?**

Câu lệnh `UPDATE` được sử dụng để thay đổi dữ liệu hiện có trong bảng. Bạn cần chỉ định các cột cần cập nhật và các giá trị mới, cũng như điều kiện để xác định các hàng cần cập nhật.

```sql
UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;
```

- **Câu lệnh `DELETE` là gì và cách sử dụng nó?**

Câu lệnh `DELETE` được sử dụng để xóa dữ liệu từ bảng. Bạn cần chỉ định điều kiện để xác định các hàng cần xóa.

```sql
DELETE FROM table_name
WHERE condition;

```

## 4. JOINs trong SQL

- **JOIN là gì và có những loại JOIN nào?**
 
JOIN là một phương pháp để kết hợp dữ liệu từ hai hoặc nhiều bảng dựa trên một điều kiện chung. Các loại JOIN phổ biến bao gồm:
 
- **INNER JOIN:** Trả về các hàng khi có sự khớp giữa hai bảng.
- **LEFT JOIN (hoặc LEFT OUTER JOIN):** Trả về tất cả các hàng từ bảng bên trái và các hàng khớp từ bảng bên phải, với các giá trị NULL cho các hàng không khớp.
- **RIGHT JOIN (hoặc RIGHT OUTER JOIN):** Trả về tất cả các hàng từ bảng bên phải và các hàng khớp từ bảng bên trái, với các giá trị NULL cho các hàng không khớp.
- **FULL JOIN (hoặc FULL OUTER JOIN):** Trả về tất cả các hàng khi có sự khớp giữa hai bảng hoặc khi có sự không khớp ở cả hai bảng.

```sql
SELECT columns
FROM table1
INNER JOIN table2
ON table1.common_column = table2.common_column;

```

## 5. Các hàm tập hợp (Aggregate Functions)

- **Các hàm tập hợp phổ biến trong SQL là gì?**

Các hàm tập hợp được sử dụng để thực hiện các phép toán trên tập hợp các giá trị. Một số hàm tập hợp phổ biến bao gồm:

- **COUNT():** Đếm số lượng hàng.
- **SUM():** Tính tổng của một cột số.
- **AVG():** Tính giá trị trung bình của một cột số.
- **MAX():** Tìm giá trị lớn nhất trong một cột.
- **MIN():** Tìm giá trị nhỏ nhất trong một cột.

```sql
SELECT COUNT(*)
FROM table_name;

```

## 6. Subqueries (Truy vấn con)

- **Subquery là gì và cách sử dụng nó?**

Subquery là một truy vấn được nhúng trong một truy vấn khác. Nó cho phép bạn thực hiện các phép toán phức tạp hơn bằng cách sử dụng kết quả của truy vấn con trong truy vấn chính.

```sql
SELECT column1
FROM table_name
WHERE column2 = (SELECT MAX(column2) FROM table_name);

```

## 7. Các chỉ mục (Indexes) trong SQL

- **Chỉ mục (Index) là gì và tại sao cần sử dụng nó?**

Chỉ mục là một cấu trúc dữ liệu được sử dụng để cải thiện tốc độ truy vấn cơ sở dữ liệu. Nó giúp tăng hiệu suất của các thao tác truy vấn bằng cách giảm số lượng hàng cần quét.

- **Có những loại chỉ mục nào và khi nào nên sử dụng chúng?**

- **Single-Column Index:** Chỉ mục trên một cột duy nhất, phù hợp cho các truy vấn tìm kiếm theo cột này.
- **Composite Index:** Chỉ mục trên nhiều cột, phù hợp cho các truy vấn tìm kiếm theo nhiều cột.
- **Unique Index:** Đảm bảo rằng các giá trị trong cột là duy nhất, thường được sử dụng để duy trì tính toàn vẹn dữ liệu.

## 8. Normalization (Chuẩn hóa) và Denormalization (Phi chuẩn hóa)

- **Normalization là gì và các dạng chuẩn hóa cơ bản là gì?**

Normalization là quá trình tổ chức dữ liệu trong cơ sở dữ liệu để giảm sự dư thừa và cải thiện tính toàn vẹn dữ liệu. Các dạng chuẩn hóa cơ bản bao gồm:

- **1NF (First Normal Form):** Đảm bảo rằng tất cả các cột trong bảng đều chứa các giá trị nguyên tử.
- **2NF (Second Normal Form):** Đảm bảo rằng các thuộc tính không phụ thuộc vào một phần của khóa chính.
- **3NF (Third Normal Form):** Đảm bảo rằng các thuộc tính không phụ thuộc vào các thuộc tính khác ngoài khóa chính.

- **Denormalization là gì và khi nào nên sử dụng nó?**

Denormalization là quá trình kết hợp các bảng đã được chuẩn hóa để cải thiện hiệu suất truy vấn, thường nhằm giảm số lượng JOINs cần thiết. Bạn nên sử dụng denormalization khi hiệu suất truy vấn là ưu tiên cao và bạn có thể chấp nhận sự dư thừa dữ liệu.

## 9. Transactions (Giao dịch) trong SQL

- **Giao dịch (Transaction) là gì và các thuộc tính ACID là gì?**

Giao dịch là một đơn vị công việc trong cơ sở dữ liệu mà đảm bảo rằng các thao tác được thực hiện một cách toàn vẹn. Các thuộc tính ACID của giao dịch bao gồm:

- **Atomicity (Tính nguyên tử):** Giao dịch phải được thực hiện hoàn toàn hoặc không thực hiện gì cả.
- **Consistency (Tính nhất quán):** Giao dịch phải giữ cho cơ sở dữ liệu ở trạng thái nhất quán.
- **Isolation (Tính cách ly):** Các giao dịch độc lập không ảnh hưởng lẫn nhau.
- **Durability (Tính bền vững):** Các thay đổi của giao dịch phải được lưu trữ vĩnh viễn ngay cả khi hệ thống gặp sự cố.

 **Làm thế nào để quản lý giao dịch trong SQL?**

Bạn có thể quản lý giao dịch bằng các câu lệnh `BEGIN TRANSACTION`, `COMMIT`, và `ROLLBACK` để bắt đầu, xác nhận hoặc hoàn tác một giao dịch.

```sql
BEGIN TRANSACTION;
-- Các câu lệnh SQL
COMMIT;

```


## 10. Các vấn đề hiệu suất và tối ưu hóa

- **Các vấn đề hiệu suất phổ biến trong SQL là gì và làm thế nào để tối ưu hóa chúng?**

Các vấn đề hiệu suất phổ biến bao gồm:

- **Chạy chậm các truy vấn:** Có thể do thiếu chỉ mục, các JOIN phức tạp hoặc các truy vấn không tối ưu.
- **Xung đột khóa:** Xảy ra khi nhiều giao dịch cố gắng cập nhật cùng một dữ liệu đồng thời.
- **Tốc độ đọc/ghi thấp:** Có thể do thiết kế cơ sở dữ liệu không tối ưu hoặc các truy vấn không được tối ưu hóa.

**Các cách tối ưu hóa hiệu suất:**

  - **Tạo và tối ưu hóa chỉ mục:** Đảm bảo rằng các chỉ mục được sử dụng cho các cột thường xuyên xuất hiện trong các điều kiện `WHERE` và `JOIN`.
- **Sử dụng các câu lệnh truy vấn hiệu quả:** Tránh sử dụng `SELECT *` và chỉ chọn các cột cần thiết.
- **Tối ưu hóa JOINs:** Sử dụng các loại JOIN phù hợp và đảm bảo rằng các điều kiện JOIN được tối ưu.
- **Phân tích và tối ưu hóa kế hoạch thực thi:** Sử dụng các công cụ phân tích và chỉ số để đánh giá và cải thiện kế hoạch thực thi truy vấn.
- **Sử dụng các câu lệnh giao dịch hợp lý:** Quản lý giao dịch để giảm xung đột và khóa không cần thiết.