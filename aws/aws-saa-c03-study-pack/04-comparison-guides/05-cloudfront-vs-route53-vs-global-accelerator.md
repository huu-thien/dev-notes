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

## Khi nào không nên chọn

- Không dùng CloudFront cho traffic không cacheable hoàn toàn động (mỗi request khác nhau, không thể tái sử dụng cache).
- Không dùng Route 53 để tăng tốc đường truyền mạng — Route 53 chỉ quyết định client kết nối tới IP nào, không tối ưu đường đi của gói tin.
- Không dùng Global Accelerator nếu chỉ cần cache nội dung tĩnh — đây không phải vai trò của nó, CloudFront phù hợp hơn và rẻ hơn cho mục đích này.

## Trade-offs

| Lựa chọn | Đánh đổi |
|---|---|
| CloudFront | Giảm latency/tải origin tốt cho nội dung cacheable, nhưng không giúp gì cho traffic hoàn toàn động/không cacheable |
| Route 53 | Linh hoạt định tuyến DNS nhưng phụ thuộc TTL/caching của DNS resolver phía client (failover không tức thời) |
| Global Accelerator | Cải thiện performance mạng và cung cấp IP tĩnh nhưng chi phí thêm và không thay thế được caching layer |

## Common traps

### Trap: Route 53 vs CloudFront
Đây là bẫy trọng tâm — Route 53 không phải CDN (không cache nội dung), CloudFront không thay thế được DNS routing logic. Route 53 quyết định "đi đâu", CloudFront quyết định "phục vụ nội dung nhanh thế nào".

### Trap: nghĩ CloudFront chỉ dành cho static website
CloudFront cũng tăng tốc một phần nội dung động qua origin ALB/custom origin (dù hiệu quả cache thấp hơn nội dung tĩnh) — không chỉ giới hạn ở static website hosting.

### Trap: nghĩ Global Accelerator là một lớp cache
Global Accelerator không cache dữ liệu — nó tối ưu đường đi mạng (routing qua AWS backbone) và cung cấp Anycast IP tĩnh, khác hoàn toàn vai trò caching của CloudFront.

### Trap: DNS failover giống load balancing layer 7
Route 53 failover routing chỉ đổi bản ghi DNS trả về (phụ thuộc TTL, không tức thời và không kiểm tra tầng ứng dụng sâu như ALB) — không giống cơ chế load balancing chủ động ở layer 7 của ALB.

## Mini scenario

**Tình huống:** Ứng dụng game trực tuyến dùng giao thức UDP, cần độ trễ thấp toàn cầu và 1 địa chỉ IP cố định để client kết nối, không có nội dung tĩnh cần cache.
**Đáp án đúng:** AWS Global Accelerator.
**Vì sao:** Traffic UDP không phải HTTP/HTTPS nên CloudFront không áp dụng được (CloudFront chỉ phục vụ HTTP/HTTPS); yêu cầu IP tĩnh và tối ưu đường truyền mạng là đặc điểm nhận diện chuẩn của Global Accelerator, không phải Route 53 (chỉ định tuyến DNS, không tối ưu đường truyền).

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
