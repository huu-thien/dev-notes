# High Consumer Lag

## 🎯 Mục tiêu học

Sau khi đọc xong, bạn sẽ:
- Hiểu **lag là symptom, không phải root cause** — biết cách không dừng lại ở "lag cao" mà đi tìm nguyên nhân
  thật.
- Phân biệt được **6+ họ nguyên nhân khác nhau** có thể gây lag, và cách phân biệt chúng bằng dữ liệu quan sát
  được thay vì đoán.
- Có 1 **debugging workflow cụ thể** để đi từ triệu chứng tới nguyên nhân trong thời gian ngắn nhất khi on-call.
- Tránh được các kết luận vội vàng phổ biến nhất khi thấy lag tăng.

## 📖 Mục lục

- [Symptom](#-symptom)
- [Why this happens](#-why-this-happens)
- [Likely cause families](#-likely-cause-families)
- [Lag theo records vs lag theo time](#-lag-theo-records-vs-lag-theo-time)
- [How to distinguish causes](#-how-to-distinguish-causes)
- [Debugging workflow](#-debugging-workflow)
- [Common false assumptions](#-common-false-assumptions)
- [Fix directions](#-fix-directions)
- [Prevention / design fix](#-prevention--design-fix)
- [❌ Anti-patterns](#-anti-patterns)
- [🧪 Mini scenarios](#-mini-scenarios)
- [🎤 Interview lens](#-interview-lens)
- [✅ Key takeaways](#-key-takeaways)
- [🔗 Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 🔍 Symptom

- `consumer_lag` (số record chưa được xử lý, đo bằng `log-end-offset - committed-offset`) tăng liên tục hoặc
  đột biến, không tự giảm về mức bình thường sau 1 khoảng thời gian.
- Dashboard alert "lag > threshold" kích hoạt, nhưng chưa rõ nguyên nhân là gì.
- Business impact đi kèm (nếu có): dữ liệu tới downstream trễ, SLA bị vi phạm, cache/search index "cũ" hơn dữ
  liệu gốc.

## 🧠 Why this happens

Lag về bản chất là **hiệu số giữa tốc độ ghi và tốc độ đọc** tại 1 thời điểm. Bất kỳ điều gì làm giảm tốc độ đọc
tương đối so với tốc độ ghi đều gây lag — nhưng "điều gì" đó có thể xảy ra ở **bất kỳ đâu** trong chuỗi
producer → broker → consumer → downstream (xem mô hình chi tiết ở
[`../05-operations/04-backpressure-lag-and-throughput.md`](../05-operations/04-backpressure-lag-and-throughput.md)).
📌 Đây chính là lý do lag không bao giờ nên được coi là "vấn đề của consumer" mặc định — cần xác định đúng vị
trí trong chuỗi trước khi hành động.

## 🗂️ Likely cause families

| # | Cause family | Cơ chế gây lag |
|---|---|---|
| 1 | **Consumer chậm** | Logic xử lý per-record tốn thời gian (gọi API chậm, tính toán nặng) → `poll()` tiếp theo bị trễ |
| 2 | **Downstream chậm** | Consumer gọi ra hệ thống ngoài (DB, API, cache) đang bị nghẽn → consumer bị block chờ dù code consumer không đổi |
| 3 | **Hot partition** | 1 hoặc vài partition nhận traffic nhiều hơn hẳn phần còn lại → lag tập trung ở đúng những partition đó, không đều toàn topic |
| 4 | **Rebalance** | Consumer group đang rebalance (join/leave/timeout) → toàn bộ hoặc một phần partition tạm dừng được tiêu thụ trong lúc rebalance diễn ra |
| 5 | **Burst traffic** | Producer đột ngột tăng traffic (batch job, retry storm, replay) → tốc độ ghi vượt tốc độ đọc bình thường dù consumer không hề chậm đi |
| 6 | **Fetch/poll config không phù hợp** | `max.poll.records`, `fetch.min.bytes`, `max.poll.interval.ms` cấu hình không khớp với tốc độ xử lý thực tế → throughput bị giới hạn nhân tạo |
| 7 | **Large messages** | Message payload lớn làm tăng thời gian fetch/deserialize/network transfer mỗi batch, giảm số record xử lý được mỗi giây |

## ⏱️ Lag theo records vs lag theo time

- **Lag theo records** (`log-end-offset - committed-offset`): con số tuyệt đối, nhưng **không tự nói lên mức độ
  nghiêm trọng** — 100,000 record lag trên topic 1 triệu message/giây khác hẳn ý nghĩa so với topic 10
  message/giây.
- **Lag theo thời gian** (ước lượng: "dữ liệu cũ đến mức nào" — thời điểm message cũ nhất chưa xử lý so với
  hiện tại): thường phản ánh đúng **business impact** hơn — "dữ liệu trễ 30 giây" dễ đánh giá SLA hơn "lag
  50,000 record".
- 📌 Nên alert theo **lag theo thời gian** khi có thể (nhiều công cụ monitoring hỗ trợ ước lượng này dựa trên
  throughput gần đây), vì threshold theo record dễ sai lệch khi throughput trung bình của topic thay đổi theo
  mùa vụ/giờ trong ngày.

## 🔬 How to distinguish causes

| Quan sát được | Cause family khả nghi |
|---|---|
| Lag tăng đều ở **toàn bộ partition** cùng lúc | Consumer chậm toàn cục, hoặc downstream chậm toàn cục |
| Lag tăng **chỉ ở 1-2 partition cụ thể**, các partition khác bình thường | Hot partition — xem [`02-hot-partitions.md`](02-hot-partitions.md) |
| Lag tăng đúng lúc thấy **rebalance event** trong log (`JoinGroup`, `SyncGroup`) | Rebalance — xem [`05-rebalance-storms.md`](05-rebalance-storms.md) |
| Producer throughput (bytes-in/records-in) **tăng đột biến** đúng lúc lag tăng | Burst traffic, không phải lỗi consumer |
| Processing time per record (đo trực tiếp trong code hoặc qua APM) tăng | Consumer chậm hoặc downstream chậm — cần đo tiếp downstream call latency để phân biệt 2 cái này |
| Message size trung bình tăng đúng lúc lag tăng | Large messages — kiểm tra `fetch.max.bytes`, `max.partition.fetch.bytes`, nén (compression) |
| Consumer restart/redeploy đúng lúc lag bắt đầu tăng | Rebalance do triển khai — tạm thời, thường tự phục hồi nếu deploy không lặp lại |

## 🧭 Debugging workflow

1. **Nhìn partition skew trước tiên**: lag có đều trên mọi partition hay tập trung ở vài partition? Đây là câu
   hỏi rẻ nhất và loại trừ được nhanh nhất giữa "vấn đề toàn cục" (consumer/downstream chậm, burst traffic) và
   "vấn đề cục bộ" (hot partition).
2. **Nhìn rebalance events**: kiểm tra log consumer group có `JoinGroup`/`SyncGroup`/`Rebalance` gần thời điểm
   lag tăng không. Nếu có, khả năng cao đây là nguyên nhân tạm thời — theo dõi thêm xem lag có tự giảm sau khi
   rebalance ổn định hay không.
3. **Nhìn processing time**: đo thời gian xử lý per-record hoặc per-batch trong consumer (nếu có instrumentation).
   Nếu processing time tăng, tiếp tục phân biệt consumer logic chậm vs downstream call chậm (đo riêng downstream
   call latency).
4. **Nhìn broker/network saturation**: kiểm tra broker request latency, network throughput — nếu broker đang
   chịu tải cao (không chỉ từ topic đang xét), consumer có thể bị chậm do fetch request tới broker chậm, không
   phải do logic consumer.
5. **Nhìn producer traffic pattern**: so sánh records-in-rate hiện tại với baseline lịch sử — burst traffic
   (batch job, replay, retry storm ở producer) có thể là nguyên nhân dù consumer hoàn toàn bình thường.
6. Chỉ sau khi đã loại trừ được các khả năng trên, **mới kết luận** nguyên nhân và chọn hướng fix tương ứng.

## ⚠️ Common false assumptions

- ❌ "Lag cao nghĩa là cần thêm consumer" — sai nếu bottleneck là hot partition (thêm consumer không giúp gì vì
  1 partition chỉ được đọc bởi 1 consumer tại 1 thời điểm), hoặc nếu downstream mới là nơi chậm (thêm consumer
  chỉ làm downstream quá tải hơn).
- ❌ "Chỉ cần nhìn total lag của topic là đủ" — tổng lag có thể che giấu skew nghiêm trọng ở 1 vài partition; cần
  luôn nhìn lag per-partition.
- ❌ "Lag tăng chắc chắn là do consumer có bug" — quên khả năng burst traffic hoặc replay từ phía producer hoàn
  toàn có thể gây lag dù consumer không hề thay đổi.
- ❌ "Lag giảm về 0 nghĩa là vấn đề đã xong" — nếu nguyên nhân gốc (ví dụ hot key trong producer) không được sửa,
  vấn đề sẽ tái diễn ở lần traffic tăng tiếp theo.

## 🛠️ Fix directions

| Cause family | Hướng fix ngắn hạn | Hướng fix dài hạn |
|---|---|---|
| Consumer chậm | Tối ưu code xử lý, tăng `max.poll.records` nếu batch nhỏ đang lãng phí round-trip | Refactor logic nặng ra khỏi hot path, xử lý bất đồng bộ nếu hợp lý |
| Downstream chậm | Theo dõi downstream, tăng timeout hợp lý, không đổi gì phía consumer | Thêm circuit breaker, cache, hoặc queue đệm giữa consumer và downstream |
| Hot partition | Không có fix nhanh thực sự hiệu quả — xem [`02-hot-partitions.md`](02-hot-partitions.md) | Sửa key design, xem lại partition count |
| Rebalance | Theo dõi, thường tự phục hồi | Xem [`05-rebalance-storms.md`](05-rebalance-storms.md) để giảm churn |
| Burst traffic | Xác nhận đây là traffic hợp lệ (không phải bug), theo dõi tới khi burst kết thúc | Capacity planning lại theo peak traffic, không chỉ theo trung bình |
| Fetch/poll config | Điều chỉnh `max.poll.records`, `fetch.min.bytes` theo tốc độ xử lý thực tế | Đo lại và tune định kỳ khi workload thay đổi |
| Large messages | Kiểm tra compression đã bật chưa | Xem lại chiến lược message size — [`../03-design-and-architecture/05-message-size-throughput-latency.md`](../03-design-and-architecture/05-message-size-throughput-latency.md) |

## 🧱 Prevention / design fix

- Thiết kế key tránh hot partition ngay từ đầu — xem
  [`../03-design-and-architecture/03-key-design.md`](../03-design-and-architecture/03-key-design.md).
- Capacity planning theo **peak traffic**, không chỉ trung bình — xem
  [`../05-operations/01-capacity-planning.md`](../05-operations/01-capacity-planning.md).
- Alert lag theo **thời gian** thay vì chỉ theo số record tuyệt đối, và có baseline theo giờ/ngày để tránh false
  positive khi traffic biến động theo mùa vụ.
- Instrument processing time per-record để có thể phân biệt nhanh "consumer chậm" vs "downstream chậm" khi có sự
  cố, thay vì phải đoán.

## ❌ Anti-patterns

### ❌ Thấy lag là tăng consumers ngay
**Biểu hiện:** phản xạ đầu tiên khi có alert lag là scale consumer group lên, không kiểm tra nguyên nhân trước.
**Tại sao hay làm vậy:** scale consumer là hành động nhanh, "cảm giác" như đang chủ động xử lý sự cố.
**Tại sao là vấn đề:** nếu bottleneck là hot partition hoặc downstream chậm, thêm consumer không giải quyết gì
(consumer thừa sẽ idle vì không có partition để nhận, hoặc downstream chỉ quá tải nặng hơn).
**Thay vào đó nên làm:** ✅ Luôn nhìn partition skew và processing time trước khi quyết định scale.

### ❌ Chỉ nhìn total lag
**Biểu hiện:** dashboard chỉ hiển thị tổng lag của topic, không breakdown theo partition.
**Tại sao hay làm vậy:** tổng lag đơn giản hơn để hiển thị và alert.
**Tại sao là vấn đề:** che giấu hot partition — 1 partition lag rất cao có thể bị "trung bình hoá" bởi các
partition khác đang lag = 0.
**Thay vào đó nên làm:** ✅ Luôn có dashboard lag per-partition, không chỉ tổng.

### ❌ Quên traffic burst/replay
**Biểu hiện:** kết luận ngay "consumer có vấn đề" khi thấy lag tăng, không kiểm tra producer traffic pattern.
**Tại sao hay làm vậy:** producer thường bị coi là "không đổi", nên không nghĩ tới khả năng traffic tăng đột
biến.
**Tại sao là vấn đề:** batch job, replay thủ công, hoặc retry storm ở phía producer là nguyên nhân phổ biến gây
lag dù consumer hoàn toàn bình thường — điều tra sai hướng làm mất thời gian.
**Thay vào đó nên làm:** ✅ Luôn so sánh producer throughput hiện tại với baseline trước khi kết luận nguyên
nhân nằm ở phía consumer.

## 🧪 Mini scenarios

**Scenario 1 — Consumer logic chậm dần theo thời gian:**
Lag tăng đều trên mọi partition trong vài giờ, không có rebalance event, producer traffic ổn định. Điều tra:
processing time per-record tăng dần — hoá ra do 1 cache trong consumer bị đầy dần, khiến mỗi lần lookup chậm
hơn. Fix: giới hạn kích thước cache, thêm eviction policy.

**Scenario 2 — Downstream DB bị nghẽn:**
Lag tăng đột ngột trên toàn bộ partition cùng lúc. Processing time tăng vọt. Điều tra downstream call latency
(DB write) thấy tăng gấp 5 lần bình thường — DB đang chạy 1 job batch nặng khác chiếm I/O. Fix ngắn hạn: chờ
job batch kết thúc. Fix dài hạn: tách DB instance hoặc thêm buffer/queue giữa consumer và DB.

**Scenario 3 — Batch job replay gây burst:**
Lag tăng đột biến, đều trên mọi partition. Producer records-in-rate tăng 20x so với baseline. Điều tra: team
khác vừa chạy replay dữ liệu lịch sử vào cùng topic. Không phải bug — chỉ cần theo dõi tới khi burst kết thúc,
lag tự giảm.

**Scenario 4 — Fetch config quá bảo thủ:**
Lag tăng nhẹ nhưng liên tục dù CPU consumer không cao. Điều tra: `max.poll.records` đặt rất thấp (50), mỗi
`poll()` chỉ lấy được ít record, số round-trip network tăng cao không cần thiết so với khả năng xử lý thực tế
của consumer. Fix: tăng `max.poll.records` sau khi xác nhận thời gian xử lý 1 batch vẫn nằm trong
`max.poll.interval.ms`.

## 🎤 Interview lens

**"Consumer lag tăng, bạn sẽ làm gì đầu tiên?"**
> Câu trả lời yếu: "Tăng số consumer." Câu trả lời tốt cần thể hiện **thứ tự điều tra**: kiểm tra lag có đều
> trên mọi partition không (loại trừ hot partition), kiểm tra có rebalance gần đây không, so sánh producer
> traffic với baseline, và đo processing time trước khi hành động — không hành động trước khi phân biệt được
> cause family.

**"Làm sao biết lag là do consumer chậm hay do downstream chậm?"**
> Câu hỏi này test khả năng **instrument hệ thống** để trả lời được câu hỏi thực tế, không chỉ lý thuyết. Câu
> trả lời tốt: đo riêng thời gian downstream call (DB/API) tách biệt khỏi tổng processing time — nếu downstream
> call chiếm phần lớn thời gian, vấn đề nằm ở downstream, không phải logic consumer.

## ✅ Key takeaways

- Lag là **symptom**, có thể xuất phát từ 7+ họ nguyên nhân khác nhau ở bất kỳ đâu trong chuỗi producer → broker
  → consumer → downstream.
- Luôn phân biệt cause family bằng **partition skew, rebalance events, processing time, producer traffic
  pattern** trước khi hành động.
- Lag theo thời gian phản ánh business impact tốt hơn lag theo số record tuyệt đối.
- Thêm consumer chỉ giúp khi bottleneck thực sự là **consumer-side parallelism** — không phải hot partition,
  không phải downstream.

## 🔗 Xem tiếp / Liên kết liên quan

- [`02-hot-partitions.md`](02-hot-partitions.md) — khi lag tập trung ở 1 vài partition cụ thể.
- [`05-rebalance-storms.md`](05-rebalance-storms.md) — khi lag đi kèm rebalance liên tục.
- [`../05-operations/04-backpressure-lag-and-throughput.md`](../05-operations/04-backpressure-lag-and-throughput.md)
  — mô hình đầy đủ về backpressure propagation.
- [`README.md`](README.md) — quay lại tổng quan phần Troubleshooting.
