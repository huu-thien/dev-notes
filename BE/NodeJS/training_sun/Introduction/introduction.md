## Node.js là gì ?

- Javascript là ngôn ngữ lập trình, muốn chạy thì cần phải có môi trường để chạy
- Các môi trường phổ biến để chạy JS : trình duyệt, node.js, Deno, Bun,...

- Node.js là môi trường chạy Javascript ngoài trình duyệt, vì thế nó có thể làm server backend

## Lịch sử Node.js

- Node.js được tạo ra bởi Ryan Dahl vào năm 2009
- Sau này Ryan Dahl tạo ra thêm Deno, nhưng đến nay vẫn khá ít người dùng Deno

## Tại sao chọn Node.js viết Back end

- Node.js viết bằng js, nên một lập trình viên FE cũng có thể dễ dàng học và viết được BE. Từ đó tiết kiệm chi phí nhân sự
- Node.js có hiệu suất nhanh hơn đáng kể khi so với PHP
- Mặc dù tốc độ thua Java, .NET, Go nhưng thực tế chúng ta không cần nhiều tốc độ đến thế, Fastify Node.js có thể cho ra **45659 req/s**, và express là **9888 req/s**
- Hầu hết các nút thắc cổ chai ở server nằm ở database chứ ít khi nằm ở ngôn ngữ chúng ta chọn

> Nếu cảm thấy Node.js chậm, không xử lý được hàng nghìn giao dịch mỗi giây => chỉ cần nâng cấp Server

## Hiểu lầm về Node.js và Javascript

Ai cũng biết Javascript là ngôn ngữ đơn luồng, nhưng môi trường chạy của nó lại khác

Ví dụ trình duyệt, đây là môi trường đa luồng, các WebAPI như setTimeout đều chạy ở luồng khác

Node.js cũng thế, nó có thể chạy đa luồng => có thể tận dụng được hết sức mạnh của CPU ngày nay
