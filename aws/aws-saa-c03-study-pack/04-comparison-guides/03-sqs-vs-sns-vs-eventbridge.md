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

## Khi nào không nên chọn

- Không dùng SNS khi cần đảm bảo message được lưu giữ chờ xử lý sau — SNS không lưu trữ như queue.
- Không dùng EventBridge như một hàng đợi thay thế SQS — EventBridge định tuyến, không đóng vai trò buffer chờ xử lý.
- Không mặc định chọn FIFO nếu đề không yêu cầu thứ tự nghiêm ngặt — Standard Queue thường "MOST scalable/cost-effective" hơn.

## Trade-offs

| Lựa chọn | Đánh đổi |
|---|---|
| SQS Standard | Throughput cao, chi phí thấp nhưng không đảm bảo thứ tự tuyệt đối |
| SQS FIFO | Đảm bảo thứ tự/exactly-once nhưng giới hạn throughput hơn Standard |
| SNS fanout | Phát tán nhanh nhiều đích nhưng không tự lưu trữ, cần SQS phía sau để đảm bảo không mất message |
| EventBridge | Định tuyến linh hoạt, tích hợp rộng nhưng không phải giải pháp buffer/queue |

## Common traps

### Trap: SQS vs SNS vs EventBridge
Bẫy trọng tâm — SQS lưu trữ chờ xử lý (queue), SNS phát tán ngay (pub/sub), EventBridge định tuyến theo rule (event bus). Đề thi luôn mô tả rõ ngữ cảnh (cần buffer? cần fanout? cần định tuyến theo nội dung?) để phân biệt.

### Trap: FIFO luôn tốt hơn Standard
FIFO đánh đổi throughput lấy thứ tự đảm bảo — chỉ chọn khi đề yêu cầu rõ ràng về thứ tự hoặc exactly-once.

### Trap: nghĩ SNS lưu trữ message như queue / EventBridge thay thế SQS
Cả hai đều sai — SNS không giữ lại message nếu subscriber offline (trừ khi subscriber là SQS/Lambda có cơ chế riêng); EventBridge định tuyến sự kiện chứ không lưu trữ chờ xử lý.

## Mini scenario

**Tình huống:** Khi có đơn hàng mới, cần cả 3 service (kho, thanh toán, email) đều nhận được sự kiện độc lập, không được mất sự kiện nếu 1 service tạm downtime.
**Đáp án đúng:** SNS topic fanout tới 3 SQS queue riêng cho mỗi service.
**Vì sao:** SNS phát tán sự kiện tới cả 3 service cùng lúc; mỗi SQS đảm bảo service tương ứng không mất message dù tạm downtime — kết hợp ưu điểm 2 dịch vụ.

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
