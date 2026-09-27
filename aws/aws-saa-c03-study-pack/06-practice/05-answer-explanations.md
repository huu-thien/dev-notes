# Answer Explanations

Giải thích chi tiết cho toàn bộ 40 câu của [Mini Mock Exam 1](./03-mini-mock-exam-1.md) và [Mini Mock Exam 2](./04-mini-mock-exam-2.md). Chỉ mở file này sau khi đã làm xong và tự chấm cả 2 đề — đọc trước sẽ làm mất giá trị luyện tập.

## Mục tiêu học

- Hiểu rõ vì sao đáp án đúng là "best answer", không chỉ "possible answer".
- Nhận diện lại keyword đã dẫn tới đáp án đúng.
- Biết chính xác file lý thuyết nào cần đọc lại nếu trả lời sai.

## Mục lục

- [Mini Mock Exam 1 — Answer Explanations](#mini-mock-exam-1--answer-explanations)
- [Mini Mock Exam 2 — Answer Explanations](#mini-mock-exam-2--answer-explanations)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Mini Mock Exam 1 — Answer Explanations

### Câu 1 — Đáp án đúng: A

**Vì sao đúng:** Auto Scaling group multi-AZ + ALB tự động phát hiện instance/AZ lỗi và định tuyến traffic sang instance khỏe mạnh mà không cần thao tác thủ công — đúng yêu cầu "tự động", "không cần can thiệp thủ công".

**Vì sao các đáp án còn lại sai:** B chỉ cảnh báo, vẫn cần con người khởi động lại thủ công. C (vertical scaling) không giải quyết single point of failure. D (AMI backup) chỉ giúp khôi phục nhanh hơn, không tự động và vẫn có downtime.

**Trap liên quan:** HA vs Fault Tolerance vs DR — HA đòi hỏi cơ chế tự động, không phải chỉ có khả năng khôi phục.

**Keyword nhận diện:** "tự động", "không cần can thiệp thủ công", "sự cố phần cứng đột ngột".

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/01-high-availability.md](../03-architecture-patterns/01-high-availability.md), [../02-core-services/08-elb-and-auto-scaling.md](../02-core-services/08-elb-and-auto-scaling.md).

### Câu 2 — Đáp án đúng: B

**Vì sao đúng:** S3 là object storage, truy cập qua API/HTTP, không có khái niệm path/folder truyền thống nhưng vẫn phù hợp lưu trữ file ảnh với độ bền cao (11 nines) và chi phí hợp lý.

**Vì sao các đáp án còn lại sai:** A (EBS) chỉ gắn 1 instance, không tối ưu cho truy cập web quy mô lớn qua HTTP. C (FSx Windows) dùng cho SMB file server, không đúng use case object storage đơn giản. D (EFS) là file storage cho shared access, thừa tính năng và chi phí cao hơn không cần thiết cho use case này.

**Trap liên quan:** S3 vs EBS vs EFS vs FSx.

**Keyword nhận diện:** "không cần thao tác file theo kiểu path/folder", "truy cập qua HTTP", "độ bền dữ liệu cao".

**Đọc lại nếu còn yếu:** [../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md](../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md).

### Câu 3 — Đáp án đúng: C

**Vì sao đúng:** EFS hỗ trợ mount đồng thời trên nhiều Linux instance, đúng nghĩa shared file system với đọc/ghi đồng thời.

**Vì sao các đáp án còn lại sai:** A không phải cách dùng chuẩn của S3, thêm độ phức tạp không cần thiết. B sai vì Multi-Attach không phải mặc định cho mọi volume type, và ngay cả khi dùng cũng có giới hạn filesystem cluster-aware riêng, không phải use case chuẩn. D không đồng bộ thời gian thực.

**Trap liên quan:** S3 vs EBS vs EFS vs FSx — bẫy "EBS chia sẻ được nhiều instance".

**Keyword nhận diện:** "15 EC2 instance Linux", "đọc/ghi đồng thời".

**Đọc lại nếu còn yếu:** [../02-core-services/02-ebs-efs-fsx.md](../02-core-services/02-ebs-efs-fsx.md).

### Câu 4 — Đáp án đúng: D

**Vì sao đúng:** Yêu cầu ACID transaction, tránh race condition khi 2 khách hàng đặt trùng ghế — đây là use case kinh điển của relational database.

**Vì sao các đáp án còn lại sai:** A (DynamoDB eventually consistent) không đảm bảo transaction ACID mặc định. B (S3 versioning) không phải cơ chế transaction cho dữ liệu quan hệ. C (ElastiCache) là cache, không phải nguồn dữ liệu chính thức cho transaction quan trọng.

**Trap liên quan:** RDS/Aurora vs DynamoDB.

**Keyword nhận diện:** "transaction ACID", "không xảy ra đặt trùng".

**Đọc lại nếu còn yếu:** [../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md](../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md).

### Câu 5 — Đáp án đúng: A

**Vì sao đúng:** Dữ liệu đơn giản, không cần JOIN, traffic ghi lớn và thất thường → DynamoDB với on-demand phù hợp cả về data model lẫn traffic pattern.

**Vì sao các đáp án còn lại sai:** B/D là relational, không cần thiết và giới hạn write scaling hơn DynamoDB. C (vertical scaling định kỳ) không xử lý được traffic spike thất thường theo thời gian thực.

**Trap liên quan:** RDS/Aurora vs DynamoDB.

**Keyword nhận diện:** "traffic ghi tăng đột biến không dự đoán trước", "không cần JOIN".

**Đọc lại nếu còn yếu:** [../02-core-services/05-dynamodb.md](../02-core-services/05-dynamodb.md).

### Câu 6 — Đáp án đúng: C

**Vì sao đúng:** Multi-AZ cung cấp automatic failover, giải quyết chính xác vấn đề "downtime 20 phút do promote thủ công" mà đề mô tả.

**Vì sao các đáp án còn lại sai:** A (thêm Read Replica) không giải quyết vấn đề failover tự động cho write instance. B (backup) chỉ phục vụ khôi phục dữ liệu. D (chuyển sang DynamoDB) là thay đổi kiến trúc quá lớn không cần thiết khi vấn đề chỉ là thiếu Multi-AZ.

**Trap liên quan:** Multi-AZ vs Read Replica.

**Keyword nhận diện:** "promote Read Replica thủ công", "giảm downtime", "không cần can thiệp thủ công".

**Đọc lại nếu còn yếu:** [../02-core-services/04-rds-aurora.md](../02-core-services/04-rds-aurora.md).

### Câu 7 — Đáp án đúng: C

**Vì sao đúng:** NAT Gateway cho phép outbound-only traffic, đúng yêu cầu "không được có IP công khai" và "không nhận kết nối trực tiếp từ internet".

**Vì sao các đáp án còn lại sai:** A cho traffic 2 chiều, vi phạm yêu cầu bảo mật. B vi phạm trực tiếp yêu cầu "không được có địa chỉ IP công khai". D (VPC Peering) không phải cơ chế ra internet.

**Trap liên quan:** Internet Gateway vs NAT Gateway.

**Keyword nhận diện:** "không được có địa chỉ IP công khai", "không nhận kết nối trực tiếp từ internet".

**Đọc lại nếu còn yếu:** [../02-core-services/06-vpc.md](../02-core-services/06-vpc.md).

### Câu 8 — Đáp án đúng: D

**Vì sao đúng:** CloudFront cache nội dung tĩnh ở edge location toàn cầu, giảm latency và tải origin — đúng công cụ cho đúng vấn đề.

**Vì sao các đáp án còn lại sai:** A không giải quyết vấn đề khoảng cách địa lý. B (Route 53 weighted) chỉ định tuyến DNS, không cache nội dung. C (Global Accelerator) tối ưu cho traffic non-HTTP/TCP-UDP, không phải công cụ chính cho caching nội dung tĩnh.

**Trap liên quan:** Route 53 vs CloudFront vs Global Accelerator.

**Keyword nhận diện:** "người dùng toàn cầu", "nội dung ít thay đổi", "giảm độ trễ", "giảm tải origin".

**Đọc lại nếu còn yếu:** [../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md](../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md).

### Câu 9 — Đáp án đúng: A

**Vì sao đúng:** Đưa SQS vào giữa 2 service decouple giao tiếp, cho phép service A tiếp tục hoạt động dù service B tạm thời quá tải — đúng cơ chế Fault Tolerance qua decoupling.

**Vì sao các đáp án còn lại sai:** B chỉ trì hoãn vấn đề, không giải quyết root cause coupling chặt. C vẫn giữ giao tiếp đồng bộ nên lỗi vẫn lan truyền. D không giải quyết vấn đề kiến trúc.

**Trap liên quan:** HA vs Fault Tolerance — decoupling để chịu lỗi tốt hơn.

**Keyword nhận diện:** "xử lý bất đồng bộ", "giảm sự phụ thuộc trực tiếp".

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/02-fault-tolerance.md](../03-architecture-patterns/02-fault-tolerance.md), [../02-core-services/11-sqs-sns-eventbridge.md](../02-core-services/11-sqs-sns-eventbridge.md).

