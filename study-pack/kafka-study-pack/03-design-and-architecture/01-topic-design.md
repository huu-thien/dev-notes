# Topic Design

## 🎯 Mục tiêu học

Sau khi đọc xong, bạn sẽ:
- Hiểu **topic là boundary của cái gì** (không chỉ là "cái tên chứa message") — ownership, schema, retention,
  access control, và consumer contract.
- Biết tư duy **thiết kế theo domain/business event** thay vì theo consumer hay theo tiện lợi ngắn hạn.
- Nhận diện được các **anti-pattern đặt topic** phổ biến và vì sao chúng hấp dẫn lúc đầu nhưng trả giá đắt sau
  này.
- Hiểu **naming convention** không phải chuyện thẩm mỹ — nó mã hoá ownership, versioning, và discoverability.
- Nối được **retention/compaction** với quyết định thiết kế topic (topic nào nên compact, topic nào nên có TTL
  ngắn).

## 📖 Mục lục

- [Mental model: topic là boundary của điều gì](#-mental-model-topic-là-boundary-của-điều-gì)
- [Thiết kế theo domain hay theo consumer?](#-thiết-kế-theo-domain-hay-theo-consumer)
- [Khi nào gộp nhiều event type vào 1 topic, khi nào tách](#-khi-nào-gộp-nhiều-event-type-vào-1-topic-khi-nào-tách)
- [Naming convention phục vụ điều gì](#-naming-convention-phục-vụ-điều-gì)
- [Bảng: Design choice → lợi ích → trade-off → nguy cơ](#-bảng-design-choice--lợi-ích--trade-off--nguy-cơ)
- [Ownership, compatibility, lifecycle](#-ownership-compatibility-lifecycle)
- [Retention/compaction ảnh hưởng topic design thế nào](#-retentioncompaction-ảnh-hưởng-topic-design-thế-nào)
- [Key decisions](#-key-decisions)
- [Design trade-offs](#️-design-trade-offs)
- [Failure modes](#-failure-modes)
- [❌ Anti-patterns](#-anti-patterns)
- [🧪 Mini scenarios](#-mini-scenarios)
- [🎤 Interview lens](#-interview-lens)
- [✅ Key takeaways](#-key-takeaways)
- [🔗 Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 🧠 Mental model: topic là boundary của điều gì

Một **topic** không chỉ là "cái tên chứa message" — nó là **boundary** đồng thời của 5 thứ khác nhau, và mỗi
quyết định thiết kế topic thực chất là quyết định về cả 5 boundary này cùng lúc:

1. **Ordering boundary** — ordering chỉ được đảm bảo trong 1 partition của 1 topic (xem
   [`../01-foundation/10-ordering-delivery-semantics.md`](../01-foundation/10-ordering-delivery-semantics.md)).
   Gộp 2 loại event vào cùng topic nghĩa là chúng **chia sẻ chung không gian partition/key**.
2. **Schema boundary** — mọi consumer đọc topic đó phải hiểu được **mọi schema** từng xuất hiện trên topic. Gộp
   nhiều schema không liên quan vào 1 topic ép consumer phải branch logic theo loại event.
3. **Retention/lifecycle boundary** — một topic chỉ có **một** chính sách retention/compaction. Nếu 2 loại dữ
   liệu cần chính sách khác nhau (ví dụ: audit log giữ 1 năm vs cache invalidation event giữ 1 giờ), gộp chung
   topic ép bạn chọn 1 chính sách không tối ưu cho cả hai.
2. **Access control boundary** — ACL (quyền đọc/ghi) được cấp ở **cấp topic**. Gộp nhiều loại dữ liệu nhạy cảm
   khác nhau vào 1 topic nghĩa là không thể cấp quyền chi tiết hơn cấp topic đó.
5. **Scaling/throughput boundary** — số partition, throughput, và consumer parallelism đều gắn với **1 topic
   cụ thể** (chi tiết ở [`02-partition-strategy.md`](02-partition-strategy.md)).

📌 Vì vậy: **"nên tạo bao nhiêu topic, đặt tên thế nào" không phải câu hỏi thẩm mỹ — nó là câu hỏi kiến trúc**,
tương đương với việc quyết định service boundary trong microservices.

## 🧭 Thiết kế theo domain hay theo consumer?

Có 2 trường phái phổ biến, và chọn sai gây hậu quả khác nhau rõ rệt:

**Thiết kế theo domain/business event** (khuyến nghị mặc định):
- Topic đại diện cho **một loại sự kiện nghiệp vụ đã xảy ra** trong domain — ví dụ `orders.order-placed`,
  `payments.payment-captured`.
- Producer là **owner duy nhất** của domain đó, publish 1 lần, nhiều consumer khác nhau tự do subscribe.
- Đây là mô hình **publish-subscribe đúng nghĩa** — producer không cần biết ai đang/sẽ đọc.

**Thiết kế theo consumer** (rủi ro cao, chỉ nên là ngoại lệ có lý do rõ ràng):
- Tạo riêng 1 topic cho mỗi consumer (ví dụ `orders-for-billing`, `orders-for-analytics`, cùng nội dung nhưng
  khác tên).
- Hấp dẫn vì: "consumer team muốn kiểm soát riêng retention/format của mình", "tránh consumer A ảnh hưởng
  consumer B".
- ❌ Vấn đề: phá vỡ mô hình pub-sub — producer giờ phải biết và **ghi nhiều lần** cho từng consumer, dẫn tới
  **topic explosion** (xem anti-pattern bên dưới) khi số consumer tăng, và dữ liệu bị **nhân bản không cần
  thiết** (duplicate storage, duplicate write path).

✅ Quy tắc quyết định: nếu nhiều consumer cùng cần **cùng một sự thật nghiệp vụ** (order đã được tạo, payment đã
capture), đó là 1 topic domain, nhiều consumer group đọc độc lập. Chỉ tách theo consumer khi **thực sự cần**
schema/retention/access-control khác biệt tới mức không thể derive từ 1 topic gốc (và khi đó, cân nhắc dùng
Kafka Streams/ksqlDB để derive topic phái sinh thay vì để producer ghi trùng — xem
[`../04-ecosystem/`](../04-ecosystem/README.md)).

## 🔀 Khi nào gộp nhiều event type vào 1 topic, khi nào tách

**Nên gộp** (nhiều event type trong cùng 1 topic) khi:
- Các event type thuộc **cùng 1 aggregate/entity** và **thứ tự tương đối giữa chúng có ý nghĩa nghiệp vụ** — ví
  dụ `OrderCreated`, `OrderUpdated`, `OrderCancelled` của cùng 1 `order_id` nên nằm cùng topic (và cùng
  partition qua key `order_id`) để consumer thấy đúng thứ tự vòng đời.
- Số lượng event type nhỏ, có quan hệ chặt (state machine của 1 entity).

**Nên tách** khi:
- Event type không có quan hệ ordering với nhau (ví dụ `UserRegistered` và `PaymentFailed` không liên quan tới
  cùng 1 luồng nghiệp vụ) — gộp chung chỉ tạo thêm việc filter phía consumer mà không có lợi ích ordering nào.
- Retention khác nhau đáng kể (dữ liệu giao dịch giữ dài hạn vs dữ liệu tracking/click giữ ngắn hạn).
- Volume chênh lệch quá lớn — 1 event type volume rất cao ghép chung với event type volume thấp khiến consumer
  của loại thấp phải xử lý/skip qua lượng lớn dữ liệu không liên quan.
- Đối tượng tiêu thụ và mức độ nhạy cảm dữ liệu khác nhau (PII vs non-PII) — cần ACL riêng.

## 🏷️ Naming convention phục vụ điều gì

Naming convention **không phải vấn đề thẩm mỹ** — nó là cơ chế mã hoá thông tin kiến trúc mà không cần tra cứu
thêm tài liệu:

```
<domain>.<entity>.<event-or-purpose>[.<version>]
```

Ví dụ: `orders.order.placed`, `payments.payment.captured.v2`, `inventory.stock.reserved`.

Naming convention tốt phải trả lời được ngay từ cái tên:
- **Domain nào sở hữu** topic này (ownership) → biết ai chịu trách nhiệm khi schema thay đổi hoặc có sự cố.
- **Loại nội dung là gì** (entity + event) → consumer mới biết ngay có nên subscribe không mà không cần đọc
  schema trước.
- **Version nào** (nếu có breaking change không thể evolve tương thích) → tránh nhầm lẫn giữa
  `payments.payment.captured` cũ và `payments.payment.captured.v2` mới có cấu trúc khác hẳn.

❌ Naming không nên: mã hoá **consumer** vào tên (`orders-for-billing-service`), mã hoá **implementation detail**
tạm thời (`orders-temp-migration-2024`), hoặc quá chung chung tới mức không nói lên gì (`events`, `data`,
`stream1`).

## 📊 Bảng: Design choice → lợi ích → trade-off → nguy cơ

| Design choice | Lợi ích | Trade-off | Nguy cơ nếu làm sai |
|---|---|---|---|
| 1 topic domain, nhiều consumer group | Đúng mô hình pub-sub, producer không cần biết consumer | Consumer phải tự filter nếu chỉ cần 1 phần dữ liệu | Không có — đây là baseline nên dùng |
| Topic riêng theo consumer | Consumer kiểm soát retention/format riêng | Producer ghi trùng nhiều lần, dữ liệu nhân bản | Topic explosion, producer trở thành điểm nghẽn khi thêm consumer mới |
| Gộp nhiều event type theo entity | Giữ đúng ordering vòng đời entity | Consumer phải branch logic theo loại event | Nếu volume lệch lớn, consumer bị "ngợp" bởi event không liên quan |
| Tách theo mức độ nhạy cảm dữ liệu (PII riêng) | ACL rõ ràng, dễ audit/compliance | Thêm 1 topic để quản lý, có thể cần join lại phía consumer | Rò rỉ PII nếu gộp chung và cấp quyền rộng cho topic đó |
| Naming convention chuẩn hoá domain.entity.event | Dễ discover, rõ ownership | Cần thống nhất & enforce (linting/registry) toàn tổ chức | Không enforce → mỗi team đặt tên tuỳ ý, hỗn loạn nhanh khi số topic tăng |

## 🏗️ Ownership, compatibility, lifecycle

- **Ownership**: mỗi topic domain nên có **đúng 1 team owner** — team publish dữ liệu chịu trách nhiệm về
  schema, breaking change, và deprecation. Không có ownership rõ ràng → không ai dám thay đổi, hoặc ai cũng tự
  ý thay đổi.
- **Compatibility**: thay đổi schema trên 1 topic ảnh hưởng **mọi consumer đang tồn tại** (có thể không biết
  hết là ai) — vì vậy phải gắn liền với chiến lược schema evolution (xem
  [`04-schema-design-avro-protobuf-json.md`](04-schema-design-avro-protobuf-json.md)).
- **Lifecycle**: topic cần có "khai tử" rõ ràng (deprecation) — một topic không ai đọc nữa vẫn tốn resource
  (disk, replication, metadata) nếu không bị xoá; ngược lại xoá nhầm 1 topic vẫn còn consumer active là sự cố
  nghiêm trọng. Nên có quy trình: đánh dấu deprecated → theo dõi consumer group nào còn active → thông báo →
  xoá sau thời gian ân hạn.

## 🗄️ Retention/compaction ảnh hưởng topic design thế nào

(Nền tảng: [`../01-foundation/11-retention-compaction.md`](../01-foundation/11-retention-compaction.md))

- Topic dạng **event log** (đã xảy ra, không đổi) → dùng **time-based retention** (`retention.ms`), độ dài phụ
  thuộc nhu cầu replay (analytics thường cần dài hơn transactional event).
- Topic dạng **latest-state/changelog** (chỉ cần giá trị mới nhất theo key, ví dụ CDC snapshot của 1 bảng DB)
  → dùng **compaction** thay vì retention theo thời gian.
- ❌ Sai lầm phổ biến: gộp cả 2 nhu cầu vào 1 topic — ví dụ vừa muốn giữ lịch sử đầy đủ (audit) vừa muốn dùng
  compaction (chỉ giữ bản mới nhất) trên cùng 1 topic. Compaction sẽ **xoá mất lịch sử** mà audit cần. Đây là
  lý do "cần compaction" gần như luôn là tín hiệu cần **tách riêng topic** khỏi topic event log thuần tuý.

## 🧭 Key decisions

1. **Domain hay consumer làm trục thiết kế** → mặc định domain; chỉ lệch sang consumer khi có lý do access
   control/retention rõ ràng, không phải vì "tiện cho 1 team".
2. **Gộp hay tách theo entity/event type** → gộp nếu ordering giữa các event có ý nghĩa nghiệp vụ; tách nếu
   không liên quan hoặc lệch retention/volume/sensitivity.
3. **Naming convention** → chuẩn hoá `domain.entity.event[.version]`, enforce bằng review/tooling, không để tự
   phát.
4. **Retention/compaction strategy** → quyết định **trước khi tạo topic**, vì đổi từ retention sang compaction
   sau này gần như luôn cần tạo topic mới và migrate.

## ⚖️ Design trade-offs

- ✅ Topic domain rộng, nhiều consumer group độc lập → đúng mô hình pub-sub, dễ mở rộng số consumer mà không đổi
  gì phía producer.
  ❌ Đổi lại: consumer phải tự filter phần mình cần, và schema phải đủ tổng quát để phục vụ nhiều bên.
- ✅ Tách topic theo mức độ nhạy cảm dữ liệu → ACL rõ ràng, dễ pass audit/compliance.
  ❌ Đổi lại: consumer cần dữ liệu tổng hợp phải join nhiều topic (phức tạp hơn ở tầng xử lý).
- ✅ Naming convention chặt chẽ → giảm chi phí discover, giảm nhầm lẫn ownership.
  ❌ Đổi lại: cần đầu tư enforce (registry/tooling), không tự nhiên xảy ra nếu chỉ dựa vào "quy ước ngầm".

## 🚨 Failure modes

| Sự kiện | Nguyên nhân thiết kế | Hệ quả |
|---|---|---|
| Không ai dám sửa schema của 1 topic | Không rõ ownership, không rõ ai đang consume | Team phải tạo topic mới song song ("v2 ngầm"), tăng chi phí bảo trì gấp đôi |
| Consumer bị "ngợp" dữ liệu không liên quan | Gộp quá nhiều event type không cùng entity vào 1 topic | Tăng lag giả tạo (consumer tốn CPU filter/skip), khó tối ưu partition count |
| Mất lịch sử audit đột ngột | Bật compaction trên topic vốn cần giữ lịch sử đầy đủ | Không thể trả lời truy vấn audit/compliance, không phục hồi được vì compaction đã xoá bản ghi cũ |
| Rò rỉ dữ liệu nhạy cảm | Gộp PII chung với dữ liệu non-sensitive, cấp ACL rộng cho toàn topic | Vi phạm compliance, phải thu hồi quyền truy cập và audit lại toàn bộ consumer đã đọc |

## ❌ Anti-patterns

### ❌ Topic theo từng consumer
**Biểu hiện:** `orders-for-billing`, `orders-for-analytics`, `orders-for-notification` — cùng dữ liệu gốc,
khác tên/topic cho từng bên tiêu thụ.
**Tại sao người ta hay làm vậy:** cảm giác "cô lập" tốt hơn, mỗi team tự chủ retention/format của mình mà không
lo ảnh hưởng lẫn nhau.
**Tại sao nó là vấn đề:** producer phải biết trước tất cả consumer và ghi lặp lại cho từng bên — phá vỡ hoàn
toàn lợi ích decoupling của pub-sub; thêm 1 consumer mới lại cần producer thay đổi.
**Thay vào đó nên làm:** ✅ 1 topic domain, nhiều consumer group đọc độc lập; nếu thực sự cần định dạng khác cho
1 consumer, dùng stream processing (Kafka Streams/ksqlDB) để **derive** topic phái sinh từ topic gốc, không bắt
producer ghi tay nhiều lần.

### ❌ Topic quá generic kiểu "events"
**Biểu hiện:** 1 topic tên `events` hoặc `app-events` chứa mọi loại sự kiện của cả hệ thống.
**Tại sao người ta hay làm vậy:** đơn giản lúc khởi đầu dự án, "không cần nghĩ nhiều, cứ đẩy hết vào đây".
**Tại sao nó là vấn đề:** mất hoàn toàn ordering boundary có ý nghĩa (event không liên quan xen kẽ nhau), mất
khả năng cấp quyền/retention riêng biệt, consumer phải parse + filter mọi thứ để tìm phần mình cần → chi phí xử
lý tăng tuyến tính theo số loại event trong hệ thống dù consumer chỉ cần 1 loại.
**Thay vào đó nên làm:** ✅ Tách theo domain/entity ngay từ đầu, dù số lượng topic ít lúc khởi đầu — dễ tách nhỏ
dần hơn là gộp lại sau khi đã có nhiều consumer phụ thuộc vào 1 topic khổng lồ.

### ❌ Topic explosion
**Biểu hiện:** hàng trăm/nghìn topic được tạo tự phát, nhiều topic gần như trùng lặp mục đích, không ai nhớ hết
topic nào còn dùng.
**Tại sao người ta hay làm vậy:** hệ quả tích luỹ của "topic theo consumer" + không có quy trình lifecycle/khai
tử topic.
**Tại sao nó là vấn đề:** chi phí vận hành (metadata overhead trên controller, khó audit ACL), khó discover
đúng topic cần dùng, rủi ro xoá nhầm hoặc giữ topic chết tốn tài nguyên vô thời hạn.
**Thay vào đó nên làm:** ✅ Naming convention + registry (catalog topic có owner rõ ràng) + quy trình deprecation
định kỳ.

### ❌ Nhồi quá nhiều event semantics không liên quan vào cùng topic
**Biểu hiện:** 1 topic vừa chứa order lifecycle event, vừa chứa system health-check ping, vừa chứa audit log
— chỉ vì "đỡ tạo thêm topic".
**Tại sao người ta hay làm vậy:** ngại thủ tục tạo topic mới (review, cấp quyền), nên tận dụng topic có sẵn.
**Tại sao nó là vấn đề:** consumer cần order event phải xử lý/bỏ qua traffic hoàn toàn không liên quan, làm
nhiễu metric lag/throughput thực tế của luồng nghiệp vụ chính, và không thể áp policy (retention/ACL) phù hợp
cho từng loại.
**Thay vào đó nên làm:** ✅ Giảm ma sát tạo topic mới bằng tooling/tự động hoá thay vì gộp bừa dữ liệu không liên
quan.

## 🧪 Mini scenarios

**Scenario 1 — E-commerce order lifecycle:**
Team order dùng 1 topic `orders.order.lifecycle` với 12 partition, key = `order_id`, chứa các event
`OrderCreated`, `OrderPaid`, `OrderShipped`, `OrderCancelled` của cùng 1 order. Billing, fulfillment, và
analytics đều là 3 consumer group độc lập đọc cùng topic này — không ai cần biết ai khác đang đọc. Khi
notification team cần thêm luồng xử lý mới, họ chỉ cần tạo consumer group mới, **không cần đổi gì phía
producer**.

**Scenario 2 — Gộp sai retention/compaction:**
Team CDC đẩy cả **audit trail đầy đủ** (mọi thay đổi lịch sử) và **latest-state snapshot** (chỉ cần giá trị mới
nhất) vào cùng 1 topic `customers.profile.changes` rồi bật `cleanup.policy=compact` để tiết kiệm disk. 3 tháng
sau, đội compliance cần audit lại lịch sử thay đổi của 1 khách hàng cụ thể — phát hiện phần lớn lịch sử đã bị
compaction xoá, chỉ còn giữ bản ghi mới nhất mỗi key. Bài học: audit trail và latest-state phải là **2 topic
riêng** với chính sách retention khác nhau ngay từ đầu.

**Scenario 3 — Topic theo consumer dẫn tới bế tắc mở rộng:**
Team inventory tạo `stock-for-web`, `stock-for-mobile`, `stock-for-warehouse-app` — cùng dữ liệu tồn kho nhưng
ghi 3 lần cho 3 "khách hàng nội bộ". Khi cần thêm 1 kênh bán hàng mới (marketplace), team inventory phải sửa
code producer để ghi thêm lần thứ 4 — dù bản chất dữ liệu không đổi. Refactor lại thành 1 topic
`inventory.stock.updated` domain-based giúp thêm consumer mới **không cần đụng vào producer** nữa.

## 🎤 Interview lens

**"Bạn quyết định số lượng topic cho 1 hệch thống mới như thế nào?"**
> Interviewer đang test: bạn có tư duy theo **domain boundary** hay chỉ liệt kê tên topic theo cảm tính.
> Câu trả lời yếu thường: liệt kê tên topic cụ thể mà không giải thích **nguyên tắc** đứng sau (ordering
> boundary, schema boundary, ownership). Câu trả lời tốt phải nêu được: topic đại diện cho domain event nào,
> ai owner, ordering boundary cần gì (nên gộp event nào theo entity), và retention/compaction có khác nhau
> giữa các nhóm dữ liệu không — từ đó suy ra số lượng topic hợp lý, không chọn con số tuỳ tiện.

**"Vì sao không nên tạo topic riêng cho mỗi consumer?"**
> Câu trả lời tốt phải chỉ ra được: điều này phá vỡ mô hình pub-sub (producer phải biết trước consumer), gây
> duplicate write, và dẫn tới topic explosion khi số consumer tăng — đồng thời phải đề xuất được giải pháp thay
> thế (stream processing để derive topic phái sinh) thay vì chỉ nói "đừng làm vậy".

## ✅ Key takeaways

- Topic là boundary đồng thời của ordering, schema, retention/lifecycle, access control, và scaling —
  quyết định thiết kế topic là quyết định kiến trúc, không phải đặt tên.
- Mặc định thiết kế theo **domain/business event**, không theo consumer; chỉ tách theo consumer khi có lý do
  access-control/retention thực sự khác biệt.
- Gộp event type theo **entity có ordering ý nghĩa**; tách khi không liên quan hoặc lệch retention/sensitivity.
- Naming convention chuẩn hoá (`domain.entity.event[.version]`) là cơ chế mã hoá ownership và giảm chi phí
  discover, không phải chuyện thẩm mỹ.
- Quyết định retention vs compaction phải làm **trước khi tạo topic** — trộn lẫn 2 nhu cầu trên cùng 1 topic
  gây mất dữ liệu không thể phục hồi.

## 🔗 Xem tiếp / Liên kết liên quan

- Tiếp theo: [`02-partition-strategy.md`](02-partition-strategy.md) — số lượng partition và parallelism.
- [`03-key-design.md`](03-key-design.md) — key quyết định ordering/hotspot trong topic đã thiết kế.
- [`../01-foundation/11-retention-compaction.md`](../01-foundation/11-retention-compaction.md) — nền tảng
  retention/compaction.
- [`../GLOSSARY.md`](../GLOSSARY.md) — tra cứu thuật ngữ liên quan.
