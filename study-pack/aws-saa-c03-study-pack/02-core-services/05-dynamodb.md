# Amazon DynamoDB

Fully managed NoSQL key-value/document database — thiết kế cho quy mô lớn, độ trễ thấp ổn định, và scale ghi/đọc theo chiều ngang gần như không giới hạn.

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

- Hiểu NoSQL key-value/document mindset, khác gì với relational mindset ở [04-rds-aurora.md](./04-rds-aurora.md).
- Thiết kế đúng partition key/sort key để tránh hot partition.
- Phân biệt GSI vs LSI, provisioned vs on-demand.

## Practical understanding

### DynamoDB là gì — NoSQL key-value/document mindset

**Amazon DynamoDB** lưu dữ liệu dưới dạng **item** (tương đương 1 row) trong **table**, mỗi item là tập hợp attribute (tương đương document/key-value), **không có schema cố định bắt buộc** cho toàn bộ table (mỗi item có thể có attribute khác nhau, ngoại trừ primary key bắt buộc). Đây là khác biệt căn bản so với RDS/Aurora — không có khái niệm JOIN phức tạp giữa nhiều table như relational database.

### Access pattern mindset — thiết kế "ngược" so với relational

Đây là khác biệt tư duy quan trọng nhất khi chuyển từ relational sang DynamoDB:

| Relational (RDS/Aurora) | DynamoDB |
|---|---|
| Thiết kế schema trước theo entity/quan hệ, viết query linh hoạt sau (JOIN tùy ý) | Phải biết trước **access pattern** (câu query sẽ chạy) rồi mới thiết kế table/key cho phù hợp |
| Thêm index sau khi cần, khá linh hoạt | Thêm GSI được, nhưng LSI phải định nghĩa lúc tạo table — sửa sai access pattern ban đầu tốn kém hơn nhiều |
| Query "join, filter" ad-hoc tương đối tự do | Query hiệu quả nhất khi biết chính xác partition key (và sort key) cần tìm — `Scan` toàn bộ table là anti-pattern hiệu năng |

🧠 **Exam mindset:** khi đề mô tả DynamoDB, hãy tự hỏi "câu truy vấn chính của ứng dụng này là gì?" trước khi nghĩ tới key. Nếu access pattern không rõ ràng hoặc đòi hỏi truy vấn linh hoạt đa chiều (nhiều điều kiện lọc khác nhau tùy lúc), đó là dấu hiệu DynamoDB **có thể không phù hợp** — quay lại xem xét RDS/Aurora.



### Partition Key và Sort Key

- **Partition Key** (bắt buộc): quyết định item được lưu ở partition vật lý nào — DynamoDB dùng hash của partition key để phân phối dữ liệu. **Thiết kế partition key tốt** (giá trị phân tán đều) là yếu tố quan trọng nhất để tránh **hot partition** (một partition nhận quá nhiều traffic, gây throttle).
- **Sort Key** (tuỳ chọn): kết hợp với partition key tạo thành composite primary key, cho phép nhiều item cùng partition key nhưng khác sort key, và truy vấn theo khoảng giá trị sort key (range query).

🧠 **Vì sao partition key quan trọng đến vậy:** DynamoDB phân phối dữ liệu và capacity theo partition, không theo table. Nếu 80% traffic dồn vào 1 giá trị partition key (VD: `status = "active"` cho toàn bộ user), thì dù table có tổng capacity rất lớn, **partition đó vẫn bị throttle** vì mỗi partition có giới hạn throughput riêng — đây là lý do "tăng capacity" không giải quyết được hot partition, chỉ redesign key mới giải quyết được.

✅ Partition key tốt: `user_id`, `order_id`, `device_id` — giá trị duy nhất/đa dạng cao, phân tán đều.
❌ Partition key kém: `status`, `country`, `date` cố định — ít giá trị phân biệt, dễ dồn traffic vào 1 vài partition (hot partition).

### Provisioned vs On-Demand

| Chế độ | Đặc điểm |
|---|---|
| **Provisioned** | Định trước read/write capacity units, có thể kết hợp Auto Scaling để tự điều chỉnh theo tải, chi phí dự đoán được, phù hợp tải ổn định |
| **On-Demand** | Tự động co giãn theo traffic thực tế, không cần định trước capacity, chi phí theo request thực tế, phù hợp tải khó dự đoán hoặc mới triển khai |

### GSI vs LSI

