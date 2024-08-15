# Câu Hỏi Phỏng Vấn Backend Engineer và Node.js (Mở Rộng)
## 1. Kiến Thức Cơ Bản về Backend

### 1.1 Backend là gì? Bạn có thể mô tả các thành phần chính trong kiến trúc backend không?

**Backend** là phần "phía sau" của một ứng dụng, chịu trách nhiệm xử lý dữ liệu, thực hiện logic và quản lý giao tiếp giữa frontend và cơ sở dữ liệu. Các thành phần chính của kiến trúc backend bao gồm:

- **Server**: Máy chủ xử lý các yêu cầu từ client và trả về phản hồi. Các công nghệ phổ biến bao gồm Node.js, Django, hoặc Ruby on Rails.
- **Database**: Nơi lưu trữ dữ liệu của ứng dụng. Cơ sở dữ liệu có thể là SQL (MySQL, PostgreSQL) hoặc NoSQL (MongoDB).
- **API**: Giao diện lập trình ứng dụng giúp client (thường là frontend) giao tiếp với server. Thông qua API, các yêu cầu từ client sẽ được chuyển đến server để xử lý và phản hồi.
- **Business Logic**: Là phần xử lý logic của ứng dụng, thường bao gồm các quy tắc, điều kiện, và quy trình xử lý dữ liệu.
- **Authentication & Authorization**: Cơ chế xác thực người dùng và quản lý quyền truy cập vào các tài nguyên của ứng dụng.

### 1.2 RESTful API là gì? Nguyên tắc hoạt động của nó như thế nào?

**RESTful API** (Representational State Transfer) là một kiểu kiến trúc API, tuân theo các nguyên tắc REST. Nguyên tắc chính bao gồm:

- **Stateless**: Mỗi yêu cầu từ client đến server đều độc lập và không dựa trên bất kỳ trạng thái nào từ yêu cầu trước đó.
- **Uniform Interface**: Sử dụng các phương thức HTTP chuẩn (GET, POST, PUT, DELETE) để thực hiện các thao tác CRUD (Create, Read, Update, Delete).
- **Resource-Based**: Mỗi tài nguyên trong hệ thống được biểu diễn qua một URI (Uniform Resource Identifier) duy nhất.
- **Client-Server**: Client và server hoạt động độc lập, và giao tiếp thông qua HTTP.
- **Cacheable**: Các phản hồi có thể được cache để giảm tải cho server.

### 1.3 Sự khác nhau giữa REST và GraphQL là gì?

**REST** và **GraphQL** đều là các cách để giao tiếp giữa client và server, nhưng chúng có các đặc điểm khác nhau:

- **REST**: 
  - Các endpoint cố định, mỗi endpoint thực hiện một nhiệm vụ cụ thể (ví dụ: `/users` cho danh sách người dùng).
  - Dữ liệu trả về có thể quá nhiều (over-fetching) hoặc quá ít (under-fetching) so với yêu cầu của client.
  - Phải thực hiện nhiều request để lấy các loại dữ liệu khác nhau từ các endpoint khác nhau.

- **GraphQL**:
  - Có một endpoint duy nhất, client có thể yêu cầu chính xác các trường dữ liệu cần thiết.
  - Tránh over-fetching và under-fetching bằng cách cho phép client tùy chỉnh truy vấn dữ liệu.
  - Hỗ trợ tốt hơn cho các mối quan hệ phức tạp giữa các tài nguyên và giảm số lượng request.

### 1.4 Bạn có hiểu biết về các phương pháp xác thực và ủy quyền như OAuth, JWT không?

- **OAuth** (Open Authorization): Là một giao thức ủy quyền cho phép một ứng dụng (bên thứ ba) truy cập vào tài nguyên của người dùng mà không cần tiết lộ mật khẩu của họ. OAuth thường được sử dụng khi cần liên kết tài khoản của người dùng với các dịch vụ bên ngoài, chẳng hạn như đăng nhập bằng Google hoặc Facebook.

