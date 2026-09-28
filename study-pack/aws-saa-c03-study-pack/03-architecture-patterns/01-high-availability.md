# High Availability

Pattern giúp hệ thống luôn sẵn sàng phục vụ, giảm thiểu downtime bằng cách loại bỏ single point of failure.

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

- Hiểu **High Availability (HA)** là gì và cách các service AWS phối hợp để đạt HA.
- Biết mindset Multi-AZ áp dụng cho cả compute và database tier.
- Phân biệt rõ HA và **Fault Tolerance (FT)** — hai khái niệm gần nhau nhưng không đồng nhất.

## Practical understanding

### High Availability là gì

**High Availability (HA)** — đã định nghĩa ở [`GLOSSARY.md`](../GLOSSARY.md) — là khả năng hệ thống luôn sẵn sàng phục vụ với thời gian downtime tối thiểu. HA **không** có nghĩa là không bao giờ gián đoạn — nó chấp nhận một khoảng gián đoạn ngắn (failover time) miễn là hệ thống tự phục hồi nhanh và không cần can thiệp thủ công.

🧠 **Exam mindset:** HA giải quyết bài toán "**khi 1 phần hạ tầng chết, hệ thống tự đứng dậy nhanh**" — mục tiêu thực tế là **giảm downtime xuống mức chấp nhận được**, không phải loại bỏ hoàn toàn gián đoạn (đó là mức Fault Tolerance, xem [`02-fault-tolerance.md`](./02-fault-tolerance.md)). Tín hiệu trong đề dẫn tới HA: "tự động phục hồi khi 1 AZ lỗi", "giảm downtime", "không cần can thiệp thủ công khi có sự cố".

### Multi-AZ mindset

Ý tưởng cốt lõi của HA trên AWS là loại bỏ phụ thuộc vào **1 Availability Zone (AZ) duy nhất**. Nếu toàn bộ tài nguyên chỉ nằm trong 1 AZ, một sự cố ở AZ đó (mất điện, mất kết nối mạng...) làm sập toàn bộ hệ thống. Trải tài nguyên qua ít nhất 2 AZ trong cùng Region là nền tảng của mọi kiến trúc HA trên AWS.

### ELB + Auto Scaling + Multi-AZ

Bộ ba kết hợp chuẩn cho compute tier HA:

- **Application Load Balancer / Network Load Balancer** (xem [`08-elb-and-auto-scaling.md`](../02-core-services/08-elb-and-auto-scaling.md)) phân phối traffic tới các target khỏe mạnh, tự động ngừng gửi traffic tới target lỗi (health check).
- **Auto Scaling Group** trải instance qua nhiều AZ, tự động thay thế instance lỗi và scale theo tải.
- Kết hợp cả hai: nếu 1 AZ gặp sự cố, ELB tự động định tuyến toàn bộ traffic sang instance ở AZ còn lại, Auto Scaling Group bù đắp capacity bị mất.

### Stateless app tier

Để failover mượt mà, **application tier nên stateless** — không lưu session/state cục bộ trên 1 instance cụ thể. Nếu một instance chết, request có thể được route sang instance khác mà không mất dữ liệu phiên làm việc. Session state nên đẩy ra ngoài (VD: DynamoDB, ElastiCache) thay vì lưu trong bộ nhớ instance.

⚠️ **Bẫy hay gặp:** nếu app lưu session trên local disk/memory của instance (ví dụ file session trên EBS gắn instance đó), thì dù ELB + ASG có failover instance mới, người dùng vẫn bị **mất phiên đăng nhập/giỏ hàng** — HA về hạ tầng không đồng nghĩa HA về trải nghiệm người dùng nếu state không được tách ra ngoài.

### Database HA ở mức pattern

- **RDS Multi-AZ** (xem [`04-rds-aurora.md`](../02-core-services/04-rds-aurora.md)): bản sao đồng bộ ở AZ khác, tự động failover khi instance chính gặp sự cố — đây là ví dụ điển hình của HA ở tầng database.
- **Aurora**: kiến trúc lưu trữ phân tán nhiều AZ theo mặc định, failover thường nhanh hơn RDS "classic".
- **DynamoDB**: được replicate nhiều AZ tự động, HA là đặc tính có sẵn của service, không cần cấu hình thủ công.

## Exam focus

### Must know for exam

- HA = giảm downtime bằng cách loại bỏ single point of failure, chủ yếu qua Multi-AZ + Auto Scaling + ELB.
- HA **không đồng nghĩa** Fault Tolerance — xem chi tiết ở [`02-fault-tolerance.md`](./02-fault-tolerance.md).
- Stateless app tier là điều kiện cần để failover không làm mất dữ liệu phiên làm việc.
- RDS Multi-AZ phục vụ mục đích HA, không phải để tăng read throughput (đó là vai trò của Read Replica).

