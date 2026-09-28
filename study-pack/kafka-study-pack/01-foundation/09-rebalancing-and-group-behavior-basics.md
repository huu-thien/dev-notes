# Rebalancing và Group Behavior Basics

## 🎯 Mục tiêu học

Sau khi đọc file này, bạn sẽ:
- Hiểu chính xác **rebalance là gì** và **vì sao nó xảy ra** — không phải hiện tượng ngẫu nhiên hay lỗi.
- Biết rõ **những config nào ảnh hưởng trực tiếp tới tần suất/độ nhạy của rebalance**.
- Nhận diện được **triệu chứng rebalance storm** và cách chẩn đoán nguyên nhân gốc.
- Hiểu ở mức vừa đủ về **static membership** — công cụ giảm rebalance không cần thiết.

## 📖 Mục lục

- [Rebalance là gì](#-rebalance-là-gì)
- [Diagram: rebalance lifecycle](#️-diagram-rebalance-lifecycle)
- [4 nguyên nhân kích hoạt rebalance](#-4-nguyên-nhân-kích-hoạt-rebalance)
- [session.timeout.ms vs max.poll.interval.ms — nhắc lại và làm rõ hơn](#-sessiontimeoutms-vs-maxpollintervalms--nhắc-lại-và-làm-rõ-hơn)
- [Rebalance ảnh hưởng throughput/lag như thế nào](#-rebalance-ảnh-hưởng-throughputlag-như-thế-nào)
- [Static membership — giảm rebalance không cần thiết](#-static-membership--giảm-rebalance-không-cần-thiết)
- [Bảng: Symptom → Likely cause](#-bảng-symptom--likely-cause)
- [Debugging hints](#-debugging-hints)
- [Mini scenarios](#-mini-scenarios)
- [Key takeaways](#-key-takeaways)
- [Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 🔄 Rebalance là gì

> **Rebalance là quá trình phân phối lại partition cho các consumer instance trong cùng 1 consumer group.**

Đây là cơ chế **bắt buộc phải tồn tại** để consumer group duy trì đúng quy tắc cốt lõi ("1 partition — 1
consumer active" — xem [`06-consumer-groups.md`](06-consumer-groups.md)) mỗi khi thành viên trong group thay
đổi. Rebalance **không phải lỗi** — nó là cách Kafka thích nghi khi group có thay đổi về mặt cấu trúc (thêm/bớt
consumer, thêm partition).

⚠️ Nhưng rebalance **có chi phí thực sự**: trong lúc rebalance đang diễn ra (mặc định theo giao thức "stop-the-
world" ở phần lớn phiên bản phổ biến), **toàn bộ consumer trong group tạm dừng xử lý** cho tới khi assignment
mới được xác lập xong — đây là lý do rebalance quá thường xuyên ("rebalance storm") gây giảm throughput và tăng
lag nghiêm trọng, dù bản thân dữ liệu vẫn an toàn.

## 🗺️ Diagram: rebalance lifecycle

```
  Trạng thái ổn định          Trigger xảy ra           Rebalance             Trạng thái ổn định mới
  (đang xử lý bình thường) ──► (join/leave/timeout) ──► (dừng xử lý,     ──►  (đã xử lý tiếp,
                                                          gán lại partition)   assignment có thể đổi)
```

- Trong pha "rebalance" (dừng xử lý), consumer group coordinator (chạy trên 1 broker) thu thập lại danh sách
  consumer instance đang sống, chạy thuật toán assignment (`RangeAssignor`, `CooperativeStickyAssignor`... tùy
  cấu hình), rồi phân phối partition mới cho từng instance.
- 📌 Với `CooperativeStickyAssignor` (khuyến nghị dùng ở các phiên bản Kafka hiện đại), rebalance có thể diễn
  ra theo kiểu **incremental** (chỉ những partition thực sự cần đổi chủ mới bị thu hồi tạm thời), giảm đáng kể
  thời gian "dừng toàn bộ group" so với assignor kiểu cũ (`RangeAssignor`/`RoundRobinAssignor` dừng toàn bộ
  group mỗi lần rebalance, kể cả các partition không đổi chủ).

## 🎯 4 nguyên nhân kích hoạt rebalance

| Nguyên nhân | Mô tả | Có tránh được không |
|---|---|---|
| **Consumer instance join** | Một instance mới khởi động và tham gia group (ví dụ deploy thêm instance để scale) | Không cần tránh — đây là hành vi mong muốn khi scale |
| **Consumer instance leave** (chủ động) | Instance shutdown đúng cách (gọi `consumer.close()`), báo cho coordinator biết nó rời group | Không cần tránh — là hành vi bình thường khi deploy/restart có kiểm soát |
| **Consumer instance timeout** (`session.timeout.ms` hoặc `max.poll.interval.ms` hết hạn) | Coordinator không nhận được heartbeat / không thấy `poll()` được gọi kịp, coi instance đã chết | **Có thể tránh** phần lớn nếu cấu hình đúng (xem phần config bên dưới) và xử lý không bị treo |
| **Số lượng partition của topic thay đổi** | Ai đó tăng partition count cho topic đang được group này đọc | Không thể tránh nếu cần tăng partition — nhưng nên là sự kiện hiếm, có kế hoạch, không xảy ra bất ngờ |

## ⏲️ `session.timeout.ms` vs `max.poll.interval.ms` — nhắc lại và làm rõ hơn

Đây là 2 nguồn gốc phổ biến nhất của rebalance **không mong muốn** (đã giới thiệu ở
[`08-consumer-configs-and-offset-management.md`](08-consumer-configs-and-offset-management.md), nhắc lại dưới
góc nhìn "rebalance"):

- **`session.timeout.ms` hết hạn** → coordinator nghĩ consumer **đã chết thực sự** (mất kết nối, process
  crash) → rebalance để cứu dữ liệu khỏi bị "treo" chờ 1 consumer không còn tồn tại.
- **`max.poll.interval.ms` hết hạn** → coordinator nghĩ consumer **đang treo trong xử lý** (vẫn heartbeat được,
  nhưng không gọi `poll()` tiếp) → rebalance để tránh 1 partition bị "giữ" bởi 1 consumer không còn tiến triển.

📌 Cả 2 đều dẫn tới cùng 1 hành động (rebalance), nhưng **nguyên nhân gốc khác nhau hoàn toàn** — chẩn đoán sai
loại (tưởng là do mạng trong khi thực chất là do xử lý chậm) dẫn tới sửa sai config (tăng `session.timeout.ms`
không giải quyết được vấn đề do `max.poll.interval.ms` gây ra).

## 📉 Rebalance ảnh hưởng throughput/lag như thế nào

- Trong pha rebalance, **không consumer nào trong group xử lý dữ liệu mới** (với assignor kiểu cũ) — dữ liệu
  vẫn tiếp tục được ghi vào partition bởi producer, nhưng không ai đọc, khiến **lag tăng lên tức thời**.
- Nếu rebalance xảy ra **liên tục** (rebalance storm — ví dụ do 1 consumer liên tục bị timeout rồi rejoin), hệ
  thống rơi vào vòng lặp: rebalance → xử lý được vài giây → lại rebalance → gần như không có thời gian thực sự
  xử lý dữ liệu → lag tăng liên tục dù cluster vẫn "hoạt động bình thường" theo nghĩa không có lỗi rõ ràng nào.
- 💡 Đây là lý do rebalance storm thường bị **chẩn đoán nhầm** là "consumer chậm" hay "broker quá tải" — triệu
  chứng bề mặt giống nhau (lag tăng), nhưng nguyên nhân gốc hoàn toàn khác (chi tiết chẩn đoán đầy đủ ở
  `../06-troubleshooting/05-rebalance-storms.md`, sẽ mở rộng ở lượt sau).

## 🧷 Static membership — giảm rebalance không cần thiết

Vấn đề: mỗi lần 1 consumer instance **restart** (ví dụ deploy mới, hoặc pod bị Kubernetes restart), theo mặc
định nó được coi là "rời group" rồi "tham gia lại" — kích hoạt **2 lần rebalance** cho mỗi lần restart, dù về
bản chất đây chỉ là "instance cũ quay lại", không phải thay đổi cấu trúc group thực sự.

**Static membership** (cấu hình `group.instance.id` cố định cho mỗi instance) giải quyết đúng vấn đề này:
- Consumer instance có `group.instance.id` được coordinator "nhớ" là **cùng 1 thành viên logic**, ngay cả khi
  nó restart (miễn là quay lại trong vòng `session.timeout.ms`).
- Restart nhanh (trong thời gian ngắn) sẽ **không** kích hoạt rebalance — instance nhận lại đúng assignment cũ.
- 💡 Phù hợp nhất cho môi trường có restart/deploy thường xuyên nhưng có kiểm soát (rolling deploy trên
  Kubernetes/container orchestration) — không phù hợp nếu instance thực sự biến mất vĩnh viễn (vẫn cần
  rebalance đúng để giải phóng partition cho instance khác).

## 📋 Bảng: Symptom → Likely cause

| Symptom | Likely cause |
|---|---|
| Lag tăng đột biến, nhiều consumer log "rejoining group" liên tục | Rebalance storm — kiểm tra `session.timeout.ms`/`max.poll.interval.ms` trước |
| Rebalance xảy ra đúng lúc mỗi lần deploy | Bình thường (join/leave) — nhưng nếu deploy quá thường xuyên gây gián đoạn đáng kể, cân nhắc static membership |
| Rebalance xảy ra dù không có deploy, không có ai thay đổi partition | Nghi ngờ `max.poll.interval.ms` bị vượt do xử lý chậm/treo, hoặc GC pause dài gây trễ heartbeat |
| Chỉ 1 consumer cụ thể liên tục gây rebalance, các instance khác ổn định | Nghi ngờ chính instance đó có vấn đề riêng (network không ổn định, resource cạn kiệt trên node nó chạy) |
| Rebalance kéo dài bất thường (nhiều giây tới phút) | Kiểm tra assignor đang dùng (`RangeAssignor` cũ dừng toàn bộ group, nên cân nhắc `CooperativeStickyAssignor`) và số lượng partition/consumer trong group (group quá lớn rebalance chậm hơn) |

## 🔍 Debugging hints

- Kiểm tra log consumer/broker cho các dòng liên quan tới `"Rebalance"`, `"Member ... has left the group"`,
  hoặc `"Attempt to heartbeat failed"` — thường chỉ rõ nguyên nhân kích hoạt (timeout loại nào).
- Đo thời gian xử lý thực tế mỗi `poll()` batch, so sánh với `max.poll.interval.ms` — nếu gần chạm ngưỡng, đây
  gần như chắc chắn là nguyên nhân dù chưa thấy log lỗi rõ ràng.
- Kiểm tra GC log của consumer (nếu chạy JVM) — GC pause dài có thể trễ cả heartbeat lẫn `poll()`, gây rebalance
  dù code xử lý không hề chậm.

## 🧪 Mini scenarios

**Scenario 1 — Deploy rolling gây rebalance kép mỗi lần:**
Team deploy `order-service` (5 instance) bằng rolling update trên Kubernetes, mỗi lần thay 1 pod. Mỗi lần thay
pod gây **2 lần rebalance** (pod cũ rời group, pod mới tham gia) — với 5 pod thay tuần tự, tổng cộng **10 lần
rebalance** cho 1 lần deploy, gây gián đoạn xử lý đáng kể trong vài phút. ✅ Team bật static membership
(`group.instance.id` gắn theo tên pod cố định), giảm xuống còn rebalance thực sự cần thiết khi số lượng instance
thay đổi thực sự (không phải mỗi lần restart).

**Scenario 2 — Xử lý chậm gây rebalance storm liên tục:**
`fraud-detection-service` gọi 1 API bên ngoài chậm dần theo thời gian (API đó đang quá tải), khiến thời gian xử
lý mỗi batch dần vượt `max.poll.interval.ms`. Consumer bị đá khỏi group, rejoin, nhận lại partition, xử lý dở
lại vượt ngưỡng lần nữa — vòng lặp rebalance liên tục trong hàng giờ, lag tăng dần đều dù cluster Kafka hoàn
toàn khỏe mạnh. ❌ Nguyên nhân gốc nằm ở **hệ thống downstream** (API ngoài), không phải Kafka — bài học: triệu
chứng "rebalance storm" cần được chẩn đoán tới tận nguyên nhân gốc, không chỉ tăng timeout để "che" triệu
chứng.

**Scenario 3 — Tăng partition bất ngờ gây rebalance ngoài kế hoạch:**
Một kỹ sư khác (không thuộc team `order-service`) tăng số partition của topic `orders` từ 6 lên 12 để phục vụ 1
consumer group khác đang cần thêm parallelism. Hành động này **kích hoạt rebalance cho MỌI consumer group**
đang đọc topic `orders`, bao gồm cả `order-service` — dù team này không hề thay đổi gì. ✅ Bài học: thay đổi số
partition của 1 topic dùng chung cần được thông báo/phối hợp với **mọi** team đang tiêu thụ topic đó, không chỉ
team có nhu cầu.

## ✅ Key takeaways

- Rebalance là cơ chế **cần thiết**, không phải lỗi — nhưng nó có chi phí thực sự (tạm dừng xử lý).
- 4 nguyên nhân: consumer join, consumer leave (chủ động), consumer timeout (session hoặc poll interval), và
  thay đổi số partition.
- `session.timeout.ms` phát hiện consumer **chết thực sự**; `max.poll.interval.ms` phát hiện consumer **treo
  trong xử lý** — nhầm lẫn 2 cơ chế này dẫn tới chẩn đoán sai và sửa sai config.
- Static membership giảm rebalance không cần thiết khi restart nhanh có kiểm soát (rolling deploy).
- Thay đổi số partition ảnh hưởng **mọi** consumer group đang đọc topic đó, cần phối hợp trước khi thực hiện.

## 🔗 Xem tiếp / Liên kết liên quan

- Tiếp theo: [`10-ordering-delivery-semantics.md`](10-ordering-delivery-semantics.md) — bức tranh tổng thể về
  ordering và delivery semantics, tổng hợp lại góc nhìn producer + consumer + consumer group.
- [`06-consumer-groups.md`](06-consumer-groups.md) — nền tảng về assignment trước khi hiểu điều gì làm nó thay
  đổi.
- [`08-consumer-configs-and-offset-management.md`](08-consumer-configs-and-offset-management.md) — chi tiết
  reasoning của `session.timeout.ms`, `max.poll.interval.ms`, `max.poll.records`.
- `../02-core-internals/04-rebalancing.md` (sẽ mở rộng ở lượt sau) — cơ chế chi tiết bên trong (group
  coordinator, assignor protocol).
- `../06-troubleshooting/05-rebalance-storms.md` (sẽ mở rộng ở lượt sau) — quy trình chẩn đoán/khắc phục đầy đủ.
