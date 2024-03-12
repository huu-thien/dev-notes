---
tags: dotnet, aspnet  
---
### Dependency Injection

- Direct Dependency: class A tham chiếu trực tiếp đến class B
	![Pasted image 20230729211113](attachments/Pasted%20image%2020230729211113.png)
- Inverse Dependency: class A sử dụng interface (hoặc lớp abstract) mà class B triển khai
	![Pasted image 20230729211139](attachments/Pasted%20image%2020230729211139.png)
- **Dependency injection (DI)** là một kỹ thuật trong lập trình, nó là một hình thức cụ thể của **Inverse of Control (Dependency Inverse)**. 
	- Xây dựng các class (service) có sự phụ thuộc nhau một cách lỏng lẻo, và dependency có thể tiêm vào object (injection) - thường qua phương thức khởi tạo constructor, property, setter
	 - Xây dựng được một thư viện có thể tự động tạo ra các đối tượng, các dependency tiêm vào object đó, thường là áp dụng kỹ thuật Reflection ([Type](Type.md)) của C#
- Các kiểu Dependency Injection:
    - thông qua constructor
    - thông qua setter
    - thông qua interface có chứa các phương thức setter để cho lớp triển khai định nghĩa
- Lớp ServiceCollection quản lý các service (đăng ký, tạo service, tự động inject...)
    1. tạo đối tượng SC, sau đó đăng ký các dịch vụ vào SC
    2. Từ SC phát sinh ra đối tượng ServiceProvider để truy vấn các service khi cần
- enum ServiceLifetime:
    - `0 Singleton`: duy nhất 1 instance của service được tạo đến hết vòng đời của ServiceProvider
    - `1 Scoped`: 1 instance tồn tại cùng với 1 đối tượng ServiceScope (tạo bằng ServiceProvider.CreateScope)
    - `2 Transient`: 1 instance được tạo mỗi khi được yêu cầu
- ServiceCollection's method:
    - `AddSingleton<ServiceType, ImplementationType>`
    - `AddTransient`
    - `AddScoped` //Các method trên có thể nhận 1 delegate tạo đối tượng (vd cho trường hợp constructor nhận thêm param string)
    - `BuildServiceProvider`: trả về đối tượng thuộc IServiceProvider
- ServiceProvider's method
    - `GetService<ServiceType>`: trả về null nếu service không tồn tại
    - `GetRequiredService(ServiceType)`: tương tự nhưng throw Exception nếu service không tồn tại
    - `CreateScope`

- Tham khảo: [xuanthulab](https://xuanthulab.net/dependency-injection-di-trong-c-voi-servicecollection.html)