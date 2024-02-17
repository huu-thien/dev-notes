### (ADO.NET) SqlCommand truy vấn và cập nhật dữ liệu C# SQL Server

- Tạo đối tượng `SqlCommand` trong C# để truy vấn và cập nhật tới CSDL `SQL Server`, thực hiện lệnh với các phương thức `ExecuteNonQuery`, `ExecuteScalar`, `ExecuteReader`

###### Lớp SqlCommand - Khởi tạo đối tượng SqlCommand

- Lớp `SqlCommand` triển khai từ `DbCommand` cho phép tạo ra đối tượng mà từ đó có thể thi hành các lệnh SQL tương tác với `MS SQL Server` như các mệnh đề UPDATE|INSERT|CREATE TABLE|SELECT ... cũng như cho phép thi hành các hàm, các stored procedure của Database.
- Để tạo và thi hành được `SqlCommand` thì cần thiết lập cho nó câu lệnh SQL (truy vấn), và các tham số cho lệnh SQL đó, đồng thời phải thiết lập thông tin kết nối đến `SQL Server SqlConnection` vào đối tượng `SqlCommand`.
- Ví dụ, khởi tạo `SqlCommand` - thiết lập ngay câu query và kết nối

```csharp
var cmd = new SqlCommand(queryString, connection);
```

- Có thể khởi tạo `SqlCommand` sau đó mới thiết lập các thông số (câu truy vấn, kết nối và các tham số ...) rồi sau đó thực hiện `SqlCommand` (thực hiện truy vấn SQL)

```csharp
 // Tạo kết nối
    var sqlconnectstring = @"Data Source=localhost,1433;
                             Initial Catalog=xtlab;
                             User ID=SA;Password=Password123";
    var connection = new SqlConnection(sqlconnectstring);
    connection.Open();


    // Tạo đối tượng DbCommand
    using var command = new SqlCommand();
    command.Connection = connection;
    // select, insert, update, delete
    command.CommandText = "Mệnh đề truy vấn SQL";

    // Thực hiện các câu truy vấn, đọc kết quả
    // ...
    // ...

    connection.Close();
```

- Từ đối tượng `SqlConnection` cũng có thể tạo ngay đối tượng `SqlCommand` gắn với kết nối đó:

```csharp
using (var cmd = connection.CreateCommand())
    {
        cmd.CommandText   = queryString;
        // thực hiện lệnh ...
    }
```

- Như vậy để thi hành lệnh SQL với `SqlCommand`, thì cần có một kết nối trước (SqlConnection), rồi tạo ra đối tượng SqlCommand, gán cho nó kết nối, câu lệnh SQL sau đó mới thi hành được. Để thi hành, gọi một trong các phương thức như `ExecuteScalar`, `ExecuteNonQuery`, `ExecuteReader` ... trình bày ở mục phía dưới

###### Thiết lập các tham số cho SqlCommmand

- Các câu lệnh SQL có thể viết chứa tên tham số trong nó, sau đó giá trị thực của tham số này được SqlCommand gán thay vào để có mệnh đề SQL thực sự. Tham số trong chuỗi câu lệnh SQL ký hiệu là `@tenthamso` (nhớ có ký hiệu @ ), ví dụ:

```csharp
string queryString =  "SELECT DanhmucID, TenDanhMuc, MoTa FROM Danhmuc where DanhmucID > @DanhmucID";
```

- Thì có một tham số tên `@DanhmucID`: Giá trị thực sự của tham số này thay thế bởi giá trị của của một đối tượng kiểu `SqlParameter`. Tập hợp các tham số này lưu trong thuộc tính `Parameters` của `SqlCommand`

```csharp
command.Parameters.AddWithValue("@Danhmuc", 5);
```

- Thì trong `Parameters` có một `SqlParameter` có tên `@Danhmuc` với giá trị là 5, lúc này `SqlCommand` sẽ thay thế giá trị 5 vào vị trí `@Danhmuc` của câu truy vấn, kết quả câu truy vấn là

```csharp
"SELECT DanhmucID, TenDanhMuc, MoTa FROM Danhmuc where DanhmucID > 5"
```

- Ngoài ra có thể khởi tạo một `SqlParameter` và thêm vào, ví dụ:

```csharp
var danhmuc = new SqlParameter("@DanhmucID", 5); // Tạo tham số
command.Parameters.Add(danhmuc);                 // Thêm vào SqlCommand
var danhmuc = new SqlParameter("@DanhmucID", 5); // Tạo tham số
command.Parameters.Add(danhmuc);
```

