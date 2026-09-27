# Amazon Route 53

Managed DNS service của AWS — điểm khởi đầu định tuyến người dùng tới đúng tài nguyên, không phải nơi xử lý hay tăng tốc traffic thực tế.

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

- Hiểu Route 53 là DNS service, vai trò của nó khác với Load Balancer và CDN.
- Chọn đúng routing policy cho từng tình huống (HA, DR, global routing).
- Phân biệt Alias record và CNAME — điểm hay ra đề.

## Practical understanding

### Route 53 là gì

**Amazon Route 53** là managed DNS service, có chức năng chính: **domain registration**, **DNS resolution** (phân giải tên miền thành địa chỉ IP hoặc tên miền khác), và **health checking** để hỗ trợ routing thông minh. Route 53 hoạt động ở tầng DNS — nó chỉ trả lời "địa chỉ nào nên dùng", không tham gia xử lý hay chuyển tiếp traffic thực tế sau đó.

🧠 **Exam mindset:** Route 53 giải quyết bài toán "**client nên hỏi ai trước khi kết nối**" — nó không giải quyết bài toán "làm sao phân phối traffic công bằng giữa các server" (đó là Load Balancer) hay "làm sao lấy nội dung nhanh hơn từ vị trí gần người dùng" (đó là CloudFront). Nếu đề bài mô tả một hành động diễn ra **sau khi** client đã kết nối tới server, đó không còn là phạm vi của Route 53.

⚠️ **Giới hạn tư duy nếu chọn sai:** nếu bạn dùng Route 53 để thay cho Load Balancer, hệ thống sẽ thiếu cơ chế health-check tức thời + phân phối tải chủ động ở layer 7/4 — dẫn tới trải nghiệm failover chậm (phụ thuộc DNS TTL) và không cân bằng tải thực sự giữa các server đang sống.

### Public Hosted Zone vs Private Hosted Zone

- **Public Hosted Zone**: chứa record cho tên miền truy cập được từ Internet công cộng.
- **Private Hosted Zone**: chứa record chỉ phân giải được trong 1 hoặc nhiều VPC được liên kết — dùng cho DNS nội bộ, không lộ ra ngoài.

### Records (mức cần thiết)

| Loại record | Mục đích |
|---|---|
| A / AAAA | Trỏ tên miền tới địa chỉ IPv4/IPv6 |
| CNAME | Trỏ tên miền tới một tên miền khác (không dùng được cho zone apex/root domain) |
| Alias | Tính năng riêng của Route 53, trỏ tên miền tới AWS resource (ALB, CloudFront, S3 website endpoint...), dùng được cho zone apex |
| MX, TXT... | Phục vụ mục đích khác (email, xác minh domain) — ít liên quan SAA-C03 |

### Alias Record vs CNAME

Đây là điểm hay ra đề: **CNAME** không thể dùng cho zone apex/root domain (VD: `example.com`, chỉ dùng được cho subdomain như `www.example.com`), và luôn tốn thêm 1 bước phân giải DNS. **Alias record** là tính năng riêng của Route 53, dùng được cho cả zone apex, phân giải trực tiếp tới AWS resource (ALB, CloudFront, S3 static website endpoint, Route 53 hosted zone khác) mà **không tính phí truy vấn** khi trỏ tới resource AWS, và tự động cập nhật khi IP của resource đích thay đổi.

✅ Dùng Alias khi: cần trỏ **zone apex** (`example.com`) hoặc muốn tránh phí truy vấn khi trỏ tới AWS resource.
❌ Không dùng CNAME khi: đề nhắc "root domain", "apex domain", "naked domain" — CNAME luôn bị loại trong các trường hợp này.

### Routing Policies quan trọng cho SAA

