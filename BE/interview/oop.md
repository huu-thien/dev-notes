# Câu hỏi thường gặp về Lập trình Hướng Đối Tượng (OOP)

## 1. OOP là gì?

- **OOP là gì và các nguyên tắc cơ bản của nó là gì?**

  **Lập trình hướng đối tượng (OOP)** là một phương pháp lập trình sử dụng các đối tượng và lớp để tổ chức và quản lý mã nguồn. Các nguyên tắc cơ bản của OOP bao gồm:
  - **Encapsulation (Đóng gói):** Che giấu các chi tiết triển khai bên trong một đối tượng và chỉ cung cấp các phương thức công cộng để truy cập và thay đổi trạng thái của đối tượng.
  - **Abstraction (Trừu tượng hóa):** Cung cấp một giao diện đơn giản cho người dùng trong khi ẩn đi các chi tiết phức tạp.
  - **Inheritance (Kế thừa):** Cho phép tạo ra một lớp mới dựa trên một lớp đã tồn tại, kế thừa các thuộc tính và phương thức từ lớp cơ sở.
  - **Polymorphism (Đa hình):** Cho phép các đối tượng thuộc các lớp khác nhau sử dụng cùng một giao diện hoặc phương thức, nhưng có hành vi khác nhau dựa trên lớp cụ thể của đối tượng.

## 2. Encapsulation (Đóng gói)

- **Encapsulation là gì và tại sao nó quan trọng?**

  Encapsulation là quá trình nhóm các thuộc tính và phương thức liên quan vào một đối tượng và ẩn các chi tiết nội bộ của đối tượng khỏi các phần khác của hệ thống. Điều này giúp bảo vệ dữ liệu, giảm sự phụ thuộc và tăng khả năng bảo trì của mã nguồn.

- **Làm thế nào để thực hiện encapsulation trong một ngôn ngữ lập trình như Java hoặc C#?**

  Bạn thực hiện encapsulation bằng cách sử dụng các access modifiers (như `private`, `protected`, `public`) để kiểm soát quyền truy cập vào các thuộc tính và phương thức của lớp. Các thuộc tính thường được khai báo là `private` và chỉ có thể được truy cập thông qua các phương thức `public` hoặc `protected`.

## 3. Abstraction (Trừu tượng hóa)

- **Abstraction là gì và tại sao nó quan trọng?**

  Abstraction là quá trình tạo ra các lớp trừu tượng và giao diện để ẩn các chi tiết cài đặt cụ thể, giúp người dùng làm việc với các đối tượng thông qua các giao diện đơn giản hơn. Điều này giúp giảm độ phức tạp và tạo ra mã nguồn dễ hiểu và duy trì hơn.

- **Làm thế nào để thực hiện abstraction trong một ngôn ngữ lập trình như Java hoặc Python?**

  Bạn có thể thực hiện abstraction bằng cách sử dụng các lớp trừu tượng hoặc giao diện. Trong Java, bạn có thể tạo các lớp trừu tượng bằng cách sử dụng từ khóa `abstract`, và trong Python, bạn có thể sử dụng các lớp cơ sở với các phương thức chưa được triển khai (abstract methods) thông qua module `abc`.

## 4. Inheritance (Kế thừa)

- **Inheritance là gì và tại sao nó quan trọng?**

  Inheritance cho phép một lớp mới kế thừa các thuộc tính và phương thức từ một lớp đã tồn tại. Điều này giúp tái sử dụng mã nguồn, giảm sự trùng lặp và tạo ra một cấu trúc lớp phân cấp rõ ràng.

- **Làm thế nào để thực hiện inheritance trong một ngôn ngữ lập trình như Java hoặc C++?**

  Trong Java, bạn sử dụng từ khóa `extends` để chỉ định lớp kế thừa, và trong C++, bạn sử dụng từ khóa `:`. Lớp con sẽ kế thừa các thuộc tính và phương thức của lớp cha và có thể mở rộng hoặc ghi đè các phương thức theo nhu cầu.

## 5. Polymorphism (Đa hình)

- **Polymorphism là gì và tại sao nó quan trọng?**

  Polymorphism cho phép các đối tượng thuộc các lớp khác nhau được xử lý qua cùng một giao diện hoặc phương thức, mặc dù các đối tượng có thể thực hiện các hành vi khác nhau. Điều này giúp tạo ra mã nguồn linh hoạt và mở rộng.

- **Làm thế nào để thực hiện polymorphism trong một ngôn ngữ lập trình như Java hoặc C++?**

  Trong Java, bạn có thể thực hiện polymorphism thông qua phương thức ghi đè (method overriding) và interface. Trong C++, bạn có thể sử dụng các phương thức ảo (virtual methods) để cho phép các lớp kế thừa thực hiện các hành vi khác nhau cho các phương thức giống nhau.

