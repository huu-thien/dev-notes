---
tags: aspnet 
---
### Minimal API

```csharp
app.MapGet("/api/weather", () =>
{
	return Enumerable.Range(1, 5).Select(index =>
		new WeatherForecast
		{
			Date = DateTime.Now.AddDays(index),
			TemperatureC = Random.Shared.Next(-20, 55),
			Summary = WeatherForecast.Summaries[
				Random.Shared.Next(WeatherForecast.Summaries.Length)]
		})
		.ToArray();
});
```


