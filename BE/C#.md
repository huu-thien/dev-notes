# CHƯƠNG 1: C# CƠ BẢN

### 1. Giới thiệu .NET

- Là một nền tảng thống nhất phát triển nhiều loại ứng dụng từ mobile, desktop, cho đến web được phát triển bởi Microsoft
- `.NET Framework` được Microsoft đưa ra chính thức từ năm 2002. `.NET Framework` chỉ hoạt động trên windows. Những nền tảng ứng dụng như WPF, Winform, ASP.NET (1-4) hoạt động dựa trên .NET Framework
- Cho đến năm 2013, Microsoft định hướng đi đa nền tảng và phát triển `.NET core`. `.NET core` hiện được sử dụng trong các ứng dụng Universal Windows platform và `ASP.NET Core`. Từ đây, C# có thể được sử dụng để phát triển các laoij ứng dụng đa nền tảng trên các hệ điều hành khác nhau.
- `C#` là ngôn ngữ lập trình hiện đại, hướng đối tượng và được xây dựng trên nền tảng của 2 ngôn ngữ mạnh nhất là C++ và Java
- Run C# trên VS Code: `dotnet run --project NameProject`

### 2. Cấu trúc chương trình C#

- File .`sln` : Slution
- Trong 1 Slution có nhiều Project
- File `.csproj` : file project, bên trong của nó chứa code biên dịch để chạy, có thể ửa những thuộc tính của project
- File `bin`: dùng để chứa code biên dịch hoặc code release sản phẩm
- `Dependences`: tham chiếu đến những thư viện của C#
- Cấu trúc mỗi file: `namespace -> class -> Method`

```csharp
namespace DotNetTedu
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World");
        }
    }
}
```

### 3. Tổng quan về biến và kiểu dữ liệu

- Biến là một khái niệm cơ bản và quan trọng nhất của tất cả các ngôn ngữ lập trình.
- Biến là một không gian chứa một giá trị dữ liệu, và có thể được gán đi gán lại các giá trị khác
  nhau trên cùng 1 biến.
- Biến cấu tạo bởi kiểu dữ liệu, tên biến và dữ liệu lưu trong biến (có thể có hoặc chưa có)
- **Với mỗi loại dữ liệu chúng ta cần một kiểu dữ liệu tương ứng để lưu trữ loại dữ liệu đó**
- `Type name = value`

```csharp
    float pi = 3.1415;
    bool isOpen = true;
    string myName = "Thien";
    char at = "@"
```

### 3. Tổng quan về biến và kiểu dữ liệu

### 4. Vòng lặp, sử dụng `break` và `continue`

- Từ khóa `break` dừng vòng lặp ngay lặp tức
- Từ khóa `continue` bỏ qua lần lặp hiện tại

### 5. Cấu trúc mảng và dữ liệu mảng

- `Mảng` là một cấu trúc dữ liệu được sử dụng dụng để lưu trữ một tập dữ liệu cùng kiểu

```csharp
    int[] bienMang; // khai báo biến mảng kiểu phần tử là int (chưa khởi tạo)
    // có thể khởi tạo ngay khi khai báo int[] bienMang = new int[5];
    string[] studentNames = new string[10];

    // mảng 3 phần tử chuỗi ký tự, mỗi phần tử được gán ngay giá trị chuỗi cụ thể
    string[] productNames = new string[3] {"Iphone", "Samsung", "Nokia"};
    // mảng 3 phần tử double, mỗi phần tử được gán giá trị luôn
    double[] productPrices = new double[3] {100, 200.5, 10.1};
    // hoặc

    string[] productNames = {"Iphone", "Samsung", "Nokia"};
    double[] productPrices = {100, 200.5, 10.1};
```

- Các giá trị khởi tạo gán cho phần tử mảng được liệt kế cách nhau bởi `,` và đặt trong `{}`

### 6. Thuộc tính và phương thức đối tượng mảng

- `Length` : Thuộc tính cho biết số lượng phần tử trong mảng
- `Rank`: Thuộc tính cho biết số chiều mảng
- `Clone()`: Copy (nhân bản) đối tượng mảng
- `GetValue(index)`: Lấy giá trị phần tử trong mảng
- `Min()`: Trả về giá trị nhỏ nhất trong mảng
- `Max()`: Trả về giá trị lớn nhất trong mảng
- `Sum()`: Trả về giá trị tổng cộng các phần tử

Chú ý cần nạp thư viện Linq bằng using System.Linq; ở đầu để có phương thức Max(), Min(), Sum()

**Một số phương thức tĩnh trong Array áp dụng vào mảng như:**

- `Array.BinarySearch(array, value)`: Tìm kiếm phần tử trong mảng đã được sắp xếp, trả về chỉ số nếu tìm thấy
- `CopyTo(array, indexStart)`: Sao chép phần tử mảng này sang mảng khác
- `Array.Clear(array, index, length)`: Thiết lập phần tử mảng nhận giá trị mặc định
- `bool Exists<T> (array, Predicate<T> match);`: Kiểm tra có phần tử trong mảng thỏa mãn match
- `Fill<T> (array, value);` Gán các phần tử của mảng bằng value
- `T Find<T> (array, Predicate<T> match);`: Tìm phần tử mảng
- `int FindIndex<T> (array, Predicate<T> match);`: Tìm phần tử mảng, trả về chỉ số nếu thấy
- `T[] FindAll<T> (array, Predicate<T> match);`: Tìm tất cả phần tử mảng
- `int IndexOf(array, value)`: Tìm chỉ số của phần tử
- `ForEach(array, Action<T> action)`: Thi hành action trên mỗi phần tử
- `Sort(array)`: Sắp xếp

```csharp
    int[] myArray = {1,3,5,19, 10, 20, 40, 40};
    foreach (int element in myArray)
    {
        Console.WriteLine(element);
    }
```

- Có thể dùng `var` để khai báo biến có kiểu ngầm định

### 7. Mảng nhiều chiều

- Cú pháp để khai báo mảng nhiều chiều như sau:

```csharp
    type[, , … ,] varname = new type[size1, size2, …, sizeN];
```

```csharp
    int[,] myvar = new int[3,4] {{1,2,3,4}, {0,3,1,3}, {4,2,3,4}};          // khai báo và khởi tạo mảng 2 chiều

    for (int i = 0; i <= 2; i ++)                                           // duyệt qua từng hàng
    {
        for(int j = 0; j <=3; j++)                                          // duyệt qua từng cột
        {
            Console.Write(myvar[i,j] + " ");
        }
        Console.WriteLine();
    }
    // 1 2 3 4
    // 0 3 1 3
    // 4 2 3 4
```

- `Mảng trong mảng`

  - Khi một mảng nào đó, mà các phần tử của mảng lại là các mảng - đó là mảng trong mảng - `jagged`

  - Ví dụ, nếu ký hiệu `int[]` là kiểu mảng mà các phần tử số nguyên, vậy khi viết `int[][]` sẽ là kiểu mảng mà các phần tử lại là mảng số nguyên

```csharp
    int[][] myArray = new int[][] {
                                    new int[] {1,2},
                                    new int[] {2,5,6},
                                    new int[] {2,3},
                                    new int[] {2,3,4,5,5}
                                };

    foreach (var arr in myArray) {
        foreach (var e in arr) {
            Console.Write(e + " ");
        }
        Console.WriteLine();
    }

    // 1 2
    // 2 5 6
    // 2 3
    // 2 3 4 5 5
```

### 7. Phương thức - Method

- `Phương thức (method, gần giống function hàm trong lập trình hướng thủ tục)` trong C# là một nhóm các lệnh nhằm thực hiện một tác vụ nào đó, dùng phương thức để sử dụng lại code, dễ dàng kiểm tra và bảo trì ứng dụng. Phương thức có thể thuộc về một đối tượng lớp nào đó, hoặc không tuy nhiên khai báo phương thức thì phải khai báo trong một lớp nào đó.
- Cú pháp khai báo một phương thức cơ bản như sau:

```csharp
    <Access Modifiers> <return type> <name_method>(<parameters>)
    {
        // Các câu lệnh trong phương thức
    }
```

- `Access Modifiers` cho biết cấp độ được phép truy cập đến hàm này, có các mức độ như `public`, `private`, `protect`, `internal` ... Nếu thiếu thành phần này thì mặc định coi là `internal`. Ngoài ra đếu cho vào từ khóa `static` ở trước `Access Modifiers` thì phương thức (hàm) đó gọi là `PHƯƠNG THỨC TĨNH` (Truy cập được mà không cần tạo đối tượng lớp), thường dùng kèm với Access Modify tên public để tạo các hàm chức năng, tiện ích.
- `return type` là kiểu trả về của hàm như `int`, `double`, `string` ... nếu hàm không có kiểu trả về thì đề từ khóa void.
- `name_method`: tên của phương thức do bạn đặt.
- `parameters` là các tham số của hàm nếu có, các tham số khai báo theo mẫu kiểu tên như int thamso1, nhiều tham số thì cách nhau bởi dấu ,

**Truyền tham số tham chiếu và tham trị C#**

- Có hai hình thức truyền tham số cho phương thức khi nó được gọi là `tham trị` và `tham chiếu`

  - `tham trị` là cách thức mặc định, ta đã sử dụng ở phần trên. Có nghĩa là gán tham số bằng một biến, thì giá trị của biến được copy và sử dụng trong phương thức như biến cục bộ, còn bản thân biến bên ngoài không hề ảnh hưởng.
  - `tham chiếu` thì bản thân biến ở tham số sẽ được hàm sử dụng trực tiếp (tham chiếu) chứ không tạo ra một biến cục bộ trong hàm, nên nó có tác động trực tiếp đến biến này bên ngoài. Để sử dụng được tham chiếu thì khai báo tham số ở phương thức, cũng như khi gọi cần cho thêm từ khóa ref

- Ví dụ tham trị:

```csharp
    `public static void ThamChieuThamTri(int x) {
        x = x * x;
        Console.WriteLine(x);
    }
    //Khi sử dụng:

    int a = 2;
    ThamChieuThamTri(a);
    Console.WriteLine(a);
    // In ra
    // 4
    // 2`
```

- Ví dụ tham chiếu:

```csharp
    public static void ThamChieuThamTri(ref int x) {
    x = x * x;
    Console.WriteLine(x);
    }
    // Khi sử dụng:

    int a = 2;
    ThamChieuThamTri(ref a);
    Console.WriteLine(a);
    // In ra
    // 4
    // 4
```

**Tham chiếu với out**

- Ngoài dùng từ khóa `ref` trong khai báo tham chiếu, bạn cũng có thể thay thế nó bằng từ khóa `out`, điểm khác biệt duy nhất là nếu dùng từ khóa `out` thì tham số không cần khởi tạo khi truyền cho phương thức, còn dùng `ref` thì biến làm tham số phải khởi tạo.

```csharp
    public static void OutExample(out int x) {
        x = 100;
    }
    Khi sử dụng:

    int a;             // biến a chưa khởi tạo
    OutExample(out a); // Giờ a = 100;
```

**Phương thức Đệ quy**

- Đệ quy là phương thức khai báo, trong thân của nó có gọi lại chính nó. Ví dụ cổ điển ứng dụng đệ quy là tính giai thừa của một số ví dụ 5! = 5.4.3.2.1

```csharp
    public static int giaithua(int a) {
        if (a == 1)
            return 1; // Kết thúc đệ quy

        return
            a * giaithua (a - 1);  // Đệ quy
    }
    Console.WriteLine(giaithua(5)); //120
```

- Đệ quy khá giống vòng lặp, bạn cần có điều kiện dừng để tránh đệ quy vô tận.

- Hầu hết phương thức đệ quy có thể chuyển qua sử dụng các vòng lặp, nên cũng lưu ý nếu vòng lặp đơn giản thì nên dùng lặp.

- Trong nhiều ví dụ test về hiệu năng - thì đệ quy chậm hơn việc sử dụng lặp nhiều.

**Quá tải phương thức - Over loading**

- Phương thức cùng tên khác tham số

### 8. Chuyển số thành chữ

- Dưới đây là phương thức tĩnh code C# có chức năng chuyển số thành chữ, tiện dụng cho các ứng dụng như chuyển số tiền thành chữ cho các ứng dụng như kế toán ...

```csharp
using System;

namespace XTL
{
  public static class Utils
  {
    ///
    /// Chuyển phần nguyên của số thành chữ
    ///
    /// Số double cần chuyển thành chữ
    /// Chuỗi kết quả chuyển từ số
    public static string NumberToText(double inputNumber, bool suffix = true)
    {
        string[] unitNumbers = new string[] { "không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín" };
        string[] placeValues = new string[] { "", "nghìn", "triệu", "tỷ" };
        bool isNegative = false;

        // -12345678.3445435 => "-12345678"
        string sNumber = inputNumber.ToString("#");
        double number = Convert.ToDouble(sNumber);
        if (number < 0)
        {
          number = -number;
          sNumber = number.ToString();
          isNegative = true;
        }


        int ones, tens, hundreds;

        int positionDigit = sNumber.Length;   // last -> first

        string result = " ";


        if (positionDigit == 0)
          result = unitNumbers[0] + result;
        else
        {
          // 0:       ###
          // 1: nghìn ###,###
          // 2: triệu ###,###,###
          // 3: tỷ    ###,###,###,###
          int placeValue = 0;

          while (positionDigit > 0)
          {
            // Check last 3 digits remain ### (hundreds tens ones)
            tens = hundreds = -1;
            ones = Convert.ToInt32(sNumber.Substring(positionDigit - 1, 1));
            positionDigit--;
            if (positionDigit > 0)
            {
              tens = Convert.ToInt32(sNumber.Substring(positionDigit - 1, 1));
              positionDigit--;
              if (positionDigit > 0)
              {
                hundreds = Convert.ToInt32(sNumber.Substring(positionDigit - 1, 1));
                positionDigit--;
              }
            }

            if ((ones > 0) || (tens > 0) || (hundreds > 0) || (placeValue == 3))
              result = placeValues[placeValue] + result;

            placeValue++;
            if (placeValue > 3) placeValue = 1;

            if ((ones == 1) && (tens > 1))
              result = "một " + result;
            else
            {
              if ((ones == 5) && (tens > 0))
                result = "lăm " + result;
              else if (ones > 0)
                result = unitNumbers[ones] + " " + result;
            }
            if (tens < 0)
              break;
            else
            {
              if ((tens == 0) && (ones > 0)) result = "lẻ " + result;
              if (tens == 1) result = "mười " + result;
              if (tens > 1) result = unitNumbers[tens] + " mươi " + result;
            }
            if (hundreds < 0) break;
            else
            {
              if ((hundreds > 0) || (tens > 0) || (ones > 0))
                result = unitNumbers[hundreds] + " trăm " + result;
            }
            result = " " + result;
          }
        }
        result = result.Trim();
        if (isNegative) result = "Âm " + result;
        return result + (suffix ? " đồng chẵn" : "");
      }
  }
}
```

- Sử dụng như sau:

```csharp
var snumber = XTL.Utils.NumberToText(566776768989);
//năm trăm sáu mươi sáu tỷ bảy trăm bảy mươi sáu triệu bảy trăm sáu mươi tám nghìn chín trăm tám mươi chín đồng chẵn
```

### 9. Tạo thư viện lớp C# NET và chia se lên nuget.org

###### Add pakage

- dotnet add package `Name Pakage` --version xx.xx.xx

```bash
    dotnet add package Newtonsoft.Json --version 13.0.3
```

###### Remove Pakage

- dotnet remove package `Name Package`

```bash
    dotnet remove package Newtonsoft.Json
```

###### Kiểm tra và phục hồi các package

```bash
    dotnet restore
```

```csharp
    <ItemGroup>
        <PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
    </ItemGroup>
```

###### Một dự án tham chiếu đến 1 thư viện

- dotnet add `ten_du_an.csproj` reference `thu_vien.csproj`

### 10. Lập trình hướng đối tượng

- Lập trình hướng đối tượng `(Object-oriented programming - OOP)`, là kỹ thuật lập trình mà điều cốt yếu cần trừu tượng hóa các vấn đề thành các đối tượng (đối tượng có dữ liệu và các ứng xử). Kỹ thuật OOP có 4 tính chất:
  - `Tính trừu tượng` (abstraction) mô tả một cách tổng quát hóa (tập trung vào thông tin cần thiết) mà không chi tiết thông tin về các đối tượng, không gắn cứng với một đối tượng cụ thể cần mô tả (triển khai với `interface`, `abstract`)
  - `Tính đóng gói` (encapsulation) dữ liệu đối tượng cố gắng như nằm trong một hộp đen, các thành phần khác bên ngoài đối tượng không trực tiếp tác động đến dữ liệu (bên ngoài truy cập, tác động thông qua các phương thức public cho phép, qua setter, getter ...)
  - `Tính đa hình` (polymorphism) đối tượng ứng xử khác nhau tùy trường hợp cụ thể
  - `Tính kế thừa` (inheritance) đặc tính của lớp được kế thừa từ một lớp khác

### 10. Lớp - Class

- Trong lập trình hướng đối tượng, `lớp (class)` là một kiểu dữ liệu tham chiếu nó định nghĩa một tập hợp các biến (trường dữ liệu, thuộc tính) và phương thức
- Từ lớp đó sinh ra các `đối tượng (object)`, các đối tượng này còn gọi là bản triển khai của lớp (instance of a class), mỗi đối tượng có giá trị dữ liệu cụ thể (lưu trong thành viên biến, thuộc tính). Các phương thức (method) - định nghĩa ra các ứng xử của đối tượng - dựa theo dữ liệu của chúng.

###### Khai báo lớp, sử dụng lớp

```csharp
//Cú pháp cơ bản như sau:

<Access Modifiers> class Class_Name {
    // khai báo các thành viên dữ  liệu (thuộc tính, biến trường dữ liệu)
     // khai báo các thành viên  hàm (phương thức)
}
```

- Trong đó `Access Modifiers` áp dụng khai báo cho lớp có thể là: `public` (không giới hạn truy cập) hoặc `internal` (mặc định nếu không khai báo, giới hạn truy cập trong cùng assembly - chương trình). Nếu lớp con khai báo lồng trong một lớp khác còn có thể sử dụng `private` (chỉ truy cập được từ lớp chứa nó)
- Khai báo và khởi tạo thành viên dữ liệu (biến, trường dữ liếu) giống với khai báo biến thông thường, nhưng có thêm `Access Modifiers` để quy định cấp độ truy cập. Đối với thành viên lớp (biến, thuộc tính, phương thức) thì có thể áp dụng các `access modifiers` sau:
  - `public` : không giới hạn phạm vi truy cập
  - `protected` : chỉ truy cập trong nội bộ lớp hay các lớp kế thừa
  - `private` : (mặc định) chỉ truy cập được từ các thành viên của lớp chứa nó
  - `internal` : chỉ truy cập được trong cùng assembly (dll, exe)
  - `protected internal`: truy cập được khi cùng assembly hoặc lớp kế thừa
  - `private protected`: truy cập từ lớp chứa nó, lớp kế thừa nhưng phải cùng assembly

```csharp
// File VuKhi.cs
using System;

namespace CS007_Class
{
    public class VuKhi
    {
        /// Tên của vũ khí: Súng Lục, Súng Trường, Dao ...
        public string name = "Tên Vũ Khí";

        /// Độ sát thương 10 cấp độ
        int dosatthuong = 0;

        /// Phương thức khởi tạo (được gọi khi toán tử new tạo đối tượng)
        /// tên phương thức trùng tên lớp, trường hợp này không tham số
        public VuKhi()
        {
            this.dosatthuong = 1;
        }

        /// Phương thức khởi tạo (được gọi khi toán tử new tạo đối tượng)
        /// tên phương thức trùng tên lớp, trường hợp này có tham số
        public VuKhi(string name, int dosatthuong)
        {
            this.name  = name;
            SetDoSatThuong(dosatthuong);
        }

        /// Hàm này thiết lập  độ sát thương
        public void SetDoSatThuong(int mucdo)
        {
            this.dosatthuong = mucdo;
        }

        // In ra: Tên vu khí: * * * * * * * * (bằng độ sát thương)
        public void TanCong()
        {
            Console.Write(name + ": \t");
            for (int i = 0; i < dosatthuong; i++)
            {
                Console.Write(" * ");
            }
            Console.WriteLine();
        }
    }
}
```

###### Tạo và sử dụng đối tượng

```csharp
// Khai báo và khởi tạo đối tượng luôn
var ob1 = new ClassName();

// Khai báo, sau đó khởi tạo
ClassName ob2;
ob2 = new ClassName();
```

- Sau khi đối tượng lớp (object) được tạo, bạn có thể truy cập đến các thuộc tính, trường dữ liệu và phương thức của đối tượng đó bằng ký hiệu `.` theo quy tắc `object.tên_thuộc_tính` hay `object.tên_phương_thức`

```csharp
static void Main(string[] args)
{
    var sungluc = new VuKhi();              // Khai báo và khởi tạo
    sungluc.name = "SÚNG LỤC";              // Truy cập và gán thuộc tính
    sungluc.SetDoSatThuong(5);             // Truy cập (gọi) phương thức

    VuKhi sungtruong = new VuKhi();
    sungtruong.name = "SÚNG TRƯỜNG";
    sungtruong.SetDoSatThuong(20);

    sungluc.TanCong();                      // Gọi phương thức
    sungtruong.TanCong();                   // Gọi phương thức

    //Kết quả chạy
    SÚNG LỤC:        *  *  *  *  *
    SÚNG TRƯỜNG:     *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *

}
```

###### Từ khóa this

- Từ khóa `this` dùng trong các phương thức của lớp, nó tham chiếu đến đối tượng hiện tại sinh ra từ lớp. Sử dụng this để tường minh, tránh sự không rõ ràng khi truy cập thuộc tính, phương thức hoặc để lấy đối tượng lớp làm tham số cho các thành phần khác ...
- Ví dụ, hàm `SetDoSatThuong`, bạn có thể viết:

```csharp
public void SetDoSatThuong(int dosatthuong)
{
    this.dosatthuong = dosatthuong;
}
```

###### Phương thức khởi tạo - Constructor

- Phương thức khởi tạo là phương thức của lớp, nó được thi hành ngay khi đối tượng được tạo (bởi toán tử new), phương thức khởi tạo có tên trùng với tên của lớp, không có kiểu trả về, bạn có thể tạo nhiều phương thức khởi tạo - các phương thức này đều cùng tên với tên lớp nhưng tham số khác nhau. Lúc này khi khởi tạo đối tượng với toán tử new tùy tham số khởi tạo mà nó sẽ gọi phương thức khởi tạo tương ứng.

```csharp
public class VuKhi
{
    /...
    public VuKhi()
    {
        this.dosatthuong = 1;
    }

    public VuKhi(string name, int dosatthuong)
    {
        this.name  = name;
        SetDoSatThuong(dosatthuong);
    }
    //...
}
```

- Lúc này có thể sử dụng như sau:

```csharp
// Khởi tạo đối tượng, hàm tạo VuKhi() được gọi
var sungluc = new VuKhi();
sungluc.name = "SÚNG LỤC";
sungluc.SetDoSatThuong(5);

// Khởi tạo đối tượng, hàm tạo VuKhi(name, dosatthuong) được gọi
VuKhi sungtruong = new VuKhi(name: "SÚNG TRƯỜNG", dosatthuong: 20);
```

- Kết quả tương tự như ví dụ trên, việc sử dụng hàm khởi tạo đảm bảo dữ liệu của đối tượng bắt buộc phải khởi tạo ngay khi đối tượng đó được tạo - tránh việc sử dụng đối tượng mà dữ liệu không chính xác.

###### Hàm hủy - Distructor

- Hàm hủy được chạy một cách tự động khi đối tượng bị xóa khỏi bộ nhớ
- Mục đích của hàm hủy để giải phóng tài nguyên mà nó đang chiếm giữ

```csharp
namespace NetBasic;

public class Student
{
    public string name;


    ~Student()
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine($"Phuong thuc huy sinh vien {name}");
        Console.ResetColor();
    }

    public Student(string name)
    {
        Console.WriteLine($"Khoi tao sinh vien: {name}");

        this.name = name;
    }
}

```

- Khi muốn tiến hành quản lý việc thực hiện phương thức hủy thì class phải kế thừa lớp có tên `IDisposable`
- Có hàm `Dispose()` sẽ chạy khi đối tượng ra khỏi phạm vi (bị thu hồi bộ nhớ) (dùng `using`)

```csharp
/// Student.cs
namespace NetBasic;

public class Student : IDisposable
{
    public string name;


    ~Student()
    {
        ReleaseUnmanagedResources();
    }

    public Student(string name)
    {
        Console.WriteLine($"Khoi tao sinh vien: {name}");

        this.name = name;
    }

    private void ReleaseUnmanagedResources()
    {
        // TODO release unmanaged resources here
    }

    public void Dispose()
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine($"Phuong thuc huy IDisposable {name}");
        Console.ResetColor();
        ReleaseUnmanagedResources();
        GC.SuppressFinalize(this);
    }
}

/// Program.cs

using Newtonsoft.Json;

namespace NetBasic
{

    internal class Program
    {
        static void Test()
        {
            using Student sv = new Student("Ten SV");
            Console.WriteLine("1");
            Console.WriteLine("2");
            Console.WriteLine("3");

        }
        public static void Main()
        {
            Test();
        }
    }
};

// Khoi tao sinh vien: Ten SV
// 1
// 2
// 3
// Phuong thuc huy IDisposable Ten SV

```

###### Quá tải (Overloading) phương thức

- Kỹ thuật quá tải phương thức `(Method Overloading)` là cách thức triển khai khái niệm tính đa hình của lập trình hướng đối tượng. Quá tải phương thức là các phương thức có cùng tên nhưng tham số khác nhau (hàm có thể trả về kiểu dữ liệu khác nhau)
  `Tính đa hình (polymorphism) là cách ứng xử của đối tượng - ứng xử này là khác nhau tùy thuộc vào tình huống cụ thể.`

```csharp
public class OverloadingExample {

    public static int Sum(int a, int b)
    {
        return a + b;
    }

    public static double Sum(double a, double b)
    {
        return a + b;
    }
}
```

- Lớp trên có hàm `Sum` quá tải, tùy thuộc vào kiểu tham số mà hàm Sum cụ thể được gọi.

```csharp
double a = 1;
double b = 2;
var c  = OverloadingExample.Sum(a, b); // c = 3 có kiểu double
```

```csharp
int a = 1;
int b = 2;
var c  = OverloadingExample.Sum(a, b); // c = 3 nhưng có kiểu int
```

###### Tìm hiểu tính đóng gói lập trình hướng đối tượng

- `Tính đóng gói` mục đích hạn chế tối đa việc can thiệp trực tiếp vào dữ liệu, hoặc thi hành các tác vụ nội bổ của đối tượng. Nói cách khác, một đối tượng là hộp đen đối với các thành phần bên ngoài, nó chỉ cho phép bên ngoài tương tác với nó ở một số phương thức, thuộc tính, trường dữ liệu nhất định - hạn chế.
- `C#` triển khai tính đóng gói này chính là sử dụng các `Access Modifiers`: `public` priva`te `protected` `internal` khi khai báo lớp, phương thức, thuộc tính, trường dữ liệu (biến).
  - `public` thành viên có thể truy cập được bởi code bât kỳ đâu, ngoài đối tượng, không có hạn chế truy cập nào.
  - `private` phương thức, thuộc tính, trường khai báo với private chỉ có thể truy cập, gọi bởi các dòng code cùng lớp.
  - `protected` phương thức, thuộc tính, trường chỉ có thể truy cập, gọi bởi các dòng code cùng lớp hoặc các lớp kế thừa nó.
  - `internal` truy cập được bởi code ở cùng assembly (file).
  - `protected internal` truy cập được từ code assembly, hoặc lớp kế thừa nó ở assembly khác.
  - `private protected` truy cập được code khi cùng assembly trong cùng lớp, hoặc các lớp kế thừa nó.
- Khi không chỉ rõ Modify thì mặc định là private cho phương thức, thuộc tính, trường. Assembly là file exe, dll

```csharp
class Student
{
    private string Name;
}

//  Khi sử dụng
var s = new Student();
s.Name = "ABC";
```

- Biên dịch sẽ lỗi `error CS0122: 'Student.Name' is inaccessible due to its protection level`. Vì trường Name là private không thể truy cập bằng code bên ngoài lớp như trên. Nhưng nếu thay bằng public thì không lỗi.

###### Thuộc tính trong lớp

**Trường dữ liệu của lớp**

- Trường dữ liệu - khai báo như biến trong lớp, nó là thành viên của lớp, nó là biến. Trường dữ liệu có thể sử dụng bởi các phương thức trong lớp, hoặc nếu là public nó có thể truy cập từ bên ngoài, nhưng cách hay hơn để đảm bảo tính đóng gói khi cần truy cập thuộc tính hãy sử dụng phương thức, còn bản thân thuộc tính là `private`. Chúng ta đã sử dụng các trường dữ liệu ở những ví dụ trên.

**Thuộc tính, bộ truy cập accessor setter/getter**

- Ngoài cách sử dụng trường dữ liệu, khai báo như biến ở phần trước, khai báo `THUỘC TÍNH` tương tự nhưng nó có cơ chế `accessor` (bộ truy cập), một cơ chế hết sức linh hoạt khi bạn đọc / ghi dữ liệu vào thuộc tính. Hãy tìm hiểu qua một ví dụ sau:

```csharp
class Student
{
    private string name; // đây là trường dữ liệu
}
```

- Lớp này có một trường dữ liệu private là name. Giờ ta sẽ khai báo một thuộc tính có tên Name với modify là public, thuộc tính này khi đọc sẽ thi hành một đoạn code gọi là get, khi ghi (gán) dữ liệu nó thi hành đoạn code gọi là set, thuộc tính Name sẽ phối hợp cùng trường dữ liệu name

