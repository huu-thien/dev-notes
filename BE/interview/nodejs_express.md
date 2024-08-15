## 2. Node.js

### 2.1 Middleware

- **Middleware trong Node.js là gì?**

  **Middleware** trong Node.js, đặc biệt là trong các framework như Express.js, là các hàm trung gian được thực thi trong quá trình xử lý yêu cầu từ client đến server. Mỗi middleware có thể can thiệp vào yêu cầu (request) và phản hồi (response) hoặc kết thúc chuỗi xử lý bằng cách gửi phản hồi về cho client. Nếu không, middleware cần gọi `next()` để chuyển xử lý sang middleware tiếp theo.

  **Các loại middleware phổ biến:**
  - **Application-level middleware**: Được sử dụng trên toàn ứng dụng.
  - **Router-level middleware**: Áp dụng cho các route cụ thể.
  - **Error-handling middleware**: Xử lý lỗi xảy ra trong quá trình xử lý yêu cầu.
  - **Built-in middleware**: Các middleware tích hợp sẵn trong Express.js (ví dụ: `express.json()` để parse JSON).
  - **Third-party middleware**: Các middleware do bên thứ ba phát triển (ví dụ: `body-parser`).

- **Làm thế nào để tạo middleware trong Express.js?**

  Middleware trong Express.js được tạo ra dưới dạng một hàm có chữ ký `(req, res, next)` và thường được sử dụng với `app.use()` hoặc `app.METHOD()`.

  **Ví dụ tạo một middleware để log yêu cầu:**
  ```javascript
  function logRequest(req, res, next) {
      console.log(`${req.method} ${req.url}`);
      next(); // Chuyển sang middleware tiếp theo
  }

  app.use(logRequest);
  ```

Middleware này sẽ log phương thức HTTP và URL của mỗi yêu cầu trước khi chuyển sang middleware hoặc route handler tiếp theo.

### 2.2 Exception Handling

- **Bạn xử lý lỗi trong Node.js như thế nào?**

Trong Node.js, có nhiều cách để xử lý lỗi tùy thuộc vào việc bạn đang xử lý mã đồng bộ hay bất đồng bộ:

- **Đối với mã đồng bộ**: Bạn có thể sử dụng `try-catch` để bắt các lỗi.
```js
try {
    // Mã có thể gây lỗi
} catch (error) {
    console.error(error);
}

```

### 2.3 Routing

- **Router trong Express.js hoạt động như thế nào?**

**Router** trong Express.js cho phép bạn tách riêng các route và tổ chức chúng một cách logic. Thay vì định nghĩa tất cả các route trong một tệp duy nhất, bạn có thể tạo ra các router riêng biệt cho từng tài nguyên hoặc module của ứng dụng.

**Ví dụ về Router trong Express.js:**

```js
const express = require('express');
const router = express.Router();

// Định nghĩa route cho tài nguyên người dùng
router.get('/users', (req, res) => {
    res.send('Get all users');
});

router.post('/users', (req, res) => {
    res.send('Create a new user');
});

// Sử dụng router trong ứng dụng
app.use('/api', router);

```

### 2.4 Event Loop

- **Event Loop trong Node.js là gì?**
 
**Event Loop** là cơ chế cho phép Node.js thực thi mã không đồng bộ. Node.js là một nền tảng đơn luồng (single-threaded), nhưng nhờ vào Event Loop, nó có thể xử lý nhiều yêu cầu đồng thời mà không cần phải chờ đợi yêu cầu trước đó hoàn thành.
  
   **Cách hoạt động:**
  
   - Event Loop lấy các sự kiện từ hàng đợi (queue) và xử lý chúng từng cái một.
  - Các tác vụ nặng như I/O hoặc truy vấn cơ sở dữ liệu được chuyển đến các worker thread (thread phụ) hoặc hệ thống (ví dụ: I/O không đồng bộ).
  - Sau khi hoàn thành, kết quả của các tác vụ này được đẩy trở lại hàng đợi để xử lý tiếp.  
 **Ví dụ:**
 ```js
 console.log('Start');

setTimeout(() => {
    console.log('This runs after 2 seconds');
}, 2000);

console.log('End');

```

