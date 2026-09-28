# CloudFront vs Route 53 vs Global Accelerator

So sánh 3 dịch vụ "toàn cầu" dễ nhầm: CDN (CloudFront), DNS routing (Route 53), và network acceleration (Global Accelerator).

## Mục tiêu học

- Phân biệt rõ 3 vai trò: caching nội dung, quyết định định tuyến DNS, và tăng tốc đường truyền mạng.
- Nhận diện đúng use case khi đề thi mô tả ứng dụng toàn cầu.

## Khi nào nên đọc file này

Sau khi đã đọc [`../02-core-services/07-route53.md`](../02-core-services/07-route53.md) và [`../02-core-services/12-cloudfront.md`](../02-core-services/12-cloudfront.md).

## Bảng so sánh nhanh

| Tiêu chí | CloudFront | Route 53 | Global Accelerator |
|---|---|---|---|
| Vai trò chính | CDN — cache nội dung ở Edge Location | DNS — phân giải tên miền, quyết định định tuyến | Network acceleration — định tuyến traffic qua mạng backbone AWS tới điểm gần nhất |
| Cơ chế | Cache theo TTL, phục vụ từ Edge gần người dùng | Trả về IP theo routing policy khi client truy vấn DNS | Cung cấp Anycast IP tĩnh, định tuyến traffic vào mạng AWS sớm nhất có thể |
| Phù hợp cho | Nội dung tĩnh/động có thể cache (web, API response cacheable) | Điều hướng domain, failover, routing theo latency/geo | Ứng dụng cần IP tĩnh cố định, traffic không cacheable (TCP/UDP, gaming, VoIP) |
| Cache dữ liệu | Có | Không | Không |

## So sánh theo tiêu chí ra đề thi

- **Cần giảm latency cho nội dung tĩnh/asset phục vụ toàn cầu, có thể cache** → CloudFront.
- **Cần định tuyến traffic theo latency/geo/failover ở tầng DNS** → Route 53.
- **Cần IP tĩnh cố định cho ứng dụng, traffic không cacheable (VD: gaming, IoT, VoIP), cải thiện performance qua AWS backbone network** → Global Accelerator.
- **Ứng dụng cần cả cache tĩnh và định tuyến failover** → kết hợp CloudFront + Route 53.

🧠 **Bài toán cốt lõi mỗi service giải quyết:** CloudFront giải quyết "làm sao phục vụ nội dung nhanh hơn bằng cách cache gần người dùng" — nó chỉ tác động tới nội dung có thể tái sử dụng (cacheable). Route 53 giải quyết "client nên kết nối tới địa chỉ IP/endpoint nào" — nó là lớp quyết định trước khi kết nối được thiết lập, hoàn toàn không tham gia vào việc truyền dữ liệu sau đó. Global Accelerator giải quyết "làm sao gói tin đi từ người dùng tới AWS nhanh và ổn định hơn qua mạng backbone của AWS, kể cả với traffic không phải HTTP/HTTPS". Ba dịch vụ **không cạnh tranh lẫn nhau** — chúng thường phối hợp: Route 53 quyết định "đi đâu", CloudFront/Global Accelerator quyết định "đi nhanh thế nào khi đã biết đi đâu".

## Keyword nhận diện trong đề

| Keyword trong đề | Service gợi ý |
|---|---|
| "cache static content", "CDN", "edge location", "reduce latency for web assets" | CloudFront |
| "DNS", "domain routing", "failover between regions at DNS level", "latency-based routing" | Route 53 |
| "static IP address", "non-HTTP(S) traffic", "TCP/UDP acceleration", "gaming/VoIP" | Global Accelerator |

## Khi nào chọn A / B / C

- Chọn **CloudFront** khi: nội dung có thể cache (static asset, một phần API response), muốn giảm tải origin và giảm latency truy cập.
- Chọn **Route 53** khi: cần kiểm soát cách client được định tuyến tới endpoint nào (theo latency, geo, failover) ở tầng DNS.
- Chọn **Global Accelerator** khi: cần IP tĩnh, traffic không cacheable (không phải HTTP/HTTPS thuần), hoặc cần cải thiện performance mạng cho ứng dụng TCP/UDP toàn cầu.

| Tín hiệu trong đề | Dẫn tới |
|---|---|
| 🧠 "cache static assets at edge", "reduce origin load" | CloudFront |
| 🧠 "route traffic based on latency/geo", "DNS-level failover" | Route 53 |
| 🧠 "static IP for non-HTTP traffic", "UDP/TCP acceleration", "gaming/VoIP performance" | Global Accelerator |
| ⚠️ "the data changes per request and cannot be cached" | Loại CloudFront ngay dù đề nhắc "toàn cầu"/"latency" |
| ⚠️ "need to route DNS query itself" (không phải tối ưu đường truyền gói tin) | Route 53, không phải Global Accelerator |

