# Quality Checklist — Kiểm tra chất lượng từng file

> ⚠️ **Cập nhật sau Lượt 2 refactor**: checklist này thay thế bản cũ. Trọng tâm chuyển từ "đủ mục template
> chưa" sang "**nội dung có thực sự giúp reasoning được không**" — vì mục tiêu của pack là tài liệu học sâu,
> thực chiến, không phải note ôn thi liệt kê định nghĩa.

Dùng checklist này để rà soát **mỗi file lesson/troubleshooting/pattern** sau khi sinh nội dung, trước khi coi
là "done". Không cần áp dụng 100% mục cho mọi loại file, nhưng phải tự đánh giá và ghi rõ mục nào bỏ qua và
tại sao.

## 1. Concept có rõ không (không chỉ định nghĩa)
- [ ] File giải thích được **bản chất/cơ chế**, không dừng lại ở định nghĩa vòng tròn (ví dụ: "partition là nơi
      chứa dữ liệu được phân vùng" — không giải thích gì thêm).
- [ ] Người đọc chưa biết gì về chủ đề có thể hình dung được cơ chế qua ẩn dụ/diagram/ví dụ cụ thể.
- [ ] Nếu khái niệm liên quan tới internals, có nối lại được với `02-core-internals` không?

## 2. Config/cơ chế có được giải thích đến nơi đến chốn không
- [ ] Với mỗi config/cơ chế quan trọng được nhắc tới, file có trả lời rõ: **nó giải quyết vấn đề gì**?
- [ ] Có nêu rõ **trade-off** cụ thể (latency/throughput/durability/ordering), không chỉ liệt kê tên tham số?
- [ ] Có nêu rõ **cấu hình sai thì hỏng theo kiểu nào** (failure mode cụ thể, không chung chung)?
- [ ] Không có bảng config nào chỉ là "copy tên tham số + mô tả 1 dòng từ doc chính thức" mà thiếu reasoning.

## 3. Duplicate / loss / ordering semantics có được làm rõ không
- [ ] Nếu chủ đề liên quan tới producer/consumer/delivery, file có chỉ rõ **duplicate đến từ đâu** trong ngữ
      cảnh cụ thể của bài (không chỉ nhắc chung "Kafka có thể duplicate")?
- [ ] Có chỉ rõ **loss xảy ra khi nào** (nếu áp dụng được cho chủ đề)?
- [ ] Có chỉ rõ **ordering guarantee áp dụng trong phạm vi nào**, và điều gì có thể phá vỡ nó?

## 4. Anti-pattern có thực tế không
- [ ] Anti-pattern có mô tả **hậu quả thực tế cụ thể** (không chỉ "sai khái niệm"), gồm: vì sao người học dễ
      nhầm, hậu quả nếu xảy ra trong production, cách sửa mental model?
- [ ] Có link sang `07-patterns-and-anti-patterns/02-anti-patterns.md` nếu đã có mục tương ứng (khi tồn tại)?

## 5. Interview lens có giá trị không (nếu file có mục này)
- [ ] Câu trả lời mẫu có đủ sâu để phân biệt được người thực sự hiểu vs người học thuộc định nghĩa?
- [ ] Có chỉ ra **câu trả lời yếu điển hình** (common weak answer) để người học tự nhận diện lỗ hổng của mình?

## 6. Diagram có đúng trọng tâm không
- [ ] Mỗi diagram trả lời đúng **1 câu hỏi cụ thể**, không cố nhồi nhiều ý cùng lúc.
- [ ] Node label ngắn gọn, không nhồi câu dài; **không có ký tự `\n` literal**.
- [ ] Ý nghĩa diagram được giải thích ngay trong bullet bên dưới — không cần block callout lặp lại kiểu
      "Diagram này muốn bạn nhớ" (đã bỏ khỏi template).
- [ ] Diagram giúp hiểu nhanh hơn so với thuần văn bản — nếu không, cân nhắc bỏ diagram đó.

## 7. Link có đúng không
- [ ] Tất cả link nội bộ dùng **relative path** đúng theo `STYLE-GUIDE.md` mục 8.
- [ ] Link trỏ tới file **có tồn tại** (không link tới file chưa được tạo, trừ khi ghi chú rõ "sẽ mở rộng ở
      lượt sau").
- [ ] Có mục "🔗 Xem tiếp / Liên kết liên quan" ở cuối file, trỏ tới 2-4 file liên quan.
- [ ] Sau khi đổi tên/di chuyển file, đã rà soát toàn bộ pack để không còn link trỏ tới tên file cũ.

## 8. File có thực sự giúp reasoning, không chỉ định nghĩa
- [ ] Không có câu kiểu "Kafka rất mạnh mẽ, linh hoạt, được nhiều công ty lớn sử dụng" mà không cụ thể hoá.
- [ ] Không có phần nào có thể áp dụng y hệt cho bất kỳ message broker nào khác mà không có gì đặc thù Kafka.
- [ ] Có ít nhất một chỗ thể hiện **quan điểm/khuyến nghị rõ ràng** (không né tránh mọi kết luận bằng "tuỳ nhu
      cầu").
- [ ] Mỗi khẳng định kỹ thuật quan trọng có kèm lý do ("vì sao lại như vậy"), không chỉ liệt kê fact.

## 9. Thuật ngữ & định dạng
- [ ] Thuật ngữ dùng đúng theo `GLOSSARY.md`, nhất quán xuyên suốt file; thuật ngữ mới đã được thêm vào
      `GLOSSARY.md`.
- [ ] Icon dùng đúng bảng quy ước trong `STYLE-GUIDE.md` mục 7, không lạm dụng.
- [ ] Heading phân cấp hợp lý, không nhảy bậc; không có heading rỗng (heading không có nội dung bên dưới).
- [ ] Đoạn văn không quá dài liên tục; có bullet/bảng khi so sánh; code block dùng đúng chỗ.

## 10. Kiểm tra cấp thư mục (áp dụng khi hoàn thành cả một thư mục)
- [ ] README của thư mục đã liệt kê đúng toàn bộ file con thực tế (kể cả sau khi đổi tên/tách file).
- [ ] README có link sang thư mục trước/sau trong lộ trình học.
- [ ] Bảng tiến độ trong `GENERATION-PLAN.md` đã được cập nhật.

---

> Nếu một file không đạt từ 2 mục trở lên trong checklist (trừ các mục ghi rõ "không áp dụng"), file đó **chưa
> được coi là hoàn thành** — cần viết lại phần thiếu trước khi chuyển sang file/thư mục tiếp theo.
