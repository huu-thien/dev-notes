---
tags: aspnet 
---
- Logging trong .Net có API giúp ta có thể dễ dàng kiểm soát các logging provider. Các logging provider quyết định log sẽ được ghi vào đâu.
- Các built-in logging provider
    - Console
    - Debug
    - EventSource
    - EventLog (Windows only)

## Configure logging

- logging configuration thường được đặt trong các file appsettings.json
    
    ```json
    "Logging": {
        "LogLevel": {
          "Default": "Information",
          "Microsoft.AspNetCore": "Warning"
        }
    ```
    
    - config cho Default và Microsoft.AspNetCore category
    - tất cả category bắt đầu với Microsoft.AspNetCore sẽ có loglevel là “Warning” và cao hơn
- Log level:
    
    - `Trace` = 0
    - `Debug` = 1
    - `Information` = 2
    - `Warning` = 3
    - `Error` = 4
    - `Critical` = 5
    - `None` = 6
- Log level mặc định là Infomation
    
- Ta có thể config cho từng provider và override các non-provider config
    
    ```csharp
    "Debug": { // Debug provider.
          "LogLevel": {
            "Default": "Information", // Overrides preceding LogLevel:Default setting.
            "Microsoft.Hosting": "Trace" // Debug:Microsoft.Hosting category.
          }
        },
    ```
    
- Tất cả các log dưới loglevel đã cài đặt thì không được truyền đến provider → không được ghi lại hoặc hiển thị
    
- Có thể config logging bằng env var, cli…
    
    ```csharp
    echo export Logging__LogLevel__Microsoft="Information" >> ~/.bashrc && source ~/.bashrc
    echo $Logging__LogLevel__Microsoft
    ```
    

## Log category

- Khi tạo 1 ILogger instance thì cần chỉ định rõ 1 _category, category_ này sẽ được đính kèm vào các log message mà đối tượng ILogger này tạo ra
- Theo convention thì category là tên class
- [ASP.NET](http://ASP.NET) thường dùng kiểu `ILogger<T>` để tạo 1 instance ILogger với category là T, sử dụng thông qua DI
- Hoặc gọi CreateLogger(string categoryName) trên 1 instance LoggerFactory

## Log event ID

- Mỗi log có thể đi kèm 1 eventID giúp dễ phân loại log hơn
    
    ```csharp
    public class LogEventConst
    {
        public const int GenerateItems = 1000;
        public const int ListItems     = 1001;
        public const int GetItem       = 1002;
        public const int InsertItem    = 1003;
        public const int UpdateItem    = 1004;
        public const int DeleteItem    = 1005;
    }
    
    //
    _logger.LogInformation(LogEventConst.GetItem, "This is log message from WeatherForecast");
    
    /*
    info: WebApiExample.Controllers.WeatherForecastController[1002]
    This is log message from WeatherForecast
    ```
    

## Filter function

- Filter function dùng để lọc các log theo provider, category và log level
    
    ```csharp
    builder.Logging.AddFilter((provider, category, logLevel) =>
    {
        if (provider.Contains("ConsoleLoggerProvider")
            && category.Contains("Controller")
            && logLevel >= LogLevel.Warning)
        {
            return true;
        }
        return false;
    });
    ```
    
- Cú pháp ngắn gọn hơn
    
    ```csharp
    builder.Logging.AddFilter("System", LogLevel.Debug);
    
    builder.Logging.AddFilter<DebugLoggerProvider>("Microsoft", LogLevel.Information);
    ```
    

## ILogger, ILoggerProvider & ILoggerFactory

- ILogger: dùng để ghi log ra với loglevel cụ thể
    
    ```csharp
    public interface ILogger
    {
        void Log<TState>(LogLevel logLevel, EventId eventId, TState state, 
    				Exception exception, Func<TState, Exception, string> formatter);
    
        bool IsEnabled(LogLevel logLevel);
    
        IDisposable BeginScope<TState>(TState state);
    }
    ```
    
- ILoggerProvider: các logging provider implement interface này để có thể ghi log vào nơi cụ thể của logging provider đó (tạo ILogger instances cho một logging system cụ thể)
    
    ```csharp
    public interface ILoggerProvider : IDisposable
    {
        ILogger CreateLogger(string categoryName);
    }
    ```
    
    - các ILogger instances không được dùng trực tiếp. Muốn lấy ra ILogger instance ta dùng ILoggerFactory hoặc thông qua DI
- ILoggerFactory: dùng để tạo các instance của ILogger và để đăng ký các logging provider
    
    ```csharp
    public interface ILoggerFactory : IDisposable
    {
        ILogger CreateLogger(string categoryName);
        void AddProvider(ILoggerProvider provider);
    }
    ```
    
    - Tạo quan hệ 1 - N giữa ILogger và ILoggerProvider. Khi LoggerFactory gọi CreateLogger thì nó sẽ gọi CreateLogger của các provider đã đăng ký.
    - Logger được tạo sẽ giữ 1 mảng các ILogger tương ứng. Do đó khi gọi Log() thì nó sẽ ghi log ra các nơi đã đăng ký

## Sử dụng 3rd-party logging provider (Serilog)

- Cài Serilog.AspNetCore từ Nuget
    ![Pasted image 20230729223321](Pasted%20image%2020230729223321.png)
    
- Config serilog trong appsettings.json
    
    ```json
    "Serilog": {
        "MinimumLevel": "Information",
        "WriteTo": [
          {
            "Name": "File",
            "Args": {
              "path": "AppLogs.txt"
            }
          }
        ]
      }
    ```
    
- Add serilog logging provider vào app
    
    ```csharp
    var logger = new LoggerConfiguration().ReadFrom.Configuration(builder.Configuration).CreateLogger();
    builder.Logging.AddSerilog(logger);
    ```
    
- Kết quả trong file AppLogs.txt
    ![Pasted image 20230729223337](Pasted%20image%2020230729223337.png)