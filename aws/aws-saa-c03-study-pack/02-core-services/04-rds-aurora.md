# Amazon RDS and Aurora

Managed relational database service (RDS) và Amazon Aurora — nền tảng cho workload cần dữ liệu có cấu trúc, quan hệ, và giao dịch (transaction) chặt chẽ.

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

- Hiểu managed relational database mindset và các cơ chế backup/HA của RDS.
- Phân biệt rõ Multi-AZ và Read Replica — hai khái niệm dễ nhầm nhất của RDS.
- Hiểu Aurora khác gì so với RDS "classic" và khi nào nên chọn Aurora.

## Practical understanding

### RDS là gì — managed relational database mindset

**Amazon RDS** quản lý phần lớn công việc vận hành database quan hệ (provisioning, patching OS/engine, backup, failover) — bạn chỉ tập trung vào schema, query, và dữ liệu, thay vì tự cài đặt/vá lỗi database engine như khi chạy trên EC2.

### Engines (mức đủ scope SAA-C03)

RDS hỗ trợ nhiều engine quan hệ phổ biến: MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, và Amazon Aurora (engine riêng của AWS). SAA-C03 không yêu cầu biết chi tiết khác biệt SQL syntax giữa các engine — chỉ cần biết RDS là managed service chung cho các engine quan hệ này.

### Backup, Automated Backup, Snapshots

- **Automated Backup**: RDS tự động backup hàng ngày + lưu transaction log, cho phép **point-in-time recovery** trong khoảng thời gian retention đã cấu hình (thường 1-35 ngày).
- **Manual Snapshot**: bản backup thủ công do người dùng chủ động tạo, giữ lại **vô thời hạn** cho tới khi bị xoá thủ công (khác với automated backup bị xoá khi hết retention hoặc khi xoá instance nếu không cấu hình giữ lại).

Backup/snapshot phục vụ mục đích **khôi phục dữ liệu (Durability)**, không phải cơ chế đảm bảo **High Availability** — khôi phục từ snapshot luôn tạo ra instance mới và tốn thời gian, không phải failover tức thời.

### Multi-AZ

Khi bật Multi-AZ, RDS tự động duy trì một bản sao đồng bộ (synchronous replica) ở một AZ khác trong cùng Region. Khi instance chính gặp sự cố, RDS tự động **failover** sang bản sao này (thông qua đổi DNS endpoint), không cần can thiệp thủ công. Mục đích chính: **High Availability** và **Fault Tolerance**, không phải để tăng khả năng đọc.

✅ Dùng Multi-AZ khi: đề nhấn "tự động phục hồi khi AZ lỗi", "giảm downtime", "không cần can thiệp thủ công".
❌ Không dùng Multi-AZ khi: mục tiêu là giảm tải đọc (đó là vai trò của Read Replica) hoặc cần failover cross-Region (Multi-AZ chỉ hoạt động trong cùng Region).

### Read Replica

Bản sao **bất đồng bộ (asynchronous)** của database, dùng để **tăng read throughput** bằng cách phân tải các truy vấn đọc sang replica, giảm tải cho instance chính (vốn dùng cho ghi). Read Replica có thể đặt cùng Region hoặc khác Region (cross-Region), và có thể **promote** thành instance độc lập nếu cần, nhưng đây là thao tác thủ công, không tự động như Multi-AZ failover.

✅ Dùng Read Replica khi: đề nhấn "giảm tải truy vấn đọc/báo cáo", "tách read traffic khỏi write traffic", "cần bản sao ở Region khác cho DR (kèm bước promote thủ công/tự động hoá riêng)".
❌ Không dùng Read Replica khi: mục tiêu là tự động failover ngay khi primary lỗi — Read Replica không tự làm việc này.

🧠 **Write-heavy vs read-heavy signal:**

| Tín hiệu trong đề | Hướng giải quyết |
|---|---|
| "Nhiều truy vấn SELECT/báo cáo, ghi ổn định" (read-heavy) | Thêm Read Replica |
| "Ghi tăng liên tục, cần scale ghi theo chiều ngang" (write-heavy, vượt khả năng 1 writer instance) | Cân nhắc chuyển 1 phần dữ liệu sang DynamoDB, hoặc Aurora (viết vẫn qua 1 writer nhưng storage layer mạnh hơn) — RDS/Aurora không tự scale ghi theo chiều ngang như DynamoDB |
| "Cần cả 2: tự động phục hồi khi lỗi VÀ giảm tải đọc" | Bật Multi-AZ **và** thêm Read Replica — đây là 2 nhu cầu độc lập, không thể dùng 1 cơ chế giải quyết cả 2 |

