# Style Guide (Internal Rulebook)

> File này KHÔNG phải bài học. Đây là chuẩn văn phong và template dùng khi viết mọi file trong study pack, để đảm bảo tính nhất quán qua nhiều lượt sinh nội dung.

## Mục lục

- [Nguyên tắc viết chung](#nguyên-tắc-viết-chung)
- [Template: file lesson (foundation / core-services)](#template-file-lesson-foundation--core-services)
- [Template: file comparison guide](#template-file-comparison-guide)
- [Template: file practice](#template-file-practice)
- [Cách viết các block đặc biệt](#cách-viết-các-block-đặc-biệt)
- [Quy tắc Markdown cho GitHub](#quy-tắc-markdown-cho-github)
- [Quy tắc relative linking](#quy-tắc-relative-linking)
- [Quy tắc dùng README làm index](#quy-tắc-dùng-readme-làm-index)

## Nguyên tắc viết chung

- Viết tiếng Việt tự nhiên, không văn phong blog/kể chuyện, không mở bài dài dòng.
- Giữ nguyên English cho: tên service, tên feature, tên pattern, exam keyword.
- Câu ngắn, ưu tiên gạch đầu dòng và bảng hơn đoạn văn dài.
- Mỗi section không quá ~40-60 dòng liên tục không có heading/bảng/list.
- Không nhồi lịch sử phát triển dịch vụ, trivia không phục vụ thi.
- Tách rõ **Practical understanding** (hiểu để dùng thật) và **Exam focus** (trọng tâm để thi) — không trộn lẫn hai mục đích trong cùng một đoạn.
- Nếu thông tin có khả năng thay đổi theo thời gian (limits, pricing, domain %), đánh dấu: `> Cần verify lại theo AWS official docs / official exam guide mới nhất.`

## Template: file lesson (foundation / core-services)

```markdown
# Tên chủ đề (English Term)

Tóm tắt 1-2 câu về file này nói về gì.

## Mục lục   <!-- chỉ thêm nếu file dài -->

## Mục tiêu học

- Gạch đầu dòng ngắn về điều người học cần nắm được sau khi đọc.

## Practical understanding

Giải thích bản chất, cách hoạt động thực tế — dùng để hiểu và áp dụng thật.

## Exam focus

Những gì đề thi thường hỏi, cách AWS diễn đạt câu hỏi liên quan.

### Must know for exam

- Danh sách bắt buộc phải nhớ.

### Important

- Kiến thức quan trọng nhưng ít xuất hiện hơn.

### Nice to know

- Bổ sung, không bắt buộc cho thi.

## Common traps

### Trap: mô tả nhầm lẫn phổ biến
Giải thích cách phân biệt.

## Mini scenario

**Tình huống:** ...
**Đáp án đúng:** ...
**Vì sao:** ...

## Key takeaways

- 3-5 gạch đầu dòng tổng kết.

## Checklist tự ôn

- [ ] Câu hỏi tự kiểm tra 1
- [ ] Câu hỏi tự kiểm tra 2

## Xem tiếp / Liên kết liên quan

- [02-iam-basics.md](./01-foundation/02-iam-basics.md)  <!-- ví dụ minh họa cách viết relative link, không phải link cố định bắt buộc -->
```

## Template: file comparison guide

```markdown
# A vs B vs C

Tóm tắt khi nào dùng bài này (đã học các service liên quan chưa).

## Bảng so sánh nhanh

| Tiêu chí | A | B | C |
|---|---|---|---|
| ... | ... | ... | ... |

## Khi nào chọn cái nào

- Tình huống → lựa chọn phù hợp.

## Common traps

## Mini scenario

## Key takeaways

## Xem tiếp / Liên kết liên quan
```

Comparison guide **không** giải thích lại chi tiết từng service — chỉ link tới file gốc ở `02-core-services/`.

## Template: file practice

```markdown
# Tên bộ câu hỏi

Số lượng câu, phạm vi domain, cách dùng (làm trước khi xem đáp án).

## Câu hỏi

**Câu 1.** Nội dung câu hỏi...
A. ...
B. ...
C. ...
D. ...

## Đáp án & giải thích

**Câu 1: Đáp án B** — giải thích ngắn, link tới file lý thuyết liên quan.
```

## Cách viết các block đặc biệt

| Block | Cách viết |
|---|---|
| **Must know for exam** | Heading `### Must know for exam`, liệt kê gạch đầu dòng, ưu tiên câu hành động được |
| **Important** | Heading `### Important` |
| **Nice to know** | Heading `### Nice to know` |
| **Exam tips** | Blockquote: `> Exam tip: ...` — 1 câu ngắn, actionable |
| **Common traps** | Heading `### Trap: <mô tả ngắn>` kèm giải thích cách phân biệt |
| **Mini scenario** | Format 3 dòng: Tình huống / Đáp án đúng / Vì sao |
| **Key takeaways** | 3-5 gạch đầu dòng, không lặp lại nguyên văn phần trên |
| **Checklist tự ôn** | Dùng `- [ ]` cho câu hỏi tự kiểm tra ngắn |
| **Cần verify** | Blockquote: `> Cần verify lại theo AWS official docs/exam guide mới nhất.` |

## Quy tắc Markdown cho GitHub

- Chỉ 1 heading `#` (H1) mỗi file.
- Dùng bảng Markdown gọn (≤ 5 cột), tránh cell chứa câu quá dài.
- Dùng list thay vì đoạn văn khi liệt kê ≥ 3 ý.
- Không dùng emoji tràn lan; nếu dùng, chỉ để đánh dấu mức độ hoặc trạng thái (không bắt buộc).
- Checkbox chuẩn: `- [ ]` (chưa học/chưa làm) và `- [x]` (đã học/đã làm).
- Code block dùng khi trích lệnh CLI, cấu hình, hoặc ví dụ CIDR/JSON policy.

## Quy tắc relative linking

- Luôn dùng relative path tính từ vị trí file hiện tại, ví dụ từ `01-foundation/02-iam-basics.md` tới `02-core-services/06-vpc.md` là `../02-core-services/06-vpc.md`.
- Không dùng absolute URL trỏ vào repo (tránh gãy khi đổi tên repo/branch).
- Mỗi file kết thúc bằng section `## Xem tiếp / Liên kết liên quan` với 2-5 link.
- Nếu link tới file/mục chưa tồn tại ở lượt hiện tại, ghi chú dạng chữ thường: *"sẽ được mở rộng ở phần sau"* — không tạo link gãy.

## Quy tắc dùng README làm index

- README của mỗi thư mục = bảng liệt kê file + mô tả 1 dòng + mức ưu tiên, không lặp nội dung bài học.
- README phải nêu rõ thứ tự đọc đề xuất và file quan trọng nhất cho kỳ thi.
- README gốc là landing page đầy đủ (giới thiệu, roadmap, quick links) — khác với README thư mục con (chỉ là index ngắn).

**Liên kết liên quan:** [GLOSSARY.md](./GLOSSARY.md) · [QUALITY-CHECKLIST.md](./QUALITY-CHECKLIST.md) · [README.md](./README.md)
