# (EF Core) Tạo quan hệ trong Entity Framework với Fluent API C#
## Giới thiệu Fluent API
**Fluent API** cũng là phương pháp để tạo ra các bảng - bên cạnh phương pháp sử dụng `Data Annotation` (các thuộc tính mô tả Attribute ở phần trước) đã biết. Để sử dụng Fluent API, cần nạp chồng phương thức `OnModelCreating` của lớp DbContext, rồi tại đây sử dụng các API thích hợp định nghĩa ra mỗi liên hệ, các bảng, cột ... Dùng đến API nếu các Attribute chưa đủ dùng để thực hiện các thiết lập phức tạp.

Trước tiên thêm phương thức `OnModelCreating` vào lớp ShopContext

```csharp
public class ShopContext : DbContext
{

    // Phương thức này thi hành khi EnsureCreatedAsync chạy, tại đây gọi các Fluent API mong muốn 
    override protected void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        // Các Fluent API

    }

}
```

Phương thức này thi hành khi `EnsureCreatedAsync` chạy. Trong phương thức này nhận được một đối tượng kiểu ModelBuilder cung cấp các API để định nghĩa ra các bảng, trường, xây dựng mối liên hệ giữa chúng cũng như ánh xạ vào db. ModelBuilder có phương thức `Entity<Type>(Action<EntityTypeBuilder<TEntity>>)` để bạn có thể thiết lập cấu hình cho bảng (TYPE) thông qua một [delegate Action](https://xuanthulab.net/s/su-dung-delegate-trong-c-ham-uy-quyen.html#func-action) với tham số là `EntityTypeBuilder<TEntity>`

Ví dụ, cần gọi các API tác động vào bảng `Product` thì thực hiện

```csharp
modelBuilder.Entity<Product>((EntityTypeBuilder<Product> entity) => {

    // Gọi các API từ đối tượng entity để xây dựng bảng Product

});
```

Mã trên tham số của `Entity<Product>` là một delegate nếu muốn bạn có thể viết gọn lại:

```csharp
// Nên viết theo cách này
modelBuilder.Entity<Product>(entity => {

    // Gọi các API từ đối tượng entity để xây dựng bảng Product

});
```

Hoặc tường minh hơn khi bạn tạo delegate Action trước:

```csharp
Action<EntityTypeBuilder<Product>> myaction = entity => {
    // Gọi các API từ đối tượng entity để xây dựng bảng Product
};
modelBuilder.Entity<Product>(myaction);
```

Sau đây giới thiệu một số Fluent API làm quen, trước hết tạo thêm Model User, biểu diễn người dùng:

```csharp
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using ef03.Model;

namespace ef03.Model
{
    public class User
    {
        public int UserId {set; get;}

        public string UserName {set; get;}

        public List<Product> ProductsPost {set; get;}
    }
}
```

Để ý, lớp này không hề sử dụng một Attribute nào để thiết lập, ta sẽ dùng Fluent API để thiết lập. Đưa lớp này vào ShopContext, bằng cách thêm
```csharp
public DbSet<User> users {set; get;}
```

Cập nhật thêm vào `Product` có thêm thuộc tính:

```csharp
namespace ef02.Model
{
    [Table("Products")]
    public class Product
    {
        /...

        public int? UserPostId {set;  get;}         // Lưu thông tin người Post sản phẩm
        public virtual User UserPost {set; get;}    // Tham chiếu User

    }
}
```

## Giới thiệu một vài Fluent API

### Ánh xạ bảng - ToTable
Phương thức `ToTable(string nanme)` để cấu hình một Model ánh xạ vào thành một tên bảng cụ thể trong database, mặc định nếu không thiết lập thì tên bảng giống tên thuộc tính khai báo trong DbSet. Phương thức này trả về chính đối tượng EntityTypeBuilder (entity)

Ví dụ, nếu muốn Model User ánh xạ vào bảng có tên `User`
```csharp
modelBuilder.Entity<User>(entity => {

    entity.ToTable("User");                 // Tùy chọn tên của bảng là User (mặc định user)

}
```

### Thiết lập Primary key (Pk) cho bảng

Sử dụng phương thức `HasKey(keyExpression)` để thiết lập. Trong đó tham số `keyExpression` là một biểu lambda dạng `Expression<Func<TEntity,Object>>` như (ob => ob.AttributeName) biểu diễn thuộc tính là Primary key

Khi thi hành nó thiết lập Pk và trả về đối tượng lớp `KeyBuilder`, ví dụ thiết lập Pk của bảng User là tên thuộc tính UserId

```csharp
modelBuilder.Entity<User>(entity => {

    entity.HasKey(e => e.UserId);  // Thiết lập User.UserId là Pk

}
```

### Tạo chỉ mục với HasIndex và thiết lập duy nhất Unique

Sử dụng phương thức `HasKey(keyExpression)` để thiết lập cột nào đó (ob => ob.Name) hoặc nhiều cột (ob => new {ob.Name1, ob.Name2}) được đánh chỉ mục (index) - nhằm tăng tốc độ truy vấn. Phương thức này trả về đối tượng kiểu IndexBuilder, từ đối tượng trả về nếu muốn có thể gọi thêm phương thức `IsUnique(bool)` để thiết lập chỉ mục có giá trị duy nhất.

Ví dụ, đánh chỉ mục cột UserName của bảng User và không cho phép tên trùng nhau:

```csharp
modelBuilder.Entity<User>(entity => {

    entity.HasIndex(p => p.UserName)     // Đánh chỉ mục UserName (user_name)
          .IsUnique(true);               // Unique

});
```

### Tạo mối quan hệ với HasOne

Dùng phương thức `HasOne(keyExpression)` để cấu hình liên hệ nó cho biết bảng này (entity này) có một tham chiếu trỏ đến một bảng khác, tham số nhận là chỉ ra Entity khác khai báo trong Entity này. Phương thức này trả về đối tượng kiểu `ReferenceNavigationBuilder`, từ đối tượng trả về có thể gọi thêm các phương thức để thiết lập như: `WithMany` (trả về ReferenceCollectionBuilder) và `WithOne` (trả về ReferenceReferenceBuilder) để chỉ ra một tập hợp nhiều hay một, mỗi phương thức trả về lại có nhiều thiết lập khác, tìm hiểu ví dụ củ thể:

Từ bảng Product tạo mối liên hệ một nhiều với User - Một User đăng nhiều sản phẩm. Thiết lập FK trong Product có tên UserPostId tham chiếu đến Pk của bảng User, thiết lập một User bị xóa thì các sản phẩm của User đăng sẽ thiết lập Fk về Null. Mối dàng buộc này đặt tên trong CSDL là FK_Products_user_post

```csharp
modelBuilder.Entity<Product>(entity => {
    // Thiết lập cho bảng Product
    entity.HasOne(e => e.UserPost)                       // Chỉ ra Entity là phía một (bảng User)
            .WithMany(user => user.ProductsPost)         // Chỉ ra Collection tập Product lưu ở phía một
            .HasForeignKey("UserPostId")                 // Chỉ ra tên FK nếu muốn
            .OnDelete(DeleteBehavior.SetNull)            // Ứng xử khi User bị xóa (Hoặc chọn DeleteBehavior.Cascade)
            .HasConstraintName("FK_Products_user_post"); // Tự đặt tên Constrain (dàng buốc)

});
```

Khi chạy, câu truy vấn tạo bảng thấy:

```csharp
CREATE TABLE [Products] (
  [ProductId] int NOT NULL IDENTITY,
  [Name] nvarchar(50) NOT NULL,
  [Price] Money NOT NULL,
  [CategoryId] int NOT NULL,
  [CategorySecondId] int NULL,
  [UserPostId] int NULL,
  CONSTRAINT [PK_Products] PRIMARY KEY ([ProductId]),
  CONSTRAINT [FK_Products_Category_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Category] ([CategoryId]) ON DELETE CASCADE,
  CONSTRAINT [FK_Products_Category_CategorySecondId] FOREIGN KEY ([CategorySecondId]) REFERENCES [Category] ([CategoryId]) ON DELETE NO ACTION,
  CONSTRAINT [FK_Products_user_1234] FOREIGN KEY ([UserPostId]) REFERENCES [User] ([UserId]) ON DELETE SET NULL
);
```

Đối với WithMany cũng tương tự, chiều thiết lập ngược lại
``
## PropertyBuilder<`TProperty`> - thiết lập thuộc tính

Để thiết lập thuộc tính (trường, cột) của một Model (bảng) thì đầu tiên phải lấy được đối tượng lớp PropertyBuilder dành cho thuộc tính đó. Ví dụ, lấy PropertyBuilder cho thuộc tính (cột) UserName của bảng User.

```csharp
modelBuilder.Entity<User>(entity => {

    entity.Property(e => e.UserName);    // Lấy PropertyBuilder cho UserName

});
```

Khi đã có PropertyBuilder có nhiều phương thức để thiết lập, cấu hình như:
- `HasColumnName` tùy chọn đặt tên cột
- `HasColumnType` tùy chọn thiết lập kiểu cột, ví dụ HasColumnType("varchar(20)")
- `HasDefaultValue` thiết lập giá trị mặc định
- `HasMaxLength` độ dài dữ liệu
- `IsRequired` khác null

Ví dụ tổng hợp sử dụng các API ở trên

```csharp
// Phương thức này thi hành khi EnsureCreatedAsync chạy, tại đây gọi các Fluent API mong muốn
override protected void OnModelCreating (ModelBuilder modelBuilder) {

    base.OnModelCreating (modelBuilder);

    modelBuilder.Entity<User>(entity => {


        // Thiết lập cho bảng
        entity
            .ToTable("User")                        // Tùy chọn tên của bảng là User (mặc định user)
            .HasComment("Đây là bảng người dùng")   // Dòng chú thichs
            .HasKey(e => e.UserId);                 // Thiết lập Primary key là UserId

        // Thiết lập cho cột UserID
        entity.Property(e => e.UserId)
            .UseIdentityColumn(1,1);

        // Thiết lập cho cột UserName
        entity.Property(e => e.UserName)
              .HasColumnName("user_name")    //Tùy chọn đặt lại tên cột user_name (mặc định UserName)
            //.HasColumnType("varchar(20)")
              .HasDefaultValue("Không tên")  // Giá trị mặc định
              .HasMaxLength(20);             // Độ dài của trường dữ liệu 20
        entity.HasIndex(p => p.UserName)     // Đánh chỉ mục UserName (user_name)
              .IsUnique(true);               // Unique

    });

    // Bảng Products

    modelBuilder.Entity<Product>(entity => {
        // Thiết lập cho bảng Product
        entity.HasOne(e => e.UserPost)                       // Chỉ ra Entity là phía một (bảng User)
                .WithMany(user => user.ProductsPost)         // Chỉ ra Collection tập Product lưu ở phía một
                .HasForeignKey("UserPostId")                 // Chỉ ra tên FK nếu muốn
                .OnDelete(DeleteBehavior.SetNull)            // Ứng xử khi User bị xóa (Hoặc chọn DeleteBehavior.Cascade)
                .HasConstraintName("FK_Products_user_1234"); // Tự đặt tên Constrain (dàng buốc)

    });



}
```