- **JWT** (JSON Web Token): Là một chuẩn mở để truyền thông tin dưới dạng JSON giữa các bên một cách an toàn. JWT thường được sử dụng cho việc xác thực người dùng. Khi người dùng đăng nhập, server sẽ tạo ra một JWT chứa các thông tin xác thực, và client sẽ gửi JWT này kèm theo các yêu cầu tiếp theo để xác thực.

  - **Lợi ích**: JWT có thể được lưu trữ trên client (trong localStorage hoặc cookies), giảm thiểu việc lưu trữ phiên (session) trên server. Điều này giúp ứng dụng dễ dàng mở rộng.
  - **Bảo mật**: JWT thường được mã hóa và ký để đảm bảo tính toàn vẹn của thông tin bên trong.

### 1.5 CORS là gì và cách giải quyết vấn đề CORS trong ứng dụng web?

**CORS** (Cross-Origin Resource Sharing) là cơ chế bảo mật của trình duyệt, giới hạn các yêu cầu HTTP được thực hiện từ một domain khác với domain của tài nguyên đang được truy cập.

- **Vấn đề**: Khi frontend (chạy trên domain A) cố gắng thực hiện một yêu cầu API tới backend (chạy trên domain B), trình duyệt có thể chặn yêu cầu do vi phạm CORS.

- **Giải pháp**:
  - **Cấu hình server**: Bạn có thể cấu hình server của mình để cho phép các domain cụ thể (hoặc tất cả các domain) truy cập vào API của bạn bằng cách thêm các header thích hợp (như `Access-Control-Allow-Origin`).
  - **Proxy server**: Một cách khác là sử dụng proxy để chuyển tiếp các yêu cầu từ frontend đến backend, tránh vấn đề CORS.

  ```javascript
  // Ví dụ về cấu hình CORS trong Express.js
  const express = require('express');
  const cors = require('cors');
  const app = express();

  app.use(cors({ origin: 'http://example.com' })); // Cho phép truy cập từ domain cụ thể
  ```

### 1.6 Bạn có hiểu biết về HTTP status codes không? Hãy liệt kê và giải thích một số mã lỗi phổ biến.

**HTTP status codes** là các mã trạng thái phản hồi từ server khi xử lý một yêu cầu từ client. Dưới đây là một số mã phổ biến:

- **2xx Success**:
    
    - **200 OK**: Yêu cầu thành công, server trả về dữ liệu (thường là phản hồi cho các yêu cầu GET hoặc POST).
    - **201 Created**: Tài nguyên mới đã được tạo thành công (thường là phản hồi cho các yêu cầu POST).
- **3xx Redirection**:
    
    - **301 Moved Permanently**: Tài nguyên đã được di chuyển vĩnh viễn đến một URI mới.
    - **302 Found**: Tài nguyên tạm thời được di chuyển đến một URI khác.
- **4xx Client Error**:
    
    - **400 Bad Request**: Yêu cầu không hợp lệ, server không thể hiểu được yêu cầu do lỗi cú pháp.
    - **401 Unauthorized**: Yêu cầu yêu cầu xác thực, nhưng người dùng chưa được xác thực.
    - **403 Forbidden**: Yêu cầu hợp lệ, nhưng server từ chối thực hiện vì quyền hạn của người dùng.
    - **404 Not Found**: Không tìm thấy tài nguyên được yêu cầu trên server.
- **5xx Server Error**:
    
    - **500 Internal Server Error**: Lỗi máy chủ nội bộ, server gặp sự cố khi xử lý yêu cầu.
    - **503 Service Unavailable**: Server tạm thời không thể xử lý yêu cầu (ví dụ: do quá tải hoặc bảo trì).

## Event Driven (Lập trình hướng sự kiện)
https://viblo.asia/p/dao-sau-mot-chut-ve-module-events-trong-nodejs-924lJAWmZPM