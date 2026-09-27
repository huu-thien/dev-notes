# S3 vs EBS vs EFS vs FSx

So sánh nhanh 4 loại storage để chọn đúng đáp án khi đề thi mô tả một kịch bản lưu trữ cụ thể.

## Mục tiêu học

- Phân biệt object storage (S3), block storage (EBS), và shared file storage (EFS/FSx).
- Nhận diện đúng keyword đề thi để chọn đúng loại storage.

## Khi nào nên đọc file này

Sau khi đã đọc [`../02-core-services/02-ebs-efs-fsx.md`](../02-core-services/02-ebs-efs-fsx.md) và [`../02-core-services/03-s3.md`](../02-core-services/03-s3.md) — file này không nhắc lại chi tiết từng service, chỉ tổng hợp để ra quyết định nhanh.

## Bảng so sánh nhanh

| Tiêu chí | S3 | EBS | EFS | FSx |
|---|---|---|---|---|
| Loại storage | Object | Block | File (NFS) | File (Windows/Lustre) |
| Truy cập đồng thời nhiều instance | Có (qua API/HTTP) | Không (1 instance, trừ Multi-Attach io2 đặc biệt) | Có, nhiều instance/AZ | Có, nhiều instance |
| Gắn với 1 instance cụ thể | Không | Có | Không | Không |
| OS phù hợp | Bất kỳ (qua API) | Linux/Windows (gắn instance) | Chủ yếu Linux (NFS) | Windows (FSx for Windows) hoặc HPC Linux (FSx for Lustre) |
| Ví dụ dùng | Static asset, data lake, backup | Volume gốc OS, database file | Home directory dùng chung, CMS content | Windows file share, HPC workload |

## So sánh theo tiêu chí ra đề thi

- **"Nhiều EC2 instance cần truy cập cùng file đồng thời"** → EFS (Linux) hoặc FSx for Windows (Windows).
- **"Volume gắn liền với 1 instance, cần hiệu năng ổn định cho database"** → EBS.
- **"Lưu trữ static asset, phục vụ qua Internet, gần như không giới hạn dung lượng"** → S3.
- **"Ứng dụng Windows cần SMB file share"** → FSx for Windows File Server.
- **"Xử lý HPC, machine learning, cần throughput cao"** → FSx for Lustre.

## Keyword nhận diện trong đề

| Keyword trong đề | Storage gợi ý |
|---|---|
| "object storage", "static website", "durable 11 nines" | S3 |
| "attached to EC2 instance", "root volume", "database volume" | EBS |
| "shared file system", "multiple EC2 across AZ", "NFS" | EFS |
| "Windows file share", "SMB", "Active Directory integration" | FSx for Windows |
| "high performance computing", "Lustre", "machine learning training data" | FSx for Lustre |

## Khi nào chọn A / B / C

- Chọn **S3** khi: dữ liệu không cần gắn trực tiếp vào OS, cần scale gần như vô hạn, truy cập qua API/HTTP là đủ.
- Chọn **EBS** khi: cần volume gắn liền 1 instance, hiệu năng block-level ổn định (VD: database file, boot volume).
- Chọn **EFS** khi: nhiều Linux instance ở nhiều AZ cần truy cập cùng file hệ thống dùng chung.
- Chọn **FSx** khi: cần file system chuyên biệt (Windows SMB hoặc HPC Lustre) mà EFS không đáp ứng.

## Khi nào không nên chọn

- Không chọn S3 khi ứng dụng cần thao tác file như file system thật (mount trực tiếp, POSIX file locking) — S3 là object storage, không phải file system.
- Không chọn EBS khi cần nhiều instance cùng ghi/đọc đồng thời — EBS gắn với 1 instance tại 1 thời điểm (trừ trường hợp Multi-Attach io2 đặc biệt, ít gặp trong đề thi).
- Không chọn EFS cho workload cần file share kiểu Windows (SMB) — dùng FSx for Windows.

## Trade-offs

| Lựa chọn | Đánh đổi |
|---|---|
| S3 thay vì EBS/EFS | Rẻ hơn, scale tốt hơn nhưng không mount như file system truyền thống, độ trễ truy cập khác biệt |
| EFS thay vì EBS | Chia sẻ được nhiều instance nhưng chi phí và độ trễ per-operation thường cao hơn EBS |
| FSx thay vì EFS | Đáp ứng nhu cầu chuyên biệt (Windows/HPC) nhưng phức tạp hơn và chi phí thường cao hơn |

## Common traps

### Trap: nghĩ S3 dùng được như file system
S3 không hỗ trợ mount trực tiếp như file system POSIX — nếu đề yêu cầu "mount như 1 thư mục dùng chung, nhiều instance ghi/đọc trực tiếp", đáp án đúng là EFS/FSx, không phải S3.

### Trap: nghĩ EBS chia sẻ được nhiều instance
EBS mặc định chỉ gắn với 1 instance tại 1 thời điểm — đề thi có "shared file access giữa nhiều instance" gần như luôn loại trừ EBS.

### Trap: nghĩ EFS dùng được cho Windows
EFS dùng giao thức NFS, chủ yếu cho Linux. Nếu đề nhắc "Windows file share" hoặc "SMB", đáp án đúng là FSx for Windows File Server, không phải EFS.

## Mini scenario

**Tình huống:** Một nhóm ứng dụng Linux chạy trên nhiều EC2 instance ở 2 AZ khác nhau, cần truy cập chung 1 thư mục dữ liệu, tự động mở rộng dung lượng theo nhu cầu.
**Đáp án đúng:** Amazon EFS.
**Vì sao:** Yêu cầu chia sẻ file giữa nhiều Linux instance ở nhiều AZ là đặc điểm nhận diện chuẩn của EFS — EBS không chia sẻ được, S3 không phải file system POSIX, FSx for Windows không phù hợp Linux.

## Key takeaways

- S3 = object storage, không phải file system; EBS = block storage gắn 1 instance; EFS/FSx = shared file storage.
- EFS phù hợp Linux/NFS; FSx phù hợp Windows (SMB) hoặc HPC (Lustre).
- Từ khóa đề thi (shared access, mount, SMB, HPC) là chìa khóa nhận diện đúng service.

## Checklist tự ôn

- [ ] Tôi chọn đúng storage cho ít nhất 4 kịch bản khác nhau trong bảng trên.
- [ ] Tôi biết vì sao S3 không phải file system.
- [ ] Tôi biết vì sao EBS không chia sẻ được nhiều instance.
- [ ] Tôi phân biệt được EFS và FSx for Windows theo OS.

## Xem tiếp / Liên kết liên quan

- [../02-core-services/02-ebs-efs-fsx.md](../02-core-services/02-ebs-efs-fsx.md)
- [../02-core-services/03-s3.md](../02-core-services/03-s3.md)
- [README.md](./README.md)