### Câu 10 — Đáp án đúng: B

**Vì sao đúng:** SNS fanout gửi đồng thời tới nhiều subscriber độc lập — đúng chuẩn cho broadcast tới 3 dịch vụ cùng lúc.

**Vì sao các đáp án còn lại sai:** A sai vì 1 SQS message chỉ được 1 consumer trong nhóm xử lý, không phải cả 3 cùng nhận. C tạo coupling chặt và chậm hơn. D không đúng vai trò của RDS.

**Trap liên quan:** SQS vs SNS vs EventBridge — bẫy "SQS dùng để broadcast".

**Keyword nhận diện:** "gửi đồng thời", "3 dịch vụ", "mỗi dịch vụ xử lý độc lập".

**Đọc lại nếu còn yếu:** [../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md](../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md).

### Câu 11 — Đáp án đúng: C

**Vì sao đúng:** Lambda + S3 event trigger là mô hình event-driven đúng chuẩn cho tác vụ ngắn, tần suất không đều, tối ưu chi phí khi không có traffic.

**Vì sao các đáp án còn lại sai:** A tốn chi phí duy trì server liên tục dù traffic không đều. B (ECS cố định) over-engineering cho tác vụ 2-3 giây. D (EventBridge) không phải nơi xử lý ảnh.