| Policy | Cách hoạt động | Dùng khi |
|---|---|---|
| **Simple** | Trả về 1 giá trị (hoặc nhiều giá trị ngẫu nhiên không có logic) cho mỗi truy vấn | Không cần logic routing phức tạp |
| **Weighted** | Phân phối traffic theo tỷ lệ % được gán cho từng record | A/B testing, triển khai canary/dần dần |
| **Latency-based** | Trả về resource ở Region có độ trễ thấp nhất cho người dùng | Ứng dụng multi-Region, tối ưu trải nghiệm theo địa lý |
| **Failover** | Trỏ tới resource chính (primary); tự động chuyển sang resource phụ (secondary) khi health check primary fail | Disaster Recovery, kiến trúc active-passive |
| **Geolocation** | Định tuyến theo vị trí địa lý của người dùng (quốc gia/châu lục) | Yêu cầu compliance/nội dung theo khu vực |
| **Geoproximity** | Định tuyến dựa trên vị trí địa lý resource và người dùng, có thể "bias" để mở rộng/thu hẹp phạm vi định tuyến | Kiểm soát chi tiết vùng phục vụ (cần Route 53 Traffic Flow) |
| **Multi-value answer** | Trả về nhiều giá trị IP khoẻ mạnh (có kết hợp health check) cho 1 truy vấn | Cải thiện tính sẵn sàng đơn giản, không thay thế Load Balancer |

> Cần verify lại theo AWS official docs mới nhất — chi tiết hành vi Geoproximity/Traffic Flow có thể thay đổi.

### Routing policy — decision logic nhanh

🧠 Khi đọc đề, tìm **mục đích kinh doanh** đằng sau yêu cầu routing, không chỉ tìm tên policy:

| Mục đích trong đề | Chọn policy |
|---|---|
| "Chia traffic theo tỷ lệ %", "canary deployment", "A/B testing" | Weighted |
| "Người dùng luôn kết nối Region gần nhất về thời gian phản hồi" | Latency-based |
| "Chuyển sang backup Region khi primary lỗi", "DR active-passive" | Failover |
| "Định tuyến theo quốc gia/khu vực người dùng vì lý do compliance/nội dung" | Geolocation |
| "Cải thiện availability đơn giản, trả về nhiều IP khoẻ mạnh" | Multi-value answer |
| Không có yêu cầu logic gì đặc biệt | Simple |

⚠️ **Bẫy hay gặp:** Latency-based routing chọn Region có **độ trễ mạng thấp nhất**, không phải Region **gần nhất về khoảng cách địa lý** — hai Region gần nhau về địa lý vẫn có thể có độ trễ mạng khác nhau tuỳ tuyến kết nối.

### Health Checks — độ sâu cần cho exam

Route 53 có thể theo dõi tình trạng endpoint (qua HTTP/HTTPS/TCP request định kỳ) và chỉ trả về record khoẻ mạnh trong routing policy Failover/Multi-value answer. Đây là cơ chế **DNS-level failover** — khác hoàn toàn với việc Load Balancer chủ động phân phối traffic ở layer 7 theo thời gian thực.

🧠 **Exam reasoning:** "possible answer" nghe hợp lý là dùng Route 53 Failover cho mọi bài toán "chuyển traffic khi lỗi" — nhưng "best answer" phụ thuộc **phạm vi lỗi**: lỗi ở tầng instance/server trong 1 Region → dùng ALB health check (phản ứng nhanh, layer 7); lỗi ở phạm vi toàn bộ Region/endpoint → dùng Route 53 Failover (chấp nhận độ trễ do TTL, nhưng đúng phạm vi DR).

### Domain Registration (nhắc ngắn)

Route 53 cũng có thể đóng vai trò domain registrar (đăng ký tên miền mới) — với SAA-C03 chỉ cần biết tính năng này tồn tại, không cần đi sâu quy trình đăng ký.

## Exam focus

### Must know for exam

- Route 53 là DNS — nó chỉ trả lời "đi đâu", không tự xử lý/định tuyến traffic như Load Balancer, và không cache/tăng tốc nội dung như CloudFront.
- Failover routing policy dùng cho Disaster Recovery (active-passive) — đây là **DNS failover**, khác với load balancing chủ động ở layer 7.
- Alias record dùng được cho zone apex và không tính phí khi trỏ tới AWS resource; CNAME không dùng được cho zone apex.
- Latency-based routing dùng khi muốn người dùng luôn kết nối tới Region gần nhất về độ trễ.

### Important

- Weighted routing phù hợp cho canary deployment/A-B testing khi cần kiểm soát tỷ lệ traffic chính xác.
- Multi-value answer cải thiện availability đơn giản nhưng **không thay thế Load Balancer** — không có logic cân bằng tải thông minh như ALB/NLB.

### Nice to know

- Geoproximity với Traffic Flow là tính năng nâng cao, ít xuất hiện trực tiếp, chỉ cần biết khái niệm tồn tại.

## Use cases

