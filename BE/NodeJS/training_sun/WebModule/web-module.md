## Introduction HTTP Module

`HTTP module` là một trong những module cốt lõi của Node.js, cung cấp các công cụ để tạo và quản lý các server HTTP. Module này cho phép xây dựng các ứng dụng web và API, cung cấp cách để xử lý các yêu cầu và phản hồi HTTP một cách dễ dàng và hiệu quả.

## Working with HTTP Module

```js
const http = require("http");

// Tạo một server
const server = http.createServer((req, res) => {
  res.statusCode = 200; // Mã trạng thái HTTP
  res.setHeader("Content-Type", "text/plain"); // Thiết lập tiêu đề phản hồi
  res.end("Hello, World!\n"); // Gửi phản hồi
});

// Lắng nghe trên cổng 3000
server.listen(3000, "127.0.0.1", () => {
  console.log("Server đang chạy tại http://127.0.0.1:3000/");
});
```

Trong ví dụ này:

- `http.createServer` tạo một server HTTP.
- `req` là đối tượng yêu cầu (request) đại diện cho yêu cầu HTTP.
- `res` là đối tượng phản hồi (response) đại diện cho phản hồi HTTP.
- `res.end` kết thúc phản hồi và gửi nó đến client.

## Introduction URL Module

URL module là một module cốt lõi khác của Node.js, cung cấp các công cụ để phân tích và định dạng URL. Module này rất hữu ích khi làm việc với các đường dẫn URL, cho phép dễ dàng lấy các phần khác nhau của một URL và tạo ra các URL mới.

## Working with URL Module

**Phân tích một URL:**

```js
const url = require("url");

const myURL = new URL("https://example.com:8000/path/name?query=string#hash");

console.log(myURL.hostname); // 'example.com'
console.log(myURL.port); // '8000'
console.log(myURL.pathname); // '/path/name'
console.log(myURL.search); // '?query=string'
console.log(myURL.hash); // '#hash'
```

**Tạo một URL:**

```js
const myNewURL = new URL("/path/name", "https://example.com");
myNewURL.searchParams.append("query", "string");
myNewURL.hash = "hash";

console.log(myNewURL.href); // 'https://example.com/path/name?query=string#hash'
```

Trong ví dụ này:

- `new URL(input[, base])` tạo một URL mới. Nếu input không phải là URL đầy đủ, base sẽ được sử dụng làm URL cơ sở.
- `myURL.hostname`, `myURL.port`, `myURL.pathname`, `myURL.search`, và `myURL.hash` trả về các phần khác nhau của URL.
- `searchParams.append(name, value)` thêm một cặp tên-giá trị vào chuỗi truy vấn của URL.
