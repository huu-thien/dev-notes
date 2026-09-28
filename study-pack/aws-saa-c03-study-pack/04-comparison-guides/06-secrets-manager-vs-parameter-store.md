# Secrets Manager vs Parameter Store

So sánh hai dịch vụ lưu trữ secret/cấu hình dễ nhầm nhất trong nhóm bảo mật SAA-C03.

## Mục tiêu học

- Phân biệt secret lifecycle management (Secrets Manager) và config storage (Parameter Store).
- Biết khi nào cần rotation tự động và khi nào chỉ cần lưu trữ an toàn đơn thuần.
- Tránh nhầm cả hai với KMS (key management).

## Khi nào nên đọc file này

Sau khi đã đọc [`../02-core-services/14-kms-secrets-manager-parameter-store.md`](../02-core-services/14-kms-secrets-manager-parameter-store.md).

## Bảng so sánh nhanh

| Tiêu chí | Secrets Manager | Parameter Store |
|---|---|---|
| Mục đích chính | Quản lý secret có vòng đời, đặc biệt cần rotation | Lưu cấu hình/tham số, có hỗ trợ SecureString |
| Rotation tự động | Có, tích hợp sẵn cho nhiều AWS service (VD: RDS) | Hạn chế, không tích hợp mạnh như Secrets Manager |
| Chi phí | Cao hơn (theo secret + API call) | Thấp hơn (tier miễn phí rộng) |
| Encryption | Dùng KMS phía sau | SecureString dùng KMS phía sau |
| Use case điển hình | Database credentials cần đổi định kỳ | Cấu hình ứng dụng, feature flag, connection string ít nhạy cảm hơn |

## So sánh theo tiêu chí ra đề thi

- **Cần tự động đổi password/API key định kỳ** → Secrets Manager.
- **Chỉ cần lưu cấu hình/tham số an toàn, không cần rotation** → Parameter Store.
- **Ngân sách hạn chế, secret không đổi thường xuyên** → Parameter Store (SecureString) thường "MOST cost-effective".
- **Tích hợp rotation sẵn có cho RDS** → Secrets Manager.

🧠 **Bài toán cốt lõi mỗi service giải quyết:** Secrets Manager giải quyết "quản lý vòng đời của một secret nhạy cảm, đặc biệt khi cần tự động xoay vòng (rotate) định kỳ mà không sửa code ứng dụng". Parameter Store giải quyết "lưu trữ tham số/cấu hình an toàn với chi phí thấp, khi không cần cơ chế rotation phức tạp". Cả hai đều **không phải** nơi quản lý encryption key — đó là vai trò của KMS đứng phía sau cả hai dịch vụ. Ranh giới quyết định nằm ở: **có cần rotation tự động tích hợp sẵn hay không**, và **ngân sách có phải yếu tố quan trọng hay không**.

## Keyword nhận diện trong đề

| Keyword trong đề | Service gợi ý |
|---|---|
| "automatic rotation", "rotate credentials periodically" | Secrets Manager |
| "database password", "need to rotate" | Secrets Manager |
| "configuration parameter", "feature flag", "cost-effective secret storage" | Parameter Store |
| "SecureString", "no rotation needed" | Parameter Store |

## Khi nào chọn A / B / C

- Chọn **Secrets Manager** khi: secret cần rotation tự động, đặc biệt database credentials tích hợp sẵn (RDS, Redshift...).
- Chọn **Parameter Store** khi: chỉ cần lưu cấu hình/tham số (kể cả nhạy cảm ở mức vừa phải qua SecureString) mà không cần rotation phức tạp, ưu tiên chi phí thấp.

| Tín hiệu trong đề | Dẫn tới |
|---|---|
| 🧠 "automatic rotation", "rotate credentials without redeploying application" | Secrets Manager |
| 🧠 "cost-effective", "no rotation required", "simple configuration storage" | Parameter Store |
| ⚠️ "encryption key management" | Không phải Secrets Manager/Parameter Store — đây là vai trò của KMS |
| ⚠️ Đề chỉ nhắc "cần lưu trữ an toàn" nhưng không nhắc rotation | Mặc định nghiêng về Parameter Store (rẻ hơn) trừ khi có tín hiệu khác |

