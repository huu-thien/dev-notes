# Decision Trees

Decision tree dạng câu hỏi Yes/No để chọn nhanh service/pattern đúng khi làm bài thi. Dùng khi đã xác định được pattern câu hỏi nhưng còn phân vân giữa các lựa chọn cụ thể.

## Mục tiêu học

- Có quy trình ra quyết định rõ ràng thay vì đoán.
- Biết caveat quan trọng ở mỗi nhánh quyết định.
- Link nhanh về comparison guide tương ứng để đào sâu nếu cần.

## Mục lục

- [Chọn loại storage](#chọn-loại-storage)
- [Chọn loại database](#chọn-loại-database)
- [Chọn compute model](#chọn-compute-model)
- [Chọn integration/messaging service](#chọn-integrationmessaging-service)
- [Chọn HA/DR pattern](#chọn-hadr-pattern)
- [Chọn secret/config management](#chọn-secretconfig-management)
- [Chọn Route 53 vs CloudFront vs Global Accelerator](#chọn-route-53-vs-cloudfront-vs-global-accelerator)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Chọn loại storage

```
Dữ liệu có cần truy cập kiểu file system (path/folder) không?
├─ Không (chỉ cần lưu/đọc object qua API/HTTP) → S3
└─ Có
   ├─ Cần chia sẻ cho nhiều instance/container cùng lúc?
   │  ├─ Có, Linux/POSIX → EFS
   │  ├─ Có, Windows/SMB → FSx for Windows File Server
   │  └─ Có, HPC workload cần throughput rất cao → FSx for Lustre
   └─ Không, chỉ 1 instance dùng (VD: volume cho database, boot volume) → EBS
```

**Caveat:** EBS Multi-Attach (io1/io2) cho phép nhiều instance cùng gắn 1 volume nhưng rất hiếm gặp trong đề — mặc định coi EBS là single-instance trừ khi đề nói rõ.

**Đào sâu:** [../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md](../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md).

## Chọn loại database

```
Dữ liệu có cần quan hệ (JOIN nhiều bảng) hoặc transaction ACID phức tạp không?
├─ Có → Relational (RDS/Aurora)
│  └─ Cần hiệu năng/HA tốt hơn RDS "classic", tương thích MySQL/PostgreSQL?
│     ├─ Có → Aurora
│     └─ Không, cần engine khác (Oracle/SQL Server/MariaDB) hoặc không cần tối ưu thêm → RDS
└─ Không (key-value/document, không cần JOIN)
   └─ Cần scale ghi/đọc rất lớn, độ trễ thấp ổn định, traffic khó dự đoán?
      ├─ Có → DynamoDB (cân nhắc on-demand nếu traffic thất thường)
      └─ Không rõ / vẫn cần vài query linh hoạt → Xem lại có thực sự cần quan hệ không trước khi chọn DynamoDB
```

**Caveat:** không chọn DynamoDB chỉ vì "muốn serverless" — nếu dữ liệu có quan hệ phức tạp, RDS/Aurora vẫn là đáp án đúng dù DynamoDB nghe "hiện đại" hơn.

**Đào sâu:** [../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md](../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md).

## Chọn compute model

```
Workload có chạy ngắn (giây tới vài phút), event-driven, không cần giữ state giữa các lần chạy?
├─ Có → Lambda
└─ Không (chạy dài, cần giữ state trong process, hoặc cần custom runtime)
   └─ Có cần đóng gói bằng container không?
      ├─ Có
      │  └─ Muốn AWS quản lý luôn phần server bên dưới?
      │     ├─ Có → ECS/EKS on Fargate
      │     └─ Không, cần kiểm soát instance/cluster → ECS/EKS on EC2
      └─ Không, cần toàn quyền kiểm soát OS/kernel/hardware → EC2
```

**Caveat:** "serverless" không phải lúc nào cũng là đáp án tốt nhất — nếu workload chạy dài hơn giới hạn Lambda (15 phút) hoặc cần giữ kết nối/state liên tục, Lambda sẽ bị loại ngay từ đầu.

**Đào sâu:** [../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md](../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md).

## Chọn integration/messaging service

```
Cần định tuyến event từ nhiều nguồn khác nhau (kể cả SaaS) theo rule/pattern?
├─ Có → EventBridge
└─ Không
   └─ Cần gửi đồng thời tới nhiều subscriber (fanout)?
      ├─ Có → SNS (có thể kết hợp SNS→SQS fanout nếu cần buffer cho từng subscriber)
      └─ Không, chỉ cần 1 nhóm consumer xử lý message với buffer/retry →SQS
         └─ Cần giữ đúng thứ tự xử lý và tránh trùng lặp?
            ├─ Có → SQS FIFO
            └─ Không, throughput quan trọng hơn thứ tự → SQS Standard
```

**Caveat:** FIFO không mặc định "tốt hơn" Standard — FIFO giới hạn throughput hơn, chỉ chọn khi đề thực sự yêu cầu ordering/exactly-once.

**Đào sâu:** [../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md](../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md).

## Chọn HA/DR pattern

```
Sự cố cần chịu được là gì?
├─ 1 instance/1 AZ down trong cùng Region → HA pattern (Multi-AZ, ELB + Auto Scaling)
└─ Mất cả Region (thiên tai, outage lớn) → Cần DR strategy, dựa vào RTO/RPO
   ├─ RTO/RPO tính bằng giờ, ngân sách hạn chế → Backup & Restore
   ├─ RTO/RPO tính bằng chục phút, core service luôn chạy sẵn ở mức tối thiểu → Pilot Light
   ├─ RTO/RPO tính bằng vài phút, hệ thống chạy sẵn ở scale nhỏ, sẵn sàng scale lên → Warm Standby
   └─ RTO/RPO gần như bằng 0, chấp nhận chi phí cao nhất → Multi-site Active/Active
```

**Caveat:** RTO/RPO càng nhỏ thì chi phí và độ phức tạp vận hành càng cao — không chọn Multi-site Active/Active nếu đề nhấn "cost-effective" và RTO/RPO không quá khắt khe.

**Đào sâu:** [../03-architecture-patterns/07-disaster-recovery.md](../03-architecture-patterns/07-disaster-recovery.md).

## Chọn secret/config management

```
Giá trị cần lưu là gì?
├─ Encryption key dùng để mã hóa/giải mã dữ liệu → KMS (quản lý key, không lưu secret ứng dụng)
└─ Giá trị ứng dụng cần đọc lúc runtime
   ├─ Là credential có vòng đời cần rotate tự động (VD: DB password) → Secrets Manager
   └─ Là config value/parameter, có thể cần mã hóa nhưng không cần rotation tự động → Parameter Store (SecureString nếu cần mã hóa)
```

**Caveat:** Parameter Store SecureString vẫn dùng KMS để mã hóa bên dưới — không có nghĩa Parameter Store "không an toàn", chỉ là thiếu tính năng rotation tự động built-in như Secrets Manager.

**Đào sâu:** [../04-comparison-guides/06-secrets-manager-vs-parameter-store.md](../04-comparison-guides/06-secrets-manager-vs-parameter-store.md).

## Chọn Route 53 vs CloudFront vs Global Accelerator

```
Vấn đề cần giải quyết là gì?
├─ Cần quyết định trả về địa chỉ/endpoint nào (routing policy, failover, health check) → Route 53
├─ Cần cache nội dung gần người dùng để giảm latency/tải origin (HTTP/HTTPS) → CloudFront
└─ Cần cải thiện performance/availability cho traffic non-HTTP hoặc TCP/UDP qua static anycast IP → Global Accelerator
```

**Caveat:** 3 dịch vụ này thường phối hợp với nhau (VD: Route 53 trỏ tới CloudFront distribution), không phải luôn luôn thay thế lẫn nhau — đề thi thường hỏi dịch vụ nào là **thành phần chính** giải quyết vấn đề cụ thể, không phải cả 3 loại trừ nhau.

**Đào sâu:** [../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md](../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md).

## Key takeaways

- Decision tree chỉ hiệu quả khi đã xác định đúng non-functional requirement trọng tâm của câu hỏi (xem [01-common-question-patterns.md](./01-common-question-patterns.md)).
- Mỗi cây quyết định đều có ít nhất 1 caveat quan trọng — đọc kỹ caveat trước khi áp dụng máy móc.
- Khi đề cho nhiều ràng buộc cùng lúc, đi qua cây quyết định theo đúng thứ tự câu hỏi, không nhảy cóc.

## Checklist tự ôn

- [ ] Tôi có thể tự vẽ lại cả 7 decision tree mà không cần xem file.
- [ ] Tôi nhớ được caveat quan trọng của từng cây.
- [ ] Tôi áp dụng decision tree đúng cho ít nhất 3 câu hỏi mẫu mỗi loại.

## Xem tiếp / Liên kết liên quan

- [01-common-question-patterns.md](./01-common-question-patterns.md)
- [02-exam-traps.md](./02-exam-traps.md)
- [04-last-minute-revision.md](./04-last-minute-revision.md)
- [../04-comparison-guides/README.md](../04-comparison-guides/README.md)
- [README.md](./README.md)
