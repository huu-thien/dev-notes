Mô hình Three Layer:
- Controller
- Service
- Data
- Migration Project: là project sau này chứa DbContext
- Start up project: là project chứa web api
https://docs.devart.com/dotconnect/mysql/datatypemapping.html

- trong 1 vài trường hợp xử lý phức tạp như tạo 1 book xong cần lấy id của book vừa tạo thêm vào 1 bảng khác (author) thì sử dụng : _context.Database.BeginTransaction(); và sau khi save change thì gọi  _context.Database.CommitTransaction() 
-Bỏ vào try catch (ở catch thì gọi _context.Database.RollbackTransaction())