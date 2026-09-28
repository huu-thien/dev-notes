# Architecture Cheatsheet

Tóm tắt siêu nhanh các architecture pattern trọng tâm: High Availability, Fault Tolerance, Scalability, Performance Efficiency, Cost Optimization, Disaster Recovery, Migration/Hybrid. Xem [../03-architecture-patterns/README.md](../03-architecture-patterns/README.md) để đào sâu.

## Mục tiêu sử dụng cheatsheet

- Rà nhanh sự khác biệt giữa HA / Fault Tolerance / DR trước khi làm đề.
- Nhớ lại đúng 4 DR pattern và khi nào chọn cái nào theo RTO/RPO.
- Nhắc lại các trade-off cost/performance/operational excellence.

## Mục lục

- [HA vs Fault Tolerance vs DR](#ha-vs-fault-tolerance-vs-dr)
- [DR pattern: 4 lựa chọn theo RTO/RPO](#dr-pattern-4-lựa-chọn-theo-rtorpo)
- [Scalability: scale up vs scale out](#scalability-scale-up-vs-scale-out)
- [Performance Efficiency: cache layer mindset](#performance-efficiency-cache-layer-mindset)
- [Cost Optimization](#cost-optimization)
- [Migration / Hybrid](#migration--hybrid)
- [Must remember](#must-remember)
- [Common traps / easy confusion](#common-traps--easy-confusion)
- [Exam keywords](#exam-keywords)
- [Quick decision hints](#quick-decision-hints)
- [Checklist tự rà soát](#checklist-tự-rà-soát)

## HA vs Fault Tolerance vs DR

| Khái niệm | Mục tiêu | Phạm vi sự cố | Mức đảm bảo |
|---|---|---|---|
| [High Availability](../03-architecture-patterns/01-high-availability.md) | Giảm downtime, tự động phục hồi | Instance/AZ lỗi | Chấp nhận gián đoạn ngắn khi failover |
| [Fault Tolerance](../03-architecture-patterns/02-fault-tolerance.md) | Không gián đoạn dù có lỗi | Instance/component lỗi | Cao hơn HA — không mất request đang xử lý, chi phí/độ phức tạp cao hơn |
| [Disaster Recovery](../03-architecture-patterns/07-disaster-recovery.md) | Khôi phục sau sự cố diện rộng | Mất cả Region/data center | Có RTO/RPO cụ thể, không đòi hỏi zero downtime tuyệt đối |

## DR pattern: 4 lựa chọn theo RTO/RPO

| Pattern | RTO | RPO | Chi phí | Khi nào chọn |
|---|---|---|---|---|
| Backup & Restore | Giờ | Giờ | Thấp nhất | Ngân sách hạn chế, chấp nhận downtime dài |
| Pilot Light | Vài chục phút | Vài phút | Thấp-trung bình | Core service chạy tối thiểu ở Region phụ, scale khi cần |
| Warm Standby | Vài phút - vài chục phút | Vài phút | Trung bình-cao | Cần RTO nhanh hơn Pilot Light, hệ thống chạy sẵn ở scale nhỏ |
| Multi-site Active/Active | Gần như 0 | Gần như 0 | Cao nhất | RTO/RPO cực thấp, ngân sách không phải ràng buộc chính |

> Quick rule: RTO càng ngắn thì chi phí càng cao. Không chọn pattern "an toàn nhất" nếu đề chỉ yêu cầu RTO/RPO ở mức vừa phải — đó là over-engineering, không phải best answer.

## Scalability: scale up vs scale out

| | Scale up (vertical) | Scale out (horizontal) |
|---|---|---|
| Cách làm | Tăng cấu hình 1 instance | Thêm nhiều instance |
| Giới hạn | Có trần phần cứng | Gần như không giới hạn |
| Phù hợp với | Workload không chia nhỏ được (một số DB truyền thống) | Web tier, stateless app, Auto Scaling |
| Exam bias | Ít khi là best answer khi có Auto Scaling khả dụng | Thường là best answer cho web/app tier |

## Performance Efficiency: cache layer mindset

- Cache gần người dùng nhất có thể: CloudFront (edge) → ElastiCache/DAX (application/data layer) → read replica (database layer).
- Chọn đúng loại cache theo vấn đề: nội dung tĩnh toàn cầu → CloudFront; query lặp lại nhiều → ElastiCache; đọc nhiều trên DynamoDB → DAX.
- Đừng thêm cache nếu đề không có dấu hiệu "đọc lặp lại nhiều" hoặc "latency cao do truy vấn lặp" — thêm cache không cần thiết làm tăng độ phức tạp.

## Cost Optimization

- Ưu tiên theo mức độ dự đoán được của workload: ổn định dài hạn → Reserved/Savings Plans; linh hoạt chịu gián đoạn → Spot; không dự đoán được → On-Demand.
- S3 Lifecycle rule để tự động chuyển storage class theo tần suất truy cập, tránh quản lý thủ công.
- Managed service thường rẻ hơn về operational cost (dù giá thuê có thể cao hơn) — đề thi ưu tiên managed service khi so sánh tổng chi phí (bao gồm ops).

## Migration / Hybrid

| Nhu cầu | Công cụ |
|---|---|
| Chuyển lượng lớn dữ liệu tĩnh, băng thông hạn chế | Snow Family (Snowball/Snowcone) |
| Migrate database, cần downtime tối thiểu | DMS với continuous replication (CDC) |
| Kết nối hybrid ổn định, băng thông cao, lâu dài | Direct Connect |
| Kết nối hybrid nhanh, tạm thời hoặc backup | Site-to-Site VPN |

Xem chi tiết: [../03-architecture-patterns/08-migration-and-hybrid.md](../03-architecture-patterns/08-migration-and-hybrid.md).

## Must remember

- HA ≠ Fault Tolerance ≠ DR — đây là bộ 3 khái niệm bị nhầm nhiều nhất trong đề thi.
- Chọn DR pattern theo đúng RTO/RPO đề bài, không chọn "an toàn nhất" mặc định.
- Managed service bias: khi 2 phương án khả thi, AWS thường kỳ vọng chọn phương án giảm operational overhead.
- Cost optimization không đồng nghĩa với "rẻ nhất ngay lúc này" — cần nhìn theo mức độ dự đoán được của workload.

## Common traps / easy confusion

- Multi-AZ (RDS) giải quyết HA trong 1 Region — không phải DR cross-Region.
- "Backup có" không có nghĩa là "đã có DR" — backup chỉ là 1 phần của DR strategy.
- Pilot Light có thể có RTO lâu hơn Warm Standby nếu cần scale nhiều từ mức tối thiểu — không nên mặc định Pilot Light luôn nhanh hơn.
- Vertical scaling (scale up) có giới hạn phần cứng — không phải giải pháp dài hạn cho traffic tăng liên tục.

## Exam keywords

- "gần như zero downtime, RPO gần bằng 0" → Multi-site Active/Active
- "RTO vài phút, ngân sách trung bình" → Warm Standby
- "ngân sách hạn chế, chấp nhận downtime dài" → Backup & Restore
- "không mất request đang xử lý dở" → Fault Tolerance
- "tự động phục hồi khi AZ lỗi" → High Availability
- "băng thông hạn chế, dữ liệu lớn" → Snow Family
- "downtime tối thiểu khi migrate DB" → DMS + CDC

## Quick decision hints

- Đề nhắc "mất cả Region" → đang hỏi về DR, không phải HA.
- Đề nhắc con số RTO/RPO cụ thể → map thẳng vào bảng 4 DR pattern.
- Đề nhắc "traffic tăng liên tục, không giới hạn" → scale out, không phải scale up.
- Đề nhắc "chi phí thấp nhất chấp nhận được" + không có ràng buộc RTO chặt → Backup & Restore hoặc Spot Instances.

## Checklist tự rà soát

- [ ] Tôi phân biệt được HA vs Fault Tolerance vs DR chỉ bằng 1 câu.
- [ ] Tôi nhớ đúng thứ tự RTO/RPO của 4 DR pattern.
- [ ] Tôi biết khi nào scale out tốt hơn scale up.
- [ ] Tôi biết chọn đúng công cụ migration/hybrid theo tình huống.

## Xem tiếp / Liên kết liên quan

- [01-service-cheatsheet.md](./01-service-cheatsheet.md)
- [03-security-cheatsheet.md](./03-security-cheatsheet.md)
- [../05-exam-drills/03-decision-trees.md](../05-exam-drills/03-decision-trees.md)
- [README.md](./README.md)
