## 1. Các Hàm Tổng Hợp (Aggregate Functions) trong PostgreSQL

Trong PostgreSQL, **aggregate functions** (hàm tổng hợp) được sử dụng để thực hiện các phép tính trên một nhóm các dòng dữ liệu và trả về một giá trị duy nhất. Các hàm này thường được sử dụng kết hợp với **GROUP BY** để nhóm các dòng và tính toán các giá trị tổng hợp cho mỗi nhóm.

### Một số hàm tổng hợp phổ biến:

#### 1. **COUNT()**

Hàm này trả về số lượng dòng trong nhóm.

- **Ví dụ**:

```sql
SELECT COUNT(*) FROM employees;
```

#### 2. SUM()

Hàm này tính tổng giá trị của một cột số học trong nhóm.

- **Ví dụ**:

```sql
SELECT department, SUM(salary) FROM employees GROUP BY department;
```

#### 3. AVG()

Hàm này tính giá trị trung bình của một cột số học trong nhóm.

- **Ví dụ**:

```sql
SELECT department, AVG(salary) FROM employees GROUP BY department;
```

#### 4. MIN()

Hàm này trả về giá trị nhỏ nhất trong một cột.

- **Ví dụ**:

```sql
SELECT department, MIN(salary) FROM employees GROUP BY department;
```

#### 5. MAX()

Hàm này trả về giá trị lớn nhất trong một cột.

- **Ví dụ**:

```sql
SELECT department, MAX(salary) FROM employees GROUP BY department;
```

#### 6. ARRAY_AGG()

Hàm này kết hợp các giá trị từ một cột thành một mảng.

- **Ví dụ**:

```sql
SELECT department, ARRAY_AGG(employee_name) FROM employees GROUP BY department;
```

#### 7. STRING_AGG()

Hàm này kết hợp các giá trị từ một cột thành một chuỗi, phân cách bởi một ký tự hoặc chuỗi xác định.

- **Ví dụ**:

```sql
SELECT department, STRING_AGG(employee_name, ', ') FROM employees GROUP BY department;
```

#### 8. BOOL_AND()

Hàm này trả về TRUE nếu tất cả các giá trị trong nhóm đều là TRUE, nếu không thì trả về FALSE.

- **Ví dụ**:

```sql
SELECT department, BOOL_AND(is_active) FROM employees GROUP BY department;
```

#### 9. BOOL_OR()

Hàm này trả về `TRUE` nếu có ít nhất một giá trị trong nhóm là `TRUE`.

- **Ví dụ**:

```sql
SELECT department, BOOL_OR(is_active) FROM employees GROUP BY department;
```

# 2. Các Hàm Xử Lý Mảng trong PostgreSQL

#### 1. ARRAY_LENGTH()

Hàm này trả về chiều dài (số lượng phần tử) của một mảng.

- **Cú pháp**:

```sql
ARRAY_LENGTH(array, dimension)
```

- **Ví dụ**:

```sql
SELECT ARRAY_LENGTH(ARRAY[1, 2, 3, 4], 1);
```

Trả về 4, vì mảng có 4 phần tử.

#### 2. ARRAY_AGG()

Hàm này kết hợp các giá trị từ các dòng thành một mảng.

- **Cú pháp**:

```sql
ARRAY_AGG(expression)
```

- **Ví dụ**:

```sql
SELECT department, ARRAY_AGG(employee_name)
FROM employees
GROUP BY department;
```

Trả về một mảng chứa tên nhân viên trong mỗi bộ phận.

#### 3. UNNEST()

Hàm này giúp "phá vỡ" (flatten) một mảng thành các giá trị riêng biệt (mỗi giá trị của mảng sẽ trở thành một dòng).

- **Cú pháp**:

```sql
UNNEST(array)
```

- **Ví dụ**:

```sql
SELECT unnest(ARRAY[1, 2, 3, 4]);
```

```sql
1
2
3
4
```

#### 4. ARRAY_TO_STRING()

Hàm này chuyển đổi mảng thành một chuỗi, với các phần tử được phân tách bởi một ký tự hoặc chuỗi bạn chỉ định.

- **Cú pháp**:

```sql
ARRAY_TO_STRING(array, delimiter)
```

- **Ví dụ**:

```sql
SELECT ARRAY_TO_STRING(ARRAY['Alice', 'Bob', 'Charlie'], ', ');
```

Trả về chuỗi: `'Alice, Bob, Charlie'`.

