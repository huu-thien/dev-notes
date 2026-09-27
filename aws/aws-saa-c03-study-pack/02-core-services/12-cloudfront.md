# Amazon CloudFront

Content Delivery Network (CDN) của AWS — phân phối nội dung (tĩnh và động) tới người dùng qua mạng lưới Edge Location toàn cầu, giảm độ trễ và tải lên origin.

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

- Hiểu CDN mindset: vì sao cache gần người dùng giúp giảm latency và tải backend.
- Biết các loại origin và cách cấu hình caching behavior/TTL phù hợp.
- Phân biệt rõ CloudFront với Route 53 và hiểu cách bảo vệ origin đúng cách (OAC/OAI).

## Practical understanding

### CloudFront là gì — CDN mindset

**Amazon CloudFront** là CDN: lưu bản sao (cache) nội dung tại các **Edge Location** phân bố toàn cầu (đã học ở [../01-foundation/01-global-infrastructure.md](../01-foundation/01-global-infrastructure.md)), giúp người dùng tải nội dung từ điểm gần họ nhất thay vì phải đi tới origin gốc mỗi lần. Lợi ích chính: giảm **latency** cho người dùng cuối, giảm tải trực tiếp lên origin (S3/ALB/custom server), và giảm chi phí truyền dữ liệu từ origin ra ngoài.

CloudFront **không chỉ dành cho static website** — nó phân phối được cả nội dung động (dynamic content) khi cấu hình đúng caching behavior, và còn dùng để tăng tốc API, video streaming.

🧠 **CDN mindset:** câu hỏi cốt lõi CloudFront trả lời là "làm sao đưa nội dung tới gần người dùng nhất về mặt địa lý, và giảm số lần phải chạm tới origin cho cùng 1 nội dung". Nó **không** giải quyết bài toán "định tuyến người dùng tới đúng Region" (đó là Route 53/Global Accelerator) và **không** giải quyết bài toán "database/xử lý logic chậm" (nội dung không cache được vẫn phải đi hết qua origin).

### Origins

| Loại Origin | Mô tả |
|---|---|
| **S3** | Origin phổ biến nhất cho static asset (ảnh, video, file tĩnh) |
| **ALB** | Origin cho ứng dụng web động chạy trên EC2 phía sau Application Load Balancer |
| **Custom Origin** | Bất kỳ HTTP server nào có thể truy cập được (on-premises, server ngoài AWS) |

### Origin selection logic

🧠 Khi đề mô tả nội dung cần phân phối, xác định origin theo bản chất nội dung:

- "file tĩnh (ảnh, video, CSS/JS)" → **S3 origin** (thường kết hợp OAC để bảo mật).
- "trang web/API có logic xử lý động, render theo request" → **ALB origin** (trỏ về EC2/ECS phía sau).
- "hệ thống chạy on-premises hoặc ngoài AWS cần tăng tốc phân phối" → **Custom Origin**.

⚠️ **Bẫy hay gặp:** nghĩ CloudFront chỉ có 1 loại origin cố định cho 1 distribution — thực tế 1 distribution có thể có **nhiều origin** với **cache behavior khác nhau theo path pattern** (VD: `/static/*` → S3, `/api/*` → ALB).

### Caching Behavior và TTL — Caching decision logic

CloudFront cho phép cấu hình **cache behavior** theo path pattern (VD: `/images/*` cache lâu, `/api/*` không cache hoặc cache ngắn). **TTL (Time to Live)** xác định thời gian một object được giữ ở edge cache trước khi CloudFront kiểm tra lại với origin — TTL dài giảm tải origin nhưng tăng độ trễ cập nhật nội dung mới; TTL ngắn ngược lại.

| Loại nội dung | TTL nên chọn | Lý do |
|---|---|---|
| Static asset ít đổi (ảnh, CSS, JS đã versioned) | TTL dài (giờ/ngày) | Giảm tối đa tải lên origin, nội dung hiếm khi đổi |
| Nội dung cập nhật định kỳ (bài viết, trang danh mục) | TTL trung bình (phút) | Cân bằng giữa cache hiệu quả và độ mới của nội dung |
| Nội dung cá nhân hoá/động theo từng user (giỏ hàng, dashboard) | TTL rất ngắn hoặc không cache | Nội dung khác nhau theo từng request, cache sai sẽ trả nhầm dữ liệu cho user khác |
| API ghi dữ liệu (POST/PUT/DELETE) | Không cache | Request thay đổi trạng thái không nên phục vụ từ cache |

### Cache Invalidation

Khi cần buộc CloudFront lấy lại nội dung mới trước khi TTL hết hạn (VD: vừa deploy bản cập nhật gấp), có thể tạo **invalidation request** để xoá object khỏi cache tại các Edge Location — có chi phí tính theo số lượng path invalidate.

