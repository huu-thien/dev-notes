---
tags: dotnet 
---
### Index

- là kiểu tham trị để tường minh việc xác định vị trí, hỗ trợ việc đếm từ cuối lên

```csharp
Index i1 = new(value: 3);
Index i2 = 3; // using implicit int conversion operator
Index i3 = new(value: 5, fromEnd: true);
Index i4 = ^5; // using the caret operator
```

- có thể sử dụng như: int value = arr[^1]: lấy ptu cuối của arr