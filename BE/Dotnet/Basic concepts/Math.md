---
tags: dotnet 
---
### Math

- Max, Min, Abs, Sign
- Sin, Cos, Tan, ASin, Acos, Atan => rad
- Sqrt, Pow, Log, Log10
- Round, Ceiling, Floor, Truncate (cắt phần thập phân)
- có thể thay đổi cách làm tròn: Math.Round(value: n, digits: 0, mode: MidpointRounding.AwayFromZero));

### Complex

`Complex c1 = new (real: 4, imaginary: 2)`

### Rounding rules (Banker's Rounding)

```
ToInt32(9.49) is 9 
ToInt32(9.5) is 10 
ToInt32(9.51) is 10 
ToInt32(10.49) is 10 
ToInt32(10.5) is 10 
ToInt32(10.51) is 11
```

- làm tròn lên nếu phần thập phân lớn hơn .5, xuống nếu nhỏ hơn .5
- làm tròn lên nếu phần thập phân bằng .5 và phần không thập phân là số lẻ
- có thể thay đổi cách làm tròn: Math.Round(value: n, digits: 0, mode: MidpointRounding.AwayFromZero));