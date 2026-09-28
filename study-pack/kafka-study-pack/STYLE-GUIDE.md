# Style Guide — Cách viết nội dung trong Kafka Study Pack

Mục tiêu của style guide này: đảm bảo mọi file được sinh ra ở các prompt sau (bởi bất kỳ ai/agent nào) đều
**đồng nhất về giọng văn, cấu trúc, độ sâu**, và không lệch khỏi tinh thần "học sâu, thực dụng, hiểu trade-off"
của bộ tài liệu.

## 1. Nguyên tắc chung

- Viết bằng **tiếng Việt**, giữ nguyên thuật ngữ kỹ thuật tiếng Anh (xem `GLOSSARY.md`), không dịch ép.
- Ưu tiên **giải thích bản chất (why/how)** trước, rồi mới đến **cách dùng (what/how-to)**.
- Mọi khẳng định kỹ thuật quan trọng nên có lý do đứng sau, không liệt kê fact khô khan.
- Không viết chung chung kiểu "Kafka rất mạnh mẽ và linh hoạt" — phải cụ thể: mạnh ở đâu, trade-off gì, khi nào
  không nên dùng.
- Độ dài: **được phép dài**, nhưng phải **dễ scan trên GitHub** — dùng heading, bullet, bảng, code block hợp lý
  để người đọc lướt nhanh vẫn nắm được ý chính.

## 2. Cấu trúc bắt buộc cho một **lesson file** (trong `00-overview` → `05-operations`)

> ⚠️ **Cập nhật (sau Lượt 2 refactor)**: template dưới đây thay thế template cũ. Mục tiêu là tài liệu đọc
> giống **note thực chiến của kỹ sư vận hành Kafka**, không phải note ôn thi. Vì vậy:
> - **KHÔNG** bắt buộc phải có block "🧠 Diagram này muốn bạn nhớ" hay "⚠️ Đừng hiểu diagram này theo cách sau"
>   sau mỗi diagram — thay vào đó, giải thích ý nghĩa diagram ngay trong bullet list bên dưới diagram, gộp
>   thẳng vào nội dung thay vì tách thành block callout lặp lại một cách máy móc.
> - **KHÔNG** bắt buộc phải có "🗂️ Checklist tự ôn" ở cuối mỗi file — checklist dạng self-quiz thuộc về
>   `08-learning-aids/`, không cần lặp lại ở từng lesson file riêng lẻ.
> - Khi một khái niệm gắn liền với **config cụ thể** (ví dụ `acks`, `linger.ms`, `session.timeout.ms`), bài học
>   **bắt buộc** phải trả lời được: (1) nó quyết định hành vi gì, (2) trade-off gì (latency/throughput/
>   durability/ordering/duplicate risk), (3) cấu hình sai thì hỏng theo kiểu nào, (4) liên hệ ra sao với
>   duplicate/loss/ordering. Không liệt kê config như một glossary khô khan.

```markdown
# <Tên bài học>

## 🎯 Mục tiêu học
## 📖 Mục lục (nếu file dài)

## 🧠 Mental Model
Giải thích bản chất/khái niệm cốt lõi bằng ngôn ngữ dễ hình dung (ẩn dụ, sơ đồ text, ví dụ thực tế).

## Nội dung chi tiết / Practical understanding
(Các heading con tuỳ bài, giải thích cơ chế/khái niệm — ưu tiên diagram + bullet giải thích ngay bên dưới)

## 🧭 Decision logic
## ⚖️ Trade-off
Liệt kê rõ ràng: chọn A thì được gì, mất gì. Không có giải pháp nào "miễn phí".

## ⚙️ Key configs (nếu bài liên quan tới cấu hình cụ thể)
Bảng: Config → tác dụng → trade-off → failure mode khi cấu hình sai.

## 🚨 Failure modes
Liệt kê cụ thể: cấu hình/thao tác sai dẫn tới duplicate/loss/ordering-break/lag/rebalance-storm như thế nào.

## 🔍 Debugging hints (khi phù hợp)
Dấu hiệu quan sát được + hướng kiểm tra nhanh khi nghi ngờ đang gặp đúng vấn đề này.

## ❌ Common mistakes / Anti-patterns
Không chỉ nói "đừng làm X" — phải giải thích vì sao X hấp dẫn/dễ mắc, hậu quả thực tế, cách sửa mental model.

## 🧪 Mini Scenario(s)
Tình huống thực tế cụ thể (bối cảnh, quy mô, số liệu) minh hoạ khái niệm — không mơ hồ.

## 🎤 Interview lens (khi phù hợp)
Nếu bị hỏi khái niệm này trong phỏng vấn: nên trả lời ngắn gọn thế nào trước, đào sâu ra sao, và câu trả lời
yếu thường thiếu gì.

## 💡 Why this matters in practice (khi phù hợp)
Nối khái niệm với hậu quả vận hành thực tế (incident, cost, on-call pain) — không chỉ lý thuyết.

## ✅ Key takeaways

## 🔗 Xem tiếp / Liên kết liên quan
Link tới các file liên quan trong pack (relative link).
```

