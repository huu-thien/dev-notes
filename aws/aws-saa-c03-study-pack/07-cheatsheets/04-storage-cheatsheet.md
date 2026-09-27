# Storage Cheatsheet

Tóm tắt siêu nhanh S3 vs EBS vs EFS vs FSx: object vs block vs file, shared vs single-instance, storage class. Xem [../02-core-services/02-ebs-efs-fsx.md](../02-core-services/02-ebs-efs-fsx.md) và [../02-core-services/03-s3.md](../02-core-services/03-s3.md) để đào sâu.

## Mục tiêu sử dụng cheatsheet

- Rà nhanh 4 loại storage chỉ bằng 1 câu keyword.
- Nhớ lại storage class của S3 và khi nào lifecycle rule phù hợp.
- Tránh các bẫy kinh điển: "S3 như file system", "EBS chia sẻ nhiều instance", "EFS cho Windows".

## Mục lục

- [Bảng so sánh nhanh](#bảng-so-sánh-nhanh)
- [Object vs Block vs File](#object-vs-block-vs-file)
- [Persistent vs Ephemeral](#persistent-vs-ephemeral)
- [S3 storage class mindset](#s3-storage-class-mindset)
- [Snapshot / Lifecycle / Replication keywords](#snapshot--lifecycle--replication-keywords)
- [Must remember](#must-remember)
- [Common traps / easy confusion](#common-traps--easy-confusion)
- [Exam keywords](#exam-keywords)
- [Quick decision hints](#quick-decision-hints)
- [Checklist tự rà soát](#checklist-tự-rà-soát)

## Bảng so sánh nhanh

| Tiêu chí | S3 | EBS | EFS | FSx |
|---|---|---|---|---|
| Loại | Object | Block | File (NFS) | File (SMB/Lustre) |
| Gắn với | Truy cập qua API/HTTP | 1 EC2 instance (trừ Multi-Attach) | Nhiều instance Linux đồng thời | Windows server hoặc HPC workload |
| Độ bền | Rất cao (11 nines) | Theo AZ, cần snapshot để bền hơn | Cao, multi-AZ | Theo cấu hình |
| Use case chính | Object storage, static site, backup, data lake | Boot volume, DB disk | Shared file storage Linux | Windows file server / HPC |

## Object vs Block vs File

- **Object (S3):** lưu file hoàn chỉnh kèm metadata, truy cập qua API, không có khái niệm path/folder thật sự (chỉ giả lập qua key prefix).
- **Block (EBS):** chia thành block nhỏ, hoạt động như ổ đĩa gắn trực tiếp vào 1 instance, cần OS quản lý file system ở trên.
- **File (EFS/FSx):** hệ thống file có cấu trúc thư mục thật, hỗ trợ nhiều client cùng truy cập qua giao thức mạng (NFS/SMB).

## Persistent vs Ephemeral

- EBS, EFS, FSx, S3: persistent — dữ liệu vẫn còn sau khi dừng/terminate instance (trừ khi chủ động xóa).
- Instance Store: ephemeral — dữ liệu mất khi instance dừng/terminate, chỉ dùng cho dữ liệu tạm/cache tốc độ cao, không dùng cho dữ liệu cần giữ lại.

## S3 storage class mindset

| Storage class | Khi dùng |
|---|---|
| Standard | Truy cập thường xuyên |
| Standard-IA / One Zone-IA | Truy cập không thường xuyên nhưng cần lấy nhanh khi cần |
| Intelligent-Tiering | Không rõ pattern truy cập, để AWS tự động tối ưu |
| Glacier / Glacier Deep Archive | Gần như không bao giờ truy cập, cần giữ vì tuân thủ pháp lý |

- Lifecycle rule tự động chuyển giữa các class theo thời gian — dùng khi không có nhân sự quản lý thủ công.

## Snapshot / Lifecycle / Replication keywords

- **Snapshot (EBS):** bản sao point-in-time, lưu trên S3, dùng để backup/khôi phục hoặc tạo volume mới.
- **Lifecycle (S3):** tự động chuyển storage class hoặc xóa object theo rule định sẵn.
- **Replication (S3):** sao chép object sang bucket khác (cùng hoặc khác Region) cho DR/compliance.

## Must remember

- S3 = object, không phải file system truyền thống.
- EBS mặc định gắn 1 instance; Multi-Attach chỉ áp dụng cho một số volume type đặc thù và cần filesystem cluster-aware, không phải cách dùng chuẩn.
- EFS cho Linux, FSx cho Windows (SMB) hoặc HPC (Lustre).
- Instance Store mất dữ liệu khi dừng/terminate — không dùng cho dữ liệu cần giữ.

## Common traps / easy confusion

- "S3 như file system" — S3 không hỗ trợ mount trực tiếp kiểu file system thật, cần qua gateway/API.
- "EBS chia sẻ nhiều instance" — sai với cách dùng mặc định; cần use case đặc thù (Multi-Attach) mới đúng, và ngay cả vậy vẫn không phải shared file system tổng quát.
- "EFS cho Windows" — sai, EFS chỉ hỗ trợ Linux (NFS); Windows cần FSx.
- "Xóa dữ liệu cold để tiết kiệm" — thường sai nếu đề yêu cầu tuân thủ pháp lý phải giữ dữ liệu; đáp án đúng thường là chuyển storage class rẻ hơn (Glacier), không phải xóa.

## Exam keywords

- "độ bền dữ liệu cao, truy cập qua HTTP" → S3
- "boot volume", "gắn 1 instance" → EBS
- "nhiều EC2 Linux truy cập đồng thời" → EFS
- "Windows file server", "SMB" → FSx
- "dữ liệu tạm, mất khi restart" → Instance Store
- "tuân thủ pháp lý, gần như không truy cập" → S3 Glacier / Glacier Deep Archive

## Quick decision hints

- Thấy "object", "API", "static website" → S3.
- Thấy "1 instance", "OS disk" → EBS.
- Thấy "shared" + "Linux" → EFS. Thấy "shared" + "Windows" → FSx.
- Thấy "tối ưu chi phí lưu trữ theo thời gian truy cập" → S3 Lifecycle rule.

## Checklist tự rà soát

- [ ] Tôi phân biệt được ngay object vs block vs file storage.
- [ ] Tôi nhớ đúng use case của từng S3 storage class.
- [ ] Tôi tránh được bẫy "EBS chia sẻ nhiều instance" và "EFS cho Windows".
- [ ] Tôi phân biệt được persistent vs ephemeral (instance store).

## Xem tiếp / Liên kết liên quan

- [../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md](../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md)
- [05-database-cheatsheet.md](./05-database-cheatsheet.md)
- [README.md](./README.md)
