# Giới thiệu Entity Framework và cách sử dụng phần cơ bản với C#
- Giới thiệu về thư viện EF Core, thư viện cung cấp khả năng ánh xạ đối tượng lập trình với các đối tượng CSDL, cơ bản dùng EF để tạo DB, đọc, ghi, xóa dữ liệu, sử dụng Linq để thực hiện các truy vấn.
## Giới thiệu về Entity Framework Core
- **EF Core** là framework (thư viện khung) để ánh xạ các đơn vị dữ liệu mô tả bằng lớp (đối tượng) vào cơ sở dữ liệu quan hệ, nó cho phép ánh xạ vào các bảng CSDL, tạo CSDL, truy vấn với LINQ, tạo và cập nhật vào database.
- Để sử dụng `EF Core` hãy thêm những package cần thiết vào, chạy các lệnh sau:
```bash
dotnet add package System.Data.SqlClient
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.Extensions.DependencyInjection
dotnet add package Microsoft.Extensions.Logging
dotnet add package Microsoft.Extensions.Logging.Console
```

-  Những namespace có thể dùng:
```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
```

## Tạo Model đơn giản, ánh xạ bảng CSDL
- Model là mô hình hóa các đối tượng dữ liệu trong hệ quản trị CSDL thành các đối tượng lập trình, đó là các lớp (class) tương ứng với các bảng ... Hãy tạo ra một dự án `Console` trong thư mục `ef01` có cài đặt các package trên để thực hành. Ở đây tạo ra một model đơn giản, lớp có tên `Product` biểu diễn các dòng trong bảng của CDSL, bảng này tên là `Products`
- Trước tiên, lớp này định nghĩa thuần túy gồm các thuộc tính như sau:
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ef01
{
    public class Product
    {
        public int ProductId {set; get;}
        public string Name {set; get;}
        public string Provider {set; get;}
    }
}
```

- Trước khi sử dụng model `Product` trong EF Core, hãy bổ sung các thiết lập thông qua các Attribute (sử dụng [Sử dụng Attribute](https://xuanthulab.net/su-dung-attribute-annotation-trong-lap-trinh-c-csharp.html)) như sau:
	- Thiết lập lớp Product là ánh xạ bảng Products, dùng thuộc tính Table để thiết lập: `[Table("Products")]`
	- Trường `ProductId` là [Primary key](https://xuanthulab.net/tao-bang-voi-create-table-kieu-du-lieu-cot-trong-sql.html#PrimaryKey) của bảng với thuộc tính `[Key]`
	- Trường `Name` bắt buộc phải thiết lập (khác null) dùng thuộc tính `[Required]`, và độ dài tối là là 50 ký tự với thuộc tính `[StringLength(50)]`
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ef01
{
    [Table("Products")]
    public class Product
    {
        [Key]
        public int ProductId {set; get;}

        [Required]
        [StringLength(50)]
        public string Name {set; get;}

        [StringLength(50)]
        public string Provider {set; get;}
    }
}
```
- Đây là khai báo một lớp bình thường, chỉ có bổ sung thêm vài thuộc tính mô tả (Attribute) cho lớp, thuộc tính - các Attribute này được sử dụng bởi EF.
## Tạo Context - DbContext
- **DbContext** trong EF là ngữ cảnh làm việc, nó biểu diễn, chứa các thông tin cần thiết của một phiên làm việc với CSDL.
- Để thực hiện tạo ra mối liên hệ bảng Products trong CSDL và model, tạo ra Context như sau: Tạo lớp kế thừa `DbContext` đặt tên là `ProductsContext`, lớp này mang ý nghĩa như là một CSDL.
- Trong đó cần nạp chồng `OnConfiguring` để cấu hình (thiết lập chuỗi kết nối ...), và tạo ra thuộc tính có kiểu `DbSet<Product>` chính là bảng trong CSDL
```csharp
using Microsoft.EntityFrameworkCore;

namespace ef01
{
    public class ProductsContext : DbContext
    {
        // Thuộc tính products kiểu DbSet<Product> cho biết CSDL có bảng mà
        // thông tin về bảng dữ liệu biểu diễn bởi model Product
        public DbSet<Product> products {set; get;}

        // Chuỗi kết nối tới CSDL (MS SQL Server)
        private const string connectionString = @"
                Data Source=localhost,1433;
                Initial Catalog=mydata;
                User ID=SA;Password=Password123";

        // Phương thức OnConfiguring gọi mỗi khi một đối tượng DbContext được tạo
        // Nạp chồng nó để thiết lập các cấu hình, như thiết lập chuỗi kết nối
        protected override void  OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlServer(connectionString);
        }s
    }
}
```