Không bắt buộc dùng đủ 100% heading trên cho mọi file (ví dụ file thuần khái niệm nền tảng có thể không cần
"Key configs" nếu không liên quan config cụ thể), nhưng **Mental Model** và **Trade-off** gần như luôn phải có
trừ khi bài học thuần liệt kê (cheatsheet). Ưu tiên chọn heading nào **thực sự tăng giá trị reasoning** cho chủ
đề đó, thay vì nhồi đủ heading cho có.

## 3. Cách viết **Decision Guide** (trong `08-learning-aids`)

- Dạng câu hỏi dẫn dắt: "Bạn đang cân nhắc X hay Y? Hãy tự hỏi..."
- Dùng flow dạng if/else bằng ngôn ngữ tự nhiên hoặc bảng quyết định (decision table), không vẽ diagram phức tạp
  cần công cụ ngoài.
- Luôn kết bằng một bảng tóm tắt: điều kiện → khuyến nghị.

## 4. Cách viết **Troubleshooting file** (trong `06-troubleshooting`)

Cấu trúc bắt buộc:

```markdown
# <Tên vấn đề>

## 🩺 Triệu chứng
Dấu hiệu quan sát được (metric, log, hành vi hệ thống).

## 🧠 Nguyên nhân gốc rễ (Root Cause)
Giải thích cơ chế bên trong dẫn đến triệu chứng — phải nối lại được với kiến thức ở `02-core-internals`.

## 🔍 Cách chẩn đoán
Các bước / lệnh / metric cụ thể để xác nhận đúng là vấn đề này (không phải vấn đề khác có triệu chứng tương tự).

## 🛠️ Cách khắc phục
Ngắn hạn (giảm đau ngay) và dài hạn (fix tận gốc) — tách rõ hai loại.

## ⚠️ Phòng ngừa
Cách thiết kế/monitor để tránh lặp lại.

## 🔗 Liên quan
```

## 5. Cách viết **Anti-pattern** (trong `07-patterns-and-anti-patterns`)

```markdown
### ❌ <Tên anti-pattern>
**Biểu hiện:** ...
**Tại sao người ta hay làm vậy:** (lý do trông có vẻ hợp lý ban đầu)
**Tại sao nó là vấn đề:** ...
**Thay vào đó nên làm:** ✅ ...
```

Không được viết anti-pattern kiểu chỉ nói "đừng làm X" mà không giải thích tại sao X hấp dẫn/nguy hiểm — mục
tiêu là người đọc hiểu để **tự nhận ra** anti-pattern trong code của họ, không phải học thuộc danh sách cấm.

## 6. Cách viết **Mini Scenario**

- Luôn gắn với bối cảnh cụ thể: loại hệ thống (ví dụ: order processing, payment, IoT telemetry, log
  aggregation), quy mô (số partition, throughput ước lượng), và **quyết định/kết quả** cụ thể.
- Tránh scenario mơ hồ như "công ty X dùng Kafka và gặp vấn đề" — phải có con số hoặc cấu hình cụ thể để người
  đọc liên hệ được.

## 7. Icon — dùng tiết chế, đúng ngữ nghĩa

