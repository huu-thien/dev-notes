---
tags: dotnet 
---
### foreach

- để sử dụng foreach thì đối tượng sử dụng phải có type có các yêu cầu sau:
    - có method GetEnumerator trả về 1 object
    - object trả về phải có property Current và method MoveNext
    - method MoveNext phải thay đổi giá trị của Current và trả về true nếu còn item để duyệt qua
- `IEnumerable` & `IEnumerable<T>` được tạo ra để định nghĩa những yêu cầu trên, nhưng compiler không bắt buộc phải implement các interface này