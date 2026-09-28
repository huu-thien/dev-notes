# ELB and Auto Scaling

Elastic Load Balancing (ALB/NLB/GWLB) và Auto Scaling Group — cặp đôi tạo nên tính **High Availability** và **Scalability** cho kiến trúc EC2.

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

- Hiểu vì sao cần Load Balancing kết hợp Auto Scaling thay vì chỉ chạy 1 EC2 instance lớn.
- Phân biệt ALB, NLB, Gateway Load Balancer — chọn đúng loại theo tình huống.
- Hiểu cơ chế Auto Scaling Group và scaling policies ở mức đủ cho kỳ thi.

## Practical understanding

### Tại sao cần Load Balancing + Elasticity

Một EC2 instance đơn lẻ là **single point of failure** — nếu nó lỗi hoặc quá tải, toàn bộ ứng dụng gián đoạn. Kết hợp **Load Balancer** (phân phối traffic tới nhiều instance) với **Auto Scaling Group** (tự động thêm/bớt instance theo tải) giải quyết đồng thời hai vấn đề: **High Availability** (không phụ thuộc 1 instance/1 AZ duy nhất) và **Scalability** (đáp ứng tải tăng/giảm tự động — thể hiện tính **Elasticity**).

🧠 **Exam mindset:** đây là bài toán "scale out, không phải scale up" — thay vì nâng cấp 1 instance lớn hơn (scale up, vẫn là single point of failure), kiến trúc chuẩn SAA-C03 luôn ưu tiên **nhiều instance nhỏ hơn trải nhiều AZ** (scale out) đứng sau Load Balancer. Đề bài nhắc "elasticity", "tự động co giãn theo tải", "chịu được mất 1 AZ" gần như luôn trỏ tới cặp ALB/NLB + ASG multi-AZ.

⚠️ **Giới hạn tư duy nếu chọn sai:** nếu chỉ scale up (đổi sang instance type lớn hơn) mà không kết hợp Load Balancer + ASG, hệ thống vẫn là 1 điểm lỗi duy nhất — đạt được hiệu năng cao hơn tạm thời nhưng không đạt High Availability thật sự.

### Elastic Load Balancing — các loại

| Loại | Tầng hoạt động | Phù hợp |
|---|---|---|
| **ALB (Application Load Balancer)** | Layer 7 (HTTP/HTTPS) | Web application, routing theo path/host, microservices |
| **NLB (Network Load Balancer)** | Layer 4 (TCP/UDP) | Traffic cần hiệu năng cực cao, độ trễ thấp, IP tĩnh |
| **GWLB (Gateway Load Balancer)** | Layer 3 (network layer, transparent) | Triển khai appliance bảo mật bên thứ 3 (firewall, IDS/IPS) trước traffic vào VPC |

🧠 **ALB vs NLB vs GWLB — keyword nhận diện nhanh trong đề:**

| Keyword trong đề | Chọn |
|---|---|
| "HTTP/HTTPS", "path-based routing", "host-based routing", "microservices" | ALB |
| "TCP/UDP", "static IP", "extreme performance", "millions of requests per second", "preserve source IP" | NLB |
| "third-party firewall appliance", "IDS/IPS", "transparent network inspection" | GWLB |

⚠️ Nếu đề nhắc "ultra-low latency" hoặc "static IP" mà bạn thấy đáp án gợi ý ALB — đó thường là distractor, vì ALB có overhead xử lý layer 7 cao hơn NLB.

### Target Groups

Tập hợp các đích (EC2 instance, IP address, Lambda function) mà Load Balancer phân phối traffic tới. Load Balancer định tuyến request tới target group phù hợp (ALB có thể dùng routing rule theo path/host để chọn target group).

### Health Checks

Load Balancer định kỳ kiểm tra tình trạng từng target (thường qua HTTP request tới một endpoint cụ thể); target không phản hồi đúng (unhealthy) sẽ bị loại khỏi danh sách nhận traffic cho tới khi khoẻ lại — cơ chế nền tảng cho **Fault Tolerance** ở tầng ứng dụng.

