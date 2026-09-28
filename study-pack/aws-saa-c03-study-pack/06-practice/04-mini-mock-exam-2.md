# Mini Mock Exam 2

Đề thi thử số 2, độ khó nhỉnh hơn Đề 1, thiên về architecture patterns: High Availability, Fault Tolerance, Disaster Recovery, security architecture, observability/governance, migration/hybrid, và các bẫy kết hợp nhiều dịch vụ. 20 câu, chỉ có 1 best answer cho mỗi câu.

## Hướng dẫn làm bài

- **Cách làm:** đọc kỹ từng câu — đề này có nhiều câu đòi hỏi phân tích trade-off và kết hợp nhiều dịch vụ, không chỉ nhận diện 1 service. Tự chọn 1 đáp án trước khi xem đáp án.
- **Time-box đề xuất:** 32-35 phút cho 20 câu (nhiều hơn Đề 1 vì độ khó cao hơn).
- **Cách tự chấm:** làm xong toàn bộ 20 câu, đối chiếu với "Đáp án tóm tắt" ở cuối file.
- Chỉ mở [05-answer-explanations.md](./05-answer-explanations.md) sau khi đã hoàn thành và tự chấm cả 20 câu.
- Mục tiêu tham khảo: đúng từ 14/20 câu (70%) trở lên được xem là đạt cho đề khó hơn này.

## Đề thi

### Câu 1

Một hệ thống tài chính yêu cầu: nếu Region chính gặp sự cố nghiêm trọng, hệ thống phải phục vụ tiếp ngay lập tức (gần như zero downtime) và không được mất giao dịch nào (RPO gần bằng 0). Ngân sách không phải là ràng buộc chính.

**A.** Multi-site Active/Active với cả 2 Region xử lý traffic đồng thời và đồng bộ dữ liệu liên tục.
**B.** Pilot Light với database replication bất đồng bộ.
**C.** Warm Standby chạy ở scale nhỏ, sẵn sàng scale lên khi cần.
**D.** Backup & Restore sang Region phụ.

### Câu 2

Một công ty có Warm Standby ở Region phụ cho hệ thống e-commerce, nhưng vừa qua diễn tập DR cho thấy RTO thực tế lâu hơn dự kiến vì cần thời gian scale Auto Scaling group và promote Read Replica database thủ công. Yêu cầu mới: RTO phải rút ngắn xuống dưới 5 phút mà chi phí tăng ở mức chấp nhận được, chưa cần tới Active/Active.

**A.** Chuyển hẳn sang Multi-site Active/Active ngay lập tức.
**B.** Tự động hóa quy trình promote database và scale Auto Scaling group bằng script/runbook, đồng thời tăng capacity tối thiểu chạy sẵn ở Region phụ.
**C.** Chuyển xuống Pilot Light để giảm chi phí.
**D.** Giữ nguyên Warm Standby, chỉ tăng thêm dung lượng backup.

### Câu 3

Một đội DevOps tự hào rằng hệ thống của họ có RDS Multi-AZ, Auto Scaling multi-AZ, và ELB — nên kết luận hệ thống đã có Disaster Recovery đầy đủ và không cần làm thêm gì.

**A.** Kết luận đúng vì Multi-AZ đã đủ cho mọi loại sự cố.
**B.** Kết luận đúng vì ELB đã tự động chuyển Region khi cần.
**C.** Kết luận sai — Multi-AZ/Auto Scaling multi-AZ giải quyết High Availability trong 1 Region, không phải DR (khôi phục sau khi mất cả Region).
**D.** Kết luận sai — nhưng lý do là vì RDS Multi-AZ không đáng tin cậy.

### Câu 4

Một tổ chức tài chính cần đảm bảo: (1) mọi dữ liệu nhạy cảm được mã hóa cả at rest lẫn in transit, (2) mỗi service chỉ có quyền truy cập tối thiểu cần thiết, (3) mọi thay đổi cấu hình quan trọng được ghi lại và có thể audit, (4) không có resource nào public ngoài ý muốn.

**A.** Chỉ cần bật mã hóa S3 và RDS là đủ đáp ứng toàn bộ 4 yêu cầu.
**B.** Chỉ cần Security Group chặt chẽ là đủ, không cần thêm công cụ khác.
**C.** Chỉ cần AWS Config bật lên là tự động giải quyết cả 4 yêu cầu.
**D.** Kết hợp: KMS/TLS cho encryption, IAM least privilege, CloudTrail cho audit trail, AWS Config để phát hiện resource cấu hình sai/public ngoài ý muốn.

### Câu 5

