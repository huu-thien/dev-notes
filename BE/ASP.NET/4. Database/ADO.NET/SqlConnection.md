### (ADO.NET) Giới thiệu ado.net và kết nối SQL Server với SqlConnection

###### Giới thiệu về ADO.NET

- ADO.NET (ActiveX Data Object) là tập hợp các thư viện lớp qua đó cho phép ứng dụng tương tác (lấy về, cập nhật, xóa) với các nguồn dữ liệu (Như SQLServer, XML, MySQL, Oracle Database ...).
- Kiến trúc để truy cập dữ liệu với ADO.NET được phân ra nhiều phần rời rạc, mỗi phần có thể sử dụng độc lập hay đồng thời nhiều thành phần được sử dụng. Cơ bản thì nó phân chia ra hai khu vực như hình dưới:
  [Link Image](https://raw.githubusercontent.com/xuanthulabnet/learn-cs-netcore/master/imgs/cs058.png)
- Phần thứ nhất gọi là `Data Provider`: là các thư viện lớp cung cấp chức năng tạo kết nối đến nguồn dữ liệu, thi hành các lệnh trên nguồn dữ liệu đó inset, update, delete, read.
- Phần thứ 2 gọi là `DataSet` là các thư viện lớp (độc lập với Data Provider) tạo ra các đối tượng để quản lý dữ liệu không phụ thuộc nguồn dữ liệu đến từ đâu, đã ở trong ứng dụng (local) hay từ nguồn XML.
- `DataSet` thường gồm nhiều `DataTable`, trong DataTable lại gồm DataColumn, các dàng buộc, các khóa chính ... Vậy DataSet là sự trừu tượng hóa một CSDL thực.
- Trước tiên tìm hiểu sử dụng Data Provider với trường hợp cụ thể là SqlClient để truy cập đến CSDL MS SQL Server. Hãy gõ lệnh sau để thêm package SqlClient vào dự án:

```bash
dotnet add package System.Data.SqlClient
```

- Sau đó trong code sử dụng thêm namespace:

```csharp
using System.Data;
using System.Data.SqlClient;
```

###### Tạo kết nối với DbConnection

- `DbConnection` là lớp biểu diễn sự kết nối tới máy chủ CSDL. Từ lớp này các thư viện triển khai cụ thể cho từng loại CSDL như SQL Server có lớp triển khai (kế thừa) `DbConnection` là `SqlConnection`.
- `SqlConnection` sử dụng với các bước cơ bản sau:

  - Tạo đối tượng `SqlConnection` từ một chuỗi kết nối tới SQL Server
  - Mở kết nối với phương thức `Open()`
  - Thực hiện các truy vấn bằng cách sử dụng các lớp như `SqlCommand`, `SqlDataAdapter`, `SqlDataReader` ...
  - Không còn sử dụng đến kết nối nữa thì cần đóng lại bằng phương thức `Close`

- Ví dụ, có SQL Server ở địa chỉ localhost (hoặc 127.0.0.1), cổng kết nổi 1433, tên tài khoản là SA, password là Password123, thì tạo và mở kết nối như sau:

```csharp
string sqlconnectStr = "Data Source=localhost,1433;Initial Catalog=xtlab;User ID=SA;Password=Password123";
DbConnection connection = new SqlConnection(sqlconnectStr);

connection.Open();                      // Mở kết nối - hoặc  connection.OpenAsync(); nếu dùng async

//..                                    // thực hiện cá tác  vụ truy vấn CSDL (CRUD - Insert, Select, Update, Delete)

connection.Close();                     // Đóng kết nối
```

###### Tạo chuỗi kết nối với SQL Server

- Chuỗi kết nối (connection string) là tham số để khởi tạo ra đối tượng SqlConnection, chuỗi này chứa các thông tin cơ bản để thực hiện kết nối đến một SQL Server, các thông tin được chứa theo cặp `key=value`; ví dụ chuỗi "key 1=value1;key 2=value2", dưới dây tham khảo một số key
- Chuỗi có dạng như sau:

```csharp
"Server=ServerAddress;Database=DataBaseName;User Id=Username;Password=myPassword;"
```

Hoặc

```csharp
"Data Source=ServerAddress;Database=DataBaseName;User Id=Username;Password=myPassword;"
```

- SQL Server ở máy có địa chỉ IP `192.168.1.10`, có CSDL tên `exampledb`, cho phép kết nối với `User/Password` là `testuser/testpass`, thì tạo ra chuỗi kết nối và đối tượng SqlConnection như sau:

```csharp
String connectionString = "Server=192.168.1.10;Database=exampledb;User Id=testuser;Password=testpass;";
var sqlConnection = new SqlConnection(connectionString);
sqlConnection.Open();   //Mở kết nối
//...Code truy vấn, cập nhật dữ dữ liệu ở đây
sqlConnection.Close();  //Đóng kết nối sau khi sử dụng
```

- Nếu sử dụng `using` thì kết nối sẽ tự động đóng lại ở cuối khối using, nên không cần phải gọi `Close`

```csharp
String connectionString = "Server=192.168.1.10;Database=exampledb;User Id=testuser;Password=testpass;";
using (var sqlConnection = new SqlConnection(connectionString))
{
    sqlConnection.Open();//Mở kết nối
    //...Code truy vấn, cập nhật dữ dữ liệu ở đây
}
```

- Chú ý, trong một phạm vi phương thức có thể sử dụng using mà không cần tạo khối lệnh

```csharp
void myfunction()
{
    using var sqlConnection = new SqlConnection(connectionString);
    sqlConnection.Open();//Mở kết nối
    //...
}
```

###### SqlConnectionStringBuilder

- `SqlConnectionStringBuilder` giúp tạo ra chuỗi kết nối, bằng cách thiết lập từng loại key ở trên, sau đó nó phát sinh chuỗi kết nối giúp bạn. Ví dụ:

```csharp
var DbCStringBuilder = new SqlConnectionStringBuilder();
DbCStringBuilder["Server"] = "127.0.0.1,1433";
DbCStringBuilder["Database"] = "xtlab";
DbCStringBuilder["User Id"] = "SA";
DbCStringBuilder["Password"] = "Password123";

string sqlConnectStr = DbCStringBuilder.ToString();
using var connection = new SqlConnection(sqlConnectStr);

connection.Open();
// Thực hiện  các tác vụ ...
```

###### Đọc thông tin kết nối từ file config

- Bạn có thể lưu chuỗi kết nối ở một cấu hình sau đó khi chạy chương trình nó sẽ đọc vào tạo thông tin kết nối, có thể sử dụng kỹ thuật `Configuration` lưu thông tin kết nối ở các định dạng file như json, ini, xml ... giả sử dùng định dạng json, hãy thêm các package như hướng dẫn tại config với json

```bash
dotnet add package Microsoft.Extensions.Configuration
dotnet add package Microsoft.Extensions.Options.ConfigurationExtensions
dotnet add package Microsoft.Extensions.Configuration.Json
```

- Giả sử tạo file config có tên là `appconfig.json` có lưu chuỗi kết nối như sau:

```json
{
  "csdl": {
    "ketnoi1": "Data Source=127.0.0.1,1433;Initial Catalog=xtlab;User ID=SA;Password=Password123",
    "ketnoi2": "Data Source=localhost,1433;Initial Catalog=xtlab;User ID=SA;Password=Password123"
  }
}
```

- Ví dụ:

```csharp
using System;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;
using System.IO;

namespace ADO_01_SqlConnection
{
    class Program
    {
        // Lấy chuỗi kết nối từ file config định dạng json,
        // Điểm lưu: csl:ketnoi2
        public static string GetConnectString() {
            var configBuilder = new ConfigurationBuilder()
                       .SetBasePath(Directory.GetCurrentDirectory())      // file config ở thư mục hiện tại
                       .AddJsonFile("appconfig.json");                    // nạp config định dạng JSON
            var configurationroot = configBuilder.Build();                // Tạo configurationroot
            return configurationroot["csdl:ketnoi2"];

        }

        static void Main(string[] args)
        {
            // Exam1.Test();

            String sqlConnectString = GetConnectString();
            var connection = new SqlConnection(GetConnectString());
            connection.StatisticsEnabled = true;
            connection.FireInfoMessageEventOnUserErrors = true;

            connection.StateChange += (object  sender, StateChangeEventArgs e) => {
                    Console.WriteLine($"Trạng thái hiện tại: {e.CurrentState}, trạng thái trước: " + $"{e.OriginalState}");
            };

            // Mở kết nối
            connection.Open();

            // Thực hiện các truy vấn tại đây ...

            connection.Close();

        }
    }
}
```

###### Sử dụng ADO.NET với MySQL Server

- Đoạn code kết nối, truy vấn đến SQL Server có thể sửa lại để truy vấn MySQL như sau:

```csharp
 class Program
  {
    public class Exam1
    {
      public static void Test()
      {

        // TẠO CHUỖI KẾT NỐI bằng SqlConnectionStringBuilder
        var stringBuilder = new MySqlConnectionStringBuilder();
        stringBuilder["Server"] = "127.0.0.1";
        stringBuilder["Database"] = "xtlab";
        stringBuilder["User Id"] = "root";
        stringBuilder["Password"] = "abc123";
        stringBuilder["Port"] = "3307";


        String sqlConnectionString = stringBuilder.ToString();

        var connection = new MySqlConnection(sqlConnectionString);

        Console.WriteLine($"{"ConnectionString ",17} : {stringBuilder}");
        Console.WriteLine($"{"DataSource ",17} : {connection.DataSource}");

        // Bắt sự kiện trạng thái kết nối thay đổi
        connection.StateChange += (object sender, StateChangeEventArgs e) =>
        {
          Console.WriteLine($"Kết nối thay đổi: {e.CurrentState}, trạng thái trước: " + $"{e.OriginalState}");
        };

        // mở kết nối
        connection.Open();

        // Dùng SqlCommand thi hành SQL  - sẽ  tìm hiểu sau
        using (DbCommand command = connection.CreateCommand())
        {
          // Câu truy vấn SQL
          command.CommandText = "select * from Sanpham Limit 5";
          var reader = command.ExecuteReader();
          // Đọc kết quả truy vấn
          Console.WriteLine("\r\nCÁC SẢN PHẨM:");
          Console.WriteLine($"{"SanphamID ",10} {"TenSanpham "}");
          while (reader.Read())
          {
            Console.WriteLine($"{reader["SanphamID"],10} {reader["TenSanpham"]}");
          }
        }
        // Không dùng đến kết nối thì phải đóng lại (giải phóng)
        connection.Close();

      }
    }

    static void Main(string[] args)
    {
        Exam1.Test();
    }
  }

// Kết quả chạy
/*
ConnectionString  : server=127.0.0.1;database=xtlab;user id=root;password=abc123;port=3307
      DataSource  : 127.0.0.1
Kết nối thay đổi: Connecting, trạng thái trước: Closed
Kết nối thay đổi: Open, trạng thái trước: Open

CÁC SẢN PHẨM:
SanphamID  TenSanpham
         1 Bia 333
         2 Nước ngọt Coca cola
         3 Tương Ớt Chin-Su (250g)
         4 Dầu Đậu Nành Simply
         5 Bột cần tây sấy lạnh
Kết nối thay đổi: Closed, trạng thái trước: Open
*/
```
