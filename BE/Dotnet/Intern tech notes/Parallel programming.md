---
tags: dotnet 
---
- [Parallel](../Advance%20concepts/Parallel.md) programming việc thực hiện nhiều công việc song song với nhau, tận dụng sức mạnh từ phần cứng để tăng tốc độ xử lí của chương trình.
- Có 2 dạng là:
    - Data parallelism: thực hiện cùng một hành động lên tập dữ liệu. Mỗi điểm dữ liệu cần xử lí gần như độc lập với các điểm dữ liệu khác.
    - Task parallelism: tương tự, thực hiện một tập các công việc song song với nhau
- Các công việc càng độc lập với nhau thì độ hiệu quả càng cao
- Data parallelism & Task parallelism phần nào đó khá giống nhau, nên có nhiều vấn đề có thể giải quyết theo cách bất kì
- Việc xử lí thường là tác vụ CPU-bound

## Data parallelism

- Sử dụng vòng lặp: `Parallel.For` và `Parallel.ForEach`
    
    ```csharp
    var result = Parallel.For(1, 10, (number, state) =>
    {
        Console.WriteLine($"Print {number} in Thread {Thread.CurrentThread.ManagedThreadId}");
    });
    /*
    Print 2 in Thread 8
    Print 9 in Thread 8
    Print 4 in Thread 10
    Print 5 in Thread 11
    Print 1 in Thread 1
    Print 6 in Thread 12
    Print 7 in Thread 13
    Print 8 in Thread 14
    Print 3 in Thread 9
    */
    ```
    
    ```csharp
    var numbers = new List<int> { 50000, 15000, 8000 };
    var result = new List<double>();
    Parallel.ForEach(numbers, (number) =>
    {
        double sum = 0;
        for (var i = 0; i < number; i++)
        {
            sum += number;
        }
    
        lock (result)
        {
            result.Add(sum);
        }
    });
    foreach(var item in result)
    {
        Console.WriteLine(item);
    }
    /*
    225000000
    2500000000
    64000000
    */
    ```
    
    - vì chạy trên nhiều luồng nên cần [lock](../Advance%20concepts/Lock.md) biến chung trước khi sử dụng biến
    - Để dừng vòng lặp, ta dùng state.
    
    ```csharp
    Parallel.For(1, 100, (number, state) =>
    {
        if (number % 5 == 0)
        {
            state.Stop();
        }
        Console.WriteLine($"Print {number} in Thread {Thread.CurrentThread.ManagedThreadId}");
    });
    /*
    Print 1 in Thread 1
    Print 13 in Thread 7
    Print 37 in Thread 9
    Print 25 in Thread 8
    Print 49 in Thread 10
    Print 61 in Thread 11
    Print 73 in Thread 12
    Print 85 in Thread 13
    */
    ```
    
    - Dùng CancellationToken để cancel vòng lặp
    
    ```csharp
    var cancellationTokenSource = new CancellationTokenSource(TimeSpan.FromSeconds(5));
    var cancellationToken = cancellationTokenSource.Token;
    
    Task.Run(() =>
    {
        Parallel.For(1, 10, new ParallelOptions {CancellationToken = cancellationToken},  (number, state) =>
        {
            Task.Delay(number*1000).Wait();
            Console.WriteLine($"Print {number} in Thread {Thread.CurrentThread.ManagedThreadId}");
        });
    });
    
    if (Console.ReadKey().KeyChar == 'c')
        cancellationTokenSource.Cancel();
    ```
    
    - Xử lí lỗi: bắt nhiều lỗi bằng AggregateException, sau đó ta có thể chọn những lỗi để xử lí và throw những lỗi khác
    
    ```csharp
    var exceptions = new List<Exception>
    {
    new ArgumentException(),
    new ArgumentNullException(),
    new DivideByZeroException(),
    new InvalidOperationException()
    };
    try
    {
        Parallel.ForEach(exceptions, e =>
        {
            Task.Delay(1000).Wait();
            throw e;
        });
    }
    catch (AggregateException ae)
    {
        var ignoredExceptions = new List<Exception>();
        foreach (var ex in ae.Flatten().InnerExceptions)
        {
            if (ex is ArgumentException) Console.WriteLine("Caught Argument Exception");
            else ignoredExceptions.Add(ex);
        }
        if (ignoredExceptions.Count > 0)
        {
            Console.WriteLine("Exceptions left: " + ignoredExceptions.Count);
            //throw new AggregateException(ignoredExceptions);
        }
    }
    ```

## Task parallelism

- Sử dụng Parallel.Invoke để thực thi nhiều hàm song song
    
    ```csharp
    Parallel.Invoke(
        () => PrintMessage("Pretty long message", ConsoleColor.Green, 200),
        () => PrintMessage("Short message", ConsoleColor.Red, 200)
    );
    
    void PrintMessage(string msg, ConsoleColor color, int time)
    {
        for(var i = 0; i < time; i++)
        {
            Console.ForegroundColor = color;
            Console.WriteLine(msg + " on " + Thread.CurrentThread.ManagedThreadId);  
        }
    }
    ```
    
- Parallel.Invoke có thể nhận mảng các Action để chạy

## Parallel LINQ (PLINQ)

- Kết hợp tính đơn giản và thống nhất của cú pháp [](Collection%20&%20LINQ.md#Language%20Integrated%20Query%20(LINQ)%7CLINQ) với hiệu năng của parallel programming
- Vấn có những đặc điểm cơ bản của LINQ như chạy trên [](Collection%20&%20LINQ.md#System.Collections.Generic%7CIEnumerable), [](Collection%20&%20LINQ.md#Execute%20query%7Cdeferred%20execution)
- Sử dụng toàn bộ processor của hệ thống. Nó chia data source thành các đoạn và chia mỗi đoạn đó cho các thread để chạy.

```csharp
var numbers = new List<int> { 50000, 15000, 8000};
var result = numbers.AsParallel().Select(number =>
{
    double sum = 0;
    for (var i = 0; i < number; i++)
    {
        sum += number;
    }
    Task.Delay(1000).Wait();
    return sum;
}).ToList();
```

- Một vài operator mới của PLINQ so với LINQ:
    - `AsParallel`: entry point của PLINQ, chỉ dẫn toàn bộ phần còn lại của câu query cần được chạy song song nếu có thể. Nó chuyển `IEnumerable` thành `ParallelQuery`
    - `AsSequential` : chuyển `ParallelQuery` thành `IEnumerable`
    - `AsOrdered`: đảm bảo rằng kết quả của đầu ra phải đúng thứ tự với kết quả đầu vào
    - `AsUnordered` : kết quả đầu ra không cần đúng thứ tự
    - `ForAll` : thực hiện một hành động trên chuỗi
    - `WithCancellation` : cancel câu query bằng cancellation token
    - `WithDegreeOfParallelism` : số task tối đa có thể chạy song song
- Nếu tác vụ cần thực thi quá đơn giản thì không cần thiết phải dùng Parallel hoặc PLINQ
- PLINQ mặc định sử dụng toàn bộ cores của hệ thống, còn Parallel chủ động điều chỉnh dựa trên tình trạng của CPU
- Parallel programming chỉ thật sự hữu ích đối với CPU-bound tasks