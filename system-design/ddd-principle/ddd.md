# Mô hình DDD (Domain-Driven Design)

Mô hình DDD (Domain-Driven Design) là một phương pháp tiếp cận trong việc phát triển phần mềm, tập trung vào việc xây dựng hệ thống dựa trên mô hình miền (domain model) và sự hợp tác giữa các chuyên gia trong lĩnh vực (domain experts) và các kỹ sư phần mềm. Mô hình DDD giúp phát triển ứng dụng một cách chặt chẽ và dễ dàng bảo trì khi hệ thống ngày càng trở nên phức tạp.

## Các Layer trong Mô hình DDD

Mô hình DDD thường được chia thành nhiều lớp (layers) để tổ chức và phân chia trách nhiệm trong phần mềm. Dưới đây là các lớp cơ bản trong một ứng dụng DDD và vai trò của từng lớp:

### 🏢 **Domain Layer (Lớp Miền)**

- **Vai trò**: Đây là lớp trung tâm trong DDD, chứa các khái niệm chủ yếu về doanh nghiệp và logic nghiệp vụ. Lớp này bao gồm các đối tượng như Entity, Value Object, Aggregate, và Domain Service.
  
- **Nhiệm vụ**: Cung cấp mô hình miền chính xác và biểu diễn logic nghiệp vụ của hệ thống.

- **Entity**: Là đối tượng có danh tính (identity) và có thể thay đổi theo thời gian.
  
- **Value Object**: Là đối tượng không có danh tính, thường dùng để mô tả các thuộc tính, trạng thái không thay đổi.
  
- **Aggregate**: Là nhóm các entity và value object được coi là một đơn vị toàn vẹn, quản lý sự thay đổi của chúng.
  
- **Domain Service**: Cung cấp các dịch vụ nghiệp vụ không thuộc về một entity hay value object cụ thể.

### 📦 **Application Layer (Lớp Ứng Dụng)**

- **Vai trò**: Lớp này chịu trách nhiệm điều phối và xử lý các yêu cầu từ bên ngoài (client), thực hiện các thao tác cần thiết và sử dụng các đối tượng trong domain layer để giải quyết yêu cầu nghiệp vụ.
  
- **Nhiệm vụ**: Cung cấp các trường hợp sử dụng (use cases) của hệ thống, thường chứa các lớp Application Service để gọi các phương thức của domain layer và trả về kết quả.

- **Application Service**: Là lớp điều phối, nhận các yêu cầu từ bên ngoài (chẳng hạn như từ UI) và thực thi các nghiệp vụ thông qua domain layer.

### 🔧 **Infrastructure Layer (Lớp Hạ Tầng)**

- **Vai trò**: Lớp này cung cấp các công cụ và hạ tầng cần thiết cho việc triển khai ứng dụng, chẳng hạn như kết nối cơ sở dữ liệu, gửi email, hoặc gọi các API bên ngoài.
  
- **Nhiệm vụ**: Cung cấp các dịch vụ hỗ trợ kỹ thuật (data access, messaging, caching, v.v.), để domain layer có thể làm việc mà không cần biết chi tiết về cách thức thực thi bên ngoài.

- **Repository**: Là lớp trong hạ tầng giúp truy xuất và lưu trữ dữ liệu của các entity và aggregate.
  
- **Persistence**: Lớp này cung cấp các phương thức để lưu trữ và truy xuất dữ liệu từ cơ sở dữ liệu.

### 📱 **User Interface Layer (Lớp Giao Diện Người Dùng)**

- **Vai trò**: Lớp này cung cấp giao diện người dùng (UI) cho hệ thống, để người dùng có thể tương tác với ứng dụng.
  
- **Nhiệm vụ**: Chịu trách nhiệm giao tiếp với người dùng, nhận dữ liệu từ người dùng, truyền đạt các yêu cầu đến application layer và hiển thị kết quả trả về. Giao diện có thể là một ứng dụng web, desktop, hoặc mobile.

- **Controller**: Là lớp điều phối giữa UI và ứng dụng, xử lý các yêu cầu từ người dùng và gọi các phương thức trong application layer.

---

## Tóm tắt các Layer trong DDD:

- 🏢 **Domain Layer**: Chứa logic nghiệp vụ và mô hình miền (Entity, Value Object, Aggregate, Domain Service).
  
- 📦 **Application Layer**: Điều phối các yêu cầu ứng dụng và sử dụng các dịch vụ từ domain layer.
  
- 🔧 **Infrastructure Layer**: Cung cấp các dịch vụ hạ tầng hỗ trợ (cơ sở dữ liệu, API, v.v.).
  
- 📱 **User Interface Layer**: Cung cấp giao diện người dùng, tương tác với người dùng và gửi yêu cầu tới ứng dụng.

---

## Các nguyên tắc trong DDD:

- 🌐 **Ubiquitous Language (Ngôn ngữ chung)**: Tất cả các thành viên trong nhóm phát triển (kể cả các chuyên gia trong lĩnh vực) sử dụng một ngôn ngữ chung để tránh sự mơ hồ và đảm bảo rằng mọi người hiểu nhau.

- 🛠️ **Bounded Context (Ngữ cảnh giới hạn)**: Mỗi phần của hệ thống có thể có một mô hình miền riêng, và các mô hình này được tách biệt nhau trong các ngữ cảnh giới hạn khác nhau. Điều này giúp tránh xung đột và làm cho các mô hình miền trở nên rõ ràng hơn.

---

Mô hình DDD giúp phát triển hệ thống bền vững, dễ bảo trì và có khả năng mở rộng, đặc biệt là đối với các hệ thống phức tạp.
