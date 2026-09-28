# Consumer Configs và Offset Management

## 🎯 Mục tiêu học

Cũng như file trước, đây không phải bảng tra cứu config. Với mỗi config/cơ chế, bạn sẽ nắm được: hành vi thực
tế, trade-off, duplicate/loss risk, và failure mode khi cấu hình sai — đặc biệt là cơ chế **offset commit**,
nơi phần lớn bug production về "mất dữ liệu" hoặc "xử lý trùng" thực sự bắt nguồn.

## 📖 Mục lục

- [Diagram: poll / process / commit và vị trí offset](#️-diagram-poll--process--commit-và-vị-trí-offset)
- [Committed offset vs current position](#-committed-offset-vs-current-position)
- [Bảng tổng hợp: Config → tác dụng → trade-off → common pitfall](#-bảng-tổng-hợp-config--tác-dụng--trade-off--common-pitfall)
- [`group.id`](#-groupid)
- [`enable.auto.commit` — vì sao nguy hiểm](#-enableautocommit--vì-sao-nguy-hiểm)
- [Manual commit: sync vs async](#-manual-commit-sync-vs-async)
- [`auto.offset.reset` — earliest vs latest](#-autoffsetreset--earliest-vs-latest)
- [`max.poll.records` + `max.poll.interval.ms`](#-maxpollrecords--maxpollintervalms)
- [`session.timeout.ms` + `heartbeat.interval.ms`](#-sessiontimeoutms--heartbeatintervalms)
- [`fetch.min.bytes` + `fetch.max.bytes`](#-fetchminbytes--fetchmaxbytes)
- [`isolation.level=read_committed`](#-isolationlevelreadcommitted)
- [Debugging hints](#-debugging-hints)
- [Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 🗺️ Diagram: poll / process / commit và vị trí offset

```
Partition (log):    [0][1][2][3][4][5][6][7][8][9]
                                  ▲        ▲
                          committed       current
                           offset        position
                          (group X)     (đã fetch,
                                        chưa commit)

  → Consumer group X: đã XỬ LÝ XONG và COMMIT tới offset 4.
  → Consumer đã FETCH tới offset 6 (current position), đang xử lý 5-6.
  → Nếu consumer crash NGAY BÂY GIỜ: khi restart, đọc lại từ offset 5 (committed + 1).
```

- `committed offset` là điểm **group đã xác nhận xử lý xong** — bền vững, lưu ở topic nội bộ
  `__consumer_offsets`, dùng làm điểm khởi động lại khi restart/rebalance.
- `current position` là điểm consumer **đã fetch tới** trong bộ nhớ của chính instance đó — chưa bền vững,
  mất đi nếu consumer crash trước khi commit.

## 🎯 Committed offset vs current position

Đây là 2 khái niệm **thường bị gộp làm một**, nhưng khác nhau hoàn toàn về tính bền vững:

| Khái niệm | Lưu ở đâu | Bền vững khi crash? | Ý nghĩa |
|---|---|---|---|
| `current position` | Bộ nhớ trong của consumer instance | ❌ Không | "Tôi đã fetch/đọc tới đâu" (tại runtime) |
| `committed offset` | Topic nội bộ `__consumer_offsets` (trên broker) | ✅ Có | "Group này đã xác nhận xử lý xong tới đâu" |

📌 Khoảng cách giữa 2 giá trị này (`current position - committed offset`) chính là "vùng rủi ro" — nếu consumer
crash trong khoảng này, khi restart nó sẽ **đọc lại từ committed offset**, tức là xử lý lại toàn bộ vùng rủi ro
đó. Khoảng cách này càng lớn (do commit ít thường xuyên), rủi ro duplicate xử lý càng lớn khi crash.

## ⚙️ Bảng tổng hợp: Config → tác dụng → trade-off → common pitfall

| Config | Tác dụng | Trade-off | Pitfall phổ biến |
|---|---|---|---|
| `group.id` | Định danh consumer group | Không phải trade-off — là quyết định kiến trúc | Dùng chung `group.id` cho 2 hệ thống khác nhau (xem [`06-consumer-groups.md`](06-consumer-groups.md)) |
| `enable.auto.commit` | Tự động commit theo chu kỳ thời gian | Tiện lợi ⇄ Kiểm soát chính xác thời điểm commit | `true` + xử lý bất đồng bộ/theo batch → loss về nghiệp vụ |
| `auto.offset.reset` | Consumer group **mới** (chưa có committed offset) bắt đầu đọc từ đâu | Đọc đủ lịch sử (`earliest`) ⇄ Chỉ đọc dữ liệu mới (`latest`) | `latest` cho hệ thống cần xử lý đầy đủ lịch sử → **bỏ sót toàn bộ dữ liệu cũ** mà không có lỗi nào báo hiệu |
| `max.poll.records` | Số record tối đa trả về trong 1 lần `poll()` | Batch lớn hơn ⇄ Rủi ro vượt `max.poll.interval.ms` | Đặt quá cao cho luồng xử lý chậm (gọi API ngoài) → rebalance storm |
| `max.poll.interval.ms` | Thời gian tối đa cho phép giữa 2 lần gọi `poll()` trước khi bị coi là "chết" | Chịu được xử lý chậm ⇄ Phát hiện consumer treo thực sự chậm hơn | Đặt quá cao → consumer treo thật sự (deadlock) mất rất lâu mới được phát hiện và thay thế |
| `session.timeout.ms` | Thời gian group coordinator chờ heartbeat trước khi coi consumer là chết | Phát hiện crash nhanh ⇄ Nhạy cảm với GC pause/network jitter ngắn | Quá thấp → rebalance giả (false positive) khi chỉ có 1 lần trễ mạng ngắn |
| `heartbeat.interval.ms` | Tần suất gửi heartbeat | Thường đặt = 1/3 `session.timeout.ms` | Đặt quá gần `session.timeout.ms` → không đủ số lần heartbeat để coordinator tin cậy trạng thái "còn sống" |
| `fetch.min.bytes` | Broker chờ đủ dữ liệu tối thiểu mới trả response cho consumer | Giảm số round-trip ⇄ Tăng latency chờ | Đặt cao cho topic traffic thấp → consumer chờ lâu bất thường dù có dữ liệu (đến khi `fetch.max.wait.ms` hết hạn) |
| `fetch.max.bytes` | Giới hạn tổng dung lượng trả về trong 1 lần fetch | Throughput cao hơn mỗi round-trip ⇄ Tốn bộ nhớ consumer | Quá thấp so với `max.poll.records` mong muốn → không đạt được batch lớn như kỳ vọng |
| `isolation.level` | Có đọc message thuộc transaction đang dở (chưa commit) hay không | An toàn với transactional producer ⇄ Latency đọc tăng nhẹ | `read_uncommitted` (mặc định) khi tiêu thụ dữ liệu từ transactional producer → có thể đọc phải dữ liệu của transaction bị abort |

## 🆔 `group.id`

Không phải config "hiệu năng" — nó là **quyết định kiến trúc quan trọng nhất** ở phía consumer, vì nó định nghĩa
"đây là cùng 1 nhóm xử lý hay 2 nhóm độc lập" (đã phân tích kỹ ở
[`06-consumer-groups.md`](06-consumer-groups.md)). Không có "giá trị mặc định an toàn" — mỗi hệ thống tiêu thụ
độc lập bắt buộc phải có `group.id` riêng, không có ngoại lệ.

## ⏱️ `enable.auto.commit` — vì sao nguy hiểm

`enable.auto.commit=true` (mặc định trong nhiều client) khiến Kafka client **tự động commit** theo chu kỳ
(`auto.commit.interval.ms`, mặc định 5 giây), **hoàn toàn độc lập** với tiến độ xử lý thực tế của code:

- Auto-commit tick không biết và không quan tâm bạn đã "xử lý xong" record nào — nó chỉ commit **current
  position** tại đúng thời điểm tick xảy ra.
- 🚨 Nếu code của bạn xử lý bất đồng bộ, theo batch, hoặc đơn giản là xử lý chậm hơn 5 giây cho 1 batch, auto-
  commit có thể "tiến offset" **trước khi** business logic thực sự hoàn tất — nếu crash ngay sau đó, phần dữ
  liệu chưa xử lý xong bị coi là đã xong, dẫn tới **loss về nghiệp vụ vĩnh viễn**.
- ✅ **Khi nào auto-commit vẫn chấp nhận được**: xử lý đồng bộ, đơn giản, nhanh (< vài trăm ms mỗi record), và
  dữ liệu không quá nhạy cảm với việc thỉnh thoảng bỏ sót 1 vài record (ví dụ log aggregation không yêu cầu
  100% đầy đủ). Với luồng nghiệp vụ quan trọng (thanh toán, đơn hàng, tồn kho), **luôn nên tắt** và dùng manual
  commit.

## ✋ Manual commit: sync vs async

| Cách | Hành vi | Khi dùng |
|---|---|---|
| `commitSync()` | Block cho tới khi broker xác nhận commit thành công (hoặc lỗi, có thể retry) | Khi cần chắc chắn tuyệt đối commit đã thành công trước khi tiếp tục vòng lặp — đơn giản, an toàn, đánh đổi bằng độ trễ nhỏ mỗi lần commit |
| `commitAsync()` | Không block — gửi commit rồi tiếp tục ngay, xác nhận qua callback | Khi throughput quan trọng hơn việc chờ xác nhận từng lần — nhưng **phải** xử lý callback lỗi, và **không nên dùng để commit lần cuối trước khi đóng consumer** (nên dùng `commitSync()` cho lần commit cuối để đảm bảo chắc chắn) |

📌 Nguyên tắc thực dụng ở mức foundation: dùng `commitSync()` sau khi xử lý xong mỗi batch cho phần lớn hệ
thống — chỉ cân nhắc `commitAsync()` khi đã đo được rằng độ trễ của `commitSync()` thực sự là bottleneck.

## 🔰 `auto.offset.reset` — earliest vs latest

Config này **chỉ có tác dụng khi consumer group chưa từng có committed offset** cho partition đó (group hoàn
toàn mới, hoặc committed offset đã bị xóa do hết retention của topic `__consumer_offsets`):

| Giá trị | Hành vi | Rủi ro nếu chọn sai |
|---|---|---|
| `earliest` | Đọc từ offset sớm nhất còn tồn tại trong partition (đầu retention window) | Với topic traffic cao, consumer mới có thể phải xử lý **lượng backlog khổng lồ** ngay khi khởi động lần đầu |
| `latest` | Đọc từ offset mới nhất (bỏ qua toàn bộ dữ liệu đã tồn tại trước đó) | Nếu hệ thống cần xử lý đầy đủ lịch sử (ví dụ rebuild state, audit), **bỏ sót toàn bộ dữ liệu cũ** mà không có bất kỳ lỗi/cảnh báo nào — đây là 1 trong những bug production khó phát hiện nhất vì mọi thứ "chạy bình thường", chỉ là thiếu dữ liệu |

⚠️ **`latest` nguy hiểm nhất khi**: consumer group mới được tạo ra để **thay thế** một group cũ nhưng vô tình
dùng `group.id` khác (không kế thừa committed offset), và code không nhận ra rằng nó đang bỏ qua toàn bộ dữ
liệu trước thời điểm khởi động. `earliest` nguy hiểm nhất khi: consumer group mới vô tình được tạo (ví dụ do
lỗi cấu hình `group.id`) trên topic đã tích lũy dữ liệu rất lớn, gây "ngập lụt" xử lý ngoài dự kiến.

## 📏 `max.poll.records` + `max.poll.interval.ms`

Hai config này **phải được cấu hình cùng nhau**, dựa trên tốc độ xử lý thực tế:

- `max.poll.records`: giới hạn số record trả về trong 1 lần `poll()` (mặc định 500).
- `max.poll.interval.ms`: thời gian tối đa cho phép giữa 2 lần gọi `poll()` liên tiếp trước khi group coordinator
  coi consumer là "chết" và kích hoạt rebalance (mặc định 5 phút = 300000ms).

📌 **Công thức thực dụng**: `max.poll.records × thời gian xử lý trung bình mỗi record` phải **nhỏ hơn đáng kể**
`max.poll.interval.ms` (nên chừa biên độ an toàn, ví dụ chỉ dùng tối đa 70-80% ngưỡng). Nếu xử lý mỗi record
mất trung bình 800ms và `max.poll.records=500`, tổng thời gian xử lý 1 batch (400 giây) **vượt xa** ngưỡng mặc
định 300 giây — gây rebalance storm dù consumer hoàn toàn khỏe mạnh (chi tiết ở
[`09-rebalancing-and-group-behavior-basics.md`](09-rebalancing-and-group-behavior-basics.md)).

## 💓 `session.timeout.ms` + `heartbeat.interval.ms`

- `session.timeout.ms`: thời gian group coordinator chờ heartbeat từ consumer trước khi coi nó đã chết (mặc
  định thường 10-45 giây tùy phiên bản).
- `heartbeat.interval.ms`: tần suất consumer gửi heartbeat (thường được khuyến nghị đặt ≈ 1/3
  `session.timeout.ms`, để có ít nhất vài lần heartbeat "dự phòng" trước khi hết session timeout).

⚠️ Đây là 2 config **khác hoàn toàn** với `max.poll.interval.ms`: heartbeat được gửi trên 1 **thread riêng**
(kể từ các phiên bản Kafka client hiện đại), độc lập với việc code xử lý trong vòng lặp `poll()` có đang chạy
lâu hay không. Điều đó có nghĩa là:
- `session.timeout.ms` phát hiện consumer **chết thực sự** (process crash, mất kết nối mạng hoàn toàn).
- `max.poll.interval.ms` phát hiện consumer **treo trong logic xử lý** (vẫn sống, vẫn heartbeat được, nhưng
  không gọi `poll()` tiếp vì đang kẹt xử lý quá lâu).

📌 Nhầm lẫn 2 cơ chế này là nguồn gốc phổ biến của việc "tăng `session.timeout.ms` mãi mà rebalance storm do xử
lý chậm vẫn không hết" — vì nguyên nhân thực sự nằm ở `max.poll.interval.ms`/`max.poll.records`, không phải
`session.timeout.ms`.

## 📶 `fetch.min.bytes` + `fetch.max.bytes`

- `fetch.min.bytes` (mặc định 1 byte): broker sẽ **đợi** cho tới khi có đủ dữ liệu này mới trả response cho
  consumer (trừ khi `fetch.max.wait.ms` hết hạn trước) — tăng giá trị này giúp **giảm số round-trip** khi
  traffic thấp, đổi lại latency mỗi lần fetch tăng nhẹ.
- `fetch.max.bytes`: giới hạn trên tổng dung lượng 1 lần fetch trả về — ảnh hưởng trực tiếp tới việc `poll()`
  có thể trả về đủ `max.poll.records` mong muốn hay không nếu message có kích thước lớn.

💡 2 config này ít khi cần chỉnh ở giai đoạn học nền tảng, nhưng cần biết chúng tồn tại vì chúng giải thích
hiện tượng "tại sao consumer đôi khi có độ trễ nhỏ dù dữ liệu đã sẵn sàng trên broker" — đó là hành vi cố ý
(gom đủ dữ liệu trước khi trả về), không phải lỗi.

## 🔒 `isolation.level=read_committed`

Chỉ liên quan khi topic được ghi bởi **transactional producer** (xem
[`10-ordering-delivery-semantics.md`](10-ordering-delivery-semantics.md) và
`../02-core-internals/06-exactly-once-idempotence-transactions.md`, sẽ mở rộng ở lượt sau):

- `read_uncommitted` (mặc định): consumer đọc **mọi** message đã ghi vào log, kể cả message thuộc transaction
  **chưa commit hoặc đã bị abort**.
- `read_committed`: consumer chỉ đọc message thuộc transaction **đã commit thành công**, bỏ qua hoàn toàn
  message thuộc transaction bị abort (Kafka lọc ở tầng broker/client, không trả về cho consumer).

📌 Nếu bạn tiêu thụ dữ liệu từ 1 producer có bật transactions nhưng **quên** đặt `isolation.level=read_committed`
ở phía consumer, bạn có thể vô tình đọc phải dữ liệu "dở dang" (thuộc transaction đã bị rollback) — đây là lỗi
cấu hình rất dễ bị bỏ sót vì nó không gây crash, chỉ gây **sai lệch dữ liệu âm thầm**.

## 🔍 Debugging hints

- **Nghi ngờ mất dữ liệu ở consumer mới**: kiểm tra `auto.offset.reset` — nếu là `latest` và group này mới được
  tạo (hoặc `group.id` bị đổi), toàn bộ backlog trước thời điểm khởi động sẽ bị bỏ qua.
- **Nghi ngờ rebalance storm**: đối chiếu thời gian xử lý trung bình mỗi record × `max.poll.records` với
  `max.poll.interval.ms` — nếu vượt ngưỡng, đây gần như chắc chắn là nguyên nhân.
- **Nghi ngờ loss âm thầm ở luồng quan trọng**: kiểm tra `enable.auto.commit` — nếu `true` và xử lý có phần bất
  đồng bộ/theo batch, đây là nghi phạm số 1.
- **Nghi ngờ đọc phải dữ liệu "dở dang"**: kiểm tra producer có dùng transactions không, và `isolation.level`
  phía consumer có khớp (`read_committed`) hay không.

## 🔗 Xem tiếp / Liên kết liên quan

- Tiếp theo: [`09-rebalancing-and-group-behavior-basics.md`](09-rebalancing-and-group-behavior-basics.md) —
  điều gì xảy ra khi assignment thay đổi, và các config ở đây (`session.timeout.ms`, `max.poll.interval.ms`)
  ảnh hưởng ra sao.
- [`05-consumers.md`](05-consumers.md) — mental model nền tảng về poll/process/commit trước khi đi sâu config.
- [`07-producer-configs-and-delivery-behavior.md`](07-producer-configs-and-delivery-behavior.md) — góc nhìn
  đối xứng phía producer.
- [`10-ordering-delivery-semantics.md`](10-ordering-delivery-semantics.md) — `isolation.level` trong bức tranh
  đầy đủ về delivery semantics.
- [`../GLOSSARY.md`](../GLOSSARY.md) — tra cứu `committed offset`, `lag (consumer lag)`.