```csharp
class Student
{
    private string name;     // Đây là trường dữ liệu

    public string Name       // Đây là thuộc tính
    {
        // set thi hành khi gán, write
        // dữ liệu gán là value
        set
        {
            Console.WriteLine("Ghi dữ liệu <--" + value);
            name = value;
        }

        //get thi hành ghi đọc dữ liệu
        get {
            return "Tên là: " + name;
        }
    }
}
```

- Khi thực hiện

```csharp
var s = new Student();
s.Name = "XYZ";                                             // set thi hành
// In ra: Ghi dữ liệu <--XYZ
// Và trường name giờ bằng XYZ

Console.WriteLine(s.Name);                                  // get được thi hành
// In ra: Tên là: XYZ
```

- Bạn có thể khai báo một thuộc tính tự động, nó hoạt động giống như trường dữ liệu.

```csharp
public string Name {set; get;}
```

### 11. Phương thức khởi tạo, cú pháp khai báo phương thức khởi tạo C#

###### Giới thiệu về khởi tạo (Constructor) lớp trong C#

- Khi một đối tượng của lớp (class) hay cấu trúc (struc) được tạo, thì phương thức khởi tạo của lớp được gọi. Phương thức khởi tạo có tên cùng với tên lớp, có thể có nhiều phương thức khởi tạo nhưng mỗi phương thức có các tham số khác nhau. Phương thức khởi tạo là nơi bạn khởi tạo các giá trị dữ liệu nó giúp cho việc đọc code dễ hơn và sử dụng lớp một cách mềm dẻo hơn.
- Nếu bạn không xây dựng phương thức khởi tạo nào cho lớp, C# sẽ tạo ra một phương thức khởi tạo ngầm định, nó thiết lập giá trị các thành viên dữ liệu nhận giá trị mặc định (tùy theo kiểu dữ liệu).

###### Cú pháp khai báo phương thức khởi tạo

```csharp
class Product
{
    private string name;
    private decimal price;

    // Khai báo phương thức khởi tạo với 2 tham số
    public Product(string nameproduct, decimal priceproduct)
    {
        name = nameproduct;
        price = priceproduct;
    }

    // Khai báo phương thức khởi tạo không tham số
    public Product()
    {
        name = "Không tên";
        price = 0;
    }

    // Thuộc tính Name lấy hoặc thiết lập tên sản phẩm
    public string Name
    {
        set { name = value;}
        get { return name;}
    }
}
```

- Bạn cũng lưu ý, trong lớp có các phương thức mà thực hiện một biểu thức đơn giản, thì bạn có thể gán ngay biểu thức vào tên phương thức bằng ký hiệu =>, kể cả setter và getter, ví dụ:

```csharp
class Category
{
    private string categoryname;

    // Dùng thân biểu thức cho phương thức khởi tạo
    public Category(string nameofCategory) => categoryname = nameofCategory;
    public String Name
    {
        // Dùng thân biểu thức cho setter, getter
        set => categoryname = value;
        get => categoryname;
    }
}
```

###### Sử dụng phương thức khởi tạo trong C#

- Khi tạo đối tượng của lớp bằng toán tử new thì nó sẽ tạo đối tượng và thi hành phương thức khởi tạo tương ứng phù hợp với tham số.

```csharp
// Tạo đối tượng, không truyền tham số nên
// nó gọi phương thức khởi tạo không tham số
Product product1 = new Product();
Console.WriteLine(product1.Name); // Không tên

Product product2 = new Product("Laptop", 123);
Console.WriteLine(product2.Name); // Laptop
```

###### Phương thức khởi tạo của lớp cơ sở C#

- Trong C# các lớp có tính kế thừa, một lớp có thể kế thừa lại các thuộc tính, phương thức từ lớp khác (lớp cơ sở), phần này nói ở Kế thừa lớp trong C#, lưu ý là nếu lớp cha (cơ sở) có xây dựng phương thức khởi tạo, thì cần chỉ định rõ gọi phương thức khởi tạo nào của lớp cơ sở (truyền tham số) khi phương thức khởi tạo lớp con thi hành. Thực hiện điều này bằng cách dùng từ khóa base ở khai báo tên phương thức như ví dụ sau:

```csharp
class CategoryMobile : Category
{
  private string description;
    // Khi phương thức khởi tạo này được gọi, nó gọi phương thức khởi tạo có
    // một tham số của lớp cơ sở (Category) trước, rồi mới thi hành các code
    // trong thân của phương thức khởi tạo này
    public CategoryMobile(string nameofCategory, string mota) : base(nameofCategory)
    {
        description = mota;
    }

    public string Description
    {
        set => description = value;
        get => description;
    }

}
```

- Khi sử dụng, chay đoạn code

```csharp
CategoryMobile cat1 = new CategoryMobile("Điện thoại", "Danh mục các loại điện thoại");
Console.WriteLine(cat1.Name);
Console.WriteLine(cat1.Description);

// In ra
// Điện thoại
// Danh mục các loại điện thoại
```

###### Phương thức khởi tạo riêng tư C#

- Khi xây dựng một số lớp đặc biệt, nhất là những lớp tiện ích chỉ chứa thành viên tĩnh, bạn mong muốn chỉ ra một cách tường minh lớp này không được phép tạo đối tượng, lớp này không được phép kế thừa thì hãy cho vào một phương thức khởi tạo không tham số và chỉ ra trạng thái truy cập là private, ví dụ:

```csharp
class MyLib
{
  public static double PI = 3.14;
  private MyLib()
  {
  }
}
// Lúc này nếu dùng lớp khởi tạo đối tượng thì sẽ lỗi
MyLib my1 = new MyLib(); // Lỗi
// Kể cả dùng làm lớp cơ sở cũng lỗi
```

###### Phương thức khởi tạo tĩnh C#

- Bạn có thể xây dựng một phương thức khởi tạo không tham số có chỉ thị truy cập là static, phương thức khởi tạo này dùng để khởi tạo các thành viên dữ liệu tĩnh, nó tự động gọi khi truy cập một thành viên dữ liệu tĩnh lần đầu. Ví dụ:

```csharp
class MyColorCode
{
    public static string color_primary;
    public static string color_success;
    public static string color_danger;
    public static string color_warning;
    public static string color_info;

    // Phương thức khởi tạo tĩnh, được gọi khi lần đầu truy cập một thành viên tĩnh
    static MyColorCode()
    {
        Console.WriteLine("Static MyColorCode Contructor Call");
        color_danger = "Red";
        color_info = "Cyan";
        color_primary = "Navy";
        color_success = "Green";
        color_warning = "Yellow";
    }
}
//Đoạn mã sử dụng kiểm tra:

Console.WriteLine(MyColorCode.color_danger);
Console.WriteLine(MyColorCode.color_info);
//Kết quả là

// Static MyColorCode Contructor Call
// Red
// Cyan
```

### 12. Kiểu giá trị và Kiểu tham chiếu trong C#

- `Kiểu giá trị` và `kiểu tham chiếu` là hai nhóm chính phân loại kiểu dữ liệu của C#. Một biến kiểu giá trị thì biến đó sẽ lưu giá trị của đối tượng lưu trữ, khác với kiểu tham chiếu biến chứa địa chỉ trỏ đến nơi lưu đối tượng thực. Kiểu giá trị mặc định trong các phép toán gán, truyền tham số phương thức, kể cả trả về từ hàm - thì giá trị được sao chép.

```csharp
public static void valuetypeExample()
{
    // biến a, kiểu int là kiểu giá trị, nó lưu giá trị 100
    int a = 100;

    // kiểu giá trị khi gán, giá trị được copy
    int b = a;
    Console.WriteLine($"a = {a}, b = {b}");

    // b gán giá trị mới, a không thay đổi - vì chúng không cùng tham
    // chiếu đến 1 đối tượng chung, mà mỗi biến lưu một giá trị
    b = 200;
    Console.WriteLine($"a = {a}, b = {b}");

    // a = 100, b = 100
    // a = 100, b = 200
}
```

- Khi biến thuộc các kiểu sau, mặc định nó ứng xử là `kiểu giá trị`:

  - Các kiểu số nguyên như int, byte, long ...
  - Các kiểu số thực như float, double, decimal
  - Kiểu bool, kiểu char
  - Kiểu cấu trúc struct
  - Kiểu liệt kê enum
  - Kiểu Tuple

- `Các biến kiểu tham chiếu` nó chứa tham chiếu (địa chỉ nhớ) trỏ đến dữ liệu (là đối tượng), với kiểu tham chiếu hai biến, hay nhiều biến có tên khác nhau có thể cùng trỏ đến cùng mội đối tượng, khi đó dùng biến biến nào truy cập, tác động vào đối tượng đều mang lại kết quả như nhau.
- Như vậy khi dùng `kiểu tham chiếu`, truyền dữ liệu trong hàm hay các phép gán thì không phải là copy đối tượng hay giá trí mà chỉ là truyền tham chiếu (địa chỉ nhớ).
- Những biển có kiểu sau thì nó là kiểu tham chiếu:

  - Biến kiểu lớp (class), các lớp thư viện hoặc lớp do bạn định nghĩa
  - Biến kiểu delegate
  - Biến kiểu interface, các giao diện từ thư viện hoặc tự định nghĩa
  - Biến kiểu dynamic
  - Biến kiểu object
  - Biến kiểu string

- Ví dụ có lớp Student

```csharp
class Stutent
{
    public string Name;
    public Stutent(string name)
    {
        this.Name = name;
    }
}
```

- Vì là lớp nên biến kiểu Student trên sẽ là kiểu tham chiếu, ví dụ:

```csharp
Stutent a = new Stutent("Nguyễn Văn A");
Console.WriteLine(a.Name); // Nguyễn Văn A

Stutent b;
// Khi gán, tham chiếu không sao chép giá trị mà tham chiếu địa chỉ
// nên có thể có a là b, b là a, b thay đổi nghĩa là a thay đổi
b = a;

b.Name = "Nguyễn Văn B";
Console.WriteLine(a.Name); // Nguyễn Văn B
```

###### Truyền tham số kiểu giá trị với dạng tham chiếu trong C#

- Có hai hình thức truyền tham số cho phương thức khi nó được gọi là `tham trị` và `tham chiếu`
  - `tham trị` là cách thức mặc định khi tham số đó là kiểu giá trị. Có nghĩa là gán tham số bằng một biến, thì giá trị của biến được copy và sử dụng trong phương thức như biến cục bộ, còn bản thân biến bên ngoài không hề ảnh hưởng.
  - `tham chiếu` là cách thức mặc định khi tham số đó là kiểu tham chiếu, thì bản thân biến ở tham số sẽ được hàm sử dụng trực tiếp (tham chiếu) chứ không tạo ra một biến cục bộ trong hàm, nên nó có tác động trực tiếp đến biến này bên ngoài.
- Nếu muốn biến kiểu giá trị nhưng được truyền vào phương thức dạng tham chiếu (giống cách thức biến tham chiếu) thì khai báo tham số ở phương thức, cũng như khi gọi cần cho thêm từ khóa `ref`

###### Ref

```csharp
public static void ThamSoThamChieu(ref int x) {
    x = x * x;
    Console.WriteLine(x);
}

int a = 2;
ThamSoThamChieu(ref a);
Console.WriteLine(a);
// In ra
// 4
// 4
```

- Ta thấy a sử dụng làm tham số cho phương thức, tham số x tham chiếu đến a, và khi trong hàm thay đổi x, nghĩa là thay đổi a bên ngoài. (đều in ra 4)
- Ngoài ra nếu gọi `ThamChieuThamTri(5)` thì sẽ lỗi, vì tham chiếu yêu cầu đối số này phải là biến.

###### Tham chiếu với out

- Ngoài dùng từ khóa ref trong khai báo tham chiếu, bạn cũng có thể thay thế nó bằng từ khóa out, điểm khác biệt duy nhất là nếu dùng từ khóa out thì tham số không cần khởi tạo khi truyền cho phương thức, còn dùng ref thì biến làm tham số phải khởi tạo.

```csharp
public static void OutExample(out int x) {
    x = 100;
}
Khi sử dụng:

int a;             // biến a chưa khởi tạo
OutExample(out a); // Giờ a = 100;
```

### 13. Chuỗi ký tự string trong C Sharp

- Sử dụng chuỗi ký tự trong lập trình C#, cách nhập dữ liệu chuỗi, xây dựng chuỗi với StringBuilder, thêm các biểu thức vào chuỗi với tiền tố $, chuỗi nguyên bản với ký hiệu @, tìm kiếm chuỗi bằng biểu thức trình quy với lớp Regex
- Chuỗi là một tập hợp các ký tự sắp xếp có vị trí, nó chỉnh là một mảng các ký tự, kiểu dữ liệu chuỗi đó là string, lớp biểu diễn các chuỗi là System.String
- Có thể khai báo, khởi tạo chuỗi với kiểu string, cũng như thực hiện các phép toán trên chuỗi...

```csharp
string sExample = "Xin chào";       // Khai báo và khởi tạo chuỗi
sExample += " các bạn";             // Nối chuỗi +=, trả về "Xin chào các bạn"
sExample = sExample + "!";          // Nối chuỗi +, trả về "Xin chào các bạn!"
```

- Chuỗi như là mảng mà phần tử mảng là các ký tự, nên có thể truy cập phần tử mảng bằng indexer để đọc ký tự:

```csharp
char c = sExample[1];               // c= 'i'
```

###### Viết chuỗi nguyên bản với ký hiệu @ trong C#

- Khi viết chuỗi trong cặp dấu nháy kép "", thì các ký tự đặt biệt được xử lý với ký hiệu `\`, ví dụ nếu bạn viết:

```csharp
string s = "C:\\Abc\\xyz";
// Nếu viết string s = "C:\Abc\xyz"; sẽ lỗi
```

- Thì nội dung thực tế của chuỗi là `C:\Abc\xyz`
- Nếu muốn viết chuỗi cố định, nội dung nguyên bản - cho biết sẽ không dùng \ để xử lý ký tự đặc biệt, thì thêm `@` vào đầu chuỗi:

```csharp
string s = @"Ký tự \ được dùng để chèn ký tự đặc biệt như \n, \r";
```

- Bằng ký hiệu @ chuỗi viết thế nào thì nội dung thực tế sẽ như vậy, ngoại trừ hai ký tự `""` chuyển thành một ký tự `""`

```csharp
string s = "Anh ấy nói, ""Đây là C#"""; //~ Anh ấy nói "Đây là C#"
```

- Ngoài ra bạn có thể viết chuỗi trên nhiều dòng với ký hiệu `@`

```csharp
string s = @"Xin chào các bạn
             Tôi đang học C#";
```

###### Chèn thêm biểu thức vào chuỗi với ký hiệu `$` trong C#

- Khi viết chuỗi có ký tự $ phía trước, thì trong chuỗi đó có thể chèn các biểu thức vào chỗ có cặp `{}` : `{biểu-thức}`

```csharp
int a = 10;
int b = 2;
string s = $"Kết quả {a}/{b} là {a/b}";  // "Kết quả 10/2 là 5"
```

- Ngoài ra bạn có thể căn lề, định dạng số, ngày tháng ... tương tự như chuỗi định dạng

```csharp
Console.WriteLine($"{"VòngLặp",10} {"Chẵn/Lẻ", -5}");
for (int i = 8; i < 15; i++)
{
    string chanle = (i%2 == 0) ? "Chẵn" : "Lẻ";
    Console.WriteLine($"{i,10} {chanle, -5}");
}
// Kết quả:
//    VòngLặp Chẵn/Lẻ
//          8 Chẵn
//          9 Lẻ
//         10 Chẵn
//         11 Lẻ
//         12 Chẵn
//         13 Lẻ
//         14 Chẵn
```

- Ký hiệu {i,10} là để ra một khoảng trống 10 ký tự, chèn giá trị i vào khoảng trống đó với căn lề bên phải. Ký hiệu {chanle, -5} là đề ra 5 khoảng trống chèn giá trị và căn lề trái.

###### Một số phương thức làm việc với chuỗi C#

- Ví dụ có hai biến chuỗi, thực hiện một số phép toán:

```csharp
string stringA =  "Xin chào,";
string stringB = "các bạn!";
```

- `Concat`: phương thức tĩnh, nối các chuỗi liệt kê ở tham số lại với nhau

```csharp
string s = String.Concat(stringA, stringB);    // s = "Xin chào,các bạn!"
```

- `Format`: Convert các đối tượng thành chuỗi và chèn chúng vào chuỗi định dạng được chỉ ra, cú pháp cơ bản

```csharp
String.Format(stringFormat, arg0, arg1 ...)
```

- Trong đó `stringFormat` là chuỗi định dạng, chứa mẫu và và vị trí mà arg0, arg1 ... sẽ chèn vào.

```csharp
string s = String.Format("Chào {0}, {0} ơi, hôm nay ngày {1} rồi!", "Nam", DateTime.Now.Day);
// s = "Chào Nam, Nam hôm nay ngày 20 rồi!"
```

- `IndexOf`: Tìm vị trí (đầu tiên) của ký tự hoặc chuỗi ký tự trong chuỗi
- `LastIndexOf` : Tìm vị trí (cuối) của ký tự hoặc chuỗi ký tự trong chuỗi
- `Insert`: Tạo chuỗi = chèn chuỗi này vào trong chuỗi khác, vị trí chèn cần chỉ ra

```csharp
var s = stringA.Insert(8, " tất cả"); // "Xin chào tất cả,"
```

- `PadLeft`: Tạo chuỗi mới từ chuỗi cũ, độ dài chuỗi mới chỉ ra - nếu độ dài chuỗi mới lớn hơn chuỗi cũ thì các ký tự phía đầu được chèn khoảng trắng hoặc ký tự chỉ định.

```csharp
string s1 = "Abc";
string s2 = s1.PadLeft(6);        //  "   Abc"
string s3 = s1.PadLeft(6, '*');   //  "***Abc"
```

- `PadRight`: Tương tự PadLeft nhưng chèn khoảng trắng bên phải
- `Replace`: Tìm và thay thế trong chuỗi

```csharp
var s = stringA.Replace("chào", "CHÀO");   // "Xin CHÀO,"
```

- `Split`: Trả về mảng các chuỗi con được chia từ chuỗi gốc bởi ký tự chia chỉ định, chuỗi chia chỉ định

```csharp
var s = "Nguyễn Văn A".Split(' '); // s tương đương mảng {"Nguyễn","Văn", "A"}
```

- `ToLower`: Sinh chuỗi mới bằng cách chuyển các ký tự thành chữ thường
- `ToUpper`: Sinh chuỗi mới bằng cách chuyển các ký tự thành chữ in
- `Trim`: Sinh chuỗi mới bằng cách loại bỏ khoảng trắng (hoặc chỉ định) ở đầu và cuối
- `Substring`: Lấy ra chuỗi con từ chuỗi chính - chuỗi con lấy từ vị trí chỉ ra đến cuối hoặc theo độ dài

```csharp
string s = stringA.Substring(4); // s = "chào,"
string x = stringA.Substring(0, 3); // s = "Xin" (dài 3)
```

###### Sử dụng StringBuilder

- Khi sử dụng biến kiểu string để thực hiện các thao tác nhằm mục đích cuối cùng thu được chuỗi theo yêu cầu, trong quá trình đó bạn có thể sử dụng nhiều biến kiểu string, để phục vụ các phép toán như nối chuỗi, tìm kiếm, thay thế ... Mỗi khi khởi tạo một biến kiểu string, bạn đã cấp phát một lượng bộ nhớ để lưu trữ chuỗi - thường thì bộ nhớ này nhiều hơn những gì bạn cần.
- Để thi hành tối ưu hơn về tốc độ, về sử dụng bộ nhớ có thể dùng tới đối tượng StringBuilder ở namespace System.Text (thêm vào đầu file using System.Text;)

```csharp
StringBuilder stringBuilder = new StringBuilder();
stringBuilder.Append("Xin chào các bạn - xuanthulab.net");
stringBuilder.Replace("Xin chào", "XIN CHÀO");
Console.WriteLine(stringBuilder); // Out: XIN CHÀO các bạn - xuanthulab.net
```

**Một số phương thức khi sử dụng StringBuilder**

- `Append`: Nối một đối tượng (chuỗi, số ...) vào StringBuilder
- `AppendFormat`: Nối vào một chuỗi sinh ra theo StringFormat
- `Insert`: Chèn vào StringBuilder một chuỗi ở vị trí chỉ ra
- `Remove`: Loại bỏ một lượng ký tự, bắt đầu từ vị trí do chỉ định
- `Replace:` Tìm và thay thế
- `ToString`: Trả về chuỗi (String)

###### Dùng biểu thức chính quy với chuỗi trong C#

- Khi làm việc với chuỗi, những tác vụ phức tạp muốn nhanh chóng có thể áp dụng kỹ thuật biểu thức chính quy vì C# hỗ trợ các lớp để làm việc với RegExp (regularexpressions)
- Ví dụ xây dựng lại hàm tìm kiếm địa chỉ email có trong một văn bản

```csharp
String text = @"Đây là địa chỉ
        email userabcguest@xuanthulab.net.vn và
        xyz@gmail.com cần trích xuất";
    String pattern = @"(([^\s.]+)@((.[^\s]+)(\..[^\s]+)))";

    Regex rx = new Regex(pattern);

    // Tìm kiếm.
    MatchCollection matches = rx.Matches(text);
    // In thông báo tìm kiếm.
    Console.WriteLine("Tìm thấy {0} email trong:\n\n  {1}\n\n",
                    matches.Count,
                    text);
    // Xuất kết quả email tìm được
    foreach (Match match in matches)
    {
        GroupCollection groups = match.Groups;
        Console.WriteLine("{0}", groups[0].Value);
    }
// - Kết quả chạy

//     Tìm thấy 2 email trong:

//   Đây là địa chỉ
//                 email userabcguest@xuanthulab.net.vn và
//                 xyz@gmail.com cần trích xuất


// userabcguest@xuanthulab.net.vn
// xyz@gmail.com
```

### 14. Sử dụng cấu trúc struct và kiểu liệt kê enum trong lập trình C# C Sharp

###### Sử dụng struct trong C#

- `struct` kiểu dữ liệu cấu trúc (còn gọi là structure) - kiểu dữ liệu này tạo thành khi ta muốn gộp các dữ liệu có liên quan thành một nhóm (đóng gói dữ liệu). Để tạo ra kiểu dữ liệu cấu trúc dùng đến từ khóa struct với khai báo khá giống khai báo lớp, tuy nhiên struct là thuộc nhóm kiểu giá trị C# chứ không phải kiểu tham chiếu C# (Do đó, truyền tham số dùng struct là tham trị: xem thêm tham chiếu, tham trị C# ). Trong struct có thể chứa: trường dữ liệu, thuộc tính, phương thức khởi tạo, hằng số, các phương thức, toán tử, sự kiện.
- Bắt đầu bằng một ví dụ đơn giản về struct, khai báo một cấu trúc có 2 trường dữ liệu (không phải thuộc tính) và một phương thức

```csharp
public struct Product {

    public string name;   // trường tên sản phẩm
    public decimal price; // trường giá sản phẩm

    // Phương thức sinh ra chuỗi thông tin
    public override string ToString() => $"{name} : {price}$";

}
```

- Do là kiểu giá trị với các trường dữ liệu, nên có thể khai báo - khởi tạo các trường và sử dụng như kiểu giá trị:

```csharp
Product  productA;
Product productA;
productA.name = "Iphone";
productA.price = 1000;

Product productB = productA; // gán struct, là sao chép giá trị chứ không tham chiếu như lớp
productB.name = "Laptop";

Console.WriteLine(productA.ToString());
Console.WriteLine(productB.ToString());
// In ra:
// Iphone : 1000$
// Laptop : 1000$
```

**Phương thức khởi tạo struct**

- Trong `struct` cũng có thể có phương thức khởi tạo như lớp, nó dùng để khởi tạo giá trị các trường hoặc thuộc tính. Khi có phương thức khởi tạo (hàm tạo) muốn chạy nó thì phải dùng toán tử new để có bản thực thi của struct. Một lưu ý nữa là phương thức khởi tạo bắt buộc phải khởi tạo toàn bộ thành viên dữ liệu (trường, thuộc tính) có trong struct. Ví dụ:

```csharp
public struct Product {

    public Product(string _name)
    {
      // trong cấu trúc có bao nhiêu trường dữ liệu, thuộc tính
      // phải khởi tạo hết trong hàm tạo (thiếu sẽ lỗi)
      name = _name;
      price = 100;
    }

    public string name;   // trường tên sản phẩm
    public decimal price; // trường giá sản phẩm

    // Phương thức sinh ra chuỗi thông tin
    public override string ToString() => $"{name} : {price}$";

}
```

- Thi hành hàm tạo thì phải dùng tới new, như đoạn code:

```csharp
Product product = new Product("Samsung Abc");
Console.WriteLine(product.ToString());
// Samsung Abc : 100$
```

**Thuộc tính trong struct**

- Trong `struct` cũng có thể khai báo các thuộc tính, chỉ cần lưu ý đã có thuộc tính thì bắt buộc phải khởi tạo nó một cách tường minh trong phương thức khởi tạo nếu không sẽ lỗi. Ví dụ sau có hai thuộc tính là Name và Description

```csharp
public struct Product {

    public Product(string _name)
    {
      name = _name;  // đồng nghĩa khởi tạo thuộc tính Name
      price = 100;
      Description = "Mô tả về sản phẩm {name}";
    }

    public string name;   // trường tên sản phẩm
    public decimal price; // trường giá sản phẩm

    // Phương thức sinh ra chuỗi thông tin
    public override string ToString() => $"{name} : {price}$";

    // Thuộc tính Name
    public string Name {set => name = value; get => name;}
    // Thuộc tính Description
    public string Description {set; get;}

}
```

**So sánh sự khác nhau giữa class và struct**

- `Struct` phù hợp khi muốn gom một lượng nhỏ các biến có kiểu nguyên thủy (int, float ...), thuộc tính lại với nhau. Class thì dùng khi các diễn tả đối tượng chứa các biến, thuộc tính và xử lý dữ liệu phức tạp.
- `Struct` có thể dùng khai báo biến mà không cần thao tác tạo đối tượng. `BIẾN KIỂU STRUCT LÀ THAM TRỊ CÒN BIẾN CLASS LÀ THAM CHIẾU` . struct được lưu ở bộ nhớ stack, còn đối tượng được sinh ra bới class được lưu ở bộ nhớ heap - bộ nhớ heap được quản lý, giám sát, thu hồi tự động bởi GC.

###### Sử dụng kiểu liệt kê (Enumeration Type) - enum

- `Kiểu liệt kê (enum)` khai báo một tập hợp các hằng số có tên, mặc định giá trị các hằng số này là kiểu int và bắt đầu từ 0 trở đi trong khai báo kiểu liệt kê. Liệt kê (enum) thuộc dạng kiểu giá trị như struct. Để khai báo một kiểu liệt kê thì dùng từ khóa `enum`
- Ví dụ - khai báo kiểu liệt kê thể hiện học lực của sinh viên gồm có: Kém (0), Trung bình (1), Khá (2), Giỏi (3)

```csharp
enum HocLuc {Kem, TrungBinh, Kha, Gioi};
```

- Mặc định enum sẽ thiết lập tên các khai báo sẽ nhận giá trị tương ứng từ 0, 1, 2 ... Tuy nhiên, bạn có thể gán một tên nào đó ứng với giá trị cụ thể, ví dụ TrungBinh nhận giá trị 5

```csharp
enum HocLuc {Kem, TrungBinh = 5, Kha, Gioi};
```

- Do TrungBinh bằng 5, nên tên tiếp theo Kha sẽ nhận 6, Giỏi là 7

- Để nhận giá trị liệt kê - bạn dùng toán tử . rồi đến tên phần tử.

```csharp
enum HocLuc {Kem, TrungBinh, Kha, Gioi}

static void Main(string[] args)
{
    int a = (int)HocLuc.Kha;  // cast enum thành int
    Console.WriteLine(a);     // 2
}
```

- Khai báo kiểu enum rất phù hợp khi giá trị của biến nhận một giá trị hằng số trong tập hằng số hữu hạn nào đó, như danh sách các ngày trong tuần, trạng thái online / offline, và đặc biệt hay dùng Enum với câu lệnh switch

```csharp
static void test_enum () {

    HocLuc hocluc = HocLuc.Kha; // khai báo biến hocluc kiểu enum và khởi tạo giá trị bằng HocLuc.Kha
    switch (hocluc) {
        case HocLuc.Kem:
            Console.WriteLine ("Học lực kém");
            break;
        case HocLuc.Kha:
            Console.WriteLine ("Học lực Kha");
            break;
        case HocLuc.Gioi:
            Console.WriteLine ("Học lực Giỏi");
            break;
        default:
            Console.WriteLine ("Học lực TB");
            break;

    }
}
```

- Bạn có thể cast - chuyển kiểu qua lại giữa enum và int

```csharp
HocLuc hoc = (HocLuc)2;
Console.WriteLine(hoc); //Kha
```

- Sử dụng enum, khi viết code tên của Enum nó đã gợi nhớ giá trị - ý nghĩa của dữ liệu nên code dễ đọc, dễ hiểu hơn

```csharp
    HocLuc hocluc_hocsinhA = HocLuc.Kha;
    int hocluc_hocsinhB = 2;

```

- Hai dòng code trên, về logic có thể hoàn toàn giống nhau. Nhưng đọc code ở dòng 1 sẽ dễ hơn đọc ở dòng 2 nhiều.

### 15. Tính kế thừa trong C#

- Kế thừa là một trong 4 khía cạnh của lập trình hướng đối tượng, nó là khả năng cho phép chúng ta định nghĩa ra một lớp mới dựa trên một lớp khác có sẵn, kế thừa giúp cho việc mở rộng code - bảo trì trở nên dễ hơn.
- `Lớp cơ sở` là lớp mà được lớp khác kế thừa.
- `Lớp kế thừa` là lớp kế thừa lại các thuộc tính, phương thức từ lớp cơ sở.

- Ví dụ, định nghĩa lớp Animal như sau

```csharp
class Animal {
    public int Legs {get; set;}
    public float Weigh {get; set;}


