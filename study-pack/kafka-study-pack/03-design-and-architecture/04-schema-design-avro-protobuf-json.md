# Schema Design — Avro, Protobuf, JSON

## 🎯 Mục tiêu học

Sau khi đọc xong, bạn sẽ:
- Hiểu **schema là contract** giữa producer và consumer — không phải chi tiết implementation nội bộ của
  producer.
- So sánh được **Avro vs Protobuf vs JSON** theo tiêu chí thực dụng (governance, size, evolution, debugging,
  ecosystem fit), không chỉ theo cảm tính "cái nào phổ biến hơn".
- Hiểu **schema evolution thực sự là gì** và phân biệt rõ backward/forward/full compatibility ở mức reasoning,
  không học thuộc định nghĩa.
- Biết khi nào JSON **đủ tốt** và khi nào nó trở thành nợ kỹ thuật.
- Hiểu **operational pain** cụ thể khi không quản lý schema (không phải chỉ "sẽ có lỗi", mà lỗi kiểu gì, ở đâu).

## 📖 Mục lục

- [Mental model: schema là contract gì](#-mental-model-schema-là-contract-gì)
- [Self-describing vs registry-driven](#-self-describing-vs-registry-driven)
- [Schema evolution là gì thật sự](#-schema-evolution-là-gì-thật-sự)
- [Backward/forward/full compatibility ở mức thực dụng](#-backwardforwardfull-compatibility-ở-mức-thực-dụng)
- [Bảng so sánh Avro / Protobuf / JSON](#-bảng-so-sánh-avro--protobuf--json)
- [Khi nào JSON đủ tốt, khi nào không](#-khi-nào-json-đủ-tốt-khi-nào-không)
- [Operational pain nếu không quản schema](#-operational-pain-nếu-không-quản-schema)
- [Key decisions](#-key-decisions)
- [Design trade-offs](#️-design-trade-offs)
- [Failure modes](#-failure-modes)
- [❌ Anti-patterns](#-anti-patterns)
- [🧪 Mini scenarios](#-mini-scenarios)
- [🎤 Interview lens](#-interview-lens)
- [✅ Key takeaways](#-key-takeaways)
- [🔗 Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 🧠 Mental model: schema là contract gì

Kafka **không hiểu và không quan tâm** nội dung message — với broker, message chỉ là bytes. Toàn bộ ý nghĩa
("field này là gì, kiểu dữ liệu gì, optional hay bắt buộc") tồn tại **chỉ trong sự đồng thuận** giữa producer
và consumer. Đó chính là **schema** — và vì producer/consumer là các service **độc lập, deploy độc lập**
(thường khác team, khác thời điểm release), schema thực chất đóng vai trò như một **API contract** giữa các
service, dù không có request/response trực tiếp nào.

📌 Hệ quả tư duy quan trọng nhất: **thay đổi schema là thay đổi API** — cần được review, versioning, và
compatibility-check giống hệt như thay đổi REST API contract, không phải "chỉ sửa 1 field trong code producer".

## 🗂️ Self-describing vs registry-driven

Có 2 mô hình quản lý schema, khác nhau về **nơi lưu "sự thật" về schema**:

- **Self-describing** (ví dụ JSON thuần không kèm registry): mỗi message tự chứa đủ thông tin để hiểu (tên
  field, kiểu dữ liệu ở dạng text). Không cần tra cứu gì thêm để đọc được — nhưng cũng **không có nơi nào**
  enforce rằng producer không được đổi cấu trúc tuỳ tiện.
- **Registry-driven** (Avro/Protobuf + Schema Registry): schema được đăng ký tập trung, mỗi message chỉ mang
  theo 1 schema ID nhỏ (vài byte) thay vì toàn bộ schema. Consumer tra registry để lấy schema tương ứng.
  Registry đồng thời là nơi **enforce compatibility rule** (chặn producer đăng ký schema breaking nếu vi phạm
  rule đã chọn).

💡 Registry-driven không chỉ tiết kiệm băng thông (không phải gửi kèm schema đầy đủ mỗi message) — giá trị lớn
hơn là **governance**: registry là chốt chặn kỹ thuật ngăn thay đổi breaking lọt vào production, thay vì dựa
vào review thủ công (dễ bỏ sót khi có hàng chục team cùng publish/consume).

## 🔄 Schema evolution là gì thật sự

Schema evolution là việc **thay đổi cấu trúc message theo thời gian** (thêm field, bớt field, đổi kiểu dữ
liệu...) trong khi **producer cũ, producer mới, consumer cũ, consumer mới vẫn có thể cùng tồn tại** trong một
khoảng thời gian chuyển tiếp (rolling deploy không đồng bộ tuyệt đối giữa các service).

📌 Điểm bị hiểu sai phổ biến nhất: nhiều người nghĩ "schema evolution" là vấn đề **deploy đồng bộ** (cứ deploy
producer và consumer cùng lúc là xong). Thực tế Kafka **cố tình** không đảm bảo thứ tự deploy — dữ liệu được
ghi bởi producer version cũ vẫn có thể được đọc bởi consumer version mới **rất lâu sau đó** (ví dụ khi replay
lại dữ liệu cũ, hoặc khi 1 consumer bị lag nhiều giờ/nhiều ngày). Vì vậy schema evolution phải xử lý được **mọi
tổ hợp** producer-cũ/mới × consumer-cũ/mới, không chỉ tổ hợp "gần nhất về thời gian deploy".

## ↔️ Backward/forward/full compatibility ở mức thực dụng

Thay vì học thuộc định nghĩa, hãy tư duy theo câu hỏi thực tế mỗi loại compatibility trả lời:

| Loại compatibility | Câu hỏi nó trả lời | Ai được nâng cấp trước an toàn |
|---|---|---|
| **Backward compatible** | "Consumer **mới** có đọc được data do producer **cũ** ghi không?" | Consumer có thể nâng cấp trước producer |
| **Forward compatible** | "Consumer **cũ** có đọc được data do producer **mới** ghi không?" | Producer có thể nâng cấp trước consumer |
| **Full compatible** | Cả 2 chiều trên đều đúng | Producer và consumer có thể nâng cấp theo **bất kỳ thứ tự nào** |

Quy tắc thực dụng khi thêm/bớt field (áp dụng cho Avro/Protobuf với default value đúng cách):
- **Thêm field mới** → an toàn cho **backward compatible** nếu field mới có **default value** (consumer cũ đơn
  giản bỏ qua field lạ nó không biết; consumer mới đọc data cũ thiếu field đó thì dùng default).
- **Xoá field** → an toàn cho **forward compatible** nếu field bị xoá **từng có default value** (consumer cũ
  vẫn mong field đó tồn tại thì dùng default khi không thấy).
- **Đổi kiểu dữ liệu của field hiện có** (ví dụ `int` → `string`) hầu như luôn là **breaking change** ở cả 2
  chiều — không có compatibility mode nào tự động xử lý được, cần field mới + deprecate field cũ dần dần.

⚠️ "Full compatible" nghe an toàn nhất nhưng **giới hạn nhiều nhất** những gì bạn được phép thay đổi (chỉ được
thêm/bớt field có default, không được đổi kiểu, không được đổi tên field không có alias) — chọn mức compatibility
là một trade-off giữa **tốc độ tiến hoá schema** và **mức độ tự do triển khai không đồng bộ** giữa các team.

## 📊 Bảng so sánh Avro / Protobuf / JSON

| Tiêu chí | Avro | Protobuf | JSON (thuần, không registry) |
|---|---|---|---|
| **Schema governance** | Mạnh — gắn chặt với Schema Registry, compatibility check tự động khi đăng ký | Mạnh — `.proto` file là schema tường minh, thường quản lý qua registry hoặc versioned repo | Yếu — không có gì enforce trừ khi tự xây kỷ luật/tooling riêng (JSON Schema + registry tự chế) |
| **Payload size** | Nhỏ (binary, không lặp lại tên field trong mỗi message) | Nhỏ nhất trong 3 (binary, tối ưu cho tốc độ + kích thước) | Lớn nhất (text, lặp lại tên field mọi message) |
| **Schema evolution** | Tốt, có rule rõ ràng (backward/forward/full) qua registry | Tốt, dùng field number thay vì tên field để evolve (field number không đổi dù đổi tên field) | Không có cơ chế chuẩn — tự triển khai bằng convention (optional field, versioning thủ công) |
| **Debugging convenience** | Kém hơn JSON — cần schema mới đọc được raw bytes (không "human-readable" trực tiếp) | Kém nhất về debug trực quan — binary hoàn toàn, cần `.proto` để decode | Tốt nhất — mở log lên đọc được ngay bằng mắt thường |
| **Ecosystem fit** | Rất mạnh trong hệ Kafka (native integration lâu đời với Schema Registry, Kafka Connect) | Mạnh, phổ biến hơn ở hệ gRPC/microservices đa ngôn ngữ, đang được hỗ trợ tốt dần trong Kafka ecosystem | Phổ biến nhất, không cần thêm hạ tầng — mọi ngôn ngữ đều parse JSON native |

## 🤔 Khi nào JSON đủ tốt, khi nào không

**JSON đủ tốt khi:**
- Volume thấp/trung bình, payload size không phải mối lo (không tối ưu network/disk là ưu tiên).
- Số lượng consumer ít, cùng 1 team/tổ chức kiểm soát cả producer và consumer (dễ phối hợp thay đổi thủ công).
- Cần **debug nhanh** bằng mắt thường (ví dụ giai đoạn early-stage, log thường xuyên bị inspect thủ công).
- Không có yêu cầu governance chặt (không phải dữ liệu tài chính/compliance nhạy cảm về tính đúng đắn cấu
  trúc).

**JSON không còn đủ khi:**
- Nhiều team độc lập cùng consume 1 topic — không có cơ chế nào chặn producer đổi breaking mà không ai biết
  trước khi production gặp lỗi parse.
- Volume cao, payload size ảnh hưởng thực sự tới network/disk/throughput (xem
  [`05-message-size-throughput-latency.md`](05-message-size-throughput-latency.md)).
- Cần audit/replay dữ liệu cũ với độ tin cậy cao về cấu trúc (dữ liệu tài chính, compliance).
- Hệ thống đã đủ lớn để "1 người quên đổi 1 field" gây sự cố production diện rộng, khó truy vết ai là nguyên
  nhân.

## 💥 Operational pain nếu không quản schema

Đây là hậu quả **cụ thể**, không phải cảnh báo chung chung:

- **Consumer crash hàng loạt vì field bị đổi kiểu đột ngột** — producer team đổi `"amount": 100` (number)
  thành `"amount": "100"` (string) để "tiện" gộp thêm đơn vị tiền tệ, không báo trước; mọi consumer parse JSON
  cứng kiểu (deserialize thẳng vào struct có field `amount: int`) bắt đầu ném exception ở production, thường bị
  phát hiện **sau khi** đã lan rộng vì log lỗi rải rác nhiều service khác nhau.
- **Silent data corruption** — field bị xoá nhưng consumer không báo lỗi (chỉ đọc giá trị mặc định/null của
  ngôn ngữ lập trình), dữ liệu tính toán sai âm thầm trong thời gian dài trước khi ai đó phát hiện qua báo cáo
  sai lệch, lúc đó phải truy ngược lại xem sai từ khi nào — cực kỳ tốn công.
- **Không thể replay dữ liệu cũ an toàn** — khi cần rebuild 1 service từ đầu bằng cách replay lại toàn bộ topic
  (retention dài), dữ liệu cũ có cấu trúc khác dữ liệu mới mà không có schema version rõ ràng để biết cách parse
  đúng cho từng giai đoạn.

## 🧭 Key decisions

1. **Chọn registry-driven (Avro/Protobuf) mặc định cho hệ thống nhiều team/nhiều consumer độc lập** — JSON chỉ
   nên là lựa chọn có ý thức cho phạm vi nhỏ, không phải mặc định vì "dễ bắt đầu".
2. **Chọn mức compatibility (backward/forward/full) dựa trên nhu cầu deploy độc lập thực tế** giữa các team,
   không mặc định chọn "full" nếu không cần — full giới hạn tốc độ tiến hoá schema nhiều nhất.
3. **Mọi field mới phải có default value**, mọi field xoá phải qua giai đoạn deprecate (đánh dấu optional, chờ
   consumer cập nhật) trước khi xoá hẳn — không xoá field trực tiếp trong 1 lần đổi.
4. **Đổi kiểu dữ liệu field hiện có = luôn tạo field mới**, không cố "ép" kiểu cũ sang kiểu mới trên cùng tên
   field.

## ⚖️ Design trade-offs

- ✅ Avro/Protobuf + registry → governance mạnh, payload nhỏ, evolution an toàn.
  ❌ Đổi lại: cần thêm hạ tầng (Schema Registry), giảm khả năng debug trực quan (không đọc được raw bytes bằng
  mắt thường), tăng độ phức tạp ban đầu (cần định nghĩa schema tường minh trước khi code).
- ✅ JSON thuần → bắt đầu nhanh, debug dễ, không cần hạ tầng thêm.
  ❌ Đổi lại: không có governance nào chặn breaking change, payload lớn hơn, evolution phụ thuộc hoàn toàn vào
  kỷ luật thủ công của con người (dễ vỡ khi tổ chức lớn lên).
- ✅ Full compatibility mode → an toàn tuyệt đối cho thứ tự deploy bất kỳ.
  ❌ Đổi lại: giới hạn chặt nhất những gì được phép thay đổi trong schema, có thể làm chậm tốc độ phát triển
  tính năng nếu áp dụng máy móc cho mọi topic bất kể mức độ rủi ro thực tế.

## 🚨 Failure modes

| Sự kiện | Nguyên nhân | Hệ quả |
|---|---|---|
| Hàng loạt consumer parse lỗi cùng lúc | Producer đổi kiểu dữ liệu field mà không qua compatibility check | Outage lan rộng nhiều service, khó xác định nguyên nhân gốc nhanh chóng |
| Dữ liệu tính sai âm thầm nhiều ngày | Field bị xoá nhưng consumer không có validation, tự dùng giá trị mặc định | Phát hiện muộn qua báo cáo sai lệch, khó truy vết thời điểm bắt đầu sai |
| Không replay được dữ liệu lịch sử | Không version hoá schema, nhiều "hình dạng" JSON khác nhau tồn tại trong cùng topic không phân biệt được | Rebuild service từ event log thất bại hoặc cho kết quả sai |
| Registry chặn producer deploy | Compatibility mode quá chặt (full) cho 1 thay đổi thực ra an toàn về ngữ nghĩa nhưng vi phạm rule kỹ thuật | Trì hoãn release, cần workaround (field mới thay vì sửa field cũ) |

## ❌ Anti-patterns

### ❌ JSON tự do không governance
**Biểu hiện:** mọi producer tự do serialize JSON theo ý mình, không có schema file, không có registry, không có
review bắt buộc khi đổi cấu trúc message.
**Tại sao người ta hay làm vậy:** JSON quá dễ dùng — không cần định nghĩa gì trước, `JSON.stringify(object)` là
xong, tốc độ phát triển ban đầu rất nhanh.
**Tại sao nó là vấn đề:** khi số lượng consumer tăng, không ai biết trước thay đổi của producer có phá vỡ
consumer nào không — sự cố chỉ lộ ra **sau khi** deploy, ở phía consumer (thường là team khác), rất khó truy
vết nguyên nhân nhanh.
**Thay vào đó nên làm:** ✅ Tối thiểu dùng JSON Schema + registry tự triển khai để enforce compatibility, hoặc
chuyển hẳn sang Avro/Protobuf khi số consumer độc lập đủ lớn.

### ❌ Đổi field breaking mà không có compatibility strategy
**Biểu hiện:** đổi tên field, đổi kiểu dữ liệu, hoặc xoá field trực tiếp trong 1 lần deploy vì "chỉ là sửa nhỏ".
**Tại sao người ta hay làm vậy:** thay đổi có vẻ nhỏ và "hiển nhiên đúng" từ góc nhìn producer, không nghĩ tới
việc consumer có thể đang lag hoặc chưa deploy phiên bản mới tương ứng.
**Tại sao nó là vấn đề:** Kafka không đảm bảo producer/consumer deploy đồng bộ — dữ liệu cũ và mới **cùng tồn
tại** trên topic trong khoảng thời gian không xác định trước, consumer cũ/mới đều có thể gặp phải cả 2 dạng dữ
liệu.
**Thay vào đó nên làm:** ✅ Luôn đi qua giai đoạn: thêm field mới (giữ field cũ) → chờ mọi consumer chuyển sang
dùng field mới → deprecate field cũ → xoá sau khi xác nhận không còn consumer nào phụ thuộc.

### ❌ Embedded meaning trong string payload
**Biểu hiện:** nhồi nhiều thông tin có cấu trúc vào 1 string tự do (ví dụ `"metadata": "type=order;region=us;
priority=high"`), thay vì dùng field có kiểu dữ liệu rõ ràng.
**Tại sao người ta hay làm vậy:** "tiện", không cần đổi schema chính thức mỗi khi cần thêm 1 mẩu thông tin mới
— chỉ cần nhét thêm vào string.
**Tại sao nó là vấn đề:** mất hoàn toàn lợi ích của schema (không type-safe, không compatibility check, không
validation) — về bản chất đang tự tạo ra "schema ngầm" bên trong 1 field string mà không ai enforce hay
document được, dễ vỡ khi định dạng string đó thay đổi cấu trúc (ví dụ thêm dấu `;` hoặc đổi thứ tự key-value).
**Thay vào đó nên làm:** ✅ Định nghĩa field có cấu trúc rõ ràng (nested object/message) cho mọi thông tin cần
truyền, dùng đúng khả năng evolution của Avro/Protobuf thay vì tự chế bằng string.

## 🧪 Mini scenarios

**Scenario 1 — Mobile/backend evolution không đồng bộ:**
App mobile (release chậm, người dùng có thể không update app trong nhiều tháng) publish event lên topic
`app.user.action` bằng Protobuf. Backend team thêm field `device_locale` (có default value rỗng) cho phiên bản
mới — nhờ backward compatibility, backend service (consumer) đã nâng cấp có thể đọc được cả event cũ (thiếu
field, dùng default) lẫn event mới từ các phiên bản app khác nhau đang chạy song song ngoài thực tế, không cần
ép người dùng update app đồng loạt.

**Scenario 2 — Nhiều consumer độc lập:**
Topic `payments.payment.captured` (Avro + Schema Registry) được consume bởi 5 team khác nhau: billing,
fraud-detection, analytics, notification, và accounting reconciliation. Khi payments team cần đổi kiểu dữ liệu
field `amount` từ `float` sang `decimal string` (để tránh sai số floating-point trong tính toán tài chính), họ
**không thể** đổi trực tiếp field `amount` (breaking cho cả 5 consumer) — thay vào đó thêm field mới
`amount_decimal`, giữ `amount` cũ chạy song song, thông báo 5 team migrate dần, và chỉ xoá `amount` sau khi
registry xác nhận không còn consumer nào dùng compatibility mode cũ.

**Scenario 3 — CDC/data platform:**
Debezium capture thay đổi từ bảng `customers` trong PostgreSQL, publish lên Kafka bằng Avro qua Schema Registry.
Khi DBA thêm 1 cột mới vào bảng gốc, Debezium tự động cập nhật schema Avro tương ứng (thêm field mới, có
default) — data platform team dùng Kafka Connect Sink đọc dữ liệu này vào data warehouse **không bị gián đoạn**
nhờ backward compatibility được enforce tự động bởi registry, dù không ai chủ động báo trước cho data platform
team về thay đổi cột.

## 🎤 Interview lens

**"Khi nào bạn chọn Avro/Protobuf thay vì JSON cho Kafka?"**
> Câu trả lời yếu thường nói chung chung "Avro nhanh hơn, nhỏ hơn". Câu trả lời tốt phải nhấn vào **governance**
> là lý do chính (registry enforce compatibility tự động), không chỉ performance — vì với volume thấp,
> performance khác biệt không quan trọng bằng rủi ro breaking change không được kiểm soát khi số consumer tăng.

**"Backward compatible nghĩa là gì, giải thích không dùng định nghĩa sách giáo khoa?"**
> Câu trả lời tốt: "Nghĩa là tôi có thể nâng cấp **consumer** trước, mà không cần đợi mọi producer nâng cấp
> theo — vì consumer mới vẫn đọc được dữ liệu cũ. Ngược lại là forward compatible: nâng cấp producer trước an
> toàn." Câu trả lời yếu chỉ lặp lại định nghĩa mà không nối được với "ai được phép deploy trước" — đây là điểm
> phân biệt hiểu bản chất vs học thuộc.

## ✅ Key takeaways

- Schema là API contract giữa producer/consumer độc lập — thay đổi schema phải được đối xử nghiêm túc như thay
  đổi API, không phải chi tiết nội bộ.
- Registry-driven (Avro/Protobuf) thắng JSON thuần chủ yếu ở **governance** (enforce compatibility tự động),
  không chỉ ở performance/size.
- Backward/forward/full compatibility trả lời câu hỏi "ai được nâng cấp trước an toàn" — chọn mức phù hợp với
  nhu cầu deploy độc lập thực tế, không mặc định chọn chặt nhất.
- Đổi kiểu dữ liệu hoặc xoá field luôn nên đi qua field mới + giai đoạn deprecate, không sửa trực tiếp field
  đang dùng.
- JSON đủ tốt cho phạm vi nhỏ, ít consumer, cần debug nhanh — trở thành nợ kỹ thuật khi số consumer độc lập và
  volume tăng.

## 🔗 Xem tiếp / Liên kết liên quan

- Trước đó: [`03-key-design.md`](03-key-design.md) — key đi kèm payload có schema này.
- Tiếp theo: [`05-message-size-throughput-latency.md`](05-message-size-throughput-latency.md) — payload size
  ảnh hưởng thế nào tới hiệu năng, liên hệ trực tiếp với chọn format.
- [`../04-ecosystem/02-schema-registry.md`](../04-ecosystem/02-schema-registry.md) — Schema Registry,
  compatibility mode, và cách nó thực thi schema evolution ở mức production.
- [`../GLOSSARY.md`](../GLOSSARY.md) — tra cứu `schema evolution`, `CDC`.
