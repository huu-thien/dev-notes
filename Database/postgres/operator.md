| Kí Hiệu     | Kiểu Truyền Vào | Mô Tả                                    | Cú Pháp                                                        | Ví Dụ                                                       | Kết Quả                  |
|-------------|------------------|------------------------------------------|---------------------------------------------------------------|------------------------------------------------------------|---------------------------|
| `->`        | `int`            | Lấy một phần tử từ mảng JSON           | `json_column -> 2`                                            | `‘[{"a":"test"},{"b":"test1"},{"c":"test2"}]’::json->2`   | `{"c":"test2"}`          |
| `->`        | `text`           | Lấy giá trị từ một trường JSON          | `json_column -> 'key'`                                       | `‘{"name":"John","age":30}’::json->'name'`                | `"John"`                  |
| `->>`       | `int`            | Lấy giá trị từ phần tử mảng và chuyển thành chuỗi | `json_column ->> 2`                                       | `‘[{"a":"test"},{"b":"test1"},{"c":"test2"}]’::json->>2` | `"test2"`                 |
| `->>`       | `text`           | Lấy giá trị từ một trường JSON và chuyển thành chuỗi | `json_column ->> 'key'`                                     | `‘{"name":"John","age":30}’::json->>'age'`               | `30`                      |
| `#>`        | JSON             | Lấy giá trị từ đường dẫn trong JSON     | `json_column #> '{key1, key2}'`                              | `‘{"address":{"city":"Hanoi"}}’::json#>'{address, city}'` | `"Hanoi"`                 |
| `#>>`       | JSON             | Lấy giá trị và chuyển thành chuỗi      | `json_column #>> '{key1, key2}'`                             | `‘{"address":{"city":"Hanoi"}}’::json#>>'{address, city}'` | `"Hanoi"`                 |
| `@>`        | JSONB            | Kiểm tra JSONB có chứa một phần tử JSONB khác không | `jsonb_column @> jsonb_value`                               | `SELECT * FROM example WHERE data @> '{"age": 30}';`     | TRUE hoặc FALSE           |
| `<@`        | JSONB            | Kiểm tra JSONB có phải là phần tử của JSONB khác không | `jsonb_value <@ jsonb_column`                               | `SELECT * FROM example WHERE '{"age": 30}' <@ data;`     | TRUE hoặc FALSE           |
| `?`         | JSONB            | Kiểm tra khóa có tồn tại                | `jsonb_column ? 'key'`                                      | `SELECT * FROM example WHERE data ? 'name';`              | TRUE hoặc FALSE           |
| `?|`        | JSONB            | Kiểm tra có bất kỳ khóa nào trong danh sách | `jsonb_column ?| array['key1', 'key2']`                   | `SELECT * FROM example WHERE data ?| array['name', 'age'];` |
| `?&`        | JSONB            | Kiểm tra JSONB có chứa tất cả các khóa  | `jsonb_column ?& array['key1', 'key2']`                    | `SELECT * FROM example WHERE data ?& array['name', 'age'];` |
| `jsonb_set` | JSONB           | Cập nhật một giá trị trong JSONB        | `jsonb_set(jsonb_column, '{key}', 'new_value')`            | `UPDATE example SET data = jsonb_set(data, '{age}', '31') WHERE id = 1;` |
| `jsonb_insert` | JSONB        | Chèn một giá trị vào JSONB              | `jsonb_insert(jsonb_column, '{key}', 'new_value')`          | `UPDATE example SET data = jsonb_insert(data, '{skills}', '"Python"') WHERE id = 1;` |
| `-`         | JSONB            | Xóa một khóa từ JSONB                   | `jsonb_column - 'key'`                                      | `UPDATE example SET data = data - 'age' WHERE id = 1;`    |

## Toán Tử JSONB trong PostgreSQL

### Các Toán Tử Dành Riêng Cho JSONB

Ngoài các toán tử hỗ trợ khi thao tác với JSON, JSONB có một số toán tử dành riêng như:

- Bằng (`=`): Kiểm tra sự bằng nhau giữa hai JSONB.
- Có chứa (`@>`): Kiểm tra xem JSONB đầu tiên có chứa JSONB thứ hai không.
- Có chứa (`<@`): Kiểm tra xem JSONB thứ hai có phải là phần tử của JSONB đầu tiên không.
- Tồn tại key (`?`): Kiểm tra sự tồn tại của một khóa trong JSONB.

### Toán Tử Concatenation và Subtraction

JSONB giới thiệu hai toán tử đặc biệt:

- Concatenation (`||`): Nối hai đối tượng JSONB lại với nhau.
- Subtraction (`-`): Xóa một khóa từ JSONB.

### Ví Dụ

1. **Sử dụng Toán Tử Concatenation**:
- Ở ví dụ dưới, chúng ta sẽ sử dụng toán tử concatenation để thêm hoặc cập nhật một địa chỉ với person có tên là Sonia và sử dụng `RETURNING` để cập nhật lại giá trị:
   ```sql
   UPDATE persons_b
   SET person = person || '{"address": "DN"}'::jsonb
   WHERE person @> '{"name":"Sonia"}'
   RETURNING person;
   ```
