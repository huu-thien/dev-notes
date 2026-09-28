# ✅ Quality Checklist

Dùng checklist này để tự kiểm tra **mỗi file lesson, troubleshooting, anti-pattern hoặc decision guide** trước khi coi là hoàn tất. Nếu một mục không áp dụng cho loại file đó (VD: README index không cần "có query example"), bỏ qua và ghi rõ lý do thay vì tick ẩu.

## 🔧 Cơ chế & lý luận

- [ ] Giải thích **cơ chế bên trong** PostgreSQL, không dừng ở định nghĩa hời hợt.
- [ ] Có nêu **điều kiện** khiến behavior thay đổi (không khẳng định tuyệt đối "luôn luôn X").
- [ ] Phân biệt rõ **logical behavior** (kết quả trả về) với **physical/operational behavior** (cách nó chạy bên dưới).

## ⚖️ Trade-off

- [ ] Mọi giải pháp đề xuất đều có nêu **cái giá phải trả**, không có "miễn phí".
- [ ] Không mô tả một lựa chọn kỹ thuật là "luôn tốt hơn" mà thiếu điều kiện áp dụng.

## 🧨 Anti-pattern / Failure mode

- [ ] Có ít nhất một tình huống thực tế mà cơ chế này **gây ra sự cố** (nếu chủ đề phù hợp).
- [ ] Anti-pattern có kèm query/thiết kế cụ thể, không chỉ mô tả chung chung.

## 🏭 Production reasoning

- [ ] Có liên hệ tới tình huống production thật (không chỉ lý thuyết sách vở).
- [ ] Có debugging hint dựa trên catalog/view thật (`pg_stat_activity`, `pg_locks`, `pg_stat_statements`, `EXPLAIN`, log).
- [ ] Không đề xuất workaround nguy hiểm (restart, tăng timeout mù quáng) làm giải pháp mặc định.

## 📐 Ví dụ, schema & query

- [ ] Có schema cụ thể (bảng/cột/khóa) thuộc 1 trong 3 schema chuẩn của pack.
- [ ] Có query SQL thật, hợp lệ, gắn với schema đó.
- [ ] Query giữ đúng semantics khi rewrite (NULL, duplicate, order, pagination).
- [ ] Không dùng schema/ví dụ mới ngoài 3 schema chuẩn mà không có lý do rõ ràng.

## 🔍 Planner & execution path

- [ ] Có giải thích planner có thể chọn plan nào và **vì sao** (dựa trên selectivity/statistics/index có sẵn).
- [ ] Có `EXPLAIN`/`EXPLAIN ANALYZE` minh họa khi chủ đề liên quan tới performance.
- [ ] Phân biệt rõ **estimated rows** và **actual rows** khi thảo luận sai lệch cardinality.

## 🖼️ Diagram

- [ ] Có diagram khi cơ chế khó diễn đạt bằng văn xuôi thuần (MVCC visibility, lock wait, join path, WAL/replica, PgBouncer flow).
- [ ] Diagram gắn với schema/query thật đang thảo luận, không trừu tượng hóa vô nghĩa.
- [ ] Không thêm diagram chỉ để trang trí khi văn xuôi đã đủ rõ.

## 🧭 Navigation & tính nhất quán

- [ ] Thuật ngữ dùng đúng như trong `GLOSSARY.md`.
- [ ] Relative link hợp lệ, trỏ đúng file đã tồn tại (hoặc ghi chú rõ nếu là file tương lai).
- [ ] Có liên kết Previous/Next/Related khi phù hợp.
- [ ] README thư mục được cập nhật nếu danh sách file thay đổi.

## 📏 Tổng quát, không chung chung

- [ ] Đọc lại toàn bài: nếu xóa hết ví dụ/schema/query thì bài có còn hữu ích không? Nếu **có** (tức là nội dung vẫn đúng dù không có ví dụ) → bài đang quá chung chung, cần viết lại.
- [ ] Không có đoạn nào có thể copy-paste từ tài liệu PostgreSQL chính thức mà không thêm giá trị diễn giải/ví dụ riêng của pack.

## 🎓 Interview readiness (khi áp dụng)

- [ ] Có ít nhất 1 câu hỏi phỏng vấn liên quan kèm hướng trả lời có lý luận cơ chế, không phải học thuộc.

## 🏁 Final pack review (chỉ áp dụng ở phase cuối)

- [ ] Đủ 12 thư mục con + toàn bộ file theo `GENERATION-PLAN.md`.
- [ ] Ba schema chuẩn xuất hiện nhất quán xuyên suốt các thư mục liên quan (index, lock, partition, JSONB, replication, vacuum...).
- [ ] Không còn broken link nội bộ.
- [ ] Có coverage đầy đủ: storage, MVCC, planner, indexing, locking, vacuum, partition, replication, pooling, advanced SQL, troubleshooting, interview.
