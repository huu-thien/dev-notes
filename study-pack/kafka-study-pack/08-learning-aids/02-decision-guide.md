# Decision Guide — Ra quyết định nhanh

## 🎯 Mục tiêu học
File này để **ra quyết định**, không phải để học lý thuyết. Mỗi mục là một câu hỏi thiết kế/vận hành hay lặp
lại, có bảng quyết định + link về file gốc để đọc sâu lý do đằng sau nếu cần.

## 📖 Mục lục
1. [Có nên dùng Kafka cho bài toán này không?](#1-có-nên-dùng-kafka-cho-bài-toán-này-không)
2. [Chọn topic strategy nào?](#2-chọn-topic-strategy-nào)
3. [Bao nhiêu partition là hợp lý?](#3-bao-nhiêu-partition-là-hợp-lý)
4. [Có nên dùng key không? Key kiểu gì?](#4-có-nên-dùng-key-không-key-kiểu-gì)
5. [Chọn delivery semantics nào?](#5-chọn-delivery-semantics-nào)
6. [Có nên dùng idempotent producer không?](#6-có-nên-dùng-idempotent-producer-không)
7. [Có cần DLQ / retry topic không?](#7-có-cần-dlq--retry-topic-không)
8. [Có cần Schema Registry không?](#8-có-cần-schema-registry-không)
9. [Kafka Connect hay tự code?](#9-kafka-connect-hay-tự-code)
10. [Kafka Streams / ksqlDB hay consumer thường?](#10-kafka-streams--ksqldb-hay-consumer-thường)
11. [Khi nào Kafka thua RabbitMQ / SQS / Pulsar?](#11-khi-nào-kafka-thua-rabbitmq--sqs--pulsar)
12. [Lag: vấn đề consumer hay vấn đề design/ops?](#12-lag-vấn-đề-consumer-hay-vấn-đề-designops)
13. [Hot partition hay thiếu consumer?](#13-hot-partition-hay-thiếu-consumer)

---

## 1. Có nên dùng Kafka cho bài toán này không?

```
Cần nhiều consumer độc lập đọc lại cùng dữ liệu? ──No──> Không cần Kafka, dùng queue (SQS/RabbitMQ)
        │Yes
        ▼
Cần replay lịch sử / audit trail?           ──No──> Cân nhắc thêm (không loại trừ Kafka nhưng chưa đủ lý do)
        │Yes hoặc cần throughput rất cao
        ▼
Có chấp nhận eventual consistency,
không cần response đồng bộ ngay?            ──No──> Dùng RPC/HTTP, Kafka không giải quyết bài toán đồng bộ
        │Yes
        ▼
   ✅ Kafka là lựa chọn hợp lý
```

| Tín hiệu | Khuyến nghị |
|---|---|
| Cần fan-out 1 event tới nhiều team/service độc lập | ✅ Kafka |
| Cần task queue đơn giản, ai xử lý xong thì mất (không cần replay) | ⚠️ Cân nhắc SQS/RabbitMQ trước |
| Cần message tồn tại rất ngắn, xử lý ngay, không cần lưu lại | ❌ Kafka overkill |
| Cần đồng bộ hoá state real-time nhưng chấp nhận trễ vài trăm ms - vài giây | ✅ Kafka |
| Cần request/response đồng bộ (VD: xác thực thanh toán ngay) | ❌ Không phải bài toán của Kafka |

📎 Sâu hơn: [`00-overview/02-when-to-use-kafka.md`](../00-overview/02-when-to-use-kafka.md),
[`00-overview/03-when-not-to-use-kafka.md`](../00-overview/03-when-not-to-use-kafka.md)

## 2. Chọn topic strategy nào?

| Tình huống | Khuyến nghị | Rủi ro nếu chọn sai |
|---|---|---|
| Nhiều event type cùng 1 aggregate/entity, cùng vòng đời | Gộp vào 1 topic theo entity | Tách quá nhỏ → topic explosion, khó quản lý |
| Event type khác domain, khác tốc độ thay đổi, khác owner | Tách topic riêng | Gộp chung → coupling schema, 1 team đổi ảnh hưởng team khác |
| Muốn 1 topic riêng cho mỗi consumer | ❌ Không làm — đây là anti-pattern | Topic per consumer → duplicate dữ liệu, không ai là nguồn sự thật |
| Muốn 1 topic tên "events" chứa mọi thứ | ❌ Không làm | Semantics lẫn lộn, consumer phải filter theo type, không rõ ownership |

📎 Sâu hơn: [`03-design-and-architecture/01-topic-design.md`](../03-design-and-architecture/01-topic-design.md)

## 3. Bao nhiêu partition là hợp lý?

```
Throughput mục tiêu / throughput per-partition ước tính
                    │
                    ▼
        Số consumer tối đa muốn scale tới
                    │
                    ▼
   Partition count = max(2 giá trị trên) + biên độ tăng trưởng
                    │
                    ▼
   Có cần global ordering? ──Yes──> Cân nhắc giảm scope ordering
   (theo key, không theo toàn topic)      thay vì ép về 1 partition
```

| Tín hiệu | Khuyến nghị partition |
|---|---|
| Không rõ throughput, mới bắt đầu | Bắt đầu nhỏ (6-12), dễ tăng sau hơn là giảm |
| Cần scale tới N consumer song song | Partition ≥ N |
| Ordering quan trọng theo từng entity (không phải toàn cục) | Partition theo key entity, không cần ít partition |
| "Thêm nhiều cho chắc" mà không có số liệu | ❌ Sai lầm phổ biến nhất — tăng overhead metadata/file handle, khó giảm sau |

**Lưu ý bắt buộc:** partition **rất khó giảm** sau khi tăng (phải tạo topic mới), nhưng **dễ tăng** — nên thiên
về ước lượng thận trọng + kế hoạch tăng, không cố "đoán đúng ngay từ đầu".

📎 Sâu hơn: [`03-design-and-architecture/02-partition-strategy.md`](../03-design-and-architecture/02-partition-strategy.md)

## 4. Có nên dùng key không? Key kiểu gì?

| Tình huống | Khuyến nghị |
|---|---|
| Cần ordering theo entity (VD: theo `orderId`, `accountId`) | Dùng key = entity ID |
| Không cần ordering, chỉ cần phân tán đều | Không cần key (round-robin/sticky partitioner) |
| Key có cardinality thấp (VD: chỉ vài `tenantId` lớn) | ⚠️ Nguy cơ hot partition — cân nhắc composite key |
| Cần vừa giữ order vừa tránh hot key | Composite key (VD: `tenantId:shardId`) chấp nhận relax order phạm vi hẹp |

📎 Sâu hơn: [`03-design-and-architecture/03-key-design.md`](../03-design-and-architecture/03-key-design.md)

## 5. Chọn delivery semantics nào?

| Yêu cầu nghiệp vụ | Semantics | Đánh đổi |
|---|---|---|
| Chấp nhận mất, tuyệt đối không duplicate (hiếm gặp) | At-most-once | Rủi ro mất dữ liệu khi crash |
| Không được mất, chấp nhận xử lý lại (phổ biến nhất) | At-least-once + idempotent consumer | Phải tự thiết kế idempotency ở application |
| Cần chính xác tuyệt đối, toàn bộ pipeline là Kafka-to-Kafka | Exactly-once (transactions) | Không bảo vệ side effect ra ngoài Kafka; thêm overhead |

📎 Sâu hơn: [`01-foundation/10-ordering-delivery-semantics.md`](../01-foundation/10-ordering-delivery-semantics.md)

## 6. Có nên dùng idempotent producer không?

| Câu hỏi | Nếu Yes |
|---|---|
| Producer có retry khi timeout/network lỗi không? | Gần như luôn nên bật `enable.idempotence=true` (mặc định ở Kafka mới) |
| Có cần idempotency ở tầng **side effect** (DB write, gọi API ngoài)? | Idempotent producer **không đủ** — phải tự làm idempotent consumer/application |
| Chi phí bật là gì? | Rất thấp, gần như không có lý do để tắt trong hầu hết trường hợp |

📎 Sâu hơn: [`02-core-internals/06-exactly-once-idempotence-transactions.md`](../02-core-internals/06-exactly-once-idempotence-transactions.md)

## 7. Có cần DLQ / retry topic không?

```
Lỗi xử lý message: tạm thời (network, downstream busy)
hay vĩnh viễn (bad data, schema invalid)?
        │
        ├── Tạm thời ──> Retry topic có backoff, giới hạn số lần retry
        │
        └── Vĩnh viễn ──> DLQ + có kế hoạch replay/xử lý thủ công
                            (nếu không có kế hoạch replay, DLQ vô nghĩa)
```

| Tình huống | Khuyến nghị |
|---|---|
| Lỗi có thể tự hết sau vài giây/phút | Retry topic, backoff tăng dần, giới hạn số lần |
| Lỗi do dữ liệu sai định dạng, sẽ không tự hết | DLQ, có người/job xử lý định kỳ |
| DLQ nhưng không ai theo dõi | ❌ Anti-pattern — nghĩa địa message, mất dữ liệu "âm thầm" |

📎 Sâu hơn: [`03-design-and-architecture/07-retry-dlq-idempotency.md`](../03-design-and-architecture/07-retry-dlq-idempotency.md),
[`07-patterns-and-anti-patterns/01-good-patterns.md`](../07-patterns-and-anti-patterns/01-good-patterns.md)

## 8. Có cần Schema Registry không?

| Tình huống | Khuyến nghị |
|---|---|
| Nhiều team/service cùng tiêu thụ 1 topic, schema thay đổi theo thời gian | ✅ Cần — tránh breaking change âm thầm |
| 1 team, nội bộ, schema hiếm khi đổi, kiểm soát được cả producer/consumer | ⚠️ Có thể tạm chưa cần, nhưng nên có kỷ luật versioning thủ công |
| Dùng JSON tự do không version | ❌ Rủi ro cao — không có gì chặn breaking change |

📎 Sâu hơn: [`04-ecosystem/02-schema-registry.md`](../04-ecosystem/02-schema-registry.md)

## 9. Kafka Connect hay tự code?

| Tình huống | Khuyến nghị |
|---|---|
| Tích hợp nguồn/đích chuẩn (Postgres, S3, Elasticsearch...) không cần transform phức tạp | ✅ Kafka Connect (connector có sẵn) |
| Cần transform logic phức tạp, business-specific, nhiều điều kiện | ⚠️ Tự code (consumer/producer riêng), Connect + SMT dễ trở thành "code ẩn trong config" |
| Cần custom retry/error handling phức tạp hơn Connect hỗ trợ | Tự code hoặc kết hợp Connect + service riêng xử lý downstream |

📎 Sâu hơn: [`04-ecosystem/01-kafka-connect.md`](../04-ecosystem/01-kafka-connect.md)

## 10. Kafka Streams / ksqlDB hay consumer thường?

```
Chỉ cần filter/map đơn giản, không cần state?
        │
        ├── Yes ──> Consumer thường là đủ, không cần thêm framework
        │
        └── No, cần join/aggregation/windowing (có state)
                │
                ├── Cần tốc độ phát triển nhanh, quen SQL, ít cần control chi tiết
                │       → ksqlDB
                │
                └── Cần control sâu, custom logic, testing chặt, CI/CD như service bình thường
                        → Kafka Streams (code trực tiếp)
```

📎 Sâu hơn: [`04-ecosystem/03-kafka-streams.md`](../04-ecosystem/03-kafka-streams.md),
[`04-ecosystem/04-ksqldb.md`](../04-ecosystem/04-ksqldb.md)

## 11. Khi nào Kafka thua RabbitMQ / SQS / Pulsar?

| Tình huống | Kafka thua vì |
|---|---|
| Cần queue đơn giản, xử lý xong thì mất, không cần replay | RabbitMQ/SQS đơn giản hơn để vận hành, ít khái niệm hơn |
| Cần complex routing (topic exchange, priority queue, delayed message built-in) | RabbitMQ có sẵn, Kafka phải tự xây |
| Team nhỏ, không có ai vận hành cluster, muốn managed queue tối giản | SQS gần như zero-ops |
| Cần multi-tenancy mạnh ở mức broker, isolation tài nguyên chặt hơn Kafka | Pulsar có kiến trúc tách compute/storage tốt hơn cho việc này |
| Cần throughput cực cao, replay, nhiều consumer group độc lập | Đây mới là lúc Kafka thắng — không phải mọi trường hợp |

📎 Sâu hơn: [`03-design-and-architecture/09-kafka-vs-rabbitmq-vs-sqs-pulsar.md`](../03-design-and-architecture/09-kafka-vs-rabbitmq-vs-sqs-pulsar.md)

## 12. Lag: vấn đề consumer hay vấn đề design/ops?

| Quan sát | Nhiều khả năng là |
|---|---|
| Lag tăng đều ở **mọi** partition, processing time/message tăng | Consumer chậm thật (code, GC, downstream call) |
| Lag chỉ tăng ở **1-2** partition trong khi các partition khác bình thường | Hot partition — vấn đề **key design**, thêm consumer không giúp |
| Lag tăng đột biến ngắn rồi tự giảm | Traffic burst — có thể chấp nhận được nếu SLA cho phép |
| Lag tăng kèm rebalance liên tục | Vấn đề **config/ops** (`max.poll.interval.ms`, autoscaling), không phải thiếu consumer |

📎 Sâu hơn: [`06-troubleshooting/01-high-consumer-lag.md`](../06-troubleshooting/01-high-consumer-lag.md)

## 13. Hot partition hay thiếu consumer?

| Quan sát | Kết luận |
|---|---|
| Thêm consumer nhưng lag ở 1 partition cụ thể không giảm | Hot partition — 1 partition chỉ có 1 consumer xử lý dù group có bao nhiêu member |
| Tổng lag cao nhưng phân bổ đều mọi partition | Có thể thật sự thiếu consumer/parallelism (nếu số consumer < số partition) |
| Traffic lệch theo key (VD: 1 tenant lớn chiếm phần lớn traffic) | Hot partition do key skew — cần đổi key strategy, không phải thêm consumer |

📎 Sâu hơn: [`06-troubleshooting/02-hot-partitions.md`](../06-troubleshooting/02-hot-partitions.md)

## 🔗 Xem tiếp / Liên kết liên quan
- ⬅️ Về index: [`README.md`](README.md)
- ⬅️ Tra cứu khái niệm nhanh: [`01-cheatsheet.md`](01-cheatsheet.md)
- ➡️ Sai lầm phổ biến: [`03-common-mistakes.md`](03-common-mistakes.md)
