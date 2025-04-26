- Những code khởi tạo dự án được chứa trong file Program.cs
    - Cài đặt những Services
    - Tạo request pipeline

```csharp
//tạo đối tượng WebApplicationBuilder
var builder = WebApplication.CreateBuilder(args);
//Cài đặt những Services
...
builder.Services.AddDbContext<DBContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBContext"));
});
builder.Services.AddScoped<IMyDependency, MyDependency>();
...
//build WebApplication để cấu hình HTTP pipeline, routes
var app = builder.Build();

//Tạo request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.Run();
```

## Config Services

-  Thường sử dụng 2 objects của builder là
    - Configuration: chứa những giá trị từ appsettings.json, các biến env, các tham số cli…
    - Services: là 1 DI container chứa các services
- Mục đích của việc đăng ký các Service thông qua DI: để các module không bị phụ thuộc lẫn nhau, khi 1 Service thay đổi implementation thì các module gọi nó không bị ảnh hưởng vì interface không đổi.

- Có 3 dạng DI: Constructor injection, Setter injection, Interface injection, các Services sẽ được đăng ký và sử dụng thông qua Constructor injection

- Khi một class sử dụng Service được đăng ký, .NET sẽ khởi tạo đối tượng của class đó kèm theo đối tượng Service vào constructor, tùy theo lifetime của Service đã đăng ký:
    - Transient: tạo đối tượng mới với mỗi lần gọi
    - Scoped: tạo đối tượng mới với mỗi request, (vd trong 1 HTTP request thì các đối tượng sẽ giống nhau)
    - Singleton: tạo đối tượng khi lần đầu được gọi và không khởi tạo lại

```csharp
public class LoggingMessageWriter : IMessageWriter
{
    private readonly ILogger<LoggingMessageWriter> _logger;

    public LoggingMessageWriter(ILogger<LoggingMessageWriter> logger) =>
        _logger = logger;

    public void Write(string message) =>
        _logger.LogInformation("Info: {Msg}", message);
}
```

- _Lưu ý: không nên sử dụng service có lifetime ngắn hơn ở trong service có lifetime dài hơn, có thể dẫn đến kết quả sai._
- Có thể tách phần config services ra file riêng, sử dụng extension method cho kiểu IServiceCollection

```csharp
public static class ServiceExtension
{
	public static void AddServices(this IServiceCollection services)
	{
	        services.AddScoped<IMyService, MyService>();
	}
}	
//Program.cs
builder.Services.AddServices();
```

## Tạo [](be/asp.net/5.%20ASP.NET/Middleware.md#Request%20pipeline%20&%20middlewares|Request%20pipeline)