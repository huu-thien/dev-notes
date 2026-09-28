# Generation Plan — Kế hoạch sinh nội dung theo nhiều prompt

Bộ tài liệu này được sinh **theo nhiều lượt** để tránh nội dung bị lệch style, lệch thuật ngữ, hoặc hời hợt do
cố nhồi quá nhiều trong một lần. Mỗi lượt sinh phải tuân theo `STYLE-GUIDE.md` và cập nhật `GLOSSARY.md` nếu có
thuật ngữ mới. Sau mỗi lượt, chạy qua `QUALITY-CHECKLIST.md` cho các file vừa tạo.

## Nguyên tắc thực thi

1. **Không nhảy cóc thứ tự** — thư mục sau thường tham chiếu khái niệm ở thư mục trước (ví dụ
   `03-design-and-architecture` cần `02-core-internals` đã có).
2. Mỗi lượt sinh xong phải: (a) update GLOSSARY nếu cần, (b) update README điều hướng nếu cấu trúc file con thay
   đổi, (c) tự rà theo QUALITY-CHECKLIST.
3. Nếu một lượt sinh phát hiện blueprint (glossary/style) thiếu hoặc sai, **được phép sửa blueprint trước**, rồi
   mới tiếp tục sinh nội dung.
4. Ưu tiên hoàn thiện **chiều sâu** một thư mục trước khi sang thư mục kế — không rải mỏng tất cả thư mục cùng lúc.

## Thứ tự các lượt sinh

### Lượt 1 — Root + Overview ✅ HOÀN THÀNH
- Đã hoàn thiện đầy đủ `00-overview/`: how-to-use, what-is-kafka, when-to-use, when-not-to-use, core mental
  model — mỗi file đều có mental model, trade-off, anti-pattern/misconception, mini scenario, interview lens,
  diagram (Mermaid + ASCII), checklist tự ôn.
- Đây là nền tảng định hướng toàn bộ giọng văn cho các lượt sau — đã review đạt `QUALITY-CHECKLIST.md`.

### Lượt 2 — Foundation ✅ HOÀN THÀNH (đã refactor ở Lượt 2.1)
- Đã hoàn thiện đầy đủ `01-foundation/`: events & streaming, topics/partitions/offsets,
  brokers/clusters/replication, producers, consumers, consumer groups, producer configs & delivery behavior,
  consumer configs & offset management, rebalancing & group behavior, ordering & delivery semantics, retention
  & compaction — mỗi file đều có mental model, decision logic, trade-off, anti-pattern, mini scenario, diagram
  (Mermaid/ASCII); các file trọng tâm có thêm interview lens, key configs, failure modes, debugging hints.
- Đây là phần **must-master** trước khi học internals — đã review đạt `QUALITY-CHECKLIST.md`.

### Lượt 2.1 — Foundation refactor (producer/consumer đào sâu) ✅ HOÀN THÀNH
- Tách file cũ `04-producers-consumers-consumer-groups.md` thành 6 file chuyên sâu:
  `04-producers.md`, `05-consumers.md`, `06-consumer-groups.md`,
  `07-producer-configs-and-delivery-behavior.md`, `08-consumer-configs-and-offset-management.md`,
  `09-rebalancing-and-group-behavior-basics.md`.
- Đổi số `05-ordering-delivery-semantics.md` → `10-ordering-delivery-semantics.md`,
  `06-retention-compaction.md` → `11-retention-compaction.md` (nội dung được đào sâu thêm).
- Loại bỏ toàn bộ block "Diagram này muốn bạn nhớ / Đừng hiểu diagram này theo cách sau / Checklist tự ôn"
  trong `00-overview/` và `01-foundation/`, thay bằng bullet point trực tiếp và các section thực dụng hơn
  (Key configs, Failure modes, Debugging hints, Interview lens, Operational implications).
