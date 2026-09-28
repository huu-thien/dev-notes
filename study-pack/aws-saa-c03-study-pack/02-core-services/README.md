# 02 — Core Services

> Chi tiết từng dịch vụ AWS trọng tâm của SAA-C03. Đây là phần lớn nhất của study pack — học kỹ nhóm này trước khi sang [`03-architecture-patterns`](../03-architecture-patterns/README.md) và [`04-comparison-guides`](../04-comparison-guides/README.md).

## Thư mục này bao phủ gì

- Compute: EC2 và các compute alternative liên quan (Lambda, ECS/Fargate ở mức so sánh).
- Storage: EBS, EFS, FSx, S3.
- Networking: VPC, Route 53, CloudFront.
- Database: RDS, Aurora, DynamoDB.
- Application/Integration: Lambda, API Gateway, SQS/SNS/EventBridge.
- Observability & Security: CloudWatch/CloudTrail/Config, KMS/Secrets Manager/Parameter Store.

Tính đến lượt này, toàn bộ 14 file của `02-core-services` đã hoàn thành.

## Mapping từ Foundation sang Core Services

| Foundation đã học | Core Service liên quan trực tiếp |
|---|---|
| [../01-foundation/01-global-infrastructure.md](../01-foundation/01-global-infrastructure.md) | Multi-AZ trong [08-elb-and-auto-scaling.md](./08-elb-and-auto-scaling.md) |
| [../01-foundation/02-iam-basics.md](../01-foundation/02-iam-basics.md) | Security Group trong [01-ec2.md](./01-ec2.md) |
| [../01-foundation/03-networking-basics.md](../01-foundation/03-networking-basics.md) | CIDR áp dụng thực tế trong [06-vpc.md](./06-vpc.md) |
| [../01-foundation/04-pricing-and-billing-basics.md](../01-foundation/04-pricing-and-billing-basics.md) | Purchasing options áp dụng trong [01-ec2.md](./01-ec2.md) |

## Thứ tự đọc đề xuất

| # | File | Chủ đề chính | Priority | Trạng thái |
|---|---|---|---|---|
| 1 | [01-ec2.md](./01-ec2.md) | EC2, instance families, purchasing options, AMI, ENI, placement groups | Must know | Đã có |
| 2 | [02-ebs-efs-fsx.md](./02-ebs-efs-fsx.md) | Block/File storage: EBS, EFS, FSx | Must know | Đã có |
| 3 | [03-s3.md](./03-s3.md) | Object storage: S3 | Must know | Đã có |
| 4 | [04-rds-aurora.md](./04-rds-aurora.md) | RDS, Aurora | Must know | Đã có |
| 5 | [05-dynamodb.md](./05-dynamodb.md) | DynamoDB | Must know | Đã có |
| 6 | [06-vpc.md](./06-vpc.md) | VPC, Subnet, Route Table, SG/NACL | Must know | Đã có |
| 7 | [07-route53.md](./07-route53.md) | DNS routing policies | Important | Đã có |
| 8 | [08-elb-and-auto-scaling.md](./08-elb-and-auto-scaling.md) | ALB/NLB/GWLB, Auto Scaling Group | Must know | Đã có |
| 9 | [09-lambda.md](./09-lambda.md) | AWS Lambda | Must know | Đã có |
| 10 | [10-api-gateway.md](./10-api-gateway.md) | API Gateway | Important | Đã có |
| 11 | [11-sqs-sns-eventbridge.md](./11-sqs-sns-eventbridge.md) | SQS, SNS, EventBridge | Must know | Đã có |
| 12 | [12-cloudfront.md](./12-cloudfront.md) | CloudFront | Important | Đã có |
| 13 | [13-cloudwatch-cloudtrail-config.md](./13-cloudwatch-cloudtrail-config.md) | CloudWatch, CloudTrail, Config | Must know | Đã có |
| 14 | [14-kms-secrets-manager-parameter-store.md](./14-kms-secrets-manager-parameter-store.md) | KMS, Secrets Manager, Parameter Store | Must know | Đã có |

> Toàn bộ 14/14 file đã hoàn thành. Xem tiến độ tổng thể tại [../GENERATION-PLAN.md](../GENERATION-PLAN.md).

## File quan trọng nhất cho kỳ thi

`01-ec2.md`, `03-s3.md`, `06-vpc.md`, `08-elb-and-auto-scaling.md`, `04-rds-aurora.md`, `05-dynamodb.md`, và `11-sqs-sns-eventbridge.md` — nhóm này xuất hiện trong phần lớn câu hỏi tình huống của cả 4 domain (đặc biệt domain Design Resilient Architectures và Design High-Performing Architectures).

## Xem thêm khi so sánh dịch vụ

Khi đã học xong toàn bộ core services, nên đối chiếu tại `../04-comparison-guides/` (sẽ mở rộng ở lượt sau), đặc biệt:
- S3 vs EBS vs EFS vs FSx
- RDS vs Aurora vs DynamoDB
- SQS vs SNS vs EventBridge
- Lambda vs ECS/Fargate vs EC2
- CloudFront vs Route 53 vs Global Accelerator
- Secrets Manager vs Parameter Store

**Xem tiếp:** [../01-foundation/README.md](../01-foundation/README.md) · [../README.md](../README.md)
