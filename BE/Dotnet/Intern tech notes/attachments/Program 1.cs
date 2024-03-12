using System.Collections;

var personCollection = new PersonCollection();
personCollection.Add(new Person { PersonName = "PhucA"});
personCollection.Add(new Person { PersonName = "Duc"});
personCollection.Add(new Person { PersonName = "Tai"});
personCollection.Add(new Person { PersonName = "PhucB"});
personCollection.Add(new Person { PersonName = "Bao"});

Console.WriteLine("Collection ban dau:");
personCollection.Print();

personCollection.Remove(personCollection[3]);

Console.WriteLine("\nCollection sau khi xoa phan tu co index = 3:");
personCollection.Print();

personCollection.Clear();
Console.WriteLine("\nCollection sau khi clear:");
Console.WriteLine($"Length: {personCollection.Count}");

public class Person
{
    public string? PersonName { get; set; }
}

public class PersonCollection : ICollection<Person>
{
    private IList<Person> _personList;
    public int Count { get => _personList.Count; }
    public bool IsReadOnly { get => false; }

    public Person this[int i]
    {
        get => _personList[i];
        set => _personList[i] = value;
    }

    public PersonCollection()
    {
        _personList = new List<Person>();
    }
    public IEnumerator<Person> GetEnumerator()
    {
        return new PersonEnumerator(_personList);
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }

    public void Add(Person item)
    {
        _personList.Add(item);
    }

    public void Clear()
    {
        _personList.Clear();
    }

    public bool Contains(Person item)
    {
        return _personList.Contains(item);
    }

    public void CopyTo(Person[] array, int arrayIndex)
    {
        _personList.CopyTo(array, arrayIndex);
    }

    public bool Remove(Person item)
    {
        return _personList.Remove(item);
    }

    public void Print()
    {
        foreach (var item in _personList)
        {
            Console.WriteLine(item.PersonName);
        }
    }
}

public class PersonEnumerator : IEnumerator<Person>
{
    private IList<Person> _collection;
    private int _currentIndex = -1;
    public PersonEnumerator(IList<Person> collection)
    {
        _collection = collection;
    }
    
    public bool MoveNext()
    {
        _currentIndex++;
        if (_currentIndex >= _collection.Count)
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
