# 07 — Replication & HA

## 🎯 Mục tiêu học

Sau phase này bạn phải giải thích được: replication trong PostgreSQL thực chất là *sao chép WAL rồi replay*, không phải "đồng bộ real-time". Bạn phải phân biệt rạch ròi 4 khái niệm hay bị gộp làm một: **High Availability (HA)**, **read scaling**, **disaster recovery (DR)**, và **backup/PITR** — mỗi cái giải quyết một vấn đề khác nhau, dùng cơ chế khác nhau, và có failure mode khác nhau. Bạn cũng phải trả lời được câu hỏi backend engineer hay gặp nhất: "app của tôi có được đọc dữ liệu này từ replica không?"

## 📌 Vì sao replication/HA dễ bị hiểu sai

- Người ta hay nói "primary gửi WAL cho standby" như một câu cửa miệng, nhưng không giải thích được **vì sao standby luôn trễ một khoảng nào đó**, và khoảng trễ đó nằm ở đâu trong pipeline (send/write/flush/replay).
- "Có replica" bị hiểu nhầm thành "có backup" — trong khi replica sao chép **mọi thứ, kể cả lỗi** (xóa nhầm dữ liệu trên primary sẽ replicate sang standby ngay lập tức).
- "Đọc từ replica" bị coi là luôn an toàn cho mọi loại query — trong khi một số luồng nghiệp vụ (claim job, check-then-act, đọc lại sau khi ghi) sẽ **sinh bug thật** nếu đọc phải state cũ.
- "Failover" bị coi là chuyện hạ tầng thuần túy — trong khi app phải tự xử lý retry/idempotency sau khi promotion xảy ra, nếu không sẽ có duplicate side-effect.

## 📋 Thứ tự đọc khuyến nghị

1. [`01-streaming-replication-and-wal-shipping.md`](01-streaming-replication-and-wal-shipping.md) — nền tảng: WAL là gì trong bối cảnh replication, streaming vs shipping, timeline commit → replay.
2. [`02-replication-lag-slots-and-backpressure.md`](02-replication-lag-slots-and-backpressure.md) — lag hình thành từ đâu, slot bảo vệ gì và gây nguy hiểm gì.
3. [`03-read-replicas-consistency-and-routing.md`](03-read-replicas-consistency-and-routing.md) — caveat consistency khi đọc từ replica, query nào an toàn để route.
4. [`04-failover-promotion-and-ha-trade-offs.md`](04-failover-promotion-and-ha-trade-offs.md) — RPO/RTO, sync vs async, app behavior sau failover.
5. [`05-backup-base-backup-and-point-in-time-recovery.md`](05-backup-base-backup-and-point-in-time-recovery.md) — vì sao replication không phải backup, PITR thực tế cần gì.

## ⭐ File xương sống

[`02-replication-lag-slots-and-backpressure.md`](02-replication-lag-slots-and-backpressure.md) là file nền cho mọi lý luận sau đó về consistency (file 03) và HA trade-off (file 04) — lag chính là nguyên nhân gốc của mọi caveat consistency, và slot chính là công cụ (và cũng là rủi ro) kiểm soát lag đó.

## ⏱️ Nếu chỉ có ít thời gian

Đọc `03-read-replicas-consistency-and-routing.md` và `05-backup-base-backup-and-point-in-time-recovery.md` trước — đây là hai chủ đề backend engineer chạm phải thường xuyên nhất (routing query sai gây bug nghiệp vụ; nhầm lẫn replica với backup gây mất dữ liệu vĩnh viễn khi có sự cố).

## 🗺️ Map: problem → replica/HA/PITR có giúp không → caveat lớn nhất

| Problem | Replica/HA/PITR có giúp không? | Caveat lớn nhất |
|---|---|---|
| Primary chết, cần tiếp tục phục vụ nhanh | ✅ HA (failover/promotion) giúp | RPO > 0 với async — có thể mất vài giao dịch gần nhất; app cần idempotent retry |
| Giảm tải đọc cho primary | ⚠️ Read replica giúp một phần | Chỉ an toàn cho read không nhạy cảm với độ mới (stale-tolerant); không phải "free scaling" cho mọi loại query |
| Xóa nhầm dữ liệu / bad migration | ❌ Replication KHÔNG giúp (lỗi đã replicate) | Chỉ backup + PITR mới cứu được; phải có WAL archive và **test restore** |
| Đọc lại ngay sau khi ghi (read-your-write) | ❌ Replica không đảm bảo | Phải đọc từ primary hoặc dùng routing pattern read-after-write-aware |
| Cần audit/report lịch sử không cần mới nhất tuyệt đối | ✅ Replica phù hợp | Vẫn cần biết lag hiện tại để đặt kỳ vọng đúng với business |
| Worker claim job (`processing_jobs`) | ❌ Đọc từ replica rất nguy hiểm | Có thể claim job đã được worker khác xử lý xong (state cũ) — phải đọc + claim trên primary |

## 🔗 Điều hướng

- ⬅️ Trước: [06 — Partitioning & Large Tables](../06-partitioning-and-large-tables/README.md)
- ➡️ Sau: [08 — Connection Management](../08-connection-management/README.md) — sẽ mở rộng ở phần sau.