✅ Health check nên trỏ tới endpoint phản ánh đúng "app còn hoạt động" (VD: `/health` kiểm tra kết nối DB), không chỉ kiểm tra server có phản hồi TCP hay không.
❌ Health check hời hợt (chỉ kiểm tra server "sống", không kiểm tra app thực sự hoạt động) dễ khiến traffic vẫn đổ vào instance bị lỗi logic nghiệp vụ dù server vẫn "chạy".

### Auto Scaling Group (ASG)

Nhóm EC2 instance được quản lý tự động theo cấu hình: launch template/configuration (định nghĩa AMI, instance type...), min/max/desired capacity, và scaling policy. ASG tự động thay thế instance unhealthy (dựa trên health check) và điều chỉnh số lượng instance theo tải thực tế.

### Scaling Policies (mức đủ thi)

| Loại | Cách hoạt động |
|---|---|
| **Target Tracking** | Đặt mục tiêu 1 metric (VD: CPU trung bình 50%), ASG tự điều chỉnh để giữ metric gần mục tiêu |
| **Step Scaling** | Điều chỉnh số lượng instance theo bậc, dựa trên mức độ vượt ngưỡng của alarm |
| **Scheduled Scaling** | Tăng/giảm capacity theo lịch định trước (VD: tăng trước giờ cao điểm dự đoán được) |

> Cần verify lại theo AWS official docs mới nhất — chi tiết cấu hình scaling policy có thể thay đổi.

🧠 **Decision logic chọn scaling policy:** "tải biến động khó đoán trước, muốn ASG tự điều chỉnh theo 1 metric mục tiêu" → Target Tracking (mặc định hợp lý nếu đề không có gợi ý khác); "biết chính xác pattern tải theo thời gian (giờ hành chính, sự kiện định kỳ)" → Scheduled Scaling; "cần phản ứng theo bậc dựa trên mức độ vượt ngưỡng cụ thể" → Step Scaling.

### Multi-AZ mindset trong ASG

ASG nên được cấu hình trải trên **nhiều Availability Zone** trong cùng Region — kết hợp với Load Balancer cũng phân phối traffic tới các AZ đó, đảm bảo mất 1 AZ không làm gián đoạn toàn bộ dịch vụ (liên hệ [../01-foundation/01-global-infrastructure.md](../01-foundation/01-global-infrastructure.md)).

### Ghi chú: caching layer bổ trợ (ElastiCache)

Ngoài scale-out ở tầng compute, một cách khác để giảm tải backend là thêm **caching layer** bằng **Amazon ElastiCache** (Redis/Memcached) — giảm số lượng request phải chạm tới database/application layer. ElastiCache thuộc nhóm Performance Efficiency, xem chi tiết hơn ở [`../03-architecture-patterns/04-performance-efficiency.md`](../03-architecture-patterns/04-performance-efficiency.md) — ở đây chỉ cần biết nó là một lựa chọn bổ trợ song song với Load Balancing/Auto Scaling, không thay thế cho nhau.

## Exam focus

### Must know for exam

- ALB dùng cho HTTP/HTTPS traffic cần routing thông minh (path-based, host-based); NLB dùng khi cần hiệu năng cực cao/TCP-UDP/IP tĩnh.
- ASG + Load Balancer trải nhiều AZ = pattern chuẩn cho **High Availability**.
- Health check quyết định target có nhận traffic hay không, và ASG có thay thế instance hay không.
- Target Tracking là loại scaling policy phổ biến nhất, dễ cấu hình nhất cho đa số tình huống.

### Important

- Gateway Load Balancer dùng riêng cho việc chèn network appliance bảo mật bên thứ 3 vào traffic path — ít gặp hơn ALB/NLB nhưng cần nhận diện đúng khi đề nhắc "third-party appliance", "transparent network gateway".
- Scheduled Scaling phù hợp khi biết trước pattern tải (VD: traffic tăng vào giờ hành chính).

### Nice to know

- Cấu hình chi tiết cooldown period, warm-up time của scaling policy — không cần nhớ số cụ thể cho kỳ thi.

## Use cases

- Web application cần phục vụ traffic biến động, tự động mở rộng vào giờ cao điểm.
- Kiến trúc microservices dùng ALB routing theo path (`/api` → service A, `/web` → service B).
- Traffic cần hiệu năng cực cao, độ trễ thấp (gaming, financial trading) → NLB.
- Chèn firewall/IDS-IPS bên thứ 3 trước khi traffic vào VPC → GWLB.

