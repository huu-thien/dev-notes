# Upgrades and Compatibility

## 🎯 Mục tiêu học

Sau khi đọc xong, bạn sẽ:
- Hiểu vì sao **upgrade Kafka là một operations event**, không phải chỉ "cập nhật package".
- Có mental model đúng về **rolling restart** và tại sao nó là kỹ thuật upgrade mặc định của Kafka.
- Phân biệt được các loại **compatibility risk**: broker-broker, client-broker, protocol version, schema/app.
- Biết cách nghĩ về **canary / staged rollout / rollback** khi upgrade cluster production.
- Nhận diện được **hidden coupling risk** — những phụ thuộc ẩn dễ bị bỏ qua khi lên kế hoạch upgrade.

## 📖 Mục lục

- [Mental model: upgrade là operations event](#-mental-model-upgrade-là-operations-event)
- [Rolling restart mindset](#-rolling-restart-mindset)
- [Client-broker compatibility và protocol version skew](#-client-broker-compatibility-và-protocol-version-skew)
- [Schema/app compatibility interaction](#-schemaapp-compatibility-interaction)
- [Canary / staged rollout / rollback thinking](#-canary--staged-rollout--rollback-thinking)
- [Bảng: change type → main risk → what to verify](#-bảng-change-type--main-risk--what-to-verify)
- [Key mechanics](#-key-mechanics)
- [Key decisions](#-key-decisions)
- [Trade-offs](#️-trade-offs)
- [Failure modes](#-failure-modes)
- [Debugging hints](#-debugging-hints)
- [Operational implications](#-operational-implications)
- [❌ Anti-patterns](#-anti-patterns)
- [🧪 Mini scenarios](#-mini-scenarios)
- [🎤 Interview lens](#-interview-lens)
- [✅ Key takeaways](#-key-takeaways)
- [🔗 Xem tiếp / Liên kết liên quan](#-xem-tiếp--liên-kết-liên-quan)

## 🧠 Mental model: upgrade là operations event

Nâng cấp Kafka broker **không giống** nâng cấp 1 thư viện application thông thường. Lý do:

- Broker upgrade diễn ra trên **cluster đang chạy, đang phục vụ traffic thật**, với dữ liệu đang được ghi/đọc
  liên tục — không có "bảo trì downtime toàn bộ" như một ứng dụng stateless đơn giản.
- Cluster có nhiều broker chạy **các version khác nhau cùng lúc** trong suốt quá trình rolling upgrade — đây là
  trạng thái trung gian bắt buộc phải hoạt động đúng, không phải lỗi tạm thời.
- Client (producer/consumer) có thể chạy **version khác** broker — Kafka hỗ trợ tương thích ngược/xuôi ở mức
  protocol, nhưng không phải mọi tổ hợp version đều an toàn như nhau.
- 📌 Vì vậy: upgrade Kafka cần được lập kế hoạch như **1 sự kiện vận hành có rủi ro**, với giám sát, rollback
  plan, và staged rollout — giống tinh thần deploy 1 thay đổi lớn vào production, không phải chạy `apt upgrade`.

## 🔄 Rolling restart mindset

Kafka được thiết kế để upgrade qua **rolling restart**: khởi động lại từng broker một, không dừng toàn bộ
cluster.

- Khi 1 broker restart, các partition mà nó làm leader sẽ **failover** sang broker khác trong ISR (tương tự cơ
  chế đã bàn ở [`05-failures-and-recovery.md`](05-failures-and-recovery.md)) — đây chính là lý do rolling
  restart khả thi mà không gây downtime hoàn toàn.
- 📌 Điều kiện tiên quyết để rolling restart an toàn: **replication factor ≥ 2** (tốt hơn là ≥ 3) và ISR đang ở
  trạng thái khoẻ mạnh trước khi bắt đầu — restart broker khi ISR đã shrink sẵn là hành động rủi ro cao (có thể
  đẩy partition vào tình trạng mất quorum tạm thời).
- Thứ tự khuyến nghị: restart **1 broker duy nhất**, chờ nó rejoin ISR đầy đủ và under-replicated partitions
  trở về 0, rồi mới restart broker tiếp theo — không restart nhiều broker cùng lúc "cho nhanh".

## 🔗 Client-broker compatibility và protocol version skew

- Kafka dùng **wire protocol có versioning** — broker mới thường vẫn hiểu được request từ client cũ (tương
  thích ngược), nhưng **không phải tính năng mới nào của broker cũng có sẵn cho client cũ** (client cũ đơn giản
  không biết gọi API mới).
- ⚠️ **Version skew** (broker và client chạy version chênh lệch lớn) trong thời gian dài là nguồn rủi ro:
  - Broker cũ hơn client: 1 số client feature mới có thể không được broker hỗ trợ → lỗi hoặc fallback không
    mong muốn.
  - Version quá cũ đôi khi bị **deprecated/removed hỗ trợ** ở broker version rất mới — cần kiểm tra release
    notes, không giả định "cứ tương thích ngược mãi mãi".
- 📌 Thực dụng: version skew **tạm thời** trong lúc rolling upgrade là bình thường và được thiết kế để hoạt
  động; version skew **kéo dài hàng tháng** giữa các client khác nhau là rủi ro tích luỹ, nên được coi là nợ kỹ
  thuật cần dọn.

## 🧬 Schema/app compatibility interaction

- Upgrade broker/client Kafka là 1 trục compatibility; **schema evolution** (đã bàn ở
  [`../04-ecosystem/02-schema-registry.md`](../04-ecosystem/02-schema-registry.md)) là 1 trục compatibility
  **khác, độc lập** — nhưng chúng thường bị nhầm là "cùng 1 loại rủi ro".
- 📌 Phân biệt: Kafka broker/client version compatibility đảm bảo **giao thức truyền tải hoạt động đúng**;
  schema compatibility đảm bảo **nội dung message được hiểu đúng nghĩa**. Upgrade Kafka thành công không có
  nghĩa schema vẫn tương thích, và ngược lại.
- Khi lên kế hoạch upgrade lớn (ví dụ đổi major version), nên rà soát **cả 2 trục** riêng biệt: broker/client
  compatibility matrix, và schema compatibility mode đang áp dụng cho các topic quan trọng.

## 🚦 Canary / staged rollout / rollback thinking

Tư duy đúng khi upgrade production cluster không phải "upgrade tất cả rồi xem", mà là **staged rollout có điểm
kiểm tra**:

1. **Canary broker**: upgrade 1 broker không quan trọng nhất (hoặc 1 broker trong cluster non-critical trước),
   theo dõi metrics (under-replicated partitions, request latency, error rate) trong khoảng thời gian đủ dài
   trước khi tiếp tục.
2. **Staged rollout**: mở rộng dần ra các broker còn lại theo từng batch nhỏ, không upgrade toàn bộ cùng lúc —
   giữ khả năng dừng lại giữa chừng nếu phát hiện vấn đề.
3. **Rollback thinking**: cần biết trước **có thể rollback được không** và **rollback như thế nào** trước khi
   bắt đầu — không phải mọi thay đổi Kafka đều rollback dễ dàng (ví dụ: bật 1 feature broker mới ghi metadata
   format mới có thể không rollback được về broker cũ).

⚠️ Rollback không phải lúc nào cũng đối xứng với upgrade — với 1 số thay đổi (đặc biệt liên quan metadata
format hoặc inter-broker protocol version), sau khi đã "chốt" (finalize) version mới, việc quay lại broker cũ
có thể không khả thi. Đây là lý do cần đọc kỹ release notes về `inter.broker.protocol.version` trước khi hoàn
tất upgrade.

## 📊 Bảng: change type → main risk → what to verify

| Loại thay đổi | Rủi ro chính | Cần verify trước khi tiếp tục |
|---|---|---|
| Rolling restart broker (cùng version) | ISR shrink tạm thời, leader failover gây gián đoạn ngắn | Under-replicated partitions về 0 trước khi restart broker tiếp theo |
| Broker minor/patch version upgrade | Thường an toàn nhưng vẫn có thể đổi default config hoặc fix behavior | Đọc release notes, test trên staging trước, theo dõi metrics sau canary broker |
| Broker major version upgrade | Thay đổi protocol/metadata format, có thể không rollback được | Compatibility matrix client-broker, `inter.broker.protocol.version` finalize timing, kế hoạch rollback rõ ràng |
| Client library upgrade (producer/consumer) | Đổi default config (ví dụ batching, acks), đổi behavior delivery semantics | So sánh default config cũ/mới, test trên traffic thực tế ở staging trước |
| Mixed client version trong cùng consumer group | Behavior rebalance có thể khác nhau giữa client version | Kiểm tra rebalance protocol tương thích, theo dõi rebalance churn sau khi mix version |
| Bật/đổi cấu hình security (TLS/SASL/ACL) | Client cũ có thể không hỗ trợ mechanism mới | Test toàn bộ client type kết nối được trước khi enforce bắt buộc |

## 🧭 Key mechanics

- Kafka hỗ trợ rolling restart nhờ cơ chế replication/leader failover — điều kiện là ISR khoẻ mạnh trước khi
  bắt đầu, và chỉ restart 1 broker tại 1 thời điểm.
- Wire protocol có versioning cho phép tương thích ngược ở mức độ nhất định, nhưng version skew kéo dài là nợ
  kỹ thuật, không phải trạng thái ổn định nên duy trì lâu dài.
- Broker/client compatibility và schema compatibility là 2 trục độc lập, cần được rà soát riêng khi upgrade
  lớn.

## 🧭 Key decisions

1. **Luôn kiểm tra ISR khoẻ mạnh** (under-replicated partitions = 0) trước khi restart broker tiếp theo trong
   rolling upgrade.
2. **Test trên staging với traffic pattern gần giống production** trước khi upgrade production, đặc biệt với
   major version.
3. **Xác định rollback plan cụ thể trước khi bắt đầu**, bao gồm việc có nên trì hoãn "finalize"
   `inter.broker.protocol.version` cho tới khi chắc chắn upgrade thành công hay không.
4. **Không mix upgrade Kafka version với upgrade schema/business logic lớn cùng lúc** — tách rời các trục thay
   đổi để dễ xác định nguyên nhân nếu có sự cố.

## ⚖️ Trade-offs

- ✅ Rolling restart cho phép upgrade không downtime toàn cluster.
  ❌ Đổi lại: mất nhiều thời gian hơn (phải chờ từng broker rejoin ISR trước khi tiếp tục), không thể "upgrade
  nhanh" bằng cách restart đồng loạt.
- ✅ Staged rollout/canary giảm rủi ro phát hiện muộn.
  ❌ Đổi lại: tăng thời gian tổng thể của toàn bộ quá trình upgrade, cần kỷ luật vận hành để không "đốt cháy giai
  đoạn".
- ✅ Trì hoãn finalize protocol version giữ khả năng rollback.
  ❌ Đổi lại: không tận dụng được ngay các tính năng mới của version mới cho tới khi finalize.

## 🚨 Failure modes

| Sự kiện | Nguyên nhân | Hệ quả |
|---|---|---|
| Cluster mất quorum tạm thời khi upgrade | Restart nhiều broker cùng lúc khi ISR chưa khoẻ mạnh | Một số partition tạm thời không có leader, request bị lỗi/timeout |
| Không thể rollback về version cũ | Đã finalize `inter.broker.protocol.version`/metadata format mới trước khi xác nhận upgrade ổn định | Bị kẹt ở version mới dù phát hiện vấn đề nghiêm trọng, phải xử lý forward thay vì rollback |
| Client cũ không kết nối được sau khi đổi security config | Bật bắt buộc SASL/TLS mechanism mới mà chưa migrate hết client | Client cũ bị từ chối kết nối đột ngột, gây outage cho service chưa kịp migrate |
| Rebalance bất thường sau khi mix client version | Client version khác nhau dùng rebalance protocol khác nhau trong cùng consumer group | Rebalance churn tăng, lag tăng tạm thời không rõ nguyên nhân nếu không biết đang có mixed version |

## 🔍 Debugging hints

- Sau khi restart 1 broker, luôn kiểm tra **under-replicated partitions** và **offline partitions** trước khi
  tiến hành broker tiếp theo — đây là tín hiệu sớm nhất cho biết cluster đã ổn định lại chưa.
- Nếu gặp lỗi lạ sau upgrade chỉ ở 1 số client, nghi ngờ đầu tiên là **version compatibility** giữa client đó
  và broker mới — kiểm tra client library version và so với compatibility matrix chính thức.
- Nếu rebalance churn tăng bất thường sau khi triển khai client mới cho 1 phần consumer group, nghi ngờ **mixed
  rebalance protocol** giữa các client version khác nhau trong cùng group.
- Trước khi finalize protocol version mới, luôn giữ lại khả năng quan sát 1 khoảng thời gian đủ dài (không
  finalize ngay sau khi restart broker cuối cùng) để chắc chắn không có vấn đề ẩn xuất hiện muộn.

## 🧱 Operational implications

- Upgrade nên có **runbook rõ ràng**: thứ tự broker, tiêu chí "an toàn để tiếp tục", điều kiện dừng/rollback,
  và người chịu trách nhiệm theo dõi từng bước.
- Upgrade production nên tránh trùng với giờ traffic cao điểm — dù rolling restart lý thuyết không downtime,
  vẫn có latency tăng tạm thời khi leader failover diễn ra.
- Compatibility testing (client cũ + broker mới, client mới + broker cũ) nên là 1 phần của pipeline test trước
  khi rollout, không phải chỉ test "happy path" 1 tổ hợp version.

## ❌ Anti-patterns

### ❌ Upgrade everything at once
**Biểu hiện:** restart toàn bộ broker cùng lúc, hoặc upgrade cả broker lẫn toàn bộ client cùng 1 đợt deploy.
**Tại sao người ta hay làm vậy:** muốn "xong luôn một lần", tránh phải quản lý trạng thái trung gian (mixed
version) kéo dài.
**Tại sao nó là vấn đề:** nếu có vấn đề, không có cách nào cô lập được nguyên nhân là do broker, do client, hay
do tổ hợp cả hai — đồng thời rủi ro mất quorum tạm thời cao hơn hẳn khi restart đồng loạt.
**Thay vào đó nên làm:** ✅ Rolling restart từng broker một với điểm kiểm tra rõ ràng; tách riêng đợt upgrade
broker và đợt upgrade client, không làm cùng lúc.

### ❌ Ignore client compatibility
**Biểu hiện:** upgrade broker mà không kiểm tra client hiện tại (đặc biệt client cũ, ít được maintain) có tương
thích với version broker mới hay không.
**Tại sao người ta hay làm vậy:** giả định "Kafka luôn tương thích ngược", không đọc kỹ release notes hoặc
compatibility matrix.
**Tại sao nó là vấn đề:** một số client rất cũ có thể gặp vấn đề với broker rất mới (deprecated feature, đổi
default behavior) — phát hiện lỗi này ở production tốn kém hơn nhiều so với kiểm tra trước.
**Thay vào đó nên làm:** ✅ Kiểm kê toàn bộ client đang kết nối cluster (bao gồm cả service ít người nhớ tới),
xác nhận compatibility trước khi upgrade broker.

### ❌ No rollback thought
**Biểu hiện:** bắt đầu upgrade mà không có kế hoạch rõ ràng "nếu có vấn đề thì làm gì tiếp theo".
**Tại sao người ta hay làm vậy:** kỳ vọng upgrade sẽ suôn sẻ dựa trên test ở staging, chủ quan bỏ qua bước lập
kế hoạch rollback.
**Tại sao nó là vấn đề:** một số thay đổi (đặc biệt finalize protocol version) không rollback được sau khi đã
thực hiện — nếu phát hiện vấn đề nghiêm trọng sau khi đã đi quá xa, chỉ còn lựa chọn xử lý forward tốn nhiều
thời gian và rủi ro hơn.
**Thay vào đó nên làm:** ✅ Luôn xác định trước "điểm không quay lại được" (point of no return) trong quy trình
upgrade, và trì hoãn các bước không thể rollback cho tới khi đã xác nhận ổn định.

## 🧪 Mini scenarios

**Scenario 1 — Broker rolling upgrade:**
Cluster 6 broker cần upgrade từ version cũ lên version mới có tính năng cải thiện storage. Team thực hiện: chọn
1 broker canary đầu tiên, restart, theo dõi under-replicated partitions và latency trong 30 phút, xác nhận ổn
định rồi mới tiếp tục broker thứ 2, lặp lại cho tới hết 6 broker. Sau khi tất cả broker đã chạy version mới ổn
định qua vài ngày quan sát, team mới finalize `inter.broker.protocol.version` để dùng tính năng mới.

**Scenario 2 — Mixed client versions:**
Trong quá trình migrate dần các service sang client library mới, 1 consumer group có cả instance chạy client
cũ và client mới cùng lúc trong vài tuần. Team theo dõi kỹ rebalance churn trong giai đoạn này, xác nhận cả 2
version dùng chung rebalance protocol tương thích trước khi bắt đầu rollout, tránh để tình trạng mixed version
kéo dài quá lâu (đặt deadline dọn dẹp rõ ràng).

**Scenario 3 — Upgrade under heavy traffic:**
Một tổ chức buộc phải upgrade broker để vá lỗ hổng bảo mật khẩn cấp, không thể đợi tới giờ traffic thấp. Team
giảm thiểu rủi ro bằng cách: xác nhận replication factor đủ cao (RF=3) và ISR khoẻ mạnh trước khi bắt đầu, upgrade
từng broker 1 với khoảng nghỉ dài hơn bình thường giữa các bước để traffic có thời gian ổn định lại, và chuẩn bị
sẵn kế hoạch rollback nhanh nếu latency tăng vượt ngưỡng chấp nhận được.

## 🎤 Interview lens

**"Bạn upgrade Kafka cluster production như thế nào mà không gây downtime?"**
> Câu trả lời yếu: "Kafka hỗ trợ rolling restart nên cứ restart lần lượt là được." Câu trả lời tốt cần nhắc:
> điều kiện tiên quyết (ISR khoẻ mạnh, RF đủ cao), thứ tự từng broker một với điểm kiểm tra, canary trước khi
> staged rollout toàn bộ, và đặc biệt là **rollback plan** trước khi finalize protocol version mới.

**"Version skew giữa client và broker có nguy hiểm không?"**
> Câu trả lời tốt cần phân biệt: skew tạm thời trong lúc rolling upgrade là thiết kế bình thường và an toàn;
> skew kéo dài (nhiều tháng, nhiều version chênh lệch lớn) là nợ kỹ thuật tích luỹ rủi ro — đặc biệt khi broker
> có tính năng mới mà client cũ không biết dùng, hoặc khi 1 phiên bản rất cũ bị deprecated hỗ trợ.

## ✅ Key takeaways

- Upgrade Kafka là 1 sự kiện vận hành có rủi ro, cần runbook, giám sát, và rollback plan — không phải "cập
  nhật package" đơn giản.
- Rolling restart hoạt động dựa trên replication/leader failover — cần ISR khoẻ mạnh và chỉ restart 1 broker
  tại 1 thời điểm.
- Compatibility có 2 trục độc lập: broker/client protocol version, và schema/app data compatibility — cần rà
  soát riêng biệt.
- Canary → staged rollout → rollback thinking là quy trình đúng cho upgrade production, không phải "upgrade
  toàn bộ rồi xem".
- Một số thay đổi (đặc biệt finalize protocol version) không rollback được — cần xác định "điểm không quay
  lại" trước khi thực hiện.

## 🔗 Xem tiếp / Liên kết liên quan

- [`05-failures-and-recovery.md`](05-failures-and-recovery.md) — cơ chế leader failover là nền tảng cho rolling
  restart an toàn.
- [`06-security-authentication-authorization-encryption.md`](06-security-authentication-authorization-encryption.md)
  — thay đổi cấu hình bảo mật cũng cần tư duy staged rollout tương tự.
- [`../04-ecosystem/02-schema-registry.md`](../04-ecosystem/02-schema-registry.md) — trục compatibility độc
  lập cần rà soát riêng khi upgrade lớn.
- [`README.md`](README.md) — quay lại tổng quan phần Operations.
