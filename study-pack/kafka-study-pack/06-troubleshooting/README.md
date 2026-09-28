# 06 — Troubleshooting

## 🎯 Mục tiêu học

Phần này dùng để **tra cứu khi có sự cố thật**, không phải đọc tuyến tính như lý thuyết. Sau khi đã hiểu Kafka
hoạt động thế nào ([`../02-core-internals`](../02-core-internals)), thiết kế đúng
([`../03-design-and-architecture`](../03-design-and-architecture)), dùng đúng ecosystem
([`../04-ecosystem`](../04-ecosystem)), và vận hành đúng ([`../05-operations`](../05-operations)) — phần này
trả lời câu hỏi cuối cùng: **khi mọi thứ vẫn hỏng, phải chẩn đoán và sửa như thế nào?**

Mỗi file không dừng ở "check logs / check metrics" chung chung. Mỗi bài đều có: symptom cụ thể, các họ nguyên
nhân khả dĩ (likely cause families), cách phân biệt chúng, thứ tự nên kiểm tra, những kết luận vội vàng cần
tránh, hướng khắc phục, và cách phòng ngừa ở tầng thiết kế.

## 🧭 Dùng như runbook, không phải sách giáo khoa

Khi gặp sự cố thật, quy trình nên là:
1. Xác định **symptom quan sát được** (lag tăng? message bị lặp? consumer bị treo? deserialize lỗi?).
2. Tra đúng file tương ứng theo bảng bên dưới.
3. Đi theo **Debugging workflow** trong file đó — không nhảy thẳng tới "fix direction" trước khi phân biệt đúng
   cause family (kết luận sai cause family là nguyên nhân phổ biến nhất khiến fix sai chỗ, tốn thời gian).
4. Sau khi xử lý xong sự cố, đọc phần **Prevention / design fix** để tránh lặp lại — phần lớn sự cố production
   có gốc rễ từ 1 quyết định thiết kế ở `03-design-and-architecture` hoặc `05-operations`.

## 📋 Symptom → file nên tra

| Symptom quan sát được | File nên đọc |
|---|---|
| Consumer lag tăng, không rõ tại sao | [`01-high-consumer-lag.md`](01-high-consumer-lag.md) |
| 1 partition/consumer luôn tải cao hơn hẳn các partition khác | [`02-hot-partitions.md`](02-hot-partitions.md) |
| Nghi ngờ mất message, hoặc thấy message bị xử lý trùng | [`03-message-loss-duplicates.md`](03-message-loss-duplicates.md) |
| Producer gửi chậm, hoặc consumer xử lý chậm | [`04-slow-producer-slow-consumer.md`](04-slow-producer-slow-consumer.md) |
| Consumer group liên tục rebalance, xử lý bị gián đoạn từng đợt | [`05-rebalance-storms.md`](05-rebalance-storms.md) |
| Lỗi deserialize, lỗi schema compatibility, consumer crash khi đọc message mới | [`06-schema-and-serialization-errors.md`](06-schema-and-serialization-errors.md) |

## 🧱 File quan trọng nhất nếu đang on-call

**`01-high-consumer-lag.md`** — vì lag là triệu chứng bề mặt phổ biến nhất, và root cause thực sự thường nằm ở
1 trong các file khác (hot partition, rebalance storm, slow consumer, message spike). File này dạy cách **phân
biệt cause family trước khi hành động**, tránh phản ứng sai kiểu "thấy lag là tăng consumer ngay" — đây cũng là
kỹ năng được hỏi sâu nhất trong interview production-support.

## 🔗 Điều hướng
- ⬅️ Trước: [`../05-operations/README.md`](../05-operations/README.md)
- ➡️ Sau: [`../07-patterns-and-anti-patterns/README.md`](../07-patterns-and-anti-patterns/README.md)

## Trạng thái nội dung
✅ Đã có lesson content chi tiết cho toàn bộ 6 file (01-06) — xem [`../GENERATION-PLAN.md`](../GENERATION-PLAN.md)
(Lượt 7 — hoàn thành).