## 6. Lớp và Đối tượng

- **Lớp (Class) là gì?**

  Lớp là một bản thiết kế hoặc khuôn mẫu cho các đối tượng. Nó định nghĩa các thuộc tính (biến) và phương thức (hàm) mà các đối tượng của lớp đó sẽ có. 

- **Đối tượng (Object) là gì?**

  Đối tượng là một thể hiện cụ thể của một lớp. Nó chứa các giá trị cho các thuộc tính và có thể thực thi các phương thức được định nghĩa trong lớp.

- **Làm thế nào để tạo đối tượng từ lớp trong một ngôn ngữ lập trình như Java hoặc Python?**

  Trong Java, bạn sử dụng từ khóa `new` để tạo một đối tượng từ lớp. Trong Python, bạn gọi lớp như một hàm để tạo đối tượng.

## 7. Interface và Abstract Class

- **Interface là gì và sự khác biệt giữa interface và lớp trừu tượng (abstract class) là gì?**

  Interface là một tập hợp các phương thức không có cài đặt (chỉ có khai báo) mà các lớp phải triển khai. Nó cung cấp một cách để đảm bảo rằng các lớp thực hiện các phương thức cụ thể.

  **Khác biệt chính:**
  - **Interface**: Chỉ định các phương thức mà lớp cần triển khai, không cung cấp cài đặt.
  - **Abstract Class**: Có thể chứa các phương thức đã được cài đặt và các phương thức chưa được cài đặt. Nó có thể có thuộc tính và phương thức với cài đặt mặc định.

- **Khi nào nên sử dụng interface và khi nào nên sử dụng lớp trừu tượng?**

  - **Interface**: Khi bạn cần định nghĩa một hợp đồng mà các lớp phải tuân theo, nhưng không quan tâm đến cách cài đặt.
  - **Abstract Class**: Khi bạn cần cung cấp một số cài đặt cơ bản và chỉ muốn các lớp con kế thừa và mở rộng chức năng của lớp trừu tượng.

## 8. Composition (Tổng hợp) và Aggregation (Tập hợp)

- **Composition và Aggregation là gì và sự khác biệt giữa chúng là gì?**

  **Composition (Tổng hợp)** là một loại quan hệ "phần-bộ" mạnh mẽ, nơi các thành phần không thể tồn tại độc lập ngoài đối tượng chính. Nếu đối tượng chính bị xóa, các thành phần cũng sẽ bị xóa theo.

  **Aggregation (Tập hợp)** là một loại quan hệ "phần-bộ" yếu hơn, nơi các thành phần có thể tồn tại độc lập và không bị ảnh hưởng khi đối tượng chính bị xóa.

- **Khi nào nên sử dụng Composition và khi nào nên sử dụng Aggregation?**

  - **Composition**: Khi các thành phần không thể tồn tại độc lập hoặc khi bạn muốn đảm bảo rằng sự sống còn của các thành phần liên thuộc vào đối tượng chính.
  - **Aggregation**: Khi các thành phần có thể tồn tại độc lập và chỉ đơn thuần là một phần của đối tượng chính mà không phụ thuộc vào sự sống còn của nó.

## 9. SOLID Principles

- **SOLID là gì và các nguyên tắc SOLID là gì?**

  **SOLID** là một tập hợp các nguyên tắc thiết kế giúp tạo ra các hệ thống phần mềm dễ bảo trì và mở rộng. Các nguyên tắc bao gồm:
  - **Single Responsibility Principle (SRP):** Mỗi lớp nên có một lý do duy nhất để thay đổi, tức là nó nên có một nhiệm vụ duy nhất.
  - **Open/Closed Principle (OCP):** Các lớp nên mở để mở rộng nhưng đóng để thay đổi, tức là bạn nên có thể thêm tính năng mà không thay đổi mã nguồn hiện tại.
  - **Liskov Substitution Principle (LSP):** Các đối tượng của lớp con nên có thể thay thế các đối tượng của lớp cha mà không làm thay đổi tính đúng đắn của chương trình.
  - **Interface Segregation Principle (ISP):** Các lớp không nên bị buộc phải phụ thuộc vào các interface mà chúng không sử dụng.
  - **Dependency Inversion Principle (DIP):** Các module cấp cao không nên phụ thuộc vào các module cấp thấp. Cả hai nên phụ thuộc vào các abstractions.

- **Lợi ích của việc áp dụng các nguyên tắc SOLID trong thiết kế phần mềm là gì?**

  Việc áp dụng các nguyên tắc SOLID giúp tạo ra mã nguồn dễ bảo trì, dễ mở rộng và dễ hiểu. Nó giúp giảm sự phụ thuộc giữa các phần của hệ thống và cải thiện khả năng thay đổi và mở rộng của ứng dụng.

