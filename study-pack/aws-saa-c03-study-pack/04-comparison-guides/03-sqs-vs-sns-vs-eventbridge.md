# SQS vs SNS vs EventBridge

So sánh queue (SQS), pub/sub (SNS), và event routing (EventBridge) để chọn đúng công cụ decoupling.

## Mục tiêu học

- Phân biệt mô hình queue, pub/sub, và event routing.
- Nhận diện đúng use case cho từng dịch vụ theo mô tả đề thi.

## Khi nào nên đọc file này

Sau khi đã đọc [`../02-core-services/11-sqs-sns-eventbridge.md`](../02-core-services/11-sqs-sns-eventbridge.md).

## Bảng so sánh nhanh

| Tiêu chí | SQS | SNS | EventBridge |
|---|---|---|---|
| Mô hình | Queue (point-to-point) | Pub/sub (fanout) | Event bus (rule-based routing) |
| Consumer pattern | Consumer chủ động poll và xoá message | Subscriber nhận đẩy (push) ngay khi publish | Target nhận theo rule khớp event pattern |
| Buffering/lưu trữ | Có (message chờ tới khi được xử lý/hết retention) | Không (chuyển tiếp ngay, không giữ lại) | Không (định tuyến ngay theo rule) |
| Ordering | FIFO queue đảm bảo thứ tự; Standard thì không | Không đảm bảo | Không đảm bảo thứ tự tuyệt đối |
| Fanout tới nhiều đích | Không trực tiếp (1 message – 1 lần lấy) | Có (nhiều subscriber cùng nhận) | Có (nhiều rule/target theo pattern) |

## So sánh theo tiêu chí ra đề thi

- **Cần đảm bảo message không mất khi consumer chậm/offline** → SQS.
- **Cần phát 1 sự kiện tới nhiều hệ thống độc lập ngay lập tức** → SNS (fanout), thường kết hợp SQS phía sau mỗi subscriber.
- **Cần định tuyến sự kiện theo nội dung, tích hợp nhiều nguồn AWS/SaaS** → EventBridge.
- **Cần thứ tự xử lý tuyệt đối, không trùng lặp** → SQS FIFO.

🧠 **Bài toán cốt lõi mỗi service giải quyết:** SQS giải quyết "cần một bộ đệm (buffer) để consumer xử lý dần, không mất việc dù consumer chậm/offline". SNS giải quyết "cần phát 1 sự kiện tới nhiều bên nhận độc lập ngay lập tức" — SNS **không giữ lại** message cho bên nhận đang offline. EventBridge giải quyết "cần định tuyến sự kiện tới đúng đích dựa trên nội dung sự kiện, từ nhiều nguồn khác nhau" — nó là bộ định tuyến theo luật (rule engine), không phải nơi lưu trữ. Ranh giới quyết định nằm ở: **có cần buffer/lưu trữ chờ xử lý không**, **có cần fanout tới nhiều bên không**, và **có cần định tuyến theo nội dung/pattern phức tạp không**.

## Keyword nhận diện trong đề

| Keyword trong đề | Service gợi ý |
|---|---|
| "queue", "worker polls messages", "process later" | SQS |
| "notify multiple subscribers", "fanout", "broadcast" | SNS |
| "event bus", "route events based on content", "SaaS integration", "schedule rule" | EventBridge |
| "exactly-once", "strict ordering" | SQS FIFO |
| "dead-letter queue" | SQS DLQ |

## Khi nào chọn A / B / C

- Chọn **SQS** khi: cần buffer công việc chờ xử lý, đảm bảo không mất message dù consumer tạm ngừng hoạt động.
- Chọn **SNS** khi: cần phát 1 sự kiện tới nhiều subscriber cùng lúc (email, SMS, Lambda, SQS).
- Chọn **EventBridge** khi: cần định tuyến sự kiện linh hoạt theo nội dung, tích hợp nhiều nguồn sự kiện AWS/SaaS, hoặc chạy theo lịch (cron).

| Tín hiệu trong đề | Dẫn tới |
|---|---|
| 🧠 "decouple producer and consumer", "process messages later", "worker pool polls queue" | SQS |
| 🧠 "notify multiple independent systems at once", "fanout to email/SMS/Lambda" | SNS |
| 🧠 "route events based on content/pattern", "integrate with 3rd-party SaaS", "scheduled rule (cron)" | EventBridge |
| ⚠️ "must not lose messages if a consumer is down" nhưng đề chỉ đưa SNS đơn lẻ (không kèm SQS) | Đáp án cần bổ sung SQS đứng sau SNS, không phải SNS một mình |
| ⚠️ "exactly-once processing", "strict ordering" | SQS FIFO — nhưng cân nhắc throughput thấp hơn Standard |