    public void ShowLegs()
    {
        Console.WriteLine($"Legs: {Legs}");
    }
}
```

- Animal có 2 thuộc tính Legs và Weigh, có 1 phương thức ShowLegs. Dùng nó làm lớp cơ sở để xây dựng lớp kế thừa có tên Cat:

```csharp
class Cat : Animal {
    public string food;      // thuộc tính mới thêm

    public Cat()
    {
        Legs = 4;           // Thuộc tính Legs có sẵn - vì nó kế thừa từ Animal
        food = "Mouse";
    }

    public void Eat()
    {
        Console.WriteLine(meal);
    }
}
```

- Khi sử dụng Cat

```csharp
Cat cat = new Cat();
cat.ShowLegs();             // Phương thức này kế thừa từ lớp cơ sở
cat.Eat();                  // phương thức của riêng Cat

// Legs: 4
// Mouse
```

- Để khai báo lớp kế thừa dùng cú pháp, lớp cơ sở viết sau ký hiệu :

```csharp
class LỚP_KẾ_THỪA : LỚP_CƠ_SỞ {
   //...
}
```

- C# không hỗ trợ đa kế thừa (mỗi lớp kế thừa chỉ có một lớp cơ sở)
  **Thành viên được bảo vệ (protected) của lớp cơ sở**
- Trong kỹ thuật lập trình OOP, để đảm bảo tính đóng gói các thành viên (thuộc tính, phương thức) lớp cơ sở thường khai báo là protected, có nghĩa là truy cập được bởi lớp kế thừa - nhưng không truy cập được bên ngoài lớp.
- Ví dụ, ở lớp Animal trên, sửa thuộc tính Legs từ public thành protected

```csharp
protected int Legs {get; set;}
```

- Lớp Cat vẫn đúng, vì nó vẫn truy cập được thuộc tính Legs, thế nhưng khi sử dụng

```csharp
Cat cat = new Cat();
int l = cat.Legs;  // Lỗi - Legs không cho phép truy cập từ code bên ngoài lớp
```

###### Lớp niêm phong sealed

- Trong kỹ thuật lập trình, bạn có thể đánh dấu một lớp nào đó không bao giờ trở thành lớp cơ sở để phái sinh ra lớp khác - lớp đó gọi là bị niêm phong. Muốn niêm phong một lớp chỉ việc thêm từ khóa sealed

```csharp
sealed class A {

}

class B : A {  // Chỗ này lỗi vì kế thừa lớp bị niêm phong

}
```

- Dùng kỹ thuật niêm phong lớp (sealed) để đảm bảo không phái sinh các lớp kế thừa một cách thoải mái, mất kiểm soát, nhất là khi số dự án lớn, nhiều người tham gia.

###### Phương thức hủy và khởi tạo khi kế thừa

- Như đã biết, phương thức khởi tạo chạy khi đối tượng được tạo (new), vấn đề là khi có sự kế thừa thì lưu ý: hàm khởi tạo của lớp cơ sở chạy trước, xong đến hàm khởi tạo của lớp kế thừa.

```csharp
class A {
    public A() {
        Console.WriteLine("A Init");
    }
}

class B : A {
    public B()
    {
        Console.WriteLine("B Init");
    }
}
```

- Khi sử dụng:

```csharp
new B();
// KẾT QUẢ
// A Init
// B Ini
```

- Tuy nhiên, khi phương thức khởi tạo lớp cơ sở có tham số, hoặc ấn định một phương thức khởi tạo của lớp cơ sở (nếu lớp cơ sở có quá tải nhiều phương thức khởi tạo), thì hàm tạo của lớp kế thừa phải chỉ định sẽ khởi chạy phương thức khởi tạo (và truyền tham số) nào của lớp cơ sở.

```csharp
class A {
    public A(string mgs) {
        Console.WriteLine("A Init" + mgs);
    }
}

class B : A {
    public B(string abc) : base(abc)
    {
        Console.WriteLine("B Init");
    }
}
```

- Sau phương thức tạo lớp kế thừa thấy có : base(abc) đây chính là chỉ ra hàm tạo lớp cơ sở sẽ chạy, đó là hàm có một tham số - và giá trị tham số được truyền vào

```csharp
new B("!ABC");
// KẾT QUẢ
// A Init!ABC
// B Ini
```

- Đối với các phương thức hủy, khi đối tượng hủy nó sẽ thi hành phương thức hủy của lớp kế thừa trước, rồi mới đến phương thức hủy của lớp cơ sở (ngược với khởi tạo).

###### Chuyển kiểu - tương thích về kiểu khi sử dụng lớp

- Trong chuỗi kế thừa ví dụ lớp A là lớp cơ sở, kế thừa bởi lớp B, lớp B lại là lớp cơ sở kế thừa bởi C

```csharp
class A
{

};

class B : A
{

};

class C : B
{

}
```

- Vậy có thể chuyển kiểu từ C -> B -> A. Bạn có thể chuyển kiểu một cách tường minh (viết tên kiểu muốn chuyển trong () trước đối tượng), hay ngầm định.
- Chiều ngược lại thì không thể

```csharp
C c = new C();
a = (A)c;       // chuyển kiểu tường minh
a = c;          // ngầm định
a = new C();    // ngầm định

B b = c;        // ngầm định

c = new A();    // lỗi - không thể chuyển kiểu thuận cây kế thừa -  Lớp cha không chuyển thành con được
```

- Lớp kế thừa luôn có thể cast (chuyển) về lớp cơ sở

### 16. Namespace trong C# C Sharp .Net Core

- Namespace là cách tổ chức nhóm code (các lớp, giao diện, cấu trúc ...) thành những nhóm, tạo ra phạm vi hoạt động của các thành phần trong nhóm. Nhìn lại chương trình đầu tiên mà dotnet tạo ra:

```csharp
using System;

namespace CS001_HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Xin chào C# NET CORE!");
        }
    }
}
```

- Bạn thấy, code trên có: Đã chỉ thị nạp một namespace vào để sử dụng cho file code, đó là chỉ thị using System;. Điều này có nghĩa các thành phần (class, interface, enum ...) được định nghĩa trong namespace System sử dụng được trong code. Như lớp Console định nghĩa trong System thì trong code đã truy cập được lớp này - Console.WriteLine("Xin chào C# NET CORE!");
- Đã định nghĩa một `namespace` mới có tên `CS001_HelloWorld` và trong namespace này định nghĩa một lớp có tên Program
- Như vậy: Namespace khai báo một phạm vi, nó chứa tập hợp các đối tượng liên quan nhau, nhằm mục đích tổ chức code khoa học, dễ quản lý và đặc biệt là tránh xung đột về tên. (bạn có thể khai báo hai lớp tên giống nhau nhưng nằm ở hai namespace khác nhau).

-` Cách khai báo tạo ra một namespace mới`: sử dụng từ khóa namespace và chỉ ra tên namespace muốn tạo mới, các thành phần khai báo trong namespace này (class, interface, struct ...) được định nghĩa trong khối {}.

- Ví dụ, khai báo tạo ra namespace có tên mynamespace

```csharp
namespace mynamespace {
    // Định nghĩa các lớp, cấu trúc ...
}
```

- Một namespace bạn có thể định nghĩa ở nhiều file code (.cs) khác nhau. Khi muốn sử dụng các thành phần của namespace nào đó, thì dùng từ khóa using ở đầu file code để chỉ thị nạp namespace này vào

```csharp
using mynamespace;
using mynamespace;
...
```

###### Namespace lồng nhau, nhiều cấp

- Các namespace cũng có thể khai báo lồng nhau, nhiều cấp sau đó dùng ký hiệu . để truy cập đến namepace mong muốn, ví dụ namepace B nằm trong namspace A

```csharp
namespace A {
    // Định nghĩa các lớp, cấu trúc ...
    namespace B {
        // Định nghĩa các lớp, cấu trúc ...
    }
}
```

- Khi đó muốn dùng các lớp, cấu trúc ... có trong namespace B thì khai báo

```csharp
using A.B;
```

- Thư viện .NET cung cấp rất nhiều namespace - mỗi namespace là tập hợp các lớp, cấu trúc về một vấn đề nào đó.

- Tạo ra namespace nhiều cấp còn có thể khai báo một cách riêng rẽ nhưng phải chỉ rõ tên đầy đủ của namespace (tên namespace gốc)

- Ví dụ, namespace C là con của namespace B, B lại là con của namespace A thì bạn có thể khai báo lồng nhau như trên hoặc:

```csharp
namespace A
{
    public struct StructInA {};
}
namespace A.B
{
    public struct StructInB {};
}
namespace A.B.C
{
    public struct StructInC {};
}
```

- Cách khai báo này hoàn toàn giống:

```csharp
namespace A
{
    public struct StructInA { };

    namespace B
    {
        public struct StructInB { };

        namespace C
        {
            public struct StructInC { };
        }
    }
}
```

###### Truy cập namespace và từ khóa using

- Để sử dụng một lớp, cấu trúc, interface ... khai báo trong một namespace nào đó, bạn phải viết tên đầy đủ của namespace và dẫn đến tên lớp muốn sử dụng, các cấp phân cách nhau bởi ký tự `.`
- Ví dụ, lớp StringBuilder được định nghĩa trong namespace System.Text, vậy để dùng nó trong code bạn phải viết với tên đầy đủ System.Text.StringBuilder:

```csharp
System.Text.StringBuilder stringBuilder = new System.Text.StringBuilder();
```

- Hoặc sử dụng StructInC ở trên bạn phải viết:

```csharp
A.B.C.StructInC mystruct;
```

- Để tránh phải viết tên đầy đủ như vậy bạn sử dụng đến từ khóa using với namespace cần dùng ở đầu. Ví dụ:

```csharp
using System.Text;
//... các thành phần khác

    static void Main (string[] args) {

        StringBuilder stringBuilder = new StringBuilder();
         // Không cần viết: System.Text.StringBuilder stringBuilder = new System.Text.StringBuilder();
    }

    // Như vậy chỉ thị using cho phép bạn nạp một namespace con, bạn không cần viết tên đầy đủ gồm cả pham vi truy cập đến lớp, interface ... trong namespace
```

- Chỉ thị using cũng giúp bạn đặt tên mới (tên tắt) của `namespace`, tên này sử dụng trong phạm vi file code. Cú pháp là using NewName = OldName. Ví dụ đặt `System.Text` thành `XYZ` thì lớp `XYZ.StringBuilder` chính là lớp `System.Text.StringBuilder`

```csharp
using XYZ = System.Text;

//... các thành phần khác

    static void Main (string[] args) {

        XYZ.StringBuilder stringBuilder = new XYZ.StringBuilder();
    }
```

- Sử dụng using chỉ thị truy cập trực tiếp các phương thức tĩnh, mà không cần viết tên lớp cú pháp nạp phương thức tĩnh của lớp có dạng using static namespace ... class.
- Ví dụ phương thức tĩnh WriteLine trong WriteLine:

```csharp
using static System.Console;  // cho biết sử dụng trực tiếp các phương thức tĩnh

//..
    WriteLine ("Xin chào C# NET CORE!");
//..
```

### 17. Partial Type và Nested Type phân code thành nhiều file và lớp lồng nhau trong C# C Sharps

###### Phân chia mã nguồn lớp (class, interface) ra thành nhiều file với `Partial`

- `Partial` là kỹ thuật phân chia code lưu ở nhiều file mã nguồn khác nhau, khi biên dịch thì nó tổng hợp lại thành một. Kỹ thuật này dùng với từ khóa `partial` khi định nghĩa class, interface, struct.
- Kỹ thuật phân chia code ra thành nhiều file bạn có thể gặp khi:

  - Dự án lớn, những lớp mà mã nguồn dài cần chia tách ra thành nhiều file có thể đơn giản là gộp các chức năng giống nhau thành một file, hoặc làm việc nhóm mỗi lập trình viên làm việc trên một file, sau đó khi biên dịch nó tự tổng hợp thành một class hoàn chỉnh
  - Khi làm việc với các IDE, nó có thể phát sinh code một cách tự động, code được thêm vào lớp được lưu ở một file mã nguồn khác mà không cần chỉnh sửa file code ban đầu (nếu lập trình C# WPF bạn nhận thấy IDE phát sinh nhiều thành phần giao diện ở dạng này)

- Để phân chia lớp, bạn khai báo và định nghĩa các thành phần của lớp ở nhiều nơi khác nhau, với yêu cầu trong khai báo lớp cho thêm từ khóa partial, ví dụ một lớp có tên Product khai báo một cách thông thường như sau:

```csharp
using System;

namespace CS007B_PARTIAL
{
    public class Product {

      public string Name { set; get;}

      public bool Order(int number = 0)
      {
        return true;
      }

      public int numberBrought()
      {
        return 100;
      }

    }
}
```

- Giờ có thể tách định nghĩa lớp trên ra làm hai phần, một phần định nghĩa trong file `Product1.cs` và một phần trong `Product2.cs`, kết quả vẫn có lớp Product tương đương

```csharp
//Product1.cs

using System;

namespace CS007B_PARTIAL
{
    public partial class Product {
      public string Name { set; get;}

      public bool Order(int number = 0)
      {
        return true;
      }

    }
}
```

```csharp
//Product2.cs

using System;

namespace CS007B_PARTIAL
{
    public partial class Product {

        public int numberBrought()
        {
            return 100;
        }

    }
}
```

- Bạn thấy lớp đã được định nghĩa ở hai nơi, yêu cầu dòng khai báo lớp ở cả hai nơi là có từ khóa `partial`, đồng thời cùng có khả năng truy cập giống nhau, như trên khai báo

**Lưu ý khi dùng partial**

- Có một số quy tắc cần lưu ý khi bạn để code của một thành phần ở nhiều nơi với partial
- Trong định nghĩa ở tất cả các phần phải có từ khóa `partial`, ví dụ sau là lỗi

```csharp
public partial class A { }

public class A { }  // thiếu đánh dấu partial
```

- Từ khóa `partial` có thể đặt ngay trước từ khóa class

**Partial với các phương thức**

- Bạn cũng có thể dùng từ khóa `partial` trong khai báo các phương thức, tuy nhiên mục đích chỉ là chia chia làm hai nơi, một nơi như là khai báo một nơi là triển khai code, và phương thức phải trả về kiểu void. Ví dụ:

```csharp
// file1.cs
partial void myMethod();

// file2.cs
partial void myMethod()
{
  // code triển khai
}
```

- Partial Method thường sinh ra bởi việc sinh mã nguồn tự động khi dùng công cụ IDE

###### Lớp lồng nhau (kiểu Nested) trong C#

- Trong C# nó cho phép bạn khai báo một lớp (class), giao diện (interface), cấu trúc (struct) trong thân một lớp khác - chúng được gọi là kiểu lồng nhau (Nested Type)
- Ví dụ khai báo một lớp con trong một lớp khác

```csharp
public class Container
{
    public class Nested
    {
        public Nested() { }
    }
}
```

- Lớp `Nested` được khai báo, định nghĩa trong lớp `Container`, nếu phạm vị lớp public, thì bên ngoài sử dụng lớp con này bằng cách chỉ rõ `Container.Nested`

```csharp
Container.Nested nested = new Container.Nested();
```

- Ví dụ lớp lồng nhau

```csharp
class MobileProduct {
    public Manufactory manufactory { set; get; }

    // Lớp Manufactory nằm trong MobileProduct
    public class Manufactory {
      string address;
      public Manufactory (string address) {
        this.address = address;
      }
      public void ShowAddress () {
        Console.WriteLine (address);
      }
    }

    public void ProductInfo () {
      manufactory.ShowAddress ();
    }
}
```

- Sử dụng:

```csharp
MobileProduct product = new MobileProduct();
product.manufactory =  new MobileProduct.Manufactory("Abc ...");
product.ProductInfo();
```

### 18. Sử dụng phương thức Generic lớp Generic trong C# C Sharp

###### Phương thức với kiểu Generic

- `Generic` là kiểu đại diện, nó cho phép tạo mã nguồn code không phụ thuộc vào kiểu dữ liệu cụ thể, chỉ khi code thực thi thì kiểu cụ thể mới xác định. Trước đây bạn đã quen với việc viết code trên những kiểu dữ liệu cụ thể như int, float, double ... hay các class do bạn định nghĩa, tuy nhiên có những giải thuật giống nhau trên những kiểu dữ liệu khác nhau, để tránh việc viết nhiều lần code lặp lại thì lúc này áp dụng `Generic` - kiểu đại diện để xây dựng phương thức hoặc lớp.
- Ví dụ bạn cần chuyển đổi giá trị lưu trong hai biến kiểu int, thì bạn có thể xây dựng phương thức theo cách thông thường như sau:

```csharp
// phương thức này tráo đổi giá trị giữa hai biến kiểu int
public static void Swap(ref int a, ref int b) {
    int c = a;
    a = b;
    b = c;
}
```

- Tuy nhiên, nếu cần tráo đổi giá trị giữa hai biến kiểu string thì phương thức trên không dùng được, bạn lại cần xây dựng một phương thức khác dành cho tham số kiểu string

```csharp
// phương thức này tráo đổi giá trị giữa hai biến kiểu int
public static void Swap(ref string a, ref string b) {
    string c = a;
    a = b;
    b = c;
}
```

- Bạn nhận thấy, giải thuật giải quyết bài toán giống nhau nhưng tham số khác nhau dẫn đến bạn phải viết hai đoạn code. Với những trường hợp như trên, logic giống nhau trên những kiểu dữ liệu khác nhau thì sẽ dùng đến Generic, thay vì viết code trên kiểu dữ liệu cụ thể thì code trên những kiểu chung chung.

**Khai báo phương thức Generic**

- Bạn khai báo phương thức có sử dụng kiểu `Generic` chung chung bằng cách, chỗ nào là kiểu dữ liệu cụ thể thì thay nó bằng tên kiểu `Generic`, tên này là do bạn đặt một cách thống nhất tùy chọn như A, B, T, .... Trong đó sau phần tên hàm phải liệt kê ra tên những kiểu `Generic` mà bạn sẽ sử dụng cho hàm. Một khai báo tổng quát như sạng sau

```csharp
X MyFunction<X, Y>(X x, Y y)
{
   return x;
}
```

- Khai báo phương thức có tên MyFunction, sau tên này bạn thấy có ký hiệu <X, Y> có nghĩa phương thức này có sử dụng hai kiểu là kiểu X và kiểu Y (tất nhiên nó chưa cụ thể là kiểu gì, nó chỉ cụ thể khi phương thức được gọi). Khi đã có kiểu Generic rồi thì dùng kiểu này cho các thành phần của phương thức - như kiểu trả về là X, tham số là kiểu X và Y, trong thân phương thức tương tự có thể khai báo sử dụng kiểu X và kiểu Y
- Lúc này khi bạn gọi bạn chỉ cần đền tên X và Y theo kiểu cụ thể trong ký hiệu `< ... >`:

```csharp
int a = 1;
string b = 2;
int rs = MyFunction<int, string>(a, b);  // Phương thức chạy với vai trò X là kiểu int, Y là kiểu string.

double c = 2;
MyFunction<double, int>(c, a);           // Phương thức chạy với X là kiểu double, Y kiểu int
```

**Ví dụ dùng phương thức Generic**

- Áp dụng xây dựng hàm Swap ở trên:

```csharp
static void Swap<T>(ref T a, ref T b)
{
    T c = a;
    a = b;
    b = c;
}
```

- Khi sử dụng, bạn gọi phương thức chỉ việc thay chữ T bằng kiểu cụ thể muốn áp dụng

```csharp
public static void TestSwap()
{
  int a = 1;
  int b = 2;
  Swap<int>(ref a, ref b);                       // Hàm trên kiểu T = int
  System.Console.WriteLine($"a = {a}; b = {b}"); // a = 2; b = 1

  string a1 = "A";
  string b1 = "B";
  Swap<string>(ref a1, ref b1); // Hàm trên kiểu T = string
  System.Console.WriteLine($"a1 = {a1}; b1 = {b1}"); // a1 = B; b1 = C
}
```

###### Lớp với kiểu Generic

- Tương tự như phương thức, cũng có thể khai báo lớp với Generic - bằng liệt tên các kiểu đại diện này sau khai báo tên lớp

```csharp
class MyClass<X, Y> {
// ...
}
```

- Xây dựng lớp với kiểu Generic phổ biến để triển khai nhiều loại giải thuật như hàng đợi Queue, Stack, Array ...

```csharp
class MyClass<T>
{
    private T bien;

    public MyClass(T value)
    {
        bien = value;
    }

    public T TestMethod(T pr)
    {
        Console.WriteLine(pr);
        return bien;
    }

    public T thuoctinh { get; set; }
}
```

- Ví dụ sử dụng

```csharp
MyClass<double> myClass = new MyClass<double>(123.123);
myClass.TestMethod(123); // in ra 123
```

### 19. Kiểu vô danh và kiểu động dynamic trong C#

###### Kiểu vô danh C#

- `Kiểu vô danh (Anonymous Type)` - là kiểu không có tên. C# cho phép bạn tạo ra các đối tượng kiểu vô danh bằng từ khóa `new`, cú pháp cơ bản để tạo ra đối tượng có kiểu vô danh như sau:

```csharp
var obj = new {
    thuoctinh1 = giatri1,
    thuoctinh2 = giatri2
}
```

- Bằng cú pháp như vậy, tạo ra được đối tượng chứa các thuộc tính (`chú ý - thuộc tính là chỉ đọc`), bạn tạo ra đối tượng mà không cần phải khai báo lớp
- Ví dụ: tạo đối tượng có 3 thuộc tính

```csharp
var myProfile = new {
    name  = "XuanThuLab",
    age   = 20,
    skill = "ABC"
};
```

- Để truy cập thuộc tính của toán tử vẫn dùng ký hiệu `.` và tên thuộc tính.

```csharp
Console.WriteLine(myProfile.name);
```

- Kiểu vô danh Anonymous Type - được dùng phổ biến trong LINQ (tìm hiểu phần sau)
- Khi có đối tượng kiểu vô danh, nếu dùng nó truyền như tham số cho các phương thức - coi nó như các object có thể gây lỗi khi buil ứng dụng - trình biên dịch kiểm tra và báo lỗi. Để giải quyết vấn đề này có thể dùng đến khai báo kiểu dynamic

###### Kiểu động - dynamic

- Biến kiểu động - ngầm định - khai báo với từ khóa dynamic, thì kiểu thực sự của biến đó được xác định bằng đối tượng gán vào ở thời điểm chạy (khác với kiểu ngầm định `var` kiểu xác định ngay thời điểm biên dịch)

```csharp
dynamic myvar;
```

- Ví dụ khai báo phương thức có sử dụng tham số kiểu dynamic

```csharp
static void TestFunc(dynamic dvar) {
    Console.WriteLine(dvar.age); // ở thời điểm biên dịch - không biết dvar có thuộc tính age hay không, nhưng nó vẫn biên dịch
}
```

- Với phương thức trên, ở thời điểm chạy mà đối tượng ở tham số có thuộc tính age thì sẽ không lỗi, còn nếu không có thuộc tính age sẽ sinh ngoại lệ.

```csharp
var myProfile = new {
    name = "XuanThuLab",
    age = 20,
    skill = "ABC"
};
TestFunc(myProfile); // In ra 20
```

- Bạn có thể dùng kiểu động này với kiểu dữ liệu bất kỳ

```csharp
dynamic d1 = 7;
dynamic d2 = "a string";
dynamic d3 = System.DateTime.Today;
dynamic d4 = System.Diagnostics.Process.GetProcesses();
```

### 20. Tìm hiểu và sử dụng `null`, `nullable` trong lập trình C Sharp

- Từ khóa `null`, không tham chiếu đến đối tượng nào, sử dụng trong lập trình C#, kích hoạt khả năng gán `null` cho các kiểu dữ liệu nguyên tố bằng `nullable`

###### Từ khóa null trong C#

- `null` là một giá trị cố định nó biểu thị không có đối tượng nào cả, có nghĩa là biến có giá trị `null` không có tham chiếu (trỏ) đến đối tượng nào (không có gì).
- `null` chỉ có thể gán được cho các biến kiểu tham chiếu (biến có kiểu dữ liệu là các lớp), không thể gán null cho những biến có kiểu dữ liệu dạng tham trị như int, float, bool ...
- Ví dụ lớp có lớp `MyClass` thì biến kiểu lớp này có thể gán giá trị null

```csharp
class MyClass {
    public void ShowData() {
        Console.WriteLine("Show Data ... ");
    }
}
```

```csharp
MyClass refvar1, refvar2;
refvar1 = new MyClass();    // refvar1 tham chiếu (gán) bằng một đối tượng
refvar2 = refvar1;          // refvar1, refvar2 cùng tham chiếu một đối tượng

refvar1 = null;             // refvar1 gán bằng null =>  không trỏ đến đối tượng nào
refvar2.ShowData();         // refvar2 có trỏ đến đến tượng, nên có thể truy cập các thành viên của đối tượng
refvar1.ShowData();         // refvar1 không trỏ đến đối tượng nào, nên truy cập thành viên sẽ lỗi

int myvar = 10;             //  int là kiểu tham trị, nó có thể gán giá trị cho biến myvar (10)
int myvar = null;           //  lỗi - kiểu tham  trị  không được gán null hay bằng tham chiếu đến đến tượng
```

- Thường để kiểm tra biến có tham chiếu đến đối tượng cụ thể nào, ta sử dụng toán tử logic kiểm tra `object != null`

###### Sử dụng nullable trong C#

- Nếu bạn muốn sử dụng các kiểu dữ liệu nguyên tố như int, float, double ... như là một kiểu dữ liệu dạng tham chiếu, có thể gán giá trị null cho nó, có thể sử dụng như đối tượng ... thì khai báo nó có khả năng nullable, khi biến nullable có giá trị thì đọc giá trị bằng truy cập thành viên .Value, cách làm như sau:
- Khi khai báo biến có khả năng nullable thì thêm vào ? sau kiểu dữ liệu

```csharp
int? bienkieuint;                 // Hoặc Nullable<int> bienkieuint;

bienkieuint = null;               // có thể gán null cho biến
bienkieuint = 10;                 // có thể gán giá trị cho biến

if (bienkieuint != null)
{
    int val = bienkieuint.Value;  // đọc giá trị trong biến nullable
}
```

- Chú ý dạng khai báo đầy đủ của `int?` là `Nullable<int>`
- `Nullable` rất tiện dụng khi lập trình các truy vấn cơ sở dữ liệu, lập trình web ... ta sẽ tìm hiểu khi đến phần đó.

### 21. Tính đa hình, phương thức ảo, lớp trừu tượng, và giao diện (interface) trong lập trình C#

- Tìm hiểu và triển khai tính đa hình trong C#, khai báo phương thức ảo, nạp chồng override phương thức, tạo ra các lớp trừu tượng abstract và khai báo Interface

### Tính đa hình C#

- `Tính đa hình` là một trong các đặc tính của lập trình hướng đối tượng, trong phần quá tải phương thức - nó đã thể hiện tính đa hình. Tính đa hình của đối tượng nghĩa là có nhiều dạng, tính đa hình sẽ thể hiện rõ khi xây dựng các lớp kế thừa. Một phương thức được gọi, nó sẽ là phương thức cụ thể nào tùy thuộc vào đối tượng lúc nó thực thi.

###### Phương thức ảo (hàm ảo) C#

- Một `phương thức ảo` trong lớp - là phương thức có thể định nghĩa lại (bị nạp chồng - bị đè) bởi lớp kế thừa. Muốn một phương thức là ảo, thêm từ khóa `virtual` vào khai báo tên hàm.

```csharp
class Product {
    protected double price = 0;

    // Phương thức ảo ProductInfo
    public virtual void ProductInfo() {
        Console.WriteLine($"Giá sản phẩm {price}");
    }

    public void TestProduct()
    {
        this.ProductInfo();
    }
}
```

- Vì phương thức `ProductInfo` khai báo là loại phương thức `virtual`, nên ở lớp kế thừa nó, có thể định nghĩa lại - kỹ thuật này gọi là `nạp chồng (override)`

**Nạp chồng phương thức**

- Ở lớp kế thừa, có thể định nghĩa lại phương thức ảo của lớp cơ sở, việc này là thực hiện nạp chồng, để nạp chồng chỉ việc khai báo lại phương thức thêm vào từ khóa `override`

```csharp
class Iphone : Product {
    public Iphone() {
        price = 500;
    }
    public override void ProductInfo() {
        Console.WriteLine($"Điện thoại Iphone");
        base.ProductInfo();
    }
}
```

- Khi sử dụng:

```csharp
Product p1 = new Product();
Product  p2 = new Iphone();
p1.TestProduct();   // In ra: Giá sản phẩm 0
p2.TestProduct();   // In ra: Điện thoại Iphone              Gọi đến ProductInfo đã định nghĩa lại
```

- Lớp `Iphone` đã định nghĩa lại phương thức `ProductInfo`, nên các lời gọi đến `ProductInfo` là hoàn toàn khác với định nghĩa ban đầu của nó. Tuy nhiên, nếu muốn thi hành code của hàm mà do lớp cơ sở định nghĩa thì bạn cần gọi đến nó thông qua ký hiệu `base`.

```csharp
class Iphone : Product {
    public Iphone() {
        price = 500;
    }
    public override void ProductInfo() {
        Console.WriteLine($"Điện thoại Iphone");
        base.ProductInfo();  // gọi lại hàm ở base
    }
}
```

```csharp
Product  p = new Iphone();
p.TestProduct();
// Điện thoại Iphone
// Giá sản phẩm 500
```

- Để nhìn rõ hơn về tính đa hình, viết lại 2 đoạn code như sau:

```csharp
Product  p = new Product();
p.TestProduct();
```

```csharp
Product  p = new Iphone();
p.TestProduct();
```

- Đều gọi phương thức `TestProduct()` của lớp cơ sở, nhưng nó lại thi hành những tác vụ khác nhau.

###### Lớp trừu tượng / Phương thức trừu tượng

- `Lớp trừu tượng` cũng là một trường hợp thể hiện `tính đa hình` của lập trình OOP, khi khai báo một lớp có từ khóa `abstract` thì nó là lớp trừu tượng. **Đã là lớp trừu tượng thì nó không được dùng để khởi tạo đối tượng trực tiếp mà nó chỉ làm lớp cơ sở kế thừa bởi lớp khác.**
- Trong lớp trừu tượng, còn có thể khai báo phương thức trừu tượng với từ khóa abstract, phương thức này không có thân (chỉ có tên - tham số), nó yêu cầu lớp kế thừa bắt buộc phải nạp chồng `(overrid)`

```csharp
abstract class Product {
    protected double price = 0;
    public abstract void ProductInfo();
    public void TestProduct()
    {
        this.ProductInfo();
    }
}
```

- Định nghĩa như trên, `Product` là lớp trừu tượng, nó có một hàm trừu tượng là `ProductInfo()`, hàm này yêu cầu lớp kế thừa phải overrid nó. Do `Product` là lớp trừu tượng, nên nó không bao giờ được dùng để tạo đối tượng.

```csharp
Product p = new Product(); // lỗi vì sử dụng abstract tạo đối tượng
```

- `Product` chỉ dùng để kế thừa, hàm `abstract` bắt buộc phải `overrid`

```csharp
class Iphone : Product {
    public Iphone() {
        price = 500;
    }
    public override void ProductInfo() {
        Console.WriteLine($"Điện thoại Iphone");
    }
}