**Trap liên quan:** Lambda vs ECS/Fargate vs EC2.

**Keyword nhận diện:** "tần suất không đều", "tối thiểu hóa chi phí khi không có traffic", "2-3 giây".

**Đọc lại nếu còn yếu:** [../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md](../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md).

### Câu 12 — Đáp án đúng: D

**Vì sao đúng:** API Gateway cung cấp sẵn throttling và API key, đúng chính xác yêu cầu.

**Vì sao các đáp án còn lại sai:** A/B (ALB/NLB) không có tính năng API management như throttling theo API key. C (Route 53) là DNS, không liên quan tới API management.

**Trap liên quan:** API Gateway vs ALB.

**Keyword nhận diện:** "throttling", "API key".

**Đọc lại nếu còn yếu:** [../02-core-services/10-api-gateway.md](../02-core-services/10-api-gateway.md).

### Câu 13 — Đáp án đúng: A

**Vì sao đúng:** CloudTrail ghi lại API call (ai gọi, khi nào, từ IP nào) — đúng công cụ audit trail.

**Vì sao các đáp án còn lại sai:** B (CloudWatch Logs) phù hợp log ứng dụng, không phải audit identity theo mặc định. C (Config) theo dõi thay đổi cấu hình theo thời gian, không phải công cụ chính trả lời "ai" gọi API. D (Inspector) là công cụ quét lỗ hổng, không liên quan.

**Trap liên quan:** CloudWatch vs CloudTrail vs Config.

**Keyword nhận diện:** "tài khoản IAM nào", "thời gian", "địa chỉ IP nguồn".

**Đọc lại nếu còn yếu:** [../02-core-services/13-cloudwatch-cloudtrail-config.md](../02-core-services/13-cloudwatch-cloudtrail-config.md).

### Câu 14 — Đáp án đúng: B

**Vì sao đúng:** Secrets Manager hỗ trợ automatic rotation tích hợp sẵn cho RDS mà không cần thay đổi code ứng dụng.

**Vì sao các đáp án còn lại sai:** A (Parameter Store String) không có rotation tự động built-in. C không an toàn và không tự động rotate. D (KMS) là dịch vụ quản lý key mã hóa, không phải nơi lưu và rotate credential ứng dụng.

**Trap liên quan:** KMS vs Secrets Manager vs Parameter Store.

**Keyword nhận diện:** "rotation tự động", "không cần thay đổi code ứng dụng".

**Đọc lại nếu còn yếu:** [../04-comparison-guides/06-secrets-manager-vs-parameter-store.md](../04-comparison-guides/06-secrets-manager-vs-parameter-store.md).

### Câu 15 — Đáp án đúng: C

**Vì sao đúng:** Workload ổn định trong ít nhất 2 năm là kịch bản kinh điển cho Reserved Instances/Savings Plans, giảm chi phí đáng kể so với On-Demand.

**Vì sao các đáp án còn lại sai:** A (Spot) rủi ro bị thu hồi, không phù hợp workload ổn định 24/7. B không tối ưu chi phí khi đã biết trước nhu cầu dài hạn. D có thể ảnh hưởng khả năng đáp ứng tải.

**Trap liên quan:** Cost optimization — chọn đúng pricing model theo mức độ dự đoán được của workload.

**Keyword nhận diện:** "chạy ổn định", "ít nhất 2 năm", "không thay đổi kiến trúc".

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/05-cost-optimization.md](../03-architecture-patterns/05-cost-optimization.md).

### Câu 16 — Đáp án đúng: D

**Vì sao đúng:** Đây là mô hình defense in depth chuẩn: network isolation theo subnet, chỉ web tier public, Security Group least privilege giữa các tầng.

**Vì sao các đáp án còn lại sai:** A vi phạm yêu cầu "chỉ web tier tiếp xúc internet". B vẫn đặt app/db ở public subnet dù có NACL deny-all (vi phạm zero public exposure ở tầng subnet). C dùng chung 1 Security Group vi phạm nguyên tắc least privilege giữa các tầng.

**Trap liên quan:** Security architecture — defense in depth, không chỉ IAM.

**Keyword nhận diện:** "chỉ web tier tiếp xúc internet", "chỉ được phép giao tiếp với tầng liền kề".

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/06-security-architecture.md](../03-architecture-patterns/06-security-architecture.md).

