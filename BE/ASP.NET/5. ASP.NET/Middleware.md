## Request pipeline & middlewares

- Request pipeline bao gồm một chuỗi các request delegate nối tiếp nhau. Mỗi delegate có thể thực hiện các tác vụ trước và sau khi thực hiện delegate tiếp theo.

![Pasted image 20230729214457](Pasted%20image%2020230729214457.png)

```csharp
public delegate Task RequestDelegate(HttpContext context);
```

- HttpContext chứa các thông tin về url path, cookies, query string,… để các delegate có thể xử lí các request.
    
- Các delegate này gọi là **Middleware,** mỗi Middleware có thể tự quyết định:
    
    - nhận request để xử lí và trả về response (terminal middleware)
    - nhận request để xử lí và chuyển tiếp cho middleware tiếp theo
    - nhận response để xử lí và chuyển tiếp
- Vai trò của middleware:  là trung gian giữa phía client và các business logic của phía web server, giúp xử lý các công việc như xác thực, điều hướng,…
    
- Có thể tạo Middleware bằng các extension methods sau:
    
    - Use: để nối các chuỗi Middleware, có tham số `next` đại diện cho middleware tiếp theo. Nếu không gọi next() thì nó sẽ là terminal middleware
        
        ```csharp
        app.Use(async (context, next) =>
            //xử lý request: 
            await next.Invoke(context);
            //xử lý response: bắt exception và thêm error msg và response
        });
        ```
        
    - Map: để tạo branch trong pipeline dựa vào request path
        
        ```csharp
        app.Map("/map1", async context => {})
        
        //Nesting map
        app.Map("/level1", level1App => {
            level1App.Map("/level2a", level2AApp => {});
            level1App.Map("/level2b", level2BApp => {});
        });
        ```
        
    - Run: không có tham số `next` , để tạo terminal middleware
        
        ```csharp
        app.Run(async context => {
            await context.Response.WriteAsync("This is terminal middleware");
        });
        ```
        
- Tạo convention-based Middleware
    
    - Có public constructor nhận tham số là 1 `RequestDelegate`
        
    - Có public method `Invoke` hoặc `InvokeAsync` nhận tham số đầu tiên là `HttpContext` và kiểu trả về là `Task`
        
        ```csharp
        public class MyMiddleware
        {
        	private readonly RequestDelegate _next;
        	public MyMiddleware(RequestDelegate next)
        	{
        		_next = next;
        	}
        	public async Task InvokeAsync(HttpContext context) 
        	{
        		//logic
        		await _next(context);
        		//logic
        	}
        }
        ```
        
    - Để sử dụng middleware class ta có thể dùng `UseMiddleware<T>`
        
        ```csharp
        app.UseMiddleware<MyMiddleware>();
        ```
        
    - Hoặc tạo một [Extension method](../Basic%20concepts/Extension%20method.md) của `IApplicationBuilder`
        
        ```csharp
        public static class MyMiddlewareExtensions
        {
            public static IApplicationBuilder UseMyMiddleware(
                this IApplicationBuilder builder)
            {
                return builder.UseMiddleware<MyMiddleware>();
            }
        }
        //Program.cs
        app.UseMyMiddleware();
        ```
        
    - Convention-based middleware có lifetime là singleton, nên không thể inject các service có lifetime ngắn hơn vào constructor. Tuy nhiên ta vẫn có thể sử dụng những service này bằng cách truyền vào method Invoke
        
        ```csharp
        public async Task Invoke(HttpContext context, IScopedService scopedService) 
        {
        ...
        }
        ```
        
    - Hoặc dùng đối tượng RequestServices của HttpContext
        
        ```csharp
        public async Task Invoke(HttpContext context) 
        {
        	var scopedService = context.RequestServices.GetService<IScopedService>();
        }
        ```
        
