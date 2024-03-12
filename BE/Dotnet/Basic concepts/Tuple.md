---
tags: dotnet 
---
### Tuple

```csharp
(double, int) t1 = (4.5, 3);	// t1.Item1 == 4.5, t1.Item2 == 3

(double Sum, int Count) t2 = (4.5, 3);	// t2.Sum == 4.5, t2.Count == 3

var t3 = (Sum: 4.5, Count: 3);
```

- sử dụng làm kiểu trả về:

```csharp
(int mi, int ma) FindMinMax(int[] a) { var mi = ...; var ma = ...; return (mi, ma);}
(int mi, int ma) FindMinMax(int[] a) { var x = ...; var y = ...; return (mi : x, ma : y);}
```

- C# 7.1: nếu không tường minh thì các tên của tuple có thể được suy ra từ các tên trong đối tượng gán

```csharp
var sum = 4.5; var count = 3; var t = (sum, count);	// t.sum, t.count
var thing = (p.Name), p.Children.Count);	// [thing.Name](%3Chttp://thing.name/%3E), thing.Count
```

- tuple assign: tuân theo các quy tắc sau
    - cả 2 tuple có cùng số lượng phần tử, kiểu của các phần tử phải tương ứng với nhau (cùng kiểu hoặc có thể chuyển kiểu ngầm định)
    - việc gán tuân theo thứ tự của các phần tử, các tên của tuple bị bỏ qua
- tuple deconstruct: phân rã tuple thành các biến độc lập
    - khai báo kiểu cụ thể cho từng biến: `(string a, double b) = ("hello", 2)`
    - khai báo sử dụng từ khóa var bên ngoài: `var (a, b) = ("hello", 2)`
    - sử dụng biến đã tồn tại: `(a, b) = ("hello", 2)`
- C# 7.3: so sánh 2 tuple:
    - điều kiện: cả 2 đều có cùng số phần tử, mỗi phần tử tương ứng có thể so sánh với nhau với == hoặc !=
    - không so sánh theo tên các phần tử của tuple mà so sánh từ trái qua phải
    - sử dụng short-circuit: dừng ngay khi có 2 phần tử không bằng nhau hoặc hết phần tử để so sánh
    - trước khi được so sánh thì các phần tử đã được đánh giá/tính toán qua
- tuple có thể được dùng làm tham số out
- tuple thuộc kiểu tham trị

[Deconstructing types](Deconstructing%20types.md)