### Câu 17 — Đáp án đúng: A

**Vì sao đúng:** Lifecycle policy tự động chuyển dữ liệu ít truy cập sang storage class rẻ hơn — đúng chiến lược cost optimization mà vẫn giữ dữ liệu để tuân thủ pháp lý.

**Vì sao các đáp án còn lại sai:** B không tối ưu chi phí. C vi phạm yêu cầu tuân thủ giữ tối thiểu 2 năm. D (EBS) không phải nơi lưu trữ log dài hạn phù hợp, đắt hơn Glacier.

**Trap liên quan:** Cost optimization kết hợp S3 storage class.

**Keyword nhận diện:** "gần như không bao giờ được đọc lại", "tuân thủ pháp lý", "tối ưu chi phí".

**Đọc lại nếu còn yếu:** [../02-core-services/03-s3.md](../02-core-services/03-s3.md), [../03-architecture-patterns/05-cost-optimization.md](../03-architecture-patterns/05-cost-optimization.md).

### Câu 18 — Đáp án đúng: B

**Vì sao đúng:** KMS quản lý encryption key với customer managed key, hỗ trợ key policy riêng theo phòng ban và audit qua CloudTrail.

**Vì sao các đáp án còn lại sai:** A (Secrets Manager) là nơi lưu secret ứng dụng, không phải dịch vụ quản lý encryption key cho S3 ở tầng hạ tầng. C (Parameter Store) tương tự, không phải công cụ chính cho encryption key management. D tốn effort, dễ sai sót, không tận dụng managed service.

**Trap liên quan:** KMS vs Secrets Manager vs Parameter Store.

**Keyword nhận diện:** "kiểm soát quyền sử dụng key riêng cho từng phòng ban", "ghi lại lịch sử dùng key".

**Đọc lại nếu còn yếu:** [../02-core-services/14-kms-secrets-manager-parameter-store.md](../02-core-services/14-kms-secrets-manager-parameter-store.md).

### Câu 19 — Đáp án đúng: C

**Vì sao đúng:** Tác vụ chạy dài (45 phút) vượt giới hạn Lambda, cần toàn quyền kiểm soát runtime — EC2 hoặc ECS/Fargate task theo lịch là lựa chọn phù hợp.

**Vì sao các đáp án còn lại sai:** A vượt quá giới hạn thời gian chạy của Lambda (tối đa 15 phút). B (API Gateway) là API management layer, không phải nơi chạy compute lâu dài. D (SNS) chỉ là cơ chế trigger, không phải nơi thực thi tác vụ.

**Trap liên quan:** Lambda vs ECS/Fargate vs EC2.

**Keyword nhận diện:** "tác vụ nền dài (45 phút)", "toàn quyền kiểm soát runtime".

**Đọc lại nếu còn yếu:** [../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md](../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md).

### Câu 20 — Đáp án đúng: D

**Vì sao đúng:** VPC Peering hoặc Transit Gateway cho phép 2 VPC giao tiếp qua IP private mà không qua internet — đúng chính xác yêu cầu.

**Vì sao các đáp án còn lại sai:** A (CloudFront) là CDN, không phải cơ chế kết nối VPC-to-VPC. B (Direct Connect) là kết nối on-premise tới AWS, không phải giữa 2 VPC AWS. C (Route 53 Resolver) chỉ giải quyết DNS resolution, không tạo route mạng giữa 2 VPC.

**Trap liên quan:** Network connectivity — chọn đúng cơ chế cho đúng mục đích (VPC-to-VPC vs on-premise-to-AWS).

**Keyword nhận diện:** "2 VPC ở 2 tài khoản khác nhau", "IP private", "không đi qua internet".

**Đọc lại nếu còn yếu:** [../02-core-services/06-vpc.md](../02-core-services/06-vpc.md).

## Mini Mock Exam 2 — Answer Explanations

### Câu 1 — Đáp án đúng: A

**Vì sao đúng:** RPO gần bằng 0 và zero downtime chỉ đạt được với Multi-site Active/Active — cả 2 Region cùng xử lý traffic và đồng bộ dữ liệu liên tục.

**Vì sao các đáp án còn lại sai:** B (Pilot Light) và C (Warm Standby) đều có độ trễ failover và RPO không thể gần bằng 0 do replication bất đồng bộ hoặc cần thời gian scale. D (Backup & Restore) có RTO/RPO cao nhất trong 4 pattern.

**Trap liên quan:** DR pattern trade-off theo RTO/RPO.

**Keyword nhận diện:** "gần như zero downtime", "RPO gần bằng 0", "ngân sách không phải ràng buộc chính".

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/07-disaster-recovery.md](../03-architecture-patterns/07-disaster-recovery.md).

### Câu 2 — Đáp án đúng: B