## Khi nào nên dùng / không nên dùng

| Nhu cầu | Nên dùng | Không nên dùng |
|---|---|---|
| HTTP routing theo path/host, microservices | ALB | NLB (không hỗ trợ routing layer 7 phong phú) |
| Cần IP tĩnh, hiệu năng TCP/UDP cực cao | NLB | ALB (thiên về layer 7, overhead cao hơn) |
| Chèn network security appliance bên thứ 3 | GWLB | ALB/NLB (không thiết kế cho mục đích này) |
| Ứng dụng chạy 1 instance cố định, không cần scale | Không cần ASG | ASG (thừa phức tạp nếu tải ổn định tuyệt đối và chấp nhận downtime khi lỗi) |

## Decision logic

| Câu hỏi cần trả lời | 🧠 Keyword nghĩ ngay tới | ⚠️ Keyword nên loại |
|---|---|---|
| Cần routing theo path/host cho web app | "HTTP/HTTPS", "microservices", "path-based" → ALB | "TCP/UDP thuần", "static IP" → loại ALB |
| Cần hiệu năng TCP/UDP cực cao | "millions of requests/second", "static IP", "ultra-low latency" → NLB | "cần routing rule theo URL path" → loại NLB |
| Cần chèn firewall/IDS-IPS bên thứ 3 | "third-party appliance", "transparent inspection" → GWLB | traffic HTTP thông thường không cần inspection → loại GWLB |
| Traffic biến động, cần tự điều chỉnh số instance | "elasticity", "scale based on demand" → ASG + Target Tracking | "tải cố định tuyệt đối, không đổi" → cân nhắc có thực sự cần ASG |
| Cần chịu được mất nguyên 1 AZ | "High Availability", "withstand AZ failure" → ASG + ELB multi-AZ | ASG chỉ trong 1 AZ → không đạt yêu cầu dù có scaling |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Chọn NLB khi đề đang nói về HTTP routing theo path/host | NLB "hiệu năng cao hơn" nên nghe như lựa chọn tốt hơn cho mọi trường hợp | NLB hoạt động ở layer 4, không hiểu HTTP path/host header — không thể thực hiện routing rule kiểu `/api` vs `/images` như ALB |
| ❌ Tưởng Auto Scaling Group tự thay được vai trò Load Balancer | ASG cũng "quản lý nhiều instance" nên nghe như đã bao gồm phân phối traffic | ASG chỉ quản lý vòng đời instance (tạo/xoá/thay thế theo health check) — nó không nhận request và phân phối traffic, vai trò đó luôn cần Load Balancer đứng trước |
| ❌ Cấu hình ASG chỉ trong 1 Availability Zone nhưng nghĩ đã đạt High Availability | Đã có Auto Scaling nên cảm giác hệ thống đã "tự phục hồi" | Nếu toàn bộ instance nằm trong 1 AZ, khi AZ đó gặp sự cố, ASG dù có scale cỡ nào cũng không có instance nào hoạt động — HA thật sự yêu cầu trải nhiều AZ |
| ❌ Scale up (đổi instance type lớn hơn) thay vì scale out khi đề bài cần elasticity | Scale up đơn giản, không cần thiết kế lại kiến trúc | Scale up vẫn giữ nguyên 1 instance duy nhất (single point of failure) và có giới hạn vật lý về kích thước instance; scale out (nhiều instance nhỏ hơn + ASG + Load Balancer) mới đáp ứng đúng yêu cầu elasticity và HA |

## Common traps

### ⚠️ Trap: dùng ALB khi cần hiệu năng TCP cực cao, độ trễ thấp nhất
ALB hoạt động ở layer 7, có overhead xử lý HTTP — khi đề nhấn mạnh "ultra-low latency", "static IP", "TCP/UDP" thì đáp án đúng thường là NLB.

### ⚠️ Trap: nghĩ Auto Scaling Group tự động phân phối traffic
ASG chỉ quản lý vòng đời instance (thêm/bớt/thay thế) — việc phân phối traffic là nhiệm vụ của Load Balancer. Hai dịch vụ này luôn đi cùng nhau nhưng vai trò khác nhau.

