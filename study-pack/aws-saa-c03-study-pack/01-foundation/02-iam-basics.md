# IAM Basics

Identity and Access Management (IAM): Users, Groups, Roles, Policies, Least Privilege, MFA, và STS cơ bản.

## Mục lục

- [Mục tiêu học](#mục-tiêu-học)
- [Practical understanding](#practical-understanding)
- [Exam focus](#exam-focus)
- [Common traps](#common-traps)
- [Mini scenario](#mini-scenario)
- [Key takeaways](#key-takeaways)
- [Checklist tự ôn](#checklist-tự-ôn)

## Mục tiêu học

- Phân biệt được User, Group, Role, Policy.
- Hiểu nguyên tắc **Least Privilege** và áp dụng khi thiết kế quyền truy cập.
- Hiểu vai trò của MFA và STS (temporary credentials) trong kiến trúc bảo mật.

## Practical understanding

- **IAM User**: định danh cho một người/ứng dụng cụ thể, có credentials lâu dài (password, access key).
- **IAM Group**: tập hợp Users, dùng để gán Policy chung cho nhiều User cùng lúc — không phải là identity, không thể assume trực tiếp.
- **IAM Role**: identity không gắn cố định với 1 người/service, được "assume" tạm thời (bởi EC2, Lambda, user khác, hoặc external identity provider) để nhận quyền tương ứng. Không có credentials cố định — dùng temporary credentials qua STS.
- **IAM Policy**: tài liệu JSON định nghĩa quyền (Allow/Deny) trên resource cụ thể. Có Policy quản lý bởi AWS (managed), Policy tự tạo (customer managed), và Policy gắn trực tiếp vào 1 identity (inline).
- **Least Privilege**: chỉ cấp đúng quyền cần thiết để hoàn thành công việc — nguyên tắc nền tảng chi phối toàn bộ thiết kế IAM.
- **MFA (Multi-Factor Authentication)**: lớp xác thực thứ hai ngoài mật khẩu, đặc biệt bắt buộc cân nhắc cho root user và các thao tác nhạy cảm.
- **STS (Security Token Service)**: cấp **temporary credentials** (có thời hạn) khi assume Role — cơ chế đứng sau việc EC2/Lambda "có quyền" mà không cần lưu access key cứng trong code.

## Exam focus

### Must know for exam

- **Role** là cách chuẩn để cấp quyền cho EC2/Lambda/service khác gọi AWS API — không bao giờ hard-code access key vào ứng dụng chạy trên AWS.
- Policy có thể gắn vào User, Group, hoặc Role; đánh giá quyền theo nguyên tắc: mặc định Deny, có Allow rõ ràng thì được phép, nhưng bất kỳ Deny rõ ràng nào cũng luôn thắng Allow.
- Cross-account access luôn dùng Role (assume role), không dùng chia sẻ access key.

### Important

- Phân biệt Identity-based Policy (gắn vào User/Group/Role) và Resource-based Policy (gắn vào resource, VD: S3 bucket policy).
- IAM là global service — không giới hạn theo Region.

### Nice to know

- Permission boundary và Service Control Policy (SCP) ở cấp AWS Organizations — thuộc phạm vi nâng cao hơn, chỉ cần biết khái niệm tồn tại.

## Common traps

### Trap: Authentication vs Authorization
**Authentication** = xác minh danh tính (đăng nhập đúng ai). **Authorization** = xác định quyền hạn (được làm gì). IAM Policy giải quyết Authorization, không phải Authentication.

### Trap: dùng IAM User access key cho ứng dụng chạy trên EC2/Lambda
Đáp án đúng luôn là gắn **IAM Role** cho EC2 instance profile hoặc Lambda execution role — không tạo IAM User rồi nhúng access key vào code/environment variable.

### Trap: nghĩ Group có thể assume được như Role
Group chỉ là tập hợp User để gán Policy hàng loạt, không phải là identity có thể "đăng nhập" hay "assume".

## Mini scenario

**Tình huống:** Một ứng dụng chạy trên EC2 cần đọc/ghi vào một S3 bucket cụ thể, đề yêu cầu giải pháp an toàn nhất và không cần quản lý credentials thủ công.
**Đáp án đúng:** Tạo IAM Role với Policy chỉ cho phép các action cần thiết trên đúng bucket đó, gắn Role vào EC2 instance profile.
**Vì sao:** Role + STS cấp temporary credentials tự động xoay vòng, đúng nguyên tắc Least Privilege, và loại bỏ rủi ro lộ access key tĩnh.

## Key takeaways

- User/Group/Role/Policy là 4 khối cơ bản; Role là công cụ chuẩn để cấp quyền cho service-to-service.
- Least Privilege phải được áp dụng ở mọi Policy — chỉ mở đúng action/resource cần thiết.
- STS + Role = temporary credentials, là cơ chế nền cho hầu hết security best practice trong đề thi.

## Checklist tự ôn

- [ ] Tôi phân biệt được rõ User, Group, Role, Policy.
- [ ] Tôi giải thích được vì sao Role tốt hơn access key cho ứng dụng chạy trên AWS.
- [ ] Tôi phân biệt được Authentication và Authorization.

## Xem tiếp / Liên kết liên quan

- [01-global-infrastructure.md](./01-global-infrastructure.md)
- [03-networking-basics.md](./03-networking-basics.md)
- [../02-core-services/01-ec2.md](../02-core-services/01-ec2.md) (Security Group áp dụng cho EC2)
- [../02-core-services/14-kms-secrets-manager-parameter-store.md](../02-core-services/14-kms-secrets-manager-parameter-store.md)
- [../03-architecture-patterns/06-security-architecture.md](../03-architecture-patterns/06-security-architecture.md)