**Vì sao đúng:** Tự động hóa quy trình promote/scale bằng runbook và tăng capacity tối thiểu là cách rút ngắn RTO hợp lý mà chưa cần nhảy thẳng lên Active/Active.

**Vì sao các đáp án còn lại sai:** A tốn kém hơn mức cần thiết ("chưa cần tới Active/Active" theo đề). C (Pilot Light) sẽ làm RTO chậm hơn, ngược hướng yêu cầu. D không giải quyết vấn đề gốc (thao tác thủ công gây chậm).

**Trap liên quan:** DR pattern trade-off — cải thiện RTO trong cùng 1 pattern trước khi nhảy pattern khác.

**Keyword nhận diện:** "RTO phải rút ngắn xuống dưới 5 phút", "chưa cần tới Active/Active".

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/07-disaster-recovery.md](../03-architecture-patterns/07-disaster-recovery.md).

### Câu 3 — Đáp án đúng: C

**Vì sao đúng:** Multi-AZ/Auto Scaling multi-AZ là cơ chế HA trong cùng 1 Region, hoàn toàn không thay thế được DR (khôi phục sau khi mất cả Region).

**Vì sao các đáp án còn lại sai:** A/B sai vì nhầm lẫn HA với DR — HA không xử lý được kịch bản mất toàn bộ Region. D sai lý do — Multi-AZ hoàn toàn đáng tin cậy cho mục đích HA, vấn đề là nó không phải DR.

**Trap liên quan:** HA vs Fault Tolerance vs DR.

**Keyword nhận diện:** "Multi-AZ", "Disaster Recovery đầy đủ" — bẫy đánh đồng 2 khái niệm.

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/01-high-availability.md](../03-architecture-patterns/01-high-availability.md), [../03-architecture-patterns/07-disaster-recovery.md](../03-architecture-patterns/07-disaster-recovery.md).

### Câu 4 — Đáp án đúng: D

**Vì sao đúng:** Đây là ví dụ đúng của defense in depth — mỗi công cụ giải quyết đúng 1 trong 4 yêu cầu (encryption, least privilege, audit, compliance/public exposure detection), không có 1 công cụ nào giải quyết được cả 4.

**Vì sao các đáp án còn lại sai:** A/B/C đều mắc bẫy "chỉ cần 1 công cụ là đủ cho mọi yêu cầu bảo mật" — không đúng tinh thần layered security.

**Trap liên quan:** Security architecture không chỉ là IAM — cần kết hợp nhiều lớp.

**Keyword nhận diện:** 4 yêu cầu riêng biệt (encryption, least privilege, audit, no unintended public exposure).

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/06-security-architecture.md](../03-architecture-patterns/06-security-architecture.md).

### Câu 5 — Đáp án đúng: A

**Vì sao đúng:** 80TB với băng thông giới hạn (>3 tuần qua mạng) là kịch bản kinh điển cho Snowball Edge — vận chuyển vật lý nhanh hơn truyền qua mạng hạn chế.

**Vì sao các đáp án còn lại sai:** B vẫn bị giới hạn bởi băng thông hiện tại. C (DMS) dùng cho migrate database, không phải file data. D (Transfer Acceleration) chỉ tăng tốc phần nào, không giải quyết được giới hạn băng thông gốc cho khối lượng 80TB.

**Trap liên quan:** Migration — online vs offline/bulk migration.

**Keyword nhận diện:** "80TB", "băng thông giới hạn", "hơn 3 tuần — không chấp nhận được".

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/08-migration-and-hybrid.md](../03-architecture-patterns/08-migration-and-hybrid.md).

### Câu 6 — Đáp án đúng: B

**Vì sao đúng:** Direct Connect đáp ứng yêu cầu "ổn định, băng thông cao, độ trễ thấp lâu dài"; VPN làm backup/failover trong lúc chờ Direct Connect — kết hợp đúng cả 2 yêu cầu của đề.

**Vì sao các đáp án còn lại sai:** A (chỉ VPN) không đáp ứng "băng thông cao, độ trễ thấp ổn định" bằng Direct Connect. C (Snowball) là thiết bị chuyển dữ liệu vật lý, không phải kết nối mạng thường trực. D không an toàn/ổn định bằng kết nối dedicated cho production lâu dài.

**Trap liên quan:** Hybrid connectivity không phải lúc nào Direct Connect cũng là đáp án duy nhất — ở đây cần kết hợp cả VPN cho giai đoạn chờ/backup.

**Keyword nhận diện:** "ổn định, băng thông cao, độ trễ thấp", "kết nối backup nhanh chóng thiết lập".

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/08-migration-and-hybrid.md](../03-architecture-patterns/08-migration-and-hybrid.md).

### Câu 7 — Đáp án đúng: C

**Vì sao đúng:** FIFO đảm bảo ordering và exactly-once processing; kết hợp idempotency ở consumer xử lý luôn cả trường hợp retry ở tầng application.