- Cập nhật `STYLE-GUIDE.md`, `QUALITY-CHECKLIST.md` theo hướng config/failure-mode reasoning thay vì template
  ôn thi.

### Lượt 3 — Core Internals ✅ HOÀN THÀNH
- Đã hoàn thiện đầy đủ `02-core-internals/`: write path (batching, `acks`, retry/duplicate risk), read path
  (poll/fetch/process/commit, `isolation.level`), replication/ISR/leader election (ISR là tập động,
  `min.insync.replicas`, unclean leader election), rebalancing (lifecycle eager 4 bước, rebalance storm,
  `session.timeout.ms` vs `max.poll.interval.ms`), storage (segment/sparse index/sequential I/O/zero-copy),
  exactly-once/idempotence/transactions (producer ID + sequence number, transaction marker, phạm vi EOS chỉ
  Kafka-to-Kafka).
- Mỗi file có 2 diagram Mermaid (high-level + failure/behavior path), bảng Key configs/Failure modes, mini
  scenarios thực tế, Interview lens — không dùng block "Checklist tự ôn"/"Diagram này muốn bạn nhớ".
- Đây là phần khó nhất của cả pack — đã review đạt `QUALITY-CHECKLIST.md`.

### Lượt 4 — Design & Architecture ✅ HOÀN THÀNH
- Đã hoàn thiện đầy đủ `03-design-and-architecture/`: topic design (boundary/ownership/naming, gộp-tách theo
  entity), partition strategy (chọn số partition, hot partition, repartitioning implications), key design (key
  → partition mapping, ordering vs hotspot, sticky partitioner), schema design (Avro/Protobuf/JSON, backward/
  forward/full compatibility ở mức thực dụng), message size/throughput/latency (batching/compression/fetch
  efficiency, khi nào lưu reference thay vì blob), ordering-vs-scalability trade-off (file xương sống — vì sao
  ordering toàn cục không scale, retry và ordering), retry/DLQ/idempotency (idempotent producer vs application
  idempotency), Kafka cho microservices (integration event vs command, eventual consistency, choreography vs
  orchestration), so sánh Kafka vs RabbitMQ vs SQS vs Pulsar (mô hình log bất biến vs hàng đợi tiêu thụ-và-xoá).
- Mỗi file có Key decisions/Design trade-offs/Failure modes/❌ Anti-patterns (2-4 mục có giải thích đầy đủ)/
  🧪 Mini scenarios (3-4 scenario cụ thể có con số)/🎤 Interview lens — không dùng block "Checklist tự ôn"/
  "Diagram này muốn bạn nhớ". Diagram Mermaid ở các file: partition strategy (2), key design (1), ordering vs
  scalability (2), retry/DLQ (2), Kafka for microservices (1).
- Đây là phần **áp dụng thực tế** quan trọng nhất của cả pack — đã review đạt `QUALITY-CHECKLIST.md`.

### Lượt 5 — Ecosystem ✅ HOÀN THÀNH
- Đã hoàn thiện đầy đủ `04-ecosystem/`: Kafka Connect (connector/task/worker mental model, distributed vs
  standalone mode, SMT, offset/retry/error handling, operational burden), Schema Registry (schema as contract,
  schema ID/compatibility check tại thời điểm ghi, backward/forward/full compatibility ở góc production, liên
  hệ topic strategy/governance), Kafka Streams (topology/state store/changelog topic, stateless vs stateful,
  joins/windowing/aggregation, EOS chỉ bảo vệ phạm vi Kafka), ksqlDB (SQL-on-streams đặt trên nền Streams,
  stream vs table mental model, trade-off tốc độ phát triển vs control), Debezium/CDC (transaction log vs
  polling, snapshot vs streaming phase, ordering/duplicate/idempotency, outbox pattern, schema/table evolution
  impact liên team).