## Khi nào không nên chọn

- Không dùng CloudFront cho traffic không cacheable hoàn toàn động (mỗi request khác nhau, không thể tái sử dụng cache).
- Không dùng Route 53 để tăng tốc đường truyền mạng — Route 53 chỉ quyết định client kết nối tới IP nào, không tối ưu đường đi của gói tin.
- Không dùng Global Accelerator nếu chỉ cần cache nội dung tĩnh — đây không phải vai trò của nó, CloudFront phù hợp hơn và rẻ hơn cho mục đích này.

### Why-not reasoning: vì sao đáp án "nghe hợp lý" vẫn sai

- **"CloudFront giảm latency toàn cầu nên luôn dùng cho ứng dụng global"** nghe hợp lý vì CloudFront đúng là công cụ giảm latency phổ biến nhất, nhưng sai nếu nội dung hoàn toàn động/không cacheable (VD: kết quả tính toán riêng theo từng request) — CloudFront sẽ gần như luôn forward về origin, không mang lại lợi ích thực sự, và không giải quyết được bottleneck ở origin/database.
- **"Route 53 failover đủ nhanh để dùng như load balancer chính"** nghe hợp lý vì "failover" nghe giống cơ chế chuyển traffic tự động của load balancer, nhưng sai vì DNS failover phụ thuộc **TTL caching phía client/resolver** — không tức thời như ALB kiểm tra health ở tầng application và loại bỏ target lỗi ngay lập tức.
- **"Global Accelerator và CloudFront có thể thay thế nhau vì đều 'tăng tốc toàn cầu'"** nghe hợp lý vì cả hai đều nhắc tới "cải thiện hiệu năng toàn cầu", nhưng sai vì CloudFront cache nội dung (giảm round-trip tới origin), còn Global Accelerator tối ưu đường truyền mạng (không cache gì cả) — chọn sai loại cho đúng vấn đề (cacheable content vs non-HTTP traffic) dẫn tới giải pháp không giải quyết đúng bottleneck.

## Trade-offs

| Lựa chọn | Đánh đổi |
|---|---|
| CloudFront | Giảm latency/tải origin tốt cho nội dung cacheable, nhưng không giúp gì cho traffic hoàn toàn động/không cacheable |
| Route 53 | Linh hoạt định tuyến DNS nhưng phụ thuộc TTL/caching của DNS resolver phía client (failover không tức thời) |
| Global Accelerator | Cải thiện performance mạng và cung cấp IP tĩnh nhưng chi phí thêm và không thay thế được caching layer |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao người học hay nhầm | Hậu quả | Cách loại nhanh trong đề |
|---|---|---|---|
| ❌ Dùng Route 53 như một CDN | Route 53 cũng "toàn cầu" và liên quan tới hiệu năng truy cập | Route 53 không cache bất kỳ nội dung nào — không giảm tải origin, không cải thiện tốc độ tải nội dung tĩnh | Thấy "cache content", "reduce load on origin server" → chọn CloudFront, không phải Route 53 |
| ❌ Dùng CloudFront như một engine định tuyến DNS/failover chính | CloudFront cũng "toàn cầu" và có key liên quan routing qua nhiều origin | CloudFront chọn origin theo cache behavior/path pattern đã cấu hình sẵn, không phải cơ chế định tuyến DNS động theo latency/geo/health check như Route 53 | Thấy "DNS-based routing", "geolocation routing policy" → chọn Route 53 |
| ❌ Dùng Global Accelerator như một lớp cache | "Accelerator" nghe như "giúp truy cập nhanh hơn" tương tự cache | Global Accelerator không lưu trữ hay cache bất kỳ dữ liệu nào — nó chỉ tối ưu đường đi mạng, không giảm được số lần phải gọi tới origin/database | Thấy "cache", "TTL", "reduce number of requests to origin" → chọn CloudFront |
| ❌ Dùng CloudFront để giải quyết bottleneck ở origin/database không cacheable | CloudFront "tăng tốc" nên nghe như giải pháp chung cho mọi vấn đề chậm | Dữ liệu động không cacheable khiến CloudFront gần như luôn forward về origin — vấn đề gốc (database/backend chậm) không được giải quyết | Thấy "each request returns different/personalized data" → cần tối ưu backend/database, không phải thêm CloudFront |

## Common traps

### ⚠️ Trap: Route 53 vs CloudFront
Đây là bẫy trọng tâm — Route 53 không phải CDN (không cache nội dung), CloudFront không thay thế được DNS routing logic. Route 53 quyết định "đi đâu", CloudFront quyết định "phục vụ nội dung nhanh thế nào".

