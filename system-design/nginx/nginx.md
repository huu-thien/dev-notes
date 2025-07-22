# 📚 Kiến thức về Nginx

## 1. 🧠 **Khái niệm cơ bản**
- **Nginx** là một phần mềm máy chủ web mã nguồn mở, nổi tiếng với khả năng xử lý lượng truy cập cao và hiệu suất tốt.
- Nginx có thể được sử dụng như một **Web Server** (máy chủ web), **Reverse Proxy** (proxy ngược), **Load Balancer** (cân bằng tải), **Mail Proxy** và **HTTP Cache**.

## 2. 🌐 **Các vai trò của Nginx**
- **Web Server**: Nginx có thể phục vụ các file tĩnh như HTML, CSS, JavaScript và hình ảnh.
- **Reverse Proxy**: Nginx có thể hoạt động như một reverse proxy, chuyển tiếp yêu cầu từ khách hàng tới các máy chủ ứng dụng hoặc máy chủ web khác.
- **Load Balancer**: Nginx có thể phân phối lưu lượng đến nhiều máy chủ backend để cải thiện khả năng mở rộng và tính sẵn sàng.
- **HTTP Cache**: Nginx có thể lưu trữ các bản sao tĩnh của nội dung để giảm tải cho các máy chủ backend và tăng tốc độ truy cập.

## 3. ⚙️ **Cấu trúc Nginx**
Nginx có cấu hình chia thành các phần sau:
- **Main**: Cấu hình toàn cục cho Nginx.
- **HTTP**: Cấu hình cho phần HTTP, như server blocks, reverse proxy, cache, v.v.
- **Server**: Cấu hình cho mỗi server ảo trong Nginx.
- **Location**: Cấu hình cho các URL cụ thể trong server block.

## 4. 🛠️ **Các tính năng của Nginx**

### **Reverse Proxy**
- **Proxy Requests**: Nginx chuyển tiếp yêu cầu từ người dùng tới các máy chủ backend (như ứng dụng web hoặc API) và trả kết quả về cho người dùng.
- **Load Balancing**: Nginx có thể phân phối lưu lượng yêu cầu đến nhiều máy chủ backend bằng các thuật toán như round-robin, least_conn, IP hash, v.v.
  
### **Caching**
- **HTTP Cache**: Nginx có thể làm cache các file tĩnh hoặc kết quả từ backend để tăng hiệu suất.
- **Proxy Cache**: Cache các phản hồi từ các máy chủ backend trong bộ nhớ đệm hoặc trên đĩa.

### **SSL/TLS Termination**
- **SSL Termination**: Nginx có thể xử lý kết nối HTTPS, giải mã các yêu cầu mã hóa và chuyển tiếp chúng tới các máy chủ backend qua HTTP.
- **TLS Offloading**: Nginx giảm tải công việc mã hóa SSL từ các máy chủ backend, cải thiện hiệu suất.

### **WebSocket Support**
- Nginx hỗ trợ WebSocket, cho phép các kết nối thời gian thực giữa client và server.

## 5. 🔧 **Các chỉ thị cấu hình Nginx**
Nginx sử dụng một hệ thống cấu hình mô-đun, với các chỉ thị chính:
- **server**: Định nghĩa các máy chủ ảo và cấu hình của từng máy chủ.
- **location**: Xử lý các yêu cầu HTTP đối với các URL cụ thể.
- **proxy_pass**: Được sử dụng trong cấu hình reverse proxy để chuyển tiếp yêu cầu tới máy chủ backend.
- **listen**: Xác định các cổng và địa chỉ mà Nginx lắng nghe.
- **root**: Định nghĩa thư mục gốc của web server, nơi Nginx sẽ tìm kiếm các file tĩnh.

## 6. 📈 **Nginx với Load Balancing**
Nginx có thể thực hiện cân bằng tải (load balancing) giữa nhiều máy chủ backend để phân phối lưu lượng và cải thiện hiệu suất. Có một số phương pháp cân bằng tải:
- **Round Robin**: Phân phối đều lưu lượng yêu cầu tới các máy chủ backend.
- **Least Connections**: Chuyển yêu cầu tới máy chủ có ít kết nối đang mở.
- **IP Hash**: Cân bằng tải dựa trên địa chỉ IP của người dùng, giúp đảm bảo rằng các yêu cầu từ cùng một IP luôn được chuyển tới cùng một backend.

## 7. 🧑‍💻 **Nginx với SSL/TLS**
Nginx có thể được cấu hình để xử lý kết nối SSL/TLS, giúp bảo mật dữ liệu truyền tải giữa client và server. Việc cấu hình SSL cho phép mã hóa dữ liệu và giúp bảo vệ sự riêng tư của người dùng khi truy cập các dịch vụ web.

