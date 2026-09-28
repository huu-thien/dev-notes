# Capacity Planning

## 🎯 Mục tiêu học

Sau khi đọc xong, bạn sẽ:
- Hiểu capacity planning cho Kafka **không phải** câu hỏi "cần bao nhiêu broker" — mà là bài toán cân bằng
  nhiều biến (throughput, message size, replication, retention, consumer concurrency, growth) cùng lúc.
- Biết chính xác **biến đầu vào nào ảnh hưởng tới tài nguyên nào** (disk/network/CPU/memory).
- Hiểu vì sao **page cache** là yếu tố sizing dễ bị bỏ qua nhất nhưng quan trọng bậc nhất.
- Nhận diện 2 tình huống capacity dễ đánh giá sai: **low-volume nhưng retention dài** và **message nhỏ ở QPS
  khổng lồ**.

## 📖 Mục lục

- [Mental model: capacity planning là bài toán đa biến](#-mental-model-capacity-planning-là-bài-toán-đa-biến)
- [Bảng: input variable → affects what](#-bảng-input-variable--affects-what)
- [Disk sizing mindset](#-disk-sizing-mindset)
- [Network bandwidth mindset](#-network-bandwidth-mindset)
- [Vì sao page cache quan trọng](#-vì-sao-page-cache-quan-trọng)
- [Storage amplification / retention cost](#-storage-amplification--retention-cost)
- [Bảng: underestimate this → what breaks first](#-bảng-underestimate-this--what-breaks-first)
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

## 🧠 Mental model: capacity planning là bài toán đa biến

Câu hỏi "cluster này cần bao nhiêu broker?" là câu hỏi **sai dạng** — nó giả định capacity chỉ phụ thuộc 1 biến
(số broker), trong khi thực tế disk, network, CPU và memory của mỗi broker chịu áp lực từ **những tổ hợp biến
khác nhau**, và broker nào chịu áp lực nặng nhất sẽ là nút thắt thực sự của cả cluster, bất kể tổng số broker
bao nhiêu.

Mental model đúng: capacity planning là việc trả lời **7 câu hỏi độc lập nhưng liên quan nhau** — throughput
ghi bao nhiêu, throughput đọc bao nhiêu (bị nhân với số consumer group), message size trung bình, cần bao nhiêu
partition, replication factor bao nhiêu, retention giữ bao lâu, và tăng trưởng dự kiến trong bao lâu — rồi suy
ra **disk, network, CPU, memory cần thiết cho từng broker**, không phải suy ra "số broker" trước rồi mới nghĩ
tới các biến khác.

📌 Nguyên tắc quan trọng nhất: **sizing theo nút thắt hẹp nhất**, không theo trung bình. Một cluster có thể có
tổng dung lượng đủ nhưng vẫn sập vì 1 broker cụ thể (do phân bổ partition không đều) chạm giới hạn disk/network
trước tất cả broker khác.

## 📊 Bảng: input variable → affects what

| Biến đầu vào | Ảnh hưởng chính | Ghi chú thực dụng |
|---|---|---|
| **Throughput ghi (produce rate)** | Network write, disk write I/O, CPU (compression/decompression) | Đo bằng **byte/s sau compression**, không phải trước — đây là con số thực sự chạm disk |
| **Throughput đọc (fetch rate)** | Network read — **nhân với số consumer group độc lập** đọc cùng topic | 1 topic có 3 consumer group độc lập = tải network đọc gấp 3, dù chỉ ghi 1 lần |
| **Message size** | Batch efficiency, network overhead per-message, CPU cho serialization | Message quá nhỏ ở QPS lớn → overhead per-message (header, network round-trip) chiếm tỷ trọng lớn hơn hẳn payload thật |
| **Partition count** | File handle, memory cho replica fetcher, metadata trên broker/controller, thời gian phục hồi khi leader failover | Không chỉ ảnh hưởng "parallelism" như ở tầng design — còn ảnh hưởng trực tiếp overhead vận hành broker |
| **Replication factor** | **Nhân trực tiếp** disk usage và network ghi nội bộ (replica fetch) theo hệ số RF | RF=3 nghĩa là disk cần gấp 3 lần dữ liệu logic, network ghi nội bộ giữa broker cũng nhân tương ứng |
| **Retention (thời gian/dung lượng)** | Disk usage tích luỹ theo thời gian, độc lập với "có đang đọc dữ liệu cũ hay không" | Dữ liệu cũ vẫn chiếm disk dù không ai đọc — retention dài nghĩa là trả tiền disk cho dữ liệu "im lặng" |
| **Consumer concurrency (số consumer group, số instance)** | Network đọc, connection count, request overhead trên broker | Mỗi consumer group độc lập là 1 "bản sao" toàn bộ throughput đọc — đây là biến hay bị quên nhất |
| **Growth assumptions** | Toàn bộ các biến trên theo thời gian | Sizing theo hiện tại mà không có buffer tăng trưởng dẫn tới phải scale khẩn cấp giữa chừng, rủi ro cao hơn scale có kế hoạch |

## 💽 Disk sizing mindset

Công thức tư duy cơ bản (không phải công thức chính xác tuyệt đối, mà là cách nghĩ đúng thứ tự):

```
Disk cần cho 1 broker ≈ (throughput ghi trung bình × retention time × replication factor) / số broker
                         + buffer cho growth + buffer cho phân bổ partition không đều
```

📌 3 lỗi phổ biến khi sizing disk:
1. **Quên nhân replication factor** — đây là lỗi lớn nhất, dễ khiến disk thực tế cần **gấp 2-3 lần** ước tính
   ban đầu.
2. **Dùng throughput trung bình thay vì đỉnh (peak)** — retention giữ dữ liệu theo **thời gian**, không theo
   trung bình; nếu có giờ cao điểm ghi nhiều hơn hẳn, disk vẫn phải chứa đủ lượng đó trong suốt retention
   window.
3. **Không tính buffer cho phân bổ partition không đều** — nếu 1 broker nhận nhiều partition "nóng" hơn broker
   khác, disk của riêng broker đó cạn trước dù dung lượng tổng cluster vẫn còn dư.

## 🌐 Network bandwidth mindset

Network là tài nguyên **dễ bị đánh giá thấp nhất** vì nó bị nhân theo nhiều chiều cùng lúc:

- **Ghi từ producer** → network inbound của broker leader.
- **Replicate nội bộ** → network giữa các broker (leader gửi cho follower), nhân theo (RF − 1).
- **Đọc từ consumer** → network outbound của broker leader, nhân theo **số consumer group độc lập**.

📌 Công thức tư duy: `network outbound ước tính ≈ throughput ghi × (RF − 1) [replicate nội bộ] + throughput ghi
× số consumer group [đọc]`. Với RF=3 và 2 consumer group độc lập, network outbound có thể **gấp 4 lần**
throughput ghi ban đầu — đây là lý do nhiều team ngạc nhiên khi network trở thành nút thắt trước disk hoặc CPU.

## 🧠 Vì sao page cache quan trọng

Kafka broker dựa nặng vào **OS page cache** để đạt throughput đọc cao (đã bàn cơ chế zero-copy ở
[`../02-core-internals/05-storage-segments-indexes.md`](../02-core-internals/05-storage-segments-indexes.md)).
Ý nghĩa cho capacity planning: nếu **working set** (phần dữ liệu đang được đọc thường xuyên — thường là dữ liệu
gần đây nhất) **không vừa trong RAM** dành cho page cache, broker buộc phải đọc từ disk vật lý cho mỗi fetch
request, làm tăng đột biến disk I/O và latency đọc.

📌 Hệ quả sizing: **memory cần được tính theo working set, không phải theo tổng retention**. Một cluster có
retention 30 ngày nhưng consumer luôn đọc gần real-time chỉ cần RAM đủ chứa vài giờ dữ liệu gần nhất — phần còn
lại "nguội" (cold data) hiếm khi được đọc lại nên không cần nằm trong cache.

## 📦 Storage amplification / retention cost

"Storage amplification" ở đây là hiện tượng 1 đơn vị dữ liệu logic tiêu tốn **nhiều hơn** dung lượng vật lý
tương ứng vì: (1) replication factor nhân bản dữ liệu, (2) segment chưa roll xong có thể giữ dữ liệu lâu hơn
`retention.ms` một chút (đã bàn ở core-internals), (3) compaction (nếu dùng compacted topic) vẫn giữ tombstone
trong 1 khoảng thời gian trước khi dọn hẳn.

⚠️ Trường hợp dễ bị đánh giá thấp: **retention dài nhưng QPS thấp vẫn tốn disk đáng kể** — vì disk usage tỷ lệ
với `throughput × retention time`, retention time lớn có thể bù lại throughput nhỏ và tổng vẫn ra 1 con số disk
lớn hơn trực giác ban đầu (xem Mini scenario 3).

## 📊 Bảng: underestimate this → what breaks first

| Đánh giá thấp biến này | Điều gì hỏng đầu tiên |
|---|---|
| **Replication factor trong tính disk** | Disk cạn nhanh hơn dự kiến 2-3 lần, broker báo lỗi ghi khi disk đầy (xem [`05-failures-and-recovery.md`](05-failures-and-recovery.md)) |
| **Số consumer group độc lập trong tính network** | Network outbound bão hòa trước cả disk/CPU, gây tăng latency fetch cho mọi consumer dù mỗi consumer group riêng lẻ "không nặng" |
| **Retention window thực tế cần cho replay** | Team phát hiện cần replay dữ liệu cũ hơn nhưng đã bị xoá — mất khả năng khôi phục, không phải lỗi kỹ thuật mà lỗi lập kế hoạch |
| **Growth trong 6-12 tháng tới** | Phải scale khẩn cấp giữa lúc cluster đã gần bão hòa — rủi ro vận hành cao hơn nhiều so với scale có kế hoạch trước |
| **Message overhead ở QPS cực lớn với message nhỏ** | CPU/network bão hòa vì chi phí per-message (header, request round-trip) dù tổng byte payload không lớn |
| **Phân bổ partition không đều giữa broker** | 1 broker cụ thể cạn tài nguyên trước các broker khác dù cluster tổng thể vẫn còn dư dung lượng |

## 🧭 Key mechanics

- Disk usage tỷ lệ thuận `throughput ghi × retention time × replication factor` — đây là công thức tư duy cốt
  lõi, mọi sizing khác đều xoay quanh nó.
- Network outbound bị nhân theo **cả replication lẫn số consumer group độc lập** — không phải hằng số cố định
  theo throughput ghi.
- Memory cần thiết gắn với **working set** (dữ liệu thường được đọc lại), không phải tổng retention.
- Partition count ảnh hưởng overhead vận hành (file handle, metadata, thời gian phục hồi) ngoài vai trò
  parallelism đã bàn ở tầng design.

## 🧭 Key decisions

1. **Sizing disk theo peak throughput, không theo trung bình**, và luôn nhân với replication factor tường
   minh trong công thức.
2. **Đếm số consumer group độc lập thực tế** khi ước tính network — đây là biến dễ bị quên nhất trong capacity
   planning.
3. **Sizing memory theo working set** (dựa vào pattern đọc thực tế của consumer), không theo tổng retention —
   tránh lãng phí RAM cho dữ liệu hiếm khi được đọc lại.
4. **Luôn có buffer growth rõ ràng** (ví dụ 30-50% capacity dự phòng cho 6-12 tháng tới) thay vì sizing sát mức
   hiện tại.
5. **Kiểm tra phân bổ partition giữa broker** định kỳ — dung lượng tổng cluster đủ không đảm bảo từng broker
   đều an toàn.

## ⚖️ Trade-offs

- ✅ Retention dài → khả năng replay/audit/tái xử lý dữ liệu cũ tốt hơn.
  ❌ Đổi lại: disk cost tăng tuyến tính theo thời gian giữ, kể cả khi throughput ghi thấp.
- ✅ Replication factor cao (RF=3+) → chịu lỗi tốt hơn, an toàn hơn khi mất broker.
  ❌ Đổi lại: nhân trực tiếp disk usage và network ghi nội bộ theo đúng hệ số RF.
- ✅ Nhiều consumer group độc lập cùng đọc 1 topic → tận dụng tốt mô hình pub-sub, nhiều team dùng chung dữ liệu.
  ❌ Đổi lại: network outbound nhân theo số group — cần tính rõ ràng vào capacity, không phải "miễn phí" chỉ vì
  đọc không ảnh hưởng dữ liệu gốc.

## 🚨 Failure modes

| Sự kiện | Nguyên nhân | Hệ quả |
|---|---|---|
| Broker báo lỗi ghi, cluster từ chối nhận message mới | Disk đầy do quên nhân replication factor khi sizing ban đầu | Producer nhận lỗi, có thể mất khả năng ghi dữ liệu mới cho tới khi giải phóng disk |
| Latency fetch tăng đột biến dù throughput ghi không đổi | Working set vượt quá RAM dành cho page cache, broker phải đọc disk vật lý nhiều hơn | Consumer trải nghiệm latency cao, có thể bị hiểu nhầm là "consumer chậm" trong khi gốc rễ là broker |
| Network bão hòa dù mỗi consumer "nhìn nhẹ nhàng" | Nhiều consumer group độc lập cộng dồn network outbound vượt băng thông broker | Toàn bộ consumer (không chỉ 1 group) bị ảnh hưởng latency, khó chẩn đoán vì triệu chứng lan rộng |
| 1 broker cụ thể quá tải trong khi broker khác nhàn rỗi | Phân bổ partition không đều (một số partition "nóng" tập trung vào ít broker) | Cluster "trông" còn dư tài nguyên tổng nhưng vẫn có điểm nghẽn cục bộ |

## 🔍 Debugging hints

- Disk cạn nhanh hơn dự kiến → kiểm tra lại công thức sizing đã nhân replication factor chưa, và kiểm tra
  retention thực tế đang áp dụng có đúng như thiết kế không (có topic nào retention dài hơn dự tính không).
- Latency fetch tăng bất thường → kiểm tra tỷ lệ cache hit của page cache (qua OS-level metric) trước khi nghi
  ngờ code consumer.
- Network cao bất thường so với throughput ghi → liệt kê toàn bộ consumer group đang active trên các topic
  liên quan, đối chiếu với công thức nhân network.
- 1 broker cụ thể luôn "nóng" hơn broker khác → kiểm tra phân bổ partition/leader trên broker đó, đối chiếu với
  chiến lược partition đã bàn ở
  [`../03-design-and-architecture/02-partition-strategy.md`](../03-design-and-architecture/02-partition-strategy.md).

## 🧱 Operational implications

- Capacity planning không phải hoạt động "làm 1 lần" — cần review định kỳ (quý/6 tháng) khi throughput, số
  consumer group, hoặc retention policy thay đổi.
- Growth assumption sai lệch nhiều so với thực tế là dấu hiệu cần rà soát lại giả định kinh doanh (traffic tăng
  nhanh/chậm hơn dự kiến), không chỉ là vấn đề kỹ thuật thuần tuý.
- Sizing quá sát (không có buffer) khiến mọi thay đổi nhỏ (thêm 1 consumer group, tăng retention 1 topic) đều
  trở thành rủi ro vận hành thay vì thay đổi bình thường.

## ❌ Anti-patterns

### ❌ Chỉ nhìn producer TPS
**Biểu hiện:** sizing cluster chỉ dựa trên throughput ghi (producer TPS/MB/s), bỏ qua network đọc và replication.
**Tại sao người ta hay làm vậy:** producer TPS là con số dễ đo nhất, có sẵn từ business requirement ban đầu.
**Tại sao nó là vấn đề:** network đọc (nhân theo consumer group) và replication (nhân theo RF) thường **vượt xa**
throughput ghi gốc — cluster sized chỉ theo producer TPS thường thiếu tài nguyên network/disk nghiêm trọng.
**Thay vào đó nên làm:** ✅ Luôn tính đủ 3 chiều: ghi, đọc (nhân số consumer group), replicate nội bộ (nhân RF).

### ❌ Quên replication multiplier
**Biểu hiện:** tính disk cần thiết = throughput × retention, không nhân thêm replication factor.
**Tại sao người ta hay làm vậy:** replication factor "cảm giác" là vấn đề fault-tolerance, không liên quan trực
tiếp tới sizing dung lượng.
**Tại sao nó là vấn đề:** RF nhân trực tiếp disk usage thật — quên bước này khiến disk thực tế cần gấp 2-3 lần
ước tính ban đầu, dẫn tới disk đầy sớm hơn dự kiến rất nhiều.
**Thay vào đó nên làm:** ✅ Luôn viết công thức sizing tường minh có RF là 1 hệ số nhân riêng biệt, không gộp
ẩn vào các giả định khác.

### ❌ Ignore growth / replay / retention expansion
**Biểu hiện:** sizing sát đúng nhu cầu hiện tại, không có buffer cho tăng trưởng hoặc thay đổi retention trong
tương lai gần.
**Tại sao người ta hay làm vậy:** muốn tối ưu chi phí hạ tầng ngay từ đầu, hoặc chưa có dữ liệu rõ ràng về tăng
trưởng để đưa vào kế hoạch.
**Tại sao nó là vấn đề:** bất kỳ thay đổi nhỏ nào (traffic tăng, thêm consumer group, kéo dài retention để phục
vụ 1 yêu cầu nghiệp vụ mới) đều buộc phải scale khẩn cấp thay vì có kế hoạch — rủi ro vận hành cao hơn nhiều.
**Thay vào đó nên làm:** ✅ Luôn có buffer capacity rõ ràng (ví dụ 30-50%) và review giả định tăng trưởng định
kỳ, không coi sizing ban đầu là cố định vĩnh viễn.

## 🧪 Mini scenarios

**Scenario 1 — Low QPS but huge payload:**
1 topic chỉ nhận 50 message/giây nhưng mỗi message ~2MB (video thumbnail metadata kèm ảnh nhỏ). Throughput thực
tế = 50 × 2MB = 100MB/s — cao hơn hẳn trực giác "QPS thấp thì nhẹ". Đội vận hành ban đầu sizing theo QPS (thấy
50/s tưởng nhẹ) và thiếu hẳn network/disk cần thiết cho payload lớn — bài học: luôn sizing theo **byte/s**, QPS
một mình không đủ thông tin.

**Scenario 2 — Small events at massive scale:**
1 hệ thống IoT gửi 500,000 sự kiện/giây, mỗi sự kiện chỉ 50 byte (heartbeat). Tổng payload chỉ ~25MB/s — nghe
"nhẹ" — nhưng ở QPS này, **overhead per-message** (network round-trip, header, request processing trên broker)
chiếm phần lớn tải CPU thực tế, không phải payload byte. Đội vận hành cần sizing theo **request rate/CPU**,
không chỉ theo byte throughput; giải pháp thường là tăng batching phía producer để giảm số request vật lý.

**Scenario 3 — Long retention with replay expectations:**
1 topic chỉ nhận 10MB/s ghi (tương đối khiêm tốn) nhưng yêu cầu nghiệp vụ retention 180 ngày để phục vụ replay
phân tích lịch sử. Disk cần cho riêng topic này ≈ 10MB/s × 86400s × 180 ngày × RF(3) ≈ **466 TB** — con số này
dễ gây bất ngờ nếu chỉ nhìn throughput "thấp" mà không nhân đúng retention window và RF; đây là ví dụ điển hình
"low-volume nhưng retention dài vẫn đắt".

## 🎤 Interview lens

**"Bạn sizing 1 cluster Kafka mới như thế nào?"**
> Câu trả lời yếu: "Dựa vào throughput ghi rồi chia cho công suất mỗi broker." Câu trả lời tốt phải liệt kê đủ
> các biến (ghi, đọc × số consumer group, RF, retention, growth) và giải thích **network thường là nút thắt bị
> đánh giá thấp nhất**, không chỉ disk.

**"Vì sao retention dài có thể tốn kém dù throughput thấp?"**
> Câu trả lời tốt cần chỉ ra công thức `throughput × retention time × RF` — retention time là hệ số nhân theo
> **thời gian**, có thể áp đảo throughput thấp và cho ra tổng disk lớn hơn trực giác ban đầu.

## ✅ Key takeaways

- Capacity planning là bài toán đa biến (ghi, đọc × consumer group, message size, partition, RF, retention,
  growth) — không phải câu hỏi đơn giản "cần bao nhiêu broker".
- Disk usage ≈ `throughput ghi × retention time × RF`; network outbound bị nhân theo cả RF và số consumer group
  độc lập — đây là 2 công thức tư duy cốt lõi cần nhớ.
- Memory nên sizing theo **working set** (dữ liệu thường đọc lại), không theo tổng retention.
- Luôn sizing theo peak, không theo trung bình; luôn có buffer growth rõ ràng.
- Retention dài với throughput thấp vẫn có thể rất đắt; message nhỏ ở QPS khổng lồ có thể CPU-bound hơn là
  network-bound.

## 🔗 Xem tiếp / Liên kết liên quan

- Tiếp theo: [`02-scaling.md`](02-scaling.md) — khi capacity không đủ, scale theo chiều nào cho đúng.
- [`../03-design-and-architecture/02-partition-strategy.md`](../03-design-and-architecture/02-partition-strategy.md)
  — nguyên tắc chọn partition count ở tầng design, bổ sung góc nhìn overhead vận hành ở file này.
- [`../02-core-internals/05-storage-segments-indexes.md`](../02-core-internals/05-storage-segments-indexes.md)
  — cơ chế page cache/zero-copy nền tảng cho phần disk/network sizing.
- [`../GLOSSARY.md`](../GLOSSARY.md) — tra cứu thuật ngữ liên quan.
