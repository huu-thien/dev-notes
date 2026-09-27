# 03 — Architecture Patterns

> Cách ráp các core service thành giải pháp kiến trúc hoàn chỉnh, đáp ứng các trụ cột của Well-Architected Framework. Đây là phần "tư duy thiết kế" — không giải thích lại chi tiết từng service, chỉ dùng service để minh họa pattern/decision.

## Thư mục này bao phủ gì

8 pattern kiến trúc trọng tâm cho SAA-C03: High Availability, Fault Tolerance, Scalability, Performance Efficiency, Cost Optimization, Security Architecture, Disaster Recovery, và Migration/Hybrid.

## Mapping từ Core Services sang Architecture Patterns

| Core Service đã học | Pattern liên quan trực tiếp |
|---|---|
| [../02-core-services/08-elb-and-auto-scaling.md](../02-core-services/08-elb-and-auto-scaling.md) | [01-high-availability.md](./01-high-availability.md), [03-scalability.md](./03-scalability.md) |
| [../02-core-services/04-rds-aurora.md](../02-core-services/04-rds-aurora.md) | [01-high-availability.md](./01-high-availability.md), [07-disaster-recovery.md](./07-disaster-recovery.md) |
| [../02-core-services/11-sqs-sns-eventbridge.md](../02-core-services/11-sqs-sns-eventbridge.md) | [02-fault-tolerance.md](./02-fault-tolerance.md), [03-scalability.md](./03-scalability.md) |
| [../02-core-services/12-cloudfront.md](../02-core-services/12-cloudfront.md) | [04-performance-efficiency.md](./04-performance-efficiency.md) |
| [../02-core-services/01-ec2.md](../02-core-services/01-ec2.md) | [05-cost-optimization.md](./05-cost-optimization.md) |
| [../02-core-services/06-vpc.md](../02-core-services/06-vpc.md), [../02-core-services/14-kms-secrets-manager-parameter-store.md](../02-core-services/14-kms-secrets-manager-parameter-store.md) | [06-security-architecture.md](./06-security-architecture.md) |
| [../02-core-services/07-route53.md](../02-core-services/07-route53.md) | [07-disaster-recovery.md](./07-disaster-recovery.md) |

## Thứ tự đọc đề xuất

| # | File | Chủ đề chính | Priority | Trạng thái |
|---|---|---|---|---|
| 1 | [01-high-availability.md](./01-high-availability.md) | HA, Multi-AZ, ELB + Auto Scaling | Must know | Đã có |
| 2 | [02-fault-tolerance.md](./02-fault-tolerance.md) | FT, redundancy, decoupling, failure isolation | Must know | Đã có |
| 3 | [03-scalability.md](./03-scalability.md) | Vertical/horizontal scaling, elasticity | Must know | Đã có |
| 4 | [04-performance-efficiency.md](./04-performance-efficiency.md) | Caching mindset, right-sizing, bottleneck thinking | Important | Đã có |
| 5 | [05-cost-optimization.md](./05-cost-optimization.md) | Purchasing option, S3 lifecycle, managed vs self-managed | Important | Đã có |
| 6 | [06-security-architecture.md](./06-security-architecture.md) | Shared Responsibility, defense in depth | Must know | Đã có |
| 7 | [07-disaster-recovery.md](./07-disaster-recovery.md) | RTO/RPO, 4 chiến lược DR | Must know | Đã có |
| 8 | [08-migration-and-hybrid.md](./08-migration-and-hybrid.md) | DMS, Snow Family, Direct Connect/VPN | Important | Đã có |

## File quan trọng nhất cho kỳ thi

`01-high-availability.md`, `02-fault-tolerance.md`, `06-security-architecture.md`, và `07-disaster-recovery.md` — bốn pattern này xuất hiện trong phần lớn câu hỏi tình huống thuộc domain "Design Resilient Architectures" và "Design Secure Architectures".

## Xem thêm khi so sánh dịch vụ

Sau khi học xong nhóm pattern này, nên đối chiếu tại [`../04-comparison-guides/README.md`](../04-comparison-guides/README.md) để củng cố quyết định giữa các service tương tự.

**Xem tiếp:** [../02-core-services/README.md](../02-core-services/README.md) · [../README.md](../README.md)