- Hoặc chi tiết hơn như

```csharp
// Khởi tạo có chỉ định kiểu dữ liệu
var danhmuc = new SqlParameter("@DanhmucID", SqlDbType.Int);
// Gán gái trị vào tham số
danhmuc.Value = 5;
// Thêm vào SqlCommand
command.Parameters.Add(danhmuc);
```

###### Các cách thi hành SqlCommand và lấy kết quả truy vấn

- Có các phương thức khác nhau để thi hành `SqlCommand` tùy theo ngữ cảnh với mục đích khác nhau, gồm có các phương thức như:
  - `ExecuteNonQuery()`: thi hành truy vấn - không cần trả về dữ liệu gì, phù hợp thực hiện các truy vấn như `Update`, `Delete` ...
  - `ExecuteReader()`: thi hành lệnh - trả về đối tượng giao diện `IDataReader` như `SqlDataReader`, từ đó đọc được dữ liệu trả về
  - `ExecuteScalar()`: thi hành và trả về một giá trị duy nhất - ở hàng đầu tiên, cột đầu tiên

###### Thi hành SqlCommand bằng phương thức ExecuteScalar()

- Nếu thi hành `SqlCommand` bằng phương thức `ExecuteScalar` thì nó sẽ thi hành câu lệnh SQL và trả về 1 giá trị là cột đầu tiên của dòng đầu tiên. (Cho dù câu lệnh SQL thực tế trả về tập kết quả nhiều dòng nhiều cột). Lưu ý: giá trị có độ dài tối đa 2033 ký tự
- Ví dụ sau sẽ chèn một dòng mới vào bảng và trả về giá trị định danh của dòng mới chèn vào (ID). Ở đây chèn một `Shipper` mới thông tin `HoTen` và `Sodienthoai` vào bảng `Shippers`

```csharp
// Tạo đối tượng DbCommand
using var command = new SqlCommand();
command.Connection = connection;

// Câu truy vấn gồm: chèn dữ liệu vào và lấy định danh(Primary key) mới chèn vào
string queryString = @"INSERT INTO Shippers (Hoten, Sodienthoai) VALUES (@Hoten, @Sodienthoai);
                       SELECT CAST(scope_identity() AS int)";

command.CommandText = queryString;
command.Parameters.AddWithValue("@Hoten", "Abc");
command.Parameters.AddWithValue("@Sodienthoai", 123456);

var ShipperID = command.ExecuteScalar(); // Thi hành SQL trả về giá trị đầu tiên
Console.WriteLine($"Thêm mới Shipper, ID = {ShipperID}");
```

###### Thi hành với ExecuteNonQuery

- Thi hành `SqlCommand` bằng phương thức `ExecuteNonQuery` nó chỉ trả về kết quả là số dòng dữ liệu bị ảnh hưởng (số dòng xóa, số dòng update ...). Thường dùng cách này để thi hành các truy vấn `UPDATE`, `INSERT`, `DELETE`. Tuy nhiên, nếu là gọi `Procedure` thì có kết quả trả về.

```csharp
// Tạo kết nối
var sqlconnectstring = @"Data Source=localhost,1433;
                         Initial Catalog=xtlab;
                         User ID=SA;Password=Password123";
var connection = new SqlConnection(sqlconnectstring);
connection.Open();


// Tạo đối tượng SqlCommand
using var command = new SqlCommand();
command.Connection = connection;

// Câu truy vấn gồm: chèn dữ liệu vào và lấy định danh(Primary key) mới chèn vào
string queryString = @"DELETE Shippers WHERE ShipperID = @ShipperID";

command.CommandText = queryString;
command.Parameters.AddWithValue("@ShipperID", 4);

var rows_affected = command.ExecuteNonQuery();
Console.WriteLine($"Số dòng ảnh hưởng = {rows_affected}");

connection.Close();
```

###### Thi hành với ExecuteReader

- Thi hành `SqlCommand` với phương thức thì nó sẽ tạo ra đối tượng `SqlDataReader` được mở sẵn, từ đối tượng đó giúp đọc từng dòng kết quả trả về.
- Một số phương thức trong `SqlDataReader`
  - `SqlDataReader.HasRows()` cho biết có dòng dữ liệu nào không
  - `SqlDataReader.Read()` nạp dữ liệu dòng tiếp theo, nếu trả về true là có dòng dữ liệu nạp về thành công, nếu false là đã hết dữ liệu nạp về. Sau khi gọi phương thực này, thì các cột của dòng có thể đọc bằng các toán tử [cột], hoặc các hàm đọc dữ liệu như .GetInt32(cột), .GetString(cột) ...
  - `SqlDataReader.Close()` đóng Reader sau khi đọc xong dữ liệu
