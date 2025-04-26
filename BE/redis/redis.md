# 📚 Kiến thức về Redis

## 1. 🧠 **Khái niệm cơ bản**
- **In-memory data store**: Redis lưu trữ toàn bộ dữ liệu trong bộ nhớ RAM, giúp truy xuất và ghi dữ liệu rất nhanh.
- **Key-Value store**: Redis hoạt động như một kho lưu trữ kiểu key-value (khóa-giá trị), nơi bạn lưu trữ các cặp khóa và giá trị.
- **Persistence**: Redis có thể cấu hình để duy trì dữ liệu vào đĩa (persistence), giúp đảm bảo dữ liệu không bị mất khi khởi động lại Redis.

## 2. 📊 **Các kiểu dữ liệu trong Redis**
Redis hỗ trợ nhiều kiểu dữ liệu, bao gồm:
- **String**: Kiểu dữ liệu đơn giản nhất, có thể lưu trữ chuỗi ký tự hoặc số.
- **List**: Mảng các giá trị có thể trùng lặp, với các thao tác push, pop theo thứ tự.
- **Set**: Tập hợp các giá trị không trùng lặp.
- **Sorted Set (ZSet)**: Giống như Set, nhưng mỗi phần tử được gán một giá trị điểm (score) để sắp xếp các phần tử theo điểm.
- **Hash**: Lưu trữ các cặp khóa và giá trị trong một đối tượng (giống như đối tượng JSON hoặc bảng băm).
- **Bitmap**: Lưu trữ chuỗi các bit, thường dùng để tính toán các thống kê hoặc các phép toán bitwise.
- **HyperLogLog**: Dùng để ước lượng số lượng phần tử duy nhất trong một tập hợp với mức độ sai số nhỏ.
- **Geospatial Index**: Lưu trữ và xử lý dữ liệu vị trí địa lý (latitude, longitude).

## 3. 🛠️ **Các thao tác cơ bản**
- **SET**: Lưu giá trị cho một khóa.
- **GET**: Lấy giá trị của một khóa.
- **DEL**: Xóa một khóa.
- **EXPIRE**: Đặt thời gian hết hạn cho một khóa.
- **TTL**: Kiểm tra thời gian sống còn lại của một khóa.

## 4. 💾 **Persistence (Duy trì dữ liệu)**
Redis hỗ trợ 2 cơ chế chính để duy trì dữ liệu vào đĩa:
- **RDB (Redis Database Snapshotting)**: Lưu trữ dữ liệu tại các thời điểm nhất định (chụp lại snapshot của cơ sở dữ liệu).
- **AOF (Append Only File)**: Ghi lại tất cả các lệnh ghi (write command) vào một tệp nhật ký, giúp khôi phục lại dữ liệu sau khi khởi động lại Redis.

## 5. ⚙️ **Cấu hình Redis**
Redis có nhiều tùy chọn cấu hình trong file `redis.conf`, chẳng hạn:
- **maxmemory**: Giới hạn bộ nhớ mà Redis có thể sử dụng.
- **maxclients**: Số lượng client tối đa kết nối đồng thời.
- **save**: Cấu hình các điều kiện để tạo snapshot.

## 6. 🧑‍💻 **Quản lý Redis**
- **Redis CLI**: Công cụ dòng lệnh `redis-cli` giúp giao tiếp và quản lý Redis.
- **MONITOR**: Theo dõi các lệnh được gửi đến Redis.
- **INFO**: Hiển thị thông tin chi tiết về Redis.

## 7. 🔄 **Replication (Sao chép)**
Redis hỗ trợ tính năng sao chép (replication) để tạo ra một hệ thống phân tán, với một Redis server làm master và các server khác làm slave.

## 8. 🚀 **Sentinel và Cluster**
- **Redis Sentinel**: Cung cấp khả năng giám sát, tự động chuyển đổi dự phòng (failover) và phát hiện lỗi.
- **Redis Cluster**: Cho phép Redis mở rộng quy mô bằng cách phân phối dữ liệu trên nhiều máy chủ.

## 9. 💻 **Thực thi lệnh Lua (Scripting)**
Redis hỗ trợ thực thi các lệnh Lua trong cơ sở dữ liệu. Điều này cho phép bạn thực hiện các thao tác phức tạp mà không cần phải truyền nhiều lệnh.

## 10. 📈 **Ứng dụng thực tế**
- **Cache**: Redis được sử dụng như một hệ thống cache để giảm tải cho cơ sở dữ liệu chính, cải thiện hiệu suất.
- **Session store**: Lưu trữ phiên làm việc của người dùng trong ứng dụng web.
- **Message broker**: Redis cung cấp hệ thống pub/sub (publish/subscribe) để trao đổi dữ liệu giữa các dịch vụ.

## 11. 🔐 **Tối ưu hóa và bảo mật**
- **Memory optimization**: Redis cung cấp các tùy chọn như `LRU (Least Recently Used)` eviction policy để tự động xóa dữ liệu khi bộ nhớ đầy.
- **Authentication**: Redis cho phép cấu hình mật khẩu để bảo mật kết nối.