- Mỗi file có Key mechanics/Key decisions/Trade-offs/Failure modes/🔍 Debugging hints/Operational implications/
  ❌ Anti-patterns (3 mục có giải thích đầy đủ)/🧪 Mini scenarios (3-4 scenario cụ thể, Debezium có 4)/
  🎤 Interview lens — không dùng block "Checklist tự ôn"/"Diagram này muốn bạn nhớ". Diagram Mermaid: Kafka
  Connect (1 flowchart), Schema Registry (1 sequenceDiagram), Kafka Streams (2 flowchart: topology + state
  store/changelog), ksqlDB (1 flowchart), Debezium/CDC (2 flowchart: pipeline tổng quát + snapshot/streaming
  phase).
- Cập nhật `04-ecosystem/README.md` thành index thật sự: vì sao ecosystem quan trọng, thứ tự đọc, file xương
  sống (`02-schema-registry.md`), đọc gì nếu ít thời gian.
- Đây là phần nối giữa "hiểu Kafka core" và "vận hành hệ thống thực tế dùng ecosystem tool" — đã review đạt
  `QUALITY-CHECKLIST.md`.

### Lượt 6 — Operations ✅ HOÀN THÀNH
- Đã hoàn thiện đầy đủ `05-operations/`: capacity planning (input variables throughput/message size/partition/
  RF/retention/consumer concurrency/growth, disk/network sizing mindset, page cache, storage amplification),
  scaling (phân biệt scale broker/partition/consumer, partition expansion side effects, hot key làm "scale"
  gây hiểu lầm), monitoring & alerting (golden signals theo 4 tầng broker/topic/partition/consumer, lag theo
  record vs thời gian, ISR-related signals, alert fatigue), backpressure/lag/throughput (file xương sống — lag
  là gì/không phải gì, chain producer→broker→consumer→downstream, throughput vs latency trade-off, batch/fetch/
  poll config liên quan), failures & recovery (broker crash/disk full/network partition/ISR shrink/leader
  failure/consumer crash, data loss vs perceived loss vs temporary unavailability, recovery không miễn phí),
  security (authn vs authz vs encryption, TLS/SASL/ACL mental model, principal/least privilege, topic-level
  governance), upgrades & compatibility (rolling restart mindset, client-broker protocol version skew, schema/
  app compatibility là trục độc lập, canary/staged rollout/rollback thinking).
- Mỗi file có Key mechanics/Key decisions/Trade-offs/Failure modes/🔍 Debugging hints/🧱 Operational
  implications/❌ Anti-patterns (3 mục có giải thích đầy đủ)/🧪 Mini scenarios (3-4 scenario cụ thể, backpressure
  và failures có 4)/🎤 Interview lens — không dùng block "Checklist tự ôn"/"Diagram này muốn bạn nhớ". Diagram
  Mermaid: scaling (1 flowchart quyết định loại scale), backpressure (1 flowchart propagation), failures (1
  sequenceDiagram leader failover), security (1 flowchart security layers).
- Cập nhật `05-operations/README.md` thành index thật sự: vì sao operations là chỗ nhiều team thất bại nhất,
  thứ tự đọc, file xương sống (`04-backpressure-lag-and-throughput.md`), đọc gì trước nếu chuẩn bị on-call.
- Đây là phần chuyển từ "hiểu Kafka lý thuyết" sang "biết vận hành production thực tế" — đã review đạt
  `QUALITY-CHECKLIST.md`.

### Lượt 7 — Troubleshooting + Patterns ✅ HOÀN THÀNH
- Đã hoàn thiện đầy đủ `06-troubleshooting/`: high consumer lag (7 cause family, phân biệt lag theo record vs
  thời gian, bảng symptom→cause→check first, 4 mini scenario), hot partitions (key/tenant skew, bad key design,
  vì sao thêm consumer không giúp gì, composite key fix, diagram uneven partition load, 3 mini scenario),
  message loss/duplicates (actual vs perceived loss, duplicate ở producer/broker/consumer/app, phạm vi EOS,
  diagram commit/retry/loss paths, 4 mini scenario), slow producer/slow consumer (tách 4 lớp nguyên nhân:
  producer/consumer config, broker load, network/serialization, bảng config suspect, 3 mini scenario),
  rebalance storms (member churn, slow poll, session timeout, autoscaling, diagram storm loop tự duy trì, 3
  mini scenario), schema/serialization errors (mismatch, deserialization failure, registry compatibility, bad
  rollout sequencing, tombstone/nullable surprises, 3 mini scenario).
