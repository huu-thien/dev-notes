# Well-Architected Framework

6 pillars của AWS Well-Architected Framework — mindset nền tảng chi phối hầu hết cách chọn đáp án trong đề thi SAA-C03.

## Mục lục

- [Mục tiêu học](#mục-tiêu-học)
- [Practical understanding](#practical-understanding)
- [Exam focus](#exam-focus)
- [Common traps](#common-traps)
- [Mini scenario](#mini-scenario)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Mục tiêu học

- Nhớ tên và ý nghĩa 6 pillars.
- Liên hệ được mỗi pillar với domain thi tương ứng và các file pattern sẽ học sau này.

## Practical understanding

> Cần verify lại theo AWS official docs mới nhất — AWS đã cập nhật framework từ 5 lên 6 pillars (thêm Sustainability); tên gọi/số lượng pillar có thể tiếp tục điều chỉnh.

| Pillar | Ý nghĩa ngắn |
|---|---|
| **Operational Excellence** | Vận hành hệ thống hiệu quả, tự động hoá, cải tiến liên tục qua monitoring và runbook |
| **Security** | Bảo vệ dữ liệu và hệ thống — least privilege, mã hoá, giám sát |
| **Reliability** | Hệ thống phục hồi sau lỗi, đáp ứng đúng nhu cầu vận hành (liên quan trực tiếp HA/FT/DR) |
| **Performance Efficiency** | Sử dụng tài nguyên đúng loại, đúng quy mô để đạt hiệu năng cần thiết, linh hoạt thay đổi khi công nghệ mới xuất hiện |
| **Cost Optimization** | Đạt mục tiêu kinh doanh với chi phí thấp nhất có thể chấp nhận |
| **Sustainability** | Giảm tác động môi trường của khối lượng công việc chạy trên cloud |

Mỗi câu hỏi tình huống trong đề thi thường ẩn chứa việc đánh đổi (trade-off) giữa các pillar này — VD: giải pháp tối ưu Performance có thể tốn kém hơn (đánh đổi với Cost Optimization).

## Exam focus

### Must know for exam

- Nhận diện pillar nào đang được đề thi nhấn mạnh qua từ khóa (xem thêm [00-overview/02-exam-strategy.md](../00-overview/02-exam-strategy.md)).
- Reliability pillar liên hệ trực tiếp tới `03-architecture-patterns/01-high-availability.md`, `02-fault-tolerance.md`, `07-disaster-recovery.md` (sẽ mở rộng).
- Cost Optimization pillar liên hệ trực tiếp tới [04-pricing-and-billing-basics.md](./04-pricing-and-billing-basics.md) và `03-architecture-patterns/05-cost-optimization.md` (sẽ mở rộng).

### Important

- Security pillar là nền cho toàn bộ Domain 1 của kỳ thi — liên hệ [02-iam-basics.md](./02-iam-basics.md).
- Performance Efficiency pillar liên hệ việc chọn đúng service/instance type — sẽ khai thác sâu ở `02-core-services/` và `04-comparison-guides/`.

### Nice to know

- Sustainability là pillar mới bổ sung, ít xuất hiện trực tiếp trong câu hỏi SAA-C03 nhưng nên biết tên và ý nghĩa.

## Common traps

### Trap: chọn giải pháp tối ưu 1 pillar nhưng vi phạm ràng buộc đề bài ở pillar khác
Một đáp án có thể tối ưu Performance nhưng đắt hơn hẳn khi đề yêu cầu "MOST cost-effective" — luôn đối chiếu đáp án với đúng pillar mà đề đang nhấn mạnh, không mặc định pillar "tốt nhất" theo cảm tính.

### Trap: nhầm Reliability với Performance Efficiency
Reliability = hệ thống phục hồi/chịu lỗi đúng cách (liên quan HA, FT, DR). Performance Efficiency = dùng đúng loại/quy mô tài nguyên để đạt hiệu năng cần thiết. Một giải pháp Multi-AZ giải quyết Reliability, không tự động giải quyết Performance.

## Mini scenario

**Tình huống:** Đề mô tả một ứng dụng cần "MOST operationally efficient" cách vận hành, ưu tiên giảm thao tác thủ công và tự động hoá.
**Đáp án đúng:** Chọn giải pháp dùng managed service/serverless (VD: Lambda thay vì tự quản lý EC2) và tự động hoá qua Infrastructure as Code/CloudWatch alarms.
**Vì sao:** Từ khóa "operationally efficient" trỏ thẳng vào pillar Operational Excellence — ưu tiên tự động hoá và giảm gánh nặng vận hành thủ công.

## Key takeaways

- 6 pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability.
- Mỗi câu hỏi đề thi thường test khả năng nhận diện đúng pillar đang được ưu tiên và chấp nhận đánh đổi ở pillar khác.
- Đây là mindset nền — sẽ được áp dụng liên tục xuyên suốt `03-architecture-patterns/`.

## Checklist tự ôn

- [ ] Tôi nhớ được tên và ý nghĩa ngắn gọn của cả 6 pillars.
- [ ] Tôi liên hệ được mỗi pillar với ít nhất 1 domain thi và 1 nhóm file pattern tương ứng.
- [ ] Tôi hiểu khái niệm đánh đổi (trade-off) giữa các pillar khi chọn đáp án thi.

## Xem tiếp / Liên kết liên quan

- [00-overview/02-exam-strategy.md](../00-overview/02-exam-strategy.md)
- [00-overview/03-domain-weight-and-focus.md](../00-overview/03-domain-weight-and-focus.md)
- [../03-architecture-patterns/README.md](../03-architecture-patterns/README.md)
