# Security Cheatsheet

Tóm tắt siêu nhanh tư duy bảo mật cho SAA-C03: Shared Responsibility Model, IAM, Security Group vs NACL, encryption, KMS, defense in depth. Xem [../03-architecture-patterns/06-security-architecture.md](../03-architecture-patterns/06-security-architecture.md) để đào sâu.

## Mục tiêu sử dụng cheatsheet

- Rà nhanh trách nhiệm AWS vs khách hàng trong Shared Responsibility Model.
- Phân biệt nhanh Security Group vs NACL, KMS vs Secrets Manager vs Parameter Store.
- Nhắc lại tư duy defense in depth và zero public exposure.

## Mục lục

- [Shared Responsibility Model](#shared-responsibility-model)
- [IAM mindset & Least Privilege](#iam-mindset--least-privilege)
- [Security Group vs NACL](#security-group-vs-nacl)
- [Encryption at rest vs in transit](#encryption-at-rest-vs-in-transit)
- [KMS vs Secrets Manager vs Parameter Store](#kms-vs-secrets-manager-vs-parameter-store)
- [Monitoring liên quan security](#monitoring-liên-quan-security)
- [Defense in depth & zero public exposure](#defense-in-depth--zero-public-exposure)
- [Must remember](#must-remember)
- [Common traps / easy confusion](#common-traps--easy-confusion)
- [Exam keywords](#exam-keywords)
- [Quick decision hints](#quick-decision-hints)
- [Checklist tự rà soát](#checklist-tự-rà-soát)

## Shared Responsibility Model

| Phía | Chịu trách nhiệm |
|---|---|
| AWS ("security **of** the cloud") | Hạ tầng vật lý, network nền, hypervisor, tính sẵn sàng của managed service |
| Khách hàng ("security **in** the cloud") | Cấu hình IAM, mã hóa dữ liệu, Security Group/NACL, patch OS (với EC2), phân quyền dữ liệu |

> Với managed service (RDS, Lambda, DynamoDB...), AWS gánh thêm phần OS/patching — nhưng cấu hình access control vẫn luôn là trách nhiệm khách hàng.

## IAM mindset & Least Privilege

- Mỗi user/role/service chỉ nên có quyền tối thiểu cần thiết để hoàn thành nhiệm vụ — không cấp quyền rộng "cho chắc".
- Ưu tiên IAM Role cho service-to-service thay vì access key cứng trong code.
- Group/policy tái sử dụng thay vì gán permission trực tiếp cho từng user.

## Security Group vs NACL

| Tiêu chí | Security Group | NACL |
|---|---|---|
| Phạm vi | Instance-level (ENI) | Subnet-level |
| Trạng thái | Stateful (traffic trả về tự động cho phép) | Stateless (phải khai báo cả inbound/outbound) |
| Rule | Chỉ allow | Allow và deny |
| Thứ tự áp dụng | Đánh giá toàn bộ rule | Đánh giá theo số thứ tự (rule số nhỏ nhất khớp trước) |
| Khi dùng | Kiểm soát truy cập theo instance/ứng dụng | Kiểm soát truy cập theo subnet, cần deny rule tường minh |

## Encryption at rest vs in transit

| Loại | Ý nghĩa | Công cụ phổ biến |
|---|---|---|
| At rest | Mã hóa dữ liệu khi lưu trữ (disk, object) | KMS (S3/EBS/RDS server-side encryption) |
| In transit | Mã hóa dữ liệu khi truyền đi | TLS/SSL, VPN, Direct Connect + MACsec (tùy layer) |

- Encryption at rest không thay thế encryption in transit và ngược lại — đề bài đủ 2 yêu cầu cần đủ 2 cơ chế.

## KMS vs Secrets Manager vs Parameter Store

| Dịch vụ | Vai trò chính | Rotation | Chi phí |
|---|---|---|---|
| KMS | Quản lý encryption key (mã hóa dữ liệu) | Có thể tự động rotate key (khác với rotate secret) | Theo số lượng key/API call |
| Secrets Manager | Lưu secret ứng dụng (DB credential, API key), cần rotation tự động | Rotation tự động tích hợp sẵn (VD: RDS) | Cao hơn Parameter Store |
| Parameter Store | Lưu config value/secret đơn giản, không cần rotation phức tạp | Không có rotation tự động built-in (advanced tier có thể tích hợp) | Thấp, có free tier (Standard) |

Xem chi tiết: [../04-comparison-guides/06-secrets-manager-vs-parameter-store.md](../04-comparison-guides/06-secrets-manager-vs-parameter-store.md).

## Monitoring liên quan security

| Dịch vụ | Vai trò |
|---|---|
| CloudTrail | Audit log: ai gọi API, khi nào, từ IP nào |
| Config | Theo dõi thay đổi cấu hình, đánh giá compliance (VD: phát hiện Security Group mở 0.0.0.0/0) |
| CloudWatch | Alarm/metric cho hoạt động hệ thống (không phải audit log) |

## Defense in depth & zero public exposure

- Nhiều lớp bảo vệ độc lập: network isolation (subnet) → Security Group/NACL → IAM → encryption → monitoring (CloudTrail/Config).
- Chỉ đúng tầng cần thiết mới nên public — VD: chỉ web tier ở public subnet, app/db tier ở private subnet.
- Route table sai (route 0.0.0.0/0 trỏ IGW cho private subnet) có thể vô tình làm lộ resource dù không có public IP — cần Config rule giám sát liên tục.

## Must remember

- Shared Responsibility: AWS lo hạ tầng, khách hàng luôn lo cấu hình access control + mã hóa dữ liệu của mình.
- Security Group = stateful, instance-level, chỉ allow. NACL = stateless, subnet-level, có allow và deny.
- KMS quản lý key mã hóa; Secrets Manager/Parameter Store quản lý secret/config — không dùng lẫn cho nhau.
- Defense in depth nghĩa là không dựa vào 1 lớp bảo vệ duy nhất.

## Common traps / easy confusion

- NACL không tự động cho phép traffic trả về — phải khai báo rule cả 2 chiều (stateless).
- Không có public IP không đồng nghĩa "an toàn tuyệt đối" — vẫn cần kiểm tra route table.
- Secrets Manager và Parameter Store không phải công cụ mã hóa (encryption) — chúng lưu secret/config, còn mã hóa dữ liệu ở tầng lưu trữ dùng KMS.
- 1 KMS key dùng chung cho nhiều team khiến việc revoke quyền của 1 team ảnh hưởng luôn các team khác.

## Exam keywords

- "trách nhiệm của AWS vs khách hàng" → Shared Responsibility Model
- "chỉ allow, theo instance" → Security Group
- "có deny rule, theo subnet" → NACL
- "rotation tự động cho RDS credential" → Secrets Manager
- "chi phí thấp, không cần rotation" → Parameter Store
- "ai đã gọi API" → CloudTrail
- "phát hiện cấu hình sai/public ngoài ý muốn" → Config
- "thu hồi quyền giải mã 1 team" → nhiều customer managed key trong KMS

## Quick decision hints

- Đề hỏi "chặn theo instance, tự động cho traffic trả về" → Security Group.
- Đề hỏi "chặn theo subnet, cần deny cụ thể" → NACL.
- Đề hỏi "secret cần tự rotate" → Secrets Manager. Đề hỏi "config đơn giản, tiết kiệm chi phí" → Parameter Store.
- Đề hỏi "ai gọi, khi nào" → CloudTrail. Đề hỏi "cấu hình có đúng chuẩn không" → Config.

## Checklist tự rà soát

- [ ] Tôi phân biệt được Security Group vs NACL theo cả 4 tiêu chí (phạm vi, stateful, rule, thứ tự).
- [ ] Tôi phân biệt được KMS vs Secrets Manager vs Parameter Store theo đúng vai trò.
- [ ] Tôi phân biệt được CloudTrail vs Config vs CloudWatch cho mục đích bảo mật.
- [ ] Tôi hiểu rõ Shared Responsibility Model áp dụng khác nhau thế nào giữa EC2 và managed service.

## Xem tiếp / Liên kết liên quan

- [01-service-cheatsheet.md](./01-service-cheatsheet.md)
- [06-network-cheatsheet.md](./06-network-cheatsheet.md)
- [../03-architecture-patterns/06-security-architecture.md](../03-architecture-patterns/06-security-architecture.md)
- [README.md](./README.md)