### Failover reasoning — điều gì thực sự xảy ra

Khi Multi-AZ failover, RDS **không tạo instance mới** — nó chuyển đổi vai trò primary sang standby đã tồn tại sẵn (đã đồng bộ dữ liệu) và cập nhật DNS endpoint để trỏ sang instance mới đó. Đây là lý do failover Multi-AZ nhanh (thường 60-120 giây) so với khôi phục từ snapshot (tạo instance hoàn toàn mới, phải restore dữ liệu — có thể mất nhiều phút tới hàng giờ tùy kích thước).



### Aurora — khác gì so với RDS "classic"

**Amazon Aurora** là database engine riêng của AWS, tương thích API với MySQL/PostgreSQL nhưng có kiến trúc storage khác biệt: dữ liệu được lưu trên **storage layer phân tán, tự động nhân bản 6 bản sao trên 3 AZ**, tách rời khỏi compute layer. Điều này giúp Aurora có:
- **Failover nhanh hơn** RDS Multi-AZ thông thường (thường vài chục giây).
- **Aurora Replica**: tối đa 15 replica (nhiều hơn giới hạn Read Replica của RDS thông thường), có thể tự động trở thành writer mới khi failover mà không cần tạo instance mới từ đầu.
- **Aurora Serverless**: phiên bản tự động co giãn capacity theo tải, phù hợp workload không liên tục/khó dự đoán.

> Cần verify lại theo AWS official docs mới nhất — số lượng bản sao storage, giới hạn số replica, và thời gian failover cụ thể có thể thay đổi.

🧠 **Aurora khác RDS classic ở đâu — theo đúng mức exam cần:** đề thi hiếm khi hỏi chi tiết kiến trúc storage của Aurora; thứ đề thi thực sự test là liệu bạn có nhận ra **tín hiệu** "cần relational nhưng hiệu năng/HA cao hơn RDS chuẩn" để chọn Aurora thay vì mặc định RDS. Nếu đề không có tín hiệu đó (workload nhỏ, ngân sách hạn chế, không nhấn hiệu năng), RDS chuẩn vẫn là lựa chọn hợp lý và rẻ hơn — Aurora không phải lựa chọn "luôn luôn tốt hơn mặc định".

### Relational workload signals — khi nào bài toán "chắc chắn là relational"

- Đề nhắc "transaction", "ACID", "JOIN nhiều bảng", "ràng buộc khoá ngoại (foreign key)", "báo cáo tổng hợp phức tạp".
- Dữ liệu có cấu trúc rõ ràng, quan hệ giữa các entity ổn định theo thời gian (không đổi schema liên tục).
- Ứng dụng ngân hàng, ERP, hệ thống đặt vé/đặt chỗ (cần đảm bảo không đặt trùng).

## Decision logic

| Câu hỏi cần trả lời | Chỉ báo trong đề | Hướng quyết định |
|---|---|---|
| Có cần transaction ACID/JOIN không? | "transaction", "quan hệ", "ràng buộc dữ liệu" | Có → RDS/Aurora. Không, chỉ cần key-value → cân nhắc [DynamoDB](./05-dynamodb.md) |
| Cần tự động phục hồi khi AZ lỗi? | "tự động", "không downtime đáng kể", "failover" | Có → Multi-AZ (RDS) hoặc Aurora |
| Cần giảm tải đọc/báo cáo? | "nhiều truy vấn đọc", "báo cáo", "analytics" | Có → Read Replica (không phải Multi-AZ) |
| Cần hiệu năng/HA cao hơn RDS chuẩn, vẫn tương thích MySQL/PostgreSQL? | "cao cấp hơn", "hiệu năng doanh nghiệp", "mission-critical" | Có → Aurora. Không có tín hiệu này → RDS chuẩn vẫn đủ |
| Traffic khó dự đoán, tải không liên tục? | "tải không đều", "tối ưu chi phí khi idle" | Có → Aurora Serverless |

## Exam focus

### Must know for exam

- **Multi-AZ ≠ Read Replica**: Multi-AZ = đồng bộ, mục đích HA/failover tự động; Read Replica = bất đồng bộ, mục đích tăng read throughput.
- **Backup/Snapshot ≠ High Availability**: khôi phục từ snapshot tạo instance mới, mất thời gian — không phải cơ chế failover tức thời.
- Aurora có failover nhanh hơn và replica linh hoạt hơn RDS thông thường — chọn Aurora khi đề nhấn mạnh hiệu năng/khả năng phục hồi cao cho workload quan hệ.
- Read Replica giải quyết **scaling đọc**; để scaling ghi, cần thiết kế lại kiến trúc (sharding, chuyển sang NoSQL) — RDS/Aurora không tự động scale ghi theo chiều ngang.

