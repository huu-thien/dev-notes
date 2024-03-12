---
tags: efcore 
---
### Fluent API

- khởi tạo

```csharp
var entity = modelBuilder.Entity(type);
var entity = modelBuilder.Entity<type>();
modelBuilder.Entity<type>(entity => {...});
```

- một vài method:
    - HasDefaultSchema
    - ToTable
    - HasKey, HasIndex, HasForeignKey, HasConstraintName
    - HasQueryFilter, HasData
    - HasOne, WithOne, HasMany, WithMany
    - HasOptional: nullable FK, WithRequired, HasRequired
    - Map, MapLeftKey, MapRightKey
    - Property, HasColumnName, HasColumnType, HasDefaultValue, HasMaxLength, IsRequired, IsUnique, HasConversion, IsOptional, HasColumnOrder
    - IsFixedLength, HasPrecision, IsUnicode
    - OnDelete, WillCascadeOnDelete(bool = true)
    - ValueGeneratedNever, ValueGeneratedOnAdd
    - Ignore
    - IsConcurrencyToken, IsRowVersion