# EBS, EFS, FSx

Block storage (EBS), file storage (EFS), và managed file system chuyên biệt (FSx) — ba lựa chọn lưu trữ gắn kèm compute, khác với object storage (S3).

## Mục lục

- [Mục tiêu học](#mục-tiêu-học)
- [Practical understanding](#practical-understanding)
- [Exam focus](#exam-focus)
- [Use cases](#use-cases)
- [Khi nào nên dùng / không nên dùng](#khi-nào-nên-dùng--không-nên-dùng)
- [Bảng so sánh nhanh](#bảng-so-sánh-nhanh)
- [Decision logic](#decision-logic)
- [Anti-patterns / lựa chọn sai thường gặp](#anti-patterns--lựa-chọn-sai-thường-gặp)
- [Common traps](#common-traps)
- [Mini scenarios](#mini-scenarios)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Mục tiêu học

- Phân biệt mindset block storage / file storage / shared storage.
- Biết chọn đúng loại EBS volume, khi nào dùng EFS, khi nào dùng FSx.
- Nhận diện exam keyword tương ứng với từng dịch vụ.

## Practical understanding

### Mindset: Block vs File vs Shared storage

🧠 **Exam mindset:** câu hỏi thực sự đề đang test không phải "dịch vụ nào rẻ hơn" mà là "**access pattern** của workload là gì" — 1 instance cần disk riêng (block), hay nhiều instance cần nhìn thấy cùng 1 tập file (shared file system)? Trả lời đúng câu này gần như chọn được đáp án ngay.

- **Block storage (EBS)**: lưu trữ dạng khối dữ liệu thô, gắn với **1 instance tại 1 thời điểm** (trừ loại multi-attach đặc biệt), giống như một ổ cứng rời gắn vào 1 máy. ✅ Dùng khi mỗi instance cần disk riêng, không chia sẻ. ❌ Không dùng khi nhiều instance cần cùng đọc/ghi 1 tập dữ liệu.
- **File storage (EFS/FSx)**: cung cấp file system có thể **mount đồng thời từ nhiều instance/AZ**, quản lý theo cấu trúc thư mục/file quen thuộc. ✅ Dùng khi yêu cầu "shared", "concurrent access", "nhiều instance cùng truy cập". ❌ Không dùng khi chỉ 1 instance cần disk hiệu năng cao (dư overhead không cần thiết).
- **Instance Store**: nhắc lại ngắn — ổ đĩa vật lý gắn trực tiếp host, ephemeral, đã trình bày chi tiết ở [01-ec2.md](./01-ec2.md). ⚠️ Giới hạn tư duy nếu chọn sai: nếu đề cần dữ liệu **sống sót qua việc dừng/khởi động lại instance**, Instance Store luôn sai vì dữ liệu mất khi instance stop.

### EBS (Elastic Block Store) — volume types mức thi SAA-C03

| Loại | Đặc điểm | Phù hợp |
|---|---|---|
| gp3/gp2 (General Purpose SSD) | Cân bằng giá/hiệu năng, IOPS cấu hình độc lập (gp3) | Đa số workload phổ thông, boot volume |
| io2/io1 (Provisioned IOPS SSD) | IOPS cao, độ trễ thấp, độ bền cao | Database tải cao, ứng dụng cần IOPS ổn định |
| st1 (Throughput Optimized HDD) | Thông lượng cao, chi phí thấp hơn SSD, không dùng làm boot volume | Big data, log processing |
| sc1 (Cold HDD) | Chi phí thấp nhất, truy cập ít thường xuyên | Dữ liệu lưu trữ lạnh, ít truy cập |

> Cần verify lại theo AWS official docs mới nhất — thông số IOPS/throughput cụ thể của từng loại volume thay đổi theo thời gian.

### EBS volume type — decision logic

🧠 **Cách chọn nhanh:** hỏi 2 câu — (1) workload cần **IOPS ổn định/độ trễ thấp** hay **throughput tuần tự lớn**? (2) đây có phải **boot volume** không (st1/sc1 không dùng làm boot volume)?

- ✅ Database production, transactional workload cần IOPS ổn định → io2/io1.
- ✅ Đa số workload phổ thông, dev/test, boot volume → gp3 (mặc định hợp lý nếu đề không có yêu cầu đặc biệt).
- ✅ Big data, log processing, đọc/ghi tuần tự lớn, không cần làm boot volume → st1.
- ⚠️ Nếu đề nhắc "cold data", "rarely accessed", "chi phí thấp nhất" → sc1, nhưng không dùng làm boot volume.

### EBS Snapshots

Bản sao lưu point-in-time của volume, lưu trên S3 (quản lý bởi AWS, không thấy trực tiếp trong S3 console), incremental (chỉ lưu phần thay đổi so với snapshot trước) — dùng để backup, tạo volume mới, hoặc copy sang Region/AZ khác.

🧠 **Exam reasoning:** snapshot giải quyết bài toán **backup/restore** và **di chuyển dữ liệu giữa AZ/Region** — nó không phải giải pháp High Availability. Nếu đề cần instance tự động failover khi 1 AZ chết, câu trả lời không phải "restore từ snapshot" (quá chậm, cần thao tác thủ công) mà là kiến trúc Multi-AZ chủ động (xem [08-elb-and-auto-scaling.md](./08-elb-and-auto-scaling.md)).

### Encryption (EBS)

EBS hỗ trợ **encryption at rest** tích hợp với AWS KMS; volume đã tạo không mã hoá không thể bật mã hoá trực tiếp — phải tạo snapshot rồi copy sang volume mới có mã hoá. Chi tiết KMS xem ở [`14-kms-secrets-manager-parameter-store.md`](./14-kms-secrets-manager-parameter-store.md).

### EFS (Elastic File System)

Managed **NFS file system**, có thể mount đồng thời từ nhiều EC2 instance ở nhiều AZ trong cùng Region, tự động co giãn dung lượng theo dữ liệu thực tế (không cần provision trước dung lượng cố định). Phù hợp workload Linux cần **shared storage**.

✅ Dùng khi: "nhiều EC2 Linux cần cùng truy cập 1 thư mục", "content management system", "shared home directory".
❌ Không dùng khi: workload Windows cần SMB (EFS không hỗ trợ SMB native — đây là bẫy phổ biến), hoặc chỉ 1 instance cần disk hiệu năng cao (EFS có độ trễ cao hơn EBS cho single-instance access pattern).

### FSx

Managed file system chuyên biệt cho các nhu cầu cụ thể:

- **FSx for Windows File Server**: file system tương thích SMB protocol, phù hợp ứng dụng Windows cần shared storage, tích hợp Active Directory.
- **FSx for Lustre**: file system hiệu năng cao cho **High Performance Computing (HPC)**, machine learning, xử lý dữ liệu lớn — tích hợp trực tiếp với S3 để xử lý dữ liệu song song tốc độ cao.

🧠 **FSx for Windows vs FSx for Lustre — keyword nhận diện:**

| Keyword trong đề | Chọn |
|---|---|
| "Windows", "SMB", "Active Directory", "file share nội bộ .NET" | FSx for Windows File Server |
| "HPC", "machine learning training", "xử lý dữ liệu song song tốc độ cao", "tích hợp S3 làm nguồn dữ liệu tính toán" | FSx for Lustre |

## Exam focus

### Must know for exam

- EBS chỉ gắn được với 1 instance tại 1 thời điểm (trừ trường hợp Multi-Attach đặc biệt cho io1/io2) — cần shared storage nhiều instance thì không dùng EBS.
- EFS dùng cho Linux, hỗ trợ mount nhiều AZ đồng thời.
- FSx for Windows File Server khi đề nhắc "Windows" + "SMB" + "Active Directory".
- FSx for Lustre khi đề nhắc "HPC" + "machine learning" + xử lý dữ liệu lớn tốc độ cao.
- Snapshot là incremental, lưu trên S3 nhưng không thao tác trực tiếp qua S3 API.

### Important

- gp3 tách rời cấu hình IOPS/throughput khỏi dung lượng — linh hoạt hơn gp2.
- st1/sc1 không dùng làm boot volume.

### Nice to know

- Chi tiết throughput/IOPS chính xác của từng loại volume — không cần nhớ số tuyệt đối cho kỳ thi.

## Use cases

- **EBS**: boot volume cho EC2, database volume cần IOPS ổn định (io2), log storage giá rẻ (st1).
- **EFS**: content management system chạy trên nhiều EC2 Linux cần chung 1 file system, home directory dùng chung.
- **FSx for Windows**: ứng dụng .NET/Windows cần file share nội bộ dùng SMB.
- **FSx for Lustre**: training model machine learning trên tập dữ liệu lớn lưu ở S3, xử lý video rendering song song.

## Khi nào nên dùng / không nên dùng

| Nhu cầu | Nên dùng | Không nên dùng |
|---|---|---|
| Boot volume / database cần IOPS cao, chỉ 1 instance | EBS (gp3/io2) | EFS (overhead không cần thiết) |
| Nhiều EC2 Linux cần cùng truy cập 1 file system | EFS | EBS (không mount đa instance được) |
| Ứng dụng Windows cần SMB file share | FSx for Windows File Server | EFS (không hỗ trợ SMB native) |
| Xử lý dữ liệu lớn tốc độ cao tích hợp S3 (HPC/ML) | FSx for Lustre | EBS/EFS (không tối ưu cho khối lượng tính toán song song lớn) |
| Dữ liệu tạm thời, cần tốc độ cực cao, chấp nhận mất khi dừng instance | Instance Store | EBS (nếu cần tốc độ tối đa và không cần bền vững) |

## Bảng so sánh nhanh

| Tiêu chí | EBS | EFS | FSx | Instance Store |
|---|---|---|---|---|
| Loại storage | Block | File (NFS) | File (SMB/Lustre) | Block (ephemeral) |
| Gắn nhiều instance cùng lúc | Không (trừ Multi-Attach) | Có | Có | Không |
| Đa AZ | Cần snapshot/replicate thủ công | Có, native | Tuỳ loại (Windows: Multi-AZ có; Lustre: theo cấu hình) | Không |
| Bền vững khi instance dừng | Có | Có | Có | Không (mất dữ liệu) |
| Use case điển hình | Boot volume, database | Shared Linux storage | Windows SMB / HPC-ML | Cache tạm, buffer tốc độ cao |

## Decision logic

| Câu hỏi cần trả lời | ✅ Keyword nghĩ ngay tới | ⚠️ Keyword nên loại |
|---|---|---|
| Chỉ 1 instance cần disk, cần IOPS ổn định | "database volume", "boot volume", "low latency single instance" → EBS io2/gp3 | "multiple instances", "shared" → loại EBS thường |
| Nhiều EC2 Linux cần chung 1 thư mục | "shared file system", "multiple EC2 Linux", "concurrent access" → EFS | "Windows", "SMB" → loại EFS |
| Ứng dụng Windows cần file share | "Windows", "SMB", "Active Directory" → FSx for Windows | "Linux", "NFS" → loại FSx for Windows |
| Xử lý dữ liệu lớn/HPC/ML tích hợp S3 | "HPC", "machine learning", "parallel processing", "tích hợp S3 tốc độ cao" → FSx for Lustre | workload thông thường không cần tính toán song song → loại Lustre |
| Dữ liệu tạm, cần tốc độ cực cao, chấp nhận mất | "temporary cache", "buffer", "chấp nhận mất khi instance dừng" → Instance Store | "phải bền vững", "persist sau khi stop/terminate" → loại Instance Store |

## Anti-patterns / lựa chọn sai thường gặp

| Anti-pattern | Vì sao nghe hợp lý | Vì sao vẫn sai |
|---|---|---|
| ❌ Dùng EBS cho workload nhiều instance cùng truy cập 1 file system | EBS cũng là "storage được gắn vào EC2" nên nghe như dùng được | EBS chỉ attach 1 instance tại 1 thời điểm (trừ Multi-Attach io1/io2 rất hẹp use case) — không phải shared file system, sẽ không cho phép nhiều instance đọc/ghi đồng thời như yêu cầu |
| ❌ Dùng EFS cho workload Windows cần SMB | EFS cũng là "managed file storage" nên nghe như dùng chung được cho mọi hệ điều hành | EFS chỉ hỗ trợ giao thức **NFS** (Linux), không hỗ trợ SMB native — Windows cần FSx for Windows File Server |
| ❌ Dùng Instance Store cho dữ liệu cần persistence (database, file quan trọng) | Instance Store rất nhanh nên nghe hấp dẫn cho "high performance storage" | Instance Store là ephemeral — dữ liệu **mất hoàn toàn** khi instance stop/terminate/di chuyển host, không phù hợp với bất kỳ yêu cầu "durable"/"persist" nào |
| ❌ Chọn loại storage chỉ dựa trên từ khoá "storage" mà không xét access pattern | Đề có chữ "storage" khiến người học nghĩ ngay tới S3/EBS mà không phân tích kỹ | Từ "storage" không nói lên access pattern — phải hỏi "1 instance hay nhiều instance", "cần shared hay không" mới chọn đúng giữa EBS/EFS/FSx/S3 |

## Common traps

### ⚠️ Trap: dùng EBS khi cần nhiều instance cùng truy cập 1 file system
EBS chỉ gắn 1 instance (thông thường) — đề bài yêu cầu "shared access từ nhiều instance" luôn trỏ tới EFS hoặc FSx, không phải EBS.

### ⚠️ Trap: nhầm EFS dùng được cho Windows
EFS dùng giao thức NFS, dành cho Linux. Ứng dụng Windows cần SMB → phải là FSx for Windows File Server.

### ⚠️ Trap: nghĩ snapshot EBS là full backup mỗi lần
Snapshot là **incremental** — chỉ lưu phần thay đổi so với snapshot gần nhất, giúp tiết kiệm chi phí lưu trữ.

## Mini scenarios

🧪 **Scenario 1 — Shared file system nhiều AZ**

**Tình huống:** Một ứng dụng chạy trên nhiều EC2 Linux instance ở 2 AZ khác nhau, cần truy cập chung một thư mục dữ liệu và tự động mở rộng dung lượng khi dữ liệu tăng.
**Đáp án đúng:** Sử dụng Amazon EFS, mount vào các EC2 instance ở cả 2 AZ.
**Vì sao:** Yêu cầu shared access nhiều instance/nhiều AZ + tự động co giãn dung lượng là đặc trưng của EFS — EBS không đáp ứng được (chỉ gắn 1 instance, phải provision dung lượng cố định).

🧪 **Scenario 2 — HPC training job tích hợp S3**

**Tình huống:** Đội Data Science cần chạy training job machine learning trên tập dữ liệu vài trăm TB đang lưu ở S3, đòi hỏi throughput đọc/ghi cực cao và xử lý song song trên nhiều compute node.
**Đáp án đúng:** Dùng FSx for Lustre, liên kết trực tiếp với S3 bucket chứa dữ liệu để load/sync dữ liệu tốc độ cao.
**Vì sao:** Đây đúng use case cốt lõi của FSx for Lustre — file system hiệu năng cao tích hợp sẵn với S3 cho khối lượng tính toán song song lớn; EFS/EBS không được thiết kế cho throughput/IOPS ở quy mô HPC này.

🧪 **Scenario 3 — Anti-pattern: dùng Instance Store cho database production**

**Tình huống:** Một đội kỹ sư chọn Instance Store cho volume chứa database production vì "Instance Store nhanh nhất, giảm chi phí so với EBS io2".
**Đáp án đúng:** Nên dùng EBS (io2 hoặc gp3 tuỳ mức IOPS cần) làm volume cho database, không dùng Instance Store.
**Vì sao đây là anti-pattern cần tránh:** Instance Store là ephemeral — nếu instance bị stop, terminate, hoặc di chuyển sang host vật lý khác (do AWS maintenance), toàn bộ dữ liệu trên Instance Store **mất vĩnh viễn**. Một database production luôn cần storage bền vững (durable), việc chọn Instance Store để "tiết kiệm chi phí" đổi lấy rủi ro mất dữ liệu hoàn toàn không tương xứng.

## Key takeaways

- EBS = block storage, 1 instance, cần snapshot để backup/di chuyển.
- EFS = file storage cho Linux, shared multi-AZ, tự co giãn dung lượng.
- FSx = file storage chuyên biệt: Windows File Server (SMB) hoặc Lustre (HPC/ML tích hợp S3).
- Instance Store nhanh nhất nhưng ephemeral, không dùng cho dữ liệu cần Durability.

## Checklist tự ôn

- [ ] Tôi chọn đúng loại EBS volume cho ít nhất 3 tình huống khác nhau (boot, database IOPS cao, log giá rẻ).
- [ ] Tôi phân biệt được khi nào dùng EFS và khi nào dùng FSx (Windows vs Lustre).
- [ ] Tôi giải thích được vì sao EBS không phù hợp cho shared access nhiều instance.

## Xem tiếp / Liên kết liên quan

- [01-ec2.md](./01-ec2.md)
- [03-s3.md](./03-s3.md)
- [14-kms-secrets-manager-parameter-store.md](./14-kms-secrets-manager-parameter-store.md)
- [../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md](../04-comparison-guides/01-s3-vs-ebs-vs-efs-vs-fsx.md)