### Important

- Read Replica có thể promote thành instance độc lập (dùng trong DR cross-Region), nhưng là thao tác thủ công.
- Aurora Serverless phù hợp workload có tải không liên tục, giảm chi phí khi idle.

### Nice to know

- Chi tiết cấu hình parameter group, option group theo từng engine — không cần thuộc lòng cho kỳ thi.

## Use cases

- Ứng dụng thương mại điện tử cần transaction ACID chặt chẽ (đơn hàng, thanh toán).
- Hệ thống cần tăng khả năng đọc báo cáo mà không ảnh hưởng hiệu năng ghi (Read Replica).
- Ứng dụng cần độ sẵn sàng cao, failover tự động khi AZ gặp sự cố (Multi-AZ hoặc Aurora).
- Workload tải không đều, khó dự đoán (Aurora Serverless).

## Khi nào nên dùng / không nên dùng

| Nhu cầu | Nên dùng | Không nên dùng |
|---|---|---|
| Dữ liệu có quan hệ, cần transaction ACID | RDS/Aurora | DynamoDB (không tối ưu cho join phức tạp) |
| Cần failover tự động khi 1 AZ lỗi | Multi-AZ (RDS) hoặc Aurora (failover nhanh hơn) | Chỉ dùng snapshot backup (không tự động, chậm) |
| Cần giảm tải đọc cho báo cáo/analytics | Read Replica | Multi-AZ đơn thuần (không tối ưu cho mục đích đọc) |
| Cần scale ghi theo chiều ngang, dữ liệu không quan hệ chặt | Cân nhắc DynamoDB (xem [05-dynamodb.md](./05-dynamodb.md)) | RDS/Aurora (giới hạn scale ghi theo instance) |
| Tải không liên tục, khó dự đoán capacity | Aurora Serverless | RDS instance cố định (lãng phí khi idle) |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Thêm Read Replica để giải quyết yêu cầu High Availability | Read Replica "nghe giống" một bản sao dự phòng có thể dùng khi lỗi | Read Replica là bất đồng bộ và **không tự động failover** — cần promote thủ công/tự động hóa runbook riêng; nếu đề cần failover tự động, đáp án đúng là Multi-AZ |
| ❌ Dùng automated backup/snapshot làm giải pháp availability | Có backup thì "yên tâm dữ liệu không mất, hệ thống vẫn ổn" | Backup chỉ đảm bảo Durability — khôi phục từ snapshot luôn tạo instance mới, mất thời gian đáng kể, không phải cơ chế giảm downtime |
| ❌ Chọn DynamoDB khi bài toán vẫn cần JOIN/transaction đa bảng phức tạp | DynamoDB "nghe hiện đại, scale tốt hơn" nên mặc định chọn cho mọi bài toán mới | DynamoDB không tối ưu cho quan hệ dữ liệu phức tạp/join nhiều bảng — ép dữ liệu quan hệ vào DynamoDB làm tăng độ phức tạp ứng dụng, mất đi lợi ích ACID/JOIN sẵn có của RDS/Aurora |
| ❌ Luôn chọn Aurora vì "tốt hơn RDS" bất kể ngân sách | Aurora được quảng bá hiệu năng cao hơn nên mặc định là lựa chọn "an toàn" | Nếu đề không có tín hiệu cần hiệu năng/HA cao hơn và có ràng buộc chi phí, RDS chuẩn vẫn là best answer — Aurora tốn kém hơn không cần thiết |

## Common traps

### ⚠️ Trap: Multi-AZ vs Read Replica
Đề hỏi "tăng tính sẵn sàng khi AZ lỗi" → Multi-AZ. Đề hỏi "giảm tải truy vấn đọc" → Read Replica. Nhầm lẫn hai khái niệm này là lỗi phổ biến nhất của Domain 2/3.

### ⚠️ Trap: nghĩ backup/snapshot là giải pháp HA
Backup chỉ giải quyết **Durability** (không mất dữ liệu) — khôi phục từ snapshot tạo instance mới và mất thời gian đáng kể, không phải cơ chế failover nhanh như Multi-AZ.

### ⚠️ Trap: nghĩ Read Replica tự động failover như Multi-AZ
Read Replica là bất đồng bộ và cần promote thủ công để trở thành writer — không tự động thay thế instance chính khi lỗi như Multi-AZ.

