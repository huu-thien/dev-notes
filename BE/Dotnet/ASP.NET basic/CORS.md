---
tags: aspnet 
---
### Cross-Origin Resource Sharing

- HTTP-header-based standard for protecting web resources when the client and server are on different domains (origins). It allows a server to indicate which origins will permit the loading of resources from
- Program.cs

```csharp
builder.Services.AddCors();
//...
//before UseEndpoints
app.UseCors(configurePolicy: options =>
{
	options.WithMethods("GET", "POST", "PUT", "DELETE");
	options.WithOrigins(
	"<https://localhost:5001>" // allow requests from the MVC client
	);
});
```