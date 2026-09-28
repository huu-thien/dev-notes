# Generation Plan

> Kế hoạch sinh tài liệu theo từng lượt, dùng để tránh lệch ngữ cảnh và giảm lặp nội dung khi tiếp tục mở rộng study pack.

## Bảng kế hoạch theo lượt

| Lượt | Mục tiêu | File sẽ sinh | Vì sao thứ tự này | Consistency constraints | Cập nhật link sau lượt |
|---|---|---|---|---|---|
| 1 | Khung sườn + entrypoint | Root `README.md`, `GLOSSARY.md`, `STYLE-GUIDE.md`, `GENERATION-PLAN.md`, `QUALITY-CHECKLIST.md`, toàn bộ `00-overview/*`, `01-foundation/*` | Cần rulebook glossary/style trước khi viết nội dung; overview + foundation là nền cho mọi phần sau | Chốt terminology, priority tag, template file | README root trỏ tới 00-overview và 01-foundation |
| 2 | Core services nhóm Compute/Storage | `02-core-services/README.md`, `01-ec2.md`, `02-ebs-efs-fsx.md`, `03-s3.md`, `08-elb-and-auto-scaling.md` | Compute/Storage là nền tảng, cần trước khi học network và pattern | Không lặp lại global infra/IAM đã có ở foundation; nhắc ECS/Fargate và ElastiCache đúng chỗ | 01-foundation thêm link ngược tới core-services liên quan |
| 3 | Core services nhóm Network | `06-vpc.md`, `07-route53.md`, `12-cloudfront.md` | Cần VPC trước khi học HA/DR pattern | Nhất quán Security Group vs NACL terminology (theo GLOSSARY.md) | 03-networking-basics liên kết sang 06-vpc |
| 4 | Core services nhóm Database/App/Ops | `04-rds-aurora.md`, `05-dynamodb.md`, `09-lambda.md`, `10-api-gateway.md`, `11-sqs-sns-eventbridge.md`, `13-cloudwatch-cloudtrail-config.md`, `14-kms-secrets-manager-parameter-store.md` | Hoàn tất toàn bộ 02-core-services | Không trùng nội dung Lambda ↔ API Gateway | 02-core-services/README.md hoàn thiện bảng index |
| 5 | Architecture patterns | `03-architecture-patterns/*` (+README) | Cần đủ service trước khi ráp pattern | Chỉ link tới service, không giải thích lại chi tiết | Core-services thêm mục "Dùng trong pattern nào" |
| 6 | Comparison guides | `04-comparison-guides/*` (+README) | Cần cả service + pattern để so sánh có ý nghĩa | Không dịch lại chi tiết service, chỉ bảng + trap | Core-services link tới comparison guide tương ứng |
| 7 | Exam drills | `05-exam-drills/*` (+README) | Tổng hợp traps/pattern đã rải rác trước đó | Trap phải trỏ nguồn về file gốc | 02-exam-strategy link sang exam-drills |
| 8 | Practice | `06-practice/*` (+README) | Cần đủ kiến thức nền để ra câu hỏi chuẩn | Đáp án phải cite đúng file lý thuyết | 05-exam-drills link câu hỏi mẫu |
| 9 | Cheatsheets + Flashcards + Tracking | `07-cheatsheets/*`, `08-flashcards/*`, `09-tracking/*`, `10-appendix/*` (+README từng thư mục) | Tổng hợp cuối, cần nội dung đã ổn định | Chỉ tóm tắt, không tạo kiến thức mới | 09-tracking checklist trỏ hết các file; root README cập nhật link roadmap thật |
| 10 | Review consistency pass | Rà toàn bộ link, glossary, priority tag | Đảm bảo không lệch ngữ cảnh sau nhiều lượt | Chạy `QUALITY-CHECKLIST.md` cho từng file | Cập nhật `10-appendix/02-changelog.md` |

## Trạng thái hiện tại

- [x] Lượt 1 — Root files + `00-overview/*` + `01-foundation/*`
- [x] Lượt 2 — Core services: Compute/Storage (`02-core-services/README.md`, `01-ec2.md`, `02-ebs-efs-fsx.md`, `03-s3.md`, `08-elb-and-auto-scaling.md`)
- [x] Lượt 3 — Core services: Network (`06-vpc.md`, `07-route53.md`, `12-cloudfront.md`)
- [x] Lượt 4 — Core services: Database/App/Ops (`04-rds-aurora.md`, `05-dynamodb.md`, `09-lambda.md`, `10-api-gateway.md`, `11-sqs-sns-eventbridge.md`, `13-cloudwatch-cloudtrail-config.md`, `14-kms-secrets-manager-parameter-store.md`) — `02-core-services` đã hoàn thành 14/14 file
- [x] Lượt 5 — Architecture patterns (`03-architecture-patterns/README.md`, `01-high-availability.md`, `02-fault-tolerance.md`, `03-scalability.md`, `04-performance-efficiency.md`, `05-cost-optimization.md`, `06-security-architecture.md`, `07-disaster-recovery.md`, `08-migration-and-hybrid.md`)
- [x] Lượt 6 — Comparison guides (`04-comparison-guides/README.md`, `01-s3-vs-ebs-vs-efs-vs-fsx.md`, `02-rds-vs-aurora-vs-dynamodb.md`, `03-sqs-vs-sns-vs-eventbridge.md`, `04-lambda-vs-ecs-vs-ec2.md`, `05-cloudfront-vs-route53-vs-global-accelerator.md`, `06-secrets-manager-vs-parameter-store.md`)
- [x] Lượt 7 — Exam drills (`05-exam-drills/README.md`, `01-common-question-patterns.md`, `02-exam-traps.md`, `03-decision-trees.md`, `04-last-minute-revision.md`)
- [x] Lượt 8 — Practice: scenario/topic-based questions, 2 mini mock exam, answer explanations (`06-practice/README.md`, `01-scenario-based-questions.md`, `02-topic-based-questions.md`, `03-mini-mock-exam-1.md`, `04-mini-mock-exam-2.md`, `05-answer-explanations.md`)
- [ ] Lượt 9 (phần 1) — Cheatsheets: `07-cheatsheets/README.md` + 6 cheatsheet file (service, architecture, security, storage, database, network) — Flashcards + Tracking sẽ làm ở lượt sau
- [ ] Lượt 10 — Review consistency pass

**Liên kết liên quan:** [QUALITY-CHECKLIST.md](./QUALITY-CHECKLIST.md) · [STYLE-GUIDE.md](./STYLE-GUIDE.md) · [README.md](./README.md)