class Laptop : Product {
    public Laptop() {
        price = 1500;
    }
    public override void ProductInfo() {
        Console.WriteLine($"Máy Laptop ... ");
    }
}
```

```csharp
Product p1 = new Iphone();
Product p2 = new Laptop();
p1.TestProduct();           // Điện thoại Iphone
p2.TestProduct();           // Máy Laptop ...
```

###### Giao diện - Interface

- Giao diện `(interface)` nó có ý nghĩa gần giống với lớp `abstract`. Chỉ có điều khai báo thì dùng từ khóa `interface` thay cho từ khóa `class` và điều quan trọng - **tất cả các phương thức đều khai báo không có thân (chỉ có tên - nghĩa là phương thức abstract)..** Lớp triển khai giao diện (lớp kế thừa) bắt buộc phải định nghĩa lại (không cần từ khóa overrid) tất cả các phương thức này, cũng có một điều khác là **lớp kế thừa có thể kế thừa nhiều giao diện**.

```csharp
interface IProduct {
        public void ShowPrice();
    }

interface IOrder {
    public void OrderAction(int numberProduct);
}

class Product : IProduct, IOrder {
    double price;
    public Product(double price) {
        this.price = price;
    }
    public void ShowPrice() {
        Console.WriteLine($"Price: {price}");
    }

    public void OrderAction(int numberProduct) {
        Console.WriteLine($"Order: {numberProduct}");
    }
}
```

- Ở trên, `Product` đã triển khai hai giao diện `(IProduct, IOrder)`
- Vậy `interface` giống như những mẫu - mà lớp triển khai bắt buộc phải có các phương thức giống nó.

# CHƯƠNG 2: C# NÂNG CAO

### 1. Sử dụng delegate trong C# - hàm ủy quyền

- Tìm hiểu khái niệm về `Delegate` tạo ra các biến hàm ủy quyền trong C#, gán nhiều hàm vào `delegate`, gọi hàm `delegate`, sử mẫu `Action` và `Func` để nhanh chóng tạo biến delegate, sử dụng `delelage` làm tham số phương thức

###### Giới thiệu delegate

- `Delegate` (hàm ủy quyền) là một kiểu dữ liệu, nó dùng để tham chiếu (trỏ đến) đến các hàm (phương thức) có tham số và kiểu trả về phù hợp với khai báo kiểu. Khi dùng đến `delegate` bạn có thể gán vào nó một, nhiều hàm (phương thức) có sự tương thích về tham số, kiểu trả về, sau đó dùng nó để gọi hàm (giống con trỏ trong C++), các `event` trong C# chính là các hàm được gọi thông qua `delegate`, bạn cũng có thể dùng `delegate` để xây dựng các hàm callback, đặc biệt là các `Event`
- Delegate được dùng phổ biến khi gán các biểu thức lambda

###### Ví dụ sử dụng delegate

- `1:` Đầu tiên cần khai báo một `delegate`, khai báo giống như cách khai báo phương thức nhưng có thêm từ khóa delegate và không có thân phương thức. Ví dụ sau khai báo một delegate có tên là ShowLog

```csharp
public delegate void ShowLog(string message);
```

- `2:` Khi đã có `ShowLog`, nó dùng như một kiểu dữ liệu để khai báo các biến, các biến này có thể gán vào nó các hàm có sự tương đồng về tham số và kiểu trả về với khai báo delegate ví dụ khai báo biến

```csharp
ShowLog showLog;
```

###### Thi hành delegate

- Sau khi biến delegate được gán hàm vào, có thể dùng biến delegate để thi hành bằng cách gọi:
  `varDelegate.Invoke(các-tham-số)` hoặc `varDelegate(các-tham-số)`
- `3:` Tạo hai phương thức `Info` và `Warning` có tham số giống với `ShowLog`, nghĩa là có một tham số kiểu string, trả về void:

```csharp
static public void Info(string s)
{
    // ...
}

static public void Warning(string s)
{
    // ...
}
```

- Do `Info`, `Warning` có tương đồng về tham số với `delegate` trên, nên hai hàm này có thể dùng để gán vào biến kiểu ShowLog, xem đoạn mã đầy đủ sau:

```csharp
// Logs.cs
using System;

namespace CS008_Anonymous
{
    public class Logs
    {
        // Khai báo một delegate
        public delegate void ShowLog(string message);

        // Phương thức tương đồng với ShowLog (tham số, kiểu trả về)
        static public void Info(string s)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine(string.Format("Info: {0}", s));
            Console.ResetColor();
        }

        // Phương thức tương đồng với ShowLog (tham số, kiểu trả về)
        static public void Warning(string s)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(string.Format("Waring: {0}", s));
            Console.ResetColor();
        }

        public static void TestShowLog()
        {
            ShowLog showLog;

            showLog = Info;         // showLog gán bằng phương thức Info
            showLog("Thông báo");   // Thi hành delegate chính là thi hành Info

            showLog = Warning;      // showLog gán bằng phương thức Warning
            showLog("Thông báo");   // Thi hành delegate chính là thi hành Warning
        }
    }
}
```

- Kết quả chạy đoạn, khi gọi hàm `Logs.TestShowLog();`:

```bash
Waring: Thông báo
Info: Thông báo
```

###### Gán nhiều phương thức vào delegate

- Khi dùng delegate chạy một phương thức, cần đảm bảo biến delegate đó đã được gán phương thức (biến khác null), có thể bạn kiểm tra trước khi gọi ví dụ: `if (showLog != null) showLog("Mgs")` hoặc gắn gọn hơn `showLog?.Invoke("Mgs")`;

- `4:` Một `delegate` có thể đưa vào nó nhiều phương thức để một lần gọi thi hành tất cả các phương thức nó chứa
  - `Toán tử +=` Nối thêm một phương thức vào `delegate`, ví dụ `delegatevar += method1`
    - `Toán tử -=` : Loại bỏ 1 phương ở cuối (nếu phương thức đó có trong delegate, tính từ cuối) , ví dụ `delegatevar -= method1`
- Ví dụ:

```csharp
public static void TestShowLogMulti()
{
    ShowLog showLog;

    showLog = null;
    showLog += Warning;         // Nối thêm Warning vào delegate
    showLog += Info;            // Nối thêm Info vào delegate
    showLog += Warning;         // Nối thêm Warning vào delegate

    //Một lần gọi thi hành tất cả các phương thức trong chuỗi delegate
    showLog("TestLog");         //Hoặc an toàn: showLog?.Invoke("TestLog");
}
```

- Gọi phương thức `TestShowLogMulti` thì kết quả:

```bash
Waring: TestLog
Info: TestLog
Waring: TestLog
```

- `5:` Ngoài cách gán cho `delegate` một hàm có tên cụ thể như trên, bạn cũng có thể gán một phương thức Anonymous, ví dụ:

```csharp
showLog += (x) => Console.WriteLine(string.Format("===>{0}<===", x));
```

- `6:` Các `delegate` cùng kiểu có thể kết hợp lại với nhau bằng toán tử `+`. Ví dụ:

```csharp
// Cộng nhiều Delegate
public static void TestShowLogPlus()
{
    ShowLog showLog1 = (x)=> {Console.WriteLine($"-----{x}-----");};
    ShowLog showLog2 = Warning;
    ShowLog showLog3 = Info;

    var all = showLog1 + showLog2 + showLog3 + showLog1;

    all("Xin Chào");
}
```

- Gọi phương thức TestShowLogPlus kết quả là:

```bash
-----Xin Chào-----
Waring: Xin Chào
Info: Xin Chào
-----Xin Chào-----
```

###### Func và Action

- `Func` và `Action` là hai mẫu `delegate` định nghĩa sẵn, giúp bạn nhanh chóng tạo ra biến kiểu `delegate` mà không mất công khai báo, xem lại ví dụ trên nếu sử dụng đến Func, Action thì không cần có dòng khai báo:

```csharp
public delegate void ShowLog(string message);
```

**Sử dụng Func**

- `Func` là mẫu `delegate` có kiểu trả về. Để khai báo biến `delegate` dùng cú pháp như sau:

```csharp
Func<kiểu_tham_số_1, kiểu_tham_số_2, ..., kiểu_trả_về> var_delegate;
```

- Kiểu cuối cùng trong khai báo Func là kiểu trả về của hàm, có thể thiếu tham số nhưng không được thiếu kiểu trả về
- Ví dụ muốn có biến `delegate` tên bien1 tương đương với hàm có 2 tham số, tham số 1 kiểu int, tham số 2 kiểu string, và hàm trả về kiểu bool thì tạo biến đó như sau:

```csharp
Func<int, string, bool> bien1;
```

- Khai báo trên nếu bạn dùng cách thông thường tương ứng với:

```csharp
// Khai báo delegate ở lớp
delegate bool DelegateName(int a, string b);
// Khai báo biến trong phương thức
DelegateName bien1;
```

- Ví dụ:

```csharp
using System;

namespace CS008_Anonymous
{
    class FuncAction
    {
        static int Sum(int x, int y)
        {
            return x + y;
        }

        public static void TestFunc(int x, int y)
        {
            Func<int,int,int> tinhtong;         // biến tinhtong phù hợp với các hàm trả về kiểu int, có 2 tham số kiểu int
            tinhtong = Sum;                     // Hàm Sum phù hợp nên có thể gán cho biến

            var ketqua = tinhtong(x, y);
            Console.WriteLine(ketqua);
        }
    }
}
```

- Khi gọi phương thức TestFunc kết quả:

```csharp
FuncAction.TestFunc(5, 6); // In ra: 11
```

**Sử dụng Action**

- `Action` tương tự như `Func`, điều khác duy nhất là nó không có kiểu trả về, khai báo cơ bản như sau:

```csharp
Action<kiểu_tham_số_1, kiểu_tham_số_2, ... > var_delegate;
```

- Nghĩa là biến kiểu `Action` có thể gán bằng các hàm có kiểu trả về `void`
- Trở lại ví dụ cho hai hàm `Info` và `Warning` ở trên, có thể sử dụng ngay đoạn code sau, để có kết quả tương tự:

```csharp
public static void TestAction(string s)
{
    Action<string> showLog = null;

    showLog += Logs.Warning;         // Nối thêm Warning vào delegate
    showLog += Logs.Info;            // Nối thêm Info vào delegate
    showLog += Logs.Warning;         // Nối thêm Warning vào delegate

    // Một lần gọi thi hành tất cả các phương thức trong chuỗi delegate
    showLog("TestLog");
}
```

###### Sử dụng Delegate làm tham số hàm

- Có thể sử dụng `delegate` làm tham số của phương thức, nó có vai trò như những hàm callback linh hoạt. Xem ví dụ sau:

```csharp
// Sử dụng Delegate làm tham số phương thức, truyền callback
static void TinhTong(int a, int b, Action callback)
{
    int c = a + b;
    // Gọi callback
    callback(c.ToString());
}

public static void TestTinhTong()
{
    TinhTong(5,6, (x) => Console.WriteLine($"Tổng hai số là: {x}"));
    TinhTong(1,3, Logs.Info);
}

```

### 2. Biểu thức lambda trong C# - Sử dụng lambda với delegate

- Tìm hiểu về các biểu thức `lambda`, các hàm vô danh, định nghĩa phương thức với `lambda`, gán `lambda` cho Func và Action

###### Khai báo lambda C#

- `Biểu thức lambda` còn gọi là biểu thức hàm nặc danh (Anonymous), một biểu thức khai báo giống phương thức (hàm) nhưng thiếu tên. Cú pháp để khai báo biểu thức lambda là sử dụng toán dử `=>` như sau:

```csharp
(các_tham_số) => biểu_thức;
```

- Thậm chí là cả một cấu trúc lệnh sau toán tử `=>`

```csharp
(các_tham_số) =>
{
   // các câu lệnh
    // Sử dụng return nếu có giá trị trả về
}
```

- Các biểu thức lambda đều có thể chuyển đổi thành delegate, do vậy nó có thể gán cho các delegate phù hợp (bạn cần biết cách sử dụng delegate trước).

###### Sử dụng lambda C#

- Ví dụ, đây là một biểu thức `lambda`, nó tính tổng của hai số nguyên

```csharp
(int x, int y) => {
    return x + y;
};
```

- Có thể gán biểu thức này cho biến `delegate`. Ví dụ:

```csharp
using System;

namespace CS09_Anonymous_lambda {
    class Program {
        public delegate int TinhToan (int a, int b);
        static void Main (string[] args) {

            // Gán biểu thức lambda cho delegate
            TinhToan tinhtong = (int x, int y) => {
                return x + y;
            };

            int kq = tinhtong (5, 1); // kq = 6;
            Console.WriteLine(kq);
        }
    }
}
```

- Như phần trình bày về `Delegate`, có thể gán `biểu thức lambda` có kết quả trả về cho `Func` hoặc biểu thức không có kết quả trả về cho `Action`

```csharp
using System;

namespace CS09_Anonymous_lambda {
    class Program {
        public delegate int TinhToan (int a, int b);
        static void Main (string[] args) {

            //Gán lambda cho Func
            Func<int, int, int> tinhtong1 = (int x, int y) => {
                return x + y;
            };
            // Gán lambda cho Action
            Action<int> thongbao = (int vl) => {
                Console.WriteLine (vl);
            };

            int kq1 = tinhtong1 (5, 3); // kq1 = 8
            int kq2 = tinhtong1 (5, 5); // kq2 = 10
            thongbao (kq1); // In ra: 8
            thongbao (kq2); // In ra: 10

        }
    }
}
```

###### Định nghĩa phương thức với lambda

- Bạn có thể sử dụng toán tử `=>` sau khai báo tên phương thức (loại phương thức có kiểu trả về khác void) của lớp, rồi đến ngay một biểu thức có kết quả trả về (không dùng {}), biểu thức này như là định nghĩ thân của phương thức.
- Ví dụ, khai báo phương thức:

```csharp
int Tong(int x, int y) => x + y;
```

- Nó tương đương với dạng đầy đủ đã biết

```csharp
int Tong(int x, int y)
{
    return x + y;
}
```

### 3. Event trong C# - Các Event của .Net

###### Event trong C#

- Các sự kiện `(Event)` là cơ chế để một đối tượng (đối tượng của lớp) này thông báo đến đối tượng khác có điều gì đó mà lớp khác quan tâm vừa xảy ra. Lớp mà từ đó gửi đi sự kiện gọi tên nó là `publisher` và các lớp nhận được sự kiện gọi là là các `subsriber`.
- Để làm được việc này nó hoạt động giống hệt cơ chế `delegate`, thực tế là trong .NET các Event xây dựng với nền tảng chính là `delegate`, nên trước khi tìm hiểu Event hay vào tìm hiểu `delegate` trước.
- Vậy có vấn đề gì khi sử dụng `delegate` mà phải thêm khái niệm `Event`, hãy tìm hiểu trường hợp sau

###### Vấn đề của delegate và sự giải quyết của Event

- Ví dụ dưới đây sẽ dùng `delegate` (đã biết ở phần trước) để xây dựng cơ chế để một lớp này đăng ký nhận sự kiện từ một lớp khác

```csharp
//DelegateEvent.cs

using System;

namespace CS009_Event {

    /*
        Publisher là lớp phát đi sự kiện, bằng cách gọi
        một deleage trong phương thức Send
    */
    public class Publisher {
        public delegate void NotifyNews (object data);

        public NotifyNews event_news;

        public void Send () {
            event_news?.Invoke ("Co tin moi");
        }
    }

    // SubscriberA lớp này đăng ký nhận sự kiện từ Publisher,
    // bằng phương thức Sub, khi sự kiện xảy ra nó sẽ gọi ReceiverFromPublisher
    public class SubscriberA {
        public void Sub (Publisher p) {
            p.event_news += ReceiverFromPublisher;
        }

        void ReceiverFromPublisher (object data) {
            Console.WriteLine ("SubscriberA: " + data.ToString ());
        }
    }

    // SubscriberA lớp này đăng ký nhận sự kiện từ Publisher,
    // bằng phương thức Sub - khi đăng ký nó hủy việc nhận sự kiện của các đối tượng khác,
    // khi sự kiện xảy ra nó sẽ gọi ReceiverFromPublisher
    public class SubscriberB {
        public void Sub (Publisher p) {
            p.event_news = null;  // Hủy các đối tượng khác nhận sự kiện
            p.event_news += ReceiverFromPublisher;
        }

        void ReceiverFromPublisher (object data) {
            Console.WriteLine ("SubscriberB: " + data.ToString ());
        }
    }

}
```

- Khi áp dụng trong lớp `Program`

```csharp
static void TestDelegate()
{
    Publisher p = new Publisher();
    SubscriberA sa = new SubscriberA();
    SubscriberB sb = new SubscriberB();

    sa.Sub(p);
    sb.Sub(p);

    p.Send();
}
```

- Khi chạy thử - gọi hàm `TestDelegate`, thì kết quả in ra

```bash
SubscriberB: Co tin moi
```

- Phân tích vấn đề của đoạn mã trên:
- Lớp `Publisher` xây dựng một `delegate` có tên `NotifyNews` và khai báo thuộc tính event_news triển khai nó, khi Publisher thi hành `Send()` nó sẽ thi hành delegate này và như vậy những đối tượng nào đăng ký vào delegate sẽ có cơ hội nhận thông tin mới từ `Publisher`
- Hai lớp `SubscriberA` và `SubscriberB` tiến hành đăng ký phương thức `ReceiverFromPublisher` vào `Delegate` của `Pushisher`, và như vậy khi chạy code đã có kết quả như trên.
- Tuy nhiên, nhìn vào phương thức public void Sub(Publisher p) của `SubscriberB` thì đoạn mã:

```csharp
p.event_news = null;
```

- Nó đã gán `event_news` bằng null, có nghĩa là việc đăng ký của `SubcriberA` lúc trước bị loại bỏ bởi `SubcriberB`, dẫn tới chỉ có `SubcriberB` nhận được tin mới. **Điều này là phá hỏng nguyên tắc hoạt động của mô hình lập trình sự kiện - phá vỡ sự đóng gói**
- Để giải quyết vấn đề trên, thật đơn giản với .NET chỉ cần thêm từ khóa `event` vào định nghĩa `event_news` của `Pushliser`, và từ đây `event_news` gọi là `Event` chứ không còn gọi là `Delegate`

```csharp
public event NotifyNews event_news;
```

- Từ lúc này, các `Subscriber` chỉ có thể đăng ký nhận sự kiện với toán tử `+=` hoặc hủy nhận sự kiện với toán tử `-=` chứ không thể thực hiện gán `p.event_news = null` vì nếu viết code như vậy lập tức báo lỗi.
- Tóm lại, `Event` là `Delegate` nhưng khi khai báo thêm từ khóa `event`, dẫn tới chỉ có thể thực hiện toán tử `+=` hoặc `-=` với Event

###### Event trong thư viện .NET

- Các `Event` ví dụ như KeyDown, GotFocus, Load của Form, Application.ApplicationExit, Application.Idle ... đều xây dựng từ một delegate có tên `EventHandler`, nó đã định nghĩa sẵn có trong thư viện .NET với dạng:

```csharp
public delegate void EventHandler(object sender?, EventArgs e);
public delegate void EventHandler<TEventArgs>(object sender?, TEventArgs e);
```

- Như vậy bạn có thể sử dụng luôn `delegate EventHandler` để xây dựng các `Event` của riêng mình sử dụng cho các `Publisher`, chỉ cần xây dựng các lớp phái sinh từ `EventArgs` với mục đích thêm vào các tham số riêng khi gửi sử kiện. Ví dụ:

```csharp
//UseEventHandler.cs

using System;

namespace CS009 {

  // Xây dựng lớp MyEventArgs kế thừa từ EventArgs
  public class MyEventArgs : EventArgs {
    public MyEventArgs (string data) {
      this.data = data;
    }
    // Lưu dữ liệu gửi đi từ publisher
    private string data;

    public string Data {
      get { return data; }
    }
  }

  // Xây dựng lớp, phát đi sự kiện (data)
  public class ClassA {
    // Tạo Event với EventHandler
    public event EventHandler event_news;

    public void Send () {
      event_news?.Invoke (this, new MyEventArgs ("Có tin mới Abc ..."));
    }
  }

  public class ClassB {
    public void Sub (ClassA p)
    {
      p.event_news += ReceiverFromPublisher;
    }

    private void ReceiverFromPublisher (object sender, MyEventArgs e)
    {
      Console.WriteLine ("ClassB: " + e.Data);
    }
  }


  public class ClassC {
    public void Sub (ClassA p)
    {
      p.event_news += ReceiverFromPublisher;
    }

    private void ReceiverFromPublisher (object sender, MyEventArgs e)
    {
      Console.WriteLine ("ClassC: " + e.Data);
    }
  }

}
```

- Khi sử dụng

```csharp
static void TestEventHandler ()
{
    ClassA p  = new ClassA();
    ClassB sa = new ClassB();
    ClassC sb = new ClassC();

    sa.Sub (p); // sa đăng ký nhận sự kiện từ p
    sb.Sub (p); // sb đăng ký nhận sự kiện từ p

    p.Send ();
}
```

- Kết quả chạy

```csharp
ClassB: Có tin mới Abc ...
ClassC: Có tin mới Abc ...
```

- Lưu ý: lớp `MyEventArgs` xây dựng kế thừa từ `EventArgs` ở trên với mục đích chuyên trở thêm dữ liệu, để đảm bảo dữ liệu không bị sửa đổi bởi các `Subsriber` thì data xây dựng theo cách thức như trên để chỉ có thể đọc! (sau khi khởi tạo từ hàm khởi tạo)

### 4. Các phương thức mở rộng trong C#

- Sử dụng kỹ thuật với các phương thức mở rộng (extension method) để bổ sung vào các lớp thư viện có sẵn những phương thức mới mà không cần biên dịch lại

###### Các phương thức mở rộng trong C#

- Các `phương thức mở rộng` là các phương thức thêm vào lớp, cấu trúc, giao diện có sẵn mà không cần thiết phải kế thừa lớp để tạo ra các lớp mới, không cần biên dịch lại thư viện. **Các phương thức mở rộng khai báo là những phương thức tĩnh, nhưng lại được gọi thông qua đối tượng lớp mà phương thức mở rộng đó khai báo**.
- Kỹ thuật dùng hàm mở rộng để bổ sung các tính năng cho thư viện sẵn có được dùng rất nhiều trong thư viện `LINQ` - để mở rộng chức năng cho các `IEnumerable`
- Xem ví dụ sau:

```csharp
using System.Collections.Generic;

namespace CS020_ExtensionMethod
{
    class Program
    {
        static void Main(string[] args)
        {
            List<int> ls = new List<int>() {1,2,3,4};
            var ps = ls.Where(i => i >= 3);             // Lỗi vì List không có phương thức Where
        }
    }
}
```

- Giờ sửa lại code như sau:

```csharp
using System.Collections.Generic;
using System.Linq;                                      // Nạp thư viện LINQ

namespace CS020_ExtensionMethod
{
    class Program
    {
        static void Main(string[] args)
        {
            List<int> ls = new List<int>() {1,2,3,4};
            var ps = ls.Where(i => i >= 3);             // Linq đã mở rộng thêm vào List phương thức Where
        }
    }
}
```

###### Khai báo phương thức mở rộng

- Hãy tạo một phương thức tĩnh sau, phương thức này in chuỗi ra màn hình với màu Console nhập vào.

```csharp
public static void Print(string s, ConsoleColor color = ConsoleColor.Yellow)
{
     ConsoleColor lastColor = Console.ForegroundColor;
     Console.ForegroundColor = color;
     Console.WriteLine(s);
     Console.ForegroundColor = lastColor;
}
```

- Đây là một phương thức tĩnh bình thường, sử dụng nó để in một chuỗi ra màn hình, chuỗi nhập ở tham số thứ nhất

```csharp
Print("Test string ...");
```

- Giờ nếu muốn hàm `Print` như một hàm mở rộng của đối tượng kiểu string, ta sẽ thực hiện như sau:
  - Chuyển khai báo Print trong một lớp tĩnh
  - Đảm bảo Print là phương thức tĩnh
  - Tham số đầu tiên của hàm là kiểu string (lớp mà phương thức mở rộng sẽ thêm vào) cho thêm từ khóa this vào phía trước kiểu này - để cho biết sẽ mở rộng lớp string với phương thức này.

```csharp
public static class MyExtensionMethods {
     public static void Print(this string s, ConsoleColor color = ConsoleColor.Yellow)
     {
         ConsoleColor lastColor = Console.ForegroundColor;
         Console.ForegroundColor = color;
         Console.WriteLine(s);
         Console.ForegroundColor = lastColor;
     }
}
```

- Bằng cách khai báo như trên, đã mở rộng string, thêm vào nó phương thức Print, hàm này sẽ được gọi trên đối tượng lớp string.

```csharp
string s = "Chuỗi kiểm tra";
s.Print();                                   // Chuỗi kiểm tra  (có màu vàng)
"Xin chào các bạn!".Print(ConsoleColor.Red); // in ra "Xin chào các bạn!" có màu đỏ
```

- Bằng cách như vậy bạn có thể mở rộng các lớp có sẵn.

### 5. Hàm hủy - Quá tải toán tử - Thành viên tĩnh - Indexer

###### Hàm hủy của lớp - Finalizer hoặc Destructor

- Ở phần cơ bản về lớp, đã biết phương thức khởi tạo - phương thức này chạy khi tạo đối tượng lớp, ngược lại khi đối tượng bị hủy (giải phóng) nó sẽ tự động thi hành một phương thức gọi là phương thức hủy (hàm hủy `Finalizer` hay `Destructor`). Dùng phương thức hủy khi có nhu cầu dọn dẹp, giải phóng tài nguyên chiếm giữ ..

```csharp
class MyClass {
    ~MyClass()
    {
        // Thân phương thức hủy
    }
}
```

- Khi sử dụng phương thức hủy lưu ý:
  - Một lớp chỉ được khai báo một phương thức hủy (trong khi có thể có nhiều phương thức tạo)
  - Bạn không thể gọi phương thức hủy một cách chủ động được (do hệ thống quản lý NET CORE tự quyết định thi hành nó khi nào)
  - Khai báo phương thức hủy: tên trùng tên lớp, phía trước code ký hiệu ~, phương thức không được có tham số.

###### Khi nào hàm hủy được gọi - cơ chế dọn dẹp bộ nhớ với GC

- Trong `.NET` có dịch vụ hệ thống tên GC `(garbage collector)`, nó là dịch vụ được chạy một cách tự động nhằm thu hồi bộ nhớ do `.NET` cấp phát trên `HEAP` không còn dùng đến quản lý bởi `.NET`. `GC` được thi hành tự động khi hệ thống thấy thiếu bộ nhớ - mặc dù bạn có thể yêu cấu `.NET` tiến hành thu hồi bộ nhớ không còn dùng đến ngày bằng cách gọi GC.Collect();
- Bộ nhớ trên `HEAP` là nơi lưu các đối tượng được tạo ra từ lớp (toán tử new), khi đối tượng đó không còn biến nào tham chiếu (trỏ) đến thì nó sẽ được đánh dấu thu hồi - và khi GC thu hồi - phương thức hủy sẽ được thi hành.

```csharp
// VÍ DỤ
// Tạo một lớp là Product có cả phương thức tạo và hủy
//DestructorExample.cs
class Product {
    private string product_name;
    public Product(string name)
    {
        this.product_name = name;
        Console.WriteLine("Tạo - " + product_name);
    }
    ~Product() {
        Console.WriteLine("Hủy - " + product_name);
    }
}
```

- Sử dụng lớp Product tạo đối tượng như sau:

```csharp
// Program.cs
using System;

namespace CS011_ClassAdvanced
{
    class Program
    {
        static void TestConstructor() {
            Product p = new Product("ABC");  // Tạo đối tượng, biến p tham chiếu đến đối tượng
            p = null;
            // Biến p gán bằng null, đối tượng tạo ra phía trên,
            // không còn biến nào tham chiếu đến => Nó được đánh dấu
            // sẽ bị thu hồi bởi GC, lúc nào GC chạy do NET quyết định
        }

