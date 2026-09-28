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

🧠 **Bài toán cốt lõi mỗi service giải quyết:** S3 giải quyết bài toán "lưu trữ dữ liệu không cấu trúc, truy cập qua API, scale gần vô hạn" — nó **không phải** một ổ đĩa. EBS giải quyết bài toán "cần 1 ổ đĩa hiệu năng ổn định gắn liền với 1 máy". EFS/FSx giải quyết bài toán "nhiều máy cần nhìn thấy cùng 1 hệ thống file, giống như một network share truyền thống". Ranh giới quyết định thực sự nằm ở **access pattern** (1 instance hay nhiều instance) và **loại giao diện truy cập** (API/HTTP vs mount trực tiếp), không nằm ở "cái nào rẻ hơn".

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

| Tiêu chí quyết định | Câu hỏi cần tự hỏi | Dẫn tới |
|---|---|---|
| Access pattern | Bao nhiêu instance cần đọc/ghi cùng lúc? | 1 instance → EBS; nhiều instance → EFS/FSx/S3 |
| Hệ điều hành | Linux hay Windows? | Linux shared file → EFS; Windows SMB → FSx for Windows |
| Mức tích hợp ứng dụng | Ứng dụng gọi qua SDK/API hay cần mount như ổ đĩa/thư mục? | Qua API → S3; mount trực tiếp → EBS/EFS/FSx |
| Persistent hay ephemeral | Dữ liệu có cần tồn tại sau khi instance dừng/terminate? | Cần bền vững → EBS/S3/EFS/FSx; chỉ cần cache tạm tốc độ cao → Instance Store (ephemeral, mất khi instance dừng) |

⚠️ **Keyword loại trừ nhanh:** thấy "shared across multiple instances" → loại ngay EBS (trừ Multi-Attach io2 hiếm gặp). Thấy "SMB" hoặc "Active Directory" → loại ngay EFS. Thấy "mount as a file system", "POSIX permissions" → loại ngay S3.

## Khi nào không nên chọn

- Không chọn S3 khi ứng dụng cần thao tác file như file system thật (mount trực tiếp, POSIX file locking) — S3 là object storage, không phải file system.
- Không chọn EBS khi cần nhiều instance cùng ghi/đọc đồng thời — EBS gắn với 1 instance tại 1 thời điểm (trừ trường hợp Multi-Attach io2 đặc biệt, ít gặp trong đề thi).
- Không chọn EFS cho workload cần file share kiểu Windows (SMB) — dùng FSx for Windows.

### Why-not reasoning: vì sao đáp án "nghe hợp lý" vẫn sai

- **"EBS rẻ, đã quen dùng, nên cứ dùng cho shared storage"** nghe hợp lý vì EBS là lựa chọn compute-storage cơ bản nhất, nhưng sai vì EBS về bản chất chỉ attach được vào 1 instance tại 1 thời điểm — nếu đề yêu cầu shared access, đáp án này **không khả thi kỹ thuật**, không chỉ là "kém tối ưu".
- **"S3 rẻ và scale vô hạn nên luôn là best answer cho storage"** nghe hợp lý vì S3 đúng là rẻ/scale tốt, nhưng nếu đề yêu cầu ứng dụng ghi file trực tiếp qua giao thức file system (không qua S3 API/SDK), S3 **không đáp ứng được functional requirement** dù non-functional (chi phí) có vẻ tốt hơn.
- **Khi cả EFS và FSx for Windows đều "có vẻ đúng"**: nếu đề không nêu rõ OS, mặc định câu hỏi xoay quanh Linux/NFS thường trỏ EFS; câu hỏi nêu rõ "Windows" hoặc "SMB" luôn trỏ FSx for Windows — đọc kỹ OS được nhắc tới là yếu tố quyết định.

## Trade-offs