Một công ty cần di chuyển 80TB dữ liệu file từ data center on-premise lên S3. Đường truyền internet hiện tại chỉ có băng thông giới hạn, và ước tính việc truyền qua mạng sẽ mất hơn 3 tuần — không chấp nhận được.

**A.** Dùng AWS Snowball Edge để vận chuyển dữ liệu vật lý sang AWS.
**B.** Tăng băng thông Site-to-Site VPN và chờ truyền xong.
**C.** Dùng AWS DMS để đồng bộ liên tục qua internet.
**D.** Dùng S3 Transfer Acceleration để tăng tốc qua internet hiện tại.

### Câu 6

Một doanh nghiệp cần kết nối hybrid ổn định, băng thông cao, độ trễ thấp và nhất quán giữa data center on-premise và AWS cho ứng dụng chạy production lâu dài, đồng thời cần 1 kết nối backup nhanh chóng thiết lập trong lúc chờ kết nối chính hoàn tất.

**A.** Chỉ dùng Site-to-Site VPN vì đơn giản và đủ nhanh để thiết lập.
**B.** Thiết lập AWS Direct Connect làm kết nối chính, dùng Site-to-Site VPN làm backup trong lúc chờ Direct Connect hoàn tất hoặc làm failover.
**C.** Không cần kết nối riêng, dùng internet công cộng với mã hóa TLS là đủ.
**D.** Dùng Snowball Edge làm kết nối mạng thường trực.

### Câu 7

Một hệ thống order-processing dùng SQS Standard queue giữa service nhận đơn và service xử lý kho. Gần đây phát hiện một số đơn hàng bị xử lý 2 lần do message được nhận lại (duplicate) khi consumer xử lý chậm hơn visibility timeout. Ứng dụng cần đảm bảo mỗi đơn hàng chỉ được xử lý đúng 1 lần và giữ đúng thứ tự.

**A.** Tăng số lượng consumer để xử lý nhanh hơn, giữ nguyên SQS Standard.
**B.** Giảm visibility timeout xuống thấp hơn.
**C.** Chuyển sang FIFO queue kết hợp cơ chế idempotency ở phía consumer.
**D.** Chuyển sang SNS để đảm bảo không trùng lặp.

### Câu 8

Một ứng dụng dùng Lambda xử lý order event từ EventBridge, nhưng đội vận hành nhận thấy đôi khi có 2 Lambda invocation cho cùng 1 event do retry tự động của Lambda khi gặp lỗi thoáng qua (transient error), dẫn đến xử lý đơn hàng trùng lặp.

**A.** Tắt hoàn toàn cơ chế retry của Lambda.
**B.** Chuyển sang dùng EC2 để tránh retry tự động.
**C.** Giảm concurrency của Lambda xuống 1 để tránh xử lý song song.
**D.** Thiết kế Lambda function có tính idempotent (VD: kiểm tra order ID đã xử lý chưa trước khi thực hiện side-effect).

### Câu 9

Một công ty muốn phát hiện sớm nếu có Security Group nào trong toàn bộ tài khoản AWS được cấu hình mở port 3389 (RDP) cho 0.0.0.0/0, và tự động gắn cờ non-compliant, đồng thời vẫn cần theo dõi hiệu năng CPU/memory của các EC2 instance đang chạy.

**A.** Dùng AWS Config rule để đánh giá compliance Security Group, kết hợp CloudWatch để theo dõi metric hiệu năng — đây là 2 mục tiêu khác nhau cần 2 công cụ khác nhau.
**B.** Chỉ cần CloudWatch alarm cho CPU/memory là đủ cho cả 2 mục tiêu.
**C.** Chỉ cần CloudTrail để phát hiện Security Group vi phạm.
**D.** Dùng CloudTrail cho cả 2 mục tiêu vì CloudTrail ghi lại mọi thứ.

### Câu 10

Một ứng dụng cần giảm thiểu single point of failure ở tầng ứng dụng: nếu 1 instance app tier bị lỗi, request đang xử lý không được mất, và hệ thống vẫn tiếp tục phục vụ mà không có gián đoạn nhận biết được từ phía người dùng.

**A.** Giữ app tier stateful trên 1 instance mạnh nhất có thể.
**B.** Thiết kế app tier ở dạng stateless, đặt session/state ở nơi dùng chung (VD: ElastiCache/DynamoDB), kết hợp ALB + Auto Scaling multi-AZ.
**C.** Backup app tier bằng snapshot AMI hàng ngày.
**D.** Tăng timeout phía client để chờ app tier phục hồi.

### Câu 11