        static void Main(string[] args)
        {
            TestConstructor();

            // Ép  hệ thống thu hồi bộ nhớ (thực tế không cần ép, nó sẽ tự chạy khi cần)
            GC.Collect();

        }
    }
}
```

- Chạy chương trình - có kết quả:

```csharp
// Tạo - ABC
// Hủy - ABC
```

**Bạn thấy `phương thức HỦY` chạy khi đối tượng không còn tham chiếu nào đến nó, tại đây thích hợp để bạn thực hiện các thao tác cần giải phóng tài nguyên như Bô nhớ, Đóng file, ngắt kết nối ...**

###### Quá tải toán tử trong C#

- Quá tải toán tử `(Operator Overloading)` trong C#, giúp bạn định nghĩa mới (hoặc định nghĩa lại) hoạt động của các toán tử trên những đối tượng lớp do bạn định nghĩa.
- Ví dụ, bạn có một lớp `MyVector` như sau:

```csharp
class MyVector {
    double x;
    double y;
    public MyVector(double x, double y)
    {
        this.x = x;
        this.y = y;
    }
    public void ShowXY() {
        Console.WriteLine("x = " + x);
        Console.WriteLine("y = " + y);
    }
}
```

- Giờ bạn muốn có phép toán `+` trên những đối tượng sinh ra từ lớp này, ví dụ:

```csharp
MyVector v1 = new MyVector(2,3);
MyVector v2 = new MyVector(3,4);

MyVector v3 = v1 + v2;
```

- Nghĩa là `v1 + v2` sẽ tạo ra một đối tượng mới
- Để định nghĩa toán tử `+`, nó định nghĩa giống phương thức thay tên bằng từ khóa `operator` và ký hiệu toán tử `+`, toán tử có kiểu trả về `MyVector`, hai toán hạng bên trái và bên phải đểu là đối tượng lớp `MyVector` nghĩa làm tham số trong định nghĩa là 2 đối tượng này.
- Cho thêm định nghĩa sau vào lớp `MyVector`

```csharp
public static MyVector operator+(MyVector a, MyVector b)
{
    double sx = a.x + b.x;
    double sy = a.y + b.y;
    MyVector v = new MyVector(sx,sy);
    return v;
}
```

- Giờ đã có thể sử dụng toán tử `+` chạy thử đoạn code

```csharp
MyVector v1 = new MyVector(2,3);
MyVector v2 = new MyVector(3,4);

MyVector v3 = v1 + v2;
v3.ShowXY();
// Kết quả
// x = 5
// y = 6
```

###### Thành viên tĩnh trong lớp C#

- Các thành viên trong lớp (phương thức, biến, thuộc tĩnh) khi khai báo có từ khóa `static` ở đầu thì nó là thành viên tĩnh. **Thành viên tĩnh thì nó không thuộc về đối tượng cụ thể nào, có thể sử dùng mà không cần tạo đối tượng**. Truy cập đến thành viễn tĩnh thông qua `TÊN-LỚP.tên-thành-viên-tĩnh.`
- Đối với biến tĩnh thì dùng cho cho mọi đối tượng thuộc lớp, được khởi tạo một lần duy nhất. Nếu muốn khởi tạo thành viên tĩnh của lớp khi lần đầu truy cập có thể dùng phương thức khởi tạo tĩnh - xem thêm tại Static [Constructor](https://xuanthulab.net/khoi-tao-phuong-thuc-khoi-tao-trong-c-sharp.html#StaticConstructor)
- Ví dụ biến tĩnh

```csharp
class CountNumber {
    public static int num = 0;
    public void count() {
        num++;
    }
    public int getNum() {
        return num;
    }
}
```

- Sử dụng:

```csharp
CountNumber c1 = new CountNumber();
CountNumber c2 = new CountNumber();

c1.count();     // CountNumber.num = 1;
c2.count();     // CountNumber.num = 2;
c1.count();     // CountNumber.num = 3;
c2.getNum();    // trả ve 3
```

- Ví dụ phương thức tĩnh

```csharp
class MethodStatic {
    public static int  Sum(int a, int b)
    {
        return a + b;
    }
}
```

- Sử dụng

```csharp
MethodStatic.Sum(1,2); // tra về 3 - gọi phương thức mà không cần tạo đối tượng
```

###### Thành viên biến chỉ đọc (readonly) trong lớp C#

- Để khai báo một biến trở thành dạng chỉ đọc thì thêm vào đó Modify có tên là `readonly`. Ví dụ:

```csharp
public readonly string name;
```

- Biến `readonly` có nghĩa là chỉ đọc, không sửa đổi được nữa. Tuy nhiên so với hằng số `const` thì có mấy điểm khác như sau:
  - Hằng số thì phải khởi tạo ngay giá trị cho nó khi khởi tạo, biến `readonly` thì không khởi tạo ngay cũng được
  - Biến `readonly` có thể gán giá trị cho nó trong hàm khởi tạo (và giá trị gán theo kết quả của một biểu thức nào đó)

```csharp
class Student {
    // khai báo biến readonly
    public readonly string name;
    public Student(string name)
    {
        // khởi tạo biến readonly ở hàm tạo (bắt buộc nếu biến khai báo mà chưa khởi tạo)
        this.name = name;
    }
}
```

- Sử dụng:

```csharp
Student s = new Student("Abc");     // khởi tạo biến readonly trong hàm tạo
string n = s.name;                  // đọc biển readonly
s.name = "AA";                      // lỗi - vì không thể gán - chỉ có thể đọc
```

###### Lớp tĩnh static class trong C#

- Khi khai báo lớp, bạn có thể khai báo nó là lớp tĩnh bằng cách thêm Modify `static` trước tên lớp. Ví dụ:

```csharp
public static class MyStaticClass {
    // ... các thành viên tĩnh
}
```

- **Khi `MyStaticClass` khai bão là lớp tĩnh như trên, thì các thành viên khai báo trong lớp đều phải khai báo là thành viên tĩnh.** Thường dùng lớp tĩnh đề gom các hàm tiện ích lại với nhau. Ví dụ trong C# có lớp `Math` là lớp tĩnh chứa các phương thức toán học dùng ngày như: `Math.Abs()` `Math.Sin()` ...

###### Bộ đánh chỉ mục indexer trong C#

- `Indexer` là khả năng cho phép truy cập đến các thành viên của lớp, thực hiện một số tác vụ thông qua ký hiệu chỉ mục `[chỉ-mục]` (ký hiệu chỉ mục được dùng để truy cập các phần tử mảng - trình bày ở phần mảng C#)
- Ví dụ, một đối tượng `obj` nếu có hỗ trợ bộ chỉ mục, số nguyên thì có thể truy cập đến dữ liệu, phương thức bằng cách viết `obj[0]`, `obj[1]` ... hay hỗ trợ chỉ mục dạng chuỗi thì truy cập bằng `obj["index-a"]`, `obj["adress"]` ...
- Để khai báo một bộ chỉ mục, khai báo gần giống như cú pháp khai báo thuộc tính lớp, setter/getter , cú pháp cơ bản như sau:

```csharp
public kiểu_trả_về this[kiểu_index index]
{
    get {
        // thực hiện các tác vụ và trả về dữ liệu có kiểu_trả_về
     }
    set {
        // giá trị được truyền trong biến value, có thể lưu nó vào nơi thích hợp
     }
}
```

- Ví dụ có lớp `IndexerExam` chứa hai thành viên dữ liệu `ho` và `ten`, ta thử định nghĩa bộ chỉ mục số nguyên, nếu chỉ mục là 0 thì truy cập đến dữ liệu họ và 1 là ten.

```csharp
class IndexerExam {
    string ho = "Nguyễn";
    string ten = "Nam";

    // Bộ chỉ mục số nguyên, chỉ mục là 0 hoặc 1 nếu khác sẽ phát sinh Exception
    public string this[int index]
    {
        // Đọc dữ liệu theo chỉ mục
        get {
            if (index == 0) return ho;
            else if (index == 1) return ten;
            else throw new Exception("Chỉ số không tồn tại");
         }

         // Gán dữ liệu theo chỉ mục
        set {
            if (index == 0)  ho = value;
            else if (index == 1) ten = value;
            else throw new Exception("Chỉ số không tồn tại");
        }
    }

}

```

- Trong đó `throw new Exception("Chỉ số không tồn tại");` là dòng phát sinh ra một `Exception`, khi cố gắng truy cập bằng một giá trị index không cho phép, kỹ thuật phát sinh Exception - lỗi sẽ tìm hiểu sau.
- Giờ thì đối tượng lớp `IndexerExam` truy cập được bằng ký hiệu `[]`, ví dụ:

```csharp
IndexerExam obj = new IndexerExam();

Console.WriteLine(obj[0] + " " + obj[1]);      // đọc obj.ho và obj.ten
obj[0] = "Đinh";                               // gán obj.ho
obj[1] = "Quang Hưng";                         // gán obj.name
Console.WriteLine(obj[0] + " " + obj[1]);      // đọc obj.ho và obj.ten
// Kết quả chạy:
// Nguyễn Nam
// Đinh Quang Hưng
```

### 6. Ngoại lệ Exception

- Tìm hiểu và sử dụng ngoại lệ `Exception` câu lệnh `try catch` trong C#
- Cách bắt các lỗi ngoại lệ Exception phát sinh trong lập trình C# với cấu lệnh try catch finally, cách tạo và phát sinh các ngoại lệ

###### Ngoại lệ Exception

- Ngoại lệ `(exception)` là vấn đề - lỗi phát sinh trong quá trình thực thi chương trình. Thường khi chương trình đang chạy mà phát sinh ngoại lệ (lỗi) thì dẫn đến chương trình kết thúc ngay lập tức. Có vô số nguyên nhân để chương trình đang chạy mà phát sinh ngoại lệ, ví dụ:
  - Dữ liệu người dùng nhập sai, mà chương trình không kiểm soát được
  - Thực hiện các phép toán không được phép (như chia một số cho 0)
  - Thao tác với tài nguyên không tồn tại (như mở file không có trên đĩa, kết nối đến CSDL không tồn tại ...)
  - Thiếu bộ nhớ
- Trong C# khi có một lỗi phát sinh (hầu hết các lỗi đều có thể quản lý bởi thư viện C#) thì nó sẽ phát sinh ra một đối tượng lớp `Exeption` (System.System) hoặc đối tượng lớp nào đó kế thừa từ `Exception`
- Khi một đối tượng lớp `Exception` sinh ra - mà chương trình không chủ động xử lý đối tượng này thì chương trình sẽ kết thúc. Đối tượng lớp `Exception` chứa trong nó các thông tin về lỗi (dòng thông báo, nguyên nhân lỗi, nơi phát sinh lỗi ...)

###### Thử phát sinh một Exception

```csharp
static void Main(string[] args)
{

    int[] mynumbers = new int[] {1,2,3};
    int i = mynumbers[10];     // chỗ này phát sinh lỗi
}
```

- Đoạn code trên khi chạy sẽ phát sinh lỗi bởi vì, `mynumbers` là mảng có 3 phần tử, nhưng chi đọc lại cố tình truy cập đến phần tử thứ 11 `mynumber[10]`
- Do lỗi này không được xử lý, nên chương trình kết thúc ngay lập tức và có đọc được thông báo về lỗi như hình trên.

###### Xử lý ngoại lệ - Exception

- Nếu ngoại lệ (lỗi thực thi) phát sinh mà không xử lý thì chương trình sẽ dừng đột ngột - nếu muốn xử lý ngoại lệ thì ta cần bắt lấy nó và điều hướng chương trình một cách thích hợp. Để bắt ngoại lệ ta sử dụng câu lệnh `try ... catch ...` như sau:

```csharp
try {
   // Các khối code được giám sát để bắt lỗi nếu có
   // nếu có lỗi sẽ phát sinh ngoại lệ Exception
   // Ngoại lệ này bắt lại được ở khối catch
}
catch (Exception loi)
{
  // Khối này thực thi khi có lỗi - đối tượng Exception bắt được lưu ở biến loi
}
```

- Như vậy đoạn code nào muốn giám sát để bắt ngoại lệ - thì đưa vào khối `try`, nếu ngoại lệ xảy ra do code trong khối đó thì sẽ bắt được - chương trình sẽ không kết thúc mà lập tức chuyển sang khối `catch`, tại đó bạn có ngay đối tượng lớp `Exception` - bạn cần xử lý theo logic ứng dụng của bạn điều hướng chương trình một cách thích hợp ở đây.
- Đối tượng lớp `Exception` có một số thuộc tính, tiện dụng cho bạn gỡ rối đó là:
  - `Message`: chuỗi chứa nội dung thông báo lỗi
  - `StackTrace`: chuỗi chứa các bước thực thi chương trình cho đến khi bị lỗi (có chứa các phương thức, hàm khi thực thi gây lỗi, vị trí file lỗi ...)
  - `Source`: chứa tên ứng dụng hoặc đối tượng bị lỗi
- Thực hành bắt lỗi:

```csharp
static void Main(string[] args)
{
    try {
        // khối này được giám sát để bắt lỗi - khi nó phát sinh
        int[] mynumbers = new int[] {1,2,3};
        int i = mynumbers[10];                  // dòng này phát sinh lỗi
        Console.WriteLine(i);                   // dòng này không được thực thi vì lỗi trên
    }
    catch (Exception loi)
    {
        // khối này thực thi khi bắt được lỗi
        Console.WriteLine("Có lỗi rồi");
        Console.WriteLine(loi.Message);
    }

}
```

###### Bắt nhiều ngoại lệ

- Trong .NET từ lớp cơ sở `Exception` nó xây dựng nên rất nhiều loại ngoại lệ khác phục vụ chi tiết cho từng loại lỗi phát sinh khác nhau như: `FileNotFoundException, FormatException, OutOfMemoryException, ArgumentException, NullReferenceException, IndexOutOfRangeException, DivideByZeroException...`
- Để bắt cụ thể một loại ngoại lệ nào đó chỉ việc thêm một khối catch tương ứng với ngoại lệ đó.

```csharp
try {
    int x = 10;
    int y = 0;
    int z = x / y;

}
catch (DivideByZeroException e1) {
    Console.WriteLine(e1.Message);
}
catch (Exception e2) {
    Console.WriteLine(e2.Message);
}
```

- Khi có ngoại lệ chia một số cho 0, thì khối catch với ngoại lệ kiểu `DivideByZeroException` được thi hành, còn ngoại lệ khác sẽ do khối catch thứ 2 thi hành. Bằng cách như vậy bạn có thể khai báo nhiều khối catch tùy nhu cầu.

###### Thêm vào khối finally

- Trong lệnh `try ... catch`, bạn có thể thêm một tùy chọn là khối `finally`, code trong khối này được thực thi ngay cả khi có phát sinh ngoại lệ hay không. Khối này cơ bản để giải phóng các tài nguyên chiếm giữ.

```csharp
int x = 10;
int y = 0;
int z = 0;
try {
    z = x / y;
}
catch (DivideByZeroException e1) {
    Console.WriteLine(e1.Message);
}
finally {
    // Luôn được thi hành dù có phát sinh ngoại lệ hay không
    Console.WriteLine(z);
}
```

###### Phát sinh ngoại lệ với throw

- Nếu code của bạn muốn phát sinh ngoại lệ cho biết có một lỗi nào đó vừa xảy ra thì bạn cần tạo ra một đối tượng lớp Exception hoặc đối tượng thuộc lớp nào đó kế thừa từ `Exception`, sau đó phát sinh bằng lệnh `throw`
- Ví dụ, xây dựng hàm `Thuong` nếu tham số thứ 2 bằng không thì phát sinh ngoại lệ.

```csharp
public static double Thuong(double x, double y) {
    if (y == 0) {
        // Khởi tạo ngoại lệ, tham số là thông báo lỗi
        Exception myexception = new Exception("Số chia không được bằng 0");

         // phát sinh ngoại lệ, code phía sau throw không được thực thi
        throw myexception;
    }
    return x / y;
}
static void Main(string[] args)
{
    double z = Thuong(100,0);
}
```

- Khi chạy, ngoại lệ sẽ phát sinh, và ngoại lệ đó là `myexception`, chứa thông báo lỗi do bạn thiết lập. Do chương trình không bắt ngoại lệ này, nên nó dừng ngay lập tức
- Giờ muốn bắt chính ngoại lệ do bạn phát sinh

```csharp
static void Main(string[] args)
    try {
        double z = Thuong(100,0);
    }
    catch (Exception e) {
        Console.WriteLine(e.Message);
    }
}
```

- Chạy, sẽ in ra dòng: `"Số chia không được bằng 0"`

###### Tạo Exeption riêng

- Nếu muốn tạo ra các lớp để quẳng ra các lỗi khi cần thiết, thì chỉ việc kế thừa lớp `Exception`. Lợi ích việc tạo ra lớp riêng, nó giúp cho việc quản lý lỗi - gỡ rối tốt hơn.
- Ví dụ, người dùng đưa vào một dữ liệu chuỗi `string`, chuỗi này phải có độ dài dưới 10 ký tự, nếu dài hơn thì phát sinh Exception riêng, bạn sẽ xây dựng một lớp kế thừa từ `Exception` chuyên dành cho lỗi này
- Tạo thử một lớp đặt tên là `DataTooLongExeption` như sau:

```csharp
using System;
namespace CS015_Error_Exception
{
    public class DataTooLongExeption : Exception
    {
        const string erroMessage = "Dữ liệu quá dài";
        public DataTooLongExeption() : base(erroMessage) {
        }
    }
}
```

- Sử dụng nó để phát sinh ngoại lệ

```csharp
using System;

namespace CS15_Error
{
    class Program
    {
        public static void UserInput(string  s) {
            if (s.Length > 10)
            {
                Exception e = new DataTooLongExeption();
                throw e;    // lỗi văng ra
            }
            //Other code - no exeption
        }
        static void Main(string[] args)a
        {
             try {
                 UserInput("Đây là một chuỗi rất dài ...");
             }
             catch (DataTooLongExeption e) {
                 Console.WriteLine(e.Message);
             }
             catch (Exception otherExeption) {
                 Console.WriteLine(otherExeption.Message);
             }
        }
    }
}
```

- Khi chạy, ngoại lệ phát sinh và bắt lại được - nó in ra thông báo của ngoại lệ - dữ liệu quá dài

### 7. Sử dụng giao diện IDisposable và từ khóa using trong C#

-Tìm hiểu các tài nguyên không quản lý bởi .NET, triển khai giao diện IDisposable, giải phóng tài nguyên unmanaged trong Dispose với từ khóa lệnh using

###### Giao diện IDisposable

- Trong thư viện `.NET` đưa ra một giao diện `interface` có tên là `IDisposable` (System.IDisposable).
- Giao diện này chỉ có định nghĩa một phương thức:

```csharp
public void Dispose ();
```

- Các lớp triển khai giao diện này chỉ việc định nghĩa nội dung phương thức này, mục đich code viết trong phương thức này là các thao tác để giải phóng các tài nguyên chiếm giữ - khi đối tượng bị hủy

**Tại sao cần tự giải phóng tài nguyên**

- Như đã biết, trong `.NET` hầu hết các loại tài nguyên là được quản lý bởi CLR của hệ thống `.NET`, nên các tài nguyên, đối tượng không còn tham chiếu đến nó sẽ tự động được CLR thu hồi (GC). Đó là những tài nguyên quản lý được bởi `.NET CLR`
- Tuy nhiên, vẫn có những loại tài nguyên mà CLR .NET không quản lý được như:
  - Mở file - stream
  - Các kết nối mạng, kết nối đến CSDL ...
  - Những vùng bộ nhớ không quản lý được, các font chữ ...
- Với những loại tài nguyên này, .NET không biết tự giải phóng nó thế nào, nên bạn phải có một cơ chế chủ động làm việc này khi không còn dùng đến nữa.
- Bạn cần viết code giải phóng tài nguyên thích hợp ở phương thức hủy (`Finalize`) và có thể là triển khai giao diện `IDisposable` để sử dụng với câu lệnh `using`

###### Câu lệnh using

- Khi một lớp nào đó, triển khai giao diện `IDisposable` thì có thể dùng với `using`. khi đó, hết lệnh `using` đối tượng sẽ tự động được gọi `Dispose`.
- Cú pháp cơ bản như sau:

```csharp
using (obj_1, obj_2 ... obj_n) {
    //các câu lệnh trong Using
}
```

- Trong đó, các `obj_1, obj_2 ..`. là các đối tượng của những lớp triển khai giao diện `IDisposabe`
- Hãy thử ví dụ sau:

```csharp
// Lớp A triển khai giao diện IDisposable
class A : IDisposable {
    bool resource = true;
    public void Dispose() {
        Console.WriteLine("Phương thức này gọi tự động khi hết using");
        resource = false; // giải phóng tài nguyên
    }
}
```

- Sử dụng `Using` với lớp trên

```csharp
using (var a = new A()) {
    Console.WriteLine("Do something ...");
}
```

- Chạy code trên - kết quả là:

```csharp
// Do something ...
// Phương thức này gọi tự động khi hết using
```

- Đây chính là cách để chủ động giải phóng tài nguyên không quản lý được bởi `.NET`, khi tài nguyên đó không còn dùng đến nữa. Thư viện `.NET` có hàng trăm lớp triển khai IDisposable bạn có thể sử dụng với using như: `Font, Brush, Stream, TextReader, WebResponse, Socket, DbConnection ...`
  **Khi sử dụng đối tượng triển khai IDisposable mà không dùng using, bạn phải chủ động gọi thủ công Dispose khi tài nguyên không dùng đến.**

###### Triển khai IDisposable cùng với hàm Hủy

- Hàm hủy - phương thức hủy (còn gọi là `Finalize`) như trình bày ở mục phương thức hủy (`Finalize`), nó là phương thức tự động chạy khi đối tượng không còn tham chiếu - và cũng dùng nó để viết code giải phóng tài nguyên
- Vấn đề xảy ra khi một lớp vừa có hàm hủy vừa có `Dispose()` (triển khai IDisposable) là: thao tác giải phóng tài nguyên có thể thực hiện hai lần - một lần khi ra khỏi using - một lần đối tượng mất tham chiếu. Hoặc khi đối tượng chủ động gọi Dispose nhiều lần. Điều này có thể dẫn đến lỗi.
- Cách giải quyết là cần có biến lưu lại trạng thái cho biết Dispose đã được thi hành hay chưa.
- Ví dụ, một lớp `WriteData` có triển khai `IDisposable` có thể cần giải phóng một số tài nguyên nó chiếm giữ không quản lý được bởi `.NET`. `WriteData` cũng có sử dụng đối tượng lớp `StreamWriter`, đối tượng này cũng triển khai `IDisposable`, nên nó cần gọi thủ công `Dispose()` của nó khi không còn dùng đến nữa.

```csharp
public class WriteData : IDisposable {

    // trường lưu trạng thái Dispose
    private bool m_Disposed = false;

    private StreamWriter stream;

    public WriteData (string filename) {
        stream = new StreamWriter (filename, true);
    }

    // Phương thức triển khai từ giao diện
    public void Dispose () {
        Dispose (true);
        GC.SuppressFinalize (this);
    }

    // Nếu disposing = true -> Được thi hành do gọi trực tiếp (do Dispose gọi)
    // tài nguyên managed, unmanaged được giải phóng
    // nếu disposing = fale -> Được thi hành bởi phương thức hủy, chỉ cần giải phóng
    // các toàn nguyên unmanaged.
    protected virtual void Dispose (bool disposing) {
        if (!m_Disposed) {
            if (disposing) {
                // các đối tượng có Dispose gọi ở đây
                stream.Dispose();
            }

            // giải phóng các tài nguyên không quản lý được cửa lớp (unmanaged)

            m_Disposed = true;
        }
    }

    ~WriteData () {
        Dispose(false);
    }

}
```

- Mẫu trên bạn có thể áp dụng cho bất ký lớp nào muốn triển khai IDisposable, lúc đó bạn sử dụng using hay không using nó đều hoạt động đúng logic
- Sử dụng với using, hết lệnh Dispose sẽ thi hành và mọi tài nguyên được giải phóng

```csharp
using (WriteData writeData = new WriteData("filename.txt")) {
    // do something
}
```

- Nếu không dùng using, thì chủ động gọi Dispose, tài nguyên cũng giải phóng đúng yêu cầu.

```csharp
WriteData writeData = new WriteData("filename.txt");
//do something
writeData.Dispose();
```

### 8. Làm việc với File cơ bản, lưu và đọc file text trong C#

- Đọc thông tin ổ đĩa trong .NET với C#, tiện ích đường dẫn với lớp Path, làm việc với lớp File cơ bản để lưu và đọc file text, quản lý thư mục - tạo mới, xóa thư mục với lớp Directory, đệ quy liệt kê tất cả file, thư mục trong một thư mục
- Phần này tìm hiểu về hệ thống File, thư mục, ổ đĩa làm việc với .NET bằng C#. Như đọc thông tin ổ đĩa, đóng - mở file, copy file, xóa file, ghi dữ liệu ra file ...

###### Đọc thông tin ổ đĩa - DriveInfo

- Thư viện `.NET` cung cấp lớp `DriveInfo` tại namespace `System.IO` giúp đọc thông tin các ổ đĩa có trong hệ thống. Phương thức `DriveInfo.GetDrives()` trả về mảng gồm các đối tượng `DriveInfo`, mỗi đối tượng chứa thông tin về một ổ đĩa. Có thể tham khảo các thuộc tính:

**Các thuộc tính của lớp DriveInfo**

- `IsReady`: `true` - ổ đĩa ở trạng thái sẵn sàng (hoạt động) - ví dụ ổ đĩa CD nếu không có đĩa thì không sẵn sàng - false
- `DriveType`: kiểu ổ đĩa (System.IO.DriveType) : CDRom, Fixed, Network, NoRootDirectory, Ram, Removable, Unknown
- `VolumeLabel`: Nhãn đĩa
- `DriveFormat`: Chuỗi cho biết định dạng đĩa: NTFS, FAT32, FAT, devfs ...
- `AvailableFreeSpace`: Số byte có hiệu lực còn trống (theo hạn ngạch người dùng)
- `TotalFreeSpace`: Số byte còn trống
- `TotalSize`: Tổng số byte trên đĩa

```csharp
using System;
using System.IO;
namespace CS016_FilesDirectories {
    public class GetDriveInfomation {
        /// <summary>
        /// In các thông tin ổ đĩa trong máy
        /// </summary>
        public static void GetDrivesInfo () {
            DriveInfo[] allDrives = DriveInfo.GetDrives ();

            foreach (DriveInfo d in allDrives) {
                Console.WriteLine ("Drive {0}", d.Name);
                Console.WriteLine ("  Drive type: {0}", d.DriveType);
                if (d.IsReady == true) {
                    Console.WriteLine ("  Volume label: {0}", d.VolumeLabel);
                    Console.WriteLine ("  File system: {0}", d.DriveFormat);
                    Console.WriteLine ("  Available space to current user:{0, 15} bytes", d.AvailableFreeSpace);
                    Console.WriteLine ("  Total available space:          {0, 15} bytes", d.TotalFreeSpace);
                    Console.WriteLine ("  Total size of drive:            {0, 15} bytes ", d.TotalSize);
                }
            }
        }
    }
}
```

- Khi áp dụng chạy:

```csharp
GetDriveInfomation.GetDrivesInfo();
```

- Kết quả in ra là các thông tin về các ổ đĩa trên máy:

```bash
Drive /
  Drive type: Fixed
  Volume label: /
  File system: apfs
  Available space to current user:   222470746112 bytes
  Total available space:             224261296128 bytes
  Total size of drive:               499455598592 bytes
Drive /dev
  Drive type: Ram
  Volume label: /dev
  File system: devfs
  Available space to current user:              0 bytes
  Total available space:                        0 bytes
  Total size of drive:                     193536 bytes
