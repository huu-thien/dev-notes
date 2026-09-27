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

## Khi nào không nên chọn

- Không chọn Secrets Manager nếu chỉ cần lưu cấu hình đơn giản không cần rotation — tốn chi phí không cần thiết.
- Không chọn Parameter Store nếu yêu cầu rõ ràng cần rotation tự động tích hợp sẵn cho database — Parameter Store không có tính năng này mạnh như Secrets Manager.
- Không nhầm cả hai với KMS — KMS quản lý key mã hoá, không phải nơi lưu giá trị secret cụ thể.

## Trade-offs

| Lựa chọn | Đánh đổi |
|---|---|
| Secrets Manager | Rotation mạnh, tích hợp sẵn nhưng chi phí cao hơn |
| Parameter Store | Chi phí thấp, đơn giản nhưng thiếu rotation tích hợp mạnh |

## Common traps

### Trap: Secrets Manager vs Parameter Store
Bẫy trọng tâm của cặp này — đề thi thường cho tín hiệu "cần rotation" (→ Secrets Manager) hoặc "cost-effective, không cần rotation" (→ Parameter Store). Đọc kỹ yêu cầu rotation trước khi chọn.

### Trap: secret storage vs key management
Cả Secrets Manager và Parameter Store đều dùng KMS để mã hoá giá trị lưu trữ, nhưng bản thân chúng quản lý **secret/tham số cụ thể**, còn KMS quản lý **key mã hoá** — hai lớp trách nhiệm khác nhau, không thay thế nhau.

### Trap: nghĩ Parameter Store không mã hoá được
Parameter Store vẫn hỗ trợ SecureString (mã hoá bằng KMS) — khác biệt với Secrets Manager chủ yếu ở khả năng rotation và chi phí, không phải ở khả năng mã hoá.

## Mini scenario

**Tình huống:** Ứng dụng kết nối RDS bằng password, yêu cầu bảo mật là password phải tự động đổi mỗi 30 ngày mà không cần deploy lại ứng dụng, ngân sách không phải yếu tố quyết định.
**Đáp án đúng:** Secrets Manager với rotation configuration.
**Vì sao:** Yêu cầu rotation tự động định kỳ là tín hiệu rõ ràng cho Secrets Manager — Parameter Store không có khả năng rotation tích hợp mạnh tương đương.

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