Một hệ thống dùng cả Multi-AZ RDS và Read Replica ở Region khác cho mục đích DR. Trong 1 buổi diễn tập, đội vận hành giả lập mất toàn bộ Region chính và cần promote Read Replica ở Region phụ thành primary. Điều nào đúng nhất về hành vi hệ thống trong tình huống này?

**A.** Multi-AZ standby ở Region chính sẽ tự động chuyển thành primary ở Region phụ.
**B.** Không cần làm gì vì Multi-AZ đã tự xử lý luôn cả DR cross-Region.
**C.** Cross-Region Read Replica không tự động failover; cần thao tác promote thủ công (hoặc tự động hóa qua runbook riêng) để trở thành instance độc lập ghi được.
**D.** RDS tự động đồng bộ 2 Region theo thời gian thực không cần cấu hình gì thêm.

### Câu 12

Một đội bảo mật phát hiện 1 EC2 instance trong private subnet vẫn có thể bị truy cập từ internet dù không có public IP, do 1 kỹ sư vô tình gán route 0.0.0.0/0 trỏ tới Internet Gateway trong route table của subnet đó. Cách khắc phục đúng đắn và mang tính phòng ngừa lâu dài nhất là gì?

**A.** Chỉ cần thêm Security Group chặt hơn, không cần sửa route table.
**B.** Xóa Internet Gateway của toàn bộ VPC.
**C.** Gán NACL deny-all cho subnet để chặn hẳn mọi truy cập.
**D.** Sửa lại route table cho đúng (loại route sai), đồng thời thiết lập AWS Config rule để phát hiện tự động nếu route table private subnet bị thay đổi sai trong tương lai.

### Câu 13

Một ứng dụng cần lưu cấu hình ứng dụng (feature flag, endpoint config) cho nhiều môi trường (dev/staging/prod), một số giá trị nhạy cảm cần mã hóa nhưng không cần rotation tự động, ngân sách hạn chế và muốn tránh chi phí không cần thiết.

**A.** Dùng Parameter Store với SecureString cho giá trị nhạy cảm, String cho giá trị thường, tổ chức theo path riêng cho từng môi trường.
**B.** Dùng KMS để lưu trực tiếp từng giá trị cấu hình.
**C.** Lưu toàn bộ cấu hình trong code, không dùng dịch vụ quản lý riêng.
**D.** Dùng Secrets Manager cho toàn bộ vì tính năng đầy đủ nhất.

### Câu 14

Một hệ thống cần đảm bảo rằng khi 1 Availability Zone bị mất điện hoàn toàn, ứng dụng tiếp tục hoạt động mà không mất bất kỳ request nào đang xử lý dở, kể cả các request đang ở giữa transaction phức tạp — mức độ đảm bảo này cao hơn yêu cầu "giảm downtime" thông thường.

**A.** Đây chính xác là yêu cầu High Availability thông thường, không có gì khác biệt.
**B.** Đây là yêu cầu Fault Tolerance — mức đảm bảo cao hơn HA, thường cần replication đồng bộ ở nhiều lớp và chấp nhận chi phí/độ phức tạp cao hơn.
**C.** Yêu cầu này không thể đáp ứng được trên AWS.
**D.** Đây là yêu cầu Disaster Recovery vì liên quan tới mất điện.

### Câu 15

Một công ty cần migrate ứng dụng database production sang RDS với downtime tối thiểu (vài phút), dữ liệu vẫn đang được ghi liên tục ở hệ thống nguồn cho tới thời điểm cutover.

**A.** Dừng ứng dụng, export toàn bộ dữ liệu, import vào RDS, rồi mở lại ứng dụng.
**B.** Dùng Snowball để chuyển dữ liệu.
**C.** Dùng AWS DMS với continuous replication (CDC) cho tới khi sẵn sàng cutover, giảm downtime xuống mức tối thiểu.
**D.** Dùng Site-to-Site VPN để sao chép dữ liệu thủ công.

### Câu 16

Một kiến trúc sư đề xuất dùng Amazon Global Accelerator để "cache" nội dung tĩnh cho ứng dụng web toàn cầu nhằm giảm tải origin. Đánh giá nào đúng nhất về đề xuất này?

**A.** Đề xuất hợp lý vì Global Accelerator có chức năng cache như CloudFront.
**B.** Đề xuất sai — vì Global Accelerator chỉ dùng được cho database, không dùng cho web.
**C.** Đề xuất hợp lý nhưng chỉ khi kết hợp thêm Route 53.
**D.** Đề xuất sai — Global Accelerator không cache nội dung; nó định tuyến traffic qua mạng backbone AWS bằng static IP. Với mục tiêu cache nội dung tĩnh, CloudFront mới là công cụ đúng.

