# 🧩 What Makes Postgres Different

## Mục tiêu học

Xóa bỏ mental model "PostgreSQL là một generic SQL database giống MySQL/SQL Server, chỉ khác cú pháp một chút". Hiểu rõ những điểm PostgreSQL thực sự mạnh về mặt kiến trúc, và — quan trọng không kém — những điểm nó **không** magic, để không rơi vào bẫy "Postgres làm được mọi thứ nên cứ nhét hết vào Postgres".

## Mục lục

- [1. Điểm khác biệt cốt lõi so với "generic RDBMS"](#1-điểm-khác-biệt-cốt-lõi-so-với-generic-rdbms)
- [2. Postgres mạnh ở đâu](#2-postgres-mạnh-ở-đâu)
- [3. Postgres không magic ở đâu](#3-postgres-không-magic-ở-đâu)
- [4. Common misconceptions](#4-common-misconceptions)
- [5. Interview lens](#5-interview-lens)
- [6. Key takeaways](#6-key-takeaways)

## 1. Điểm khác biệt cốt lõi so với "generic RDBMS"

Nhiều kỹ sư hình dung mọi RDBMS (MySQL, SQL Server, Oracle, PostgreSQL) là "một hộp đen lưu bảng, chạy SQL, có index" — khác biệt chỉ ở cú pháp và giấy phép. Cách nghĩ này bỏ lỡ những khác biệt kiến trúc có ảnh hưởng thực chiến rất lớn:

| Khía cạnh | Cách nghĩ "generic RDBMS" | Thực tế của PostgreSQL |
|---|---|---|
| Concurrency | "Có lock là đủ để xử lý đồng thời" | MVCC là **kiến trúc lõi** — mọi row đều versioned, không phải tùy chọn bật/tắt |
| Kiểu dữ liệu | "Chỉ có INT/VARCHAR/DATE cơ bản" | Có JSONB, Array, Range type, hình học, full-text search, kiểu tự định nghĩa (`CREATE TYPE`) |
| Mở rộng | "Chỉ dùng được tính năng có sẵn" | Extension ecosystem (`pg_stat_statements`, `PostGIS`, `pg_partman`, `pgvector`...) cho phép thêm năng lực mà không cần đổi database khác |
| Optimizer | "Optimizer nào cũng như nhau" | Cost-based planner rất tinh vi, có thể bị đánh lừa bởi statistics lỗi thời — hiểu nó là kỹ năng riêng biệt |
| Storage | "Update thì ghi đè tại chỗ" | Không — xem lại MVCC ở [`02-postgres-core-mental-model.md`](02-postgres-core-mental-model.md#4-mvcc-vì-sao-row-có-nhiều-phiên-bản) |

## 2. Postgres mạnh ở đâu

### 2.1 MVCC implementation

Không phải RDBMS nào cũng dùng MVCC theo cùng cách. PostgreSQL lưu **toàn bộ phiên bản tuple ngay trong heap chính** (khác với một số hệ thống dùng "undo log" riêng để tái tạo phiên bản cũ). Điều này cho reader/writer không chặn nhau ở phần lớn trường hợp, đổi lại PostgreSQL cần vacuum chủ động dọn dẹp (xem `01-storage-and-mvcc/`).

### 2.2 Planner tinh vi, cost-based, có thể tùy chỉnh

Planner không chỉ chọn giữa "dùng index" hay "không dùng index" — nó cân nhắc hàng loạt chiến lược join (nested loop/hash/merge), có thể dùng partial index, expression index, bitmap scan kết hợp nhiều điều kiện `OR`, và cho phép bạn can thiệp trực tiếp qua `ANALYZE`, statistics target, hoặc (hiếm khi cần) `pg_hint_plan`. Đây là công cụ mạnh — nhưng cũng có nghĩa là bạn **cần hiểu nó** để không bị nó "chọn nhầm" plan do statistics sai.

### 2.3 Rich indexing (không chỉ B-tree)

PostgreSQL hỗ trợ nhiều họ index chuyên biệt: GIN (full-text/JSONB/array), GiST (dữ liệu hình học/range), BRIN (dữ liệu lớn tương quan vật lý với thứ tự vật lý), Hash (equality thuần túy) — bên cạnh B-tree mặc định. Việc chọn đúng loại index theo đúng query pattern là chủ đề trọng tâm của `03-indexing/`.

### 2.4 Transactional correctness nghiêm ngặt

PostgreSQL tuân thủ ACID chặt chẽ, hỗ trợ đầy đủ 4 isolation level chuẩn SQL (dù triển khai vài mức bằng snapshot isolation thay vì lock thuần túy), và DDL (thay đổi schema) **cũng nằm trong transaction** — bạn có thể `BEGIN; ALTER TABLE ...; ROLLBACK;` một cách an toàn, điều nhiều RDBMS khác không hỗ trợ trọn vẹn.

### 2.5 Extension ecosystem

`CREATE EXTENSION` cho phép thêm năng lực chuyên biệt mà không cần chuyển sang hệ thống khác: `pg_stat_statements` (theo dõi query chậm), `PostGIS` (geospatial), `pg_partman` (quản lý partition), `pgvector` (vector search cho AI/embedding), `pg_cron` (job scheduling). Đây là lý do PostgreSQL thường được gọi là "cái database có thể mọc thêm chức năng" thay vì một hộp đen cố định.

### 2.6 JSONB + SQL power kết hợp

JSONB cho phép lưu dữ liệu bán cấu trúc (semi-structured) **cùng một database** với dữ liệu quan hệ chặt chẽ, truy vấn bằng SQL quen thuộc, index được bằng GIN, và join được trực tiếp với bảng quan hệ khác. Ví dụ: `event_payloads.payload` (JSONB) join với `events` (quan hệ chuẩn) trong cùng một query — không cần đồng bộ dữ liệu sang một document store riêng cho những trường hợp không đòi hỏi quy mô cực lớn.

## 3. Postgres không magic ở đâu

Đây là phần thường bị bỏ qua khi học PostgreSQL, nhưng **cực kỳ quan trọng** để dùng đúng công cụ đúng chỗ:

- ❌ **Không tự động scale ngang (horizontal scale) như các hệ NoSQL phân tán.** Một instance PostgreSQL về bản chất là single-writer (dù có replication cho đọc). Scale ghi thực sự cần sharding tầng ứng dụng hoặc extension chuyên biệt (Citus...) — không có sẵn "out of the box".
- ❌ **Không phải full-text search engine chuyên dụng.** PostgreSQL có full-text search built-in (dùng `tsvector`/`tsquery`, GIN index), đủ tốt cho nhu cầu vừa phải, nhưng không có tính năng ranking/relevance/faceted search phong phú như Elasticsearch/OpenSearch ở quy mô lớn.
- ❌ **Không phải message queue/stream processor.** `LISTEN/NOTIFY` hay bảng `processing_jobs` kiểu polling có thể dùng cho workload nhỏ, nhưng không thay thế được Kafka/RabbitMQ khi cần throughput cao, replay theo offset, hoặc fan-out phức tạp.
- ❌ **Không phải OLAP/data warehouse.** Planner của PostgreSQL tối ưu cho OLTP (nhiều query ngắn, transaction nhỏ). Aggregation khổng lồ trên hàng tỷ row, columnar scan hiệu quả, là điểm mạnh của warehouse chuyên dụng (BigQuery, Redshift, ClickHouse) chứ không phải PostgreSQL thuần.
- ❌ **Connection không rẻ.** Đã nói ở mental model — mỗi connection là một process, không phải lightweight thread. "Mở connection thoải mái" là tư duy sai lầm phổ biến khi đến từ các ngôn ngữ/framework có connection pooling built-in kiểu khác.
- ❌ **Autovacuum không phải "cây đũa thần chỉnh cấu hình mặc định là xong".** Với bảng ghi rất nhiều, cấu hình mặc định của autovacuum thường không đủ nhanh — cần tuning chủ động (xem `05-maintenance-and-bloat/`).

## 4. Common misconceptions

| ❌ Hiểu lầm | ✅ Thực tế |
|---|---|
| "PostgreSQL và MySQL về cơ bản giống nhau, chỉ khác cú pháp" | Khác biệt kiến trúc MVCC, planner, storage ảnh hưởng trực tiếp tới cách bạn thiết kế schema và index |
| "Postgres hỗ trợ JSONB nên không cần thiết kế bảng quan hệ nữa" | JSONB tốt cho dữ liệu thực sự bán cấu trúc/thay đổi thường xuyên; dữ liệu có quan hệ rõ ràng vẫn nên chuẩn hóa để tận dụng index/constraint/join hiệu quả |
| "Postgres có full-text search nên không cần Elasticsearch" | Đúng cho nhu cầu tìm kiếm vừa phải; sai khi cần ranking phức tạp, tìm kiếm đa ngôn ngữ nâng cao, hoặc facet ở quy mô lớn |
| "Cứ thêm extension là Postgres làm được mọi thứ tốt như hệ chuyên dụng" | Extension mở rộng khả năng nhưng không biến PostgreSQL thành warehouse hay message queue hiệu năng tương đương hệ chuyên dụng |
| "Optimizer luôn chọn đúng plan tốt nhất, không cần quan tâm" | Optimizer dựa trên ước lượng thống kê — statistics lỗi thời dẫn tới plan tệ dù dữ liệu thực tế thuận lợi |

## 5. Interview lens

**Câu hỏi thường gặp**: *"Vì sao chọn PostgreSQL thay vì MySQL cho hệ thống mới?"*

Câu trả lời có chiều sâu nên tránh nói chung chung "Postgres mạnh hơn". Nên nêu **điều kiện cụ thể** khiến PostgreSQL phù hợp hơn: cần transactional correctness nghiêm ngặt với DDL trong transaction, cần kết hợp dữ liệu quan hệ với JSONB trong cùng truy vấn, cần loại index chuyên biệt (GIN cho tìm kiếm, GiST cho dữ liệu hình học), hoặc team đã quen dùng extension ecosystem. Đồng thời nên chỉ ra **khi nào MySQL hoặc lựa chọn khác vẫn hợp lý** — thể hiện tư duy đánh đổi thay vì cổ súy một chiều.

**Câu hỏi bẫy thường gặp**: *"Postgres có thể làm queue/search/cache được không?"* — Câu trả lời tốt: "Có thể ở quy mô nhỏ/vừa (dùng `SKIP LOCKED` cho queue, `tsvector` cho search cơ bản), nhưng ở quy mô lớn hoặc yêu cầu đặc thù (throughput cao, ranking phức tạp), nên dùng công cụ chuyên dụng và để PostgreSQL làm đúng vai trò hệ quản trị dữ liệu quan hệ + transactional." — xem chi tiết ở [`04-when-postgres-needs-help.md`](04-when-postgres-needs-help.md).

## 6. Key takeaways

- ✅ PostgreSQL khác biệt về kiến trúc (MVCC, planner, extension), không chỉ khác cú pháp so với các RDBMS khác.
- ✅ Sức mạnh lớn nhất nằm ở sự kết hợp: transactional correctness + rich indexing + extensibility + JSONB, tất cả trong cùng một engine.
- ✅ "Postgres có thể làm X" không có nghĩa "Postgres nên là công cụ chính cho X" ở quy mô lớn.
- ✅ Hiểu rõ ranh giới năng lực giúp tránh cả hai cực đoan: từ chối Postgres vì đánh giá thấp, và nhét mọi workload vào Postgres vì đánh giá quá cao.

## Xem tiếp / Liên kết liên quan

- ⬅️ Trước: [00 — How to Use This Pack](00-how-to-use-this-pack.md)
- ➡️ Sau: [02 — Postgres Core Mental Model](02-postgres-core-mental-model.md)
- 🔗 Khi nào Postgres đủ dùng: [`03-when-postgres-is-enough.md`](03-when-postgres-is-enough.md)
- 🔗 Khi nào Postgres cần trợ giúp: [`04-when-postgres-needs-help.md`](04-when-postgres-needs-help.md)
