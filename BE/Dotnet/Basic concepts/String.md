---
tags: dotnet 
---
### String

- @: /, ""string""
- $: "{var+1}"
- $@: ...
- name.Trim(); => TrimStart, TrimEnd
- Compare, Concat, IndexOf, LastIndexOf, IsNullOrEmpty
- Replace, Insert, Substring(start, count), Remove(start, count), Split(char), Join(char, array)
- StringBuilder => nên dùng vì cho hiệu năng tốt hơn (do dùng vùng đệm thay vì tạo đối tượng mới)
- Append(string)
- Clear: Xoá toàn bộ nội dung (ko xoá đối tượng)
- ToString: StringBuilder => String
- string thuộc kiểu tham chiếu, nhưng các operator và method so sánh được override để giống như kiểu tham trị