## Khi nào không nên chọn

- Không dùng SNS khi cần đảm bảo message được lưu giữ chờ xử lý sau — SNS không lưu trữ như queue.
- Không dùng EventBridge như một hàng đợi thay thế SQS — EventBridge định tuyến, không đóng vai trò buffer chờ xử lý.
- Không mặc định chọn FIFO nếu đề không yêu cầu thứ tự nghiêm ngặt — Standard Queue thường "MOST scalable/cost-effective" hơn.

### Why-not reasoning: vì sao đáp án "nghe hợp lý" vẫn sai

- **"SNS đủ để đảm bảo mọi hệ thống nhận được sự kiện"** nghe hợp lý vì SNS đúng là push tới nhiều subscriber, nhưng sai nếu 1 subscriber tạm thời offline/lỗi — SNS **không tự động lưu lại** message đó để gửi lại sau (subscriber bỏ lỡ hoàn toàn, trừ khi có DLQ riêng cho subscription). Đáp án đúng phải là SNS + SQS phía sau mỗi subscriber cần đảm bảo không mất message.
- **"FIFO luôn an toàn/tốt hơn nên cứ chọn FIFO"** nghe hợp lý vì "đảm bảo thứ tự" nghe như một tính năng chỉ có lợi, nhưng sai vì FIFO giới hạn throughput thấp hơn Standard đáng kể — nếu đề không yêu cầu thứ tự/exactly-once, "MOST cost-effective/scalable" thường trỏ về Standard Queue.
- **"EventBridge có thể thay SQS vì đều là dịch vụ messaging"** nghe hợp lý vì cả hai đều nằm trong nhóm "decoupling service", nhưng sai vì EventBridge không giữ lại message chờ xử lý — nếu consumer chưa sẵn sàng xử lý ngay, message không được lưu đệm như SQS.

## Trade-offs

| Lựa chọn | Đánh đổi |
|---|---|
| SQS Standard | Throughput cao, chi phí thấp nhưng không đảm bảo thứ tự tuyệt đối |
| SQS FIFO | Đảm bảo thứ tự/exactly-once nhưng giới hạn throughput hơn Standard |
| SNS fanout | Phát tán nhanh nhiều đích nhưng không tự lưu trữ, cần SQS phía sau để đảm bảo không mất message |
| EventBridge | Định tuyến linh hoạt, tích hợp rộng nhưng không phải giải pháp buffer/queue |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao người học hay nhầm | Hậu quả | Cách loại nhanh trong đề |
|---|---|---|---|
| ❌ Dùng SNS thay cho queue khi cần đảm bảo không mất message | SNS cũng "gửi được thông báo" nên nghe giống queue | Message bị mất hoàn toàn nếu subscriber offline tại thời điểm publish, không có cơ chế lưu trữ chờ xử lý lại | Thấy "must not lose message if consumer is down" → cần SQS (đứng sau SNS nếu cần cả fanout) |
| ❌ Dùng SQS cho bài toán cần broadcast tới nhiều hệ thống độc lập | SQS "cũng gửi được message tới nơi khác" | Mỗi message trong SQS chỉ được 1 consumer lấy và xử lý (point-to-point) — không tự động phát tới nhiều hệ thống cùng lúc | Thấy "notify multiple independent systems simultaneously" → chọn SNS (fanout) |
| ❌ Dùng EventBridge như một buffer/queue đơn giản | EventBridge cũng "truyền message" giữa các thành phần | EventBridge định tuyến ngay theo rule, không giữ lại message chờ xử lý — nếu target không sẵn sàng, hành vi khác hoàn toàn so với queue thực sự | Thấy "buffer work for later processing" → chọn SQS, không phải EventBridge |
| ❌ Chọn FIFO chỉ vì "nghe mạnh hơn/an toàn hơn" | Tên gọi "First-In-First-Out" nghe như phiên bản nâng cấp toàn diện của Standard | Giới hạn throughput thấp hơn đáng kể so với Standard, có thể không đáp ứng yêu cầu quy mô lớn của đề | Đề không nhắc "order", "exactly-once", "duplicate" → mặc định chọn Standard vì "MOST cost-effective/scalable" |

## Common traps

