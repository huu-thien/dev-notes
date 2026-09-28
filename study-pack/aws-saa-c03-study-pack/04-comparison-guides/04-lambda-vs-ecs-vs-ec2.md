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

🧠 **Bài toán cốt lõi mỗi lựa chọn giải quyết:** Lambda giải quyết "chạy code phản ứng theo sự kiện, ngắn hạn, không cần quản lý gì phía dưới". ECS/Fargate giải quyết "ứng dụng đã đóng gói dạng container, cần chạy ổn định/dài hạn, muốn giảm gánh nặng quản lý hạ tầng nhưng vẫn cần kiểm soát runtime nhiều hơn Lambda". EC2 giải quyết "cần toàn quyền OS/kernel, hoặc workload không phù hợp với 2 mô hình trên". Ranh giới quyết định thực sự nằm ở 3 trục: **thời gian chạy** (ngắn hạn vs dài hạn), **tính stateful** (stateless vs cần giữ state cục bộ), và **mức độ kiểm soát cần thiết** (không cần vs cần toàn quyền OS) — không nằm ở "cái nào mới/serverless hơn".

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

| Tín hiệu trong đề | Dẫn tới |
|---|---|
| 🧠 "triggered by an event", "run for a few seconds", "no server management at all" | Lambda |
| 🧠 "containerized microservices", "long-running service", "no EC2 to manage" | Fargate |
| 🧠 "container orchestration", "existing EC2 reserved capacity to utilize" | ECS on EC2 |
| ⚠️ "runs longer than 15 minutes", "requires persistent local state", "custom OS-level configuration" | Loại Lambda ngay, xét ECS/Fargate hoặc EC2 |
| ⚠️ "needs full control over the operating system/kernel" | Loại Lambda và Fargate, chọn EC2 (hoặc ECS on EC2 nếu cần orchestration) |

## Khi nào không nên chọn

- Không chọn Lambda cho workload chạy dài liên tục (vượt giới hạn timeout) hoặc cần giữ state cục bộ giữa các request.
- Không chọn EC2 chỉ vì "quen thuộc" nếu ứng dụng đã container hoá và không cần kiểm soát OS sâu — Fargate thường giảm ops overhead hơn.
- Không chọn "serverless" (Lambda) mặc định cho mọi bài toán compute — cold start, giới hạn thời gian chạy, và giới hạn tài nguyên là các ràng buộc thực tế cần cân nhắc.

### Why-not reasoning: vì sao đáp án "nghe hợp lý" vẫn sai

- **"Lambda serverless nên luôn chọn để giảm ops effort tối đa"** nghe hợp lý vì giảm ops effort đúng là mục tiêu chung, nhưng sai nếu workload chạy dài hạn (vượt timeout tối đa) hoặc cần giữ state — Lambda **không đáp ứng được functional requirement**, dù "possible" về mặt lý thuyết cho phần việc ngắn, nó không phải "best answer" cho toàn bộ workload dài hạn.
- **"EC2 kiểm soát nhiều hơn nên luôn là lựa chọn an toàn/tốt nhất"** nghe hợp lý vì "kiểm soát nhiều hơn" nghe như linh hoạt hơn, nhưng sai vì đề thi thường test khả năng **giảm ops effort khi không cần thiết phải kiểm soát sâu** — nếu ứng dụng đã container hoá và không cần custom OS, chọn EC2 là tăng ops burden không cần thiết so với Fargate.
- **"ECS/Fargate luôn đúng khi ứng dụng là container"** nghe hợp lý, nhưng nếu đề mô tả rõ workload thực chất ngắn hạn, event-driven (VD: xử lý ảnh khi upload S3), Lambda vẫn là best answer dù có thể đóng gói thành container — chọn ECS/Fargate trong trường hợp này là "possible" nhưng tốn kém/phức tạp hơn không cần thiết.

## Trade-offs

