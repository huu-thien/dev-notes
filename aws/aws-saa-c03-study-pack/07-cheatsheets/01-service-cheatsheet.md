# Service Cheatsheet

Tóm tắt siêu nhanh toàn bộ core services của SAA-C03: dùng khi nào, tránh khi nào, keyword đề thi, cặp dễ nhầm. Không giải thích lại chi tiết — xem [../02-core-services/README.md](../02-core-services/README.md) nếu cần đào sâu.

## Mục tiêu sử dụng cheatsheet

- Nhắc lại nhanh "service này dùng cho việc gì" trong vài giây khi đọc đề.
- Loại trừ nhanh đáp án sai dựa trên "tránh dùng khi nào".
- Nhận diện service đúng qua keyword xuất hiện trong đề.

## Mục lục

- [Compute](#compute)
- [Storage](#storage)
- [Database](#database)
- [Networking](#networking)
- [Messaging & Integration](#messaging--integration)
- [Observability & Governance](#observability--governance)
- [Security & Config Management](#security--config-management)
- [Must remember](#must-remember)
- [Common traps / easy confusion](#common-traps--easy-confusion)
- [Exam keywords](#exam-keywords)
- [Quick decision hints](#quick-decision-hints)
- [Checklist tự rà soát](#checklist-tự-rà-soát)

## Compute

| Service | Dùng khi nào | Tránh khi nào | Keyword đề thi | Cặp dễ nhầm |
|---|---|---|---|---|
| [EC2](../02-core-services/01-ec2.md) | Cần toàn quyền kiểm soát OS/runtime, workload chạy dài, cần custom AMI | Tác vụ ngắn, event-driven, không muốn quản lý server | "toàn quyền kiểm soát", "custom AMI" | vs Lambda/ECS |
| [Lambda](../02-core-services/09-lambda.md) | Event-driven, tác vụ ngắn (≤15 phút), traffic không đều, muốn zero ops | Tác vụ chạy dài, cần control runtime/OS sâu | "serverless", "tần suất không đều", "tối thiểu hóa chi phí khi idle" | vs ECS/EC2 |
| ELB / Auto Scaling | Cần phân phối traffic + tự scale theo tải, loại bỏ single point of failure | Không có nhiều instance hoặc traffic ổn định thấp không cần scale | "tự động scale", "phân phối traffic", "multi-AZ" | ALB vs NLB vs API Gateway |

## Storage

| Service | Dùng khi nào | Tránh khi nào | Keyword đề thi | Cặp dễ nhầm |
|---|---|---|---|---|
| [S3](../02-core-services/03-s3.md) | Object storage, static website, backup, data lake, độ bền cao | Cần mount như file system truyền thống, cần block storage cho DB | "độ bền 11 nines", "truy cập qua HTTP/API" | vs EBS/EFS |
| [EBS](../02-core-services/02-ebs-efs-fsx.md) | Block storage cho 1 EC2 instance, cần latency thấp cho DB/OS disk | Cần chia sẻ nhiều instance cùng lúc (trừ Multi-Attach đặc thù) | "gắn với 1 instance", "boot volume" | vs S3/EFS |
| EFS | Shared file storage cho nhiều Linux instance, NFS | Windows workload (dùng FSx), cần gắn 1 instance đơn giản | "nhiều EC2 Linux truy cập đồng thời", "NFS" | vs FSx (Windows) |
| FSx | File storage cho Windows (SMB) hoặc high-performance workload (Lustre) | Linux shared storage đơn giản (dùng EFS) | "Windows file server", "SMB", "HPC" | vs EFS |

Xem chi tiết: [04-storage-cheatsheet.md](./04-storage-cheatsheet.md), [../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md](../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md).

## Database

| Service | Dùng khi nào | Tránh khi nào | Keyword đề thi | Cặp dễ nhầm |
|---|---|---|---|---|
| [RDS](../02-core-services/04-rds-aurora.md) | Relational, cần ACID transaction, schema cố định | Cần scale ghi cực lớn, schema linh hoạt | "transaction", "JOIN", "quan hệ" | vs Aurora/DynamoDB |
| Aurora | Relational nhưng cần HA/throughput cao hơn RDS chuẩn, tương thích MySQL/PostgreSQL | Ngân sách rất hạn chế, không cần hiệu năng cao | "high performance relational", "6 bản sao 3 AZ" | vs RDS |
| [DynamoDB](../02-core-services/05-dynamodb.md) | NoSQL, key-value/access pattern đơn giản, cần scale ghi/đọc cực lớn, latency ổn định | Cần JOIN phức tạp, ad-hoc query đa dạng | "single-digit millisecond", "traffic không dự đoán trước" | vs RDS/Aurora |

Xem chi tiết: [05-database-cheatsheet.md](./05-database-cheatsheet.md), [../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md](../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md).

## Networking

| Service | Dùng khi nào | Tránh khi nào | Keyword đề thi | Cặp dễ nhầm |
|---|---|---|---|---|
| [VPC](../02-core-services/06-vpc.md) | Nền tảng network cho mọi resource, cần isolation | — | "subnet", "route table", "CIDR" | — |
| [Route 53](../02-core-services/07-route53.md) | DNS, routing policy (weighted/latency/failover), domain registration | Cần cache nội dung (dùng CloudFront) | "DNS", "domain name", "health check routing" | vs CloudFront/Global Accelerator |
| [CloudFront](../02-core-services/12-cloudfront.md) | CDN, cache nội dung tĩnh/động ở edge, giảm tải origin | Cần chỉ định tuyến DNS đơn thuần | "edge location", "cache", "giảm tải origin" | vs Route 53/Global Accelerator |

Xem chi tiết: [06-network-cheatsheet.md](./06-network-cheatsheet.md), [../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md](../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md).

## Messaging & Integration

| Service | Dùng khi nào | Tránh khi nào | Keyword đề thi | Cặp dễ nhầm |
|---|---|---|---|---|
| [SQS](../02-core-services/11-sqs-sns-eventbridge.md) | Decoupling point-to-point, buffering, cần đảm bảo xử lý (queue) | Cần broadcast tới nhiều subscriber cùng lúc | "queue", "decoupling", "buffering" | vs SNS |
| SNS | Pub/sub, broadcast 1 message tới nhiều subscriber (fanout) | Cần giữ message chờ xử lý (không phải queue) | "fanout", "broadcast", "nhiều subscriber" | vs SQS |
| EventBridge | Event routing phức tạp, nhiều nguồn sự kiện, rule-based filtering, tích hợp SaaS | Giao tiếp đơn giản 2 service (SQS/SNS đủ dùng) | "event bus", "event routing", "rule pattern" | vs SNS |
| [API Gateway](../02-core-services/10-api-gateway.md) | Quản lý API (throttling, API key, request validation), REST/HTTP API layer | Chỉ cần load balancing HTTP đơn thuần | "throttling", "API key", "request validation" | vs ALB |

Xem chi tiết: [../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md](../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md).

## Observability & Governance

| Service | Dùng khi nào | Tránh khi nào | Keyword đề thi | Cặp dễ nhầm |
|---|---|---|---|---|
| [CloudWatch](../02-core-services/13-cloudwatch-cloudtrail-config.md) | Metric, log, alarm cho performance/hoạt động hệ thống | Cần biết "ai" gọi API (dùng CloudTrail) | "metric", "alarm", "CPU/memory" | vs CloudTrail/Config |
| CloudTrail | Audit log API call: ai, khi nào, từ đâu | Cần theo dõi metric hiệu năng | "audit", "API call history", "ai đã gọi" | vs CloudWatch/Config |
| Config | Theo dõi thay đổi cấu hình resource theo thời gian, đánh giá compliance | Cần log API call chi tiết (dùng CloudTrail) | "compliance", "configuration history", "resource cấu hình sai" | vs CloudTrail/CloudWatch |

## Security & Config Management

| Service | Dùng khi nào | Tránh khi nào | Keyword đề thi | Cặp dễ nhầm |
|---|---|---|---|---|
| [KMS](../02-core-services/14-kms-secrets-manager-parameter-store.md) | Quản lý encryption key, mã hóa dữ liệu tại rest | Lưu trữ secret ứng dụng trực tiếp | "encryption key", "key policy", "envelope encryption" | vs Secrets Manager |
| Secrets Manager | Lưu secret cần rotation tự động (DB credential) | Config value đơn giản không cần rotation | "automatic rotation", "database credential" | vs Parameter Store |
| Parameter Store | Config value/secret đơn giản, chi phí thấp, không cần rotation phức tạp | Cần rotation tự động tích hợp sẵn | "configuration value", "SecureString", "chi phí thấp" | vs Secrets Manager |

Xem chi tiết: [03-security-cheatsheet.md](./03-security-cheatsheet.md), [../04-comparison-guides/06-secrets-manager-vs-parameter-store.md](../04-comparison-guides/06-secrets-manager-vs-parameter-store.md).

## Must remember

- Mỗi service trong bảng có đúng 1 "core reason to choose" — nếu đề không match reason đó thì thường không phải best answer.
- AWS exam có xu hướng thiên về managed service (managed service bias) khi 2 lựa chọn cùng khả thi.
- "Serverless"/"event-driven" thường trỏ tới Lambda + SQS/SNS/EventBridge, không phải EC2/ECS.

## Common traps / easy confusion

- S3 không phải file system — không mount trực tiếp như ổ đĩa.
- EBS không mặc định chia sẻ được nhiều instance.
- SNS không phải queue — không giữ message chờ xử lý.
- CloudTrail không phải công cụ theo dõi performance.
- Route 53 không cache nội dung; CloudFront mới cache.

## Exam keywords

- "toàn quyền kiểm soát OS" → EC2
- "event-driven", "tần suất không đều" → Lambda
- "shared file storage nhiều Linux instance" → EFS
- "Windows file server" → FSx
- "transaction ACID" → RDS/Aurora
- "traffic ghi cực lớn không dự đoán trước" → DynamoDB
- "broadcast nhiều subscriber" → SNS
- "audit ai gọi API" → CloudTrail
- "rotation tự động" → Secrets Manager

## Quick decision hints

- Thấy "server cần toàn quyền kiểm soát" → EC2. Thấy "không muốn quản lý server, tác vụ ngắn" → Lambda.
- Thấy "shared" + "Linux" → EFS. Thấy "shared" + "Windows"/"SMB" → FSx.
- Thấy "quan hệ, transaction" → RDS/Aurora. Thấy "key-value, scale cực lớn" → DynamoDB.
- Thấy "1-nhiều" (broadcast) → SNS/EventBridge. Thấy "1-1" (buffering) → SQS.

## Checklist tự rà soát

- [ ] Tôi phân biệt được ngay S3 vs EBS vs EFS vs FSx chỉ bằng 1 câu keyword.
- [ ] Tôi phân biệt được RDS/Aurora vs DynamoDB dựa trên access pattern.
- [ ] Tôi phân biệt được SQS vs SNS vs EventBridge dựa trên fanout/queue/event routing.
- [ ] Tôi phân biệt được CloudWatch vs CloudTrail vs Config theo đúng mục đích từng cái.
- [ ] Tôi phân biệt được KMS vs Secrets Manager vs Parameter Store theo lifecycle secret/key.

## Xem tiếp / Liên kết liên quan

- [02-architecture-cheatsheet.md](./02-architecture-cheatsheet.md)
- [../05-exam-drills/02-exam-traps.md](../05-exam-drills/02-exam-traps.md)
- [README.md](./README.md)
