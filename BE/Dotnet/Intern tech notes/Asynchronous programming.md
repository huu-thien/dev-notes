---
tags: dotnet 
---
## Synchronous & Asynchronous

- Thông thường các câu lệnh được thực hiện tuần tự từ trên xuống dưới
    ![Pasted image 20230729220811](Pasted%20image%2020230729220811.png)
    
- Bất đồng bộ: các công việc có thể thực hiện đồng thời
    ![Pasted image 20230729220824](Pasted%20image%2020230729220824.png)

- Các patterns:
    - **Task-based Asynchronous Pattern (TAP)**
    - **Event-based Asynchronous Pattern (EAP)**
    - **Asynchronous Programming Model (APM)**

## Task-based asynchronous pattern (TAP)

- 1 [Task](Task.md) đại diện cho 1 công việc có thể thực hiện một cách bất đồng bộ trên các thread của threadpool. Task có một vài trạng thái như: `Created`, `Running`, `RanToCompleted`, `Canceled`, `Faulted`…
    
    ```csharp
    Console.WriteLine($"Main: Running on Thread {Thread.CurrentThread.ManagedThreadId}");
    Task task = new(ExampleMethod);
    task.Start();
    
    // Task.Factory.StartNew(ExampleMethod);
    // Task.Run(ExampleMethod);
    
    //task.Wait();
    Console.WriteLine($"Main: Completed on Thread {Thread.CurrentThread.ManagedThreadId}");
    
    void ExampleMethod()
    {
        Console.WriteLine($"ExampleMethod: Running on Thread {Thread.CurrentThread.ManagedThreadId}");
        for (var i = 0; i <= 7; i++)
        {
            Console.WriteLine(i);
            Task.Delay(20).Wait();
        }
        Console.WriteLine($"ExampleMethod: Completed on Thread {Thread.CurrentThread.ManagedThreadId}");
    }
    ```
    
- Hàm Wait, WaitAll, WaitAny sẽ block thread hiện tại cho đến khi task được hoàn thành
    
## [Async & await](Async%20&%20await.md)

```csharp
// See <https://aka.ms/new-console-template> for more information

Console.WriteLine("Main: Running on Thread " + Thread.CurrentThread.ManagedThreadId);

// var task = Task.Run(TaskMethod);
// task.Wait();

Console.WriteLine();

await AsyncMethod();

Console.WriteLine("Main: Completed on Thread " + Thread.CurrentThread.ManagedThreadId);

async Task AsyncMethod()
{
    Console.WriteLine("AsyncMethod: Running on Thread " + Thread.CurrentThread.ManagedThreadId);
    await Task.Delay(1000);
    Console.WriteLine("AsyncMethod: Current Thread " + Thread.CurrentThread.ManagedThreadId);
    Console.WriteLine("AsyncMethod: Completed on Thread " + Thread.CurrentThread.ManagedThreadId);
}

void TaskMethod()
{
    Console.WriteLine("TaskMethod: Running on Thread " + Thread.CurrentThread.ManagedThreadId);
    var task = Task.Delay(1000);
    task.Wait();
    Console.WriteLine("TaskMethod: Current Thread " + Thread.CurrentThread.ManagedThreadId);
    Console.WriteLine("TaskMethod: Completed on Thread " + Thread.CurrentThread.ManagedThreadId);
}
```

- `async` keyword để khai báo 1 async method, sẽ cho phép hàm đó có thể dùng `await` keyword. Async method phải có kiểu trả về là:
    - `Task`
    - `Task<T>`
    - void: chỉ cho event handler
    - Các kiểu có method GetAwaiter như ValueTask
- `await` keyword: được sử dụng trên 1 awaitable (`Task, Task<T>, ValueTask, IAsyncEnumerable<T>`…)
    - khi `await` thì luồng xử lí được trả về cho hàm gọi nó. Hàm xử lí có thể thực hiện các công việc khác hoặc gọi `await` trên đối tượng Task được trả về để chờ công việc được hoàn thành.

## Xử lí lỗi với async/await

- Exception sẽ được lưu trong đối tượng task và sẽ được throw khi ta await trên Task đó. Sử dụng try catch để bắt lỗi như bình thường
    
    ```csharp
    try
    {
        Task task = ThrowExceptionAsync();
        await task;
    }
    catch (Exception e)
    {
        Console.WriteLine(e.Message);
    }
    
    Console.WriteLine("End program");
    
    Task ThrowExceptionAsync()
    {
        return Task.FromException<Exception>(new Exception("This is an exception!"));
    }
    ```

## Xử lí nhiều Task

```csharp
var task1 = Task.FromResult("Hello");
var task2 = Task.FromResult("World");

var result = await Task.WhenAll(task1, task2);

foreach(var item in result)
{
    Console.WriteLine(item);
}
//Hello
//World
```

- Tất cả các lỗi phát sinh từ WhenAll sẽ được lưu trong Task trả về. Nhưng khi await Task này thì chỉ exception đầu tiên được throw.
- Để hiển thị tất cả các lỗi ta lấy đối tượng Exception từ Task trả về

```csharp
var task1 = Task.FromResult("Hello");
var task2 = Task.FromResult("World");

var task3 = await Task.WhenAny(task1, task2);

await task3;

Console.WriteLine(task3.Result);
```

- Đối với WhenAny thì Task trả về không bao giờ lỗi hoặc bị cancel. Khi task1 hoặc task2 bị lỗi thì nó không được ném ra. Vì vậy phải await Task trả về để bắt lỗi
- Để tránh tốn tài nguyên thì nên khi có Task hoàn thành cần cancel tất cả các task còn lại