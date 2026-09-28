# Amazon VPC

Virtual Private Cloud (VPC) — network foundation của mọi kiến trúc AWS, nơi định nghĩa ranh giới mạng riêng tư, kiểm soát traffic ra/vào và giữa các resource.

## Mục lục

- [Mục tiêu học](#mục-tiêu-học)
- [Practical understanding](#practical-understanding)
- [Common architecture layouts](#common-architecture-layouts)
- [Exam focus](#exam-focus)
- [Use cases](#use-cases)
- [Khi nào nên dùng / không nên dùng](#khi-nào-nên-dùng--không-nên-dùng)
- [Anti-patterns / lựa chọn sai thường gặp](#anti-patterns--lựa-chọn-sai-thường-gặp)
- [Common traps](#common-traps)
- [Mini scenarios](#mini-scenarios)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Mục tiêu học

- Hiểu VPC là ranh giới mạng logic riêng tư trong AWS và các thành phần cấu thành nó.
- Phân biệt rõ Security Group vs NACL, Internet Gateway vs NAT Gateway.
- Biết khi nào cần VPC Peering, VPC Endpoint, Transit Gateway, và kết nối hybrid.

## Practical understanding

### VPC là gì

**Amazon VPC** là một mạng ảo riêng tư, biệt lập logic trong AWS, nằm trong 1 Region, cho phép bạn định nghĩa dải địa chỉ IP (CIDR — đã học ở [../01-foundation/03-networking-basics.md](../01-foundation/03-networking-basics.md)), chia subnet, kiểm soát routing, và áp firewall ở nhiều lớp. Đây là "network foundation" vì hầu như mọi service compute/database (EC2, RDS, Lambda trong VPC...) đều chạy bên trong ranh giới của một VPC.

### CIDR áp dụng cho VPC/Subnet

VPC được gán 1 CIDR block chính (VD: `10.0.0.0/16`), sau đó chia thành các **subnet** nhỏ hơn (VD: `10.0.1.0/24`), mỗi subnet nằm trọn trong 1 Availability Zone. Thiết kế CIDR nên để dư địa chỉ cho việc mở rộng subnet sau này.

### Public Subnet vs Private Subnet

- **Public subnet**: subnet có route table trỏ traffic ra ngoài qua **Internet Gateway** — resource trong đó có thể có public IP và giao tiếp trực tiếp hai chiều với Internet.
- **Private subnet**: subnet không có route trực tiếp tới Internet Gateway — resource bên trong không thể được truy cập trực tiếp từ Internet.

⚠️ Lưu ý: một subnet là "public" chỉ vì route table của nó trỏ ra Internet Gateway — **không có nghĩa mọi resource bên trong tự động public**. Một EC2 instance trong public subnet nhưng không có public IP, hoặc Security Group không mở port nào ra ngoài, vẫn không truy cập được từ Internet.

🧠 **Subnet design mindset:** hãy nghĩ "public/private" là thuộc tính của **route table**, không phải của subnet hay resource. Một resource thực sự "public tiếp cận được" cần đủ **3 điều kiện cùng lúc**:

1. Route table của subnet trỏ `0.0.0.0/0` → Internet Gateway.
2. Resource có gán public IP (hoặc Elastic IP).
3. Security Group + NACL cho phép traffic đi qua.

Thiếu 1 trong 3 điều kiện, resource vẫn không "public" theo nghĩa thực tế — đây là lý do vì sao đề thi hay hỏi "vì sao instance này vẫn không truy cập được dù nằm ở public subnet".

### Inbound vs Outbound path — tư duy tách 2 chiều traffic

Khi thiết kế network, luôn tách riêng suy nghĩ về **inbound** (traffic đi vào resource) và **outbound** (traffic đi ra từ resource) — 2 chiều này có thể dùng công cụ hoàn toàn khác nhau:

| Chiều traffic | Ai cần gì | Công cụ phù hợp |
|---|---|---|
| Inbound từ Internet | Resource cần nhận request từ bên ngoài (web server, API public) | Internet Gateway + public IP + Security Group cho phép |
| Outbound ra Internet (từ private subnet) | Resource cần gọi ra ngoài (tải update, gọi API bên thứ ba) nhưng không nhận inbound | NAT Gateway |
| Outbound tới AWS service (S3, DynamoDB...) | Resource cần gọi AWS service mà không cần ra Internet công cộng | VPC Endpoint |

✅ Dùng đúng công cụ cho đúng chiều traffic sẽ giải quyết gần hết câu hỏi networking của SAA-C03 — phần lớn câu hỏi khó chỉ là biến thể của bảng trên.

### NAT Gateway vs VPC Endpoint — về security và cost

| Tiêu chí | NAT Gateway | VPC Endpoint |
|---|---|---|
| Phạm vi | Cho phép ra **toàn bộ Internet** (mọi đích) | Chỉ cho phép tới **1 AWS service cụ thể** (S3, DynamoDB, hoặc service hỗ trợ Interface Endpoint) |
| Bảo mật | Traffic vẫn rời khỏi biên giới AWS network để ra Internet public trước khi tới đích | Traffic không rời khỏi AWS network — private hoàn toàn |
| Chi phí | Tính theo giờ chạy + theo GB dữ liệu xử lý (khá tốn nếu traffic lớn) | Gateway Endpoint (S3/DynamoDB) miễn phí; Interface Endpoint tính phí theo giờ + traffic nhưng thường rẻ hơn NAT cho cùng khối lượng gọi AWS API |
| Khi chọn | Cần gọi ra ngoài AWS (Internet nói chung: cập nhật phần mềm, gọi API bên thứ ba) | Chỉ cần gọi AWS service, muốn giảm chi phí và tăng bảo mật |

🧠 **Exam mindset:** nếu đề chỉ nói "private subnet cần gọi S3/DynamoDB", đáp án tối ưu gần như luôn là VPC Endpoint, **không phải** NAT Gateway — dùng NAT Gateway cho trường hợp này là "technically possible" (traffic vẫn đi qua NAT ra ngoài rồi vòng lại S3) nhưng không phải "best answer" vì tốn chi phí và kém an toàn hơn.

### VPC Peering vs Transit Gateway — theo quy mô tổ chức

| Quy mô | Lựa chọn phù hợp | Vì sao |
|---|---|---|
| 2 VPC cần giao tiếp | VPC Peering | Đơn giản, không tốn chi phí Transit Gateway không cần thiết |
| 3-5 VPC, ít thay đổi | VPC Peering (mesh) vẫn tạm ổn nhưng bắt đầu phức tạp | Số lượng peering connection tăng theo cấp số nhân (n×(n-1)/2) |
| Hàng chục VPC, nhiều account/team, thường xuyên thêm VPC mới | Transit Gateway | 1 hub trung tâm, mỗi VPC chỉ cần 1 kết nối tới hub, dễ quản lý và mở rộng |
| Cần kết nối VPC + on-premises network cùng lúc, nhiều địa điểm | Transit Gateway (kết hợp Direct Connect Gateway) | Transit Gateway hỗ trợ attach cả VPC lẫn VPN/Direct Connect vào cùng 1 hub |



### Route Table

Tập hợp các rule (route) xác định traffic từ subnet sẽ đi đâu tiếp theo (VD: traffic tới `0.0.0.0/0` đi qua Internet Gateway). Mỗi subnet gắn với đúng 1 route table; route table quyết định subnet đó là public hay private.

### Internet Gateway (IGW)

Cổng kết nối cho phép traffic **hai chiều** giữa VPC và Internet. Gắn ở cấp VPC (không phải subnet), và subnet nào có route trỏ tới IGW mới trở thành public subnet.

### NAT Gateway

Cho phép resource trong **private subnet** khởi tạo kết nối **outbound** ra Internet (VD: tải update phần mềm) mà **không cho phép kết nối inbound** từ Internet khởi tạo vào. NAT Gateway đặt trong public subnet, dùng Elastic IP, và route table của private subnet sẽ trỏ traffic ra Internet qua NAT Gateway này.

### Security Group vs NACL

| Tiêu chí | Security Group | NACL |
|---|---|---|
| Phạm vi áp dụng | Cấp instance/ENI | Cấp subnet |
| Trạng thái | Stateful (traffic trả về tự động được phép) | Stateless (phải khai báo rule cả 2 chiều) |
| Loại rule | Chỉ Allow | Cả Allow và Deny |
| Đánh giá rule | Đánh giá tất cả rule cùng lúc | Đánh giá theo thứ tự số rule, dừng ở rule đầu tiên khớp |
| Mặc định | Default deny toàn bộ inbound, allow toàn bộ outbound | Default NACL allow toàn bộ; custom NACL deny toàn bộ cho tới khi thêm rule |

Đây là cặp thuật ngữ dễ nhầm nhất trong Domain 1 — xem thêm quy tắc chung ở [../GLOSSARY.md](../GLOSSARY.md).

### Bastion Host / Access Pattern (mức cần thiết cho SAA)

Khi cần quản trị (SSH/RDP) tới instance trong private subnet, pattern phổ biến là dùng **Bastion Host** đặt trong public subnet làm điểm truy cập trung gian, hoặc dùng **AWS Systems Manager Session Manager** (không cần mở port SSH/RDP trực tiếp, không cần bastion). SAA-C03 chỉ cần biết khái niệm và biết Session Manager là lựa chọn hiện đại hơn, giảm bề mặt tấn công.

### VPC Peering

Kết nối trực tiếp giữa 2 VPC để traffic đi qua như trong cùng mạng, dùng private IP. Giới hạn quan trọng cần nhớ: **không bắc cầu (non-transitive)** — nếu VPC A peer với VPC B, và VPC B peer với VPC C, thì A không tự động giao tiếp được với C qua B; phải tạo peering trực tiếp A-C nếu cần.

### VPC Endpoint

Cho phép resource trong VPC truy cập AWS service (VD: S3, DynamoDB) **mà không cần đi qua Internet** (không qua Internet Gateway/NAT Gateway). Có 2 loại chính:
- **Gateway Endpoint**: dùng cho S3 và DynamoDB, cấu hình qua route table.
- **Interface Endpoint** (dùng AWS PrivateLink): dùng cho phần lớn service khác, tạo ra một ENI với private IP trong subnet.

Dùng VPC Endpoint khi cần private subnet truy cập AWS service mà không muốn mở đường ra Internet (qua NAT Gateway) chỉ để gọi API AWS — vừa an toàn hơn, vừa giảm chi phí NAT Gateway data processing.

### Transit Gateway

Hub trung tâm kết nối nhiều VPC và kết nối on-premises network, giải quyết vấn đề VPC Peering không bắc cầu khi cần kết nối **nhiều VPC với nhau (hub-and-spoke)** — thay vì tạo peering riêng lẻ giữa từng cặp VPC (mesh phức tạp), dùng 1 Transit Gateway làm điểm trung tâm.

### Hybrid Connectivity (mức high-level)

- **Site-to-Site VPN**: kết nối mã hoá qua Internet công cộng giữa on-premises network và VPC — triển khai nhanh, chi phí thấp hơn, nhưng phụ thuộc băng thông Internet.
- **Direct Connect**: kết nối mạng vật lý riêng (dedicated) từ on-premises tới AWS, băng thông ổn định và độ trễ thấp hơn VPN, nhưng thời gian triển khai lâu hơn và chi phí cao hơn.

🧠 **Hybrid connectivity mindset:** đừng nghĩ đây là lựa chọn "chọn 1 trong 2" tuyệt đối — pattern phổ biến trong đề thi là **kết hợp cả 2**: Direct Connect làm kết nối chính cho production ổn định lâu dài, Site-to-Site VPN làm backup/failover hoặc giải pháp tạm trong lúc chờ Direct Connect được thiết lập (vốn mất vài tuần tới vài tháng qua đối tác).

Chi tiết migration/hybrid pattern xem ở [`../03-architecture-patterns/08-migration-and-hybrid.md`](../03-architecture-patterns/08-migration-and-hybrid.md).

### DNS Resolution trong VPC (mức cần thiết)

VPC có DNS resolver nội bộ (Route 53 Resolver) tự động phân giải tên miền nội bộ AWS (VD: private DNS hostname của EC2/RDS) khi thuộc tính `enableDnsSupport`/`enableDnsHostnames` được bật — đủ để hiểu resource trong VPC gọi nhau qua DNS name thay vì chỉ IP.

## Common architecture layouts

Ba layout dưới đây xuất hiện lặp lại trong phần lớn câu hỏi kiến trúc VPC của SAA-C03 — nhận diện được layout nào đang được mô tả giúp trả lời nhanh hơn nhiều so với phân tích từng thành phần riêng lẻ.

### Layout 1: Public ALB + private app + private DB (3-tier chuẩn)

```
Internet
   │
   ▼
[Internet Gateway]
   │
[Public subnet]  ── ALB
   │
[Private subnet] ── App tier (EC2/ECS, Auto Scaling)
   │
[Private subnet – isolated] ── RDS/Aurora (Multi-AZ)
```

- ALB là điểm duy nhất tiếp xúc Internet; app tier và database hoàn toàn ở private subnet.
- App tier gọi ra ngoài (nếu cần) qua NAT Gateway; gọi AWS service (S3, DynamoDB) qua VPC Endpoint.
- ✅ Đây là layout mặc định nên nghĩ tới khi đề mô tả "web application 3 tier, cần bảo mật".

### Layout 2: Private workload truy cập S3 không qua Internet

```
[Private subnet] ── EC2/Lambda
        │
   [Gateway VPC Endpoint cho S3]
        │
       S3
```

- Route table của private subnet có thêm route trỏ tới VPC Endpoint (prefix list của S3), không cần NAT Gateway, không cần Internet Gateway.
- ✅ Dùng khi đề nhấn "không qua Internet", "giảm chi phí NAT", "giữ traffic private hoàn toàn".

### Layout 3: Multi-VPC hub-and-spoke (Transit Gateway)

```
   VPC A ──┐
   VPC B ──┼── [Transit Gateway] ── on-premises (qua Direct Connect/VPN)
   VPC C ──┘
```

- Mỗi VPC chỉ cần 1 kết nối (attachment) tới Transit Gateway thay vì peering riêng lẻ từng cặp.
- ✅ Dùng khi đề mô tả "nhiều team/account, nhiều VPC, cần giao tiếp qua lại và với on-premises".
- ❌ Không dùng VPC Peering làm hub — Peering không bắc cầu, không thay thế được vai trò hub của Transit Gateway.

## Exam focus

### Must know for exam

- Security Group là stateful/allow-only ở cấp instance; NACL là stateless/allow+deny ở cấp subnet — luôn dùng cả hai khi đề yêu cầu defense in depth.
- Internet Gateway cho traffic 2 chiều; NAT Gateway chỉ cho outbound từ private subnet, không nhận inbound connection khởi tạo từ Internet.
- Public subnet ≠ mọi resource bên trong tự động public — vẫn phụ thuộc public IP và Security Group.
- VPC Peering không bắc cầu (non-transitive) — cần Transit Gateway khi kết nối nhiều VPC dạng hub-and-spoke.
- VPC Endpoint dùng khi cần truy cập AWS service riêng tư từ private subnet mà không qua Internet.

### Important

- Site-to-Site VPN triển khai nhanh qua Internet; Direct Connect ổn định/nhanh hơn nhưng cần thời gian setup vật lý.
- Session Manager giảm nhu cầu mở port SSH/RDP so với Bastion Host truyền thống.

### Nice to know

- Chi tiết cấu hình route table/NACL rule cụ thể qua console/CLI — không cần thuộc lòng thao tác, chỉ cần hiểu logic.

## Use cases

- Thiết kế subnet 3-tier: public subnet cho load balancer, private subnet cho application server, private subnet (isolated) cho database.
- Dùng NAT Gateway để server trong private subnet tải bản vá phần mềm mà không lộ ra Internet.
- Dùng VPC Endpoint để Lambda trong private subnet gọi S3 mà không cần NAT Gateway.
- Dùng Transit Gateway khi công ty có hàng chục VPC cần giao tiếp qua lại (multi-account, multi-team).

## Khi nào nên dùng / không nên dùng

| Nhu cầu | Nên dùng | Không nên dùng |
|---|---|---|
| Server cần nhận traffic trực tiếp từ Internet | Public subnet + Internet Gateway | Private subnet (không nhận được inbound) |
| Private subnet cần tải update ra ngoài | NAT Gateway | Internet Gateway đặt trực tiếp cho private subnet (không đúng mô hình) |
| Truy cập S3/DynamoDB từ private subnet không qua Internet | VPC Endpoint (Gateway Endpoint) | NAT Gateway (tốn chi phí, đi vòng không cần thiết) |
| Kết nối 2 VPC đơn giản | VPC Peering | Transit Gateway (over-engineering nếu chỉ có 2 VPC) |
| Kết nối nhiều VPC dạng hub-and-spoke | Transit Gateway | VPC Peering (phức tạp hoá thành full-mesh) |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao người học hay chọn nhầm | Vì sao vẫn sai |
|---|---|---|
| ❌ Đặt RDS/database ở **public subnet** để "cho dễ quản lý/truy cập" | Nghe có vẻ tiện vì có thể connect trực tiếp từ máy cá nhân để debug | Database không cần và không nên tiếp xúc Internet trực tiếp — vi phạm defense in depth, tăng bề mặt tấn công không cần thiết. Đáp án đúng luôn là private subnet + bastion/Session Manager nếu cần truy cập quản trị |
| ❌ Dùng NAT Gateway để "cho phép truy cập inbound" vào private subnet | NAT Gateway nghe giống "gateway kết nối Internet" nên tưởng làm được cả 2 chiều | NAT Gateway chỉ cho outbound khởi tạo từ bên trong VPC ra ngoài — không có cơ chế nào để Internet chủ động kết nối vào qua NAT Gateway |
| ❌ Dùng chuỗi VPC Peering (A-B, B-C) làm "transit hub" thay vì Transit Gateway | Peering đã quen thuộc, quản trị viên nghĩ "nối tiếp là được" | VPC Peering không bắc cầu (non-transitive) — A không tự giao tiếp được với C dù cùng peer với B; kết quả là cần tạo peering rời rạc từng cặp (mesh), không scale được khi có nhiều VPC |
| ❌ Dùng NAT Gateway để gọi S3/DynamoDB thay vì VPC Endpoint | Đơn giản vì NAT Gateway "đã có sẵn" và giải quyết được vấn đề (traffic vẫn tới S3) | Tốn thêm chi phí xử lý dữ liệu qua NAT không cần thiết, và traffic phải rời AWS network trước khi quay lại S3 — kém an toàn và kém tối ưu hơn Gateway VPC Endpoint (miễn phí cho S3/DynamoDB) |

## Common traps

### ⚠️ Trap: Security Group vs NACL
Nhầm lẫn phổ biến nhất — SG stateful/allow-only/cấp instance; NACL stateless/allow+deny/cấp subnet. Đề thi thường hỏi "traffic bị chặn ở đâu" và yêu cầu kiểm tra cả hai lớp.

### ⚠️ Trap: Internet Gateway vs NAT Gateway
IGW cho traffic 2 chiều (inbound + outbound); NAT Gateway chỉ cho outbound từ private subnet, **không dùng cho inbound connection** — đề hỏi "cho phép truy cập từ Internet vào" mà chọn NAT Gateway là sai.

### ⚠️ Trap: public subnet nghĩa là mọi resource bên trong đều public
Một resource trong public subnet vẫn cần public IP + Security Group cho phép mới thực sự truy cập được từ Internet — subnet chỉ quyết định khả năng định tuyến, không tự động expose resource.

### ⚠️ Trap: dùng VPC Peering làm transit hub
VPC Peering không bắc cầu — nếu cần nhiều VPC giao tiếp qua 1 điểm trung tâm, đáp án đúng là Transit Gateway, không phải chuỗi VPC Peering.

## Mini scenarios

🧪 **Scenario 1 — VPC Endpoint cho private workload**

**Tình huống:** Một Lambda function chạy trong private subnet cần đọc/ghi dữ liệu trên S3, yêu cầu không đi qua Internet công cộng vì lý do bảo mật, đồng thời tối ưu chi phí.
**Đáp án đúng:** Tạo Gateway VPC Endpoint cho S3, cấu hình route table của private subnet trỏ tới endpoint này.
**Vì sao:** VPC Endpoint cho phép truy cập S3 hoàn toàn private, không cần NAT Gateway (giảm chi phí xử lý dữ liệu qua NAT) và không expose traffic ra Internet.

🧪 **Scenario 2 — Multi-VPC hub-and-spoke**

**Tình huống:** Một tập đoàn có 12 VPC thuộc 6 team khác nhau, cần cho phép các team giao tiếp qua lại có kiểm soát, đồng thời tất cả đều cần truy cập chung 1 data center on-premises qua Direct Connect.
**Đáp án đúng:** Triển khai Transit Gateway làm hub trung tâm, attach cả 12 VPC và Direct Connect Gateway vào Transit Gateway.
**Vì sao:** Với số lượng VPC lớn và nhu cầu kết nối cả on-premises, Transit Gateway giảm số lượng kết nối cần quản lý (mỗi VPC chỉ 1 attachment) so với việc tạo hàng chục VPC Peering riêng lẻ, đồng thời hỗ trợ attach network on-premises vào cùng hub.

🧪 **Scenario 3 — Anti-pattern: route table sai làm lộ private subnet**

**Tình huống:** Đội bảo mật phát hiện 1 EC2 instance trong subnet lẽ ra là "private" vẫn bị truy cập được từ Internet, dù Security Group đã cấu hình đúng và instance không có Elastic IP công khai theo thiết kế ban đầu.
**Đáp án đúng:** Kiểm tra route table của subnet — khả năng cao có route `0.0.0.0/0` trỏ nhầm tới Internet Gateway, kết hợp việc instance vẫn có public IP tự động gán (auto-assign public IP đang bật).
**Vì sao đây là anti-pattern cần tránh:** Nhiều người chỉ kiểm tra Security Group khi thấy "bị lộ ra ngoài" mà quên rằng route table + auto-assign public IP mới là nguyên nhân gốc — sửa đúng chỗ (route table, tắt auto-assign public IP) và thêm AWS Config rule để giám sát liên tục mới là giải pháp phòng ngừa lâu dài, không chỉ vá Security Group.

## Key takeaways

- VPC là ranh giới network riêng tư; subnet + route table quyết định traffic đi đâu.
- SG (stateful, instance, allow-only) khác NACL (stateless, subnet, allow+deny) — dùng kết hợp cho defense in depth.
- IGW cho 2 chiều, NAT Gateway chỉ outbound từ private subnet.
- VPC Peering phù hợp kết nối đơn giản 2 VPC; Transit Gateway phù hợp kiến trúc nhiều VPC dạng hub-and-spoke.
- VPC Endpoint giữ traffic tới AWS service hoàn toàn private, không qua Internet.

## Checklist tự ôn

- [ ] Tôi phân biệt rõ Security Group và NACL theo 5 tiêu chí ở bảng trên.
- [ ] Tôi giải thích được vì sao NAT Gateway không dùng cho inbound connection.
- [ ] Tôi biết khi nào chọn VPC Peering và khi nào chọn Transit Gateway.
- [ ] Tôi biết khi nào dùng VPC Endpoint thay vì đi qua NAT Gateway/Internet Gateway.

## Xem tiếp / Liên kết liên quan

- [../01-foundation/03-networking-basics.md](../01-foundation/03-networking-basics.md)
- [01-ec2.md](./01-ec2.md)
- [07-route53.md](./07-route53.md)
- [../03-architecture-patterns/08-migration-and-hybrid.md](../03-architecture-patterns/08-migration-and-hybrid.md)
- [14-kms-secrets-manager-parameter-store.md](./14-kms-secrets-manager-parameter-store.md)
