---
tags: dotnet 
---
### lock

- C# compiler thay lock thành câu lệnh try-finally, sử dụng Monitor.Enter khi bắt đầu công việc và Monitor.Exit khi hoàn thành --> dễ dẫn đến deadlock
- để tránh deadlock cần sử dụng Monitor.TryEnter thay cho lock