```

###### Lớp Path - Hỗ trợ làm việc với đường dẫn

- Để hỗ trợ quản lý, tạo các đường dẫn đến file, thư mục, nhất là hỗ trợ `cross-platform` thì lớp tĩnh `System.IO.Path` chứa các phương thức (tĩnh) với mục đích đó.

- `Path.DirectorySeparatorChar`: Thuộc tính chứa ký tự phân cách đường dẫn thư mục (\ trên Windows, / trên \*nix)
- `Path.PathSeparator`: Thuộc tính chứa ký tự phân chia thư mục trong biến môi trường
- `Combine`: Kết hợp các chuỗi thành dường dẫn
  var path = Path.Combine("home", "ReadMe.txt"); // "home/ReadMe.txt"
- `ChangeExtension`: Thay đổi phần mở rộng của đường dẫn
  var path = Path.ChangeExtension("/home/abc/ReadMe.txt", "md"); // "/home/abc/ReadMe.md"
- `GetDirectoryName`: Lấy đường dẫn đến file (thư mục)
  var path = Path.GetDirectoryName("/home/abc/zyz/ReadMe.txt"); // "/home/abc/zyz"
- `GetExtension`: Lấy phần mở rộng
  var path = Path.GetExtension("/home/ReadMe.txt"); // ".txt"
- `GetFileName`: Lấy tên file
  var path = Path.GetFileName("/home/abc/ReadMe.txt"); // "ReadMe.txt"
- `GetFileNameWithoutExtension`: Lấy tên file
  var path = Path.GetFileNameWithoutExtension("/home/ReadMe.txt"); // "ReadMe"
- `GetFullPath`: Lấy đường dẫn đầy đủ - từ đường dẫn tương đối
  var path = Path.GetFullPath("ReadMe.txt");
- `GetPathRoot`: Lấy gốc của đường dẫn
- `GetRandomFileName` Tạo tên file ngẫu nhiên
  var path = Path.GetRandomFileName();
- `GetTempFileName` Tạo file duy nhất, rỗng
  var path = Path.GetTempFileName();
- Để lấy đường dẫn đến một số thư mục đặc biệt của hệ thống, có thể dùng phương thức `Environment.GetFolderPath`. Ví dụ, lấy thư mục MyDocument

```csharp
var path_mydoc = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
```

###### Làm việc với lớp File

- Lớp `System.IO.File` cung cấp cho bạn cách thức đơn giản để làm việc với các tệp. Nó có nhiều phương thức cho những mục đích khác nhau File class, như copy, xóa, di chuyển, lưu text vào file, đọc nội dung file, kiểm tra sự tồn tại, tra cứu thông tin về file ...

**File.WriteAllText**

- Hàm này tạo ra file mới (nếu đã có file bị ghi đè), ghi vào nó một nội dung text, rồi đóng file luôn. Ví dụ, lưu vào file `test.txt` một nội dung, file đó ở đường dẫn đến thư mục MyDocument của hệ thống.

```csharp
static void testWriteAllText () {
    var filename = "test.txt";
    string contentfile = "Xin chào! xuanthulab.net";

    // Lấy thư mục Document của User trên hệ thống
    var directory_mydoc = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);

    var fullpath = Path.Combine(directory_mydoc, filename);
    File.WriteAllText (filename, contentfile);

    Console.WriteLine ($"File lưu tại {directory_mydoc}{Path.DirectorySeparatorChar}{filename}");

}
```

- Với `WriteAllText` file luôn được tạo mới (ghi đè), nếu file đó đã tồn tại. Bạn muốn nối thêm nội dung vào nội dung có sẵn thì hãy dùng đến `AppendAllText`. Ví dụ sau, nếu file đã tồn tại thì nối thêm nội dung, nếu chưa tồn tại thì tạo mới.

```csharp
static void testAppendAllText() {

    var filename = "test.txt";
    string contentfile = "\nXin chào! xuanthulab.net - " + DateTime.Now.ToString ();

    var directory_mydoc = Environment.GetFolderPath (Environment.SpecialFolder.MyDocuments);
    var fullpath = Path.Combine (directory_mydoc, filename);

    if (File.Exists (fullpath)) {
        // File đã tồn tại - nối thêm nội dung
        File.AppendAllText (fullpath, contentfile);
    } else {
        // tạo mới vì chưa tồn tại file
        File.WriteAllText (fullpath, contentfile);
    }
    // Đọc nội dung File
    Console.WriteLine (fullpath);
    string s = File.ReadAllText (fullpath);
    Console.WriteLine (s);
}
```

**File.ReadAllText**

- Hàm này thì đọc nội dung file.

```csharp
string s = File.ReadAllText(fullpath);
Console.Write(s);
```

- Ngoài ra bạn cũng có thể sử dụng các phương thức
  - `File.Create(filename)`: tạo file
  - `File.Delete(filename)`: xóa file
  - `File.Exists(filename)`: kiểm tra file có tồn tại
  - `File.Copy(path_src, path_des)`: copy file
  - `File.Move(path_src, path_des)`: di chuyển file

###### Làm việc với lớp Directory

- Lớp System.IO.Directory cung cấp các phương thức chuyên tương tác với các thư mục
- `Exists(path)`: Kiểm tra xem thư mục có tồn tại (true) hay không (false)
- `CreateDirectory(path)`: Tạo thư mục, trả về đối tượng System.IO.DirectoryInfo chứa thông tin thư mục.
- `Delete(path):` Xóa thư mục.
- `GetFiles(path):` Lấy các file trong thư mục.
- `GetDirectories(path)`: Lấy các thư mục trong thư mục.
- `Move(src, des)` Di chuyển thư mục.
- Ví dụ lấy tất cả các thư mục, file trong một thư mục

```csharp
var directory_mydoc = Environment.GetFolderPath (Environment.SpecialFolder.MyDocuments);
String[] files = System.IO.Directory.GetFiles(directory_mydoc);
String[] directories = System.IO.Directory.GetDirectories(directory_mydoc);

foreach (var file in files)
{
    Console.WriteLine(file);
}

foreach(var directory in directories)
{
    Console.WriteLine(directory);
}
```

- Ví dụ đệ quy liệt kê tất cả các file, thư mục con trong một thư mục

```csharp
static void ListFileDirectory(string path)
{
    String[] directories = System.IO.Directory.GetDirectories(path);
    String[] files = System.IO.Directory.GetFiles(path);
    foreach (var file in files)
    {
        Console.WriteLine(file);
    }
    foreach (var directory in directories)
    {
        Console.WriteLine(directory);
        ListFileDirectory(directory); // Đệ quy
    }
}
```

- Chạy thử

```csharp
var directory_mydoc = Environment.GetFolderPath (Environment.SpecialFolder.MyDocuments);
ListFileDirectory(directory_mydoc);
```

### 9. Stream trong C# - Làm việc với FileStream lập trình C Sharp

- Tìm hiểu về luồng stream, sử dụng luồng FileStream để đọc ghi file, kỹ thuật đọc ghi copy file text khi sử dụng FileStream trong lập trình C#

###### Khái niệm về stream

- `(stream)` là một đối tượng được sử dụng để truyền dữ liệu. Khi dữ liệu truyền từ các nguồn bên ngoài vào ứng dụng ta gọi đó là `đọc stream`, và khi dữ liệu truyền từ chương trình ra nguồn bên ngoài ta gọi nó là `ghi stream`.
- `Nguồn bên ngoài` thường là các file, tuy nhiên tổng quát thì nó có thể từ nhiều loại như đọc/ghi dữ liệu thông qua một giao thức mạng để trao đổi dữ liệu với một máy remote khác, đọc/ghi vào một nhớ ...
- Một số `stream` chỉ cho đọc, một số chỉ cho ghi, một số lại cho phép truy cập nhẫu nhiên chứ không chỉ truy cập tuần tự (cho phép thay đổi vị trí con trỏ đọc dữ liệu trong luồng - ví dụ dịch chuyển vào giữa luồng dữ liệu để đọc dữ liệu ở khoảng nào đó)
- Thư viện `.NET` cung cấp lớp cơ sở `System.IO.Stream` để hỗ trợ làm việc đọc ghi các byte dữ liệu với các `stream`, từ lớp cơ sở này một loạt lớp kế thừa cho những stream đặc thù như: `FileStream, BufferStream, MemoryStream ...`
- **Lấy thông tin về stream** - khi có đối tượng lớp System.IO.Stream có một số thuộc tính để tra cứu thông tin về stream

  - `CanRead`: Cho biết stream hỗ trợ việc đọc hay không
  - `CanWrite`: Cho biết stream hỗ trợ việc ghi hay không
  - `CanSeek`: Cho biết stream hỗ trợ dịch chuyển con trỏ hay không
  - `CanTimeout`: Cho biết stream có đặt được time out
  - `Length`: Cho biết kích thước (byte) của stream
  - `Position`: Đọc hoặc thiết lập vị trí đọc (thiết lập thì stream phải hỗ trợ Seek)
  - `ReadTimeout`: Đọc hoặc thiết lập giá trị (mili giây) danh cho tác vụ đọc stream trước khi time out phát sinh
  - `WriteTimeout`: Đọc hoặc thiết lập giá trị (mili giây) danh cho tác vụ ghi stream trước khi time out phát sinh

**Một số phương thức cho đối tượng Stream**

- `ReadByte`: Đọc từng byte, trả về int (cast 1 byte) hoặc -1 nếu cuối file.
- `Read`: Đọc một số byte, từ vị trí nào đó, kết quả đọc lưu vào mảng byte. Trả về số lượng byte đọc được, 0 nếu cuối stream.

```csharp
// Tạo một stream và lưu vào đó một số byte
    Stream stream = new MemoryStream ();
    for (int i = 0; i < 122; i++) {
        stream.WriteByte ((byte) i);
    }
    // Thiết lập vị trí là điểm bắt đầu
    stream.Position = 0;


    // Đọc từng block 5 bytes
    byte[] buffer = new byte[10] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 }; // mảng chứa 10 byte để làm bộ nhớ lưu byte đọc được
    int offset = 0; // vị trí (index) trong buffer - nơi ghi byte đầu tiên đọc được
    int count = 5; // đọc 5 byte
    int numberbyte = stream.Read (buffer, 0, 2); // bắt đầu đọc
    while (numberbyte != 0) {
        Console.Write ($"{numberbyte} bytes: ");
        for (int i = 1; i <= numberbyte; i++) {
            byte b = buffer[i - 1];
            Console.Write (string.Format ("{0, 5}", b));

        }
        numberbyte = stream.Read (buffer, offset, count); // đọc 5 byte tiếp theo
        Console.WriteLine ();
    }
```

- `WriteByte`: Lưu 1 byte vào stream
- `Write`: Lưu mảng bytes vào stream

```csharp
stream.Read(buffer, offset, count);
```

- `Seek`: Thiết lập vị trí trong stream
- `Flush:` Giải phóng các bộ đêm

###### Làm việc với FileStream

- Lớp `FileStream` tạo ra các đối tượng để đọc và ghi dữ liệu ra file. Do `stream` là tài nguyên không quản lý bởi GC, nên cần đưa nó vào cấu trúc using để tự động gọi giải phóng tài nguyên `(Dispose)` khi hết khối lệnh.

```csharp
string filepath = "/home/data/data.txt";
using (var stream = new FileStream(path:filepath, mode: FileMode.Open, access: FileAccess.Read, share: FileShare.Read))
{
    // code sử dụng stream (System.IO.Stream)
}
```

- Như vậy, để tạo ra một stream file, để trao đổi dữ liệu cần 4 thông tin:
  - `path`: đường dẫn đến file
  - `mode`: kiểu liệt kê FileMode, nó cho biết bạn muốn mở file như thế nào, như:

```csharp
// FileMode.CreateNew tạo file mới
// FileMode.Create tạo mới, nếu file đang có bị ghi đè
// FileMode.Open mở file đang tồn tại
// FileMode.OpenOrCreate mở file đang tồn tại, tạo mới nếu không có
// FileMode.Truncate mở file đang tồn tại và làm rỗng file
// FileMode.Append mở file đang tồn tại và tới cuối file, hoặc tạo mới
```

- `access`: kiểu liệt kê FileAccess, cho biết muốn truy cập file như thế nào

```csharp
// FileAccess.Read chỉ đọc
// FileAccess.Write chỉ ghi
// FileAccess.ReadWrite đọc và ghi
```

- `share`: kiểu liệt kê FileShare, cho phép thiết lập chia sẻ truy cập file

```csharp
// FileShare.None không chia sẻ - tiến trình khác truy cập file sẽ lỗi cho đến khi tiến trình mở file đóng nó lại.
// FileShare.Read cho tiến trình khác mở đọc file.
// FileShare.Write cho tiến trình khác mở ghi file.
// FileShare.ReadWrite cho tiến trình khác mở đọc ghi file.
// FileShare.Delete cho tiến trình khác xóa file.
```

- Lớp `File` hỗ trợ tạo `FileStream. File.OpenRead(filename)` tạo stream để đọc, `File.OpenWrite(filename) ` tạo stream để ghi.

###### Lấy thông tin về stream

- Khi có đối tượng lớp `System.IO.Stream` có một số thuộc tính để tra cứu thông tin về stream

```csharp
string filepath = "/mycode/1.txt";
using (var stream = new FileStream( path:filepath, mode: FileMode.Open, access: FileAccess.ReadWrite, share: FileShare.Read))
{
    Console.WriteLine(stream.Name);
    Console.WriteLine($"Kích thước stream {stream.Length} bytes / Vị trí {stream.Position}");
    Console.WriteLine($"Stream có thể : Đọc {stream.CanRead} -  Ghi {stream.CanWrite} - Seek {stream.CanSeek} - Timeout {stream.CanTimeout} ");
}
// /mycode/1.txt
// Kích thước stream 289 bytes / Vị trí 0
// Stream có thể : Đọc True -  Ghi True - Seek True - Timeout False
```

###### Lấy thông tin encoding của file Text

- Khi đọc các file text (không phải file nhị phân), đầu tiên cần xác định encoding của nó (UTF8, Unicode, UTF32 ...). Thông tin về encoding được lưu ở vài byte đầu tiên của file nó gọi là BOM - Preamble (xem thêm BOM). Tùy thuộc vào giá trị của khoảng 5 byte đầu tiên này mà xác định được encoding.
- Thường bạn chỉ việc 5 byte đầu tiên, để xác định encoding như sau:

```csharp
using System;
using System.IO;
using System.Text;
namespace CS016_Stream_FileStream {
  public class UtilsEncoding {
    public static Encoding GetEncoding (Stream stream) {
      byte[] BOMBytes = new byte[4]; // mảng chứa 4 byte để làm bộ nhớ lưu byte đọc được
      int offset = 0; // vị trí (index) trong buffer - nơi ghi byte đầu tiên đọc được
      int count = 4; // đọc 4 byte
      int numberbyte = stream.Read (BOMBytes, offset, count); // bắt đầu đọc 4 đầu tiên lưu vào buffer

      if (BOMBytes[0] == 0xfe && BOMBytes[1] == 0xff) {
        stream.Seek (2, SeekOrigin.Begin); // Di chuyển về vị trí bắt đầu của dữ liệu (đã trừ BOM)
        return Encoding.BigEndianUnicode;
      }
      if (BOMBytes[0] == 0xff && BOMBytes[1] == 0xfe) {
        stream.Seek (2, SeekOrigin.Begin); // Di chuyển về vị trí bắt đầu của dữ liệu (đã trừ BOM)
        return Encoding.Unicode;
      }

      if (BOMBytes[0] == 0xef && BOMBytes[1] == 0xbb && BOMBytes[2] == 0xbf) {
        stream.Seek (3, SeekOrigin.Begin);
        return Encoding.UTF8;
      }
      if (BOMBytes[0] == 0x2b && BOMBytes[1] == 0x2f && BOMBytes[2] == 0x76) {
        stream.Seek (3, SeekOrigin.Begin);
        return Encoding.UTF7;
      }
      if (BOMBytes[0] == 0xff && BOMBytes[1] == 0xfe && BOMBytes[2] == 0 && BOMBytes[3] == 0) {
        stream.Seek (4, SeekOrigin.Begin);
        return Encoding.UTF32;
      }
      if (BOMBytes[0] == 0 && BOMBytes[1] == 0 && BOMBytes[2] == 0xfe && BOMBytes[3] == 0xff) {
        stream.Seek (4, SeekOrigin.Begin);
        return Encoding.GetEncoding (12001);
      }

      stream.Seek (0, SeekOrigin.Begin);
      return Encoding.Default;

    }
  }

}
```

- Với ASCII, 7 bit biểu diễn các ký tự - nó đủ biểu diễn bảng chữ cái tiếng Anh (in hoa, thường, số ký tự đặc biệt) - ASCII 1 byte biểu diễn 1 ký tự. UTF-16 thì dùng 2 byte biểu diễn 1 ký tự. UTF-32 dùng 4 byte biểu diễn 1 ký tự. Với UTF-8 (dùng nhiều ngày nay) - nó dùng biến để xác định bao nhiêu byte cho mỗi ký tự cụ thể, Mỗi ký tự có thể từ 1 - 6 byte

###### Ghi file text bằng stream

- Ghi file text (tạo mới, ghi đè) - chọn file có Encoding UTF8, đầu tiên phải ghi các bytes BOM, lấy mảng bytes DOM bằng cách gọi encoding.GetPreamble(), sau đó chuyển chuỗi thành mảng bytes (đã encoding) - rồi lưu ra stream bằng `Write`

```csharp

string filepath = "/mycode/2.txt";
using (var stream = new FileStream( path:filepath, mode: FileMode.Create, access: FileAccess.Write, share: FileShare.None))
{
    //Write BOM - UTF8
    Encoding encoding = Encoding.UTF8;
    byte[] bom = encoding.GetPreamble();
    stream.Write(bom, 0, bom.Length);

    string s1 = "Xuanthulab.net -  Xin chào các bạn! \n";
    string s2 = "Ví dụ - ghi file text bằng stream";

    // Encode chuỗi - lưu vào mảng bytes
    byte[] buffer = encoding.GetBytes(s1);
    stream.Write(buffer, 0, buffer.Length);  // lưu vào stream

    buffer = encoding.GetBytes(s2);
    stream.Write(buffer, 0, buffer.Length);  // lưu vào stream

}
```

###### Đọc file text bằng stream

- Đầu tiên xác định Encoding của file text, sau đó đọc từng khối byte vào buffer (mảng byte), rồi thực hiện Encoding để xác định chuỗi.

```csharp
string filepath = "/mycode/1.txt";
int SIZEBUFFER = 256;
using (var stream = new FileStream( path:filepath, mode: FileMode.Open, access: FileAccess.ReadWrite, share: FileShare.Read))
{
    Encoding encoding = GetEncoding(stream);
    Console.WriteLine(encoding.ToString());
    byte[] buffer = new byte[SIZEBUFFER];
    bool endread = false;
    do
    {
        int numberRead = stream.Read(buffer, 0, SIZEBUFFER);
        if (numberRead == 0) endread = true;
        if (numberRead < SIZEBUFFER)
        {
            Array.Clear(buffer, numberRead, SIZEBUFFER - numberRead);
        }
        string s = encoding.GetString(buffer, 0, numberRead);
        Console.WriteLine(s);

    } while (!endread);

}
```

###### Copy file stream

- Tạo 2 stream, một để đọc - một để lưu

```csharp
string filepath_src = "/mycode/1.txt";
string filepath_des = "/mycode/3.txt";

int SIZEBUFFER = 5;   // tăng lên đọc sẽ nhanh
using (var streamwrite = File.OpenWrite(filepath_des))
using (var streamread = File.OpenRead(filepath_src))
{
    byte[] buffer = new byte[SIZEBUFFER];
    bool endread = false;
    do
    {
        int numberRead = streamread.Read(buffer, 0, SIZEBUFFER);
        if (numberRead == 0) endread = true;
        else {
            streamwrite.Write(buffer, 0, numberRead);
        }

    } while (!endread);

}
```

### 10. Collection và List trong C#

###### Collection trong C#

- `collection` là một nhóm các đối tượng có sự liên quan đến nhau. Số đối tượng trong collect có thể thay đổi tăng giảm. Có nhiều loại collection, chúng được tập hợp vào namespace `System.Collections`. Thường thì một lớp collection có các phương thức để thêm, bớt, lấy tổng phần tử.
- `.NET` cung cấp một số các lớp collection kiểu Generic như: `List<T>, Dictionary<TKey, TValue>, Stack<T> ...` những lớp generic này ở namespace `System.Collections.Generic`
- Ngoài ra namespace `System.Collections` cũng có các lớp collection mà không sử dụng generic như: ArrayList, Stack, Queue ...
- Các giao diện - interface về collect mà bạn có thể sử dụng
  - `IEnumerable<T>`: Triển khai nó nếu muốn duyệt phần tử bằng foreach, nó định nghĩa phương thức `GetEnumerator` trả về một enumerator.
  - `ICollection<T>`: Giao diện này được triển khai bởi các generic collection. Với nó lấy tổng phần tử bằng thuộc tính `Count`, copy các phần tử vào mảng bằng `CopyTo`, thêm bớt phần tử với `Add`, `Remove`, `Clear`
  - `IList<T>`: Giao diện này kế thừa ICollection<T> là một danh sách các phần tử truy cập được theo vị trí của nó. Nó có indexer, phương thức để chèn phần tử xóa phần tử `Insert` `RemoveAt`.
  - `ISet<T>`: Giao diện triển khai bởi các tập hợp
  - `IDictionary<TKey,TValue>`: Giao diện để triển khai loại dữ liệu lưu trữ theo cặp key, value.
  - `ILookup<TKey,TValue>`: Giao diện để triển khai loại dữ liệu lưu trữ theo cặp key, value. Nhưng cho phép một key có nhiều giá trị
  - `IComparer<TKey,TValue>`: Giao diện để triển khai cho phép so sánh để sắp xếp Collection
  - `IEqualityComparer<TKey,TValue>`: Giao diện để triển khai cho phép so sánh bằng

###### Lớp List<T>

- Lớp collection `List` là lớp triển khai các giao diện `IList`, `ICollection`, `IEnumerable` nó quản lý danh sách các đối tượng cùng kiểu. Bạn có thể thêm, bớt, truy cập, sắp xếp các phần tử trong danh sách bằng các phương thức nó cung cấp như `Add`, `AddRange`, `Insert`, `RemoveAt`, `Remove` ... các phương thức này chi tiết theo ví dụ dưới
- Khởi tạo một danh sách `List`, mà các phần tử có kiểu element_type:

```csharp
var list = new List<element_type>();
```

- Ví dụ, xây dựng danh sách các sản phẩm, sản phẩm có kiểu `Product` tự định nghĩa như sau - lớp sản phẩm hỗ trợ so sánh với sản phẩm khác nên triển khai `IComparable`, cho phép hiện lấy một chuỗi thông tin bằng `ToString` với định dạng nào đó nên triển khai giao diện `IFormattable`
- Mã nguồn xây dựng lớp Product trong file Product.cs như sau:

```csharp
using System;
namespace CS017_Generic
{
    public class Product : IComparable<Product>, IFormattable
    {
        public int ID {set; get;}
        public string Name {set; get;}        // tên
        public double Price {set; get;}       // giá
        public string Origin {set; get;}      // xuất xứ

        public Product(int id, string name, double price, string origin) {
            ID = id; Name = name; Price = price; Origin = origin;
        }

        //Triển khai IComparable, cho biết vị trí sắp xếp so với đối tượng khác
        // trả về 0 - cùng vị trí; trả về > 0 đứng sau other; < 0 đứng trước trong danh sách
        public int CompareTo(Product other)
        {
            // sắp xếp về giá
            double delta = this.Price - other.Price;
            if (delta > 0)      // giá lớn hơn xếp trước
                return -1;
            else if (delta < 0) // xếp sau, giá nhỏ hơn
                return 1;
            return 0;

        }
        // Triển khai IFormattable, lấy chuỗi thông tin của đối tượng theo định dạng
        // format hỗ trợ "O" và "N"
        public string ToString(string format, IFormatProvider formatProvider)
        {
            if (format == null) format = "O";
            switch (format.ToUpper()) {
                case "O": // Xuất xứ trước
                    return $"Xuất xứ: {Origin} - Tên: {Name} - Giá: {Price} - ID: {ID}";
                case "N": // Tên xứ trước
                    return $"Tên: {Name} - Xuất xứ: {Origin} - Giá: {Price} - ID: {ID}";
                default: // Quăng lỗi nếu format sai
                    throw new FormatException("Không hỗ trợ format này");
            }
        }

        // Nạp chồng ToString
        override public string ToString() => $"{Name} - {Price}";

        // Quá tải thêm ToString - lấy chỗi thông tin sản phẩm theo định dạng
        public string ToString(string format) => this.ToString(format, null);

    }
}
```

###### Khởi tạo List<T>

- Để khởi tạo một danh sách rỗng, dùng toán tử new

```csharp
var numbers  = new List<int>();           // danh sách số nguyên
var products = new List<Product>();       // danh sách Product
```

- Khởi tạo danh sách có sẵn một số phần tử, thì các phần tử liệt kê sau `{}`

```csharp
var numbers  = new List<int>() {1,2,3,4};     // khởi tạo 4 phần tử
var products = new List<Product>()            // khởi tạo 1 phần tử
{
     new Product(1, "Iphone 6", 100, "Trung Quốc")
};
```

###### Thêm, xóa, chèn và đọc phần tử trong List<T>

**THÊM PHẦN TỬ vào cuối danh sách sử dụng phương thức `Add`**

```csharp
var p = new Product(2, "IPhone 7", 200, "Trung Quốc");
products.Add(p);                                                // Thêm p vào cuối List
products.Add(new Product(3, "IPhone 8", 400, "Trung Quốc"));    // thêm đối tượng mới vào cuối List
```

- Nếu muốn thêm nhiều phần tử một lúc (mảng các phần tử), dùng `AddRange`

```csharp
var arrayProducts = new Product[]                  // Mảng 2 phần tử
{
    new Product(4, "Glaxy 7", 500, "Việt Nam"),
    new Product(5, "Glaxy 8", 700, "Việt Nam"),
};
products.AddRange(arrayProducts);                   // Nối các phần tử của mảng vào danh sách
```

**CHÈN PHẦN TỬ**

- `CHÈN PHẦN TỬ` vào danh sách, phần tử sẽ ở vị trí chỉ ra dùng phương thức `Insert(index, object)` hoặc chèn cả một mảng `InsertRange(index,, arrayObject)`. Trong đó index là vị trí chèn phần tử (0 là đầu tiên).

```csharp
products.Insert(3, new Product(6, "Macbook Pro", 1000, "Mỹ"));     // chèn phần tử vào vị trí index 3, (thứ 4)
```

**ĐỌC PHẦN TỬ**

- `ĐỌC PHẦN TỬ` trong List bạn dùng indexer với chỉ số (chỉ số bắt đầu từ 0). Ví dụ lấy phần tử ở Index = 1;

```csharp
var pro = products[2];                                             // đọc phần tử có index = 2
Console.WriteLine(pro.ToString());
```

- Để duyệt qua các phần tử bạn có thể dùng lệnh for hoặc foreach

```csharp
// Duyệt qua tất cả các phần tử bằng for
// products.Count = lấy tổng phần tử trong List
for (int i = 1; i < products.Count; i++)
{
    var pi = products[i - 1];
    Console.WriteLine(pi.ToString());
}

// Duyệt qua các phần tử bằng foreach
foreach (var pi in products)
{
    Console.WriteLine(pi.ToString());
}
```

**XÓA PHẦN TỬ**

- `XÓA PHẦN TỬ` trong List - để xóa phần tử ở vị trí index dùng `RemoveAt(index)`, để xóa cả một đoạn count phần tử, từ vị trí index dùng `RemoveRange(index, count);`, để xóa toàn bộ (làm rỗng) gọi `Clear()`; hoặc `RemoveAll()`;

```csharp
products.RemoveAt(0);                           // xóa phần tử đầu tien
products.RemoveRange(products.Count - 2, 2);    // xóa 2 phần tử cuối
```

- Khi bạn có tham chiếu đến đối tượng đang có trong List, cũng có thể loại nó bằng `Remove(obj)`;

```csharp
var pro_rm = products[1];
products.Remove(pro_rm);
```

###### Tìm kiếm thông tin trong List

- Một số phương thức cho phép tìm kiếm, tra cứu vị trị trí các phần tử trong `List`
  - `IndexOf(obj)`: Tìm index của đối tượng trong List
  - `LastIndexOf(obj)`: Tìm index của phần tử cuối cùng có giá trị bằng obj trong List
  - `FindIndex`: Tìm kiếm trả về Index
  - `FindLastIndex`: Tìm kiếm trả về Index cuối
  - `Find(Predicate)`: Tìm kiếm trả về phần tử
  - `FindAll(Predicate)`: Tìm kiếm trả về danh sách phần tử
  - `FindLast`: Tìm kiếm trả về phần tử cuối tìm thấy
- Trong các phương thức trên, có các phương thức ví dụ `Find`, chứa tham số là` delegate bool Predicate<in T>(T obj);`, nó là hàm `callback`, trả về `true` là phần tử phù hợp trả về.
- Ví dụ sau đây là một `Delegate` phù hợp gán cho tham số `Predicate`

```csharp
// Delegate trả về true khi tên bằng "Glaxy 8"
(Product ob) => {
    return (ob.Name == "Glaxy 8");
}
```

- Đoạn mã này có thể làm tham số cho `Find`, `FindAll` ...

```csharp
Product foundpr1 = products.Find(
    (Product ob) => { return (ob.Name == "Glaxy 8");}
);
if (foundpr1 != null)
    Console.WriteLine("(found) " + foundpr1.ToString("O"));
