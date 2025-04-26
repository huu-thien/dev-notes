---
tags: dotnet 
---
### Parallel

- Parallel.For(start, end, task)
    - task là delegate kiểu `Action<int>` (tham số là index)
    - tất cả các action phải hoàn thành thì vòng lớp mới hoàn thành => block thread => cần dùng async
- Parallel.ForEach(source, Runtask): source là 1 collection, action có tham số có kiểu giống phần tử của source
- Parallel.Invoke: chạy song song nhiều action

- Xem các ví dụ: [Parallel programming](Parallel%20programming.md)