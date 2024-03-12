---
tags: dotnet 
---
### Deconstructing types

- tuple không phải là type duy nhất có thể deconstruct, bất cứ kiểu dữ liệu nào có method Deconstruct đều có thể bị phân rã:
    - `public void Deconstruct(out string name, out int age) {name = Name; age = Age;}`
    - `var (name1, age1) = obj;`