## Khi nào không nên chọn

- Không chọn Secrets Manager nếu chỉ cần lưu cấu hình đơn giản không cần rotation — tốn chi phí không cần thiết.
- Không chọn Parameter Store nếu yêu cầu rõ ràng cần rotation tự động tích hợp sẵn cho database — Parameter Store không có tính năng này mạnh như Secrets Manager.
- Không nhầm cả hai với KMS — KMS quản lý key mã hoá, không phải nơi lưu giá trị secret cụ thể.

### Why-not reasoning: vì sao đáp án "nghe hợp lý" vẫn sai

- **"Parameter Store cũng SecureString được nên dùng thay Secrets Manager cho mọi secret"** nghe hợp lý vì cả hai đều mã hoá bằng KMS, nhưng sai khi đề yêu cầu rotation tự động định kỳ — Parameter Store không có cơ chế rotation tích hợp mạnh như Secrets Manager, chọn nó sẽ không đáp ứng được functional requirement dù chi phí thấp hơn.
- **"Secrets Manager luôn tốt hơn vì có nhiều tính năng hơn nên luôn chọn để an toàn"** nghe hợp lý vì "nhiều tính năng hơn" tạo cảm giác là lựa chọn an toàn, nhưng sai khi đề nhấn "cost-effective" và không yêu cầu rotation — dùng Secrets Manager cho một feature flag đơn giản là over-engineering không cần thiết, tốn kém hơn mà không tăng thêm giá trị thực tế.
- **"Cả hai đều dùng KMS nên coi Secrets Manager/Parameter Store là công cụ quản lý encryption key"** nghe hợp lý vì KMS xuất hiện ở cả hai, nhưng sai vì cả hai chỉ **sử dụng** KMS để mã hoá giá trị lưu trữ — bản thân chúng quản lý secret/tham số cụ thể, không phải là nơi tạo/quản lý encryption key.

## Trade-offs

| Lựa chọn | Đánh đổi |
|---|---|
| Secrets Manager | Rotation mạnh, tích hợp sẵn nhưng chi phí cao hơn |
| Parameter Store | Chi phí thấp, đơn giản nhưng thiếu rotation tích hợp mạnh |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao người học hay nhầm | Hậu quả | Cách loại nhanh trong đề |
|---|---|---|---|
| ❌ Chọn Parameter Store khi đề nhấn automatic rotation | Cả hai đều "lưu trữ an toàn" nên nghe như tương đương | Không đáp ứng được yêu cầu rotation tự động — phải tự xây dựng cơ chế rotation thủ công, tăng ops effort đáng kể | Thấy "rotate automatically", "no application redeploy needed for credential change" → chọn Secrets Manager |
| ❌ Nghĩ Secrets Manager và Parameter Store hoàn toàn giống nhau, dùng cái nào cũng được | Cả hai đều SecureString/KMS-backed nên dễ nghĩ chỉ khác tên gọi | Bỏ lỡ yêu cầu rotation (chọn Parameter Store) hoặc tốn kém không cần thiết (chọn Secrets Manager cho nhu cầu đơn giản) | Luôn kiểm tra tín hiệu rotation + ngân sách trước khi chọn |
| ❌ Nhầm secret storage (Secrets Manager/Parameter Store) với key management (KMS) | Cả ba dịch vụ đều nằm trong nhóm "bảo mật thông tin nhạy cảm" | Chọn sai dịch vụ cho đúng nhu cầu — VD: dùng KMS để "lưu" API key trực tiếp thay vì Secrets Manager | Secrets Manager/Parameter Store = lưu giá trị secret cụ thể; KMS = quản lý key dùng để mã hoá các giá trị đó |
| ❌ Over-engineering bằng Secrets Manager khi chỉ cần lưu config đơn giản | Tâm lý "chọn dịch vụ mạnh hơn để chắc chắn không sai" | Tăng chi phí không cần thiết (Secrets Manager tính phí theo secret + API call), không phù hợp tinh thần "cost-effective" của đề | Thấy "feature flag", "simple config value", "no rotation needed" → chọn Parameter Store |

## Common traps

