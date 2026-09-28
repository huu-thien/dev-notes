# CloudWatch, CloudTrail, and AWS Config

Ba dịch vụ dễ gây nhầm lẫn vì đều liên quan "theo dõi hệ thống" nhưng phục vụ mục đích hoàn toàn khác nhau: **monitoring** (CloudWatch), **audit trail** (CloudTrail), và **configuration compliance** (AWS Config).

## Mục lục

- [Mục tiêu học](#mục-tiêu-học)
- [Practical understanding](#practical-understanding)
- [Decision logic](#decision-logic)
- [Exam focus](#exam-focus)
- [Use cases](#use-cases)
- [Khi nào nên dùng / không nên dùng](#khi-nào-nên-dùng--không-nên-dùng)
- [Anti-patterns / lựa chọn sai thường gặp](#anti-patterns--lựa-chọn-sai-thường-gặp)
- [Common traps](#common-traps)
- [Mini scenarios](#mini-scenarios)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Mục tiêu học

- Phân biệt rõ ba mục đích: giám sát hiệu năng/hoạt động (CloudWatch), ghi lại ai đã làm gì (CloudTrail), và kiểm tra cấu hình có tuân thủ chuẩn hay không (AWS Config).
- Biết dùng đúng dịch vụ cho từng câu hỏi tình huống trong đề thi.

## Practical understanding

### Monitoring vs Logging vs Auditing vs Configuration compliance — 4 mindset khác nhau

🧠 Trước khi đi vào từng dịch vụ, cần tách rõ 4 khái niệm hay bị gộp chung:

| Khái niệm | Câu hỏi trả lời | Dịch vụ đại diện |
|---|---|---|
| **Monitoring** | Hệ thống đang chạy tốt không, ngay bây giờ? | CloudWatch (metrics + alarms) |
| **Logging** | Chi tiết sự kiện/lỗi cụ thể là gì? | CloudWatch Logs |
| **Auditing** | Ai đã làm gì, khi nào, từ đâu? | CloudTrail |
| **Configuration compliance** | Cấu hình resource có đúng chuẩn không, thay đổi ra sao theo thời gian? | AWS Config |

### CloudWatch — monitoring

**Amazon CloudWatch** thu thập **metrics** (số liệu theo thời gian, VD: CPUUtilization, RequestCount), **logs** (CloudWatch Logs — log ứng dụng/hệ thống), và cho phép đặt **alarm** khi metric vượt ngưỡng (VD: trigger Auto Scaling, gửi SNS notification). CloudWatch trả lời câu hỏi: *"Hệ thống đang hoạt động như thế nào ngay bây giờ / theo thời gian?"*

### Metrics vs Logs reasoning

- **Metric**: số liệu dạng time-series, đã được tổng hợp sẵn (VD: CPU% trung bình mỗi phút) — nhẹ, phù hợp để **đặt alarm và phát hiện xu hướng** nhanh.
- **Log**: dữ liệu văn bản chi tiết từng sự kiện/request — nặng hơn, phù hợp để **điều tra nguyên nhân gốc** sau khi đã biết có vấn đề (qua alarm hoặc báo cáo).

🧠 **Exam reasoning:** đề hỏi "phát hiện sớm khi CPU tăng cao" → metric + alarm; đề hỏi "tìm chính xác dòng lỗi nào gây crash ứng dụng" → log. Nhầm 2 khái niệm này là bẫy phổ biến — không dùng log để "phát hiện xu hướng real-time" (quá nặng, không tối ưu) và không dùng metric để "tìm chi tiết lỗi cụ thể" (không có đủ thông tin).

### CloudWatch Alarms mindset

Alarm không chỉ để "biết có vấn đề" — mục tiêu thật sự là **tự động hoá phản ứng** khi metric vượt ngưỡng: trigger Auto Scaling (scale out/in), gửi SNS notification cho đội vận hành, hoặc trigger Lambda để tự khắc phục. Khi đề mô tả "cần hành động tự động khi hiệu năng thay đổi", đáp án luôn xoay quanh CloudWatch Alarm, không phải chỉ xem dashboard thủ công.

### CloudTrail — audit trail

**AWS CloudTrail** ghi lại **API call** được thực hiện trong tài khoản AWS — ai (IAM user/role nào), làm gì (API action), khi nào, từ đâu (IP). Đây là **audit trail** phục vụ điều tra bảo mật, truy vết thay đổi, và compliance. CloudTrail trả lời câu hỏi: *"Ai đã thực hiện hành động gì trên tài khoản AWS này?"*

### CloudTrail audit use cases

✅ Dùng khi: "điều tra ai đã xoá resource X", "audit truy cập trái phép", "chứng minh compliance về việc ai được phép thực hiện hành động gì trên tài khoản".
❌ Không dùng khi: cần biết **hiệu năng hệ thống** (CloudWatch) hoặc **trạng thái cấu hình hiện tại/lịch sử thay đổi** (Config) — CloudTrail chỉ ghi "hành động API", không đánh giá đúng/sai về cấu hình.

### AWS Config — configuration compliance

**AWS Config** theo dõi và ghi lại **lịch sử thay đổi cấu hình** của resource (VD: Security Group rule thay đổi, S3 bucket policy thay đổi) và đánh giá resource có tuân thủ **rule** đã định nghĩa hay không (VD: "mọi EBS volume phải được encrypt"). Config trả lời câu hỏi: *"Cấu hình resource này đang như thế nào, đã thay đổi ra sao theo thời gian, và có tuân thủ chuẩn không?"*

### Config compliance/change tracking use cases

✅ Dùng khi: "kiểm tra liên tục mọi resource có tuân thủ chuẩn bảo mật không (encryption bắt buộc)", "xem cấu hình 1 resource đã thay đổi ra sao qua từng mốc thời gian", "cảnh báo khi có resource lệch chuẩn governance".
❌ Không dùng khi: cần biết **ai** đã thực hiện thay đổi (đó là CloudTrail) hoặc cần **giám sát hiệu năng real-time** (đó là CloudWatch) — Config tập trung vào "trạng thái cấu hình", không phải "danh tính người thực hiện" hay "chỉ số hiệu năng".

## Decision logic

| Câu hỏi cần trả lời | 🧠 Keyword nghĩ ngay tới | Dịch vụ |
|---|---|---|
| Hệ thống có đang hoạt động bình thường không? | "CPU cao", "request latency tăng", "cần alarm tự động" | CloudWatch |
| Ai đã thực hiện hành động này trên tài khoản? | "ai đã xoá/sửa", "audit truy cập", "điều tra bảo mật" | CloudTrail |
| Cấu hình resource có tuân thủ chuẩn không? | "encryption bắt buộc", "compliance rule", "governance" | AWS Config |
| Cấu hình đã thay đổi ra sao theo thời gian? | "lịch sử thay đổi cấu hình", "trạng thái resource tại thời điểm X" | AWS Config |
| Cần debug lỗi ứng dụng cụ thể? | "tìm dòng log lỗi", "stack trace" | CloudWatch Logs |

⚠️ **Bẫy hay gặp:** đề bài đôi khi cần **kết hợp cả 2 dịch vụ** (VD: "ai đã thay đổi Security Group" → CloudTrail, "rule đã thay đổi như thế nào" → Config) — không phải lúc nào cũng chỉ có 1 đáp án đúng duy nhất.

## Exam focus

### Must know for exam

| Dịch vụ | Trả lời câu hỏi | Dữ liệu chính |
|---|---|---|
| CloudWatch | Hệ thống đang hoạt động thế nào? | Metrics, Logs, Alarms |
| CloudTrail | Ai đã làm gì (API call)? | Event history (audit) |
| AWS Config | Cấu hình resource có tuân thủ chuẩn không, thay đổi ra sao? | Configuration history, Compliance rules |

- CloudWatch = performance/operational monitoring theo thời gian thực (metrics/logs/alarms).
- CloudTrail = ghi log API call phục vụ audit và security investigation (không phải công cụ giám sát hiệu năng).
- AWS Config = theo dõi trạng thái cấu hình và đánh giá compliance, không phải công cụ giám sát hiệu năng theo thời gian thực.

### Important

- CloudWatch Alarm có thể trigger hành động tự động (Auto Scaling, SNS notification) dựa trên metric threshold.
- CloudTrail mặc định ghi **management event** (thay đổi cấu hình tài khoản); có thể mở rộng ghi **data event** (VD: truy cập object trong S3) nếu cần chi tiết hơn.
- AWS Config Rule có thể được đặt để tự động đánh giá compliance liên tục, hữu ích cho các yêu cầu governance/compliance dài hạn.

### Nice to know

- Cấu hình chi tiết CloudWatch Logs Insights query hoặc Config remediation action — không cần thuộc lòng cho kỳ thi.

## Use cases

- **CloudWatch**: đặt alarm khi CPUUtilization > 80% để trigger Auto Scaling; theo dõi log lỗi ứng dụng.
- **CloudTrail**: điều tra ai đã xoá 1 S3 bucket quan trọng, khi nào, từ IP nào.
- **AWS Config**: kiểm tra liên tục xem tất cả EBS volume có được encrypt hay không, cảnh báo khi có resource không tuân thủ.

## Khi nào nên dùng / không nên dùng

| Nhu cầu | Nên dùng | Không nên dùng |
|---|---|---|
| Theo dõi hiệu năng, đặt alarm tự động scale | CloudWatch | CloudTrail/Config (không phải mục đích chính) |
| Điều tra ai đã thực hiện hành động gì trên tài khoản | CloudTrail | CloudWatch (không ghi API caller identity chi tiết như CloudTrail) |
| Kiểm tra resource có tuân thủ chuẩn cấu hình (VD: encryption bắt buộc) | AWS Config | CloudWatch/CloudTrail (không đánh giá compliance rule) |
| Xem lịch sử thay đổi cấu hình 1 resource theo thời gian | AWS Config | CloudTrail (ghi API call, không tổng hợp trạng thái cấu hình theo thời gian dễ đọc bằng Config) |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Dùng CloudTrail để monitor performance (CPU, latency, error rate) | CloudTrail cũng "ghi lại hoạt động" nên nghe như giám sát được mọi thứ | CloudTrail chỉ ghi **API call** (ai gọi API nào), không thu thập metric hiệu năng runtime — cần CloudWatch cho mục đích này |
| ❌ Dùng AWS Config như công cụ real-time monitoring | Config cũng "theo dõi" resource nên dễ nhầm là giám sát liên tục như CloudWatch | Config đánh giá **trạng thái cấu hình** theo các lần thay đổi (event-driven khi cấu hình đổi), không phải theo dõi chỉ số hiệu năng liên tục theo giây/phút như CloudWatch metrics |
| ❌ Nhầm log với metric khi thiết kế alarm | Cả hai đều nằm trong CloudWatch nên nghĩ dùng cái nào cũng được | Alarm chỉ hoạt động dựa trên **metric** (số liệu time-series) — muốn alarm dựa trên nội dung log phải dùng CloudWatch Logs Metric Filter để biến log thành metric trước, không alarm trực tiếp trên log thô |
| ❌ Không phân biệt operational troubleshooting với governance/audit khi chọn dịch vụ | Cả hai đều là "tìm hiểu chuyện gì đã xảy ra" | Troubleshooting vận hành (tại sao chậm/lỗi) cần CloudWatch (metrics/logs); governance/audit (ai được phép làm gì, có tuân thủ chuẩn không) cần CloudTrail/Config — dùng nhầm dịch vụ sẽ không tìm ra thông tin cần thiết |

## Common traps

### ⚠️ Trap: CloudWatch vs CloudTrail vs Config
Đây là bẫy phổ biến nhất — nhớ 3 câu hỏi tương ứng: CloudWatch ("đang hoạt động thế nào"), CloudTrail ("ai đã làm gì"), Config ("cấu hình có tuân thủ chuẩn không, thay đổi ra sao").

### ⚠️ Trap: nhầm log với metric
Metric là số liệu dạng time-series (CPU%, request count); log là dữ liệu văn bản chi tiết từng sự kiện. CloudWatch xử lý cả hai nhưng chúng phục vụ mục đích khác nhau (alarm dựa trên metric, điều tra chi tiết dựa trên log).

### ⚠️ Trap: nghĩ CloudTrail thay thế được monitoring
CloudTrail phục vụ audit (ai làm gì), không phải công cụ giám sát hiệu năng thời gian thực — muốn biết hệ thống có đang chậm/lỗi không vẫn cần CloudWatch.

### ⚠️ Trap: nghĩ Config là công cụ giám sát hiệu năng
AWS Config theo dõi trạng thái **cấu hình** (configuration state), không phải hiệu năng runtime (CPU, latency...) — nếu đề hỏi về performance monitoring, đáp án đúng luôn là CloudWatch.

## Mini scenarios

🧪 **Scenario 1 — Security Group bị thay đổi ngoài ý muốn**

**Tình huống:** Một Security Group bị thay đổi ngoài ý muốn, mở port 22 ra 0.0.0.0/0. Cần biết (1) ai đã thực hiện thay đổi, và (2) rule cấu hình đã thay đổi như thế nào theo thời gian.
**Đáp án đúng:** Dùng CloudTrail để tìm ai/API call nào đã thay đổi Security Group; dùng AWS Config để xem lịch sử thay đổi cấu hình của Security Group đó.
**Vì sao:** CloudTrail trả lời "ai đã làm", Config trả lời "cấu hình đã thay đổi ra sao" — hai câu hỏi khác nhau cần hai dịch vụ khác nhau, CloudWatch không phù hợp cho cả hai vì đây không phải vấn đề hiệu năng runtime.

🧪 **Scenario 2 — Governance: đảm bảo mọi EBS volume luôn được encrypt**

**Tình huống:** Đội bảo mật yêu cầu đảm bảo liên tục rằng mọi EBS volume trong tài khoản đều được encrypt, và muốn được cảnh báo tự động ngay khi có volume mới không tuân thủ được tạo ra, mà không cần chờ audit thủ công định kỳ.
**Đáp án đúng:** Tạo AWS Config Rule đánh giá compliance cho điều kiện "EBS volume phải encrypt", kết hợp gửi thông báo (qua SNS) khi phát hiện resource không tuân thủ.
**Vì sao:** Đây là bài toán configuration compliance liên tục theo thời gian thực khi có thay đổi — đúng vai trò cốt lõi của AWS Config, không phải CloudWatch (không đánh giá compliance rule) hay CloudTrail (chỉ ghi API call, không đánh giá đúng/sai về cấu hình).

🧪 **Scenario 3 — Anti-pattern: dùng CloudTrail để tìm nguyên nhân ứng dụng chậm**

**Tình huống:** Ứng dụng web đột nhiên phản hồi chậm vào một khung giờ cụ thể. Đội vận hành mở CloudTrail để tìm nguyên nhân, tìm kiếm các API call bất thường xung quanh thời điểm đó nhưng không tìm ra manh mối liên quan tới hiệu năng.
**Đáp án đúng:** Nên dùng CloudWatch (metrics CPU/latency/request count) để xác định thời điểm và tài nguyên nào có dấu hiệu bất thường, sau đó dùng CloudWatch Logs để tìm chi tiết lỗi/request cụ thể.
**Vì sao đây là anti-pattern cần tránh:** CloudTrail chỉ ghi lại **hành động quản trị qua API** (ai tạo/xoá/sửa resource gì), không thu thập chỉ số hiệu năng runtime như CPU, latency, hay error rate của ứng dụng — dùng sai công cụ khiến quá trình điều tra đi sai hướng và tốn thời gian không cần thiết.

## Key takeaways

- CloudWatch = monitoring (metrics, logs, alarms) — hiệu năng/hoạt động thời gian thực.
- CloudTrail = audit trail — ai đã gọi API nào, khi nào, từ đâu.
- AWS Config = configuration compliance — trạng thái/lịch sử cấu hình, đánh giá tuân thủ rule.
- Ba dịch vụ bổ trợ nhau, không thay thế nhau.

## Checklist tự ôn

- [ ] Tôi nhớ chính xác câu hỏi mà mỗi dịch vụ trả lời.
- [ ] Tôi phân biệt được metric và log trong CloudWatch.
- [ ] Tôi biết khi nào cần CloudTrail thay vì Config và ngược lại.

## Xem tiếp / Liên kết liên quan

- [14-kms-secrets-manager-parameter-store.md](./14-kms-secrets-manager-parameter-store.md)
- [../03-architecture-patterns/06-security-architecture.md](../03-architecture-patterns/06-security-architecture.md)
- [../01-foundation/02-iam-basics.md](../01-foundation/02-iam-basics.md)