# Câu hỏi thường gặp về Express.js

## 1. Giới thiệu về Express.js

- **Express.js là gì và tại sao lại sử dụng nó?**

  **Express.js** là một framework web nhẹ cho Node.js, cung cấp các công cụ và API để phát triển ứng dụng web và API một cách nhanh chóng và hiệu quả. Express.js nổi tiếng với sự đơn giản và linh hoạt, cho phép bạn xây dựng các ứng dụng server-side nhanh chóng mà không cần cấu hình phức tạp.

  **Lý do sử dụng Express.js:**
  - **Đơn giản và nhẹ:** Cung cấp một API đơn giản, dễ sử dụng mà không yêu cầu cấu hình phức tạp.
  - **Cộng đồng lớn:** Có một cộng đồng phát triển rộng lớn và nhiều plugin, middleware hỗ trợ.
  - **Tính mở rộng:** Dễ dàng tích hợp với các thư viện và công cụ khác để mở rộng tính năng.

## 2. Middleware trong Express.js

- **Middleware trong Express.js là gì?**

  Middleware là các hàm được thực thi trong quá trình xử lý yêu cầu HTTP. Chúng có thể thực hiện các tác vụ như xử lý dữ liệu đầu vào, xác thực, logging hoặc xử lý lỗi trước khi yêu cầu đến route handler.

- **Làm thế nào để định nghĩa và sử dụng middleware trong Express.js?**

  Middleware có thể được định nghĩa dưới dạng hàm và được đăng ký toàn cục hoặc cho từng route cụ thể. Bạn có thể sử dụng `app.use()` để đăng ký middleware cho toàn bộ ứng dụng hoặc cho các route riêng biệt.

## 3. Routing trong Express.js

- **Routing trong Express.js là gì?**

  Routing là quá trình xác định cách ứng dụng xử lý các yêu cầu đến các endpoint cụ thể. Trong Express.js, routing cho phép bạn ánh xạ các URL yêu cầu đến các hàm xử lý yêu cầu cụ thể (route handlers).

- **Làm thế nào để định nghĩa các route trong Express.js?**

  Bạn có thể định nghĩa các route bằng cách sử dụng các phương thức như `app.get()`, `app.post()`, `app.put()`, và `app.delete()` để xử lý các yêu cầu HTTP tương ứng với các endpoint cụ thể.

## 4. Xử lý lỗi trong Express.js

- **Làm thế nào để xử lý lỗi trong Express.js?**

  Express.js cung cấp một cách tiếp cận dễ dàng để xử lý lỗi thông qua middleware xử lý lỗi. Bạn có thể định nghĩa một middleware xử lý lỗi để bắt các lỗi phát sinh trong ứng dụng và trả về phản hồi thích hợp cho client.

- **Có những loại lỗi nào trong Express.js và cách xử lý chúng?**

  - **Lỗi HTTP:** Các lỗi như 404 (Not Found) hoặc 500 (Internal Server Error) có thể được xử lý bằng cách sử dụng middleware lỗi.
  - **Lỗi đồng bộ và bất đồng bộ:** Các lỗi có thể xảy ra đồng bộ trong route handlers hoặc bất đồng bộ trong các tác vụ như truy vấn cơ sở dữ liệu.

## 5. Tích hợp cơ sở dữ liệu với Express.js

- **Làm thế nào để tích hợp cơ sở dữ liệu vào ứng dụng Express.js?**

  Bạn có thể tích hợp cơ sở dữ liệu vào Express.js bằng cách sử dụng các thư viện ORM hoặc trực tiếp kết nối với cơ sở dữ liệu qua các thư viện kết nối cơ sở dữ liệu. Ví dụ, bạn có thể sử dụng Mongoose để làm việc với MongoDB hoặc Sequelize cho các cơ sở dữ liệu SQL.

- **Có những công cụ hoặc thư viện nào phổ biến để làm việc với cơ sở dữ liệu trong Express.js?**

  - **Mongoose:** Một thư viện để làm việc với MongoDB.
  - **Sequelize:** Một ORM cho các cơ sở dữ liệu SQL như PostgreSQL, MySQL, SQLite.
  - **Knex.js:** Một query builder cho các cơ sở dữ liệu SQL.

