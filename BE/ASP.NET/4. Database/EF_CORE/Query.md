# (EF Core) Thực hiện các câu truy vấn với Entity Framework C#

## Truy vấn dữ với Raw Query

Trên một bảng (nguồn dữ liệu) bạn có thể thi hành trực tiếp câu truy vấn SQL, ví dụ:

```csharp
using (var context = new ShopContext ()) {
    String sql = "select * from products order by Price Desc";
    var products = context.products.FromSqlRaw(sql);

    await products.ForEachAsync(p => {
        Console.WriteLine(p.Name);
    });
}
```

## Các hàm trong EF
Có các hàm xây dựng sẵn trong `EF.Functions.` như `Like`

```csharp
var products = await (from p in context.products
               where EF.Functions.Like(p.Name, "%phẩm%")
               select p)
               .ToListAsync();
```