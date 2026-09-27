# AWS Certified Solutions Architect – Associate (SAA-C03) — Study Pack

> Bộ tài liệu tự học và ôn thi AWS SAA-C03 bằng tiếng Việt, đọc trực tiếp trên GitHub.
> Giữ nguyên thuật ngữ, tên dịch vụ, tên pattern bằng English để bám sát ngôn ngữ đề thi thật.

**Trạng thái:** Đang được xây dựng dần theo từng lượt (xem [GENERATION-PLAN.md](./GENERATION-PLAN.md)). Phần `00-overview` và `01-foundation` đã hoàn thiện; các phần còn lại sẽ được bổ sung tiếp.

---

## Mục lục

- [Bộ tài liệu này dành cho ai](#bộ-tài-liệu-này-dành-cho-ai)
- [Cách học theo thứ tự](#cách-học-theo-thứ-tự)
- [Quick links](#quick-links)
- [Roadmap học tổng quát](#roadmap-học-tổng-quát)
- [Dùng song song với khóa Udemy](#dùng-song-song-với-khóa-udemy)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Quy ước nội bộ](#quy-ước-nội-bộ)

---

## Bộ tài liệu này dành cho ai

- Người đang học AWS SAA-C03 song song với một khóa học video (ví dụ Udemy) và cần tài liệu tiếng Việt để đọc lại, tra cứu, ôn tập.
- Người muốn hiểu bản chất dịch vụ AWS, không chỉ học vẹt để thi.
- Người muốn có checklist, cheatsheet, flashcard, mock exam để ôn thi có hệ thống.

Tài liệu **không** thay thế hoàn toàn khóa học có video/lab thực hành — nó đóng vai trò tài liệu đọc, tra cứu nhanh và ôn tập trước ngày thi.

## Cách học theo thứ tự

1. Đọc [`00-overview`](./00-overview/README.md) để hiểu roadmap, chiến lược thi, và trọng số domain.
2. Học [`01-foundation`](./01-foundation/README.md) — kiến thức nền bắt buộc trước khi vào core services.
3. Học `02-core-services` theo từng service — toàn bộ 14 file (Compute, Storage, Network, Database, App Integration, Ops, Security) đã có ([02-core-services/README.md](./02-core-services/README.md)).
4. Học [`03-architecture-patterns`](./03-architecture-patterns/README.md) để ráp các service thành giải pháp hoàn chỉnh.
5. Ôn [`04-comparison-guides`](./04-comparison-guides/README.md) để phân biệt các dịch vụ dễ nhầm.
6. Luyện [`05-exam-drills`](./05-exam-drills/README.md) và [`06-practice`](./06-practice/README.md) để làm quen dạng câu hỏi thật.
7. Dùng [`07-cheatsheets`](./07-cheatsheets/README.md) và `08-flashcards` để ôn nhanh giai đoạn cuối.
8. Theo dõi tiến độ bằng `09-tracking`.

## Quick links

| Khu vực | Mô tả | Link |
|---|---|---|
| Overview | Roadmap, chiến lược thi, trọng số domain | [00-overview/README.md](./00-overview/README.md) |
| Foundation | Kiến thức nền: global infra, IAM, networking, pricing, Well-Architected | [01-foundation/README.md](./01-foundation/README.md) |
| Core Services | Chi tiết từng dịch vụ AWS | [02-core-services/README.md](./02-core-services/README.md) |
| Architecture Patterns | HA, Fault Tolerance, Scalability, Performance, Cost, Security, DR, Migration | [03-architecture-patterns/README.md](./03-architecture-patterns/README.md) |
| Comparison Guides | S3/EBS/EFS/FSx, RDS/Aurora/DynamoDB, SQS/SNS/EventBridge, Lambda/ECS/EC2, CDN/DNS/Global Accelerator, Secrets/Parameter | [04-comparison-guides/README.md](./04-comparison-guides/README.md) |
| Exam Drills | Pattern câu hỏi, exam traps, decision tree, last-minute revision | [05-exam-drills/README.md](./05-exam-drills/README.md) |
| Practice | Scenario/topic-based questions + 2 mini mock exam + answer explanations | [06-practice/README.md](./06-practice/README.md) |
| Cheatsheets | Tổng hợp nhanh theo chủ đề (service/architecture/security/storage/database/network) | [07-cheatsheets/README.md](./07-cheatsheets/README.md) |
| Flashcards | Ôn nhanh dạng thẻ hỏi-đáp (đang xây dựng) | `08-flashcards/` |
| Tracking | Study plan 30/45/60 ngày, checklist tiến độ | `09-tracking/README.md` |
| Appendix | Glossary súc tích cho người học, changelog | `10-appendix/README.md` |

> Các mục "đang xây dựng" sẽ được thêm link thật khi nội dung được sinh ra ở các lượt tiếp theo — xem [GENERATION-PLAN.md](./GENERATION-PLAN.md).

## Roadmap học tổng quát

Roadmap chi tiết theo giai đoạn nằm ở [00-overview/00-study-roadmap.md](./00-overview/00-study-roadmap.md). Lộ trình học theo ngày cụ thể (30/45/60 ngày) nằm ở `09-tracking/` (sẽ có ở lượt sau):

| Lộ trình | Phù hợp với | File |
|---|---|---|
| 30 ngày | Người có nền tảng AWS cơ bản, học full-time | `09-tracking/01-30-day-study-plan.md` |
| 45 ngày | Người học part-time đều đặn | `09-tracking/02-45-day-study-plan.md` |
| 60 ngày | Người mới, học không liên tục | `09-tracking/03-60-day-study-plan.md` |

## Dùng song song với khóa Udemy

Điền lại bảng dưới theo khóa Udemy bạn đang học để mapping section ↔ file đọc thêm:

| Udemy section (ví dụ) | Ghi chú | File nên đọc trong pack |
|---|---|---|
| Section: IAM | Video giới thiệu Users/Groups/Roles/Policies | [01-foundation/02-iam-basics.md](./01-foundation/02-iam-basics.md) |
| Section: EC2 Fundamentals | Instance types, purchasing options | [02-core-services/01-ec2.md](./02-core-services/01-ec2.md) |
| Section: VPC | Subnet, routing, NAT/IGW, SG/NACL | [02-core-services/06-vpc.md](./02-core-services/06-vpc.md) |
| Section: Route 53 | Routing policies, DNS failover | [02-core-services/07-route53.md](./02-core-services/07-route53.md) |
| Section: CloudFront | CDN, caching, origin | [02-core-services/12-cloudfront.md](./02-core-services/12-cloudfront.md) |
| Section: S3 | Storage class, versioning, lifecycle | [02-core-services/03-s3.md](./02-core-services/03-s3.md) |
| Section: Load Balancing & Auto Scaling | ALB/NLB, Auto Scaling Group | [02-core-services/08-elb-and-auto-scaling.md](./02-core-services/08-elb-and-auto-scaling.md) |
| Section: RDS & Aurora | Relational DB, Multi-AZ, Read Replica | [02-core-services/04-rds-aurora.md](./02-core-services/04-rds-aurora.md) |
| Section: DynamoDB | NoSQL, partition key, GSI/LSI | [02-core-services/05-dynamodb.md](./02-core-services/05-dynamodb.md) |
| Section: Lambda | Serverless compute, event-driven | [02-core-services/09-lambda.md](./02-core-services/09-lambda.md) |
| Section: API Gateway | REST/HTTP API, throttling | [02-core-services/10-api-gateway.md](./02-core-services/10-api-gateway.md) |
| Section: SQS/SNS/EventBridge | Decoupling, fanout, event routing | [02-core-services/11-sqs-sns-eventbridge.md](./02-core-services/11-sqs-sns-eventbridge.md) |
| Section: CloudWatch/CloudTrail/Config | Monitoring, audit, compliance | [02-core-services/13-cloudwatch-cloudtrail-config.md](./02-core-services/13-cloudwatch-cloudtrail-config.md) |
| Section: KMS/Secrets Manager/Parameter Store | Encryption key, secret rotation | [02-core-services/14-kms-secrets-manager-parameter-store.md](./02-core-services/14-kms-secrets-manager-parameter-store.md) |
| Section: Well-Architected Framework | 6 pillars | [01-foundation/05-well-architected-framework.md](./01-foundation/05-well-architected-framework.md) |

> Gợi ý: sau mỗi video Udemy, mở đúng file tương ứng trong pack để đọc lại bằng tiếng Việt và tick vào `09-tracking/04-progress-checklist.md`.

## Cấu trúc thư mục

```
aws-saa-c03-study-pack/
├── README.md                  ← bạn đang ở đây
├── GLOSSARY.md                ← rulebook thuật ngữ (dùng nội bộ khi viết tài liệu)
├── STYLE-GUIDE.md             ← chuẩn văn phong (dùng nội bộ khi viết tài liệu)
├── GENERATION-PLAN.md         ← kế hoạch sinh tài liệu theo từng lượt
├── QUALITY-CHECKLIST.md       ← checklist kiểm tra chất lượng mỗi file
├── 00-overview/                Chiến lược thi, roadmap, cách dùng pack
├── 01-foundation/              Kiến thức nền bắt buộc trước core services
├── 02-core-services/           Chi tiết từng dịch vụ AWS (14/14 file đã hoàn thành)
├── 03-architecture-patterns/   Pattern kiến trúc (8/8 file đã hoàn thành)
├── 04-comparison-guides/       So sánh dịch vụ dễ nhầm (6/6 file đã hoàn thành)
├── 05-exam-drills/             Dạng câu hỏi, bẫy thi (4/4 file đã hoàn thành)
├── 06-practice/                Câu hỏi luyện tập (5/5 file đã hoàn thành: scenario + topic-based + 2 mini mock exam + answer explanations)
├── 07-cheatsheets/              Tổng hợp nhanh (6/6 file đã hoàn thành: service/architecture/security/storage/database/network)
├── 08-flashcards/               Ôn nhanh dạng thẻ (đang xây dựng)
├── 09-tracking/                 Study plan, progress checklist (đang xây dựng)
└── 10-appendix/                 Glossary học được, changelog (đang xây dựng)
```

## Quy ước nội bộ

Các file sau không phải bài học, mà là rulebook để giữ tài liệu nhất quán khi tiếp tục mở rộng:

- [GLOSSARY.md](./GLOSSARY.md) — thuật ngữ chuẩn dùng xuyên suốt repo.
- [STYLE-GUIDE.md](./STYLE-GUIDE.md) — template và văn phong chuẩn cho từng loại file.
- [GENERATION-PLAN.md](./GENERATION-PLAN.md) — thứ tự sinh tài liệu theo từng lượt.
- [QUALITY-CHECKLIST.md](./QUALITY-CHECKLIST.md) — checklist rà soát chất lượng file trước khi coi là hoàn thành.

**Xem tiếp:** [00-overview/README.md](./00-overview/README.md)
