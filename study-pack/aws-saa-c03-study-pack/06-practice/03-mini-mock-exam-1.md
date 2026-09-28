# Mini Mock Exam 1

Đề thi thử số 1, mô phỏng phong cách AWS SAA-C03, thiên về core services nền tảng: network, storage, database, compute, và messaging cơ bản. 20 câu, chỉ có 1 best answer cho mỗi câu.

## Hướng dẫn làm bài

- **Cách làm:** đọc kỹ từng câu, tự chọn 1 đáp án A/B/C/D trước khi xem đáp án. Không mở `05-answer-explanations.md` khi đang làm bài.
- **Time-box đề xuất:** 30 phút cho 20 câu (~1.5 phút/câu), mô phỏng nhịp độ đề thi thật.
- **Cách tự chấm:** làm xong toàn bộ 20 câu, đối chiếu với "Đáp án tóm tắt" ở cuối file, tính % đúng.
- Chỉ sau khi đã hoàn thành cả 20 câu và tự chấm, mới mở [05-answer-explanations.md](./05-answer-explanations.md) để xem giải thích chi tiết.
- Mục tiêu tham khảo: đúng từ 16/20 câu (80%) trở lên được xem là đạt.

## Đề thi

### Câu 1

Một công ty vận hành ứng dụng web trên 1 EC2 instance duy nhất. Ban lãnh đạo yêu cầu hệ thống phải tự động tiếp tục phục vụ người dùng nếu instance hiện tại gặp sự cố phần cứng đột ngột, không cần thao tác thủ công từ đội vận hành.

**A.** Đặt EC2 trong Auto Scaling group tối thiểu 2 instance trải trên 2 Availability Zone, phía trước là Application Load Balancer.
**B.** Nâng cấp instance type lên loại có nhiều vCPU và RAM hơn.
**C.** Tạo AMI định kỳ từ instance hiện tại để khôi phục nhanh khi cần.
**D.** Cấu hình CloudWatch alarm gửi email cảnh báo khi instance down để đội vận hành khởi động lại thủ công.

### Câu 2

Một hệ thống lưu trữ hàng triệu file ảnh sản phẩm, được truy cập qua ứng dụng web bằng HTTP, không cần thao tác file theo kiểu path/folder truyền thống, và cần độ bền dữ liệu cao với chi phí hợp lý.

**A.** Amazon EBS gắn vào 1 EC2 instance làm file server.
**B.** Amazon S3.
**C.** Amazon FSx for Windows File Server.
**D.** Amazon EFS chia sẻ cho nhiều instance.

### Câu 3

Đội phát triển cần 1 tập file dùng chung cho 15 EC2 instance Linux chạy trong cùng Auto Scaling group, mỗi instance đều cần đọc/ghi đồng thời lên cùng dữ liệu.

**A.** Amazon S3 với mount thủ công qua FUSE.
**B.** Amazon EBS với chế độ Multi-Attach mặc định cho mọi loại volume.
**C.** Amazon EFS.
**D.** Copy dữ liệu ra từng instance bằng script.

### Câu 4

Một ứng dụng đặt vé máy bay cần đảm bảo không xảy ra tình trạng 2 khách hàng đặt trùng cùng 1 ghế, yêu cầu transaction phải nhất quán (ACID) khi kiểm tra và cập nhật số ghế còn lại.

**A.** Amazon DynamoDB với eventually consistent read.
**B.** Amazon S3 với versioning.
**C.** Amazon ElastiCache.
**D.** Amazon RDS hoặc Aurora với transaction ACID.

### Câu 5

Một ứng dụng IoT nhận hàng triệu bản ghi cảm biến mỗi phút, mỗi bản ghi đơn giản (device_id, timestamp, value), traffic ghi tăng đột biến không dự đoán trước, không cần JOIN giữa các bảng.

**A.** Amazon DynamoDB với on-demand capacity mode.
**B.** Amazon RDS với Read Replica.
**C.** Amazon Aurora Multi-AZ.
**D.** Amazon RDS với vertical scaling định kỳ.

### Câu 6

Một database RDS hiện đang có Read Replica phục vụ báo cáo, nhưng gần đây gặp sự cố mất instance chính do lỗi phần cứng và toàn bộ ứng dụng downtime khoảng 20 phút cho tới khi đội vận hành promote Read Replica thủ công. Cần thiết kế lại để giảm downtime này mà không cần can thiệp thủ công.