### ⚠️ Trap: dùng RDS/Aurora cho workload cần scale ghi cực lớn, không cần quan hệ chặt
Khi đề nhấn mạnh "massive write throughput", "flexible schema", "key-value access pattern" — đáp án đúng thường là DynamoDB, không phải cố scale RDS/Aurora theo chiều ngang.

## Mini scenarios

🧪 **Scenario 1 — Kết hợp Multi-AZ và Read Replica**

**Tình huống:** Ứng dụng báo cáo tài chính cần chạy nhiều truy vấn đọc nặng mỗi ngày mà không được ảnh hưởng tới hiệu năng ghi giao dịch của hệ thống chính, đồng thời hệ thống chính cũng cần tự động failover nếu AZ gặp sự cố.
**Đáp án đúng:** Bật Multi-AZ cho database chính để đảm bảo failover tự động, đồng thời tạo Read Replica riêng phục vụ truy vấn báo cáo.
**Vì sao:** Đây là 2 yêu cầu độc lập — Multi-AZ giải quyết HA/failover, Read Replica giải quyết tách tải đọc; không thể dùng 1 cơ chế để giải quyết cả hai.

🧪 **Scenario 2 — Aurora Global Database cho DR cross-Region**

**Tình huống:** Một ứng dụng SaaS quan trọng cần: (1) hiệu năng ghi/đọc cao trong Region chính, (2) khả năng chuyển sang Region khác trong vài phút nếu Region chính gặp sự cố nghiêm trọng, (3) dữ liệu tương thích PostgreSQL.
**Đáp án đúng:** Dùng Aurora (PostgreSQL-compatible) với Aurora Global Database, có secondary Region sẵn sàng promote nhanh khi cần.
**Vì sao:** Aurora đáp ứng cả yêu cầu hiệu năng cao trong 1 Region lẫn khả năng mở rộng DR cross-Region nhanh hơn so với thiết lập Read Replica cross-Region thủ công trên RDS chuẩn.

🧪 **Scenario 3 — Anti-pattern: chọn sai công cụ cho scale ghi**

**Tình huống:** Một startup dùng RDS MySQL cho hệ thống ghi log sự kiện người dùng, traffic ghi tăng gấp 50 lần sau 6 tháng, đội kỹ thuật đề xuất "nâng cấp instance RDS lên loại lớn nhất có thể" để chịu tải ghi.
**Đáp án đúng (nên cân nhắc):** Đánh giá lại data model — nếu log sự kiện không cần JOIN/transaction phức tạp, chuyển sang DynamoDB (scale ghi theo chiều ngang gần như không giới hạn) thay vì tiếp tục scale up RDS.
**Vì sao đây là anti-pattern cần tránh:** Scale up (vertical) RDS có trần phần cứng — đến 1 lúc nào đó sẽ không nâng cấp được nữa dù trả bao nhiêu tiền; đây là dấu hiệu kinh điển cho thấy bài toán đã "vượt khỏi vùng phù hợp" của relational database và cần đánh giá lại kiến trúc, không phải tiếp tục đổ tiền vào 1 hướng không bền vững.

## Key takeaways

- Multi-AZ = đồng bộ, mục đích HA/failover tự động; Read Replica = bất đồng bộ, mục đích scale đọc.
- Backup/Snapshot giải quyết Durability, không phải High Availability.
- Aurora cải thiện failover time và replica flexibility so với RDS thông thường, dùng storage layer phân tán riêng.
- RDS/Aurora phù hợp dữ liệu quan hệ, transaction chặt; không phù hợp khi cần scale ghi cực lớn hoặc schema linh hoạt (nên cân nhắc DynamoDB).

## Checklist tự ôn

- [ ] Tôi phân biệt rõ Multi-AZ và Read Replica theo mục đích sử dụng.
- [ ] Tôi giải thích được vì sao backup/snapshot không phải là giải pháp HA.
- [ ] Tôi biết Aurora khác RDS thông thường ở điểm nào (storage, failover, replica).
- [ ] Tôi biết khi nào nên cân nhắc DynamoDB thay vì RDS/Aurora.

## Xem tiếp / Liên kết liên quan

- [05-dynamodb.md](./05-dynamodb.md)
- [06-vpc.md](./06-vpc.md)
- [../03-architecture-patterns/01-high-availability.md](../03-architecture-patterns/01-high-availability.md)
- [../03-architecture-patterns/07-disaster-recovery.md](../03-architecture-patterns/07-disaster-recovery.md)
- [../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md](../04-comparison-guides/02-rds-vs-aurora-vs-dynamodb.md)
