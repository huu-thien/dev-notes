# Topic-Based Questions

30 câu hỏi ngắn, trực diện, kiểm tra từng cụm kiến thức/trap cụ thể đã học ở [../05-exam-drills/02-exam-traps.md](../05-exam-drills/02-exam-traps.md). Tự chọn đáp án trước khi xem **Đáp án đúng**.

## Mục tiêu học

- Kiểm tra nhanh từng trap riêng lẻ, không cần đọc bối cảnh dài.
- Củng cố phản xạ phân biệt các cặp/cụm dịch vụ dễ nhầm.
- Biết chính xác nên đọc lại file nào nếu còn sai.

## Mục lục

- [Câu 1-2: Security Group vs NACL](#câu-1-2-security-group-vs-nacl)
- [Câu 3-4: Internet Gateway vs NAT Gateway](#câu-3-4-internet-gateway-vs-nat-gateway)
- [Câu 5-6: Multi-AZ vs Read Replica](#câu-5-6-multi-az-vs-read-replica)
- [Câu 7-8: RDS/Aurora vs DynamoDB](#câu-7-8-rdsaurora-vs-dynamodb)
- [Câu 9-11: S3 vs EBS vs EFS vs FSx](#câu-9-11-s3-vs-ebs-vs-efs-vs-fsx)
- [Câu 12-13: Lambda vs ECS/Fargate vs EC2](#câu-12-13-lambda-vs-ecsfargate-vs-ec2)
- [Câu 14-15: API Gateway vs ALB](#câu-14-15-api-gateway-vs-alb)
- [Câu 16-18: SQS vs SNS vs EventBridge](#câu-16-18-sqs-vs-sns-vs-eventbridge)
- [Câu 19-21: CloudWatch vs CloudTrail vs Config](#câu-19-21-cloudwatch-vs-cloudtrail-vs-config)
- [Câu 22-24: KMS vs Secrets Manager vs Parameter Store](#câu-22-24-kms-vs-secrets-manager-vs-parameter-store)
- [Câu 25-27: Route 53 vs CloudFront vs Global Accelerator](#câu-25-27-route-53-vs-cloudfront-vs-global-accelerator)
- [Câu 28: HA vs Fault Tolerance vs DR](#câu-28-ha-vs-fault-tolerance-vs-dr)
- [Câu 29: Backup vs HA vs DR](#câu-29-backup-vs-ha-vs-dr)
- [Câu 30: SQS Standard vs FIFO](#câu-30-sqs-standard-vs-fifo)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Câu 1-2: Security Group vs NACL

### Câu 1

Thành phần bảo mật nào hoạt động ở cấp instance/ENI, có tính chất stateful (traffic trả về tự động được cho phép), và chỉ hỗ trợ allow rule?

**A.** Network ACL
**B.** Security Group
**C.** Route Table
**D.** VPC Flow Logs

**Đáp án đúng:** B

**Giải thích ngắn:** Security Group gắn ở instance/ENI, stateful, chỉ có allow rule (mọi thứ không được allow mặc định là deny).

**Trap liên quan:** Security Group vs NACL — nhầm lẫn tính chất stateful/stateless và cấp độ áp dụng.

**Đọc lại nếu còn yếu:** [../01-foundation/03-networking-basics.md](../01-foundation/03-networking-basics.md).

### Câu 2

Thành phần bảo mật nào hoạt động ở cấp subnet, stateless (traffic ra và vào phải được cho phép riêng), và hỗ trợ cả allow lẫn deny rule theo thứ tự rule number?

**A.** Security Group
**B.** IAM policy
**C.** Network ACL
**D.** KMS key policy

**Đáp án đúng:** C

**Giải thích ngắn:** NACL gắn ở cấp subnet, stateless, xử lý rule theo thứ tự số và hỗ trợ cả deny rule — khác biệt căn bản với Security Group.

**Trap liên quan:** Security Group vs NACL.

**Đọc lại nếu còn yếu:** [../01-foundation/03-networking-basics.md](../01-foundation/03-networking-basics.md).

## Câu 3-4: Internet Gateway vs NAT Gateway

### Câu 3

Thành phần nào cho phép resource trong public subnet giao tiếp 2 chiều với internet (cả inbound lẫn outbound)?

**A.** NAT Gateway
**B.** Internet Gateway
**C.** VPC Endpoint
**D.** Transit Gateway

**Đáp án đúng:** B

**Giải thích ngắn:** Internet Gateway cho phép traffic 2 chiều giữa VPC và internet, gắn với public subnet qua route table.

**Trap liên quan:** Internet Gateway vs NAT Gateway.

**Đọc lại nếu còn yếu:** [../02-core-services/06-vpc.md](../02-core-services/06-vpc.md).

### Câu 4

Thành phần nào cho phép instance trong private subnet chủ động kết nối ra internet (VD: tải update), nhưng không cho phép internet chủ động kết nối vào?

**A.** Internet Gateway
**B.** NAT Gateway
**C.** Security Group
**D.** Route 53

**Đáp án đúng:** B

**Giải thích ngắn:** NAT Gateway chỉ cho phép outbound traffic khởi tạo từ private subnet ra ngoài, không cho phép inbound khởi tạo từ internet.

**Trap liên quan:** Internet Gateway vs NAT Gateway.

**Đọc lại nếu còn yếu:** [../02-core-services/06-vpc.md](../02-core-services/06-vpc.md).

## Câu 5-6: Multi-AZ vs Read Replica

### Câu 5

Cơ chế RDS nào cung cấp automatic failover sang standby ở AZ khác khi instance chính gặp sự cố?

**A.** Read Replica
**B.** Multi-AZ deployment
**C.** Automated backup
**D.** Manual snapshot

**Đáp án đúng:** B

**Giải thích ngắn:** Multi-AZ tạo standby đồng bộ và tự động failover khi instance chính lỗi — mục đích chính là HA.

**Trap liên quan:** Multi-AZ vs Read Replica.

**Đọc lại nếu còn yếu:** [../02-core-services/04-rds-aurora.md](../02-core-services/04-rds-aurora.md).

### Câu 6

Cơ chế RDS nào được dùng để san tải đọc (VD: cho ứng dụng báo cáo) mà không tự động failover khi instance chính gặp sự cố?

**A.** Multi-AZ standby
**B.** Read Replica
**C.** Snapshot
**D.** Security Group

**Đáp án đúng:** B

**Giải thích ngắn:** Read Replica đồng bộ bất đồng bộ từ instance chính, phục vụ mục đích scale đọc, không tự động failover (trừ khi được promote thủ công).

**Trap liên quan:** Multi-AZ vs Read Replica.

**Đọc lại nếu còn yếu:** [../02-core-services/04-rds-aurora.md](../02-core-services/04-rds-aurora.md), [../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md](../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md).

## Câu 7-8: RDS/Aurora vs DynamoDB

### Câu 7

Loại database nào phù hợp nhất khi ứng dụng cần truy vấn JOIN nhiều bảng và transaction ACID phức tạp qua nhiều entity?

**A.** DynamoDB
**B.** RDS/Aurora
**C.** S3
**D.** ElastiCache

**Đáp án đúng:** B

**Giải thích ngắn:** Quan hệ dữ liệu phức tạp (JOIN, transaction đa bảng) là use case cốt lõi của relational database, không phải NoSQL key-value.

**Trap liên quan:** RDS/Aurora vs DynamoDB — chọn theo data model trước, không chọn vì "serverless nghe hiện đại hơn".

**Đọc lại nếu còn yếu:** [../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md](../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md).

### Câu 8

Điều gì đúng nhất khi mô tả lý do chọn DynamoDB thay vì RDS/Aurora?

**A.** Vì DynamoDB luôn rẻ hơn RDS/Aurora trong mọi trường hợp.
**B.** Vì dữ liệu dạng key-value/document, cần scale ghi/đọc lớn với độ trễ thấp ổn định, không cần JOIN phức tạp.
**C.** Vì DynamoDB là dịch vụ mới hơn nên luôn được ưu tiên.
**D.** Vì DynamoDB hỗ trợ SQL đầy đủ như RDS.

**Đáp án đúng:** B

**Giải thích ngắn:** Lý do chọn DynamoDB phải dựa trên đặc điểm dữ liệu và traffic pattern, không phải chi phí tuyệt đối hay vì "mới hơn".

**Trap liên quan:** RDS/Aurora vs DynamoDB — bẫy "serverless/mới luôn tốt hơn".

**Đọc lại nếu còn yếu:** [../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md](../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md).

## Câu 9-11: S3 vs EBS vs EFS vs FSx

### Câu 9

Dịch vụ storage nào cho phép nhiều EC2 instance Linux cùng mount và đọc/ghi chung 1 file system theo thời gian thực (POSIX)?

**A.** Amazon S3
**B.** Amazon EBS
**C.** Amazon EFS
**D.** Amazon EBS Multi-Attach cho mọi volume type

**Đáp án đúng:** C

**Giải thích ngắn:** EFS là managed file storage hỗ trợ shared access nhiều instance Linux đồng thời qua NFS.

**Trap liên quan:** S3 vs EBS vs EFS vs FSx — bẫy "EBS chia sẻ được nhiều instance" (chỉ đúng với io1/io2 Multi-Attach, rất hạn chế và hiếm gặp trong đề).

**Đọc lại nếu còn yếu:** [../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md](../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md).

### Câu 10

Dịch vụ nào KHÔNG phải là file system và không nên được dùng để mount trực tiếp như ổ đĩa cho ứng dụng cần thao tác file theo path/folder truyền thống?

**A.** Amazon EFS
**B.** Amazon FSx
**C.** Amazon S3
**D.** Amazon EBS

**Đáp án đúng:** C

**Giải thích ngắn:** S3 là object storage, truy cập qua API/HTTP, không phải file system POSIX — không nên dùng như network drive cho ứng dụng cần path/folder semantics.

**Trap liên quan:** S3 vs EBS vs EFS vs FSx — bẫy "dùng S3 như file system".

**Đọc lại nếu còn yếu:** [../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md](../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md).

### Câu 11

Dịch vụ nào phù hợp nhất cho use case file server Windows dùng giao thức SMB, tích hợp Active Directory?

**A.** Amazon EFS
**B.** Amazon FSx for Windows File Server
**C.** Amazon S3
**D.** Amazon EBS gắn vào EC2 Linux

**Đáp án đúng:** B

**Giải thích ngắn:** FSx for Windows File Server hỗ trợ SMB và tích hợp AD native — EFS chỉ hỗ trợ Linux/NFS, không phù hợp Windows.

**Trap liên quan:** S3 vs EBS vs EFS vs FSx — bẫy "EFS dùng được cho Windows".

**Đọc lại nếu còn yếu:** [../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md](../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md).

## Câu 12-13: Lambda vs ECS/Fargate vs EC2

### Câu 12

Mô hình compute nào KHÔNG phù hợp cho workload cần chạy liên tục nhiều giờ và giữ state trong bộ nhớ giữa các request?

**A.** Amazon EC2
**B.** ECS/Fargate
**C.** AWS Lambda
**D.** ECS trên EC2

**Đáp án đúng:** C

**Giải thích ngắn:** Lambda giới hạn thời gian thực thi và có mô hình stateless execution — không phù hợp workload chạy dài, giữ state liên tục giữa các request.

**Trap liên quan:** Lambda vs ECS/Fargate vs EC2 — bẫy "serverless luôn là lựa chọn tốt nhất".

**Đọc lại nếu còn yếu:** [../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md](../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md).

### Câu 13

Giữa ECS/Fargate và EC2 tự quản lý, tiêu chí nào là khác biệt cốt lõi khi ra quyết định?

**A.** Fargate luôn nhanh hơn EC2 trong mọi trường hợp.
**B.** Mức độ kiểm soát OS/server bên dưới — Fargate để AWS quản lý server, EC2 cho toàn quyền kiểm soát.
**C.** EC2 không hỗ trợ container còn Fargate mới hỗ trợ.
**D.** Fargate chỉ dùng được cho ứng dụng viết bằng Python.

**Đáp án đúng:** B

**Giải thích ngắn:** Khác biệt cốt lõi là ai quản lý server bên dưới (operational overhead) — không phải về ngôn ngữ lập trình hay việc hỗ trợ container (EC2 vẫn chạy container được qua ECS/EKS on EC2).

**Trap liên quan:** Lambda vs ECS/Fargate vs EC2.

**Đọc lại nếu còn yếu:** [../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md](../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md).

## Câu 14-15: API Gateway vs ALB

### Câu 14

Dịch vụ nào cung cấp sẵn tính năng throttling, API key, và request/response transformation cho REST API mà không cần tự viết logic đó?

**A.** Application Load Balancer
**B.** Network Load Balancer
**C.** Amazon API Gateway
**D.** Amazon Route 53

**Đáp án đúng:** C

**Giải thích ngắn:** API Gateway là tầng API management, có sẵn throttling/API key/transformation — ALB/NLB chỉ phân phối traffic ở Layer 7/Layer 4, không có các tính năng API management này.

**Trap liên quan:** API Gateway vs ALB.

**Đọc lại nếu còn yếu:** [../02-core-services/10-api-gateway.md](../02-core-services/10-api-gateway.md).

### Câu 15

Điều nào đúng khi so sánh API Gateway và ALB cho việc expose HTTP API tới backend là EC2/containers?

**A.** API Gateway luôn thay thế hoàn toàn được ALB trong mọi kiến trúc.
**B.** ALB phù hợp hơn khi chỉ cần load balancing traffic HTTP(S) tới target group, không cần các tính năng API management.
**C.** ALB không thể trỏ tới target là Lambda.
**D.** API Gateway không thể tích hợp với backend là EC2/containers.

**Đáp án đúng:** B

**Giải thích ngắn:** Khi yêu cầu chỉ đơn thuần là load balancing (không cần throttling/API key/transformation), ALB là lựa chọn đơn giản và phù hợp hơn; API Gateway phù hợp khi cần lớp API management.

**Trap liên quan:** API Gateway vs ALB — bẫy nghĩ 1 dịch vụ luôn thay thế được dịch vụ kia.

**Đọc lại nếu còn yếu:** [../02-core-services/10-api-gateway.md](../02-core-services/10-api-gateway.md).

## Câu 16-18: SQS vs SNS vs EventBridge

### Câu 16

Dịch vụ nào lưu trữ message cho tới khi được consumer xử lý/xóa, phù hợp cho mô hình buffer + retry?

**A.** Amazon SNS
**B.** Amazon SQS
**C.** Amazon EventBridge
**D.** Amazon CloudWatch

**Đáp án đúng:** B

**Giải thích ngắn:** SQS là queue, lưu trữ message cho tới khi được consume — đúng nghĩa buffer với visibility timeout và dead-letter queue hỗ trợ retry.

**Trap liên quan:** SQS vs SNS vs EventBridge.

**Đọc lại nếu còn yếu:** [../02-core-services/11-sqs-sns-eventbridge.md](../02-core-services/11-sqs-sns-eventbridge.md).

### Câu 17

Điều nào đúng về Amazon SNS?

**A.** SNS lưu trữ message giống như queue cho tới khi subscriber sẵn sàng nhận.
**B.** SNS không lưu trữ message; cần subscriber đã đăng ký sẵn để nhận ngay khi message được publish (thường kết hợp SQS để buffer).
**C.** SNS chỉ hỗ trợ 1 subscriber cho mỗi topic.
**D.** SNS là dịch vụ định tuyến event theo rule phức tạp như EventBridge.

**Đáp án đúng:** B

**Giải thích ngắn:** SNS là pub/sub, không lưu trữ message — nếu subscriber chưa sẵn sàng, message có thể mất trừ khi kết hợp thêm SQS làm buffer cho từng subscriber.

**Trap liên quan:** SQS vs SNS vs EventBridge — bẫy "SNS lưu message như queue".

**Đọc lại nếu còn yếu:** [../02-core-services/11-sqs-sns-eventbridge.md](../02-core-services/11-sqs-sns-eventbridge.md).

### Câu 18

Khi nào nên chọn EventBridge thay vì SQS/SNS?

**A.** Khi chỉ cần buffer đơn giản giữa 2 service.
**B.** Khi cần định tuyến sự kiện từ nhiều nguồn (kể cả SaaS bên thứ ba) theo rule/pattern dựa trên nội dung sự kiện.
**C.** Khi cần đảm bảo thứ tự xử lý tuyệt đối cho mọi message.
**D.** Khi ứng dụng chỉ có 1 producer và 1 consumer duy nhất, không có logic định tuyến.

**Đáp án đúng:** B

**Giải thích ngắn:** EventBridge phù hợp cho kịch bản có nhiều nguồn sự kiện và cần định tuyến theo rule — dùng cho trường hợp đơn giản (A, D) là over-engineering.

**Trap liên quan:** SQS vs SNS vs EventBridge — bẫy "EventBridge thay thế hàng đợi (queue)".

**Đọc lại nếu còn yếu:** [../02-core-services/11-sqs-sns-eventbridge.md](../02-core-services/11-sqs-sns-eventbridge.md), [../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md](../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md).

## Câu 19-21: CloudWatch vs CloudTrail vs Config

### Câu 19

Dịch vụ nào phù hợp nhất để theo dõi metric hiệu năng (CPU, memory, latency) và kích hoạt alarm khi vượt ngưỡng?

**A.** AWS CloudTrail
**B.** AWS Config
**C.** Amazon CloudWatch
**D.** AWS Trusted Advisor only

**Đáp án đúng:** C

**Giải thích ngắn:** CloudWatch là dịch vụ metrics/logs/alarms, đúng công cụ theo dõi hiệu năng real-time.

**Trap liên quan:** CloudWatch vs CloudTrail vs Config.

**Đọc lại nếu còn yếu:** [../02-core-services/13-cloudwatch-cloudtrail-config.md](../02-core-services/13-cloudwatch-cloudtrail-config.md).

### Câu 20

Dịch vụ nào ghi lại lịch sử API call trong tài khoản AWS (ai gọi, khi nào, từ IP nào) phục vụ audit?

**A.** Amazon CloudWatch
**B.** AWS CloudTrail
**C.** AWS Config
**D.** Amazon Inspector

**Đáp án đúng:** B

**Giải thích ngắn:** CloudTrail là audit trail cho API call, khác hoàn toàn với việc theo dõi metric (CloudWatch) hay cấu hình resource (Config).

**Trap liên quan:** CloudWatch vs CloudTrail vs Config.

**Đọc lại nếu còn yếu:** [../02-core-services/13-cloudwatch-cloudtrail-config.md](../02-core-services/13-cloudwatch-cloudtrail-config.md).

### Câu 21

Dịch vụ nào phù hợp nhất để theo dõi và cảnh báo khi cấu hình của 1 resource (VD: Security Group) thay đổi khỏi trạng thái tuân thủ mong muốn theo thời gian?

**A.** AWS Config
**B.** Amazon CloudWatch Logs
**C.** AWS CloudTrail
**D.** Amazon S3 Access Logs

**Đáp án đúng:** A

**Giải thích ngắn:** Config theo dõi configuration state của resource theo thời gian và có thể đánh giá compliance dựa trên rule — không phải công cụ giám sát hiệu năng real-time.

**Trap liên quan:** CloudWatch vs CloudTrail vs Config — bẫy nghĩ Config là "realtime performance monitoring tool".

**Đọc lại nếu còn yếu:** [../02-core-services/13-cloudwatch-cloudtrail-config.md](../02-core-services/13-cloudwatch-cloudtrail-config.md).

## Câu 22-24: KMS vs Secrets Manager vs Parameter Store

### Câu 22

Dịch vụ nào chịu trách nhiệm quản lý encryption key dùng để mã hóa/giải mã dữ liệu (VD: cho S3, EBS), không phải nơi lưu secret ứng dụng trực tiếp?

**A.** AWS Secrets Manager
**B.** AWS KMS
**C.** AWS Systems Manager Parameter Store
**D.** Amazon Cognito

**Đáp án đúng:** B

**Giải thích ngắn:** KMS là key management service — quản lý vòng đời encryption key, khác với việc lưu trữ secret/credential ứng dụng.

**Trap liên quan:** KMS vs Secrets Manager vs Parameter Store — bẫy "KMS là nơi lưu secret".

**Đọc lại nếu còn yếu:** [../02-core-services/14-kms-secrets-manager-parameter-store.md](../02-core-services/14-kms-secrets-manager-parameter-store.md).

### Câu 23

Dịch vụ nào hỗ trợ sẵn cơ chế automatic rotation cho database credential (tích hợp RDS) mà không cần tự viết logic rotation?

**A.** AWS Systems Manager Parameter Store
**B.** AWS Secrets Manager
**C.** AWS KMS
**D.** Amazon CloudWatch

**Đáp án đúng:** B

**Giải thích ngắn:** Secrets Manager có tính năng automatic rotation tích hợp sẵn cho RDS/Redshift/DocumentDB — đây là điểm khác biệt lớn nhất với Parameter Store.

**Trap liên quan:** Secrets Manager vs Parameter Store — bẫy rất hay gặp trong đề.

**Đọc lại nếu còn yếu:** [../04-comparison-guides/06-secrets-manager-vs-parameter-store.md](../04-comparison-guides/06-secrets-manager-vs-parameter-store.md).

### Câu 24

Loại tham số nào trong Parameter Store cho phép lưu giá trị được mã hóa bằng KMS?

**A.** String
**B.** StringList
**C.** SecureString
**D.** Parameter Store không hỗ trợ mã hóa

**Đáp án đúng:** C

**Giải thích ngắn:** SecureString là loại parameter được mã hóa bằng KMS key (managed hoặc customer managed) — String/StringList lưu dạng plaintext.

**Trap liên quan:** KMS vs Secrets Manager vs Parameter Store — phân biệt encryption key management với secret/config storage.

**Đọc lại nếu còn yếu:** [../02-core-services/14-kms-secrets-manager-parameter-store.md](../02-core-services/14-kms-secrets-manager-parameter-store.md).

## Câu 25-27: Route 53 vs CloudFront vs Global Accelerator

### Câu 25

Dịch vụ nào chịu trách nhiệm quyết định trả về địa chỉ/endpoint nào dựa trên routing policy (latency, geolocation, weighted, failover)?

**A.** Amazon CloudFront
**B.** Amazon Route 53
**C.** AWS Global Accelerator
**D.** Amazon VPC

**Đáp án đúng:** B

**Giải thích ngắn:** Route 53 là DNS service, các routing policy (latency-based, geolocation, weighted, failover) là tính năng cốt lõi của nó.

**Trap liên quan:** Route 53 vs CloudFront vs Global Accelerator — bẫy "Route 53 là CDN".

**Đọc lại nếu còn yếu:** [../02-core-services/07-route53.md](../02-core-services/07-route53.md).

### Câu 26

Dịch vụ nào cache nội dung tại edge location để giảm latency cho traffic HTTP/HTTPS?

**A.** AWS Global Accelerator
**B.** Amazon Route 53
**C.** Amazon CloudFront
**D.** AWS Direct Connect

**Đáp án đúng:** C

**Giải thích ngắn:** CloudFront là CDN, cache nội dung tại edge location — đây là chức năng chính không có ở Route 53 hay Global Accelerator.

**Trap liên quan:** Route 53 vs CloudFront vs Global Accelerator — bẫy "CloudFront thay thế được DNS routing".

**Đọc lại nếu còn yếu:** [../02-core-services/12-cloudfront.md](../02-core-services/12-cloudfront.md).

### Câu 27

Dịch vụ nào cải thiện performance/availability cho traffic non-HTTP (VD: gaming, VoIP dùng TCP/UDP) thông qua static anycast IP và mạng backbone của AWS, mà không cache nội dung?

**A.** Amazon CloudFront
**B.** Amazon Route 53
**C.** AWS Global Accelerator
**D.** Amazon S3 Transfer Acceleration

**Đáp án đúng:** C

**Giải thích ngắn:** Global Accelerator định tuyến traffic (kể cả non-HTTP) qua mạng backbone AWS bằng static IP, không phải cache layer như CloudFront.

**Trap liên quan:** Route 53 vs CloudFront vs Global Accelerator — bẫy "Global Accelerator là cache layer".

**Đọc lại nếu còn yếu:** [../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md](../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md).

## Câu 28: HA vs Fault Tolerance vs DR

Điều nào mô tả đúng nhất sự khác biệt giữa High Availability, Fault Tolerance, và Disaster Recovery?

**A.** Cả ba là một khái niệm, dùng thay thế nhau tùy ngữ cảnh.
**B.** HA giảm downtime khi có sự cố (chấp nhận gián đoạn ngắn), Fault Tolerance đảm bảo hệ thống không gián đoạn khi 1 thành phần lỗi, DR là chiến lược khôi phục sau sự cố lớn mất cả Region, đo bằng RTO/RPO.
**C.** DR chỉ áp dụng trong cùng 1 Availability Zone.
**D.** Fault Tolerance là mức độ chịu lỗi thấp hơn HA.

**Đáp án đúng:** B

**Giải thích ngắn:** Ba khái niệm ở 3 mức độ khác nhau: HA (giảm downtime, cùng Region), Fault Tolerance (không gián đoạn, mức cao hơn HA), DR (khôi phục sau sự cố lớn, khác Region, đo bằng RTO/RPO).

**Trap liên quan:** HA vs Fault Tolerance vs DR.

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/01-high-availability.md](../03-architecture-patterns/01-high-availability.md), [../03-architecture-patterns/02-fault-tolerance.md](../03-architecture-patterns/02-fault-tolerance.md), [../03-architecture-patterns/07-disaster-recovery.md](../03-architecture-patterns/07-disaster-recovery.md).

## Câu 29: Backup vs HA vs DR

Một hệ thống chỉ có automated backup hàng ngày cho RDS, không có Multi-AZ, không có DR plan sang Region khác. Điều nào đúng nhất về tình trạng hiện tại của hệ thống?

**A.** Hệ thống đã có đầy đủ HA vì có backup.
**B.** Hệ thống có khả năng khôi phục dữ liệu (nhờ backup) nhưng KHÔNG có HA (không tự động failover) và KHÔNG có DR strategy sang Region khác.
**C.** Backup hàng ngày tương đương với Multi-AZ về mặt chức năng.
**D.** Hệ thống không cần thêm gì vì backup đã đủ cho mọi mục đích resilience.

**Đáp án đúng:** B

**Giải thích ngắn:** Backup chỉ phục vụ khôi phục dữ liệu, không cung cấp failover tự động (HA) và không phải là DR strategy hoàn chỉnh (thiếu kế hoạch khôi phục ở Region khác).

**Trap liên quan:** Backup vs HA vs DR.

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/07-disaster-recovery.md](../03-architecture-patterns/07-disaster-recovery.md), [../02-core-services/04-rds-aurora.md](../02-core-services/04-rds-aurora.md).

## Câu 30: SQS Standard vs FIFO

Khi nào nên chọn SQS FIFO queue thay vì SQS Standard queue?

**A.** Luôn luôn, vì FIFO tốt hơn Standard trong mọi trường hợp.
**B.** Khi ứng dụng cần đảm bảo thứ tự xử lý message và tránh xử lý trùng lặp (exactly-once processing), chấp nhận đánh đổi throughput thấp hơn.
**C.** Khi cần throughput cao nhất có thể, không quan tâm thứ tự.
**D.** FIFO và Standard hoàn toàn giống nhau về throughput và ordering.

**Đáp án đúng:** B

**Giải thích ngắn:** FIFO đảm bảo ordering và exactly-once nhưng giới hạn throughput hơn Standard — chỉ nên chọn khi thực sự cần các đảm bảo này, không phải mặc định "tốt hơn".

**Trap liên quan:** Standard vs FIFO — bẫy "FIFO mặc định tốt hơn Standard".

**Đọc lại nếu còn yếu:** [../02-core-services/11-sqs-sns-eventbridge.md](../02-core-services/11-sqs-sns-eventbridge.md).

## Key takeaways

- Mỗi câu topic-based chỉ kiểm tra đúng 1 trap — nếu sai, đó là dấu hiệu rõ ràng cần đọc lại đúng 1 file cụ thể.
- Các trap lặp lại nhiều nhất trong đề thật: Multi-AZ vs Read Replica, RDS/Aurora vs DynamoDB, SQS vs SNS vs EventBridge, KMS vs Secrets Manager vs Parameter Store.
- Không học thuộc câu trả lời — học cách phân biệt để áp dụng được với wording khác trong đề thật.

## Checklist tự ôn

- [ ] Tôi làm đúng tối thiểu 25/30 câu (83%) mà không xem đáp án trước.
- [ ] Tôi có thể tự đặt lại câu hỏi tương tự cho ít nhất 5 trap mà không lặp wording gốc.
- [ ] Tôi không còn nhầm lẫn ở bất kỳ cặp nào trong 13 nhóm trap đã liệt kê.

## Xem tiếp / Liên kết liên quan

- [01-scenario-based-questions.md](./01-scenario-based-questions.md)
- [../05-exam-drills/02-exam-traps.md](../05-exam-drills/02-exam-traps.md)
- [../05-exam-drills/03-decision-trees.md](../05-exam-drills/03-decision-trees.md)
- [README.md](./README.md)
