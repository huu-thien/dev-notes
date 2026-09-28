# 07 — Patterns and Anti-patterns

## 🎯 Mục tiêu học

Phần này tổng hợp lại các **pattern kiến trúc đã kiểm chứng** và **anti-pattern thường gặp** khi dùng Kafka —
nhiều pattern/anti-pattern trong số này đã được nhắc rải rác ở `03-design-and-architecture`, `04-ecosystem`,
`05-operations`, và `06-troubleshooting`; phần này là nơi **tổng hợp tập trung**, dùng để tra cứu nhanh khi
review architecture hoặc chuẩn bị interview system design.

## 🧠 Pattern khác troubleshooting ở đâu? Anti-pattern khác bug ở đâu?

- **Troubleshooting** (`06-troubleshooting`) trả lời: "hệ thống đang chạy nhưng có triệu chứng bất thường, làm
  sao chẩn đoán và sửa?" — trọng tâm là **debugging trong 1 tình huống cụ thể đã xảy ra**.
- **Pattern/anti-pattern** (phần này) trả lời: "khi thiết kế hoặc review kiến trúc, quyết định nào là dấu hiệu
  tốt, quyết định nào là dấu hiệu cảnh báo?" — trọng tâm là **đánh giá quyết định thiết kế trước khi vấn đề xảy
  ra**, hoặc nhận diện gốc rễ thiết kế đứng sau 1 class sự cố lặp lại nhiều lần.
- 📌 Mối liên hệ trực tiếp: phần lớn sự cố trong `06-troubleshooting` (hot partition, message loss, rebalance
  storm) đều có thể truy ngược về 1 anti-pattern cụ thể trong `02-anti-patterns.md` — đọc phần này giúp hiểu
  **vì sao** sự cố đó dễ xảy ra, không chỉ **cách sửa** khi nó đã xảy ra.
- **Anti-pattern khác "bug" thông thường**: bug là lỗi logic cụ thể có thể sửa bằng 1 patch nhỏ; anti-pattern là
  **quyết định kiến trúc** trông hợp lý lúc đầu nhưng tạo ra rủi ro/chi phí tăng dần theo thời gian hoặc theo
  scale — sửa anti-pattern thường cần thay đổi thiết kế, không chỉ patch code.

## 📚 Thứ tự đọc đề xuất

1. [`01-good-patterns.md`](01-good-patterns.md) — các pattern nên áp dụng, kèm điều kiện dùng đúng.
2. [`02-anti-patterns.md`](02-anti-patterns.md) — sai lầm phổ biến, vì sao team hay rơi vào, cách sửa.
3. [`03-common-architecture-scenarios.md`](03-common-architecture-scenarios.md) — map scenario thực tế →
   pattern nên chọn → anti-pattern cần tránh, tổng hợp toàn bộ kiến thức từ các phần trước vào tình huống cụ
   thể.

## 🧱 File quan trọng nhất

**`02-anti-patterns.md`** — vì phần lớn sự cố production (đã liệt kê ở `06-troubleshooting`) đều bắt nguồn từ
1 anti-pattern thiết kế ban đầu; nhận diện sớm anti-pattern trong review kiến trúc rẻ hơn rất nhiều so với sửa
sự cố sau khi đã xảy ra ở production.

## 🔗 Điều hướng
- ⬅️ Trước: [`../06-troubleshooting/README.md`](../06-troubleshooting/README.md)
- ➡️ Sau: [`../08-learning-aids/README.md`](../08-learning-aids/README.md)

## Trạng thái nội dung
✅ Đã có lesson content chi tiết cho toàn bộ 3 file (01-03) — xem [`../GENERATION-PLAN.md`](../GENERATION-PLAN.md)
(Lượt 7 — hoàn thành).
