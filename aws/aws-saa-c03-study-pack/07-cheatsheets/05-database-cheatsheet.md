# Database Cheatsheet

Tóm tắt siêu nhanh RDS/Aurora/DynamoDB, Multi-AZ vs Read Replica, GSI/LSI/DAX. Xem [../02-core-services/04-rds-aurora.md](../02-core-services/04-rds-aurora.md) và [../02-core-services/05-dynamodb.md](../02-core-services/05-dynamodb.md) để đào sâu.

## Mục tiêu sử dụng cheatsheet

- Rà nhanh relational vs NoSQL mindset.
- Phân biệt Multi-AZ (HA) vs Read Replica (read scaling).
- Nhớ lại GSI/LSI/DAX dùng khi nào.

## Mục lục

- [Relational vs NoSQL mindset](#relational-vs-nosql-mindset)
- [RDS vs Aurora](#rds-vs-aurora)
- [Multi-AZ vs Read Replica](#multi-az-vs-read-replica)
- [DynamoDB: GSI vs LSI vs DAX](#dynamodb-gsi-vs-lsi-vs-dax)
- [Read scaling vs HA](#read-scaling-vs-ha)
- [Must remember](#must-remember)
- [Common traps / easy confusion](#common-traps--easy-confusion)
- [Exam keywords](#exam-keywords)
- [Quick decision hints](#quick-decision-hints)
- [Checklist tự rà soát](#checklist-tự-rà-soát)

## Relational vs NoSQL mindset

| Tiêu chí | Relational (RDS/Aurora) | NoSQL (DynamoDB) |
|---|---|---|
| Schema | Cố định, cần định nghĩa trước | Linh hoạt (key-value/document) |
| Query | JOIN phức tạp, ad-hoc query | Truy vấn theo key/access pattern định sẵn |
| Transaction | ACID mạnh | Hỗ trợ transaction nhưng thiết kế theo access pattern là chính |
| Scale | Chủ yếu scale đọc qua Read Replica, scale ghi giới hạn hơn | Scale đọc/ghi gần như không giới hạn (on-demand/auto scaling) |
| Latency | Ổn định, ms tới chục ms | Single-digit millisecond, rất ổn định ở scale lớn |

## RDS vs Aurora

| Tiêu chí | RDS | Aurora |
|---|---|---|
| Compatibility | MySQL, PostgreSQL, MariaDB, Oracle, SQL Server | Tương thích MySQL/PostgreSQL |
| Hiệu năng | Chuẩn managed relational | Cao hơn (tuyên bố ~3-5x MySQL chuẩn tùy trường hợp) |
| HA | Multi-AZ (1 standby) | Tự nhân bản dữ liệu nhiều AZ (kiến trúc storage phân tán) |
| Chi phí | Thấp hơn | Cao hơn RDS chuẩn, đổi lại hiệu năng/HA tốt hơn |

## Multi-AZ vs Read Replica

| Tiêu chí | Multi-AZ | Read Replica |
|---|---|---|
| Mục đích | High Availability (failover tự động) | Read scaling (giảm tải đọc khỏi primary) |
| Đồng bộ | Đồng bộ (synchronous) | Bất đồng bộ (asynchronous) |
| Failover | Tự động khi primary lỗi | Không tự động — cần promote thủ công hoặc tự động hóa qua runbook riêng |
| Có thể đọc từ standby? | Không (standby chỉ dùng khi failover) | Có — Read Replica phục vụ đọc trực tiếp |
| Cross-Region? | Có thể (một số engine hỗ trợ) | Có — phổ biến dùng cho DR cross-Region |

> Trap kinh điển: Multi-AZ ≠ giải pháp read scaling. Read Replica ≠ giải pháp HA tự động failover.

## DynamoDB: GSI vs LSI vs DAX

| Tính năng | Vai trò | Giới hạn/lưu ý |
|---|---|---|
| GSI (Global Secondary Index) | Query theo partition key/sort key khác với bảng gốc | Có thể tạo/xóa sau khi bảng đã tồn tại, eventually consistent |
| LSI (Local Secondary Index) | Query theo cùng partition key nhưng sort key khác | Phải khai báo lúc tạo bảng, giới hạn 10GB/partition key |
| DAX | In-memory cache cho DynamoDB, giảm latency đọc xuống microsecond | Chỉ cache cho DynamoDB, không thay thế ElastiCache cho use case khác |

## Read scaling vs HA

- Read scaling: thêm Read Replica hoặc dùng DAX để giảm tải đọc, tăng throughput đọc.
- HA: Multi-AZ cho RDS, hoặc kiến trúc phân tán multi-AZ tự nhiên của Aurora/DynamoDB.
- 2 mục tiêu này độc lập — 1 hệ thống có thể cần cả 2 nhưng phải dùng đúng công cụ cho đúng mục tiêu.

## Must remember

- Chọn relational khi cần transaction/JOIN; chọn DynamoDB khi access pattern đơn giản và cần scale cực lớn.
- Multi-AZ = HA (failover tự động, đồng bộ). Read Replica = read scaling (bất đồng bộ, không tự failover).
- Aurora là lựa chọn "relational nâng cao" khi cần hiệu năng/HA tốt hơn RDS chuẩn.
- DAX chỉ dùng cho DynamoDB, không phải cache đa năng như ElastiCache.

## Common traps / easy confusion

- Nghĩ Multi-AZ giúp scale đọc — sai, đó là vai trò của Read Replica.
- Nghĩ Read Replica tự động failover khi primary lỗi — sai, cần promote thủ công/tự động hóa riêng.
- Nghĩ DynamoDB không hỗ trợ transaction — sai, DynamoDB có transaction API nhưng thiết kế chính vẫn theo access pattern.
- Nhầm GSI và LSI — GSI tạo được sau khi bảng tồn tại và có index key riêng biệt hoàn toàn; LSI phải khai báo từ đầu và dùng chung partition key.

## Exam keywords

- "transaction ACID", "JOIN" → RDS/Aurora
- "traffic ghi tăng đột biến không dự đoán trước" → DynamoDB
- "tự động failover khi primary lỗi" → Multi-AZ
- "giảm tải đọc khỏi primary" → Read Replica
- "cross-Region DR cho database" → Read Replica (cross-Region) + promote runbook
- "cache đọc cho DynamoDB, latency microsecond" → DAX

## Quick decision hints

- Đề hỏi "khôi phục tự động khi database lỗi" → Multi-AZ.
- Đề hỏi "giảm tải đọc, nhiều truy vấn SELECT" → Read Replica.
- Đề hỏi "schema linh hoạt, scale ghi cực lớn" → DynamoDB.
- Đề hỏi "cần hiệu năng cao hơn RDS chuẩn nhưng vẫn tương thích MySQL/PostgreSQL" → Aurora.

## Checklist tự rà soát

- [ ] Tôi phân biệt được Multi-AZ vs Read Replica theo cả mục đích và cơ chế đồng bộ.
- [ ] Tôi biết khi nào chọn DynamoDB thay vì RDS/Aurora.
- [ ] Tôi phân biệt được GSI vs LSI.
- [ ] Tôi nhớ DAX chỉ áp dụng cho DynamoDB.

## Xem tiếp / Liên kết liên quan

- [../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md](../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md)
- [04-storage-cheatsheet.md](./04-storage-cheatsheet.md)
- [README.md](./README.md)
