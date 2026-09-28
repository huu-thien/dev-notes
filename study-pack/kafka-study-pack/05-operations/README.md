# 05 — Operations

## 🎯 Mục tiêu học

Phần này trả lời: sau khi đã hiểu Kafka hoạt động thế nào ([`../02-core-internals`](../02-core-internals)),
biết thiết kế hệ thống dùng Kafka đúng cách ([`../03-design-and-architecture`](../03-design-and-architecture)),
và biết dùng đúng ecosystem component ([`../04-ecosystem`](../04-ecosystem)) — **làm sao vận hành một cluster
Kafka production thực tế**: capacity planning, scale, giám sát, xử lý backpressure/lag, ứng phó failure, bảo
mật, và upgrade an toàn.

Đây là bước chuyển từ **"hệ thống hiểu về mặt lý thuyết"** sang **"hệ thống biết cách vận hành"**. Mỗi file
không dừng ở "nên làm gì" mà phải chỉ rõ: metric/config đó dùng để làm gì, đọc sai thì hiểu sai thế nào, tuning
sai thì trả giá gì, và khi có sự cố thì quan sát/nghi ngờ/điều tra/điều chỉnh theo hướng nào.

## 🧠 Vì sao operations là chỗ nhiều team thất bại nhất với Kafka

Rất nhiều team thiết kế topic/partition/schema đúng, nhưng vẫn gặp sự cố production nghiêm trọng vì:

- **Capacity planning sai từ đầu** — chỉ nhìn producer TPS, quên nhân với replication factor và tốc độ tăng
  trưởng, dẫn tới hết disk hoặc network bandwidth khi traffic tăng.
- **Scale sai chiều** — thấy lag là tăng consumer ngay, trong khi nguyên nhân thực sự là hot partition hoặc
  downstream chậm; thấy chậm là tăng broker, trong khi bottleneck nằm ở 1 partition cụ thể.
- **Monitoring hời hợt** — chỉ nhìn average, không phân biệt lag theo record vs theo thời gian, không biết
  under-replicated partitions là tín hiệu sớm của vấn đề nghiêm trọng hơn.
- **Backpressure bị hiểu sai** — coi consumer lag luôn là lỗi của consumer, trong khi nguyên nhân có thể ở bất
  kỳ đâu trong chuỗi producer → broker → consumer → downstream.
- **Failure không được lập kế hoạch phục hồi** — giả định "replication nghĩa là không bao giờ có pain", quên
  rằng recovery luôn có chi phí (replay, catch-up, rebalance).
- **Security bật quá muộn hoặc bảo mật hời hợt** — coi mạng nội bộ là đủ an toàn, tới khi cần bật security cho
  cluster đang chạy production mới nhận ra độ khó tăng theo cấp số nhân.
- **Upgrade bị coi nhẹ như "cập nhật package"** — không có canary/staged rollout/rollback plan, dẫn tới sự cố
  lớn khi gặp vấn đề tương thích không lường trước.

📌 Nói cách khác: **thiết kế đúng chỉ là điều kiện cần**; vận hành đúng mới là điều kiện đủ để hệ thống Kafka
sống sót qua production thực tế theo thời gian.

## 📚 Thứ tự đọc đề xuất

1. [`01-capacity-planning.md`](01-capacity-planning.md) — nền tảng: ước lượng đúng nhu cầu tài nguyên trước khi
   vận hành bất cứ thứ gì.
2. [`02-scaling.md`](02-scaling.md) — khi capacity ban đầu không đủ, scale đúng chiều nào.
3. [`03-monitoring-and-alerting.md`](03-monitoring-and-alerting.md) — biết quan sát đúng tín hiệu trước khi biết
   phản ứng đúng.
4. [`04-backpressure-lag-and-throughput.md`](04-backpressure-lag-and-throughput.md) — file xương sống: hiểu lag/
   backpressure đúng cách để không phản ứng sai khi có alert.
5. [`05-failures-and-recovery.md`](05-failures-and-recovery.md) — khi mọi thứ vẫn xảy ra dù đã chuẩn bị kỹ,
   phục hồi thế nào cho đúng.
6. [`06-security-authentication-authorization-encryption.md`](06-security-authentication-authorization-encryption.md)
   — bảo vệ cluster khỏi truy cập trái phép, không đánh đổi hoàn toàn hiệu năng/độ phức tạp.
7. [`07-upgrades-and-compatibility.md`](07-upgrades-and-compatibility.md) — duy trì cluster an toàn qua thời
   gian mà không gây downtime hay mất khả năng rollback.

## 🧱 File nào là xương sống

**`04-backpressure-lag-and-throughput.md`** — vì lag/backpressure là nơi hầu hết các vấn đề vận hành khác (capacity
thiếu, scale sai, failure, rebalance) **biểu hiện ra ngoài** dưới dạng triệu chứng quan sát được. Hiểu đúng file
này giúp không phản ứng sai (ví dụ: scale consumer khi vấn đề thực ra ở downstream) khi gặp alert thực tế.

## ⏱️ Nếu đang chuẩn bị on-call / production support / interview, nên đọc gì trước

Đọc **`03-monitoring-and-alerting.md`** và **`04-backpressure-lag-and-throughput.md`** trước tiên. Đây là 2 file
trực tiếp trang bị khả năng: nhìn dashboard/alert và biết ngay nên nghi ngờ điều gì, điều tra theo hướng nào —
kỹ năng dùng nhiều nhất khi on-call thực tế và cũng là chủ đề được hỏi sâu nhất trong interview system design/
operations.

## 🔗 Điều hướng
- ⬅️ Trước: [`../04-ecosystem/README.md`](../04-ecosystem/README.md)
- ➡️ Sau: [`../06-troubleshooting/README.md`](../06-troubleshooting/README.md)

## Trạng thái nội dung
✅ Đã có lesson content chi tiết cho toàn bộ 7 file (01-07) — xem [`../GENERATION-PLAN.md`](../GENERATION-PLAN.md)
(Lượt 6 — hoàn thành).
