Bài viết này chúng ta sẽ tìm hiểu về Lazyloading, Earger Loading và Explicit Loading trong Entity Framework mà chúng ta thường xuyên gặp trong thực tế. Ở 3 khái niệm này, chúng ta đều tham chiếu đến việc load các entity liên quan.

**Eager Loading**

Eager loading giúp bạn load tất cả các entity trong 1 câu lệnh, tất cả các entity con sẽ được load ra trong 1 lần gọi duy nhất. Điều này có thể được thực hiện thông qua phương thức Include, sẽ trả về các entity liên quan như một phần của câu query và một lượng lớn dữ liệu sẽ được load ra 1 lần.

Ví dụ, bạn có một bản User và một bảng UserDetails (bảng này liên kết đến bảng User), sau đó bạn sẽ viết code như dưới đây. Chúng ta sẽ load ra user với Id của nó bằng UserId ở bảng UserDetails.

```cs
User usr = dbContext.Users.Include(a => a.UserDetails).FirstOrDefault(a => a.UserId == userId);   
```

Nếu có nhiều cấp độ hơn chúng ta có thể sử dụng câu lệnh sau:

```cs
User usr = dbContext.Users.Include(a => a.UserDetails.Select(ud => ud.Address)).FirstOrDefault(a => a.UserId == userId);   
```

**Lazy Loading**  
  
Đây là một hành vi mặc định của Entity Framework, khi mà các entity con được load ra chỉ khi chúng được truy cập lần đầu tiên. Đơn giản là hoãn lại việc load các dữ liệu ở các enttiy liên quan cho đến khi bạn yêu cầu nó.

Ví dụ, khi chúng ta chạy câu lện bên dưới, bảng UserDetails sẽ không được tải ra theo bảng User:

```cs
User usr = dbContext.Users.FirstOrDefault(a => a.UserId == userId);  
```

Nó sẽ chỉ được load ra khi bạn công khai gọi nó:

```cs
UserDeatils ud = usr.UserDetails; // UserDetails are loaded here   
```

Xét thêm 1 ví dụ nữa:

```cs
public class Person{
    public String Name{get; set;}
    public String Email {get; set;}
    public virtual Employer employer {get; set;}
}

public List<EF.Person> GetPerson(){
    using(EF.DbEntities db = new EF.DbEntities()){
       return db.Person.ToList();
    }
}
```

Sau khi phương thức GetPerson() được gọi, bạn không thể dùng lazyloading để truy cập vào thuộc tính employer để lấy ra đối tượng Employer khi ra ngoài phương thức nữa. Vì sao? Vì đối tượng db đã bị hủy sau khi ra ngoài khỏi khối using. Vây bạn phải dùng Person.Include(x=>x.employer) để load sẵn dữ liệu của Employer vào thuộc tính của person trước khi đối tượng db bị hủy.

**Explicit Loading**  
  
Có nhiều tùy chọn để disable tính năng Lazyloading trong Entity Framework. Sau khi tắt Lazy Loading, bạn có thể vẫn load các enttiy liên quan bằng cách gọi tường minh phương thức Load() để tải các entity liên quan. Có 2 cách sử dụng phương thức Load, Reference và Collection (để load collections):

```cs
User usr = dbContext.Users.FirstOrDefault(a => a.UserId == userId);  
dbContext.Entry(usr).Reference(usr => usr.UserDetails).Load();   
```

Khi nào sử dụng cái gì:

1. Sử dụng Eager loading khi các mối quan hệ không quá nhiều. Vì thế Eager loading là cách tối để giảm lượng query đến server vì chỉ có 1 query duy nhất.
2. Sử dụng Eager loading khi bạn chắc chắn bạn sẽ sử dụng các entity liên quan với entity chính ở nhiều nơi và nhiều lần.
3. Sử dụng Lazyloading khi bạn sử dụng qua nhệ 1-N
4. Sử dụng Lazyloading khi bạn chắc chắn bạn không sử dụng các entity liên quan ngay lập tức.
5. Khi bạn tắt tính năng Lazyloading, sử dụng Explicit loading khi bạn không chắc rằng bạn sẽ có sử dụng entity trước đó hay không.