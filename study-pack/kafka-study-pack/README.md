# Kafka Study Pack

> Bộ tài liệu học Kafka nghiêm túc, bằng tiếng Việt — **học sâu, thực dụng, hiểu bản chất, hiểu trade-off**.
> Đây **KHÔNG** phải tài liệu ôn chứng chỉ (certification cram). Mục tiêu là đủ năng lực **design / operate /
> troubleshoot** Kafka trong hệ thống thực tế, không chỉ nhớ định nghĩa.

## ✅ Trạng thái hiện tại: Nội dung đã hoàn thiện

Toàn bộ `00-overview/` đến `08-learning-aids/` đã có nội dung đầy đủ (mental model, trade-off, failure mode,
anti-pattern, mini scenario, interview lens theo từng loại file phù hợp). Chỉ còn lượt **Final Review** (rà
soát tính nhất quán toàn pack) chưa chạy. Xem tiến độ đầy đủ tại [`GENERATION-PLAN.md`](GENERATION-PLAN.md).

## 🎯 Đối tượng phù hợp

- Backend / platform engineer đã biết khái niệm messaging cơ bản (queue, pub/sub), muốn hiểu Kafka **thực sự
  hoạt động ra sao**, không chỉ "biết dùng API".
- Người cần **thiết kế hệ thống** dùng Kafka (topic design, partitioning, schema, delivery semantics).
- Người cần **vận hành / debug** Kafka production (lag, rebalance storm, hot partition, mất message...).
- **Không** phù hợp cho người chỉ cần "pass chứng chỉ CCDAK" hoặc học để trả lời trắc nghiệm nhanh.

## 📚 Cách học theo thứ tự

Đọc tuần tự theo số thứ tự thư mục. Mỗi thư mục có `README.md` riêng giải thích rõ hơn nội dung và thứ tự đọc
bên trong. Không nên nhảy cóc sang `03-design-and-architecture` trước khi nắm chắc `01-foundation` và
`02-core-internals` — phần lớn quyết định thiết kế chỉ hợp lý khi đã hiểu internals.

| # | Thư mục | Học được gì |
|---|---------|--------------|
| 00 | [00-overview](00-overview/README.md) | Kafka là gì, khi nào dùng / không dùng, mental model tổng quát |
| 01 | [01-foundation](01-foundation/README.md) | Khái niệm nền tảng: topic, partition, offset, consumer group, delivery semantics |
| 02 | [02-core-internals](02-core-internals/README.md) | Cơ chế bên trong: write path, read path, replication, rebalancing, storage |
| 03 | [03-design-and-architecture](03-design-and-architecture/README.md) | Thiết kế hệ thống thực tế, trade-off, so sánh với message broker khác |
| 04 | [04-ecosystem](04-ecosystem/README.md) | Kafka Connect, Schema Registry, Kafka Streams, ksqlDB, Debezium/CDC |
| 05 | [05-operations](05-operations/README.md) | Capacity planning, scaling, monitoring, security, upgrade |
| 06 | [06-troubleshooting](06-troubleshooting/README.md) | Xử lý sự cố thường gặp trong production |
| 07 | [07-patterns-and-anti-patterns](07-patterns-and-anti-patterns/README.md) | Pattern tốt, anti-pattern, kịch bản kiến trúc thực tế |
| 08 | [08-learning-aids](08-learning-aids/README.md) | Cheatsheet, decision guide, câu hỏi ôn theo kiểu phỏng vấn |

## 🧭 Tài liệu điều phối (dùng để sinh & kiểm soát chất lượng nội dung)

- [`GLOSSARY.md`](GLOSSARY.md) — thuật ngữ chuẩn hoá, dùng nhất quán xuyên suốt bộ tài liệu.
- [`STYLE-GUIDE.md`](STYLE-GUIDE.md) — quy tắc viết lesson, decision guide, troubleshooting, anti-pattern, scenario.
- [`GENERATION-PLAN.md`](GENERATION-PLAN.md) — kế hoạch sinh nội dung theo nhiều prompt, đúng thứ tự.
- [`QUALITY-CHECKLIST.md`](QUALITY-CHECKLIST.md) — checklist rà soát chất lượng cho từng file trước khi coi là "done".

## 🗂️ Cấu trúc thư mục chính thức

```
kafka-study-pack/
  README.md
  GLOSSARY.md
  STYLE-GUIDE.md
  GENERATION-PLAN.md
  QUALITY-CHECKLIST.md

  00-overview/
  01-foundation/
  02-core-internals/
  03-design-and-architecture/
  04-ecosystem/
  05-operations/
  06-troubleshooting/
  07-patterns-and-anti-patterns/
  08-learning-aids/
```

Chi tiết file trong từng thư mục xem tại README của thư mục đó.

## ➡️ Bước tiếp theo

Xem [`GENERATION-PLAN.md`](GENERATION-PLAN.md) để biết prompt tiếp theo cần sinh nội dung cho thư mục nào.
