###  DataAdapter DataSet và DataTable tìm hiểu và sử dụng
- Tìm hiểu cấu trúc lớp biểu diễn cấu trúc cơ sở dữ liệu, dữ liệu bảng với DataTable và DataSet, khai báo SqlDataAdapter là cầu nối để tương tác với nguồn dữ liệu, ánh xạ dữ liệu trong bộ nhớ và CSDL thực tế
######  DataAdapter, DataSet, DataTable

###### DataSet
- **DataSet** là một cấu trúc phức tạp, thành phần cơ bản của ADO.NET. Nó ánh xạ CSDL nguồn (SQL Database) vào thành các đối tượng trong bộ nhớ. **DataSet** chứa trong nó là tập hợp các đối tượng **DataTable**.
- Khởi tạo ra một đối tượng DataSet:
```csharp
DataSet dataSet = new DataSet();
```

###### DataTable
- **DataTable** là đối tượng chứa dữ liệu, nó có tên, các dòng, cột qua đó nó là ánh xạ của một bảng (Table) của CSDL.
- Một vài đoạn code về DataTable như:
```csharp
// Khởi tạo bảng với tên MyTable
DataTable table = new DataTable("MyTable");

// Thêm các cột vào bảng
table.Columns.Add("STT");
table.Columns.Add("HoTen");
table.Columns.Add("Tuoi");

// Thêm dòng liệu vào cột
table.Rows.Add(1, "XuanThuLab", 25);      // Dòng thứ nhất
table.Rows.Add(2, "Nguyen Van A", 23);    // Dòng thứ hai
table.Rows.Add(3, "Nguyen Van B", 20);    // Dòng thứ ba

// Duyệt qua các cột, in tên cột
Console.WriteLine($"Bảng {table.TableName}");
foreach (DataColumn c in  table.Columns)
{
    Console.Write($"{c.ColumnName, 20}");
}
Console.WriteLine();

// Duyệt qua các dòng và in  dữ liệu cột
for (int i = 0; i < table.Rows.Count; i++)
{
    Console.Write($"{table.Rows[i][0], 20}");             // Cột 0, hàng i
    Console.Write($"{table.Rows[i]["HoTen"], 20}");       // Cột HoTen, hàng i
    Console.Write($"{table.Rows[i]["Tuoi"], 20}");        // Cột 2, hàng i
    Console.WriteLine();
}

// Gán giá trị dữ liệu vào trường (cell)
table.Rows[2]["HoTen"] = "Họ tên mới";

// Hoặc duyệt bằng foreach liệt kê các dòng
Console.WriteLine();
foreach (DataRow r in table.Rows)
{
    Console.Write($"{r[0], 20}");
    Console.Write($"{r["HoTen"], 20}");
    Console.Write($"{r["Tuoi"], 20}");
    Console.WriteLine();
}

// Bảng MyTable
//                  STT               HoTen                Tuoi
//                    1          XuanThuLab                  25
//                    2        Nguyen Van A                  23
//                    3        Nguyen Van B                  20

//                    1          XuanThuLab                  25
//                    2        Nguyen Van A                  23
//                    3          Họ tên mới                  20
```

- DataTable có thể đưa vào trong DataSet, ví dụ
```csharp
dataSet.Tables.Add(table);
```
- Xây dựng phương thực hiện thị dữ liệu DataTable để dùng cho các ví dụ sau:
```csharp
static void ShowDataTable(DataTable table)
{
    Console.WriteLine("Bảng: " + table.TableName);
    // Hiện thị các cột
    foreach (DataColumn column in table.Columns)
    {
        Console.Write($"{column.ColumnName, 15}");
    }
    Console.WriteLine();

    // Hiện thị các dòng dữ liệu
    int number_cols = table.Columns.Count;
    foreach (DataRow row in table.Rows) {
        for (int i = 0; i < number_cols; i++)
        {
            Console.Write($"{row[i], 15}");
        }
        Console.WriteLine();
    }

}
```

