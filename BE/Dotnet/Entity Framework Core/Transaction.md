---
tags: efcore 
---
### Transactions

- Microsoft.EntityFrameworkCore.Storage

```csharp
using IDbContextTransaction t = db.Database.BeginTransaction();
t.Commit();

// t.Rollback()
```

- Tạo SQL Transaction khác với transaction của efcore
	- efcore dùng change tracker để theo dõi các thay đổi, khi update, nếu số lượng update của change tracker khác với số lượng thực được lưu vào db -> throw lỗi và rollback
	- dùng transaction tường minh cho phép gọi SaveChanges nhiều lần (ít dùng)