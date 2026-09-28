# Retention và Compaction

## 🎯 Mục tiêu học

Sau khi đọc file này, bạn sẽ:
- Hiểu **retention** giữ dữ liệu theo thời gian/dung lượng, và **compaction** giữ giá trị mới nhất theo key —
  hai cơ chế **khác nhau về bản chất**, không phải hai mức độ của cùng một thứ.
- Biết khi nào nên dùng retention thuần túy, khi nào compaction phù hợp hơn.
- Hiểu mối liên hệ giữa retention/compaction với khả năng **replay, audit, rebuild state** — và với duplicate/
  reprocessing đã nói ở [`10-ordering-delivery-semantics.md`](10-ordering-delivery-semantics.md).
- Tránh được các ngộ nhận phổ biến nhất về compaction (tưởng nó xóa dữ liệu ngay lập tức, hoặc dùng nó mà không
  có key mang ý nghĩa).

## 📖 Mục lục

- [Retention là gì](#-retention-là-gì)
- [Diagram 1: Retention timeline](#️-diagram-1-retention-timeline)
- [Compaction là gì](#-compaction-là-gì)
- [Diagram 2: Compaction theo key](#️-diagram-2-compaction-theo-key)
- [Retention ≠ Compaction — bảng phân biệt](#-retention--compaction--bảng-phân-biệt)
- [Retention/Compaction liên hệ thế nào với replay, audit, rebuild state](#-retentioncompaction-liên-hệ-thế-nào-với-replay-audit-rebuild-state)
- [Decision logic: chọn retention hay compaction](#-decision-logic-chọn-retention-hay-compaction)
- [Trade-off](#️-trade-off)
- [Anti-pattern / mistakes](#-anti-pattern--mistakes)
- [🎤 Interview lens](#-interview-lens)
- [Mini scenarios](#-mini-scenarios)
- [Key takeaways](#-key-takeaways)
- [Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 🗓️ Retention là gì

> 📌 **Retention là chính sách giữ dữ liệu trong một khoảng thời gian hoặc dung lượng nhất định, sau đó dữ liệu
> cũ bị xóa vĩnh viễn** — cấu hình qua `retention.ms` (theo thời gian) và/hoặc `retention.bytes` (theo dung
> lượng).

Retention áp dụng theo kiểu "giữ **toàn bộ** message trong khoảng retention, xóa **toàn bộ** message ngoài
khoảng đó" — nó không quan tâm nội dung hay key của message, chỉ quan tâm **tuổi** hoặc **dung lượng** của dữ
liệu.

## 🗺️ Diagram 1: Retention timeline

```
Partition (retention.ms = 7 ngày):

  Ngày -10   Ngày -8   Ngày -7   Ngày -5   Ngày -2   Hôm nay
   [m0]       [m1]       [m2]     [m3]      [m4]      [m5]
    ❌ đã xóa  ❌ đã xóa   ✅ còn    ✅ còn    ✅ còn     ✅ còn
```

- 📌 Retention xóa dữ liệu theo **tuổi tuyệt đối**, không quan tâm message đó là gì hay có key gì — mọi message
  cũ hơn ngưỡng retention đều bị xóa như nhau, kể cả nếu 2 message có cùng key.
- ⚠️ Việc xóa thực tế không diễn ra tức thời tới từng mili-giây — nó diễn ra theo chu kỳ dọn dẹp segment, và
  message chỉ **thực sự** bị xóa khi cả segment log chứa nó đã hết hạn (chi tiết cơ chế segment ở
  `../02-core-internals/05-storage-segments-indexes.md`, mở rộng ở lượt sau).

## 🗜️ Compaction là gì

> 📌 **Compaction (log compaction) là cơ chế giữ lại bản ghi mới nhất cho mỗi key, xóa các bản ghi cũ hơn cùng
> key** — bất kể chúng "cũ" đến đâu về thời gian.

Compaction phù hợp cho use case dạng **"trạng thái mới nhất"** (latest-value-per-key) thay vì "toàn bộ lịch sử"
— ví dụ: bảng giá sản phẩm hiện tại, trạng thái profile người dùng, changelog của Kafka Streams state store.

## 🗺️ Diagram 2: Compaction theo key

```
Trước compaction (log gốc, theo offset):

  offset: 0          1          2          3          4          5
  key:    user-1     user-2     user-1     user-3     user-1     user-2
  value:  {age:20}   {city:HN}  {age:21}   {city:SG}  {age:22}   {city:DN}

Sau compaction (chỉ giữ bản ghi MỚI NHẤT cho mỗi key):

  offset: 3          4          5
  key:    user-3     user-1     user-2
  value:  {city:SG}  {age:22}   {city:DN}
```

- 📌 Compaction không quan tâm tuổi tuyệt đối của message — nó chỉ quan tâm **"đây có phải bản ghi mới nhất của
  key này không"**. `user-1` có 3 bản ghi ở offset 0, 2, 4 — chỉ bản ghi ở offset 4 (mới nhất) được giữ lại, 2
  bản ghi cũ hơn cùng key bị xóa dù chúng có thể "trẻ" hơn nhiều so với retention thông thường.
- ⚠️ Compaction là một tiến trình nền (background process) chạy theo chu kỳ, quét qua các segment cũ để dọn
  dẹp — không chạy "ngay lập tức, liên tục, mọi lúc". Trong một khoảng thời gian ngắn sau khi ghi, **bạn hoàn
  toàn có thể thấy nhiều bản ghi cùng key vẫn tồn tại** trước khi compaction kịp chạy — đây không phải lỗi, đó
  là hành vi thiết kế (eventual, không phải instant).

## 📊 Retention ≠ Compaction — bảng phân biệt

| Khía cạnh | Retention | Compaction |
|---|---|---|
| Tiêu chí xóa dữ liệu | Tuổi (thời gian) hoặc dung lượng tuyệt đối | Có phải bản ghi **không phải mới nhất** của 1 key hay không |
| Có cần key không | Không bắt buộc | **Bắt buộc** — không có key ý nghĩa thì compaction vô nghĩa (mọi message coi như key khác nhau, hoặc key null bị xử lý đặc biệt) |
| Kết quả cuối cùng | Cửa sổ dữ liệu trong N ngày/N byte gần nhất | "Bức tranh trạng thái mới nhất" cho mỗi key, có thể trải dài vô thời hạn |
| Use case điển hình | Event log, audit trail, dữ liệu clickstream | Changelog trạng thái, bảng giá hiện tại, cấu hình hiện tại |
| Có thể replay toàn bộ lịch sử không | Chỉ trong phạm vi retention còn lại | Không — vì lịch sử trung gian đã bị xóa, chỉ còn giá trị mới nhất |

💡 Kafka cũng hỗ trợ cấu hình **kết hợp cả hai** (`cleanup.policy=compact,delete`) — vừa nén theo key, vừa xóa
theo tuổi — dùng khi cần "giữ giá trị mới nhất, nhưng cũng không muốn giữ mãi mãi nếu key đó không còn hoạt
động".

## 🔁 Retention/Compaction liên hệ thế nào với replay, audit, rebuild state

- **Replay lịch sử đầy đủ** (đã nói ở `../00-overview/04-kafka-core-mental-model.md`) chỉ khả thi nếu dữ liệu
  còn nằm trong **retention window** — compaction (thuần túy, không kèm `delete`) sẽ **phá vỡ khả năng này** vì
  nó xóa các bản ghi trung gian, chỉ giữ giá trị mới nhất.
- **Audit trail** (cần biết đầy đủ "điều gì đã xảy ra theo thứ tự") cần **retention dài** (hoặc vô thời hạn),
  **không nên dùng compaction thuần túy** cho topic phục vụ mục đích này.
- **Rebuild state** (xây dựng lại trạng thái hiện tại từ đầu, ví dụ khi 1 service mới khởi động cần biết trạng
  thái mới nhất của mọi entity) là use case lý tưởng của **compaction** — đọc lại toàn bộ topic đã compact sẽ
  cho ra đúng "bức tranh trạng thái hiện tại" mà không cần giữ toàn bộ lịch sử chi tiết.
- 🔗 Liên hệ với [`10-ordering-delivery-semantics.md`](10-ordering-delivery-semantics.md): **reprocessing**
  (đọc lại dữ liệu cũ) chỉ khả thi trong phạm vi dữ liệu còn tồn tại — retention/compaction chính là ranh giới
  quyết định "còn reprocessing được tới đâu".

## 🧭 Decision logic: chọn retention hay compaction

1. ❓ Bạn cần biết **toàn bộ lịch sử thay đổi** (ai làm gì, khi nào), không chỉ trạng thái cuối? → **Retention**
   (đủ dài để phục vụ audit/replay), không dùng compaction thuần túy.
2. ❓ Bạn chỉ cần **trạng thái mới nhất** của mỗi entity, không quan tâm lịch sử trung gian? → **Compaction**,
   dùng entity ID (ví dụ `user_id`, `product_id`) làm key.
3. ❓ Bạn cần cả hai: giữ giá trị mới nhất, nhưng cũng muốn dọn dẹp key không còn hoạt động sau một thời gian
   dài? → Kết hợp `cleanup.policy=compact,delete`.
4. ❓ Bạn không chắc key có ý nghĩa nhất quán không (ví dụ message không có key rõ ràng, hoặc key ngẫu nhiên mỗi
   lần)? → **Không dùng compaction** — nó sẽ không mang lại lợi ích gì (mỗi message coi như 1 key riêng, không
   có gì được "nén" lại), có khi còn gây hiểu lầm về hành vi dữ liệu.

## ⚖️ Trade-off

- ✅ Retention dài → khả năng replay/audit tốt hơn.
  ❌ Đổi lại: chi phí lưu trữ đĩa tăng tuyến tính theo thời gian và throughput.
- ✅ Compaction → giữ "bức tranh trạng thái hiện tại" gọn nhẹ, không phình to vô hạn theo thời gian.
  ❌ Đổi lại: mất khả năng xem lại lịch sử thay đổi trung gian — nếu cần audit đầy đủ, compaction thuần túy
  không phù hợp.
- ✅ Kết hợp `compact,delete` → vừa gọn theo key, vừa tự dọn dữ liệu quá cũ.
  ❌ Đổi lại: cấu hình phức tạp hơn, cần hiểu rõ 2 cơ chế đang tương tác với nhau thế nào để tránh bất ngờ.

## ❌ Anti-pattern / mistakes

| Sai lầm | Vì sao dễ mắc | Hậu quả thực tế | Cách sửa mental model |
|---|---|---|---|
| Nghĩ compaction giữ "đúng 1 message duy nhất" ngay lập tức cho mỗi key | Đọc định nghĩa "giữ bản ghi mới nhất" và hiểu nhầm là tức thời | Consumer đọc thấy nhiều bản ghi cùng key trong lúc compaction chưa kịp chạy, tưởng là bug | Hiểu compaction là **eventual** (dọn dẹp theo chu kỳ nền), không phải tức thời từng message |
| Bật compaction cho topic không có key ý nghĩa (hoặc key ngẫu nhiên mỗi message) | Muốn "tiết kiệm dung lượng" nên bật compaction cho mọi topic theo thói quen | Compaction không có tác dụng gì (mỗi message coi như key riêng biệt), dữ liệu vẫn phình to như dùng retention thuần, nhưng lại mất khả năng replay đầy đủ lịch sử | Chỉ dùng compaction khi key thực sự mang ý nghĩa "định danh entity", và mục tiêu là giữ trạng thái mới nhất |
| Đặt retention quá ngắn nhưng vẫn kỳ vọng replay được lâu dài | Muốn tiết kiệm chi phí lưu trữ, đặt retention ngắn (ví dụ 1 ngày) mà không tính tới nhu cầu replay | Khi cần replay dữ liệu 1 tuần trước để sửa bug hoặc build consumer mới, phát hiện dữ liệu đã bị xóa, không thể khôi phục | Đặt retention dựa trên **nhu cầu replay thực tế xa nhất** có thể xảy ra, không chỉ dựa trên nhu cầu xử lý real-time hiện tại |

## 🎤 Interview lens

**"Compaction khác retention như thế nào?"**
> Trả lời tốt: "Retention xóa dữ liệu dựa trên tuổi hoặc dung lượng tuyệt đối, không quan tâm nội dung. Compaction
> xóa dữ liệu dựa trên việc nó có còn là bản ghi mới nhất của 1 key hay không — nó phục vụ use case 'tôi chỉ cần
> biết trạng thái hiện tại', trong khi retention phục vụ use case 'tôi cần một cửa sổ lịch sử trong N ngày'. Hai
> cơ chế này có thể dùng độc lập hoặc kết hợp với nhau."

> ⚠️ Câu trả lời yếu: "Compaction là một loại retention ngắn hơn" — sai bản chất, vì compaction không hề dựa
> trên thời gian, mà dựa trên tính "mới nhất theo key".

## 🧪 Mini scenarios

**Scenario 1 — Compaction hợp lý:**
Topic `user-profile-changelog` lưu thay đổi profile người dùng, dùng `user_id` làm key. Team bật compaction —
mỗi khi service khởi động lại, nó đọc lại toàn bộ topic (đã compact) để dựng lại "bức tranh trạng thái hiện tại"
của mọi user, mà không cần giữ toàn bộ lịch sử hàng triệu lần cập nhật profile trước đó.

**Scenario 2 — Retention thường là đủ:**
Topic `payment-audit-log` cần lưu **toàn bộ lịch sử giao dịch** để phục vụ audit và tuân thủ quy định (compliance),
không chỉ trạng thái cuối cùng. Team dùng retention dài (ví dụ 2 năm), **không** dùng compaction — vì mục tiêu là
giữ đầy đủ từng sự kiện đã xảy ra, không phải chỉ giá trị mới nhất.

**Scenario 3 — Retention quá ngắn, mất khả năng replay:**
Topic `order-events` được cấu hình `retention.ms = 1 ngày` để tiết kiệm chi phí. Ba tuần sau, team phát hiện bug
trong logic tính điểm thưởng và muốn replay lại dữ liệu 3 tuần qua để tính lại — nhưng dữ liệu đã bị xóa từ lâu.
❌ Team buộc phải chấp nhận không thể sửa được dữ liệu lịch sử, một bài học đắt giá về việc đặt retention quá
ngắn so với nhu cầu replay thực tế.

## ✅ Key takeaways

- **Retention** xóa dữ liệu theo tuổi/dung lượng tuyệt đối, không quan tâm nội dung hay key.
- **Compaction** giữ bản ghi mới nhất cho mỗi key, xóa các bản ghi cũ hơn cùng key — bất kể tuổi tuyệt đối.
- Hai cơ chế phục vụ hai mục tiêu khác nhau: retention → cửa sổ lịch sử; compaction → trạng thái hiện tại.
- Compaction chỉ có ý nghĩa khi key thực sự đại diện cho một entity — không nên bật compaction cho topic không
  có key ý nghĩa.
- Retention cần được đặt dựa trên nhu cầu replay xa nhất có thể xảy ra trong tương lai, không chỉ nhu cầu xử lý
  hiện tại.

## 🔗 Xem tiếp / Liên kết liên quan

- File này khép lại `01-foundation/` — tiếp theo: `../02-core-internals/README.md` (sẽ mở rộng ở lượt sau) để
  đào sâu cơ chế bên trong (write path, read path, storage segments).
- [`10-ordering-delivery-semantics.md`](10-ordering-delivery-semantics.md) — nền tảng về semantics và
  reprocessing trước khi hiểu retention/compaction ảnh hưởng ra sao tới khả năng replay.
- `../00-overview/04-kafka-core-mental-model.md` — Diagram 1 trong file đó đã giới thiệu mối quan hệ
  offset-retention-replay ở mức tổng quát.
- [`../GLOSSARY.md`](../GLOSSARY.md) — tra cứu lại `retention`, `compaction (log compaction)`.
