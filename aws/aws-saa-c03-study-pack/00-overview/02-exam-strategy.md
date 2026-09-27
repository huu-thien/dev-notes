# Exam Strategy

Chiến lược làm bài thi SAA-C03: cách đọc đề, loại đáp án sai, nhận diện từ khóa, và quản lý thời gian.

## Mục lục

- [Cấu trúc đề thi (tổng quan)](#cấu-trúc-đề-thi-tổng-quan)
- [Cách đọc đề hiệu quả](#cách-đọc-đề-hiệu-quả)
- [Keyword spotting](#keyword-spotting)
- [Elimination technique](#elimination-technique)
- [Time management](#time-management)
- [Must know for exam](#must-know-for-exam)
- [Common traps](#common-traps)
- [Mini scenario](#mini-scenario)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Cấu trúc đề thi (tổng quan)

> Cần verify lại theo AWS official exam guide mới nhất — số lượng câu hỏi, thời gian, và điểm đậu có thể thay đổi.

Đề thi SAA-C03 gồm câu hỏi trắc nghiệm 1 đáp án và câu hỏi nhiều đáp án (multiple response), thường có khoảng 65 câu trong 130 phút, điểm đậu theo thang scaled score (thường dùng mốc tham chiếu 720/1000). Một số câu là "unscored" dùng để thử nghiệm, không phân biệt được với câu tính điểm — nên xử lý mọi câu như nhau.

## Cách đọc đề hiệu quả

1. Đọc câu hỏi (phần cuối đoạn) trước để biết đề đang hỏi gì, trước khi đọc chi tiết tình huống.
2. Xác định **domain** đang được test (Security / Resilient / High-Performing / Cost-Optimized).
3. Gạch chân (tinh thần) các ràng buộc: "MOST cost-effective", "MOST operationally efficient", "with the LEAST operational overhead", "MINIMUM downtime".
4. Chú ý các ràng buộc phụ dễ bỏ sót: "without changing application code", "using managed services", "in a single Region".

## Keyword spotting

**Keyword spotting** là kỹ thuật nhận diện cụm từ khóa để định hướng domain/service phù hợp.

| Cụm từ trong đề | Gợi ý hướng đến |
|---|---|
| "MOST cost-effective" | Domain 4 — Cost Optimization: Spot, Reserved, S3 lifecycle |
| "MOST operationally efficient" / "LEAST operational overhead" | Ưu tiên managed service / serverless (Lambda, Fargate, Aurora Serverless) |
| "MINIMUM downtime" / "no data loss" | Domain 2 — Resilient Architecture: Multi-AZ, DR strategy |
| "MOST secure" / "encrypt" | Domain 1 — Security: KMS, IAM policy, Security Group/NACL |
| "high throughput" / "low latency" | Domain 3 — High-Performing: caching (ElastiCache, CloudFront), read replica |

## Elimination technique

**Elimination technique**: loại đáp án sai trước khi chọn đáp án đúng, theo thứ tự:

1. Loại đáp án vi phạm ràng buộc kỹ thuật rõ ràng (sai use case của service).
2. Loại đáp án đúng về mặt kỹ thuật nhưng không đáp ứng tiêu chí đề bài (VD: đúng nhưng tốn kém hơn khi đề hỏi "MOST cost-effective").
3. Loại đáp án yêu cầu thay đổi kiến trúc lớn khi đề chỉ cần thay đổi nhỏ (over-engineering).
4. Trong 2 đáp án còn lại có vẻ đều đúng, chọn đáp án bám sát nhất với keyword trong đề.

## Time management

- 130 phút / ~65 câu ≈ trung bình dưới 2 phút/câu.
- Đánh dấu "flag for review" với câu phân vân, làm tiếp, quay lại sau nếu còn thời gian.
- Không dừng quá lâu ở 1 câu — mất thời gian ở câu khó ảnh hưởng cả bài.
- Dành 5-10 phút cuối để rà lại các câu đã flag.

## Must know for exam

- Luôn xác định domain trước khi chọn đáp án.
- Luôn để ý cụm từ ràng buộc ("MOST", "LEAST", "without", "using managed service").
- Ưu tiên managed/serverless service khi đề nhấn mạnh "operational overhead thấp".

## Common traps

### Trap: chọn đáp án "đúng kỹ thuật" nhưng sai tiêu chí đề bài
Một đáp án có thể hoàn toàn khả thi về mặt kỹ thuật nhưng không phải là "MOST" theo tiêu chí đề (cost, performance, operational overhead). Luôn đối chiếu lại với keyword đã xác định.

### Trap: bỏ sót ràng buộc phụ trong đề
Đề dài thường có 1 ràng buộc phụ ẩn ở giữa đoạn (VD: "in a different Region", "without downtime") — bỏ sót sẽ chọn sai dù hiểu đúng service.

## Mini scenario

**Tình huống:** Đề yêu cầu kiến trúc "MOST cost-effective" để lưu trữ log truy cập ít khi đọc lại, cần giữ tối thiểu 1 năm.
**Đáp án đúng:** Đưa dữ liệu vào S3 với lifecycle policy chuyển sang S3 Glacier sau một khoảng thời gian ngắn.
**Vì sao:** Keyword "cost-effective" + "ít khi đọc lại" trỏ thẳng tới storage class rẻ hơn qua lifecycle, thay vì giữ nguyên S3 Standard hoặc dùng EBS.

## Key takeaways

- Luôn đọc câu hỏi trước, xác định domain và keyword trước khi phân tích đáp án.
- Elimination technique giúp thu hẹp từ 4 đáp án xuống 2 trước khi quyết định cuối.
- Quản lý thời gian bằng flag-and-review, không sa đà vào 1 câu khó.

## Checklist tự ôn

- [ ] Tôi có thể liệt kê ít nhất 5 cụm từ khóa thường gặp và domain tương ứng.
- [ ] Tôi hiểu sự khác nhau giữa "đúng kỹ thuật" và "đúng tiêu chí đề bài".
- [ ] Tôi có chiến lược quản lý thời gian rõ ràng cho ngày thi.

## Xem tiếp / Liên kết liên quan

- [03-domain-weight-and-focus.md](./03-domain-weight-and-focus.md)
- [../05-exam-drills/01-common-question-patterns.md](../05-exam-drills/01-common-question-patterns.md)
- [../05-exam-drills/02-exam-traps.md](../05-exam-drills/02-exam-traps.md)
