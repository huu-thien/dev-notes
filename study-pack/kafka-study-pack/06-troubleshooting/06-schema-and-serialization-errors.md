# Schema and Serialization Errors

## 🎯 Mục tiêu học

Sau khi đọc xong, bạn sẽ:
- Phân biệt được **producer/consumer schema mismatch**, **serialization vs deserialization failure**, và
  **registry compatibility issue** — 3 loại lỗi khác nhau dễ bị gộp chung thành "lỗi schema".
- Hiểu vì sao **bad rollout sequencing** (thứ tự deploy sai) gây lỗi dù schema về mặt kỹ thuật tương thích.
- Biết cách xử lý **tombstone/nullable/missing field surprises** — các trường hợp dễ gây crash không lường
  trước.
- Có debugging workflow để phân biệt: đây là lỗi schema, lỗi code, hay lỗi thứ tự rollout?

## 📖 Mục lục

- [Symptom](#-symptom)
- [Why this happens](#-why-this-happens)
- [Likely cause families](#-likely-cause-families)
- [Tombstone / nullable / missing field surprises](#-tombstone--nullable--missing-field-surprises)
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

- Consumer throw exception khi deserialize message (`SerializationException` hoặc tương đương).
- Consumer chạy được nhưng dữ liệu sau khi deserialize **sai/thiếu field** so với kỳ vọng (không throw
  exception, nhưng logic nghiệp vụ downstream sai).
- Schema Registry từ chối đăng ký schema mới (`compatibility check failed`) khi producer cố deploy version mới.
- Lỗi chỉ xuất hiện với **1 số consumer cụ thể** (ví dụ consumer cũ chưa deploy) trong khi consumer khác chạy
  bình thường.

## 🧠 Why this happens

Lỗi schema/serialization gần như luôn bắt nguồn từ **sự lệch pha giữa "producer đang ghi theo schema nào" và
"consumer đang mong đợi đọc theo schema nào"** tại 1 thời điểm cụ thể — không phải lúc nào cũng là do schema
"sai" về mặt kỹ thuật; rất nhiều trường hợp là do **thứ tự rollout** (deploy consumer sau khi lẽ ra phải deploy
trước) gây ra lỗi tạm thời trong lúc migrate.

## 🗂️ Likely cause families

| # | Cause family | Cơ chế |
|---|---|---|
| 1 | **Producer/consumer schema mismatch** | Producer đã đổi sang schema mới, consumer vẫn dùng schema cũ chưa được cập nhật (hoặc ngược lại) |
| 2 | **Deserialization failure** | Message được ghi bằng format/schema mà consumer không có khả năng đọc (ví dụ đổi từ Avro sang Protobuf mà không có kế hoạch migrate) |
| 3 | **Registry compatibility issue** | Schema mới vi phạm compatibility mode đang áp dụng cho subject đó (ví dụ xoá field bắt buộc trong khi mode là `BACKWARD`) |
| 4 | **Bad rollout sequencing** | Deploy producer trước khi tất cả consumer sẵn sàng đọc schema mới (hoặc ngược lại tuỳ compatibility mode), gây lỗi tạm thời trong cửa sổ rollout |
| 5 | **Tombstone/nullable/missing field không được xử lý** | Consumer logic giả định field luôn có giá trị, không xử lý trường hợp `null`/tombstone/field bị thiếu do version cũ |

## 🧩 Tombstone / nullable / missing field surprises

- **Tombstone** (message value = `null`) trong compacted topic hoặc CDC event biểu thị "record đã bị xoá" —
  nếu consumer không xử lý tường minh trường hợp value `null`, code có thể crash (NullPointerException tương
  đương) hoặc bỏ sót event xoá quan trọng.
- **Field mới thêm dạng optional** đọc bởi consumer cũ sẽ **không thấy field đó tồn tại** — nếu code consumer
  cũ vô tình được deploy lại (rollback) sau khi đã quen với field mới, có thể gây lỗi logic ẩn.
- **Field bị xoá** trong schema mới, nếu compatibility mode không đúng chuẩn (`BACKWARD` cho phép xoá field có
  default, nhưng không phải mọi trường hợp xoá đều an toàn), consumer cũ đọc message mới có thể nhận giá trị
  default không như kỳ vọng nghiệp vụ.
- 📌 Xem chi tiết compatibility mode ở
  [`../04-ecosystem/02-schema-registry.md`](../04-ecosystem/02-schema-registry.md).

## 🧭 Debugging workflow

1. **Xác định lỗi xảy ra ở đâu**: producer (không ghi được / bị registry từ chối) hay consumer (deserialize
   lỗi / dữ liệu sai)?
2. **Nếu là consumer**: kiểm tra chính xác **schema version** của message gây lỗi (đọc trực tiếp schema ID gắn
   kèm message, tra cứu trong registry) so với schema version mà consumer đang implement.
3. **Kiểm tra timeline deploy**: producer/consumer nào deploy gần đây nhất, đúng thời điểm lỗi xuất hiện? Đây
   thường là manh mối mạnh nhất để phân biệt "lỗi schema thật" và "lỗi thứ tự rollout tạm thời".
4. **Kiểm tra compatibility mode** đang áp dụng cho subject đó trong registry — xác nhận thay đổi gần nhất có
   thực sự tuân thủ mode này không (registry có thể đã cho phép đăng ký dù thực tế gây vấn đề runtime nếu
   compatibility check không đủ chặt).
5. **Kiểm tra dữ liệu cụ thể gây lỗi**: có phải tombstone, field null, hay field bị thiếu? Đọc trực tiếp message
   thô (trước khi qua logic consumer) để xác nhận cấu trúc thực tế.
6. **Không kết luận "cần rollback schema"** trước khi xác định rõ đây là vấn đề tạm thời (rollout sequencing,
   sẽ tự hết khi mọi consumer đã deploy xong) hay vĩnh viễn (breaking change thực sự cần xử lý).

## ⚠️ Common false assumptions

- ❌ "Registry cho phép đăng ký nghĩa là an toàn 100%" — registry chỉ kiểm tra compatibility theo mode đã cấu
  hình; không đảm bảo logic nghiệp vụ downstream vẫn đúng (ví dụ field đổi ý nghĩa nhưng type không đổi).
- ❌ "JSON tự do an toàn hơn Avro/Protobuf vì không cần registry" — thực ra JSON tự do **rủi ro hơn** vì không
  có compatibility check tự động nào cả; lỗi chỉ lộ ra khi runtime, không được chặn trước khi deploy.
- ❌ "Lỗi deserialize chắc chắn là do schema" — có thể do bug code (ví dụ dùng sai deserializer class, sai
  subject name khi tra registry) chứ không phải bản thân schema có vấn đề.
- ❌ "Đổi 1 field nhỏ không đáng lo" — ngay cả thay đổi nhỏ (đổi kiểu dữ liệu field, đổi field từ required sang
  removed) có thể phá vỡ consumer cũ nếu không đúng compatibility mode.

## 🛠️ Fix directions

| Nguyên nhân | Hướng fix |
|---|---|
| Producer/consumer mismatch tạm thời | Hoàn tất rollout theo đúng thứ tự (deploy consumer trước nếu backward compatibility, producer trước nếu forward) |
| Registry compatibility issue | Sửa lại schema thay đổi cho tuân thủ compatibility mode, hoặc tạo subject/version mới có kế hoạch migrate rõ ràng |
| Tombstone không xử lý | Thêm xử lý tường minh cho message value `null` trong logic consumer |
| Field null/missing không lường trước | Dùng default value hợp lý trong schema, kiểm tra null-safety trong code deserialize |
| Bad rollout sequencing | Có checklist rollout rõ ràng theo compatibility mode trước khi deploy thay đổi schema |

## 🧱 Prevention / design fix

- Luôn dùng schema có compatibility check tự động (Avro/Protobuf/JSON Schema qua Schema Registry) thay vì JSON
  tự do không kiểm soát — xem
  [`../03-design-and-architecture/04-schema-design-avro-protobuf-json.md`](../03-design-and-architecture/04-schema-design-avro-protobuf-json.md).
- Có **versioning discipline** rõ ràng: mọi thay đổi schema phải qua review, xác định đúng compatibility mode
  áp dụng, và có kế hoạch rollout theo đúng thứ tự.
- Luôn xử lý tường minh: tombstone (`null` value), field optional bị thiếu, và default value — không giả định
  dữ liệu luôn "đầy đủ và sạch".
- Test compatibility trên staging với **cả 2 chiều** (consumer cũ đọc message mới, và ngược lại nếu áp dụng)
  trước khi rollout production.

## ❌ Anti-patterns

### ❌ Đổi schema breaking không có rollout strategy
**Biểu hiện:** thay đổi schema (xoá field, đổi kiểu dữ liệu) và deploy producer ngay, không kiểm tra consumer
nào đang chạy phiên bản nào.
**Tại sao hay làm vậy:** thay đổi có vẻ nhỏ, không nghĩ cần lập kế hoạch rollout cho "chỉ 1 field".
**Tại sao là vấn đề:** consumer cũ (kể cả chỉ 1 instance chưa deploy kịp) có thể crash hoặc xử lý sai ngay khi
gặp message theo schema mới.
**Thay vào đó nên làm:** ✅ Luôn xác định compatibility mode áp dụng và thứ tự rollout đúng trước khi thay đổi
schema có khả năng breaking.

### ❌ Assume JSON tự do là an toàn hơn
**Biểu hiện:** chọn JSON không qua registry vì "đơn giản, linh hoạt, không bị ràng buộc bởi compatibility
check".
**Tại sao hay làm vậy:** JSON dễ viết, không cần học Avro/Protobuf, cảm giác linh hoạt hơn.
**Tại sao là vấn đề:** thiếu compatibility check tự động nghĩa là **không có gì chặn** một thay đổi breaking
trước khi nó gây lỗi ở production — rủi ro chuyển từ "bị chặn khi deploy" sang "phát hiện khi runtime", tốn kém
hơn nhiều.
**Thay vào đó nên làm:** ✅ Dùng JSON Schema qua Schema Registry nếu muốn giữ JSON nhưng vẫn cần compatibility
check, hoặc chuyển sang Avro/Protobuf cho use case cần governance chặt.

### ❌ Không có versioning discipline
**Biểu hiện:** thay đổi schema tuỳ tiện, không có quy trình review/approval, không ghi chú lại lý do thay đổi.
**Tại sao hay làm vậy:** áp lực deadline khiến team bỏ qua bước review "chỉ để thêm 1 field".
**Tại sao là vấn đề:** tích luỹ theo thời gian, không ai còn nắm được lịch sử thay đổi schema, khó truy vết khi
có sự cố liên quan tới 1 version cụ thể.
**Thay vào đó nên làm:** ✅ Có quy trình review schema thay đổi như review code, ghi chú rõ compatibility impact
của mỗi thay đổi.

## 🧪 Mini scenarios

**Scenario 1 — Consumer cũ crash sau khi producer deploy schema mới:**
Producer xoá 1 field không có default value, deploy trước khi tất cả consumer instance kịp cập nhật. Compatibility
mode là `BACKWARD` nhưng registry vẫn cho phép đăng ký (do field đó vốn optional ở phiên bản trước). Consumer cũ
crash khi cố truy cập field đã bị xoá trong code (không kiểm tra null). Fix: rollback schema tạm thời, thêm
null-check ở consumer, rồi rollout lại theo đúng thứ tự (consumer trước, producer sau).

**Scenario 2 — Registry từ chối đăng ký schema mới:**
Producer cố đổi kiểu dữ liệu 1 field từ `string` sang `int`, registry từ chối vì vi phạm compatibility mode
đang áp dụng. Team ban đầu định "ép" bằng cách hạ compatibility mode xuống `NONE` để deploy được ngay. Sau khi
cân nhắc, team quyết định tạo field mới thay vì đổi kiểu field cũ, giữ nguyên compatibility mode chặt.

**Scenario 3 — Tombstone không được xử lý trong CDC pipeline:**
Consumer tiêu thụ CDC event từ Debezium, không xử lý tường minh trường hợp value `null` (biểu thị record đã bị
xoá ở nguồn). Code cố truy cập field trong message null, gây exception liên tục mỗi khi có row bị xoá ở
database nguồn. Fix: thêm xử lý riêng cho tombstone event (thực hiện xoá tương ứng ở downstream) trước khi
truy cập bất kỳ field nào.

## 🎤 Interview lens

**"Producer đổi schema, consumer bắt đầu lỗi. Bạn điều tra thế nào?"**
> Câu trả lời tốt cần thể hiện: xác định schema version của message gây lỗi, so với schema mà consumer đang
> implement, kiểm tra timeline deploy để phân biệt "lỗi tạm thời do rollout sequencing" và "breaking change
> thực sự vi phạm compatibility mode" — không kết luận ngay là "schema bị lỗi" mà chưa kiểm tra thứ tự rollout.

**"Bạn nghĩ JSON không cần Schema Registry có ổn không?"**
> Câu trả lời tốt cần chỉ ra: JSON tự do không có gì sai về mặt kỹ thuật, nhưng đánh đổi mất khả năng phát hiện
> breaking change **trước khi** deploy — rủi ro chuyển từ "bị chặn ở compile/registry-check time" sang "phát
> hiện lúc runtime production", đây là chi phí ẩn cần cân nhắc kỹ khi chọn format.

## ✅ Key takeaways

- Lỗi schema/serialization có 5 họ nguyên nhân khác nhau: mismatch, deserialization failure, registry
  compatibility issue, bad rollout sequencing, và tombstone/null/missing field không được xử lý.
- Rất nhiều lỗi "schema" thực chất là lỗi **thứ tự rollout tạm thời**, sẽ tự hết khi mọi consumer đã cập nhật —
  cần phân biệt với breaking change thực sự.
- Registry compatibility check là công cụ phòng ngừa quan trọng, nhưng không thay thế được versioning
  discipline và xử lý null-safety đúng trong code.

## 🔗 Xem tiếp / Liên kết liên quan

- [`../04-ecosystem/02-schema-registry.md`](../04-ecosystem/02-schema-registry.md) — compatibility mode chi
  tiết và schema as contract mental model.
- [`../03-design-and-architecture/04-schema-design-avro-protobuf-json.md`](../03-design-and-architecture/04-schema-design-avro-protobuf-json.md)
  — chọn format phù hợp use case.
- [`../05-operations/07-upgrades-and-compatibility.md`](../05-operations/07-upgrades-and-compatibility.md) —
  schema compatibility là 1 trục độc lập với broker/client version compatibility.
- [`README.md`](README.md) — quay lại tổng quan phần Troubleshooting.