**Vì sao các đáp án còn lại sai:** A/B không giải quyết được vấn đề duplicate xử lý gốc rễ. D (SNS) không phải giải pháp cho vấn đề ordering/duplicate của queue.

**Trap liên quan:** Standard vs FIFO, kết hợp idempotency — async decoupling không tự động giải quyết idempotency.

**Keyword nhận diện:** "xử lý 2 lần", "chỉ được xử lý đúng 1 lần", "giữ đúng thứ tự".

**Đọc lại nếu còn yếu:** [../02-core-services/11-sqs-sns-eventbridge.md](../02-core-services/11-sqs-sns-eventbridge.md), [../05-exam-drills/02-exam-traps.md](../05-exam-drills/02-exam-traps.md).

### Câu 8 — Đáp án đúng: D

**Vì sao đúng:** Thiết kế idempotent (kiểm tra order ID đã xử lý chưa trước khi thực hiện side-effect) là cách đúng đắn để xử lý retry tự động của Lambda mà không gây trùng lặp.

**Vì sao các đáp án còn lại sai:** A làm mất khả năng tự phục hồi khi có lỗi thoáng qua. B/C không giải quyết vấn đề gốc (thiếu idempotency), chỉ né tránh triệu chứng.

**Trap liên quan:** Async/event-driven decoupling không tự động giải quyết idempotency — phải tự thiết kế.

**Keyword nhận diện:** "retry tự động", "invocation trùng lặp cho cùng 1 event".

**Đọc lại nếu còn yếu:** [../02-core-services/09-lambda.md](../02-core-services/09-lambda.md).

### Câu 9 — Đáp án đúng: A

**Vì sao đúng:** Config phù hợp cho compliance/configuration tracking (Security Group), CloudWatch phù hợp cho performance metric — đây là 2 mục tiêu khác nhau đúng cần 2 công cụ khác nhau.

**Vì sao các đáp án còn lại sai:** B/D dùng 1 công cụ cho cả 2 mục tiêu không phù hợp (CloudWatch không đánh giá compliance cấu hình, CloudTrail không theo dõi performance metric). C chỉ giải quyết được 1 nửa yêu cầu.

**Trap liên quan:** CloudWatch vs CloudTrail vs Config.

**Keyword nhận diện:** "tự động gắn cờ non-compliant" (Config), "theo dõi hiệu năng CPU/memory" (CloudWatch).

**Đọc lại nếu còn yếu:** [../02-core-services/13-cloudwatch-cloudtrail-config.md](../02-core-services/13-cloudwatch-cloudtrail-config.md).

### Câu 10 — Đáp án đúng: B

**Vì sao đúng:** Stateless app tier + session dùng chung + ALB/Auto Scaling multi-AZ là pattern chuẩn để loại bỏ single point of failure ở tầng ứng dụng mà không mất request/session.

**Vì sao các đáp án còn lại sai:** A giữ nguyên single point of failure. C chỉ giúp khôi phục sau sự cố, không phải giải pháp real-time. D chỉ trì hoãn vấn đề, không giải quyết gốc rễ.

**Trap liên quan:** High Availability — stateless app tier là điều kiện cần cho HA thực sự hiệu quả.

**Keyword nhận diện:** "single point of failure ở tầng ứng dụng", "không được mất", "không gián đoạn nhận biết được".

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/01-high-availability.md](../03-architecture-patterns/01-high-availability.md).

### Câu 11 — Đáp án đúng: C

**Vì sao đúng:** Cross-Region Read Replica không tự động failover — cần promote thủ công hoặc tự động hóa qua runbook riêng để trở thành instance ghi được độc lập.

**Vì sao các đáp án còn lại sai:** A nhầm lẫn Multi-AZ (cùng Region) với Read Replica khác Region — đây là 2 cơ chế khác nhau hoàn toàn. B/D đánh giá sai khả năng tự động của RDS — không có cơ chế tự động failover cross-Region built-in cho kịch bản này.

**Trap liên quan:** Multi-AZ vs Read Replica, kết hợp DR.

**Keyword nhận diện:** "promote Read Replica ở Region phụ thành primary", "cần thao tác".

**Đọc lại nếu còn yếu:** [../02-core-services/04-rds-aurora.md](../02-core-services/04-rds-aurora.md), [../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md](../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md).

### Câu 12 — Đáp án đúng: D

**Vì sao đúng:** Sửa đúng root cause (route table sai) và thêm Config rule để phát hiện tự động trong tương lai là giải pháp vừa khắc phục vừa phòng ngừa lâu dài.

**Vì sao các đáp án còn lại sai:** A không khắc phục root cause (route sai vẫn còn). B ảnh hưởng toàn bộ VPC, quá rộng. C chặn luôn cả traffic hợp lệ cần thiết, không phải giải pháp cân bằng.

**Trap liên quan:** Public subnet vs public resource — cần đủ điều kiện đúng (route table, IP, SG/NACL) và cần giám sát liên tục bằng Config.

