---
tags: dotnet 
---
### Conditional logical operators

- short-circuit: thực hiện từ trái qua phải, tự động dừng nếu đủ thông tin để trả về kết quả => cần tránh khi sử dụng với các function vì không phải lúc nào function cũng được gọi

### If statement

if (o is int i): để chắc chắn o là kiểu int, đồng thời có thể sử dụng i trong câu if

### Switch statement

- goto: có thể đi với 1 label hoặc 1 case (goto case 1;)
- switch expression: int i = s switch { "one" => 1, "two" => 2, _ => -1};