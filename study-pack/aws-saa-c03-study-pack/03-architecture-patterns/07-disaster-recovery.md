# Disaster Recovery

Pattern chuẩn bị cho kịch bản mất toàn bộ Region — trọng tâm là RTO/RPO và 4 chiến lược DR chuẩn của AWS.

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

- Hiểu **RTO** và **RPO** và cách chúng định hướng lựa chọn chiến lược DR.
- Nắm 4 chiến lược DR chuẩn: Backup & Restore, Pilot Light, Warm Standby, Multi-site Active/Active.
- Biết đánh đổi giữa chi phí và tốc độ khôi phục ở mỗi chiến lược.

## Practical understanding

### RTO và RPO

- **RTO (Recovery Time Objective)** — đã định nghĩa ở [`GLOSSARY.md`](../GLOSSARY.md) — là thời gian tối đa chấp nhận được để khôi phục dịch vụ sau sự cố. RTO càng nhỏ, yêu cầu hạ tầng dự phòng càng sẵn sàng (và càng tốn chi phí).
- **RPO (Recovery Point Objective)** — lượng dữ liệu tối đa chấp nhận mất, tính theo thời gian trước sự cố (VD: RPO = 1 giờ nghĩa là chấp nhận mất tối đa 1 giờ dữ liệu gần nhất).

RTO/RPO là **input bắt buộc** để chọn đúng chiến lược DR — không có "chiến lược tốt nhất" chung cho mọi trường hợp, chỉ có chiến lược phù hợp với RTO/RPO yêu cầu và ngân sách.

### 4 chiến lược DR chuẩn

| Chiến lược | Mô tả ngắn | RTO/RPO | Chi phí |
|---|---|---|---|
| **Backup & Restore** | Chỉ lưu backup (snapshot) ở Region DR, dựng lại toàn bộ hạ tầng khi có sự cố | RTO/RPO cao nhất (giờ tới ngày) | Thấp nhất |
| **Pilot Light** | Giữ sẵn phần lõi tối thiểu (VD: database instance nhỏ luôn chạy, đồng bộ dữ liệu), scale phần còn lại khi cần | RTO/RPO trung bình-cao | Thấp-trung bình |
| **Warm Standby** | Chạy sẵn phiên bản thu nhỏ đầy đủ của toàn bộ hệ thống ở Region DR, sẵn sàng scale lên khi failover | RTO/RPO trung bình-thấp | Trung bình-cao |
| **Multi-site Active/Active** | Chạy đầy đủ ở nhiều Region đồng thời, traffic được định tuyến (VD: Route 53) tới cả hai | RTO/RPO thấp nhất (gần 0) | Cao nhất |

Thứ tự trên đi từ chi phí thấp/RTO cao (Backup & Restore) tới chi phí cao/RTO gần 0 (Multi-site Active/Active) — đây là **thang trade-off tuyến tính**, càng muốn khôi phục nhanh càng phải trả chi phí duy trì hạ tầng dự phòng cao hơn.

🧠 **Exam mindset:** đề thi hiếm khi nói thẳng tên chiến lược — thường mô tả bằng con số hoặc tình huống ("chấp nhận vài giờ downtime", "cần một phiên bản nhỏ luôn sẵn sàng", "không được gián đoạn dù Region chính sập"). Nhiệm vụ của thí sinh là **dịch mô tả đó thành RTO/RPO tương ứng** rồi chọn đúng 1 trong 4 chiến lược — không phải chọn chiến lược "nghe an toàn nhất".

## Exam focus

### Must know for exam

- RTO/RPO là điểm khởi đầu bắt buộc để chọn chiến lược DR — đề thi luôn cho biết yêu cầu RTO/RPO (hoặc mô tả tương đương) để suy ra chiến lược đúng.
- 4 chiến lược theo thứ tự tăng dần chi phí, giảm dần RTO/RPO: Backup & Restore → Pilot Light → Warm Standby → Multi-site Active/Active.
- Backup không phải là DR đầy đủ — backup chỉ là 1 phần của chiến lược Backup & Restore, cần có kế hoạch khôi phục hạ tầng đi kèm.
- DR khác với HA: HA xử lý sự cố ở quy mô AZ trong 1 Region; DR xử lý sự cố ở quy mô toàn Region (hoặc thảm hoạ lớn hơn).

### Important

- Multi-Region không tự động nghĩa là Multi-site Active/Active — cần traffic thực sự được phục vụ đồng thời ở cả hai Region mới tính là active/active.
- Route 53 Failover routing policy (xem [`07-route53.md`](../02-core-services/07-route53.md)) thường được dùng để tự động chuyển traffic sang Region DR khi Region chính gặp sự cố.

### Nice to know

