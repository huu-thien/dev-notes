# Glossary & Terminology Rules (Internal Rulebook)

> File này KHÔNG phải bài học. Đây là rulebook thuật ngữ dùng để mọi file trong study pack viết nhất quán. Khi sinh nội dung mới, tham chiếu file này trước.

## Mục lục

- [Nguyên tắc chung](#nguyên-tắc-chung)
- [Glossary: Architecture](#glossary-architecture)
- [Glossary: Networking](#glossary-networking)
- [Glossary: Storage / Database](#glossary-storage--database)
- [Glossary: Security](#glossary-security)
- [Glossary: Exam Strategy](#glossary-exam-strategy)
- [Các cặp thuật ngữ dễ nhầm — phải phân biệt rõ mỗi lần dùng](#các-cặp-thuật-ngữ-dễ-nhầm--phải-phân-biệt-rõ-mỗi-lần-dùng)

## Nguyên tắc chung

1. **Không dịch tên dịch vụ AWS.** Viết đúng tên chính thức: `Amazon EC2`, `Amazon S3`, `AWS Lambda`, `Amazon VPC`, `Amazon RDS`... Không viết "Dịch vụ điện toán đám mây EC2".
2. **Không dịch tên feature/pattern.** Giữ nguyên: `Auto Scaling Group`, `Read Replica`, `Multi-AZ`, `Pilot Light`, `Warm Standby`, `Blue/Green Deployment`.
3. **Thuật ngữ kiến trúc/khái niệm** (High Availability, Fault Tolerance, Idempotency...) giữ nguyên English, in đậm ở lần xuất hiện đầu tiên trong file, kèm mô tả tiếng Việt ngắn ngay sau đó.
4. **Một thuật ngữ chỉ định nghĩa đầy đủ một lần** ở file gốc phù hợp nhất (ví dụ Security Group định nghĩa đầy đủ ở `02-core-services/06-vpc.md`); các file khác chỉ nhắc lại ngắn gọn và link tới file gốc.
5. Viết tắt được dùng sau khi đã giải thích đầy đủ ít nhất 1 lần trong file (HA, FT, RTO, RPO, CMK...).
6. Không tạo từ đồng nghĩa tùy tiện — luôn dùng đúng 1 cách gọi cho 1 khái niệm xuyên suốt repo (ví dụ luôn gọi "Scaling out", không đổi qua lại "mở rộng theo chiều ngang" và "horizontal scaling" lẫn lộn).

## Glossary: Architecture

| English Term | Mô tả tiếng Việt ngắn | Rule sử dụng |
|---|---|---|
| **High Availability (HA)** | Hệ thống luôn sẵn sàng phục vụ, giảm thiểu downtime | Dùng khi nói về Multi-AZ, Auto Scaling + ELB; không đồng nghĩa với Fault Tolerance |
| **Fault Tolerance (FT)** | Hệ thống tiếp tục hoạt động đúng ngay cả khi một thành phần lỗi, không gián đoạn | Cao hơn HA một bậc; luôn so sánh rõ với HA khi nhắc tới |
| **Durability** | Độ bền dữ liệu — xác suất dữ liệu không bị mất theo thời gian | Chỉ dùng cho dữ liệu (S3 11 nines), không dùng cho uptime dịch vụ |
| **Scalability** | Khả năng hệ thống mở rộng để đáp ứng tải tăng | Tách rõ Scaling up (vertical) vs Scaling out (horizontal) |
| **Elasticity** | Khả năng tự động co giãn tài nguyên theo nhu cầu thực tế | Không đồng nghĩa hoàn toàn với Scalability — Elasticity nhấn mạnh tính tự động |
| **Loose Coupling / Decoupling** | Tách rời các thành phần hệ thống để giảm phụ thuộc trực tiếp | Gắn với SQS/SNS/EventBridge pattern |
| **Event-driven** | Kiến trúc phản ứng theo sự kiện phát sinh, không polling liên tục | Dùng khi nói Lambda trigger, EventBridge rule |
| **Idempotency** | Gọi lại nhiều lần cùng một request cho cùng một kết quả, không gây side-effect trùng lặp | Nhắc khi nói về retry trong SQS/Lambda/API Gateway |
| **RTO (Recovery Time Objective)** | Thời gian tối đa chấp nhận được để khôi phục dịch vụ sau sự cố | Luôn đi kèm RPO khi nói về Disaster Recovery |
| **RPO (Recovery Point Objective)** | Lượng dữ liệu tối đa chấp nhận mất tính theo thời gian trước sự cố | Luôn đi kèm RTO |

## Glossary: Networking

| English Term | Mô tả tiếng Việt ngắn | Rule sử dụng |
|---|---|---|
| **CIDR** | Cách biểu diễn dải địa chỉ IP (ví dụ 10.0.0.0/16) | Dùng số liệu cụ thể khi ví dụ, tránh nói chung chung |
| **Security Group** | Firewall ở cấp instance/ENI, stateful, chỉ có rule "allow" | Luôn so sánh với NACL khi nhắc tới |
| **NACL (Network ACL)** | Firewall ở cấp subnet, stateless, có cả rule "allow" và "deny" | Luôn so sánh với Security Group khi nhắc tới |
| **Multi-AZ** | Triển khai tài nguyên đồng bộ ở nhiều Availability Zone để failover, chủ yếu nói về RDS | Không nhầm với Read Replica (mục đích khác nhau) |
| **TTL (Time to Live)** | Thời gian một bản ghi/cache còn hiệu lực trước khi hết hạn | Ghi rõ ngữ cảnh: DNS record TTL (Route 53) khác DynamoDB item TTL |
| **Edge Location** | Điểm PoP của CloudFront/Route 53 để phục vụ nội dung gần người dùng | Không nhầm với Region hoặc Local Zone |

## Glossary: Storage / Database / Security

| English Term | Mô tả tiếng Việt ngắn | Rule sử dụng |
|---|---|---|
| **Read Replica** | Bản sao chỉ đọc, đồng bộ bất đồng bộ (async), dùng để tăng read throughput | Không dùng cho failover chính thức (RDS) trừ khi promote thủ công |
| **Encryption at rest** | Mã hoá dữ liệu khi đang lưu trữ (disk, S3 object...) | Luôn nêu rõ dịch vụ/cơ chế liên quan (KMS, EBS encryption, S3 SSE) |
| **Encryption in transit** | Mã hoá dữ liệu khi đang truyền tải qua mạng | Gắn với TLS/SSL, VPN, HTTPS |
| **Least Privilege** | Nguyên tắc chỉ cấp quyền tối thiểu cần thiết để hoàn thành công việc | Nguyên tắc cốt lõi của IAM, nhắc lại ở mọi phần liên quan security |
| **Authentication** | Xác minh danh tính (bạn là ai) | Không nhầm với Authorization |
| **Authorization** | Xác định quyền hạn (bạn được làm gì) | Luôn phân biệt rõ với Authentication khi nói IAM |
| **CMK (Customer Master Key)** | Khóa mã hoá quản lý trong AWS KMS | Phân biệt AWS managed key vs Customer managed key |
| **ElastiCache** | Dịch vụ in-memory caching (Redis/Memcached) của AWS | Nhắc như một caching component tương đương/độc lập với CloudFront cache và DAX; sẽ có file riêng ở nhóm core-services |
| **ECS / Fargate** | Dịch vụ container orchestration (ECS) và serverless compute cho container (Fargate) | Nhắc trong ngữ cảnh so sánh compute (EC2 vs ECS vs Lambda); chưa có file riêng ở lượt hiện tại, sẽ mở rộng sau |

## Glossary: Exam Strategy

| English Term | Mô tả tiếng Việt ngắn | Rule sử dụng |
|---|---|---|
| **Keyword spotting** | Kỹ thuật nhận diện từ khóa trong đề để xác định đúng domain/service | Dùng trong `00-overview/02-exam-strategy.md` |
| **Elimination technique** | Kỹ thuật loại trừ đáp án sai trước khi chọn đáp án đúng | Dùng trong exam strategy và exam drills |
| **MOST cost-effective / MOST operationally efficient** | Cụm từ khóa AWS hay dùng để định hướng tiêu chí chọn đáp án | Giữ nguyên English, viết hoa đúng như đề thi |

## Các cặp thuật ngữ dễ nhầm — phải phân biệt rõ mỗi lần dùng

| Cặp thuật ngữ | Phân biệt ngắn gọn |
|---|---|
| **High Availability vs Fault Tolerance** | HA = giảm downtime, chấp nhận gián đoạn ngắn; FT = không gián đoạn dù có lỗi xảy ra |
| **Security Group vs NACL** | SG = stateful, cấp instance, chỉ allow; NACL = stateless, cấp subnet, có allow/deny |
| **Multi-AZ vs Read Replica** | Multi-AZ = đồng bộ, mục đích failover/HA; Read Replica = bất đồng bộ, mục đích tăng read throughput |
| **Authentication vs Authorization** | Authentication = xác minh danh tính; Authorization = xác định quyền hạn |
| **Scaling up vs Scaling out** | Scaling up (vertical) = tăng cấu hình 1 máy; Scaling out (horizontal) = thêm số lượng máy |
| **Encryption at rest vs Encryption in transit** | At rest = mã hoá dữ liệu lưu trữ; In transit = mã hoá dữ liệu đang truyền tải |

**Liên kết liên quan:** [STYLE-GUIDE.md](./STYLE-GUIDE.md) · [README.md](./README.md)
