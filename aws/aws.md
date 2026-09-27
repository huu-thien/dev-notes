# 📚 Kiến thức về AWS (Amazon Web Services)

## 1. 🧠 **Khái niệm cơ bản về AWS**
- **AWS** là một nền tảng điện toán đám mây cung cấp các dịch vụ tính toán, lưu trữ, cơ sở dữ liệu, phân phối nội dung, và các tính năng khác qua internet.
- AWS cung cấp hơn 200 dịch vụ, bao gồm các dịch vụ về máy chủ ảo, cơ sở dữ liệu, phân tích dữ liệu, học máy, Internet of Things (IoT), bảo mật và các dịch vụ ứng dụng.

## 2. 🌐 **Các dịch vụ chính của AWS**

### **EC2 (Elastic Compute Cloud)**
- EC2 là dịch vụ cho phép bạn triển khai và quản lý các máy chủ ảo (instance) trong đám mây. Các máy chủ này có thể chạy nhiều hệ điều hành và được cấu hình tùy ý để phục vụ các ứng dụng web, cơ sở dữ liệu hoặc các tác vụ tính toán.

### **S3 (Simple Storage Service)**
- S3 là dịch vụ lưu trữ đối tượng (object storage), cho phép bạn lưu trữ và truy xuất dữ liệu không cấu trúc như hình ảnh, video, và tài liệu. Dịch vụ này cung cấp khả năng mở rộng vô hạn và có tính năng bảo mật cao.

### **RDS (Relational Database Service)**
- RDS cung cấp cơ sở dữ liệu quan hệ (MySQL, PostgreSQL, SQL Server, Oracle, MariaDB) dưới dạng dịch vụ được quản lý. AWS lo liệu việc sao lưu, bảo mật và cập nhật phần mềm, giúp bạn tập trung vào ứng dụng.

### **Lambda**
- AWS Lambda cho phép bạn chạy mã mà không cần quản lý máy chủ. Bạn chỉ cần tải mã lên và Lambda sẽ tự động chạy mã đó khi có sự kiện kích hoạt, lý tưởng cho các ứng dụng serverless.

### **VPC (Virtual Private Cloud)**
- VPC là một môi trường mạng ảo nơi bạn có thể tạo các máy chủ, cơ sở dữ liệu và các dịch vụ khác. Bạn có thể kiểm soát hoàn toàn mạng của mình, bao gồm các dải IP, cấu hình bảo mật và các kết nối giữa các dịch vụ trong VPC.

### **CloudFront**
- CloudFront là dịch vụ phân phối nội dung (CDN), giúp tăng tốc độ tải trang cho người dùng trên toàn cầu bằng cách lưu trữ bản sao của tài nguyên (như hình ảnh, video, tài liệu) tại các edge locations gần người dùng.

### **ECS (Elastic Container Service)**
- ECS là dịch vụ quản lý container Docker trên AWS. Nó giúp bạn dễ dàng triển khai, quản lý và mở rộng các ứng dụng containerized mà không cần quản lý cơ sở hạ tầng.

### **SQS (Simple Queue Service)**
- SQS là dịch vụ hàng đợi tin nhắn, giúp các ứng dụng phân tán giao tiếp với nhau một cách đáng tin cậy. SQS giúp gửi và nhận tin nhắn giữa các dịch vụ AWS và các ứng dụng phân tán.

### **IAM (Identity and Access Management)**
- IAM giúp quản lý quyền truy cập vào các dịch vụ AWS. Bạn có thể tạo và quản lý người dùng, nhóm người dùng và các quyền truy cập đến các tài nguyên AWS để bảo mật hệ thống.

## 3. ⚙️ **Cấu trúc AWS và các vùng (Regions)**
- **Vùng (Region)**: AWS có nhiều vùng địa lý trên toàn cầu. Mỗi vùng bao gồm một hoặc nhiều trung tâm dữ liệu và cung cấp các dịch vụ của AWS.
- **Availability Zones**: Mỗi vùng (Region) được chia thành các Availability Zones (AZ), mỗi AZ có các trung tâm dữ liệu độc lập với nhau, giúp tăng tính sẵn sàng và độ bền của ứng dụng.

## 4. 📊 **Các tính năng mở rộng của AWS**

### **Auto Scaling**
- AWS Auto Scaling giúp tự động điều chỉnh số lượng máy chủ EC2 dựa trên các điều kiện cụ thể như CPU sử dụng, lưu lượng web, v.v. Điều này giúp duy trì hiệu suất ổn định và tiết kiệm chi phí khi sử dụng tài nguyên.