- Các câu lệnh SELECT có thể dùng cách náy

```csharp
// Tạo kết nối
var sqlconnectstring = @"Data Source=localhost,1433;
                         Initial Catalog=xtlab;
                         User ID=SA;Password=Password123";
var connection = new SqlConnection(sqlconnectstring);
connection.Open();


// Tạo đối tượng SqlCommand
using var command = new SqlCommand();
command.Connection = connection;

// Câu truy vấn lấy danh mục
string queryString = @"SELECT DanhmucID, TenDanhMuc, MoTa FROM Danhmuc";
command.CommandText = queryString;

// Thi hành truy vấn trả về SqlReader
using var reader = command.ExecuteReader();

// Kiểm tra có kết quả trả về
if (reader.HasRows)
{
    // Đọc từng dòng tập kết quả
     while (reader.Read())
     {
         var danhmuc = reader.GetInt32(0);
         var tendanhmuc = reader["TenDanhMuc"];
         var mota = reader.GetString("Mota");

         Console.WriteLine($"{danhmuc, 4} - {tendanhmuc, -20} - {mota}");
     }
}
else
{
    Console.WriteLine("Không có dữ liệu trả về");
}


connection.Close();
```

- Ngoài ra khi có được đối tượng `SqlDataReader`, có thể lấy toàn bộ kết quả trả về của `SqlCommand` đưa vào `DataTable`

```csharp
//...
SqlCommand command = new SqlCommand("SELECT DanhmucID, TenDanhMuc FROM Danhmuc;", connection);
using (SqlDataReader reader = command.ExecuteReader())
{
    DataTable myTable = new DataTable();

    if (reader.HasRows)
    {
        myTable.Load(reader);
    }
    else
    {
        //No rows
    }
}
//...
```

### ExecuteXmlReader

- Thi hành `SqlCommand` với phương thức thì nó sẽ tạo ra đối tượng `System.Xml.XmlReader`, từ đối tượng đó giúp đọc từng dòng kết quả trả về theo cấu trúc `XML`.

###### Gọi Procedure của DB

- Mặc định `SqlCommand` sẽ coi nội dung trong thuộc tính `CommandText` là câu lệnh SQL vì nó đã thiết lập CommandType bằng CommandType.Text (xem ví dụ trên). Nếu muốn gọi đến `Procedure` thì thiết lập nó bằng `CommandType.StoredProcedure`.
- Bạn có thể chạy câu lệnh `T-SQL` để tạo ra một `StoredProcedure` mẫu có tên `getproduct` với một tham số `@id`, thủ tục này đơn giản lấy thông tin của sản phẩm theo ID

```sql
CREATE PROCEDURE [dbo].[getproduct](@id int)
AS
BEGIN
	SET NOCOUNT ON;
	SELECT TenSanpham, Gia FROM Sanpham Where SanphamID = @id
END
```

- Thực hành gọi thủ tục SQL Server

```csharp
//...
public static void CallStoredProcedure()
{
    string sqlconnectStr     = "Data Source=localhost,1433;Initial Catalog=xtlab;User ID=SA;Password=Password123";
    SqlConnection connection = new SqlConnection(sqlconnectStr);
    connection.Open();

    // Thi hành thủ tục PROCEDURE [dbo].[getproduct](@id int) trong MS SQL Server
    SqlCommand cmd   = new SqlCommand("getproduct", connection);
    cmd.CommandType  = CommandType.StoredProcedure;
    // Tham số của procedure
    cmd.Parameters.Add(
        new SqlParameter() {
            ParameterName   = "@id",
            SqlDbType       = SqlDbType.Int,
            Value           = 10
        }
    );

    // Đọc kết quả trả về
    using (SqlDataReader reader = cmd.ExecuteReader())
    {
        while (reader.Read())
        {
            var ten = reader["TenSanpham"];
            var gia = reader["Gia"];

            Console.WriteLine($"{ten} \t {gia}");
        }
    }


  connection.Close();
}
//..
```

- Chú ý, các phương thức của thi hành của `SqlCommand` đều có phương thức bất đồng bộ tương ứng như `ExecuteNonQueryAsync`(), `ExecuteReaderAsync`() ... để thích thì áp dụng kỹ thuật async, kể các `SqlDataReader` với `ReadAsync()`