**A.** Thêm nhiều Read Replica hơn nữa.
**B.** Bật Multi-AZ deployment cho instance chính.
**C.** Tăng tần suất backup tự động.
**D.** Chuyển toàn bộ hệ thống sang DynamoDB.

### Câu 7

Các EC2 instance trong private subnet cần tải thư viện phần mềm từ internet trong quá trình khởi động, nhưng chính sách bảo mật yêu cầu các instance này không được có địa chỉ IP công khai và không được nhận kết nối trực tiếp từ internet.

**A.** Gắn Internet Gateway trực tiếp vào private subnet.
**B.** Gán Elastic IP cho từng instance.
**C.** Triển khai NAT Gateway trong public subnet và cập nhật route table của private subnet.
**D.** Dùng VPC Peering tới 1 VPC public khác.

### Câu 8

Một website tĩnh phục vụ người dùng toàn cầu, nội dung ít thay đổi, đội ngũ muốn giảm độ trễ tải trang và giảm tải trực tiếp lên origin server.

**A.** Tăng số lượng EC2 instance ở origin.
**B.** Route 53 weighted routing giữa nhiều origin.
**C.** AWS Global Accelerator với origin là S3.
**D.** Amazon CloudFront với origin là S3 hoặc ALB.

### Câu 9

Một hệ thống có nhiều microservice, khi service A gọi trực tiếp service B bằng HTTP request đồng bộ, nếu service B tạm thời quá tải, service A cũng bị chậm/lỗi theo. Cần giảm sự phụ thuộc trực tiếp này khi khối lượng công việc có thể xử lý bất đồng bộ.

**A.** Đưa 1 SQS queue vào giữa, service A đẩy message vào queue, service B poll và xử lý độc lập.
**B.** Tăng timeout của HTTP request giữa 2 service.
**C.** Nhân bản service B ra nhiều instance nhưng giữ nguyên giao tiếp đồng bộ.
**D.** Giảm số lượng request mà service A gửi đi.

### Câu 10

Khi có 1 sự kiện tạo đơn hàng mới, hệ thống cần gửi thông báo đồng thời tới: dịch vụ email, dịch vụ SMS, và dịch vụ ghi log phân tích, mỗi dịch vụ xử lý độc lập.

**A.** Amazon SQS Standard queue duy nhất cho cả 3 dịch vụ cùng poll.
**B.** Amazon SNS với 3 subscriber riêng biệt (fanout).
**C.** Gọi tuần tự 3 API từ service tạo đơn hàng.
**D.** Amazon RDS trigger gửi email trực tiếp.

### Câu 11

Một công ty cần xử lý ảnh ngay khi người dùng upload qua ứng dụng di động, mỗi lần xử lý chỉ mất 2-3 giây, tần suất không đều theo giờ trong ngày, muốn tối thiểu hóa chi phí vận hành khi không có traffic.

**A.** Amazon EC2 chạy liên tục 24/7 để xử lý ngay khi có ảnh mới.
**B.** Amazon ECS service chạy với số lượng task cố định.
**C.** AWS Lambda được kích hoạt bởi S3 event khi có object mới.
**D.** Amazon EventBridge lưu trữ và xử lý ảnh trực tiếp.

### Câu 12

Một đối tác bên ngoài cần gọi API của công ty, yêu cầu giới hạn số lượng request mỗi giây (throttling) để tránh làm quá tải hệ thống backend, kèm theo xác thực bằng API key.

**A.** Application Load Balancer với target group.
**B.** Network Load Balancer.
**C.** Amazon Route 53.
**D.** Amazon API Gateway.

### Câu 13

Đội bảo mật cần biết chính xác tài khoản IAM nào đã thay đổi cấu hình 1 Security Group quan trọng trong tuần qua, kèm thời gian và địa chỉ IP nguồn.

**A.** AWS CloudTrail.
**B.** Amazon CloudWatch Logs.
**C.** AWS Config.
**D.** Amazon Inspector.

### Câu 14

Ứng dụng cần lưu trữ mật khẩu kết nối RDS, có yêu cầu rotation tự động định kỳ mà không cần thay đổi code ứng dụng khi mật khẩu đổi.

**A.** AWS Systems Manager Parameter Store (String).
**B.** AWS Secrets Manager với rotation configuration cho RDS.
**C.** Biến môi trường trong user data của EC2.
**D.** AWS KMS.

