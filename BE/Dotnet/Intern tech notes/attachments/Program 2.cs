var personList = new List<Person>
{
    { new Person { PersonName = "PhucA", Age = 35 }},
    { new Person { PersonName = "Duc", Age = 40 }},
    { new Person { PersonName = "Tai", Age = 30 }},
    { new Person { PersonName = "PhucB", Age = 35 }},
    { new Person { PersonName = "Bao", Age = 20 }}
};

var query = personList.Where(p => p.Age > 30)
                                        .OrderBy(p => p.Age) 
                                        .Select(p => p);

Console.WriteLine("\nBefore add new Person:");
foreach (var person in query)
{
    Console.WriteLine($"{person.PersonName} is {person.Age} years old"); 
}


personList.Add(new Person { PersonName = "PhucC", Age = 35 });


Console.WriteLine("\nAfter add new Person:");
foreach (var person in query)
{
    Console.WriteLine($"{person.PersonName} is {person.Age} years old"); 
}


var count = query.Count();
Console.WriteLine("\nCount: " + count);

var list = query.ToList();
Console.WriteLine("\nList: ");
foreach (var person in list)
{
    Console.WriteLine($"{person.PersonName} is {person.Age} years old"); 
}






public class Person 
{
    public string? PersonName { get; set; }
    public int Age { get; set; }
}
