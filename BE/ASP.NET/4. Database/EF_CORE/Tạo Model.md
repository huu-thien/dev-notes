# (EF Core) Tạo Model trong Entity Framework ánh xạ các đối tượng vào Database C# CSharp
Khai báo các Model, sử dụng kỹ thuật Data Annotation để ánh xạ các đối tượng vào các thành phần của CSDL với EF Core, thuộc tính [Column], [ForeignKey], [InverseProperty]

## Tạo Model với Data Annotation (Attribute)

```csharp
**Model/Product.cs**

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ef02.Model
{
    [Table("Product")]                         // Ánh xạ bảng Product 
    public class Product
    {
        [Key]                                  // Là Primary key
        public int ProductId {set; get;}

        [Required]                              // Cột trong DB, Not Null
        [StringLength(50)]                      // nvarchar(50)
        public string Name {set; get;}

        [Column(TypeName="Money")]              // cột kiểu Money trong SQL Server (tương ứng decimal trong Model C#)
        public decimal Price {set; get;}
    }
}
```

```csharp
**Model/Category.cs**

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ef02.Model
{
    [Table("Category")]
    public class Category
    {
        [Key]
        public int CategoryId {set; get;}

        [StringLength(100)]
        public string Name {set; get;}

        [Column(TypeName="ntext")]                  // Cột (trường) kiểu ntext trong SQL Server
        public string Description {set; get;}
    }
}
```

## Những khái niệm về tạo mối liên hệ trong EF Core
Một mối liên hệ là ràng buộc giữa hai đối tượng (entity) dữ liệu, như trong các hệ quản trị CSDL quan hệ, nó thể hiện bởi các khóa ngoại - foreign key (FK). Để tạo ra các mối quan hệ trong EF Core, trước tiên hiểu một số khái niệm sau:
- Bảng dữ liệu phụ thuộc hay bảng con (**Dependent entity**) - là những bảng có chứa khóa ngoại (FK) tham chiếu đến bảng khác
- Bảng dữ liệu chính hay bảng cha (**Principal entity**) - là bảng có chứa khóa chính
- **Khóa chính - PK** là thuộc tính, chứa giá trị duy nhất để xác định dòng dữ liệu
- **Khóa ngoại - Foreign Key (FK)** - là thuộc tính trong bảng con thuộc được sử dụng để lưu khóa chính của bảng cha.
- **Thuộc tính điều hướng (Navigation)** thuộc tính này chứa tham chiếu đến một đối tượng từ bảng khác, có các loại như:
    - Điều hướng tập hợp(Collection navigation) tham chiếu đến một tập hợp các đối tượng bảng khác (quan hệ một nhiều)
    - Điều hướng tham chiếu (Reference navigation) tham chiếu đến một đối tượng khác. (quan hệ một một)
    - Điều hướng nghịch (Inverse navigation) - thuộc tính điều hướng tham chiếu đến một điều hướng khác, sử dụng để tạo FK tham chiếu đến đối tượng cùng kiểu

Những khái niệm này ta sẽ chỉ ra khi bắt gặp trong quá trình thực hành sau đây
Tạo lớp Context chứa 2 Model trên

