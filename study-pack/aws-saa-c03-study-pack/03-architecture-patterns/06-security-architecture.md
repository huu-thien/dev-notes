# Security Architecture

Pattern tổng hợp tư duy bảo mật xuyên suốt kiến trúc — không chỉ IAM, mà là nhiều lớp phòng thủ phối hợp (defense in depth).

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

- Hiểu **Shared Responsibility Model** và ranh giới trách nhiệm AWS vs khách hàng.
- Áp dụng **Least Privilege** và **defense in depth** xuyên suốt nhiều lớp kiến trúc.
- Biết phối hợp IAM, Security Group/NACL, KMS, Secrets Manager, logging/auditing thành một kiến trúc bảo mật hoàn chỉnh.

## Practical understanding

### Shared Responsibility Model

**Shared Responsibility Model**: AWS chịu trách nhiệm bảo mật **"of the cloud"** (hạ tầng vật lý, network hạ tầng, hypervisor), khách hàng chịu trách nhiệm bảo mật **"in the cloud"** (cấu hình IAM, dữ liệu, OS-level patching cho EC2, network configuration như Security Group/NACL). Với managed service (RDS, DynamoDB, Lambda), AWS gánh thêm phần trách nhiệm (patching OS/engine), nhưng khách hàng vẫn chịu trách nhiệm cấu hình quyền truy cập và dữ liệu.

### Least Privilege

**Least Privilege** — đã định nghĩa ở [`GLOSSARY.md`](../GLOSSARY.md) — là nguyên tắc cốt lõi áp dụng xuyên suốt: IAM policy chỉ cấp quyền tối thiểu cần thiết, Security Group chỉ mở đúng port/nguồn cần thiết, KMS key policy chỉ cho phép đúng principal cần dùng key.

### Defense in depth

**Defense in depth** là chiến lược dùng **nhiều lớp bảo vệ độc lập**, sao cho nếu 1 lớp bị vượt qua, các lớp còn lại vẫn ngăn được rủi ro. Ví dụ một kiến trúc điển hình:

| Lớp | Cơ chế |
|---|---|
| Network | VPC private subnet, Security Group, NACL (xem [`06-vpc.md`](../02-core-services/06-vpc.md)) |
| Identity | IAM Least Privilege, MFA, role-based access |
| Data | Encryption at rest (KMS), Encryption in transit (TLS) |
| Application | Input validation, API Gateway throttling/authorization |
| Observability | CloudTrail (audit), Config (compliance), CloudWatch (giám sát bất thường) |

🧠 **Exam mindset:** khi đề bài liệt kê nhiều yêu cầu bảo mật (encryption, network isolation, audit...), đáp án đúng thường yêu cầu **kết hợp nhiều lớp** trong bảng trên — nếu đáp án chỉ giải quyết 1 lớp (VD: chỉ IAM policy) trong khi đề nêu nhiều rủi ro khác nhau, đó thường là đáp án chưa đủ.

### Encryption at rest / in transit

Hai khái niệm đã định nghĩa rõ ở GLOSSARY và [`14-kms-secrets-manager-parameter-store.md`](../02-core-services/14-kms-secrets-manager-parameter-store.md) — nhắc lại ở đây trong vai trò một lớp phòng thủ: mã hoá dữ liệu không ngăn được truy cập trái phép hoàn toàn, nhưng giảm thiệt hại nếu dữ liệu bị lộ (attacker có key mới đọc được).

### IAM + SG/NACL + KMS + Secrets Manager + logging/auditing

Một kiến trúc bảo mật hoàn chỉnh phối hợp:

- **IAM**: xác định ai được làm gì (Least Privilege, role thay vì user credentials cứng).
- **Security Group / NACL**: kiểm soát traffic ở tầng network.
- **KMS**: quản lý key mã hoá dữ liệu.
- **Secrets Manager / Parameter Store**: quản lý secret ứng dụng an toàn, có rotation.
- **CloudTrail / Config / CloudWatch**: giám sát, audit, phát hiện bất thường (xem [`13-cloudwatch-cloudtrail-config.md`](../02-core-services/13-cloudwatch-cloudtrail-config.md)).

