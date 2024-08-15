# Câu hỏi thường gặp về NestJS

## 1. Giới thiệu về NestJS

- **NestJS là gì và tại sao lại sử dụng nó?**

  NestJS là một framework Node.js được xây dựng trên TypeScript, nhằm mục đích phát triển các ứng dụng server-side có cấu trúc rõ ràng và dễ bảo trì. Nó kết hợp các mô hình lập trình như OOP (Object-Oriented Programming), FP (Functional Programming), và FRP (Functional Reactive Programming). 

  **Lý do sử dụng NestJS:**
  - **Cấu trúc mô-đun:** Giúp tổ chức ứng dụng theo các module, dễ bảo trì và mở rộng.
  - **TypeScript tích hợp:** Cung cấp type-checking mạnh mẽ, phát hiện lỗi sớm.
  - **Hỗ trợ đa nền tảng:** Có thể tích hợp với nhiều cơ sở dữ liệu và hệ thống, bao gồm REST API, GraphQL, và microservices.
  - **Tích hợp thư viện Node.js:** Có thể sử dụng các thư viện phổ biến như Express hoặc Fastify.

## 2. Module trong NestJS

- **Module trong NestJS là gì?**

  Module là các phần độc lập của ứng dụng, tổ chức để chứa các thành phần như controller, provider, và service. Mỗi ứng dụng NestJS có ít nhất một module chính (root module).

- **Module có thể được sử dụng để làm gì trong NestJS?**

  - Tổ chức các thành phần của ứng dụng.
  - Tạo các nhóm chức năng và quản lý các dependencies giữa các phần của ứng dụng.
  - Cung cấp các dịch vụ và controller cho các phần của ứng dụng.

## 3. Controller trong NestJS

- **Controller trong NestJS là gì và vai trò của nó?**

  Controller chịu trách nhiệm xử lý các yêu cầu HTTP và trả về phản hồi cho client. Mỗi controller thường được gán cho một route cụ thể và thực hiện các hành động liên quan đến yêu cầu của client.

- **Làm thế nào để một controller xử lý các yêu cầu HTTP trong NestJS?**

  Controller nhận yêu cầu từ client, xử lý yêu cầu và trả về phản hồi. Nó có thể gọi các service để thực hiện các nghiệp vụ chính.

## 4. Service trong NestJS

- **Service trong NestJS là gì?**

  Service là các thành phần chứa logic nghiệp vụ của ứng dụng. Chúng được sử dụng để thực hiện các thao tác liên quan đến dữ liệu và thường được gọi từ controller để xử lý các yêu cầu.

- **Vai trò của Service trong việc quản lý dữ liệu là gì?**

  Service thực hiện các thao tác chính liên quan đến dữ liệu như truy vấn cơ sở dữ liệu, xử lý dữ liệu và cung cấp các phương thức cho controller để thực hiện các hành động cụ thể.

## 5. Dependency Injection (DI)

- **Dependency Injection (DI) trong NestJS là gì?**

  DI là một mô hình thiết kế cho phép các đối tượng hoặc service được cung cấp cho các lớp hoặc thành phần thay vì phải tự tạo ra chúng. NestJS sử dụng DI để quản lý các dependencies giữa các component của ứng dụng.

- **Lợi ích của Dependency Injection trong NestJS là gì?**

  - Giảm sự phụ thuộc giữa các thành phần, làm cho mã nguồn dễ kiểm tra và bảo trì hơn.
  - Tăng tính tái sử dụng của các component.
  - Quản lý các dependencies một cách hiệu quả và dễ dàng hơn.

## 6. Middleware trong NestJS

- **Middleware trong NestJS là gì?**

  Middleware là các hàm được thực thi trong quá trình xử lý yêu cầu HTTP, trước khi yêu cầu đến controller. Chúng có thể được sử dụng để thực hiện các thao tác như xác thực, logging, hoặc xử lý lỗi.

- **Làm thế nào để định nghĩa và sử dụng middleware trong NestJS?**

  Middleware có thể được định nghĩa dưới dạng hàm và được đăng ký toàn cục hoặc cho từng route cụ thể. Chúng có thể thực hiện các thao tác cần thiết trước khi yêu cầu đến các controller.

## 7. Exception Filters

- **Exception Filters trong NestJS là gì?**

  Exception Filters là các lớp đặc biệt dùng để xử lý và quản lý lỗi phát sinh trong ứng dụng. Chúng giúp phân loại lỗi và trả về phản hồi thích hợp cho client.

- **Làm thế nào để tạo và sử dụng Exception Filters trong NestJS?**

  Exception Filters có thể được định nghĩa dưới dạng lớp và được đăng ký cho toàn bộ ứng dụng hoặc cho các controller cụ thể. Chúng sẽ bắt các lỗi, xử lý và trả về phản hồi với mã trạng thái và thông điệp lỗi phù hợp.

## 8. Guards