```csharp
**Model/ShopContext.cs**

using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;

namespace ef02.Model
{
    public class ShopContext : DbContext
    {
        protected string connect_str = @"Data Source=localhost,1433;
                                         Initial Catalog=shopdata;
                                         User ID=SA;Password=Password123";
        public DbSet<Product> products {set; get;}      // bảng Products
        public DbSet<Category> categories {set; get;}   // bảng Category

        protected override void  OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

           // Tạo ILoggerFactory
            ILoggerFactory loggerFactory = LoggerFactory.Create(builder => builder.AddConsole());

            optionsBuilder.UseSqlServer(connect_str)            // thiết lập làm việc với SqlServer
                          .UseLoggerFactory(loggerFactory);     // thiết lập logging

        }

        // Tạo database
        public async Task CreateDatabase()
        {
            String databasename = Database.GetDbConnection().Database;

            Console.WriteLine("Tạo " + databasename);
            bool result = await Database.EnsureCreatedAsync();
            string resultstring = result ? "tạo  thành  công" : "đã có trước đó";
            Console.WriteLine($"CSDL {databasename} : {resultstring}");
        }

        // Xóa Database
        public async Task DeleteDatabase()
        {
            String databasename = Database.GetDbConnection().Database;
            Console.Write($"Có chắc chắn xóa {databasename} (y) ? ");
             string input = Console.ReadLine();

            // // Hỏi lại cho chắc
            if (input.ToLower() == "y")
            {
                bool deleted = await Database.EnsureDeletedAsync();
                string deletionInfo = deleted ? "đã xóa" : "không xóa được";
                Console.WriteLine($"{databasename} {deletionInfo}");
            }
        }
    }
}
```

Như vậy context `ShopContext` sẽ làm việc trên CSDL `shopdata` với hai bảng là `Product` và `Category`. Trước tiên áp dụng với đoạn code sau:

```csharp
static async Task Main(string[] args)
{
        ShopContext context = new ShopContext();

        await context.DeleteDatabase();  // xóa database: shopdata nếu tồn tại
        await context.CreateDatabase();  // tạo lại database: shopdata
}
```

### Ánh xạ cột với Attribute Column

Attribute **[Column]** để ánh xạ thuộc tính vào Model vào bảng CSDL. Nếu muốn thiết lập kiểu của cột dữ liệu, thì thiết lập với `TypeName="Kiểu trong SQL"`
```csharp
[Column(TypeName="Kiểu")]
```

Ví dụ trên:

```csharp
[Column(TypeName="Money")]          // ánh xạ thuộc tính Price, kiểu decimal vào cột Price,  kiểu Money của bảng
public decimal Price {set; get;}
```

Một số kiểu hỗ trợ bởi SQL Server như
```
bigint          numeric         bit             smallint    decimal
smallmoney      int             tinyint         money       date
datetimeoffset  datetime2       smalldatetime   datetime
time            char	        varchar         text
nchar	        nvarchar        ntext           binary
varbinary       image
```

### Tạo ra sự liên hệ ForeignKey
Ở ví dụ trên, giờ muốn thiết lập mỗi một sản phẩm `Product` thì tương ứng có một key trỏ đến ID của `Category` nếu có mà Product thuộc về. Rất đơn giản hãy thêm một thuộc tính kiểu `Category` vào `Product`

```csharp
**Model/Product.cs**

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ef02.Model
{
    [Table("Product")]
    public class Product
    {
        [Key]
        public int ProductId {set; get;}

        [Required]
        [StringLength(50)]
        public string Name {set; get;}

        [Column(TypeName="Money")]
        public decimal Price {set; get;}

        // Sinh FK (CategoryID ~ Cateogry.CategoryID) ràng buộc đến PK key của Category
        public Category Category {set; get;}
    }
}
```

Chạy lại, thấy bảng Product được tạo bằng SQL sau (để ý câu lệnh có sự tạo ràng buộc):
```sql
CREATE TABLE [Products] (
  [ProductId] int NOT NULL IDENTITY,
  [Name] nvarchar(50) NOT NULL,
  [Price] Money NOT NULL,
  [CategoryId] int NULL,
  CONSTRAINT [PK_Products] PRIMARY KEY ([ProductId]),
  CONSTRAINT [FK_Products_Category_CategoryId] FOREIGN KEY ([CategoryId])
             REFERENCES [Category] ([CategoryId]) ON DELETE NO ACTION
```

Thấy rằng, bảng `Product` đã được chèn thêm cột có tên `CategoryId` nó là FK (Foreign Key) tên giống trên PK của bảng tham chiếu đến (Category) - tạo thành quan hệ một nhiều giữa hai bảng Category và Products

Ngoài ra một số tùy chọn bạn có thể thực hiện ngay như:

