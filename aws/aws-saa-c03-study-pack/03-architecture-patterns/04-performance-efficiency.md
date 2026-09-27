# Performance Efficiency

Pattern giúp chọn đúng công cụ, đúng tầng để đạt hiệu năng tốt nhất — trọng tâm là caching mindset và tư duy tìm bottleneck.

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

- Hiểu caching mindset và vai trò của CloudFront, ElastiCache, DAX ở từng tầng khác nhau.
- Biết cách chọn đúng compute/database/storage theo đặc điểm workload.
- Nắm tư duy **right-sizing** và **bottleneck thinking** để tối ưu hiệu năng đúng chỗ.

## Practical understanding

### Caching mindset

Caching giúp giảm tải cho tầng phía sau và giảm latency bằng cách phục vụ dữ liệu đã tính toán/truy vấn trước đó, thay vì tính toán lại mỗi lần. Điểm quan trọng: **cache phải đặt đúng tầng đang là bottleneck**, đặt cache sai tầng không giải quyết được vấn đề gốc.

🧠 **Exam mindset:** trước khi nghĩ tới cache, phải trả lời được "**cái gì đang chậm và vì sao**". Cache chỉ giải quyết bài toán "**đọc lặp lại nhiều lần dữ liệu ít thay đổi**" — nếu vấn đề là ghi chậm, tính toán phức tạp mỗi lần khác nhau, hay chọn sai loại database, cache không phải "best answer".

| Vị trí cache | Vai trò | Dịch vụ |
|---|---|---|
| Edge (gần người dùng) | Giảm latency truy cập nội dung tĩnh/động qua CDN | CloudFront (xem [`12-cloudfront.md`](../02-core-services/12-cloudfront.md)) |
| Application/database layer | Giảm tải truy vấn lặp lại tới database chính | ElastiCache (Redis/Memcached) |
| DynamoDB layer | Giảm độ trễ đọc cho truy vấn lặp lại nhiều trên DynamoDB | DAX (xem [`05-dynamodb.md`](../02-core-services/05-dynamodb.md)) |

- **CloudFront**: cache nội dung ở Edge Location, phù hợp cho asset tĩnh và một phần nội dung động có thể cache theo TTL.
- **ElastiCache**: in-memory cache đặt giữa ứng dụng và database (thường là RDS/Aurora), giảm số lượng truy vấn trực tiếp tới database cho dữ liệu được đọc lặp lại nhiều.
- **DAX**: cache chuyên biệt đặt trước DynamoDB, giảm độ trễ đọc xuống mức micro-giây cho truy vấn lặp lại.

### Chọn đúng compute/database/storage

Hiệu năng tốt bắt đầu từ việc chọn đúng công cụ cho đúng workload, không chỉ dựa vào caching:

- Compute: EC2 (kiểm soát cao) vs Lambda (event-driven, không cần quản lý server) vs container — xem lại [`01-ec2.md`](../02-core-services/01-ec2.md).
- Database: relational (RDS/Aurora) cho dữ liệu có quan hệ/transaction phức tạp, DynamoDB cho truy vấn key-value tốc độ cao, quy mô lớn — xem [`04-rds-aurora.md`](../02-core-services/04-rds-aurora.md) và [`05-dynamodb.md`](../02-core-services/05-dynamodb.md).
- Storage: S3 cho object lớn/ít thay đổi, EBS cho block storage gắn liền 1 instance, EFS/FSx cho shared file access — xem [`02-ebs-efs-fsx.md`](../02-core-services/02-ebs-efs-fsx.md).

### Right-sizing

**Right-sizing** là việc chọn đúng kích cỡ tài nguyên (instance type, database class, provisioned throughput) phù hợp với tải thực tế — không dư thừa gây lãng phí, không thiếu gây nghẽn hiệu năng. Right-sizing cần dựa trên số liệu giám sát thực tế (CloudWatch metrics — xem [`13-cloudwatch-cloudtrail-config.md`](../02-core-services/13-cloudwatch-cloudtrail-config.md)), không phải ước lượng cảm tính.

### Bottleneck thinking

Khi hệ thống chậm, cần xác định chính xác **tầng nào đang là bottleneck** trước khi áp dụng giải pháp: có thể là compute (CPU), database (query chậm, write throughput), network (băng thông), hay tầng ứng dụng (code logic). Áp dụng sai giải pháp (VD: thêm cache trong khi bottleneck thực sự là database write) không cải thiện hiệu năng.

⚠️ **Bẫy hay gặp:** đề bài mô tả "database chậm" và gợi ý CloudFront như đáp án — đây là distractor kinh điển. CloudFront cache nội dung ở **Edge location**, không giúp ích cho truy vấn động chưa từng được cache hoặc dữ liệu thay đổi liên tục từ database.

## Exam focus

### Must know for exam

