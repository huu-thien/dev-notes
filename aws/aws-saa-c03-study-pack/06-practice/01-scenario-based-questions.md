# Scenario-Based Questions

30 câu hỏi tình huống theo phong cách đề AWS SAA-C03. Mỗi câu có bối cảnh, 4 đáp án, và explanation ngay dưới. Tự chọn đáp án trước khi xem **Đáp án đúng**.

## Mục tiêu học

- Luyện phân tích requirement (functional vs non-functional) trong bối cảnh dài.
- Luyện elimination technique với 4 đáp án đều "nghe hợp lý".
- Củng cố lại các trap đã học ở [../05-exam-drills/02-exam-traps.md](../05-exam-drills/02-exam-traps.md).

## Mục lục

- [Câu 1-3: High Availability / Fault Tolerance / Disaster Recovery](#câu-1-3-high-availability--fault-tolerance--disaster-recovery)
- [Câu 4-8: Storage (EC2/EBS/EFS/FSx/S3)](#câu-4-8-storage-ec2ebsefsfsxs3)
- [Câu 9-11: Database (RDS/Aurora/DynamoDB)](#câu-9-11-database-rdsauroradynamodb)
- [Câu 12-14: Network (VPC/Route 53/CloudFront)](#câu-12-14-network-vpcroute-53cloudfront)
- [Câu 15-17: Compute & API (Lambda/API Gateway)](#câu-15-17-compute--api-lambdaapi-gateway)
- [Câu 18-20: Messaging (SQS/SNS/EventBridge)](#câu-18-20-messaging-sqssnseventbridge)
- [Câu 21-23: Ops (CloudWatch/CloudTrail/Config)](#câu-21-23-ops-cloudwatchcloudtrailconfig)
- [Câu 24-26: Security (KMS/Secrets Manager/Parameter Store)](#câu-24-26-security-kmssecrets-managerparameter-store)
- [Câu 27-28: Cost Optimization](#câu-27-28-cost-optimization)
- [Câu 29: Security Architecture](#câu-29-security-architecture)
- [Câu 30: Migration / Hybrid](#câu-30-migration--hybrid)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Câu 1-3: High Availability / Fault Tolerance / Disaster Recovery

### Câu 1

Một ứng dụng web hiện chạy trên 1 EC2 instance duy nhất trong 1 Availability Zone. Đội vận hành muốn kiến trúc có thể tự động chịu được sự cố mất 1 AZ mà không cần can thiệp thủ công, với chi phí hợp lý.

**A.** Tạo thêm 1 EC2 instance ở AZ khác, tự cấu hình DNS trỏ luân phiên giữa 2 địa chỉ IP.
**B.** Đặt EC2 instance trong Auto Scaling group trải trên nhiều AZ, phía trước có Application Load Balancer.
**C.** Backup instance định kỳ bằng AMI snapshot để khôi phục nhanh khi có sự cố.
**D.** Chuyển sang 1 instance loại lớn hơn (vertical scaling) để giảm khả năng gặp sự cố phần cứng.

**Đáp án đúng:** B

**Vì sao đúng:** Auto Scaling group multi-AZ + ALB cho phép tự động phát hiện instance/AZ lỗi, định tuyến traffic sang instance khỏe mạnh, và tự thay thế instance mà không cần can thiệp thủ công — đúng nghĩa HA tự động.

**Vì sao các đáp án còn lại sai:** A là giải pháp thủ công, không tự động failover. C (backup/AMI) chỉ giúp khôi phục sau sự cố, không phải HA (không tự động, có downtime). D không giải quyết single point of failure ở tầng AZ.

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/01-high-availability.md](../03-architecture-patterns/01-high-availability.md), [../02-core-services/08-elb-and-auto-scaling.md](../02-core-services/08-elb-and-auto-scaling.md).

### Câu 2

Một hệ thống xử lý đơn hàng gồm nhiều microservice giao tiếp qua REST API đồng bộ. Khi 1 service downstream chậm hoặc lỗi, toàn bộ chuỗi request bị treo và ảnh hưởng tới cả hệ thống. Cần thiết kế lại để hệ thống chịu lỗi tốt hơn, không để 1 service lỗi kéo sập toàn bộ chuỗi.

**A.** Tăng timeout của các lời gọi API đồng bộ để chờ lâu hơn.
**B.** Thay giao tiếp đồng bộ giữa các service bằng SQS để decouple, cho phép mỗi service xử lý độc lập và retry khi cần.
**C.** Scale tất cả service lên instance lớn hơn để xử lý nhanh hơn.
**D.** Thêm nhiều bản sao của service downstream nhưng vẫn giữ giao tiếp đồng bộ.

**Đáp án đúng:** B

**Vì sao đúng:** Decoupling bằng SQS cách ly lỗi (failure isolation) — service downstream chậm/lỗi không còn làm treo trực tiếp service gọi nó; message được buffer và retry độc lập, đúng tinh thần Fault Tolerance.

**Vì sao các đáp án còn lại sai:** A chỉ trì hoãn vấn đề, không giải quyết root cause coupling chặt. C tốn kém và không giải quyết vấn đề kiến trúc đồng bộ. D vẫn giữ coupling đồng bộ nên lỗi vẫn lan truyền dù có nhiều bản sao.

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/02-fault-tolerance.md](../03-architecture-patterns/02-fault-tolerance.md), [../02-core-services/11-sqs-sns-eventbridge.md](../02-core-services/11-sqs-sns-eventbridge.md).

### Câu 3

Một công ty tài chính yêu cầu: nếu toàn bộ Region chính gặp sự cố nghiêm trọng, hệ thống phải khôi phục lại trong vòng vài phút với mất mát dữ liệu tối thiểu. Ngân sách cho phép duy trì hạ tầng chạy sẵn ở Region phụ nhưng không cần chạy full-scale 24/7.

**A.** Backup & Restore — sao lưu định kỳ sang Region khác, khôi phục khi cần.
**B.** Pilot Light — giữ các thành phần lõi (database replication) luôn chạy ở Region phụ, scale phần compute khi cần.
**C.** Warm Standby — chạy hệ thống ở scale nhỏ tại Region phụ, sẵn sàng scale lên toàn bộ khi failover.
**D.** Multi-site Active/Active — chạy full-scale ở cả 2 Region đồng thời.

**Đáp án đúng:** C

**Vì sao đúng:** Warm Standby đáp ứng RTO vài phút (hệ thống đã chạy sẵn ở scale nhỏ, chỉ cần scale lên) với chi phí thấp hơn Multi-site Active/Active — phù hợp yêu cầu "vài phút" mà "không cần chạy full-scale 24/7".

**Vì sao các đáp án còn lại sai:** A (Backup & Restore) RTO thường tính bằng giờ, không đáp ứng "vài phút". B (Pilot Light) thường cần thêm thời gian scale compute từ 0, RTO thường cao hơn Warm Standby (thường vài chục phút). D tốn kém hơn mức cần thiết vì đề đã nói "không cần chạy full-scale 24/7".

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/07-disaster-recovery.md](../03-architecture-patterns/07-disaster-recovery.md).

## Câu 4-8: Storage (EC2/EBS/EFS/FSx/S3)

### Câu 4

Một ứng dụng chạy trên 20 EC2 instance (Linux) trong cùng Auto Scaling group, tất cả cần đọc/ghi chung 1 tập file dùng chung theo thời gian thực, hỗ trợ POSIX permission.

**A.** Gắn 1 EBS volume và chia sẻ qua network filesystem tự dựng.
**B.** Dùng Amazon EFS, mount trên cả 20 instance.
**C.** Lưu file trên S3 và mount bằng S3 File Gateway.
**D.** Copy file ra từng instance qua script định kỳ.

**Đáp án đúng:** B

**Vì sao đúng:** EFS là managed file storage hỗ trợ POSIX, mount đồng thời trên nhiều Linux instance, đúng chính xác yêu cầu shared access thời gian thực.

**Vì sao các đáp án còn lại sai:** A không phải managed, phức tạp và không đúng use case chuẩn của EBS (single-instance block storage). C giới thiệu thêm độ trễ và không phù hợp truy cập thời gian thực POSIX. D không đồng bộ thời gian thực, dễ lệch dữ liệu.

**Đọc lại nếu còn yếu:** [../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md](../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md), [../02-core-services/02-ebs-efs-fsx.md](../02-core-services/02-ebs-efs-fsx.md).

### Câu 5

Một công ty lưu log truy cập trên S3 Standard, dữ liệu gần như không bao giờ được đọc lại sau 30 ngày nhưng vẫn cần giữ tối thiểu 3 năm để tuân thủ quy định. Chi phí lưu trữ đang tăng nhanh.

**A.** Giữ nguyên S3 Standard vì đơn giản, dễ truy xuất khi cần.
**B.** Chuyển toàn bộ log sang EBS để giảm chi phí.
**C.** Tạo S3 Lifecycle policy chuyển log sang S3 Glacier (hoặc Glacier Deep Archive) sau 30 ngày.
**D.** Xóa log sau 30 ngày để tiết kiệm chi phí.

**Đáp án đúng:** C

**Vì sao đúng:** Lifecycle policy tự động chuyển dữ liệu ít truy cập sang storage class rẻ hơn — đúng chiến lược cost optimization mà vẫn giữ được dữ liệu để tuân thủ quy định.

**Vì sao các đáp án còn lại sai:** A không tối ưu chi phí dù đơn giản. B sai use case (EBS không phải nơi lưu trữ log dài hạn, đắt hơn Glacier và không phù hợp access pattern archive). D vi phạm yêu cầu tuân thủ giữ tối thiểu 3 năm.

**Đọc lại nếu còn yếu:** [../02-core-services/03-s3.md](../02-core-services/03-s3.md), [../03-architecture-patterns/05-cost-optimization.md](../03-architecture-patterns/05-cost-optimization.md).

### Câu 6

Một doanh nghiệp di chuyển file server Windows nội bộ (dùng SMB, tích hợp Active Directory) lên AWS, muốn giữ nguyên giao thức và trải nghiệm giống on-premise cho người dùng Windows.

**A.** Amazon EFS.
**B.** Amazon FSx for Windows File Server.
**C.** Amazon S3 với S3 File Gateway.
**D.** EBS gắn vào 1 EC2 Windows instance rồi share qua SMB thủ công.

**Đáp án đúng:** B

**Vì sao đúng:** FSx for Windows File Server là managed service hỗ trợ SMB, tích hợp Active Directory native — đúng chính xác yêu cầu.

**Vì sao các đáp án còn lại sai:** A (EFS) chỉ hỗ trợ NFS/Linux, không phù hợp Windows/SMB. C thêm độ phức tạp, không tối ưu cho use case này. D là self-managed, không đúng tinh thần managed service và tốn effort vận hành.

**Đọc lại nếu còn yếu:** [../02-core-services/02-ebs-efs-fsx.md](../02-core-services/02-ebs-efs-fsx.md), [../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md](../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md).

### Câu 7

Một ứng dụng cần 1 volume boot cho EC2 instance, hiệu năng ổn định, chỉ gắn cho đúng 1 instance, không cần chia sẻ.

**A.** Amazon EFS.
**B.** Amazon EBS.
**C.** Amazon S3.
**D.** Amazon FSx for Lustre.

**Đáp án đúng:** B

**Vì sao đúng:** EBS là block storage chuẩn cho boot volume của 1 EC2 instance — đúng use case cơ bản nhất của EBS.

**Vì sao các đáp án còn lại sai:** A/D là file storage cho shared access hoặc HPC, không phải boot volume. C là object storage, EC2 không boot trực tiếp từ S3.

**Đọc lại nếu còn yếu:** [../02-core-services/02-ebs-efs-fsx.md](../02-core-services/02-ebs-efs-fsx.md).

### Câu 8

Một tổ chức nghiên cứu cần chạy workload HPC (high performance computing) xử lý dataset lớn với throughput rất cao, tích hợp trực tiếp với S3 làm nguồn dữ liệu.

**A.** Amazon EFS.
**B.** Amazon FSx for Lustre.
**C.** Amazon EBS io2 Block Express.
**D.** Amazon S3 Transfer Acceleration.

**Đáp án đúng:** B

**Vì sao đúng:** FSx for Lustre được thiết kế riêng cho HPC, throughput rất cao, và có khả năng tích hợp trực tiếp với S3 làm data repository.

**Vì sao các đáp án còn lại sai:** A (EFS) không tối ưu cho HPC throughput mức này. C là block storage cho 1 instance, không phù hợp shared HPC workload. D chỉ tăng tốc upload/download tới S3, không phải file system cho compute cluster.

**Đọc lại nếu còn yếu:** [../02-core-services/02-ebs-efs-fsx.md](../02-core-services/02-ebs-efs-fsx.md).

## Câu 9-11: Database (RDS/Aurora/DynamoDB)

### Câu 9

Một ứng dụng thương mại điện tử dùng RDS MySQL, gần đây gặp downtime khi instance chính gặp sự cố phần cứng, gây gián đoạn dịch vụ vài phút. Yêu cầu: giảm downtime khi có sự cố, tự động failover, không cần thay đổi code ứng dụng.

**A.** Thêm Read Replica để san tải.
**B.** Bật Multi-AZ deployment cho RDS instance.
**C.** Tăng kích thước instance (vertical scaling).
**D.** Backup thường xuyên hơn để khôi phục nhanh khi có sự cố.

**Đáp án đúng:** B

**Vì sao đúng:** Multi-AZ tạo standby đồng bộ ở AZ khác và tự động failover khi instance chính gặp sự cố — đúng chính xác yêu cầu giảm downtime, tự động, không cần đổi code.

**Vì sao các đáp án còn lại sai:** A (Read Replica) giải quyết read scaling, không tự động failover cho write instance. C không giải quyết vấn đề single point of failure. D (backup) chỉ giúp khôi phục dữ liệu, không tự động failover và vẫn có downtime đáng kể.

**Đọc lại nếu còn yếu:** [../02-core-services/04-rds-aurora.md](../02-core-services/04-rds-aurora.md), [../05-exam-drills/02-exam-traps.md](../05-exam-drills/02-exam-traps.md).

### Câu 10

Một ứng dụng báo cáo (reporting) chạy nhiều truy vấn phân tích nặng trên cùng database với ứng dụng giao dịch chính (OLTP), gây chậm cho traffic giao dịch. Cần tách tải đọc ra khỏi database chính mà không ảnh hưởng tới traffic ghi.

**A.** Bật Multi-AZ và cho ứng dụng báo cáo đọc từ standby.
**B.** Tạo Read Replica riêng cho ứng dụng báo cáo.
**C.** Tăng instance class của database chính.
**D.** Chuyển toàn bộ dữ liệu sang DynamoDB.

**Đáp án đúng:** B

**Vì sao đúng:** Read Replica được thiết kế đúng cho mục đích san tải đọc (reporting/analytics) sang instance riêng, không ảnh hưởng tới write traffic ở instance chính.

**Vì sao các đáp án còn lại sai:** A sai vì Multi-AZ standby không dùng để phục vụ query trực tiếp trong kiến trúc RDS "classic" (không phải mục đích thiết kế). C không giải quyết vấn đề tách tải, chỉ tăng công suất chung. D là thay đổi kiến trúc lớn không cần thiết khi Read Replica đã giải quyết đúng vấn đề.

**Đọc lại nếu còn yếu:** [../02-core-services/04-rds-aurora.md](../02-core-services/04-rds-aurora.md), [../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md](../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md).

### Câu 11

Một ứng dụng gaming lưu trạng thái người chơi (player_id, level, score), traffic ghi rất lớn và thất thường (spike vào giờ cao điểm), không cần JOIN giữa các bảng, cần độ trễ đọc/ghi ổn định ở mức single-digit millisecond.

**A.** RDS MySQL với Multi-AZ.
**B.** Aurora với nhiều Read Replica.
**C.** DynamoDB với chế độ on-demand capacity.
**D.** DynamoDB với provisioned capacity cố định ở mức cao nhất dự kiến.

**Đáp án đúng:** C

**Vì sao đúng:** DynamoDB phù hợp với dữ liệu key-value đơn giản, không cần JOIN, và on-demand capacity xử lý tốt traffic ghi thất thường mà không cần dự đoán trước capacity — đúng cả về data model lẫn traffic pattern.

**Vì sao các đáp án còn lại sai:** A/B là relational, không cần thiết khi dữ liệu không có quan hệ phức tạp, và write scaling giới hạn hơn DynamoDB. D lãng phí chi phí vì phải cấp phát cho mức cao nhất trong khi traffic thất thường (on-demand phù hợp hơn).

**Đọc lại nếu còn yếu:** [../02-core-services/05-dynamodb.md](../02-core-services/05-dynamodb.md), [../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md](../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md).

## Câu 12-14: Network (VPC/Route 53/CloudFront)

### Câu 12

Các EC2 instance trong private subnet cần tải bản vá bảo mật (patch) từ internet định kỳ, nhưng không được phép nhận kết nối khởi tạo từ internet vào.

**A.** Gắn Internet Gateway trực tiếp cho private subnet.
**B.** Tạo NAT Gateway trong public subnet, cập nhật route table của private subnet trỏ traffic ra internet qua NAT Gateway.
**C.** Gán public IP trực tiếp cho từng instance trong private subnet.
**D.** Dùng VPC Peering để kết nối ra internet.

**Đáp án đúng:** B

**Vì sao đúng:** NAT Gateway cho phép outbound-only traffic từ private subnet ra internet, đúng yêu cầu tải patch mà không cho phép inbound khởi tạo từ internet.

**Vì sao các đáp án còn lại sai:** A cho phép traffic 2 chiều, không đúng yêu cầu "không nhận kết nối khởi tạo từ internet". C phá vỡ khái niệm private subnet. D là kết nối giữa 2 VPC, không phải cơ chế ra internet.

**Đọc lại nếu còn yếu:** [../02-core-services/06-vpc.md](../02-core-services/06-vpc.md), [../05-exam-drills/02-exam-traps.md](../05-exam-drills/02-exam-traps.md).

### Câu 13

Một ứng dụng chạy ở 2 Region, cần tự động chuyển traffic sang Region phụ nếu Region chính gặp sự cố (dựa trên health check), không cần thay đổi gì ở phía client.

**A.** Amazon CloudFront với 2 origin.
**B.** Amazon Route 53 với routing policy Failover kèm health check.
**C.** AWS Global Accelerator với endpoint cố định.
**D.** Application Load Balancer cross-Region.

**Đáp án đúng:** B

**Vì sao đúng:** Route 53 Failover routing policy kết hợp health check là cơ chế DNS-level đúng chuẩn để tự động chuyển traffic sang Region phụ khi Region chính lỗi.

**Vì sao các đáp án còn lại sai:** A (CloudFront) là CDN cache nội dung, không phải cơ chế failover theo health check giữa 2 Region cho toàn bộ ứng dụng. C có thể dùng nhưng đề không đề cập traffic non-HTTP/TCP-UDP đặc thù — Route 53 Failover là đáp án chuẩn và phổ biến hơn cho kịch bản DNS failover. D không tồn tại dưới dạng "cross-Region ALB" theo cách hoạt động mặc định của ALB.

**Đọc lại nếu còn yếu:** [../02-core-services/07-route53.md](../02-core-services/07-route53.md), [../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md](../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md).

### Câu 14

Một trang web có traffic toàn cầu, nội dung chủ yếu là static asset (ảnh, video, JS/CSS), người dùng phàn nàn tốc độ tải chậm ở các khu vực xa origin server.

**A.** Tăng instance size của origin server.
**B.** Dùng Amazon CloudFront để cache static asset tại các edge location gần người dùng.
**C.** Dùng Route 53 latency-based routing để trỏ tới origin gần nhất.
**D.** Dùng AWS Global Accelerator để tăng tốc kết nối TCP.

**Đáp án đúng:** B

**Vì sao đúng:** CloudFront cache static content ở edge location toàn cầu, giảm latency trực tiếp cho loại nội dung này — đúng công cụ cho đúng vấn đề (edge caching).

**Vì sao các đáp án còn lại sai:** A không giải quyết vấn đề khoảng cách địa lý. C giúp định tuyến DNS nhưng không cache nội dung, hiệu quả kém hơn CloudFront cho static asset. D tối ưu cho traffic non-HTTP/TCP-UDP hoặc traffic không cache được, không phải công cụ chính cho static asset caching.

**Đọc lại nếu còn yếu:** [../02-core-services/12-cloudfront.md](../02-core-services/12-cloudfront.md), [../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md](../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md).

## Câu 15-17: Compute & API (Lambda/API Gateway)

### Câu 15

Một hệ thống cần xử lý ảnh ngay khi người dùng upload lên S3 (resize, tạo thumbnail), tần suất không đều, mỗi lần xử lý chỉ mất vài giây, không muốn duy trì server chạy liên tục.

**A.** Chạy 1 EC2 instance liên tục để poll S3 và xử lý ảnh.
**B.** Dùng AWS Lambda với S3 event trigger.
**C.** Dùng ECS service chạy liên tục trên Fargate.
**D.** Dùng Amazon EventBridge để lưu ảnh trực tiếp.

**Đáp án đúng:** B

**Vì sao đúng:** Lambda với S3 event trigger là mô hình event-driven đúng chuẩn cho tác vụ ngắn, tần suất không đều, không cần duy trì server — đúng cả về chi phí lẫn operational overhead.

**Vì sao các đáp án còn lại sai:** A tốn chi phí duy trì server liên tục dù traffic không đều. C over-engineering cho tác vụ ngắn vài giây. D EventBridge là event bus định tuyến sự kiện, không phải nơi lưu/xử lý ảnh.

**Đọc lại nếu còn yếu:** [../02-core-services/09-lambda.md](../02-core-services/09-lambda.md), [../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md](../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md).

### Câu 16

Một đội phát triển cần expose 1 REST API cho đối tác bên ngoài, yêu cầu: throttling để tránh quá tải backend, xác thực bằng API key, và transform request/response mà không cần thay đổi backend Lambda.

**A.** Application Load Balancer với target group trỏ tới Lambda.
**B.** Amazon API Gateway đứng trước Lambda, cấu hình throttling và API key.
**C.** Expose Lambda Function URL trực tiếp cho đối tác.
**D.** Network Load Balancer với Lambda target.

**Đáp án đúng:** B

**Vì sao đúng:** API Gateway cung cấp đúng các tính năng API management được yêu cầu (throttling, API key, request/response transformation) mà ALB/NLB/Function URL không có sẵn.

**Vì sao các đáp án còn lại sai:** A (ALB) không hỗ trợ API key/throttling ở mức API management như API Gateway. C (Function URL) không có throttling/API key quản lý tập trung. D (NLB) hoạt động ở Layer 4, không phù hợp với các tính năng API-level được yêu cầu.

**Đọc lại nếu còn yếu:** [../02-core-services/10-api-gateway.md](../02-core-services/10-api-gateway.md), [../05-exam-drills/02-exam-traps.md](../05-exam-drills/02-exam-traps.md).

### Câu 17

Một dịch vụ backend chạy liên tục 24/7, xử lý kết nối WebSocket lâu dài (giữ session hàng giờ), cần toàn quyền kiểm soát runtime và OS.

**A.** AWS Lambda.
**B.** Amazon API Gateway REST API.
**C.** Amazon EC2.
**D.** Amazon S3 static hosting.

**Đáp án đúng:** C

**Vì sao đúng:** Kết nối lâu dài, cần kiểm soát OS/runtime sâu — vượt quá giới hạn thời gian chạy và mô hình stateless của Lambda, EC2 là lựa chọn phù hợp nhất trong 4 đáp án.

**Vì sao các đáp án còn lại sai:** A không phù hợp workload chạy dài/stateful (giới hạn thời gian thực thi, không giữ state giữa các lần invoke). B là API management layer, không phải nơi chạy compute lâu dài. D chỉ phục vụ static content, không xử lý được logic backend/WebSocket.

**Đọc lại nếu còn yếu:** [../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md](../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md).

## Câu 18-20: Messaging (SQS/SNS/EventBridge)

### Câu 18

Một hệ thống xử lý đơn hàng cần buffer request giữa service nhận đơn và service xử lý, đảm bảo không mất đơn hàng nếu service xử lý tạm thời quá tải hoặc gặp lỗi, và có khả năng retry.

**A.** Amazon SNS.
**B.** Amazon SQS Standard queue.
**C.** Amazon EventBridge.
**D.** Gọi API đồng bộ trực tiếp giữa 2 service.

**Đáp án đúng:** B

**Vì sao đúng:** SQS lưu trữ message cho tới khi được consume, hỗ trợ retry và visibility timeout — đúng chính xác nhu cầu buffer + đảm bảo không mất message khi consumer quá tải/lỗi tạm thời.

**Vì sao các đáp án còn lại sai:** A (SNS) không lưu trữ message, cần subscriber sẵn sàng nhận ngay. C (EventBridge) phù hợp định tuyến sự kiện theo rule hơn là buffer đơn giản giữa 2 service. D là giao tiếp đồng bộ, không giải quyết vấn đề buffer/retry và tạo coupling chặt.

**Đọc lại nếu còn yếu:** [../02-core-services/11-sqs-sns-eventbridge.md](../02-core-services/11-sqs-sns-eventbridge.md), [../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md](../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md).

### Câu 19

Khi có đơn hàng mới, hệ thống cần gửi đồng thời thông báo tới 3 hệ thống khác nhau: gửi email xác nhận, cập nhật kho hàng, và ghi log phân tích. Cả 3 cần nhận được sự kiện gần như ngay lập tức.

**A.** Gọi lần lượt 3 API riêng biệt từ service tạo đơn hàng.
**B.** Amazon SNS với 3 subscriber (fanout pattern).
**C.** 1 SQS queue duy nhất, để cả 3 hệ thống cùng poll.
**D.** Lưu đơn hàng vào DynamoDB rồi để mỗi hệ thống tự query định kỳ.

**Đáp án đúng:** B

**Vì sao đúng:** SNS fanout gửi đồng thời 1 message tới nhiều subscriber độc lập — đúng chuẩn cho broadcast tới nhiều hệ thống cùng lúc.

**Vì sao các đáp án còn lại sai:** A tạo coupling chặt và chậm hơn khi gọi tuần tự. C sai vì 1 SQS message chỉ được 1 consumer trong nhóm xử lý (không phải broadcast tới cả 3). D thêm độ trễ (polling định kỳ) và không đúng tinh thần "gần như ngay lập tức".

**Đọc lại nếu còn yếu:** [../02-core-services/11-sqs-sns-eventbridge.md](../02-core-services/11-sqs-sns-eventbridge.md), [../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md](../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md).

### Câu 20

Một công ty tích hợp nhiều nguồn sự kiện khác nhau (ứng dụng nội bộ, dịch vụ AWS, và cả SaaS bên thứ ba), cần định tuyến từng loại sự kiện tới đúng service xử lý dựa trên nội dung/loại sự kiện, không muốn viết logic routing thủ công trong code.

**A.** Amazon SQS với nhiều queue riêng cho từng loại sự kiện, tự phân loại trong code.
**B.** Amazon SNS với message filtering.
**C.** Amazon EventBridge với event bus và rule định tuyến theo pattern.
**D.** AWS Lambda nhận toàn bộ sự kiện rồi tự viết if/else để phân loại.

**Đáp án đúng:** C

**Vì sao đúng:** EventBridge được thiết kế đúng cho việc định tuyến sự kiện từ nhiều nguồn (bao gồm SaaS) dựa trên rule/pattern mà không cần viết logic routing thủ công.

**Vì sao các đáp án còn lại sai:** A yêu cầu tự viết logic phân loại, không tận dụng được khả năng định tuyến có sẵn. B (SNS filtering) có thể lọc theo attribute nhưng không mạnh bằng EventBridge cho việc tích hợp đa nguồn kể cả SaaS. D đặt toàn bộ logic routing vào code, không tối ưu và khó mở rộng.

**Đọc lại nếu còn yếu:** [../02-core-services/11-sqs-sns-eventbridge.md](../02-core-services/11-sqs-sns-eventbridge.md), [../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md](../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md).

## Câu 21-23: Ops (CloudWatch/CloudTrail/Config)

### Câu 21

Đội vận hành muốn tự động scale thêm EC2 instance khi CPU utilization trung bình vượt 70% trong 5 phút liên tục.

**A.** AWS Config rule.
**B.** Amazon CloudWatch alarm gắn với Auto Scaling policy.
**C.** AWS CloudTrail event.
**D.** Amazon EventBridge scheduled rule chạy mỗi 5 phút để kiểm tra thủ công.

**Đáp án đúng:** B

**Vì sao đúng:** CloudWatch alarm theo dõi metric (CPU utilization) và có thể kích hoạt Auto Scaling policy trực tiếp — đúng cơ chế chuẩn cho scaling dựa trên performance metric.

**Vì sao các đáp án còn lại sai:** A (Config) theo dõi thay đổi cấu hình/compliance, không phải performance metric real-time. C (CloudTrail) ghi lại API call, không phải công cụ theo dõi metric hiệu năng. D là cách làm thủ công, không tận dụng cơ chế alarm-triggered scaling có sẵn.

**Đọc lại nếu còn yếu:** [../02-core-services/13-cloudwatch-cloudtrail-config.md](../02-core-services/13-cloudwatch-cloudtrail-config.md).

### Câu 22

Sau một sự cố bảo mật, đội security cần xác định chính xác ai đã xóa 1 S3 bucket quan trọng, vào thời điểm nào, từ địa chỉ IP nào.

**A.** Amazon CloudWatch Logs.
**B.** AWS CloudTrail.
**C.** AWS Config.
**D.** Amazon S3 Access Logs only.

**Đáp án đúng:** B

**Vì sao đúng:** CloudTrail ghi lại API call (ai gọi, khi nào, từ đâu) — đúng công cụ audit trail để trả lời câu hỏi "ai đã làm gì".

**Vì sao các đáp án còn lại sai:** A (CloudWatch Logs) phù hợp cho log ứng dụng/hệ thống, không phải audit trail API call theo identity mặc định. C (Config) theo dõi thay đổi cấu hình theo thời gian nhưng không phải công cụ chính để trả lời "ai" đã thực hiện hành động (dù có thể liên kết CloudTrail). D chỉ ghi lại truy cập dữ liệu trong bucket, không ghi lại hành động quản trị như xóa bucket.

**Đọc lại nếu còn yếu:** [../02-core-services/13-cloudwatch-cloudtrail-config.md](../02-core-services/13-cloudwatch-cloudtrail-config.md).

### Câu 23

Một tổ chức cần đảm bảo tất cả Security Group trong tài khoản AWS không bao giờ mở port 22 (SSH) cho 0.0.0.0/0, và muốn được cảnh báo tự động ngay khi có ai đó vô tình tạo rule vi phạm.

**A.** Amazon CloudWatch Logs Insights query định kỳ.
**B.** AWS Config rule với remediation/notification khi phát hiện vi phạm.
**C.** AWS CloudTrail Insights.
**D.** Amazon GuardDuty threat detection only.

**Đáp án đúng:** B

**Vì sao đúng:** Config rule theo dõi cấu hình resource liên tục và có thể phát hiện/cảnh báo ngay khi cấu hình lệch khỏi baseline mong muốn (compliance) — đúng use case theo dõi cấu hình liên tục.

**Vì sao các đáp án còn lại sai:** A không theo dõi liên tục, cần chạy query thủ công. C (CloudTrail Insights) phát hiện bất thường trong API call pattern, không phải công cụ chính để theo dõi compliance cấu hình liên tục. D là công cụ phát hiện threat, không phải công cụ theo dõi configuration compliance chuyên biệt.

**Đọc lại nếu còn yếu:** [../02-core-services/13-cloudwatch-cloudtrail-config.md](../02-core-services/13-cloudwatch-cloudtrail-config.md).

## Câu 24-26: Security (KMS/Secrets Manager/Parameter Store)

### Câu 24

Một ứng dụng cần mã hóa dữ liệu nhạy cảm lưu trên S3 và EBS, với khả năng kiểm soát quyền sử dụng key riêng cho từng team, và có audit log về việc key được dùng khi nào.

**A.** Tự triển khai thuật toán mã hóa trong ứng dụng.
**B.** AWS KMS với customer managed key.
**C.** AWS Secrets Manager.
**D.** AWS Systems Manager Parameter Store SecureString.

**Đáp án đúng:** B

**Vì sao đúng:** KMS là dịch vụ quản lý encryption key, hỗ trợ customer managed key với key policy riêng cho từng team và tích hợp CloudTrail để audit việc sử dụng key — đúng chính xác yêu cầu.

**Vì sao các đáp án còn lại sai:** A tốn effort, dễ sai sót bảo mật, không tận dụng managed service. C/D là nơi lưu secret/config ứng dụng, không phải dịch vụ quản lý encryption key cho S3/EBS ở tầng hạ tầng.

**Đọc lại nếu còn yếu:** [../02-core-services/14-kms-secrets-manager-parameter-store.md](../02-core-services/14-kms-secrets-manager-parameter-store.md).

### Câu 25

Một ứng dụng kết nối RDS bằng username/password, yêu cầu bảo mật buộc phải xoay vòng (rotate) mật khẩu tự động định kỳ mà không cần deploy lại ứng dụng.

**A.** AWS Systems Manager Parameter Store (String).
**B.** AWS Secrets Manager với automatic rotation cấu hình sẵn cho RDS.
**C.** Lưu mật khẩu trong biến môi trường của EC2.
**D.** AWS KMS.

**Đáp án đúng:** B

**Vì sao đúng:** Secrets Manager hỗ trợ automatic rotation tích hợp sẵn cho RDS, đúng chính xác yêu cầu xoay vòng tự động mà không cần deploy lại.

**Vì sao các đáp án còn lại sai:** A (Parameter Store) không có rotation tự động built-in như Secrets Manager. C không an toàn và không hỗ trợ rotation tự động. D là dịch vụ quản lý key mã hóa, không phải nơi lưu và xoay vòng credential ứng dụng.

**Đọc lại nếu còn yếu:** [../04-comparison-guides/06-secrets-manager-vs-parameter-store.md](../04-comparison-guides/06-secrets-manager-vs-parameter-store.md).

### Câu 26

Một ứng dụng cần lưu các giá trị cấu hình (feature flag, endpoint URL, số lượng worker) không cần rotation tự động, chi phí thấp, truy xuất được từ Lambda và EC2.

**A.** AWS Secrets Manager.
**B.** AWS Systems Manager Parameter Store.
**C.** Amazon S3 với object mã hóa.
**D.** AWS KMS.

**Đáp án đúng:** B

**Vì sao đúng:** Parameter Store phù hợp cho config value đơn giản, chi phí thấp hơn Secrets Manager, không cần tính năng rotation phức tạp — đúng use case.

**Vì sao các đáp án còn lại sai:** A đắt hơn và có tính năng rotation không cần thiết cho use case này. C không phải nơi thiết kế cho config key-value, thêm độ phức tạp không cần thiết. D là dịch vụ quản lý key, không lưu config value trực tiếp.

**Đọc lại nếu còn yếu:** [../04-comparison-guides/06-secrets-manager-vs-parameter-store.md](../04-comparison-guides/06-secrets-manager-vs-parameter-store.md).

## Câu 27-28: Cost Optimization

### Câu 27

Một công ty chạy workload ổn định 24/7 trên EC2 trong ít nhất 1 năm tới (đã xác nhận với business), muốn giảm chi phí compute tối đa mà không thay đổi kiến trúc.

**A.** Chuyển sang Spot Instances cho toàn bộ workload.
**B.** Mua Reserved Instances hoặc Savings Plans cho baseline capacity đã biết trước.
**C.** Giữ nguyên On-Demand vì linh hoạt nhất.
**D.** Giảm số lượng instance xuống mức tối thiểu để tiết kiệm.

**Đáp án đúng:** B

**Vì sao đúng:** Workload ổn định, dự đoán được trong dài hạn (1 năm) là kịch bản kinh điển cho Reserved Instances/Savings Plans — giảm chi phí đáng kể so với On-Demand mà không đổi kiến trúc.

**Vì sao các đáp án còn lại sai:** A (Spot) rủi ro bị thu hồi bất kỳ lúc nào, không phù hợp workload ổn định cần chạy liên tục 24/7. C không tối ưu chi phí khi đã biết trước nhu cầu dài hạn. D có thể ảnh hưởng khả năng đáp ứng tải, không phải giải pháp cost optimization đúng nghĩa nếu làm giảm hiệu năng cần thiết.

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/05-cost-optimization.md](../03-architecture-patterns/05-cost-optimization.md).

### Câu 28

Một hệ thống batch xử lý dữ liệu ban đêm, có thể chịu được việc bị gián đoạn và chạy lại, không yêu cầu chạy liên tục đúng giờ, muốn tối ưu chi phí compute tối đa.

**A.** On-Demand Instances.
**B.** Reserved Instances.
**C.** Spot Instances.
**D.** Dedicated Hosts.

**Đáp án đúng:** C

**Vì sao đúng:** Spot Instances rẻ hơn đáng kể so với On-Demand, phù hợp với workload chịu được gián đoạn (fault-tolerant, có thể chạy lại) như batch job không yêu cầu thời gian chạy cố định.

**Vì sao các đáp án còn lại sai:** A không tối ưu chi phí bằng Spot cho use case chịu được gián đoạn. B phù hợp workload chạy liên tục dài hạn, không phải batch job linh hoạt về thời gian. D tốn kém nhất, dùng cho yêu cầu compliance/licensing đặc thù, không liên quan tới bài toán này.

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/05-cost-optimization.md](../03-architecture-patterns/05-cost-optimization.md).

## Câu 29: Security Architecture

Một công ty cần thiết kế lại bảo mật cho ứng dụng 3 tầng (web/app/database) trên VPC. Yêu cầu: web tier là tầng duy nhất tiếp xúc internet, app/database tier không có route ra internet trực tiếp, và mỗi tầng chỉ được phép giao tiếp với tầng liền kề.

**A.** Đặt cả 3 tầng trong cùng 1 public subnet, dùng Security Group để hạn chế truy cập.
**B.** Đặt web tier ở public subnet; app và database tier ở private subnet riêng; dùng Security Group giữa các tầng theo mô hình least privilege (chỉ cho phép traffic từ tầng liền kề).
**C.** Đặt toàn bộ 3 tầng ở private subnet, dùng Internet Gateway để cho phép truy cập khi cần.
**D.** Chỉ dùng NACL để kiểm soát truy cập giữa các tầng, không cần Security Group.

**Đáp án đúng:** B

**Vì sao đúng:** Đây là mô hình defense in depth chuẩn: tách tầng theo subnet (network isolation), chỉ web tier public, và Security Group least privilege giữa các tầng — đáp ứng đầy đủ cả 2 yêu cầu (zero public exposure cho app/db, giao tiếp giới hạn theo tầng liền kề).

**Vì sao các đáp án còn lại sai:** A vi phạm yêu cầu "chỉ web tier tiếp xúc internet" vì cả 3 tầng cùng public subnet. C không hợp lý vì database/app tier không cần và không nên có route internet. D chỉ dùng 1 lớp bảo mật (NACL) là chưa đủ theo tinh thần defense in depth — nên kết hợp cả Security Group (instance-level, stateful) lẫn NACL (subnet-level) khi cần.

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/06-security-architecture.md](../03-architecture-patterns/06-security-architecture.md), [../02-core-services/06-vpc.md](../02-core-services/06-vpc.md).

## Câu 30: Migration / Hybrid

Một doanh nghiệp cần di chuyển database on-premise (vài TB) sang RDS với thời gian downtime tối thiểu, đồng thời cần một kết nối mạng ổn định, băng thông cao, độ trễ thấp và nhất quán lâu dài giữa data center và AWS cho các ứng dụng hybrid khác.

**A.** Xuất dữ liệu ra file, dùng Snowball để chuyển sang S3 rồi import vào RDS, dùng Site-to-Site VPN cho kết nối hybrid.
**B.** Dùng AWS Database Migration Service (DMS) với replication liên tục để migrate gần như không downtime; dùng AWS Direct Connect cho kết nối hybrid ổn định lâu dài.
**C.** Dùng Site-to-Site VPN để migrate trực tiếp database qua internet, không cần dịch vụ migration chuyên biệt.
**D.** Dùng Snow Family cho cả migration lẫn kết nối hybrid lâu dài.

**Đáp án đúng:** B

**Vì sao đúng:** DMS hỗ trợ migrate database với continuous replication, giảm downtime tối đa (đúng yêu cầu online migration). Direct Connect cung cấp kết nối dedicated, băng thông cao, độ trễ thấp và ổn định hơn VPN qua internet — đúng cho nhu cầu hybrid lâu dài.

**Vì sao các đáp án còn lại sai:** A (Snowball) phù hợp offline/bulk transfer dữ liệu tĩnh lớn, không tối ưu cho migration database cần downtime tối thiểu (không có continuous replication); VPN dù dùng được cho hybrid nhưng không đáp ứng "băng thông cao, độ trễ thấp, ổn định lâu dài" tốt bằng Direct Connect. C có thể chậm và kém tin cậy hơn dùng DMS, đặc biệt với vài TB dữ liệu. D (Snow Family) là thiết bị vận chuyển dữ liệu vật lý, không phải giải pháp kết nối mạng lâu dài.

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/08-migration-and-hybrid.md](../03-architecture-patterns/08-migration-and-hybrid.md).

## Key takeaways

- Mỗi câu scenario luôn có 1 non-functional requirement trọng tâm ẩn trong bối cảnh — xác định đúng nó trước khi đọc 4 đáp án.
- "Best answer" luôn là đáp án đáp ứng đúng và đủ yêu cầu, không thừa (over-engineering) và không thiếu.
- Nếu sai câu nào, đọc kỹ phần "Vì sao các đáp án còn lại sai" trước khi mở file lý thuyết — thường lỗi nằm ở việc bỏ sót 1 ràng buộc trong đề.

## Checklist tự ôn

- [ ] Tôi làm đúng tối thiểu 24/30 câu (80%) mà không xem đáp án trước.
- [ ] Với mỗi câu sai, tôi đã đọc lại đúng file lý thuyết được dẫn.
- [ ] Tôi có thể tự giải thích lại lý do đúng/sai cho ít nhất 10 câu bất kỳ mà không cần mở lại file.

## Xem tiếp / Liên kết liên quan

- [02-topic-based-questions.md](./02-topic-based-questions.md)
- [../05-exam-drills/02-exam-traps.md](../05-exam-drills/02-exam-traps.md)
- [../05-exam-drills/03-decision-trees.md](../05-exam-drills/03-decision-trees.md)
- [README.md](./README.md)
