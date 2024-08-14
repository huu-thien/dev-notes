## What are Streams?

Streams là một khái niệm trong lập trình, đặc biệt phổ biến trong Node.js, để xử lý dữ liệu đọc/ghi theo cách tuần tự và từng phần. Streams có thể hiểu đơn giản là một luồng dữ liệu liên tục, không cần phải nạp toàn bộ dữ liệu vào bộ nhớ trước khi xử lý.

## 2. Why use Streams?

Streams giúp cải thiện hiệu suất và giảm thiểu sử dụng bộ nhớ khi xử lý các dữ liệu lớn hoặc liên tục như tệp tin lớn, yêu cầu HTTP, hoặc dữ liệu từ cơ sở dữ liệu.

- `Hiệu quả bộ nhớ:` Không cần nạp toàn bộ dữ liệu vào bộ nhớ, giúp tiết kiệm tài nguyên.
- `Hiệu suất cao:` Xử lý dữ liệu từng phần một cách nhanh chóng.
- `Non-blocking I/O:` Tận dụng cơ chế I/O không đồng bộ của Node.js.

## Streams in Node.js

Trong Node.js, có 4 loại streams chính:

- `Readable streams:` Dữ liệu có thể được đọc từ streams này (ví dụ: fs.createReadStream).
- `Writable streams:` Dữ liệu có thể được ghi vào streams này (ví dụ: fs.createWriteStream).
- `Duplex streams:` Cả đọc và ghi dữ liệu (ví dụ: net.Socket).
- `Transform streams:` Thực hiện các phép biến đổi dữ liệu trong khi đọc và ghi (ví dụ: zlib.createGzip).

## Working with Node.js Streams

**Readable Streams**
Dưới đây là một ví dụ về cách sử dụng `Readable streams` để đọc dữ liệu từ tệp:

```js
const fs = require("fs");

// Tạo một readable stream từ tệp
const readableStream = fs.createReadStream("example.txt", "utf8");

readableStream.on("data", (chunk) => {
  console.log("New chunk received:", chunk);
});

readableStream.on("end", () => {
  console.log("No more data to read.");
});
```

**Writable Streams**
Dưới đây là một ví dụ về cách sử dụng Writable `streams` để ghi dữ liệu vào tệp:

```js
const fs = require("fs");

// Tạo một writable stream đến tệp
const writableStream = fs.createWriteStream("output.txt");

writableStream.write("Hello, World!\n");
writableStream.write("Writing some more data.\n");
writableStream.end("End of the stream.");
```

**Piping Streams**
`Streams` có thể được kết nối với nhau sử dụng pipe, cho phép dữ liệu được truyền từ stream này sang stream khác một cách hiệu quả:

```js
const fs = require("fs");

// Tạo một readable stream từ tệp
const readableStream = fs.createReadStream("example.txt");

// Tạo một writable stream đến tệp
const writableStream = fs.createWriteStream("output.txt");

// Kết nối readable stream với writable stream
readableStream.pipe(writableStream);
```

**Transform Streams**
Transform streams cho phép bạn thực hiện các phép biến đổi dữ liệu trong khi đọc và ghi. Dưới đây là một ví dụ sử dụng Transform stream để chuyển đổi văn bản thành chữ hoa:

```js
const { Transform } = require("stream");

// Tạo một transform stream để chuyển đổi văn bản thành chữ hoa
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  },
});

// Tạo một readable stream và writable stream
const readableStream = fs.createReadStream("example.txt");
const writableStream = fs.createWriteStream("output.txt");

// Kết nối các streams với nhau
readableStream.pipe(upperCaseTransform).pipe(writableStream);
```
