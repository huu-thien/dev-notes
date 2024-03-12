---
tags: efcore, dotnet 
---
### Logger

- tạo ILoggerFactory và thêm filter:

```csharp
ILoggerFactory loggerFactory = LoggerFactory.Create(builder => {
builder
.AddFilter([DbLoggerCategory.Database.Command.Name](%3Chttp://dbloggercategory.database.command.name/%3E), LogLevel.Warning)
.AddFilter([DbLoggerCategory.Query.Name](%3Chttp://dbloggercategory.query.name/%3E), LogLevel.Debug)
.AddConsole();
});
```

- trong OnConfiguring: `optBuilder.UseLoggerFactory(loggerFactory)`