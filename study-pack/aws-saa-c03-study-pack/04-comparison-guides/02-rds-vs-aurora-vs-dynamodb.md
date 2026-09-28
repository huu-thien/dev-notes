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

🧠 **Bài toán cốt lõi mỗi service giải quyết:** RDS giải quyết "cần 1 database quan hệ chuẩn, nhiều engine lựa chọn, quản lý vận hành đỡ tốn công hơn tự cài". Aurora giải quyết đúng bài toán đó nhưng ở mức hiệu năng/HA cao hơn nhờ kiến trúc storage phân tán riêng của AWS — **về bản chất vẫn là relational**, không phải một database khác loại. DynamoDB giải quyết bài toán hoàn toàn khác: "truy cập theo key với độ trễ cực thấp, scale ngang gần như không giới hạn, không cần JOIN". Ranh giới quyết định nằm ở **có cần quan hệ dữ liệu (JOIN/transaction đa bảng) hay không**, không nằm ở "cái nào serverless/hiện đại hơn".

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

| Tín hiệu trong đề | Dẫn tới |
|---|---|
| ⚠️ "JOIN", "foreign key", "complex reporting queries" | RDS/Aurora — loại DynamoDB ngay dù các tiêu chí khác có vẻ hợp DynamoDB |
| ⚠️ "millions of writes per second", "unpredictable traffic spike" | DynamoDB — loại RDS/Aurora vì giới hạn ở write instance chính |
| 🧠 "need better performance/availability than standard RDS but keep MySQL/PostgreSQL compatibility" | Aurora |
| 🧠 "single-table design", "access by primary key", "serverless integration with Lambda" | DynamoDB |

## Khi nào không nên chọn

- Không chọn DynamoDB khi ứng dụng cần JOIN nhiều bảng hoặc transaction phức tạp nhiều bước liên quan nhiều entity khác nhau.
- Không chọn RDS/Aurora khi cần scale ghi cực lớn không dự đoán được (traffic pattern kiểu IoT/gaming leaderboard) — RDS/Aurora vẫn giới hạn bởi write instance chính.
- Không chọn DynamoDB "chỉ vì nó serverless" nếu bài toán thực sự cần dữ liệu quan hệ.

### Why-not reasoning: vì sao đáp án "nghe hợp lý" vẫn sai

- **"DynamoDB serverless, không cần quản lý gì, nên luôn chọn để giảm ops effort"** nghe hợp lý vì giảm ops effort đúng là mục tiêu tốt, nhưng sai nếu dữ liệu có quan hệ (JOIN, transaction đa bảng) — DynamoDB **không hỗ trợ chức năng đó**, chọn nó sẽ buộc phải tự dựng lại logic JOIN ở tầng ứng dụng, làm tăng độ phức tạp thay vì giảm.
- **"Read Replica giúp tăng khả năng chịu lỗi/HA"** nghe hợp lý vì Read Replica cũng là "một bản sao dữ liệu ở nơi khác", nhưng sai vì Read Replica phục vụ **read scaling** (bất đồng bộ, không tự động failover chỉ định làm primary), trong khi HA thực sự cần **Multi-AZ** (đồng bộ, failover tự động). Nếu đề yêu cầu HA mà đáp án chỉ đưa Read Replica, đó là "possible-sounding" nhưng sai mục đích.
- **"Aurora luôn tốt hơn RDS nên luôn chọn Aurora"**: đúng về mặt hiệu năng/HA trong đa số trường hợp, nhưng nếu đề yêu cầu engine không được Aurora hỗ trợ (VD: Oracle, SQL Server) hoặc yêu cầu ngân sách tối thiểu cho workload nhỏ không cần hiệu năng cao, RDS "classic" vẫn là best answer — "tốt hơn về hiệu năng" không đồng nghĩa "luôn là đáp án đúng".

## Trade-offs

