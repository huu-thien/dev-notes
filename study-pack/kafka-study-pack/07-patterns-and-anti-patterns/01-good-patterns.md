# Good Patterns

## 🎯 Mục tiêu học

Sau khi đọc xong, bạn sẽ:
- Nắm được **7 pattern kiến trúc đã được kiểm chứng** khi dùng Kafka trong production, không chỉ tên gọi mà cả
  điều kiện dùng đúng.
- Biết phân biệt **dấu hiệu triển khai đúng** và **dấu hiệu đang lạm dụng** cho mỗi pattern — vì mọi pattern
  đều có thể bị dùng sai ngữ cảnh và trở thành gánh nặng thay vì lợi ích.
- Hiểu rõ **cost/trade-off** đi kèm mỗi pattern — không có pattern nào miễn phí.

## 📖 Mục lục

- [Outbox pattern](#-outbox-pattern)
- [Retry topic + DLQ](#-retry-topic--dlq)
- [Idempotent consumer](#-idempotent-consumer)
- [Schema versioning discipline](#-schema-versioning-discipline)
- [Per-entity keying](#-per-entity-keying)
- [Event-carried state transfer](#-event-carried-state-transfer)
- [Derived topics / enrichment pipeline](#-derived-topics--enrichment-pipeline)
- [🎤 Interview lens](#-interview-lens)
- [✅ Key takeaways](#-key-takeaways)
- [🔗 Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 📦 Outbox pattern

**Định nghĩa:** ghi business change và event cần publish vào **cùng 1 transaction** với database chính (bảng
`outbox`), sau đó 1 tiến trình riêng (thường là CDC qua Debezium) đọc bảng outbox và publish sang Kafka — thay
vì gọi Kafka producer trực tiếp trong cùng transaction nghiệp vụ.

**Dùng khi nào:** cần đảm bảo "ghi DB thành công" và "publish event" **luôn đồng bộ** (không bao giờ ghi DB
thành công mà event không được publish, hoặc ngược lại) — đặc biệt quan trọng khi event là nguồn sự thật cho
service khác.

**Giá trị nhận được:** loại bỏ dual-write problem (ghi DB và ghi Kafka là 2 hệ thống riêng biệt, không có
transaction chung tự nhiên) mà không cần 2-phase commit phức tạp.

**Cost/trade-off:** thêm độ trễ (event chỉ được publish sau khi CDC đọc được outbox table, không phải tức
thời); thêm thành phần vận hành (CDC connector) — xem
[`../04-ecosystem/05-debezium-cdc.md`](../04-ecosystem/05-debezium-cdc.md).

**Dấu hiệu triển khai đúng:** outbox table có schema rõ ràng, được dọn dẹp định kỳ (không phình vô hạn), CDC
connector được giám sát lag như 1 thành phần production quan trọng.

**Dấu hiệu đang lạm dụng:** dùng outbox cho mọi loại event kể cả khi không cần đồng bộ chặt với DB transaction
(tăng độ trễ và độ phức tạp không cần thiết cho use case đơn giản).

## 🔁 Retry topic + DLQ

**Định nghĩa:** khi xử lý lỗi tạm thời, publish message sang 1 topic retry riêng (có thể nhiều tầng với delay
tăng dần) thay vì block xử lý tại chỗ; nếu vẫn lỗi sau số lần retry giới hạn, đẩy sang Dead Letter Queue (DLQ)
để xử lý thủ công/riêng biệt.

**Dùng khi nào:** cần phân biệt lỗi tạm thời (network timeout, downstream tạm gián đoạn) và lỗi vĩnh viễn
(poison message, dữ liệu sai định dạng) — chi tiết ở
[`../03-design-and-architecture/07-retry-dlq-idempotency.md`](../03-design-and-architecture/07-retry-dlq-idempotency.md).

**Giá trị nhận được:** không chặn toàn bộ partition khi 1 message lỗi; có thể retry với backoff hợp lý mà không
ảnh hưởng throughput của các message khác.

**Cost/trade-off:** mất ordering tuyệt đối giữa message được retry và message mới; thêm topic cần quản lý,
giám sát riêng.

**Dấu hiệu triển khai đúng:** có giới hạn số lần retry rõ ràng, có kế hoạch xử lý DLQ (không để "chết" vô thời
hạn), có alerting khi DLQ có message mới.

**Dấu hiệu đang lạm dụng:** retry vô hạn không giới hạn (xem thêm
[`02-anti-patterns.md`](02-anti-patterns.md#-infinite-retries)); DLQ tồn tại nhưng không ai xử lý, trở thành
"nghĩa địa message" không ai động tới.

## 🔒 Idempotent consumer

**Định nghĩa:** thiết kế consumer sao cho xử lý cùng 1 message nhiều lần cho ra **cùng kết quả** như xử lý 1
lần — thường dùng idempotency key ở tầng ứng dụng để phát hiện và bỏ qua request trùng.

**Dùng khi nào:** bất kỳ side effect nào không tự nhiên idempotent (gọi API thanh toán, gửi email, cộng dồn số
liệu) và Kafka không đảm bảo "exactly-once" cho side effect đó (xem
[`../06-troubleshooting/03-message-loss-duplicates.md`](../06-troubleshooting/03-message-loss-duplicates.md)).

**Giá trị nhận được:** an toàn trước duplicate message do producer retry, consumer restart, hoặc replay thủ
công — không cần lo lắng "at-least-once delivery" gây hại.

**Cost/trade-off:** cần lưu trữ trạng thái đã xử lý (idempotency key store), thêm độ phức tạp code và có thể
thêm 1 round-trip kiểm tra trước khi xử lý.

**Dấu hiệu triển khai đúng:** idempotency key được thiết kế gắn với business identity rõ ràng (không chỉ dùng
offset, vì offset có thể đổi ý nghĩa khi replay), có cơ chế dọn dẹp key cũ (tránh phình vô hạn).

**Dấu hiệu đang lạm dụng:** thêm idempotency check cho mọi thứ kể cả những side effect vốn đã tự nhiên
idempotent (ví dụ ghi đè giá trị theo key — `UPSERT` đã tự idempotent, không cần thêm lớp kiểm tra dư thừa).

## 🏷️ Schema versioning discipline

**Định nghĩa:** quy trình rõ ràng cho mọi thay đổi schema — xác định compatibility mode, review trước khi
merge, có kế hoạch rollout theo đúng thứ tự (producer trước hay consumer trước tuỳ mode).

**Dùng khi nào:** bất kỳ hệ thống nào có nhiều team/service cùng tiêu thụ chung 1 event contract — càng nhiều
consumer độc lập, kỷ luật này càng quan trọng.

**Giá trị nhận được:** tránh breaking change gây lỗi production đột ngột; cho phép các team tiến hoá schema độc
lập mà không phá vỡ lẫn nhau.

**Cost/trade-off:** thêm bước review/approval trước khi thay đổi schema, có thể làm chậm tốc độ phát triển
ngắn hạn (đổi lại ổn định dài hạn).

**Dấu hiệu triển khai đúng:** mọi thay đổi schema đi qua Schema Registry với compatibility mode rõ ràng
([`../04-ecosystem/02-schema-registry.md`](../04-ecosystem/02-schema-registry.md)), có changelog schema.

**Dấu hiệu đang lạm dụng:** quy trình review quá nặng nề cho thay đổi schema không rủi ro (ví dụ thêm field
optional có default) — cần cân bằng giữa an toàn và tốc độ.

## 🔑 Per-entity keying

**Định nghĩa:** chọn key gắn trực tiếp với 1 business entity cụ thể (order ID, account ID, device ID) để đảm
bảo mọi event của cùng entity đó luôn vào cùng 1 partition, giữ ordering trong phạm vi entity.

**Dùng khi nào:** business cần ordering chặt trong phạm vi 1 entity (ví dụ: trạng thái đơn hàng phải xử lý đúng
thứ tự), nhưng chấp nhận không cần ordering giữa các entity khác nhau — xem
[`../03-design-and-architecture/03-key-design.md`](../03-design-and-architecture/03-key-design.md).

**Giá trị nhận được:** ordering đúng ngữ nghĩa nghiệp vụ mà vẫn giữ được parallelism giữa các entity khác nhau
(khác với global ordering, vốn triệt tiêu hoàn toàn khả năng song song).

**Cost/trade-off:** nếu 1 entity có traffic áp đảo (ví dụ 1 khách hàng lớn), dễ dẫn tới hot partition — xem
[`../06-troubleshooting/02-hot-partitions.md`](../06-troubleshooting/02-hot-partitions.md).

**Dấu hiệu triển khai đúng:** đã đo phân phối key trên dữ liệu thực tế, xác nhận không có entity nào áp đảo
traffic bất thường.

**Dấu hiệu đang lạm dụng:** dùng entity ID làm key dù nghiệp vụ không thực sự cần ordering (tăng rủi ro hot
partition không cần thiết mà không có lợi ích ordering tương xứng).

## 📤 Event-carried state transfer

**Định nghĩa:** event mang theo **đầy đủ dữ liệu cần thiết** để consumer xử lý mà không cần gọi ngược lại
service nguồn để lấy thêm thông tin (khác với event chỉ mang ID rồi consumer phải gọi API lấy chi tiết).

**Dùng khi nào:** muốn giảm coupling runtime giữa các service (consumer không cần biết service nguồn còn sống
hay không tại thời điểm xử lý), và dữ liệu trong event đủ ổn định để "đóng gói sẵn" mà không lo outdated quá
nhanh.

**Giá trị nhận được:** consumer xử lý độc lập hoàn toàn, không tạo runtime dependency ngược lại service nguồn —
tăng resilience của toàn hệ thống.

**Cost/trade-off:** message size lớn hơn (mang theo state đầy đủ thay vì chỉ ID) — xem
[`../03-design-and-architecture/05-message-size-throughput-latency.md`](../03-design-and-architecture/05-message-size-throughput-latency.md);
dữ liệu trong event có thể "cũ" hơn dữ liệu mới nhất ở service nguồn tại thời điểm consumer xử lý.

**Dấu hiệu triển khai đúng:** event chứa đúng lượng dữ liệu cần thiết cho phần lớn consumer, không quá thiếu
(buộc consumer phải gọi ngược) cũng không quá thừa (nhồi toàn bộ entity không cần thiết).

**Dấu hiệu đang lạm dụng:** nhồi toàn bộ object đồ sộ vào mọi event "cho chắc", trong khi phần lớn consumer chỉ
cần 1-2 field.

## 🔄 Derived topics / enrichment pipeline

**Định nghĩa:** dùng Kafka Streams/ksqlDB để biến đổi/join/enrich dữ liệu từ 1 hoặc nhiều topic nguồn thành 1
topic phái sinh mới, thay vì để mỗi consumer tự lặp lại logic enrichment.

**Dùng khi nào:** nhiều consumer khác nhau cần cùng 1 dạng dữ liệu đã được enrich/join — làm 1 lần ở tầng
pipeline chung tốt hơn lặp lại logic ở từng consumer.

**Giá trị nhận được:** giảm trùng lặp logic, đảm bảo tính nhất quán của dữ liệu enrich giữa các consumer khác
nhau — xem [`../04-ecosystem/03-kafka-streams.md`](../04-ecosystem/03-kafka-streams.md).

**Cost/trade-off:** thêm 1 tầng hạ tầng cần vận hành (state store, changelog topic, thêm 1 loại thất bại có thể
xảy ra); thêm độ trễ giữa topic nguồn và topic phái sinh.

**Dấu hiệu triển khai đúng:** có từ 2+ consumer thực sự cần cùng logic enrich, và pipeline được coi là 1 thành
phần production có ownership rõ ràng, được giám sát.

**Dấu hiệu đang lạm dụng:** xây derived topic cho use case chỉ có **đúng 1 consumer** — trường hợp này logic
enrichment nên nằm trực tiếp trong consumer đó thay vì tách thành pipeline riêng, tránh thêm phức tạp không cần
thiết.

## 🎤 Interview lens

**"Bạn chọn pattern nào để đảm bảo publish event đồng bộ với ghi database?"**
> Câu trả lời tốt cần nhắc **outbox pattern**, giải thích rõ dual-write problem nó giải quyết, và nhắc tới
> CDC (Debezium) như cơ chế phổ biến để đọc outbox table — không chỉ nêu tên pattern mà không giải thích cơ
> chế.

**"Idempotent consumer có cần thiết nếu Kafka đã có idempotent producer không?"**
> Câu hỏi test hiểu biết về phạm vi bảo vệ. Câu trả lời tốt: idempotent producer chỉ chống duplicate **ghi vào
> Kafka**; idempotent consumer cần thiết riêng cho mọi side effect ngoài Kafka không tự nhiên idempotent — 2
> cơ chế bảo vệ 2 phạm vi khác nhau, không thay thế nhau.

## ✅ Key takeaways

- Mọi pattern đều có **cost/trade-off rõ ràng** — không có pattern nào "luôn nên dùng" bất kể ngữ cảnh.
- Dấu hiệu lạm dụng phổ biến nhất: áp dụng pattern cho use case đơn giản không cần độ phức tạp tương xứng.
- Nhiều pattern trong bài này giải quyết các vấn đề đã gặp ở `06-troubleshooting` — nên đọc cùng lúc để thấy
  rõ mối liên hệ giữa "pattern phòng ngừa" và "sự cố thực tế nếu thiếu pattern đó".

## 🔗 Xem tiếp / Liên kết liên quan

- [`02-anti-patterns.md`](02-anti-patterns.md) — mặt trái: khi các pattern này bị bỏ qua hoặc làm sai.
- [`03-common-architecture-scenarios.md`](03-common-architecture-scenarios.md) — map pattern vào scenario thực
  tế.
- [`../03-design-and-architecture/07-retry-dlq-idempotency.md`](../03-design-and-architecture/07-retry-dlq-idempotency.md)
  — chi tiết retry/DLQ/idempotency.
- [`README.md`](README.md) — quay lại tổng quan phần Patterns and Anti-patterns.
