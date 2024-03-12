---
tags: dotnet 
---
### Indexers

- cho phép 1 đối tượng được đánh chỉ mục như array
- syntax: public T this[type i] { get{return T[i];} {set{T[i] = value;}}
- hoặc dùng => để thay thế get: public T this[type i] => ...
- hoặc dùng => cho cả get set

