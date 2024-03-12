using System.Collections;

foreach(Person person in new PersonCollection())
{
    Console.WriteLine(person.PersonName);
}


public class Person
{
    public string? PersonName { get; set; }
}

public class PersonCollection : IEnumerable<Person>
{
    private Person[] _personList = {
        new() { PersonName = "PhucA"},
        new() { PersonName = "Duc"},
        new() { PersonName = "Tai"},
        new() { PersonName = "PhucB"},
        new() { PersonName = "Bao"}
    };
    public IEnumerator<Person> GetEnumerator()
    {
        return new PersonEnumerator(_personList);
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }
}

public class PersonEnumerator : IEnumerator<Person>
{
    private Person[] _collection;
    private int _currentIndex = -1;
    public PersonEnumerator(Person[] collection)
    {
        _collection = collection;
    }
    
    public bool MoveNext()
    {
        _currentIndex++;
        if (_currentIndex >= _collection.Length)
        {
            return false;
        }
        return true;
    }

    public void Reset()
    {
        _currentIndex = -1;
    }
    public Person Current => _collection[_currentIndex];

    object IEnumerator.Current => Current;

    public void Dispose()
    {
    }
}