- Chi tiết công cụ tự động hoá DR (VD: AWS Elastic Disaster Recovery) không phải trọng tâm chính của SAA-C03, chỉ cần hiểu khái niệm chiến lược.

## Decision mindset / decision framework

Khi đề bài cho RTO/RPO cụ thể hoặc mô tả tương đương ("có thể chấp nhận vài giờ downtime", "không được mất quá vài phút dữ liệu", "phải luôn sẵn sàng ngay lập tức dù có sự cố toàn Region"):

1. RTO/RPO tính bằng giờ/ngày, ngân sách hạn chế → **Backup & Restore**.
2. RTO/RPO tính bằng chục phút, cần một phần hạ tầng lõi luôn sẵn sàng → **Pilot Light**.
3. RTO/RPO tính bằng phút, cần khả năng scale nhanh phiên bản thu nhỏ đã chạy sẵn → **Warm Standby**.
4. RTO/RPO gần 0, ngân sách cho phép chạy song song đầy đủ 2 Region → **Multi-site Active/Active**.

## Service mapping

| Nhu cầu DR | Service chính | Vai trò hỗ trợ |
|---|---|---|
| Định tuyến traffic khi failover Region | Route 53 Failover routing policy | Health check để phát hiện Region chính gặp sự cố |
| Đồng bộ dữ liệu database sang Region DR | Cross-Region Read Replica (RDS/Aurora Global Database) | S3 Cross-Region Replication cho dữ liệu object |
| Backup/snapshot cho chiến lược Backup & Restore | EBS Snapshot, RDS Snapshot, S3 | Snapshot copy sang Region DR |
| Hạ tầng compute dự phòng (Pilot Light/Warm Standby) | EC2/ASG scale từ 0 hoặc từ capacity nhỏ | AMI/Launch Template chuẩn hoá sẵn để scale nhanh |

🧠 **Combination phổ biến trong đề:** "Route 53 Failover + Aurora Global Database/Read Replica cross-region + ASG scale-up ở Region DR" là combination kinh điển cho Warm Standby hoặc Pilot Light — đề thi thường mô tả từng phần này riêng lẻ để thí sinh ghép lại đúng chiến lược.

## Trade-offs

| Yếu tố | Đánh đổi |
|---|---|
| RTO/RPO càng nhỏ | Chi phí duy trì hạ tầng dự phòng càng cao |
| Backup & Restore | Rẻ nhất nhưng thời gian khôi phục lâu nhất, rủi ro thao tác thủ công khi khôi phục |
| Multi-site Active/Active | Nhanh nhất nhưng tốn chi phí gấp đôi (chạy đầy đủ ở 2 Region) và phức tạp đồng bộ dữ liệu 2 chiều |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Coi Multi-AZ là chiến lược DR đầy đủ | Multi-AZ đã có "dự phòng" nên nghe như đã an toàn trước mọi sự cố | Multi-AZ chỉ bảo vệ trong phạm vi 1 Region — nếu toàn bộ Region gặp sự cố (thiên tai, mất điện diện rộng), Multi-AZ không giúp ích, cần chiến lược DR đa Region thực sự |
| ❌ Coi backup định kỳ là đã có DR hoàn chỉnh | "Có backup rồi" nghe như đã sẵn sàng cho mọi tình huống mất dữ liệu | Backup chỉ là dữ liệu — DR còn cần kế hoạch dựng lại hạ tầng (compute, network, DNS routing) để dịch vụ hoạt động trở lại; backup không tự động biến thành hệ thống chạy được |
| ❌ Chọn Multi-site Active/Active dù đề bài nhấn "cost-effective" | Active/Active nghe như phương án "tốt nhất", an toàn nhất | Nếu RTO/RPO yêu cầu chỉ ở mức phút/chục phút, Active/Active là over-engineering tốn kém không cần thiết — nên chọn Warm Standby hoặc Pilot Light phù hợp hơn với ngân sách |
| ❌ Cho rằng có Cross-Region Replica là đã đạt RTO thấp | Dữ liệu đã đồng bộ nghe như đã "sẵn sàng ngay" | Read Replica đồng bộ dữ liệu (giúp RPO thấp) nhưng không tự động là một hệ thống đang phục vụ traffic (RTO vẫn cần thời gian promote replica thành primary + chuyển traffic) — RPO thấp không đồng nghĩa RTO thấp |

## Common traps

### ⚠️ Trap: backup vs HA vs DR
Backup chỉ là bản sao dữ liệu tại 1 thời điểm, phục vụ khôi phục sau sự cố — không tự động cung cấp failover (HA) hay chiến lược khôi phục toàn Region (DR). Ba khái niệm phục vụ mục đích khác nhau và bổ trợ lẫn nhau, không thay thế nhau.