| Tiêu chí | GSI (Global Secondary Index) | LSI (Local Secondary Index) |
|---|---|---|
| Partition key | Có thể khác partition key của table gốc | Bắt buộc giống partition key của table gốc |
| Sort key | Tuỳ chọn, độc lập | Bắt buộc khác sort key của table gốc |
| Thời điểm tạo | Tạo được bất kỳ lúc nào (kể cả sau khi table đã có dữ liệu) | Chỉ tạo được **tại thời điểm tạo table** |
| Capacity | Có capacity riêng (provisioned/on-demand riêng) | Dùng chung capacity với table gốc |
| Consistency khi đọc | Chỉ hỗ trợ eventually consistent read | Hỗ trợ cả eventually và strongly consistent read |

Đây là một trong những bẫy hay gặp nhất của DynamoDB — nhầm giữa khả năng linh hoạt của GSI và giới hạn của LSI.

### DynamoDB Streams

Ghi lại luồng thay đổi (create/update/delete) của item trong table theo thời gian thực, có thể trigger Lambda để xử lý ngay khi dữ liệu thay đổi — nền tảng cho kiến trúc **event-driven** xử lý dữ liệu (VD: đồng bộ sang hệ thống khác, tính toán aggregate).

### TTL (Time to Live)

Cho phép tự động xoá item hết hạn dựa trên 1 attribute chứa timestamp — dùng để dọn dữ liệu tạm thời (session, cache entry) mà không cần job dọn dẹp thủ công. Lưu ý: **TTL của DynamoDB khác với TTL của DNS record** (Route 53) — cùng thuật ngữ nhưng ngữ cảnh khác nhau (xem [../GLOSSARY.md](../GLOSSARY.md)).

### DAX (DynamoDB Accelerator) — mức exam-relevant

**DAX** là in-memory cache đặt trước DynamoDB, giảm độ trễ đọc từ mili-giây xuống micro-giây cho các truy vấn đọc lặp lại nhiều — tương tự vai trò ElastiCache nhưng tích hợp riêng cho DynamoDB, không cần thay đổi nhiều logic ứng dụng. Chi tiết sâu hơn về caching layer xem ở [`../03-architecture-patterns/04-performance-efficiency.md`](../03-architecture-patterns/04-performance-efficiency.md).

### Consistency Model (mức cần thiết)

- **Eventually consistent read** (mặc định): có thể trả về dữ liệu chưa cập nhật mới nhất trong khoảng thời gian rất ngắn sau khi ghi, nhưng có throughput cao hơn/chi phí thấp hơn.
- **Strongly consistent read**: luôn trả về dữ liệu mới nhất sau khi ghi thành công, nhưng tốn nhiều capacity hơn và có thể độ trễ cao hơn một chút.

### DynamoDB phù hợp với loại workload nào

✅ Phù hợp: session store, giỏ hàng, leaderboard, IoT time-series đơn giản (theo device ID), catalog sản phẩm truy vấn theo ID, ứng dụng cần latency single-digit millisecond ở scale hàng triệu request/giây.
❌ Kém phù hợp: hệ thống cần báo cáo ad-hoc đa chiều (BI/analytics phức tạp), dữ liệu có nhiều quan hệ nhiều-nhiều cần JOIN thường xuyên, ứng dụng cần transaction phức tạp xuyên nhiều entity không theo access pattern cố định.

## Decision logic

| Câu hỏi cần trả lời | Chỉ báo trong đề | Hướng quyết định |
|---|---|---|
| Access pattern có rõ ràng, chủ yếu truy vấn theo key không? | "truy vấn theo user ID/order ID", "known access pattern" | Có → DynamoDB. Không, cần query linh hoạt đa chiều → RDS/Aurora |
| Có cần JOIN/transaction đa bảng phức tạp không? | "báo cáo tổng hợp", "quan hệ nhiều bảng" | Có → RDS/Aurora (xem [04-rds-aurora.md](./04-rds-aurora.md)) |
| Traffic ghi/đọc có thể tăng đột biến, khó dự đoán? | "traffic không dự đoán trước", "scale tự động" | Có → DynamoDB On-Demand |
| Cần latency đọc cực thấp cho truy vấn lặp lại nhiều? | "microsecond latency", "cache tầng đọc" | Có → thêm DAX |
| Cần index phụ để query theo attribute khác partition key? | "truy vấn theo thuộc tính khác" | Cần tạo linh hoạt sau → GSI. Cần cùng partition key, biết trước từ đầu → LSI |

## Exam focus

### Must know for exam

