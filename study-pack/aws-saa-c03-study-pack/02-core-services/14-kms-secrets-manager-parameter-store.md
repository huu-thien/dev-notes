# KMS, Secrets Manager, and Parameter Store

Ba dịch vụ liên quan bảo mật dữ liệu nhưng phục vụ mục đích khác nhau: **quản lý encryption key** (KMS), **quản lý secret có vòng đời/rotation** (Secrets Manager), và **lưu trữ cấu hình/tham số** (Parameter Store).

## Mục lục

- [Mục tiêu học](#mục-tiêu-học)
- [Practical understanding](#practical-understanding)
- [Decision logic](#decision-logic)
- [Exam focus](#exam-focus)
- [Use cases](#use-cases)
- [Khi nào nên dùng / không nên dùng](#khi-nào-nên-dùng--không-nên-dùng)
- [Bảng so sánh nhanh](#bảng-so-sánh-nhanh)
- [Anti-patterns / lựa chọn sai thường gặp](#anti-patterns--lựa-chọn-sai-thường-gặp)
- [Common traps](#common-traps)
- [Mini scenarios](#mini-scenarios)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Mục tiêu học

- Hiểu **key management** mindset của KMS và vì sao nó khác với việc lưu trữ secret ứng dụng.
- Phân biệt rõ Secrets Manager và Parameter Store — bẫy rất hay gặp trong đề thi.
- Biết chọn đúng dịch vụ cho từng nhu cầu bảo mật cụ thể.

## Practical understanding

### KMS — key management

**AWS KMS (Key Management Service)** quản lý **cryptographic key** dùng để **encryption at rest** cho các service khác (EBS, S3, RDS...). KMS **không lưu trữ secret ứng dụng** (password, API key) theo nghĩa thông thường — vai trò của nó là quản lý và bảo vệ **key** dùng để mã hoá/giải mã dữ liệu.

- **AWS managed keys**: key do AWS tự tạo và quản lý vòng đời, dùng mặc định khi bật encryption cho nhiều service (không cấu hình key policy chi tiết được).
- **Customer managed keys (CMK)**: key do người dùng tạo trong KMS, kiểm soát được key policy, rotation, và quyền sử dụng (least privilege ở cấp key) — phù hợp khi cần kiểm soát chặt hoặc chia sẻ quyền dùng key giữa nhiều account/service cụ thể.
- **Envelope encryption**: mô hình mã hoá phổ biến trong AWS — dữ liệu được mã hoá bằng một **data key**, và data key đó lại được mã hoá bằng **key chính (CMK)** lưu trong KMS. Cách này giúp mã hoá lượng dữ liệu lớn hiệu quả mà vẫn kiểm soát chặt key gốc.

### Key management vs secret lifecycle management

🧠 Đây là phân biệt quan trọng nhất của cả 3 dịch vụ: **KMS quản lý "chìa khoá" (key)**, còn **Secrets Manager quản lý "giá trị bí mật" (secret) cùng vòng đời của nó**.

- **Key management (KMS)**: quản lý ai được phép **dùng key** để mã hoá/giải mã, key được xoay vòng (rotate) như thế nào ở tầng hạ tầng — bản thân key không phải là thứ ứng dụng "biết" hay dùng trực tiếp như password.
- **Secret lifecycle management (Secrets Manager)**: quản lý **giá trị bí mật cụ thể** (VD: chuỗi password thật) — bao gồm tạo, lưu trữ, cấp quyền đọc, và **rotation theo lịch trình nghiệp vụ** (đổi password RDS mỗi 30 ngày).

Hai khái niệm liên quan (Secrets Manager dùng KMS để encrypt secret lưu trữ) nhưng giải quyết 2 bài toán khác nhau — nhầm lẫn giữa chúng là một trong những bẫy phổ biến nhất của nhóm dịch vụ này.

### Encryption at rest mindset

Khi đề thi nhắc "encrypt dữ liệu lưu trữ" (EBS volume, S3 object, RDS storage), tư duy đúng luôn là: **service đó dùng KMS key phía sau để encrypt**, không phải tự ứng dụng tự mã hoá dữ liệu bằng thư viện riêng. KMS là lớp nền tảng chung cho encryption at rest trên hầu hết service AWS — kể cả Secrets Manager và Parameter Store SecureString cũng dùng KMS phía sau, không "tự có" cơ chế mã hoá riêng.

### Secrets Manager — secret với vòng đời

**AWS Secrets Manager** lưu trữ secret (database password, API key, token) và hỗ trợ **rotation** — tự động thay đổi secret theo lịch (VD: đổi password RDS mỗi 30 ngày) mà không cần sửa code ứng dụng thủ công. Secrets Manager tích hợp sẵn rotation cho một số dịch vụ AWS phổ biến (RDS, Redshift...).

### Rotation requirements — khi nào đề bài đang test điều này

Khi đề mô tả: "password/credential phải tự động đổi định kỳ", "compliance yêu cầu xoay vòng secret", "không muốn hardcode credential trong code" → đây là tín hiệu rõ ràng cho **Secrets Manager**, không phải KMS (KMS không quản lý giá trị secret) và cũng không phải Parameter Store thuần (không có cơ chế rotation tích hợp mạnh tương đương, đặc biệt cho database credentials).

### Parameter Store — cấu hình/tham số

**AWS Systems Manager Parameter Store** lưu trữ cấu hình dạng key-value, bao gồm cả secret dạng **SecureString** (được encrypt bằng KMS). Parameter Store phù hợp cho cấu hình ứng dụng (connection string, feature flag, cấu hình môi trường) và không có tính năng rotation tự động tích hợp sẵn như Secrets Manager (`Cần verify lại theo AWS official docs mới nhất` vì AWS có bổ sung khả năng tích hợp rotation qua Lambda tuỳ thời điểm).

### SecureString role — encrypt nhưng không phải rotation

**SecureString** là kiểu tham số của Parameter Store được **encrypt bằng KMS** — vai trò của nó chỉ là bảo vệ **tính bảo mật khi lưu trữ** (dữ liệu không đọc được ở dạng plaintext nếu bị truy cập trái phép), **không** đi kèm cơ chế rotation nghiệp vụ như Secrets Manager. Đây là điểm dễ nhầm: SecureString "được mã hoá" không có nghĩa là "có vòng đời secret được quản lý tự động".

### App config vs secret — ranh giới chọn dịch vụ

🧠 **Exam mindset:** tự hỏi "đây là **cấu hình ứng dụng** (endpoint, feature flag, tham số môi trường) hay **giá trị bí mật cần bảo vệ và xoay vòng** (password, API key, token)?"

- Cấu hình thông thường, ít nhạy cảm, không cần rotation → **Parameter Store** (Standard tier, miễn phí).
- Cấu hình nhạy cảm nhưng không cần rotation tự động phức tạp → **Parameter Store SecureString**.
- Giá trị bí mật cần rotation định kỳ theo nghiệp vụ (đặc biệt database credentials) → **Secrets Manager**.

## Decision logic

| Câu hỏi cần trả lời | Chỉ báo trong đề | Hướng quyết định |
|---|---|---|
| Cần bảo vệ/kiểm soát quyền dùng key mã hoá dữ liệu? | "encrypt at rest", "kiểm soát ai được decrypt" | KMS (customer managed key nếu cần policy tuỳ biến) |
| Cần tự động đổi password/credential định kỳ? | "rotate tự động", "compliance yêu cầu đổi định kỳ" | Secrets Manager |
| Cần lưu cấu hình ứng dụng ít nhạy cảm, chi phí thấp? | "feature flag", "connection string không nhạy cảm" | Parameter Store (Standard) |
| Cần lưu giá trị nhạy cảm nhưng không cần rotation phức tạp, ưu tiên tiết kiệm? | "cấu hình nhạy cảm", "chi phí thấp", không nhắc rotation | Parameter Store SecureString |
| Cần chia sẻ quyền dùng key across account/service có kiểm soát chi tiết? | "chia sẻ key giữa nhiều account", "custom key policy" | KMS customer managed key |

## Exam focus

### Must know for exam

- KMS quản lý **key** dùng để mã hoá dữ liệu — không phải nơi lưu trữ secret ứng dụng dạng "password của tôi là gì".
- Secrets Manager = secret + **rotation tự động** — chọn khi cần thay đổi định kỳ (đặc biệt database credentials).
- Parameter Store = cấu hình/tham số, có hỗ trợ SecureString (encrypt bằng KMS) nhưng **không có rotation tích hợp sẵn** mạnh như Secrets Manager.
- Secrets Manager thường có **chi phí cao hơn** Parameter Store — nếu không cần rotation, Parameter Store (SecureString) là lựa chọn tiết kiệm hơn cho cấu hình nhạy cảm đơn giản.

### Important

- Cả Secrets Manager và Parameter Store SecureString đều dùng KMS phía sau để encrypt — KMS là lớp nền tảng chung, không cạnh tranh trực tiếp với hai dịch vụ kia.
- Least Privilege vẫn áp dụng: quyền đọc secret/parameter phải giới hạn theo IAM policy, không cấp quyền rộng hơn cần thiết.

### Nice to know

- Chi tiết cấu hình Lambda rotation function tùy biến cho Secrets Manager — không cần thuộc lòng cho kỳ thi.

## Use cases

- **KMS**: bật encryption at rest cho EBS volume, S3 bucket, RDS instance bằng customer managed key để kiểm soát quyền dùng key.
- **Secrets Manager**: lưu trữ và tự động xoay vòng password kết nối RDS cho ứng dụng.
- **Parameter Store**: lưu cấu hình môi trường (endpoint URL, feature flag) và một vài giá trị nhạy cảm không cần rotation thường xuyên.

## Khi nào nên dùng / không nên dùng

| Nhu cầu | Nên dùng | Không nên dùng |
|---|---|---|
| Quản lý key mã hoá dữ liệu at rest | KMS | Secrets Manager/Parameter Store (không phải vai trò của chúng) |
| Cần rotation tự động cho secret (đặc biệt DB credentials) | Secrets Manager | Parameter Store (không có rotation tích hợp mạnh tương đương) |
| Lưu cấu hình ứng dụng, ít nhạy cảm hoặc không cần rotation | Parameter Store | Secrets Manager (chi phí cao hơn không cần thiết) |
| Cần chia sẻ quyền dùng key mã hoá across account/service có kiểm soát | KMS customer managed key | AWS managed key (không tùy biến policy được) |

## Bảng so sánh nhanh

| Tiêu chí | KMS | Secrets Manager | Parameter Store |
|---|---|---|---|
| Vai trò chính | Quản lý cryptographic key | Quản lý secret + rotation | Lưu cấu hình/tham số (kèm SecureString) |
| Rotation tự động | Không áp dụng (quản lý key, không phải secret) | Có, tích hợp sẵn cho nhiều AWS service | Hạn chế / cần tự cấu hình thêm |
| Chi phí | Theo số key + API call | Cao hơn (theo secret + API call) | Thấp hơn (tier miễn phí rộng) |
| Encryption | Là nền tảng encryption cho service khác | Dùng KMS phía sau | Dùng KMS cho SecureString |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Lưu app secret (password, API key) "bằng KMS" theo kiểu tự mã hoá thủ công trong code | KMS nghe như dịch vụ bảo mật cao nhất, có vẻ dùng cho mọi thứ nhạy cảm | KMS chỉ quản lý **key**, không phải kho lưu trữ secret có sẵn API để "get secret theo tên" như Secrets Manager/Parameter Store — tự làm vậy nghĩa là tự xây lại toàn bộ lớp lưu trữ + quản lý quyền truy cập, tốn công và dễ sai |
| ❌ Dùng Parameter Store khi đề bài nhấn mạnh automatic rotation cho database credentials | Parameter Store "cũng lưu SecureString, cũng encrypt được" | Parameter Store không có cơ chế rotation tích hợp sẵn mạnh như Secrets Manager (đặc biệt cho RDS) — chọn nó khi đề yêu cầu rotation là chọn nhầm dịch vụ dù kỹ thuật vẫn "lưu được" giá trị |
| ❌ Nhầm "encryption service" (KMS) với "secret storage service" (Secrets Manager/Parameter Store) | Cả 3 đều liên quan tới bảo mật dữ liệu nên dễ gộp chung | KMS trả lời câu hỏi "ai được phép mã hoá/giải mã", còn 2 dịch vụ kia trả lời câu hỏi "giá trị bí mật cụ thể được lưu và cấp phát ở đâu" — nhầm vai trò dẫn tới chọn sai dịch vụ khi đề yêu cầu 1 trong 2 mục đích |
| ❌ Luôn chọn Secrets Manager "cho chắc" vì nó mạnh hơn Parameter Store | Nghe có vẻ Secrets Manager "an toàn hơn" trong mọi trường hợp | Nếu đề không có tín hiệu cần rotation và nhấn mạnh chi phí thấp, Secrets Manager là lựa chọn tốn kém không cần thiết — Parameter Store SecureString mới là "MOST cost-effective" |

## Common traps

### ⚠️ Trap: nghĩ KMS là nơi lưu secret ứng dụng
KMS quản lý **key** dùng để mã hoá/giải mã, không phải kho lưu trữ password/API key theo nghĩa ứng dụng truy vấn trực tiếp — vai trò đó thuộc về Secrets Manager/Parameter Store.

### ⚠️ Trap: Secrets Manager vs Parameter Store
Đây là bẫy rất hay gặp — Secrets Manager có rotation tích hợp mạnh (đặc biệt cho RDS) và chi phí cao hơn; Parameter Store rẻ hơn, phù hợp cấu hình chung, SecureString cũng encrypt được nhưng thiếu rotation mạnh như Secrets Manager. Đề thi thường hỏi "chi phí thấp, không cần rotation" → Parameter Store; "cần tự động đổi password định kỳ" → Secrets Manager.

### ⚠️ Trap: nhầm key management với secret lifecycle management
Quản lý key (KMS) là việc bảo vệ và kiểm soát quyền dùng "chìa khoá mã hoá"; quản lý secret (Secrets Manager) là việc quản lý vòng đời của "giá trị bí mật cụ thể" (password, token) bao gồm cả rotation — hai khái niệm liên quan nhưng không đồng nhất.

## Mini scenarios

🧪 **Scenario 1 — Rotation tự động cho database credentials**

**Tình huống:** Ứng dụng cần kết nối RDS bằng password, yêu cầu bảo mật là password phải tự động đổi mỗi 30 ngày mà không cần deploy lại ứng dụng.
**Đáp án đúng:** Secrets Manager với rotation configuration.
**Vì sao:** Đây là ví dụ điển hình của "cần rotation tự động cho secret" — Parameter Store không có khả năng rotation tích hợp mạnh tương đương, và KMS không phải nơi lưu secret.

🧪 **Scenario 2 — Kiểm soát quyền dùng key mã hoá across account**

**Tình huống:** Một tổ chức có nhiều AWS account (dev, staging, production) cần chia sẻ 1 key mã hoá để giải mã dữ liệu S3 dùng chung giữa account production và account phân tích dữ liệu, nhưng phải kiểm soát chặt account nào được decrypt và account nào chỉ được encrypt.
**Đáp án đúng:** Tạo Customer Managed Key (CMK) trong KMS với key policy tuỳ biến cấp quyền chi tiết theo từng account/role.
**Vì sao:** AWS managed key không cho phép tuỳ biến key policy chi tiết theo nhu cầu chia sẻ có kiểm soát across account — CMK là lựa chọn đúng khi cần kiểm soát quyền dùng key ở mức chi tiết như vậy.

🧪 **Scenario 3 — Anti-pattern: lưu secret bằng KMS thủ công**

**Tình huống:** Một đội kỹ sư quyết định tự viết code gọi KMS `Encrypt`/`Decrypt` API để mã hoá password ứng dụng, rồi lưu chuỗi đã mã hoá trong file cấu hình trên EC2, thay vì dùng Secrets Manager hay Parameter Store.
**Đáp án đúng:** Nên chuyển sang Secrets Manager (nếu cần rotation) hoặc Parameter Store SecureString (nếu không cần rotation) — cả hai đã tích hợp sẵn KMS phía sau và có API quản lý vòng đời/quyền truy cập rõ ràng.
**Vì sao đây là anti-pattern cần tránh:** Tự gọi KMS trực tiếp để "tự chế" một kho lưu secret nghĩa là phải tự xây lại toàn bộ lớp quản lý (versioning, quyền truy cập theo IAM, rotation, audit) mà Secrets Manager/Parameter Store đã cung cấp sẵn — tốn công sức, dễ sai sót bảo mật, và không phải best practice AWS khuyến nghị.

## Key takeaways

- KMS = quản lý key mã hoá (encryption at rest), không phải kho secret ứng dụng.
- Secrets Manager = secret + rotation tự động, chi phí cao hơn, mạnh cho database credentials.
- Parameter Store = cấu hình/tham số, chi phí thấp, SecureString dùng KMS nhưng thiếu rotation mạnh.
- Least Privilege áp dụng cho quyền đọc key/secret/parameter như mọi resource khác.

## Checklist tự ôn

- [ ] Tôi phân biệt được vai trò của KMS so với Secrets Manager/Parameter Store.
- [ ] Tôi biết khi nào chọn Secrets Manager thay vì Parameter Store.
- [ ] Tôi hiểu envelope encryption ở mức khái niệm.
- [ ] Tôi giải thích được sự khác nhau giữa key management và secret lifecycle management.

## Xem tiếp / Liên kết liên quan

- [13-cloudwatch-cloudtrail-config.md](./13-cloudwatch-cloudtrail-config.md)
- [../04-comparison-guides/06-secrets-manager-vs-parameter-store.md](../04-comparison-guides/06-secrets-manager-vs-parameter-store.md)
- [../03-architecture-patterns/06-security-architecture.md](../03-architecture-patterns/06-security-architecture.md)
- [../01-foundation/02-iam-basics.md](../01-foundation/02-iam-basics.md)
