---
tags: efcore 
---
### Move configuration

- tạo lớp kế thừa EntityTypeConfiguration<TEntity>
- đưa các cài đặt vào trong constructor
- modelBuilder.Configurations.Add(new ConfigClass());
- modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);