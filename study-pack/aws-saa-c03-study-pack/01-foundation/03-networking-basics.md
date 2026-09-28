# Networking Basics

CIDR, public/private IP, DNS cơ bản, và routing mindset — kiến thức cần có trước khi học chi tiết Amazon VPC.

## Mục lục

- [Mục tiêu học](#mục-tiêu-học)
- [Practical understanding](#practical-understanding)
- [Exam focus](#exam-focus)
- [Common traps](#common-traps)
- [Mini scenario](#mini-scenario)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Mục tiêu học

- Đọc hiểu và tính toán cơ bản CIDR block.
- Phân biệt public IP và private IP, khi nào một resource cần loại nào.
- Hiểu DNS resolution cơ bản trước khi học Route 53.
- Có "routing mindset": traffic muốn đi từ A đến B phải qua route nào.

## Practical understanding

- **CIDR (Classless Inter-Domain Routing)**: cách biểu diễn một dải địa chỉ IP, dạng `10.0.0.0/16`. Số sau dấu `/` là số bit cố định cho network — số càng nhỏ, dải địa chỉ càng lớn (`/16` lớn hơn `/24` rất nhiều).
- **Private IP**: địa chỉ trong dải riêng (VD: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), không định tuyến được trên Internet công cộng, dùng cho giao tiếp nội bộ VPC.
- **Public IP**: địa chỉ định tuyến được trên Internet, cần thiết khi resource phải được truy cập/truy cập ra Internet trực tiếp.
- **DNS (Domain Name System)**: cơ chế phân giải tên miền (`example.com`) thành địa chỉ IP. AWS cung cấp Route 53 làm managed DNS service.
- **Routing mindset**: mọi traffic trong mạng cần một route entry chỉ ra "đi đâu tiếp theo" — đây là nền tảng để hiểu Route Table trong VPC sau này (chưa đi sâu route table ở file này).

## Exam focus

### Must know for exam

- Biết đọc CIDR để xác định một dải IP có đủ lớn cho nhu cầu subnet hay không (VD: `/24` = 256 địa chỉ, trừ đi các địa chỉ AWS reserve).
- Resource cần truy cập trực tiếp từ Internet (VD: public-facing web server) cần public IP hoặc đứng sau tài nguyên có public IP (ALB, NAT Gateway).
- Resource nội bộ (VD: database) nên chỉ có private IP, không expose public IP.

### Important

- Elastic IP là public IP tĩnh có thể gán/thu hồi độc lập với vòng đời instance — khác với public IP tự động cấp (thay đổi khi restart).

### Nice to know

- Chi tiết thuật toán subnetting nâng cao (VLSM phức tạp) không cần thiết cho SAA-C03 — chỉ cần đọc hiểu và ước lượng số địa chỉ.

## Common traps

### Trap: nhầm số bit CIDR nhỏ với dải địa chỉ nhỏ
Số sau `/` càng **nhỏ**, dải địa chỉ càng **lớn**. `/16` (65536 địa chỉ) lớn hơn nhiều so với `/24` (256 địa chỉ) — dễ nhầm ngược.

### Trap: nghĩ private IP không thể giao tiếp ra ngoài
Private IP không tự định tuyến trên Internet, nhưng vẫn có thể ra Internet gián tiếp qua NAT Gateway/NAT Instance (outbound only) — sẽ học chi tiết ở phần VPC.

## Mini scenario

**Tình huống:** Cần một dải địa chỉ VPC đủ lớn để chia thành nhiều subnet cho các tầng khác nhau (web, app, database) ở nhiều AZ, tối thiểu vài nghìn địa chỉ.
**Đáp án đúng:** Chọn CIDR block dạng `/16` (VD: `10.0.0.0/16`) cho VPC, sau đó chia nhỏ thành các subnet `/24` cho từng tầng/AZ.
**Vì sao:** `/16` cho ~65,536 địa chỉ, đủ dư để chia nhiều subnet `/24` (256 địa chỉ mỗi subnet) mà không lo hết địa chỉ khi mở rộng.

## Key takeaways

- CIDR notation: số bit nhỏ hơn = dải địa chỉ lớn hơn.
- Public IP dùng cho resource cần truy cập trực tiếp từ Internet; private IP cho giao tiếp nội bộ.
- DNS là lớp phân giải tên miền — nền tảng để hiểu Route 53 sau này.

## Checklist tự ôn

- [ ] Tôi tính được số địa chỉ IP tương ứng với một CIDR block cho trước.
- [ ] Tôi phân biệt được khi nào resource cần public IP, khi nào chỉ cần private IP.
- [ ] Tôi hiểu khái quát vai trò của DNS trước khi học Route 53.

## Xem tiếp / Liên kết liên quan

- [01-global-infrastructure.md](./01-global-infrastructure.md)
- [02-iam-basics.md](./02-iam-basics.md)
- [../02-core-services/06-vpc.md](../02-core-services/06-vpc.md)
- [../02-core-services/07-route53.md](../02-core-services/07-route53.md)