**Keyword nhận diện:** "route 0.0.0.0/0 trỏ tới Internet Gateway", "mang tính phòng ngừa lâu dài".

**Đọc lại nếu còn yếu:** [../02-core-services/06-vpc.md](../02-core-services/06-vpc.md), [../02-core-services/13-cloudwatch-cloudtrail-config.md](../02-core-services/13-cloudwatch-cloudtrail-config.md).

### Câu 13 — Đáp án đúng: A

**Vì sao đúng:** Parameter Store phù hợp cho config value đơn giản với chi phí thấp hơn Secrets Manager, không cần rotation tự động phức tạp — đúng ngân sách hạn chế trong đề.

**Vì sao các đáp án còn lại sai:** B (KMS) là dịch vụ quản lý key, không lưu config value trực tiếp. C không an toàn và khó quản lý theo môi trường. D (Secrets Manager) đắt hơn và có tính năng rotation không cần thiết cho use case này.

**Trap liên quan:** Secrets Manager vs Parameter Store — chọn đúng theo nhu cầu thực tế, không phải "đắt tiền hơn luôn tốt hơn".

**Keyword nhận diện:** "không cần rotation tự động", "ngân sách hạn chế", "tránh chi phí không cần thiết".

**Đọc lại nếu còn yếu:** [../04-comparison-guides/06-secrets-manager-vs-parameter-store.md](../04-comparison-guides/06-secrets-manager-vs-parameter-store.md).

### Câu 14 — Đáp án đúng: B

**Vì sao đúng:** Yêu cầu "không gián đoạn, không mất transaction đang xử lý dở" là mức đảm bảo cao hơn HA thông thường (vốn chấp nhận gián đoạn ngắn khi failover) — đây chính là Fault Tolerance.

**Vì sao các đáp án còn lại sai:** A đánh đồng sai 2 mức độ khác nhau. C không đúng — Fault Tolerance có thể đạt được trên AWS bằng kiến trúc phù hợp (dù tốn kém). D nhầm lẫn Fault Tolerance với DR (DR liên quan tới mất cả Region, không phải AZ).

**Trap liên quan:** HA vs Fault Tolerance vs DR.

**Keyword nhận diện:** "không mất bất kỳ request nào đang xử lý dở", "mức đảm bảo cao hơn giảm downtime thông thường".

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/02-fault-tolerance.md](../03-architecture-patterns/02-fault-tolerance.md).

### Câu 15 — Đáp án đúng: C

**Vì sao đúng:** DMS với continuous replication (CDC) cho phép đồng bộ liên tục cho tới thời điểm cutover, giảm downtime xuống mức tối thiểu đúng yêu cầu online migration.

**Vì sao các đáp án còn lại sai:** A gây downtime lớn (dừng hẳn ứng dụng). B (Snowball) phù hợp offline/bulk transfer dữ liệu tĩnh, không có continuous replication cho database đang ghi liên tục. D chậm và kém tin cậy hơn dùng dịch vụ migration chuyên biệt.

**Trap liên quan:** Migration — online (DMS/CDC) vs offline (Snow Family) migration.

**Keyword nhận diện:** "downtime tối thiểu", "dữ liệu vẫn đang được ghi liên tục".

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/08-migration-and-hybrid.md](../03-architecture-patterns/08-migration-and-hybrid.md).

### Câu 16 — Đáp án đúng: D

**Vì sao đúng:** Global Accelerator không cache nội dung — nó định tuyến traffic qua mạng backbone AWS bằng static anycast IP. Với mục tiêu cache nội dung tĩnh, CloudFront là công cụ đúng.

**Vì sao các đáp án còn lại sai:** A/C sai vì gán nhầm chức năng cache cho Global Accelerator. B sai vì Global Accelerator dùng được cho cả web traffic, không chỉ database — nhưng vẫn không có chức năng cache.

**Trap liên quan:** Route 53 vs CloudFront vs Global Accelerator — bẫy "Global Accelerator là cache layer".

**Keyword nhận diện:** "cache nội dung tĩnh", "giảm tải origin" — đây là mô tả đúng của CloudFront, không phải Global Accelerator.

**Đọc lại nếu còn yếu:** [../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md](../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md).

### Câu 17 — Đáp án đúng: A

**Vì sao đúng:** S3 Lifecycle rule tự động chuyển dữ liệu qua các storage class phù hợp theo thời gian mà không cần quản lý thủ công hàng ngày — đúng yêu cầu "không có nhân sự riêng để quản lý thủ công".

**Vì sao các đáp án còn lại sai:** B vi phạm yêu cầu tuân thủ pháp lý (phải giữ dữ liệu cold). C (chuyển sang EBS) không tối ưu chi phí và không có cơ chế tiering tự động như S3. D không tối ưu chi phí cho phần dữ liệu warm/cold.

**Trap liên quan:** Cost optimization — S3 storage class optimization tự động.

