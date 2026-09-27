# Migration and Hybrid Architecture

Pattern về tư duy di chuyển hệ thống lên AWS và duy trì kết nối lai (hybrid) giữa on-premises và cloud.

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

- Hiểu migration mindset và các công cụ chính hỗ trợ migration (DMS, Snow Family).
- Nắm 2 phương án hybrid connectivity: Direct Connect, Site-to-Site VPN.
- Biết khi nào chọn online migration vs offline/bulk migration.

## Practical understanding

### Migration mindset

Migration không chỉ là "chuyển máy chủ lên cloud" — cần xác định rõ: dữ liệu di chuyển bằng đường nào (network hay vật lý), có cần đồng bộ liên tục trong lúc chuyển (minimal downtime) hay có thể chấp nhận downtime, và hạ tầng đích có cần giữ kết nối ngược về on-premises sau khi migrate hay không (hybrid lâu dài hay chỉ migration tạm thời).

🧠 **Exam mindset:** đề thi thường tách rõ 2 câu hỏi riêng biệt dù cùng chủ đề "migration": (1) **làm sao chuyển dữ liệu sang AWS** (DMS/Snow Family — migration service) và (2) **làm sao kết nối mạng giữa on-premises và AWS** (Direct Connect/VPN — connectivity solution). Đừng nhầm hai câu hỏi này — một dịch vụ connectivity như Direct Connect không phải là công cụ migration, nó chỉ là đường truyền.

### AWS DMS (Database Migration Service)

**AWS DMS** hỗ trợ di chuyển database lên AWS (hoặc giữa các database), hỗ trợ cả **homogeneous** (cùng loại engine, VD: MySQL → RDS MySQL) và **heterogeneous** (khác loại engine, VD: Oracle → Aurora, thường kết hợp AWS Schema Conversion Tool). DMS hỗ trợ **replicate liên tục** trong lúc migrate, giúp giảm downtime — ứng dụng vẫn chạy trên database nguồn cho tới khi sẵn sàng cutover.

### Snow Family

**Snow Family** (Snowcone, Snowball, Snowmobile) là thiết bị vật lý AWS cung cấp để di chuyển dữ liệu **khối lượng lớn** khi truyền qua network không khả thi (quá chậm hoặc quá tốn chi phí băng thông). Dữ liệu được nạp vào thiết bị tại chỗ, gửi vật lý về AWS để nạp vào S3 — đây là hình thức **offline/bulk migration**.

### Direct Connect và Site-to-Site VPN

Hai phương án **hybrid connectivity** đã giới thiệu ở [`06-vpc.md`](../02-core-services/06-vpc.md), nhắc lại ở góc nhìn migration/hybrid:

| Phương án | Đặc điểm | Phù hợp |
|---|---|---|
| **Site-to-Site VPN** | Kết nối qua Internet công cộng, mã hoá IPsec, triển khai nhanh | Cần kết nối nhanh, khối lượng traffic vừa phải, chấp nhận độ trễ/băng thông phụ thuộc Internet |
| **Direct Connect** | Kết nối vật lý riêng tới AWS, băng thông ổn định, độ trễ thấp hơn | Traffic lớn, ổn định, cần độ trễ thấp và nhất quán (VD: hybrid lâu dài, replicate dữ liệu liên tục) |

### Hybrid connectivity trong migration

Nhiều tổ chức không migrate toàn bộ cùng lúc — hybrid connectivity (VPN hoặc Direct Connect) cho phép một phần hệ thống vẫn chạy on-premises trong khi phần khác đã chuyển lên AWS, giao tiếp qua kết nối riêng tư thay vì Internet công cộng.

### Online migration vs offline/bulk migration

- **Online migration**: di chuyển qua network (DMS, DataSync, hoặc Direct Connect/VPN), phù hợp khi khối lượng dữ liệu vừa phải và cần giảm downtime.
- **Offline/bulk migration**: dùng Snow Family khi khối lượng dữ liệu quá lớn (VD: hàng trăm TB tới PB) khiến việc truyền qua network mất quá nhiều thời gian hoặc chi phí băng thông quá cao.

⚠️ **Bẫy hay gặp:** đừng vội chọn Snow Family chỉ vì đề bài nhắc "dữ liệu lớn" — cần đối chiếu với **băng thông mạng hiện có** và **thời gian cho phép**. Vài chục TB với đường truyền tốt và vài tuần thời gian vẫn có thể truyền online hợp lý; Snow Family chỉ thắng thế khi bài toán vượt ngưỡng thực tế của network.

## Exam focus

### Must know for exam

- DMS dùng để migrate database, hỗ trợ đồng bộ liên tục để giảm downtime khi cutover.
- Snow Family dùng cho migration dữ liệu khối lượng cực lớn khi network không khả thi — đây là offline/bulk migration.
- Site-to-Site VPN triển khai nhanh qua Internet; Direct Connect ổn định hơn, băng thông cao hơn, cần thời gian setup lâu hơn (thường vài tuần).
- Direct Connect không phải lúc nào cũng là đáp án đúng — nếu đề bài cần triển khai nhanh hoặc traffic không lớn, Site-to-Site VPN phù hợp hơn.

