# Kiến thức về FTPS

## 1. 📂 FTPS là gì?
FTPS (File Transfer Protocol Secure) là một giao thức truyền tệp an toàn, bảo vệ dữ liệu khi truyền tải qua mạng thông qua mã hóa SSL/TLS.

## 2. ⚖️ So sánh FTPS và FTP
- **FTP**: Không bảo mật, truyền tải dữ liệu dưới dạng văn bản thuần túy.
- **FTPS**: Mã hóa kết nối, bảo vệ dữ liệu khỏi các mối nguy cơ nghe lén và giả mạo.

## 3. 🔐 Cấu trúc và hoạt động của FTPS
FTPS có 2 chế độ:
- **Implicit FTPS**: Kết nối SSL/TLS bắt đầu ngay lập tức (cổng mặc định: 990).
- **Explicit FTPS**: Kết nối SSL/TLS được yêu cầu sau khi kết nối FTP được thiết lập (cổng mặc định: 21).

## 4. 📊 Các thành phần chính của FTPS
- **Máy chủ FTPS**: Máy chủ xử lý các yêu cầu kết nối và cung cấp các dịch vụ bảo mật.
- **Máy khách FTPS**: Phần mềm kết nối với máy chủ FTPS để tải lên, tải xuống và quản lý tệp.
- **SSL/TLS**: Cung cấp mã hóa và bảo mật cho kết nối FTP.

## 5. 🚀 Lợi ích của FTPS
- **Mã hóa**: Bảo vệ dữ liệu khỏi các cuộc tấn công.
- **Xác thực**: Đảm bảo dữ liệu chỉ được gửi đến đúng người nhận.
- **Tuân thủ pháp lý**: Giúp đáp ứng các yêu cầu bảo mật trong các ngành công nghiệp yêu cầu bảo vệ dữ liệu.

## 6. 🆚 FTPS và SFTP
- **FTPS**: Dựa trên SSL/TLS và FTP.
- **SFTP**: Dựa trên giao thức SSH, hoàn toàn độc lập với FTP.

## 7. 🔌 Cổng FTPS
- **Implicit FTPS**: Cổng mặc định là 990.
- **Explicit FTPS**: Cổng mặc định là 21.

## 8. ⚙️ Cấu hình FTPS trên máy chủ
- Cài đặt phần mềm máy chủ FTP hỗ trợ FTPS.
- Cung cấp chứng chỉ SSL/TLS cho máy chủ.
- Cấu hình tường lửa để cho phép các kết nối FTPS.

## 9. 🛠️ Các công cụ hỗ trợ FTPS
- **FileZilla**: Phần mềm FTP phổ biến với hỗ trợ FTPS.
- **WinSCP**: Công cụ FTP/FTPS với giao diện dễ sử dụng.
- **Core FTP**: Phần mềm FTP/FTPS cho Windows.

## 10. ⚠️ Lưu ý khi sử dụng FTPS
- **Quản lý chứng chỉ**: Đảm bảo chứng chỉ SSL/TLS của máy chủ luôn hợp lệ.
- **Cấu hình tường lửa**: Cần mở cổng đúng cách cho kết nối FTPS.
