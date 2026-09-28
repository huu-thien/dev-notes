# 00 — Overview

## 🎯 Thư mục này dùng để làm gì

`00-overview/` là **nền móng tư duy** cho toàn bộ study pack — trả lời các câu hỏi lớn trước khi đi vào chi
tiết kỹ thuật: Kafka thực sự là gì, khi nào nên/không nên dùng, và mental model tổng thể kết nối mọi khái niệm
(producer, partition, replica, consumer group, offset...) thành **một bức tranh thống nhất** thay vì danh sách
định nghĩa rời rạc.

⚠️ **Vì sao không nên bỏ qua overview:** phần lớn hiểu lầm về Kafka (nhầm nó với queue, tưởng nó đảm bảo global
ordering, tưởng exactly-once là mặc định...) hình thành ngay từ những buổi học đầu tiên và rất khó sửa sau khi
đã "quen tay" viết code. Bỏ qua overview để nhảy thẳng vào code thường dẫn tới việc dùng đúng API nhưng sai
mental model — biểu hiện ra ngoài là thiết kế partition/key sai, hoặc ngộ nhận về độ tin cậy khi không đọc kỹ
phần trade-off.

## 📚 Thứ tự đọc đề xuất

1. [`00-how-to-use-this-pack.md`](00-how-to-use-this-pack.md) — cách dùng bộ tài liệu này hiệu quả nhất tùy mục
   tiêu (học từ đầu / ôn nhanh / interview / debug).
2. [`01-what-is-kafka.md`](01-what-is-kafka.md) — Kafka là gì thật sự, khác gì so với message queue truyền
   thống, log mindset vs queue mindset.
3. [`02-when-to-use-kafka.md`](02-when-to-use-kafka.md) — các bài toán Kafka giải tốt, và cái giá phải trả ngay
   cả khi nó là lựa chọn đúng.
4. [`03-when-not-to-use-kafka.md`](03-when-not-to-use-kafka.md) — khi nào Kafka là over-engineering, khi nào
   giải pháp đơn giản hơn thắng thế.
5. [`04-kafka-core-mental-model.md`](04-kafka-core-mental-model.md) — mental model tổng thể, kết nối toàn bộ
   khái niệm cốt lõi thành một hệ thống thống nhất.

## ⭐ File quan trọng nhất

[`04-kafka-core-mental-model.md`](04-kafka-core-mental-model.md) — nếu chỉ đọc 1 file trong thư mục này, đọc
file này. Nó là nền tảng tư duy cho toàn bộ pack: mọi phần sau (foundation, internals, design, troubleshooting)
đều dựa trên mental model được xây dựng ở đây.

## 🧭 Điều hướng

- ⬅️ Trước: (đây là điểm bắt đầu của pack)
- ➡️ Sau: [`../01-foundation/README.md`](../01-foundation/README.md)

## ✅ Trạng thái nội dung

Đã hoàn thành đầy đủ nội dung (Lượt 1 trong `../GENERATION-PLAN.md`).