## 6. Tích hợp với các công cụ và thư viện khác

- **Làm thế nào để tích hợp Express.js với các công cụ và thư viện khác như Passport, Helmet, hoặc CORS?**

  Bạn có thể tích hợp các công cụ và thư viện này bằng cách sử dụng middleware. Ví dụ:
  - **Passport:** Dùng để xác thực người dùng, bạn có thể cấu hình Passport như một middleware để xử lý xác thực.
  - **Helmet:** Cung cấp các header bảo mật cho ứng dụng, bạn có thể thêm Helmet vào ứng dụng Express.js bằng cách sử dụng middleware.
  - **CORS:** Để cấu hình các chính sách CORS, bạn có thể sử dụng middleware `cors` để quản lý quyền truy cập từ các nguồn khác.

## 7. Các phương pháp HTTP trong Express.js

- **Các phương pháp HTTP phổ biến trong Express.js là gì?**

  - **GET:** Dùng để lấy dữ liệu từ server.
  - **POST:** Dùng để gửi dữ liệu đến server để tạo mới hoặc cập nhật tài nguyên.
  - **PUT:** Dùng để cập nhật dữ liệu hiện có trên server.
  - **DELETE:** Dùng để xóa dữ liệu trên server.

- **Làm thế nào để xử lý các phương pháp HTTP trong Express.js?**

  Bạn có thể sử dụng các phương thức của đối tượng `app` như `app.get()`, `app.post()`, `app.put()`, và `app.delete()` để định nghĩa các route xử lý các phương pháp HTTP tương ứng.

## 8. Xử lý dữ liệu đầu vào và dữ liệu phản hồi

- **Làm thế nào để xử lý dữ liệu đầu vào trong Express.js?**

  Bạn có thể sử dụng middleware như `body-parser` để phân tích dữ liệu đầu vào từ các yêu cầu HTTP. Middleware này giúp bạn dễ dàng trích xuất dữ liệu từ request body, query parameters, và các phần khác của yêu cầu.

- **Làm thế nào để gửi dữ liệu phản hồi từ server trong Express.js?**

  Bạn có thể sử dụng phương thức `res.send()` hoặc `res.json()` để gửi phản hồi từ server. `res.send()` có thể gửi bất kỳ loại dữ liệu nào, trong khi `res.json()` gửi dữ liệu dưới dạng JSON.

## 9. CORS (Cross-Origin Resource Sharing)

- **CORS là gì và tại sao cần cấu hình CORS trong ứng dụng Express.js?**

  **CORS** là một cơ chế bảo mật trình duyệt cho phép hoặc từ chối các yêu cầu từ các nguồn khác nhau (origin) tới server. Cấu hình CORS trong Express.js là cần thiết để đảm bảo rằng ứng dụng của bạn có thể chấp nhận các yêu cầu từ các nguồn khác nhau một cách an toàn.

- **Làm thế nào để cấu hình CORS trong Express.js?**

  Bạn có thể sử dụng middleware `cors` để cấu hình các chính sách CORS cho ứng dụng Express.js. Middleware này cho phép bạn định nghĩa các quy tắc như cho phép các nguồn gốc cụ thể hoặc cho phép các phương thức HTTP cụ thể.

## 10. Testing trong Express.js

- **Có những công cụ nào để thực hiện testing cho ứng dụng Express.js?**

  Một số công cụ phổ biến để testing ứng dụng Express.js bao gồm:
  - **Mocha:** Một framework testing cho Node.js.
  - **Chai:** Một thư viện assertion có thể được sử dụng với Mocha.
  - **Supertest:** Một thư viện để thực hiện các kiểm tra HTTP cho các ứng dụng Express.js.
  - **Jest:** Một framework testing toàn diện có thể được sử dụng cho testing Express.js.

- **Làm thế nào để viết và chạy các bài kiểm tra cho ứng dụng Express.js?**

  Bạn có thể viết các bài kiểm tra cho các route, middleware và các thành phần khác của ứng dụng bằng cách sử dụng các công cụ testing như Mocha hoặc Jest. Các bài kiểm tra có thể bao gồm kiểm tra phản hồi từ các endpoint và kiểm tra các hành vi của middleware.


