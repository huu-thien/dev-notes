# Domain-Driven Design (DDD)

| Thành Phần         | Mô Tả                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **Domain**         |                                                                                                 |
| Factory            | Dùng để xây dựng lại đối tượng (entity) dựa trên những dữ liệu được trả về từ repository.       |
| **Model**          | Khai báo thuộc tính cho đối tượng (entity) mà repository đó quản lý.                            |
| **Service**        | Chứa các module hỗ trợ cho Application, xử lý dữ liệu giữa Application và Query, Repository.    |
| **Infrastructure** |                                                                                                 |
| Repository         | Thực hiện các thao tác update, create, delete.                                                  |
| Query              | Thực hiện các truy vấn select.                                                                  |
| Common             | Chứa các hàm chung (common) như HTTP call, message queue publisher, database access.            |
| **Application**    | Đóng vai trò như Service, chứa các module UseCase giao tiếp với controller và Query/Repository. |

## Kết Luận
DDD giúp tổ chức mã nguồn theo cách giúp quản lý phức tạp trong các ứng dụng lớn, cải thiện tính mở rộng và khả năng bảo trì.