| Lựa chọn | Đánh đổi |
|---|---|
| RDS/Aurora | Hỗ trợ quan hệ/transaction mạnh nhưng scale ghi giới hạn hơn DynamoDB |
| DynamoDB | Scale ghi/đọc tốt, độ trễ thấp nhưng phải thiết kế partition key kỹ, không hỗ trợ JOIN |
| Aurora thay RDS | Hiệu năng/HA tốt hơn nhưng chỉ hỗ trợ MySQL/PostgreSQL compatible, không hỗ trợ mọi engine như RDS |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao người học hay nhầm | Hậu quả | Cách loại nhanh trong đề |
|---|---|---|---|
| ❌ Chọn DynamoDB chỉ vì "nó serverless, nghe hiện đại hơn" | Serverless tạo cảm giác luôn là lựa chọn tối ưu, giảm ops effort | Không triển khai được logic JOIN/transaction đa bảng phức tạp mà nghiệp vụ yêu cầu, phải tự dựng logic phức tạp ở tầng ứng dụng | Thấy "relational data", "JOIN", "complex reporting" → chọn RDS/Aurora |
| ❌ Chọn RDS khi access pattern rõ ràng là key-value đơn giản, cần scale ghi cực lớn | RDS quen thuộc, "an toàn" hơn với người có nền tảng SQL | Gặp giới hạn throughput ở write instance chính, không scale được theo traffic tăng đột biến | Thấy "massive write throughput", "unpredictable spiky traffic", "single table access by key" → chọn DynamoDB |
| ❌ Chọn Read Replica khi yêu cầu chính là HA/failover | Read Replica cũng "thêm 1 bản sao dữ liệu" nên nghe giống giải pháp dự phòng | Read Replica không tự động failover thành primary theo cơ chế Multi-AZ — hệ thống vẫn downtime khi primary gặp sự cố | Thấy "automatic failover", "high availability requirement" → chọn Multi-AZ, không phải Read Replica |
| ❌ Luôn chọn Aurora dù không thực sự cần hiệu năng cao hơn RDS | Aurora được xem là "phiên bản nâng cấp toàn diện" của RDS | Có thể không hỗ trợ engine đề bài yêu cầu (Oracle/SQL Server), hoặc tốn kém không cần thiết cho workload nhỏ | Thấy tên engine không được Aurora hỗ trợ, hoặc yêu cầu ngân sách tối thiểu cho workload nhỏ → cân nhắc RDS "classic" |

## Common traps

### ⚠️ Trap: Multi-AZ vs Read Replica vs DynamoDB scaling
Multi-AZ (RDS/Aurora) phục vụ HA (đồng bộ, failover), Read Replica phục vụ tăng read throughput (bất đồng bộ), còn DynamoDB tự động phân tán dữ liệu qua partition để scale cả đọc lẫn ghi mà không cần cấu hình riêng như hai khái niệm kia. Ba khái niệm không thể dùng thay thế nhau khi trả lời câu hỏi.

### ⚠️ Trap: RDS/Aurora vs DynamoDB chỉ vì "muốn nhanh"
Tốc độ không phải tiêu chí duy nhất — nếu dữ liệu có quan hệ phức tạp, DynamoDB dù nhanh vẫn không phải lựa chọn đúng vì thiếu khả năng JOIN/transaction đa bảng.

### ⚠️ Trap: nghĩ backup RDS thay thế được HA
Automated backup/snapshot phục vụ khôi phục dữ liệu, không cung cấp failover tức thời — cần Multi-AZ riêng cho mục đích HA.

## Mini scenarios

🧪 **Scenario 1 — Leaderboard game với traffic ghi cực lớn**

**Tình huống:** Ứng dụng game lưu leaderboard với hàng triệu lượt ghi điểm mỗi giây, mỗi bản ghi đơn giản (player_id, score, timestamp), traffic tăng giảm thất thường không dự đoán được.
**Đáp án đúng:** DynamoDB với chế độ on-demand.
**Vì sao:** Dữ liệu đơn giản, không cần quan hệ phức tạp, traffic ghi cực lớn và thất thường là kịch bản kinh điển cho DynamoDB; RDS/Aurora sẽ gặp giới hạn ở write instance chính.

🧪 **Scenario 2 — Hệ thống ERP cần báo cáo đa bảng**

**Tình huống:** Hệ thống ERP nội bộ cần chạy báo cáo tài chính join dữ liệu từ 6 bảng khác nhau (đơn hàng, khách hàng, kho, hoá đơn, thanh toán, nhân viên), yêu cầu tính nhất quán ACID cho giao dịch tài chính.
**Đáp án đúng:** Amazon Aurora (MySQL hoặc PostgreSQL compatible).
**Vì sao:** Yêu cầu JOIN nhiều bảng và ACID transaction loại trừ DynamoDB ngay từ đầu; chọn Aurora thay vì RDS "classic" vì cần hiệu năng/HA tốt hơn cho hệ thống tài chính quan trọng.

🧪 **Scenario 3 — Anti-pattern: chọn Read Replica để "đảm bảo HA"**

**Tình huống:** Một đội kỹ sư triển khai RDS với 1 Read Replica ở AZ khác, và báo cáo rằng hệ thống đã "có khả năng chịu lỗi/high availability" vì đã có bản sao dữ liệu dự phòng.
**Đáp án đúng:** Cần bật Multi-AZ deployment cho RDS/Aurora để có failover tự động thực sự; Read Replica chỉ nên dùng bổ sung cho mục đích tăng read throughput, không thay thế Multi-AZ.
**Vì sao đây là anti-pattern cần tránh:** Read Replica là bản sao bất đồng bộ, không tự động promote thành primary khi instance chính gặp sự cố — nếu không có Multi-AZ, hệ thống vẫn downtime hoàn toàn khi database chính gặp lỗi, dù đã "có vẻ" dự phòng dữ liệu.

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
