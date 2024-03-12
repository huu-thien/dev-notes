---
tags: aspnet 
---
- Code có thể tạo ra các log để ghi lại các sự kiện xảy ra khi chạy. Giúp ta hiểu rõ hành vi của chương trình. Cả Logging và Tracing sử dụng kỹ thuật này:
    - [Logging](Logging.md): dùng để ghi lại những thông tin chung, để xem lại những hành động đã xảy ra trong quá khứ của chương trình. Do đó logging phải luôn được chạy và tốn ít tài nguyên
    - Tracing: Đưa ra thông tin chi tiết hơn logging, giúp ta khoanh vùng khi sửa lỗi hay phát hiện đoạn code tối ưu kém. Tracing cho ta thông tin về luồng xử lý của chương trình

## Logging APIs

- Logging APIs có thể có cấu trúc hoặc không:
    - Unstructured: các đoạn text không tuân theo form nào
    - Structured: tuân theo các mẫu định sẵn, giúp máy có thể truy vấn dễ dàng hơn
- Các logging APIs cho phép các log message được ghi vào nhiều nơi khác nhau gọi là **Sink** (console, json, txt, db…)
- Một số logging APIs .Net cung cấp:
    - ILogger: hỗ trợ cấu hình linh hoạt (code, appsettings.json), structured logging, hỗ trợ một vài sink phổ biến như console và các logging provider khác như Nlog, Serilog…
    - EventSource: tracing API with structured logging
    - Trace: [System.Diagnostics.Trace](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.trace) và [System.Diagnostics.Debug](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.debug)

## Distributed tracing

- là một kỹ thuật giúp ta khoanh vùng các lỗi và các vấn đề về hiệu năng. Đặc biệt là ở trong một hệ thống phân tán
    
- mỗi khi nhận 1 request thì đó được gán với 1 trace. Mỗi công việc trong 1 trace là instance của [System.Diagnostics.Activity](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.activity) và cả trace đó tạo thành 1 cây các Activity (span).
    
- Activity đầu tiên được tạo là gốc của cây, có thể track thời gian thực thi và kết quả của request
    
- Các activity con có thể được tạo để chia công việc thành nhiều bước và có thể được track một cách độc lập
    ![Pasted image 20230729223432](attachments/Pasted%20image%2020230729223432.png)
    
- Mỗi trace có 1 traceId và mỗi activity lưu traceId, spanId và parentSpanId
    

## Distributed tracing instrumentation

- Là quá trình thêm những đoạn code vào ứng dụng để có thể tạo ra tracing data. Cho ta cái nhìn tổng quan về quá trình xử lí request của hệ thống
    
- .Net có các API của **System.Diagnostics.Activity** để ta có thể làm điều này. Nhưng để dễ dàng hơn ta có thể thêm các custom distributed tracing instrumentation.
    
- Để tạo tracing data, OpenTelemetry là một lựa chọn phổ biến
    
- Auto instrumentation
    
    - OpenTelemetry hỗ trợ tự động thu thập tất cả các Activity được tạo ra bởi [ASP.NET](http://ASP.NET) server.
        ![Pasted image 20230729223501](attachments/Pasted%20image%2020230729223501.png)
        
- Cấu hình:
    
    ```csharp
    builder.Services.AddOpenTelemetry()
    .WithTracing(builder =>
    {
        builder.AddAspNetCoreInstrumentation()
                .AddConsoleExporter();
    });
    ```
    ![Pasted image 20230729223555](attachments/Pasted%20image%2020230729223555.png)
    
- Manual instrumentation
    
    - Ta cũng có thể tự tạo các activity để theo dõi, như ở đây ta ngoài activity được tạo bởi server, ta tạo thêm 1 activity con. Khi truy cập đến endpoint TracingTest, nó sẽ gọi hàm Test và tạo ra activity con này
        ![Pasted image 20230729223618](attachments/Pasted%20image%2020230729223618.png)
        
        ```csharp
        builder.Services.AddOpenTelemetry()
            .WithTracing(builder =>
            {
                builder.AddAspNetCoreInstrumentation()
                        .AddSource("TracingTestController")
                        .AddConsoleExporter();
            });
        ```
        
	- Activity cha
        ![Pasted image 20230729223634](attachments/Pasted%20image%2020230729223634.png)
        
	- Activity con
        ![Pasted image 20230729223644](attachments/Pasted%20image%2020230729223644.png)