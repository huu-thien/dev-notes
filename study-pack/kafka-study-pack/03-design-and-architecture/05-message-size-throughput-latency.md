# Message Size, Throughput, Latency

## 🎯 Mục tiêu học

Sau khi đọc xong, bạn sẽ:
- Hiểu **message size ảnh hưởng thế nào** tới batching, compression, network, disk, và fetch efficiency — ở
  mức cơ chế, không chỉ "message lớn thì chậm hơn".
- Phân biệt rõ trade-off **small vs large messages**, và trade-off **throughput vs latency vs broker pressure**.
- Có tư duy cụ thể về `record size`, `request size` (`max.request.size`), `fetch size` (`fetch.max.bytes`,
  `max.partition.fetch.bytes`).
- Nhận diện anti-pattern nhét blob/file lớn vào Kafka, và biết khi nào nên **lưu tham chiếu thay vì payload
  đầy đủ**.

## 📖 Mục lục

- [Mental model: message size là chi phí lan toả toàn hệ thống](#-mental-model-message-size-là-chi-phí-lan-toả-toàn-hệ-thống)
- [Message size ảnh hưởng batching/compression/network/disk/fetch thế nào](#-message-size-ảnh-hưởng-batchingcompressionnetworkdiskfetch-thế-nào)
- [Small vs large messages trade-off](#️-small-vs-large-messages-trade-off)
- [Bảng: small vs medium vs very large payload mindset](#-bảng-small-vs-medium-vs-very-large-payload-mindset)
- [Throughput vs latency vs broker pressure](#-throughput-vs-latency-vs-broker-pressure)
- [Record size / request size / fetch size — tư duy cấu hình](#️-record-size--request-size--fetch-size--tư-duy-cấu-hình)
- [When to store reference instead of blob](#-when-to-store-reference-instead-of-blob)
- [Key decisions](#-key-decisions)
- [Design trade-offs](#️-design-trade-offs)
- [Failure modes](#-failure-modes)
- [❌ Anti-patterns](#-anti-patterns)
- [🧪 Mini scenarios](#-mini-scenarios)
- [🎤 Interview lens](#-interview-lens)
- [✅ Key takeaways](#-key-takeaways)
- [🔗 Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 🧠 Mental model: message size là chi phí lan toả toàn hệ thống

Kích thước message không phải chi phí cục bộ (chỉ tốn thêm chút network) — nó là chi phí **nhân bản qua mọi
tầng** của hệ thống Kafka:

```
Producer buffer → network (produce request) → broker page cache/disk (× replication factor)
→ network (replicate tới follower) → network (fetch request từ consumer) → consumer memory
```

📌 Một message lớn hơn không chỉ tốn thêm dung lượng 1 lần — nó tốn thêm dung lượng **ở mọi bước trên**, và với
`replication factor = 3`, chi phí disk/network nội bộ cluster **nhân 3** so với kích thước gốc. Đây là lý do
message size là quyết định thiết kế ảnh hưởng toàn hệ thống, không phải chi tiết cục bộ của 1 producer.

## ⚙️ Message size ảnh hưởng batching/compression/network/disk/fetch thế nào

- **Batching**: producer gom nhiều message vào 1 batch trước khi gửi (`linger.ms`, `batch.size`). Message lớn
  hơn → **ít message hơn** vừa trong 1 batch có cùng kích thước byte giới hạn → giảm hiệu quả amortize chi phí
  cố định của mỗi request (network round-trip, broker xử lý request).
- **Compression**: hiệu quả nén (`compression.type`) tốt hơn khi có **nhiều message tương tự nhau trong cùng 1
  batch** để thuật toán nén tìm được pattern lặp lại. Batch chứa toàn message rất lớn (ít message/batch) giảm
  cơ hội nén hiệu quả so với batch chứa nhiều message nhỏ tương tự nhau.
- **Network**: message lớn hơn tăng trực tiếp băng thông tiêu thụ ở **cả produce request lẫn replicate
  request** (giữa các broker) lẫn **fetch request** (broker → consumer).
- **Disk**: mỗi message lớn hơn chiếm nhiều không gian log segment hơn, ảnh hưởng tốc độ segment roll (segment
  đầy nhanh hơn), và tăng I/O mỗi lần ghi.
- **Fetch efficiency**: consumer fetch theo giới hạn byte (`fetch.max.bytes`,
  `max.partition.fetch.bytes`) — nếu 1 message đơn lẻ đã gần chạm giới hạn, mỗi lần fetch chỉ lấy được rất ít
  message, giảm hiệu quả round-trip so với fetch được nhiều message nhỏ trong cùng 1 request.

## ⚖️ Small vs large messages trade-off

**Message nhỏ (vài trăm byte – vài KB), volume rất cao:**
- ✅ Batch hiệu quả (nhiều message/batch), nén hiệu quả, fetch hiệu quả (nhiều message/fetch request).
- ❌ Chi phí **cố định trên mỗi message** (message header, offset metadata, index entry) chiếm tỷ trọng tương
  đối lớn hơn so với payload thực — nếu số lượng cực lớn (hàng trăm nghìn msg/s), overhead này cộng dồn đáng
  kể.

**Message lớn (hàng trăm KB – vài MB):**
- ✅ Overhead tương đối trên mỗi byte payload thấp hơn.
- ❌ Giảm hiệu quả batching/nén, tăng áp lực tức thời lên network/disk mỗi lần ghi, tăng tail latency (1 message
  lớn "chiếm chỗ" lâu hơn trong hàng đợi xử lý so với nhiều message nhỏ), và **buộc phải tăng** các giới hạn
  cấu hình mặc định (`message.max.bytes`, `max.request.size`, `fetch.max.bytes`) — vốn được đặt thấp để bảo vệ
  broker khỏi 1 producer bất thường chiếm hết tài nguyên.

## 📊 Bảng: small vs medium vs very large payload mindset

| Payload size | Mindset phù hợp | Rủi ro nếu vượt ngưỡng này |
|---|---|---|
| < 10 KB (small) | Tối ưu cho throughput bằng batching/compression, đây là "vùng thoải mái" mặc định của Kafka | Không đáng kể ở mức này |
| 10 KB – 1 MB (medium) | Vẫn ổn với cấu hình mặc định hầu hết cluster, nhưng cần theo dõi hiệu quả batch/nén nếu volume cao | Batch kém hiệu quả hơn nếu volume rất cao, cần benchmark thực tế |
| > 1 MB (large) | Cần chủ động tăng `message.max.bytes`/`max.request.size`/`fetch.max.bytes`, và **đặt câu hỏi tại sao message lại lớn tới vậy** | Ảnh hưởng broker page cache, tăng tail latency, dễ trở thành nguồn nghẽn khi 1 vài message lớn xen giữa traffic nhỏ |
| Nhiều MB – hàng chục MB (very large) | Gần như luôn nên **lưu reference, không lưu blob trực tiếp** trong Kafka | Ảnh hưởng nghiêm trọng broker (disk I/O spike, page cache bị "đuổi" bởi payload lớn), rủi ro OOM phía consumer nếu buffer không kiểm soát |

## 🌡️ Throughput vs latency vs broker pressure

Đây là bộ ba không thể tối ưu đồng thời tuỳ ý — cải thiện 1 chiều gần như luôn trả giá ở chiều khác:

- **Tối ưu throughput** (batch lớn, `linger.ms` cao, compression mạnh) → tăng **latency trung bình** (message
  chờ lâu hơn trong buffer trước khi gửi) nhưng giảm số request/giây, giảm tải broker.
- **Tối ưu latency** (`linger.ms` thấp/0, batch nhỏ) → tăng số request/giây đáng kể → tăng **broker pressure**
  (CPU xử lý request overhead, network packet nhỏ nhiều hơn) và giảm hiệu quả nén.
- **Batch quá lớn** để tối ưu throughput tối đa lại **phá hỏng tail latency** (p99/p999) — vì 1 batch lớn phải
  đợi đủ đầy hoặc `linger.ms` hết hạn mới gửi, trong khi 1 vài message "xui rủi" rơi vào đầu 1 batch mới hình
  thành sẽ chờ lâu hơn hẳn message trung bình.

📌 Không có cấu hình "tối ưu tuyệt đối" — phải xác định rõ **SLA ưu tiên** (throughput tổng hay latency p99) rồi
mới chọn hướng đánh đổi, và luôn benchmark bằng traffic pattern thực tế, không copy cấu hình từ hệ thống khác
có traffic pattern khác.

## ⚙️ Record size / request size / fetch size — tư duy cấu hình

| Config | Vai trò | Trade-off khi tăng |
|---|---|---|
| `message.max.bytes` (broker/topic) | Giới hạn kích thước 1 message đơn lẻ được broker chấp nhận | Tăng → cho phép message lớn hơn, nhưng tăng rủi ro 1 producer "lỗi" gửi message khổng lồ chiếm hết page cache/disk I/O tạm thời |
| `max.request.size` (producer) | Giới hạn kích thước 1 request (có thể chứa nhiều message trong 1 batch) producer được phép gửi | Phải luôn ≤ `message.max.bytes` phía broker, nếu không producer nhận lỗi bị từ chối dù client-side tưởng hợp lệ |
| `fetch.max.bytes` (consumer, toàn request) | Giới hạn tổng dữ liệu 1 lần fetch request trả về (nhiều partition) | Tăng → giảm số round-trip cần thiết, nhưng tăng bộ nhớ tức thời cần cấp cho consumer xử lý 1 lần fetch |
| `max.partition.fetch.bytes` (consumer, mỗi partition) | Giới hạn dữ liệu tối đa fetch được từ **1 partition** trong 1 request | Nếu nhỏ hơn kích thước 1 message đơn lẻ trong partition đó, consumer **không fetch được gì** cho tới khi tăng giá trị này — đây là failure mode cụ thể, không phải lý thuyết |

## 📦 When to store reference instead of blob

Khi payload là file/ảnh/tài liệu lớn (hàng MB trở lên), nên:
- Lưu blob thực tế ở **object storage** (S3, GCS, blob storage tương đương).
- Chỉ publish **reference** (URL/key + metadata cần thiết: content-type, size, checksum) lên Kafka.

Lý do:
- Kafka được tối ưu cho **throughput cao, message tương đối nhỏ, xử lý theo dòng (streaming)** — không phải hệ
  thống lưu trữ blob tổng quát.
- Giữ message nhỏ giúp **duy trì được lợi ích batching/compression/replication hiệu quả** cho toàn bộ topic,
  không bị 1 loại dữ liệu đặc thù (file lớn) kéo tụt hiệu năng chung.
- Object storage vốn được thiết kế chuyên biệt cho việc lưu blob lớn với chi phí thấp hơn nhiều so với chi phí
  lưu trên Kafka (vốn nhân bản dữ liệu × replication factor và giữ trong retention window, tốn kém hơn nhiều
  cho dữ liệu dung lượng lớn ít khi cần "replay" nhanh).

## 🧭 Key decisions

1. **Xác định SLA ưu tiên (throughput tổng vs latency p99) trước khi chọn `linger.ms`/`batch.size`** — không
   chọn cấu hình mặc định mù quáng.
2. **Đặt ngưỡng "cảnh báo" cho message size** (ví dụ > 1 MB cần review) để chủ động phát hiện payload đang phình
   to dần thay vì phát hiện khi đã gây sự cố.
3. **Không tăng `message.max.bytes` để "cho qua" một use case chưa rõ ràng** — luôn hỏi trước "tại sao message
   lại lớn tới vậy, có nên tách reference ra ngoài không".
4. **Benchmark bằng traffic pattern thực tế của hệ thống mình**, không copy cấu hình throughput/latency từ blog
   khác (phần cứng, message size, compression khác nhau cho kết quả khác nhau).

## ⚖️ Design trade-offs

- ✅ Batch lớn + `linger.ms` cao → throughput cao, ít request/giây, giảm broker pressure.
  ❌ Đổi lại: latency trung bình và tail latency (p99) tăng — không phù hợp cho luồng cần phản hồi gần
  real-time.
- ✅ `linger.ms` thấp/0 → latency thấp cho từng message riêng lẻ.
  ❌ Đổi lại: nhiều request nhỏ hơn → tăng broker pressure, giảm hiệu quả nén, tổng throughput hệ thống thấp
  hơn.
- ✅ Lưu reference thay vì blob → giữ Kafka nhẹ, hiệu năng ổn định cho toàn hệ thống.
  ❌ Đổi lại: thêm 1 bước gọi object storage phía consumer để lấy nội dung thực, tăng độ phức tạp luồng xử lý và
  phụ thuộc thêm 1 hệ thống ngoài.

## 🚨 Failure modes

| Sự kiện | Nguyên nhân | Hệ quả |
|---|---|---|
| Consumer không fetch được gì, lag tăng vô hạn dù broker khoẻ | `max.partition.fetch.bytes` nhỏ hơn kích thước message thực tế trong partition | Consumer kẹt cứng ở 1 offset, cần tăng config và restart mới xử lý tiếp |
| Producer bị từ chối gửi dù dưới `message.max.bytes` | `max.request.size` phía producer nhỏ hơn giới hạn broker nhưng cấu hình không khớp kỳ vọng | Lỗi khó hiểu lúc đầu ("tưởng đã tăng giới hạn rồi") vì 2 config nằm ở 2 phía khác nhau |
| Broker page cache bị "đuổi" liên tục, throughput đọc toàn cluster giảm | Nhiều message rất lớn (file/blob) được ghi liên tục, chiếm phần lớn page cache | Ảnh hưởng cả topic khác dùng chung broker, không chỉ topic chứa message lớn |
| Tail latency (p99) xấu bất thường dù throughput trung bình ổn | Batch quá lớn hoặc trộn lẫn message rất khác size trong cùng topic | SLA latency bị vi phạm dù dashboard trung bình "trông ổn" |

## ❌ Anti-patterns

### ❌ Nhét file/blob lớn vào Kafka
**Biểu hiện:** publish trực tiếp nội dung file PDF, ảnh độ phân giải cao, hoặc video ngắn dưới dạng base64/bytes
trong message Kafka.
**Tại sao người ta hay làm vậy:** "tiện" — không cần thêm hệ thống lưu trữ khác, cứ đẩy hết qua Kafka cho đồng
bộ pipeline.
**Tại sao nó là vấn đề:** phá vỡ mọi lợi ích batching/compression/replication hiệu quả của Kafka cho topic đó
(và ảnh hưởng broker dùng chung cho topic khác), tốn chi phí lưu trữ cao hơn nhiều lần so với object storage
chuyên dụng vì dữ liệu bị nhân bản × replication factor và giữ trong retention window.
**Thay vào đó nên làm:** ✅ Lưu blob ở object storage, chỉ publish reference + metadata lên Kafka.

### ❌ Optimize latency nhưng phá throughput
**Biểu hiện:** set `linger.ms=0`, `batch.size` rất nhỏ cho toàn bộ hệ thống chỉ vì 1 luồng nghiệp vụ cụ thể cần
latency thấp, áp dụng cấu hình đó cho mọi producer trong tổ chức.
**Tại sao người ta hay làm vậy:** "latency thấp nghe có vẻ luôn tốt hơn", không phân biệt luồng nào thực sự cần
độ trễ thấp và luồng nào (ví dụ batch analytics ingestion) hoàn toàn không quan tâm latency từng message.
**Tại sao nó là vấn đề:** với luồng volume cao không cần latency thấp, cấu hình này làm tăng số request/giây
không cần thiết, tăng tải broker và CPU producer, giảm throughput tổng thể toàn cluster mà không mang lại lợi
ích gì cho use case đó.
**Thay vào đó nên làm:** ✅ Cấu hình `linger.ms`/`batch.size` **theo từng producer/use case cụ thể**, dựa trên
SLA thực sự của luồng nghiệp vụ đó, không áp dụng đồng loạt 1 cấu hình cho toàn hệ thống.

### ❌ Batch quá lớn làm tail latency xấu
**Biểu hiện:** set `linger.ms` và `batch.size` rất cao để tối đa hoá throughput, không đo lại ảnh hưởng tới p99
latency.
**Tại sao người ta hay làm vậy:** benchmark chỉ nhìn throughput trung bình/tổng, không đo phân phối latency
(percentile), nên "trông có vẻ" cấu hình này tốt hơn hẳn.
**Tại sao nó là vấn đề:** throughput trung bình tốt có thể che giấu tail latency rất xấu — với luồng nghiệp vụ
có SLA về thời gian phản hồi (ví dụ event cần xử lý trong vài trăm ms), batch lớn khiến một phần đáng kể message
chờ lâu hơn ngưỡng SLA dù giá trị trung bình vẫn "đẹp" trên dashboard.
**Thay vào đó nên làm:** ✅ Luôn benchmark và giám sát theo **percentile** (p95/p99), không chỉ trung bình; chọn
`linger.ms`/`batch.size` cân bằng theo SLA latency thực tế cần đạt, không tối đa hoá throughput mù quáng.

## 🧪 Mini scenarios

**Scenario 1 — High-QPS tiny events:**
Hệ thống clickstream 200,000 event/s, mỗi event ~150 byte. Team set `linger.ms=20`, `batch.size=256KB`,
`compression.type=lz4` — mỗi batch chứa hàng nghìn event nhỏ, nén hiệu quả cao (dữ liệu clickstream có cấu trúc
lặp lại nhiều), giảm số request/giây từ hàng trăm nghìn xuống còn vài nghìn request/giây thực tế gửi tới broker,
throughput tổng cao trong khi latency thêm vào chỉ ~20ms — chấp nhận được vì clickstream không cần phản hồi
real-time tuyệt đối.

**Scenario 2 — Large CDC payload:**
Debezium capture thay đổi từ 1 bảng có cột `document_content` (text lớn, trung bình 300KB/row). Message trung
bình vượt xa mức "small" thông thường của Kafka. Team cân nhắc 2 hướng: (a) tăng `message.max.bytes` và
`fetch.max.bytes` toàn cluster để chấp nhận payload lớn, chấp nhận ảnh hưởng page cache; hoặc (b) tách cột
`document_content` ra khỏi luồng CDC chính (chỉ CDC các cột metadata thay đổi thường xuyên, lưu content lớn ở
nơi khác và chỉ tham chiếu). Team chọn (b) vì nhận ra phần lớn consumer downstream **không cần** nội dung đầy
đủ mỗi lần thay đổi, chỉ cần biết "row nào đổi, khi nào" — giảm payload trung bình xuống còn vài KB.

**Scenario 3 — Image/document workflow:**
Hệ thống xử lý upload tài liệu của người dùng: producer nhận file, lưu vào S3, rồi publish message
`documents.document.uploaded` chỉ chứa `{document_id, s3_key, content_type, size_bytes, uploaded_at}` (vài trăm
byte) lên Kafka. Các consumer (OCR service, virus scan service, thumbnail generator) đọc message, tự tải nội
dung thật từ S3 bằng `s3_key` khi cần xử lý — Kafka chỉ đóng vai trò **điều phối sự kiện**, không lưu trữ nội
dung file, giữ throughput và độ ổn định cluster không bị ảnh hưởng bởi kích thước file người dùng upload.

## 🎤 Interview lens

**"Message trong Kafka nên có kích thước bao nhiêu là hợp lý?"**
> Câu trả lời yếu: đưa ra 1 con số tuyệt đối ("dưới 1MB là ổn"). Câu trả lời tốt phải giải thích được **vì sao**
> có ngưỡng đó — ảnh hưởng tới batching/compression/fetch efficiency/page cache — và đề xuất nguyên tắc "lưu
> reference thay vì blob" cho payload lớn, thay vì chỉ đưa ra con số cứng không có lý do.

**"Làm sao cân bằng throughput và latency trong cấu hình producer?"**
> Interviewer đang test hiểu biết về `linger.ms`/`batch.size` có đi kèm reasoning hay chỉ thuộc tên config. Câu
> trả lời tốt phải nêu được: đây là trade-off không thể có cả hai tối đa cùng lúc, cần xác định SLA ưu tiên
> trước (throughput tổng hay latency p99), và phải nhắc tới rủi ro batch quá lớn phá tail latency dù throughput
> trung bình "đẹp".

## ✅ Key takeaways

- Message size là chi phí **lan toả toàn hệ thống** (nhân với replication factor ở mọi tầng network/disk),
  không phải chi phí cục bộ.
- Batching/compression/fetch efficiency đều **giảm hiệu quả** khi message quá lớn — Kafka được tối ưu cho
  message tương đối nhỏ, volume cao.
- Throughput, latency, và broker pressure là bộ ba đánh đổi lẫn nhau — luôn xác định SLA ưu tiên trước khi
  cấu hình, và luôn benchmark theo percentile (p99), không chỉ trung bình.
- `message.max.bytes`, `max.request.size`, `fetch.max.bytes`, `max.partition.fetch.bytes` phải được cấu hình
  nhất quán giữa broker và client — lệch nhau gây failure mode cụ thể (consumer kẹt cứng, producer bị từ chối).
- Payload lớn (file/blob) nên lưu ở object storage, Kafka chỉ mang reference + metadata.

## 🔗 Xem tiếp / Liên kết liên quan

- Trước đó: [`04-schema-design-avro-protobuf-json.md`](04-schema-design-avro-protobuf-json.md) — format ảnh
  hưởng trực tiếp tới kích thước payload.
- Tiếp theo: [`06-ordering-vs-scalability-tradeoffs.md`](06-ordering-vs-scalability-tradeoffs.md).
- [`../01-foundation/07-producer-configs-and-delivery-behavior.md`](../01-foundation/07-producer-configs-and-delivery-behavior.md)
  — nền tảng `linger.ms`, `batch.size`, `compression.type`.
- [`../GLOSSARY.md`](../GLOSSARY.md) — tra cứu `throughput`, `latency`, `backpressure`.
