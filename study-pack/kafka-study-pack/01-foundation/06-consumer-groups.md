# Consumer Groups

## 🎯 Mục tiêu học

Sau khi đọc file này, bạn sẽ:
- Hiểu chính xác **consumer group tồn tại để giải quyết vấn đề gì** — song song hóa việc đọc có kiểm soát.
- Nắm chắc quy tắc cốt lõi: **1 partition trong 1 group chỉ có đúng 1 consumer instance active tại một thời
  điểm**, và hệ quả của nó khi số instance nhiều/ít hơn số partition.
- Hiểu vì sao **nhiều consumer group đọc cùng 1 topic là hoàn toàn bình thường và độc lập**.
- Hiểu vì sao **"scale consumer group" không phải lúc nào cũng "scale throughput"**.

## 📖 Mục lục

- [Consumer group để làm gì](#-consumer-group-để-làm-gì)
- [Diagram 1: assignment trong 1 group](#️-diagram-1-assignment-trong-1-group)
- [Diagram 2: nhiều group đọc cùng 1 topic](#️-diagram-2-nhiều-group-đọc-cùng-1-topic)
- [Vì sao idle consumer là bình thường](#-vì-sao-idle-consumer-là-bình-thường)
- [Vì sao scale group không phải lúc nào cũng scale throughput](#-vì-sao-scale-group-không-phải-lúc-nào-cũng-scale-throughput)
- [Decision logic](#-decision-logic)
- [Failure modes](#-failure-modes)
- [Common mistakes / Anti-patterns](#-common-mistakes--anti-patterns)
- [Mini scenarios](#-mini-scenarios)
- [Key takeaways](#-key-takeaways)
- [Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 👥 Consumer group để làm gì

> **Consumer group là một tập hợp consumer instance cùng chia sẻ việc đọc 1 hoặc nhiều topic, định danh bằng
> `group.id`.** Nó tồn tại để giải quyết đúng 1 vấn đề: **cho phép song song hóa việc đọc mà vẫn tránh xử lý
> trùng lặp không kiểm soát trong cùng 1 nhóm xử lý.**

Quy tắc cốt lõi, quan trọng nhất của toàn bộ file này:

> 📌 **Trong một consumer group, mỗi partition chỉ được gán cho đúng 1 consumer instance tại một thời điểm.**

Đây không phải một giới hạn kỹ thuật ngẫu nhiên — nó là **thiết kế có chủ đích**: nếu 2 instance trong cùng
group cùng đọc 1 partition, cả 2 sẽ xử lý trùng toàn bộ dữ liệu của partition đó, phá vỡ hoàn toàn mục đích
"song song hóa để chia việc" (mỗi instance được cho là xử lý 1 phần việc riêng, không phải xử lý lại việc của
người khác).

## 🗺️ Diagram 1: assignment trong 1 group

```
Topic "orders" — 3 partitions   |   Group: order-service (3 consumer instances)

  Partition 0  ────────────────────►  Consumer 1
  Partition 1  ────────────────────►  Consumer 2
  Partition 2  ────────────────────►  Consumer 3
```

- Với 3 partition và 3 instance, mỗi instance nhận **đúng 1 partition** — trạng thái lý tưởng để tối đa hóa
  throughput (mỗi instance xử lý song song hoàn toàn độc lập).
- Nếu số instance **ít hơn** số partition (ví dụ 2 instance cho 3 partition), 1 instance phải xử lý **2
  partition** — vẫn đúng, nhưng không song song hóa tối đa.
- Nếu số instance **nhiều hơn** số partition (ví dụ 4 instance cho 3 partition), instance dư **không nhận được
  partition nào** — nó "đứng chờ" (idle), sẵn sàng nhận việc nếu có rebalance sau này.

## 🗺️ Diagram 2: nhiều group đọc cùng 1 topic

```
                     ┌──►  Group: billing-service     (đọc real-time)
Topic "orders"  ─────┼──►  Group: analytics-service   (batch, đọc trễ 1 giờ)
                     └──►  Group: fraud-detection      (đọc real-time, logic khác)
```

- Các consumer group khác nhau **hoàn toàn độc lập** — mỗi group có `committed offset` riêng, tốc độ đọc riêng,
  không tranh chấp partition với group khác.
- `analytics-service` đọc chậm hơn 1 giờ so với `billing-service` **không ảnh hưởng gì** tới `billing-service`
  — vì mỗi group tự quản lý vị trí đọc của chính nó.
- ⚠️ Đừng nhầm "1 partition được nhiều group đọc cùng lúc" (bình thường, độc lập) với "1 partition bị nhiều
  consumer trong **cùng 1** group đọc cùng lúc" (không xảy ra — xem quy tắc cốt lõi ở trên). Khác biệt then
  chốt: **trong 1 group** = chia nhau partition; **giữa các group** = mỗi group đọc lại toàn bộ dữ liệu nó cần,
  độc lập hoàn toàn.

## 💤 Vì sao idle consumer là bình thường

Một consumer instance **idle** (không nhận được partition nào) **không phải lỗi** — nó là hệ quả tất yếu khi
số instance trong group vượt quá số partition. Kafka **không** tạo thêm "công việc giả" để lấp đầy instance dư —
nó chấp nhận để instance đó đứng chờ, vì đơn vị phân phối nhỏ nhất là **cả 1 partition**, không thể chia nhỏ hơn
(1 partition không thể được xử lý bởi 2 instance cùng lúc trong cùng group, như đã nói ở quy tắc cốt lõi).

📌 Đây là lý do quan trọng nhất khiến "muốn scale throughput, chỉ cần thêm consumer" là **sai** nếu không tăng
partition trước.

## 📈 Vì sao scale group không phải lúc nào cũng scale throughput

Có 2 giới hạn cần phân biệt rõ khi nói về "scale":

1. **Giới hạn cứng theo số lượng**: số instance hữu ích tối đa trong 1 group = số partition của topic. Vượt qua
   ngưỡng này, thêm instance chỉ tạo idle consumer, **không** tăng throughput.
2. **Giới hạn theo phân phối dữ liệu (data skew)**: dù số instance ≤ số partition, nếu dữ liệu phân phối **không
   đều giữa các partition** (hot partition — do key phân bổ lệch), instance phụ trách partition "nóng" vẫn là
   nút thắt cổ chai, dù được coi là "chia đều" theo số lượng partition.

💡 Kết luận thực dụng: **"partition count" là trần (ceiling) cho throughput có thể đạt được qua việc thêm
consumer instance — nhưng đạt được trần đó hay không còn phụ thuộc vào việc dữ liệu có phân phối đều giữa các
partition hay không.**

## 🧭 Decision logic

1. ❓ Có 2 hệ thống khác nhau (ví dụ billing và analytics) cùng cần đọc 1 luồng dữ liệu, xử lý độc lập? → Dùng
   **2 consumer group khác nhau** — không cố "chia sẻ" 1 group cho 2 mục đích khác nhau (xem Anti-pattern).
2. ❓ Cần tăng throughput xử lý cho 1 hệ thống? → Tăng số consumer instance trong **cùng 1 group**, tối đa bằng
   số partition hiện có của topic. Nếu đã đạt trần, phải tăng số partition trước (cân nhắc ảnh hưởng ordering,
   xem [`02-topics-partitions-offsets.md`](02-topics-partitions-offsets.md)).
3. ❓ Có instance nào đang idle? → Kiểm tra: số instance có đang **vượt quá** số partition không — đây là
   nguyên nhân phổ biến nhất.
4. ❓ Throughput không tăng dù đã scale đúng số instance = số partition? → Nghi ngờ **hot partition** (data
   skew) — kiểm tra phân phối key, không phải số lượng instance.

## 🚨 Failure modes

| Tình huống | Hệ quả | Vì sao xảy ra |
|---|---|---|
| Số instance > số partition | Instance dư idle hoàn toàn, lãng phí tài nguyên | Đơn vị phân phối nhỏ nhất là 1 partition, không chia nhỏ hơn được trong cùng group |
| 2 hệ thống khác nhau dùng chung `group.id` | Mỗi hệ thống chỉ nhận được **một phần** dữ liệu (do bị coi là 2 instance của cùng 1 nhóm xử lý, chia nhau partition) | Kafka coi mọi instance cùng `group.id` là "cùng 1 nhóm xử lý", chia nhau partition thay vì đọc độc lập |
| Hot partition (key phân bổ lệch) | 1 consumer instance quá tải trong khi các instance khác rảnh, dù số instance = số partition | Cân bằng tải của consumer group dựa trên **số lượng partition**, không dựa trên khối lượng dữ liệu thực tế mỗi partition |

## ❌ Common mistakes / Anti-patterns

| Sai lầm | Vì sao dễ mắc | Hậu quả thực tế | Cách sửa mental model |
|---|---|---|---|
| Thêm consumer instance vượt quá số partition, kỳ vọng tăng throughput | Trực giác "thêm worker là nhanh hơn" từ mô hình xử lý song song thông thường (ví dụ thread pool) | Instance dư bị idle hoàn toàn, không tăng throughput, chỉ tốn thêm tài nguyên vận hành | Luôn kiểm tra: số instance hữu ích tối đa = số partition; muốn scale thêm phải tăng partition trước |
| Dùng chung 1 `group.id` cho 2 hệ thống khác nhau để "tiết kiệm tài nguyên đọc" | Nhầm tưởng dùng chung group giúp giảm tải đọc lên broker | Hai hệ thống tranh nhau partition trong cùng 1 group — mỗi partition chỉ 1 trong 2 hệ thống nhận được, hệ thống còn lại **mất một phần dữ liệu** mà không có lỗi rõ ràng nào | Mỗi hệ thống cần đọc độc lập phải có `group.id` riêng — chi phí tải đọc thêm là cần thiết để đảm bảo tính đúng đắn |
| Nhầm tưởng consumer group tự động cân bằng tải hoàn hảo theo khối lượng dữ liệu | Quen với các hệ thống load balancer tự động cân bằng theo tải thực tế (request-based) | Hot partition khiến 1 instance quá tải dù "được chia đều" về số lượng partition, không ai nhận ra nguyên nhân gốc | Cân bằng tải của Kafka là theo **số lượng partition**, không theo khối lượng dữ liệu thực tế trong mỗi partition — cần thiết kế key tốt để tránh skew |

## 🧪 Mini scenarios

**Scenario 1 — 3 partitions / 5 consumers:**
Topic `orders` có 3 partition, team scale `order-service` lên 5 instance để "tăng độ sẵn sàng". Kết quả: 3
instance nhận partition, xử lý bình thường; **2 instance idle hoàn toàn**. Throughput không đổi so với lúc chỉ
có 3 instance. ✅ Team nhận ra và giữ 2 instance dư như một dạng "standby" (sẵn sàng nhận partition ngay nếu 1
trong 3 instance đang hoạt động crash) — đây là cách dùng idle consumer hợp lý cho high availability, không
phải để tăng throughput.

**Scenario 2 — Billing group + analytics group:**
Topic `order-events` được đọc song song bởi `billing-service` (real-time, tính hóa đơn ngay) và
`analytics-service` (batch, chạy mỗi giờ để cập nhật dashboard). Hai group có `committed offset` hoàn toàn
riêng biệt — `analytics-service` có thể "chậm" 45 phút so với `billing-service` mà không ảnh hưởng gì, vì mỗi
group đọc độc lập từ vị trí riêng của nó.

**Scenario 3 — Partition skew (hot partition trong consumer group):**
Topic `user-activity` dùng key = `country_code` để đảm bảo ordering theo quốc gia, nhưng 70% traffic đến từ 1
quốc gia (`VN`) — partition chứa key `VN` nhận tải gấp nhiều lần các partition khác. Dù `order-service` có đủ
số instance bằng số partition, instance phụ trách partition `VN` **luôn chậm hơn hẳn**, gây lag cục bộ trong
khi các instance khác gần như rảnh rỗi. ❌ Nguyên nhân gốc: chọn key gây skew, không phải vấn đề của consumer
group; giải pháp cần ở tầng thiết kế key/partition (mở rộng ở
`../03-design-and-architecture/03-key-design.md`, sẽ mở rộng ở lượt sau).

## ✅ Key takeaways

- Consumer group tồn tại để **song song hóa việc đọc có kiểm soát** — chia nhau partition, không xử lý trùng
  trong cùng 1 nhóm.
- Quy tắc cốt lõi: **1 partition — 1 consumer instance active trong 1 group tại 1 thời điểm.**
- Idle consumer là **hệ quả bình thường**, không phải lỗi, khi số instance vượt quá số partition.
- Số partition là **trần cứng** cho throughput có thể đạt qua việc thêm consumer instance — nhưng đạt được
  trần đó hay không còn phụ thuộc vào phân phối dữ liệu có đều giữa các partition hay không (tránh hot
  partition).
- Nhiều consumer group đọc cùng 1 topic là thiết kế fan-out tự nhiên, hoàn toàn độc lập — không nên dùng chung
  `group.id` cho 2 mục đích khác nhau.

## 🔗 Xem tiếp / Liên kết liên quan

- Tiếp theo: [`07-producer-configs-and-delivery-behavior.md`](07-producer-configs-and-delivery-behavior.md) —
  đào sâu config phía producer.
- [`05-consumers.md`](05-consumers.md) — nền tảng về vòng lặp poll/process/commit của 1 consumer instance đơn
  lẻ, trước khi mở rộng ra cả group.
- [`09-rebalancing-and-group-behavior-basics.md`](09-rebalancing-and-group-behavior-basics.md) — điều gì xảy
  ra khi assignment trong group thay đổi (join/leave/crash).
- `../00-overview/04-kafka-core-mental-model.md` — Diagram 2 trong file đó đã giới thiệu khái niệm này ở mức
  tổng quát.
- `../06-troubleshooting/01-high-consumer-lag.md` (sẽ mở rộng ở lượt sau) — xử lý khi consumer group không
  theo kịp tốc độ ghi.