- Đã hoàn thiện đầy đủ `07-patterns-and-anti-patterns/`: good patterns (outbox, retry topic+DLQ, idempotent
  consumer, schema versioning discipline, per-entity keying, event-carried state transfer, derived topics/
  enrichment pipeline — mỗi pattern có dùng khi nào/giá trị/cost/dấu hiệu đúng-sai), anti-patterns (11 anti-
  pattern: topic per consumer, generic "events" topic, Kafka as primary database, infinite retries, DLQ không
  replay plan, no schema governance, over-partitioning, strict global ordering obsession, event-driven
  everywhere, CDC row change hiểu nhầm business event, no idempotency around external side effects — mỗi cái
  có vì sao team hay rơi vào/đau ở đâu/khi nào lộ hậu quả/migration path), common architecture scenarios (7
  scenario: event-driven microservices backbone, CDC-based data sync, search/index sync, analytics/event lake
  ingestion, notification fan-out, payment/order/account per-entity ordering, stream enrichment pipeline — mỗi
  scenario map requirement→pattern→anti-pattern risk→key decisions→what to watch).
- Mỗi file troubleshooting có Symptom/Why this happens/Likely cause families/How to distinguish causes/
  Debugging workflow/Common false assumptions/Fix directions/Prevention design fix/❌ Anti-patterns/🧪 Mini
  scenarios/🎤 Interview lens — không dùng block "Checklist tự ôn"/"Diagram này muốn bạn nhớ". Diagram Mermaid:
  hot partitions (1 flowchart uneven load), message loss/duplicates (1 flowchart commit/retry/loss paths),
  rebalance storms (1 flowchart storm loop).
- Cleanup: đã bỏ wording "sẽ mở rộng ở phần sau" (không còn đúng thực tế vì file đích đã tồn tại) ở 5 file:
  `03-design-and-architecture/01-topic-design.md`, `04-schema-design-avro-protobuf-json.md`,
  `09-kafka-vs-rabbitmq-vs-sqs-pulsar.md`, `04-ecosystem/05-debezium-cdc.md`, `05-operations/README.md`.
- Cập nhật `06-troubleshooting/README.md` và `07-patterns-and-anti-patterns/README.md` thành index thật sự:
  dùng như runbook, bảng symptom→file nên tra, file quan trọng nhất khi on-call; phân biệt pattern vs
  troubleshooting, anti-pattern vs bug thông thường.
- Đây là phần biến pack thành tài liệu dùng được khi debug thật/on-call/review architecture — đã review đạt
  `QUALITY-CHECKLIST.md`.

### Lượt 8 — Learning Aids ✅ HOÀN THÀNH
- Đã hoàn thiện đầy đủ `08-learning-aids/`: cheatsheet (bảng tra cứu nhanh core object/producer/consumer/
  ordering/retention-compaction/replication-ISR/lag-backpressure/schema/retry-DLQ/ecosystem tool/operational
  signal/when-good-vs-overkill, mỗi mục có "Most dangerous misunderstanding" hoặc "Nếu bạn chỉ nhớ 1 điều"),
  decision guide (13 quyết định lặp lại nhiều nhất: có nên dùng Kafka, topic strategy, partition count, key
  design, delivery semantics, idempotent producer, DLQ/retry, Schema Registry, Connect vs tự code, Streams/
  ksqlDB vs consumer thường, Kafka vs RabbitMQ/SQS/Pulsar, lag consumer-vs-design, hot partition-vs-thiếu
  consumer — mỗi mục có bảng/ASCII decision tree + link về file gốc), common mistakes (12 sai lầm phổ biến
  xuyên suốt cả pack, mỗi mục có sai ở đâu/vì sao dễ nghĩ vậy/hậu quả/mental model đúng/link đọc lại),
  interview-style questions (15 nhóm câu hỏi, mỗi câu có câu trả lời yếu/câu trả lời mạnh cần nhắc/hướng đào
  sâu — không viết đáp án đầy đủ để tránh trùng lặp nội dung).
