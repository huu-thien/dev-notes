# Monitoring and Alerting

## 🎯 Mục tiêu học

Sau khi đọc xong, bạn sẽ:
- Biết chính xác **metric nào đáng theo dõi thật sự** ở từng tầng (broker, topic, partition, consumer) — không
  phải "theo dõi mọi thứ có thể đo được".
- Hiểu cách đọc **lag đúng cách** — và vì sao nhìn lag một mình dễ dẫn tới kết luận sai.
- Phân biệt được **throughput, latency, và queueing signal** — 3 loại tín hiệu dễ bị gộp lẫn.
- Biết cách thiết kế alerting **có ý nghĩa hành động**, tránh alert fatigue.

## 📖 Mục lục

- [Mental model: golden signals cho Kafka](#-mental-model-golden-signals-cho-kafka)
- [Bảng: metric/signal → why it matters → common misunderstanding](#-bảng-metricsignal--why-it-matters--common-misunderstanding)
- [Lag nhìn thế nào cho đúng](#-lag-nhìn-thế-nào-cho-đúng)
- [Throughput vs latency vs queueing signals](#-throughput-vs-latency-vs-queueing-signals)
- [ISR-related signals](#-isr-related-signals)
- [Bảng: alert → likely meaning → next investigation step](#-bảng-alert--likely-meaning--next-investigation-step)
- [Key mechanics](#-key-mechanics)
- [Key decisions](#-key-decisions)
- [Trade-offs](#️-trade-offs)
- [Failure modes](#-failure-modes)
- [Debugging hints](#-debugging-hints)
- [Operational implications](#-operational-implications)
- [❌ Anti-patterns](#-anti-patterns)
- [🧪 Mini scenarios](#-mini-scenarios)
- [🎤 Interview lens](#-interview-lens)
- [✅ Key takeaways](#-key-takeaways)
- [🔗 Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 🧠 Mental model: golden signals cho Kafka

Áp dụng tư duy "golden signals" (latency, traffic, errors, saturation) vào Kafka, nhưng phải cụ thể hoá theo
**4 tầng** vì mỗi tầng có tín hiệu ý nghĩa khác nhau:

- **Broker-level**: sức khoẻ hạ tầng (disk, network, CPU, request queue, under-replicated partitions).
- **Topic-level**: hành vi tổng thể của 1 luồng dữ liệu (throughput ghi/đọc, message size trung bình).
- **Partition-level**: phân bổ tải **có đều không** (đây là tầng dễ bị bỏ qua nhất, nhưng lại là nơi hot
  partition/skew lộ ra rõ nhất).
- **Consumer-level**: khả năng theo kịp của phía tiêu thụ (lag, rebalance frequency, process time).

📌 Nguyên tắc quan trọng: **1 metric ở 1 tầng, đọc riêng lẻ, hầu như luôn gây hiểu lầm**. Ví dụ lag tăng ở tầng
consumer có thể do nguyên nhân ở tầng broker (disk chậm), tầng partition (hot partition), hoặc tầng consumer
(xử lý chậm) — chỉ nhìn lag một mình không đủ để chẩn đoán, cần đối chiếu chéo giữa các tầng.

## 📊 Bảng: metric/signal → why it matters → common misunderstanding

| Metric/signal | Dùng để làm gì | Hiểu lầm phổ biến |
|---|---|---|
| **Consumer lag (records)** | Đo khoảng cách giữa log end offset và committed offset | Hiểu lầm: lag cao luôn nghĩa là "consumer chậm" — thực tế có thể do burst traffic tạm thời, hoàn toàn bình thường nếu lag giảm dần ngay sau đó |
| **Consumer lag (time-based)** | Đo độ trễ **thời gian thực** giữa lúc message được ghi và lúc được xử lý | Hiểu lầm: 1000 record lag với message nhỏ khác hẳn 1000 record lag với message lớn — lag theo record không phản ánh đúng độ trễ thời gian thật |
| **Under-replicated partitions** | Số partition có ít nhất 1 replica đang **out of ISR** | Hiểu lầm: coi đây là bình thường nếu "chỉ vài giây" — thực tế đây luôn là tín hiệu cảnh báo cần điều tra ngay, dù có thể tự phục hồi |
| **Offline partitions** | Số partition **không có leader khả dụng** — mất khả năng đọc/ghi | Hiểu lầm: nhầm với under-replicated — offline nghiêm trọng hơn hẳn, nghĩa là gián đoạn thực sự đang xảy ra |
| **Request queue time / request handler idle %** | Đo độ bão hòa của broker khi xử lý request | Hiểu lầm: chỉ nhìn CPU tổng broker mà bỏ qua queue time — CPU có thể "bình thường" nhưng queue vẫn dài do thread pool không đủ |
| **Bytes in/out per second** | Đo throughput thực tế theo byte, không theo message count | Hiểu lầm: so sánh throughput giữa các topic có message size khác nhau bằng "message/s" thay vì "byte/s" |
| **ISR shrink/expand rate** | Đo tần suất ISR co lại/mở rộng — dấu hiệu instability | Hiểu lầm: coi 1 lần shrink đơn lẻ là sự cố lớn — cần nhìn **tần suất** theo thời gian, không phải 1 sự kiện đơn lẻ |
| **Rebalance rate (consumer group)** | Đo tần suất consumer group phải rebalance | Hiểu lầm: rebalance xảy ra 1 lần khi deploy là bình thường — rebalance **liên tục** mới là dấu hiệu vấn đề (rebalance storm) |
| **Request rate (produce/fetch requests/s)** | Đo tải request thực tế lên broker, tách biệt khỏi băng thông byte | Hiểu lầm: bỏ qua metric này khi throughput byte thấp — QPS cao với message nhỏ vẫn có thể làm broker quá tải dù byte/s thấp |

## 📉 Lag nhìn thế nào cho đúng

Lag **không phải** một con số đơn lẻ có ý nghĩa cố định — nó chỉ có ý nghĩa khi đặt cạnh **traffic pattern** và
**xu hướng theo thời gian**:

- Lag tăng đột ngột rồi **giảm dần về 0** trong vài phút sau burst traffic → bình thường, hệ thống đang catch-up
  đúng như thiết kế.
- Lag **tăng liên tục không có dấu hiệu giảm** → dấu hiệu thực sự đáng lo, tốc độ xử lý đang thấp hơn tốc độ
  ghi bền vững.
- Lag **theo record** dễ đánh lừa khi message size thay đổi — 10,000 record lag với message 100 byte khác hẳn ý
  nghĩa so với 10,000 record lag với message 100KB; nên bổ sung **lag theo thời gian** (ước tính dựa trên
  timestamp của record cuối cùng đã xử lý) để có bức tranh đầy đủ.
- Lag phải được xem **theo từng partition**, không chỉ tổng consumer group — lag tổng có thể "trông ổn" trong
  khi 1 partition cụ thể đang tích luỹ không kiểm soát (hot partition).

## ⚡ Throughput vs latency vs queueing signals

3 loại tín hiệu này đo 3 khía cạnh khác nhau và **có thể mâu thuẫn nhau** — throughput cao không đảm bảo latency
tốt:

| Loại tín hiệu | Đo gì | Khi nào tách biệt khỏi nhau |
|---|---|---|
| **Throughput** | Tổng lượng dữ liệu xử lý được / đơn vị thời gian | Có thể cao trong khi latency từng request riêng lẻ vẫn tệ (do batching lớn tăng throughput nhưng tăng độ trễ chờ batch đầy) |
| **Latency** | Thời gian xử lý 1 đơn vị (produce latency, end-to-end latency) | Có thể thấp cho phần lớn request nhưng **đuôi phân phối (p99/p999)** vẫn xấu — trung bình che giấu outlier |
| **Queueing signal (request queue time, in-flight requests)** | Mức độ request đang "chờ" trước khi được xử lý | Là tín hiệu **sớm nhất** báo hiệu bão hòa sắp xảy ra — thường tăng trước khi latency trung bình kịp phản ánh rõ |

📌 Khi throughput tăng nhưng latency xấu đi, nguyên nhân thường nằm ở 1 trong 3 nhóm: (1) batching/compression
tăng độ trễ chờ để đổi lấy hiệu quả mạng, (2) request queue trên broker bắt đầu dài ra dù chưa "quá tải rõ
ràng", (3) GC pause hoặc disk I/O contention theo chu kỳ — cả 3 đều **không lộ ra** nếu chỉ nhìn throughput hoặc
latency trung bình riêng lẻ.

## 🔗 ISR-related signals

- **Under-replicated partitions > 0 kéo dài** → luôn cần điều tra ngay, dù cluster "vẫn hoạt động" — đây là dấu
  hiệu durability đang suy giảm (xem cơ chế ISR ở
  [`../02-core-internals/03-replication-isr-leader-election.md`](../02-core-internals/03-replication-isr-leader-election.md)).
- **ISR shrink rate cao theo thời gian** (không phải 1 lần) → dấu hiệu instability lặp lại, thường do follower
  không theo kịp leader (network chậm, disk chậm, hoặc GC pause dài trên follower).
- **Active controller count ≠ 1** → dấu hiệu vấn đề nghiêm trọng ở tầng điều phối cluster, cần điều tra ngay lập
  tức (có thể 0 controller = cluster mất khả năng xử lý metadata change, hoặc >1 = split-brain tạm thời).

## 📊 Bảng: alert → likely meaning → next investigation step

| Alert | Ý nghĩa khả dĩ | Bước điều tra tiếp theo |
|---|---|---|
| Consumer lag > ngưỡng, liên tục tăng | Consumer không theo kịp throughput ghi bền vững | Kiểm tra process time trung bình, kiểm tra lag có phân bổ đều giữa partition không (loại trừ hot partition) |
| Under-replicated partitions > 0 | 1+ follower không theo kịp leader | Kiểm tra network/disk giữa các broker liên quan, kiểm tra GC pause trên broker follower |
| Offline partitions > 0 | Mất leader khả dụng cho 1+ partition | Điều tra ngay — đây là gián đoạn thực sự (xem [`05-failures-and-recovery.md`](05-failures-and-recovery.md)) |
| Request queue time tăng dần | Broker bắt đầu bão hòa xử lý request | Kiểm tra request rate, kiểm tra có đang gần giới hạn CPU/thread pool không |
| Rebalance rate cao bất thường | Rebalance storm hoặc deploy liên tục | Kiểm tra nguyên nhân gốc gây rebalance (crash lặp lại, session timeout quá ngắn so với process time) |
| Disk usage broker > 80-85% | Sắp chạm giới hạn capacity | Kiểm tra tốc độ tăng disk, đối chiếu lại capacity planning ([`01-capacity-planning.md`](01-capacity-planning.md)) |
| Active controller count = 0 | Cluster tạm thời không có controller | Ưu tiên cao nhất — kiểm tra log controller election, có thể ảnh hưởng mọi metadata operation |

## 🧭 Key mechanics

- Metric có ý nghĩa nhất khi đọc **theo tầng** (broker/topic/partition/consumer) và **đối chiếu chéo**, không
  đọc đơn lẻ.
- Lag cần cả 2 góc nhìn: theo record (dễ đo) và theo thời gian (phản ánh đúng độ trễ thực tế).
- Queueing signal là tín hiệu sớm nhất báo hiệu bão hòa — thường xuất hiện trước khi latency trung bình kịp thay
  đổi rõ rệt.

## 🧭 Key decisions

1. **Luôn theo dõi lag theo từng partition**, không chỉ tổng consumer group — để phát hiện hot partition sớm.
2. **Kết hợp lag theo record với lag theo thời gian** khi message size giữa các topic không đồng đều.
3. **Ưu tiên alert theo xu hướng (trend), không phải ngưỡng tĩnh đơn lẻ** cho các metric có thể dao động tự
   nhiên (lag, request queue).
4. **Coi under-replicated/offline partitions là alert mức ưu tiên cao nhất**, không gộp chung mức độ với các
   alert "có thể chờ" khác.

## ⚖️ Trade-offs

- ✅ Alert theo ngưỡng tĩnh → đơn giản, dễ implement, dễ hiểu.
  ❌ Đổi lại: dễ gây false positive với metric dao động tự nhiên (lag burst tạm thời), hoặc false negative nếu
  ngưỡng đặt quá cao.
- ✅ Alert theo xu hướng/tốc độ thay đổi → chính xác hơn, phát hiện sớm vấn đề đang hình thành.
  ❌ Đổi lại: phức tạp hơn để implement và giải thích, cần dữ liệu lịch sử đủ tốt để tính baseline.
- ✅ Theo dõi chi tiết ở mức partition → phát hiện hot partition/skew sớm.
  ❌ Đổi lại: khối lượng dữ liệu monitoring lớn hơn nhiều so với chỉ theo dõi mức topic/consumer group.

## 🚨 Failure modes

| Sự kiện | Nguyên nhân | Hệ quả |
|---|---|---|
| Alert fatigue, đội vận hành bỏ qua cảnh báo | Alert on everything, quá nhiều false positive tích luỹ theo thời gian | Cảnh báo thực sự quan trọng bị chìm giữa noise, phản ứng chậm khi có sự cố thật |
| Kết luận sai "consumer bug" khi lag tăng | Chỉ nhìn lag mà không đối chiếu traffic pattern (burst tạm thời) | Tốn thời gian điều tra sai hướng, có thể scale consumer không cần thiết |
| Bỏ lỡ sự cố durability đang âm thầm xảy ra | Không alert on under-replicated partitions, chỉ nhìn "cluster vẫn phục vụ request bình thường" | ISR co lại kéo dài mà không ai biết, tăng rủi ro mất dữ liệu nếu leader tiếp theo cũng gặp sự cố |
| Latency đuôi (p99) xấu không bị phát hiện | Chỉ theo dõi latency trung bình | Trải nghiệm 1% traffic tệ liên tục mà dashboard "trông vẫn ổn" |

## 🔍 Debugging hints

- Lag tăng → luôn kiểm tra **traffic pattern cùng thời điểm** trước khi kết luận consumer có vấn đề (burst
  ghi tăng đột biến là nguyên nhân phổ biến, không phải bug).
- Chỉ nhìn average latency → luôn bổ sung p95/p99 trước khi kết luận "hệ thống ổn định" — trung bình dễ che
  giấu outlier ảnh hưởng 1 nhóm nhỏ traffic.
- Under-replicated partitions xuất hiện → kiểm tra broker follower liên quan có đang GC pause dài, disk chậm,
  hay network issue tại đúng thời điểm.
- Rebalance rate cao → kiểm tra log consumer group coordinator để tìm nguyên nhân gốc (crash lặp lại, session
  timeout ngắn hơn thời gian xử lý thực tế).

## 🧱 Operational implications

- Cần dashboard phân tầng rõ ràng (broker/topic/partition/consumer) thay vì 1 dashboard tổng hợp duy nhất — dễ
  chẩn đoán sai nếu không tách tầng.
- Alert cần được **phân loại theo mức độ hành động** (cần xử lý ngay / cần theo dõi / thông tin tham khảo) —
  không phải mọi alert đều cùng mức ưu tiên.
- Định kỳ rà soát lại ngưỡng alert theo baseline thực tế của hệ thống — ngưỡng "hợp lý" 6 tháng trước có thể
  không còn đúng khi traffic pattern đã thay đổi.

## ❌ Anti-patterns

### ❌ Alert on everything
**Biểu hiện:** thiết lập alert cho mọi metric có thể đo được, không phân biệt mức độ quan trọng.
**Tại sao người ta hay làm vậy:** cảm giác "an toàn hơn" khi có nhiều alert, sợ bỏ sót vấn đề nào đó.
**Tại sao nó là vấn đề:** alert fatigue khiến đội vận hành dần bỏ qua cảnh báo, kể cả cảnh báo thực sự quan
trọng — hiệu ứng ngược với mục đích ban đầu.
**Thay vào đó nên làm:** ✅ Chỉ alert trên tín hiệu có ý nghĩa hành động rõ ràng (golden signals theo tầng),
phân loại mức độ ưu tiên rõ ràng cho từng alert.

### ❌ Nhìn lag mà không nhìn traffic pattern
**Biểu hiện:** kết luận "consumer có vấn đề" ngay khi thấy lag tăng, không kiểm tra throughput ghi cùng thời
điểm.
**Tại sao người ta hay làm vậy:** lag là con số dễ thấy nhất, trực giác gán trực tiếp cho "consumer chậm".
**Tại sao nó là vấn đề:** lag tăng do burst traffic tạm thời là hành vi **bình thường**, không phải lỗi — kết
luận sai dẫn tới hành động sai (scale không cần thiết, hoặc debug sai hướng).
**Thay vào đó nên làm:** ✅ Luôn đối chiếu lag với throughput ghi cùng thời điểm, và theo dõi xu hướng lag (có
giảm dần sau burst không) trước khi kết luận.

### ❌ Chỉ nhìn average
**Biểu hiện:** dashboard chỉ hiển thị latency/throughput trung bình, không có percentile (p95/p99).
**Tại sao người ta hay làm vậy:** trung bình đơn giản để tính toán và hiển thị, dễ hiểu ở cái nhìn đầu tiên.
**Tại sao nó là vấn đề:** trung bình che giấu outlier — 1% traffic có latency rất tệ có thể hoàn toàn không ảnh
hưởng tới con số trung bình, nhưng ảnh hưởng thực sự tới trải nghiệm người dùng/downstream nhạy cảm với latency.
**Thay vào đó nên làm:** ✅ Luôn theo dõi percentile (đặc biệt p99) cho latency, không chỉ trung bình.

## 🧪 Mini scenarios

**Scenario 1 — Lag spike:**
Dashboard báo lag của consumer group `order-processor` tăng từ 500 lên 50,000 record trong 5 phút. Đối chiếu
với biểu đồ throughput ghi cùng thời điểm, thấy throughput ghi cũng tăng đột biến gấp 20 lần (do 1 campaign
marketing bất ngờ). 10 phút sau, lag giảm dần về mức bình thường mà không cần can thiệp — kết luận: đây là burst
traffic hợp lệ, không phải sự cố consumer.

**Scenario 2 — Under-replicated partitions:**
Alert báo 5 partition đang under-replicated trong 10 phút liên tục. Điều tra thấy 1 broker follower cụ thể có
GC pause kéo dài bất thường (do heap size không đủ so với tải hiện tại), khiến follower không kịp fetch từ
leader trong giới hạn `replica.lag.time.max.ms`. Đây là tín hiệu cần điều tra ngay dù cluster vẫn phục vụ
request bình thường — durability đang tạm thời suy giảm cho 5 partition đó.

**Scenario 3 — Broker disk pressure:**
Alert cảnh báo disk usage của 1 broker cụ thể đạt 85%, trong khi các broker khác trong cluster chỉ ở mức 50-60%.
Điều tra thấy broker này đang giữ leader của nhiều partition "nóng" hơn hẳn các broker khác — không phải vấn đề
capacity tổng cluster, mà là vấn đề phân bổ leader không đều. Giải pháp: reassign partition/trigger preferred
leader election, không cần thêm broker mới ngay lập tức.

## 🎤 Interview lens

**"Bạn sẽ thiết lập alerting cho 1 cluster Kafka production như thế nào?"**
> Câu trả lời yếu: liệt kê 1 danh sách metric chung chung. Câu trả lời tốt: phân tầng theo broker/topic/
> partition/consumer, ưu tiên alert có ý nghĩa hành động (under-replicated/offline partitions ở mức cao nhất),
> và nhấn mạnh alert theo xu hướng thay vì chỉ ngưỡng tĩnh để tránh alert fatigue.

**"Lag cao có luôn nghĩa là có vấn đề không?"**
> Câu trả lời tốt phải chỉ ra: không nhất thiết — cần đối chiếu với traffic pattern (burst tạm thời là bình
> thường), xu hướng theo thời gian (đang giảm dần hay tăng liên tục), và phân bổ giữa các partition (loại trừ
> hot partition) trước khi kết luận.

## ✅ Key takeaways

- Metric chỉ có ý nghĩa khi đọc theo đúng tầng và đối chiếu chéo — không đọc đơn lẻ.
- Lag cần cả góc nhìn record và thời gian, và luôn cần theo dõi ở mức partition để phát hiện hot partition.
- Throughput cao không đảm bảo latency tốt — 3 loại tín hiệu (throughput/latency/queueing) có thể mâu thuẫn
  nhau, queueing signal thường là tín hiệu sớm nhất.
- Under-replicated/offline partitions luôn là alert ưu tiên cao nhất — phản ánh durability/availability đang
  suy giảm thực sự.
- Alert theo xu hướng, phân loại mức độ ưu tiên, tránh alert on everything để không rơi vào alert fatigue.

## 🔗 Xem tiếp / Liên kết liên quan

- Tiếp theo: [`04-backpressure-lag-and-throughput.md`](04-backpressure-lag-and-throughput.md) — đào sâu cơ chế
  lag/backpressure đã nhắc ở đây.
- [`../02-core-internals/03-replication-isr-leader-election.md`](../02-core-internals/03-replication-isr-leader-election.md)
  — cơ chế ISR nền tảng cho các signal liên quan.
- [`05-failures-and-recovery.md`](05-failures-and-recovery.md) — hành động khi alert chỉ ra sự cố thực sự.
- [`../GLOSSARY.md`](../GLOSSARY.md) — tra cứu thuật ngữ liên quan.
