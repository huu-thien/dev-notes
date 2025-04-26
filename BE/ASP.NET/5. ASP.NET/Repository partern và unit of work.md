![REPOSITORY PATERN VÀ UNIT OF WORK](42213219384_ec3b0b1b3e_o.png)

[Tham khảo blog](https://coding4food.net/2018/07/10/repository-va-unit-of-work-pattern/)
[Viblo](https://viblo.asia/p/repository-pattern-va-unit-of-work-voi-entity-framework-trong-aspnet-mvc-PjxMe6VDG4YL)

## Repository partern
Pattern Repository trong ASP.NET là một mẫu thiết kế phổ biến được sử dụng để tách lớp dữ liệu khỏi lớp logic kinh doanh (business logic). Mục tiêu của mẫu thiết kế này là tạo ra một lớp trung gian (repository) giữa ứng dụng và nguồn dữ liệu (database, file system, web service, etc.). Điều này giúp cho việc thao tác với dữ liệu trở nên linh hoạt, dễ bảo trì và dễ mở rộng.

Dưới đây là một số thành phần chính của mẫu thiết kế Repository:

1. **Repository Interface**: Định nghĩa các phương thức để truy cập và thao tác dữ liệu. Interface này cung cấp một tập hợp các phương thức chung mà các lớp thực thi phải triển khai.
    
2. **Repository Class**: Lớp thực thi Interface Repository. Nó cung cấp cài đặt thực tế cho các phương thức được định nghĩa trong Interface. Trong lớp này, các truy vấn dữ liệu cụ thể sẽ được thực hiện.
    
3. **Unit of Work**: Đây là một thành phần quản lý việc thực hiện các giao dịch trên dữ liệu. Unit of Work có thể bao gồm một hoặc nhiều Repository và đảm bảo rằng mọi thay đổi trong dữ liệu được thực hiện an toàn và có thể quản lý được.
    

Lợi ích của việc sử dụng mẫu thiết kế Repository trong ASP.NET bao gồm:

- **Tách biệt lớp dữ liệu và logic kinh doanh**: Điều này giúp làm cho mã của bạn trở nên dễ bảo trì hơn bằng cách tách biệt các phần của ứng dụng thành các phần độc lập.
    
- **Tính linh hoạt và tái sử dụng**: Bạn có thể dễ dàng thay đổi cách bạn truy cập dữ liệu mà không cần thay đổi quá nhiều mã trong logic kinh doanh của bạn.
    
- **Kiểm soát giao dịch (Transaction Control)**: Bằng cách sử dụng Unit of Work, bạn có thể quản lý các giao dịch dữ liệu một cách hiệu quả, đảm bảo tính nhất quán của dữ liệu.
    

Kết luận, mẫu thiết kế Repository là một trong những công cụ quan trọng giúp bạn tổ chức mã nguồn của mình một cách sạch sẽ, dễ bảo trì và dễ mở rộng trong các dự án ASP.NET.

## Unit of work 
Unit of Work là một mẫu thiết kế trong lập trình phần mềm, thường được sử dụng cùng với Pattern Repository, nhằm quản lý các giao dịch trên dữ liệu. Mục tiêu chính của Unit of Work là đảm bảo tính nhất quán của các thay đổi dữ liệu và kiểm soát quá trình ghi dữ liệu vào nguồn dữ liệu (database, file system, web service, etc.).

Dưới đây là một số điểm quan trọng về Unit of Work:

1. **Quản lý giao dịch**: Unit of Work đảm bảo rằng các thao tác trên dữ liệu được thực hiện một cách an toàn trong một giao dịch. Nó cho phép bạn bắt đầu, thực hiện và commit hoặc rollback các giao dịch một cách tự nhiên và linh hoạt.
    
2. **Tính nhất quán của dữ liệu**: Bằng cách sử dụng Unit of Work, bạn có thể đảm bảo rằng tất cả các thay đổi dữ liệu trong một giao dịch sẽ được áp dụng hoặc không được áp dụng một cách nhất quán. Điều này ngăn chặn việc dữ liệu bị trạng thái không nhất quán do một số thay đổi được lưu trữ trong giao dịch, nhưng một số thay đổi khác không.
    
3. **Phân chia và tái sử dụng mã**: Unit of Work giúp phân chia mã của bạn thành các phần nhỏ hơn, dễ bảo trì và tái sử dụng hơn. Bạn có thể tập trung vào việc triển khai các phương thức để quản lý giao dịch trong một nơi duy nhất, thay vì phải lặp lại mã kiểm soát giao dịch trong từng phương thức.
    
4. **Tích hợp với Repository Pattern**: Unit of Work thường được sử dụng cùng với Pattern Repository. Repository sẽ thực hiện các thao tác trên dữ liệu, trong khi Unit of Work sẽ quản lý các giao dịch xung quanh việc sử dụng các Repository.
    

Khi sử dụng Unit of Work, việc thực hiện các giao dịch trở nên dễ dàng và an toàn hơn, giúp tăng tính nhất quán và tin cậy của hệ thống của bạn.

## Ví dụ
Dưới đây là một ví dụ về cách bạn có thể sử dụng Unit of Work cùng với Pattern Repository trong một ứng dụng ASP.NET MVC:

Giả sử bạn có một ứng dụng quản lý sản phẩm. Bạn muốn thực hiện các thao tác CRUD (Create, Read, Update, Delete) trên bảng sản phẩm trong cơ sở dữ liệu. Đầu tiên, bạn cần tạo các Repository để tương tác với dữ liệu và một Unit of Work để quản lý giao dịch.

Định nghĩa Interface cho Repository:
```csharp
public interface IProductRepository
{
    Product GetProductById(int productId);
    IEnumerable<Product> GetAllProducts();
    void AddProduct(Product product);
    void UpdateProduct(Product product);
    void DeleteProduct(int productId);
}
```
``
Triển khai Repository:
```csharp
public class ProductRepository : IProductRepository
{
    private readonly YourDbContext _dbContext;

    public ProductRepository(YourDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Product GetProductById(int productId)
    {
        return _dbContext.Products.Find(productId);
    }

    public IEnumerable<Product> GetAllProducts()
    {
        return _dbContext.Products.ToList();
    }

    public void AddProduct(Product product)
    {
        _dbContext.Products.Add(product);
    }

    public void UpdateProduct(Product product)
    {
        _dbContext.Entry(product).State = EntityState.Modified;
    }

    public void DeleteProduct(int productId)
    {
        var product = _dbContext.Products.Find(productId);
        if (product != null)
            _dbContext.Products.Remove(product);
    }
}

```

Định nghĩa Interface cho Unit of Work:

```csharp
public interface IUnitOfWork : IDisposable
{
    IProductRepository Products { get; }
    void Save();
}

```

Triển khai Unit of Work:
```csharp
public class UnitOfWork : IUnitOfWork
{
    private readonly YourDbContext _dbContext;

    public UnitOfWork(YourDbContext dbContext)
    {
        _dbContext = dbContext;
        Products = new ProductRepository(_dbContext);
    }

    public IProductRepository Products { get; }

    public void Save()
    {
        _dbContext.SaveChanges();
    }

    public void Dispose()
    {
        _dbContext.Dispose();
    }
}

```

Trong Controller, bạn có thể sử dụng Unit of Work để thực hiện các thao tác trên sản phẩm:

```csharp
public class ProductController : Controller
{
    private readonly IUnitOfWork _unitOfWork;

    public ProductController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    // Action để hiển thị danh sách sản phẩm
    public IActionResult Index()
    {
        var products = _unitOfWork.Products.GetAllProducts();
        return View(products);
    }

    // Action để thêm mới sản phẩm
    [HttpPost]
    public IActionResult Add(Product product)
    {
        if (ModelState.IsValid)
        {
            _unitOfWork.Products.AddProduct(product);
            _unitOfWork.Save();
            return RedirectToAction("Index");
        }
        return View(product);
    }

    // Các action khác như Update, Delete cũng được triển khai tương tự
}

```

Đảm bảo rằng bạn đã đăng ký các dịch vụ (services) trong ConfigureServices() method của file Startup.cs để Dependency Injection hoạt động.