###### DataAdapter
- **DataAdapter** là lớp tạo ra cầu nối giữa DataSet (các bảng) với nguồn dữ liệu (Database - Table) - từ đó có thể lấy dữ liệu nguồn về DataSet, dữ liệu được biên tập (insert, update, delete) trong DataSet - sau đó cập nhật trở lại nguồn.
- Một đối tượng **DataAdapter** có các thuộc tính quan trọng để tạo ra các thao tác tương tác với Database như:
- **SelectCommand** thuộc tính chứa đối tượng SqlCommand, nó chạy khi lấy dữ liệu bằng cách gọi phương thực **Fill**
- **InsertCommand** thuộc tính chứa đối tượng SqlCommand, chạy khi thực hiện thêm dữ liệu
- **UpdateCommand** thuộc tính chứa đối tượng SqlCommand, chạy khi thực hiện cập nhật
- **DeleteCommand** thuộc tính chứa đối tượng SqlCommand, chạy khi thực hiện xóa dòng dữ liệu
- Ví dụ: Bảng `Nhanvien` có các trường `NhanviennID`,`Ten`,`Ho` tạo DataAdapter làm cầu nối giữa DataSet và bảng đó
```csharp
// Tạo kết nối
var sqlconnectstring = @"Data Source=localhost,1433;
                         Initial Catalog=xtlab;
                         User ID=SA;Password=Password123";
var connection = new SqlConnection(sqlconnectstring);
connection.Open();

// TẠO DataAdapter
SqlDataAdapter adapter = new SqlDataAdapter();

// Thiết lập bảng trong DataSet ánh xạ tương ứng có tên là Nhanvien
adapter.TableMappings.Add("Table", "Nhanvien");

// SelectCommand - Thực thi khi gọi Fill lấy dữ liệu về DataSet
adapter.SelectCommand = new SqlCommand(@"SELECT NhanviennID,Ten,Ho FROM Nhanvien" ,connection);

// InsertCommand - Thực khi khi gọi Update, nếu DataSet có chèn dòng mới (vào DataTable)
// Dữ liệu lấy từ DataTable, như cột Ten tương  ứng với tham số @Ten
adapter.InsertCommand = new SqlCommand(@"INSERT INTO Nhanvien (Ten, Ho) VALUES (@Ten, @Ho)", connection);
adapter.InsertCommand.Parameters.Add("@Ten", SqlDbType.NVarChar, 255, "Ten");
adapter.InsertCommand.Parameters.Add("@Ho", SqlDbType.NVarChar, 255, "Ho");

// DeleteCommand  - Thực thi khi gọi Update, nếu có remove dòng nào đó của DataTable
adapter.DeleteCommand = new SqlCommand(@"DELETE FROM Nhanvien WHERE NhanviennID = @NhanviennID", connection);
var pr1 = adapter.DeleteCommand.Parameters.Add(new SqlParameter("@NhanviennID", SqlDbType.Int));
   pr1.SourceColumn = "NhanviennID";
   pr1.SourceVersion = DataRowVersion.Original;  // Giá trị ban đầu

// UpdateCommand -  Thực thi khi gọi Update, nếu có chỉnh sửa trường dữ liệu nào đó
adapter.UpdateCommand = new SqlCommand(@"UPDATE Nhanvien SET Ho=@Ho, Ten = @Ten
                                         WHERE NhanviennID = @NhanviennID", connection);
adapter.UpdateCommand.Parameters.Add("@Ten", SqlDbType.NVarChar, 255, "Ten");
adapter.UpdateCommand.Parameters.Add("@Ho", SqlDbType.NVarChar, 255, "Ho");
var pr2 = adapter.UpdateCommand.Parameters.Add(
    new SqlParameter("@NhanviennID", SqlDbType.Int)
    { SourceColumn = "NhanviennID" });
pr2.SourceVersion  = DataRowVersion.Original;



DataSet dataSet = new DataSet();

// Thực hiện lấy dữ liệu từ nguồn về DataSet
adapter.Fill(dataSet);
// Lấy DataTable kết quả và hiện thị
DataTable dataTable = dataSet.Tables["Nhanvien"];
ShowDataTable(dataTable);

// Ví dụ thêm một dòng dữ liệu
var rowadd = dataTable.Rows.Add();
rowadd["Ho"] = "Họ mới";
rowadd["Ten"] = "Tên mới";
adapter.Update(dataSet);
// Nạp lại
adapter.Fill(dataSet);

// Ví dụ cập nhật dòng thứ 10
var rowedit = dataTable.Rows[10];
rowedit["Ho"] = "Nguyễn";
adapter.Update(dataSet);

// Ví dụ xóa một dòng đữ thứ 10
var rowdelete = dataTable.Rows[10];
rowdelete.Delete();
adapter.Update(dataSet);




connection.Close();
```