### Câu 17

Một tổ chức muốn tối ưu chi phí cho một tập dữ liệu lưu trên S3: một phần dữ liệu truy cập thường xuyên (hot), một phần truy cập không thường xuyên nhưng cần lấy nhanh khi cần (warm), và một phần gần như không bao giờ truy cập nhưng vẫn phải giữ (cold, tuân thủ pháp lý). Không có nhân sự riêng để quản lý thủ công lifecycle mỗi ngày.

**A.** Thiết lập S3 Lifecycle rule chuyển tự động: Standard → Standard-IA (hoặc Intelligent-Tiering) → Glacier/Glacier Deep Archive theo thời gian/tần suất truy cập.
**B.** Xóa dữ liệu cold để giảm chi phí lưu trữ.
**C.** Chuyển toàn bộ dữ liệu sang EBS để dễ quản lý hơn.
**D.** Lưu toàn bộ ở S3 Standard, chấp nhận chi phí cao hơn để đơn giản.

### Câu 18

Một ứng dụng nhận traffic tăng đột biến (spike) chỉ trong vài phút mỗi ngày (giờ cao điểm), phần còn lại trong ngày traffic rất thấp. Auto Scaling hiện tại dùng Target Tracking dựa trên CPU nhưng phản ứng scale-out chậm hơn tốc độ tăng traffic thực tế, gây lỗi 5xx trong vài phút đầu giờ cao điểm.

**A.** Tăng ngưỡng CPU target để scale-out sớm hơn (dù vẫn dựa hoàn toàn vào reactive scaling).
**B.** Kết hợp Scheduled Scaling để tăng capacity tối thiểu trước giờ cao điểm đã biết trước, cùng với Target Tracking để xử lý biến động còn lại.
**C.** Chuyển toàn bộ sang Spot Instances để scale nhanh hơn.
**D.** Bỏ Auto Scaling, chạy cố định ở mức capacity cao nhất cả ngày.

### Câu 19

Một công ty yêu cầu: dữ liệu ứng dụng phải được mã hóa khi lưu trữ, đồng thời cần khả năng thu hồi (revoke) quyền giải mã ngay lập tức cho 1 team cụ thể nếu cần, mà không ảnh hưởng tới team khác đang dùng chung service (VD: cùng S3 bucket nhưng khác prefix).

**A.** Dùng 1 KMS key mặc định (AWS managed key) chung cho toàn bộ dữ liệu.
**B.** Không mã hóa, chỉ dùng IAM policy để kiểm soát truy cập.
**C.** Dùng nhiều customer managed key trong KMS, mỗi key có key policy riêng cho từng team, gắn đúng key vào đúng phạm vi dữ liệu.
**D.** Dùng Secrets Manager để lưu key mã hóa cho từng team.

### Câu 20

Một tổ chức đang thiết kế DR strategy và tranh luận giữa Pilot Light và Warm Standby cho hệ thống CRM nội bộ, RTO chấp nhận được là khoảng 30-45 phút, RPO khoảng vài phút, ngân sách ở mức trung bình.

**A.** Multi-site Active/Active vì luôn an toàn nhất.
**B.** Backup & Restore vì rẻ nhất.
**C.** Không strategy nào phù hợp, cần dùng giải pháp ngoài 4 pattern chuẩn.
**D.** Warm Standby, vì Pilot Light thường cần thêm thời gian scale từ mức tối thiểu lên full capacity, có thể vượt quá 30-45 phút tùy quy mô hệ thống; Warm Standby đã chạy sẵn ở scale nhỏ hơn nên rút ngắn RTO tốt hơn trong khoảng này.

## Đáp án tóm tắt

| Câu | Đáp án |
|---|---|
| 1 | A |
| 2 | B |
| 3 | C |
| 4 | D |
| 5 | A |
| 6 | B |
| 7 | C |
| 8 | D |
| 9 | A |
| 10 | B |
| 11 | C |
| 12 | D |
| 13 | A |
| 14 | B |
| 15 | C |
| 16 | D |
| 17 | A |
| 18 | B |
| 19 | C |
| 20 | D |

Xem giải thích chi tiết tại: [05-answer-explanations.md](./05-answer-explanations.md#mini-mock-exam-2--answer-explanations).

## Xem tiếp / Liên kết liên quan

- [03-mini-mock-exam-1.md](./03-mini-mock-exam-1.md)
- [05-answer-explanations.md](./05-answer-explanations.md)
- [README.md](./README.md)
