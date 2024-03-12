---
tags: dotnet 
---
### Task

- khởi tạo

```csharp
Task t1 = new(method)
Task t2 = Task.Factory.StartNew(method)
Task t3 = Task.Run(method)
```

- nếu task có kiểu trả về thì dùng `Task<T>(myfunc)`
- để tạo task cần tham số là delegate: new Task(myfunc, object) //object là đối tượng tham số truyền cho delegate myfunc (action/func)
- Start: gọi 2 lần start trên cùng 1 task sẽ gây lỗi
- Wait, WaitAll, WaitAny: block thread hiện tại đến khi Task hoàn thành
- ContinueWith: tương tự Promise.then() của JS
- child task: là nested task phải được hoàn thành trước khi parent task có thể hoàn thành
- nếu hàm có kiểu trả về là `Task` (khác `Task<T>`) thì có thể return Task.CompletedTask
- nếu hàm trả về task nhưng giá trị trả về không phải là task, có thể gói nó bằng task:
    - `FromResult<TResult>(TResult)`
    - `FromException<TResult>(Exception)`
    - `FromCanceled<TResult>(CancellationToken)`