### ⚠️ Trap: chỉ đặt ASG trong 1 Availability Zone
Nếu ASG chỉ nằm trong 1 AZ, mất AZ đó vẫn làm gián đoạn dịch vụ dù có scaling — phải cấu hình ASG trải nhiều AZ để đạt High Availability thật sự.

## Mini scenarios

🧪 **Scenario 1 — Routing theo path + chịu mất 1 AZ**

**Tình huống:** Ứng dụng web có traffic biến động mạnh theo giờ trong ngày, cần định tuyến `/images` tới nhóm server xử lý ảnh riêng và `/api` tới nhóm server API riêng, đồng thời phải chịu được mất 1 AZ mà không downtime.
**Đáp án đúng:** Dùng Application Load Balancer với routing rule theo path, kết hợp Auto Scaling Group trải trên ít nhất 2 Availability Zone cho mỗi target group.
**Vì sao:** Yêu cầu routing theo path là đặc trưng layer 7 → ALB; yêu cầu chịu mất 1 AZ → ASG multi-AZ; traffic biến động → Auto Scaling tự điều chỉnh capacity.

🧪 **Scenario 2 — Ứng dụng gaming cần độ trễ cực thấp**

**Tình huống:** Một ứng dụng gaming real-time cần độ trễ thấp nhất có thể, xử lý hàng triệu kết nối TCP mỗi giây, và cần địa chỉ IP tĩnh để client kết nối trực tiếp.
**Đáp án đúng:** Dùng Network Load Balancer (NLB) đứng trước các EC2 instance xử lý game server, kết hợp Auto Scaling Group multi-AZ.
**Vì sao:** Yêu cầu "độ trễ cực thấp", "static IP", "TCP tốc độ cao" là các keyword kinh điển trỏ tới NLB (layer 4) — ALB sẽ thêm overhead xử lý HTTP không cần thiết và không cung cấp IP tĩnh.

🧪 **Scenario 3 — Anti-pattern: single-AZ Auto Scaling Group tưởng là High Availability**

**Tình huống:** Một đội kỹ sư cấu hình Auto Scaling Group với min=2, max=6 instance nhưng đặt toàn bộ subnet trong Auto Scaling Group ở cùng 1 Availability Zone, tin rằng vì có Auto Scaling nên hệ thống đã đạt High Availability.
**Đáp án đúng:** Cấu hình lại ASG để trải instance trên ít nhất 2 Availability Zone khác nhau, kết hợp Load Balancer phân phối traffic tới cả 2 AZ.
**Vì sao đây là anti-pattern cần tránh:** Auto Scaling chỉ giải quyết vấn đề **số lượng** instance theo tải, không giải quyết vấn đề **vị trí** instance. Nếu AZ duy nhất đó gặp sự cố (mất điện, network outage...), toàn bộ 2-6 instance đều nằm trong vùng bị ảnh hưởng — ASG không có instance nào để thay thế, hệ thống vẫn downtime hoàn toàn.

## Key takeaways

- Load Balancer phân phối traffic; Auto Scaling Group quản lý số lượng/tình trạng instance — hai vai trò bổ trợ nhau, không thay thế nhau.
- ALB cho layer 7/HTTP routing thông minh; NLB cho hiệu năng TCP/UDP cực cao; GWLB cho chèn network appliance bảo mật.
- Multi-AZ là điều kiện bắt buộc để đạt High Availability thật sự, không chỉ dựa vào scaling.
- Target Tracking là scaling policy dễ dùng nhất cho đa số tình huống thi.

## Checklist tự ôn

- [ ] Tôi chọn đúng loại Load Balancer (ALB/NLB/GWLB) cho từng tình huống cụ thể.
- [ ] Tôi giải thích được vai trò khác nhau giữa Load Balancer và Auto Scaling Group.
- [ ] Tôi biết vì sao ASG phải trải nhiều AZ để đạt High Availability.
- [ ] Tôi phân biệt được các loại scaling policy (Target Tracking, Step, Scheduled).

## Xem tiếp / Liên kết liên quan

- [01-ec2.md](./01-ec2.md)
- [../03-architecture-patterns/01-high-availability.md](../03-architecture-patterns/01-high-availability.md)
- [06-vpc.md](./06-vpc.md)
- [../01-foundation/01-global-infrastructure.md](../01-foundation/01-global-infrastructure.md)
