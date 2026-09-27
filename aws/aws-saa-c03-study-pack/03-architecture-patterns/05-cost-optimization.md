# Cost Optimization

Pattern giúp tối ưu chi phí kiến trúc mà không hy sinh yêu cầu nghiệp vụ — trọng tâm là right-sizing, purchasing option, storage lifecycle, và cân bằng managed service với self-managed.

## Mục lục

- [Mục tiêu học](#mục-tiêu-học)
- [Practical understanding](#practical-understanding)
- [Exam focus](#exam-focus)
- [Decision mindset / decision framework](#decision-mindset--decision-framework)
- [Service mapping](#service-mapping)
- [Trade-offs](#trade-offs)
- [Anti-patterns / lựa chọn sai thường gặp](#anti-patterns--lựa-chọn-sai-thường-gặp)
- [Common traps](#common-traps)
- [Mini scenarios](#mini-scenarios)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Mục tiêu học

- Hiểu right-sizing ở góc nhìn tối ưu chi phí (không chỉ hiệu năng).
- Biết áp dụng đúng purchasing option (Spot/Reserved/Savings Plans) theo đặc điểm workload.
- Hiểu trade-off giữa managed service và self-managed khi tối ưu chi phí.
- Nắm nguyên tắc: cost optimization không đồng nghĩa chọn phương án rẻ nhất.

## Practical understanding

### Right-sizing (góc nhìn chi phí)

Right-sizing — đã nhắc ở [`04-performance-efficiency.md`](./04-performance-efficiency.md) — cũng là kỹ thuật cost optimization quan trọng nhất: loại bỏ tài nguyên dư thừa (over-provisioned) đang chạy nhưng không cần thiết. Cần dựa vào CloudWatch metrics để xác định instance/database class nào đang được cấp phát quá mức so với tải thực tế.

### Purchasing option ở mức kiến trúc

Đã giới thiệu chi tiết ở [`01-ec2.md`](../02-core-services/01-ec2.md), ở đây nhấn mạnh góc nhìn kiến trúc — chọn đúng purchasing option theo đặc điểm workload:

| Purchasing option | Phù hợp workload nào |
|---|---|
| **On-Demand** | Workload ngắn hạn, không dự đoán trước, thử nghiệm |
| **Reserved Instances / Savings Plans** | Workload chạy ổn định, dự đoán được dài hạn (production baseline) |
| **Spot Instances** | Workload chịu được gián đoạn, có thể chạy lại (batch processing, xử lý dữ liệu song song, CI/CD build) |

Kiến trúc chi phí tối ưu thường **kết hợp cả ba**: Reserved/Savings Plans cho baseline capacity ổn định, Spot cho phần tải biến động chịu được gián đoạn, On-Demand cho phần còn lại cần linh hoạt.

🧠 **Exam mindset:** "cost-effective" ≠ "cheapest" — đề thi luôn ngầm định đáp án phải **đáp ứng đủ yêu cầu nghiệp vụ trước**, rồi mới xét tới chi phí thấp nhất trong số các đáp án còn lại. Một đáp án rẻ hơn nhưng không đáp ứng SLA/availability yêu cầu luôn là sai, dù giá thấp hơn.

### S3 lifecycle / storage class optimization

Đã giới thiệu ở [`03-s3.md`](../02-core-services/03-s3.md) — ở góc nhìn kiến trúc, **lifecycle policy** tự động chuyển dữ liệu ít truy cập sang storage class rẻ hơn theo thời gian (VD: Standard → Standard-IA → Glacier) là kỹ thuật cost optimization cho storage gần như "miễn phí công sức vận hành" sau khi cấu hình.

### Managed service vs self-managed trade-off

Managed service (RDS, DynamoDB, Lambda...) thường có chi phí trên mỗi đơn vị cao hơn tự vận hành trên EC2, nhưng **giảm chi phí vận hành** (patching, backup, scaling thủ công) — chi phí thực sự phải tính cả effort vận hành, không chỉ giá dịch vụ theo giờ.

✅ Ưu tiên managed service khi: đội ngũ nhỏ, cần giảm rủi ro vận hành, cần time-to-market nhanh.
❌ Cân nhắc self-managed khi: cần tuỳ biến sâu (custom engine/config) mà managed service không hỗ trợ, hoặc chi phí ở quy mô cực lớn khiến chênh lệch giá theo giờ trở nên đáng kể hơn effort vận hành.

### Chi phí ẩn hay bị bỏ qua

⚠️ **Bẫy hay gặp:** khi tính tổng chi phí kiến trúc, người học thường chỉ nhìn giá compute/storage mà quên các khoản phát sinh: **data transfer** (đặc biệt cross-AZ/cross-Region), **NAT Gateway** (tính phí theo giờ + theo GB xử lý), và **idle resource** (EBS volume không attach, EIP không gắn instance, snapshot cũ không xoá) — đây đều là chi phí âm thầm cộng dồn theo thời gian.

### Cost vs performance vs ops effort

Ba yếu tố này luôn đánh đổi lẫn nhau: giảm chi phí hạ tầng có thể tăng effort vận hành (self-managed) hoặc giảm hiệu năng (right-sizing quá mức). Quyết định tối ưu chi phí đúng đắn phải cân nhắc cả ba, không chỉ nhìn vào con số hóa đơn.

## Exam focus

### Must know for exam

- Cost optimization **không đồng nghĩa** chọn phương án rẻ nhất — phải đáp ứng đúng yêu cầu nghiệp vụ (availability, performance, compliance) với chi phí hợp lý nhất.
- Spot Instances phù hợp workload chịu được gián đoạn (fault-tolerant, stateless, có thể resume) — không dùng cho workload cần chạy liên tục không gián đoạn.
- Reserved Instances/Savings Plans phù hợp baseline ổn định dài hạn, không phù hợp workload biến động thất thường.
- S3 Lifecycle giúp tối ưu chi phí lưu trữ tự động theo thời gian truy cập dữ liệu.

### Important

- "MOST cost-effective" trong đề thi thường có nghĩa: đáp ứng đúng yêu cầu với chi phí thấp nhất **trong số các đáp án còn thỏa yêu cầu** — không chọn đáp án rẻ nhất nếu nó không đáp ứng yêu cầu (VD: chọn Spot cho workload cần độ tin cậy cao là sai dù rẻ hơn).
- Managed service giảm operational overhead — một dạng tiết kiệm chi phí gián tiếp (thời gian đội vận hành) hay bị bỏ qua khi chỉ so sánh giá dịch vụ.

### Nice to know

- Chi tiết công cụ Cost Explorer/Trusted Advisor/Compute Optimizer không phải trọng tâm kiến trúc, thuộc phạm vi vận hành chi phí hàng ngày.

## Decision mindset / decision framework

Khi đề bài dùng cụm "MOST cost-effective", "giảm chi phí mà vẫn đáp ứng yêu cầu":

1. Xác định yêu cầu bắt buộc trước (availability, performance, compliance) — loại các đáp án không đáp ứng yêu cầu dù rẻ hơn.
2. Trong các đáp án còn lại, xét workload có chịu được gián đoạn không → Spot khả thi hay không.
3. Xét workload có ổn định dài hạn không → Reserved/Savings Plans khả thi hay không.
4. Xét dữ liệu có truy cập giảm dần theo thời gian không → S3 Lifecycle khả thi hay không.
5. Xét effort vận hành nếu tự quản lý service → managed service có thể rẻ hơn về tổng chi phí dù giá theo giờ cao hơn.

## Service mapping

| Nhu cầu tối ưu chi phí | Service/tính năng chính | Ghi chú |
|---|---|---|
| Baseline compute ổn định dài hạn | Reserved Instances / Savings Plans | Cam kết 1-3 năm để đổi giá tốt hơn |
| Workload chịu gián đoạn, batch | Spot Instances | Kết hợp Auto Scaling Group Spot fleet |
| Dữ liệu ít truy cập theo thời gian | S3 Lifecycle (Standard → IA → Glacier) | Gần như tự động, ít công sức vận hành |
| Giảm effort vận hành database | RDS/Aurora/DynamoDB (managed) thay vì tự cài đặt trên EC2 | Chi phí per-unit cao hơn nhưng giảm ops effort |
| Giám sát chi phí/tài nguyên dư thừa | CloudWatch metrics (cho right-sizing) | Không phải công cụ cost-specific nhưng cần thiết để right-size đúng |

🧠 **Combination phổ biến trong đề:** "workload production ổn định + phần batch xử lý ban đêm chịu gián đoạn" → Reserved/Savings Plans cho phần production + Spot cho phần batch là combination cost-effective kinh điển, thay vì dùng 1 purchasing option cho toàn bộ.

## Trade-offs

| Yếu tố | Đánh đổi |
|---|---|
| Reserved Instances/Savings Plans | Giá tốt hơn On-Demand nhưng cam kết dài hạn, kém linh hoạt nếu nhu cầu thay đổi |
| Spot Instances | Giá rẻ nhất nhưng có thể bị thu hồi bất kỳ lúc nào, cần workload chịu gián đoạn |
| Managed service | Giảm effort vận hành nhưng chi phí per-unit thường cao hơn self-managed |
| S3 Lifecycle sang storage class lạnh | Giảm chi phí lưu trữ nhưng tăng chi phí/độ trễ khi cần truy xuất lại dữ liệu |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Chọn phương án rẻ nhất nhưng tăng rủi ro vận hành (VD: Spot cho database chính) | Giá là con số dễ so sánh nhất trong đề | "Cost-effective" luôn ngầm định đáp ứng đủ yêu cầu nghiệp vụ trước — phương án rẻ nhưng làm tăng rủi ro downtime/mất dữ liệu không phải đáp án đúng dù giá thấp hơn |
| ❌ Over-provisioning "cho chắc" rồi gọi đó là an toàn chi phí | Tránh rủi ro thiếu tài nguyên nghe như quyết định thận trọng | Đây là lãng phí ngân sách không cần thiết — right-sizing dựa trên CloudWatch metrics mới là cách tiếp cận đúng, không phải "mua dư cho yên tâm" |
| ❌ Bỏ qua chi phí data transfer / NAT Gateway / idle resource khi tính tổng chi phí | Các khoản này nhỏ, dễ bị bỏ qua khi so sánh giá compute/storage chính | Các chi phí ẩn này cộng dồn đáng kể theo thời gian và theo quy mô — một kiến trúc "tối ưu chi phí" thực sự phải rà soát cả các khoản phát sinh này, không chỉ giá niêm yết của service chính |
| ❌ Chỉ so sánh giá theo giờ giữa self-managed và managed service | Giá theo giờ là con số dễ thấy nhất khi so sánh | Tổng chi phí thực tế phải cộng thêm effort vận hành (patching, backup, xử lý sự cố) — self-managed có thể "rẻ hơn" trên giấy tờ nhưng tốn kém hơn khi tính đủ chi phí nhân sự/vận hành |

## Common traps

### ⚠️ Trap: cost optimization đồng nghĩa chọn rẻ nhất
Đây là bẫy trọng tâm của file này. Đáp án rẻ nhất nhưng không đáp ứng yêu cầu (VD: không đủ HA, không đủ hiệu năng) không phải là đáp án đúng — "MOST cost-effective" luôn ngầm định "trong số đáp án đáp ứng đủ yêu cầu".

### ⚠️ Trap: chọn Spot cho workload cần chạy liên tục
Spot Instances có thể bị AWS thu hồi bất kỳ lúc nào khi cần capacity — không phù hợp cho workload không chịu được gián đoạn (VD: database chính, ứng dụng cần uptime cao liên tục).

### ⚠️ Trap: chỉ nhìn giá dịch vụ mà bỏ qua chi phí vận hành
Self-managed trên EC2 có thể rẻ hơn về giá thuê máy nhưng tốn nhiều effort vận hành (patching, backup, scaling) hơn managed service — tổng chi phí thực tế cần tính cả yếu tố này.

## Mini scenarios

🧪 **Scenario 1 — Batch job ban đêm chịu gián đoạn**

**Tình huống:** Cần xử lý batch job phân tích dữ liệu ban đêm, có thể chạy lại nếu bị gián đoạn, không có yêu cầu SLA nghiêm ngặt, mục tiêu là chi phí compute thấp nhất.
**Đáp án đúng:** Spot Instances.
**Vì sao:** Workload batch, chịu được gián đoạn, không yêu cầu SLA nghiêm ngặt — đúng đặc điểm phù hợp với Spot Instances, giúp giảm chi phí compute đáng kể so với On-Demand hay Reserved.

🧪 **Scenario 2 — Dữ liệu log truy cập giảm dần theo thời gian**

**Tình huống:** Công ty lưu log ứng dụng trên S3, log trong 30 ngày đầu được truy vấn thường xuyên để debug, sau đó gần như không ai truy cập nhưng vẫn cần giữ theo yêu cầu compliance trong 5 năm.
**Đáp án đúng:** Cấu hình S3 Lifecycle policy: giữ Standard trong 30 ngày đầu, sau đó tự động chuyển sang Standard-IA, rồi Glacier (hoặc Glacier Deep Archive) cho phần lưu trữ dài hạn.
**Vì sao:** Đây đúng use case của storage lifecycle/tiering — dữ liệu có access pattern giảm dần rõ rệt theo thời gian, tự động hoá bằng Lifecycle giúp tối ưu chi phí mà gần như không tốn công sức vận hành thêm.

🧪 **Scenario 3 — Anti-pattern: chọn Spot cho database production**

**Tình huống:** Để tiết kiệm chi phí, một đội kỹ sư đề xuất chạy database chính của hệ thống production trên EC2 Spot Instance thay vì RDS On-Demand/Reserved.
**Đáp án đúng:** Vẫn nên dùng RDS (On-Demand hoặc Reserved Instance tuỳ mức cam kết) cho database chính — Spot chỉ phù hợp cho phần compute chịu được gián đoạn như batch job, không phải database chính cần uptime liên tục.
**Vì sao đây là anti-pattern cần tránh:** Spot Instance có thể bị AWS thu hồi bất kỳ lúc nào khi thiếu capacity — nếu database chính chạy trên Spot, hệ thống có thể mất kết nối database đột ngột bất kỳ lúc nào, đánh đổi rủi ro downtime nghiêm trọng chỉ để tiết kiệm một phần chi phí compute.

## Key takeaways

- Cost optimization phải cân bằng chi phí, hiệu năng, và effort vận hành — không chỉ tìm phương án rẻ nhất.
- Purchasing option (On-Demand/Reserved/Savings Plans/Spot) cần chọn theo đặc điểm workload, thường kết hợp nhiều loại.
- S3 Lifecycle tự động tối ưu chi phí lưu trữ theo thời gian truy cập.
- Managed service có thể tiết kiệm chi phí tổng thể nhờ giảm effort vận hành, dù giá theo giờ cao hơn.

## Checklist tự ôn

- [ ] Tôi giải thích được vì sao "MOST cost-effective" không có nghĩa là rẻ nhất tuyệt đối.
- [ ] Tôi biết khi nào Spot Instances phù hợp và khi nào không.
- [ ] Tôi hiểu trade-off giữa managed service và self-managed về chi phí.
- [ ] Tôi biết S3 Lifecycle hoạt động theo nguyên tắc nào.

## Xem tiếp / Liên kết liên quan

- [04-performance-efficiency.md](./04-performance-efficiency.md)
- [../02-core-services/01-ec2.md](../02-core-services/01-ec2.md)
- [../02-core-services/03-s3.md](../02-core-services/03-s3.md)
- [../04-comparison-guides/README.md](../04-comparison-guides/README.md)