// (found) Xuất xứ: Việt Nam - Tên: Glaxy 8 - Giá: 700 - ID: 5
```

- Các `delegate` cũng có thể viết gọn lại

```csharp
// tìm index của đối tượng có xuất xứ là "Trung Quốc"
var ifound = products.FindIndex(x => x.Origin == "Trung Quốc");
// tìm các sản phẩm có giá trên 100
List<Product> p_100 = products.FindAll(product => product.Price > 100);
```

- Nếu muốn tùy biến cao hơn `Delegate`, để tìm kiếm theo tham số tùy chọn, bạn có thể để `Delegate` trên vào lớp chức năng, ví dụ xây dựng lớp `SearchNameProduct`

```csharp
public class SearchNameProduct {
    string namesearch;
    public SearchNameProduct(string name) {
        namesearch = name;
    }
    // Hàm gán cho delegage
    public bool search(Product p) {
        return p.Name == namesearch;
    }
}
```

- Thực hiện tìm kiếm, ví dụ

```csharp
Product pr1 = products.Find( (new SearchNameProduct("Glaxy 8")).search);        // Tìm sản phẩm có tên Glaxy 8
Product pr2 = products.Find( (new SearchNameProduct("IPhone 6")).search);       // Tìm sản phẩm có tên IPhone 6
```

###### Sắp xếp các phần tử trong List

- Để sắp xếp các phần tử trong danh sách, nếu phần tử đó có triển khai giao diện `IComparable` thì chỉ việc gọi `Sort()` để có danh sách theo thứ tự.
- Ví dụ trên, lớp `Product` có triển khai `IComparable`, với phương thức `CompareTo`, thì sản phẩm nào có giá cao hơn xếp trước, có giá thấp hơn xếp sau.

```csharp
products.Sort();
foreach (var pi in products)
{
    Console.WriteLine(pi.ToString("N"));
}
// Kết quả
// Tên: Macbook Pro - Xuất xứ: Mỹ - Giá: 1000 - ID: 6
// Tên: Glaxy 8 - Xuất xứ: Việt Nam - Giá: 700 - ID: 5
// Tên: Glaxy 7 - Xuất xứ: Việt Nam - Giá: 500 - ID: 4
// Tên: IPhone 8 - Xuất xứ: Trung Quốc - Giá: 400 - ID: 3
// Tên: IPhone 7 - Xuất xứ: Trung Quốc - Giá: 200 - ID: 2
// Tên: Iphone 6 - Xuất xứ: Trung Quốc - Giá: 100 - ID: 1
```

- Bạn cũng có thể tùy biến cách thức sắp xếp bằng cách cung cấp hàm `callback` dạng `deleage` hai tham số kiểu cùng với kiểu phần tử cho `Search`, thay vì sắp xếp mặc định như trên.
- Nhớ là trả về > 0 thì phần tử hiện tại xếp sau phần tử tham số.
- Ví dụ hàm callback sau xếp ID nhỏ lên trước

```csharp
products.Sort(

    (p1, p2) => {
        if (p1.ID > p2.ID)
            return 1;
        else if (p1.ID == p2.ID)
            return  0;
        return   -1;
    }

);
foreach (var pi in products)
{
    Console.WriteLine(pi.ToString("N"));
}
```

- Một số phương thức khác tham khảo
  - `Contains(obj)`: kiểm tra có chứa phần tử obj
  - `Reverse()`: đảo thứ tự danh sách
  - `ToArray()`: copy các phần tử ra mảng

### 11. SortedList trong lập trình C#

- Tìm hiểu về `SortedList`, khai báo, khởi tạo và ví dụ áp dụng `SortedList` để lưu danh sách được sắp xếp theo key

###### SortedList trong C#

- Nếu tập dữ liệu của bạn được sắp xếp dựa trên một `key` (khóa), thì bạn có thể dùng đến `SortedList<Tkey,TValue>`. Lớp này sắp xếp dữ liệu dựa trên một `key`, kiểu đề làm `key` là bất kỳ.
- `SortedList` được định nghĩa ở namespace: `System.Collections`, sử dụng bạn cần nạp namespace gồm:

```csharp
using System.Collections;
using System.Collections.Generic;
```

- Một đối tượng dữ liệu lưu vào `SortedList` dưới dạng cặp `key/value`, truy cập đến phần tử thông qua key hoặc thông qua vị trí `(index)` của dữ liệu trong danh sách. **Chú ý, không cho phép trùng key**.
- Các thuộc tính, phương thức trong SortedList
  - `Count`: Thuộc tính cho biết số phần tử
  - `[key]`: Indexer truy cập đến phần tử có key
  - `Keys`: Thuộc tính là danh sách các key trong danh sách sắp xếp
  - `Values`: Thuộc tính lấy danh sách các giá trị trong danh sách
  - `Add(key, value)`: Thêm một phần tử vào danh sách
  - `Remove(key)`: Xóa phần tử bằng key của nó
  - `Clear()`: Loại bỏ tất cả các phần tử khỏi danh sách
  - `ContainKey(key)`: Kiểm tra có phần tử nào có khóa là key
  - `ContainValue(value)` Kiểm tra có phần tử nào có giá trị là value
  - `IndexOfKey(key)` Lấy chỉ số của phần tử có khóa là key
  - `IndexOfValue(value)`: Lấy chỉ số của phần tử có giá trị là value

###### Ví dụ SortedList

- Ví dụ tạo danh sách các sản phẩm, mỗi sản phẩm lưu vào danh sách với key tương ứng là tên và giá trị là mã sản phẩm. Từ đó, thực hiện một số thao tác trên danh sách này

```csharp
public static void test () {

      // Khởi tạo SortedList
      var products = new SortedList<string, string> ();
      products.Add ("Iphone 6", "P-IPHONE-6"); // Thêm vào phần tử mới (key, value)
      products.Add ("Laptop Abc", "P-LAP");
      products["Điện thoại Z"] = "P-DIENTHOAI"; // Thêm vào phần tử bằng Indexer
      products["Tai nghe XXX"] = "P-TAI";       // Thêm vào phần tử bằng Indexer


      // Duyệt qua các phần tử, mỗi phần tử lấy key/value lưu trong biến
      // kiểu KeyValuePair
      Console.WriteLine ("TÊN VÀ MÃ");
      foreach (KeyValuePair<string, string> p in products) {
        Console.WriteLine ($"    {p.Key} - {p.Value}");
      }
      // kết quả: (để ý danh sách đã xếp theo key)
      // TÊN và MÃ
      //     Điện thoại Z - P-DIENTHOAI
      //     Iphone 6 - P-IPHONE-6
      //     Laptop Abc - P-LAP
      //     Tai nghe XXX - P-TAI

      // Đọc value khi biết key
      string productName = "Tai nghe XXX";
      Console.WriteLine ($"{productName} có mã là {products[productName]}");

      // Cập nhật giá trị vào phần tử theo key
      products[productName] = "P-TAI-UPDATED";

      // Duyệt qua các giá trị
      Console.WriteLine ("\nDANH SÁCH MÃ SẢN PHẢM");
      foreach (var product_code in products.Values) {
          Console.WriteLine ($"--- {product_code}");
      }
      // kết quả:
      // DANH SÁCH MÃ SẢN PHẢM
      // -- P-DIENTHOAI
      // -- P-IPHONE-6
      // -- P-LAP
      // -- P-TAI-UPDATED

      // Duyệt qua các key
      Console.WriteLine ("\nDANH SÁCH TÊN SP");
      foreach (var product_name in products.Keys) {
        Console.WriteLine ($"... {product_name}");
      }
      // DANH SÁCH TÊN SP
      // -- Điện thoại Z
      // -- Iphone 6
      // -- Laptop Abc
      // -- Tai nghe XXX

}
```

### 12. Queue / Stack trong C#

###### Hàng đợi Queue trong C#

- Hàng đợi là mô hình `FIFO` (first in, first out - vào trước, ra trước hay đến trước được phục vụ trước), nó giải quyết các bài toán thực tế giống như xếp hàng mua vé máy bay ...
- `.NET` cung cấp lớp Queue<T> để giả quyết giải thuật hàng đợi.
- Các phương thức, thuộc tính của Queue
  - `Count`: Thuộc tính lấy tổng số phần tử trong hàng
  - `Enqueue`: vào xếp hàng - đưa phần tử vào cuối hàng đợi
  - `Dequeue`: đọc - và loại ngay phần tử ở đầu hàng đợi va` lỗi nếu hàng đợi không có phần tử nào
  - `Peek`: đọc phần tử đầu hàng đợi
- Vi dụ, các hồ sơ cần xử lý của khách hàng gửi đến, ai đến trước được đưa vào danh sách trước - và khi xử lý thì được xử lý trước

```csharp
public static void testQueue () {

    Queue<string> hoso_canxuly = new Queue<string> ();

    hoso_canxuly.Enqueue ("Hồ sơ A"); // Hồ sơ xếp thứ nhất trong hàng đợi
    hoso_canxuly.Enqueue ("Hồ sơ B"); // Hồ sơ xếp thứ hai
    hoso_canxuly.Enqueue ("Hồ sơ C");


    // Lấy hồ sơ xếp trước xử lý  trước, cho đến hết
    while (hoso_canxuly.Count > 0) {
        var hs = hoso_canxuly.Dequeue();
        Console.WriteLine($"Xử lý {hs}, còn lại {hoso_canxuly.Count}");
    }

}
// KẾT QUẢ
// Xử lý Hồ sơ A, còn lại 2
// Xử lý Hồ sơ B, còn lại 1
// Xử lý Hồ sơ C, còn lại 0
```

###### Ngăn xếp Stack C#

- Ngăn xếp `stack` khá giống hàng đợi, nhưng khác đó là `LIFO` (last in, first out) - vào sau thì ra trước, nó giống như xếp hàng hóa vào các `container`, vào nhà kho - cái nào đưa vào sau thì khi thảo dỡ lại thực hiện đầu tiên, nó giống như xếp đĩa vào cọc đĩa CD cái nào đưa vào cọc trước sẽ được lấy ra sau ...
- Trong C# với `.NET` nó cung cấp lớp `Stack<T>` để thực hiện giải thuật này.
- Các phương thức, thuộc tính của Stack
  - `Count`: Thuộc tính lấy tổng số phần tử trong hàng
  - `Push`: đẩy (thêm) một phần tử vào đỉnh stack
  - `Pop`: đọc - xóa phần tử đỉnh stack
  - `Peek`: đọc phần tử đỉnh stack
  - `Contains`: kiểm tra một phần tử có trong stack hay không
- Ví dụ, nhập vào A, B, C thì in ra CBA (vào sau ra trước)

```csharp
public static void testQueue () {

      Queue<string> hoso_canxuly = new Queue<string> ();

      hoso_canxuly.Enqueue ("Hồ sơ A"); // Hồ sơ xếp thứ nhất trong hàng đợi
      hoso_canxuly.Enqueue ("Hồ sơ B"); // Hồ sơ xếp thứ hai
      hoso_canxuly.Enqueue ("Hồ sơ C");


      // Lấy hồ sơ xếp trước xử lý  trước, cho đến hết
      while (hoso_canxuly.Count > 0) {
        var hs = hoso_canxuly.Dequeue();
        Console.WriteLine($"Xử lý {hs}, còn lại {hoso_canxuly.Count}");
      }
}
// Bốc dỡ Sản phẩm C / còn lại 2
// Bốc dỡ Sản phẩm B / còn lại 1
// Bốc dỡ Sản phẩm A / còn lại 0
```

### 13. LinkedList - Danh sách liên kết trong C#

###### LinkedList trong C#

- Trong thư viện `.NET` cung cấp lớp `LinkedList<T>` là loại danh sách liên kết kép (từ đây gọi tắt là danh sách liên kết).
- `Danh sách liên kết` là một danh sách chứa các phần tử, mỗi phần tử trong loại danh sách này được gọi là một nút `(Node)`. Mỗi nút ngoài dữ liệu của nút đó, nó sẽ gồm hai biến - một biến tham chiếu đến `Node` phía trước, một nút tham chiếu đến `Node` phía sau.
- Điều này có nghĩa, có có một nút - có thể lấy được nút phía trước nó - cứ thế cho đến nút đầu tiên, nút đầu, tương tự lấy được nút phía sau và dịch chuyển dần được về cuối.
- Khai báo - khởi tạo một `LinkedList`, ví dụ tạo danh sách liên kết mà dữ liệu các nút có kiểu string

```csharp
LinkedList<string> cacbaihoc = new  LinkedList<string>();
```

- Danh sách khởi tạo trên có dữ liệu trong các nút là kiểu `string`, tuy nhiên bản thân các nút được biểu diễn bởi lớp `LinkedListNode`

###### LinkedListNode trong C#

- `LinkedListNode<T>` là lớp biểu diễn `NÚT` trong `LinkedList`, các đối tượng của `LinkedListNode` được tạo ra từ `LinkedList`. Nó có các thuộc tính sau:
  - `List`: Thuộc tính - tham chiếu (trỏ) đến LinkedList
  - `Value`: Thuộc tính - là dữ liệu của Node
  - `Next`: Thuộc tính - tham chiếu (trỏ) đến NÚT tiếp theo (phía sau) - null thì nó là nút cuối
  - `Previous`: Thuộc tính - tham chiếu (trỏ) đến NÚT phía trước - null thì nó là nút đầu tiên

###### Một số phương thức trong LinkedList

- `Count`: Số nút trong danh sách
- `First`: Nút đầu tiên của danh sách
- `Last`: Nút đầu tiên của danh sách
- `AddFirst(T)`: Chèn một nút có dữ liệu T vào đầu danh sách
- `AddLast(T)`: Chèn một nút có dữ liệu T vào cuối danh sách
- `AddAfter(Node, T)`: Chèn nút với dữ liệu T, vào sau nút Node (kiểu LinkedListNode)
- `AddBefore(Node, T)`: Chèn nút với dữ liệu T, vào trước nút Node (kiểu `LinkedListNode`)
- `Clear()`: Xóa toàn bộ danh sách
- `Contains(T)`: Kiểm tra xem có nút với giá trị dữ liệu bằng T
- `Remove(T)`: Xóa nút có dữ liệu bằng T
- `RemoveFirst()`: Xóa nút đầu tiên
- `RemoveLast()`: Xóa nút cuối cùng
- `Find(T)`: Tìm một nút

**Thử tạo ra danh sách liên kết chứa tên các bài học**

```csharp
LinkedList<string> cacbaihoc = new  LinkedList<string>();


cacbaihoc.AddFirst("Bài học 3");   // thêm vào đầu danh sach
cacbaihoc.AddLast("Bài học 4");    // thêm vào cuối
cacbaihoc.AddFirst("Bài học 2");
cacbaihoc.AddFirst("Bài học 1");


// Lấy phần tử đầu tiên, sau đó duyệt đến cuối
Console.WriteLine("---------Nút từ đầu về cuối");
LinkedListNode<string> node = cacbaihoc.First;
while (node != null) {
    Console.WriteLine(node.Value);
    node = node.Next;   // node gán bằng nút sau nó
}


// Lấy phần tử cuối cùng, sau đó duyệt về phần tử đầu  tiên
Console.WriteLine("--------Nút từ cuối đến đầu");
node = cacbaihoc.Last;
while (node != null) {
    Console.WriteLine(node.Value);
    node = node.Previous;   // node gán bằng nút phía trước nó
}

/*  Kết quả
---------Nút từ đầu về cuối
Bài học 1
Bài học 2
Bài học 3
Bài học 4
--------Nút từ cuối đến đầu
Bài học 4
Bài học 3
Bài học 2
Bài học 1 */
```

### 14. Lớp Dictionary - HashSet trong C#

- Tìm hiểu lớp Dictionary và HashSet trong C#, khai báo, khởi tạo và sử dụng HashSet, SortedDictionary

###### Dictionary trong C#

- Lớp `Dictionary<Tkey,TValue>` khá giống `SortedList`, `Dictionary` được thiết kế với mục đích tăng hiệu quả với tập dữ liệu lớn, phức tạp.
- Một đối tượng dữ liệu lưu vào `Dictionary` dưới dạng cặp `key/value`, truy cập đến phần tử thông qua key hoặc thông qua vị trí (index) của dữ liệu trong danh sách. Chú ý, không cho phép trùng `key`.
- Các thuộc tính, phương thức trong `Dictionary`
  - `Count`: Thuộc tính cho biết số phần tử
  - `[key]`: Indexer truy cập đến phần tử có key
  - `Keys`: Thuộc tính là danh sách các key
  - `Values`: Thuộc tính lấy danh sách các giá trị
  - `Add(key, value)`: Thêm một phần tử vào Dictionary
  - `Remove(key)`: Xóa phần tử bằng key của nó
  - `Clear()`: Loại bỏ tất cả các phần tử
  - `ContainKey(key)`: Kiểm tra có phần tử nào có khóa là key
  - `ContainValue(value)` Kiểm tra có phần tử nào có giá trị là value
- Ví dụ, khai báo Dictionary với key kiểu string, giá trị kiểu int - khởi tạo ngay 2 phần tử

```csharp
public static void testDic()
{
    // Khởi tạo với 2 phần tử
    Dictionary<string, int> sodem = new Dictionary<string, int>()
    {
      ["one"] = 1,
      ["tow"] = 2,
    };
    // Thêm hoặc cập nhật
    sodem["three"] = 3;


    var keys = sodem.Keys;
    foreach (var k in keys)
    {
        var value = sodem[k];
        Console.WriteLine($"{k} = {value}");
    }

}
// one = 1
// two = 2
// three = 3
```

###### SortedDictionary trong C#

- Lớp `SortedDictionary<Tkey,TValue>` sử dụng, khai báo và khởi tạo ... giống như lớp `Dictionary<Tkey,TValue>`.
- Chỉ cần lưu ý, nếu dùng `SortedDictionary` thì các các phần tử được lưu và sắp xếp theo `key`, thích hợp khi tăng tốc chèn, xóa, tìm kiếm theo `key`.

###### HashSet trong C#

- `HashSet` là tập hợp danh sách không cho phép trùng giá trị. `HashSet<T>` khác với các collection khác là nó cung cấp cơ chế đơn giản nhất để lưu các giá trị, nó không chỉ mục thứ tự và các phần tử không sắp xếp theo thứ tự nào. `HashSet<T>` cung cấp hiệu năng cao cho các tác vụ tìm kiếm, thêm vào, xóa bỏ ...
- Một số phương thức trong `HashSet`
  - `Count`: Thuộc tính cho biết số phần tử
  - `Add(T)`: Thêm phần tử vào HashSet
  - `Remove(T)`: Xóa phần tử khỏi HashSet
  - `Clear()`: Xóa tất cả các phần tử
  - `Contains(T)`: Kiểm tra xem có phần tử trong HashSet
  - `IsSubsetOf(c)`: Kiểm tra xem có là tập con của HashSet c
  - `IsSupersetOf(c)`: Kiểm tra xem có chứa tập HashSet c
  - `UnionWith(c)`: Hợp với tập HashSet c
  - `IntersectWith(c)`: Giao với tập HashSet c
  - `ExceptWith(c)`: Loại bỏ hết các phần tử chung với c

```csharp
HashSet>int< hashset1 = new HashSet>int<() {
     5,2,3,4
 };
 Console.WriteLine($"Phần tử trong hashset1 {hashset1.Count}");
 foreach (var v in hashset1)
 {
     Console.Write(v + " ");
 }
 Console.WriteLine();

HashSet>int< hashset2 = new HashSet>int<();
hashset2.Add(3);
hashset2.Add(4);
if (hashset1.IsSupersetOf(hashset2))
    Console.WriteLine($"hashset1 là tập chứa hashset2");

/*
Phần tử trong hashset1 4
5 2 3 4
hashset1 là tập chứa hashset2
*/
```

### 15. Lớp ObservableCollection trong C# .NET

- Sử dụng lớp generic `ObservableCollection` để xây dựng tập hợp có sự giám sát biến động thay đổi phần tử, ví dụ áp dụng trong WPF

###### ObservableCollection

- Lớp Generic `ObservableCollection<T>` là một tập hợp tương tự như `List<T>` ..., tức là nó mô tả một tập hợp dữ liệu có thể thay đổi số lượng bằng các phương thức quen thuộc như `Add(), Remove(), Clear() ...`
- Nhưng với `ObservableCollection<T>` thì nó cung cấp thêm sự kiện thông báo số lượng phần tử thay đổi như thêm, bớt ...(nghĩa là giám sát được biến động phần tử). Các sự kiện `event` này có tên là `CollectionChanged`, trong tham số mà sự kiện gửi đến, `e.Action` có cho biết hành động thay đổi trên tập hợp là gì `(ví dụ: thêm NotifyCollectionChangedAction.Add, bớt NotifyCollectionChangedAction.Remove), clear tập hợp NotifyCollectionChangedAction.Reset ...`
- Ví dụ:

```csharp
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
namespace CS019_ObserableCollection
{
    class Program
    {
        static void Main(string[] args)
        {
            //Tạo tập hợp chứa các chuỗis
            ObservableCollection obs = new ObservableCollection();

            // Bắt sự kiện thi thay đổi obs
            obs.CollectionChanged += change;

            //Thay các phần tử tập hợp
            obs.Add("ZTest1");
            obs.Add("DTest2");
            obs.Add("ATest3");
            obs[2] = "AAAAA";

            obs.RemoveAt(1);
            obs.Clear();

        }

        // Phương thức nhận sự kiện CollectionChanged
        private static void change(object sender, NotifyCollectionChangedEventArgs e)
        {
            switch (e.Action)
            {
                case NotifyCollectionChangedAction.Add:
                    foreach (String s in e.NewItems)
                        Console.WriteLine($"Thêm :  {s}");
                    break;

                case NotifyCollectionChangedAction.Reset:
                    Console.WriteLine("Clear");
                    break;

                case NotifyCollectionChangedAction.Remove:
                    foreach (String s in e.OldItems)
                        Console.WriteLine($"Remove :  {s}");
                    break;
                case NotifyCollectionChangedAction.Replace:
                    Console.WriteLine("Repaced - " + e.NewItems[0]);
                break;
            }
        }
    }
}
// Chạy thử, kết quả:
// Add :  Test1
// Add :  Test2
// Add :  Test3
// Remove : Test2
// Clear
```

- Như vậy mỗi khi tập hợp obs thay phần tử, ta có thể bắt được ngay. Ứng dụng của `ObservableCollection` trong WPF rất phổ biến khi binding với một controller như TreeView, ListView, DataGrid ... Khi đó việc thay đổi số phần tử trong tập hợp, thì hiện thị trong các controller cũng tự thêm / bớt ... theo. Khi bạn kết hợp dùng INotifyPropertyChanged để xây dựng phần tử trong tập hợp, thì thay đổi thuộc tính của phần tử cũng tự động cập nhật vào các controller
- Khi dùng ObservableCollection làm ItemSource cho các Controller trong WPF như TreeView, DataGrid ... thì nó đã tự động bắt các sự kiện CollectionChanged, PropertyChanged

### 16. Linq trong lập trình C# .NET - thực hình ví dụ Linq

- Tìm hiểu về Linq, ngôn ngữ truy vấn tích hợp vào C#, linq cho phép viết truy vấn - chuyển truy vấn thành các lệnh thực thi trên đối tượng để truy cập đến các nguồn dữ liệu như collection và Db, XML

###### Giới thiệu LINQ, LINQ là gì?

