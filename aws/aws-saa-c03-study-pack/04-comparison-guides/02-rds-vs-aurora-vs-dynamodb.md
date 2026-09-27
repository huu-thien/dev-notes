# RDS/Aurora vs DynamoDB

So sánh relational database (RDS/Aurora) và NoSQL (DynamoDB) để chọn đúng đáp án theo đặc điểm dữ liệu và tải.

## Mục tiêu học

- Phân biệt mindset relational vs NoSQL.
- Biết khi nào chọn DynamoDB thay vì RDS/Aurora và ngược lại.
- Tránh bẫy Multi-AZ vs Read Replica vs DynamoDB scaling.

## Khi nào nên đọc file này

Sau khi đã đọc [`../02-core-services/04-rds-aurora.md`](../02-core-services/04-rds-aurora.md) và [`../02-core-services/05-dynamodb.md`](../02-core-services/05-dynamodb.md).

## Bảng so sánh nhanh

| Tiêu chí | RDS | Aurora | DynamoDB |
|---|---|---|---|
| Mô hình dữ liệu | Relational (SQL) | Relational (SQL) | NoSQL key-value/document |
| Schema | Cố định, có quan hệ (JOIN) | Cố định, có quan hệ (JOIN) | Linh hoạt, không JOIN |
| HA | Multi-AZ (đồng bộ, failover) | Multi-AZ mặc định theo kiến trúc storage phân tán | Tự động nhiều AZ, có sẵn |
| Scale đọc | Read Replica | Read Replica (tối ưu hơn RDS) | Tự động scale (partition) |
| Scale ghi | Giới hạn bởi 1 write instance | Tốt hơn RDS nhưng vẫn giới hạn 1 writer (trừ Aurora multi-master ít gặp trong đề) | Scale ghi tốt nhờ phân vùng theo partition key |
| Consistency | Strong (ACID) | Strong (ACID) | Eventually consistent (mặc định) hoặc strongly consistent (tùy chọn) |

## So sánh theo tiêu chí ra đề thi

- **Cần transaction phức tạp, quan hệ dữ liệu (JOIN nhiều bảng)** → RDS/Aurora.
- **Cần scale ghi/đọc cực lớn, độ trễ thấp, schema linh hoạt** → DynamoDB.
- **Muốn dùng SQL nhưng cần hiệu năng/HA tốt hơn RDS "classic"** → Aurora.
- **Ứng dụng serverless, event-driven, cần tích hợp Lambda trực tiếp** → DynamoDB thường được ưu tiên hơn RDS/Aurora.

## Keyword nhận diện trong đề

| Keyword trong đề | Service gợi ý |
|---|---|
| "relational", "JOIN", "complex queries", "ACID transaction" | RDS/Aurora |
| "MySQL/PostgreSQL compatible with better performance", "5x throughput" | Aurora |
| "key-value", "single-digit millisecond latency", "massive scale", "serverless" | DynamoDB |
| "unpredictable/spiky traffic", "no schema management" | DynamoDB on-demand |
| "read replica for reporting" | RDS/Aurora Read Replica |

## Khi nào chọn A / B / C

- Chọn **RDS** khi: cần engine cụ thể (MySQL/PostgreSQL/MariaDB/Oracle/SQL Server) và không cần hiệu năng tối đa, ngân sách vừa phải.
- Chọn **Aurora** khi: cần tương thích MySQL/PostgreSQL nhưng muốn hiệu năng, HA, và khả năng phục hồi tốt hơn RDS "classic".
- Chọn **DynamoDB** khi: dữ liệu dạng key-value/document, cần scale ghi/đọc lớn, độ trễ thấp ổn định, không cần quan hệ phức tạp giữa bảng.

## Khi nào không nên chọn

- Không chọn DynamoDB khi ứng dụng cần JOIN nhiều bảng hoặc transaction phức tạp nhiều bước liên quan nhiều entity khác nhau.
- Không chọn RDS/Aurora khi cần scale ghi cực lớn không dự đoán được (traffic pattern kiểu IoT/gaming leaderboard) — RDS/Aurora vẫn giới hạn bởi write instance chính.
- Không chọn DynamoDB "chỉ vì nó serverless" nếu bài toán thực sự cần dữ liệu quan hệ.

## Trade-offs

| Lựa chọn | Đánh đổi |
|---|---|
| RDS/Aurora | Hỗ trợ quan hệ/transaction mạnh nhưng scale ghi giới hạn hơn DynamoDB |
| DynamoDB | Scale ghi/đọc tốt, độ trễ thấp nhưng phải thiết kế partition key kỹ, không hỗ trợ JOIN |
| Aurora thay RDS | Hiệu năng/HA tốt hơn nhưng chỉ hỗ trợ MySQL/PostgreSQL compatible, không hỗ trợ mọi engine như RDS |

## Common traps

### Trap: Multi-AZ vs Read Replica vs DynamoDB scaling
Multi-AZ (RDS/Aurora) phục vụ HA (đồng bộ, failover), Read Replica phục vụ tăng read throughput (bất đồng bộ), còn DynamoDB tự động phân tán dữ liệu qua partition để scale cả đọc lẫn ghi mà không cần cấu hình riêng như hai khái niệm kia. Ba khái niệm không thể dùng thay thế nhau khi trả lời câu hỏi.

### Trap: RDS/Aurora vs DynamoDB chỉ vì "muốn nhanh"
Tốc độ không phải tiêu chí duy nhất — nếu dữ liệu có quan hệ phức tạp, DynamoDB dù nhanh vẫn không phải lựa chọn đúng vì thiếu khả năng JOIN/transaction đa bảng.

### Trap: nghĩ backup RDS thay thế được HA
Automated backup/snapshot phục vụ khôi phục dữ liệu, không cung cấp failover tức thời — cần Multi-AZ riêng cho mục đích HA.

## Mini scenario

**Tình huống:** Ứng dụng game lưu leaderboard với hàng triệu lượt ghi điểm mỗi giây, mỗi bản ghi đơn giản (player_id, score, timestamp), traffic tăng giảm thất thường không dự đoán được.
**Đáp án đúng:** DynamoDB với chế độ on-demand.
**Vì sao:** Dữ liệu đơn giản, không cần quan hệ phức tạp, traffic ghi cực lớn và thất thường là kịch bản kinh điển cho DynamoDB; RDS/Aurora sẽ gặp giới hạn ở write instance chính.

## Key takeaways

- RDS/Aurora cho dữ liệu quan hệ, transaction phức tạp; DynamoDB cho key-value, scale lớn, độ trễ thấp.
- Aurora là bản nâng cấp hiệu năng/HA của RDS cho engine MySQL/PostgreSQL compatible, không thay thế mọi engine RDS hỗ trợ.
- Multi-AZ (HA), Read Replica (read scaling), và DynamoDB partition scaling là ba cơ chế khác nhau, không hoán đổi cho nhau.

## Checklist tự ôn

- [ ] Tôi chọn đúng service cho ít nhất 3 kịch bản dữ liệu khác nhau.
- [ ] Tôi phân biệt được Multi-AZ, Read Replica, và DynamoDB scaling.
- [ ] Tôi biết vì sao DynamoDB không phù hợp khi cần JOIN nhiều bảng.

## Xem tiếp / Liên kết liên quan

- [../02-core-services/04-rds-aurora.md](../02-core-services/04-rds-aurora.md)
- [../02-core-services/05-dynamodb.md](../02-core-services/05-dynamodb.md)
- [../03-architecture-patterns/03-scalability.md](../03-architecture-patterns/03-scalability.md)
- [README.md](./README.md)
