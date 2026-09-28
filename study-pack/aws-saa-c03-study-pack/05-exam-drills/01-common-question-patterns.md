# Common Question Patterns

Tổng hợp các dạng câu hỏi lặp lại trong đề thi SAA-C03, cách đề thường mô tả, và cách xử lý nhanh.

## Mục tiêu học

- Nhận diện được dạng câu hỏi ngay khi đọc đề, không cần đọc hết mọi chi tiết.
- Phân biệt functional requirement và non-functional requirement trong đề.
- Biết loại phương án sai theo pattern, không chỉ theo trực giác.

## Mục lục

- [Pattern 1: Chọn kiến trúc đáp ứng HA](#pattern-1-chọn-kiến-trúc-đáp-ứng-ha)
- [Pattern 2: Chọn giải pháp cost-effective nhất](#pattern-2-chọn-giải-pháp-cost-effective-nhất)
- [Pattern 3: Chọn dịch vụ managed phù hợp nhất](#pattern-3-chọn-dịch-vụ-managed-phù-hợp-nhất)
- [Pattern 4: Chọn giải pháp giảm operational overhead](#pattern-4-chọn-giải-pháp-giảm-operational-overhead)
- [Pattern 5: Chọn giải pháp secure nhất nhưng vẫn practical](#pattern-5-chọn-giải-pháp-secure-nhất-nhưng-vẫn-practical)
- [Pattern 6: Chọn storage/database đúng theo access pattern](#pattern-6-chọn-storagedatabase-đúng-theo-access-pattern)
- [Pattern 7: Chọn integration pattern cho decoupling/fanout/event routing](#pattern-7-chọn-integration-pattern-cho-decouplingfanoutevent-routing)
- [Pattern 8: Chọn DR strategy theo RTO/RPO](#pattern-8-chọn-dr-strategy-theo-rtorpo)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Pattern 1: Chọn kiến trúc đáp ứng HA

**Đề thường mô tả:** hệ thống hiện tại chỉ chạy 1 AZ/1 instance, yêu cầu "highly available", "survive an AZ failure", "no single point of failure".

**Keyword thường gặp:** "Multi-AZ", "highly available", "survive the failure of an Availability Zone", "auto-recover".

**Functional vs non-functional:** functional requirement là ứng dụng vẫn chạy đúng chức năng; non-functional requirement (trọng tâm câu hỏi) là khả năng chịu lỗi khi 1 AZ down.

**Cách loại phương án sai:** loại đáp án chỉ dùng 1 AZ, loại đáp án dựa vào backup/snapshot (không phải HA), loại đáp án chỉ scale theo chiều dọc (không giải quyết single point of failure).

**Đọc lại nếu yếu:** [../03-architecture-patterns/01-high-availability.md](../03-architecture-patterns/01-high-availability.md), [../02-core-services/08-elb-and-auto-scaling.md](../02-core-services/08-elb-and-auto-scaling.md).

## Pattern 2: Chọn giải pháp cost-effective nhất

**Đề thường mô tả:** khối lượng công việc ổn định/dự đoán được hoặc dữ liệu ít truy cập, đề hỏi "MOST cost-effective".

**Keyword thường gặp:** "MOST cost-effective", "minimize cost", "infrequently accessed", "steady-state usage", "reduce storage cost".

**Functional vs non-functional:** functional là vẫn lưu/xử lý được dữ liệu; non-functional (trọng tâm) là chi phí thấp nhất trong các phương án khả thi.

**Cách loại phương án sai:** loại đáp án đúng về kỹ thuật nhưng đắt hơn (On-Demand khi workload dự đoán được nên dùng Reserved/Savings Plans; S3 Standard khi dữ liệu ít truy cập nên dùng lifecycle sang storage class rẻ hơn).

**Đọc lại nếu yếu:** [../03-architecture-patterns/05-cost-optimization.md](../03-architecture-patterns/05-cost-optimization.md).

## Pattern 3: Chọn dịch vụ managed phù hợp nhất

**Đề thường mô tả:** đội ngũ nhỏ, không muốn tự quản lý hạ tầng, muốn AWS lo phần vận hành.

**Keyword thường gặp:** "fully managed", "without managing servers", "minimal administrative effort".

**Functional vs non-functional:** functional là vẫn cần chạy đúng loại workload (relational DB, container, v.v.); non-functional (trọng tâm) là mức độ AWS quản lý thay cho người dùng.

**Cách loại phương án sai:** loại đáp án self-managed trên EC2 khi đề yêu cầu managed; giữa các managed service, chọn service quản lý nhiều nhất phù hợp với yêu cầu (VD: Aurora Serverless thay vì tự quản lý RDS instance sizing).

**Đọc lại nếu yếu:** [../02-core-services/04-rds-aurora.md](../02-core-services/04-rds-aurora.md), [../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md](../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md).

## Pattern 4: Chọn giải pháp giảm operational overhead

**Đề thường mô tả:** đề nhấn mạnh nhóm vận hành nhỏ, muốn giảm việc patch/scale/quản lý server thủ công.

**Keyword thường gặp:** "LEAST operational overhead", "serverless", "without provisioning or managing servers".

**Functional vs non-functional:** functional là xử lý được event/traffic; non-functional (trọng tâm) là giảm công sức vận hành, không phải giảm chi phí (hai tiêu chí có thể khác nhau).

**Cách loại phương án sai:** loại đáp án yêu cầu tự patch OS, tự quản lý capacity, tự viết auto scaling logic khi có sẵn managed/serverless option (Lambda, Fargate, DynamoDB on-demand).

**Đọc lại nếu yếu:** [../02-core-services/09-lambda.md](../02-core-services/09-lambda.md), [../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md](../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md).

## Pattern 5: Chọn giải pháp secure nhất nhưng vẫn practical

**Đề thường mô tả:** yêu cầu bảo mật (encryption, least privilege, hạn chế public exposure) nhưng vẫn phải giữ ứng dụng hoạt động bình thường.

**Keyword thường gặp:** "MOST secure", "least privilege", "encrypt data at rest/in transit", "without exposing to the internet".

**Functional vs non-functional:** functional là ứng dụng/service vẫn truy cập được lẫn nhau; non-functional (trọng tâm) là mức độ bảo mật đạt được mà không phá vỡ chức năng.

**Cách loại phương án sai:** loại đáp án "an toàn tuyệt đối" nhưng làm hỏng chức năng (chặn hết traffic); loại đáp án chỉ dùng 1 lớp bảo mật khi đề ngụ ý cần defense in depth (VD: chỉ Security Group mà bỏ qua IAM policy hoặc mã hóa).

**Đọc lại nếu yếu:** [../03-architecture-patterns/06-security-architecture.md](../03-architecture-patterns/06-security-architecture.md), [../02-core-services/14-kms-secrets-manager-parameter-store.md](../02-core-services/14-kms-secrets-manager-parameter-store.md).

## Pattern 6: Chọn storage/database đúng theo access pattern

**Đề thường mô tả:** mô tả cách dữ liệu được truy cập (shared giữa nhiều instance, key-value, cần JOIN, ghi rất nhiều, đọc nhiều hơn ghi).

**Keyword thường gặp:** "shared file system", "multiple EC2 instances need to access the same files", "key-value", "relational", "massive write throughput".

**Functional vs non-functional:** functional là lưu và truy xuất được dữ liệu; non-functional (trọng tâm) là access pattern cụ thể (shared/single instance, quan hệ hay phi quan hệ, đọc hay ghi nhiều).

**Cách loại phương án sai:** loại EBS khi đề cần shared access nhiều instance (EBS chỉ gắn 1 instance tại 1 thời điểm, trừ Multi-Attach io1/io2 ít gặp); loại DynamoDB khi cần JOIN/transaction quan hệ phức tạp; loại S3 khi cần shared POSIX file system (nên dùng EFS).

**Đọc lại nếu yếu:** [../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md](../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md), [../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md](../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md).

## Pattern 7: Chọn integration pattern cho decoupling/fanout/event routing

**Đề thường mô tả:** hệ thống có nhiều thành phần cần giao tiếp bất đồng bộ, một sự kiện cần gửi tới nhiều consumer, hoặc cần định tuyến event theo điều kiện.

**Keyword thường gặp:** "decouple", "buffer requests", "fan-out to multiple subscribers", "route events based on content", "asynchronous processing".

**Functional vs non-functional:** functional là message/event tới được đích; non-functional (trọng tâm) là mô hình giao tiếp (1-1 buffer, 1-nhiều broadcast, hay routing theo rule).

**Cách loại phương án sai:** loại SNS khi đề cần buffer/retry có kiểm soát (SNS không lưu message như queue); loại SQS khi đề cần gửi đồng thời tới nhiều subscriber (SQS là 1 consumer nhóm, không phải fanout); loại EventBridge khi đề chỉ cần buffer đơn giản giữa 2 thành phần (over-engineering).

**Đọc lại nếu yếu:** [../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md](../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md).

## Pattern 8: Chọn DR strategy theo RTO/RPO

**Đề thường mô tả:** đề cho biết RTO/RPO cụ thể (hoặc mô tả bằng lời: "phải khôi phục trong vài phút", "chấp nhận mất vài giờ dữ liệu") và yêu cầu chọn DR strategy phù hợp chi phí.

**Keyword thường gặp:** "recovery time objective", "recovery point objective", "minimize downtime", "cost-effective disaster recovery".

**Functional vs non-functional:** functional là có thể khôi phục hệ thống ở Region khác; non-functional (trọng tâm) là tốc độ khôi phục (RTO) và độ mất dữ liệu chấp nhận được (RPO) so với chi phí.

**Cách loại phương án sai:** loại Backup & Restore khi RTO/RPO yêu cầu rất thấp (phút); loại Multi-site Active/Active khi đề nhấn "cost-effective" và RTO/RPO không quá khắt khe (over-engineering, tốn kém không cần thiết).

**Đọc lại nếu yếu:** [../03-architecture-patterns/07-disaster-recovery.md](../03-architecture-patterns/07-disaster-recovery.md).

## Key takeaways

- Mỗi pattern câu hỏi có 1 non-functional requirement trọng tâm — xác định đúng nó trước khi đọc đáp án.
- Loại phương án theo pattern (sai use case, sai tiêu chí, over-engineering) nhanh hơn là so sánh cả 4 đáp án cùng lúc.
- Nếu không chắc pattern nào, quay lại comparison guide hoặc pattern file tương ứng thay vì đoán.

## Checklist tự ôn

- [ ] Tôi nhận diện được cả 8 pattern chỉ qua keyword trong đề.
- [ ] Tôi phân biệt được functional requirement và non-functional requirement trong ít nhất 5 đề mẫu.
- [ ] Tôi biết chính xác file nào cần đọc lại cho từng pattern nếu làm sai.

## Xem tiếp / Liên kết liên quan

- [02-exam-traps.md](./02-exam-traps.md)
- [03-decision-trees.md](./03-decision-trees.md)
- [../00-overview/02-exam-strategy.md](../00-overview/02-exam-strategy.md)
- [README.md](./README.md)