### ⚠️ Trap: nghĩ CloudFront chỉ dành cho static website
CloudFront cũng tăng tốc một phần nội dung động qua origin ALB/custom origin (dù hiệu quả cache thấp hơn nội dung tĩnh) — không chỉ giới hạn ở static website hosting.

### ⚠️ Trap: nghĩ Global Accelerator là một lớp cache
Global Accelerator không cache dữ liệu — nó tối ưu đường đi mạng (routing qua AWS backbone) và cung cấp Anycast IP tĩnh, khác hoàn toàn vai trò caching của CloudFront.

### ⚠️ Trap: DNS failover giống load balancing layer 7
Route 53 failover routing chỉ đổi bản ghi DNS trả về (phụ thuộc TTL, không tức thời và không kiểm tra tầng ứng dụng sâu như ALB) — không giống cơ chế load balancing chủ động ở layer 7 của ALB.

## Mini scenarios

🧪 **Scenario 1 — Game online UDP cần IP tĩnh toàn cầu**

**Tình huống:** Ứng dụng game trực tuyến dùng giao thức UDP, cần độ trễ thấp toàn cầu và 1 địa chỉ IP cố định để client kết nối, không có nội dung tĩnh cần cache.
**Đáp án đúng:** AWS Global Accelerator.
**Vì sao:** Traffic UDP không phải HTTP/HTTPS nên CloudFront không áp dụng được (CloudFront chỉ phục vụ HTTP/HTTPS); yêu cầu IP tĩnh và tối ưu đường truyền mạng là đặc điểm nhận diện chuẩn của Global Accelerator, không phải Route 53 (chỉ định tuyến DNS, không tối ưu đường truyền).

🧪 **Scenario 2 — Website toàn cầu cần cache tĩnh + failover đa Region**

**Tình huống:** Website thương mại điện tử phục vụ khách hàng toàn cầu, có nhiều asset tĩnh (ảnh sản phẩm, CSS/JS) cần tải nhanh, đồng thời cần tự động chuyển traffic sang Region dự phòng nếu Region chính gặp sự cố.
**Đáp án đúng:** Kết hợp CloudFront (cache asset tĩnh ở Edge) + Route 53 failover routing policy (chuyển traffic khi Region chính down).
**Vì sao:** Đây là 2 yêu cầu độc lập cần 2 dịch vụ khác nhau — CloudFront xử lý phần cache/hiệu năng nội dung tĩnh, Route 53 xử lý phần định tuyến/failover ở tầng DNS; không dịch vụ nào một mình đáp ứng đủ cả 2 yêu cầu.

🧪 **Scenario 3 — Anti-pattern: thêm CloudFront để "tăng tốc" trang có dữ liệu cá nhân hoá**

**Tình huống:** Một đội kỹ sư nhận thấy trang dashboard cá nhân hoá theo từng user phản hồi chậm (do truy vấn database phức tạp), và quyết định đặt CloudFront trước ALB, kỳ vọng CloudFront sẽ cache và tăng tốc trang này.
**Đáp án đúng:** Cần tối ưu tầng backend/database (indexing, caching ở tầng ElastiCache, tối ưu query) thay vì thêm CloudFront cho nội dung không cacheable.
**Vì sao đây là anti-pattern cần tránh:** Dữ liệu dashboard khác nhau theo từng user (không cacheable dùng chung) khiến CloudFront gần như luôn phải forward request tới origin — không giảm được tải cho database phía sau, vấn đề gốc (query chậm) vẫn còn nguyên.

## Key takeaways

- CloudFront = CDN (cache nội dung ở Edge); Route 53 = DNS routing; Global Accelerator = tối ưu đường truyền mạng + IP tĩnh.
- Route 53 không phải CDN, CloudFront không thay thế DNS routing, Global Accelerator không phải cache layer.
- Chọn dịch vụ theo bản chất traffic: cacheable → CloudFront; cần logic định tuyến DNS → Route 53; traffic non-HTTP/cần IP tĩnh → Global Accelerator.

## Checklist tự ôn

- [ ] Tôi phân biệt được vai trò của cả 3 dịch vụ bằng 1 câu ngắn mỗi dịch vụ.
- [ ] Tôi biết khi nào Global Accelerator phù hợp hơn CloudFront.
- [ ] Tôi biết vì sao DNS failover khác load balancing layer 7.

## Xem tiếp / Liên kết liên quan

- [../02-core-services/07-route53.md](../02-core-services/07-route53.md)
- [../02-core-services/12-cloudfront.md](../02-core-services/12-cloudfront.md)
- [../03-architecture-patterns/01-high-availability.md](../03-architecture-patterns/01-high-availability.md)
- [README.md](./README.md)