- `LINQ (Language Integrated Query)` - ngôn ngữ truy vấn tích hợp - nó tích hợp cú pháp truy vấn (gần giống các câu lệnh SQL) vào bên trong ngôn ngữ lập trình C#, cho C# khả năng truy cập các nguồn dữ liệu khác nhau (SQL Db, XML, List ...) với cùng cú pháp.
- Phần này trình bày `LINQ` trên dữ liệu đơn giản, mục đích để hiểu khả năng của `LINQ` trước khi sử dụng nó ở các chuyên đề chuyên sâu trong truy vấn cơ sở dữ liệu, truy vấn dữ liệu XML ...
- `LINQ` hoạt động trên những kiểu tập hợp có khả năng duyệt qua nó (xem thêm Collection, List trong C#). Để sử dụng `LINQ` thì nạp hai thư viện `Generic` và `Linq`:

```csharp
using System.Collections.Generic;
using System.Linq;
```

- Nguồn dữ liệu phục vụ cho `LINQ`, phải là các đối tượng lớp triển khai giao diện (interface) `IEnumerable` và `IEnumerable<T>` tức là các mảng, danh sách thuộc `Collection` đã biết ở phần trước.
- Để thực hành những vấn đề về `LINQ` trong bài viết này thông qua các ví dụ, ta tạo ra một nguồn dữ liệu đó là một danh sách (sẽ dùng lớp List) các sản phẩm (các sản phẩm sẽ sử dụng lớp `Product` tự xây dựng). Xây dựng lớp `Product` như sau:

```csharp
public class Product
{
    public int ID {set; get;}
    public string Name {set; get;}         // tên
    public double Price {set; get;}        // giá
    public string[] Colors {set; get;}     // các màu sắc
    public int Brand {set; get;}           // ID Nhãn hiệu, hãng
    public Product(int id, string name, double price, string[] colors, int brand)
    {
        ID = id; Name = name; Price = price; Colors = colors; Brand = brand;
    }
    // Lấy chuỗi thông tin sản phẳm gồm ID, Name, Price
    override public string ToString()
       => $"{ID,3} {Name, 12} {Price, 5} {Brand, 2} {string.Join(",", Colors)}";

}
```

- Xây dựng lớp `Brand` để biểu diễn nhãn hiệu hàng hóa:

```csharp
public class  Brand {
    public string Name {set; get;}
    public int ID {set; get;}
}
```

- Khởi tạo ra 2 đối tượng danh sách dùng để thực hiện các truy vấn linq: danh sách sản phẩm products, danh sách nhãn hiệu brands

```csharp
var brands = new List<Brand>() {
    new Brand{ID = 1, Name = "Công ty AAA"},
    new Brand{ID = 2, Name = "Công ty BBB"},
    new Brand{ID = 4, Name = "Công ty CCC"},
};

var products = new List<Product>()
{
    new Product(1, "Bàn trà",    400, new string[] {"Xám", "Xanh"},         2),
    new Product(2, "Tranh treo", 400, new string[] {"Vàng", "Xanh"},        1),
    new Product(3, "Đèn trùm",   500, new string[] {"Trắng"},               3),
    new Product(4, "Bàn học",    200, new string[] {"Trắng", "Xanh"},       1),
    new Product(5, "Túi da",     300, new string[] {"Đỏ", "Đen", "Vàng"},   2),
    new Product(6, "Giường ngủ", 500, new string[] {"Trắng"},               2),
    new Product(7, "Tủ áo",      600, new string[] {"Trắng"},               3),
};
```

- Như vậy bạn đã có danh sách các sản phẩm mẫu và nhãn hiệu, giờ là lúc dùng cú pháp `LINQ` để truy vấn đến tập dữ liệu này.

###### Viết câu truy vấn LINQ đầu tiên

- Hãy thử câu lệnh LINQ: lọc ra những sản phẩm có giá bằng 400.

```csharp
public class Products
{
    // ...

    // In ra các sản phẩm có giá 400
    public static void ProductPrice400()
    {
        // Viết câu quy vấn, lưu vào ketqua
        var ketqua = from product in products
                     where product.Price == 400
                     select product;

        foreach (var product in ketqua)
            Console.WriteLine(product.ToString());
    }
    // ...
}
```

- Trong hàm Main chạy thử:

```csharp
Products.ProductPrice400();

// Kết quả
// ID 3 - Bàn trà, giá 400
// ID 4 - Tranh treo, giá 400
```

- Trong câu truy vấn bạn thấy xuất hiện các từ `from`, `where`, `select` đó là những từ khóa của C# để viết mệnh đề truy vấn `LINQ`, chúng khá giống SQL.
- **Câu truy vấn LINQ thường bắt đầu bằng mệnh đề `from` và kết thúc bằng mệnh đề `select` hoặc `group`, giữa chúng là những mệnh đề `where`, `orderby`, `join`, `let`**

###### Mệnh đề `from` ...`in` ...

- Mệnh đề `from` để xác định nguồn dữ liệu mà truy vấn sẽ thực hiện, nguồn dữ liệu là tập hợp những phần tử lưu trong đối tượng có kiểu lớp triển khai giao diện `IEnumerable` như mảng `Array`, `List` ...
- Ví dụ, `products` ở trên là kiểu `List` (nó triển khai `IEnumerable`), thì một giải (một đoạn, hoặc tất cả) các phần tử trong nó (ví dụ product in products) có thể làm nguồn, vậy mở đầu truy vấn bằng mệnh đề `from` sẽ là:

```csharp
from product in produts
```

- `products` là nguồn dữ liệu
- `product` là tên bạn tùy đặt đại diện cho phần tử trong nguồn, tên này sẽ được dùng bởi các mệnh đề theo sau.

###### Mệnh đề select

- Một câu truy vấn phải kết thúc bằng mệnh đề `select` hoặc `group`. Mệnh đề `select` chỉ ra các dữ liệu được lấy ra (xuất ra) của câu lệnh `LINQ`.

```csharp
var ketqua = from product in products
select product;
// Có nghĩa là với mỗi product trong products, dữ liệu lấy ra là các product đó (trả về collection gồm các phần tử Product).
```

- Bạn có thể chỉ lấy ra một loại dữ liệu nào đó của phần tử , ví dụ:

```csharp
var ketqua = from product in products
select product.Name;
foreach (var name in ketqua) Console.WriteLine(name);
// Bàn trà
// Túi da
//...
```

- Câu `LINQ` trên có nghĩa là với mỗi product có trong products lấy ra tên (Name) của nó (trả về một collection gồm các phần tử chuỗi)
- Bạn có thể trả về những đối tượng phức tạp mà dữ liệu được trích xuất ra `from ... in ...` hay những dữ liệu do tính toán ... Ví dụ trả về kiểu vô danh chứa các trường thông tin trả về với toán tử new {}

```csharp
var ketqua = from product in products
             select new {
                ten = product.Name.ToUpper(),
                mausac = string.Join(',', product.Colors)
             };

foreach (var item in ketqua) Console.WriteLine(item.ten + " - " + item.mausac);
// Bàn trà - Xám,Xanh
// Tranh treo - Vàng,Xanh
```

- Có nghĩa là với mỗi sản phẩm lấy ra, trả về một đối tượng chứa `ten` lấy bằng tên sản phẩm chuyển hết thành in hoa, `mausac` là chuỗi nối các màu sắc của sản phẩm.

###### Mệnh đề `where` lọc dữ liệu trong LINQ

- Mệnh đề `where` để lọc dữ liệu, sau từ khóa `where` là `biểu thức logic xác định các phần tử lọc ra`. Ví dụ:

```csharp
where product.Price == 500
```

- Bạn có thể viết các điều kiện phức tạp

```csharp
where (product.Price >= 600 && product.Price < 700) || product.Name.StartsWith("Bàn")
```

- Thậm chí, trong một truy vấn có thể viết nhiều mệnh đề `where`

```csharp
var ketqua = from product in products
     where product.Price >= 500
     where product.Name.StartsWith("Giường")
     select product;

// ID 6 - Giường ngủ, giá 500
```

###### `from` kết hợp

- Để lọc dữ liệu phức tạp hơn, có thể dùng From kết hợp để lọc phức tạp và chi tiết hơn. Ví dụ, mỗi tên sản phẩm nó có một mảng màu. Lọc ra những sản phẩm có chứa màu nào đó.

```csharp
var ketqua = from product in products
             from color in product.Colors
             where product.Price < 500
             where color == "Vàng"
             select product;

foreach (var product in ketqua) Console.WriteLine(product.ToString());

// ID 2 - Túi da, giá 300
// ID 4 - Tranh treo, giá 400
```

###### Mệnh đề `orderby` sắp xếp kết quả trong LINQ

- Để sắp xếp kết quả sử dụng `orderby` viết sau mệnh đề `where` nếu có, ví dụ sắp xếp tăng dần (từ nhỏ đến lớn) theo thuộc tính dữ liệu (hoặc thuộc tính) thuoctinh thì viết

```csharp
orderby thuoctinh
```

- Nếu muốn xếp theo thứ tự giảm dần (lớn đến bé)

```csharp
orderby thuoctinh descending
```

- Ví dụ:

```csharp
var ketqua = from product in products
            where product.Price <= 300
            orderby product.Price descending
            select product;
foreach (var product in ketqua) Console.WriteLine($"{product.Name} - {product.Price}");
// Túi da - 300
// Bàn học - 200

```

- Cũng có thể sắp xếp theo nhiều dữ liệu, viết cách nhau bởi `,`

```csharp
orderby thuoctinh1 descending, thuoctinh2, thuoctinh3 descending ...
```

###### Mệnh đề `group ... by`

- Cuối truy vấn có thể sử dụng `group` thay cho `select`, nếu sử dụng `group` thì nó trả về theo từng nhóm (nhóm lại theo trường dữ liệu nào đó), mỗi phần tử của cấu truy vấn trả về là kiểu `IGrouping<TKey,TElement>`, chứa các phần tử thuộc một nhóm.
- Ví dụ, lấy sản phẩm có giá từ 400 - 500, nhóm lại theo giá (cùng giá cho vào một nhóm)

```csharp
var ketqua = from product in products
             where product.Price >=400 && product.Price <= 500
             group product by product.Price;
foreach (var group in ketqua)
{
    // Key là giá trị dùng để phân loại (nhóm): là giá
    Console.WriteLine(group.Key);
    foreach (var product in group)
    {
        Console.WriteLine($"    {product.Name} - {product.Price}");
    }

}
// 400
//     Bàn trà - 400
//     Tranh treo - 400
// 500
//     Đèn trùm - 500
//     Giường ngủ - 500
```

- Bạn có thể lưu tạm `group` trong truy vấn vào một biến bằng cách sử dụng `into`, sau đó thi hành các mệnh đề khác trên biến tạm và dùng mệnh đề `select` để trả về kết quả

```csharp
// Kết quả giống câu truy vấn trên, nhưng các nhóm xếp từ lớn xuống nhỏ
var ketqua = from product in products
             where product.Price >=400 && product.Price <= 500
             group product by product.Price into gr
             orderby gr.Key descending
             select gr;

// 500
//     Đèn trùm - 500
//     Giường ngủ - 500
// 400
//     Bàn trà - 400
//     Tranh treo - 400
```

###### `let` - dùng biến trong truy vấn

- Dùng thêm biến vào LINQ, lưu kết quả của một biểu thức tính toán nào đó, thêm vào mệnh đề bằng cách viết let tenvien = biểu_thức, ví dụ với mỗi loại giá - có bao nhiêu sản phẩm

```csharp
var ketqua = from product in products                  // các sản phẩm trong products
             group product by product.Price into gr    // nhóm thành gr theo giá
             let count = gr.Count()                    // số phần tử trong nhóm
             select new {                              // trả về giá và số sản phầm có giá này
                price = gr.Key,
                number_product = count
             };

foreach (var item in ketqua)
{
    Console.WriteLine($"{item.price} - {item.number_product}");
}
// 200 - 1
// 300 - 1
// 400 - 2
// 500 - 2
// 600 - 1
```

###### Mệnh đề join - khớp nối nguồn truy vấn LINQ

- `join` là thực hiện kết hợp hai nguyền dữ liệu lại với nhau để truy vấn thông tin, ví dụ trong mỗi sản phẩm đều có `Brand` nó là ID của nhãn - vậy mỗi sản phẩm dùng thông tin này để có được thông tin chi tiết về nhãn hàng mà nhãn hàng lại lưu ở nguồn khác.
- Các sản phẩm ở ví dụ phía trên, sản phẩm nào có Brand là 2 thì tra cứu ở Brand.brands thì tên nhãn là "Công ty AAA"
- Giờ muốn thực hành truy vấn kết hợp khớp nối giữa hai nguồn dữ liệu danh sách sản phẩm products và danh sách nhãn hàng brands

**Inner join**

- Để kết nối, dùng mệnh đề `join` để chỉ ra nguồn (nguồn bên phải join) sẽ kết nối với nguồn của `from` (nguồn bên trái join), tiếp theo chỉ ra sự ràng buộc các phần tử bằng từ khóa on
- Ví dụ, truy vấn sản phẩm, mỗi sản phẩm căn cứ vào Brand ID của nó - lấy tên Brand tương ứng

```csharp
var ketqua = from product in products
             join brand in brands on product.Brand equals brand.ID
             select new {
                 name  = product.Name,
                 brand = brand.Name,
                 price = product.Price
             };

foreach (var item in ketqua)
{
    Console.WriteLine($"{item.name,10} {item.price, 4} {item.brand,12}");
}

//     Túi da  300  Công ty BBB
//    Bàn trà  400  Công ty BBB
// Tranh treo  400  Công ty AAA
// Giường ngủ  500  Công ty BBB
```

- Phân tích truy vấn trên ta thấy
  - nguồn bên trái `join` là : `product in products`
  - nguồn bên phải `join` là : `brand in brands`
  - kết nối là: `on product.Brand equals brand.ID` (Brand trong product bằng ID của brand)
- Với truy vấn `join` trên, chỉ những dữ liệu `product` mà có `brand` tương ứng mới trả về, nên nó gọi là `inner join` (tức giá trị `product.brand` hay `brand.ID` có ở cả 2 nguồn). Kết quả trả về có 4 dòng như trên. Để ý trong danh sách sản phẩm có sản phẩm "Tủ áo", sản phẩm này có brand là 3, nhưng ở danh sách brands lại không có phần tử nào ID bằng 3 nên truy vấn trên sẽ bỏ sản phẩm "Tủ áo"

###### Left join

- Trong truy vấn trên, sản phẩm nào không tìm được thông tin `brand` ở ngồn bên phải join thì sẽ bỏ qua. Giờ muốn, các sản phẩm kể cả không thấy brand cũng trả về - có nghĩa nguồn bên trái lấy không phụ thuộc vào bên phải thì dùng kỹ thuật `left join` như sau:

```csharp
var ketqua = from product in products
             join brand in brands on product.Brand equals brand.ID into t
             from brand in t.DefaultIfEmpty()
             select new {
                 name  = product.Name,
                 brand = (brand == null) ? "NO-BRAND" : brand.Name,
                 price = product.Price
             };

foreach (var item in ketqua)
{
    Console.WriteLine($"{item.name,10} {item.price, 4} {item.brand,12}");
}

//         Bàn học  200  Công ty AAA
//     Túi da  300  Công ty BBB
//    Bàn trà  400  Công ty BBB
// Tranh treo  400  Công ty AAA
//   Đèn trùm  500     NO-BRAND
// Giường ngủ  500  Công ty BBB
//      Tủ áo  600     NO-BRAND

```

- Khi truy vấn, các brand tương ứng với product gồm cả nhưng brand bằng null tương ứng với sản phẩm không thấy brand được lưu vào nguồn tạm đặt tên là t. Sau đó truy vấn lấy brand trên DefaultIfEmpty() nguồn tạm này, đảm bảo các sản phẩm kể cả không thấy brand (brand bằng null) cũng trả về.
- Khi lấy tên brand, nếu `null` thì thay bằng chữ `"NO-BRAND" brand = (brand == null) ? "NO-BRAND" : brand.Name`

```csharp
/// Select
/// SelectMany
/// Where
/// Min, Max, Sum, Average
/// Join
/// Group Join
/// Take
/// Skip
/// OrderBy OrderByDescending
/// Reverse
/// GroupBy
/// Distinct
/// Single SingleOrDefault
/// Any All
/// Count ()
```

### 17. Lập trình bất đồng bộ asynchronou, C# với bất đồng bộ theo mô hình tác vụ

- Tìm hiểu về lập trình bất đồng bộ, sử dụng lớp `Task` để chạy task, tìm hiểu từ khóa `async` và `await` - áp dụng bất đồng bộ

###### Lập trình bất đồng bộ asynchronous

- Từ .NET Framework 4.5 nó thêm vào thư viện có tên `Task Parallel Library (TPL)` - TPL giúp lập trình chạy song song (đa luồng) dễ dàng hơn. Trong C# đồng thời nó thêm vào hai từ khóa là `async` và `await`, đây là hai từ khóa chính để sử dụng trong lập trình bất đồng bộ.
- `Lập trình bất đồng bộ (asynchronous)` là một cách thức mà khi gọi nó chạy ở chế độ nền (liên quan đến một tiến trình, task), trong khi đó tiến trình gọi nó không bị khóa - block. Trong `.NET` có triển khai một số mô hình lập trình bất đồng bộ như `Asynchronous pattern`, mẫu bất đồng bộ theo sự kiện và theo tác vụ (TAP - task-based asynchronous pattern)
- Phần này sẽ nói về `TAP - task-based asynchronous pattern` - mộ hình lập trình bất đồng bộ thông dụng trên `.NET` hiện nay.

###### Lập trình đồng bộ synchronous

- Bình thường, khi lập trình gọi một phương thức nào đó thì phương thức đó chạy và kết thúc thì các dòng code tiếp theo sau lời gọi phương thức đó mới được thực thi, đó là chạy đồng bộ, có nghĩa là thread gọi phương thức bị khóa lại cho đến khi phương thức kết thúc.
- Thử xem ví dụ đơn giản sau:

```csharp
//DownloadWebsite01.cs

using System;
using System.Net;
using System.Threading;

namespace CS021_ASYNCHRONOUS {

    public class DownloadWebsite01 {

        public static string DownloadWebpage (string url, bool showresult) {
            using (var client = new WebClient ()) {
                Console.Write ("Starting download ...");
                string content = client.DownloadString (url);
                Thread.Sleep (3000);
                if (showresult)
                    Console.WriteLine (content.Substring (0, 150));

                return content;
            }
        }

        public static void TestDownloadWebpage()
        {
            string url = "https://code.visualstudio.com/";
            DownloadWebpage(url, true);
            Console.WriteLine("Do somthing ...");
        }
    }
}
```

- Hãy gọi `TestDownloadWebpage()` trong hàm `main` để kiểm tra.
- Phương thức `DownloadWebpage` sử dụng lớp `WebClient` để tải về một trang web, trả về chuỗi nội dung trang.
- Khi chạy, thì lời gọi `DownloadWebpage(url, true);`, phương thức này thi hành xong thì dòng code `Console.WriteLine("Do somthing ...");` mới được thi hành.
- Vấn đề là khi `DownloadWebpage(url, true);` chạy, nó sẽ khóa thread gọi nó, làm cho các dòng code tiếp theo phải chờ, nếu hàm đó thi hành mất nhiều thời gian (đặc biệt là các thao tác đọc stream - đọc file, kết nối web, kết nối CSDL ...) - trong khi tài nguyên vẫn đủ để làm các việc khác - thì chương trình vẫn cứ phải chờ phương thức trên kết thúc thì mới thi hành được tác vụ khác - đặt biệt là khi gọi phương thức trong các tiến trình UI, giao diện người dùng không tương tác được.
- Để giải quyết vấn đề này, trong khi chờ cho `DownloadWebpage(url, true)` thi hành xong, chương trình vẫn thi hành được các tác vụ khác thì cần đến kỹ thuật lập trình bất đồng bộ (trước đây gọi là lập trình đa tiến trình, đa luồng)

###### Lớp Task

- Lớp `Task` nó biểu thị tác vụ bất đồng bộ, từ đó ta chạy được code bất đồng bộ. Nếu tác vụ bất đồng bộ đó thi hành xong có kiểu trả về thì dùng `Task<T>` với `T` là kiểu trả về.

- Cần sử dụng các namespace sau để có thư viện về Task

```csharp
using System.Threading;
using System.Threading.Tasks;
```

- Chú ý hãy tìm hiểu về `hàm ủy quyền delegate C# `trước

**Cú pháp tạo ra đối tượng Task cơ bản**

- Để tạo ra một Task bạn cần tham số là một `hàm delegate (Func hoặc Action)`, ví dụ `delegate` có tên `myfunc` thì khởi tạo

```csharp
// Nếu myfunc trả về kiểu T (tức là một Func) thì khởi tạo
Task<T> task = new  Task<T>(myfunc);

// Nếu cần truyền tham số cho myfunc thì khởi tạo:

// object là đối tượng tham số truyền cho myfunc
Task<T> task = new  Task<T>(myfunc, object);

// Nếu myfunc không trả về giá trị (tức là Action) thì khởi tạo:
// object là đối tượng tham số truyền cho myfunc
Task task = new  Task(myfunc);
```

- Để chạy `Task` gọi phương thức `Start()` của đối tượng được tạo ra. Nếu có kết quả trả về thì đọc kết quả tại thuộc tính `Result`, đề chờ cho task hoàn thành thì gọi `Wait()`
- Ta sẽ làm một ví dụ sử dụng `Task` tạo ra các 2 tiến trình con chạy đồng thời:

```csharp
TestAsync01.cs

using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace CS021_ASYNCHRONOUS {
    public class TestAsync01 {

        // Viết ra màn hình thông báo có màu
        public static void WriteLine (string s, ConsoleColor color) {
            Console.ForegroundColor = color;
            Console.WriteLine (s);
        }

        // Tạo và chạy Task, sử dụng delegate Func (có kiểu trả về)
        public static Task<string> Async1 (string thamso1, string thamso2) {
            // tạo biến delegate trả về kiểu string, có một tham số object
            Func<object, string> myfunc = (object thamso) => {
                // Đọc tham số (dùng kiểu động - xem kiểu động để biết chi tiết)
                dynamic ts = thamso;
                for (int i = 1; i <= 10; i++) {
                    //  Thread.CurrentThread.ManagedThreadId  trả về ID của thread đạng chạy
                    WriteLine ($"{i,5} {Thread.CurrentThread.ManagedThreadId,3} Tham số {ts.x} {ts.y}",
                        ConsoleColor.Green);
                    Thread.Sleep (500);
                }
                return $"Kết thúc Async1! {ts.x}";
            };

            Task<string> task = new Task<string> (myfunc, new { x = thamso1, y = thamso2 });
            task.Start(); // chạy thread

            // Làm gì đó sau khi chạy Task ở đây
            Console.WriteLine("Async1: Làm gì đó sau khi task chạy");


            return task;
        }

        // Tạo và chạy Task, sử dụng delegate Action (không kiểu trả về)
        public static Task Async2 () {

            Action myaction = () => {
                for (int i = 1; i <= 10; i++) {
                    WriteLine ($"{i,5} {Thread.CurrentThread.ManagedThreadId,3}",
                        ConsoleColor.Yellow);
                    Thread.Sleep (2000);
                }
            };
            Task task = new Task (myaction);
            task.Start();

            // Làm gì đó sau khi chạy Task ở đây
            Console.WriteLine("Async2: Làm gì đó sau khi task chạy");

            return task;
        }

    }
}
```

- Chạy trong hàm main

```csharp
Console.WriteLine($"{' ',5} {Thread.CurrentThread.ManagedThreadId,3} MainThread");
Task<string> t1 = TestAsync01.Async1("A", "B");
Task t2 = TestAsync01.Async2();

Console.WriteLine("Làm gì đó ở thread chính sau khi 2 task chạy");

// Chờ t1 kết thúc và đọc kết quả trả về
t1.Wait();
String s = t1.Result;
TestAsync01.WriteLine(s, ConsoleColor.Red);

// Ngăn không cho thread chính kết thúc
// Nếu thread chính kết thúc mà t2 đang chạy nó sẽ bị ngắt
Console.ReadKey();
```

- Để khởi tạo một Task bạn cần tham số là một `delegate (Func hoặc Action)` - nên cần nắm rõ về delegate Func và Action trước.
- Lưu ý: sử dụng `Task<T>` và `Func<T,V>` : khi khởi tạo một task cần tham số là một `delegate`, khi task chạy xong thì có kết quả trả về nên dùng đến `delegate` dạng `Func<T,V>`, đầu tiên tạo `Delegate` dạng này với cú pháp như sau (trường hợp trong Async1 ở trên)

```csharp
Func<object, return_type> func = (object thamso) => {
    // code ...
    return ...;
};
```

- Sau đó tạo Task với cú pháp

```csharp
Task<return_type> task = new  Task<return_type>(func, thamso);
```

- Khi đã có `Task`, gọi phương thức `Start()` của nó để bắt đầu chạy thread, một thread mới bất đồng bộ sẽ khởi chạy - nó sẽ không khóa thread gọi nó - các dòng code tiếp theo của thread chính vẫn chạy trong khi `Task` đang thi hành.
- Khi `Task` chạy xong, kết quả `delegate` trả về lưu ở thuộc tính `Result` (task.Result)
- Kết quả chạy code trên, hai thread con đang chạy song song, trong khi thread chính đang chờ người người dùng bấm bàn phím.
- Cũng để ý `Async2` ở trên lại dùng `Task` chứ không phải `Task<T>`, áp dụng khi hàm bất đồng bộ không cần kết quả trả về, lúc đó lại dùng hàm `delegate` dạng `Action` chứ không dùng `Func`, cú pháp:

```csharp
Action action = () => {};
Task task = new Task(action);
```

##### async và await

- Mã trên bạn thấy, khi đối tượng `Task` khởi chạy bằng `Start` thì thread của `Task` chạy, và những dòng code sau `Start()` được xử lý mà không bị khóa lại. Như đã nói trên, thread chạy - và khi delegate hoàn thành kết quả trả về lưu ở task.Result
- Vấn đề là khi truy cập `task.Result` để đọc kết quả trả về, thì dòng code đó sẽ chờ cho `Task` hoàn thành để đọc dẫn đến dòng code sau đó không được thực thi - do thread gọi lại bị block, ví dụ cập nhật hàm `Async1` để thấy rõ điều đó.

```csharp
public static Task<string> Async1 (string thamso1, string thamso2) {
    // tạo biến delegate trả về kiểu string, có một tham số object
    Func<object, string> myfunc = (object thamso) => {
        // Đọc tham số (dùng kiểu động - xem kiểu động để biết chi tiết)
        dynamic ts = thamso;
        for (int i = 1; i <= 10; i++) {
            //  Thread.CurrentThread.ManagedThreadId  trả về ID của thread đạng chạy
            WriteLine ($"{i,5} {Thread.CurrentThread.ManagedThreadId,3} Tham số {ts.x} {ts.y}",
                ConsoleColor.Green);
            Thread.Sleep (500);
        }
        return $"Kết thúc Async1! {ts.x}";
    };

    Task<string> task = new Task<string> (myfunc, new { x = thamso1, y = thamso2 });
    task.Start(); // chạy thread

    // Làm gì đó sau khi chạy Task ở đây
    Console.WriteLine("Async1: Làm gì đó sau khi task chạy");

    string ketqua= task.Result;   // khóa (block) thread cha - chờ task hoàn thành
    Console.WriteLine("Làm gì đó khi task đã kết thúc");


    return task;
}
```

[Image](https://raw.githubusercontent.com/xuanthulabnet/learn-cs-netcore/master/imgs/cs020.png)

- Khi `Async1` được gọi **1** từ thread chính, nó khác trường hợp trước - thread chạy nhưng hàm không trả về ngay lập tức - dẫn đến thread bị khóa - `Async2` không được chạy cho đến khi thread trong `Async1` kết thúc.
- Bạn thấy thread trong `Async1` kết thức **2**, thì `Async2` mới được gọi **3**, lúc đó task trong nó mới chạy **4**
- Vậy 2 task trong `ASync1` và `Async2` không được chạy đồng thời, task này kết thúc mới chạy được task kia => Lợi ích của đa luồng, bất đồng bộ mất đi.
- Giờ bạn mong muốn khi gọi `Async1()`, nó trả về ngay lập tức (nghĩa là không khóa thread gọi nó, mặc dù bắt đầu chạy một task) - trong khi bên trong `Async1()` vẫn đảm bảo, có những đoạn code chỉ được thi hành khi task trong nó kết thúc (đoạn code phía sau string ketqua = task.Result;)
- Lúc này bạn cần sử dụng đến cặp từ khóa `async` và `await`. Tiến hành làm như sau:

- **`Bước 1`** Thêm vào khai báo tên hàm từ khóa `async`, nó cho trình biên dịch biết đây là hàm bất đồng bộ - khi gọi nó - nó trả về ngay lập tức

```csharp
public static async Task<string> Async1 (string thamso1, string thamso2)
```

- **`Bước 2`** Trong thân của `Async1`, phải có đoạn code chờ task hoàn thành

```csharp
await task; // đây là điểm không khóa thread chính, thread chính chạy tiếp, task chạy tiếp
```

- Dòng code `await` này có ý nghĩa:

  - Lời gọi hàm `Async1` chuyển hướng về chỗ gọi nó khi gặp `await` (tạm dừng thi hành mã sau `await`)
  - Code trong `Async1` phía sau `await` chỉ được chạy khi task chạy xong
  - Khi `await` hoàn thành thì nó chứa kết quả của Task nếu có
  - `await` chỉ viết được trong hàm có khai báo `async`
  - **Nhớ là await phải dùng với Task**

- Với hàm `async` không cần kiểu trả về thì phải trả về `Task` tránh dùng void, xem code `Async2` phía dưới.
- Vậy hàm `Async` sau khi chuyển nó là hàm bất đồng bộ với từ khóa `async` và `await` sẽ như sau:

```csharp
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace CS021_ASYNCHRONOUS {
    public class TestAsyncAwait {

        // Viết ra màn hình thông báo có màu
        public static void WriteLine (string s, ConsoleColor color) {
            Console.ForegroundColor = color;
            Console.WriteLine (s);
        }

        // Tạo và chạy Task, sử dụng delegate Func (có kiểu trả về)
        public static async Task<string> Async1 (string thamso1, string thamso2) {
            // tạo biến delegate trả về kiểu string, có một tham số object
            Func<object, string> myfunc = (object thamso) => {
                // Đọc tham số (dùng kiểu động - xem kiểu động để biết chi tiết)
                dynamic ts = thamso;
                for (int i = 1; i <= 10; i++) {
                    //  Thread.CurrentThread.ManagedThreadId  trả về ID của thread đạng chạy
                    WriteLine ($"{i,5} {Thread.CurrentThread.ManagedThreadId,3} Tham số {ts.x} {ts.y}",
                        ConsoleColor.Green);
                    Thread.Sleep (500);
                }
                return $"Kết thúc Async1! {ts.x}";
            };

            Task<string> task = new Task<string> (myfunc, new { x = thamso1, y = thamso2 });
            task.Start();  // chý ý dòng này, để đảm bảo  task được kích hoạt

            await task;


            // Từ đây là code sau await (trong Async1) sẽ chỉ thi hành khi task kết thúc
            TestAsync01.WriteLine("Async1 - làm gì đó khi task chạy xong", ConsoleColor.Red);
            string ketqua= task.Result;       // Đọc kết quả trả về của task - không phải lo block thread gọi Async1

            Console.WriteLine(ketqua);        // In kết quả trả về của task
            return ketqua;

        }

        public static async Task Async2 () {

            Action myaction = () => {
                for (int i = 1; i <= 10; i++) {
                    WriteLine ($"{i,5} {Thread.CurrentThread.ManagedThreadId,3}", ConsoleColor.Yellow);
                    Thread.Sleep (2000);
                }
            };
            Task task = new Task (myaction);
            task.Start();

            await task;

            // Làm gì đó sau khi chạy Task ở đây
            Console.WriteLine("Async2: Làm gì đó sau khi task kết thúc");

            // Không cần trả về vì gốc đồng bộ trả về void, đồng bộ sẽ trả về Task
        }
    }
}
```

- Chạy thử đoạn code trong hàm main

```csharp
static async Task Main(string[] args)
{
    var t1 = TestAsyncAwait.Async1("x", "y");
    var t2 = TestAsyncAwait.Async2();

    // Làm gì đó khi t1, t2 đang chạy
    Console.WriteLine("Task1, Task2 đang chạy");


    await t1; // chờ t1 kết thúc
    Console.WriteLine("Làm gì đó khi t1 kết thúc");

    await t2; // chờ t2 kết thúc
}
```

- Nhớ là trong hàm `main` để thi hành được tác vụ chờ `task`, gọi các phương thức bất đồng bộ, bạn cũng phải thiết lập `main` là bất đồng bộ như trên.
- Sau khi chạy, bạn sẽ thấy 2 `task` đã cùng chạy một lúc - và đoạn code sau `await` trong phương thức `async` chỉ thi hành khi `task` trong nó kết thúc.
  [Image](https://raw.githubusercontent.com/xuanthulabnet/learn-cs-netcore/master/imgs/cs021.png)

##### Phương thức async trả về Task

- Khi khai báo hàm với `async` neen tránh dùng kiểu trả về void (dù được phép, không await được) mà hãy dùng Task nếu không có kiểu trả về hoặc `Task<T>` khi có kiểu trả về T. Khi có kiểu trả về thì trong thân hàm phải có đoạn lệnh return trả về dữ liệu kiểu T.

```csharp
async Task<T> funtion_name<T>(/*tham số nếu có */)
{
    await ...  // phải có đoạn code await một Task nào đó

    return t;  // t phải có kiểu T, mặc dù viết return t; nhưng thực tế trình biên dịch tạo ra đối tượng Task<T> để  trả về
}
```

- Ví dụ khai báo hàm `async` trả về kiểu `Task<int>` thì phải có return một giá trị hay biến kiểu int, khai báo `async` đảm bảo trình biên dịch trả về kiểu `Task<int>` mặc dù trong thân là return biểu thức kiểu int

- Nhìn lại hàm `Async1` trả về kiểu `Task<string>`

```csharp
static async Task<string> Async1(string thamso1, string thamso2)
{
    // ...
    await task;

    //...
    return ketqua;  // trả về kiểu string
}
```

- Do `Async1` một `Task`, thì nó có thể `await` ở một phương thức `async` khác thì phương thức đó cũng phải là `async` như hàm Main ở trên

```csharp
static async Task Main(string[] args)
{
    var t1 = TestAsyncAwait.Async1("x", "y");

    //..

    await t1; // chờ t1 kết thúc

    //...
}
```

- Áp dụng xây dựng chức năng tải một file từ internet về có áp dụng kỹ thuật bất đồng bộ `(async/await)`, dùng `WebClient` để tải file
- Mặc dù WebClient có sẵn phương thức đồng bộ, nhưng ở đây ta sẽ dùng phương thức `DownloadData` để tải mảng dữ liệu (file) về, sau đó đưa toàn bộ code thành bất đồng bộ.
- Ban đầu để tải được file, dùng code đồng bộ thì sẽ như sau:

```csharp
public static void DownloadFile (string url) {
    using (var client = new WebClient ()) {
        Console.Write ("Starting download ..." + url);
        // mảng byte tải về
        byte[] data = client.DownloadData(new Uri(url));

        // Lấy tên file để lưu
        string filename = System.IO.Path.GetFileName(url);
        System.IO.File.WriteAllBytes(filename, data);
    }
}
```

- Giờ ta sẽ chuyển thành code đồng bộ, nó sẽ có dạng:

```csharp
// DownloadAsync.cs

using System;
using System.Net;
using System.Threading.Tasks;
namespace CS021_ASYNCHRONOUS {
    public class DownloadAsync {

        public static async Task DownloadFile (string url) {
            Action downloadaction = () => {
                using (var client = new WebClient ()) {
                    Console.Write ("Starting download ..." + url);
                    // mảng byte tải về
                    byte[] data = client.DownloadData(new Uri(url));

                    // Lấy tên file để lưu
                    string filename = System.IO.Path.GetFileName(url);
                    System.IO.File.WriteAllBytes(filename, data);
                }
            };

            Task task = new Task(downloadaction);
            task.Start();

            await task;
            Console.WriteLine("Đã hoàn thành tải file");
        }
  }
}
```

- Ta thấy toàn bố code của thân hàm khi ở trạng thái đồng bộ được đưa vào một `Action (deleage)` có tên `downloadaction`, sau đó tạo `Task` từ `delegate` này. Đồng thời biến đổi `DownloadFile` thành bất đồng bộ.

```csharp
// Hàm Main gọi tải thử

static async Task Main(string[] args)
{
    string url = "https://github.com/microsoft/vscode/archive/1.48.0.tar.gz";
    var taskdonload = DownloadAsync.DownloadFile(url);
    //..
    Console.WriteLine("Làm gì đó khi file đang tải");
    //..
    await taskdonload;
    Console.WriteLine("Làm gì đó khi file tải xong");
}
```

##### Yêu cầu kết thúc Task đang thực thi với CancellationToken

- Khi tạo ra các `Task`, còn có thể khởi tạo - truyền cho nó một đối tượng kiểu `CancellationToken`, đối tượng này được phát sinh bởi lớp `CancellationTokenSource`. Khi trong task có `CancellationToken` thì trong quá trình thực thi nó có thể kiểm tra `CancellationToken`.`IsCancellationRequested`, nếu là true thì có yêu cầu dừng task, lúc này code trong task chủ động kết thúc task.
- Ví dụ: có `task1`, `task2` đang chạy, nếu nhấn phím e thì 2 task này kết thúc

```csharp
static async Task Main(string[] args)
{
    // Đối tượng để phát đi yêu cầu dừng Task
    var tokenSource = new CancellationTokenSource();

    // Lấy token - để sử dụng bởi task, khi task thực thi
    // token.IsCancellationRequested là true nếu có phát yêu cầu dừng
    // bằng cách gọi tokenSource.Cancel
    var token = tokenSource.Token;


    // Tạo task1 có sử dụng CancellationToken
    Task task1 = new Task(
        () => {

            for (int i = 0; i < 10000; i++)
            {
                // Kiểm tra xem có yêu cầu dừng thì kết thúc task
                if (token.IsCancellationRequested)
                {
                    Console.WriteLine("TASK1 STOP");
                    token.ThrowIfCancellationRequested();
                    return;
                }

                // Chạy tiếp
                Console.WriteLine("TASK1 runing ... " + i);
                Thread.Sleep(300);
            }
        },
        token
    );


    // Tạo task1 có sử dụng CancellationToken
    Task task2 = new Task(
        () => {

            for (int i = 0; i < 10000; i++)
            {
                if (token.IsCancellationRequested)
                {
                    Console.WriteLine("TASK1 STOP");
                    token.ThrowIfCancellationRequested();
                    return;
                }
                Console.WriteLine("TASK2 runing ... " + i);
                Thread.Sleep(300);
            }
        },
        token
    );

    // Chạy các task
    task1.Start();
    task2.Start();




    while (true)
    {
       var c = Console.ReadKey().KeyChar;

       // Nếu bấm e sẽ phát yêu cầu dừng task
       if (c == 'e')
       {
           // phát yêu cầu dừng task
           tokenSource.Cancel();
           break;
       }

    }

    Console.WriteLine("Các task đã kết thúc, bấm phím bất kỳ kết thúc chương trình");
    Console.ReadKey();
}
```