### Signed URL / Signed Cookies

Cơ chế cấp quyền truy cập tạm thời, có kiểm soát, cho nội dung private trên CloudFront:
- **Signed URL**: áp dụng cho từng file cụ thể, phù hợp khi chỉ cần cấp quyền cho vài object riêng lẻ.
- **Signed Cookies**: áp dụng cho nhiều file cùng lúc (VD: toàn bộ nội dung một khoá học), phù hợp khi người dùng cần truy cập nhiều object mà không muốn tạo URL riêng cho từng cái.

Mục đích tương tự Presigned URL của S3 (đã học ở [03-s3.md](./03-s3.md)) nhưng áp dụng ở tầng CloudFront/edge thay vì trực tiếp origin.

🧠 **Exam mindset — chọn Signed URL vs Signed Cookies:** đề hỏi "1 file cụ thể, quyền truy cập đơn giản" → Signed URL; đề hỏi "nhiều file/toàn bộ 1 khu vực nội dung, người dùng đã đăng nhập truy cập lặp lại nhiều lần" → Signed Cookies (tránh phải tạo lại URL ký mỗi lần truy cập file mới).

### Private S3 origin vs Public S3 website endpoint

⚠️ Đây là 1 trong những bẫy quan trọng nhất của CloudFront: đề bài mô tả "bucket S3 chứa nội dung, cần phân phối cho người dùng, cần bảo mật/không muốn public trực tiếp" — đáp án đúng luôn là **S3 private (block public access) + CloudFront OAC**, **không phải** bật S3 Static Website Hosting (vốn yêu cầu bucket public).

### Bảo vệ Origin — OAC/OAI (góc nhìn exam-relevant)

Khi origin là S3, cần đảm bảo người dùng **chỉ truy cập được qua CloudFront**, không truy cập trực tiếp S3 bucket URL — dùng **Origin Access Control (OAC)** (khuyến nghị hiện tại, thay thế dần **Origin Access Identity — OAI**) để CloudFront có quyền truy cập bucket private, đồng thời chặn truy cập trực tiếp từ bên ngoài vào bucket. Đây là pattern khác hẳn với **S3 static website hosting endpoint** (public bucket, không qua CloudFront) — SAA-C03 cần phân biệt rõ hai kiến trúc này.

> Cần verify lại theo AWS official docs mới nhất — AWS đang khuyến nghị OAC thay cho OAI, chi tiết tính năng có thể tiếp tục cập nhật.

### HTTPS/TLS

CloudFront hỗ trợ **encryption in transit** giữa client-CloudFront và giữa CloudFront-origin (viewer protocol policy và origin protocol policy có thể cấu hình riêng), thường kết hợp AWS Certificate Manager (ACM) để gắn chứng chỉ TLS cho custom domain.

### CloudFront vs Route 53 vs Global Accelerator — góc nhìn use case

Ba dịch vụ đều liên quan "tăng tốc/định tuyến traffic toàn cầu" nhưng giải quyết vấn đề khác nhau: CloudFront **cache nội dung** gần người dùng; Route 53 **định tuyến DNS** (trả lời "IP nào" dựa trên policy như latency/geolocation); Global Accelerator **định tuyến traffic mạng** qua backbone AWS tới điểm gần nhất mà **không cache** — phù hợp cho ứng dụng non-HTTP hoặc traffic không cache được (VD: gaming, VoIP). Chi tiết so sánh đầy đủ ở [`../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md`](../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md).

## Decision logic

| Câu hỏi cần trả lời | 🧠 Keyword nghĩ ngay tới CloudFront | ⚠️ Keyword nên loại CloudFront |
|---|---|---|
| Nội dung có cache được không? | "static asset", "nội dung ít đổi", "video/ảnh phân phối toàn cầu" | "mọi request đều khác nhau, không cache được" — vẫn có thể tăng tốc kết nối nhưng lợi ích cache thấp |
| Cần bảo vệ nội dung private? | "chỉ user đã xác thực/trả phí mới xem được" | — (Signed URL/Cookies + OAC vẫn là CloudFront) |
| Vấn đề nằm ở đâu trong hệ thống? | "giảm tải origin", "giảm latency truy cập nội dung" | "database/query chậm", "xử lý logic nặng mỗi request" → CloudFront không giải quyết được |
| Cần định tuyến theo DNS hay theo traffic mạng? | (không phải CloudFront) | "định tuyến theo latency/geolocation DNS" → Route 53; "traffic non-HTTP, không cache được" → Global Accelerator |

## Exam focus

### Must know for exam

