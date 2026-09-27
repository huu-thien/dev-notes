# Study Roadmap

Roadmap học AWS SAA-C03 theo giai đoạn logic (không đi theo ngày cụ thể — lộ trình theo ngày nằm ở `09-tracking/`).

## Mục lục

- [Nguyên tắc roadmap](#nguyên-tắc-roadmap)
- [Giai đoạn 1: Foundation](#giai-đoạn-1-foundation)
- [Giai đoạn 2: Core Services](#giai-đoạn-2-core-services)
- [Giai đoạn 3: Architecture Patterns](#giai-đoạn-3-architecture-patterns)
- [Giai đoạn 4: Comparison & Consolidation](#giai-đoạn-4-comparison--consolidation)
- [Giai đoạn 5: Exam Drills & Practice](#giai-đoạn-5-exam-drills--practice)
- [Giai đoạn 6: Final Review](#giai-đoạn-6-final-review)
- [Key takeaways](#key-takeaways)

## Nguyên tắc roadmap

- Học theo chiều: **Foundation → Core Services → Patterns → Comparison → Drills/Practice → Review**.
- Không nhảy thẳng vào comparison guide hay practice khi chưa nắm core services — sẽ học vẹt, không hiểu bản chất.
- Mỗi giai đoạn nên kết hợp: xem video Udemy tương ứng → đọc file trong pack → tick checklist trong `09-tracking/04-progress-checklist.md`.

## Giai đoạn 1: Foundation

Mục tiêu: nắm global infrastructure, IAM cơ bản, networking cơ bản, pricing, và Well-Architected Framework — đây là nền tảng bắt buộc để hiểu mọi service sau này.

File liên quan: [01-foundation/README.md](../01-foundation/README.md)

## Giai đoạn 2: Core Services

Mục tiêu: hiểu từng service AWS theo nhóm — Compute (EC2, Lambda), Storage (S3, EBS, EFS, FSx), Database (RDS, Aurora, DynamoDB), Networking (VPC, Route 53, CloudFront), Messaging (SQS, SNS, EventBridge), và Security/Ops (KMS, CloudWatch, CloudTrail).

File liên quan: `02-core-services/` — nhóm Compute/Storage và Network đã có ([02-core-services/README.md](../02-core-services/README.md)), nhóm Database/Application còn lại sẽ được bổ sung (xem [../GENERATION-PLAN.md](../GENERATION-PLAN.md)).

## Giai đoạn 3: Architecture Patterns

Mục tiêu: ráp các service lại thành giải pháp — High Availability, Fault Tolerance, Scalability, Disaster Recovery, Security Architecture, Migration/Hybrid.

File liên quan: `03-architecture-patterns/` (sẽ mở rộng ở lượt sau).

## Giai đoạn 4: Comparison & Consolidation

Mục tiêu: giải quyết các cặp dịch vụ dễ nhầm (S3 vs EBS vs EFS vs FSx, RDS vs Aurora vs DynamoDB, SQS vs SNS vs EventBridge...).

File liên quan: `04-comparison-guides/` (sẽ mở rộng ở lượt sau).

## Giai đoạn 5: Exam Drills & Practice

Mục tiêu: làm quen dạng câu hỏi thật, nhận diện bẫy, luyện tốc độ qua mini mock exam.

File liên quan: `05-exam-drills/`, `06-practice/` (sẽ mở rộng ở lượt sau).

## Giai đoạn 6: Final Review

Mục tiêu: ôn cực nhanh bằng cheatsheet và flashcard trong tuần cuối trước ngày thi.

File liên quan: `07-cheatsheets/`, `08-flashcards/`, và [00-overview/02-exam-strategy.md](./02-exam-strategy.md).

## Key takeaways

- Roadmap là một chiều: nền tảng vững trước, so sánh/luyện đề sau — không đảo ngược thứ tự.
- Mỗi giai đoạn nên có điểm dừng để tự kiểm tra (checklist tự ôn trong từng file, progress checklist tổng ở `09-tracking/`).
- Roadmap theo ngày cụ thể (30/45/60 ngày) sẽ được cụ thể hoá ở `09-tracking/` — dùng roadmap này để hiểu bức tranh tổng thể trước.

## Xem tiếp / Liên kết liên quan

- [01-how-to-use-this-pack.md](./01-how-to-use-this-pack.md)
- [02-exam-strategy.md](./02-exam-strategy.md)
- [01-foundation/README.md](../01-foundation/README.md)