| Icon | Ý nghĩa | Khi dùng |
|------|---------|----------|
| ✅ | Đúng / nên làm / khuyến nghị | Thực hành tốt, giải pháp đúng |
| ❌ | Sai / không nên làm | Anti-pattern, hiểu lầm phổ biến |
| ⚠️ | Cảnh báo / cần cẩn trọng | Trade-off nguy hiểm, edge case dễ bỏ sót |
| 🧠 | Mental model / tư duy cốt lõi | Section giải thích bản chất |
| 🧪 | Ví dụ / scenario thực nghiệm | Mini scenario, thử nghiệm minh hoạ |
| 🔗 | Liên kết tới tài liệu khác | Section "Liên quan" cuối file |
| ⚙️ | Config / tham số cụ thể | Section "Key configs" |
| 🚨 | Failure mode | Section "Failure modes" — hậu quả khi cấu hình/vận hành sai |
| 🔍 | Chẩn đoán / debug | Section "Debugging hints" |
| 🎤 | Góc nhìn phỏng vấn | Section "Interview lens" |
| 💡 | Ý quan trọng cần chú ý | Ghi chú ngắn xen giữa nội dung, dùng tiết chế |
| 📌 | Quy tắc cốt lõi cần nhớ | Đánh dấu 1 câu quy tắc quan trọng nhất của section |

**Rule**: không dùng icon trang trí tuỳ hứng ngoài bảng trên. Không lạm dụng icon trong câu văn thường — chỉ
dùng ở đầu heading hoặc đầu dòng liệt kê.

## 8. Quy tắc relative link

- Mọi link nội bộ trong pack phải dùng **relative path**, ví dụ từ `03-design-and-architecture/01-topic-design.md`
  link tới `02-core-internals/03-replication-isr-leader-election.md` phải viết:
  `../02-core-internals/03-replication-isr-leader-election.md`.
- Không dùng absolute path hệ thống hoặc URL tuyệt đối tới file nội bộ.
- Mỗi file nên có ít nhất 1 mục "🔗 Liên quan" ở cuối, trỏ tới 2-4 file liên quan nhất (không cần liệt kê hết).
- README của mỗi thư mục phải link được cả "thư mục trước" và "thư mục sau" trong lộ trình học.

## 9. Quy tắc viết dài nhưng dễ scan

- Heading rõ ràng, phân cấp hợp lý (không nhảy từ `#` sang `####`).
- Đoạn văn không quá 4-5 dòng liên tục; ý dài nên tách bullet.
- Dùng bảng khi so sánh ≥ 2 phương án/khái niệm.
- Dùng code block cho: cấu hình Kafka, lệnh CLI, ví dụ log/output.
- Câu mở đầu mỗi section nên nói thẳng ý chính (topic sentence), không dẫn dắt vòng vo.

## 10. Quy tắc diagram (Mermaid / ASCII)

- Không dùng label dài trong node — giải thích chi tiết đưa xuống bullet ngay bên dưới diagram.
- **Không** dùng ký tự `\n` literal trong node label. Nếu cần xuống dòng, dùng `<br/>` (chỉ khi cần thiết) hoặc
  tốt hơn là rút ngắn label.
- Nếu 1 diagram cố trả lời quá nhiều câu hỏi cùng lúc, tách thành 2-3 diagram nhỏ, mỗi diagram tập trung 1 ý.
- **Không** bắt buộc thêm block "🧠 Diagram này muốn bạn nhớ" / "⚠️ Đừng hiểu diagram này theo cách sau" sau mỗi
  diagram — đây là template cũ, đã bỏ. Thay vào đó, viết ý nghĩa diagram thẳng vào bullet list mô tả ngay sau
  diagram, như một phần tự nhiên của nội dung.
- Diagram phải phục vụ đúng trọng tâm kiến thức của section đó — không thêm diagram chỉ để trang trí.

## 11. Nhất quán thuật ngữ

- Luôn tra `GLOSSARY.md` trước khi dùng thuật ngữ mới. Nếu thuật ngữ chưa có trong glossary, phải bổ sung.
- Không dùng từ đồng nghĩa tuỳ tiện cho cùng một khái niệm (ví dụ không lúc gọi "consumer group" lúc gọi "nhóm
  tiêu thụ").