- CloudFront cache ở Edge cho nội dung gần người dùng; ElastiCache cache giữa app và database; DAX cache riêng cho DynamoDB — ba loại cache phục vụ ba tầng khác nhau, không thay thế nhau.
- Cache không sửa được bottleneck nếu vấn đề gốc nằm ở tầng khác (VD: cache không giúp nếu bottleneck là write throughput của database).
- Right-sizing dựa trên dữ liệu giám sát thực tế (CloudWatch), không phải đoán.
- Chọn đúng loại database (relational vs NoSQL) ảnh hưởng hiệu năng nhiều hơn việc thêm cache sau này.

### Important

- Read Replica cũng là một dạng "giảm tải đọc" nhưng khác cơ chế với cache (Read Replica là bản sao dữ liệu đầy đủ, cache là lưu tạm kết quả truy vấn).
- Việc chọn Region/Edge Location gần người dùng cuối cũng là yếu tố performance efficiency (giảm round-trip latency).

### Nice to know

- Chi tiết benchmark hiệu năng cụ thể giữa các loại cache không phải trọng tâm thi SAA-C03.

## Decision mindset / decision framework

Khi đề bài nói "ứng dụng chậm", "cần cải thiện hiệu năng", "giảm latency":

1. Xác định bottleneck đang ở tầng nào (dựa vào mô tả: đọc dữ liệu lặp lại nhiều? ghi dữ liệu lớn? nội dung tĩnh phục vụ toàn cầu?).
2. Nếu là nội dung tĩnh/toàn cầu → CloudFront.
3. Nếu là truy vấn database lặp lại nhiều (đọc) → ElastiCache hoặc DAX (tùy loại database).
4. Nếu là do chọn sai loại compute/database cho workload → cân nhắc đổi loại service trước khi thêm cache.
5. Nếu chưa rõ nguyên nhân → cần theo dõi CloudWatch metrics trước khi quyết định giải pháp.

## Service mapping

| Bottleneck/nhu cầu | Service chính | Ghi chú |
|---|---|---|
| Nội dung tĩnh/động phục vụ toàn cầu | CloudFront | Cache ở Edge location, gần người dùng |
| Truy vấn RDS/Aurora lặp lại nhiều | ElastiCache (Redis/Memcached) | Đặt giữa app và database |
| Truy vấn DynamoDB lặp lại nhiều, cần độ trễ micro-giây | DAX | Chỉ dành riêng cho DynamoDB |
| Compute chưa đúng kích cỡ | Right-sizing dựa trên CloudWatch metrics | Không phải lúc nào cũng cần thêm cache |
| Chọn sai loại database cho access pattern | Đổi loại database (relational ↔ NoSQL) | Xem [`02-rds-vs-aurora-vs-dynamodb.md`](../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md) |

🧠 **Combination phổ biến trong đề:** "nội dung tĩnh toàn cầu + truy vấn động lặp lại nhiều từ RDS" thường cần **cả hai** CloudFront (cho asset tĩnh) và ElastiCache (cho query động) — không phải chọn 1 trong 2, vì chúng phục vụ 2 loại nội dung khác nhau.

## Trade-offs

| Yếu tố | Đánh đổi |
|---|---|
| Thêm cache | Giảm tải backend nhưng thêm độ phức tạp về cache invalidation/staleness |
| Right-sizing liên tục | Tối ưu chi phí/hiệu năng nhưng cần giám sát và điều chỉnh thường xuyên |
| Đổi loại database để tối ưu hiệu năng | Cải thiện hiệu năng đúng workload nhưng tốn công sức migration/re-architect |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Thêm cache sai tầng (VD: ElastiCache trong khi bottleneck là network băng thông) | "Cache luôn giúp cải thiện hiệu năng" là niềm tin phổ biến | Cache chỉ hiệu quả cho tải đọc lặp lại ở đúng tầng gây nghẽn — nếu bottleneck ở tầng khác (network, write throughput), cache không chạm tới vấn đề gốc |
| ❌ Nghĩ performance = chỉ tăng size instance (scale up) | Instance to hơn "chắc chắn nhanh hơn" | Nếu bottleneck là do query kém tối ưu, thiết kế database sai, hay N+1 query, tăng size instance chỉ trì hoãn vấn đề chứ không giải quyết gốc rễ — cần bottleneck thinking trước khi scale |
| ❌ Dùng CDN (CloudFront) để chữa query database chậm | CloudFront "tăng tốc" nên nghe như giải pháp chung cho mọi vấn đề chậm | CloudFront chỉ cache nội dung ở Edge cho request lặp lại giống nhau — nó không tối ưu được logic truy vấn hay tính toán bên trong database, và không giúp gì cho dữ liệu động thay đổi liên tục theo từng user |
| ❌ Right-sizing dựa trên cảm tính "chọn dư cho chắc" | Tránh rủi ro thiếu tài nguyên khi traffic tăng đột biến | Đây là over-provisioning trá hình dưới tên "right-sizing" — gây lãng phí chi phí mà không có cơ sở dữ liệu giám sát thực tế để biện minh |

## Common traps

