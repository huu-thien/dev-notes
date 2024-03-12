---
tags: aspnet, efcore, arch 
---
## Repository pattern

- A layer between business logic and data access.
    - Seperate data access logic from business logic
    - Reuse access database code
    - Easier to test business logic part
- Generic repository: contains common operations (CRUD) of all the entities, avoid duplicate code
- Specific repository: inheir from generic repository, contains entity-specific operations
![Pasted image 20230729224639](attachments/Pasted%20image%2020230729224639.png)

- Problem: lack of transaction mechanic. Each repository hold a dbcontext on its own, if a repository SaveChanges successfully but another repository doesn’t → _inconsistent_

## Unit of work

- Ensure all the repositories uses a common DbContext, all the changes will be commited only once per unit-of-work → if any operations failed → cancel the [transaction](../Entity%20Framework%20Core/Transaction.md).
![Pasted image 20230729224654](attachments/Pasted%20image%2020230729224654.png)

Note: EFCore already implement Repository pattern and Unit of work (with DbSet and DbContext)

## Implementation

- Generic Repository

```csharp
public class RepositoryBase<TEntity> : IRepositoryBase<TEntity> where TEntity : class
{
    private readonly CRMDbContext _context;
    private DbSet<TEntity>? _dbSet;

    protected DbSet<TEntity> DbSet => _dbSet ??= _context.Set<TEntity>();

    protected RepositoryBase(CRMDbContext context)
    {
        _context = context;
    }

    public void Add(TEntity entity)
    {
        DbSet.Add(entity);
    }

    public void Update(TEntity entity)
    {
        DbSet.Update(entity);
    }

    public void Delete(TEntity entity)
    {
        DbSet.Remove(entity);
    }

    public virtual async Task<TEntity?> GetByIdAsync(int id)
    {
        return await DbSet.FindAsync(id);
    }

		// other reusable operations...
```

- Specific repository

```csharp
public class AccountRepository : RepositoryBase<Account>, IAccountRepository
{
    public AccountRepository(CRMDbContext context) : base(context)
    {
    }
		
		// override methods or methods for specific operation on Account
}

```

- IUnitOfWork

```csharp
public interface IUnitOfWork
{
    Task<int> CommitAsync();    
}
```

- UnitOfWork

```csharp
public class UnitOfWork : IUnitOfWork, IDisposable
{
    private readonly CRMDbContext _context;
    private bool _disposed;

    public UnitOfWork(CRMDbContext context)
    {
        _context = context;
    }

    public async Task<int> CommitAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        if (!_disposed)
        {
            _context.Dispose();
            _disposed = true;
        }
    }
```

- Test: if Add(product) fail (duplicate ProductCode), a DbUpdateException will be thrown and no changes are saved to database because all changes in a single call to `SaveChanges` are applied in a transaction. So the transaction is rolled back and the database remains unchanged.

```csharp
[HttpGet("UOWTest")]
    public async Task<IActionResult> UOWTest()
    {
        var account = new Account { Name = "Acc Test", TotalSales = 814 };
        var product = new Product
        {
            Name = "Product 1",
            Price = 123,
            ProductCode = "PRO-85750524",
            Type = (int)ProductType.Service,
            IsAvailable = true
        };
        _accountRepository.Add(account);
        _productRepository.Add(product);
        await _unitOfWork.CommitAsync();
        return Ok();
    }
```