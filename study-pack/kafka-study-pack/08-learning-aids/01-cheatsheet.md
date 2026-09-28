# Cheatsheet — Tra cứu nhanh Kafka

## 🎯 Mục tiêu học
Đây là bảng tra cứu nhanh, **không phải lesson**. Dùng khi cần nhớ lại một khái niệm cốt lõi trong 10 giây,
trước khi vào cuộc họp design, trước interview, hoặc khi đang debug và cần refresh mental model. Muốn hiểu sâu
"vì sao" → theo link về file gốc.

## 📖 Mục lục
- [Core objects](#-core-objects)
- [Producer](#-producer)
- [Consumer & consumer group](#-consumer--consumer-group)
- [Ordering & delivery semantics](#-ordering--delivery-semantics)
- [Retention vs compaction](#-retention-vs-compaction)
- [Replication / ISR](#-replication--isr)
- [Lag & backpressure](#-lag--backpressure)
- [Schema & compatibility](#-schema--compatibility)
- [Retry / DLQ / idempotency](#-retry--dlq--idempotency)
- [Ecosystem tools](#-ecosystem-tools)
- [Key operational signals](#-key-operational-signals)
- [When Kafka is good / overkill](#-when-kafka-is-good--overkill)

## 🧱 Core objects

| Khái niệm | Một câu | Nếu chỉ nhớ 1 điều |
|---|---|---|
| Topic | Đơn vị logic chứa message, chia thành partition | Topic không đảm bảo order — **partition** mới đảm bảo |
| Partition | Đơn vị vật lý, append-only log, là unit của parallelism và ordering | Ordering chỉ tồn tại **trong 1 partition** |
| Offset | Vị trí message trong 1 partition | Offset không unique toàn topic, chỉ unique trong partition |
| Consumer group | Tập consumer chia nhau partition để scale đọc | 1 partition chỉ được đọc bởi 1 consumer/group tại 1 thời điểm |
| Broker | Node lưu trữ + phục vụ read/write cho partition nó là leader | Leader mới nhận write, follower chỉ replicate |

📎 Sâu hơn: [`01-foundation/02-topics-partitions-offsets.md`](../01-foundation/02-topics-partitions-offsets.md),
[`01-foundation/06-consumer-groups.md`](../01-foundation/06-consumer-groups.md)

## 📤 Producer

| Config | Mặc định | Khi nào đổi | Trả giá gì |
|---|---|---|---|
| `acks` | `all` (từ Kafka mới) | Hạ xuống `1`/`0` để giảm latency | Tăng rủi ro mất message nếu leader crash trước khi replicate |
| `enable.idempotence` | `true` (Kafka mới) | Hiếm khi tắt | Tắt → mất bảo vệ duplicate do retry |
| `linger.ms` | `0` | Tăng để gom batch, tăng throughput | Tăng latency mỗi message |
| `batch.size` | 16KB | Tăng nếu throughput cao, message nhỏ | Tăng memory buffer phía producer |
| `compression.type` | `none` | Bật `lz4`/`zstd` nếu network/disk là bottleneck | Tốn CPU nén ở producer, giải nén ở consumer |
| `max.in.flight.requests.per.connection` | 5 | Giữ `≤5` khi bật idempotence để giữ order | `>5` + idempotence có thể phá thứ tự khi retry |

**Most dangerous misunderstanding:** `acks=all` không có nghĩa là "an toàn tuyệt đối" — nó chỉ đảm bảo ghi tới
tất cả replica trong ISR. Nếu `min.insync.replicas=1` và ISR co lại còn 1, `acks=all` vẫn có thể mất dữ liệu khi
node đó chết.

📎 Sâu hơn: [`01-foundation/07-producer-configs-and-delivery-behavior.md`](../01-foundation/07-producer-configs-and-delivery-behavior.md),
[`02-core-internals/01-write-path.md`](../02-core-internals/01-write-path.md)

## 📥 Consumer & consumer group

| Config | Mặc định | Khi nào đổi | Trả giá gì |
|---|---|---|---|
| `session.timeout.ms` | 45s (bản mới) | Giảm để phát hiện chết nhanh hơn | Giảm quá thấp → false positive, rebalance storm |
| `max.poll.interval.ms` | 5 phút | Tăng nếu xử lý mỗi batch lâu | Tăng quá cao → chậm phát hiện consumer treo thật |
| `max.poll.records` | 500 | Giảm nếu xử lý nặng/chậm | Giảm quá thấp → overhead poll tăng, throughput giảm |
| `enable.auto.commit` | `true` | Tắt để tự kiểm soát commit (thường nên tắt trong production nghiêm túc) | Phải tự quản lý commit đúng chỗ, sai dễ gây duplicate/mất update |
| `isolation.level` | `read_uncommitted` | Đổi `read_committed` khi có producer dùng transaction | Có thể tăng latency đọc (chờ transaction commit) |

**Most dangerous misunderstanding:** Thêm consumer vào group **không tăng parallelism vượt quá số partition**.
Consumer thứ N+1 khi đã có N partition sẽ ngồi không (idle).

📎 Sâu hơn: [`01-foundation/08-consumer-configs-and-offset-management.md`](../01-foundation/08-consumer-configs-and-offset-management.md),
[`01-foundation/09-rebalancing-and-group-behavior-basics.md`](../01-foundation/09-rebalancing-and-group-behavior-basics.md)

## 🔀 Ordering & delivery semantics

| Semantics | Đảm bảo gì | Cái giá phải trả |
|---|---|---|
| At-most-once | Không duplicate, có thể mất | Commit trước khi xử lý xong → mất khi crash giữa chừng |
| At-least-once | Không mất, có thể duplicate | Phải tự xử lý idempotency ở consumer/application |
| Exactly-once (EOS) | Không mất, không duplicate — **chỉ trong phạm vi Kafka-to-Kafka** | Không bảo vệ side effect ra ngoài Kafka (DB, API call, email) |

**Nếu bạn chỉ nhớ 1 điều về ordering:** Kafka đảm bảo order **trong 1 partition**, không có "global ordering"
tự nhiên toàn topic. Muốn global order → phải chấp nhận 1 partition (mất parallelism).

📎 Sâu hơn: [`01-foundation/10-ordering-delivery-semantics.md`](../01-foundation/10-ordering-delivery-semantics.md),
[`03-design-and-architecture/06-ordering-vs-scalability-tradeoffs.md`](../03-design-and-architecture/06-ordering-vs-scalability-tradeoffs.md)

## 🗄️ Retention vs compaction

| | Retention (time/size-based) | Compaction |
|---|---|---|
| Giữ lại gì | Message trong N ngày/N bytes gần nhất | Bản ghi **mới nhất theo mỗi key** |
| Xoá gì | Message cũ hơn ngưỡng, bất kể key | Bản ghi cũ hơn của **cùng key** (bản mới đã ghi đè) |
| Dùng khi nào | Event log, audit trail, stream xử lý theo thời gian | Changelog, "current state" theo key (VD: KTable, CDC snapshot) |
| Nguy hiểm nếu hiểu sai | — | Tưởng compaction giữ lịch sử đầy đủ → mất event đã bị nén |

**Most dangerous misunderstanding:** Retention và compaction **không loại trừ nhau** và **không phải cùng một
cơ chế** — một topic có thể bật cả hai (`compact,delete`). Tưởng compaction = "retention dài hơn" là sai.

📎 Sâu hơn: [`01-foundation/11-retention-compaction.md`](../01-foundation/11-retention-compaction.md)

## 🔁 Replication / ISR

| Khái niệm | Ý nghĩa | Nguy hiểm nếu hiểu sai |
|---|---|---|
| Leader | Broker duy nhất nhận read/write cho 1 partition | Không load-balance read qua follower (mặc định) |
| Follower | Replicate dữ liệu từ leader | Follower lag → có thể bị loại khỏi ISR |
| ISR (In-Sync Replicas) | Tập hợp replica **đang theo kịp** leader | ISR là tập **động**, không cố định = replication factor |
| `min.insync.replicas` | Số replica tối thiểu trong ISR để ghi thành công khi `acks=all` | Đặt `=1` → mất gần hết ý nghĩa của `acks=all` |
| Unclean leader election | Cho phép replica **ngoài ISR** làm leader khi cần | Có thể mất dữ liệu đã ghi vào leader cũ nhưng chưa replicate |

**Most dangerous misunderstanding:** Replication factor cao **không phải backup**. Nó chống mất dữ liệu khi
1-2 broker chết, nhưng không chống lỗi logic, xoá nhầm, hay corrupt dữ liệu ở tầng ứng dụng.

📎 Sâu hơn: [`02-core-internals/03-replication-isr-leader-election.md`](../02-core-internals/03-replication-isr-leader-election.md)

## 📊 Lag & backpressure

| Chỉ số | Ý nghĩa | Bẫy thường gặp |
|---|---|---|
| Lag (records) | Số message chưa consume | Không nói gì về **thời gian** — 1000 record lag có thể là 1s hoặc 1 giờ tuỳ throughput |
| Lag (time) | Thời gian từ lúc produce đến lúc consume | Chỉ số thực dụng hơn cho SLA, nhưng cần đo được timestamp |
| Backpressure | Downstream chậm dội ngược lên consumer → producer | Lag tăng không đồng nghĩa consumer "yếu" — có thể downstream nghẽn |

**Nếu bạn chỉ nhớ 1 điều về lag:** Lag là **symptom**, không phải root cause. Phải tra cause family (consumer
chậm / hot partition / rebalance / burst traffic / downstream chậm) trước khi hành động.

📎 Sâu hơn: [`05-operations/04-backpressure-lag-and-throughput.md`](../05-operations/04-backpressure-lag-and-throughput.md),
[`06-troubleshooting/01-high-consumer-lag.md`](../06-troubleshooting/01-high-consumer-lag.md)

## 📐 Schema & compatibility

| Compatibility mode | Cho phép gì | Ai được đổi trước |
|---|---|---|
| Backward | Consumer mới đọc được data cũ | Consumer nâng cấp trước |
| Forward | Consumer cũ đọc được data mới (bỏ qua field lạ) | Producer nâng cấp trước |
| Full | Cả 2 chiều | An toàn nhất, hẹp nhất về loại thay đổi được phép |

**Most dangerous misunderstanding:** Schema Registry chặn được **incompatible schema theo rule đã cấu hình**,
nhưng không chặn được lỗi **business semantics** (VD: đổi ý nghĩa của field mà không đổi type/tên).

📎 Sâu hơn: [`03-design-and-architecture/04-schema-design-avro-protobuf-json.md`](../03-design-and-architecture/04-schema-design-avro-protobuf-json.md),
[`04-ecosystem/02-schema-registry.md`](../04-ecosystem/02-schema-registry.md)

## 🔁 Retry / DLQ / idempotency

| Thành phần | Vai trò | Bẫy thường gặp |
|---|---|---|
| Retry topic | Tách message lỗi tạm thời để retry sau, không block main topic | Retry vô hạn không backoff → nghẽn hệ thống downstream |
| DLQ | Nơi chứa message lỗi không xử lý được sau N lần retry | DLQ không có replay plan = nghĩa địa message, không ai xử lý |
| Idempotent consumer | Xử lý message trùng mà không gây side effect trùng | Chỉ có idempotent **producer** không đủ — phải có idempotency ở tầng application/side effect |

📎 Sâu hơn: [`03-design-and-architecture/07-retry-dlq-idempotency.md`](../03-design-and-architecture/07-retry-dlq-idempotency.md),
[`07-patterns-and-anti-patterns/01-good-patterns.md`](../07-patterns-and-anti-patterns/01-good-patterns.md)

## 🧩 Ecosystem tools

| Tool | Giải quyết gì | Không nên dùng khi nào |
|---|---|---|
| Kafka Connect | Tích hợp nguồn/đích chuẩn hoá (DB, S3, Elasticsearch...) không cần code | Cần transform logic phức tạp/business-specific → tự code |
| Schema Registry | Kiểm soát compatibility schema tại thời điểm ghi | Không cần nếu hệ thống nhỏ, 1 team, schema JSON tự do có kiểm soát riêng |
| Kafka Streams | Xử lý stream có state (join, aggregation, windowing) ngay trong app | Logic đơn giản (filter/map) → dùng consumer thường cho nhẹ |
| ksqlDB | Xử lý stream bằng SQL, tốc độ phát triển nhanh | Cần control chi tiết/testing sâu → Kafka Streams code trực tiếp |
| Debezium/CDC | Đồng bộ thay đổi từ DB ra Kafka không cần dual-write | Row change ở DB **không tự động là business event** — cần enrich lại |

📎 Sâu hơn: [`04-ecosystem/README.md`](../04-ecosystem/README.md)

## 🚦 Key operational signals

| Signal | Gợi ý điều gì |
|---|---|
| Lag tăng đều trên **mọi** partition | Consumer chậm hoặc downstream chậm — không phải hot partition |
| Lag tăng chỉ ở **1-2** partition | Hot partition / key skew — thêm consumer không giúp gì |
| Rebalance liên tục (assignment churn) | `max.poll.interval.ms` quá thấp, poll loop xử lý lâu, hoặc autoscaling gây member churn |
| ISR shrink thường xuyên | Follower không theo kịp — network/disk/GC pressure ở broker |
| Duplicate xuất hiện sau restart consumer | Commit timing sai, không phải "Kafka lỗi" |

📎 Sâu hơn: [`06-troubleshooting/README.md`](../06-troubleshooting/README.md)

## ✅ When Kafka is good / ❌ overkill

| Dùng tốt khi | Overkill khi |
|---|---|
| Cần throughput cao, nhiều consumer đọc lại cùng dữ liệu | Chỉ cần queue đơn giản, 1 producer - 1 consumer, thông lượng thấp |
| Cần replay lịch sử / audit trail | Cần message biến mất ngay sau khi xử lý (semantics hàng đợi cổ điển) |
| Event-driven giữa nhiều service, cần decoupling thật sự | Giao tiếp đồng bộ, cần response ngay (nên dùng RPC/HTTP) |
| Stream processing liên tục (aggregation, join theo thời gian) | Chỉ cần task queue công việc rời rạc (nên xem SQS/RabbitMQ) |

📎 Sâu hơn: [`00-overview/02-when-to-use-kafka.md`](../00-overview/02-when-to-use-kafka.md),
[`00-overview/03-when-not-to-use-kafka.md`](../00-overview/03-when-not-to-use-kafka.md),
[`03-design-and-architecture/09-kafka-vs-rabbitmq-vs-sqs-pulsar.md`](../03-design-and-architecture/09-kafka-vs-rabbitmq-vs-sqs-pulsar.md)

## 🔗 Xem tiếp / Liên kết liên quan
- ⬅️ Về index: [`README.md`](README.md)
- ➡️ Ra quyết định nhanh: [`02-decision-guide.md`](02-decision-guide.md)
- ➡️ Sai lầm phổ biến: [`03-common-mistakes.md`](03-common-mistakes.md)