**Đặt tên FK tùy chọn**
Khi bạn khai báo thuộc tính trong Product

```csharp
public Category Category {set; get;}
```

Nó tự động truy ngược về Category để lấy tên khóa chính (Primary Key) của nó (CategoryID) - sau đó sẽ dùng tên này để đặt tên cho Fk (Foreign Key) trong bảng Product. Nói cách khác trường CategoryID trong Product và trường CategoryID trong Category có sự dàng buộc. Trong trường hợp bạn muốn Fk có tên do bạn tự đặt và nó vẫn dàng buộc đến khóa chính của Category thì hãy dùng thuộc tính mô tả ForeignKey có thuộc tính Category. Ví dụ, Fk bạn muốn đặt tên là CateID thì khai báo như sau:

```csharp
    /..
    // Khóa ngoại tự đặt CateID tham chiếu đến khóa chính CategoryID của bảng Category
    [ForeignKey("CateID")]
    public Category Category {set; get;}
    /..
```

Chạy lại thấy SQL tạo Product như sau:

```sql
CREATE TABLE [Products] (
  [ProductId] int NOT NULL IDENTITY,
  [Name] nvarchar(50) NOT NULL,
  [Price] Money NOT NULL,
  [CateID] int NULL, /* FK key tự đặt */
  CONSTRAINT [PK_Products] PRIMARY KEY ([ProductId]),
  CONSTRAINT [FK_Products_Category_CateID]
             FOREIGN KEY ([CateID]) REFERENCES [Category] ([CategoryId])  /* ràng buộc đến Category */
             ON DELETE NO ACTION /* khi xóa Category thì Product không thay đổi gì*/
);
```

**Tạo thuộc tính Fk truy cập được từ Model**

Mặc dù cách trên, bảng trong DB đã có cột Forgein Key, nhưng trong Model chưa có (nhưng có thuộc tính category là đối tượng Category), nên nếu cần lấy FK này thì chỉ cần thêm nó vào Model

```csharp
 public class Product
    {
        // ...
        public int? CategoryId {set; get;}     // thêm thuộc tính (nullable)
        public Category Category {set; get;}   // Thuộc tính tạo ra FK
        // ...
    }
```

Vậy đã có thuộc tính CategoryID để đọc được dữ liệu này từ bảng Database

Cũng lưu ý nếu bạn khai báo không phải nullable (int?) cho CategoryId, hoặc bạn chỉ định rõ là nó không được NULL bằng thuộc tính mô tả `[Required]` thì nó sẽ thực hiện kiểm tra ràng buộc dữ liệu, CategoryID là giá trị phải có trong bảng Category, hoặc khi xóa một Category thì các sản phẩm thuộc mục này cũng xóa theo.

Ví dụ khai báo trường hợp này:

```csharp
public class Product
    {
        // ...
        // hoặc thêm [Required] khi vẫn dùng int?
        public int CategoryId {set; get;}
        public Category Category {set; get;}   // Thuộc tính tạo ra FK
        // ...
    }
```

Chạy lại thấy query tạo bảng như sau:

```sql
CREATE TABLE [Products] (
  [ProductId] int NOT NULL IDENTITY,
  [Name] nvarchar(50) NOT NULL,
  [Price] Money NOT NULL,
  [CategoryId] int NOT NULL, /* Không được NULL */
  CONSTRAINT [PK_Products] PRIMARY KEY ([ProductId]),
  CONSTRAINT [FK_Products_Category_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Category] ([CategoryId])
  ON DELETE CASCADE /* Khi xóa Category, các sản phẩm thuộc về nó cũng bị xóa theo */
);
```