- Kiến trúc Disaster Recovery active-passive: Failover routing trỏ chính tới Region A, phụ tới Region B.
- Ứng dụng global multi-Region: Latency-based routing để mỗi người dùng luôn vào Region gần nhất.
- Triển khai phiên bản mới dần dần: Weighted routing chia tỷ lệ traffic giữa phiên bản cũ/mới.
- Trỏ domain gốc (`example.com`) trực tiếp tới CloudFront hoặc ALB: dùng Alias record.

## Khi nào nên dùng / không nên dùng

| Nhu cầu | Nên dùng | Không nên dùng |
|---|---|---|
| Trỏ zone apex tới ALB/CloudFront/S3 website | Alias record | CNAME (không hỗ trợ zone apex) |
| DR active-passive giữa 2 Region | Failover routing policy + health check | Simple routing (không có logic chuyển đổi tự động) |
| Cân bằng tải layer 7 theo real-time traffic | ALB (xem [08-elb-and-auto-scaling.md](./08-elb-and-auto-scaling.md)) | Route 53 Multi-value answer (không có logic cân bằng tải thật) |
| Tăng tốc phân phối nội dung tĩnh/động toàn cầu | CloudFront (xem [12-cloudfront.md](./12-cloudfront.md)) | Route 53 (Route 53 không cache nội dung) |

## Decision logic

| Câu hỏi cần trả lời | 🧠 Keyword nghĩ ngay tới | ⚠️ Keyword nên loại Route 53 |
|---|---|---|
| Cần phân phối traffic theo tỷ lệ % giữa 2 phiên bản | "canary", "gradual rollout", "weighted" → Weighted routing | "cần cân bằng tải real-time theo tải thực tế server" → dùng ALB, không phải Route 53 |
| Cần người dùng luôn vào Region gần nhất về thời gian phản hồi | "multi-Region", "lowest latency" → Latency-based | "cần xử lý/tăng tốc nội dung" → đó là CloudFront |
| Cần chuyển hướng khi 1 Region/endpoint chết hoàn toàn | "DR", "active-passive", "failover ở tầng DNS" → Failover routing | "cần failover tức thời trong vài giây" → cân nhắc thêm ALB/multi-AZ vì DNS TTL có độ trễ |
| Cần trỏ domain gốc (không có subdomain) | "zone apex", "root domain", "naked domain" → Alias record | — (CNAME luôn bị loại ở trường hợp này) |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Nghĩ Route 53 là CDN, dùng nó để tăng tốc nội dung | Route 53 cũng "định tuyến người dùng tới AWS resource gần" nên nghe giống CDN | Route 53 chỉ trả lời địa chỉ IP/tên miền, không cache nội dung hay tối ưu đường truyền dữ liệu thực tế — đó là vai trò của CloudFront |
| ❌ Dùng Route 53 thay Load Balancer để cân bằng tải giữa các server trong 1 Region | Multi-value answer "trả về nhiều IP khoẻ mạnh" nghe giống load balancing | Route 53 không có logic phân phối tải thông minh theo tải thực tế/least-connections như ALB/NLB, và không phản ứng tức thời với sự cố ở tầng server |
| ❌ Nhầm DNS failover (Route 53) với request-level load balancing (ALB) | Cả hai đều "chuyển traffic sang chỗ khác khi có lỗi" | DNS failover phụ thuộc TTL + DNS caching ở client nên có độ trễ lan truyền, trong khi ALB loại bỏ target unhealthy gần như tức thời ở layer 7 cho mọi request mới |
| ❌ Quên zone apex constraint, chọn CNAME cho root domain | CNAME là loại record quen thuộc, dễ nghĩ tới đầu tiên | CNAME record không được phép tồn tại tại zone apex theo chuẩn DNS — chỉ Alias record (tính năng riêng của Route 53) mới dùng được ở vị trí này |

## Common traps

### ⚠️ Trap: Route 53 vs CloudFront
Route 53 là DNS (trả lời "địa chỉ nào"); CloudFront là CDN (cache và phân phối nội dung gần người dùng). Một hệ thống có thể dùng cả hai: Route 53 trỏ domain tới CloudFront distribution.

### ⚠️ Trap: Route 53 thay thế được Load Balancer
Route 53 Failover/Multi-value answer chỉ là DNS-level routing dựa trên health check định kỳ (có độ trễ do TTL, DNS caching ở client) — không phải cơ chế cân bằng tải chủ động, tức thời như ALB/NLB ở layer 7/4.