| Lựa chọn | Đánh đổi |
|---|---|
| S3 thay vì EBS/EFS | Rẻ hơn, scale tốt hơn nhưng không mount như file system truyền thống, độ trễ truy cập khác biệt |
| EFS thay vì EBS | Chia sẻ được nhiều instance nhưng chi phí và độ trễ per-operation thường cao hơn EBS |
| FSx thay vì EFS | Đáp ứng nhu cầu chuyên biệt (Windows/HPC) nhưng phức tạp hơn và chi phí thường cao hơn |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao người học hay nhầm | Hậu quả | Cách loại nhanh trong đề |
|---|---|---|---|
| ❌ Dùng S3 như một file system (mount trực tiếp, ghi/đọc như thư mục local) | S3 rẻ, quen thuộc, và tên gọi "storage" khiến người học coi nó tương đương ổ đĩa | Ứng dụng không tương thích do S3 không hỗ trợ POSIX file locking/permissions thật; cần viết lại logic dùng S3 API/SDK | Thấy "mount", "POSIX", "file system semantics" → loại S3 ngay |
| ❌ Dùng EBS cho nhiều instance cùng chia sẻ dữ liệu | EBS "cũng là storage gắn AWS" nên nghe như dùng chung được | Bất khả thi kỹ thuật — EBS chỉ attach 1 instance tại 1 thời điểm (trừ Multi-Attach io2 hiếm gặp); dữ liệu không đồng bộ giữa các instance | Thấy "multiple EC2 instances access the same data simultaneously" → loại EBS |
| ❌ Dùng EFS cho workload Windows cần SMB | "EFS = shared file storage" nên nghĩ dùng được cho mọi OS | Không tương thích — EFS chỉ dùng giao thức NFS, ứng dụng Windows cần SMB sẽ không kết nối được | Thấy "Windows", "SMB", "Active Directory" → chuyển sang FSx for Windows |
| ❌ Chọn storage chỉ vì "rẻ" hoặc "quen dùng" mà bỏ qua access pattern | Chi phí là tiêu chí dễ so sánh nhất, quen thuộc tạo cảm giác an toàn | Chọn sai storage khiến kiến trúc không đáp ứng functional requirement (VD: cần shared access nhưng chọn EBS vì rẻ) | Luôn kiểm tra access pattern (số instance, OS) trước khi xét chi phí |

## Common traps

### ⚠️ Trap: nghĩ S3 dùng được như file system
S3 không hỗ trợ mount trực tiếp như file system POSIX — nếu đề yêu cầu "mount như 1 thư mục dùng chung, nhiều instance ghi/đọc trực tiếp", đáp án đúng là EFS/FSx, không phải S3.

### ⚠️ Trap: nghĩ EBS chia sẻ được nhiều instance
EBS mặc định chỉ gắn với 1 instance tại 1 thời điểm — đề thi có "shared file access giữa nhiều instance" gần như luôn loại trừ EBS.

### ⚠️ Trap: nghĩ EFS dùng được cho Windows
EFS dùng giao thức NFS, chủ yếu cho Linux. Nếu đề nhắc "Windows file share" hoặc "SMB", đáp án đúng là FSx for Windows File Server, không phải EFS.

## Mini scenarios

🧪 **Scenario 1 — Ứng dụng Linux chia sẻ file đa AZ**

**Tình huống:** Một nhóm ứng dụng Linux chạy trên nhiều EC2 instance ở 2 AZ khác nhau, cần truy cập chung 1 thư mục dữ liệu, tự động mở rộng dung lượng theo nhu cầu.
**Đáp án đúng:** Amazon EFS.
**Vì sao:** Yêu cầu chia sẻ file giữa nhiều Linux instance ở nhiều AZ là đặc điểm nhận diện chuẩn của EFS — EBS không chia sẻ được, S3 không phải file system POSIX, FSx for Windows không phù hợp Linux.

🧪 **Scenario 2 — Ứng dụng Windows legacy cần file share nội bộ**

**Tình huống:** Một ứng dụng kế toán Windows legacy chạy trên nhiều EC2 Windows instance, yêu cầu file share dùng chung theo giao thức SMB, tích hợp với Active Directory hiện có on-premises.
**Đáp án đúng:** Amazon FSx for Windows File Server.
**Vì sao:** Yêu cầu SMB + Active Directory integration là tín hiệu nhận diện trực tiếp của FSx for Windows — EFS không hỗ trợ SMB, S3/EBS không phải file share protocol phù hợp.

🧪 **Scenario 3 — Anti-pattern: dùng EBS cho dữ liệu cần nhiều instance cùng ghi**

**Tình huống:** Một đội phát triển thiết kế hệ thống upload file với 5 EC2 instance đứng sau ALB, mỗi instance cần đọc/ghi vào cùng 1 thư mục dữ liệu chung, và đề xuất gắn cùng 1 EBS volume cho cả 5 instance để "tiết kiệm chi phí so với EFS".
**Đáp án đúng:** Amazon EFS (hoặc S3 nếu chỉ cần lưu trữ object không cần mount trực tiếp).
**Vì sao đây là anti-pattern cần tránh:** EBS (trừ Multi-Attach io2 dùng cho cluster đặc biệt, không áp dụng chung cho 5 instance độc lập kiểu này) không hỗ trợ nhiều instance đọc/ghi đồng thời vào cùng volume theo cách ứng dụng web thông thường cần — thiết kế này sẽ gặp lỗi truy cập hoặc mất đồng bộ dữ liệu ngay từ đầu, không phải vấn đề tối ưu chi phí.

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
