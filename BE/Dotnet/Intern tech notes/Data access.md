---
tags: aspnet, efcore
---
## DbContext

- DbContext designed to be used for a _single unit-of-work_ → short lifetime
    
- the lifetime of a DbContext:
    
    1. Create the DbContext instance
    2. Track some entities
    3. Make some changes to the entities
    4. Call SaveChanges to update the database
    5. Dispose the DbContext instance
- In [ASP.NET](http://ASP.NET), 1 HTTP request corresponds to a uow → we add DbContext to ServiceProvider with Scoped lifetime (AddDbContext)
    
    ```csharp
    services.AddDbContext<ApplicationDbContext>(
            options => options.UseSqlServer("name=ConnectionStrings:DefaultConnection"));
    ```
    
- The `ApplicationDbContext` class must expose a public constructor with a `DbContextOptions<ApplicationDbContext>` parameter. This is how configuration from `AddDbContext` is passed to the `DbContext`
    
    ```csharp
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
    }
    ```
    
    - a `DbContextOptions` will be built from `DbContextOptionsBuilder` with configuration from `AddDbContext` (the parameter type is `Action<DbContextOptionsBuilder>`)
    - `DbContextOptions<TContext>` ensures that the correct options for the specific `DbContext` subtype are resolved from dependency injection, even when multiple `DbContext` subtypes are registered
- In ApplicationDbContext class, `OnConfiguring` is always called → can be used to perform additional configuration even when `AddDbContext` is being used.
    
    ```csharp
    public class ApplicationDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=(localdb)\\mssqllocaldb;Database=Test");
        }
    }
    ```
    
- EFCore does not supported multiple parallel operations
    
    - use separate `DbContext` instances for operations that execute in parallel
    - always `await` async calls immediately. if a caller does not await → `DbContext` corrupted or `InvalidOperationException`

## Model

- EF Core uses a metadata _model_ to describe how the application's entity types are mapped to the underlying database.
    
- This model is built using a set of _conventions_ and can be customized using Data annotations or [Fluent API](../Entity%20Framework%20Core/Fluent%20API.md) (Fluent API > Data annotations > Conventions)
    
- Some conventions:
    
    - EFCore create all tables with the dbo schema
    - Creates nullable column for nullable data types
    - create the primary key column for the property named Id or \<EntityClass>Id (case insensitive)
    - create a foreign key column for each reference navigation property named:
        - `<navigation property name><principal primary key property name>Id`
        - `<navigation property name>Id`
- To use Fluent API, override the `OnModelCreating` method and use a parameter `modelBuilder` of type `ModelBuilder`
    
- `IEntityTypeConfiguration<T>` allows [configuration](../Entity%20Framework%20Core/Move%20configuration.md) for an entity type to be factored into a separate class
    ![Pasted image 20230729224123](attachments/Pasted%20image%2020230729224123.png)
    
    - added to `OnModelCreating`
    
    ```csharp
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new AuthorConfiguration());
    		modelBuilder.ApplyConfiguration(new BookConfiguration());
    		...
    }
    ```
    
    - .Net can finds all `IEntityTypeConfiguration<T>` in the assembly to apply
    
    ```csharp
    modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    ```
    

## Client & Server evaluation

*Client: our program

*Server: databases

- Generally, EFCore attempts to evaluate a query on the server as much as possible.
    
- Top-level projection: last part of a LINQ query (Select) that decides which data to fetch from databases
    
    ```csharp
    var productsName = await _context.Products
                .OrderBy(p => p.Price)
                .Select(p => new {Name = p.Name})
                .ToListAsync();
    ```
    
- EFCore supports partial client evaluation in the top-level projection
    
    - If the top-level projection in the query can't be translated to SQL, EF Core will fetch any required data from the server and evaluate remaining parts of the query on the client
        
        ```csharp
        var productsName = await _context.Products
                    .OrderBy(p => p.Price)
                    .Select(p => new {Name = RemoveSpace(p.Name)})
                    .ToListAsync();
        /*
        SELECT [p].[Name]
              FROM [Products] AS [p]
              ORDER BY [p].[Price]
        ```
        
- If EF Core detects an expression, in any place other than the top-level projection, which can't be translated to the server, then it throws a runtime exception
    
    ```csharp
    var productsName = await _context.Products
                .OrderBy(p => p.Price)
                .Where(p => RemoveSpace(p.Name).Contains("Fish"))
    						.Select(p => new {Name = RemoveSpace(p.Name)})
                .ToListAsync();
    ```
    
- Force client evaluation explicitly (IQueryable → IEnumerable)
    
    ```csharp
    var productsName =  _context.Products
                .OrderBy(p => p.Price)
                **.AsEnumerable()**
                .Where(p => RemoveSpace(p.Name).Contains("Fish"))
    						.Select(p => new {Name = RemoveSpace(p.Name)})
                .ToList();
    /*
    SELECT [p].[Id], [p].[CreatedAt], [p].[CreatedBy], [p].[IsAvailable], 
    [p].[ModifiedAt], [p].[ModifiedBy], [p].[Name], [p].[Price], [p].[ProductCode], [p].[Type]
          FROM [Products] AS [p]
          ORDER BY [p].[Price]
    ```
    
    - We can use ToList but it causes buffering, which takes additional memory.

## Change tracker

- Entity instances become tracked when:
    
    - Returned from a query
    - Explicitly attached to the DbContext by `Add`, `Attach`, `Update`
    - new entities connected to existing tracked entities
- Entity instances are no longer tracked when:
    
    - The change tracker is cleared or the DbContext is disposed
    - The entities are explicitly detached
- Every entity is associated with a EntityState:
    ![Pasted image 20230729224146](attachments/Pasted%20image%2020230729224146.png)
    
- Difference between `Add` and `Attach`
    
    - `Add`: tracking the given entity, and any other reachable entities, in the Added state
    - `Attach` : tracking the given entity, and any other reachable entities.
        - For entity types with generated keys
            - if the primary key value set then it will be tracked in the `Unchanged` state
            - If the primary key value is not set then it will be tracked in the `Added` state
        - For entity types without generated keys, the state set is always `Unchanged`

## Tracking vs no-tracking

- Tracking
    
    - If EF Core finds an existing entity in the context, then the same instance is returned instead of the result of query, which can potentially use less memory and be faster than a no-tracking query
        
        ```csharp
        var result = "";
        var query = _context.Accounts.Where(a => a.Id == 1);
        
        var account1 = await query.FirstOrDefaultAsync();
        account1.Name = "Acc 1";
        result += $"Account 1 state is {_context.Entry(account1).State}. " +
                  $"Hash code: {account1.GetHashCode()}\\n";
                
        var account2 = await query.FirstOrDefaultAsync();
        result += $"Account 2 state is {_context.Entry(account2).State}. " +
                  $"Hash code: {account2.GetHashCode()}\\n";
        return Ok(result);
        /*
        Account 1 state is Modified. Hash code: 34245852
        Account 2 state is Modified. Hash code: 34245852
        ```
        
- No-tracking
    
    - generally quicker to execute because there's no need to set up the change tracking information.
        
    - A no-tracking query also give results based on what's in the database disregarding any local changes or added entities
        
        ```csharp
        var result = "";
        var query = _context.Accounts.Where(a => a.Id == 1).AsNoTracking();
        
        var account1 = await query.FirstOrDefaultAsync();
        account1.Name = "Acc 1";
        result += $"Account 1 state is {_context.Entry(account1).State}. " +
                  $"Hash code: {account1.GetHashCode()}\\n";
                
        var account2 = await query.FirstOrDefaultAsync();
        result += $"Account 2 state is {_context.Entry(account2).State}. " +
                  $"Hash code: {account2.GetHashCode()}\\n";
        return Ok(result);
        /*
        Account 1 state is Detached. Hash code: 60252655
        Account 2 state is Detached. Hash code: 15797508
        ```
        

## Eager loading, lazy loading & explicit loading

- **Eager loading**: use the `Include` and `ThenInclude` to specify related data to be included in query results within a single query
    
    ```csharp
    var account1 = await _context.Accounts 
                .Include(a => a.Deals)
                .Include(a => a.Contacts)
                .FirstOrDefaultAsync(a => a.Id == 1);
    ```
    
- **Lazy loading:** the related data is transparently loaded from the database when the navigation property is accessed
    
    - require virtual for any navigation property
    
    ```csharp
    var account2 = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == 2);
    var deals = account2.Deals;
    var contacts = account2.Contacts;
    ```
    
    - can cause unneeded extra database roundtrips (N+1 problem)
    
    ```csharp
    var result = "";
    var accounts = await _context.Accounts.ToListAsync();
    foreach (var account in accounts)
    {
        result += $"Account {account.Id} has {account.Deals.Count} deals\\n";
    }
    return Ok(result);
    ```
    
- **Explicit loading:** is similar to lazy loading, except that we explicitly retrieve the related data in code with the `Load` method → give more control than lazy loading
    
    ```csharp
    var account3 = await _context.Accounts.Where(a => a.Id == 3).FirstOrDefaultAsync();
    await _context.Entry(account3).Collection(a => a.Deals).LoadAsync();
    await _context.Entry(account3).Collection(a => a.Contacts).LoadAsync();
    ```