#### 5. STRING_TO_ARRAY()

Hàm này chuyển đổi một chuỗi thành một mảng, sử dụng ký tự phân cách.

- **Cú pháp**:

```sql
STRING_TO_ARRAY(string, delimiter)
```

- **Ví dụ**:

```sql
SELECT STRING_TO_ARRAY('Alice,Bob,Charlie', ',');
```

Trả về mảng: `{'Alice','Bob','Charlie'}`.

#### 6. ARRAY_CAT()

Hàm này nối hai mảng lại với nhau.

- **Cú pháp**:

```sql
ARRAY_CAT(array1, array2)
```

- **Ví dụ**:

```sql
SELECT ARRAY_CAT(ARRAY[1, 2], ARRAY[3, 4]);
```

Trả về mảng: `{'Alice','Bob','Charlie'}`.

#### 7. ARRAY_REMOVE()

Hàm này xóa tất cả các phần tử trong mảng có giá trị bằng với giá trị chỉ định.

- **Cú pháp**:

```sql
ARRAY_REMOVE(array, element)
```

- **Ví dụ**:

```sql
SELECT ARRAY_REMOVE(ARRAY[1, 2, 3, 2, 4], 2);
```

Trả về mảng: `{1, 3, 4}`.

#### 8. ARRAY_REPLACE()

Hàm này thay thế tất cả các phần tử trong mảng có giá trị bằng với giá trị chỉ định bằng một giá trị mới.

- **Cú pháp**:

```sql
ARRAY_REPLACE(array, old_element, new_element)
```

- **Ví dụ**:

```sql
SELECT ARRAY_REPLACE(ARRAY[1, 2, 3, 2, 4], 2, 5);
```

Trả về mảng: `{1, 5, 3, 5, 4}`.

#### 9. ARRAY_POSITION()

Hàm này tìm vị trí của phần tử đầu tiên trong mảng có giá trị bằng với giá trị chỉ định.

- **Cú pháp**:

```sql
ARRAY_POSITION(array, element)
```

- **Ví dụ**:

```sql
SELECT ARRAY_POSITION(ARRAY[1, 2, 3, 4], 3);
```

Trả về `3`, vì `3` là phần tử thứ ba trong mảng.

# Các Hàm Làm Việc Với JSON và JSONB trong PostgreSQL

PostgreSQL hỗ trợ hai loại dữ liệu JSON: **JSON** (được lưu dưới dạng chuỗi) và **JSONB** (lưu dưới dạng nhị phân, được tối ưu hóa cho truy vấn). Các hàm và toán tử dưới đây giúp bạn truy vấn và thao tác với dữ liệu JSON và JSONB.

### 1. Truy Vấn Dữ Liệu JSON

#### 1. **json_object_keys()**

Hàm này trả về các khóa (keys) của đối tượng JSON dưới dạng một tập hợp.

- **Cú pháp**:

```sql
json_object_keys(json)
```

- **Ví dụ**:

```sql
SELECT json_object_keys('{"name": "Alice", "age": 30, "city": "New York"}');
```

Trả về:

```
name
age
city
```

#### 2. **json_each()**

Hàm này trả về tất cả các cặp key-value trong một đối tượng JSON dưới dạng một tập hợp các cặp.

- **Cú pháp**:

```sql
json_each(json)
```

- **Ví dụ**:

```sql
SELECT * FROM json_each('{"name": "Alice", "age": 30}');
```

Trả về:

```
key   | value
------+-------
name  | "Alice"
age   | 30
```

#### 3. **json_extract_path()**

Hàm này trích xuất giá trị từ JSON theo đường dẫn (path) chỉ định.

- **Cú pháp**:

```sql
json_extract_path(json, varargs)
```

- **Ví dụ**:

```sql
SELECT json_extract_path('{"person": {"name": "Alice", "age": 30}}', 'person', 'name');
```

Trả về:

```
"Alice"
```

#### 4. **json_extract_path_text()**

Tương tự như `json_extract_path()`, nhưng trả về giá trị dưới dạng chuỗi (text) thay vì JSON.

- **Cú pháp**:

```sql
json_extract_path_text(json, varargs)
```

- **Ví dụ**:

```sql
SELECT json_extract_path_text('{"person": {"name": "Alice", "age": 30}}', 'person', 'name');
```

Trả về:

```
Alice
```

#### 5. **json_populate_record()**