### **CloudWatch**
- CloudWatch cung cấp giám sát các tài nguyên AWS, giúp bạn theo dõi và quản lý hiệu suất của các dịch vụ như EC2, RDS, S3, Lambda, và các tài nguyên khác. Nó cũng có thể gửi cảnh báo khi có sự cố hoặc sự kiện quan trọng xảy ra.

### **Elastic Load Balancing (ELB)**
- ELB giúp phân phối lưu lượng đến các máy chủ EC2 một cách tự động và đồng đều, giúp duy trì hiệu suất và tính sẵn sàng cao cho các ứng dụng.

### **AWS Well-Architected Framework**
- Đây là bộ công cụ và các nguyên lý giúp thiết kế, triển khai và vận hành các ứng dụng trên AWS một cách hiệu quả và an toàn. Nó bao gồm các yếu tố về bảo mật, hiệu suất, chi phí và sự ổn định.

## 5. 🛠️ **AWS với DevOps và CI/CD**

### **CodePipeline**
- AWS CodePipeline là dịch vụ quản lý quy trình tích hợp liên tục (CI) và triển khai liên tục (CD), giúp tự động hóa việc xây dựng, thử nghiệm và triển khai các ứng dụng.

### **CodeDeploy**
- AWS CodeDeploy tự động hóa quá trình triển khai mã lên các máy chủ EC2, Lambda hoặc các dịch vụ khác, giúp tiết kiệm thời gian và giảm lỗi trong quá trình triển khai ứng dụng.

### **CloudFormation**
- AWS CloudFormation cho phép bạn tự động hóa việc tạo và quản lý tài nguyên AWS thông qua mã (Infrastructure as Code). Bạn có thể sử dụng CloudFormation để định nghĩa và triển khai môi trường AWS của mình một cách tự động và nhất quán.

## 6. 🏗️ **Bảo mật và Quản lý trong AWS**

### **AWS Shield**
- AWS Shield là dịch vụ bảo vệ chống lại các cuộc tấn công từ chối dịch vụ (DDoS). Nó giúp bảo vệ các ứng dụng chạy trên AWS khỏi các cuộc tấn công mạng.

### **AWS WAF (Web Application Firewall)**
- AWS WAF là tường lửa ứng dụng web, giúp bảo vệ các ứng dụng web khỏi các cuộc tấn công như SQL injection, cross-site scripting (XSS), và các mối đe dọa khác.

### **AWS KMS (Key Management Service)**
- KMS là dịch vụ giúp bạn tạo và quản lý các khóa mã hóa, bảo vệ dữ liệu của bạn bằng cách mã hóa trong khi lưu trữ hoặc trong quá trình truyền tải.

### **CloudTrail**
- CloudTrail là dịch vụ giám sát và ghi lại các hoạt động API trong tài khoản AWS của bạn. Nó giúp bạn theo dõi và ghi nhận các thay đổi được thực hiện trong môi trường AWS.

## 7. 💡 **AWS với Machine Learning và AI**

### **SageMaker**
- AWS SageMaker là dịch vụ giúp bạn xây dựng, huấn luyện và triển khai các mô hình học máy (Machine Learning) mà không cần phải quản lý cơ sở hạ tầng phức tạp.

### **Rekognition**
- AWS Rekognition là dịch vụ nhận dạng hình ảnh và video, cho phép bạn nhận diện đối tượng, cảnh vật và khuôn mặt trong các tài liệu hình ảnh và video.

### **Lex**
- AWS Lex là dịch vụ tạo các chatbot thông minh, giúp bạn dễ dàng xây dựng các ứng dụng giao tiếp bằng giọng nói và văn bản.

### **Polly**
- AWS Polly là dịch vụ chuyển văn bản thành giọng nói tự nhiên, có thể tích hợp vào các ứng dụng để cung cấp chức năng đọc văn bản cho người dùng.

## 8. 🔧 **AWS Pricing và Cost Management**
- AWS cung cấp các mô hình giá linh hoạt, bao gồm trả tiền theo mức sử dụng (pay-as-you-go), giá cố định và giá theo thỏa thuận đặc biệt cho các doanh nghiệp lớn.
- **AWS Cost Explorer** giúp theo dõi chi phí và lập kế hoạch ngân sách cho các dịch vụ AWS.