Có ràng buộc `ON DELETE CASCADE` ở trên bởi vì `[CategoryId] int NOT NULL`, khi xóa Category các sản phẩm bị xóa theo, (xem thêm tại [nullable trong C#](https://xuanthulab.net/tim-hieu-va-su-dung-null-nullable-trong-lap-trinh-c-sharp.html))

Đên đây, lớp `Category` gọi là bảng chính, nó chứa `khóa chính (CategoryId)`, bảng `Product` gọi là bảng con, nó chứa khóa ngoại FK `CategoryId` tham chiếu đến khóa chính của Category.

Thuộc tính `Category` của lớp `Product` gọi là điều hướng tham chiếu (Navigation Reference), ví nó tham chiếu đến một đối tượng lớp Category.

**Chèn dữ liệu mẫu vào Db**

Thêm phương thức sau vào lớp `ShopContext` và chạy nó để có dữ liệu mẫu, Fk của Product sẽ lấy giá trị theo Primary Key của Category.

```csharp
// Chèn dữ liệu mẫu
public async Task InsertSampleData()
{
        // Thêm 2 danh mục vào Category
        var cate1 = new Category() {Name = "Cate1", Description = "Description1"};
        var cate2 = new Category() {Name = "Cate2", Description = "Description2"};
        await AddRangeAsync(cate1, cate2);
        await SaveChangesAsync();

        // Thêm 5 sản phẩm vào Products
        await  AddRangeAsync(
            new Product()  {Name = "Sản phẩm 1",    Price=12, Category = cate2},
            new Product()  {Name = "Sản phẩm 2",    Price=11, Category = cate2},
            new Product()  {Name = "Sản phẩm 3",    Price=33, Category = cate2},
            new Product()  {Name = "Sản phẩm 4(1)", Price=323, Category = cate1},
            new Product()  {Name = "Sản phẩm 5(1)", Price=333, Category = cate1}

        );
        await SaveChangesAsync();
        // Các sản phầm chèn vào
        foreach (var item in products)
        {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.Append($"ID: {item.ProductId}");
            stringBuilder.Append($"tên: {item.Name}");
            stringBuilder.Append($"Danh mục {item.CategoryId}({item.Category.Name})");
            Console.WriteLine(stringBuilder);
        }

// ID: 1tên: Sản phẩm 2Danh mục 2(Cate2)
// ID: 2tên: Sản phẩm 1Danh mục 2(Cate2)
// ID: 3tên: Sản phẩm 3Danh mục 2(Cate2)
// ID: 4tên: Sản phẩm 4(1)Danh mục 1(Cate1)
// ID: 5tên: Sản phẩm 5(1)Danh mục 1(Cate1)

}
```

**Load các thuộc tính liên hệ với FK**
Ở Model `Product` mặc dù có thuộc tính `Category`:
```csharp
public Category Category {set; get;}
```

Nhưng khi EF truy vấn để lấy một Product thì thuộc tính này không tự động được nạp từ DB (nó nhận null). Ví dụ, thêm vào `ShopContext` phương thức sau:

```csharp
public class ShopContext : DbContext
{
    /..

    // Lấy một Product từ DB theo ProductID
    public async Task<Product> FindProduct(int id) {

            var p =  await (from c  in products where c.ProductId == id select c).FirstOrDefaultAsync();
            return  p;
    }
    /..
}
```

Áp dụng

```csharp
static async Task Main(string[] args)
{
        ShopContext context = new ShopContext();

        await context.DeleteDatabase();  // xóa database: shopdata nếu tồn tại
        await context.CreateDatabase();  // tạo lại database: shopdata
        await context.InsertSampleData();

        // Giải phóng và kết nối lại
        await context.DisposeAsync();
        context = new ShopContext();

        var p    = await context.FindProduct(2);
        var c    = p.Category;
        if (p != null)
        {
            Console.WriteLine($"{p.Name} có CategoryId = {p.CategoryId}");
            string CategoryName = (c != null) ? c.Name :  "Category đang null";
            Console.WriteLine(CategoryName);
        }
}
```

Chạy thử, thấy dòng:
```
Sản phẩm 2 có CategoryId = 2
Category đang null
```

Như vậy thấy rằng thuộc tính Category trong Product không nạp (truy vấn lấy về) khi Product đọc được từ EF. Nếu muốn thuộc tính này, nhận được đối tượng Category theo đúng khóa ngoại CategoryId thì làm như sau, sửa lại FindProduct:
```csharp
public class ShopContext :  DbContext
{
    /..
    // Lấy một Product từ DB theo ProductID
    public async Task<Product> FindProduct(int id) {

            var p =  await (from c  in products where c.ProductId == id select c).FirstOrDefaultAsync(); 
            await  Entry(p)                    // lấy DbEntityEntry liên quan đến p
                   .Reference(x => x.Category) // lấy tham chiếu, liên quan đến thuộc tính Category
                   .LoadAsync();               // nạp thuộc tính từ DB
            return  p;
    }
    /..
}
```

Trong đó: **Entry()** lấy đối tượng `DbEntityEntry` trong EF liên quan đến đối tượng dữ liệu, từ đối tượng này có thể thi hành các tác vụ khác nhau.

**DbEntityEntry.Reference()** lấy tham chiếu theo thuộc tính nào đó của dữ liệu (dạng giá trị đơn - Navigation Reference).

**DbEntityEntry.Collection()** lấy tham chiếu theo thuộc tính nào đó của dữ liệu (dạng tập hợp - Navigatin Collection).

Chạy lại, thấy:

```
Sản phẩm 2 có CategoryId = 2
Cate2
```

Vậy thuộc tính tham chiếu đến đối tượng khác cũng đã được nạp.
Tương tự, ở bảng cha (chứa Pk) có thể thêm thuộc tính kiểu Collection (List) cho biết mỗi Danh mục chứa các sản phẩm nào.

```csharp
[Table("Category")]
public class Category
{
    /..

    // Các sản phẩm thuộc về Category   - Đây là điều hướng dạng Collection Navigation (tập hợp)
    public List<Product> Products { get; set;}
}
```

Sau đó khi truy vấn lấy Category, bạn có thể nạp bằng cách dùng `Collection` chứ không phải `Reference`

```csharp
// Truy vấn lấy về Category theo ID
public async Task<Category> FindCategory(int id) {

    var cate =  await (from c  in categories where c.CategoryId == id select c).FirstOrDefaultAsync();
    await  Entry(cate)                     // lấy DbEntityEntry liên quan đến p
           .Collection(cc => cc.products)  // lấy thuộc tính tập hợp, danh sách các sản phẩm
           .LoadAsync();                   // nạp thuộc tính từ DB
    return  cate;
}
```

**Lazy load**

Bạn cũng có thể cài đặt chế độ lazy load, thuộc tính tham chiếu tự động load khi nó được truy cập. Cài vào package:
```bash
dotnet add package Microsoft.EntityFrameworkCore.Proxies
```

Ở phương thức OnConfiguring của DbContext thêm vào
```csharp
optionsBuilder.UseLazyLoadingProxies();
```

```csharp
protected override void  OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    base.OnConfiguring(optionsBuilder);

   // Tạo ILoggerFactory
    ILoggerFactory loggerFactory = LoggerFactory.Create(builder => builder.AddConsole());

    optionsBuilder.UseSqlServer(connect_str)            // thiết lập làm việc với SqlServer
                  .UseLoggerFactory(loggerFactory)      // thiết lập logging
                  .UseLazyLoadingProxies() ;

}
```

Lúc này thuộc tính tham chiếu, collection đều cần phải khai báo `virtual`, thì nó sẽ tự động nạp, ở tại Product

```csharp
public virtual Category Category {set; get;}
```

Tại Model Category

```csharp
public virtual List<Product> products {set; get;}
```

## Tạo điều hướng nghịch với thuộc tính InverseProperty

Đến đây, các khái niệm mỗi liên hệ đã lướt qua gồm: **khóa ngoại (FK), khóa chính (PK), bảng cha, bảng con, điều hướng tham chiếu, điều hướng tập hợp.**

Còn khái niệm nữa là **điều hướng nghịch**, như khái niệm phía trên: Điều hướng nghịch (Inverse navigation) - thuộc tính điều hướng tham chiếu đến một điều hướng khác, sử dụng để tạo FK tham chiếu đến đối tượng cùng kiểu

Ví dụ: Mỗi sản phẩm `Product` ở trên nó thuộc về một `Category` xác định bởi khóa ngoại của nó là `CategoryId`, bây giờ muốn: mỗi sản phẩm có thể thuộc về một Category nữa (có nghĩa một sản phẩm có thể nằm trong hai Category), vậy phải làm thế nào.

Ta sẽ đặt thuộc tính Category thứ hai này là `SecondCategory`, theo logic thông thường thì sẽ tạo một khóa ngoại nữa tham chiếu đến Category

```csharp
public class Product
{
    [Key]
    public int ProductId {set; get;}

    [Required]
    [StringLength(50)]
    public string Name {set; get;}

    [Column(TypeName="Money")]
    public decimal Price {set; get;}


    public int CategoryId {set; get;}               // FK thứ nhất
    [ForeignKey("CategoryId")]
    public virtual Category Category {set; get;}

    public int? CategorySecondId;                   // FK thứ hai
    [ForeignKey("CategorySecondId")]
    public Category SecondCategory {set; get;}      // Chú ý thuộc tính SecondCategory cùng kiểu thuộc tính Category
}
```

Khi chạy nó sẽ báo lỗi, không thể tạo ra mối liên hệ trên. Nguyên nhân là EF không thể xác định mối liên hệ mới giữa Product và Category khi mà đã có mỗi liên hệ ở Fk CategoryId rồi. Để giải quyết thì phải thiết lập thuộc tính `SecondCategory` phải là tham chiếu nghịch, sau đó chỉ ra một cách thủ công nó tham chiếu đến một tham chiếu tập hợp của Category.

Để ý trong Category đã có tham chiếu tập hợp với tên `products`, giờ chỉ việc thiết lập `SecondCategory` của Product tham chiếu ngược về thành phần này bằng thuộc tính `InverseProperty`

```csharp
[Table("Products")]                            // Ánh xạ bảng Product
public class Product
{
    [Key]                                       // Là Primary key
    public int ProductId {set; get;}

    [Required]                                  // Cột trong DB, Not Null
    [StringLength(50)]                          // nvarchar(50)
    public string Name {set; get;}

    [Column(TypeName="Money")]                  // cột kiểu Money trong SQL Server (tương ứng decimal trong Model C#)
    public decimal Price {set; get;}

    // hoặc thêm [Required] khi int?
     public int CategoryId {set; get;}           // Thuộc tính sẽ thiết lập là FK

    [ForeignKey("CategoryId")]
    public virtual Category Category {set; get;}       // Sinh FK (CategoryID ~ Cateogry.CategoryID) ràng buộc đến PK key của Category

    public int? CategorySecondId;
    [ForeignKey("CategorySecondId")]
    [InverseProperty("products")]
    public virtual Category SecondCategory {set; get;}
}
```

Chạy, nhìn thấy câu truy vấn tạo bảng Product như sau

```sql
CREATE TABLE [Products] (
          [ProductId] int NOT NULL IDENTITY,
          [Name] nvarchar(50) NOT NULL,
          [Price] Money NOT NULL,
          [CategoryId] int NOT NULL,
          [CategorySecondId] int NULL,
          CONSTRAINT [PK_Products] PRIMARY KEY ([ProductId]),
          CONSTRAINT [FK_Products_Category_CategoryId] FOREIGN KEY ([CategoryId])
                REFERENCES [Category] ([CategoryId]) ON DELETE CASCADE, 
          CONSTRAINT [FK_Products_Category_CategorySecondId] FOREIGN KEY ([CategorySecondId])
                REFERENCES [Category] ([CategoryId]) ON DELETE NO ACTIONs
```

Nó đã tạo ra bảng có 2 FK, một là CategoryId, một là CategorySecondId cùng tham chiếu đến bảng Category.