Hàm này chuyển đổi dữ liệu JSON thành một bản ghi (record) trong PostgreSQL.

- **Cú pháp**:

```sql
json_populate_record(record, json)
```

- **Ví dụ**:

```sql
SELECT * FROM json_populate_record(NULL::person, '{"name": "Alice", "age": 30}');
```

Trả về một bản ghi với các trường tương ứng.

#### 6. **json_to_record()**

Hàm này chuyển đổi dữ liệu JSON thành các cột của một bản ghi (record).

- **Cú pháp**:

```sql
json_to_record(json) AS (column1 type, column2 type, ...)
```

- **Ví dụ**:

```sql
SELECT * FROM json_to_record('{"name": "Alice", "age": 30}') AS x(name text, age int);
```

Trả về:

```
name  | age
------+-----
Alice | 30
```

### 2. Các Hàm Cho JSONB

#### 1. **jsonb_each()**

Tương tự như `json_each()`, nhưng cho dữ liệu JSONB.

- **Cú pháp**:

```sql
jsonb_each(jsonb)
```

- **Ví dụ**:

```sql
SELECT * FROM jsonb_each('{"name": "Alice", "age": 30, "city": "New York"}'::jsonb);
```

Trả về:

```
key   | value
------+-------
name  | "Alice"
age   | 30
city  | "New York"
```

#### 2. **jsonb_extract_path()**

Tương tự như `json_extract_path()`, nhưng cho dữ liệu JSONB.

- **Cú pháp**:

```sql
jsonb_extract_path(jsonb, varargs)
```

- **Ví dụ**:

```sql
SELECT jsonb_extract_path('{"person": {"name": "Alice", "age": 30}}'::jsonb, 'person', 'name');
```

Trả về:

```
"Alice"
```

#### 3. **jsonb_set()**

Hàm này cho phép bạn thay đổi giá trị của một phần tử trong đối tượng JSONB.

- **Cú pháp**:

```sql
jsonb_set(jsonb, path, new_value)
```

- **Ví dụ**:

```sql
SELECT jsonb_set('{"name": "Alice", "age": 30}'::jsonb, '{age}', '35'::jsonb);
```

Trả về:

```
{"name": "Alice", "age": 35}
```

#### 4. **jsonb_insert()**

Hàm này thêm một phần tử vào một mảng JSONB hoặc đối tượng JSONB.

- **Cú pháp**:

```sql
jsonb_insert(jsonb, path, new_value)
```

- **Ví dụ**:

```sql
SELECT jsonb_insert('{"name": "Alice", "age": 30}'::jsonb, '{city}', '"New York"');
```

Trả về:

```
{"name": "Alice", "age": 30, "city": "New York"}
```

#### 5. **jsonb_array_elements()**

Hàm này trả về các phần tử của mảng JSONB dưới dạng các dòng riêng biệt.

- **Cú pháp**:

```sql
jsonb_array_elements(jsonb)
```

- **Ví dụ**:

```sql
SELECT * FROM jsonb_array_elements('["Alice", "Bob", "Charlie"]'::jsonb);
```

Trả về:

```
value
--------
"Alice"
"Bob"
"Charlie"
```

#### 6. **jsonb_array_length()**

Hàm này trả về chiều dài của một mảng JSONB.

- **Cú pháp**:

```sql
jsonb_array_length(jsonb)
```

- **Ví dụ**:

```sql
SELECT jsonb_array_length('["Alice", "Bob", "Charlie"]'::jsonb);
```

Trả về:

```
3
```

#### 7. **jsonb_each_text()**

Tương tự như `jsonb_each()`, nhưng trả về giá trị dưới dạng chuỗi (text).

- **Cú pháp**:

```sql
jsonb_each_text(jsonb)
```

- **Ví dụ**:

```sql
SELECT * FROM jsonb_each_text('{"name": "Alice", "age": "30"}'::jsonb);
```

Trả về:

```
key   | value
------+--------
name  | Alice
age   | 30
```

#### 8. **jsonb_to_record()**

Tương tự như `json_to_record()`, nhưng cho dữ liệu JSONB.

- **Cú pháp**:

```sql
jsonb_to_record(jsonb) AS (column1 type, column2 type, ...)
```

- **Ví dụ**:

```sql
SELECT * FROM jsonb_to_record('{"name": "Alice", "age": 30}'::jsonb) AS x(name text, age int);
```

Trả về:

```
name  | age
------+-----
Alice | 30
```
