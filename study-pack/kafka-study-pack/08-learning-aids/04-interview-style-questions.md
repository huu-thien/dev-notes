# Interview-Style Questions

## 🎯 Mục tiêu học
Bộ câu hỏi luyện tư duy trả lời phỏng vấn — không phải FAQ lý thuyết. Mỗi câu có: câu trả lời yếu nghe như thế
nào, câu trả lời mạnh cần đề cập gì, và hướng đào sâu nếu interviewer hỏi tiếp. Không viết đáp án đầy đủ để
tránh trùng lặp — link về file gốc để ôn chi tiết.

## 📖 Mục lục
- [Nhóm 1: Kafka là gì / khác queue ở đâu](#nhóm-1-kafka-là-gì--khác-queue-ở-đâu)
- [Nhóm 2: Topic / partition / offset](#nhóm-2-topic--partition--offset)
- [Nhóm 3: Consumer group scaling](#nhóm-3-consumer-group-scaling)
- [Nhóm 4: Ordering](#nhóm-4-ordering)
- [Nhóm 5: Delivery semantics / idempotence / EOS](#nhóm-5-delivery-semantics--idempotence--eos)
- [Nhóm 6: Retention / compaction](#nhóm-6-retention--compaction)
- [Nhóm 7: Hot partitions](#nhóm-7-hot-partitions)
- [Nhóm 8: Lag / backpressure](#nhóm-8-lag--backpressure)
- [Nhóm 9: Schema compatibility](#nhóm-9-schema-compatibility)
- [Nhóm 10: Retry / DLQ](#nhóm-10-retry--dlq)
- [Nhóm 11: Kafka vs RabbitMQ / SQS / Pulsar](#nhóm-11-kafka-vs-rabbitmq--sqs--pulsar)
- [Nhóm 12: Kafka trong microservices](#nhóm-12-kafka-trong-microservices)
- [Nhóm 13: CDC / Debezium](#nhóm-13-cdc--debezium)
- [Nhóm 14: Operational incidents](#nhóm-14-operational-incidents)
- [Nhóm 15: Security / upgrade / compatibility](#nhóm-15-security--upgrade--compatibility)

---

## Nhóm 1: Kafka là gì / khác queue ở đâu

**Q: Kafka khác gì so với một message queue truyền thống như RabbitMQ?**

- 🔴 Câu trả lời yếu: "Kafka nhanh hơn và scale tốt hơn RabbitMQ."
- 🟢 Câu trả lời mạnh cần nhắc: mô hình log bất biến vs hàng đợi tiêu thụ-xoá, khả năng nhiều consumer group
  đọc lại độc lập cùng dữ liệu, replay theo offset, và **đánh đổi** (Kafka phức tạp hơn để vận hành, không có
  routing phong phú như RabbitMQ).
- 🔎 Đào sâu: interviewer có thể hỏi tiếp "vậy khi nào bạn vẫn chọn RabbitMQ thay vì Kafka?" — trả lời tốt phải
  nêu được tình huống cụ thể, không chỉ nói "Kafka luôn tốt hơn".

📎 [`00-overview/01-what-is-kafka.md`](../00-overview/01-what-is-kafka.md),
[`03-design-and-architecture/09-kafka-vs-rabbitmq-vs-sqs-pulsar.md`](../03-design-and-architecture/09-kafka-vs-rabbitmq-vs-sqs-pulsar.md)

## Nhóm 2: Topic / partition / offset

**Q: Partition ảnh hưởng thế nào đến parallelism và ordering?**

- 🔴 Câu trả lời yếu: "Partition càng nhiều thì càng nhanh."
- 🟢 Câu trả lời mạnh cần nhắc: partition là unit song song hoá của cả producer lẫn consumer, là ranh giới
  ordering (chỉ đảm bảo order trong 1 partition), và có **trade-off** — tăng partition không miễn phí (overhead
  metadata, khó giảm sau, tăng số connection/file handle).
- 🔎 Đào sâu: hỏi ngược "bạn ước lượng số partition ban đầu dựa trên yếu tố gì?" cho thấy đã từng thực hành
  thật, không chỉ học lý thuyết.

📎 [`03-design-and-architecture/02-partition-strategy.md`](../03-design-and-architecture/02-partition-strategy.md)

## Nhóm 3: Consumer group scaling

**Q: Nếu tôi có 20 partition và thêm consumer thứ 21 vào group, chuyện gì xảy ra?**

- 🔴 Câu trả lời yếu: "Consumer 21 sẽ giúp xử lý nhanh hơn."
- 🟢 Câu trả lời mạnh cần nhắc: consumer 21 sẽ **idle** vì mỗi partition chỉ gán cho 1 consumer trong group tại
  1 thời điểm — parallelism bị giới hạn cứng bởi số partition, không phải số consumer.
- 🔎 Đào sâu: "vậy muốn scale hơn 20 thì phải làm gì?" — câu trả lời tốt phải nói đến tăng partition (và hệ quả
  của nó, không phải free lunch).

📎 [`01-foundation/06-consumer-groups.md`](../01-foundation/06-consumer-groups.md)

## Nhóm 4: Ordering

**Q: Làm sao đảm bảo thứ tự xử lý cho các event của cùng 1 đơn hàng?**

- 🔴 Câu trả lời yếu: "Kafka tự đảm bảo thứ tự."
- 🟢 Câu trả lời mạnh cần nhắc: phải dùng `orderId` làm key để mọi event của đơn hàng đó luôn vào cùng 1
  partition; đồng thời chỉ ra **trade-off**: mọi event của 1 order giờ giới hạn trong throughput của 1
  partition, và nếu `orderId` phân bố không đều (VD: 1 order lớn có rất nhiều event) có thể gây hot partition.
- 🔎 Đào sâu: "vậy nếu cần global ordering toàn hệ thống thì sao?" — câu trả lời mạnh phải chỉ ra đây gần như
  luôn đánh đổi bằng việc bỏ hết parallelism (1 partition duy nhất), và nên hỏi ngược "có thực sự cần global
  order hay chỉ cần order theo 1 phạm vi hẹp hơn?" để thể hiện tư duy trưởng thành.

📎 [`03-design-and-architecture/06-ordering-vs-scalability-tradeoffs.md`](../03-design-and-architecture/06-ordering-vs-scalability-tradeoffs.md)

## Nhóm 5: Delivery semantics / idempotence / EOS

**Q: Exactly-once trong Kafka có nghĩa là gì? Nó có bảo vệ toàn bộ hệ thống không?**

- 🔴 Câu trả lời yếu: "Exactly-once nghĩa là message không bao giờ bị duplicate hay mất, chấm hết."
- 🟢 Câu trả lời mạnh cần nhắc: EOS chỉ đảm bảo trong **phạm vi Kafka-to-Kafka** (producer→topic→Streams/
  consumer→topic khác trong cùng transaction). Nếu consumer gọi API ngoài hoặc ghi DB ngoài Kafka, EOS
  **không** bảo vệ side effect đó — vẫn cần idempotency ở tầng application.
- 🔎 Đào sâu: interviewer thường test xem ứng viên có phân biệt được "exactly-once delivery" và "exactly-once
  processing effect" hay không — đây là điểm phân biệt junior và senior rõ rệt nhất trong nhóm câu hỏi này.

📎 [`02-core-internals/06-exactly-once-idempotence-transactions.md`](../02-core-internals/06-exactly-once-idempotence-transactions.md)

## Nhóm 6: Retention / compaction

**Q: Compaction khác retention thế nào, và khi nào bạn chọn mỗi loại?**

- 🔴 Câu trả lời yếu: "Compaction là một loại retention lâu hơn."
- 🟢 Câu trả lời mạnh cần nhắc: retention xoá theo tuổi/dung lượng bất kể key, compaction giữ bản ghi mới nhất
  theo từng key và xoá bản cũ hơn cùng key; chọn compaction cho "current state" (changelog, CDC snapshot table),
  chọn retention cho "event history" cần replay đầy đủ; và cả hai có thể bật cùng lúc (`compact,delete`).
- 🔎 Đào sâu: "điều gì xảy ra nếu bật compaction cho topic audit log?" — câu trả lời mạnh phải chỉ ra mất event
  trung gian, chỉ còn state cuối cùng theo key.

📎 [`01-foundation/11-retention-compaction.md`](../01-foundation/11-retention-compaction.md)

## Nhóm 7: Hot partitions

**Q: Bạn phát hiện 1 partition có lag rất cao trong khi các partition khác bình thường. Bạn sẽ làm gì?**

- 🔴 Câu trả lời yếu: "Tăng số lượng consumer lên."
- 🟢 Câu trả lời mạnh cần nhắc: trước tiên xác nhận đây là hot partition (không phải thiếu consumer nói chung),
  kiểm tra key distribution (tenant/key skew), rồi mới bàn hướng sửa: composite key, hoặc chấp nhận relax
  ordering ở phạm vi hẹp để phân tán traffic — không chỉ thêm consumer vì consumer thêm sẽ idle.
- 🔎 Đào sâu: "tại sao thêm consumer không giúp gì ở đây?" — trả lời đúng: 1 partition chỉ được xử lý bởi đúng 1
  consumer trong group, dù group có bao nhiêu consumer.

📎 [`06-troubleshooting/02-hot-partitions.md`](../06-troubleshooting/02-hot-partitions.md)

## Nhóm 8: Lag / backpressure

**Q: Lag tăng nghĩa là gì, và bạn chẩn đoán nguyên nhân như thế nào?**

- 🔴 Câu trả lời yếu: "Lag tăng nghĩa là consumer chậm, cần scale consumer."
- 🟢 Câu trả lời mạnh cần nhắc: lag là **symptom**, phải phân biệt cause family (consumer chậm thật, hot
  partition, rebalance storm, burst traffic, downstream chậm, config poll/fetch); và phân biệt lag theo record
  vs lag theo thời gian vì cùng 1 con số lag record có ý nghĩa khác nhau tuỳ throughput.
- 🔎 Đào sâu: interviewer có thể đưa dữ liệu cụ thể (VD: lag đều mọi partition + processing time tăng) để xem
  ứng viên có suy luận đúng cause family không, thay vì trả lời chung chung.

📎 [`06-troubleshooting/01-high-consumer-lag.md`](../06-troubleshooting/01-high-consumer-lag.md)

## Nhóm 9: Schema compatibility

**Q: Schema Registry giúp gì, và nó không giúp được gì?**

- 🔴 Câu trả lời yếu: "Schema Registry đảm bảo schema luôn tương thích, không bao giờ lỗi."
- 🟢 Câu trả lời mạnh cần nhắc: Registry chặn thay đổi **không tương thích về cấu trúc** theo rule đã cấu hình
  (backward/forward/full), nhưng không chặn được thay đổi **ý nghĩa nghiệp vụ** của field (VD: đổi đơn vị tiền
  tệ mà không đổi type) — vẫn cần review/communication liên team.
- 🔎 Đào sâu: "vậy backward compatible nghĩa là ai được nâng cấp trước?" — trả lời đúng: consumer mới đọc được
  data cũ, nên **consumer nâng cấp trước**.

📎 [`04-ecosystem/02-schema-registry.md`](../04-ecosystem/02-schema-registry.md)

## Nhóm 10: Retry / DLQ

**Q: Thiết kế retry + DLQ cho 1 consumer xử lý payment event như thế nào?**

- 🔴 Câu trả lời yếu: "Retry vài lần, không được thì đẩy vào DLQ."
- 🟢 Câu trả lời mạnh cần nhắc: phân biệt lỗi tạm thời (retry có backoff, giới hạn số lần, dùng retry topic
  riêng để không block message khác) và lỗi vĩnh viễn (đẩy DLQ ngay); quan trọng nhất — DLQ phải đi kèm kế
  hoạch giám sát/replay, nếu không sẽ trở thành "nghĩa địa message".
- 🔎 Đào sâu: "làm sao đảm bảo retry không phá vỡ ordering của payment theo account?" — đây là câu hỏi nâng cao
  kết hợp cả nhóm ordering lẫn nhóm retry/DLQ.

📎 [`03-design-and-architecture/07-retry-dlq-idempotency.md`](../03-design-and-architecture/07-retry-dlq-idempotency.md)

## Nhóm 11: Kafka vs RabbitMQ / SQS / Pulsar

**Q: Khi nào bạn sẽ KHÔNG chọn Kafka dù team đã quen dùng nó?**

- 🔴 Câu trả lời yếu: "Kafka luôn là lựa chọn tốt nhất cho mọi hệ thống event-driven."
- 🟢 Câu trả lời mạnh cần nhắc: nếu chỉ cần task queue đơn giản không cần replay (SQS/RabbitMQ nhẹ và dễ vận
  hành hơn), cần routing phức tạp built-in (RabbitMQ), team không đủ nguồn lực vận hành cluster (SQS managed),
  hoặc cần multi-tenancy/isolation mạnh hơn ở mức broker (Pulsar).
- 🔎 Đào sâu: đây là câu hỏi test khả năng **không giáo điều** — interviewer đang tìm dấu hiệu ứng viên hiểu
  trade-off thật, không chỉ lặp lại buzzword "Kafka scale tốt hơn".

📎 [`03-design-and-architecture/09-kafka-vs-rabbitmq-vs-sqs-pulsar.md`](../03-design-and-architecture/09-kafka-vs-rabbitmq-vs-sqs-pulsar.md)

## Nhóm 12: Kafka trong microservices

**Q: Khi nào dùng Kafka làm backbone giao tiếp giữa các microservice là hợp lý, khi nào là overkill?**

- 🔴 Câu trả lời yếu: "Microservices nên luôn giao tiếp qua Kafka để decoupled."
- 🟢 Câu trả lời mạnh cần nhắc: hợp lý khi cần fan-out event tới nhiều consumer độc lập, chấp nhận eventual
  consistency, cần audit/replay; overkill khi cần response đồng bộ ngay, hoặc hệ thống chỉ có 2 service giao
  tiếp 1-1 đơn giản — lúc đó thêm Kafka chỉ tăng độ phức tạp vận hành và độ trễ debug.
- 🔎 Đào sâu: "event-driven everywhere có vấn đề gì?" — trả lời tốt phải nhắc tới khó trace flow, khó debug
  end-to-end, và chi phí vận hành tăng theo số topic/consumer.

📎 [`03-design-and-architecture/08-kafka-for-microservices.md`](../03-design-and-architecture/08-kafka-for-microservices.md)

## Nhóm 13: CDC / Debezium

**Q: Có nên dùng row change từ Debezium trực tiếp làm business event cho service khác không?**

- 🔴 Câu trả lời yếu: "Được, CDC event chính là business event, tiết kiệm code."
- 🟢 Câu trả lời mạnh cần nhắc: row change là sự kiện kỹ thuật tầng lưu trữ, không phải business event — cần
  lớp enrichment/transform để chuyển đổi, tránh rò rỉ cấu trúc bảng nội bộ ra ngoài và tránh vỡ consumer khi
  schema DB đổi.
- 🔎 Đào sâu: "outbox pattern giải quyết vấn đề gì mà CDC trực tiếp không giải quyết được?" — câu trả lời tốt
  phải nhắc tới dual-write problem và cách outbox tránh nó.

📎 [`04-ecosystem/05-debezium-cdc.md`](../04-ecosystem/05-debezium-cdc.md),
[`07-patterns-and-anti-patterns/01-good-patterns.md`](../07-patterns-and-anti-patterns/01-good-patterns.md)

## Nhóm 14: Operational incidents

**Q: Bạn nhận alert rebalance liên tục (rebalance storm) lúc 2 giờ sáng. Bạn tiếp cận thế nào?**

- 🔴 Câu trả lời yếu: "Restart lại consumer service."
- 🟢 Câu trả lời mạnh cần nhắc: trước tiên xác định cause family (member churn do autoscaling, poll loop xử lý
  quá lâu vượt `max.poll.interval.ms`, deploy pattern restart cả fleet cùng lúc), tránh hành động vội (restart
  cả fleet lại **gây thêm** storm), rồi mới áp dụng fix theo đúng nguyên nhân.
- 🔎 Đào sâu: "restart cả fleet cùng lúc để fix có ổn không?" — trả lời đúng: không, đây chính là nguyên nhân
  phổ biến gây storm, nên rolling restart từng phần.

📎 [`06-troubleshooting/05-rebalance-storms.md`](../06-troubleshooting/05-rebalance-storms.md)

## Nhóm 15: Security / upgrade / compatibility

**Q: Nâng cấp Kafka cluster có rủi ro gì cần lưu ý ngoài việc "chạy đúng lệnh upgrade"?**

- 🔴 Câu trả lời yếu: "Chỉ cần cài version mới lên từng broker là xong."
- 🟢 Câu trả lời mạnh cần nhắc: rolling upgrade để tránh downtime, kiểm tra tương thích protocol version giữa
  client cũ và broker mới, tách biệt trục "app compatibility" và "schema compatibility" (2 trục độc lập),
  chiến lược canary/staged rollout và khả năng rollback nếu phát hiện vấn đề.
- 🔎 Đào sâu: "nếu phải rollback giữa chừng thì sao?" — trả lời tốt phải nói rõ rollback phức tạp hơn upgrade
  (dữ liệu mới có thể đã dùng feature chỉ version mới hỗ trợ).

📎 [`05-operations/07-upgrades-and-compatibility.md`](../05-operations/07-upgrades-and-compatibility.md),
[`05-operations/06-security-authentication-authorization-encryption.md`](../05-operations/06-security-authentication-authorization-encryption.md)

## 🔗 Xem tiếp / Liên kết liên quan
- ⬅️ Về index: [`README.md`](README.md)
- ⬅️ Sai lầm phổ biến: [`03-common-mistakes.md`](03-common-mistakes.md)
- ⬅️ Ra quyết định nhanh: [`02-decision-guide.md`](02-decision-guide.md)
