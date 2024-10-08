
# Các Hàm Tổng Hợp trong SQL và Ví Dụ Cụ Thể

## Giới thiệu
Hàm tổng hợp (Aggregate Function) là hàm thực hiện tính toán trên một tập hợp các giá trị và trả về một giá trị duy nhất. Chúng thường được sử dụng kết hợp với mệnh đề `GROUP BY` trong câu lệnh `SELECT`. Mệnh đề `GROUP BY` chia tập kết quả thành các nhóm, và hàm tổng hợp được sử dụng để trả về một giá trị cho mỗi nhóm.

Các hàm tổng hợp phổ biến trong SQL bao gồm:

- **MIN()**: Trả về giá trị nhỏ nhất trong cột được chọn.
- **MAX()**: Trả về giá trị lớn nhất trong cột được chọn.
- **COUNT()**: Đếm số hàng trong một tập hợp.
- **SUM()**: Tính tổng giá trị của một cột số.
- **AVG()**: Tính giá trị trung bình của một cột số.

> Lưu ý: Các hàm tổng hợp bỏ qua các giá trị null (trừ `COUNT()`).

## Dữ liệu Mẫu
### Bảng `employees`
| employee_id | name        | salary | department |
|-------------|-------------|--------|------------|
| 1           | John Doe    | 50000  | Sales      |
| 2           | Jane Smith  | 60000  | IT         |
| 3           | Michael Lee | 40000  | Sales      |
| 4           | Emily Davis | 45000  | Marketing  |
| 5           | William Tan | 55000  | IT         |
| 6           | Sarah Wong  | 47000  | Marketing  |
| 7           | David Brown | 48000  | Sales      |

## Ví dụ Cụ Thể và Cú Pháp (Syntax)

### 1. Hàm `MIN()`
Trả về giá trị nhỏ nhất trong cột:
```sql
SELECT MIN(column_name)
FROM table_name
WHERE condition;
```

Ví dụ: Trả về mức lương nhỏ nhất trong bảng `employees`:
```sql
SELECT MIN(salary) 
FROM employees;
```
**Kết quả**: 40000

### 2. Hàm `MAX()`
Trả về giá trị lớn nhất trong cột:
```sql
SELECT MAX(column_name)
FROM table_name
WHERE condition;
```

Ví dụ: Trả về mức lương lớn nhất trong bảng `employees`:
```sql
SELECT MAX(salary) 
FROM employees;
```
**Kết quả**: 60000

### 3. Hàm `COUNT()`
Đếm số hàng trong một tập hợp:
```sql
SELECT COUNT(column_name)
FROM table_name
WHERE condition;
```

Ví dụ: Đếm số nhân viên trong phòng `Sales`:
```sql
SELECT COUNT(*) 
FROM employees 
WHERE department = 'Sales';
```
**Kết quả**: 3 (John Doe, Michael Lee, David Brown)

### 4. Hàm `SUM()`
Tính tổng giá trị của một cột số:
```sql
SELECT SUM(column_name)
FROM table_name
WHERE condition;
```

Ví dụ: Tính tổng lương của tất cả nhân viên trong phòng `IT`:
```sql
SELECT SUM(salary) 
FROM employees 
WHERE department = 'IT';
```
**Kết quả**: 115000 (Jane Smith + William Tan)

### 5. Hàm `AVG()`
Tính giá trị trung bình của một cột số:
```sql
SELECT AVG(column_name)
FROM table_name
WHERE condition;
```

Ví dụ: Tính trung bình lương của nhân viên trong phòng `Marketing`:
```sql
SELECT AVG(salary) 
FROM employees 
WHERE department = 'Marketing';
```
**Kết quả**: 46000 ((45000 + 47000) / 2)

## Kết hợp `GROUP BY` với các Hàm Tổng Hợp

### 6. `GROUP BY` và `SUM()`
Tính tổng lương cho mỗi phòng ban:
```sql
SELECT department, SUM(salary) 
FROM employees 
GROUP BY department;
```
**Kết quả**:
- Sales: 138000
- IT: 115000
- Marketing: 92000

### 7. `GROUP BY` và `COUNT()`
Đếm số nhân viên trong mỗi phòng ban:
```sql
SELECT department, COUNT(*) 
FROM employees 
GROUP BY department;
```
**Kết quả**:
- Sales: 3
- IT: 2
- Marketing: 2

## Sử dụng `HAVING` với Hàm Tổng Hợp

### 8. `HAVING` với `SUM()`
Trả về các phòng ban có tổng lương lớn hơn 50000:
```sql
SELECT department, SUM(salary) 
FROM employees 
GROUP BY department 
HAVING SUM(salary) > 50000;
```
**Kết quả**:
- Sales: 138000
- IT: 115000