- Đây là tầng **synthesis/tra cứu nhanh**, không phải lesson mới — mọi nội dung đều trỏ link về file gốc ở
  00-07 thay vì lặp lại giải thích chi tiết.
- Cập nhật `08-learning-aids/README.md` thành index thật sự: khác biệt với các phần trước (tầng tra cứu vs
  tầng học sâu), bảng "đọc khi nào" cho từng file, lộ trình 30 phút ôn nhanh, file dùng trước interview vs
  file dùng khi debug/quyết định nhanh.
- Không cần thêm glossary term mới — các thuật ngữ liên quan (composite key, sticky partitioner, hot partition,
  member churn, dual-write problem, event-carried state transfer...) đã được chuẩn hoá ở các lượt trước.
- Đã review: không `\n` literal, không broken relative link, không heading nhảy bậc.

### Lượt 9 — Final Review ✅ HOÀN THÀNH
- Rà toàn bộ pack theo `QUALITY-CHECKLIST.md`: không phát hiện file nào thiếu mental model/trade-off/failure
  mode/anti-pattern so với loại file tương ứng.
- Broken link sweep toàn repo (70 file `.md`): **0 broken link**.
- Heading integrity sweep toàn repo: không có heading nhảy bậc trong nội dung thực tế (chỉ có pattern
  H1→H3 có chủ đích ở `GLOSSARY.md` — flat term list — và trong `STYLE-GUIDE.md` — liệt kê template heading —
  không phải lỗi).
- Banned phrase sweep ("Diagram này muốn bạn nhớ", "Đừng hiểu diagram này theo cách sau", "Checklist tự ôn"):
  chỉ còn xuất hiện trong tài liệu điều phối (`STYLE-GUIDE.md`, `QUALITY-CHECKLIST.md`, `GENERATION-PLAN.md`)
  như quy tắc cấm, không còn trong nội dung lesson thực tế.
- Diagram `\n` literal sweep: **0 lỗi** trên toàn bộ 43 Mermaid diagram block.
- Empty section sweep: không phát hiện section rỗng trong nội dung thực tế.
- Glossary consistency spot-check: phát hiện và sửa 1 inconsistency — `ISR` được viết "In-Sync Replica" (số ít,
  sai) ở 3 file (`GLOSSARY.md`, `00-overview/04-kafka-core-mental-model.md`,
  `02-core-internals/03-replication-isr-leader-election.md`) trong khi đúng chuẩn phải là "In-Sync **Replicas**"
  (số nhiều, vì ISR luôn là một **tập hợp**) — đã chuẩn hoá về "In-Sync Replicas" ở cả 4 file liên quan (gồm cả
  heading + anchor link trong `01-foundation/03-brokers-clusters-replication.md`).
- README/navigation sweep: mọi README thư mục con đều nhất quán trạng thái ✅ hoàn thiện, có "file xương sống"
  rõ ràng, không còn wording "đang build dần"/"blueprint" — trừ 1 câu sót lại ở
  `00-overview/00-how-to-use-this-pack.md` (phần "Xem tiếp") nhắc tới phần "còn ở dạng blueprint" — đã sửa lại
  cho đúng thực tế (toàn bộ pack đã hoàn thiện, `GENERATION-PLAN.md` giờ dùng để tra lịch sử sinh nội dung).