### ⚠️ Trap: SQS vs SNS vs EventBridge
Bẫy trọng tâm — SQS lưu trữ chờ xử lý (queue), SNS phát tán ngay (pub/sub), EventBridge định tuyến theo rule (event bus). Đề thi luôn mô tả rõ ngữ cảnh (cần buffer? cần fanout? cần định tuyến theo nội dung?) để phân biệt.

### ⚠️ Trap: FIFO luôn tốt hơn Standard
FIFO đánh đổi throughput lấy thứ tự đảm bảo — chỉ chọn khi đề yêu cầu rõ ràng về thứ tự hoặc exactly-once.

### ⚠️ Trap: nghĩ SNS lưu trữ message như queue / EventBridge thay thế SQS
Cả hai đều sai — SNS không giữ lại message nếu subscriber offline (trừ khi subscriber là SQS/Lambda có cơ chế riêng); EventBridge định tuyến sự kiện chứ không lưu trữ chờ xử lý.

## Mini scenarios

🧪 **Scenario 1 — Fanout đơn hàng mới tới nhiều service**

**Tình huống:** Khi có đơn hàng mới, cần cả 3 service (kho, thanh toán, email) đều nhận được sự kiện độc lập, không được mất sự kiện nếu 1 service tạm downtime.
**Đáp án đúng:** SNS topic fanout tới 3 SQS queue riêng cho mỗi service.
**Vì sao:** SNS phát tán sự kiện tới cả 3 service cùng lúc; mỗi SQS đảm bảo service tương ứng không mất message dù tạm downtime — kết hợp ưu điểm 2 dịch vụ.

🧪 **Scenario 2 — Định tuyến sự kiện từ nhiều nguồn SaaS theo nội dung**

**Tình huống:** Hệ thống nhận sự kiện từ nhiều nguồn khác nhau (S3 upload, CodePipeline deployment, SaaS bên thứ ba tích hợp qua partner event source), cần định tuyến từng loại sự kiện tới Lambda function xử lý riêng biệt dựa trên nội dung/loại sự kiện, và cũng cần một rule chạy theo lịch hàng ngày để dọn dẹp dữ liệu.
**Đáp án đúng:** Amazon EventBridge với các rule định tuyến riêng cho từng loại sự kiện, cộng với 1 scheduled rule cho tác vụ dọn dẹp.
**Vì sao:** Yêu cầu định tuyến theo nội dung từ nhiều nguồn khác nhau (bao gồm SaaS bên thứ ba) và chạy theo lịch là đặc điểm nhận diện chuẩn của EventBridge — SQS/SNS không có khả năng định tuyến rule-based linh hoạt như vậy.

🧪 **Scenario 3 — Anti-pattern: dùng SNS làm nơi lưu trữ công việc chờ xử lý**

**Tình huống:** Một đội phát triển thiết kế hệ thống xử lý ảnh: khi người dùng upload ảnh, hệ thống publish message qua SNS topic, và một worker Lambda sẽ "kéo" message từ SNS để xử lý dần khi rảnh, kỳ vọng SNS giữ lại message cho tới khi worker sẵn sàng.
**Đáp án đúng:** Publish message vào SQS queue (hoặc SNS → SQS nếu cần fanout tới nhiều worker), worker xử lý bằng cách poll từ SQS.
**Vì sao đây là anti-pattern cần tránh:** SNS không hỗ trợ mô hình "pull/poll khi rảnh" — nó push message ngay khi publish, không giữ lại cho consumer chưa sẵn sàng; thiết kế này sẽ làm mất message ngay khi worker Lambda không kịp xử lý tại thời điểm publish.

## Key takeaways

- SQS = queue lưu trữ, point-to-point; SNS = pub/sub fanout tức thời; EventBridge = event bus định tuyến theo rule.
- FIFO không mặc định tốt hơn Standard — đánh đổi throughput lấy thứ tự đảm bảo.
- Fanout pattern chuẩn: SNS → nhiều SQS, không phải SNS đứng một mình khi cần đảm bảo không mất message.

## Checklist tự ôn

- [ ] Tôi phân biệt được 3 mô hình bằng ví dụ cụ thể.
- [ ] Tôi biết khi nào cần FIFO thay vì Standard.
- [ ] Tôi giải thích được fanout pattern chuẩn (SNS → nhiều SQS).

## Xem tiếp / Liên kết liên quan

- [../02-core-services/11-sqs-sns-eventbridge.md](../02-core-services/11-sqs-sns-eventbridge.md)
- [../03-architecture-patterns/02-fault-tolerance.md](../03-architecture-patterns/02-fault-tolerance.md)
- [README.md](./README.md)