**Keyword nhận diện:** "hot/warm/cold", "không có nhân sự riêng để quản lý thủ công".

**Đọc lại nếu còn yếu:** [../02-core-services/03-s3.md](../02-core-services/03-s3.md), [../03-architecture-patterns/05-cost-optimization.md](../03-architecture-patterns/05-cost-optimization.md).

### Câu 18 — Đáp án đúng: B

**Vì sao đúng:** Scheduled Scaling xử lý phần traffic đã biết trước (giờ cao điểm cố định), kết hợp Target Tracking xử lý biến động còn lại — giải quyết đúng độ trễ phản ứng của reactive scaling thuần túy.

**Vì sao các đáp án còn lại sai:** A vẫn hoàn toàn reactive, chỉ giảm nhẹ độ trễ chứ không giải quyết gốc rễ. C tốn kém không cần thiết cả ngày. D (Spot) không giải quyết vấn đề tốc độ phản ứng của scaling policy.

**Trap liên quan:** Scalability — kết hợp Scheduled Scaling và Target Tracking cho traffic có phần dự đoán được.

**Keyword nhận diện:** "biết trước", "phản ứng scale-out chậm hơn tốc độ tăng traffic thực tế".

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/03-scalability.md](../03-architecture-patterns/03-scalability.md), [../02-core-services/08-elb-and-auto-scaling.md](../02-core-services/08-elb-and-auto-scaling.md).

### Câu 19 — Đáp án đúng: C

**Vì sao đúng:** Nhiều customer managed key với key policy riêng cho từng team cho phép revoke quyền giải mã của 1 team mà không ảnh hưởng team khác dùng key riêng của họ.

**Vì sao các đáp án còn lại sai:** A dùng 1 key chung nên revoke sẽ ảnh hưởng tất cả team. B không đáp ứng yêu cầu mã hóa. D (Secrets Manager) không phải nơi quản lý encryption key cho dữ liệu lưu trữ.

**Trap liên quan:** KMS vs Secrets Manager vs Parameter Store — encryption key management khác với secret storage.

**Keyword nhận diện:** "thu hồi quyền giải mã ngay lập tức cho 1 team", "không ảnh hưởng tới team khác".

**Đọc lại nếu còn yếu:** [../02-core-services/14-kms-secrets-manager-parameter-store.md](../02-core-services/14-kms-secrets-manager-parameter-store.md).

### Câu 20 — Đáp án đúng: D

**Vì sao đúng:** Với RTO 30-45 phút, Warm Standby (đã chạy sẵn ở scale nhỏ) đáp ứng tốt hơn Pilot Light (thường cần thêm thời gian scale từ mức tối thiểu), mà chưa cần tới chi phí của Multi-site Active/Active.

**Vì sao các đáp án còn lại sai:** A tốn kém hơn mức cần thiết cho RTO 30-45 phút. B (Backup & Restore) thường có RTO tính bằng giờ, không đáp ứng được khung 30-45 phút. C sai — 4 pattern DR chuẩn đã đủ bao phủ hầu hết kịch bản, không cần "giải pháp ngoài".

**Trap liên quan:** DR pattern trade-off theo RTO/RPO — chọn đúng pattern theo khung thời gian cụ thể.

**Keyword nhận diện:** "RTO 30-45 phút", "RPO khoảng vài phút", "ngân sách trung bình".

**Đọc lại nếu còn yếu:** [../03-architecture-patterns/07-disaster-recovery.md](../03-architecture-patterns/07-disaster-recovery.md).

## Key takeaways

- Mỗi câu sai đều có 1 nguyên nhân cụ thể: nhầm 2 khái niệm gần giống nhau, bỏ sót keyword, hoặc chọn phương án "possible" thay vì "best".
- Các trap lặp lại nhiều nhất qua cả 2 đề: HA vs Fault Tolerance vs DR, Multi-AZ vs Read Replica, S3 vs EBS vs EFS vs FSx, KMS vs Secrets Manager vs Parameter Store.
- Nếu sai từ 3 câu trở lên trong cùng 1 nhóm trap, nên quay lại đọc kỹ file lý thuyết/comparison guide tương ứng trước khi làm lại đề.

## Checklist tự ôn

- [ ] Tôi đã đối chiếu toàn bộ 40 câu với giải thích và hiểu rõ lý do đúng/sai.
- [ ] Tôi đã liệt kê được các trap mình còn sai nhiều nhất và đọc lại đúng file lý thuyết.
- [ ] Tôi có thể tự giải thích lại logic elimination cho ít nhất 10 câu ngẫu nhiên mà không cần mở lại file này.

## Xem tiếp / Liên kết liên quan

- [03-mini-mock-exam-1.md](./03-mini-mock-exam-1.md)
- [04-mini-mock-exam-2.md](./04-mini-mock-exam-2.md)
- [../05-exam-drills/02-exam-traps.md](../05-exam-drills/02-exam-traps.md)
- [README.md](./README.md)