- Factory-based middleware
    
    - được khởi tạo mỗi khi có client request (middleware có thể được đăng ký vào container với lifetime scoped hoặc transient)
    
    ```csharp
    public class FactoryMiddleware : IMiddleware
    {
    		private readonly SampleDbContext _dbContext;
    
        public FactorydMiddleware(SampleDbContext dbContext)
        {
    				_dbContext = dbContext;
    		}
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            var keyValue = context.Request.Query["key"];
    
            if (!string.IsNullOrWhiteSpace(keyValue))
            {
                _dbContext.Requests.Add(new Request("Factory", keyValue));
    
                await _dbContext.SaveChangesAsync();
            }
            await next(context);
        }
    }
    //MiddlewareExtension.cs
    public static class MiddlewareExtensions
    {
        public static IApplicationBuilder UseFactoryMiddleware(
            this IApplicationBuilder app)
            => app.UseMiddleware<FactoryMiddleware>();
    }
    //Program.cs
    builder.Services.AddScoped<FactoryMiddleware>();
    ....
    app.UseFactoryMiddleware();
    ```
    
    - Cách hoạt động: [StackOverFlow](https://stackoverflow.com/questions/52204022/how-to-do-di-in-asp-net-core-middleware)
        
        - UseMiddleware extension methods sẽ kiểm tra xem middleware được đăng ký có implement IMiddleware không?
        - Nếu có thì 1 instance IMiddlewareFactory sẽ được khởi tạo và hàm Create sẽ được gọi
        
        ```csharp
        public Microsoft.AspNetCore.Http.IMiddleware? Create (Type middlewareType);
        ```
        
        - middlewareType sẽ được khởi tạo từ ServiceProvider
        - Nhưng dependency của middlewareType sẽ được lấy ra từ ServiceProvider
- Điểm khác biệt:
    
    - Factory-based middleware:
        - implement `IMiddleware`
        - có thể đăng ký vào service container với lifetime là scoped hoặc transient
        - cho phép scoped service có thể được inject vào constructor
        - Use case: trong trường hợp muốn chia nhỏ method Invoke, vẫn có thể sử dụng các denpendency đã được inject từ constructor
    - Convention-based middleware:
        - không implement class hay interface nào, để runtime biết được cách hoạt động thì phải tuân theo convention
        - có lifetime là singleton → chỉ singleton service được inject vào constructor, các service có lifetime ngắn hơn phải được truyền vào hàm Invoke (được gọi với mỗi request)

## Configure request pipeline
- Sau khi cài đặt xong các services, ta có thể tạo 1 object WebApplication từ builder để cấu hình middleware pipeline và các endpoints
    
    ```csharp
    var app = builder.Build();
    ```
    
    - mặc định thì WebApplication tự động thêm một vài middleware mặc định như sau:
        
        ```csharp
        // nếu HostingEnvironment là "Development"
        if (isDevelopment)
        {
            app.UseDeveloperExceptionPage();
        }
        // nếu UseRouting chưa được gọi và có endpoint được khai báo
        app.UseRouting();
        // nếu UseAuthentication và có IAuthenticationSchemeProvider trong service provider
        if (isAuthenticationConfigured)
            app.UseAuthentication();
        // nếu UseAuthorization và có IAuthorizationHandlerProvider trong service provider
        if (isAuthorizationConfigured)
            app.UseAuthorization();
        
        // user middleware/endpoints
        app.CustomMiddleware(...);
        app.MapGet("/", () => "hello world");
        // end user middleware/endpoints
        // được thêm vào cuối pipeline nếu có endpoint được khai báo
        app.UseEndpoints(e => {});
        ```
        
        - UseRouting: là điểm trên pipeline quyết định routing, nó chọn endpoint thích hợp trong tập các endpoint được định nghĩa trong app
        - UseEndpoints: là điểm thực thi endpoints, tức là nó chạy delegate tương ứng của endpoint được chọn
    - Đôi khi thứ tự mặc định các midddleware không đúng, ta cần khai báo các middleware đúng thứ tự.
        
        - `UserCors` phải được gọi trước `UseAuthentication` và `UseAuthorization` . Ta cần gọi 2 middleware này nếu `UserCors` được gọi
            
            ```csharp
            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();
            ```
            
        - Nếu có middleware phải được gọi trước `UseRouting` thì ta cần gọi `UseRouting`
            
            ```csharp
            app.Use((context, next) =>
            {
                return next(context);
            });
            app.UseRouting();
            ```
            
        - Terminal middleware phải được gọi sau `UseEndpoints` và cần phải gọi cả `UseRouting` và `UseEndpoints` để terminal middleware đúng vị trí
            
            ```csharp
            app.UseRouting();
            app.MapGet("/", () => "hello world");
            app.UseEndpoints(e => {});
            app.Run(context =>
            {
                context.Response.StatusCode = 404;
                return Task.CompletedTask;
            });
            ```
            
    
    ### Một vài built-in middleware
    
    - [Authentication](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-7.0): Provides authentication support.
    - [Authorization](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.builder.authorizationappbuilderextensions.useauthorization): Provides authorization support.
        - Immediately after the Authentication Middleware.
    - [CORS](https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-7.0):
        - Before components that use CORS.
    - [DeveloperExceptionPage](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.diagnostics.developerexceptionpagemiddleware): Generates a page with error information that is intended for use only in the Development environment.
        - Before components that generate errors.
        - The 1st middleware if environment is Development.
    - [](https://learn.microsoft.com/en-us/aspnet/core/security/enforcing-ssl?view=aspnetcore-7.0#require-https): Redirect all HTTP requests to HTTPS.
        - Before components that consume the URL.
    - [Static Files](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/static-files?view=aspnetcore-7.0): Provides support for serving static files and directory browsing.
    - [Endpoint Routing](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/routing?view=aspnetcore-7.0): Defines and constrains request routes.
    - [Forwarded Headers](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/proxy-load-balancer?view=aspnetcore-7.0): Forwards proxied headers onto the current request.
    - MapControllers: Add endpoints for controller actions

## Custom exception handler middleware

- Để tạo 1 global exception handler thống nhất cho cả Development và Production environment
- Hiện thông tin trace route khi development

```csharp
public class CustomExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IWebHostEnvironment _env;
    public CustomExceptionHandlerMiddleware(RequestDelegate next, IWebHostEnvironment env)
    {
        _next = next;
        _env = env;
    }
    public async Task InvokeAsync(HttpContext context) 
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
						// set kiểu trả về là json
            var response = context.Response;
            response.ContentType = "application/json";
						
            response.StatusCode = ex switch
            {
                NotImplementedException => (int)HttpStatusCode.NotImplemented,
                _ => (int)HttpStatusCode.InternalServerError
            };

            var isDevelopment = _env.IsDevelopment();            
            var pd = new ProblemDetails
            {
                Title = isDevelopment ? "An error occured: " + ex.Message : "An error occured",
                Detail = isDevelopment ? ex.StackTrace : null,
                Status = response.StatusCode,
                Type = "<https://tools.ietf.org/html/rfc7231#section-6.6.1>"
            };
            pd.Extensions.Add("traceId", context.TraceIdentifier);
        
            await response.WriteAsync(JsonSerializer.Serialize(pd));
        }
    }
}
```

- tạo extension method để đăng ký middleware vào pipeline

```csharp
public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseCustomExceptionHandlerMiddleware(this IApplicationBuilder app)
    {
        return app.UseMiddleware<CustomExceptionHandlerMiddleware>();
    }   
}
```

- Kết quả ở Development environment:
![Pasted image 20230729222602](attachments/Pasted%20image%2020230729222602.png)

- Kết quả ở Production environment:
![Pasted image 20230729222620](attachments/Pasted%20image%2020230729222620.png)
## Response cache middleware

- Middleware này quyết định response có được cache hay không
- Cache các GET và HEAD request
- Chỉ cache khi response là 200 OK
- Kết hợp với [ResponseCache] để cài đặt các tham số cho các controller
    - _Duration_: set thời gian lưu cache response
    - _Location_: được chuyển thành các giá trị của Cache-Control header tương ứng public, private và no-cache.
        - `ResponseCacheLocation.Any` : client và server được cache
        - `ResponseCacheLocation.Client` : chỉ client
        - `ResponseCacheLocation.None` : client không được dùng cache response mà không validate lại từ server
    - _VaryByQueryKeys_: các response được cache dựa vào query string parameters.
    - _VaryByHeader_: set Vary HTTP response header.
    - _NoStore_: bảo phía client không nên cache response (`no-store`)

```csharp
builder.Services.AddResponseCaching();
// ...
app.UseAuthorization();
**app.UseResponseCaching();**
app.MapControllers();
```

```csharp
[ResponseCache(Duration = 10, Location = ResponseCacheLocation.Any)]
public async Task<IEnumerable<WeatherForecast>> ResponseCache()
{
//...
}
```