### ⚠️ Trap: Alias và CNAME dùng thay thế nhau được ở mọi trường hợp
CNAME không hoạt động ở zone apex — nếu đề yêu cầu trỏ `example.com` (không có subdomain) tới ALB/CloudFront, chỉ Alias record làm được.

### ⚠️ Trap: nghĩ DNS failover phản ứng tức thời như Load Balancer
DNS failover phụ thuộc TTL của record và caching ở resolver/client — có độ trễ nhất định trước khi toàn bộ client nhận diện thay đổi, khác với Load Balancer loại bỏ target unhealthy gần như ngay lập tức.

## Mini scenarios

🧪 **Scenario 1 — DR active-passive giữa 2 Region**

**Tình huống:** Ứng dụng chạy ở Region chính (active) và cần tự động chuyển hướng người dùng sang Region dự phòng (passive) nếu Region chính gặp sự cố, đề yêu cầu giải pháp ở tầng DNS.
**Đáp án đúng:** Cấu hình Route 53 Failover routing policy với health check trỏ tới endpoint ở Region chính, record thứ hai trỏ tới Region dự phòng.
**Vì sao:** Đây đúng là kịch bản DNS-level failover cho kiến trúc active-passive Disaster Recovery — không cần Load Balancer toàn cục vì yêu cầu ở tầng DNS, không phải cân bằng tải trong 1 Region.

🧪 **Scenario 2 — Zone apex trỏ tới CloudFront**

**Tình huống:** Công ty muốn domain gốc `example.com` (không có `www.`) trỏ trực tiếp tới một CloudFront distribution, không muốn thêm chi phí truy vấn DNS phát sinh cho mỗi request.
**Đáp án đúng:** Tạo Alias record tại zone apex trỏ tới CloudFront distribution.
**Vì sao:** CNAME không thể tồn tại tại zone apex theo chuẩn DNS; Alias record là tính năng riêng của Route 53 giải quyết đúng cả 2 yêu cầu — hoạt động tại zone apex và không tính phí truy vấn khi trỏ tới AWS resource.

🧪 **Scenario 3 — Anti-pattern: dùng Route 53 để cân bằng tải giữa các EC2 instance**

**Tình huống:** Một đội kỹ sư cấu hình Route 53 Multi-value answer trả về IP của 4 EC2 instance, kỳ vọng đây là giải pháp load balancing thay cho việc dựng Application Load Balancer.
**Đáp án đúng:** Nên dùng Application Load Balancer (xem [08-elb-and-auto-scaling.md](./08-elb-and-auto-scaling.md)) để phân phối traffic thực sự giữa các instance, kết hợp Auto Scaling Group.
**Vì sao đây là anti-pattern cần tránh:** Multi-value answer chỉ trả về danh sách IP khoẻ mạnh dựa trên health check định kỳ (không tức thời), và **client** (browser/DNS resolver) mới là bên quyết định chọn IP nào để kết nối — Route 53 không có logic phân phối tải công bằng theo tải thực tế hay loại bỏ tức thời instance vừa mới bị lỗi giữa các lần request, khác hẳn với ALB.

## Key takeaways

- Route 53 là DNS service: trả lời địa chỉ, không xử lý/cache traffic.
- Alias record vượt trội hơn CNAME ở zone apex và tích hợp trực tiếp AWS resource.
- Chọn routing policy theo mục đích: Weighted (canary), Latency-based (multi-Region gần nhất), Failover (DR active-passive), Multi-value answer (availability đơn giản).
- Route 53 không thay thế Load Balancer (không cân bằng tải thật) và không thay thế CloudFront (không cache nội dung).

## Checklist tự ôn

- [ ] Tôi giải thích được vì sao Route 53 không phải là Load Balancer.
- [ ] Tôi chọn đúng routing policy cho ít nhất 3 tình huống khác nhau.
- [ ] Tôi phân biệt được khi nào dùng Alias record thay vì CNAME.
- [ ] Tôi hiểu DNS failover khác gì với load balancing chủ động.

## Xem tiếp / Liên kết liên quan

- [06-vpc.md](./06-vpc.md)
- [08-elb-and-auto-scaling.md](./08-elb-and-auto-scaling.md)
- [12-cloudfront.md](./12-cloudfront.md)
- [../03-architecture-patterns/07-disaster-recovery.md](../03-architecture-patterns/07-disaster-recovery.md)
- [../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md](../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md)
