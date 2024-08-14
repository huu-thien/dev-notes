## Introduction to Callbacks

Trong Node.js, callbacks là một khái niệm quan trọng, đặc biệt khi làm việc với các hoạt động không đồng bộ (asynchronous operations) như đọc/ghi tệp, truy vấn cơ sở dữ liệu, hoặc gọi API.
Callbacks là các hàm được truyền như là đối số cho các hàm khác, và chúng sẽ được gọi lại (hence "callback") sau khi một hoạt động không đồng bộ hoàn thành.

Cách hoạt động của callbacks:

- Hàm callback: Là một hàm được truyền như một đối số cho một hàm khác và được gọi khi hoạt động không đồng bộ hoàn thành.
- Không đồng bộ: Node.js sử dụng mô hình không đồng bộ, nghĩa là không chặn (non-blocking) và các tác vụ có thể được thực hiện đồng thời.

## Callbacks Example

```js
const fs = require("fs");

fs.readFile("example.txt", "utf8", (err, data) => {
  if (err) {
    return console.error(err);
  }
  console.log(data);
});
```

Trong ví dụ này:

- `fs.readFile` là một hàm không đồng bộ dùng để đọc nội dung của tệp `example.txt`.
- Hàm callback `(err, data)` được truyền như một đối số cho `fs.readFile`. Nó được gọi khi hoạt động đọc tệp hoàn thành.
- Nếu có lỗi xảy ra, `err` sẽ chứa thông tin lỗi, nếu không, `data` sẽ chứa nội dung của tệp.

## The Problems with Callbacks

Mặc dù callbacks là một phần quan trọng của Node.js, chúng cũng có một số hạn chế và vấn đề, đặc biệt khi code trở nên phức tạp:

_Callback Hell_: Khi có nhiều callbacks lồng nhau, code trở nên khó đọc và duy trì. Đây được gọi là "callback hell".

```js
doFirstTask((err, result) => {
  if (err) return handleError(err);
  doSecondTask(result, (err, result2) => {
    if (err) return handleError(err);
    doThirdTask(result2, (err, result3) => {
      if (err) return handleError(err);
      // Tiếp tục...
    });
  });
});
```

**Error Handling**: Việc quản lý lỗi trong các callbacks lồng nhau có thể trở nên phức tạp và dễ gây nhầm lẫn.
**Inversion of Control**: Callbacks đôi khi có thể dẫn đến việc mất quyền kiểm soát luồng chương trình, đặc biệt khi làm việc với các thư viện hoặc API của bên thứ ba.
