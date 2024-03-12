---
tags: dotnet 
---
### Record

- kiểu tham chiếu, từ C# 10 có thêm record class để làm rõ cho kiểu tham chiếu, record struct để tạo record có kiểu tham trị
- immutability: record không được thay đổi trạng thái sau khi khởi tạo (sử dụng init)
- có thể thay init = set để record có thể thay đổi giá trị được
- có thể tạo record mới với các thay đổi bất kì từ record cũ (sử dụng with keyword)
- tự động tạo record với properties, constructor, deconstructor - Positional syntax
    - public record ImmutableAnimal(string Name, string Species);
    - với record và readonly record struct: init-only property
    - record struct: read-write property
- so sánh theo giá trị (sử dụng ==, !=, Equals..)
- 1 record có thể kế thừa từ 1 record khác, không kế thừa từ class và ngược lại
