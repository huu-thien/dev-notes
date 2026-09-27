# Global Infrastructure

Region, Availability Zone, Edge Location, Local Zone, và Wavelength — nền tảng địa lý của toàn bộ hạ tầng AWS.

## Mục lục

- [Mục tiêu học](#mục-tiêu-học)
- [Practical understanding](#practical-understanding)
- [Exam focus](#exam-focus)
- [Common traps](#common-traps)
- [Mini scenario](#mini-scenario)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Mục tiêu học

- Phân biệt được Region, Availability Zone (AZ), Edge Location, Local Zone, Wavelength.
- Hiểu vì sao kiến trúc HA/DR luôn xoay quanh khái niệm AZ và Region.

## Practical understanding

- **Region**: một khu vực địa lý độc lập (VD: `ap-southeast-1` — Singapore), chứa nhiều Availability Zone. Mỗi Region hoàn toàn tách biệt về hạ tầng vật lý và dữ liệu (trừ khi bạn chủ động replicate).
- **Availability Zone (AZ)**: một hoặc nhiều data center riêng biệt trong cùng Region, có nguồn điện/mạng/làm mát độc lập nhưng kết nối với nhau bằng mạng tốc độ cao, độ trễ thấp. Một Region luôn có ≥ 2 AZ (thường 3+).
- **Edge Location**: điểm hiện diện (PoP) của CloudFront và Route 53, dùng để phục vụ nội dung/gần người dùng cuối, số lượng nhiều hơn AZ rất nhiều và phân bố toàn cầu.
- **Local Zone**: một phần mở rộng của Region đặt gần các thành phố lớn, dùng khi ứng dụng cần độ trễ cực thấp tới người dùng ở khu vực đó mà chưa có Region chính thức.
- **Wavelength**: hạ tầng AWS đặt trong mạng 5G của nhà mạng viễn thông, phục vụ ứng dụng cần độ trễ siêu thấp cho thiết bị di động/edge computing.

## Exam focus

### Must know for exam

- Muốn High Availability → triển khai tài nguyên trên nhiều AZ trong cùng Region.
- Muốn Disaster Recovery ở mức cao nhất → triển khai trên nhiều Region.
- Edge Location dùng cho CloudFront/Route 53 (phân phối nội dung), không phải nơi chạy compute chính (EC2/RDS).

### Important

- Local Zone và Wavelength là các lựa chọn khi cần độ trễ cực thấp cho một khu vực/thiết bị cụ thể — ít xuất hiện trực tiếp nhưng có thể là đáp án gây nhiễu.

### Nice to know

- Số lượng AZ và Edge Location cụ thể theo từng Region — không cần nhớ số chính xác cho kỳ thi.

## Common traps

### Trap: nhầm Region với Availability Zone khi nói về HA
Đề hỏi "tăng tính sẵn sàng" thường trỏ tới triển khai **đa AZ trong 1 Region** (Multi-AZ), không phải đa Region — trừ khi đề nói rõ về Disaster Recovery/compliance yêu cầu dữ liệu ở khu vực địa lý khác.

### Trap: nhầm Edge Location là nơi lưu trữ dữ liệu chính
Edge Location chỉ cache/phân phối nội dung (CloudFront) — dữ liệu gốc vẫn nằm ở Region (S3, RDS...).

## Mini scenario

**Tình huống:** Ứng dụng cần chịu được sự cố mất toàn bộ một data center mà không ảnh hưởng tới người dùng.
**Đáp án đúng:** Triển khai tài nguyên (EC2 qua Auto Scaling Group, RDS Multi-AZ) trải trên ít nhất 2 Availability Zone trong cùng Region.
**Vì sao:** Sự cố mức data center tương ứng với mất 1 AZ — giải pháp chuẩn là phân tán qua nhiều AZ, không cần thiết phải dùng nhiều Region (over-engineering, tốn chi phí hơn).

## Key takeaways

- Region = độc lập hoàn toàn; AZ = độc lập vật lý nhưng kết nối nhanh trong cùng Region.
- HA thường giải quyết bằng nhiều AZ; DR nghiêm ngặt mới cần nhiều Region.
- Edge Location/Local Zone/Wavelength là các lớp hạ tầng bổ sung cho mục đích latency, không thay thế Region/AZ.

## Checklist tự ôn

- [ ] Tôi phân biệt được rõ ràng Region vs AZ vs Edge Location.
- [ ] Tôi biết khi nào dùng Local Zone/Wavelength thay vì Region thông thường.
- [ ] Tôi hiểu vì sao Multi-AZ giải quyết HA còn multi-Region thiên về DR.

## Xem tiếp / Liên kết liên quan

- [02-iam-basics.md](./02-iam-basics.md)
- [03-networking-basics.md](./03-networking-basics.md)
- [../02-core-services/06-vpc.md](../02-core-services/06-vpc.md)
- [../03-architecture-patterns/01-high-availability.md](../03-architecture-patterns/01-high-availability.md)
