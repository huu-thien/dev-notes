## What is Binary Code?

Binary code là hệ thống số cơ bản nhất được sử dụng bởi máy tính và các thiết bị kỹ thuật số để lưu trữ và xử lý dữ liệu. Hệ thống này chỉ sử dụng hai ký hiệu: 0 và 1, được gọi là bit (binary digit).

- **Bit:** Đơn vị cơ bản nhất của dữ liệu số, có thể là 0 hoặc 1.
- **Byte:** Một nhóm 8 bit. Ví dụ, 10101010 là một byte.
- **Tại sao dùng binary?:** Máy tính sử dụng các mạch điện tử để xử lý dữ liệu, và binary code phù hợp nhất với trạng thái của các mạch này (bật/tắt hoặc 1/0).

## Introduction to Buffers

Buffers là một khái niệm cơ bản trong Node.js để xử lý dữ liệu nhị phân. Buffers cung cấp một cách để lưu trữ và thao tác với các chuỗi byte mà không cần phải chuyển đổi sang định dạng chuỗi (string).

- **Lưu trữ nhị phân:** Buffers cho phép lưu trữ dữ liệu nhị phân một cách trực tiếp.
- **Hiệu suất cao:** Vì không cần chuyển đổi dữ liệu, Buffers hoạt động rất hiệu quả với các hoạt động nhập/xuất (I/O).

## Buffers in Node.js

Trong Node.js, lớp `Buffer` được sử dụng để tạo và thao tác với dữ liệu nhị phân. Buffers rất hữu ích khi làm việc với các hoạt động I/O như đọc/ghi tệp, làm việc với streams, hoặc giao tiếp qua mạng.

**Tạo Buffer**
Có nhiều cách để tạo một Buffer trong Node.js:

```js
// Tạo một Buffer từ một chuỗi
const buf1 = Buffer.from("Hello, World!", "utf8");

// Tạo một Buffer với kích thước cố định
const buf2 = Buffer.alloc(10); // Buffer với 10 byte

// Tạo một Buffer với kích thước cố định và khởi tạo bằng giá trị tùy ý
const buf3 = Buffer.allocUnsafe(10); // Buffer với 10 byte, không khởi tạo
```

## Working with Buffers in Node.js

**Ghi dữ liệu vào Buffer**

```js
const buf = Buffer.alloc(256);
const len = buf.write("Hello, World!", "utf8");
console.log(`Octets written: ${len}`); // Số byte đã ghi
```

**Đọc dữ liệu từ Buffer**

```js
const buf = Buffer.from("Hello, World!", "utf8");
console.log(buf.toString("utf8")); // In ra 'Hello, World!'
console.log(buf.toString("hex")); // In ra chuỗi hex của buffer
console.log(buf.toString("base64")); // In ra chuỗi base64 của buffer
```

**So sánh Buffers**

```js
const buf1 = Buffer.from("ABC");
const buf2 = Buffer.from("ABD");
const result = buf1.compare(buf2);

if (result < 0) {
  console.log(`${buf1} comes before ${buf2}`);
} else if (result === 0) {
  console.log(`${buf1} is the same as ${buf2}`);
} else {
  console.log(`${buf1} comes after ${buf2}`);
}
```

**Cắt (Slice) Buffer**

```js
const buf = Buffer.from("Hello, World!", "utf8");
const slicedBuf = buf.slice(0, 5);
console.log(slicedBuf.toString()); // In ra 'Hello'
```

**Copy Buffer**

```js
const buf1 = Buffer.from("Hello, World!", "utf8");
const buf2 = Buffer.alloc(5);
buf1.copy(buf2, 0, 0, 5);
console.log(buf2.toString()); // In ra 'Hello'
```
