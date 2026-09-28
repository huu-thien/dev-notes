# Amazon API Gateway

Managed service để tạo, publish, và quản lý API — thường đứng trước Lambda hoặc backend service khác, xử lý các mối quan tâm chung của API (routing, throttling, auth) mà không cần tự viết lại trong từng backend.

## Mục lục

- [Mục tiêu học](#mục-tiêu-học)
- [Practical understanding](#practical-understanding)
- [Exam focus](#exam-focus)
- [Use cases](#use-cases)
- [Khi nào nên dùng / không nên dùng](#khi-nào-nên-dùng--không-nên-dùng)
- [Decision logic](#decision-logic)
- [Anti-patterns / lựa chọn sai thường gặp](#anti-patterns--lựa-chọn-sai-thường-gặp)
- [Common traps](#common-traps)
- [Mini scenarios](#mini-scenarios)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Mục tiêu học

- Hiểu vai trò của API Gateway trong kiến trúc serverless/microservices.
- Phân biệt REST API và HTTP API ở mức đủ cho SAA-C03.
- Biết khi nào chọn API Gateway thay vì ALB để expose API.

## Practical understanding

### API Gateway là gì

**Amazon API Gateway** là managed service đứng ở "cửa vào" (front door) cho API, nhận request từ client và định tuyến (integrate) tới backend thực sự xử lý logic — có thể là Lambda, một HTTP endpoint khác, hoặc AWS service khác. Bản thân API Gateway **không xử lý business logic** — nó xử lý các mối quan tâm chung: routing, authentication/authorization, throttling, caching, transformation request/response.

🧠 **Exam mindset:** API Gateway giải quyết bài toán "**quản lý vòng đời của API như một sản phẩm**" (versioning, rate limiting, bảo mật theo từng khách hàng, transform dữ liệu) — nó không giải quyết bài toán "cân bằng tải HTTP cơ bản" (đó là ALB) và không tự thực thi nghiệp vụ (đó là backend/Lambda).

⚠️ **Giới hạn tư duy nếu chọn sai:** nếu bạn nghĩ API Gateway "thay được" Lambda hoặc "thay được" ALB, bạn sẽ bỏ lỡ câu hỏi phân biệt vai trò — đề thi SAA-C03 thường test đúng ranh giới trách nhiệm giữa 3 dịch vụ này (API Gateway = quản lý API; Lambda = business logic; ALB = load balancing HTTP cơ bản).

### REST API vs HTTP API (mức đúng scope SAA)

| Tiêu chí | REST API | HTTP API |
|---|---|---|
| Tính năng | Đầy đủ nhất: request validation, API key, usage plan chi tiết, nhiều tuỳ chọn transform | Tập hợp tính năng gọn hơn, tập trung vào hiệu năng |
| Hiệu năng/chi phí | Chi phí cao hơn, độ trễ cao hơn một chút | Độ trễ thấp hơn, chi phí thấp hơn |
| Phù hợp | Cần kiểm soát chi tiết, tính năng doanh nghiệp đầy đủ | Đa số ứng dụng hiện đại cần proxy nhanh, đơn giản tới Lambda/HTTP backend |

> Cần verify lại theo AWS official docs mới nhất — danh sách tính năng chi tiết của từng loại API tiếp tục được AWS cập nhật.

### Integrations cơ bản

- **Lambda proxy integration**: chuyển toàn bộ request tới Lambda, Lambda tự xử lý và trả response theo định dạng chuẩn.
- **HTTP integration**: chuyển tiếp request tới một HTTP endpoint khác (VD: backend chạy trên EC2/ALB).
- **AWS service integration**: gọi trực tiếp tới AWS service khác (VD: đẩy message vào SQS) mà không cần Lambda trung gian.

### Throttling

API Gateway có thể giới hạn số lượng request/giây (rate limit) và burst limit ở cấp account, API, hoặc theo từng API key/usage plan — bảo vệ backend khỏi bị quá tải khi traffic tăng đột biến, đồng thời kiểm soát chi phí phát sinh từ backend (VD: số lần gọi Lambda).

✅ Dùng khi: đề nhắc "giới hạn số request mỗi giây cho từng khách hàng", "bảo vệ backend khỏi traffic đột biến", "usage plan theo API key".
❌ Đừng nhầm với authentication/authorization: throttling không kiểm tra "ai đang gọi có hợp lệ không", nó chỉ kiểm soát **số lượng** request.

### Authorization/Authentication (mức cần thiết)

API Gateway hỗ trợ nhiều cơ chế kiểm soát truy cập: IAM policy, Lambda authorizer (custom logic xác thực token), hoặc tích hợp Amazon Cognito User Pool — mục đích đảm bảo chỉ request hợp lệ mới được chuyển tới backend, áp dụng nguyên tắc **Least Privilege** ngay ở tầng API.

🧠 **Keyword nhận diện cơ chế auth:** "xác thực người dùng cuối qua mobile/web app, cần user pool có sẵn" → Cognito User Pool; "logic xác thực tuỳ chỉnh, token không theo chuẩn Cognito" → Lambda authorizer; "gọi API nội bộ giữa các AWS service, đã có IAM role sẵn" → IAM policy.

### Caching (nhắc ngắn)

REST API hỗ trợ bật cache ở cấp stage — lưu response cho một khoảng TTL nhất định, giảm số lần gọi thực sự tới backend cho các request lặp lại giống nhau, tương tự mindset caching đã học ở CloudFront nhưng áp dụng ở tầng API thay vì tầng nội dung tĩnh/động toàn cục.

⚠️ **Exam reasoning — best answer khác possible answer:** nếu đề hỏi "giảm tải cho backend Lambda khi có nhiều request lặp lại giống nhau ở tầng API", bật cache API Gateway là "possible answer" hợp lý; nhưng nếu đề đang nói về nội dung tĩnh/global users, CloudFront vẫn là "best answer" vì phục vụ từ edge location gần người dùng hơn là chỉ cache tại stage của 1 API endpoint.

## Exam focus

### Must know for exam

- API Gateway là "cửa vào" quản lý API, không tự chạy business logic — logic thực sự nằm ở backend (thường là Lambda).
- Throttling bảo vệ backend khỏi quá tải và kiểm soát chi phí — đề hỏi "bảo vệ backend khỏi traffic đột biến ở tầng API" luôn trỏ tới throttling.
- HTTP API phù hợp khi cần hiệu năng cao/chi phí thấp cho tích hợp đơn giản với Lambda; REST API phù hợp khi cần tính năng doanh nghiệp đầy đủ.

### Important

- Lambda authorizer cho phép custom logic xác thực (VD: kiểm tra JWT tuỳ chỉnh) khi Cognito không đủ linh hoạt.
- Caching ở API Gateway giảm tải backend cho response ít thay đổi, tương tự vai trò CloudFront nhưng ở tầng API.

### Nice to know

- Chi tiết cấu hình request/response mapping template (VTL) — không cần thuộc lòng cú pháp cho kỳ thi.

## Use cases

- Xây dựng REST/HTTP API serverless hoàn toàn với Lambda phía sau (không cần EC2/ALB).
- Expose API cho đối tác bên ngoài với kiểm soát rate limit/API key theo từng khách hàng.
- Bảo vệ backend nội bộ khỏi traffic đột biến bằng throttling.
- Chuyển đổi định dạng request/response giữa client và backend (transformation).

## Khi nào nên dùng / không nên dùng

### API Gateway vs ALB cho API exposure

| Tiêu chí | API Gateway phù hợp hơn | ALB phù hợp hơn |
|---|---|---|
| Backend | Lambda (serverless), cần tích hợp trực tiếp không qua EC2 | EC2/ECS/container chạy liên tục |
| Tính năng quản lý API | Cần throttling chi tiết theo API key, request validation, transformation | Chỉ cần routing HTTP cơ bản theo path/host |
| Chi phí ở tải rất lớn, ổn định | Có thể đắt hơn ở traffic cực lớn liên tục | Thường rẻ hơn cho traffic ổn định, liên tục lớn |
| WebSocket | Hỗ trợ qua WebSocket API riêng | Hỗ trợ kết nối lâu dài native tốt hơn cho một số kịch bản |

> Cần verify lại theo AWS official docs mới nhất — so sánh chi phí cụ thể phụ thuộc vào traffic pattern thực tế.

## Decision logic

| Câu hỏi cần trả lời | 🧠 Keyword nghĩ ngay tới | ⚠️ Keyword nên loại API Gateway |
|---|---|---|
| Backend là Lambda, cần tích hợp trực tiếp | "serverless API", "Lambda proxy integration" → API Gateway | "backend chạy liên tục trên EC2/container, chỉ cần routing cơ bản" → cân nhắc ALB |
| Cần giới hạn request theo từng khách hàng/API key | "usage plan", "API key", "rate limit per client" → API Gateway | — |
| Cần validate/transform request-response | "request validation", "payload transformation" → API Gateway | "chỉ cần forward traffic nguyên trạng" → ALB đủ dùng |
| Traffic HTTP rất lớn, ổn định, không cần tính năng quản lý API | — | "traffic cực lớn liên tục, không cần throttling/API key" → ALB thường tối ưu chi phí hơn |
| Cần WebSocket API | "real-time bidirectional", "WebSocket API" → API Gateway WebSocket API | — |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Dùng API Gateway khi chỉ cần load balancing HTTP đơn giản cho backend EC2/container | API Gateway cũng "định tuyến request" nên nghe như thay được ALB | API Gateway thiên về quản lý API (throttling, API key, transform) và tính phí theo số request — nếu chỉ cần routing HTTP cơ bản cho backend chạy liên tục, ALB thường đơn giản và tiết kiệm chi phí hơn |
| ❌ Dùng ALB khi đề bài nhấn mạnh throttling/API key/request validation | ALB cũng hỗ trợ routing theo path/host nên nghe như "đủ dùng" | ALB là Load Balancer layer 7 cơ bản, không có khái niệm usage plan/API key hay request/response transformation — các tính năng quản lý API chi tiết này chỉ có ở API Gateway |
| ❌ Nghĩ API Gateway thay được Lambda (tự chạy business logic) | API Gateway đứng "phía trước" nên dễ nhầm nó xử lý luôn logic | API Gateway chỉ định tuyến/quản lý request; toàn bộ business logic vẫn phải nằm ở backend (Lambda hoặc service khác) — API Gateway không có khả năng thực thi code nghiệp vụ |
| ❌ Chọn API Gateway chỉ vì "serverless" dù workload không cần tính năng quản lý API | Xu hướng "serverless-first" khiến người học mặc định thêm API Gateway cho mọi kiến trúc Lambda | Nếu backend Lambda chỉ được gọi nội bộ bởi service khác (không phải qua public HTTP API), thêm API Gateway chỉ tạo thêm chi phí/độ phức tạp không cần thiết — có thể invoke Lambda trực tiếp qua SDK/event source khác |

## Common traps

### ⚠️ Trap: nghĩ API Gateway thay thế được Lambda
API Gateway chỉ định tuyến và quản lý request — nó không chạy business logic. Đề hỏi "nơi xử lý logic nghiệp vụ" luôn là backend (Lambda hoặc service khác), không phải API Gateway.

### ⚠️ Trap: dùng ALB khi cần tính năng quản lý API chi tiết (API key, usage plan, request validation)
ALB chỉ là Load Balancer layer 7 cơ bản, không có các tính năng quản lý API như throttling theo API key hay request/response transformation — khi đề nhấn mạnh các tính năng này, đáp án đúng là API Gateway.

### ⚠️ Trap: nghĩ throttling là bảo mật, không phải hiệu năng
Throttling chủ yếu bảo vệ khỏi quá tải (Availability/Performance), không phải cơ chế authentication/authorization — hai khái niệm cần tách biệt khi đọc đề.

## Mini scenarios

🧪 **Scenario 1 — Serverless API với throttling theo khách hàng**

**Tình huống:** Startup xây dựng ứng dụng hoàn toàn serverless, cần expose REST API cho mobile app, muốn giới hạn số request mỗi giây cho từng khách hàng dùng API key riêng, và không muốn quản lý server nào.
**Đáp án đúng:** Dùng API Gateway (REST API) với usage plan/API key cho từng khách hàng, tích hợp Lambda proxy integration làm backend xử lý logic.
**Vì sao:** Yêu cầu throttling theo API key + không quản lý server là đặc trưng API Gateway + Lambda — ALB không hỗ trợ throttling theo API key, và EC2 sẽ yêu cầu quản lý server.

🧪 **Scenario 2 — Chuẩn hoá response cho nhiều backend legacy**

**Tình huống:** Một công ty có nhiều hệ thống backend cũ trả về format dữ liệu khác nhau (XML, JSON không đồng nhất), muốn expose ra ngoài dưới dạng 1 REST API duy nhất với format JSON chuẩn hoá, đồng thời yêu cầu xác thực bằng Cognito User Pool cho ứng dụng mobile.
**Đáp án đúng:** Dùng API Gateway REST API với request/response transformation (mapping template) để chuẩn hoá dữ liệu, tích hợp Cognito User Pool làm authorizer.
**Vì sao:** Yêu cầu transform dữ liệu + xác thực người dùng cuối là đúng tính năng cốt lõi của API Gateway REST API — ALB không có khả năng transform payload hay tích hợp Cognito User Pool trực tiếp.

🧪 **Scenario 3 — Anti-pattern: dùng API Gateway để load balancing cho cluster EC2 nội bộ**

**Tình huống:** Một đội kỹ sư dùng API Gateway để expose và cân bằng tải cho một cụm EC2 chạy liên tục 24/7, xử lý traffic HTTP nội bộ rất lớn nhưng không cần throttling, API key, hay transform dữ liệu nào.
**Đáp án đúng:** Nên dùng Application Load Balancer đứng trước Auto Scaling Group của EC2 (xem [08-elb-and-auto-scaling.md](./08-elb-and-auto-scaling.md)) thay vì API Gateway.
**Vì sao đây là anti-pattern cần tránh:** API Gateway tính phí theo số lượng request và tối ưu cho các tính năng quản lý API (throttling, API key, transform) — khi workload không cần bất kỳ tính năng nào trong số đó và chỉ cần routing HTTP cơ bản ở traffic lớn liên tục, ALB vừa đơn giản hơn vừa tiết kiệm chi phí hơn về lâu dài.

## Key takeaways

- API Gateway là cửa vào quản lý API (routing, throttling, auth, transform) — không chạy business logic.
- REST API đầy đủ tính năng hơn; HTTP API nhanh hơn, rẻ hơn, đơn giản hơn cho tích hợp Lambda phổ thông.
- Throttling bảo vệ backend khỏi traffic đột biến, không phải cơ chế xác thực.
- Chọn API Gateway khi cần tính năng quản lý API chi tiết và backend serverless; chọn ALB khi chỉ cần routing HTTP cơ bản cho backend chạy liên tục trên EC2/container.

## Checklist tự ôn

- [ ] Tôi giải thích được vai trò của API Gateway khác gì với vai trò của Lambda.
- [ ] Tôi chọn đúng giữa REST API và HTTP API cho một tình huống cụ thể.
- [ ] Tôi biết khi nào chọn API Gateway thay vì ALB để expose API.
- [ ] Tôi phân biệt được throttling (hiệu năng/bảo vệ) và authorization (bảo mật).

## Xem tiếp / Liên kết liên quan

- [09-lambda.md](./09-lambda.md)
- [08-elb-and-auto-scaling.md](./08-elb-and-auto-scaling.md)
- [11-sqs-sns-eventbridge.md](./11-sqs-sns-eventbridge.md)
- [../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md](../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md)
