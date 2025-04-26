---
tags: dotnet, general 
---
## Class

```csharp
public class Person
{
		public int PersonId {get; set;}
		public string Name {get; set;}
		private string IdentityId; 

		public void Greeting()
		{
				Console.Writeline($"Hello, {Name}")
		}
}
```

- class có _access modifier_ mặc định là internal (chỉ cho phép truy cập trong cùng assembly)
    
- các members của class (fields & methods) có access modifier mặc định là private
    ![Pasted image 20230729220113](Pasted%20image%2020230729220113.png)
    
- Field: để lưu dữ liệu
    
    - const: “compile-time constant”
        - mặc định là static
    - [readonly](readonly.md): “runtime constant”, giá trị được xác định lần đầu khi chương trình chạy và không thể thay đổi
        - có thể set các giá trị như DateTime.Now()
        - có thể set giá trị trong constructor
        - không thể khai báo trong method
        - có thể sử dụng với keyword static
    - required: field phải được khởi tạo trong object initializer
- Method:
    
    - [Properties](Properties.md): là những method mà có thể gọi như là field của đối tượng
        - cho phép thêm logic vào khi get hoặc set giá trị
        - getter và setter có thể có access level khác nhau
    - [Indexers](Indexers.md): cho phép get/set data sử dụng cú pháp như array: []

## Encapsulation

- Gom các thuộc tính và hàm lại thành 1 class
    
- Chỉ show những thứ cần thiết ra bên ngoài, ẩn đi những thông tin quan trọng và chỉ cho phép bên ngoài truy cập vào 1 tập các method và field
    
    ```csharp
    public class Employee
    {
    		public string Name;
    		public string PhoneNumber;
    		private string Address;
    		private string IdentityId;
    		
    		public void GetInfo() {...}
    		public double CalculateSalary() {...}
    }
    ```
    

## Abstraction

- Ẩn đi những chi tiết không cần thiết, người dùng chỉ cần quan tâm hệ thống làm được gì, không phải là như thế nào

## Inheritance

- Class có thể được kế thừa hoặc kế thừa những method và field từ class cha.
    
- C# là một ngôn ngữ có tính đơn thừa kế
    
    ```csharp
    public class Employee : Person {}
    
    public class Employee : Person, IEmployee, IPerson {}
    ```
    
- Mọi class đều thừa kế từ Object (trực tiếp hoặc gián tiếp)
    
    - ToString
    - Equals
    - GetHashCode
    - GetType
- Class con có thể override các method của class cha, sử dụng keyword `virtual` để cho phép method đó được các class con implement lại
    
- để override một method thì class con phải chỉ rõ ra với keyword `override`
    
    ```csharp
    public override int GetName() { ... }
    ```
    
- Sử dụng keyword `abstract` để bắt buộc các class con phải implement lại các method của class cha
    
    ```csharp
    public abstract class Person
    {
    		public abstract int GetName();
    }
    ```
    
    - Muốn sử dụng `abstract` class đối với method thì class phải có keyword `abstract`
    - `abstract` để khai báo là method này không có thân hàm và bắt buộc phải implement lại ở class con
    - Trong `abstract` class cũng có thể có các method có thân hàm khác như bình thường
- Sử dụng `interface` để kế thừa
    
    - trường hợp kế thừa nhiều interface và bị trùng tên method
        
        ```csharp
        public class Employee : IPerson1, IPerson2
        {
        		private int Id { get; set; }
            private string Name { get; set; }
            private string Department { get; set; }
        
            void IPerson1.Greeting()
            {
                Console.WriteLine($"Hello, {Name} from {Department} in IPerson1 example");
            }
        
            void IPerson2.Greeting()
            {
                Console.WriteLine($"Hello, {Name} from {Department} in IPerson2 example");
            }
        }
        
        //cach 1
        ((IPerson1)e).Greeting();
        
        //cach 2
        IPerson2 person2 = e;
        person2.Greeting();
        ```
        
