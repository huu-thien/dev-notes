---
tags: dotnet 
---
### Extension Methods

- là static method nhưng được gọi thông qua cú pháp của instance method
- tham số đầu tiên xác định kiểu mà method thực thi
```csharp
public static class StringExt 
{ 
	public static bool isValid(this string input)
	{
	...
	}
}
```