# MVC (Model-View-Controller)

## 1. 🗃️ **Model**

- **Mô tả:**
  Model là thành phần đại diện cho dữ liệu và các quy tắc nghiệp vụ của ứng dụng. Nó quản lý dữ liệu, logic nghiệp vụ, và quy tắc bảo toàn dữ liệu. Model không phụ thuộc vào giao diện người dùng và không xử lý cách dữ liệu được trình bày.

- **Vai trò:**
  - Lưu trữ dữ liệu của ứng dụng.
  - Thực hiện các phép toán trên dữ liệu.
  - Cung cấp dữ liệu cho View và nhận yêu cầu từ Controller để cập nhật dữ liệu.

- **Ví dụ:**
  - Các lớp hoặc đối tượng đại diện cho các bảng trong cơ sở dữ liệu.
  - Các đối tượng chứa các phương thức để truy vấn, cập nhật dữ liệu.

## 2. 👁️ **View**

- **Mô tả:**
  View là thành phần chịu trách nhiệm về việc trình bày dữ liệu cho người dùng. Nó hiển thị thông tin từ Model và cập nhật giao diện người dùng dựa trên các thay đổi trong Model. View không chứa logic nghiệp vụ và không quản lý dữ liệu.

- **Vai trò:**
  - Hiển thị dữ liệu từ Model cho người dùng.
  - Cập nhật giao diện khi có thay đổi trong Model.

- **Ví dụ:**
  - Các trang HTML, các mẫu (templates) trong ứng dụng web.
  - Các lớp hoặc đối tượng chịu trách nhiệm về giao diện người dùng trong các ứng dụng desktop hoặc mobile.

## 3. 🎮 **Controller**

- **Mô tả:**
  Controller là thành phần trung gian giữa Model và View. Nó nhận các yêu cầu từ người dùng thông qua View, xử lý các yêu cầu đó (bao gồm việc cập nhật Model hoặc thực hiện các hành động khác), và trả lại kết quả cho View để hiển thị.

- **Vai trò:**
  - Xử lý các yêu cầu từ người dùng.
  - Cập nhật Model dựa trên yêu cầu.
  - Chọn View phù hợp để hiển thị kết quả.

- **Ví dụ:**
  - Các lớp hoặc đối tượng chịu trách nhiệm xử lý các yêu cầu HTTP trong các ứng dụng web.
  - Các lớp điều khiển hành động của người dùng trong các ứng dụng desktop hoặc mobile.

## 🔄 **Tổng Quan**

- **Tách biệt các phần của ứng dụng:**
  - **Model:** Quản lý dữ liệu và logic nghiệp vụ.
  - **View:** Quản lý giao diện và cách dữ liệu được hiển thị.
  - **Controller:** Quản lý luồng xử lý và giao tiếp giữa Model và View.

- **Lợi ích của MVC:**
  - **Tách biệt các vai trò:** Giúp phân tách rõ ràng giữa logic nghiệp vụ, giao diện người dùng, và điều khiển luồng xử lý.
  - **Dễ bảo trì và mở rộng:** Cho phép thay đổi một phần mà không ảnh hưởng đến các phần khác.
  - **Khả năng tái sử dụng:** Có thể tái sử dụng các thành phần trong các ứng dụng khác nhau.
