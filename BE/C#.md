### 1. Giới thiệu .NET

- Là một nền tảng thống nhất phát triển nhiều loại ứng dụng từ mobile, desktop, cho đến web được phát triển bởi Microsoft
- `.NET Framework` được Microsoft đưa ra chính thức từ năm 2002. `.NET Framework` chỉ hoạt động trên windows. Những nền tảng ứng dụng như WPF, Winform, ASP.NET (1-4) hoạt động dựa trên .NET Framework
- Cho đến năm 2013, Microsoft định hướng đi đa nền tảng và phát triển `.NET core`. `.NET core` hiện được sử dụng trong các ứng dụng Universal Windows platform và `ASP.NET Core`. Từ đây, C# có thể được sử dụng để phát triển các laoij ứng dụng đa nền tảng trên các hệ điều hành khác nhau.
- `C#` là ngôn ngữ lập trình hiện đại, hướng đối tượng và được xây dựng trên nền tảng của 2 ngôn ngữ mạnh nhất là C++ và Java

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
