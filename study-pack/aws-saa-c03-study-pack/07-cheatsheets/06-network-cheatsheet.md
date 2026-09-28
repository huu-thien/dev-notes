# Network Cheatsheet

Tóm tắt siêu nhanh VPC, routing, Security Group vs NACL, Route 53/CloudFront/Global Accelerator, hybrid connectivity. Xem [../02-core-services/06-vpc.md](../02-core-services/06-vpc.md) để đào sâu.

## Mục tiêu sử dụng cheatsheet

- Rà nhanh IGW vs NAT Gateway, VPC Peering vs Transit Gateway, VPC Endpoint.
- Phân biệt public subnet vs public resource.
- Chọn đúng Route 53 vs CloudFront vs Global Accelerator theo đúng mục đích.

## Mục lục

- [VPC & Subnet cơ bản](#vpc--subnet-cơ-bản)
- [IGW vs NAT Gateway](#igw-vs-nat-gateway)
- [Security Group vs NACL](#security-group-vs-nacl)
- [Public subnet vs public resource](#public-subnet-vs-public-resource)
- [VPC Endpoint / Transit Gateway / VPC Peering](#vpc-endpoint--transit-gateway--vpc-peering)
- [Route 53 vs CloudFront vs Global Accelerator](#route-53-vs-cloudfront-vs-global-accelerator)
- [Hybrid connectivity: VPN vs Direct Connect](#hybrid-connectivity-vpn-vs-direct-connect)
- [Must remember](#must-remember)
- [Common traps / easy confusion](#common-traps--easy-confusion)
- [Exam keywords](#exam-keywords)
- [Quick decision hints](#quick-decision-hints)
- [Checklist tự rà soát](#checklist-tự-rà-soát)

## VPC & Subnet cơ bản

- VPC là network riêng biệt trong AWS; subnet chia VPC theo AZ.
- Route table quyết định traffic của subnet đi đâu — subnet là "public" hay "private" phụ thuộc vào route table, không phải tự thân subnet.
- Mỗi resource cần đủ 3 điều kiện để thực sự "public tiếp cận được từ Internet": route table trỏ IGW + có public IP + Security Group/NACL cho phép.

## IGW vs NAT Gateway

| Tiêu chí | Internet Gateway (IGW) | NAT Gateway |
|---|---|---|
| Chiều traffic | 2 chiều (inbound + outbound) | Chỉ outbound (từ private subnet ra ngoài) |
| Dùng cho | Resource cần nhận traffic từ Internet (VD: web server public) | Resource ở private subnet cần gọi ra ngoài (VD: tải update, gọi API) mà không nhận kết nối inbound |
| Vị trí đặt | Gắn ở cấp VPC | Đặt trong public subnet, private subnet route qua nó |
| Chi phí | Không tính theo giờ | Tính theo giờ + theo data processed |

## Security Group vs NACL

| Tiêu chí | Security Group | NACL |
|---|---|---|
| Phạm vi | Instance (ENI) | Subnet |
| Stateful/Stateless | Stateful | Stateless |
| Rule | Chỉ allow | Allow và deny |
| Đánh giá | Toàn bộ rule | Theo thứ tự số rule |

> Xem thêm: [03-security-cheatsheet.md](./03-security-cheatsheet.md#security-group-vs-nacl).

## Public subnet vs public resource

- "Public subnet" = subnet có route table trỏ tới IGW.
- "Public resource" = resource thực sự truy cập được từ Internet — cần cả public IP lẫn Security Group/NACL cho phép, không chỉ nằm trong public subnet.
- Bẫy: đặt EC2 trong public subnet nhưng không gán public IP → vẫn không truy cập được từ Internet trực tiếp.
- Bẫy ngược: route table sai (0.0.0.0/0 → IGW) trong 1 subnet lẽ ra phải private → vô tình biến private subnet thành public.

## VPC Endpoint / Transit Gateway / VPC Peering

| Nhu cầu | Công cụ |
|---|---|
| Truy cập AWS service (S3/DynamoDB...) từ private subnet, không qua Internet | VPC Endpoint |
| Kết nối đơn giản 2 VPC | VPC Peering |
| Kết nối nhiều VPC dạng hub-and-spoke (nhiều team/account) | Transit Gateway |

- VPC Peering không bắc cầu (non-transitive) — A-B và B-C peering không tự cho A-C giao tiếp.

## Route 53 vs CloudFront vs Global Accelerator

| Dịch vụ | Vai trò | Không phải |
|---|---|---|
| Route 53 | DNS, routing policy (weighted/latency/failover/geo) | Không phải CDN, không cache nội dung |
| CloudFront | CDN, cache nội dung tĩnh/động ở edge location | Không thay thế DNS routing logic |
| Global Accelerator | Định tuyến traffic qua mạng backbone AWS bằng static anycast IP, cải thiện latency/availability cho TCP/UDP | Không cache nội dung — không phải CDN |

Xem chi tiết: [../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md](../04-comparison-guides/05-cloudfront-vs-route53-vs-global-accelerator.md).

## Hybrid connectivity: VPN vs Direct Connect

| Tiêu chí | Site-to-Site VPN | Direct Connect |
|---|---|---|
| Thiết lập | Nhanh (phút - giờ) | Chậm hơn (tuần - tháng, qua đối tác) |
| Băng thông/độ trễ | Qua Internet công cộng, biến động | Dedicated, ổn định, băng thông cao |
| Chi phí | Thấp hơn | Cao hơn nhưng ổn định lâu dài |
| Dùng khi | Cần kết nối nhanh, tạm thời, hoặc backup | Production lâu dài, cần băng thông cao ổn định |
| Kết hợp | Thường dùng làm backup cho Direct Connect | Kết hợp VPN làm failover |

## Must remember

- IGW = 2 chiều; NAT Gateway = chỉ outbound.
- Security Group = stateful/instance; NACL = stateless/subnet.
- "Public subnet" ≠ "public resource" — cần đủ điều kiện (route + IP + SG/NACL).
- Route 53 = DNS, CloudFront = cache, Global Accelerator = network routing — 3 vai trò hoàn toàn khác nhau.
- Direct Connect cho production ổn định lâu dài; VPN cho thiết lập nhanh/backup.

## Common traps / easy confusion

- Nghĩ NAT Gateway cho phép traffic 2 chiều như IGW — sai, NAT Gateway chỉ outbound.
- Nghĩ đặt trong public subnet là đủ để truy cập từ Internet — sai, còn cần public IP + SG/NACL.
- Nghĩ Global Accelerator là CDN — sai, nó không cache nội dung.
- Nghĩ VPC Peering bắc cầu được (A-B, B-C ⇒ A-C) — sai, cần Transit Gateway cho hub-and-spoke.

## Exam keywords

- "traffic 2 chiều từ Internet" → IGW
- "private subnet cần gọi ra ngoài, không nhận inbound" → NAT Gateway
- "chặn theo instance, tự động traffic trả về" → Security Group
- "chặn theo subnet, cần deny rule" → NACL
- "cache nội dung tĩnh toàn cầu" → CloudFront
- "static anycast IP, network layer routing" → Global Accelerator
- "kết nối hybrid ổn định lâu dài" → Direct Connect
- "kết nối nhanh, tạm thời hoặc backup" → Site-to-Site VPN
- "truy cập S3 từ private subnet không qua Internet" → VPC Endpoint
- "nhiều VPC giao tiếp hub-and-spoke" → Transit Gateway

## Quick decision hints

- Đề hỏi "resource cần nhận kết nối từ Internet" → IGW + public IP + SG cho phép.
- Đề hỏi "private subnet cần update/gọi API AWS mà không lộ ra Internet" → NAT Gateway (traffic ra ngoài chung) hoặc VPC Endpoint (chỉ riêng AWS service).
- Đề hỏi "định tuyến DNS theo latency/failover" → Route 53. Đề hỏi "giảm tải origin bằng cache" → CloudFront. Đề hỏi "cải thiện performance traffic TCP/UDP qua mạng AWS" → Global Accelerator.
- Đề hỏi "kết nối hybrid dùng lâu dài, băng thông cao" → Direct Connect (kèm VPN backup nếu đề nhắc failover).

## Checklist tự rà soát

- [ ] Tôi phân biệt được IGW vs NAT Gateway theo chiều traffic.
- [ ] Tôi phân biệt được Security Group vs NACL theo đủ 4 tiêu chí.
- [ ] Tôi phân biệt được public subnet vs public resource.
- [ ] Tôi phân biệt được Route 53 vs CloudFront vs Global Accelerator.
- [ ] Tôi biết khi nào chọn VPN vs Direct Connect.

## Xem tiếp / Liên kết liên quan

- [03-security-cheatsheet.md](./03-security-cheatsheet.md)
- [../02-core-services/06-vpc.md](../02-core-services/06-vpc.md)
- [../05-exam-drills/03-decision-trees.md](../05-exam-drills/03-decision-trees.md)
- [README.md](./README.md)