### ⚠️ Trap: cache không sửa được bottleneck sai tầng
Đây là bẫy trọng tâm của file này. Nếu bottleneck thực sự nằm ở write throughput của database hoặc ở tầng compute quá tải, thêm ElastiCache/CloudFront không giải quyết được — cache chỉ hiệu quả cho tải **đọc lặp lại**.

### ⚠️ Trap: nhầm CloudFront, ElastiCache, DAX là có thể thay thế nhau
Ba dịch vụ cache phục vụ ba tầng khác nhau (Edge/content, application-database, DynamoDB riêng) — đề thi thường mô tả rõ ngữ cảnh (nội dung tĩnh toàn cầu / truy vấn RDS lặp lại / truy vấn DynamoDB lặp lại) để xác định đúng loại cache.

### ⚠️ Trap: right-sizing dựa trên cảm tính thay vì số liệu
Chọn instance type/database class "cho chắc" (quá dư thừa) không phải là right-sizing đúng nghĩa — cần dựa trên CloudWatch metrics thực tế.

## Mini scenarios

🧪 **Scenario 1 — Trang sản phẩm truy vấn RDS lặp lại**

**Tình huống:** Trang thương mại điện tử có trang chi tiết sản phẩm được truy vấn từ RDS rất nhiều lần với cùng 1 sản phẩm, gây tải cao lên database dù dữ liệu sản phẩm ít thay đổi.
**Đáp án đúng:** Thêm ElastiCache giữa ứng dụng và RDS để cache kết quả truy vấn sản phẩm phổ biến.
**Vì sao:** Đây là bottleneck đọc lặp lại điển hình ở tầng application-database — ElastiCache giảm tải trực tiếp cho RDS mà không cần thay đổi kiến trúc database; CloudFront không phù hợp vì đây là truy vấn động từ database, không phải asset tĩnh.

🧪 **Scenario 2 — Ứng dụng game lookup dữ liệu người chơi tốc độ cao**

**Tình huống:** Ứng dụng game lưu trạng thái người chơi trong DynamoDB, cần độ trễ đọc ở mức micro-giây cho bảng xếp hạng (leaderboard) được truy vấn liên tục bởi hàng triệu người chơi cùng lúc.
**Đáp án đúng:** Thêm DAX (DynamoDB Accelerator) trước DynamoDB để cache kết quả truy vấn leaderboard.
**Vì sao:** Yêu cầu độ trễ micro-giây cho DynamoDB là đúng use case của DAX — ElastiCache không tích hợp trực tiếp với DynamoDB theo cách tối ưu như DAX, và CloudFront không phù hợp vì đây không phải nội dung tĩnh phục vụ qua HTTP.

🧪 **Scenario 3 — Anti-pattern: dùng CloudFront để chữa database chậm**

**Tình huống:** Một đội kỹ sư nhận thấy trang web phản hồi chậm do API backend truy vấn RDS mất nhiều thời gian, và quyết định bật CloudFront trước API Gateway/ALB, kỳ vọng CloudFront sẽ "tăng tốc" toàn bộ hệ thống.
**Đáp án đúng:** Cần xác định lại bottleneck thực sự (query chậm, thiếu index, hay tải cao) và xử lý đúng tầng — có thể là tối ưu query/index, thêm ElastiCache cho dữ liệu đọc lặp lại, hoặc right-sizing RDS instance.
**Vì sao đây là anti-pattern cần tránh:** CloudFront cache response theo TTL cho request giống hệt nhau — nếu API trả về dữ liệu động, khác nhau theo từng user/request (không cacheable), CloudFront sẽ hầu như luôn phải forward request tới origin, không giảm được tải cho RDS ở phía sau.

## Key takeaways

- Ba loại cache (CloudFront, ElastiCache, DAX) phục vụ ba tầng khác nhau, không thay thế nhau.
- Cache chỉ hiệu quả với bottleneck đọc lặp lại — không sửa được bottleneck sai tầng (VD: write throughput).
- Right-sizing phải dựa trên số liệu giám sát thực tế, không phải ước lượng.
- Chọn đúng loại compute/database cho workload là nền tảng hiệu năng, quan trọng hơn việc thêm cache sau này.

## Checklist tự ôn

- [ ] Tôi phân biệt được vai trò của CloudFront, ElastiCache, DAX.
- [ ] Tôi giải thích được vì sao cache không sửa được mọi loại bottleneck.
- [ ] Tôi biết right-sizing cần dựa trên CloudWatch metrics.
- [ ] Tôi biết bottleneck thinking là gì và áp dụng được vào 1 ví dụ cụ thể.

## Xem tiếp / Liên kết liên quan

- [03-scalability.md](./03-scalability.md)
- [05-cost-optimization.md](./05-cost-optimization.md)
- [../02-core-services/12-cloudfront.md](../02-core-services/12-cloudfront.md)
- [../02-core-services/05-dynamodb.md](../02-core-services/05-dynamodb.md)
- [../02-core-services/13-cloudwatch-cloudtrail-config.md](../02-core-services/13-cloudwatch-cloudtrail-config.md)