- Từ lớp kế thừa `DbContext` là `ProductsContext` có thể tương tác với CSDL bằng cách gọi các phương thức thích hợp trong DbContext, tìm hiểu một số trường hợp đơn giản sau đây.
## Tạo và xóa Database
- `DbContext` có thuộc tính `Database`, thuộc tính này là đối tượng kiểu `DatabaseFacade`, từ đó có thể tạo / xóa database.
- **EnsureCreatedAsync** là phươnng thức của `DatabaseFacade` để tạo ra database, nếu database nó đang không tồn tại, nếu DB đã tồn tại thì không làm gì cả.
```csharp
// Tạo Database mydata (tên mydata từ thông tin kết nối)
// Gồm tất cả các bảng định nghĩa bởi các thuộc tính kiểu DbSet
public static async Task CreateDatabase() {
    using (var dbcontext = new ProductsContext())
    {
        String databasename = dbcontext.Database.GetDbConnection().Database;// mydata

        Console.WriteLine("Tạo " + databasename);

        bool result = await dbcontext.Database.EnsureCreatedAsync();
        string resultstring = result ? "tạo  thành  công" : "đã có trước đó";
        Console.WriteLine($"CSDL {databasename} : {resultstring}");
    }
}
```

- Chạy thử phương thức trong hàm Main
```csharp
static async Task  Main(string[] args)
{
    await CreateDatabase();
}
// Tạo mydata
// CSDL mydata : tạo  thành  công
```

- Thi hành thì nó sẽ tạo ra database, nếu DB đó chưa có! Database này tạo ra có tên `mydata`, có một bảng tên `Products` với cấu trúc giống mô tả trong model `Product`

- **DeleteDatabase** là phươnng thức của `DatabaseFacade` để xóa CSDL.

```csharp
public static async Task DeleteDatabase()
{

    using (var context = new ProductsContext())
    {
        String databasename = context.Database.GetDbConnection().Database;
        Console.Write($"Có chắc chắn xóa {databasename} (y) ? ");
        string input = Console.ReadLine();

        // Hỏi lại cho chắc
        if (input.ToLower() == "y")
        {
            bool deleted = await context.Database.EnsureDeletedAsync();
            string deletionInfo = deleted ? "đã xóa" : "không xóa được";
            Console.WriteLine($"{databasename} {deletionInfo}");
        }
    }

}
```

## Chèn dữ liệu vào các bảng, AddAsync, AddRangeAsync, SaveChangesAsync
- Các đối tượng `DbContext` hay `DbSet` (như thuộc tính products của lớp ProductContext ở trên) có phương thức `AddAsync` để bạn chèn đối tượng phù hợp vào DbContext, nó nhận tham số là đối tượng Model cần chèn vào. Sau đó gọi phương thức `SaveChangesAsync` để thực hiện cập nhật dữ liệu vào Server SQL
```csharp
// Thực hiện chèn hai dòng dữ liệu vào bảng Product
// Dùng AddAsync trong DbSet và trong DbContext
public static async Task InsertProduct()
{
    using (var context = new ProductsContext())
    {
        // Thêm sản phẩm 1
        await  context.products.AddAsync(new Product
        {
            Name = "Sản phẩm 1",
            Provider = "Công ty 1"
        });
        // Thêm sản phẩm 2
        await  context.AddAsync(new Product()
        {
            Name = "Sản phẩm 2",
            Provider = "Công ty 1"
        });

        // Thực hiện cập nhật thay đổi trong DbContext lên Server
        int rows = await context.SaveChangesAsync();
        Console.WriteLine($"Đã lưu {rows} sản phẩm");

    }
}
```

- Chạy thử:
```csharp
static async Task  Main(string[] args)
{
    await InsertProduct();
}
```

- Nếu muốn thêm một lúc nhiều dữ liệu thì dùng `AddRangeAsync`, nó có thể nhận đối số là mảng các đối tượng cần chèn vào