- CloudFront dùng để giảm latency và tải origin bằng cách cache tại Edge Location — không giới hạn chỉ cho static website.
- Origin S3 private + OAC là pattern chuẩn khi cần bảo mật nội dung, khác với S3 static website hosting (public, truy cập trực tiếp không qua CloudFront).
- Signed URL/Signed Cookies dùng để cấp quyền truy cập tạm thời cho nội dung private qua CloudFront.
- CloudFront không thay thế tối ưu ứng dụng/database — nó chỉ giảm tải các request có thể cache được, không giải quyết vấn đề hiệu năng ở tầng xử lý logic/query chậm.

### Important

- Cache behavior theo path pattern cho phép áp dụng TTL khác nhau cho từng loại nội dung (tĩnh cache lâu, động cache ngắn/không cache).
- CloudFront + ALB tăng tốc cả nội dung động bằng cách tối ưu kết nối tới origin qua mạng backbone AWS, không chỉ nhờ cache.

### Nice to know

- Chi tiết cấu hình media streaming (Lambda@Edge, CloudFront Functions cho xử lý ở edge) — vượt phạm vi trọng tâm SAA-C03, chỉ cần biết tồn tại.

## Use cases

- Phân phối static asset (ảnh, CSS, JS) từ S3 cho người dùng toàn cầu với latency thấp.
- Tăng tốc API/ứng dụng động chạy sau ALB, giảm số lượng request chạm trực tiếp backend.
- Bảo vệ nội dung trả phí (video, tài liệu) bằng Signed URL/Signed Cookies.
- Giảm chi phí data transfer từ origin bằng cách phục vụ phần lớn traffic từ cache edge.

## Khi nào nên dùng / không nên dùng

| Nhu cầu | Nên dùng CloudFront | Không cần CloudFront |
|---|---|---|
| Người dùng toàn cầu truy cập nội dung tĩnh/động thường xuyên | Có | — |
| Giảm tải trực tiếp lên S3/ALB | Có | — |
| Nội dung thay đổi liên tục, không thể cache, chỉ phục vụ nội bộ 1 Region | Cân nhắc kỹ (lợi ích cache thấp) | Truy cập trực tiếp origin có thể đủ |
| Cần bảo vệ nội dung private, cấp quyền tạm thời | Có (Signed URL/Cookies + OAC) | — |
| Vấn đề hiệu năng nằm ở xử lý logic/query database chậm | Không giải quyết được | Cần tối ưu ứng dụng/database (ngoài phạm vi CloudFront) |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Nghĩ CloudFront chỉ dành cho static site | Ví dụ phổ biến nhất về CloudFront là phân phối ảnh/CSS/JS | CloudFront cache và tăng tốc được cả nội dung động qua origin ALB/custom origin — giới hạn tư duy này khiến bỏ lỡ use case tăng tốc API |
| ❌ Dùng CloudFront để giải quyết vấn đề database chậm | "Thêm 1 lớp cache CloudFront" nghe như giải pháp tăng tốc chung chung | CloudFront chỉ cache được response có thể cache (ít thay đổi theo request) — nếu mỗi request cần query database riêng và không cache được, CloudFront không giảm được thời gian xử lý ở origin; cần tối ưu ở tầng ứng dụng/database hoặc thêm cache layer đúng chỗ (VD: ElastiCache/DAX) |
| ❌ Public S3 bucket "cho dễ" dù không thực sự cần công khai | Đơn giản hoá triển khai, khỏi cấu hình OAC | Vi phạm Least Privilege — nội dung private/trả phí bị lộ ra ngoài nếu ai đó biết URL trực tiếp, đúng ra phải dùng private origin + OAC + Signed URL/Cookies |
| ❌ Nhầm CloudFront với DNS routing (tưởng CloudFront định tuyến người dùng theo Region) | Cả hai đều liên quan tới "traffic toàn cầu" | CloudFront cache nội dung tại edge, không quyết định "IP nào được trả về cho domain" — đó là vai trò của Route 53; nhầm lẫn này dẫn tới chọn sai dịch vụ khi đề hỏi về DNS routing policy |

## Common traps

### ⚠️ Trap: Route 53 vs CloudFront
Route 53 là DNS (trả lời "địa chỉ nào"); CloudFront là CDN (cache và phân phối nội dung thật). Đề hỏi "giảm latency truy cập nội dung toàn cầu" → CloudFront; đề hỏi "định tuyến người dùng tới Region gần nhất theo DNS" → Route 53. Hai dịch vụ thường phối hợp: Route 53 Alias record trỏ domain tới CloudFront distribution.

### ⚠️ Trap: nghĩ CloudFront chỉ dùng cho static website
CloudFront phân phối được cả nội dung động qua origin ALB, và tăng tốc API — không giới hạn ở static asset.

