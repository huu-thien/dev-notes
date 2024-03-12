---
tags: dotnet, general  
---
Định nghĩa: là tập hợp những quy tắc khi lập trình như đặt tên biến, cách viết comment, sử dụng các cú pháp…

Một số lợi ích:

- Giúp đảm bảo tính thống nhất giữa các thành viên trong dự án
- Giúp code dễ đọc hơn
- Thuận tiện hơn trong quá trình sửa lỗi cũng như mở rộng hệ thống

→ Tiết kiệm thời gian và chi phí

**Quan trọng nhất: tính consistency (tính nhất quán)**

## Layout conventions

- Sử dụng Allman styles: dấu ngoặc nhọn đặt ở 1 dòng riêng và cùng cấp với câu lệnh tương ứng
    
    ```csharp
    while (x == y)
    {
        something();
        somethingelse();
    }
    ```
    
- Thụt lề bằng 4 dấu cách
    
- Mỗi dòng chỉ có 1 câu lệnh
    
- Phải có 1 dòng trống giữa các method hay property
    
- Sử dụng cặp dấu () để làm cho các expression rõ ràng
    
    ```csharp
    if ((val1 > val2) && (val1 > val3))
    {
        // Take appropriate action.
    }
    ```
    

## Naming conventions

- Sử dụng Pascal case:
    
    - đối với tên `class`, `record`, `struct` , `interface` (bắt đầu bằng I)
        
    - đối với các fields, properties có scope là public
        
    - đối với tất cả các methods hay functions
        
        ```csharp
        public interface IConsoleLog
        {
        		void Action(int var1);
        }
        
        public class ConsoleLog : IConsoleLog 
        { 
        		public string Name {get; set;}
        
        		public void Action(int var1)
        		{
        				Console.Writeline($"var1 is {var1}")
        		}
        }
        
        public record PhysicalAddress(
            string Street,
            string City,
            string StateOrProvince);
        ```
        
- Sử dụng Camel case:
    
    - Đối với các fields có scope là private hoặc internal, sử dụng thêm dấu _ làm prefix
        
        ```csharp
        public class DataService
        {
            private IWorkerQueue _workerQueue;
        }
        ```
        
    - Đối với các static fields có scope là private hoặc internal, sử dụng s_ làm prefix
        
        ```csharp
        public class DataService
        {
            private static IWorkerQueue s_workerQueue;
        }
        ```
        
    - Đối với các parameters của các methods:
        
        ```csharp
        public void SomeMethod(int someNumber, bool isValid)
        {
        }
        ```
        
- Quy ước
    
    - Các biến hoặc hàm có kiểu bool phải bắt đầu bằng các từ “Is”, “Can”, “Has”
        
        ```csharp
        bool IsAdmin(int n) { }
        
        bool hasPermission = true;
        ```
        
    - Tên method hay function có chứa động từ
        
        ```csharp
        public User GetUser(int userId) { }
        ```
        
    - Tên các class, parameters, fields, properties là danh từ
        
        ```csharp
        public class User 
        { 
        		private int userId;
        		private string userName;
        }
        ```
        
    - Luôn ghi rõ scope của fields, proterties, methods…
        

## Commenting conventions

- Nên có comment chú thích cho mỗi methods và các tham số của nó
    
- Cần tránh lạm dụng comment, nên tận dụng tên biến, viết code dễ hiểu để giảm thiểu comment
    
- Comment phải nằm ở 1 dòng riêng
    
- Có khoảng cách giữa // và câu comment
    
- Viết hoa chữ cái đầu, kết thúc bằng dấu .
    
    ```csharp
    // This function take 2 integers and return the sum
    // of them.
    int Function(int num1, int num2)
    {
    		return num1 + num2;
    }
    ```
    

## Các quy tắc khác

- [String](../Basic%20concepts/String.md) data type
    
    - Sử dụng string interpolation để nối chuỗi thay vì dấu +
        
        ```csharp
        string person1 = "This is " + personName + ". He/she is " + age + " years old.";
        
        string person2 = $"This is {personName}. He/she is {age} years old.";
        ```
        
    - Ưu tiên sử dụng StringBuilder khi phải nối chuỗi trong vòng lặp, nhất là khi số lượng ký tự lớn
        
        ```csharp
        var phrase = "lalalalalalalalalalalalalalalalalalalalalalalalalalalalalala";
        
        string s = string.Empty;
        for (i = 0; i < 10000; i++) {
        	  s += phrase;
        }
        
        StringBuilder sb = new StringBuilder();
        for (i = 0; i < 10000; i++) {
        	  sb.Append(phrase);
        }
        ```
        
- Sử dụng [var](../Basic%20concepts/Var%20v%C3%A0%20Dynamic.md):
    
    - khi kiểu ở vế phải đã rõ ràng
        
        ```csharp
        var var1 = "This is clearly a string.";
        var var2 = 27;
        var var3 = new Date();
        var var4 = Convert.ToInt32(var2);
        ```
        
    - không nên tự suy ra type từ tên method hoặc từ tên biến
        
        ```csharp
        //Wrong
        var var6 = GetResult();
        //Correct
        int var6 = GetResult();
        
        //Wrong
        var inputInt = Console.Readline();
        //Correct
        string inputInt = Console.Readline();
        ```
        
    - Có thể dùng var trong vòng lặp for, nhưng không nên sử dụng var trong foreach
        
        ```csharp
        for (var i = 0; i < 10; i++)
        {
        		Console.Write(i);
        }
        
        foreach (char ch in description)
        {
        }
        ```
        
- Sử dụng [](../Basic%20concepts/Conditional.md#Conditional%20logical%20operators%7Cconditional%20logical%20operations)
    
    - để tránh các lỗi và tăng hiệu năng bởi việc bỏ qua các câu so sánh không cần thiết
        
        ```csharp
        //wrong
        if (divisor != 0)
        {
        		if (dividend / divisor > 0)
        		{
        				Console.WriteLine("Quotient: {0}", dividend / divisor);
        		}
        }
        else
        {
        		Console.WriteLine("Attempted division by 0 ends up here.");
        }
        
        //correct
        if ((divisor != 0) && (dividend / divisor > 0))
        {
            Console.WriteLine("Quotient: {0}", dividend / divisor);
        }
        else
        {
            Console.WriteLine("Attempted division by 0 ends up here.");
        }
        ```
        
- Sử dụng kiểu của C# thay vì kiểu dữ liệu của .NET
    
    ```csharp
    //recommended
    int month;
    double real;
    string name;
    ulong fact;
    
    //not recommended
    Int32 month;
    Double real;
    String name;
    UInt64 fact;
    ```