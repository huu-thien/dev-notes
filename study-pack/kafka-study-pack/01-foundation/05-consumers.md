# Consumers

## 🎯 Mục tiêu học

Sau khi đọc file này, bạn sẽ:
- Hiểu chính xác **poll loop** hoạt động ra sao — Kafka consumer không "nhận" dữ liệu, nó **chủ động kéo**.
- Phân biệt rõ ràng **3 bước độc lập**: đọc (fetch), xử lý (process), commit offset — và vì sao nhầm lẫn 3 bước
  này là nguồn gốc của phần lớn bug duplicate/loss ở phía consumer.
- Hiểu rõ: **offset commit không đồng nghĩa "message đã được xử lý an toàn về mặt nghiệp vụ"**.
- Biết chính xác **crash xảy ra ở đâu trong vòng lặp thì gây duplicate, ở đâu thì gây loss**.

## 📖 Mục lục

- [Pull model — nhắc lại và đào sâu](#-pull-model--nhắc-lại-và-đào-sâu)
- [Poll loop là gì](#-poll-loop-là-gì)
- [3 bước tách biệt: read → process → commit](#-3-bước-tách-biệt-read--process--commit)
- [Diagram: vòng lặp poll/process/commit và các điểm crash](#️-diagram-vòng-lặp-pollprocesscommit-và-các-điểm-crash)
- [Vì sao commit offset không đồng nghĩa xử lý xong an toàn](#-vì-sao-commit-offset-không-đồng-nghĩa-xử-lý-xong-an-toàn)
- [Failure modes](#-failure-modes)
- [Debugging hints](#-debugging-hints)
- [Common mistakes / Anti-patterns](#-common-mistakes--anti-patterns)
- [Mini scenarios](#-mini-scenarios)
- [Key takeaways](#-key-takeaways)
- [Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 🔽 Pull model — nhắc lại và đào sâu

Kafka consumer dùng mô hình **pull**: consumer chủ động gọi API `poll()` để kéo dữ liệu từ broker, theo tốc độ
và nhịp độ của chính nó — khác với mô hình **push** (broker chủ động đẩy) mà nhiều hệ thống messaging khác
dùng.

| Mô hình | Ai chủ động | Ưu điểm | Nhược điểm |
|---|---|---|---|
| **Push** | Broker | Độ trễ thấp khi có dữ liệu mới | Dễ làm quá tải consumer nếu broker đẩy nhanh hơn khả năng xử lý — cần cơ chế backpressure riêng |
| **Pull** (Kafka) | Consumer | Consumer tự kiểm soát tốc độ tiêu thụ — backpressure tự nhiên, không cần cơ chế đặc biệt | Có độ trễ nhỏ giữa các lần fetch (kiểm soát được qua `fetch.min.bytes`, xem `08-consumer-configs-and-offset-management.md`) |

💡 Đây là lý do Kafka phục vụ tốt cả **consumer real-time** và **consumer batch chạy 1 lần/ngày** trên cùng 1
topic mà không cần thiết kế đặc biệt — mỗi consumer tự kéo theo nhịp độ riêng, hoàn toàn độc lập với tốc độ ghi
của producer.

## 🔁 Poll loop là gì

Consumer Kafka về bản chất là **một vòng lặp vô hạn** gọi `poll()` liên tục:

```
while (true) {
    records = consumer.poll(timeout)   // 1. FETCH: kéo 1 batch record mới
    for (record in records) {
        process(record)                // 2. PROCESS: xử lý nghiệp vụ
    }
    consumer.commitSync()              // 3. COMMIT: xác nhận đã xử lý xong
}
```

- `poll()` không chỉ để lấy dữ liệu — nó còn là **nhịp tim (heartbeat)** của consumer trong group. Nếu consumer
  không gọi `poll()` đủ thường xuyên (do xử lý quá lâu), group coi consumer đó là "chết" và kích hoạt rebalance
  (chi tiết ở [`09-rebalancing-and-group-behavior-basics.md`](09-rebalancing-and-group-behavior-basics.md)).
- 📌 **Đây là điểm dễ bị bỏ qua nhất**: `poll()` vừa lấy dữ liệu, vừa gián tiếp "báo cáo tôi vẫn còn sống" cho
  group — xử lý trong vòng lặp quá chậm không chỉ làm chậm throughput, mà còn có thể khiến consumer bị **đá ra
  khỏi group** dù nó không hề crash.

## 🧩 3 bước tách biệt: read → process → commit

Đây là mental model **quan trọng nhất** của file này — 3 bước trong vòng lặp trên là **3 hành động độc lập**,
mỗi hành động có thể thành công/thất bại **riêng biệt** với các hành động còn lại:

1. **Read (fetch)**: consumer kéo record về, nhưng record vẫn còn nguyên trên broker — fetch không "tiêu thụ"
   dữ liệu theo nghĩa xóa nó đi (khác với queue truyền thống).
2. **Process**: code nghiệp vụ xử lý record (ghi database, gọi API, tính toán...). Đây là bước **duy nhất** có
   ý nghĩa nghiệp vụ thực sự — Kafka hoàn toàn không biết và không quan tâm bước này thành công hay thất bại.
3. **Commit**: consumer báo cho Kafka biết "tôi đã xử lý xong tới offset X" — Kafka lưu lại con số này
   (`committed offset`) gắn với `group.id`, dùng làm điểm bắt đầu nếu consumer restart hoặc rebalance.

⚠️ **Kafka chỉ biết về bước 1 và 3.** Bước 2 (process) hoàn toàn nằm trong code của bạn — nếu process thất bại
giữa chừng nhưng bạn vẫn commit, Kafka sẽ nghĩ rằng dữ liệu đó đã được xử lý xong, vĩnh viễn không có cách nào
"biết" là nó chưa thực sự xong về mặt nghiệp vụ.

## 🗺️ Diagram: vòng lặp poll/process/commit và các điểm crash

```
       ┌─────────┐      ┌───────────┐      ┌─────────┐
  ───► │  FETCH  │ ───► │  PROCESS  │ ───► │ COMMIT  │ ───► (poll tiếp)
       └─────────┘      └───────────┘      └─────────┘
            │                  │                  │
        crash tại A       crash tại B        crash tại C
```

- **Crash tại A (trong lúc fetch)**: chưa xử lý gì, chưa commit gì → khi consumer restart, đọc lại từ committed
  offset cũ → **không mất, không trùng** (an toàn nhất).
- **Crash tại B (đã fetch, đang process, chưa commit)**: record đã fetch nhưng chưa xử lý xong (hoặc xử lý xong
  nhưng chưa commit) → khi consumer restart, đọc lại từ committed offset cũ → record này **được xử lý lại từ
  đầu** → nếu process không idempotent, đây là nguồn gốc của **duplicate xử lý** (dù Kafka đảm bảo dữ liệu vẫn
  còn, không mất).
- **Crash tại C (đã commit, nhưng ngay sau khi commit lại crash trước khi hoàn tất side-effect khác)**: hiếm
  gặp hơn, nhưng nếu bạn commit **trước khi** process hoàn tất hoàn toàn (ví dụ commit ngay sau fetch, xử lý
  bất đồng bộ ở background), crash tại đây gây ra **loss về mặt nghiệp vụ** — offset đã tiến lên, nhưng dữ liệu
  chưa thực sự được xử lý xong, và consumer sẽ không bao giờ đọc lại record đó nữa.

- 📌 Điều cần nhớ: **commit trước process xong** đổi rủi ro từ "duplicate" (an toàn hơn) sang "loss" (nguy hiểm
  hơn). Đây là lý do vì sao thứ tự đúng luôn là **process xong hoàn toàn rồi mới commit**, chấp nhận khả năng
  duplicate (xử lý lại) thay vì chấp nhận khả năng loss (bỏ sót vĩnh viễn).

## 🧠 Vì sao commit offset không đồng nghĩa xử lý xong an toàn

`enable.auto.commit=true` (giá trị mặc định trong nhiều client) khiến việc commit diễn ra **theo chu kỳ thời
gian** (`auto.commit.interval.ms`), **độc lập hoàn toàn** với việc code của bạn đã xử lý xong record hay chưa.
Điều này có nghĩa là:

- Nếu auto-commit "tick" đúng lúc bạn đang xử lý dở record thứ 5 trong batch 10 record vừa fetch, offset có thể
  đã được commit tới **record thứ 10** (offset của batch, không phải offset của record đang xử lý) — nếu
  consumer crash ngay sau đó, record 6-10 **bị coi là đã xử lý xong dù chưa hề chạm tới**, dẫn tới **loss về
  mặt nghiệp vụ** dù dữ liệu vẫn còn nguyên trên Kafka.
- 📌 Đây là lý do vì sao `enable.auto.commit=true` được coi là **nguy hiểm cho luồng xử lý quan trọng** — nó ưu
  tiên sự tiện lợi (không cần gọi commit tường minh) hơn là kiểm soát chính xác thời điểm commit. Phân tích đầy
  đủ (kèm khi nào auto-commit vẫn chấp nhận được) ở
  [`08-consumer-configs-and-offset-management.md`](08-consumer-configs-and-offset-management.md).

## 🚨 Failure modes

| Tình huống | Hệ quả | Vì sao xảy ra |
|---|---|---|
| Auto-commit tick giữa lúc đang xử lý dở 1 batch | **Loss về nghiệp vụ** — record chưa xử lý bị coi là đã xong nếu crash ngay sau đó | Auto-commit theo thời gian, không đồng bộ với tiến độ xử lý thực tế trong code |
| Commit tường minh **ngay sau fetch**, trước khi process xong (kể cả xử lý bất đồng bộ) | **Loss về nghiệp vụ** — offset tiến lên trước khi dữ liệu thực sự được xử lý | Nhầm lẫn "đã nhận được record" với "đã xử lý xong record" |
| Process xong, crash trước khi commit | **Duplicate xử lý** khi consumer restart (đọc lại từ offset cũ) | Kafka không biết record đã được xử lý, chỉ biết dựa vào committed offset |
| Process không idempotent (ví dụ cộng dồn số dư mà không kiểm tra đã cộng chưa) | Duplicate xử lý (từ trường hợp trên) gây **sai lệch dữ liệu nghiệp vụ thực sự** | Thiếu kiểm tra "record này đã xử lý chưa" ở tầng business logic |

## 🔍 Debugging hints

- **Nghi ngờ mất dữ liệu (business logic thiếu record nào đó)**: kiểm tra xem consumer có đang dùng
  `enable.auto.commit=true` kết hợp xử lý theo batch/bất đồng bộ hay không — đây là nguyên nhân phổ biến nhất.
- **Nghi ngờ xử lý trùng**: kiểm tra thời điểm commit so với thời điểm process hoàn tất trong code — nếu commit
  nằm **trước** khi toàn bộ side-effect của record hoàn tất, đây chính là điểm cần sửa.
- **Consumer bị coi là "chết" dù không crash**: kiểm tra thời gian xử lý trong vòng lặp so với
  `max.poll.interval.ms` — process quá lâu giữa 2 lần gọi `poll()` sẽ kích hoạt rebalance dù consumer vẫn sống
  bình thường.

## ❌ Common mistakes / Anti-patterns

| Sai lầm | Vì sao dễ mắc | Hậu quả thực tế | Cách sửa mental model |
|---|---|---|---|
| Coi commit offset là "đã lưu dữ liệu an toàn" | Từ "commit" gợi liên tưởng tới transaction commit trong database (lưu dữ liệu) | Nhầm lẫn giữa "Kafka đã ghi nhận vị trí đọc" với "business logic đã xử lý xong record" — 2 khái niệm hoàn toàn khác nhau | Commit offset chỉ là "con trỏ đọc tiếp theo cho group này", không liên quan gì tới việc dữ liệu đã được xử lý đúng đắn về nghiệp vụ hay chưa |
| Xử lý bất đồng bộ (fire-and-forget) rồi commit ngay sau khi gửi việc xử lý đi (chưa đợi hoàn tất) | Muốn tăng throughput bằng cách không block vòng lặp poll | Nếu xử lý bất đồng bộ thất bại sau khi đã commit, record đó **mất vĩnh viễn** về mặt nghiệp vụ | Chỉ commit sau khi có xác nhận chắc chắn xử lý đã hoàn tất (đợi kết quả, hoặc dùng cơ chế theo dõi riêng nếu buộc phải xử lý bất đồng bộ) |
| Xử lý quá lâu trong 1 lần poll (ví dụ gọi API bên ngoài chậm cho từng record trong batch lớn) mà không tăng `max.poll.interval.ms` tương ứng | Không nhận ra `poll()` cũng đóng vai trò heartbeat | Consumer bị coi là "chết", bị đá khỏi group, kích hoạt rebalance dù đang xử lý bình thường (chỉ là chậm) | Đo thời gian xử lý thực tế của 1 batch, đảm bảo `max.poll.interval.ms` đủ lớn, hoặc giảm `max.poll.records` để mỗi batch nhỏ hơn, xử lý nhanh hơn |

## 🧪 Mini scenarios

**Scenario 1 — Crash sau process, trước commit (an toàn hơn, nhưng cần idempotent):**
Consumer xử lý xong việc trừ kho hàng cho `OrderCreated` (offset 100), nhưng crash **ngay trước khi gọi
`commitSync()`**. Khi restart, consumer đọc lại từ committed offset cũ (offset 99), tức là **xử lý lại record
offset 100** — trừ kho hàng **2 lần** nếu logic không kiểm tra `order_id` đã xử lý chưa. ✅ Cách sửa: logic trừ
kho hàng cần idempotent (kiểm tra đã trừ cho `order_id` này chưa trước khi trừ lần nữa).

**Scenario 2 — Commit trước khi xử lý xong hoàn toàn (nguy hiểm hơn — gây loss):**
Consumer nhận batch 50 record, gọi `commitSync()` **ngay sau khi fetch** (trước vòng lặp xử lý), rồi mới bắt
đầu xử lý từng record. Ở record thứ 30, hệ thống downstream (database) bị timeout, xử lý dừng lại. Vì offset đã
commit tới cuối batch (record 50), khi consumer restart, nó đọc tiếp từ **sau** record 50 — **record 30-50 bị
bỏ sót vĩnh viễn**, dù dữ liệu vẫn còn nguyên trên Kafka. ❌ Nguyên nhân gốc: commit đặt sai vị trí trong vòng
lặp (trước khi xử lý xong, không phải sau).

**Scenario 3 — Slow processing gây rebalance ngoài ý muốn:**
Consumer xử lý mỗi record bằng cách gọi 1 API bên ngoài mất trung bình 800ms. Với `max.poll.records=500` (giá
trị mặc định) và `max.poll.interval.ms=300000` (5 phút mặc định), 500 record × 800ms = 400 giây — **vượt quá**
`max.poll.interval.ms`. Consumer bị coi là "treo", bị đá khỏi group, partition được gán lại cho consumer khác —
gây rebalance liên tục dù consumer chưa từng crash thực sự. ✅ Cách sửa: giảm `max.poll.records` xuống mức phù
hợp với tốc độ xử lý thực tế, hoặc tăng `max.poll.interval.ms` (chi tiết reasoning ở
[`08-consumer-configs-and-offset-management.md`](08-consumer-configs-and-offset-management.md)).

## ✅ Key takeaways

- Kafka dùng mô hình **pull** — consumer chủ động kéo dữ liệu, tự kiểm soát tốc độ tiêu thụ.
- `poll()` không chỉ lấy dữ liệu — nó còn là heartbeat báo hiệu consumer còn sống với group.
- **Fetch, process, commit là 3 hành động độc lập** — commit không có nghĩa là process đã thành công về mặt
  nghiệp vụ, Kafka hoàn toàn không biết gì về logic xử lý của bạn.
- Thứ tự đúng luôn là: **process xong hoàn toàn rồi mới commit** — chấp nhận rủi ro duplicate (có thể xử lý
  idempotent) thay vì rủi ro loss (không thể khôi phục).
- Xử lý quá chậm trong vòng lặp poll có thể gây rebalance ngoài ý muốn, dù consumer không hề crash.

## 🔗 Xem tiếp / Liên kết liên quan

- Tiếp theo: [`06-consumer-groups.md`](06-consumer-groups.md) — nhiều consumer instance phối hợp với nhau ra
  sao trong 1 group.
- Đào sâu config: [`08-consumer-configs-and-offset-management.md`](08-consumer-configs-and-offset-management.md)
  — `enable.auto.commit`, `auto.offset.reset`, `max.poll.records`, `max.poll.interval.ms`, `session.timeout.ms`...
- [`04-producers.md`](04-producers.md) — phía ghi dữ liệu, nền tảng để hiểu producer gửi gì cho consumer đọc.
- [`09-rebalancing-and-group-behavior-basics.md`](09-rebalancing-and-group-behavior-basics.md) — chi tiết vì
  sao xử lý chậm gây rebalance, và cách phát hiện/khắc phục.