### Zero public exposure khi không cần thiết

Nguyên tắc: resource không cần truy cập trực tiếp từ Internet thì **không nên đặt trong public subnet hoặc gắn public IP** — dùng private subnet + NAT Gateway (outbound) hoặc VPC Endpoint (truy cập AWS service riêng tư) để giảm bề mặt tấn công (attack surface).

⚠️ **Bẫy hay gặp:** đừng nhầm giữa **secret ứng dụng** (API key, DB password → Secrets Manager/Parameter Store), **configuration** (Config service — theo dõi compliance cấu hình resource), và **encryption key** (KMS — quản lý key mã hoá) — đây là 3 khái niệm/dịch vụ khác nhau dù đều liên quan tới "quản lý thông tin nhạy cảm", đề thi hay đánh vào việc nhầm lẫn vai trò của từng dịch vụ.

## Exam focus

### Must know for exam

- Shared Responsibility Model: AWS lo hạ tầng vật lý, khách hàng lo cấu hình và dữ liệu bên trong.
- Security không chỉ là IAM — phải kết hợp network, data, application, và observability layer.
- Encryption at rest và in transit là hai lớp riêng biệt, cần cả hai cho dữ liệu nhạy cảm.
- Nguyên tắc "không public nếu không cần" — luôn ưu tiên private subnet cho resource không cần truy cập trực tiếp từ Internet.

### Important

- CloudTrail/Config không phải là biện pháp ngăn chặn (preventive) mà là biện pháp phát hiện (detective) — cần kết hợp với biện pháp ngăn chặn (IAM, SG/NACL, KMS).
- MFA và role-based access (thay vì access key cố định) là thực hành bảo mật identity quan trọng.

### Nice to know

- Chi tiết AWS WAF/Shield/GuardDuty thuộc phạm vi mở rộng hơn, sẽ được nhắc kỹ hơn khi cần (không đi sâu ở phần pattern này).

## Decision mindset / decision framework

Khi đề bài yêu cầu "thiết kế kiến trúc bảo mật cho hệ thống":

1. Xác định resource nào thực sự cần public access — mọi resource khác đưa vào private subnet.
2. Áp dụng Least Privilege cho IAM role/policy liên quan.
3. Xác định dữ liệu nhạy cảm cần encryption at rest (KMS) và in transit (TLS).
4. Xác định secret ứng dụng cần Secrets Manager (nếu cần rotation) hoặc Parameter Store (nếu chỉ cần lưu an toàn).
5. Thêm lớp giám sát/audit (CloudTrail, Config, CloudWatch) để phát hiện bất thường sau khi đã có các lớp ngăn chặn.

## Service mapping

| Lớp phòng thủ | Service chính | Vai trò hỗ trợ |
|---|---|---|
| Identity | IAM (Least Privilege, role, MFA) | Cognito nếu cần xác thực người dùng cuối |
| Network | Security Group, NACL, private subnet | VPC Endpoint để tránh traffic qua Internet |
| Data | KMS (encryption at rest) | TLS/ACM (encryption in transit) |
| Application secrets | Secrets Manager (có rotation) | Parameter Store (SecureString, không cần rotation) |
| Observability/audit | CloudTrail (API call audit) | Config (compliance), CloudWatch (giám sát bất thường) |

🧠 **Combination phổ biến trong đề:** yêu cầu "dữ liệu nhạy cảm + không public + có thể điều tra khi có sự cố" luôn cần **tối thiểu 3 service phối hợp**: KMS (encryption) + Security Group/private subnet (network isolation) + CloudTrail (audit) — chọn đáp án chỉ có 1-2 trong số này thường là đáp án thiếu.

## Trade-offs