### ⚠️ Trap: nhầm S3 static website hosting (public) với S3 private origin phía sau CloudFront
Static website hosting yêu cầu bucket public, truy cập trực tiếp qua S3 website endpoint. Pattern bảo mật hơn là bucket **private**, chỉ CloudFront truy cập được qua OAC, người dùng luôn đi qua CloudFront domain — đây là hai kiến trúc khác nhau, đề thi hay kiểm tra sự phân biệt này.

### ⚠️ Trap: nghĩ CloudFront giải quyết mọi vấn đề hiệu năng
CloudFront chỉ giảm tải các request có thể cache — nếu vấn đề nằm ở database query chậm hoặc xử lý logic nặng ở backend cho mỗi request (không cache được), CloudFront không giải quyết được; cần tối ưu ở tầng ứng dụng/database (xem [`../03-architecture-patterns/04-performance-efficiency.md`](../03-architecture-patterns/04-performance-efficiency.md)).

## Mini scenarios

🧪 **Scenario 1 — Video đào tạo trả phí, phân phối toàn cầu**

**Tình huống:** Một công ty lưu trữ video đào tạo trả phí trên S3, chỉ muốn học viên đã đăng nhập và trả phí mới xem được, không muốn public bucket, và cần phân phối nhanh cho học viên ở nhiều quốc gia.
**Đáp án đúng:** Đặt S3 làm private origin phía sau CloudFront, cấu hình Origin Access Control (OAC) để chỉ CloudFront truy cập được bucket, và dùng Signed Cookies để cấp quyền truy cập cho học viên đã xác thực.
**Vì sao:** Yêu cầu bảo mật nội dung + phân phối nhanh toàn cầu là đúng combo CloudFront + private S3 origin (OAC) + Signed Cookies — không phù hợp với static website hosting công khai.

🧪 **Scenario 2 — Tăng tốc API động có phần nội dung cache được**

**Tình huống:** Một ứng dụng thương mại điện tử có API trả về danh mục sản phẩm (ít thay đổi trong ngày) và API giỏ hàng (khác nhau theo từng user). Đội kỹ sư muốn giảm tải cho ALB/EC2 phía sau mà không cache nhầm dữ liệu giỏ hàng của user này cho user khác.
**Đáp án đúng:** Cấu hình CloudFront với 2 cache behavior khác nhau theo path: `/api/catalog/*` cache với TTL vài phút, `/api/cart/*` không cache (pass through origin mỗi request).
**Vì sao:** CloudFront hỗ trợ nhiều cache behavior trong cùng 1 distribution theo path pattern — đúng cách để tận dụng cache cho phần nội dung cache được mà vẫn giữ đúng behavior cho nội dung cá nhân hoá.

🧪 **Scenario 3 — Anti-pattern: dùng CloudFront để "chữa" database chậm**

**Tình huống:** Một hệ thống báo cáo có API trả về dữ liệu tổng hợp real-time từ database, mỗi request đều query khác nhau tuỳ tham số người dùng nhập, và team quyết định "thêm CloudFront phía trước để tăng tốc" khi thấy API phản hồi chậm.
**Đáp án đúng:** Không nên đặt CloudFront ở đây — cần tối ưu ở tầng database (index, cache layer như ElastiCache/DAX, tối ưu query) hoặc thiết kế lại API để phần nào cache được.
**Vì sao đây là anti-pattern cần tránh:** Vì mỗi request có tham số khác nhau và cần dữ liệu real-time, CloudFront gần như không cache được gì hữu ích — thêm CloudFront chỉ tạo thêm 1 lớp trung gian không giải quyết được nguyên nhân gốc (database/query chậm).

## Key takeaways

- CloudFront là CDN: cache nội dung tại Edge Location, giảm latency và tải origin cho cả nội dung tĩnh lẫn động.
- Origin có thể là S3, ALB, hoặc custom HTTP server.
- OAC (thay OAI) bảo vệ S3 private origin, khác hẳn static website hosting công khai.
- Signed URL/Signed Cookies cấp quyền truy cập tạm thời cho nội dung private.
- CloudFront không phải Route 53 (DNS) và không thay thế tối ưu hoá ứng dụng/database.

## Checklist tự ôn

- [ ] Tôi giải thích được sự khác nhau giữa CloudFront và Route 53.
- [ ] Tôi phân biệt được S3 static website hosting và S3 private origin phía sau CloudFront (OAC).
- [ ] Tôi biết khi nào dùng Signed URL và khi nào dùng Signed Cookies.
- [ ] Tôi hiểu giới hạn của CloudFront đối với vấn đề hiệu năng backend/database.

## Xem tiếp / Liên kết liên quan

- [03-s3.md](./03-s3.md)
- [07-route53.md](./07-route53.md)
- [08-elb-and-auto-scaling.md](./08-elb-and-auto-scaling.md)
- [../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md](../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md)
- [../03-architecture-patterns/04-performance-efficiency.md](../03-architecture-patterns/04-performance-efficiency.md)