### ⚠️ Trap: DR pattern trade-off theo RTO/RPO
Nhiều thí sinh chọn chiến lược DR dựa theo "nghe có vẻ an toàn nhất" thay vì đối chiếu đúng với RTO/RPO đề bài yêu cầu — luôn cần khớp chiến lược với con số RTO/RPO cụ thể, tránh chọn Multi-site Active/Active khi đề chỉ yêu cầu RTO vài giờ (lãng phí chi phí không cần thiết).

### ⚠️ Trap: nghĩ Multi-AZ là đủ cho DR
Multi-AZ (HA pattern) chỉ bảo vệ trước sự cố ở quy mô AZ trong 1 Region — nếu toàn bộ Region gặp sự cố, Multi-AZ không giúp ích, cần chiến lược DR đa Region thực sự.

## Mini scenarios

🧪 **Scenario 1 — Hệ thống quan trọng với RTO/RPO ở mức phút**

**Tình huống:** Hệ thống quan trọng yêu cầu RTO khoảng 10 phút, RPO khoảng 5 phút, ngân sách cho phép duy trì một phiên bản hạ tầng thu nhỏ luôn chạy ở Region DR nhưng không đủ ngân sách chạy đầy đủ 2 Region song song.
**Đáp án đúng:** Warm Standby.
**Vì sao:** RTO/RPO ở mức phút (không phải gần 0) loại trừ Multi-site Active/Active (tốn kém hơn mức cần thiết); yêu cầu có "phiên bản thu nhỏ luôn chạy" loại trừ Backup & Restore/Pilot Light (RTO/RPO cao hơn yêu cầu) — Warm Standby là điểm cân bằng đúng.

🧪 **Scenario 2 — Ứng dụng nội bộ ít quan trọng, ngân sách hạn chế**

**Tình huống:** Ứng dụng báo cáo nội bộ, không phục vụ khách hàng trực tiếp, có thể chấp nhận downtime vài giờ nếu Region chính gặp sự cố, và tổ chức muốn tối thiểu hoá chi phí duy trì DR.
**Đáp án đúng:** Backup & Restore — lưu snapshot định kỳ sang Region DR, chỉ dựng lại hạ tầng khi thực sự cần.
**Vì sao:** RTO/RPO chấp nhận được ở mức giờ và ưu tiên chi phí thấp nhất khớp chính xác với đặc điểm của Backup & Restore — các chiến lược tốn kém hơn (Pilot Light trở lên) là lãng phí không cần thiết cho use case này.

🧪 **Scenario 3 — Anti-pattern: dựa vào Multi-AZ RDS để claim "đã có DR"**

**Tình huống:** Một đội kỹ sư triển khai RDS Multi-AZ và tự tin báo cáo rằng hệ thống đã "sẵn sàng cho thảm hoạ (disaster-ready)" vì database đã có standby tự động failover.
**Đáp án đúng:** Cần triển khai thêm chiến lược DR thực sự ở cấp Region (VD: Read Replica cross-region hoặc Aurora Global Database + kế hoạch dựng hạ tầng ở Region DR), Multi-AZ chỉ là một phần của HA, không phải DR.
**Vì sao đây là anti-pattern cần tránh:** RDS Multi-AZ standby nằm trong AZ khác nhưng **cùng 1 Region** — nếu toàn bộ Region đó gặp sự cố (mất điện diện rộng, thiên tai khu vực), cả primary và standby đều bị ảnh hưởng đồng thời, Multi-AZ hoàn toàn không có tác dụng bảo vệ trong tình huống này.

## Key takeaways

- RTO/RPO là input bắt buộc để chọn chiến lược DR, không có "chiến lược tốt nhất" chung.
- 4 chiến lược DR theo thang tăng dần chi phí, giảm dần RTO/RPO: Backup & Restore, Pilot Light, Warm Standby, Multi-site Active/Active.
- Backup, HA, và DR là ba khái niệm khác mục đích, bổ trợ nhau.
- Multi-AZ không thay thế được chiến lược DR đa Region.

## Checklist tự ôn

- [ ] Tôi giải thích được RTO và RPO bằng ví dụ cụ thể, không nhầm lẫn hai khái niệm.
- [ ] Tôi sắp xếp đúng thứ tự 4 chiến lược DR theo chi phí và RTO/RPO.
- [ ] Tôi phân biệt được backup, HA, và DR.
- [ ] Tôi biết vì sao Multi-AZ không phải là chiến lược DR đầy đủ.

## Xem tiếp / Liên kết liên quan

- [01-high-availability.md](./01-high-availability.md)
- [02-fault-tolerance.md](./02-fault-tolerance.md)
- [../02-core-services/07-route53.md](../02-core-services/07-route53.md)
- [../02-core-services/04-rds-aurora.md](../02-core-services/04-rds-aurora.md)
- [08-migration-and-hybrid.md](./08-migration-and-hybrid.md)
