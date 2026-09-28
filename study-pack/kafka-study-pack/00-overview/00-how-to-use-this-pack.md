# How to Use This Pack

## 🎯 Mục tiêu học

Sau khi đọc file này, bạn sẽ biết:
- Đọc pack này theo trình tự nào tùy vào mục tiêu của mình (học từ đầu / ôn nhanh / chuẩn bị interview / debug).
- Khi nào nên đọc kỹ, khi nào chỉ cần scan.
- Cách dùng các tài liệu điều phối (`GLOSSARY.md`, `08-learning-aids/`, `06-troubleshooting/`) như công cụ tra
  cứu thay vì đọc tuyến tính.
- Cách ghi chú cá nhân để việc học có tích lũy, không bị "học xong quên".

## 📖 Mục lục

- [Pack này không phải để đọc một lần](#-pack-này-không-phải-để-đọc-một-lần)
- [4 chân dung người học và lộ trình tương ứng](#-4-chân-dung-người-học-và-lộ-trình-tương-ứng)
- [Bảng quyết định: bắt đầu từ đâu, đọc sâu phần nào](#-bảng-quyết-định-bắt-đầu-từ-đâu-đọc-sâu-phần-nào)
- [Cách đọc một lesson file hiệu quả](#-cách-đọc-một-lesson-file-hiệu-quả)
- [Cách dùng các công cụ tra cứu trong pack](#-cách-dùng-các-công-cụ-tra-cứu-trong-pack)
- [Cách ghi chú cá nhân nếu học lâu dài](#-cách-ghi-chú-cá-nhân-nếu-học-lâu-dài)
- [Common mistakes khi dùng pack này](#-common-mistakes-khi-dùng-pack-này)
- [Key takeaways](#-key-takeaways)
- [Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 🧠 Pack này không phải để đọc một lần

Đây không phải một cuốn sách đọc tuyến tính từ đầu đến cuối rồi đóng lại. Nó được thiết kế như một **hệ thống
tham chiếu sống** (living reference), có ba chế độ dùng khác nhau:

1. **Học lần đầu** — đi tuần tự theo số thứ tự thư mục (`00` → `08`), đọc sâu, làm mini scenario trong đầu.
2. **Tra cứu khi làm việc** — nhảy thẳng tới `06-troubleshooting/` hoặc `08-learning-aids/01-cheatsheet.md` khi
   đang gặp vấn đề cụ thể, không cần đọc lại từ đầu.
3. **Ôn lại định kỳ** — dùng `08-learning-aids/02-decision-guide.md` và `03-common-mistakes.md` để refresh trí
   nhớ mà không phải đọc lại toàn bộ lesson.

⚠️ Sai lầm phổ biến nhất khi dùng loại tài liệu này: đọc một lèo từ đầu đến cuối như tiểu thuyết, không thực hành,
rồi quên sạch sau 2 tuần. Pack này được thiết kế để bạn **quay lại nhiều lần**, mỗi lần với một mục tiêu cụ thể.

## 🧭 4 chân dung người học và lộ trình tương ứng

### 1. Người mới học Kafka nghiêm túc (chưa từng dùng, hoặc mới dùng bề mặt)
Mục tiêu: xây mental model đúng ngay từ đầu, tránh các hiểu lầm sẽ ăn sâu và khó sửa sau này.

- Đọc đầy đủ `00-overview/` — **không được bỏ qua**, đặc biệt `04-kafka-core-mental-model.md`.
- Đọc đầy đủ `01-foundation/` — đây là kiến thức nền không thể nhảy cóc.
- Đọc `02-core-internals/` ở mức "hiểu ý tưởng", chưa cần nhớ chi tiết config.
- Lướt nhanh `03-design-and-architecture/` để biết các khái niệm tồn tại, chưa cần áp dụng ngay.
- Tạm bỏ qua `04-ecosystem/`, `05-operations/` cho tới khi thực sự cần dùng các công cụ đó.

### 2. Người đã dùng Kafka một thời gian, muốn hiểu sâu để thiết kế hệ thống
Mục tiêu: chuyển từ "biết dùng API" sang "hiểu trade-off để ra quyết định thiết kế đúng".

- Lướt nhanh `00-overview/` và `01-foundation/` để xác nhận không có lỗ hổng nền tảng (đặc biệt phần ordering,
  delivery semantics — đây là chỗ hay bị hiểu sai kể cả khi đã dùng lâu).
- Đọc kỹ `02-core-internals/` — đây là nơi giải thích **vì sao** các trade-off ở phần thiết kế lại tồn tại.
- Đọc kỹ toàn bộ `03-design-and-architecture/`.
- Đọc `04-ecosystem/` theo nhu cầu dự án thực tế đang làm.

### 3. Người chuẩn bị phỏng vấn backend / distributed systems / event-driven systems
Mục tiêu: trả lời được câu hỏi ở mức "hiểu bản chất", không phải học thuộc định nghĩa.

- Đọc kỹ `00-overview/01-what-is-kafka.md` và `04-kafka-core-mental-model.md` — đây là nơi có mục **🎤 Interview
  lens** giúp bạn trả lời có cấu trúc.
- Đọc `02-core-internals/` kỹ hơn bình thường — câu hỏi interview về Kafka thường xoáy vào internals (replication,
  ISR, exactly-once) chứ không chỉ API.
- Đọc `08-learning-aids/04-interview-style-questions.md` (khi được sinh) để luyện phản xạ trả lời.
- Dùng `07-patterns-and-anti-patterns/` để có ví dụ thực tế minh họa khi được hỏi "cho ví dụ khi nào dùng/không
  dùng Kafka".

### 4. Người đang debug/troubleshoot Kafka trong công việc thực tế
Mục tiêu: xử lý vấn đề nhanh, đúng root cause, không đoán mò.

- Vào thẳng `06-troubleshooting/`, tìm file khớp triệu chứng đang gặp.
- Nếu root cause được giải thích trong troubleshooting file chưa đủ rõ, quay lại đọc phần tương ứng trong
  `02-core-internals/` (mỗi troubleshooting file sẽ link tới internals liên quan).
- Sau khi xử lý xong, đọc phần "⚠️ Phòng ngừa" để tránh lặp lại — cân nhắc bổ sung vào
  `05-operations/03-monitoring-and-alerting.md` (nếu bạn tự mở rộng ghi chú riêng).

## 📊 Bảng quyết định: bắt đầu từ đâu, đọc sâu phần nào

| Mục tiêu người học | Nên bắt đầu từ đâu | Nên đọc sâu phần nào | Có thể bỏ qua (ở vòng đầu) |
|---|---|---|---|
| Học từ đầu, chưa biết Kafka | `00-overview/00-how-to-use-this-pack.md` | `00-overview/`, `01-foundation/` | `04-ecosystem/`, `05-operations/` |
| Đã dùng Kafka, muốn hiểu sâu để design | `00-overview/04-kafka-core-mental-model.md` | `02-core-internals/`, `03-design-and-architecture/` | Không nên bỏ qua phần nào, chỉ đọc nhanh hơn ở `01-foundation/` |
| Chuẩn bị interview | `00-overview/01-what-is-kafka.md` | `02-core-internals/`, `08-learning-aids/` | `04-ecosystem/` (trừ khi JD yêu cầu cụ thể) |
| Đang debug production | `06-troubleshooting/` (file khớp triệu chứng) | Phần `02-core-internals/` liên quan tới root cause | Toàn bộ phần còn lại — quay lại sau khi xử lý xong |

## 🔍 Cách đọc một lesson file hiệu quả

Mỗi lesson file trong pack được viết theo cấu trúc chuẩn (xem `../STYLE-GUIDE.md`). Cách đọc hiệu quả nhất:

1. **Đọc "🧠 Mental Model" trước, kỹ nhất.** Nếu phần này không "thấm", đọc lại trước khi đi tiếp — phần sau
   phụ thuộc vào nó.
2. **Đọc "⚖️ Trade-off" như một checklist quyết định**, không phải văn xuôi để lướt qua.
3. **Đọc "🧪 Mini Scenario" và tự hỏi**: "Nếu tôi gặp tình huống này, tôi sẽ quyết định thế nào?" trước khi đọc
   đáp án/kết luận trong bài.
4. **Bỏ qua phần liệt kê cấu hình chi tiết ở vòng đọc đầu** nếu mục tiêu là hiểu khái niệm — quay lại tra cứu
   khi thực sự cần áp dụng.

## 🧰 Cách dùng các công cụ tra cứu trong pack

| Công cụ | Dùng khi nào | Cách dùng |
|---|---|---|
| `GLOSSARY.md` | Gặp thuật ngữ không chắc nghĩa | Tra cứu nhanh, không cần đọc hết — chỉ tìm đúng term |
| `08-learning-aids/01-cheatsheet.md` | Cần nhớ nhanh khái niệm/cấu hình | Scan bảng, không đọc như lesson |
| `08-learning-aids/02-decision-guide.md` | Đang phân vân giữa 2+ phương án thiết kế | Đi theo flow quyết định, không cần hiểu lại toàn bộ lý thuyết |
| `06-troubleshooting/` | Đang gặp sự cố cụ thể | Tìm theo triệu chứng, không theo tên khái niệm |
| `07-patterns-and-anti-patterns/` | Review thiết kế của chính mình | Đối chiếu xem có rơi vào anti-pattern nào không |

## 📝 Cách ghi chú cá nhân nếu học lâu dài

Pack này cố tình **không** có phần "bài tập" hay "quiz" tích hợp, vì cách học hiệu quả nhất với loại kiến thức
này là **áp dụng vào ngữ cảnh của chính bạn**. Gợi ý cách ghi chú:

- 📌 Sau mỗi lesson, tự viết 1-2 câu: "Trong hệ thống tôi đang làm, khái niệm này áp dụng ở đâu?" — nếu không trả
  lời được, có thể bạn chưa thực sự hiểu, chỉ mới nhớ định nghĩa.
- 📌 Khi gặp một quyết định thiết kế thực tế, ghi lại: bối cảnh → phương án đã chọn → trade-off đã đánh đổi. Sau
  vài tháng, tập ghi chú này giá trị hơn nhiều so với đọc lại lesson.
- 📌 Khi tự mắc phải một anti-pattern, ghi lại và đối chiếu với `07-patterns-and-anti-patterns/02-anti-patterns.md`
  — nếu chưa có trong đó, đây là tín hiệu tốt để bổ sung.

## ❌ Common mistakes khi dùng pack này

| Sai lầm | Vì sao nó xảy ra | Hậu quả | Nên làm gì thay vào đó |
|---|---|---|---|
| Đọc từ đầu tới cuối một mạch, không dừng thực hành | Cảm giác "đọc hết mới coi là học xong" | Quên nhanh, không áp dụng được | Đọc theo mục tiêu cụ thể (xem bảng quyết định ở trên) |
| Nhảy thẳng vào `03-design-and-architecture/` để "học nhanh cho có cái dùng" | Nóng vội, muốn ứng dụng ngay | Hiểu trade-off nhưng không hiểu vì sao — dễ áp dụng sai ngữ cảnh | Đảm bảo đã nắm `01-foundation/` và `02-core-internals/` |
| Coi `06-troubleshooting/` là nơi học khái niệm mới | Tưởng troubleshooting = tutorial | Hiểu vấn đề nhưng thiếu nền tảng để tổng quát hóa | Học khái niệm ở `01-foundation/`/`02-core-internals/`, dùng troubleshooting để xử lý sự cố cụ thể |

## ✅ Key takeaways

- Pack này là **tài liệu tham chiếu sống**, không phải sách đọc một lần.
- Có 4 lộ trình khác nhau tùy mục tiêu — chọn đúng lộ trình quan trọng hơn đọc "hết" pack.
- `00-overview/` và `01-foundation/` là nền tảng bắt buộc cho mọi lộ trình, kể cả khi bạn đã có kinh nghiệm dùng
  Kafka.
- Ghi chú cá nhân gắn với ngữ cảnh thực tế của bạn quan trọng hơn việc nhớ lại nguyên văn lesson.

## 🔗 Xem tiếp / Liên kết liên quan

- Tiếp theo: [`01-what-is-kafka.md`](01-what-is-kafka.md) — bắt đầu xây mental model về Kafka.
- [`../STYLE-GUIDE.md`](../STYLE-GUIDE.md) — hiểu cấu trúc chuẩn của một lesson file trong pack.
- [`../GENERATION-PLAN.md`](../GENERATION-PLAN.md) — biết lịch sử các lượt sinh nội dung và trạng thái rà soát
  chất lượng cuối cùng (Final Review) của toàn bộ pack.