| Lựa chọn | Đánh đổi |
|---|---|
| Lambda | Ops overhead thấp nhất, scale tự động nhưng giới hạn thời gian chạy và ít kiểm soát môi trường |
| Fargate | Không quản lý server nhưng vẫn phải quản lý container image, chi phí per-task có thể cao hơn EC2 tối ưu |
| ECS on EC2 | Kiểm soát tốt hơn Fargate, tận dụng EC2 sẵn có nhưng vẫn cần quản lý patching/scaling instance |
| EC2 | Toàn quyền kiểm soát nhưng ops overhead cao nhất (OS, scaling, patching) |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao người học hay nhầm | Hậu quả | Cách loại nhanh trong đề |
|---|---|---|---|
| ❌ Chọn Lambda cho workload chạy dài/stateful "vì serverless nghe hiện đại" | "Serverless" tạo cảm giác luôn là lựa chọn tối ưu nhất | Vượt giới hạn timeout, mất state giữa các lần gọi, phải tự dựng cơ chế lưu state ngoài (tăng phức tạp thay vì giảm) | Thấy "long-running", "maintain session state locally", "process takes hours" → loại Lambda |
| ❌ Chọn EC2 khi managed/container option phù hợp hơn | Cảm giác "kiểm soát nhiều hơn = an toàn/đúng hơn" | Tăng ops overhead không cần thiết (patching, scaling thủ công) khi Fargate/ECS đã đáp ứng đủ yêu cầu | Thấy "already containerized", "minimize server management" mà không có yêu cầu custom OS → chọn Fargate thay vì EC2 |
| ❌ Chọn ECS/Fargate khi đề bài thực chất chỉ cần Lambda | Container "nghe kỹ thuật hơn/chuyên nghiệp hơn" cho các bài toán quen thuộc | Tăng độ phức tạp vận hành (viết Dockerfile, quản lý task definition) không cần thiết cho workload event-driven đơn giản | Thấy "triggered by S3 upload", "short execution", "no need to manage container lifecycle" → chọn Lambda |
| ❌ Đánh đồng "control nhiều hơn" với "best answer" | Tư duy "càng kiểm soát càng tốt" phổ biến ở người quen vận hành truyền thống | Chọn giải pháp phức tạp/tốn ops effort hơn mức cần thiết, không đúng tinh thần "MOST operationally efficient" của đề SAA-C03 | Luôn đối chiếu yêu cầu thực tế (có cần custom OS/kernel không) trước khi ưu tiên "kiểm soát nhiều" |

## Common traps

### ⚠️ Trap: nghĩ serverless (Lambda) luôn là lựa chọn tốt nhất
Lambda không phù hợp cho workload chạy dài, cần giữ state, hoặc cần tài nguyên/thời gian vượt giới hạn cấu hình — trong các trường hợp này ECS/Fargate hoặc EC2 mới là đáp án đúng.

### ⚠️ Trap: Lambda vs EC2/container options
Đề thi hay mô tả workload dài hạn/stateful nhưng thí sinh vẫn chọn Lambda vì nghĩ "serverless rẻ hơn" — cần đối chiếu đúng đặc điểm thời gian chạy và tính stateful trước khi chọn.

### ⚠️ Trap: nhầm ECS và Fargate là một
ECS là dịch vụ container orchestration; Fargate là launch type serverless cho ECS (và EKS) — có thể chạy ECS trên EC2 (tự quản lý instance) hoặc trên Fargate (không quản lý instance).

## Mini scenarios

🧪 **Scenario 1 — Ứng dụng video container hoá chạy liên tục**

**Tình huống:** Ứng dụng xử lý video cần chạy liên tục 24/7, đã được đóng gói dạng container, đội vận hành muốn giảm tối đa công sức quản lý server.
**Đáp án đúng:** Amazon ECS với Fargate launch type.
**Vì sao:** Ứng dụng đã container hoá và cần chạy liên tục dài hạn — vượt quá giới hạn thời gian chạy của Lambda; Fargate loại bỏ nhu cầu quản lý EC2 instance so với ECS on EC2 hoặc EC2 trực tiếp.

🧪 **Scenario 2 — Xử lý ảnh khi upload lên S3**

**Tình huống:** Mỗi khi người dùng upload ảnh lên S3, hệ thống cần tự động resize ảnh thành 3 kích thước khác nhau, thời gian xử lý mỗi ảnh khoảng 5-10 giây, tần suất upload không đều (có lúc rất nhiều, có lúc không có).
**Đáp án đúng:** AWS Lambda được trigger trực tiếp bởi sự kiện S3 upload.
**Vì sao:** Thời gian xử lý ngắn (trong giới hạn timeout), tần suất không đều phù hợp với scale tự động của Lambda, và tích hợp event trực tiếp với S3 là use case điển hình — dùng ECS/Fargate hay EC2 cho bài toán này sẽ tốn ops effort không cần thiết (phải tự quản lý scaling/idle capacity).

🧪 **Scenario 3 — Anti-pattern: chọn Lambda cho batch job xử lý dữ liệu nhiều giờ**

**Tình huống:** Một đội kỹ sư đề xuất dùng Lambda để chạy batch job phân tích dữ liệu lớn mất khoảng 2-3 giờ mỗi lần, với lý do "Lambda serverless, không cần quản lý server, tiết kiệm chi phí".
**Đáp án đúng:** ECS/Fargate (hoặc EC2 nếu cần kiểm soát sâu hơn) chạy task theo lịch hoặc theo trigger, phù hợp với thời gian xử lý dài.
**Vì sao đây là anti-pattern cần tránh:** Lambda có giới hạn thời gian chạy tối đa chỉ vài phút (tối đa 15 phút) — batch job 2-3 giờ vượt xa giới hạn này, về mặt kỹ thuật Lambda **không thể** chạy hết tác vụ chứ không chỉ là "kém tối ưu"; đây là ví dụ điển hình của việc chọn "serverless" chỉ vì tên gọi mà không đối chiếu ràng buộc kỹ thuật thực tế.

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
