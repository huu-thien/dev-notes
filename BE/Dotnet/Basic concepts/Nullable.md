---
tags: dotnet 
---
### Nullable

- `int ? age;`
- Check null: `age != null` or `age.HasValue` or `!(age is null)`(C# 7) or `age is not null` (C# 9)
- Assign: `int _age = age.Value` or `_age = (int)age`
- null-coalescing operator: `int _age = person?.age ?? 18`