- DynamoDB phù hợp khi cần **scale ghi/đọc cực lớn theo chiều ngang**, độ trễ thấp ổn định, không cần join phức tạp.
- Thiết kế **partition key** tốt (phân tán đều giá trị) là yếu tố quyết định hiệu năng — tránh dùng giá trị ít biến thiên (VD: ngày tháng cố định) làm partition key cho hệ thống lớn.
- GSI linh hoạt hơn LSI (khác partition key, tạo bất kỳ lúc nào); LSI bị giới hạn (chỉ tạo lúc tạo table, cùng partition key).
- On-Demand phù hợp tải khó dự đoán; Provisioned + Auto Scaling phù hợp tải ổn định, muốn kiểm soát chi phí.

### Important

- DynamoDB Streams + Lambda là pattern chuẩn cho event-driven processing khi dữ liệu thay đổi.
- DAX giảm độ trễ đọc đáng kể cho workload đọc lặp lại nhiều, không thay đổi nhiều logic ứng dụng.

### Nice to know

- Chi tiết công thức tính Read/Write Capacity Unit cụ thể — không cần nhớ số chính xác cho kỳ thi.

## Use cases

- Session store cho ứng dụng web quy mô lớn (kết hợp TTL để tự dọn session hết hạn).
- Giỏ hàng thương mại điện tử, cần đọc/ghi nhanh theo user ID (partition key).
- Bảng leaderboard game, cần truy vấn theo khoảng điểm số (sort key).
- Xử lý sự kiện thời gian thực khi dữ liệu thay đổi (DynamoDB Streams + Lambda).

## Khi nào nên dùng / không nên dùng

| Nhu cầu | Nên dùng DynamoDB | Không nên dùng DynamoDB |
|---|---|---|
| Truy cập theo key, ít join phức tạp, cần scale cực lớn | Có | — |
| Cần transaction phức tạp nhiều bảng, báo cáo dạng JOIN sâu | Không | Dùng RDS/Aurora (xem [04-rds-aurora.md](./04-rds-aurora.md)) |
| Tải khó dự đoán, cần serverless hoàn toàn | Có (On-Demand) | — |
| Ứng dụng cần schema chặt chẽ, ràng buộc toàn vẹn dữ liệu phức tạp | Không | RDS/Aurora phù hợp hơn |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Dùng DynamoDB chỉ vì nó "serverless"/hiện đại | "Serverless" nghe như luôn là lựa chọn tốt hơn, giảm ops effort | Nếu bài toán vẫn cần JOIN/transaction đa bảng phức tạp, DynamoDB buộc phải denormalize dữ liệu và tự xử lý logic quan hệ ở tầng ứng dụng — làm tăng độ phức tạp thay vì giảm |
| ❌ Model dữ liệu kiểu relational (nhiều bảng chuẩn hoá) rồi nhét sang DynamoDB | Quen tư duy relational nên thiết kế nhiều "table" nhỏ liên kết qua key | DynamoDB không tối ưu cho truy vấn xuyên nhiều "bảng" — cần denormalize (gộp dữ liệu liên quan vào cùng item/table) theo đúng access pattern, không phải copy nguyên cấu trúc relational sang |
| ❌ Chọn partition key theo thuộc tính "dễ nghĩ tới" (status, loại, ngày) | Các giá trị này thường xuất hiện đầu tiên trong đầu khi thiết kế | Ít giá trị phân biệt → hot partition khi traffic lớn — partition key nên là giá trị có tính duy nhất cao (user_id, order_id) |
| ❌ Dùng `Scan` (quét toàn bộ table) làm cách truy vấn chính | Scan dễ code, không cần suy nghĩ nhiều về key | Scan đọc toàn bộ item bất kể cần hay không — tốn capacity, chậm ở scale lớn; Query (theo key) mới là cách truy vấn hiệu quả DynamoDB được thiết kế cho |

## Common traps

### ⚠️ Trap: chọn DynamoDB chỉ vì nó "serverless"/"managed"
DynamoDB phù hợp với **access pattern theo key**, không phải mọi bài toán dữ liệu — nếu ứng dụng cần join phức tạp, transaction đa bảng, báo cáo quan hệ sâu, RDS/Aurora vẫn là lựa chọn đúng hơn dù DynamoDB "trông serverless và hiện đại hơn".

### ⚠️ Trap: thiết kế partition key kém (hot partition)
Chọn partition key có ít giá trị phân biệt (VD: chỉ vài loại "status") khiến traffic dồn vào 1-2 partition, gây throttle dù tổng capacity table đủ lớn — đề thi hay hỏi cách khắc phục là redesign partition key, không phải chỉ tăng capacity.

