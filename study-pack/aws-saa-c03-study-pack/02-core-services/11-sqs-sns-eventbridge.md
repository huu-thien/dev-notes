# SQS, SNS, and EventBridge

Ba dịch vụ nền tảng cho kiến trúc **decoupling** và **event-driven** trên AWS: hàng đợi (SQS), publish/subscribe (SNS), và event routing (EventBridge).

## Mục lục

- [Mục tiêu học](#mục-tiêu-học)
- [Practical understanding](#practical-understanding)
- [Decision logic](#decision-logic)
- [Exam focus](#exam-focus)
- [Use cases](#use-cases)
- [Khi nào nên dùng / không nên dùng](#khi-nào-nên-dùng--không-nên-dùng)
- [Bảng so sánh nhanh](#bảng-so-sánh-nhanh)
- [Anti-patterns / lựa chọn sai thường gặp](#anti-patterns--lựa-chọn-sai-thường-gặp)
- [Common traps](#common-traps)
- [Mini scenarios](#mini-scenarios)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Mục tiêu học

- Hiểu **decoupling** mindset — vì sao tách rời producer và consumer giúp hệ thống bền vững hơn.
- Phân biệt rõ mô hình queue (SQS), pub/sub (SNS), và event routing (EventBridge).
- Chọn đúng dịch vụ cho từng tình huống kiến trúc cụ thể.

## Practical understanding

### Decoupling mindset

**Decoupling** nghĩa là tách rời thành phần gửi (producer) và thành phần xử lý (consumer) sao cho chúng không cần biết trực tiếp về nhau và không cần hoạt động đồng thời — nếu consumer tạm thời chậm hoặc lỗi, producer vẫn tiếp tục gửi mà không bị chặn. Ba dịch vụ này là công cụ chính để hiện thực decoupling trên AWS, mỗi dịch vụ giải quyết một mô hình giao tiếp khác nhau.

🧠 **Queue vs pub/sub vs event bus mindset:** đây là 3 mô hình giao tiếp khác nhau về bản chất, không phải 3 "phiên bản" của cùng 1 ý tưởng:

- **Queue (SQS)** — mô hình **"kéo" (pull)**: consumer chủ động lấy message ra xử lý, message tồn tại tới khi được xử lý xong. Phù hợp khi cần **1 đơn vị công việc được xử lý đúng 1 lần** (dù có thể nhiều consumer cùng lấy để scale song song).
- **Pub/sub (SNS)** — mô hình **"đẩy" (push) tức thời**: publisher không quan tâm ai đang lắng nghe, mọi subscriber đăng ký đều nhận bản sao message ngay lập tức. Phù hợp khi 1 sự kiện cần **thông báo đồng thời** cho nhiều bên độc lập.
- **Event bus (EventBridge)** — mô hình **định tuyến theo nội dung**: không phải "phát cho ai đăng ký topic" mà "sự kiện này khớp rule nào thì đi tới target đó". Phù hợp khi cần logic định tuyến phức tạp, nhiều nguồn sự kiện khác nhau (nhiều AWS service, nhiều SaaS) đổ về 1 nơi xử lý tập trung.

### Consumer decoupling — vì sao quan trọng hơn cả việc "gửi được message"

Mục tiêu thật sự của SQS/SNS/EventBridge không chỉ là truyền message, mà là đảm bảo **producer và consumer có thể scale, deploy, và fail độc lập với nhau**. Ví dụ: nếu consumer đang bị lỗi hoặc đang scale up chậm, producer (VD: API nhận request từ người dùng) vẫn phản hồi nhanh cho người dùng thay vì phải chờ consumer xử lý xong đồng bộ.

### SQS (Simple Queue Service) — hàng đợi

**Amazon SQS** là managed message queue: producer gửi message vào queue, consumer chủ động lấy (poll) message ra để xử lý, và **xoá message sau khi xử lý xong**. Đây là mô hình **point-to-point** — mỗi message thường chỉ được xử lý bởi 1 consumer (trong ngữ cảnh 1 queue, nhiều consumer cùng đọc để scale xử lý song song).

- **Standard Queue**: throughput gần như không giới hạn, đảm bảo **at-least-once delivery** (message có thể được gửi lại nhiều hơn 1 lần), thứ tự **không đảm bảo tuyệt đối**.
- **FIFO Queue**: đảm bảo thứ tự message chính xác và **exactly-once processing**, nhưng throughput giới hạn hơn Standard Queue.

🧠 **Ordering vs throughput trade-off:** đây là trade-off cốt lõi khi chọn FIFO vs Standard — **càng đảm bảo thứ tự nghiêm ngặt, càng khó scale throughput theo chiều ngang** (FIFO phải xử lý tuần tự trong cùng 1 `MessageGroupId`). Khi đề không nói rõ cần thứ tự tuyệt đối, mặc định nên nghiêng về Standard Queue để có throughput cao hơn.

**Visibility Timeout**: khi một consumer lấy message ra xử lý, message đó "ẩn" khỏi các consumer khác trong khoảng thời gian visibility timeout — nếu consumer không xử lý xong và xoá message trước khi hết thời gian này, message sẽ tái xuất hiện để consumer khác xử lý lại (dễ gây xử lý trùng nếu không thiết kế idempotent).

**Dead-Letter Queue (DLQ)**: queue riêng nhận các message xử lý thất bại nhiều lần liên tiếp (vượt quá số lần retry cấu hình) — giúp cô lập message lỗi để phân tích sau, không làm nghẽn queue chính.

### SNS (Simple Notification Service) — publish/subscribe

**Amazon SNS** hoạt động theo mô hình **pub/sub**: producer publish message vào 1 **topic**, và **tất cả subscriber** đăng ký topic đó đều nhận được message gần như đồng thời (**fanout pattern**). Subscriber có thể là email, SMS, SQS queue, Lambda, HTTP endpoint. SNS **không lưu trữ message lâu dài** như queue — nếu subscriber không nhận được lúc publish (offline/lỗi tạm thời), message có thể mất trừ khi subscriber là SQS/Lambda có retry riêng.

### Fanout pattern — SNS → nhiều SQS

**Fanout** là pattern kết hợp ưu điểm của cả SNS và SQS: publish 1 message vào SNS topic, nhiều SQS queue subscribe topic đó (mỗi service 1 queue riêng). Kết quả: mọi service nhận được sự kiện gần như đồng thời (ưu điểm SNS) **và** mỗi service có buffer riêng để xử lý không đồng bộ, không mất message nếu tạm thời downtime (ưu điểm SQS). Đây là pattern xuất hiện rất thường xuyên trong đề thi khi mô tả "nhiều service cần xử lý độc lập cùng 1 sự kiện".

### EventBridge — event bus / rule mindset

**Amazon EventBridge** là event bus cho phép định tuyến sự kiện dựa trên **rule** (pattern matching nội dung sự kiện) tới nhiều **target** khác nhau (Lambda, SQS, SNS, Step Functions...). Khác với SNS (chỉ phát cho subscriber đã đăng ký topic), EventBridge cho phép định tuyến linh hoạt theo nội dung sự kiện, tích hợp sẵn với nhiều AWS service (event source) và cả ứng dụng SaaS bên thứ ba (qua partner event source).

### EventBridge rule-based routing

EventBridge rule so khớp (pattern matching) trên **nội dung của sự kiện** (event source, detail-type, các trường trong payload) để quyết định gửi tới target nào — khác hẳn SNS chỉ có khái niệm "ai đăng ký topic thì nhận tất cả". Điều này cho phép: 1 event bus nhận sự kiện từ nhiều nguồn (EC2 state change, custom application event, SaaS partner event...), rồi định tuyến từng loại sự kiện tới đúng target xử lý tương ứng — mà producer không cần biết trước có bao nhiêu rule/target đang lắng nghe.

## Decision logic

| Câu hỏi cần trả lời | Chỉ báo trong đề | Hướng quyết định |
|---|---|---|
| Cần đảm bảo message không mất khi consumer chậm/offline? | "không được mất message", "worker có thể tạm thời downtime" | Có → SQS |
| Cần phát 1 sự kiện tới nhiều hệ thống độc lập cùng lúc? | "nhiều service cùng nhận", "notify nhiều kênh" | Có → SNS (fanout), kết hợp SQS phía sau mỗi subscriber nếu cần độ bền |
| Cần định tuyến theo nội dung/loại sự kiện, nhiều nguồn khác nhau? | "định tuyến theo loại sự kiện", "tích hợp nhiều nguồn AWS/SaaS" | Có → EventBridge |
| Cần thứ tự xử lý tuyệt đối, không trùng lặp? | "đảm bảo đúng thứ tự", "exactly-once" | Có → SQS FIFO |
| Traffic cực lớn, không quan trọng thứ tự? | "throughput cao nhất", "không quan trọng thứ tự" | Có → SQS Standard |
| Cần chạy tác vụ theo lịch (cron-like)? | "chạy định kỳ", "lịch trình cố định" | Có → EventBridge scheduled rule |

## Exam focus

### Must know for exam

- SQS = hàng đợi, message được lưu trữ và chờ consumer chủ động lấy ra xử lý; phù hợp khi cần đảm bảo message không mất khi consumer tạm thời chậm/offline.
- SNS = pub/sub, phát tán message ngay lập tức tới nhiều subscriber (fanout); không phải nơi lưu trữ message chờ xử lý sau.
- EventBridge = event routing dựa trên rule/pattern, phù hợp khi cần định tuyến sự kiện linh hoạt theo nội dung, tích hợp nhiều AWS service/SaaS.
- FIFO không mặc định tốt hơn Standard — FIFO đánh đổi throughput để lấy thứ tự đảm bảo và exactly-once; chỉ chọn FIFO khi thứ tự/không trùng lặp là yêu cầu bắt buộc.
- DLQ giúp cô lập message lỗi, tránh nghẽn queue chính do message không xử lý được liên tục retry.

### Important

- Fanout pattern chuẩn: SNS topic → nhiều SQS queue (mỗi service subscribe 1 queue riêng) → đảm bảo mỗi service xử lý độc lập, không mất message dù tạm thời offline (kết hợp ưu điểm pub/sub của SNS và độ bền của SQS).
- EventBridge Scheduler/rule theo lịch (cron) là cách chuẩn để trigger tác vụ định kỳ (thay thế mô hình cron server truyền thống).

### Nice to know

- Chi tiết cú pháp event pattern JSON của EventBridge rule — không cần thuộc lòng cho kỳ thi.

## Use cases

- **SQS**: xử lý batch job từ hàng đợi công việc (resize ảnh, gửi email) mà không lo mất job khi worker restart.
- **SNS**: gửi thông báo cùng lúc qua email + SMS + push cho một sự kiện (VD: đơn hàng được xác nhận).
- **SNS fanout tới SQS**: một sự kiện "đơn hàng mới" cần cả service kho, service thanh toán, service email cùng xử lý độc lập.
- **EventBridge**: định tuyến sự kiện thay đổi trạng thái EC2 tới Lambda để tự động gắn tag, hoặc lịch chạy báo cáo hàng đêm.

## Khi nào nên dùng / không nên dùng

| Nhu cầu | Nên dùng | Không nên dùng |
|---|---|---|
| Cần đảm bảo message không mất khi consumer chậm/offline | SQS | SNS (không lưu trữ chờ xử lý sau) |
| Cần phát 1 sự kiện tới nhiều hệ thống độc lập cùng lúc | SNS (fanout), có thể kết hợp SQS phía sau mỗi subscriber | 1 SQS queue dùng chung cho nhiều consumer khác loại (khó tách logic) |
| Cần định tuyến sự kiện theo nội dung/pattern, tích hợp nhiều nguồn AWS/SaaS | EventBridge | SNS đơn thuần (không có rule pattern matching phong phú) |
| Cần thứ tự xử lý tuyệt đối và không trùng lặp | SQS FIFO | SQS Standard (không đảm bảo thứ tự tuyệt đối) |
| Traffic cực lớn, không quan trọng thứ tự | SQS Standard | SQS FIFO (giới hạn throughput hơn) |

## Bảng so sánh nhanh

| Tiêu chí | SQS | SNS | EventBridge |
|---|---|---|---|
| Mô hình | Queue (point-to-point) | Pub/sub (fanout) | Event bus (rule-based routing) |
| Lưu trữ message chờ xử lý | Có | Không (chuyển tiếp ngay) | Không (chuyển tiếp theo rule) |
| Nhiều đích nhận cùng 1 sự kiện | Không trực tiếp (1 message – 1 lần lấy) | Có (mọi subscriber của topic) | Có (nhiều rule/target theo pattern) |
| Định tuyến theo nội dung sự kiện | Không | Không (theo topic) | Có (event pattern matching) |
| Đảm bảo thứ tự | Có (FIFO) / Không (Standard) | Không đảm bảo | Không đảm bảo theo thứ tự tuyệt đối |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Dùng SNS thay cho SQS khi cần đảm bảo không mất message | SNS "gửi ngay" nghe như nhanh hơn, đơn giản hơn | SNS không lưu trữ message chờ xử lý — nếu subscriber offline/lỗi tạm thời (và không phải SQS/Lambda có retry riêng), message mất vĩnh viễn |
| ❌ Dùng SQS khi cần broadcast 1 sự kiện tới nhiều consumer độc lập | SQS quen thuộc, nghĩ "nhiều consumer cùng đọc 1 queue là được" | Nhiều consumer đọc chung 1 SQS queue nghĩa là **chia nhau xử lý** các message khác nhau (mỗi message chỉ 1 consumer xử lý), không phải mỗi consumer nhận **toàn bộ** message như broadcast — cần SNS (hoặc SNS fanout ra nhiều SQS) mới đúng |
| ❌ Dùng EventBridge như một message buffer đơn giản để "lưu trữ chờ xử lý" | EventBridge nghe hiện đại, có vẻ làm được mọi việc messaging | EventBridge định tuyến sự kiện theo rule, không lưu trữ/chờ xử lý như queue — nếu cần đảm bảo message được xử lý dù consumer chậm, vẫn cần SQS làm target phía sau rule |
| ❌ Luôn chọn FIFO "cho chắc" dù đề không yêu cầu thứ tự | Nghe như FIFO "an toàn hơn", "đúng đắn hơn" | FIFO giới hạn throughput hơn Standard — nếu đề không có keyword liên quan tới thứ tự/duplicate, Standard mới là "MOST cost-effective/scalable" |

## Common traps

### ⚠️ Trap: SQS vs SNS vs EventBridge
Nhầm giữa 3 mô hình là bẫy phổ biến nhất — SQS là queue (lưu trữ, chờ xử lý), SNS là pub/sub (phát tán ngay, không lưu), EventBridge là event routing (định tuyến theo rule/pattern, tích hợp đa nguồn).

### ⚠️ Trap: nghĩ FIFO luôn tốt hơn Standard
FIFO đánh đổi throughput để lấy thứ tự đảm bảo và exactly-once — nếu đề không yêu cầu thứ tự nghiêm ngặt, Standard Queue thường là lựa chọn "MOST cost-effective"/"MOST scalable" hơn.

### ⚠️ Trap: nghĩ EventBridge là hàng đợi thay thế cho SQS
EventBridge định tuyến sự kiện theo rule, không đóng vai trò lưu trữ/chờ xử lý như queue — nếu cần đảm bảo message được xử lý dù consumer tạm thời chậm, vẫn cần SQS (có thể làm target của EventBridge rule).

### ⚠️ Trap: nghĩ SNS lưu trữ message như queue
SNS chuyển tiếp message ngay lập tức cho subscriber đang hoạt động — nếu subscriber offline và không phải SQS/Lambda có cơ chế riêng, message có thể mất, khác hẳn với SQS luôn lưu trữ message tới khi được xử lý/hết retention.

### ⚠️ Trap: nghĩ decoupling bằng SQS/SNS/EventBridge tự động giải quyết idempotency
Decoupling giúp hệ thống bền vững hơn khi có lỗi tạm thời, nhưng cơ chế retry/at-least-once delivery (đặc biệt SQS Standard) có thể khiến consumer nhận cùng 1 message nhiều lần — logic xử lý ở consumer vẫn phải tự đảm bảo **idempotency**, không phải service messaging tự lo việc này.

## Mini scenarios

🧪 **Scenario 1 — Fanout khi có đơn hàng mới**

**Tình huống:** Khi có đơn hàng mới, hệ thống cần đồng thời: (1) service kho cập nhật tồn kho, (2) service thanh toán xử lý giao dịch, (3) service email gửi xác nhận — mỗi service xử lý độc lập, không được mất sự kiện nếu 1 service tạm thời downtime.
**Đáp án đúng:** Publish sự kiện "đơn hàng mới" vào 1 SNS topic, mỗi service subscribe qua 1 SQS queue riêng (fanout pattern).
**Vì sao:** SNS phát tán sự kiện tới cả 3 service cùng lúc; mỗi SQS queue đảm bảo service tương ứng không mất message dù tạm thời downtime — kết hợp ưu điểm pub/sub và độ bền của queue.

🧪 **Scenario 2 — Định tuyến sự kiện đa nguồn tới nhiều đội xử lý**

**Tình huống:** Một tổ chức có sự kiện phát sinh từ nhiều nguồn khác nhau (EC2 state change, ứng dụng nội bộ, đối tác SaaS bên thứ ba). Mỗi loại sự kiện cần được định tuyến tới 1 đội xử lý khác nhau (đội hạ tầng, đội vận hành, đội tích hợp) dựa trên loại sự kiện và nội dung payload, không cần producer biết trước có bao nhiêu đội đang lắng nghe.
**Đáp án đúng:** Dùng Amazon EventBridge với các rule pattern matching theo `source`/`detail-type` để định tuyến từng loại sự kiện tới target tương ứng (Lambda, SQS...) của từng đội.
**Vì sao:** EventBridge được thiết kế riêng cho bài toán định tuyến sự kiện đa nguồn theo nội dung — SNS chỉ hỗ trợ "đăng ký theo topic" chứ không có rule pattern matching linh hoạt như vậy.

🧪 **Scenario 3 — Anti-pattern: dùng SQS để broadcast**

**Tình huống:** Một đội kỹ sư thiết kế hệ thống sao cho 3 service (kho, thanh toán, email) đều đọc chung **1 SQS queue** để cùng nhận sự kiện "đơn hàng mới", kỳ vọng cả 3 service đều xử lý được mỗi sự kiện.
**Đáp án đúng:** Đây là thiết kế sai — cần tách thành SNS topic (fanout) với 3 SQS queue riêng, mỗi service 1 queue.
**Vì sao đây là anti-pattern cần tránh:** Khi nhiều consumer cùng đọc 1 SQS queue, mỗi message chỉ được **1 trong số các consumer** lấy và xử lý (dùng để scale xử lý song song cùng loại việc), không phải mọi consumer đều nhận được toàn bộ message — dẫn tới chỉ 1 trong 3 service xử lý được mỗi đơn hàng, 2 service còn lại "mất" sự kiện.

## Key takeaways


- SQS = queue lưu trữ, point-to-point, phù hợp khi cần đảm bảo không mất message khi consumer chậm.
- SNS = pub/sub, fanout tức thời tới nhiều subscriber, không lưu trữ lâu dài.
- EventBridge = event bus định tuyến theo rule/pattern, tích hợp đa nguồn AWS/SaaS.
- FIFO đánh đổi throughput lấy thứ tự/exactly-once — không phải lựa chọn mặc định tốt hơn Standard.
- Decoupling không tự động đảm bảo idempotency — vẫn là trách nhiệm thiết kế ở consumer.

## Checklist tự ôn

- [ ] Tôi phân biệt được 3 mô hình: queue, pub/sub, event routing.
- [ ] Tôi biết khi nào chọn FIFO thay vì Standard Queue.
- [ ] Tôi giải thích được fanout pattern (SNS → nhiều SQS).
- [ ] Tôi hiểu vì sao decoupling không tự động giải quyết idempotency.

## Xem tiếp / Liên kết liên quan

- [09-lambda.md](./09-lambda.md)
- [10-api-gateway.md](./10-api-gateway.md)
- [../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md](../04-comparison-guides/03-sqs-vs-sns-vs-eventbridge.md)
- [../03-architecture-patterns/02-fault-tolerance.md](../03-architecture-patterns/02-fault-tolerance.md)