### Important

- Auto Scaling Group nên được cấu hình trải đều qua ít nhất 2 AZ để đạt HA thực sự, không chỉ đơn thuần bật Auto Scaling trong 1 AZ.
- Health check ở ELB là cơ chế phát hiện lỗi bắt buộc để HA hoạt động đúng — nếu health check không chính xác, ELB vẫn gửi traffic tới target đã lỗi.

### Nice to know

- Chi tiết thời gian failover chính xác của RDS Multi-AZ hay Aurora tùy thuộc cấu hình và engine cụ thể.

> Cần verify lại theo AWS official docs mới nhất.

## Decision mindset / decision framework

Khi đề bài yêu cầu "giảm downtime", "đảm bảo sẵn sàng phục vụ", hoặc "tránh single point of failure", hãy đặt câu hỏi theo thứ tự:

1. Compute tier có trải qua nhiều AZ chưa? → cần Auto Scaling Group + ELB multi-AZ.
2. App tier có lưu state cục bộ không? → nếu có, cần tách state ra ngoài trước khi HA có ý nghĩa.
3. Database có Multi-AZ chưa? → nếu chưa, đó thường là single point of failure còn sót lại.
4. Yêu cầu có phải "không được gián đoạn dù chỉ 1 giây" không? → nếu có, đây là bài toán Fault Tolerance, không chỉ HA.

## Service mapping

| Vai trò | Service chính | Vai trò hỗ trợ |
|---|---|---|
| Phân phối traffic tới target khoẻ mạnh | ALB / NLB | Health check quyết định target nhận traffic |
| Duy trì số lượng instance đúng, tự thay thế instance lỗi | Auto Scaling Group | Cần trải ≥ 2 AZ mới có ý nghĩa HA |
| HA cho relational database | RDS Multi-AZ / Aurora (multi-AZ storage mặc định) | Không nhầm với Read Replica (mục đích khác) |
| HA cho NoSQL database | DynamoDB (multi-AZ mặc định, không cần cấu hình) | — |
| Đẩy session/state ra khỏi instance | ElastiCache / DynamoDB | Điều kiện để failover không mất trải nghiệm người dùng |

🧠 **Combination phổ biến trong đề:** ALB + ASG (multi-AZ) + RDS Multi-AZ + session ở ElastiCache/DynamoDB là "bộ 4 chuẩn" cho HA 3-tier — nếu đề thiếu 1 trong 4 mảnh này, đáp án thường chưa hoàn chỉnh.

## Trade-offs

| Yếu tố | Đánh đổi khi tăng HA |
|---|---|
| Chi phí | Chạy tài nguyên dự phòng ở nhiều AZ tốn thêm chi phí (VD: RDS Multi-AZ gần như gấp đôi chi phí instance) |
| Độ phức tạp | Cần thiết kế stateless, cần health check đúng, cần kiểm thử failover |
| Độ trễ | Đồng bộ dữ liệu Multi-AZ có thể ảnh hưởng nhẹ tới write latency (đặc biệt RDS Multi-AZ đồng bộ) |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Chạy 2 instance nhưng đặt cùng 1 Availability Zone | "Có 2 instance rồi" nghe như đã redundant | Nếu AZ đó gặp sự cố, cả 2 instance cùng chết — vẫn là single point of failure ở cấp AZ, HA thật sự yêu cầu trải ≥ 2 AZ khác nhau |
| ❌ Coi snapshot/backup định kỳ là giải pháp HA | Backup cũng "bảo vệ dữ liệu khỏi mất mát" nên nghe như đủ an toàn | Backup chỉ phục vụ khôi phục dữ liệu sau sự cố (cần thao tác thủ công, tốn thời gian) — không cung cấp failover tự động gần như tức thời như Multi-AZ |
| ❌ Chỉ làm HA ở tầng compute, bỏ qua database | ELB + ASG multi-AZ đã "nhìn có vẻ đầy đủ" | Nếu database vẫn Single-AZ, đó là single point of failure còn sót lại — toàn bộ ứng dụng vẫn sập nếu AZ chứa database gặp sự cố |
| ❌ Lưu session/state trên local disk của instance rồi tin failover vẫn mượt | Failover hạ tầng (ASG thay instance mới) vẫn "hoạt động" về mặt kỹ thuật | Người dùng bị mất session/giỏ hàng vì state không được đẩy ra ngoài (ElastiCache/DynamoDB) — HA hạ tầng không đồng nghĩa trải nghiệm liền mạch cho người dùng |

## Common traps