### ⚠️ Trap: Secrets Manager vs Parameter Store
Bẫy trọng tâm của cặp này — đề thi thường cho tín hiệu "cần rotation" (→ Secrets Manager) hoặc "cost-effective, không cần rotation" (→ Parameter Store). Đọc kỹ yêu cầu rotation trước khi chọn.

### ⚠️ Trap: secret storage vs key management
Cả Secrets Manager và Parameter Store đều dùng KMS để mã hoá giá trị lưu trữ, nhưng bản thân chúng quản lý **secret/tham số cụ thể**, còn KMS quản lý **key mã hoá** — hai lớp trách nhiệm khác nhau, không thay thế nhau.

### ⚠️ Trap: nghĩ Parameter Store không mã hoá được
Parameter Store vẫn hỗ trợ SecureString (mã hoá bằng KMS) — khác biệt với Secrets Manager chủ yếu ở khả năng rotation và chi phí, không phải ở khả năng mã hoá.

## Mini scenarios

🧪 **Scenario 1 — Rotation credential RDS định kỳ**

**Tình huống:** Ứng dụng kết nối RDS bằng password, yêu cầu bảo mật là password phải tự động đổi mỗi 30 ngày mà không cần deploy lại ứng dụng, ngân sách không phải yếu tố quyết định.
**Đáp án đúng:** Secrets Manager với rotation configuration.
**Vì sao:** Yêu cầu rotation tự động định kỳ là tín hiệu rõ ràng cho Secrets Manager — Parameter Store không có khả năng rotation tích hợp mạnh tương đương.

🧪 **Scenario 2 — Feature flag cho ứng dụng nội bộ, ngân sách hạn chế**

**Tình huống:** Đội phát triển cần lưu trữ một số feature flag và connection string ít nhạy cảm cho ứng dụng nội bộ, các giá trị này hiếm khi thay đổi và không yêu cầu rotation, ngân sách team eng khá hạn chế.
**Đáp án đúng:** Parameter Store (SecureString cho giá trị nhạy cảm, String thường cho feature flag không nhạy cảm).
**Vì sao:** Không có yêu cầu rotation, ưu tiên chi phí thấp — đúng use case "đủ tốt" của Parameter Store; dùng Secrets Manager ở đây là over-engineering không cần thiết.

🧪 **Scenario 3 — Anti-pattern: lưu API key trực tiếp trong KMS**

**Tình huống:** Một lập trình viên mới muốn lưu trữ API key của bên thứ ba một cách an toàn, và nhầm lẫn nghĩ rằng có thể "lưu API key vào KMS" vì KMS "là dịch vụ bảo mật của AWS".
**Đáp án đúng:** Lưu API key vào Secrets Manager (nếu cần rotation) hoặc Parameter Store SecureString (nếu không cần rotation) — cả hai sẽ dùng KMS ở phía sau để mã hoá giá trị đó.
**Vì sao đây là anti-pattern cần tránh:** KMS không phải nơi lưu trữ giá trị secret cụ thể — nó chỉ quản lý encryption key dùng để mã hoá/giải mã dữ liệu ở các dịch vụ khác; cố lưu trực tiếp API key "vào KMS" không phải cách KMS hoạt động và cho thấy sự nhầm lẫn giữa secret storage và key management.

## Key takeaways

- Secrets Manager = secret + rotation tự động, chi phí cao hơn, mạnh cho database credentials.
- Parameter Store = cấu hình/tham số, chi phí thấp, SecureString dùng KMS nhưng thiếu rotation mạnh.
- KMS là lớp nền tảng encryption chung cho cả hai, không cạnh tranh trực tiếp với chúng.

## Checklist tự ôn

- [ ] Tôi chọn đúng dịch vụ cho ít nhất 2 kịch bản có/không cần rotation.
- [ ] Tôi giải thích được vì sao KMS không phải đối thủ cạnh tranh của Secrets Manager/Parameter Store.
- [ ] Tôi biết Parameter Store vẫn hỗ trợ mã hoá qua SecureString.

## Xem tiếp / Liên kết liên quan

- [../02-core-services/14-kms-secrets-manager-parameter-store.md](../02-core-services/14-kms-secrets-manager-parameter-store.md)
- [../03-architecture-patterns/06-security-architecture.md](../03-architecture-patterns/06-security-architecture.md)
- [README.md](./README.md)
