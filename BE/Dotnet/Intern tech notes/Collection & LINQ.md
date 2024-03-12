---
tags: dotnet 
---
.Net cung cấp một số loại Collections sau:

- System.Collections: lưu dữ liệu với kiểu là Object
    - ArrayList
    - Hashtable
    - Queue
    - Stack
- System.Collections.Generic: sử dụng kiểu đồng nhất
    - `Dictionary<TKey, TValue>`
    - `List<T>`
    - `Queue<T>`
    - `SortedList<TKey, TValue>`
    - `Stack<T>`
    - `HashSet<T>`
    - `SortedSet<T>`
- System.Collections.Concurrent: Cung cấp những collections hỗ trợ truy cập đa luồng
- System.Collections.Immutable: Những collection không thể bị chỉnh sửa sau khi khởi tạo

## System.Collections.Generic
![Pasted image 20230729215312](attachments/Pasted%20image%2020230729215312.png)

- Mối quan hệ giữa IEnumerable, ICollection, IList và IQueryable
    ![Pasted image 20230729215328](attachments/Pasted%20image%2020230729215328.png)
    
    - IEnumerable: hỗ trợ thao tác duyệt qua các phần tử (vd: foreach)
    - ICollection: tạo một collection có size động, hỗ trợ các thao tác như thêm, xóa, đếm
    - IList: hỗ trợ thêm các thao tác với các phần tử bằng index
    - IQueryable: hỗ trợ tương tác với dữ liệu từ Provider out-memory như database
- Các Collections
    ![Pasted image 20230729215359](attachments/Pasted%20image%2020230729215359.png)
    ![Pasted image 20230729215418](attachments/Pasted%20image%2020230729215418.png)
    ![Pasted image 20230729215431](attachments/Pasted%20image%2020230729215431.png)
- So sánh SortedList vs SortedDictionary
    
    - SortedList
        - Sử dụng array và binary search
        - Sử dụng ít bộ nhớ hơn SortedDictionary
        - Hỗ trợ truy xuất theo index
    - SortedDictionary
        - Sử dụng binary search tree
        - Các thao tác thêm và xóa nhanh hơn SortedList đối với dữ liệu chưa được sắp xếp
- Để sắp xếp một collection (SortedList, SortedDictionary, List.Sort() …) thì kiểu dữ liệu cần được sắp xếp phải kế thừa từ `IComparable<T>` hoặc `IComparable`
    
    - CompareTo:
        - < 0: giá trị hiện tại bé hơn giá trị được so sánh (giá trị hiện tại được xếp trước)
        - = 0: bằng
        - > 0: lớn hơn

## Tạo collection từ `IEnumerable<T>` ([code](attachments/Program.cs))

- Kế thừa từ `IEnumerable<T>` → cho phép duyệt qua các phần tử
- Có một method GetEnumerator trả về 1 object IEnumerator
- object IEnumerator này có:
    - Current: trả về phần tử hiện tại của collection
    - MoveNext(): di chuyển đến phần tử tiếp theo, trả về false nếu đã di chuyển đến phần tử cuối
    - Reset(): set enumerator trỏ về vị trí ban đầu của collection (vị trí trước phần tử đầu tiên)
## Tạo collection từ `ICollection<T>` ([code](attachments/Program%201.cs))

- Kế thừa từ `ICollection<T>` → cho phép thêm, xóa…
- Ngoài phần code như của `IEnumerable<T>` thì cần implement thêm các method như Add, Remove, Clear… và 2 properties là Count và IsReadOnly

## Language Integrated Query (LINQ)

- Ngôn ngữ truy vấn tích hợp, giúp thao tác với nhiều nguồn dữ liệu khác nhau như DB, collections, XML… với cú pháp thống nhất
- LINQ bao gồm 3 phần:
    - Data source
    - Create query
    - Excute query

### Datasource

- Để có thể truy vấn bằng LINQ thì datasource phải implement `IEnumerable` hoặc các interface con của nó như `IQueryable`
- Đối với các collections (implement `IEnumerable` trực tiếp), datasource là các object in-memory, loại provider này gọi là Linq to Objects.
- Đối với các databases, dữ liệu trong các bảng sẽ được map với các objects bởi EF Core. Ta xây dựng các câu query có kiểu `IQueryable` và sử dụng provider là Linq to Entities để chuyển chúng thành các SQL query để EF Core thực hiện.

### Create query

- Có 2 dạng syntax là:
    - Query syntax
        ![Pasted image 20230729215534](attachments/Pasted%20image%2020230729215534.png)
        
        ```csharp
        var query1 = 
              from person in personList
              where person.Age > 30
              orderby person.Age
              select person;
        ```
        
    - Method syntax
        
        ```csharp
        var query2 = personList
        						.Where(p => p.Age > 30)
        						.OrderBy(p => p.Age)
        						.Select(p => p);
        ```
        
        - References
            ![Pasted image 20230729215550](attachments/Pasted%20image%2020230729215550.png)
            ![Pasted image 20230729215614](attachments/Pasted%20image%2020230729215614.png)
            ![Pasted image 20230729215639](attachments/Pasted%20image%2020230729215639.png)
			  ![Pasted image 20230729215651](attachments/Pasted%20image%2020230729215651.png)
### Execute query
- Linq sử dụng [deferred execution](attachments/Program%202.cs). Nghĩa là câu query sẽ chưa được thực thi mà sẽ bị hoãn lại đến khi ta duyệt qua biến query, để thực thi và lấy kết quả trả về, ta dùng:
    - `foreach`
        
        ```csharp
        int[] numbers = new int[7] { 0, 1, 2, 3, 4, 5, 6 };
        
        var numQuery =
                    from num in numbers
                    where (num % 2) == 0
                    select num;
        
        foreach (int num in numQuery)
        {
            Console.Write(num);
        }
        ```
        
    - Các aggregation functions: `Count`, `Max`, `Min`, `Avarage`
        
        ```csharp
        var evenNumQuery =
            from num in numbers
            where (num % 2) == 0
            select num;
        
        int evenNumCount = evenNumQuery.Count();
        ```
        
    - `ToList`, `ToArray`: Lấy kết quả và lưu vào List hoặc Array
        
        ```csharp
        List<int> numQuery2 =
            (from num in numbers
             where (num % 2) == 0
             select num).ToList();
        ```