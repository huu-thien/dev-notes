# Fault Tolerance

Pattern giúp hệ thống tiếp tục hoạt động đúng, không gián đoạn, ngay cả khi một thành phần bên trong gặp lỗi.

## Mục lục

- [Mục tiêu học](#mục-tiêu-học)
- [Practical understanding](#practical-understanding)
- [Exam focus](#exam-focus)
- [Decision mindset / decision framework](#decision-mindset--decision-framework)
- [Service mapping](#service-mapping)
- [Trade-offs](#trade-offs)
- [Anti-patterns / lựa chọn sai thường gặp](#anti-patterns--lựa-chọn-sai-thường-gặp)
- [Common traps](#common-traps)
- [Mini scenarios](#mini-scenarios)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Mục tiêu học

- Hiểu **Fault Tolerance (FT)** là gì và vì sao nó là mức yêu cầu cao hơn HA.
- Nắm các kỹ thuật đạt FT: redundancy, graceful degradation, failure isolation, decoupling.
- Phân biệt rõ ràng FT và HA — bẫy thi rất phổ biến.

## Practical understanding

### Fault Tolerance là gì

**Fault Tolerance (FT)** — đã định nghĩa ở [`GLOSSARY.md`](../GLOSSARY.md) — là khả năng hệ thống **tiếp tục hoạt động đúng, không gián đoạn dịch vụ**, ngay cả khi một hoặc nhiều thành phần bên trong gặp lỗi. Khác với HA (chấp nhận gián đoạn ngắn trong lúc failover), FT yêu cầu người dùng cuối **không cảm nhận được** sự cố đã xảy ra.

🧠 **Exam mindset:** FT giải quyết bài toán "**mất 1 phần hệ thống mà không ai nhận ra**" — mức yêu cầu này cao hơn hẳn HA và tốn kém hơn nhiều. Tín hiệu trong đề dẫn tới FT: "zero downtime", "không được gián đoạn dù chỉ vài giây", "người dùng không được cảm nhận sự cố". Nếu đề chỉ nói "tự động phục hồi nhanh" (chấp nhận vài chục giây gián đoạn), đó vẫn là HA, không phải FT.

### Redundancy

**Redundancy** (dư thừa tài nguyên) là nền tảng của FT — luôn có nhiều hơn 1 bản sao của mỗi thành phần đang hoạt động song song (active-active), không phải chỉ có bản dự phòng đứng chờ. Ví dụ: nhiều instance cùng phục vụ traffic thực tế qua ELB, thay vì 1 instance chính và 1 instance chờ failover.

### Graceful degradation

**Graceful degradation** là khi hệ thống gặp sự cố một phần nhưng vẫn tiếp tục phục vụ ở mức giảm tải/giảm tính năng thay vì sập hoàn toàn. Ví dụ: nếu service gợi ý sản phẩm bị lỗi, trang web vẫn hiển thị được sản phẩm chính, chỉ ẩn phần gợi ý — thay vì trả lỗi toàn trang.

### Failure isolation

**Failure isolation** nghĩa là cô lập sự cố trong phạm vi nhỏ nhất có thể, không để lỗi lan ra toàn hệ thống. Kỹ thuật phổ biến: tách service theo domain riêng biệt, dùng nhiều Auto Scaling Group độc lập theo chức năng, tránh 1 lỗi ở service phụ làm sập toàn bộ luồng chính.

### Decoupling để chịu lỗi tốt hơn

**Decoupling** (xem [`11-sqs-sns-eventbridge.md`](../02-core-services/11-sqs-sns-eventbridge.md)) giúp tăng FT: nếu consumer tạm thời lỗi/downtime, message vẫn nằm trong SQS chờ xử lý thay vì bị mất hoặc làm producer bị chặn. Kiến trúc decoupled chịu lỗi tốt hơn kiến trúc gọi trực tiếp đồng bộ (tight coupling) giữa các service.

⚠️ **Giới hạn tư duy nếu chọn sai:** đừng nghĩ "chỉ cần thêm SQS ở giữa" là đã đạt FT hoàn toàn. Queue chỉ giải quyết vấn đề **buffer khi consumer chậm/lỗi tạm thời** — hệ thống vẫn cần đủ capacity ở consumer để xử lý hết backlog, và vẫn cần idempotency để tránh xử lý trùng khi retry.

## Exam focus

### Must know for exam

- FT = hệ thống tiếp tục hoạt động đúng, không gián đoạn, khi một thành phần lỗi — mức yêu cầu cao hơn HA.
- HA chấp nhận gián đoạn ngắn (failover time); FT không chấp nhận gián đoạn.
- Redundancy dạng active-active (nhiều bản sao cùng hoạt động) là kỹ thuật FT phổ biến, khác với active-passive (chỉ HA).
- Decoupling qua SQS/SNS/EventBridge tăng khả năng chịu lỗi giữa các service.

### Important

- Multi-Region active-active là mức FT cao nhất trong các pattern DR (xem [`07-disaster-recovery.md`](./07-disaster-recovery.md)), nhưng chi phí và độ phức tạp cũng cao nhất.
- Circuit breaker / retry with backoff là kỹ thuật code-level hỗ trợ FT (không đi sâu vào code trong phạm vi SAA-C03).

### Nice to know

- Chi tiết implement retry/backoff cụ thể trong SDK không phải trọng tâm exam SAA-C03 (thiên về kiến trúc hơn code).

## Decision mindset / decision framework

Khi đề bài dùng cụm "không được gián đoạn dù có lỗi xảy ra", "zero downtime", "hệ thống phải tiếp tục hoạt động ngay cả khi 1 AZ/component fail hoàn toàn":

1. Đây là dấu hiệu của FT, không chỉ HA — cần redundancy active-active thực sự, không chỉ failover.
2. Kiểm tra các thành phần có được decouple chưa — nếu gọi trực tiếp đồng bộ giữa các service, lỗi 1 chỗ dễ lan ra toàn hệ thống.
3. Xem xét graceful degradation cho các tính năng không thiết yếu.
4. Nếu yêu cầu chịu được cả sự cố toàn Region, đây là bài toán Multi-Region FT/DR, không chỉ Multi-AZ.

## Service mapping

| Vai trò | Service chính | Vai trò hỗ trợ |
|---|---|---|
| Redundancy active-active cho compute | ELB + nhiều instance chạy song song, đủ capacity mỗi AZ | Auto Scaling Group chỉ bổ trợ, không phải nền tảng FT chính |
| Decoupling / failure isolation | SQS (queue đệm), SNS/EventBridge (fanout, tách luồng phụ) | Giúp lỗi ở 1 service không lan ra toàn hệ thống |
| Multi-Region active-active (FT mức cao nhất) | Route 53 (định tuyến đồng thời 2 Region) + replication dữ liệu 2 chiều | Xem thêm [`07-disaster-recovery.md`](./07-disaster-recovery.md) |
| Graceful degradation | Thiết kế ứng dụng (fallback logic), không phải 1 service cụ thể | CloudWatch alarm có thể phát hiện khi tính năng phụ lỗi |

🧠 **Combination phổ biến trong đề:** "nhiều instance active-active + đủ capacity dự phòng sẵn (không chờ Auto Scaling phản ứng) + decoupling qua SQS/SNS cho luồng phụ" là bộ dấu hiệu FT kinh điển — khác với HA (chỉ cần ASG thay thế sau khi phát hiện lỗi).

## Trade-offs

| Yếu tố | Đánh đổi khi tăng Fault Tolerance |
|---|---|
| Chi phí | Redundancy active-active tốn nhiều tài nguyên chạy song song hơn active-passive |
| Độ phức tạp | Cần thiết kế decoupling, graceful degradation, kiểm thử chaos/failure injection |
| Tốc độ phát triển | Kiến trúc phức tạp hơn có thể làm chậm tốc độ phát triển tính năng mới |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Gọi mọi thiết kế multi-AZ là Fault Tolerance | Multi-AZ nghe "chống chịu lỗi tốt" nên dễ gán nhãn FT | Multi-AZ + Auto Scaling vẫn có khoảng thời gian phản ứng (instance mới cần khởi động) — đây là HA, FT yêu cầu redundancy active-active đã sẵn sàng từ đầu, không có khoảng gián đoạn dù ngắn |
| ❌ Bỏ qua single point of failure ở tầng ít người để ý (VD: 1 NAT Gateway duy nhất, 1 Lambda function không có DLQ) | Trọng tâm thường dồn vào compute/database, dễ quên các thành phần "phụ" | Một điểm lỗi duy nhất ở bất kỳ tầng nào (kể cả network/hàng đợi) đều phá vỡ FT toàn hệ thống — FT phải xét toàn bộ đường đi của request, không chỉ tầng chính |
| ❌ Nhầm queue/buffer (SQS) với cơ chế auto-healing hoàn chỉnh | SQS "giữ message an toàn" nên nghe như đã giải quyết được lỗi consumer | Queue chỉ đệm message trong lúc consumer lỗi/chậm — hệ thống vẫn cần đủ capacity xử lý backlog và cơ chế retry/idempotency, nếu không dữ liệu vẫn ùn ứ hoặc bị xử lý sai |
| ❌ Tin rằng thêm Auto Scaling Group là đạt FT | ASG "tự phục hồi" nên nghe giống FT | ASG phản ứng **sau khi** phát hiện lỗi (cần thời gian health check + khởi động instance mới) — đây là đặc trưng HA, không phải FT (FT cần capacity dự phòng đã chạy sẵn, không có độ trễ phản ứng) |

## Common traps

### ⚠️ Trap: HA vs Fault Tolerance
Đây là bẫy trọng tâm của file này. HA = chấp nhận gián đoạn ngắn, tự phục hồi nhanh (VD: RDS Multi-AZ failover mất vài chục giây). FT = không gián đoạn, người dùng không nhận ra sự cố đã xảy ra (VD: nhiều instance active-active sau ELB, 1 instance chết không ảnh hưởng traffic).

### ⚠️ Trap: nghĩ thêm Auto Scaling Group là đã đạt Fault Tolerance
Auto Scaling Group thay thế instance lỗi (tăng HA) nhưng vẫn có khoảng thời gian instance mới khởi động — nếu yêu cầu tuyệt đối không gián đoạn, cần đủ capacity dự phòng active-active ngay từ đầu, không chỉ dựa vào Auto Scaling phản ứng sau sự cố.

### ⚠️ Trap: nghĩ decoupling tự động đạt Fault Tolerance hoàn toàn
Decoupling giúp cô lập lỗi và giảm phụ thuộc trực tiếp, nhưng không tự động giải quyết mọi khía cạnh FT (VD: vẫn cần idempotency, vẫn cần capacity đủ ở consumer).

## Mini scenarios

🧪 **Scenario 1 — Hệ thống thanh toán yêu cầu zero downtime**

**Tình huống:** Hệ thống thanh toán yêu cầu tuyệt đối không được gián đoạn dịch vụ kể cả khi 1 AZ mất hoàn toàn kết nối, và các service phụ (gửi email xác nhận) không được làm chậm luồng thanh toán chính.
**Đáp án đúng:** Compute tier chạy active-active tại ≥ 2 AZ với đủ capacity dự phòng ở mỗi AZ; tách luồng gửi email ra khỏi luồng thanh toán chính qua SQS/SNS (decoupling + failure isolation).
**Vì sao:** Yêu cầu "tuyệt đối không gián đoạn" là dấu hiệu FT chứ không chỉ HA; tách luồng phụ ra khỏi luồng chính là failure isolation giúp lỗi ở service phụ không ảnh hưởng thanh toán.

🧪 **Scenario 2 — Graceful degradation cho tính năng gợi ý sản phẩm**

**Tình huống:** Trang thương mại điện tử có service gợi ý sản phẩm (recommendation) chạy trên Lambda, đôi khi timeout do dependency bên ngoài chậm. Yêu cầu: nếu service này lỗi, trang sản phẩm chính vẫn phải hiển thị đầy đủ thông tin mua hàng.
**Đáp án đúng:** Gọi recommendation service bất đồng bộ/tách biệt (VD: qua một Lambda riêng có timeout ngắn, hoặc gọi qua EventBridge không chặn luồng chính), có fallback UI khi không nhận được response đúng hạn — không để lỗi của service phụ chặn toàn bộ trang.
**Vì sao:** Đây là graceful degradation kinh điển — cô lập lỗi ở tính năng không thiết yếu để phần lõi (mua hàng) không bị ảnh hưởng, đúng tinh thần Fault Tolerance.

🧪 **Scenario 3 — Anti-pattern: tin Auto Scaling Group đã đủ cho yêu cầu "zero downtime"**

**Tình huống:** Đội kỹ thuật thiết kế hệ thống với Auto Scaling Group (min=2) đứng sau ALB, tự tin báo cáo rằng hệ thống đã đạt "zero downtime" vì ASG sẽ tự thay thế instance lỗi.
**Đáp án đúng:** Cần đánh giá lại yêu cầu thực sự — nếu đề bài chỉ cần "tự động phục hồi nhanh" thì ASG + ALB multi-AZ là đủ (đây là HA); nhưng nếu yêu cầu thực sự là "zero downtime tuyệt đối", cần chạy đủ capacity active-active ngay từ đầu, không phụ thuộc vào thời gian ASG phát hiện lỗi + khởi động instance mới.
**Vì sao đây là anti-pattern cần tránh:** ASG luôn có độ trễ giữa lúc instance chết và lúc instance thay thế sẵn sàng nhận traffic (health check interval + boot time) — khoảng thời gian này chính là gián đoạn thực tế, mâu thuẫn với định nghĩa "zero downtime" của Fault Tolerance.

## Key takeaways

- FT = không gián đoạn dịch vụ khi có lỗi, cao hơn HA (vốn chấp nhận gián đoạn ngắn).
- Redundancy active-active, graceful degradation, failure isolation, và decoupling là các kỹ thuật chính đạt FT.
- FT thường tốn chi phí và độ phức tạp cao hơn HA — chỉ áp dụng khi yêu cầu thực sự cần.
- Decoupling hỗ trợ FT nhưng không tự động giải quyết toàn bộ vấn đề (vẫn cần idempotency, capacity).

## Checklist tự ôn

- [ ] Tôi phân biệt được HA và FT bằng ví dụ cụ thể về thời gian gián đoạn.
- [ ] Tôi giải thích được active-active khác active-passive như thế nào.
- [ ] Tôi biết graceful degradation là gì và ví dụ minh họa.
- [ ] Tôi hiểu vì sao decoupling không tự động đạt FT hoàn toàn.

## Xem tiếp / Liên kết liên quan

- [01-high-availability.md](./01-high-availability.md)
- [07-disaster-recovery.md](./07-disaster-recovery.md)
- [../02-core-services/11-sqs-sns-eventbridge.md](../02-core-services/11-sqs-sns-eventbridge.md)
- [../04-comparison-guides/README.md](../04-comparison-guides/README.md)
