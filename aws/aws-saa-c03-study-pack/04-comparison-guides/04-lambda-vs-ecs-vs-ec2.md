# Lambda vs ECS/Fargate vs EC2

So sánh 3 lựa chọn compute để chọn đúng đáp án theo đặc điểm workload: event-driven, containerized, hay full control VM.

## Mục tiêu học

- Phân biệt event-driven compute (Lambda), containerized service (ECS/Fargate), và VM truyền thống (EC2).
- Biết khi nào Lambda không phù hợp và cần chuyển sang container/EC2.
- Tránh bẫy "serverless luôn là lựa chọn tốt nhất".

## Khi nào nên đọc file này

Sau khi đã đọc [`../02-core-services/01-ec2.md`](../02-core-services/01-ec2.md) và [`../02-core-services/09-lambda.md`](../02-core-services/09-lambda.md). ECS/Fargate chưa có lesson riêng trong study pack (nhắc ở mức đủ so sánh, sẽ mở rộng ở phần sau nếu cần).

## Bảng so sánh nhanh

| Tiêu chí | Lambda | ECS/Fargate | EC2 |
|---|---|---|---|
| Mô hình | Event-driven, function-as-a-service | Container orchestration (ECS) + serverless container compute (Fargate) | Virtual machine truyền thống |
| Quản lý OS/server | Không (AWS quản lý hoàn toàn) | Không với Fargate; ECS trên EC2 vẫn cần quản lý instance | Có (khách hàng quản lý OS, patching) |
| Thời gian chạy tối đa | Giới hạn (theo timeout cấu hình, tối đa vài phút) | Không giới hạn (chạy dài hạn liên tục) | Không giới hạn |
| Scaling | Tự động theo số lượng invocation song song | Tự động theo task/service scaling policy | Auto Scaling Group (cần cấu hình) |
| Kiểm soát môi trường | Thấp (runtime AWS quản lý) | Trung bình-cao (kiểm soát container image) | Cao nhất (toàn quyền OS) |
| Ops overhead | Thấp nhất | Trung bình | Cao nhất |

## So sánh theo tiêu chí ra đề thi

- **Workload event-driven, ngắn hạn, traffic không liên tục** → Lambda.
- **Ứng dụng đã đóng gói dạng container, cần chạy dài hạn nhưng không muốn quản lý server** → Fargate.
- **Cần kiểm soát container orchestration chi tiết, có sẵn EC2 capacity muốn tận dụng** → ECS trên EC2.
- **Cần toàn quyền kiểm soát OS, cài đặt phần mềm đặc thù, hoặc workload chạy liên tục dài hạn không phù hợp container** → EC2.

## Keyword nhận diện trong đề

| Keyword trong đề | Compute gợi ý |
|---|---|
| "event-driven", "run code without provisioning servers", "short-lived function" | Lambda |
| "containerized application", "microservices", "no server management for containers" | Fargate |
| "container orchestration with existing EC2 capacity" | ECS on EC2 |
| "full control over OS", "long-running process", "custom kernel/software" | EC2 |

## Khi nào chọn A / B / C

- Chọn **Lambda** khi: xử lý event ngắn hạn (vài giây tới vài phút), không cần giữ state giữa các lần gọi, tích hợp trực tiếp với S3/EventBridge/API Gateway/SQS.
- Chọn **ECS/Fargate** khi: ứng dụng đã container hoá, cần chạy liên tục dài hạn nhưng muốn giảm gánh nặng quản lý server (Fargate) hoặc tận dụng EC2 sẵn có (ECS on EC2).
- Chọn **EC2** khi: cần toàn quyền OS, phần mềm đặc thù không container hoá được, hoặc workload không phù hợp mô hình event-driven/container.

## Khi nào không nên chọn

- Không chọn Lambda cho workload chạy dài liên tục (vượt giới hạn timeout) hoặc cần giữ state cục bộ giữa các request.
- Không chọn EC2 chỉ vì "quen thuộc" nếu ứng dụng đã container hoá và không cần kiểm soát OS sâu — Fargate thường giảm ops overhead hơn.
- Không chọn "serverless" (Lambda) mặc định cho mọi bài toán compute — cold start, giới hạn thời gian chạy, và giới hạn tài nguyên là các ràng buộc thực tế cần cân nhắc.

## Trade-offs

| Lựa chọn | Đánh đổi |
|---|---|
| Lambda | Ops overhead thấp nhất, scale tự động nhưng giới hạn thời gian chạy và ít kiểm soát môi trường |
| Fargate | Không quản lý server nhưng vẫn phải quản lý container image, chi phí per-task có thể cao hơn EC2 tối ưu |
| ECS on EC2 | Kiểm soát tốt hơn Fargate, tận dụng EC2 sẵn có nhưng vẫn cần quản lý patching/scaling instance |
| EC2 | Toàn quyền kiểm soát nhưng ops overhead cao nhất (OS, scaling, patching) |

## Common traps

### Trap: nghĩ serverless (Lambda) luôn là lựa chọn tốt nhất
Lambda không phù hợp cho workload chạy dài, cần giữ state, hoặc cần tài nguyên/thời gian vượt giới hạn cấu hình — trong các trường hợp này ECS/Fargate hoặc EC2 mới là đáp án đúng.

### Trap: Lambda vs EC2/container options
Đề thi hay mô tả workload dài hạn/stateful nhưng thí sinh vẫn chọn Lambda vì nghĩ "serverless rẻ hơn" — cần đối chiếu đúng đặc điểm thời gian chạy và tính stateful trước khi chọn.

### Trap: nhầm ECS và Fargate là một
ECS là dịch vụ container orchestration; Fargate là launch type serverless cho ECS (và EKS) — có thể chạy ECS trên EC2 (tự quản lý instance) hoặc trên Fargate (không quản lý instance).

## Mini scenario

**Tình huống:** Ứng dụng xử lý video cần chạy liên tục 24/7, đã được đóng gói dạng container, đội vận hành muốn giảm tối đa công sức quản lý server.
**Đáp án đúng:** Amazon ECS với Fargate launch type.
**Vì sao:** Ứng dụng đã container hoá và cần chạy liên tục dài hạn — vượt quá giới hạn thời gian chạy của Lambda; Fargate loại bỏ nhu cầu quản lý EC2 instance so với ECS on EC2 hoặc EC2 trực tiếp.

## Key takeaways

- Lambda phù hợp event-driven, ngắn hạn, ops overhead thấp nhất nhưng có giới hạn thời gian chạy.
- Fargate/ECS phù hợp ứng dụng container hoá cần chạy dài hạn, cân bằng giữa kiểm soát và ops overhead.
- EC2 phù hợp khi cần toàn quyền OS hoặc workload không phù hợp container/event-driven.
- "Serverless" không phải luôn là lựa chọn tốt nhất — phải khớp với đặc điểm workload thực tế.

## Checklist tự ôn

- [ ] Tôi chọn đúng compute cho ít nhất 3 kịch bản khác nhau.
- [ ] Tôi phân biệt được ECS và Fargate.
- [ ] Tôi biết ít nhất 2 lý do Lambda không phù hợp cho một workload cụ thể.

## Xem tiếp / Liên kết liên quan

- [../02-core-services/01-ec2.md](../02-core-services/01-ec2.md)
- [../02-core-services/09-lambda.md](../02-core-services/09-lambda.md)
- [../03-architecture-patterns/03-scalability.md](../03-architecture-patterns/03-scalability.md)
- [README.md](./README.md)