| Yếu tố | Đánh đổi |
|---|---|
| Nhiều lớp bảo mật (defense in depth) | Tăng độ an toàn nhưng tăng độ phức tạp vận hành và có thể ảnh hưởng nhẹ tới hiệu năng/độ trễ |
| Encryption toàn diện | Tăng bảo mật nhưng thêm chi phí quản lý key và một phần overhead xử lý |
| Least Privilege chặt chẽ | An toàn hơn nhưng cần review/cập nhật policy thường xuyên khi nghiệp vụ thay đổi |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Security = chỉ cấu hình IAM policy chặt chẽ | IAM là dịch vụ "bảo mật" quen thuộc nhất, dễ nghĩ tới đầu tiên | IAM chỉ kiểm soát lớp identity — nếu network vẫn mở public, dữ liệu chưa mã hoá, hoặc không có audit trail, hệ thống vẫn có nhiều lỗ hổng dù IAM đã chặt |
| ❌ Đặt resource vào public subnet vì "cần chia sẻ/truy cập" mà không xét lại có thực sự cần thiết | Public subnet nghe như cách nhanh nhất để cho phép truy cập | Phần lớn truy cập thực tế có thể qua ALB/CloudFront ở tầng biên, còn resource phía sau (database, backend service) không cần public IP — public exposure không cần thiết làm tăng attack surface vô ích |
| ❌ Lẫn lộn vai trò giữa Secrets Manager, Parameter Store, và KMS | Cả ba đều liên quan tới "bảo mật thông tin nhạy cảm" | Secrets Manager quản lý secret có rotation, Parameter Store lưu config/secret không cần rotation phức tạp, còn KMS quản lý encryption key dùng để mã hoá dữ liệu — dùng sai dịch vụ cho đúng nhu cầu (VD: dùng KMS để lưu API key trực tiếp) không đúng thiết kế |
| ❌ Coi CloudTrail/Config là biện pháp ngăn chặn truy cập trái phép | Tên gọi "audit/compliance" nghe như một dạng bảo vệ chủ động | Đây là biện pháp **phát hiện (detective)** — ghi lại sự kiện sau khi đã xảy ra, không tự động chặn hành vi; cần kết hợp với biện pháp ngăn chặn (preventive) như IAM, SG/NACL |

## Common traps

### ⚠️ Trap: nghĩ security chỉ là IAM
Đây là bẫy trọng tâm của file này. IAM chỉ là 1 lớp (identity) trong defense in depth — network (SG/NACL), data (encryption), và observability (CloudTrail/Config) đều là các lớp bắt buộc khác.

### ⚠️ Trap: nghĩ public subnet đồng nghĩa mọi resource bên trong phải public
Đã nhắc ở [`06-vpc.md`](../02-core-services/06-vpc.md) — resource trong public subnet chỉ *có thể* truy cập Internet trực tiếp nếu có public IP và route hợp lệ; việc đặt vào public subnet không bắt buộc phải public.

### ⚠️ Trap: nghĩ CloudTrail/Config là biện pháp ngăn chặn
CloudTrail/Config là biện pháp **phát hiện (detective)** — ghi lại và cảnh báo sau khi sự việc xảy ra, không tự động ngăn chặn hành vi trái phép như IAM policy hay Security Group.

### ⚠️ Trap: nghĩ mã hoá dữ liệu là đủ để bảo mật hoàn toàn
Encryption giảm thiệt hại nếu dữ liệu bị lộ, nhưng không thay thế được kiểm soát truy cập (IAM, Security Group) — cần cả hai lớp phối hợp.

## Mini scenarios

🧪 **Scenario 1 — Hệ thống dữ liệu khách hàng nhạy cảm**

