# Last-Minute Revision

Ôn tập rút gọn dành cho 1-2 ngày trước kỳ thi, và checklist nhanh cho 30-60 phút cuối trước khi vào phòng thi. Không đọc lesson chi tiết ở giai đoạn này — chỉ rà lại điểm dễ quên.

## Mục tiêu học

- Có 1 checklist duy nhất để rà soát trước ngày thi, không cần lật nhiều file.
- Nhớ lại chiến lược làm bài đã học ở `02-exam-strategy.md` dưới dạng rút gọn.
- Biết chính xác nên đọc gì trong 30-60 phút cuối nếu còn thời gian.

## Mục lục

- [Must-remember (tối thiểu phải nhớ)](#must-remember-tối-thiểu-phải-nhớ)
- [Các cặp dễ nhầm phải ôn lại](#các-cặp-dễ-nhầm-phải-ôn-lại)
- [Checklist rà soát nhanh](#checklist-rà-soát-nhanh)
- [Chiến lược đọc câu hỏi](#chiến-lược-đọc-câu-hỏi)
- [Chiến lược phân bổ thời gian](#chiến-lược-phân-bổ-thời-gian)
- [Khi nào nên mark for review](#khi-nào-nên-mark-for-review)
- [Lỗi tư duy phổ biến cần tránh](#lỗi-tư-duy-phổ-biến-cần-tránh)
- [Link đọc nhanh trong 30-60 phút cuối](#link-đọc-nhanh-trong-30-60-phút-cuối)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Must-remember (tối thiểu phải nhớ)

- 4 domain chính: Design Resilient Architectures, Design High-Performing Architectures, Design Secure Applications and Architectures, Design Cost-Optimized Architectures.
- Managed/serverless service thường được ưu tiên khi đề nhấn "operational overhead thấp" — nhưng không phải lúc nào cũng đúng, vẫn phải đối chiếu với yêu cầu kỹ thuật cụ thể.
- HA ≠ Fault Tolerance ≠ DR — ba mức độ chịu lỗi khác nhau, xem lại nếu còn mơ hồ.
- Backup không phải là HA. HA không phải là DR.
- Multi-AZ (HA) ≠ Read Replica (read scaling) ≠ DynamoDB partition scaling (read+write scaling tự động).

> Cần verify lại theo AWS official exam guide mới nhất — trọng số domain và cấu trúc đề có thể thay đổi theo thời gian.

## Các cặp dễ nhầm phải ôn lại

Rà nhanh từng cặp dưới đây — nếu còn phân vân cặp nào, mở [02-exam-traps.md](./02-exam-traps.md) đúng mục đó:

- Security Group vs NACL
- Internet Gateway vs NAT Gateway
- S3 vs EBS vs EFS vs FSx
- Multi-AZ vs Read Replica
- RDS/Aurora vs DynamoDB
- Lambda vs ECS/Fargate vs EC2
- API Gateway vs ALB
- SQS vs SNS vs EventBridge
- CloudWatch vs CloudTrail vs Config
- KMS vs Secrets Manager vs Parameter Store
- HA vs Fault Tolerance vs DR
- Route 53 vs CloudFront vs Global Accelerator

## Checklist rà soát nhanh

- [ ] Tôi phân biệt được cả 12 cặp trap ở trên trong vòng vài giây mỗi cặp.
- [ ] Tôi nhớ 4 domain chính và tỷ trọng tương đối của từng domain.
- [ ] Tôi nhớ ít nhất 5 cụm keyword thường gặp và domain/service tương ứng.
- [ ] Tôi có chiến lược thời gian rõ ràng (không dừng quá lâu ở 1 câu).
- [ ] Tôi biết mình sẽ làm gì khi gặp câu hoàn toàn không chắc (loại trừ + đoán có căn cứ, không bỏ trống).

## Chiến lược đọc câu hỏi

1. Đọc câu hỏi (thường ở cuối đoạn) trước để biết đề đang hỏi gì.
2. Xác định domain và non-functional requirement trọng tâm (cost / performance / security / operational overhead / availability).
3. Gạch chân tinh thần các từ khóa ràng buộc: "MOST", "LEAST", "without", "using managed service".
4. Đọc 4 đáp án, loại theo elimination technique trước khi chọn đáp án cuối.

Xem chi tiết: [../00-overview/02-exam-strategy.md](../00-overview/02-exam-strategy.md).

## Chiến lược phân bổ thời gian

- ~65 câu / 130 phút ≈ dưới 2 phút/câu, nhưng đừng chia đều máy móc — câu dễ làm nhanh để dồn thời gian cho câu khó.
- Câu phân vân: chọn phương án khả dĩ nhất, đánh dấu "flag for review", đi tiếp.
- Dành 5-10 phút cuối để rà lại các câu đã flag, không mở câu mới trong giai đoạn này.
- Không bỏ trống câu nào — trắc nghiệm không trừ điểm khi sai.

## Khi nào nên mark for review

- Câu cần đọc lại 2 lần vẫn chưa chắc chắn 100%.
- Câu có 2 đáp án đều "nghe hợp lý" và cần thêm thời gian so sánh.
- Câu dùng thuật ngữ/tính năng lạ (ít gặp trong quá trình ôn) — đánh dấu, làm tiếp, quay lại nếu còn thời gian thay vì đoán vội.

## Lỗi tư duy phổ biến cần tránh

- Chọn đáp án "đúng kỹ thuật" nhưng không đúng tiêu chí đề (VD: đúng nhưng không phải "MOST cost-effective").
- Bỏ sót ràng buộc phụ nằm giữa đoạn đề (VD: "without downtime", "in a different Region").
- Mặc định "serverless/managed luôn là đáp án đúng" mà không đối chiếu yêu cầu kỹ thuật thực tế.
- Nhầm lẫn giữa các khái niệm gần giống nhau (xem lại [02-exam-traps.md](./02-exam-traps.md)) do đọc lướt thay vì đọc kỹ điều kiện.
- Chọn phương án over-engineering (VD: Multi-site Active/Active khi đề chỉ cần Backup & Restore) vì nghe "an toàn nhất" mà bỏ qua tiêu chí cost/complexity.

## Link đọc nhanh trong 30-60 phút cuối

Nếu chỉ còn 30-60 phút, đọc theo thứ tự này:

1. [02-exam-traps.md](./02-exam-traps.md) — rà lại toàn bộ 14 cụm trap.
2. [03-decision-trees.md](./03-decision-trees.md) — nhắc lại cách ra quyết định nhanh.
3. [../00-overview/02-exam-strategy.md](../00-overview/02-exam-strategy.md) — nhắc lại chiến lược đọc đề và quản lý thời gian.
4. [01-common-question-patterns.md](./01-common-question-patterns.md) — nếu còn thời gian, rà lại 8 pattern câu hỏi.

## Key takeaways

- Giai đoạn cuối không học kiến thức mới — chỉ củng cố lại trap và chiến lược làm bài.
- Ưu tiên rà soát các cặp dễ nhầm hơn là đọc lại lesson chi tiết.
- Quản lý thời gian và elimination technique quan trọng không kém kiến thức service.

## Checklist tự ôn

- [ ] Tôi đã rà lại toàn bộ checklist rà soát nhanh ở trên.
- [ ] Tôi đã đọc lại 02-exam-traps.md ít nhất 1 lần trong 2 ngày trước thi.
- [ ] Tôi tự tin về chiến lược thời gian và cách xử lý câu khó.

## Xem tiếp / Liên kết liên quan

- [02-exam-traps.md](./02-exam-traps.md)
- [03-decision-trees.md](./03-decision-trees.md)
- [../00-overview/02-exam-strategy.md](../00-overview/02-exam-strategy.md)
- [README.md](./README.md)
