# Pricing and Billing Basics

On-Demand, Reserved Instances, Spot Instances, Savings Plans, Cost Explorer, và AWS Budgets.

## Mục lục

- [Mục tiêu học](#mục-tiêu-học)
- [Practical understanding](#practical-understanding)
- [Exam focus](#exam-focus)
- [Common traps](#common-traps)
- [Mini scenario](#mini-scenario)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Mục tiêu học

- Phân biệt các purchasing option: On-Demand, Reserved Instances, Spot Instances, Savings Plans.
- Biết công cụ theo dõi/kiểm soát chi phí: Cost Explorer, AWS Budgets.

## Practical understanding

- **On-Demand**: trả theo giờ/giây sử dụng thực tế, không cam kết dài hạn, giá cao nhất trong các option nhưng linh hoạt nhất.
- **Reserved Instances (RI)**: cam kết dùng 1 hoặc 3 năm cho một loại instance cụ thể (hoặc convertible) để đổi lấy giá thấp hơn đáng kể so với On-Demand — phù hợp workload ổn định, dự đoán được.
- **Savings Plans**: cam kết một mức chi tiêu (USD/giờ) trong 1-3 năm, linh hoạt hơn RI vì áp dụng được cho nhiều instance family/Region (tùy loại plan), đổi lấy giá giảm.
- **Spot Instances**: dùng capacity dư thừa của AWS với giá giảm sâu (có thể giảm tới ~90% so với On-Demand), nhưng AWS có thể thu hồi (interrupt) bất kỳ lúc nào khi cần capacity lại — chỉ phù hợp workload chịu được gián đoạn (batch job, stateless, fault-tolerant).
- **Cost Explorer**: công cụ trực quan hoá và phân tích chi phí đã phát sinh, dự báo xu hướng chi tiêu.
- **AWS Budgets**: thiết lập ngưỡng chi tiêu/sử dụng và nhận cảnh báo khi vượt ngưỡng — mang tính chủ động phòng ngừa, khác với Cost Explorer (mang tính phân tích).

## Exam focus

### Must know for exam

- Workload ổn định, chạy liên tục dài hạn → Reserved Instances hoặc Savings Plans.
- Workload chịu được gián đoạn, không cần liên tục (batch, rendering, CI job) → Spot Instances để tối ưu chi phí.
- Workload không dự đoán được, thời gian ngắn, thử nghiệm → On-Demand.
- Cần cảnh báo chủ động khi chi phí vượt ngưỡng → AWS Budgets.

### Important

- Savings Plans linh hoạt hơn RI về việc đổi instance family/Region trong cùng cam kết chi tiêu.
- Reserved Instances có loại Standard (giảm giá sâu hơn, ít linh hoạt) và Convertible (linh hoạt đổi attribute, giảm giá ít hơn).

### Nice to know

- Reserved Instances còn áp dụng được cho RDS, ElastiCache, Redshift — không chỉ EC2.

## Common traps

### Trap: dùng Spot Instance cho workload cần chạy liên tục không gián đoạn
Spot có thể bị AWS thu hồi bất kỳ lúc nào — không phù hợp cho production database hay service yêu cầu uptime liên tục không chấp nhận gián đoạn.

### Trap: nhầm Cost Explorer với Budgets
Cost Explorer = phân tích/nhìn lại chi phí đã phát sinh và dự báo. Budgets = đặt ngưỡng và cảnh báo chủ động trước khi vượt mức. Đề hỏi "muốn được cảnh báo khi chi phí vượt X" → luôn là Budgets.

## Mini scenario

**Tình huống:** Công ty cần chạy một hệ thống xử lý batch dữ liệu ban đêm, có thể tạm dừng và chạy lại mà không ảnh hưởng kết quả cuối, muốn tối ưu chi phí compute nhất có thể.
**Đáp án đúng:** Sử dụng Spot Instances cho các node xử lý batch.
**Vì sao:** Batch job chịu được gián đoạn (fault-tolerant, có thể resume), phù hợp đặc tính Spot; đây là lựa chọn "MOST cost-effective" so với On-Demand hay Reserved.

## Key takeaways

- On-Demand = linh hoạt nhất, đắt nhất; Spot = rẻ nhất, có rủi ro bị thu hồi; RI/Savings Plans = cam kết dài hạn đổi lấy giá tốt.
- Chọn purchasing option dựa trên đặc tính workload (liên tục hay gián đoạn, ổn định hay biến động).
- Budgets để cảnh báo chủ động, Cost Explorer để phân tích chi phí đã xảy ra.

## Checklist tự ôn

- [ ] Tôi chọn đúng purchasing option cho từng loại workload (ổn định, biến động, chịu gián đoạn).
- [ ] Tôi phân biệt được Reserved Instances và Savings Plans.
- [ ] Tôi phân biệt được vai trò của Cost Explorer và AWS Budgets.

## Xem tiếp / Liên kết liên quan

- [05-well-architected-framework.md](./05-well-architected-framework.md)
- [../02-core-services/01-ec2.md](../02-core-services/01-ec2.md) (purchasing options áp dụng cho EC2)
- [../03-architecture-patterns/05-cost-optimization.md](../03-architecture-patterns/05-cost-optimization.md)
- [00-overview/03-domain-weight-and-focus.md](../00-overview/03-domain-weight-and-focus.md)
