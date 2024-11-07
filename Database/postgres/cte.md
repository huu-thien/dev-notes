## CTE (Common Table Expression)

CTE là một tính năng quan trọng trong SQL, cho phép người dùng đặt tên và sử dụng một bảng tạm thời trong phạm vi của một truy vấn cụ thể. CTE được sử dụng để xử lý các câu truy vấn phức tạp, thường kết hợp với các câu lệnh SELECT, INSERT, UPDATE hoặc DELETE, giúp tăng tính rõ ràng và dễ đọc hiểu, đồng thời quản lý các đoạn mã SQL hiệu quả hơn.

### Các Loại CTE

| Loại CTE          | Mục Đích                                                                                | Cách Sử Dụng                                                                                     |
|-------------------|----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| `WITH`            | Được sử dụng để tạo các CTE không đệ quy.                                            | CTE được định nghĩa bằng `WITH` sẽ được tính toán một lần và kết quả của nó sẽ được sử dụng trong truy vấn chính. |
| `WITH RECURSIVE`  | Được sử dụng để tạo các CTE đệ quy, cho phép một truy vấn tự gọi lại chính nó.       | CTE đệ quy bao gồm hai phần: phần cơ sở (base case) và phần đệ quy (recursive case). Phần cơ sở được thực thi một lần, sau đó phần đệ quy sẽ được thực thi lặp lại cho đến khi không còn kết quả nào được trả về. |

### So Sánh CTEs với Sub-queries

| Tiêu Chí             | CTEs                                                                                 | Sub-queries                                                                  |
|----------------------|--------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| Khai Báo              | Xác định bằng mệnh đề `WITH`.                                                       | Xác định trong một câu truy vấn khác, được đặt trong dấu ngoặc đơn.       |
| Tính Đọc Hiểu        | Dễ đọc hiểu, dễ bảo trì vì được tách ra từng thành phần nhỏ, tách biệt với câu truy vấn chính. | Có thể làm cho câu truy vấn trở nên phức tạp, gây khó hiểu cho mục đích của toàn đoạn mã. |
| Khả Năng Tái Sử Dụng | Có thể sử dụng lại nhiều lần trong cùng một truy vấn, khả dụng cho đến khi truy vấn tiếp theo được thực thi. | Sử dụng một lần trong truy vấn, tại nơi được khai báo.                    |
| Ứng Dụng             | Sử dụng trong các câu truy vấn phức tạp, chia thành các thành phần nhỏ hơn, dễ đọc hiểu, quản lý đoạn mã. | Sử dụng trong trường hợp câu truy vấn đơn giản, không cần sử dụng lại đoạn mã nhiều lần. |