## 8. 🔄 **Cấu hình Nginx cho WebSocket**
Nginx có thể cấu hình để hỗ trợ các kết nối WebSocket, giúp duy trì kết nối thời gian thực giữa client và server. WebSocket là một giao thức giúp các ứng dụng web thực hiện giao tiếp hai chiều mà không cần phải gửi lại yêu cầu HTTP mới. Để hỗ trợ WebSocket, Nginx cần được cấu hình để duy trì kết nối dài hạn và xử lý các yêu cầu upgrade từ HTTP lên WebSocket.

## 9. 💾 **Nginx và Caching**
Nginx có thể làm cache các phản hồi từ máy chủ backend hoặc từ các file tĩnh để giảm tải và tăng tốc độ truy cập. Việc sử dụng cache giúp tiết kiệm tài nguyên của máy chủ backend và tăng tốc độ phục vụ các yêu cầu của người dùng. Cache trong Nginx có thể được thiết lập để lưu trữ các phản hồi HTTP, và các file tĩnh như hình ảnh, CSS, và JavaScript, giúp cải thiện hiệu suất tổng thể của hệ thống.

## 10. 🚀 **Tối ưu hiệu suất Nginx**
Nginx cung cấp một số cách để tối ưu hóa hiệu suất của các ứng dụng web:
- **Keep-Alive**: Giữ kết nối mở giữa client và server để giảm thiểu độ trễ khi thực hiện nhiều yêu cầu từ cùng một client.
- **Gzip Compression**: Nginx có thể nén dữ liệu trước khi gửi về client, giúp giảm băng thông và cải thiện tốc độ tải trang.
- **Caching**: Nginx hỗ trợ caching các tài nguyên tĩnh hoặc phản hồi từ các máy chủ backend, giúp giảm tải cho các máy chủ gốc và cải thiện tốc độ phục vụ.

## 11. 🛡️ **Bảo mật trong Nginx**
Nginx cung cấp các tính năng bảo mật để bảo vệ ứng dụng và hệ thống:
- **Rate Limiting**: Giới hạn số lượng yêu cầu từ một client trong một khoảng thời gian nhất định để ngăn chặn các cuộc tấn công từ chối dịch vụ (DoS).
- **IP Blocking**: Chặn các địa chỉ IP không mong muốn hoặc không hợp lệ để ngăn chặn các cuộc tấn công.
- **Basic Authentication**: Cung cấp khả năng xác thực người dùng với tên người dùng và mật khẩu cho các phần của website.
  
## 12. 🌍 **Nginx và Microservices**
Nginx là một giải pháp lý tưởng cho việc triển khai microservices, đặc biệt khi cần hỗ trợ các tính năng như reverse proxy, load balancing và bảo mật. Trong môi trường microservices, Nginx có thể làm nhiệm vụ như một cổng vào duy nhất (API Gateway), điều phối các yêu cầu và phân phối lưu lượng giữa các dịch vụ khác nhau. Việc sử dụng Nginx giúp đơn giản hóa việc quản lý các dịch vụ nhỏ trong hệ thống và cung cấp các tính năng mở rộng dễ dàng.

## 13. 📈 **Giám sát và Logging**
Nginx cung cấp các tính năng giám sát và logging mạnh mẽ để theo dõi các yêu cầu HTTP và tình trạng của máy chủ:
- **Access Logs**: Ghi lại các yêu cầu HTTP từ client, giúp bạn theo dõi những gì đang xảy ra trên server.
- **Error Logs**: Ghi lại các lỗi hoặc sự cố trong quá trình xử lý các yêu cầu, giúp dễ dàng xác định nguyên nhân gây ra các vấn đề.
- **Status Monitoring**: Nginx có thể được cấu hình để giám sát các yêu cầu, hiệu suất và trạng thái của máy chủ, giúp đảm bảo rằng dịch vụ luôn hoạt động ổn định.

## 14. 🏗️ **Nginx và Docker**
Nginx có thể được triển khai trong các container Docker để phục vụ các ứng dụng hoặc làm reverse proxy cho các dịch vụ trong môi trường microservices. Docker giúp đóng gói và triển khai nhanh chóng các ứng dụng và dịch vụ, và Nginx làm công cụ kết nối, quản lý lưu lượng và cung cấp các tính năng như load balancing và bảo mật cho các container trong môi trường Docker. Sự kết hợp này giúp dễ dàng quản lý và mở rộng hệ thống ứng dụng của bạn.
