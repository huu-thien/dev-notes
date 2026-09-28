# Quality Checklist

> Dùng checklist này để kiểm tra mỗi file trước khi coi là hoàn thành, ở bất kỳ lượt sinh tài liệu nào.

## Checklist scope & trùng lặp

- [ ] Đúng scope theo file-by-file scope đã chốt trong blueprint (không lấn sang nội dung file khác)
- [ ] Không trùng lặp nội dung đã có ở file khác (chỉ link, không copy lại)
- [ ] Nếu nhắc tới nội dung chưa có file riêng (VD: ECS/Fargate, ElastiCache), có ghi chú "sẽ được mở rộng ở phần sau" thay vì bỏ qua hoặc tạo link gãy

## Checklist nội dung học thuật

- [ ] Có section "Must know for exam" rõ ràng
- [ ] Có phân loại Important / Nice to know khi phù hợp
- [ ] Có "Common traps" nếu file thuộc foundation/core-services/comparison/patterns
- [ ] Có "Mini scenario" đúng format 3 dòng (Tình huống / Đáp án đúng / Vì sao)
- [ ] Có "Key takeaways" tổng kết 3-5 gạch đầu dòng
- [ ] Có "Checklist tự ôn" dạng checkbox nếu là file lesson
- [ ] Phân biệt rõ "Practical understanding" vs "Exam focus", không trộn lẫn
- [ ] Nội dung không quá beginner phổ thông, không quá deep Specialty-level
- [ ] Có đánh dấu "Cần verify lại theo AWS official docs/exam guide mới nhất" ở nội dung dễ thay đổi (limits, %, pricing)

## Checklist thuật ngữ

- [ ] Thuật ngữ dùng đúng theo `GLOSSARY.md` (không dịch tên service, không đổi cách viết)
- [ ] Các cặp thuật ngữ dễ nhầm được phân biệt rõ khi xuất hiện (HA vs FT, SG vs NACL, Multi-AZ vs Read Replica...)
- [ ] Viết tắt được giải thích đầy đủ ít nhất 1 lần trước khi dùng

## Checklist trình bày & GitHub

- [ ] Có H1 duy nhất
- [ ] Có mục lục ngắn nếu file dài (> ~150 dòng)
- [ ] Bảng gọn (≤ 5 cột), không có cell quá dài
- [ ] Section không quá 40-60 dòng liên tục không có heading/bảng/list
- [ ] Checkbox dùng đúng cú pháp `- [ ]` / `- [x]`
- [ ] Có section "Xem tiếp / Liên kết liên quan" ở cuối file
- [ ] Relative links đúng cú pháp, trỏ đúng file tồn tại (không absolute URL nội bộ)

## Checklist cập nhật index

- [ ] README của thư mục cha đã được cập nhật link tới file mới (nếu file mới được thêm)
- [ ] Root `README.md` cập nhật quick links nếu có thư mục/phần mới hoàn thành
- [ ] `GENERATION-PLAN.md` cập nhật trạng thái lượt vừa hoàn thành

**Liên kết liên quan:** [STYLE-GUIDE.md](./STYLE-GUIDE.md) · [GLOSSARY.md](./GLOSSARY.md) · [GENERATION-PLAN.md](./GENERATION-PLAN.md)
