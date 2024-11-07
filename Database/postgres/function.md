| Hàm                         | Kiểu Kết Quả            | Ví Dụ                                                                                              | Kết Quả                                |              |              |        |
| --------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------ | ------------ | ------ |
| `json_each(json)`           | `key text, value jsonb` | `SELECT * FROM json_each('{"a":"foo", "b":"bar"}');`                                               |                                        | value`<br>`a | "foo"`<br>`b | "bar"` |
| `json_each_text(json)`      | `key text, value text`  | `SELECT * FROM json_each_text('{"a":"foo", "b":"bar"}');`                                          |                                        | value`<br>`a | foo`<br>`b   | bar`   |
| `json_array_elements(json)` | `json`                  | `SELECT * FROM json_array_elements('[1,true, [2,false]]');`                                        | `json`<br>`1`<br>`true`<br>`[2,false]` |              |              |        |
| `json_strip_nulls(json)`    | `json`                  | `SELECT json_strip_nulls('[{"f1":1, "f2":null}, 2, null, 3]');`                                    | `[{"f1":1},2,null,3]`                  |              |              |        |
| `json_to_recordset(json)`   | `record`                | `SELECT * FROM json_to_recordset('[{"a":1,"b":"foo"}, {"a":"2","c":"bar"}]') AS x(a int, b text);` | `a                                     | b`<br>`1     | foo`<br>`2   | `      |

Giải thích các hàm:
- `json_each`(json): Trả về các cặp key-value từ đối tượng JSON dưới dạng key text và value jsonb.
- `json_each_text`(json): Tương tự như json_each, nhưng giá trị trả về là kiểu text.
- `json_array_elements`(json): Trả về từng phần tử trong một mảng JSON.
- `json_strip_nulls`(json): Xóa các khóa có giá trị null từ đối tượng JSON.
- `json_to_recordset`(json): Chuyển đổi JSON thành dạng bảng với các cột tương ứng.

## Hàm UNNEST

Hàm `UNNEST` trong PostgreSQL được sử dụng để biến một mảng thành các hàng riêng biệt. Đây là một công cụ hữu ích khi bạn muốn làm việc với dữ liệu kiểu mảng và cần chuyển đổi nó thành dạng có thể dễ dàng truy vấn hoặc xử lý hơn.

## Hàm UNNEST

Hàm `UNNEST` trong PostgreSQL được sử dụng để biến một mảng thành các hàng riêng biệt. Đây là một công cụ hữu ích khi bạn muốn làm việc với dữ liệu kiểu mảng và cần chuyển đổi nó thành dạng có thể dễ dàng truy vấn hoặc xử lý hơn.

#### 1.Chuyển Đổi Một Mảng Thành Các Hàng:

```sql
SELECT * FROM unnest(ARRAY[1, 2, 3]) AS value;
```

```md
## value

1
2
3
```

#### 2. Chuyển Đổi Nhiều Mảng:

```sql
SELECT *
FROM unnest(
    ARRAY[1, 2, 3],
    ARRAY['one', 'two', 'three']
) AS t(num, word);
```

```md
| num | word  |
| --- | ----- |
| 1   | one   |
| 2   | two   |
| 3   | three |
```

- UNNEST thường được sử dụng trong các tình huống như phân tích dữ liệu, tạo báo cáo hoặc khi cần truy vấn dữ liệu từ các mảng trong các bảng.

