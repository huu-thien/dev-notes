# Domain Weight and Focus

Trọng số các domain thi SAA-C03 và mức ưu tiên học tương ứng.

> Cần verify lại theo AWS official exam guide mới nhất — tên domain và tỉ trọng % có thể được AWS điều chỉnh theo phiên bản exam guide mới.

## Mục lục

- [Bảng domain và trọng số](#bảng-domain-và-trọng-số)
- [Chi tiết từng domain](#chi-tiết-từng-domain)
- [Must know for exam](#must-know-for-exam)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Bảng domain và trọng số

| Domain | Trọng số ước lượng | Nhóm kiến thức chính | Ưu tiên học |
|---|---|---|---|
| Domain 1: Design Secure Architectures | ~30% | IAM, Security Group/NACL, KMS, Shared Responsibility Model | Must know |
| Domain 2: Design Resilient Architectures | ~26% | Multi-AZ, Auto Scaling, decoupling (SQS/SNS), Disaster Recovery | Must know |
| Domain 3: Design High-Performing Architectures | ~24% | Compute/storage/database selection, caching (ElastiCache, CloudFront, DAX) | Must know |
| Domain 4: Design Cost-Optimized Architectures | ~18% | Pricing models, right-sizing, storage tiering | Important |

## Chi tiết từng domain

### Domain 1 — Design Secure Architectures

Trọng tâm: least privilege, IAM roles/policies, mã hoá dữ liệu (at rest/in transit), phân biệt Security Group vs NACL.

Liên quan: [01-foundation/02-iam-basics.md](../01-foundation/02-iam-basics.md), `02-core-services/14-kms-secrets-manager-parameter-store.md` (sẽ mở rộng), `03-architecture-patterns/06-security-architecture.md` (sẽ mở rộng).

Cặp dịch vụ dễ nhầm cần ôn kỹ: **Security Group vs NACL**, **KMS vs Secrets Manager vs Parameter Store**.

### Domain 2 — Design Resilient Architectures

Trọng tâm: High Availability, Fault Tolerance, Auto Scaling + ELB, Disaster Recovery strategy (Backup & Restore, Pilot Light, Warm Standby, Multi-site), decoupling bằng messaging service.

Liên quan: `03-architecture-patterns/01-high-availability.md`, `02-fault-tolerance.md`, `07-disaster-recovery.md` (sẽ mở rộng), `02-core-services/11-sqs-sns-eventbridge.md` (sẽ mở rộng).

Cặp dịch vụ dễ nhầm cần ôn kỹ: **Multi-AZ vs Read Replica**, **SQS vs SNS vs EventBridge**.

### Domain 3 — Design High-Performing Architectures

Trọng tâm: chọn đúng compute (EC2 vs Lambda vs ECS/Fargate), đúng storage (S3 vs EBS vs EFS vs FSx), đúng database (RDS vs Aurora vs DynamoDB), và caching layer (ElastiCache, CloudFront, DAX).

Liên quan: toàn bộ `02-core-services/` và `04-comparison-guides/` (sẽ mở rộng).

Cặp dịch vụ dễ nhầm cần ôn kỹ: **S3 vs EBS vs EFS vs FSx**, **RDS vs Aurora vs DynamoDB**, **Lambda vs ECS/Fargate vs EC2**.

### Domain 4 — Design Cost-Optimized Architectures

Trọng tâm: purchasing options (On-Demand, Reserved, Spot, Savings Plans), S3 storage class lifecycle, right-sizing tài nguyên.

Liên quan: [01-foundation/04-pricing-and-billing-basics.md](../01-foundation/04-pricing-and-billing-basics.md), `03-architecture-patterns/05-cost-optimization.md` (sẽ mở rộng).

Cặp dịch vụ dễ nhầm cần ôn kỹ: **Reserved Instances vs Savings Plans vs Spot Instances**.

## Must know for exam

- Domain 1 và Domain 2 chiếm hơn nửa số câu hỏi (~56%) — ưu tiên thời gian ôn nhiều nhất.
- Mọi domain đều có thể xuất hiện dạng câu hỏi kết hợp nhiều tiêu chí (VD: vừa security vừa cost) — không học tách biệt hoàn toàn từng domain.

## Key takeaways

- Domain % là ước lượng dùng để phân bổ thời gian học, không phải con số tuyệt đối cố định — luôn kiểm tra lại exam guide chính thức trước khi đăng ký thi.
- Mỗi domain đều gắn với các cặp dịch vụ dễ nhầm cụ thể — nên ôn kỹ ở `04-comparison-guides/` khi phần đó hoàn thiện.

## Checklist tự ôn

- [ ] Tôi biết domain nào chiếm trọng số cao nhất và phân bổ thời gian tương ứng.
- [ ] Tôi liệt kê được ít nhất 1 cặp dịch vụ dễ nhầm cho mỗi domain.
- [ ] Tôi đã kiểm tra exam guide chính thức mới nhất trước ngày đăng ký thi.

## Xem tiếp / Liên kết liên quan

- [02-exam-strategy.md](./02-exam-strategy.md)
- [00-study-roadmap.md](./00-study-roadmap.md)
- [01-foundation/README.md](../01-foundation/README.md)