- **Guards trong NestJS là gì?**

  Guards là các lớp chịu trách nhiệm kiểm tra và xác thực yêu cầu trước khi yêu cầu đến controller. Chúng giúp bảo vệ các route và thực hiện các kiểm tra như xác thực người dùng hoặc quyền truy cập.

- **Làm thế nào để tạo và sử dụng Guards trong NestJS?**

  Guards có thể được định nghĩa dưới dạng lớp và được áp dụng cho các route hoặc controller cụ thể. Chúng sẽ kiểm tra điều kiện cần thiết và quyết định xem yêu cầu có nên tiếp tục hay không.

## 9. Pipes

- **Pipes trong NestJS là gì?**

  Pipes là các lớp dùng để xử lý và biến đổi dữ liệu đầu vào trước khi nó đến controller. Chúng có thể thực hiện các tác vụ như xác thực dữ liệu, chuyển đổi kiểu dữ liệu hoặc lọc dữ liệu.

- **Làm thế nào để định nghĩa và sử dụng Pipes trong NestJS?**

  Pipes có thể được định nghĩa dưới dạng lớp và được áp dụng cho các route hoặc parameter cụ thể. Chúng giúp đảm bảo rằng dữ liệu đầu vào đáp ứng các yêu cầu và điều kiện cần thiết.

## 10. Interceptors

- **Interceptors trong NestJS là gì?**

  Interceptors là các lớp cho phép bạn can thiệp vào quá trình xử lý yêu cầu và phản hồi. Chúng có thể được sử dụng để thực hiện các tác vụ như logging, xử lý kết quả hoặc thay đổi phản hồi.

- **Làm thế nào để tạo và sử dụng Interceptors trong NestJS?**

  Interceptors có thể được định nghĩa dưới dạng lớp và được áp dụng cho các route hoặc controller cụ thể. Chúng giúp điều chỉnh quá trình xử lý yêu cầu và phản hồi để phù hợp với nhu cầu của ứng dụng.

## 11. NestJS với TypeORM

- **TypeORM là gì và tại sao lại sử dụng nó với NestJS?**

  **TypeORM** là một ORM (Object-Relational Mapper) cho TypeScript và JavaScript, giúp bạn tương tác với cơ sở dữ liệu một cách dễ dàng hơn. Nó cung cấp một cách tiếp cận mạnh mẽ và linh hoạt để làm việc với cơ sở dữ liệu trong ứng dụng NestJS.

- **Làm thế nào để tích hợp TypeORM vào ứng dụng NestJS?**

  TypeORM có thể được tích hợp vào NestJS bằng cách cài đặt các package cần thiết và cấu hình kết nối cơ sở dữ liệu trong ứng dụng. Sau đó, bạn có thể sử dụng các decorator và repository để làm việc với cơ sở dữ liệu.

## 12. GraphQL trong NestJS

- **GraphQL là gì và tại sao lại sử dụng nó trong NestJS?**

  **GraphQL** là một ngôn ngữ truy vấn cho API và là một runtime cho việc thực thi các truy vấn. Nó cho phép bạn yêu cầu chỉ các dữ liệu mà bạn cần và nhận về một kết quả chính xác. NestJS cung cấp hỗ trợ tích hợp cho GraphQL, giúp bạn xây dựng các API linh hoạt và hiệu quả.

- **Làm thế nào để tích hợp GraphQL vào ứng dụng NestJS?**

  Bạn có thể tích hợp GraphQL vào NestJS bằng cách cài đặt các package cần thiết, cấu hình GraphQL module trong ứng dụng và định nghĩa các schema, resolver để quản lý các truy vấn và thao tác dữ liệu.

## 13. Microservices trong NestJS

- **Microservices là gì và tại sao nên sử dụng chúng trong NestJS?**

  **Microservices** là một kiến trúc phân tách ứng dụng thành các dịch vụ nhỏ, độc lập, có thể triển khai và mở rộng riêng lẻ. NestJS hỗ trợ phát triển các microservices, giúp xây dựng các ứng dụng phân tán dễ mở rộng và bảo trì.

- **Làm thế nào để triển khai microservices trong NestJS?**

  NestJS cung cấp các module và decorator để làm việc với microservices, cho phép bạn triển khai các dịch vụ nhỏ và giao tiếp giữa chúng thông qua các giao thức như TCP, Redis, hoặc NATS.

## 14. Testing trong NestJS

- **NestJS hỗ trợ testing như thế nào?**

  NestJS tích hợp với các công cụ testing phổ biến như Jest và Supertest, cung cấp các công cụ và phương pháp để viết và thực hiện các bài kiểm tra cho các component của ứng dụng.

- **Làm thế nào để viết và chạy các bài kiểm tra trong ứng dụng NestJS?**

  Bạn có thể viết các bài kiểm tra cho controller, service, và các thành phần khác bằng cách sử dụng Jest. NestJS cung cấp các utility để cấu hình và chạy các bài kiểm tra, cũng như mock các dependencies cần thiết cho quá trình kiểm tra.
