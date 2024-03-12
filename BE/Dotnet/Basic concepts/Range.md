---
tags: dotnet 
---
### Range

- là kiểu tham trị sử dụng Index để xác định đầu và cuối của một khoảng (Range)
- sử dụng constructor, static method, C# syntax

```csharp
Range r1 = new(start: new Index(3), end: new Index(7));
Range r2 = new(start: 3, end: 7); // using implicit int conversion
Range r3 = 3..7; // C# 8
Range r4 = Range.StartAt(3);
Range r5 = 3..;
Range r6 = Range.EndAt(3);
Range r7 = ..3;
```

- tạo subarray: int[] subArray1 = someArray[0..2];