### Câu 15

Một hệ thống hiện đang chạy ổn định trên EC2 On-Demand 24/7, đội tài chính xác nhận workload này sẽ tiếp tục chạy ổn định trong ít nhất 2 năm tới. Mục tiêu là giảm chi phí compute tối đa mà không thay đổi kiến trúc.

**A.** Chuyển sang Spot Instances.
**B.** Giữ nguyên On-Demand vì linh hoạt.
**C.** Mua Reserved Instances hoặc Savings Plans phù hợp với baseline capacity.
**D.** Giảm số lượng instance đang chạy.

### Câu 16

Một ứng dụng 3 tầng cần: tầng web tiếp xúc internet, tầng app và database hoàn toàn không có route ra internet, và Security Group giữa các tầng chỉ cho phép traffic từ tầng liền kề.

**A.** Đặt cả 3 tầng trong 1 subnet duy nhất, dùng NACL để phân tách.
**B.** Đặt cả 3 tầng ở public subnet nhưng chặn toàn bộ traffic bằng NACL deny-all.
**C.** Dùng chung 1 Security Group cho cả 3 tầng để đơn giản hóa.
**D.** Đặt web tier ở public subnet, app/database tier ở private subnet riêng, cấu hình Security Group least privilege giữa các tầng.

### Câu 17

Một dữ liệu log truy cập gần như không bao giờ được đọc lại sau 60 ngày nhưng cần lưu tối thiểu 2 năm để tuân thủ pháp lý. Team muốn tối ưu chi phí lưu trữ mà vẫn giữ đủ dữ liệu.

**A.** Thiết lập S3 Lifecycle policy chuyển log sang Glacier/Glacier Deep Archive sau 60 ngày.
**B.** Giữ nguyên trên S3 Standard toàn bộ thời gian.
**C.** Xóa log sau 60 ngày để tiết kiệm chi phí.
**D.** Chuyển log sang EBS snapshot định kỳ.

### Câu 18

Một ứng dụng cần mã hóa file lưu trên S3, có yêu cầu kiểm soát quyền sử dụng key riêng cho từng phòng ban và ghi lại lịch sử ai đã dùng key để giải mã.

**A.** AWS Secrets Manager.
**B.** AWS KMS với customer managed key.
**C.** AWS Systems Manager Parameter Store SecureString.
**D.** Tự triển khai mã hóa AES trong ứng dụng.

### Câu 19

Một ứng dụng thanh toán cần chạy 1 tác vụ nền dài (khoảng 45 phút) để đối chiếu giao dịch hàng đêm, không có yêu cầu event-driven tức thời nhưng cần toàn quyền kiểm soát runtime.

**A.** AWS Lambda với timeout tối đa.
**B.** Amazon API Gateway với integration timeout mở rộng.
**C.** Amazon EC2 hoặc ECS/Fargate task chạy theo lịch.
**D.** Amazon SNS trigger.

### Câu 20

Một công ty cần cấu hình mạng để 2 VPC ở 2 tài khoản AWS khác nhau có thể giao tiếp nội bộ với nhau qua địa chỉ IP private, không đi qua internet.

**A.** Amazon CloudFront giữa 2 VPC.
**B.** AWS Direct Connect.
**C.** Route 53 Resolver rule duy nhất, không cần kết nối mạng khác.
**D.** VPC Peering hoặc AWS Transit Gateway giữa 2 VPC.

## Đáp án tóm tắt

| Câu | Đáp án |
|---|---|
| 1 | A |
| 2 | B |
| 3 | C |
| 4 | D |
| 5 | A |
| 6 | B |
| 7 | C |
| 8 | D |
| 9 | A |
| 10 | B |
| 11 | C |
| 12 | D |
| 13 | A |
| 14 | B |
| 15 | C |
| 16 | D |
| 17 | A |
| 18 | B |
| 19 | C |
| 20 | D |

Xem giải thích chi tiết tại: [05-answer-explanations.md](./05-answer-explanations.md#mini-mock-exam-1--answer-explanations).

## Xem tiếp / Liên kết liên quan

- [04-mini-mock-exam-2.md](./04-mini-mock-exam-2.md)
- [05-answer-explanations.md](./05-answer-explanations.md)
- [README.md](./README.md)
