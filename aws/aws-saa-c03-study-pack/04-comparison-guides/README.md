# 04 — Comparison Guides

> So sánh nhanh các dịch vụ AWS dễ nhầm lẫn, tối ưu cho việc ra quyết định đúng khi làm bài thi. Không lặp lại chi tiết lesson từng service — chỉ tóm tắt để chọn đáp án.

## Thư mục này dùng để làm gì

6 file so sánh trực tiếp các nhóm service/pattern hay bị nhầm lẫn trong đề thi SAA-C03: storage, database, messaging, compute, network/global routing, và secret management.

## Nên đọc theo thứ tự nào

Nên đọc **sau khi đã hoàn tất** `02-core-services/*` và `03-architecture-patterns/*` — file trong thư mục này giả định người đọc đã biết từng service, chỉ tổng hợp lại để so sánh.

## Danh sách file

| # | File | So sánh | Priority | Trạng thái |
|---|---|---|---|---|
| 1 | [01-s3-vs-ebs-vs-efs-vs-fsx.md](./01-s3-vs-ebs-vs-efs-vs-fsx.md) | Object vs Block vs File storage | Must know | Đã có |
| 2 | [02-rds-vs-aurora-vs-dynamodb.md](./02-rds-vs-aurora-vs-dynamodb.md) | Relational vs NoSQL | Must know | Đã có |
| 3 | [03-sqs-vs-sns-vs-eventbridge.md](./03-sqs-vs-sns-vs-eventbridge.md) | Queue vs Pub/sub vs Event routing | Must know | Đã có |
| 4 | [04-lambda-vs-ecs-vs-ec2.md](./04-lambda-vs-ecs-vs-ec2.md) | Event-driven vs Container vs VM | Important | Đã có |
| 5 | [05-cloudfront-vs-route53-vs-global-accelerator.md](./05-cloudfront-vs-route53-vs-global-accelerator.md) | CDN vs DNS vs Network acceleration | Important | Đã có |
| 6 | [06-secrets-manager-vs-parameter-store.md](./06-secrets-manager-vs-parameter-store.md) | Secret lifecycle vs Config storage | Must know | Đã có |

## File quan trọng nhất cho kỳ thi

`01-s3-vs-ebs-vs-efs-vs-fsx.md`, `02-rds-vs-aurora-vs-dynamodb.md`, và `03-sqs-vs-sns-vs-eventbridge.md` — ba cặp so sánh này xuất hiện nhiều nhất trong câu hỏi tình huống của cả 4 domain.

## Link tới file gốc liên quan

- [../02-core-services/README.md](../02-core-services/README.md)
- [../03-architecture-patterns/README.md](../03-architecture-patterns/README.md)

**Xem tiếp:** [../05-exam-drills/README.md](../05-exam-drills/README.md) · [../README.md](../README.md)