### ⚠️ Trap: GSI vs LSI
Nhầm LSI linh hoạt như GSI — LSI **bắt buộc tạo cùng lúc với table** và dùng chung partition key, không thể thêm sau; GSI tạo được bất kỳ lúc nào và partition key độc lập.

### ⚠️ Trap: nghĩ DynamoDB không cần thiết kế trước
Ngược với RDS (có thể thêm index sau dễ dàng), DynamoDB cần thiết kế access pattern và index (đặc biệt LSI) **trước khi tạo table** — thiết kế sai khó sửa sau này.

## Mini scenarios

🧪 **Scenario 1 — Leaderboard game theo region**

**Tình huống:** Ứng dụng game cần lưu điểm số hàng triệu người chơi, truy vấn chính là lấy điểm cao nhất theo từng khu vực (region) và cần khả năng mở rộng ghi rất lớn khi có sự kiện cao điểm.
**Đáp án đúng:** Dùng DynamoDB với partition key là region (hoặc kết hợp shard suffix nếu 1 region quá tải) và sort key là điểm số, dùng On-Demand hoặc Provisioned + Auto Scaling.
**Vì sao:** Access pattern rõ ràng theo key (region) + cần range query theo điểm số (sort key) + cần scale ghi lớn — đúng đặc trưng DynamoDB, RDS sẽ khó scale ghi ở quy mô này.

🧪 **Scenario 2 — Thêm index sau khi phát sinh access pattern mới**

**Tình huống:** Một bảng DynamoDB đã tồn tại lưu đơn hàng với partition key `order_id`. Sau 1 năm vận hành, đội sản phẩm cần thêm tính năng "tra cứu đơn hàng theo `customer_id`" mà không muốn downtime hay tạo lại table.
**Đáp án đúng:** Tạo Global Secondary Index (GSI) mới với partition key là `customer_id`.
**Vì sao:** GSI có thể tạo bất kỳ lúc nào sau khi table đã có dữ liệu, với partition key hoàn toàn độc lập với table gốc — đúng chính xác nhu cầu "thêm access pattern mới mà không phá vỡ thiết kế cũ". LSI sẽ không dùng được ở đây vì LSI chỉ tạo được lúc tạo table.

🧪 **Scenario 3 — Anti-pattern: denormalize sai cách gây hot partition**

**Tình huống:** Một hệ thống IoT lưu dữ liệu cảm biến với partition key là `sensor_type` (chỉ có 5 loại cảm biến cố định). Sau khi triển khai ở quy mô hàng chục nghìn thiết bị, hệ thống liên tục bị `ProvisionedThroughputExceededException` dù đã tăng capacity nhiều lần.
**Đáp án đúng:** Redesign partition key thành `device_id` (hoặc composite `sensor_type#device_id`) để phân tán traffic đều hơn, thay vì tiếp tục tăng capacity.
**Vì sao đây là anti-pattern cần tránh:** Chỉ 5 giá trị partition key cho hàng chục nghìn thiết bị nghĩa là mỗi partition phải gánh traffic của hàng nghìn thiết bị — tăng capacity table không giúp ích vì giới hạn throughput nằm ở **từng partition**, không phải tổng table.

## Key takeaways

- DynamoDB là NoSQL key-value/document, tối ưu cho truy cập theo key và scale ngang cực lớn.
- Partition key design quyết định hiệu năng — tránh hot partition.
- GSI linh hoạt (khác partition key, tạo sau); LSI giới hạn (cùng partition key, chỉ tạo lúc đầu).
- DynamoDB không thay thế mọi use case relational — vẫn cần RDS/Aurora khi cần quan hệ/transaction phức tạp.

## Checklist tự ôn

- [ ] Tôi giải thích được vai trò của partition key và vì sao thiết kế kém gây hot partition.
- [ ] Tôi phân biệt được GSI và LSI theo ít nhất 3 tiêu chí.
- [ ] Tôi biết khi nào chọn On-Demand và khi nào chọn Provisioned + Auto Scaling.
- [ ] Tôi biết khi nào DynamoDB không phải lựa chọn phù hợp.

## Xem tiếp / Liên kết liên quan

- [04-rds-aurora.md](./04-rds-aurora.md)
- `09-lambda.md` (DynamoDB Streams + Lambda)
- [../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md](../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md)
- [../03-architecture-patterns/04-performance-efficiency.md](../03-architecture-patterns/04-performance-efficiency.md)
