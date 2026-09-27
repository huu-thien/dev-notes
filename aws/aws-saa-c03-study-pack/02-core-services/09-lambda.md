# AWS Lambda

Event-driven, serverless compute — chạy code theo sự kiện mà không cần quản lý server, tự động scale theo số lượng sự kiện.

## Mục lục

- [Mục tiêu học](#mục-tiêu-học)
- [Practical understanding](#practical-understanding)
- [Decision logic](#decision-logic)
- [Exam focus](#exam-focus)
- [Use cases](#use-cases)
- [Khi nào nên dùng / không nên dùng](#khi-nào-nên-dùng--không-nên-dùng)
- [Anti-patterns / lựa chọn sai thường gặp](#anti-patterns--lựa-chọn-sai-thường-gặp)
- [Common traps](#common-traps)
- [Mini scenarios](#mini-scenarios)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Mục tiêu học

- Hiểu event-driven compute mindset và tính chất stateless của Lambda execution.
- Nắm giới hạn quan trọng: timeout, concurrency, cold start.
- Biết khi nào Lambda phù hợp hơn EC2/container, và ngược lại.

## Practical understanding

### Lambda là gì — Event-driven compute mindset

**AWS Lambda** chạy code (function) để phản ứng lại một **sự kiện** (event) — không có server nào cố định để bạn quản lý, AWS tự động cấp phát môi trường thực thi khi có sự kiện xảy ra và tự động scale số lượng instance chạy song song theo số lượng sự kiện đồng thời. Đây là compute phù hợp nhất cho kiến trúc **event-driven**.

🧠 **Exam mindset:** Lambda giải quyết bài toán "chạy một đơn vị xử lý ngắn, phản ứng lại sự kiện, không muốn quản lý hạ tầng". Nó **không** phải "câu trả lời mặc định cho mọi backend hiện đại" — nếu đề mô tả một hệ thống backend đầy đủ nhiều thành phần phối hợp phức tạp, Lambda chỉ là 1 mảnh ghép (compute layer cho từng xử lý cụ thể), không phải toàn bộ kiến trúc.

### Triggers phổ biến

Lambda có thể được kích hoạt bởi nhiều nguồn: S3 (object created/deleted), API Gateway (HTTP request), EventBridge (scheduled/event rule), SQS (message trong queue), DynamoDB Streams, SNS, và nhiều service khác.

### Stateless Execution Mindset

Mỗi lần Lambda function chạy, môi trường thực thi **không đảm bảo giữ lại trạng thái** từ lần chạy trước (trừ khi tận dụng cơ chế "warm start" tái sử dụng container, nhưng đây là chi tiết vận hành, không nên dựa vào để lưu trạng thái quan trọng). Dữ liệu cần lưu bền vững phải ghi ra service khác (S3, DynamoDB, RDS...) — không lưu trong bộ nhớ/local disk của function và kỳ vọng tồn tại lâu dài.

- ✅ Thiết kế đúng: mỗi lần gọi function tự lấy state cần thiết từ service bên ngoài (DynamoDB, S3...) và ghi kết quả ra đó.
- ❌ Thiết kế sai: giữ biến đếm/cache quan trọng trong bộ nhớ function và kỳ vọng nó tồn tại xuyên suốt nhiều lần gọi — warm start có thể giữ lại nhưng **không đảm bảo**, cold start sẽ mất hoàn toàn.

### Timeout, Concurrency, Cold Start (mức exam-relevant)

- **Timeout**: mỗi function có giới hạn thời gian chạy tối đa (có thể cấu hình, nhưng có trần tối đa) — Lambda **không phù hợp cho workload chạy dài** vượt quá giới hạn này.
- **Concurrency**: số lượng instance function có thể chạy đồng thời; có thể giới hạn (reserved concurrency) để tránh 1 function chiếm hết tài nguyên tài khoản, hoặc đặt provisioned concurrency để giữ sẵn môi trường "ấm" cho các ứng dụng nhạy cảm với độ trễ.
- **Cold Start**: độ trễ phát sinh khi Lambda phải khởi tạo môi trường thực thi mới (container mới) cho lần gọi đầu tiên hoặc khi tăng đột biến concurrency — đây là **trade-off**, không phải lúc nào cũng là vấn đề chặn triển khai; có thể giảm bằng provisioned concurrency nếu ứng dụng nhạy cảm với latency.

> Cần verify lại theo AWS official docs mới nhất — giới hạn timeout/concurrency cụ thể có thể thay đổi theo thời gian.

🧠 **Exam reasoning:** khi đề đưa "yêu cầu độ trễ cực thấp, ổn định" làm ràng buộc chính, câu hỏi thật sự đang test là bạn có biết **provisioned concurrency** giải quyết được cold start hay không — không phải "loại Lambda vì có cold start". Chỉ loại Lambda hoàn toàn khi ràng buộc là **thời gian chạy vượt giới hạn timeout** hoặc **cần giữ trạng thái/kết nối liên tục**, đó mới là giới hạn cấu trúc, không thể khắc phục bằng cấu hình.

### Layers (mức đúng scope)

**Lambda Layers** cho phép đóng gói thư viện/dependency dùng chung giữa nhiều function thành 1 package riêng, tránh phải nhúng lại cùng 1 thư viện vào từng function — giúp giảm kích thước deployment package của từng function và dễ quản lý version dependency chung.

### Integration với S3 / EventBridge / API Gateway / SQS

- **S3 → Lambda**: xử lý ngay khi có object mới (resize ảnh, quét virus, ETL).
- **EventBridge → Lambda**: chạy theo lịch (cron) hoặc phản ứng sự kiện từ AWS service khác.
- **API Gateway → Lambda**: xây dựng REST/HTTP API serverless (chi tiết ở [10-api-gateway.md](./10-api-gateway.md)).
- **SQS → Lambda**: xử lý message trong queue theo batch, Lambda tự động poll queue.

🧠 **Integration pattern mindset:** mỗi integration mang một đặc tính invocation khác nhau đáng lưu ý — S3/SNS là async (fire-and-forget, có retry), API Gateway là sync (caller chờ phản hồi trực tiếp, lỗi phải trả về ngay), SQS là poll-based với khả năng xử lý theo batch (nhiều message 1 lần gọi function). Đề thi hay kiểm tra việc chọn đúng integration theo yêu cầu về độ trễ phản hồi và khả năng chịu lỗi.

### Async vs Sync Invocation, Retry (mức đủ thi)

- **Synchronous invocation** (VD: từ API Gateway): caller chờ kết quả trả về trực tiếp, lỗi phải được xử lý ngay bởi caller.
- **Asynchronous invocation** (VD: từ S3 event): Lambda tự động retry một số lần nếu function lỗi, và có thể cấu hình **Dead-Letter Queue (DLQ)** hoặc **on-failure destination** để không mất sự kiện lỗi.

Vì Lambda có thể retry, hàm xử lý nên được thiết kế **idempotent** (gọi nhiều lần cùng input cho cùng kết quả, không gây side-effect trùng lặp) — retry không tự động đảm bảo idempotency, đây là trách nhiệm thiết kế của người viết function.

- ✅ Idempotent đúng cách: dùng ID giao dịch/message duy nhất để kiểm tra "đã xử lý chưa" trước khi thực hiện side-effect (VD: check trước khi ghi vào DynamoDB, dùng conditional write).
- ❌ Vi phạm idempotency: cộng dồn số dư tài khoản trực tiếp mỗi lần function chạy mà không kiểm tra đã xử lý giao dịch đó chưa — retry sẽ cộng nhiều lần cho cùng 1 giao dịch.

## Decision logic

| Câu hỏi cần trả lời | 🧠 Keyword nghĩ ngay tới Lambda | ⚠️ Keyword nên loại Lambda |
|---|---|---|
| Thời gian xử lý mỗi tác vụ? | "xử lý nhanh", "vài giây tới vài phút" | "chạy hàng giờ/không giới hạn", "batch job cực dài" |
| Tính chất trigger? | "phản ứng sự kiện", "khi có file mới/API request/message" | "tiến trình nền chạy liên tục chờ sẵn" |
| Yêu cầu trạng thái? | "mỗi request độc lập, không cần nhớ context giữa các lần gọi" | "cần giữ kết nối lâu dài" (VD: WebSocket server), "cần trạng thái cục bộ ổn định" |
| Kiểm soát hạ tầng? | "không muốn quản lý OS/patching" | "cần custom runtime/OS/kernel đặc thù" |
| Độ trễ yêu cầu? | "chấp nhận trade-off cold start, có thể dùng provisioned concurrency" | (hiếm khi là lý do loại hoàn toàn — chỉ cân nhắc thêm cấu hình) |

## Exam focus

### Must know for exam

- Lambda phù hợp cho workload ngắn hạn, event-driven, không cần quản lý server — không phù hợp cho tiến trình chạy liên tục/dài hạn hoặc cần giữ trạng thái cục bộ lâu dài.
- Cold start là trade-off có thể giảm bằng provisioned concurrency, không phải lý do loại bỏ Lambda hoàn toàn khi có yêu cầu độ trễ thấp.
- Retry cơ chế bất đồng bộ của Lambda yêu cầu function được thiết kế idempotent để tránh xử lý trùng lặp gây lỗi dữ liệu.
- Reserved concurrency giới hạn số instance đồng thời của 1 function để bảo vệ tài nguyên chung của tài khoản.

### Important

- Lambda Layers giúp chia sẻ dependency chung giữa nhiều function, giảm trùng lặp code.
- DLQ/on-failure destination giúp không mất sự kiện khi function liên tục lỗi ở invocation bất đồng bộ.

### Nice to know

- Chi tiết runtime cụ thể (Node.js, Python, Java...) và cách đóng gói deployment package — không trọng tâm cho SAA-C03.

## Use cases

- Resize ảnh tự động khi upload lên S3.
- Xử lý API backend serverless kết hợp API Gateway.
- Xử lý batch message từ SQS mà không cần duy trì server chờ sẵn.
- Chạy tác vụ định kỳ (dọn dẹp, tổng hợp báo cáo) qua EventBridge schedule.

## Khi nào nên dùng / không nên dùng

### Khi nào Lambda phù hợp hơn EC2/container

| Tiêu chí | Lambda phù hợp hơn khi |
|---|---|
| Thời gian chạy | Tác vụ ngắn hạn, trong giới hạn timeout |
| Tần suất/tải | Sự kiện không liên tục, tải biến động mạnh, muốn trả tiền theo request thực tế |
| Vận hành | Muốn không quản lý server/OS/patching |

### Khi nào EC2/container phù hợp hơn Lambda

| Tiêu chí | EC2/ECS/Fargate phù hợp hơn khi |
|---|---|
| Thời gian chạy | Tiến trình chạy liên tục, dài hạn, vượt giới hạn timeout của Lambda |
| Trạng thái | Ứng dụng cần giữ trạng thái cục bộ ổn định, kết nối lâu dài (VD: WebSocket server liên tục) |
| Kiểm soát runtime | Cần custom OS/runtime đặc thù không hỗ trợ trên Lambda |

Chi tiết so sánh đầy đủ EC2 vs ECS/Fargate vs Lambda xem ở [`../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md`](../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md).

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Dùng Lambda cho workload chạy dài/stateful (worker xử lý liên tục, giữ kết nối WebSocket) | "Serverless" nghe như luôn tốt hơn quản lý server | Lambda có giới hạn timeout cứng và không giữ trạng thái đáng tin cậy giữa các lần gọi — workload cần chạy liên tục/giữ session phải dùng EC2/ECS/Fargate |
| ❌ Nhầm Lambda là "câu trả lời full backend architecture" cho mọi hệ thống | Lambda xuất hiện ở rất nhiều pattern nên dễ nghĩ nó thay thế toàn bộ kiến trúc | Lambda chỉ là compute layer cho từng đơn vị xử lý sự kiện — hệ thống thực tế vẫn cần API Gateway, database, queue... phối hợp; đề thi mô tả kiến trúc tổng thể, không phải "chỉ cần Lambda" |
| ❌ Bỏ qua idempotency/retry behavior khi thiết kế function xử lý giao dịch | Tập trung vào logic nghiệp vụ chính, quên rằng Lambda có thể retry | Invocation bất đồng bộ có thể gọi lại function nhiều lần khi lỗi — nếu không thiết kế idempotent, dữ liệu bị xử lý trùng (VD: gửi email 2 lần, trừ tiền 2 lần) |
| ❌ Chọn Lambda chỉ vì nó "nghe serverless, hiện đại" mà không xét đặc tính workload | Xu hướng ưu tiên serverless trong thiết kế hiện đại | Nếu workload không mang tính event-driven/ngắn hạn, ép dùng Lambda tạo ra kiến trúc phức tạp không cần thiết (chia nhỏ tác vụ dài thành nhiều lần gọi, dùng Step Functions để điều phối) trong khi EC2/ECS đơn giản hơn nhiều cho trường hợp đó |

## Common traps

### ⚠️ Trap: dùng Lambda cho tiến trình chạy liên tục/dài hạn
Lambda có giới hạn timeout cứng — không phù hợp cho worker chạy vô hạn hoặc job xử lý cực dài; các trường hợp này nên dùng EC2, ECS/Fargate, hoặc chia nhỏ tác vụ.

### ⚠️ Trap: nghĩ cold start luôn là blocker phải tránh bằng mọi giá
Cold start là trade-off, không phải lỗi thiết kế — với ứng dụng nhạy cảm latency có thể dùng provisioned concurrency; với đa số workload, cold start chỉ ảnh hưởng lần gọi đầu/tăng đột biến, không đáng để loại bỏ Lambda hoàn toàn.

### ⚠️ Trap: giả định Lambda tự động đảm bảo idempotency khi retry
Lambda có thể gọi lại function nhiều lần khi lỗi ở invocation bất đồng bộ — nếu logic xử lý không idempotent (VD: cộng tiền 2 lần cho cùng 1 giao dịch), retry sẽ gây lỗi dữ liệu nghiêm trọng.

## Mini scenarios

🧪 **Scenario 1 — Xử lý ảnh event-driven, tải biến động**

**Tình huống:** Hệ thống cần xử lý ảnh ngay khi người dùng upload lên S3 (resize, tạo thumbnail), tải xử lý biến động mạnh theo giờ, muốn tối ưu chi phí và không cần duy trì server chờ sẵn.
**Đáp án đúng:** Cấu hình S3 event notification trigger Lambda function xử lý resize ảnh.
**Vì sao:** Đây là bài toán event-driven, tải biến động, tác vụ ngắn — đúng đặc trưng Lambda; dùng EC2 chờ sẵn sẽ lãng phí tài nguyên khi không có upload.

🧪 **Scenario 2 — API backend cần độ trễ ổn định cho traffic quan trọng**

**Tình huống:** Một API thanh toán được gọi bởi ứng dụng mobile, cần xử lý qua Lambda phía sau API Gateway, nhưng đội vận hành lo ngại cold start gây trễ phản hồi cho một số request quan trọng vào giờ cao điểm.
**Đáp án đúng:** Bật **Provisioned Concurrency** cho function xử lý API thanh toán, giữ sẵn môi trường "ấm" để tránh cold start ảnh hưởng tới trải nghiệm người dùng ở giờ cao điểm.
**Vì sao:** Đây đúng là trường hợp cold start ảnh hưởng thật (latency-sensitive), nhưng vẫn nên khắc phục bằng cấu hình (Provisioned Concurrency) thay vì loại bỏ Lambda — vẫn giữ được lợi ích serverless/auto-scale trong khi giải quyết đúng vấn đề cụ thể.

🧪 **Scenario 3 — Anti-pattern: dùng Lambda làm worker nền chạy liên tục**

**Tình huống:** Một đội kỹ sư triển khai một Lambda function được gọi lặp lại liên tục (self-invoke hoặc trigger theo lịch mỗi vài giây) để đóng vai trò "worker nền" xử lý hàng đợi liên tục suốt ngày, thay vì thiết kế theo model event-driven thông thường.
**Đáp án đúng:** Nên chuyển sang mô hình event-driven đúng nghĩa: SQS trigger Lambda chỉ khi có message thực sự (Lambda tự động poll queue), hoặc nếu cần tiến trình nền chạy liên tục thật sự, dùng ECS/Fargate/EC2.
**Vì sao đây là anti-pattern cần tránh:** Ép Lambda chạy như một tiến trình nền liên tục đi ngược lại mô hình tính phí theo request/thời gian chạy thực tế của Lambda — vừa tốn chi phí không cần thiết (gọi liên tục dù không có việc để xử lý), vừa phức tạp hơn hẳn so với việc dùng đúng trigger event-driven hoặc đúng compute alternative cho workload chạy liên tục.

## Key takeaways

- Lambda là compute event-driven, stateless, tự động scale theo sự kiện, tính phí theo request/thời gian chạy thực tế.
- Timeout giới hạn thời gian chạy — không phù hợp workload dài hạn/liên tục.
- Cold start là trade-off có thể giảm bằng provisioned concurrency, không phải lý do loại bỏ hoàn toàn.
- Retry bất đồng bộ yêu cầu thiết kế function idempotent.

## Checklist tự ôn

- [ ] Tôi giải thích được vì sao Lambda không phù hợp cho tiến trình chạy liên tục.
- [ ] Tôi hiểu cold start là trade-off và biết cách giảm thiểu (provisioned concurrency).
- [ ] Tôi giải thích được vì sao function xử lý bởi Lambda cần thiết kế idempotent.
- [ ] Tôi biết ít nhất 4 loại trigger phổ biến của Lambda.

## Xem tiếp / Liên kết liên quan

- [10-api-gateway.md](./10-api-gateway.md)
- [11-sqs-sns-eventbridge.md](./11-sqs-sns-eventbridge.md)
- [05-dynamodb.md](./05-dynamodb.md)
- [03-s3.md](./03-s3.md)
- [../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md](../04-comparison-guides/04-lambda-vs-ecs-vs-ec2.md)
