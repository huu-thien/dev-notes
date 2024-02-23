# (EF Core) Sinh ra các entity từ database với công cụ dotnet ef trong C#

Ở các phần trước đã sử dụng EF theo hướng viết ra các Model, Entity từ đó sinh ra Database. Tuy nhiên nếu muốn đi theo chiều ngược lại, từ Database có sẵn nó sinh ra các Entity, các lớp biểu biểu diễn mảng thì ta có thể sử dụng đến công cụ dòng lệnh `dotnet-ef`
Nếu chưa có công cụ này thì cài đặt vào bằng lệnh

```bash
dotnet tool install --global dotnet-ef
```

Gõ lệnh sau để kiếm tra

```bash
dotnet ef
```

Hãy đảm bảo trong dự án muốn từ Database sinh ra các entity có thêm các package sau:
```bash
dotnet add package System.Data.SqlClient
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.Extensions.DependencyInjection
dotnet add package Microsoft.Extensions.Logging.Console
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Tools.DotNet
```

Giả sử đang có Database mà chuỗi kết nối là:

```csharp
"Data Source=localhost,1433;Initial Catalog=shopdata;User ID=SA;Password=Password123"
```

Thì gõ lệnh sau để nó truy vấn thông tin từ database và sinh ra các entity tương ứng

```bash
dotnet ef dbcontext scaffold -o Models -f -d "Data Source=localhost,1433;Initial Catalog=shopdata;User ID=SA;Password=Password123" "Microsoft.EntityFrameworkCore.SqlServer"
```

Trong các tham số trên thì:

- `-o Models` thư mục lưu các entity được sinh ra
- `-f` cho phép ghi đè file
- `-d` ưu tiên sử dụng kỹ thuật Data Annotation nếu có thể - nếu không thể thì dùng FLuent API
- Cuối là chuỗi kết nối và thư viện sử dụng