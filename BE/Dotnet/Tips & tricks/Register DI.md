#### Add settings
```csharp
public static IServiceCollection TryAddSettings<TSettings>(this IServiceCollection services
	, IConfiguration configuration, string key) where TSettings : class
{
	var settings = configuration.GetSection(key).Get<TSettings>(options => options.BindNonPublicProperties = true);

	if (settings is null)
		Console.WriteLine($@"Warning: {typeof(TSettings).Name} with key {key} not found in configuration");
	else
		services.TryAddSingleton(settings);

	return services;
```