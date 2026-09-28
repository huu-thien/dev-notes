# Scalability

Pattern giúp hệ thống đáp ứng tải tăng bằng cách mở rộng đúng tầng, đúng cách — compute, database, messaging, và storage đều scale khác nhau.

## Mục lục

- [Mục tiêu học](#mục-tiêu-học)
- [Practical understanding](#practical-understanding)
- [Exam focus](#exam-focus)
- [Decision mindset / decision framework](#decision-mindset--decision-framework)
- [Service mapping](#service-mapping)
- [Trade-offs](#trade-offs)
- [Anti-patterns / lựa chọn sai thường gặp](#anti-patterns--lựa-chọn-sai-thường-gặp)
- [Common traps](#common-traps)
- [Mini scenarios](#mini-scenarios)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Mục tiêu học

- Phân biệt rõ **Scaling up (vertical)** và **Scaling out (horizontal)**.
- Hiểu **Elasticity** khác **Scalability** ở điểm nào.
- Biết cách scale từng tầng: compute, database, messaging, storage.

## Practical understanding

### Vertical scaling vs Horizontal scaling

- **Scaling up (vertical)**: tăng cấu hình của 1 máy (nhiều CPU/RAM hơn). Đơn giản nhưng có giới hạn vật lý (kích thước instance lớn nhất) và thường yêu cầu downtime khi đổi loại instance.
- **Scaling out (horizontal)**: thêm số lượng máy chạy song song. Gần như không giới hạn, không cần downtime nếu thiết kế đúng (stateless), là hướng chuẩn cho hệ thống cloud-native.

🧠 **Exam mindset:** khi đề nhắc "elasticity", "traffic không dự đoán được", "cần mở rộng mà không downtime" — đó gần như luôn là tín hiệu chọn **scaling out**, không phải scaling up. Scaling up chỉ là "possible answer" hợp lý khi workload không chia nhỏ được (VD: 1 tiến trình đơn luồng không tận dụng nhiều instance).

### Elasticity

**Elasticity** — đã định nghĩa ở [`GLOSSARY.md`](../GLOSSARY.md) — nhấn mạnh khả năng **tự động** co giãn tài nguyên theo nhu cầu thực tế, cả tăng lẫn giảm. Một hệ thống có thể scalable (mở rộng được) nhưng không elastic nếu việc mở rộng đòi hỏi can thiệp thủ công. Auto Scaling Group là ví dụ điển hình của elasticity — tự động thêm/bớt instance theo policy, không cần con người thao tác.

### Scale compute

- **EC2 + Auto Scaling Group**: scaling out theo policy (target tracking, step scaling, scheduled scaling) — xem [`08-elb-and-auto-scaling.md`](../02-core-services/08-elb-and-auto-scaling.md).
- **Lambda** (xem [`09-lambda.md`](../02-core-services/09-lambda.md)): scale tự động theo số lượng invocation song song, người dùng không cần cấu hình scaling policy — đây là dạng elasticity ở mức cao nhất cho compute.

### Scale database

- **Read scaling**: Read Replica (RDS/Aurora) hoặc DynamoDB Global Table/on-demand giúp tăng khả năng phục vụ đọc.
- **Write scaling**: khó hơn read scaling nhiều — RDS/Aurora vẫn giới hạn bởi 1 write instance chính (Aurora có thể scale write tốt hơn RDS nhờ kiến trúc storage phân tán, nhưng vẫn có giới hạn). **DynamoDB** scale write tốt hơn nhờ phân vùng dữ liệu theo partition key.
- **DynamoDB on-demand**: tự động scale throughput theo tải thực tế mà không cần cấu hình capacity trước — ví dụ điển hình của elasticity ở tầng database.

⚠️ **Bẫy hay gặp:** đề bài hỏi "giải pháp nào giúp scale khả năng ghi" mà đưa ra "Read Replica" như 1 lựa chọn — đây luôn là distractor. Read Replica **chỉ** phục vụ đọc bất đồng bộ, không san sẻ tải ghi cho instance chính.

### Scale messaging

**SQS** gần như không giới hạn throughput ở Standard Queue, tự nhiên hỗ trợ scale bằng cách thêm consumer song song đọc từ cùng 1 queue — không cần cấu hình scaling riêng cho bản thân queue.

### Scale storage

**S3** tự động scale theo dung lượng và request rate mà không cần người dùng cấu hình capacity — object storage scale gần như vô hạn theo mặc định.

### Decoupling hỗ trợ scaling độc lập từng tầng

**Decoupling** (SQS/SNS/EventBridge) cho phép từng tầng scale độc lập theo tải riêng của nó, thay vì toàn hệ thống phải scale đồng bộ theo tầng chậm nhất.

## Exam focus

### Must know for exam

- Scaling out (horizontal) là hướng ưu tiên trên cloud vì gần như không giới hạn và không cần downtime.
- Elasticity nhấn mạnh tính tự động — Auto Scaling Group, Lambda, DynamoDB on-demand là các ví dụ elastic.
- Scale đọc (Read Replica) khác hoàn toàn scale ghi — đây là bẫy thi rất phổ biến.
- DynamoDB scale ghi/đọc tốt hơn RDS/Aurora nhờ kiến trúc phân vùng theo partition key.

### Important

- Scaling up vẫn có chỗ dùng hợp lý (VD: một số workload không thể chia nhỏ ra nhiều instance, hoặc cần tăng nhanh tạm thời), nhưng không phải hướng scale chính cho kiến trúc chịu tải lớn dài hạn.
- Auto Scaling policy cần metric phù hợp (CPU, request count, custom metric) để scale đúng lúc, không scale trễ.

### Nice to know

- Chi tiết cấu hình target tracking policy cụ thể (con số threshold) tùy use case, không cần thuộc lòng công thức.

## Decision mindset / decision framework

Khi đề bài nói "cần đáp ứng tải tăng đột biến", "traffic không dự đoán được", hoặc "cần mở rộng mà không downtime":

1. Xác định tầng nào đang là bottleneck: compute, database (đọc hay ghi), messaging, hay storage.
2. Compute: ưu tiên scaling out qua Auto Scaling Group hoặc chuyển sang Lambda nếu phù hợp workload event-driven.
3. Database: nếu bottleneck là đọc → Read Replica/DAX; nếu bottleneck là ghi → cân nhắc DynamoDB hoặc Aurora thay vì cố scale up RDS "classic".
4. Nếu nhiều tầng phụ thuộc trực tiếp vào nhau, cân nhắc decoupling để mỗi tầng scale độc lập.

## Service mapping

| Tầng | Service scale-out chính | Vai trò hỗ trợ |
|---|---|---|
| Compute (biến động, kiểm soát được) | EC2 + Auto Scaling Group | ELB phân phối traffic tới instance mới |
| Compute (event-driven) | Lambda | Tự scale theo số invocation, không cần policy |
| Database — read scaling | RDS/Aurora Read Replica, DynamoDB (mặc định) | Không giúp write scaling |
| Database — write scaling | DynamoDB (partition-based), Aurora (tốt hơn RDS classic) | Sharding thủ công là phương án cuối nếu vẫn dùng relational |
| Messaging | SQS (thêm consumer song song) | Không cần cấu hình scaling riêng cho queue |
| Storage | S3 (tự động, gần như vô hạn) | Không cần provision capacity trước |

🧠 **Combination phổ biến trong đề:** "traffic không dự đoán được + cần ghi dữ liệu lớn + tự động co giãn" → DynamoDB on-demand + SQS + Lambda là bộ 3 kinh điển cho pipeline event-driven scale tự động toàn diện.

## Trade-offs

| Yếu tố | Đánh đổi |
|---|---|
| Scaling up | Đơn giản triển khai nhưng có giới hạn vật lý và thường cần downtime |
| Scaling out | Phức tạp hơn (cần stateless, cần load balancing) nhưng gần như không giới hạn |
| Elasticity tự động | Tiết kiệm chi phí vận hành nhưng cần policy/metric đúng để tránh scale sai thời điểm |
| Chuyển sang NoSQL để scale ghi tốt hơn | Đánh đổi mô hình quan hệ/transaction phức tạp lấy khả năng scale ngang tốt hơn |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Chỉ scale compute (thêm EC2 instance) khi bottleneck thực sự nằm ở database | Compute là tầng dễ scale nhất nên là phản xạ đầu tiên | Nếu database (đặc biệt write throughput) mới là nơi nghẽn, thêm bao nhiêu EC2 cũng không giúp ích — request vẫn chờ database xử lý, cần giải quyết đúng tầng bottleneck |
| ❌ Scale up (đổi instance to hơn) khi đề bài nhấn "elasticity", "tải biến động thất thường" | Scale up đơn giản, không cần thiết kế lại kiến trúc | Scale up không tự động theo tải và có giới hạn kích thước instance — không đáp ứng được yêu cầu "elasticity" (tự động co giãn theo nhu cầu thực tế) như scale out với Auto Scaling |
| ❌ Nhầm HA (chịu lỗi AZ) với Scalability (chịu tải tăng) | Cả hai đều dùng Multi-AZ + Auto Scaling Group nên dễ gộp chung | HA giải quyết "1 AZ chết thì sao", Scalability giải quyết "tải tăng thì sao" — 2 mục tiêu khác nhau dù dùng chung một số service, đề thi có thể hỏi riêng biệt từng mục tiêu |
| ❌ Nghĩ Read Replica giải quyết được bottleneck ghi | Read Replica cũng là "thêm 1 bản sao dữ liệu" nên nghe như giúp giảm tải chung | Read Replica chỉ phục vụ **đọc** bất đồng bộ — toàn bộ ghi vẫn phải qua instance chính, không giúp ích gì cho write throughput |

## Common traps

### ⚠️ Trap: nghĩ Read Replica giải quyết được bottleneck ghi
Read Replica chỉ tăng khả năng phục vụ đọc (bất đồng bộ). Nếu bottleneck là **write throughput**, Read Replica không giúp ích — cần xem xét Aurora, sharding, hoặc chuyển một phần dữ liệu sang DynamoDB.

### ⚠️ Trap: nghĩ Scaling up luôn là giải pháp tệ
Trong một số trường hợp (workload không chia nhỏ được, cần tăng nhanh tạm thời), scaling up vẫn hợp lý — nhưng không phải hướng scale chính cho hệ thống chịu tải lớn dài hạn trên cloud.

### ⚠️ Trap: nhầm Scalability với Elasticity
Một hệ thống có thể mở rộng được (scalable) nhưng cần thao tác thủ công, không tự động — khi đó nó không "elastic". Elasticity nhấn mạnh yếu tố tự động theo nhu cầu thực tế.

## Mini scenarios

🧪 **Scenario 1 — IoT write-heavy, tải không dự đoán được**

**Tình huống:** Ứng dụng IoT ghi hàng triệu bản ghi mỗi giây, tải tăng giảm thất thường không dự đoán được, cần hệ thống tự động co giãn mà không cần cấu hình capacity trước.
**Đáp án đúng:** DynamoDB với chế độ on-demand, kết hợp SQS/Lambda cho pipeline xử lý event-driven, tự động scale theo tải.
**Vì sao:** Write throughput lớn không dự đoán được là kịch bản kinh điển cho DynamoDB (partition-based, scale ghi tốt) thay vì RDS/Aurora; on-demand mode là ví dụ elasticity thực sự, không cần cấu hình capacity thủ công.

🧪 **Scenario 2 — Ứng dụng đọc nhiều, ghi ít, cần scale đọc**

**Tình huống:** Một ứng dụng tin tức có tỷ lệ đọc/ghi rất lệch (đọc gấp hàng trăm lần ghi), traffic đọc tăng mạnh vào giờ cao điểm, dữ liệu vẫn cần tính quan hệ (relational) do có nhiều bảng liên kết phức tạp.
**Đáp án đúng:** Giữ RDS/Aurora làm database chính, thêm Aurora Read Replica (hoặc RDS Read Replica) để san sẻ tải đọc, kết hợp Auto Scaling cho compute tier.
**Vì sao:** Đây đúng use case của read scaling — dữ liệu vẫn cần tính relational (loại DynamoDB), tải lệch hẳn về đọc nên Read Replica là giải pháp đúng tầng, không cần đổi hẳn sang NoSQL.

🧪 **Scenario 3 — Anti-pattern: chỉ scale EC2 khi bottleneck ở database**

**Tình huống:** Đội vận hành thấy ứng dụng chậm khi traffic tăng, phản xạ đầu tiên là tăng số lượng EC2 instance trong Auto Scaling Group, nhưng độ trễ vẫn không cải thiện.
**Đáp án đúng:** Cần kiểm tra CloudWatch metrics ở tầng database trước — nếu là bottleneck write throughput ở RDS, cần cân nhắc Aurora, sharding, hoặc tách một phần workload sang DynamoDB thay vì tiếp tục thêm EC2.
**Vì sao đây là anti-pattern cần tránh:** Thêm EC2 instance chỉ mở rộng khả năng xử lý request ở tầng compute — nếu request vẫn phải chờ database phản hồi (bottleneck thực sự), nhiều EC2 hơn chỉ tạo ra nhiều request "xếp hàng" chờ database hơn, không giải quyết được vấn đề gốc.

## Key takeaways

- Scaling out là hướng chính trên cloud; scaling up chỉ dùng khi phù hợp workload cụ thể.
- Elasticity = scaling tự động theo nhu cầu thực tế, không chỉ đơn thuần "có khả năng mở rộng".
- Scale đọc và scale ghi là hai bài toán khác nhau — Read Replica không giải quyết bottleneck ghi.
- Mỗi tầng (compute/database/messaging/storage) có cách scale riêng, không có 1 giải pháp chung cho tất cả.

## Checklist tự ôn

- [ ] Tôi phân biệt được scaling up và scaling out bằng ví dụ cụ thể.
- [ ] Tôi giải thích được elasticity khác scalability ở điểm nào.
- [ ] Tôi biết Read Replica không giải quyết được bottleneck ghi.
- [ ] Tôi biết vì sao DynamoDB thường scale ghi tốt hơn RDS/Aurora.

## Xem tiếp / Liên kết liên quan

- [04-performance-efficiency.md](./04-performance-efficiency.md)
- [../02-core-services/08-elb-and-auto-scaling.md](../02-core-services/08-elb-and-auto-scaling.md)
- [../02-core-services/05-dynamodb.md](../02-core-services/05-dynamodb.md)
- [../02-core-services/09-lambda.md](../02-core-services/09-lambda.md)
- [../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md](../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md)
