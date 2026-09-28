# ✅ When Postgres Is Enough

## Mục tiêu học

Nhận diện chính xác các workload mà PostgreSQL **một mình** đã đủ tốt, không cần vội vàng thêm Redis/Elasticsearch/Kafka/warehouse riêng. Rất nhiều hệ thống bị over-engineer từ ngày đầu vì đội ngũ nghĩ "quy mô lớn thì phải nhiều công nghệ" — trong khi PostgreSQL đơn lẻ, cấu hình đúng, xử lý tốt phần lớn workload thực tế cho tới một ngưỡng khá cao.

## Mục lục

- [1. Nguyên tắc: tận dụng trước khi mở rộng](#1-nguyên-tắc-tận-dụng-trước-khi-mở-rộng)
- [2. Bảng use case → vì sao đủ → dấu hiệu sắp chạm giới hạn](#2-bảng-use-case--vì-sao-đủ--dấu-hiệu-sắp-chạm-giới-hạn)
- [3. Mini scenarios](#3-mini-scenarios)
- [4. Scenario kiểu system design interview](#4-scenario-kiểu-system-design-interview)
- [5. Common mistakes](#5-common-mistakes)
- [6. Key takeaways](#6-key-takeaways)

## 1. Nguyên tắc: tận dụng trước khi mở rộng

Chi phí của việc thêm một hệ thống mới (Redis, Elasticsearch, Kafka...) không chỉ là chi phí hạ tầng — nó còn là chi phí vận hành thêm một điểm lỗi, thêm một nguồn dữ liệu cần đồng bộ (và có thể lệch nhau), thêm kiến thức team phải học. Nguyên tắc thực dụng: **chỉ thêm công cụ mới khi có bằng chứng cụ thể PostgreSQL không đáp ứng được**, không phải vì "quy mô lớn nên chắc cần".

## 2. Bảng use case → vì sao đủ → dấu hiệu sắp chạm giới hạn

| Use case | Vì sao Postgres đủ | Dấu hiệu sắp chạm giới hạn |
|---|---|---|
| **Transactional OLTP app** (e-commerce, SaaS quản lý task) | ACID đầy đủ, row lock chính xác, MVCC cho phép đọc/ghi đồng thời hiệu quả | Ghi tập trung vào rất ít row nóng (hot row) gây lock contention nặng dù đã tối ưu transaction ngắn |
| **Moderate analytics / reporting nội bộ** (dashboard vài chục nghìn tới vài triệu row, chạy vài lần/ngày) | Planner xử lý tốt aggregate/group by ở quy mô này; index phù hợp giúp query chạy trong vài trăm ms tới vài giây | Báo cáo cần quét hàng chục triệu-hàng tỷ row **real-time**, hoặc cần độ trễ dưới giây trên toàn bộ lịch sử dữ liệu |
| **JSONB vừa phải** (metadata linh hoạt, config động, activity payload) | JSONB + GIN index đủ nhanh cho tra cứu theo key phổ biến, kết hợp trực tiếp với dữ liệu quan hệ trong cùng query | Toàn bộ dữ liệu chính là document lồng sâu, không có phần quan hệ nào, cần schema-less hoàn toàn ở quy mô cực lớn |
| **Full-text search cơ bản** (tìm sản phẩm theo tên, tìm task theo tiêu đề) | `tsvector`/`tsquery` + GIN index đủ cho tìm kiếm chính xác/gần đúng cơ bản, không cần hạ tầng riêng | Cần ranking phức tạp, gõ sai chính tả thông minh (fuzzy nâng cao), tìm kiếm đa ngôn ngữ, facet search ở quy mô lớn |
| **Queue-like workload nhỏ/vừa** (`processing_jobs` xử lý vài trăm–vài nghìn job/phút) | `SELECT ... FOR UPDATE SKIP LOCKED` cho phép nhiều worker lấy job an toàn, không cần hệ thống riêng | Cần throughput hàng chục nghìn message/giây, cần replay theo offset, cần fan-out cho nhiều consumer độc lập |
| **Cache đơn giản ở tầng dữ liệu** (kết quả tính toán ít thay đổi, lưu lại trong bảng) | Đọc trực tiếp từ bảng đã có index vẫn đủ nhanh nếu truy cập không quá dồn dập | Cần latency dưới mili-giây ở tải cực cao, hoặc cần cấu trúc dữ liệu chuyên biệt (sorted set, TTL tự động theo từng key) |
| **Multi-tenant SaaS quy mô vừa** (hàng trăm–hàng nghìn tenant) | Composite index với `tenant_id` đứng đầu cô lập dữ liệu hiệu quả trong 1 database | Một vài tenant lớn áp đảo (noisy neighbor) làm ảnh hưởng tenant khác trên cùng instance |

## 3. Mini scenarios

### Scenario 1 — SaaS quản lý task cho ~500 công ty khách hàng

Dùng schema SaaS (`tenants`, `projects`, `tasks`, `activity_logs`). Mỗi tenant có vài trăm task, tổng toàn hệ thống vài triệu row `tasks` và vài chục triệu row `activity_logs`. Query luôn lọc theo `tenant_id` trước. → PostgreSQL với composite index `(tenant_id, project_id, status)` xử lý tốt, không cần thêm hệ thống nào khác cho tới khi có tenant đơn lẻ vượt trội hẳn về tải (noisy neighbor).

### Scenario 2 — E-commerce vừa, vài chục nghìn đơn hàng/ngày

Dùng schema e-commerce. `orders`/`order_items`/`payments` đều là transaction quan trọng, cần ACID chặt. Dashboard báo cáo doanh thu theo ngày/tuần chạy aggregate trên vài triệu row. → PostgreSQL xử lý tốt cả giao dịch lẫn báo cáo tổng hợp ở quy mô này, miễn có index đúng cho query aggregate phổ biến.

### Scenario 3 — Hệ thống ghi log sự kiện nội bộ, vài triệu event/ngày

Dùng schema event/log. `events`/`event_payloads` ghi liên tục, truy vấn chủ yếu theo khoảng thời gian gần đây. → Với partitioning theo thời gian (`06-partitioning-and-large-tables/`, sẽ mở rộng ở phần sau) và BRIN index, PostgreSQL xử lý ổn ở quy mô vài triệu event/ngày mà không cần đẩy sang warehouse riêng ngay lập tức.

## 4. Scenario kiểu system design interview

**Đề bài**: *"Thiết kế backend cho một SaaS quản lý dự án cỡ vừa (dưới 2000 tenant, mỗi tenant vài trăm task). Có cần Elasticsearch/Kafka/Redis ngay từ đầu không?"*

**Hướng trả lời có lý luận** (không phải "cứ thêm cho chắc"):

- Dữ liệu chính là quan hệ (`tenants` → `projects` → `tasks`) với truy vấn có cấu trúc rõ ràng → PostgreSQL đáp ứng tốt, không cần document store riêng.
- Tìm kiếm task theo tiêu đề ở quy mô vài trăm task/tenant → `tsvector` + GIN index trong PostgreSQL đủ, chưa cần Elasticsearch.
- Thông báo real-time (notification) ở tải thấp/vừa → có thể dùng `LISTEN/NOTIFY` hoặc bảng job đơn giản trước, chỉ chuyển sang Kafka/queue chuyên dụng khi throughput thực sự vượt ngưỡng.
- Cache: nếu tải đọc dồn vào vài endpoint cụ thể và đã tối ưu index mà vẫn không đủ nhanh, **lúc đó** mới cân nhắc Redis — không phải mặc định thêm ngay từ ngày đầu.
- Kết luận: bắt đầu với PostgreSQL đơn lẻ + index đúng, đo lường thực tế, chỉ thêm hệ thống mới khi có **bằng chứng cụ thể** (latency vượt ngưỡng, throughput vượt khả năng, hoặc nhu cầu tính năng PostgreSQL không có).

## 5. Common mistakes

- ❌ Thêm Redis cache ngay từ ngày đầu dự án dù chưa đo được bottleneck thật ở đâu — tạo thêm điểm lỗi và bài toán đồng bộ dữ liệu không cần thiết.
- ❌ Đẩy toàn bộ dữ liệu sang Elasticsearch "cho chắc" trong khi truy vấn thực tế chỉ là tìm kiếm cơ bản theo vài trường.
- ❌ Dựng Kafka cho một hàng đợi xử lý vài trăm job/phút — độ phức tạp vận hành vượt xa lợi ích thực tế ở quy mô đó.

## Key takeaways

- ✅ PostgreSQL một mình xử lý tốt phần lớn workload OLTP + reporting vừa phải + JSONB vừa phải + search cơ bản + queue nhỏ.
- ✅ Nguyên tắc: đo lường bottleneck thật trước khi thêm công cụ mới, không thêm theo cảm tính "quy mô lớn nên chắc cần".
- ✅ Ranh giới "đủ dùng" luôn có **dấu hiệu cụ thể** báo trước khi sắp chạm giới hạn — theo dõi các dấu hiệu đó thay vì đoán mò.

## Xem tiếp / Liên kết liên quan

- ⬅️ Trước: [02 — Postgres Core Mental Model](02-postgres-core-mental-model.md)
- ➡️ Sau: [04 — When Postgres Needs Help](04-when-postgres-needs-help.md)
- 🔗 Chi tiết composite index cho multi-tenant: [`03-indexing/`](../03-indexing/README.md) (sẽ mở rộng ở phần sau)
- 🔗 Chi tiết partitioning cho event/log: [`06-partitioning-and-large-tables/`](../06-partitioning-and-large-tables/README.md) (sẽ mở rộng ở phần sau)