**Tình huống:** Hệ thống xử lý dữ liệu khách hàng nhạy cảm, yêu cầu: dữ liệu phải được mã hoá khi lưu trữ và khi truyền tải, database không được truy cập trực tiếp từ Internet, và phải có khả năng điều tra khi có truy cập bất thường.
**Đáp án đúng:** Database đặt trong private subnet (không public IP), bật encryption at rest bằng KMS cho database, bắt buộc TLS cho kết nối (encryption in transit), IAM role theo Least Privilege cho ứng dụng truy cập database, bật CloudTrail để audit truy cập/API call.
**Vì sao:** Đáp ứng đủ 3 yêu cầu bằng 3 lớp phòng thủ khác nhau — network isolation, encryption 2 chiều, và audit trail — đúng tinh thần defense in depth thay vì chỉ dựa vào 1 biện pháp.

🧪 **Scenario 2 — Ứng dụng cần rotate credential database định kỳ**

**Tình huống:** Ứng dụng backend kết nối tới RDS bằng username/password, yêu cầu bảo mật nội bộ bắt buộc credential phải được xoay vòng (rotate) định kỳ mà không cần sửa code ứng dụng thủ công mỗi lần đổi.
**Đáp án đúng:** Lưu credential trong Secrets Manager với rotation tự động được cấu hình sẵn, ứng dụng lấy credential qua Secrets Manager API tại thời điểm chạy.
**Vì sao:** Đây đúng use case của Secrets Manager (secret cần rotation tự động) — Parameter Store không hỗ trợ rotation built-in phức tạp như vậy, và lưu credential cứng trong code/config là vi phạm nguyên tắc quản lý secret an toàn.

🧪 **Scenario 3 — Anti-pattern: chỉ dựa vào IAM policy chặt để "đảm bảo an toàn"**

**Tình huống:** Một đội kỹ sư thiết kế IAM policy rất chi tiết theo Least Privilege cho toàn bộ ứng dụng, nhưng database vẫn đặt trong public subnet với Security Group mở port 3306 cho `0.0.0.0/0` vì "đã có IAM kiểm soát truy cập rồi".
**Đáp án đúng:** Cần đưa database vào private subnet, giới hạn Security Group chỉ cho phép traffic từ ứng dụng nội bộ (không mở public), IAM policy chỉ là một lớp bổ sung chứ không thay thế được kiểm soát network.
**Vì sao đây là anti-pattern cần tránh:** IAM chỉ kiểm soát ai được gọi AWS API nào — nó không ngăn được việc ai đó trên Internet kết nối trực tiếp tới database qua port đang mở public; đây là lỗ hổng network-layer hoàn toàn độc lập với IAM.

## Key takeaways

- Shared Responsibility Model xác định ranh giới trách nhiệm giữa AWS và khách hàng.
- Security architecture là nhiều lớp phối hợp (defense in depth), không chỉ IAM.
- Encryption at rest và in transit là hai lớp riêng biệt cần áp dụng cùng nhau cho dữ liệu nhạy cảm.
- CloudTrail/Config là biện pháp phát hiện, không thay thế biện pháp ngăn chặn.
- Nguyên tắc "không public nếu không cần" giúp giảm attack surface.

## Checklist tự ôn

- [ ] Tôi giải thích được Shared Responsibility Model bằng ví dụ cụ thể.
- [ ] Tôi liệt kê được ít nhất 4 lớp trong defense in depth.
- [ ] Tôi phân biệt được biện pháp ngăn chặn và biện pháp phát hiện.
- [ ] Tôi biết vì sao security không chỉ là cấu hình IAM.

## Xem tiếp / Liên kết liên quan

- [../02-core-services/06-vpc.md](../02-core-services/06-vpc.md)
- [../02-core-services/14-kms-secrets-manager-parameter-store.md](../02-core-services/14-kms-secrets-manager-parameter-store.md)
- [../02-core-services/13-cloudwatch-cloudtrail-config.md](../02-core-services/13-cloudwatch-cloudtrail-config.md)
- [../01-foundation/02-iam-basics.md](../01-foundation/02-iam-basics.md)
- [../05-exam-drills/README.md](../05-exam-drills/README.md)