- So sánh Abstract class với Interface
    
    | Abstract class                                             | Interface                                         |
    | ---------------------------------------------------------- | ------------------------------------------------- |
    | chỉ được phép kế thừa từ 1 abstract class                  | được kế thừa từ nhiều interface                   |
    | có thể chứa các field                                      | chỉ có thể chứa các method (properties, indexers) |
    | có thể có constructor nhưng không thể gọi trực tiếp        | không có constructor                              |
    | có thể có static member                                    | không thể có static                               |
    | có thể có các access modifier (public, protected)          | mọi thứ mặc định đều là public                    |
    | chỉ bắt buộc class con implement lại những abstract method | class con phải implement lại toàn bộ              |
    
- `sealed` keyword: không cho phép kế thừa
    
    ```csharp
    sealed class Person { ... }
    ```
    
- Một abstract class có thể kế thừa từ một abstract class khác và vẫn phải override các abstract method
    
    ```csharp
    public abstract class AbstractBaseClass
    {
        public abstract void AbstractMethod();
    }
    
    public abstract class DerivedAbstractClass : AbstractBaseClass
    {
        public override abstract void AbstractMethod();
    		//or
    		public override void AbstractMethod()
    		{
    				//some logic
    		}
    }
    ```
    

## Polymorphism

- Một hàm/toán tử/đối tượng có thể có nhiều hành động khác nhau tùy trường hợp
    
- Compile Time Polymorphism:
    
    - Method Overloading: các method có thể có cùng tên nhưng phải khác số tham số hoặc kiểu của các tham số
        
        ```csharp
        class Person
        {
            protected int Id { get; set; }
            protected string Name { get; set; }
            
            public Person(int id, string name)
            {
                Id = id;
                Name = name;
            }
            
            public void Introduce(int age)
            {
                Console.WriteLine($"Hello, I am {Name} and I am {age} years old");
            }
        
            public void Introduce(string address)
            {
                Console.WriteLine($"Hello, I am {Name} and I live in {address}");
            }
        }
        
        var p = new Person(1, "Phuc");
        
        p.Introduce(21);
        p.Introduce("Da Nang");
        
        //Hello, I am Phuc and I am 21 years old
        //Hello, I am Phuc and I live in Da Nang
        ```
        
    - [Operator overloading](Operator%20overloading.md): tạo 1 static method trên kiểu cần thực hiện
        
- Runtime Polymorphism: sử dụng `override` keyword. Cho phép đối tượng thuộc class con được gọi như đối tượng thuộc class cha
    
    ```csharp
    Employee phuc = new Employee(1, "Phuc");
    Teacher minh = new Teacher(2, "Minh");
    
    Person huy = new Employee(3, "Huy");
    Person tai = new Teacher(4, "Tai");
    
    phuc.Introduce(); 
    minh.Introduce();
    
    huy.Introduce();
    tai.Introduce();
    
    //Hello, I am Phuc and I am an employee
    //Hello, I am Minh and I am a teacher
    //Hello, I am Huy and I am an employee
    //Hello, I am Tai and I am a teacher
    
    public class Person
    {
        protected int Id { get; set; }cha
        protected string Name { get; set; }
        
        public Person(int id, string name)
        {
            Id = id;
            Name = name;
        }
        
        public virtual void Introduce()
        {
            Console.WriteLine($"Hello, I am {Name}");
        }
    }
    
    public class Employee : Person
    {
        public override void Introduce()
        {
            Console.WriteLine($"Hello, I am {Name} and I am an employee");
        }
    
        public Employee(int id, string name) : base(id, name)
        {
        }
    }
    
    public class Teacher : Person
    {
        public override void Introduce()
        {
            Console.WriteLine($"Hello, I am {Name} and I am a teacher");
        }
    
        public Teacher(int id, string name) : base(id, name)
        {
        }
    }
    ```
    
- `new` keyword: tạo một method hoặc property có cùng tên nhưng không liên quan đến method/property của class cha. Khi gọi method này trên kiểu của class cha thì hàm của class cha sẽ được gọi.