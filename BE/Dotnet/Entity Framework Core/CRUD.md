---
tags: efcore, dotnet 
---
### CRUD

- tạo xóa CSDL: DbContext có thuộc tính Database để tạo/xóa CSDL
    - `EnsureCreate`
    - `EnsureDelete`
- muốn cập nhật dữ liệu chỉ cần thay đổi thuộc tính của đối tượng đọc được rồi gọi SaveChanges
- nếu 1 đối tượng riêng lẻ, không giám sát thực hiện cập nhật thì gọi Update của DbSet
- cập nhật đối tượng độc lập:
    1. tạo đối tượng: `var pr = new Product() {...}`
    2. đưa vào context để theo dõi: `EntityEntry<Product> pr_e = context.Attach(pr);`
    3. đánh dấu các trường cần được cập nhật: `pr_e.Property(p => p.Name).IsModified = true;`
    4. `SaveChanges`
- các đối tượng từ kết quả truy vấn, thêm vào thì mặc định được theo dõi, khi có thay đổi thì SaveChanges sẽ thực hiện các tác vụ tương ứng
- để lấy EntityEntry và điều chỉnh sự ảnh hưởng khi gọi SaveChanges

```csharp
EntityEntry<Product> eProduct = context.Entry(product);
eProduct.State = EntityState.Detached; //Added, Deleted, Detached, Modified, Unchanged
```