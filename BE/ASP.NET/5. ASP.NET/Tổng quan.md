- Khi khởi động thì [ASP.NET](http://ASP.NET) sẽ build 1 đối tượng host, đóng gói toàn bộ các tài nguyên của app:
    - implement 1 HTTP server
    - các middleware
    - logging
    - dependency injection services
    - configuration
- Có 3 dạng host:
    - [ASP.NET](http://ASP.NET) Core WebApplication aka Minimal Host
    - .NET Generic Host
    - [ASP.NET](http://ASP.NET) Core WebHost: for backward compatibility

## WebApplication & WebApplicationBuilder

- Đầu tiên, ta tạo một đối tượng WebApplicationBuilder
    
    ```csharp
    var builder = WebApplication.CreateBuilder(args);
    ```
    
- Các API của WebApplicationBuilder
    
    - `IWebHostEnvironment Environment` : Dùng để lấy các thông tin về hosting environment:
        
        ```csharp
        var builder = WebApplication.CreateBuilder(new WebApplicationOptions
        {
            Args = args,
            EnvironmentName = Environments.Staging,
        });
        Console.WriteLine($"Application Name: {builder.Environment.ApplicationName}");
        Console.WriteLine($"Environment Name: {builder.Environment.EnvironmentName}");
        Console.WriteLine($"ContentRoot Path: {builder.Environment.ContentRootPath}");
        
        var app = builder.Build();
        app.MapGet("/", () => "Hello World!");
        app.Run();
        
        /*
        Application Name: HostingExample
        Environment Name: Development
        ContentRoot Path: /home/pp311/Hoc/HostingExample/HostingExample
        */
        ```
        
        - [ASP.NET](http://ASP.NET) đọc các file config và các env var để quyết định Environment name: từ DOTNET_ENVIRONMENT hoặc ASPNETCORE_ENVIRONMENT
    - `ConfigurationManager Configuration` : để lấy các configuration value từ nhiều nguồn như: appsettings.json, environment variables, cli
        
        - Dựa vào Environment name (Development, Staging, Production) mà file appsettings tương ứng (vd: appsettings.Development.json) sẽ được ghi đè lên file appsettings.json
        
        ```csharp
        // appsettings.json
        {
          "Logging": {
            "LogLevel": {
              "Default": "Information",
              "Microsoft.AspNetCore": "Warning"
            }
          },
          "Test": "TestValueInDevelopment"
        }
        
        // Program.cs
        Console.WriteLine($"Test: {builder.Configuration.GetSection("Test").Value}");
        Console.WriteLine($"Test: {builder.Configuration["Test"]}");
        Console.WriteLine($"Test: {builder.Configuration.GetValue<string>("Test")}");
        /*
        Test: TestValueInDevelopment
        Test: TestValueInDevelopment
        Test: TestValueInDevelopment
        */
        ```
        
        - Ta cũng có thể thêm những nguồn khác vào configuration:
        
        ```csharp
        // othersettings.json
        {
          "OtherSetting": "This is a text from othersettings.json"
        }
        builder.Configuration.AddJsonFile("othersettings.json");
        Console.WriteLine($"OtherSetting: {builder.Configuration.GetSection("OtherSetting").Value}");
        ```
        
        - Thứ tự ưu tiên của các nguồn configuration:
            - Command-line arguments
            - Non-prefixed environment variables
            - [User secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-7.0) when the app runs in the `Development` environment
            - `appsettings.{Environment}.json`
            - `appsettings.json`
            - `DOTNET_` and `ASPNETCORE_` environment variables
        - Đối với các nguồn khác thì nguồn được khai báo sau sẽ ghi đè lên các nguồn trước
    - `IServiceCollection Services` : Để đăng ký các service vào DI container.
        
    - `ILoggingBuilder Logging` : sử dụng để đăng ký logging provider
        
        ```csharp
        var builder = WebApplication.CreateBuilder(args);
        
        // Configure JSON logging to the console.
        builder.Logging.AddJsonConsole();
        
        var app = builder.Build();
        app.MapGet("/", () => "Hello JSON console!");
        app.Run();
        ```
    
- Sau khi đã cấu hình và cài đặt các service, ta sẽ cấu hình cho request pipeline: [](be/asp.net/5.%20ASP.NET/Middleware.md#Configure%20request%20pipeline|link) 