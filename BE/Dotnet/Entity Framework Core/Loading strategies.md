---
tags: efcore 
---
### Load references

- await Entry(p).Reference(x => x.Category).LoadAsync();
    - DbEntityEntry.Reference(): Navigation Reference
    - DbEntityEntry.Collection(): Navigation Collection

### Lazy load

- Microsoft.EntityFrameworkCore.Proxies
- optionsBuilder.UseLazyLoadingProxies();
- khai báo virtual cho các thuộc tính tham chiếu

### Eager load

dbcontext.Table.Include(c => c.Ref)

- Các ví dụ: [Eager loading, lazy loading & explicit loading](Data%20access.md#Eager%20loading,%20lazy%20loading%20&%20explicit%20loading)