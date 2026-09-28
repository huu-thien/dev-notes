# Kafka vs RabbitMQ vs SQS vs Pulsar

## 🎯 Mục tiêu học

Sau khi đọc xong, bạn sẽ:
- So sánh được Kafka/RabbitMQ/SQS/Pulsar theo **tiêu chí design decision thực dụng**, không theo marketing hay
  "cái nào mới hơn".
- Biết chính xác **Kafka mạnh ở đâu** và **khi nào Kafka là overkill**.
- Hiểu sự khác biệt cốt lõi về **mô hình dữ liệu** (log bất biến vs hàng đợi tiêu thụ-và-xoá) — đây là gốc rễ
  của mọi khác biệt khác giữa các hệ thống này.
- Có được nguyên tắc quyết định nhanh: "nếu X, nên nghiêng về Y" thay vì phải nhớ bảng so sánh chi tiết.

## 📖 Mục lục

- [Mental model: log bất biến vs hàng đợi tiêu thụ-và-xoá](#-mental-model-log-bất-biến-vs-hàng-đợi-tiêu-thụ-và-xoá)
- [Kafka mạnh ở đâu](#-kafka-mạnh-ở-đâu)
- [RabbitMQ mạnh ở đâu](#-rabbitmq-mạnh-ở-đâu)
- [SQS mạnh ở đâu](#-sqs-mạnh-ở-đâu)
- [Pulsar mạnh ở đâu](#-pulsar-mạnh-ở-đâu)
- [Bảng so sánh thực dụng](#-bảng-so-sánh-thực-dụng)
- [If the interviewer/user says X, lean toward Y](#-if-the-interviewuser-says-x-lean-toward-y)
- [Key decisions](#-key-decisions)
- [Design trade-offs](#️-design-trade-offs)
- [Failure modes](#-failure-modes)
- [❌ Anti-patterns](#-anti-patterns)
- [🧪 Mini scenarios](#-mini-scenarios)
- [🎤 Interview lens](#-interview-lens)
- [✅ Key takeaways](#-key-takeaways)
- [🔗 Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 🧠 Mental model: log bất biến vs hàng đợi tiêu thụ-và-xoá

Khác biệt gốc rễ nhất, mọi khác biệt khác đều là hệ quả của điều này:

- **Kafka/Pulsar**: mô hình **append-only log**. Message **không bị xoá** khi được đọc — nó vẫn tồn tại theo
  chính sách retention, cho phép **nhiều consumer group độc lập đọc lại từ bất kỳ vị trí nào**, kể cả đọc lại
  từ đầu (replay).
- **RabbitMQ/SQS**: mô hình **hàng đợi tiêu thụ-và-xoá** (queue semantics). Message **bị xoá/ack** sau khi được
  consumer xử lý xong — mỗi message về bản chất chỉ được xử lý **1 lần bởi 1 consumer** (trong ngữ cảnh 1 hàng
  đợi cụ thể), không có khái niệm "nhiều consumer group đọc lại độc lập" tự nhiên như Kafka.

📌 Vì vậy: nếu bài toán cần **"nhiều bên độc lập cùng đọc 1 luồng sự kiện, có thể ở tốc độ khác nhau, có thể
cần replay lịch sử"** — đó là bài toán tự nhiên của Kafka/Pulsar. Nếu bài toán chỉ là **"phân phối công việc cho
1 worker xử lý, xong thì thôi"** — đó là bài toán tự nhiên của RabbitMQ/SQS, và ép Kafka vào đó thường là dùng
dao mổ trâu để giết gà (không sai kỹ thuật, nhưng tốn kém không cần thiết).

## 🚀 Kafka mạnh ở đâu

- **Throughput cực cao** với nhiều consumer độc lập cùng đọc (fan-out) — kiến trúc phân vùng + sequential I/O +
  zero-copy (xem [`../02-core-internals/05-storage-segments-indexes.md`](../02-core-internals/05-storage-segments-indexes.md))
  cho throughput vượt trội so với message broker truyền thống.
- **Replay/audit trail** — retention dài hạn, consumer mới có thể đọc lại toàn bộ lịch sử; đây là khả năng
  RabbitMQ/SQS không có tự nhiên (chúng xoá message sau khi ack).
- **Backbone cho streaming/event sourcing** — nền tảng cho Kafka Streams/ksqlDB xử lý luồng liên tục, không chỉ
  là message broker đơn thuần.
- **Ordering per-key ở quy mô lớn** — partition + key cho phép ordering tại quy mô hàng triệu message/giây, kết
  hợp cả throughput và ordering (trong phạm vi phù hợp) mà các hệ khác khó đạt được cùng lúc.

## 🐰 RabbitMQ mạnh ở đâu

- **Routing linh hoạt** — exchange types (direct, topic, fanout, headers) cho phép định tuyến message phức tạp
  dựa trên nội dung/routing key ngay tại broker, điều Kafka không có khái niệm tương đương (Kafka chỉ có
  topic/partition, logic routing phải làm ở tầng ứng dụng).
- **Queue semantics tự nhiên** — priority queue, message TTL cá nhân từng message, dead-lettering built-in, phù
  hợp tự nhiên cho bài toán **task queue/job processing** (worker pool xử lý công việc rồi thôi).
- **Độ trễ thấp cho khối lượng vừa phải** — với volume không cực cao, RabbitMQ thường đạt latency thấp hơn với
  cấu hình đơn giản hơn Kafka.
- **Đơn giản vận hành hơn ở quy mô nhỏ-vừa** — không cần tư duy partition/consumer group phức tạp, mô hình
  hàng đợi trực quan hơn cho use case task queue thuần tuý.

## ☁️ SQS mạnh ở đâu

- **Managed hoàn toàn, zero-ops** — không cần vận hành cluster, patch, scale broker; AWS quản lý toàn bộ hạ
  tầng, phù hợp team nhỏ hoặc muốn giảm tải vận hành tối đa.
- **Scale tự động, trả tiền theo dùng** — không cần ước lượng partition/broker capacity trước; SQS tự scale
  theo traffic, chi phí gắn với lượng message thực tế xử lý.
- **Tích hợp sâu trong hệ sinh thái AWS** — kết hợp tự nhiên với Lambda, SNS, các dịch vụ AWS khác mà không
  cần thêm cấu hình network/infra phức tạp.
- **Đủ tốt cho phần lớn bài toán task queue/decoupling đơn giản** — không cần throughput cực cao hay replay
  lịch sử, SQS giải quyết gọn với chi phí vận hành gần như bằng 0.

## 🐦 Pulsar mạnh ở đâu

- **Tách biệt compute (broker) và storage (BookKeeper)** — cho phép scale 2 chiều độc lập (thêm broker để tăng
  throughput xử lý mà không cần thêm storage node, và ngược lại) — Kafka gắn chặt broker với việc lưu trữ dữ
  liệu trên chính broker đó.
- **Hỗ trợ cả queue semantics và stream semantics trên cùng nền tảng** — Pulsar có khái niệm subscription mode
  linh hoạt hơn (exclusive, shared, failover, key_shared), cho phép mô phỏng cả hành vi giống RabbitMQ (shared,
  nhiều worker chia nhau task) lẫn giống Kafka (exclusive, đọc theo thứ tự) trên cùng 1 nền tảng.
- **Multi-tenancy native** — được thiết kế sẵn cho multi-tenant từ đầu (namespace, tenant là khái niệm cấp cao
  trong kiến trúc), phù hợp nền tảng SaaS cần cách ly nhiều khách hàng ở tầng hạ tầng messaging.
- **Geo-replication built-in mạnh hơn** — hỗ trợ replication đa vùng địa lý là tính năng native, trong khi
  Kafka cần thêm công cụ ngoài (MirrorMaker 2 hoặc tương đương) để đạt được tương tự.

## 📊 Bảng so sánh thực dụng

| Tiêu chí | Kafka | RabbitMQ | SQS | Pulsar |
|---|---|---|---|---|
| **Retention/replay** | Dài hạn, replay tự nhiên cho nhiều consumer | Không — message mất sau khi ack (trừ khi tự dựng thêm cơ chế) | Không — tối đa vài ngày, không thiết kế cho replay dài hạn | Dài hạn, tương tự Kafka (tách biệt storage layer) |
| **Throughput** | Rất cao (được tối ưu cho throughput là ưu tiên số 1) | Cao vừa phải, giảm khi cần routing phức tạp | Cao, nhưng có giới hạn cấu hình (batch size, throughput theo queue) quản lý bởi AWS | Rất cao, tương đương Kafka |
| **Ordering semantics** | Per-partition, per-key (mạnh, kiểm soát được) | Per-queue (đơn giản hơn, ít linh hoạt hơn cho ordering theo entity) | FIFO queue có nhưng giới hạn throughput đáng kể so với standard queue | Per-partition tương tự Kafka, thêm `key_shared` subscription linh hoạt |
| **Ops burden** | Cao — cần hiểu partition, consumer group, ISR, tuning | Trung bình — đơn giản hơn Kafka nhưng vẫn cần tự vận hành cluster | Rất thấp — hoàn toàn managed | Cao — kiến trúc phức tạp hơn Kafka (2 lớp broker + bookkeeper) |
| **Queue semantics (priority, per-message TTL, easy routing)** | Yếu — không có khái niệm native, phải tự làm ở tầng ứng dụng | Rất mạnh — đây là thế mạnh cốt lõi | Có (FIFO/standard, visibility timeout, DLQ built-in) | Có qua subscription mode, không mạnh bằng RabbitMQ về routing phức tạp |
| **Managed experience** | Có (Confluent Cloud, MSK...) nhưng vẫn cần hiểu khái niệm Kafka để vận hành hiệu quả | Có managed option nhưng ít phổ biến bằng | Native managed, không có "phiên bản tự vận hành" phổ biến | Có managed option (StreamNative...) nhưng hệ sinh thái nhỏ hơn Kafka |
| **Ecosystem** | Rất lớn (Kafka Connect, Streams, ksqlDB, Schema Registry) | Vừa phải, tập trung vào messaging pattern | Nhỏ nhưng tích hợp sâu AWS | Đang phát triển, nhỏ hơn Kafka đáng kể |

## 🧭 If the interviewer/user says X, lean toward Y

| Nếu nghe thấy... | Nên nghiêng về |
|---|---|
| "Cần audit trail, replay lại toàn bộ lịch sử sự kiện" | **Kafka** hoặc **Pulsar** |
| "Chỉ cần phân phối job cho worker pool, xử lý xong thì thôi, cần routing phức tạp theo nội dung" | **RabbitMQ** |
| "Team nhỏ, không muốn vận hành hạ tầng messaging, đã dùng AWS sẵn" | **SQS** |
| "Cần throughput cực cao + nhiều consumer độc lập đọc cùng luồng dữ liệu" | **Kafka** hoặc **Pulsar** |
| "Cần multi-tenancy native ở tầng hạ tầng messaging, hoặc cần tách độc lập compute/storage" | **Pulsar** |
| "Chỉ cần decouple 2 service đơn giản, volume thấp, không cần replay" | **SQS** hoặc **RabbitMQ** — Kafka là overkill |
| "Cần streaming analytics pipeline (window, join, aggregate liên tục)" | **Kafka** (nhờ Kafka Streams/ksqlDB) |
| "Cần FIFO tuyệt đối cho toàn bộ hàng đợi, không cần throughput cao" | **SQS FIFO** hoặc **RabbitMQ** — đơn giản hơn Kafka nhiều cho nhu cầu hẹp này |

## 🧭 Key decisions

1. **Xác định mô hình dữ liệu cần thiết trước** (log replay được vs hàng đợi tiêu thụ-xoá) — đây là câu hỏi
   quyết định 80% việc chọn công cụ, các tiêu chí còn lại chỉ là tinh chỉnh trong nhóm đã chọn.
2. **Đánh giá ops burden mà team sẵn sàng gánh** — Kafka/Pulsar đòi hỏi hiểu biết vận hành sâu hơn hẳn SQS; nếu
   team không có năng lực/thời gian vận hành, managed service (SQS, hoặc Kafka managed như MSK/Confluent Cloud)
   là lựa chọn thực dụng hơn tự vận hành.
3. **Không chọn công cụ vì "công ty lớn dùng nó"** — throughput/replay/ecosystem của Kafka chỉ có giá trị nếu
   bài toán thực sự cần, nếu không chỉ là chi phí vận hành thừa.
4. **Cân nhắc chi phí dài hạn, không chỉ chi phí ban đầu** — SQS rẻ và đơn giản lúc đầu nhưng chi phí có thể
   tăng nhanh ở volume cực cao; Kafka tốn công vận hành ban đầu nhưng chi phí biên thấp hơn ở quy mô lớn.

## ⚖️ Design trade-offs

- ✅ Kafka → throughput/replay/ecosystem mạnh nhất trong nhóm.
  ❌ Đổi lại: ops burden cao nhất, cần đội ngũ hiểu sâu partition/consumer group/tuning để vận hành hiệu quả.
- ✅ RabbitMQ → routing linh hoạt, queue semantics tự nhiên, đơn giản hơn cho task queue.
  ❌ Đổi lại: không có replay tự nhiên, throughput trần thấp hơn Kafka ở quy mô rất lớn.
- ✅ SQS → gần như zero-ops, scale tự động.
  ❌ Đổi lại: không replay dài hạn, ít linh hoạt về ordering/routing phức tạp, gắn chặt hệ sinh thái AWS.
- ✅ Pulsar → kiến trúc linh hoạt nhất (tách compute/storage, multi-tenancy, đa mô hình subscription).
  ❌ Đổi lại: hệ sinh thái nhỏ hơn Kafka, ops burden cao (kiến trúc phức tạp hơn), khó tuyển người có kinh
  nghiệm vận hành hơn Kafka.

## 🚨 Failure modes

| Sự kiện | Nguyên nhân | Hệ quả |
|---|---|---|
| Team nhỏ kiệt sức vì vận hành Kafka cluster | Chọn Kafka cho use case volume thấp, không cần replay/throughput cao | Chi phí vận hành vượt xa giá trị nhận được, đáng lẽ SQS/RabbitMQ đã đủ |
| Không thể replay dữ liệu khi cần rebuild service | Chọn SQS/RabbitMQ cho luồng dữ liệu cần audit/event sourcing dài hạn | Phải thiết kế lại toàn bộ tầng messaging giữa chừng dự án, chi phí migrate lớn |
| Chi phí SQS tăng vọt không kiểm soát | Volume tăng đột biến vượt xa ước lượng ban đầu, chi phí theo message tích luỹ nhanh | Cần đánh giá lại kiến trúc, có thể phải chuyển sang Kafka/Pulsar ở quy mô lớn hơn |
| Logic routing phức tạp bị "giả lập" tốn công trên Kafka | Chọn Kafka nhưng nghiệp vụ cần routing theo nội dung phức tạp như RabbitMQ có sẵn | Phải tự viết logic routing ở tầng ứng dụng, tốn công phát triển không cần thiết |

## ❌ Anti-patterns

### ❌ Chọn Kafka chỉ vì hype
**Biểu hiện:** chọn Kafka cho 1 hệ thống nhỏ, volume thấp, không cần replay, chỉ vì "công ty lớn nào cũng dùng
Kafka" hoặc "nghe nói Kafka mạnh".
**Tại sao người ta hay làm vậy:** Kafka có danh tiếng lớn trong ngành, dễ tạo cảm giác "chọn Kafka là an toàn/
đúng chuẩn", đặc biệt với kỹ sư ít kinh nghiệm muốn học công nghệ "hot".
**Tại sao nó là vấn đề:** trả chi phí vận hành (hiểu partition, consumer group, tuning, monitoring) cho một bài
toán mà SQS/RabbitMQ giải quyết gọn hơn nhiều với ops burden thấp hơn hẳn — không có lợi ích tương xứng với chi
phí bỏ ra.
**Thay vào đó nên làm:** ✅ Luôn bắt đầu từ câu hỏi "bài toán này có thực sự cần replay/throughput cực cao/nhiều
consumer độc lập không", chọn công cụ dựa trên nhu cầu, không dựa trên độ phổ biến.

### ❌ Chọn RabbitMQ khi cần replay/streaming backbone
**Biểu hiện:** dùng RabbitMQ cho luồng dữ liệu cần audit trail dài hạn hoặc cần nhiều consumer group độc lập
đọc lại lịch sử (ví dụ event sourcing, CDC pipeline).
**Tại sao người ta hay làm vậy:** team đã quen thuộc RabbitMQ từ dự án trước, muốn tái sử dụng kiến thức/hạ
tầng sẵn có mà không đánh giá lại nhu cầu replay của bài toán mới.
**Tại sao nó là vấn đề:** RabbitMQ xoá message sau khi ack — không có cách tự nhiên để "replay" lại toàn bộ
lịch sử cho consumer mới join sau; phải tự dựng thêm cơ chế lưu trữ riêng (ghi log ra DB song song) để bù đắp,
tốn công và dễ lệch dữ liệu giữa 2 hệ thống.
**Thay vào đó nên làm:** ✅ Chọn Kafka/Pulsar ngay từ đầu nếu biết trước nhu cầu replay/audit là yêu cầu cốt
lõi, không cố "vá" RabbitMQ để làm việc nó không được thiết kế cho.

### ❌ Chọn SQS khi cần rich event log/replay semantics
**Biểu hiện:** dùng SQS cho luồng dữ liệu cần nhiều consumer group độc lập đọc cùng 1 sự kiện theo tốc độ khác
nhau, hoặc cần giữ lịch sử dài hạn để phân tích sau này.
**Tại sao người ta hay làm vậy:** SQS đã có sẵn trong hệ sinh thái AWS, "tiện" dùng luôn mà không đánh giá giới
hạn retention (tối đa vài ngày) và mô hình tiêu thụ-và-xoá của nó.
**Tại sao nó là vấn đề:** khi cần thêm 1 consumer mới muốn đọc lại dữ liệu cũ, hoặc cần audit lại chuỗi sự kiện
đã xảy ra, SQS không có cơ chế nào hỗ trợ — dữ liệu đã mất vĩnh viễn sau retention window ngắn.
**Thay vào đó nên làm:** ✅ Đánh giá nhu cầu replay/audit **trước khi** chọn SQS; nếu có, cân nhắc Kafka/Pulsar
hoặc kết hợp SQS (cho phân phối nhanh) với 1 kho lưu trữ event log riêng (nếu vẫn muốn giữ SQS cho phần task
queue).

### ❌ So sánh tool mà quên operating model của team
**Biểu hiện:** chọn công cụ dựa hoàn toàn trên bảng so sánh tính năng kỹ thuật (throughput, latency, ordering),
bỏ qua hoàn toàn năng lực vận hành thực tế của team (số lượng kỹ sư, kinh nghiệm sẵn có, khả năng on-call).
**Tại sao người ta hay làm vậy:** đánh giá công nghệ thường tập trung vào specs/benchmark, dễ quên rằng công cụ
mạnh nhất về specs không có giá trị nếu team không đủ năng lực vận hành nó đúng cách.
**Tại sao nó là vấn đề:** một team 3 kỹ sư không có kinh nghiệm vận hành Kafka production sẽ gặp nhiều sự cố
vận hành hơn (rebalance storm, ISR shrink không phát hiện kịp, tuning sai) so với việc dùng SQS managed dù SQS
"kém mạnh hơn" về specs thuần tuý.
**Thay vào đó nên làm:** ✅ Luôn đưa "năng lực vận hành hiện tại của team" vào tiêu chí quyết định ngang hàng với
tiêu chí kỹ thuật thuần tuý, không tách rời 2 yếu tố này.

## 🧪 Mini scenarios

**Scenario 1 — Task queue:**
Hệ thống xử lý ảnh upload: nhận request, đẩy job vào hàng đợi, 1 pool worker xử lý resize/watermark rồi lưu kết
quả, không cần ai khác đọc lại lịch sử job đã xử lý. Chọn **SQS** (nếu đã ở AWS, muốn zero-ops) hoặc
**RabbitMQ** (nếu cần routing phức tạp theo loại ảnh/độ ưu tiên) — Kafka ở đây là lựa chọn thừa, không mang lại
giá trị replay/throughput nào được tận dụng cho bài toán thuần task queue này.

**Scenario 2 — Event backbone:**
Nền tảng thương mại điện tử với 8 microservices cần fan-out sự kiện order/payment/inventory tới nhiều consumer
độc lập, cần audit trail cho compliance tài chính, và cần khả năng rebuild service mới bằng cách replay lịch
sử. Chọn **Kafka** — đúng bài toán cốt lõi mà Kafka được thiết kế để giải quyết (nhiều consumer độc lập +
replay + throughput cao).

**Scenario 3 — Managed cloud workload:**
Startup 4 người, đã dùng toàn bộ hạ tầng AWS (Lambda, DynamoDB), cần decouple 2 service đơn giản (nhận đơn
hàng → gửi thông báo), không có ai chuyên trách vận hành hạ tầng messaging. Chọn **SQS** — zero-ops, tích hợp
sẵn với Lambda, chi phí vận hành gần như bằng 0, đủ dùng cho quy mô và nhu cầu hiện tại; triển khai Kafka ở đây
là gánh nặng vận hành không tương xứng với lợi ích.

**Scenario 4 — Streaming analytics pipeline:**
Hệ thống cần tính toán real-time aggregation (doanh thu theo cửa hàng mỗi 5 phút, join dữ liệu order với dữ
liệu khuyến mãi đang active) trên luồng sự kiện liên tục volume cao. Chọn **Kafka** kết hợp **Kafka Streams**
(sẽ mở rộng ở `04-ecosystem`) — đây là bài toán stream processing đúng nghĩa, vượt xa khả năng của cả
RabbitMQ/SQS (không có concept xử lý luồng liên tục built-in) và cần hệ sinh thái xử lý luồng mà chỉ Kafka/
Pulsar cung cấp đầy đủ.

## 🎤 Interview lens

**"Vì sao chọn Kafka thay vì RabbitMQ/SQS cho hệ thống này?"**
> Câu trả lời yếu: liệt kê ưu điểm chung chung của Kafka ("throughput cao, phổ biến"). Câu trả lời tốt phải
> **gắn trực tiếp** với đặc điểm bài toán cụ thể: có cần replay không, có bao nhiêu consumer độc lập, throughput
> thực tế là bao nhiêu, và **thẳng thắn cân nhắc chi phí vận hành** — nếu bài toán không thực sự cần các đặc
> tính đó, câu trả lời tốt nhất có khi là "RabbitMQ/SQS đủ dùng, Kafka ở đây là overkill".

**"Bạn sẽ trả lời sao nếu ai đó nói 'cứ dùng Kafka cho mọi thứ vì nó mạnh nhất'?"**
> Đây là câu hỏi test tư duy phản biện, không phải kiến thức thuần. Câu trả lời tốt phải chỉ ra: "mạnh nhất" về
> specs không đồng nghĩa "phù hợp nhất" — ops burden của Kafka là chi phí thật, và với bài toán không cần
> replay/throughput cực cao, chi phí đó không có gì bù đắp lại; công cụ phù hợp là công cụ khớp với đặc điểm
> bài toán, không phải công cụ mạnh nhất trên giấy tờ.

## ✅ Key takeaways

- Khác biệt gốc rễ: Kafka/Pulsar là log bất biến (replay được, nhiều consumer độc lập); RabbitMQ/SQS là hàng
  đợi tiêu thụ-và-xoá (1 lần xử lý, không replay tự nhiên).
- Kafka mạnh nhất khi cần đồng thời: throughput cao, nhiều consumer độc lập, replay/audit trail, streaming
  processing — không phải "mạnh nhất" cho mọi use case.
- RabbitMQ thắng ở routing linh hoạt và queue semantics tự nhiên cho task queue; SQS thắng ở zero-ops và tích
  hợp AWS; Pulsar thắng ở kiến trúc tách compute/storage và multi-tenancy native.
- Quyết định chọn công cụ phải cân bằng giữa nhu cầu kỹ thuật thực tế **và** năng lực vận hành thực tế của
  team — không chỉ dựa vào bảng so sánh tính năng.
- Anti-pattern phổ biến nhất là chọn công cụ theo độ phổ biến/hype thay vì đối chiếu đặc điểm bài toán cụ thể.

## 🔗 Xem tiếp / Liên kết liên quan

- Trước đó: [`08-kafka-for-microservices.md`](08-kafka-for-microservices.md).
- [`../00-overview/`](../00-overview/README.md) — nhắc lại khi nào nên/không nên dùng Kafka nói chung.
- [`../04-ecosystem/03-kafka-streams.md`](../04-ecosystem/03-kafka-streams.md) và
  [`../04-ecosystem/04-ksqldb.md`](../04-ecosystem/04-ksqldb.md) — liên quan tới scenario streaming analytics.
- [`../GLOSSARY.md`](../GLOSSARY.md) — tra cứu thuật ngữ liên quan.
