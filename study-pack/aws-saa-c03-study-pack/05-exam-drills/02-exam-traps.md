# Exam Traps

Tổng hợp các cặp/cụm dịch vụ và khái niệm dễ nhầm nhất trong đề thi SAA-C03, theo cụm chủ đề. Đây là file quan trọng nhất trong `05-exam-drills` — nên đọc kỹ và ôn lại nhiều lần.

## Mục tiêu học

- Nhận ra ngay dấu hiệu trong đề khi một trap sắp xuất hiện.
- Có cách phân biệt nhanh, không cần suy luận lại từ đầu mỗi lần.
- Biết chính xác file gốc để đào sâu nếu còn nhầm.

## Mục lục

- [Network: Security Group vs NACL](#network-security-group-vs-nacl)
- [Network: Internet Gateway vs NAT Gateway](#network-internet-gateway-vs-nat-gateway)
- [Network: Public subnet vs Public resource](#network-public-subnet-vs-public-resource)
- [Storage: S3 vs EBS vs EFS vs FSx](#storage-s3-vs-ebs-vs-efs-vs-fsx)
- [Database: Multi-AZ vs Read Replica](#database-multi-az-vs-read-replica)
- [Database: RDS/Aurora vs DynamoDB](#database-rdsaurora-vs-dynamodb)
- [Compute: Lambda vs ECS/Fargate vs EC2](#compute-lambda-vs-ecsfargate-vs-ec2)
- [API: API Gateway vs ALB](#api-api-gateway-vs-alb)
- [Messaging: SQS vs SNS vs EventBridge](#messaging-sqs-vs-sns-vs-eventbridge)
- [Ops: CloudWatch vs CloudTrail vs Config](#ops-cloudwatch-vs-cloudtrail-vs-config)
- [Security: KMS vs Secrets Manager vs Parameter Store](#security-kms-vs-secrets-manager-vs-parameter-store)
- [Resilience: HA vs Fault Tolerance vs DR](#resilience-ha-vs-fault-tolerance-vs-dr)
- [Resilience: Backup vs HA vs DR](#resilience-backup-vs-ha-vs-dr)
- [Global: Route 53 vs CloudFront vs Global Accelerator](#global-route-53-vs-cloudfront-vs-global-accelerator)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Network: Security Group vs NACL

**Thí sinh hay nhầm:** nghĩ Security Group cũng stateless như NACL, hoặc dùng NACL để làm firewall chính cho instance.

**Dấu hiệu trong đề:** đề nhắc "stateless", "subnet-level", "explicit deny/allow rule" → NACL; đề nhắc "instance-level", "implicit deny", "chỉ có allow rule" → Security Group.

**Cách phân biệt nhanh:** Security Group = stateful, gắn ở instance/ENI, chỉ có allow rule. NACL = stateless, gắn ở subnet, có cả allow và deny rule, xử lý theo thứ tự rule number.

**Đọc lại:** [../01-foundation/03-networking-basics.md](../01-foundation/03-networking-basics.md).

## Network: Internet Gateway vs NAT Gateway

**Thí sinh hay nhầm:** dùng Internet Gateway cho private subnet cần outbound internet, hoặc nghĩ NAT Gateway cho phép inbound từ internet.

**Dấu hiệu trong đề:** "instances in a private subnet need to download updates/patches" → NAT Gateway; "instances need to be reachable from the internet" → Internet Gateway.

**Cách phân biệt nhanh:** Internet Gateway = 2 chiều, dùng cho public subnet. NAT Gateway = chỉ outbound từ private subnet ra internet, không cho phép inbound khởi tạo từ internet.

**Đọc lại:** [../01-foundation/03-networking-basics.md](../01-foundation/03-networking-basics.md), [../02-core-services/06-vpc.md](../02-core-services/06-vpc.md).

## Network: Public subnet vs Public resource

**Thí sinh hay nhầm:** nghĩ đặt resource trong public subnet là tự động public, hoặc gán public IP là đủ để truy cập từ internet.

**Dấu hiệu trong đề:** đề mô tả instance có public IP nhưng vẫn không truy cập được → thường do thiếu route tới Internet Gateway hoặc Security Group/NACL chặn.

**Cách phân biệt nhanh:** "public" thực sự cần đủ 3 điều kiện: route table trỏ 0.0.0.0/0 tới Internet Gateway, resource có public/elastic IP, và Security Group/NACL cho phép traffic. Thiếu 1 trong 3 là không truy cập được dù nằm trong "public subnet".

**Đọc lại:** [../02-core-services/06-vpc.md](../02-core-services/06-vpc.md).

## Storage: S3 vs EBS vs EFS vs FSx

**Thí sinh hay nhầm:** nghĩ S3 dùng được như file system cho ứng dụng, hoặc dùng EBS để chia sẻ dữ liệu giữa nhiều EC2 instance, hoặc chọn EFS cho workload Windows.

**Dấu hiệu trong đề:** "shared file system across multiple EC2 instances", "POSIX-compliant", "Linux workload" → EFS; "object storage", "static website hosting", "versioning" → S3; "block storage for a single instance", "database volume" → EBS; "Windows file server", "SMB", "Active Directory integration" → FSx for Windows File Server.

**Cách phân biệt nhanh:** S3 = object storage, không phải file system, không gắn trực tiếp vào OS. EBS = block storage, gắn 1 instance tại 1 thời điểm (trừ Multi-Attach io1/io2 hiếm gặp). EFS = file storage, share được nhiều instance Linux cùng lúc. FSx = file storage cho use case đặc thù (Windows/SMB hoặc Lustre cho HPC).

**Đọc lại:** [../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md](../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md).

## Database: Multi-AZ vs Read Replica

**Thí sinh hay nhầm:** nghĩ Read Replica cũng dùng để failover tự động như Multi-AZ, hoặc nghĩ Multi-AZ giúp tăng read throughput.

**Dấu hiệu trong đề:** "automatic failover", "standby in another AZ", "high availability" → Multi-AZ; "offload read traffic", "reporting queries", "scale read performance" → Read Replica.

**Cách phân biệt nhanh:** Multi-AZ = đồng bộ, mục đích HA/failover, standby không nhận traffic đọc trực tiếp (trừ vài trường hợp Aurora). Read Replica = bất đồng bộ, mục đích scale đọc, không tự động failover (trừ khi được promote thủ công hoặc cấu hình riêng).

**Đọc lại:** [../02-core-services/04-rds-aurora.md](../02-core-services/04-rds-aurora.md), [../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md](../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md).

## Database: RDS/Aurora vs DynamoDB

**Thí sinh hay nhầm:** chọn DynamoDB chỉ vì "serverless"/"managed" mà bỏ qua yêu cầu quan hệ dữ liệu; hoặc chọn RDS/Aurora khi traffic ghi cực lớn không dự đoán được.

**Dấu hiệu trong đề:** "complex queries with JOINs", "ACID transaction across tables" → RDS/Aurora; "key-value", "single-digit millisecond latency at any scale" → DynamoDB.

**Cách phân biệt nhanh:** Quyết định dựa vào **data model** (có cần JOIN/quan hệ không) trước, sau đó mới xét đến scale/latency.

**Đọc lại:** [../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md](../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md).

## Compute: Lambda vs ECS/Fargate vs EC2

**Thí sinh hay nhầm:** chọn Lambda cho workload chạy dài/stateful, hoặc nghĩ "serverless luôn là đáp án tốt nhất".

**Dấu hiệu trong đề:** "short-lived", "event-driven", "runs for a few seconds" → Lambda; "long-running", "containerized", "custom runtime/OS control" → ECS/Fargate hoặc EC2; "full control over OS/kernel" → EC2.

**Cách phân biệt nhanh:** Lambda giới hạn thời gian chạy (tối đa 15 phút) và không giữ state giữa các lần invoke — không phù hợp long-running/stateful workload. Giữa ECS/Fargate và EC2: chọn Fargate khi muốn container mà không quản lý server; chọn EC2 khi cần kiểm soát OS/hardware sâu.

**Đọc lại:** [../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md](../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md).

## API: API Gateway vs ALB

**Thí sinh hay nhầm:** nghĩ API Gateway thay thế được load balancer cho mọi HTTP traffic, hoặc dùng ALB khi cần các tính năng API management (throttling, API key, request validation).

**Dấu hiệu trong đề:** "expose a REST/HTTP API with throttling, API keys, request validation" → API Gateway; "load balance HTTP(S) traffic across EC2/containers", "path-based routing to target groups" → ALB.

**Cách phân biệt nhanh:** API Gateway = tầng quản lý API (auth, throttling, transformation) thường đứng trước Lambda hoặc backend service. ALB = tầng phân phối traffic Layer 7 tới target group (EC2, containers, Lambda cũng được nhưng không có API management feature).

**Đọc lại:** [../02-core-services/10-api-gateway.md](../02-core-services/10-api-gateway.md).

## Messaging: SQS vs SNS vs EventBridge

**Thí sinh hay nhầm:** nghĩ SNS lưu trữ message như queue, dùng SQS để broadcast tới nhiều consumer, hoặc dùng EventBridge thay cho buffer đơn giản.

**Dấu hiệu trong đề:** "decouple producer and consumer with a buffer" → SQS; "fan-out to multiple subscribers" → SNS; "route events from multiple sources based on rules", "SaaS integration" → EventBridge.

**Cách phân biệt nhanh:** SQS = queue, message tồn tại tới khi được consume/xóa. SNS = pub/sub, không lưu trữ, cần subscriber sẵn sàng nhận (thường kèm SQS để buffer). EventBridge = event bus, định tuyến theo rule/pattern, tích hợp nhiều nguồn kể cả SaaS.

**Đọc lại:** [../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md](../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md).

## Ops: CloudWatch vs CloudTrail vs Config

**Thí sinh hay nhầm:** dùng CloudTrail để theo dõi performance metrics, hoặc dùng Config để giám sát real-time, hoặc nghĩ CloudWatch ghi lại "ai đã làm gì".

**Dấu hiệu trong đề:** "monitor performance metrics/alarms" → CloudWatch; "who made this API call / audit trail" → CloudTrail; "track configuration changes / compliance over time" → Config.

**Cách phân biệt nhanh:** CloudWatch = metrics/logs/alarms (theo dõi hoạt động thực thi). CloudTrail = audit ai gọi API gì, khi nào (accountability). Config = theo dõi trạng thái cấu hình resource thay đổi theo thời gian (compliance), không phải công cụ giám sát hiệu năng real-time.

**Đọc lại:** [../02-core-services/13-cloudwatch-cloudtrail-config.md](../02-core-services/13-cloudwatch-cloudtrail-config.md).

## Security: KMS vs Secrets Manager vs Parameter Store

**Thí sinh hay nhầm:** dùng KMS như nơi lưu secret ứng dụng, hoặc nhầm Secrets Manager với Parameter Store vì cả hai đều lưu key-value.

**Dấu hiệu trong đề:** "manage encryption keys" → KMS; "automatic rotation of database credentials" → Secrets Manager; "store configuration values/parameters, optional encryption" → Parameter Store.

**Cách phân biệt nhanh:** KMS = quản lý encryption key, không phải nơi lưu secret ứng dụng trực tiếp. Secrets Manager = lưu secret có vòng đời (rotation tự động, tích hợp RDS). Parameter Store = lưu config/parameter (có SecureString dùng KMS mã hóa nhưng không có rotation tự động built-in như Secrets Manager).

**Đọc lại:** [../04-comparison-guides/06-secrets-manager-vs-parameter-store.md](../04-comparison-guides/06-secrets-manager-vs-parameter-store.md), [../02-core-services/14-kms-secrets-manager-parameter-store.md](../02-core-services/14-kms-secrets-manager-parameter-store.md).

## Resilience: HA vs Fault Tolerance vs DR

**Thí sinh hay nhầm:** dùng 3 khái niệm này thay thế lẫn nhau.

**Dấu hiệu trong đề:** "minimize downtime, automatic failover within a Region" → HA; "system continues operating with zero disruption despite a component failure" → Fault Tolerance; "recover in a different Region after a disaster" → DR.

**Cách phân biệt nhanh:** HA = giảm downtime, chấp nhận gián đoạn ngắn khi failover. Fault Tolerance = không gián đoạn (mức cao hơn HA, tốn kém hơn). DR = khôi phục sau sự cố lớn/mất cả Region, đo bằng RTO/RPO.

**Đọc lại:** [../03-architecture-patterns/01-high-availability.md](../03-architecture-patterns/01-high-availability.md), [../03-architecture-patterns/02-fault-tolerance.md](../03-architecture-patterns/02-fault-tolerance.md), [../03-architecture-patterns/07-disaster-recovery.md](../03-architecture-patterns/07-disaster-recovery.md).

## Resilience: Backup vs HA vs DR

**Thí sinh hay nhầm:** nghĩ có automated backup nghĩa là đã có HA, hoặc nghĩ backup đủ để làm DR strategy hoàn chỉnh.

**Dấu hiệu trong đề:** "point-in-time recovery from data loss/corruption" → backup; "automatic failover with minimal downtime" → HA; "recover entire workload in another Region" → DR (backup chỉ là 1 phần của DR strategy, cụ thể là Backup & Restore pattern).

**Cách phân biệt nhanh:** Backup phục vụ khôi phục dữ liệu (không tự động failover). HA phục vụ giảm downtime trong cùng Region. DR là chiến lược tổng thể để khôi phục toàn bộ workload sau sự cố nghiêm trọng, trong đó Backup & Restore chỉ là 1 trong 4 pattern DR (còn Pilot Light, Warm Standby, Multi-site Active/Active).

**Đọc lại:** [../03-architecture-patterns/07-disaster-recovery.md](../03-architecture-patterns/07-disaster-recovery.md).

## Global: Route 53 vs CloudFront vs Global Accelerator

**Thí sinh hay nhầm:** nghĩ Route 53 là CDN, hoặc dùng CloudFront để định tuyến traffic theo routing policy (latency/geolocation), hoặc dùng Global Accelerator để cache nội dung.

**Dấu hiệu trong đề:** "DNS routing policy, health check, failover between endpoints" → Route 53; "cache static/dynamic content at edge locations" → CloudFront; "improve availability/performance for non-HTTP or TCP/UDP traffic using static anycast IP" → Global Accelerator.

**Cách phân biệt nhanh:** Route 53 = DNS, quyết định trả về địa chỉ nào. CloudFront = CDN, cache nội dung gần người dùng. Global Accelerator = định tuyến traffic qua mạng backbone AWS bằng static IP, không cache nội dung, phù hợp cả traffic non-HTTP.

**Đọc lại:** [../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md](../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md).

## Key takeaways

- Hầu hết trap trong đề SAA-C03 nằm ở việc nhầm lẫn giữa 2-3 service/khái niệm có vẻ tương tự nhưng khác mục đích chính.
- Cách phân biệt nhanh nhất luôn là xác định **mục đích chính** (HA vs scale, buffer vs broadcast, audit vs monitor, key management vs secret storage).
- Khi phân vân, quay lại đúng comparison guide/pattern file thay vì đoán theo cảm tính.

## Checklist tự ôn

- [ ] Tôi có thể giải thích cách phân biệt nhanh cho cả 14 cụm trap ở trên mà không cần mở lại file.
- [ ] Tôi tự đưa ra được ví dụ câu đề cho ít nhất 5 cụm trap.
- [ ] Tôi biết chính xác file gốc để đọc lại cho từng cụm trap.

## Xem tiếp / Liên kết liên quan

- [01-common-question-patterns.md](./01-common-question-patterns.md)
- [03-decision-trees.md](./03-decision-trees.md)
- [04-last-minute-revision.md](./04-last-minute-revision.md)
- [README.md](./README.md)
