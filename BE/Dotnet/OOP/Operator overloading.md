---
tags: dotnet 
---
### Operator overloading

- phải bao gồm public và static
- phải có ít nhất 1 tham số có kiểu trùng với kiểu khai báo toán tử
```csharp
        public class Person
        {
            public int Id { get; set; }
            public string Name { get; set; }
            
            public Person(int id, string name)
            {
                Id = id;
                Name = name;
            }
            
            public static string operator +(Person p1, Person p2)
            {
                return $"{p1.Name} and {p2.Name}";
            }
        }
        
        var p1 = new Person(1, "John");
        var p2 = new Person(2, "Jane");
        
        Console.WriteLine("Hello, " + (p1 + p2));
        
        //Hello, John and Jane
```