- Content consistency review: không phát hiện mâu thuẫn mental model giữa các thư mục (ordering/lag/hot
  partition/retention-compaction... được dùng nhất quán xuyên suốt 00→08).
- Thin/vague file review: không có file lesson nào dưới ngưỡng độ sâu cần thiết — file ngắn nhất là các
  `README.md` (đúng vai trò index, không cần dài).
- Kết luận: pack đã sẵn sàng để học dài hạn trên GitHub.

## Bảng theo dõi tiến độ

| Lượt | Thư mục | Trạng thái |
|------|---------|------------|
| 0 | Blueprint (root + tất cả README thư mục con) | ✅ Done |
| 1 | 00-overview | ✅ Done |
| 2 | 01-foundation | ✅ Done |
| 2.1 | 01-foundation (refactor sâu producer/consumer/config) | ✅ Done |
| 3 | 02-core-internals | ✅ Done |
| 4 | 03-design-and-architecture | ✅ Done |
| 5 | 04-ecosystem | ✅ Done |
| 6 | 05-operations | ✅ Done |
| 7 | 06-troubleshooting + 07-patterns-and-anti-patterns | ✅ Done |
| 8 | 08-learning-aids | ✅ Done |
| 9 | Final Review | ✅ Done |

> Cập nhật bảng này (đổi ⏳ → ✅) mỗi khi hoàn thành một lượt, để prompt tiếp theo biết chính xác cần làm gì.

## Trạng thái tổng thể

Toàn bộ 10 lượt sinh nội dung (0 → 9) đã hoàn thành. Pack `kafka-study-pack/` đã sẵn sàng để học dài hạn và
tham chiếu trên GitHub. Không còn lượt sinh nội dung nào đang chờ xử lý — phần dưới đây (prompt Lượt 9) được
giữ lại làm **lịch sử tham chiếu** cho quy trình rà soát đã áp dụng, không phải việc cần làm tiếp.

<details>
<summary>Prompt đã dùng cho Lượt 9 — Final Review (đã hoàn thành, giữ lại tham khảo)</summary>

```
Toàn bộ kafka-study-pack/ (00-overview đến 08-learning-aids) đã có nội dung đầy đủ. Hãy thực hiện Lượt 9 —
Final Review theo đúng GENERATION-PLAN.md:

1. Rà toàn bộ pack theo QUALITY-CHECKLIST.md (mỗi file phải có mental model/trade-off/failure mode/anti-pattern
   hoặc tương đương theo đúng loại file — lesson/troubleshooting/pattern/decision-guide).
2. Kiểm tra tính nhất quán thuật ngữ, đối chiếu GLOSSARY.md — phát hiện thuật ngữ dùng không nhất quán hoặc
   thiếu định nghĩa.
3. Kiểm tra toàn bộ relative link trong mọi file .md không bị gãy (kể cả anchor link nội bộ file).
4. Kiểm tra không có file nào "quá chung chung" hoặc thiếu trade-off/anti-pattern/scenario so với yêu cầu gốc.
5. Kiểm tra không còn wording placeholder kiểu "sẽ mở rộng ở phần sau" trỏ tới nội dung đã tồn tại.
6. Kiểm tra không có diagram Mermaid nào chứa `\n` literal.
7. Cập nhật root README.md: bỏ nhãn "🚧 Đang sinh nội dung theo lượt / Blueprint" vì toàn bộ pack đã hoàn thiện,
   thay bằng trạng thái "hoàn thiện", giữ nguyên cấu trúc điều hướng.
8. Cập nhật bảng tiến độ trong GENERATION-PLAN.md (Lượt 9 → ✅ Done).

Thực hiện thay đổi thật trên disk, không chỉ báo cáo. Sau khi xong, tóm tắt: file nào đã sửa, lỗi gì đã tìm
thấy và đã fix, còn gì cần lưu ý.
```

</details>
