# 05 — Index Anti-Patterns

## 🎯 Mục tiêu học

Tổng hợp sắc bén các sai lầm index kinh điển trong production — không phải để liệt kê lý thuyết, mà để bạn **nhận ra ngay** khi đang mắc phải một trong số này, và biết cách sửa đúng hướng thay vì thêm index chồng index.

## 📋 Mục lục

- [8+ anti-patterns](#8-anti-patterns)
- [Index not used ≠ index vô dụng ngay lập tức](#index-not-used--index-vô-dụng-ngay-lập-tức)
- [When the real fix is query rewrite / stats / schema, not another index](#when-the-real-fix-is-query-rewrite--stats--schema-not-another-index)
- [Debugging hints](#debugging-hints)
- [Interview lens](#interview-lens)
- [Mini scenarios](#mini-scenarios)
- [Key takeaways](#key-takeaways)
- [Xem tiếp / Liên kết liên quan](#xem-tiếp--liên-kết-liên-quan)

## 8+ anti-patterns

### 1. Too many indexes ("index mọi cột có vẻ hay dùng")

- **Vì sao người ta hay làm vậy**: tâm lý "thêm index cho chắc, không sợ sai" — mỗi lần thấy query chậm, phản xạ là thêm index mới thay vì xem lại index hiện có.
- **Tại sao nghe hợp lý**: "có index thì tra cứu nhanh hơn" — đúng về mặt đọc, nhưng bỏ qua chi phí ghi.
- **Hậu quả thật**: mỗi `INSERT`/`UPDATE` phải cập nhật **mọi** index liên quan tới cột thay đổi — bảng có 10 index nghĩa là 1 lần ghi có thể kéo theo 10 lần cập nhật cấu trúc dữ liệu phụ. Throughput ghi giảm, vacuum cũng phải dọn dẹp nhiều index hơn.
- **Cách nhận biết**: `SELECT count(*) FROM pg_indexes WHERE tablename = 'orders';` cho ra con số hai chữ số; `pg_stat_user_indexes` cho thấy nhiều index có `idx_scan` gần 0.
- **Hướng sửa**: audit định kỳ, giữ lại index phục vụ query pattern thực tế đã xác nhận qua `pg_stat_statements`/`pg_stat_user_indexes`, xóa phần còn lại.

### 2. Duplicate/overlapping indexes

- **Vì sao người ta hay làm vậy**: nhiều người/nhiều đợt tối ưu khác nhau tạo index tương tự nhau mà không kiểm tra trước (`(user_id)` và `(user_id, created_at)` cùng tồn tại — cái đầu gần như thừa vì cái sau đã bao hàm nó cho mọi query chỉ cần `user_id`).
- **Tại sao nghe hợp lý**: mỗi người chỉ nhìn vào query của riêng mình, không thấy toàn cảnh.
- **Hậu quả thật**: tốn gấp đôi chi phí ghi và dung lượng cho lợi ích gần như bằng 0 so với chỉ giữ index rộng hơn.
- **Cách nhận biết**: so sánh `indexdef` của mọi index trên cùng bảng qua `pg_indexes`, tìm cặp có chung leading columns.
- **Hướng sửa**: giữ lại index có tập cột **bao hàm** (superset) leading columns của index kia, xóa index bị bao hàm — trừ khi index ngắn hơn thực sự phục vụ pattern riêng biệt (ví dụ dùng cho `UNIQUE` constraint).

### 3. Wrong column order (đã phân tích sâu ở file trước)

- **Vì sao người ta hay làm vậy**: liệt kê cột theo thứ tự xuất hiện trong câu `WHERE` lúc viết code, không phân tích leading-column logic.
- **Tại sao nghe hợp lý**: "cả 3 cột đều nằm trong index rồi, chắc dùng được."
- **Hậu quả thật**: index tồn tại nhưng gần như vô dụng cho phần lớn query thực tế nếu leading column không phải cột luôn xuất hiện (xem `02-multicolumn-covering-and-order.md`).
- **Cách nhận biết**: `EXPLAIN` cho `Seq Scan` hoặc `Filter:` (không phải `Index Cond:`) trên cột lẽ ra nên nằm trong index.
- **Hướng sửa**: liệt kê query pattern thật trước, đặt cột equality luôn xuất hiện lên đầu.

### 4. Low-selectivity index expectations

- **Vì sao người ta hay làm vậy**: thấy `WHERE status = 'pending'` chậm, tạo index trên `status` mà không kiểm tra phân bố giá trị.
- **Tại sao nghe hợp lý**: "có `WHERE`, có index, phải nhanh hơn chứ."
- **Hậu quả thật**: nếu `status` chỉ có 4 giá trị phân bố tương đối đều, planner **đúng đắn bỏ qua** index này vì Seq Scan rẻ hơn — index chỉ tốn chi phí ghi mà không bao giờ được dùng.
- **Cách nhận biết**: `SELECT status, COUNT(*) FROM orders GROUP BY status;` cho thấy mỗi giá trị chiếm >10-15% tổng bảng.
- **Hướng sửa**: nếu thực sự cần tra cứu nhanh một giá trị cụ thể chiếm tỷ lệ nhỏ (ví dụ `'pending'` chỉ 3%), dùng **partial index** thay vì index đầy đủ trên cột đó.

### 5. Indexing volatile expression without real need

- **Vì sao người ta hay làm vậy**: thấy query dùng `WHERE now() - created_at < interval '1 day'` chậm, thử tạo expression index trên biểu thức chứa `now()`.
- **Tại sao nghe hợp lý**: "expression index giải quyết được biểu thức mà."
- **Hậu quả thật**: `now()` không phải hàm immutable (giá trị thay đổi theo thời điểm gọi) — PostgreSQL **từ chối tạo** expression index chứa hàm volatile trực tiếp trong biểu thức so sánh kiểu này, hoặc nếu lách được bằng cách khác, index sẽ sai lệch nhanh chóng vì "mốc thời gian" trong index không tự cập nhật.
- **Cách nhận biết**: lỗi `functions in index expression must be marked IMMUTABLE` khi thử tạo.
- **Hướng sửa**: viết lại điều kiện theo dạng `created_at > now() - interval '1 day'` — vế trái (`created_at`) là cột ổn định, có thể index bình thường bằng B-tree; vế phải tính toán tại thời điểm query, không cần nằm trong index.

### 6. Partial index predicate mismatch (đã phân tích ở file trước, nhắc lại như anti-pattern độc lập)

- **Vì sao người ta hay làm vậy**: viết predicate index dựa trên logic nghiệp vụ **tại thời điểm tạo**, quên cập nhật khi nghiệp vụ đổi (thêm status mới, đổi ngưỡng ngày).
- **Tại sao nghe hợp lý**: "lúc tạo thì đúng mà."
- **Hậu quả thật**: sau khi nghiệp vụ thêm status `'processing'` nhưng index vẫn `WHERE status = 'pending'`, các query mới dùng `status IN ('pending','processing')` không match predicate cũ, âm thầm không dùng được index.
- **Cách nhận biết**: so sánh `indexdef` với các giá trị `status` distinct hiện tại của bảng.
- **Hướng sửa**: coi partial index predicate là một phần của "hợp đồng" cần review mỗi khi enum trạng thái nghiệp vụ thay đổi.

### 7. Indexes created before query pattern is understood

- **Vì sao người ta hay làm vậy**: tạo index ngay từ lúc thiết kế schema, dựa trên "cột nào có FK/trông quan trọng" thay vì dựa trên query pattern thật đã đo được.
- **Tại sao nghe hợp lý**: "chuẩn bị trước cho chắc."
- **Hậu quả thật**: nhiều index không bao giờ khớp query pattern thật sự phát sinh sau này — gây chi phí ghi từ ngày đầu cho lợi ích chưa xác nhận.
- **Cách nhận biết**: nhiều index có `idx_scan = 0` dù hệ thống đã chạy production lâu.
- **Hướng sửa**: với hệ thống mới, chỉ tạo index tối thiểu cần cho constraint (PK/FK/UNIQUE), bổ sung index dựa trên `pg_stat_statements` sau khi có traffic thật.

### 8. Forgetting write amplification / vacuum / bloat / maintenance cost

- **Vì sao người ta hay làm vậy**: đánh giá index chỉ qua lăng kính "giúp query nào nhanh hơn", quên vế còn lại của bài toán.
- **Tại sao nghe hợp lý**: chi phí đọc thường dễ đo (query chậm → thêm index → query nhanh), còn chi phí ghi/bảo trì âm thầm tích lũy, khó thấy ngay.
- **Hậu quả thật**: mỗi index cũng có bloat riêng (dead entries khi dòng heap tương ứng bị update/delete), cần vacuum; nhiều index trên bảng ghi nhiều làm `UPDATE`/`INSERT` chậm dần theo thời gian dù không ai thay đổi code query.
- **Cách nhận biết**: theo dõi độ trễ ghi (write latency) tăng dần theo số lượng index; kiểm tra kích thước index qua `pg_relation_size` so với heap.
- **Hướng sửa**: mỗi lần thêm index mới, cân nhắc rõ ràng đánh đổi đọc/ghi — không coi index là "miễn phí".

### 9. Chasing index fixes when stats/query shape are the real problem

- **Vì sao người ta hay làm vậy**: thấy query chậm, phản xạ đầu tiên luôn là "thêm/sửa index" mà không đọc kỹ `EXPLAIN ANALYZE`.
- **Tại sao nghe hợp lý**: index là công cụ "quen thuộc nhất" để tối ưu query trong nhận thức chung.
- **Hậu quả thật**: nếu vấn đề thật sự là thống kê lỗi thời (`02-query-planner-and-execution/03-cardinality-estimation-and-statistics.md`) hoặc query shape sai (correlated subquery gọi lặp ở tầng ứng dụng), thêm index mới **không giải quyết được gì**, chỉ tốn thêm chi phí ghi trong khi vấn đề gốc vẫn còn nguyên.
- **Cách nhận biết**: thêm index xong, `EXPLAIN ANALYZE` vẫn cho thấy estimate lệch xa actual, hoặc plan không hề đổi.
- **Hướng sửa**: luôn xác nhận qua `EXPLAIN ANALYZE` **trước khi** thêm index — phân biệt rõ "thiếu index" với "estimate sai" hay "query shape sai".

## Index not used ≠ index vô dụng ngay lập tức

⚠️ **Cảnh báo quan trọng**: `idx_scan = 0` trong `pg_stat_user_indexes` **không tự động** có nghĩa là index này nên bị xóa ngay:

- Có thể đây là index phục vụ một **query hiếm gặp nhưng quan trọng** (ví dụ báo cáo cuối tháng, job dọn dẹp định kỳ) — chưa chạy trong khoảng thời gian bạn quan sát.
- Có thể đây là index phục vụ **constraint** (`UNIQUE`, `PRIMARY KEY`, `EXCLUDE`) — không xuất hiện trong `idx_scan` như một index tra cứu thông thường nhưng vẫn có vai trò đảm bảo tính đúng đắn dữ liệu, không nên xóa dựa theo tiêu chí "không được dùng để query".
- Số liệu `pg_stat_user_indexes` **reset khi restart PostgreSQL hoặc `pg_stat_reset()`** — kiểm tra `stats_reset` trước khi kết luận "không dùng trong thời gian dài".

➡️ Trước khi xóa một index vì "không dùng", luôn kiểm tra: index này có phục vụ constraint không, thời gian quan sát đã đủ dài chưa (bao trùm cả job định kỳ tháng/quý), và có job/query nào ẩn (đã bị đổi tên, chuyển sang service khác) từng phụ thuộc vào nó không.

## When the real fix is query rewrite / stats / schema, not another index

| Triệu chứng | Fix đúng không phải index |
|---|---|
| Estimate lệch actual hàng chục/hàng trăm lần | Chạy `ANALYZE` thủ công, xem lại `default_statistics_target` cho cột đó |
| Query dùng `LIKE '%abc%'` mong đợi index tăng tốc | Rewrite sang full-text search (`tsvector`) hoặc trigram GIN nếu thật sự cần, không phải B-tree thường |
| N+1 query pattern (nhiều lần gọi cùng 1 câu SQL với tham số khác nhau từ tầng ứng dụng) | Gộp thành 1 câu SQL dùng `JOIN`/`LATERAL`/`IN (...)`, không phải thêm index cho từng lần gọi riêng lẻ |
| Sort/Hash Aggregate tràn đĩa vì `work_mem` không đủ cho khối lượng dữ liệu thật | Tăng `work_mem` hợp lý theo tải hệ thống, hoặc giảm row width truy vấn (chỉ SELECT cột cần) |
| Bảng thiết kế sai chuẩn hóa khiến mọi query đều phải quét nhiều bảng phụ không cần thiết | Xem lại schema/denormalization có chủ đích, không phải "thêm index cho đủ mọi bảng phụ" |

## Debugging hints

- Luôn bắt đầu bằng `EXPLAIN ANALYZE` trước khi quyết định thêm/sửa index — xác nhận vấn đề thật sự nằm ở access path, không phải statistics hay query shape.
- Kiểm tra tổng quan index trên một bảng: `SELECT indexname, indexdef, pg_size_pretty(pg_relation_size(indexname::regclass)) FROM pg_indexes WHERE tablename = 'orders';`
- Kiểm tra hiệu quả sử dụng: `SELECT relname, indexrelname, idx_scan, idx_tup_read, idx_tup_fetch FROM pg_stat_user_indexes WHERE relname = 'orders';`
- Kiểm tra bloat sơ bộ của index: so sánh kích thước index hiện tại với kích thước ước tính sau `REINDEX` trên môi trường staging (chênh lệch lớn là dấu hiệu bloat).

## Interview lens

**Interviewer thường hỏi**: "Bạn nhận một hệ thống production có 15 index trên một bảng — bạn sẽ làm gì?"

- ❌ Câu trả lời yếu: "Xóa hết index không cần thiết ngay để giảm write cost."
- ✅ Câu trả lời mạnh: audit từng index qua `pg_stat_user_indexes` (tần suất dùng), `pg_indexes` (phát hiện trùng lặp/overlap leading columns), xác nhận index nào phục vụ constraint (không xóa), quan sát đủ chu kỳ nghiệp vụ (bao gồm job định kỳ) trước khi xóa bất kỳ index nào; ưu tiên gộp index trùng lặp trước khi xóa hẳn.

## Mini scenarios

1. **Bảng `orders` có cả `(user_id)` và `(user_id, created_at)`** — index đầu gần như thừa cho mọi query chỉ lọc `user_id`, nhưng team ngại xóa vì sợ ảnh hưởng gì đó không rõ — cần đối chiếu `pg_stat_user_indexes` trước khi quyết định.
2. **Sau một đợt "tối ưu nhanh" thêm 6 index mới trong 1 tuần để dập tắt cảnh báo chậm**, throughput ghi giảm rõ rệt vào tuần sau — hóa ra 4/6 index không hề khớp query pattern thật (do estimate sai bị chẩn đoán nhầm thành "thiếu index").
3. **Một index cũ tưởng "không dùng" (`idx_scan = 0` trong 2 tuần quan sát)** hóa ra phục vụ job đối soát cuối tháng — xóa nhầm khiến job đó chạy timeout ngay kỳ báo cáo kế tiếp.

## Key takeaways

- 🧠 Mỗi index là một đánh đổi đọc/ghi rõ ràng — không có index nào "miễn phí".
- 🧠 `idx_scan = 0` cần được diễn giải cẩn thận — không tự động đồng nghĩa "an toàn để xóa".
- 🧠 Phần lớn "vấn đề index" trong production thực chất là vấn đề cột thứ tự, predicate mismatch, hoặc statistics — không phải thiếu index.
- 🧠 Trước khi thêm index mới, luôn xác nhận bằng `EXPLAIN ANALYZE` rằng access path thật sự là nút thắt, không phải estimate hay query shape.
- 🧠 Audit index định kỳ (trùng lặp, không dùng, predicate lỗi thời) là công việc bảo trì liên tục, không phải việc làm một lần.

## Xem tiếp / Liên kết liên quan

- ⬅️ [`04-gin-gist-brin-hash-when-to-use.md`](04-gin-gist-brin-hash-when-to-use.md) — tránh oversell specialized index.
- 🔗 [`02-query-planner-and-execution/03-cardinality-estimation-and-statistics.md`](../02-query-planner-and-execution/03-cardinality-estimation-and-statistics.md) — phân biệt "thiếu index" với "estimate sai".
- 🔗 [`05-maintenance-and-bloat/README.md`](../05-maintenance-and-bloat/README.md) — bloat của index, vacuum cho index (sẽ mở rộng ở phần sau).
- ⬅️ [README phase này](README.md)