### ⚠️ Trap: HA vs Fault Tolerance
Đề thi hay dùng "high availability" và "fault tolerant" như thể giống nhau. HA chấp nhận gián đoạn ngắn trong lúc failover; FT yêu cầu không gián đoạn. Xem [`02-fault-tolerance.md`](./02-fault-tolerance.md) để phân biệt kỹ.

### ⚠️ Trap: nghĩ backup là đủ để đạt HA
Backup (snapshot) phục vụ khôi phục dữ liệu sau sự cố (thuộc phạm trù Disaster Recovery), không tự động cung cấp khả năng failover tức thời như Multi-AZ. Backup ≠ HA ≠ DR — ba khái niệm liên quan nhưng khác mục đích.

### ⚠️ Trap: chỉ scale compute mà quên database
Một kiến trúc có Auto Scaling Group + ELB đầy đủ nhưng database chỉ chạy Single-AZ vẫn còn single point of failure — HA phải áp dụng xuyên suốt các tầng.

## Mini scenarios

🧪 **Scenario 1 — HA 3 tier chuẩn**

**Tình huống:** Ứng dụng web 3 tier đang chạy toàn bộ trong 1 AZ. Yêu cầu: nếu AZ đó gặp sự cố, hệ thống vẫn tiếp tục phục vụ với thời gian gián đoạn tối thiểu, chi phí hợp lý.
**Đáp án đúng:** Auto Scaling Group trải qua ≥ 2 AZ đứng sau ALB, app tier stateless (session lưu ở ElastiCache/DynamoDB), RDS bật Multi-AZ.
**Vì sao:** Đây là bộ pattern HA chuẩn — loại bỏ single point of failure ở cả 3 tầng (compute, session, database) với chi phí chấp nhận được, không cần tới mức Fault Tolerance/Multi-Region.

🧪 **Scenario 2 — HA cho hệ thống NoSQL đọc/ghi liên tục**

**Tình huống:** Một ứng dụng dùng DynamoDB làm database chính, đội kỹ thuật hỏi có cần cấu hình gì thêm để đạt HA cho tầng dữ liệu không.
**Đáp án đúng:** Không cần cấu hình Multi-AZ thủ công — DynamoDB tự động replicate dữ liệu qua nhiều AZ trong Region theo mặc định, HA là đặc tính có sẵn của service.
**Vì sao:** Đây là điểm khác biệt quan trọng so với RDS "classic" — best answer ở đây là "không cần làm gì thêm" thay vì cố tìm một cấu hình Multi-AZ tương tự RDS, vì DynamoDB đã tích hợp sẵn tính năng này.

🧪 **Scenario 3 — Anti-pattern: 2 instance cùng 1 AZ tưởng là HA**

**Tình huống:** Đội vận hành chạy 2 EC2 instance đứng sau ALB để "đảm bảo HA", nhưng cả 2 instance đều được đặt trong cùng 1 subnet thuộc cùng 1 Availability Zone.
**Đáp án đúng:** Cấu hình lại để 2 instance (hoặc nhiều hơn) nằm ở ít nhất 2 Availability Zone khác nhau, mỗi AZ có subnet riêng đăng ký vào cùng target group của ALB.
**Vì sao đây là anti-pattern cần tránh:** Có nhiều instance chỉ giải quyết được vấn đề tải/hiệu năng, không giải quyết được vấn đề HA nếu tất cả instance cùng phụ thuộc vào 1 AZ — khi AZ đó mất điện/kết nối, toàn bộ instance cùng ngừng hoạt động đồng thời.

## Key takeaways

- HA = giảm downtime qua Multi-AZ, không loại bỏ hoàn toàn gián đoạn.
- Bộ ba ELB + Auto Scaling Group + Multi-AZ là pattern chuẩn cho compute tier.
- App tier phải stateless để failover không mất dữ liệu phiên.
- HA phải áp dụng cho cả compute và database, không chỉ 1 tầng.
- HA ≠ Fault Tolerance ≠ Backup/DR — ba khái niệm khác mục đích.

## Checklist tự ôn

- [ ] Tôi giải thích được vì sao stateless app tier cần thiết cho HA.
- [ ] Tôi phân biệt được RDS Multi-AZ và Read Replica về mục đích sử dụng.
- [ ] Tôi phân biệt được HA và Fault Tolerance bằng ví dụ cụ thể.
- [ ] Tôi biết backup không phải là giải pháp HA.

## Xem tiếp / Liên kết liên quan

- [02-fault-tolerance.md](./02-fault-tolerance.md)
- [07-disaster-recovery.md](./07-disaster-recovery.md)
- [../02-core-services/08-elb-and-auto-scaling.md](../02-core-services/08-elb-and-auto-scaling.md)
- [../02-core-services/04-rds-aurora.md](../02-core-services/04-rds-aurora.md)
- [../04-comparison-guides/README.md](../04-comparison-guides/README.md)
