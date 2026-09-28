# Khi nào KHÔNG nên dùng Kafka?

## 🎯 Mục tiêu học

Sau khi đọc file này, bạn sẽ:
- Nhận diện được các **tín hiệu over-engineering** khi Kafka được chọn không đúng chỗ.
- Biết khi nào RabbitMQ, SQS, database, cron job, hoặc gọi HTTP trực tiếp là lựa chọn tốt hơn.
- Hiểu **complexity cost** thực sự của Kafka — không chỉ là "khó học" mà là chi phí vận hành lâu dài.
- Đánh giá được khi nào **team chưa đủ maturity** để vận hành Kafka, kể cả khi use case về lý thuyết phù hợp.

## 📖 Mục lục

- [Vì sao phần này quan trọng không kém phần "khi nào nên dùng"](#-vì-sao-phần-này-quan-trọng-không-kém-phần-khi-nào-nên-dùng)
- [Over-engineering signals](#-over-engineering-signals)
- [Complexity cost của Kafka là gì](#-complexity-cost-của-kafka-là-gì)
- [Khi nào lựa chọn đơn giản hơn thắng thế](#-khi-nào-lựa-chọn-đơn-giản-hơn-thắng-thế)
- [Anti-pattern table](#-anti-pattern-table)
- [Anti-pattern scenarios](#-anti-pattern-scenarios)
- [Khi nào team chưa đủ maturity để vận hành Kafka](#-khi-nào-team-chưa-đủ-maturity-để-vận-hành-kafka)
- [Bảng quyết định nhanh](#-bảng-quyết-định-nhanh)
- [Key takeaways](#-key-takeaways)
- [Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 🧠 Vì sao phần này quan trọng không kém phần "khi nào nên dùng"

Phần lớn tài liệu học Kafka chỉ nói về việc Kafka mạnh mẽ ra sao, dẫn tới một xu hướng phổ biến trong ngành:
**dùng Kafka vì nó "chuẩn", không phải vì bài toán thực sự cần nó.** Đây là dạng over-engineering rất tốn kém,
vì Kafka không phải một thư viện có thể xóa dễ dàng — một khi cluster đã chạy production, việc thay thế nó đòi
hỏi di chuyển dữ liệu, đổi logic ở mọi service liên quan, và rủi ro downtime.

⚠️ Nguyên tắc cốt lõi của file này: **"có thể dùng được" khác với "nên dùng".** Kafka gần như luôn "dùng được"
cho mọi bài toán truyền message — câu hỏi đúng không phải "Kafka có làm được việc này không" mà là "cái giá phải
trả có xứng đáng với lợi ích mang lại không, so với phương án đơn giản hơn".

## 🚩 Over-engineering signals

Nếu hệ thống bạn đang thiết kế có phần lớn các đặc điểm sau, đó là tín hiệu Kafka có thể là lựa chọn quá tay:

- 🚫 Chỉ có **1 producer và 1 consumer**, không có kế hoạch thêm consumer thứ hai trong tương lai gần.
- 🚫 Không cần **replay** — dữ liệu xử lý xong là xong, không ai cần đọc lại lịch sử.
- 🚫 Throughput thấp (vài chục đến vài trăm message/phút) — không đạt tới ngưỡng mà lợi ích scale-out của Kafka
  có ý nghĩa.
- 🚫 Cần độ trễ cực thấp cho một request-response đơn lẻ (Kafka phù hợp cho streaming/async, không phù hợp thay
  thế RPC đồng bộ cần phản hồi ngay).
- 🚫 Team **chưa từng vận hành hệ thống phân tán stateful nào** (không có kinh nghiệm với message broker, chưa
  quen debug distributed system).
- 🚫 Bài toán thực chất là **lên lịch định kỳ** (chạy report mỗi đêm, dọn dữ liệu cũ mỗi tuần) — đây là bài toán
  của cron/scheduler, không phải streaming.

## 💰 Complexity cost của Kafka là gì

"Kafka phức tạp" không chỉ là cảm giác chủ quan — đây là các chi phí **cụ thể, đo được**:

| Loại chi phí | Cụ thể là gì | So với queue đơn giản (SQS/RabbitMQ) |
|---|---|---|
| Hạ tầng vận hành | Cần cluster broker (tối thiểu 3 node cho production), ZooKeeper/KRaft, giám sát riêng | SQS: không cần vận hành gì (managed); RabbitMQ: 1 node đơn giản hơn nhiều để bắt đầu |
| Kiến thức vận hành | Cần hiểu partition, replication, ISR, rebalancing để debug khi có sự cố | Queue truyền thống có mô hình mental đơn giản hơn, ít khái niệm nội bộ hơn |
| Capacity planning | Phải tính partition count, retention, disk theo throughput dự kiến trước khi triển khai | Managed queue tự động scale phần lớn, ít phải lo trước |
| Chi phí thay đổi thiết kế sau này | Đổi số lượng partition, đổi partition key ảnh hưởng ordering — khó sửa khi đã có dữ liệu | Queue đơn giản thường dễ điều chỉnh hơn vì không có khái niệm partition cố định |
| Chi phí học tập cho cả team | Không chỉ người viết code cần hiểu, người vận hành (SRE/DevOps) cũng cần kiến thức riêng | Quản lý queue managed thường không đòi hỏi kiến thức chuyên sâu tương đương |

## 🧭 Khi nào lựa chọn đơn giản hơn thắng thế

| Nhu cầu thực tế | Lựa chọn tốt hơn Kafka | Vì sao |
|---|---|---|
| Gửi 1 task cho 1 worker xử lý, không cần ai khác biết | RabbitMQ hoặc SQS | Mô hình "task queue" đơn giản, chi phí vận hành thấp hơn nhiều |
| Cần phản hồi ngay lập tức cho 1 request | Gọi HTTP/RPC trực tiếp | Kafka thiết kế cho async, không phải để thay request-response đồng bộ |
| Chỉ cần lưu trạng thái hiện tại, không cần lịch sử thay đổi | Database (quan hệ hoặc NoSQL) | Không cần log bất biến nếu chỉ cần "giá trị mới nhất" |
| Công việc chạy theo lịch cố định (mỗi đêm, mỗi giờ) | Cron job / scheduler (ví dụ: Airflow, k8s CronJob) | Đây là bài toán lập lịch, không phải streaming liên tục |
| Cần transaction chặt giữa nhiều bước nghiệp vụ trong 1 service | Transaction trong database, hoặc outbox pattern đơn giản | Kafka transactions giải quyết vấn đề khác (atomic write nhiều partition), không thay thế ACID transaction nội bộ |
| Volume rất nhỏ, tăng trưởng chậm, đội ngũ nhỏ | RabbitMQ/SQS/thậm chí polling database | Chi phí vận hành Kafka không tương xứng với lợi ích ở quy mô này |

## 🧾 Anti-pattern table

| Problem | Vì sao người ta dễ chọn Kafka | Vì sao đó là lựa chọn tệ | Lựa chọn đơn giản hơn |
|---|---|---|---|
| Gửi email/notification cho user sau khi có hành động | "Kafka là chuẩn ngành, dùng cho tương lai mở rộng" | Chỉ có 1 consumer, không cần replay, không cần thứ tự phức tạp — độ phức tạp vận hành không tương xứng | SQS/RabbitMQ, hoặc thậm chí gọi thẳng notification service qua HTTP |
| Đồng bộ dữ liệu giữa 2 microservice nội bộ, tần suất thấp | "Dùng Kafka để 'chuẩn hóa' giao tiếp giữa các service" | Thêm một hệ thống phân tán phức tạp cho việc có thể giải quyết bằng 1 API call hoặc outbox pattern đơn giản | Gọi HTTP trực tiếp, hoặc outbox pattern + polling nhẹ |
| Chạy job tổng hợp báo cáo mỗi đêm | "Có thể dùng Kafka Streams để xử lý stream liên tục" | Bài toán là batch theo lịch cố định, không phải luồng liên tục cần xử lý real-time | Cron job/scheduler đọc thẳng từ database hoặc data warehouse |

## 🧪 Anti-pattern scenarios

**Scenario 1 — Kafka cho một nhu cầu "task queue" đơn giản:**
Một startup 5 người xây dựng tính năng gửi email xác nhận đơn hàng. Họ dựng một Kafka cluster 3 broker để publish
event `SendConfirmationEmail`, chỉ có đúng 1 consumer group xử lý. Không có kế hoạch thêm consumer khác, không
cần replay lịch sử. ❌ Đội ngũ nhỏ giờ phải tự vận hành, giám sát, backup một hệ thống phân tán phức tạp chỉ để
thay thế việc gọi 1 hàm gửi email hoặc dùng SQS với vài dòng cấu hình.

**Scenario 2 — Kafka thay thế database transaction:**
Team cố dùng Kafka transactions để đảm bảo tính nhất quán giữa việc "trừ tiền trong ví" và "cập nhật trạng thái
đơn hàng" trong cùng một service, vốn là hai thao tác trên cùng một database. ❌ Đây là bài toán ACID transaction
nội bộ trong 1 service — dùng database transaction (hoặc đơn giản là 1 transaction SQL) giải quyết đúng và đơn
giản hơn nhiều; Kafka transactions được thiết kế để giải quyết atomic write **giữa nhiều partition/topic Kafka**,
không phải thay thế transaction của database.

**Scenario 3 — Kafka Streams cho batch job hàng đêm:**
Team xây dựng Kafka Streams application để tính báo cáo doanh thu, nhưng nghiệp vụ thực chỉ cần một con số tổng
hợp **mỗi ngày một lần** vào lúc nửa đêm, không cần cập nhật liên tục trong ngày. ❌ Việc duy trì một stream
processing application chạy 24/7 (với toàn bộ chi phí vận hành, giám sát state store) để tính một con số 1 lần/
ngày là lãng phí — một scheduled batch job đọc thẳng từ database hoặc data warehouse rẻ và đơn giản hơn nhiều.

## 🧑‍🤝‍🧑 Khi nào team chưa đủ maturity để vận hành Kafka

Ngay cả khi use case về lý thuyết phù hợp, Kafka có thể vẫn là quyết định sai nếu:

- Team **chưa có kinh nghiệm vận hành hệ thống phân tán stateful** nào trước đây (database cluster, message
  broker có replication...) — Kafka thường không phải "hệ thống phân tán đầu tiên" nên học.
- Không có ai trong team đủ hiểu để **debug khi có sự cố** (rebalance storm, hot partition, lag tăng bất thường
  — xem `../06-troubleshooting/`, sẽ mở rộng ở lượt sau).
- Tổ chức chưa có hạ tầng giám sát (monitoring/alerting) tối thiểu để phát hiện sớm vấn đề trước khi nó thành sự
  cố lớn.
- Áp lực thời gian ra mắt sản phẩm (time-to-market) cao, trong khi thời gian học và vận hành Kafka đúng cách
  không nhỏ.

💡 Trong các trường hợp này, một lựa chọn thực dụng là: **bắt đầu với giải pháp đơn giản hơn (queue managed,
gọi trực tiếp), và chỉ chuyển sang Kafka khi các dấu hiệu ở `02-when-to-use-kafka.md` xuất hiện rõ ràng và team
đã sẵn sàng đầu tư vào năng lực vận hành.**

## 📊 Bảng quyết định nhanh

| Câu hỏi | Nếu "Có" | Nếu "Không" |
|---|---|---|
| Có nhiều hơn 1 consumer độc lập cần cùng dữ liệu? | Cân nhắc Kafka | Nghiêng về queue đơn giản hoặc gọi trực tiếp |
| Có cần replay/lịch sử dữ liệu? | Cân nhắc Kafka | Nghiêng về queue hoặc database |
| Throughput đủ lớn để lợi ích scale-out có ý nghĩa? | Cân nhắc Kafka | Cân nhắc lựa chọn managed đơn giản hơn |
| Team đã có kinh nghiệm vận hành hệ thống phân tán? | Kafka khả thi hơn | Cân nhắc bắt đầu đơn giản, học dần trước khi chuyển |
| Đây có phải bài toán request-response cần phản hồi ngay? | Không nên dùng Kafka thay thế | Kafka phù hợp cho mô hình async |

## ✅ Key takeaways

- "Có thể dùng Kafka" khác hẳn "nên dùng Kafka" — luôn so sánh với phương án đơn giản hơn trước khi quyết định.
- Tín hiệu over-engineering rõ nhất: chỉ 1 producer/1 consumer, không cần replay, throughput thấp, cần phản hồi
  đồng bộ ngay lập tức.
- Complexity cost của Kafka là **cụ thể và đo được**: hạ tầng, kiến thức vận hành, capacity planning, chi phí
  thay đổi thiết kế sau này.
- Ngay cả khi use case phù hợp về lý thuyết, **team chưa đủ maturity vận hành** vẫn là lý do chính đáng để trì
  hoãn dùng Kafka.

## 🔗 Xem tiếp / Liên kết liên quan

- Trước đó: [`02-when-to-use-kafka.md`](02-when-to-use-kafka.md) — mặt còn lại: khi nào Kafka thực sự đáng dùng.
- Tiếp theo: [`04-kafka-core-mental-model.md`](04-kafka-core-mental-model.md) — mental model tổng thể, cần nắm
  chắc dù bạn quyết định dùng Kafka hay không.
- `../07-patterns-and-anti-patterns/02-anti-patterns.md` (sẽ mở rộng ở lượt sau) — danh sách anti-pattern đầy
  đủ hơn, áp dụng cho cả giai đoạn thiết kế chi tiết.
- `../05-operations/01-capacity-planning.md` (sẽ mở rộng ở lượt sau) — chi tiết hóa complexity cost về mặt vận
  hành.