```csharp
var p1 = new  Product() {Name = "Sản phẩm 3", Provider = "CTY A"};
var p2 = new  Product() {Name = "Sản phẩm 4", Provider = "CTY A"};
var p3 = new  Product() {Name = "Sản phẩm 5", Provider = "CTY B"};

await context.AddRangeAsync(new object[] {p1, p2, p3});

int rows = await context.SaveChangesAsync();
Console.WriteLine($"Đã lưu {rows} sản phẩm");
```

## Đọc dữ liệu từ bảng, truy vấn với LINQ
- Các đối tượng `DbSet` có phương thức `ToListAsync()` hay `ToArrayAsync()` để lấy về tất cả các dữ liệu (List) của bảng. Đặc biệt bạn có thể dùng LINQ ( đọc [Linq C#](https://xuanthulab.net/linq-trong-lap-trinh-c-net-thuc-hinh-vi-du-linq.html)) trên các đối tượng này (nguồn là các DbSet)
```csharp
public static async Task ReadProducts()
{
    using (var context = new ProductsContext())
    {
        // context.SetLogging();
        // Lấy danh sách các sản phẩm trong bảng 
        var products = await context.products.ToListAsync();

        Console.WriteLine("Tất cả sản phẩm");
        foreach (var product in products)
        {
            Console.WriteLine($"{product.ProductId,2} {product.Name,  10} - {product.Provider}");
        }
        Console.WriteLine();
        Console.WriteLine();

        // Dùng LINQ để truy vấn đến DbSet products (bảng product)
        // Lấy các sản phẩm cung cấp bởi CTY A 
        products = await (from p in context.products
                          where (p.Provider == "CTY A") select p
                         )
                        .ToListAsync();

        // Nếu không dùng bất đồng bộ chỗ này, có thể dùng
        // var pros = from p in context.products where (p.Provider == "CTY A") select p;

        Console.WriteLine("Sản phẩm CTY A");
        foreach (var product in products)
        {
            Console.WriteLine($"{product.ProductId,2} {product.Name,  10} - {product.Provider}");
        }
    }
}
```

## Cập nhật dữ liệu trong EF
- Muốn cập nhật dữ liệu, chỉ việc thay đổi thuộc tính của đối tượng đọc được, sau đó gọi `context.SaveChangesAsync`
```csharp
// Đổi tên sản phẩm có ProductID thành  tên mới
public static async Task RenameProduct(int id, string newName)
{
    using (var context = new ProductsContext())
    {

        // Lấy  Product có  ID sản phẩm  chỉ  ra
        var product = await (from p in context.products where (p.ProductId == id) select p).FirstOrDefaultAsync();

        // Đổi tên và cập nhật
        if (product != null)
        {
            product.Name = newName;
            Console.WriteLine($"{product.ProductId,2} có tên mới = {product.Name,  10}");
            await context.SaveChangesAsync();  //Thi hành cập nhật
        }
    }
}
```

- Nếu muốn một đối tượng riêng lẻ, không giám sát - muốn thực hiện cập nhật thì gọi đến phương thức Update của DbSet
```csharp
context.products.Update(p);
```

- Nếu muốn cập nhật một số trường nào đó, dùng cách cập nhật đối tượng độc lập
```csharp
// Tạo đối tượng
var pr = new Product() {
                ProductId  = 4,
                Name = "Abc"
          };
// Gắn pr vào context để theo dõi, nó trả vể đối tượng EntityEntry<Product>
EntityEntry<Product> pr_e = context.Attach(pr);

// Lấy thuộc tính Name của Product và thiết lập nó cần cập nhật
// với IsModified  = true;
pr_e.Property(p =>  p.Name).IsModified  = true;
context.SaveChanges();
```

- Lưu ý, các đối tượng như Product kết quả truy vấn, hoặc được thêm vào ... thì mặc định là được giám sát - theo dõi bởi EF. Khi những đối tượng này thay đổi trạng thái thì `context.SaveChanges()` sẽ thực hiện các tác vụ dựa theo trạng thái của nó.
- Mỗi dòng Product trả về từ truy vấn, hoặc thêm vào thì trong EF có một đối tượng `EntityEntry` tương ứng để để quản lý. Để lấy EntityEntry có thể dùng phương thức Entry, bạn có thể dùng nó để thay đổi trạng thái thủ công, ví dụ để điều chỉnh sự ảnh hưởng khi gọi SaveChange. Ví dụ, loại bỏ không bị giảm sát bởi EF cho đối tượng product nhận được
```csharp
EntityEntry<Product> eProduct = context.Entry(product);
eProduct.State = EntityState.Detached;
```

- Có một số state gồm: `Added`, `Deleted`, `Detached`, `Modified`, `Unchanged`
## Xóa dữ liệu trong EF
- Để xóa dữ liệu khỏi DB, chỉ việc yêu cầu xóa đối tượng khỏi DbContext bằng phương thức `Remove`, rồi gọi `SaveChangesAsync` để cập nhật
```csharp
// Xóa sản phẩm có ProductID = id
public static async Task DeleteProduct(int id)
{
    using (var context = new ProductsContext())
    {
        // context.SetLogging();
        var product = await (from p in context.products where (p.ProductId == id) select p).FirstOrDefaultAsync();

        if (product != null)
        {
            context.Remove(product);
            Console.WriteLine($"Xóa {product.ProductId}");
            await context.SaveChangesAsync();
        }
    }
}
```

## EF Logger hiện thị SQL Query trên terminal
- Nếu muốn thật sự các câu truy vấn do EF, Linq sinh ra để tương tác với Database thì thêm loger như sau, thêm vào lớp ProductContext phương thức SetLogging:
```csharp
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions .DependencyInjection;
using Microsoft.EntityFrameworkCore.Infrastructure;
//..
        public void SetLogging()
        {
            IServiceProvider provider = this.GetInfrastructure<IServiceProvider>();
            ILoggerFactory loggerFactory = provider.GetService<ILoggerFactory>();
            loggerFactory.AddConsole();
        }
//..
```

## EF Logger trong .Net Core 3.x
- Đối với .Net Core 3.x để thiết lập Logger in thông tin tại console thì cần tạo ra một `ILoggerFactory`, sau đó thiết lập sử dụng nó ở phương thức `OnConfiguring` của lớp `ProductsContext`
- Đầu tiên hãy đảm bảo cài đặt các Package mới nhất:
```bash
dotnet add package Microsoft.Extensions.DependencyInjection
dotnet add package Microsoft.Extensions.Logging
dotnet add package Microsoft.Extensions.Logging.Console
```

- Tạo ILoggerFactory như sau:
```csharp
ILoggerFactory loggerFactory = LoggerFactory.Create(builder => {
        builder.AddConsole();
});
```

- Mặc định ILoggerFactory này bắt tất cả các sự kiện, nếu muốn thiết lập các category muốn lọc cũng như cấp độ thì gọi thêm phương thức `AddFilter` khi tạo `ILoggerFactory`, ví dụ:

```csharp
ILoggerFactory loggerFactory = LoggerFactory.Create(builder => {
        builder
            .AddFilter(DbLoggerCategory.Database.Command.Name, LogLevel.Warning)
            .AddFilter(DbLoggerCategory.Query.Name, LogLevel.Debug)
            .AddConsole();
});
```

- Trường hợp trên thiết lập lọc các log thuộc chuyên mục `DbLoggerCategory.Database.Command.Name` ở mức độ `LogLevel.Warning` và chuyên mục `DbLoggerCategory.Query.Name` ở mức độ `LogLevel.Debug`
- Các tên category tham khảo đối với EF Logger: DbLoggerCategory.Database.Command, DbLoggerCategory.Database.Connection, DbLoggerCategory.Database.Transaction, DbLoggerCategory.Infrastructure, DbLoggerCategory.Migration, DbLoggerCategory.Model, DbLoggerCategory.Query, DbLoggerCategory.Scaffolding, DbLoggerCategory.Update

- Ví dụ - thiết lập hoàn chỉnh cho lớp `ProductsContext`
```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ef01
{
  public class ProductsContext : DbContext
    {
        // Tạo ILoggerFactory 
        public static readonly ILoggerFactory loggerFactory = LoggerFactory.Create(builder => {
        builder
               .AddFilter(DbLoggerCategory.Database.Command.Name, LogLevel.Warning)
               .AddFilter(DbLoggerCategory.Query.Name, LogLevel.Debug)
               .AddConsole();
            }
        ); 

        private const string connectionString = " ... ";
        protected override void  OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder
                .UseLoggerFactory(loggerFactory)  // - Thiết lập sử Logger
                .UseSqlServer(connectionString);
        }

        public DbSet<Product> products {set; get;}
    }
}
```