### Important

- DMS thường đi kèm AWS Schema Conversion Tool (SCT) khi migration heterogeneous (khác engine database).
- Có thể kết hợp Site-to-Site VPN làm backup connectivity cho Direct Connect (failover) trong kiến trúc hybrid quan trọng.

### Nice to know

- Chi tiết dung lượng cụ thể của từng loại thiết bị Snow Family thay đổi theo thời gian.

> Cần verify lại theo AWS official docs mới nhất.

## Decision mindset / decision framework

Khi đề bài mô tả nhu cầu migration hoặc kết nối hybrid:

1. Xác định loại dữ liệu: database (có schema) → DMS; file/object lớn không cấu trúc → so sánh network transfer vs Snow Family theo khối lượng.
2. Nếu khối lượng dữ liệu cực lớn và network hạn chế (băng thông thấp, chi phí cao, thời gian truyền quá lâu) → Snow Family.
3. Nếu cần kết nối hybrid dài hạn, traffic lớn, ổn định → Direct Connect.
4. Nếu cần triển khai nhanh, traffic vừa phải, hoặc dùng tạm/backup → Site-to-Site VPN.
5. Nếu cần giảm downtime khi migrate database → DMS với chế độ replicate liên tục, cutover khi đã đồng bộ xong.

## Service mapping

| Nhu cầu | Service chính | Vai trò hỗ trợ |
|---|---|---|
| Migrate database (có schema) | AWS DMS | AWS Schema Conversion Tool (SCT) cho heterogeneous migration |
| Di chuyển dữ liệu khối lượng cực lớn, network hạn chế | Snow Family (Snowcone/Snowball/Snowmobile) | S3 làm điểm đến sau khi thiết bị được nạp lại vào AWS |
| Kết nối hybrid dài hạn, traffic lớn ổn định | Direct Connect | Site-to-Site VPN làm backup connectivity (failover) |
| Kết nối hybrid nhanh, tạm thời hoặc traffic vừa phải | Site-to-Site VPN | VPN over Internet công cộng, mã hoá IPsec |

🧠 **Combination phổ biến trong đề:** "cần migrate database với downtime tối thiểu + vẫn cần kết nối on-premises trong giai đoạn chuyển tiếp" → DMS (đồng bộ liên tục) chạy qua **Direct Connect hoặc Site-to-Site VPN** (tuỳ tốc độ triển khai/độ ổn định cần thiết) — hai lớp dịch vụ phối hợp, không loại trừ nhau.

## Trade-offs

| Yếu tố | Đánh đổi |
|---|---|
| DMS online migration | Giảm downtime nhưng cần thời gian đồng bộ và giám sát trong lúc replicate |
| Snow Family | Di chuyển khối lượng lớn hiệu quả nhưng có độ trễ vật lý (thời gian vận chuyển thiết bị) |
| Direct Connect | Ổn định, băng thông cao nhưng chi phí cao hơn và thời gian setup lâu hơn VPN |
| Site-to-Site VPN | Triển khai nhanh, chi phí thấp hơn nhưng phụ thuộc chất lượng Internet công cộng |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Chọn Direct Connect cho mọi bài toán hybrid | Direct Connect là giải pháp "chuẩn nhất, ổn định nhất" nên dễ mặc định chọn | Direct Connect cần thời gian setup dài (thường vài tuần) — nếu đề bài cần kết nối gấp hoặc traffic không lớn, Site-to-Site VPN là đáp án đúng hơn nhiều |
| ❌ Chọn online migration (DMS/network transfer) dù dữ liệu quá lớn/đường truyền quá yếu | Online migration nghe "hiện đại" hơn, không cần gửi thiết bị vật lý | Nếu khối lượng dữ liệu vượt xa khả năng băng thông trong thời gian cho phép, truyền qua network sẽ mất hàng tuần/tháng — Snow Family (offline/bulk) mới thực tế hơn trong trường hợp này |
| ❌ Nhầm connectivity solution (Direct Connect/VPN) với migration service (DMS/Snow Family) | Cả hai đều "liên quan tới AWS và on-premises" | Connectivity solution chỉ là đường truyền mạng, không tự động di chuyển hay đồng bộ dữ liệu database — cần DMS/Snow Family thực hiện việc di chuyển dữ liệu thực sự, kết nối chỉ là hạ tầng bên dưới |
| ❌ Nghĩ DMS chỉ dùng được khi nguồn và đích cùng loại engine | "Migration service" nghe như chỉ chuyển y nguyên dữ liệu | DMS hỗ trợ cả heterogeneous migration (khác engine, VD: Oracle → Aurora) khi kết hợp Schema Conversion Tool — giới hạn suy nghĩ này khiến thí sinh bỏ lỡ đáp án đúng khi đề bài yêu cầu đổi engine database |

