- Reflection provides objects (of type [Type](https://learn.microsoft.com/en-us/dotnet/api/system.type)) that describe assemblies, modules, and types. You can use reflection to dynamically create an instance of a type, bind the type to an existing object, or get the type from an existing object and invoke its methods or access its fields and properties. If you're using attributes in your code, reflection enables you to access them

```csharp
// Using GetType to obtain type information:
int i = 42;
Type type = i.GetType();
Console.WriteLine(type); // System.Int32

// Using Reflection to get information of an Assembly: 
Assembly info = typeof(int).Assembly; 
Console.WriteLine(info); // System.Private.CoreLib, Version=7.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e
```