## Common traps

### ⚠️ Trap: hybrid connectivity không phải lúc nào Direct Connect cũng là đáp án đúng
Đây là bẫy trọng tâm của file này. Đề thi hay gợi ý "cần kết nối nhanh chóng" hoặc "triển khai trong vài ngày" — Direct Connect cần thời gian setup dài hơn nhiều so với Site-to-Site VPN, nên VPN mới là đáp án đúng trong các tình huống cần triển khai gấp.

### ⚠️ Trap: nghĩ Snow Family luôn tốt hơn network transfer
Snow Family chỉ nên dùng khi khối lượng dữ liệu đủ lớn để việc vận chuyển vật lý nhanh hơn truyền qua mạng — với dữ liệu nhỏ/vừa, DMS/DataSync qua network vẫn nhanh và đơn giản hơn.

### ⚠️ Trap: nghĩ DMS chỉ dùng khi cùng loại engine
DMS hỗ trợ cả heterogeneous migration (khác engine, VD: Oracle sang Aurora) khi kết hợp Schema Conversion Tool, không chỉ giới hạn ở cùng loại engine.

## Mini scenarios

🧪 **Scenario 1 — Kết nối hybrid gấp, traffic không lớn**

**Tình huống:** Công ty cần lập tức thiết lập kết nối riêng giữa on-premises và VPC để test tích hợp trong tuần này, khối lượng traffic không lớn, sẽ đánh giá nâng cấp lên kết nối ổn định hơn sau nếu cần.
**Đáp án đúng:** Site-to-Site VPN.
**Vì sao:** Yêu cầu triển khai trong tuần này loại trừ Direct Connect (thường mất nhiều tuần để thiết lập); khối lượng traffic không lớn phù hợp với VPN qua Internet công cộng.

🧪 **Scenario 2 — Di chuyển 500TB dữ liệu với đường truyền hạn chế**

**Tình huống:** Công ty cần di chuyển 500TB dữ liệu video từ trung tâm dữ liệu on-premises lên S3, đường truyền Internet hiện tại chỉ đạt băng thông thấp, ước tính truyền qua mạng sẽ mất nhiều tháng.
**Đáp án đúng:** AWS Snowball (hoặc Snowmobile tuỳ quy mô), vận chuyển vật lý thiết bị chứa dữ liệu tới AWS để nạp vào S3.
**Vì sao:** Khối lượng dữ liệu cực lớn kết hợp băng thông mạng hạn chế khiến network transfer không khả thi về thời gian — đây đúng use case của offline/bulk migration bằng Snow Family.

🧪 **Scenario 3 — Anti-pattern: dùng Direct Connect để giải quyết nhu cầu kết nối tạm thời**

**Tình huống:** Một đội hạ tầng cần kết nối tạm thời giữa văn phòng chi nhánh mới (dự kiến đóng cửa sau 2 tháng) và VPC để test một dự án ngắn hạn, nhưng đề xuất dùng Direct Connect vì "đây là giải pháp kết nối chuẩn của AWS".
**Đáp án đúng:** Site-to-Site VPN — triển khai trong vài giờ tới vài ngày, phù hợp nhu cầu tạm thời và ngắn hạn, dễ tháo bỏ khi không còn cần.
**Vì sao đây là anti-pattern cần tránh:** Direct Connect cần quy trình đặt hàng qua AWS Direct Connect Partner, kéo dài thường vài tuần tới vài tháng để thiết lập vật lý — hoàn toàn không phù hợp cho nhu cầu kết nối chỉ tồn tại trong 2 tháng, vừa tốn thời gian chờ vừa lãng phí chi phí thiết lập.

## Key takeaways

- DMS phục vụ migration database, hỗ trợ đồng bộ liên tục để giảm downtime.
- Snow Family phục vụ migration dữ liệu khối lượng cực lớn khi network không khả thi.
- Site-to-Site VPN triển khai nhanh, Direct Connect ổn định hơn nhưng cần thời gian setup lâu hơn.
- Direct Connect không phải đáp án mặc định cho mọi bài toán hybrid — cần xét cả tốc độ triển khai và khối lượng traffic.

## Checklist tự ôn

- [ ] Tôi biết khi nào dùng DMS và khi nào cần thêm Schema Conversion Tool.
- [ ] Tôi biết khi nào Snow Family phù hợp hơn network transfer.
- [ ] Tôi phân biệt được Site-to-Site VPN và Direct Connect theo tốc độ triển khai và độ ổn định.
- [ ] Tôi biết vì sao Direct Connect không phải lúc nào cũng là đáp án đúng.

## Xem tiếp / Liên kết liên quan

- [../02-core-services/06-vpc.md](../02-core-services/06-vpc.md)
- [07-disaster-recovery.md](./07-disaster-recovery.md)
- [../04-comparison-guides/README.md](../04-comparison-guides/README.md)
