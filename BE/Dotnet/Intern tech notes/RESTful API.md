---
tags: aspnet, general
---
- API (Application Programming Interface) đóng vai trò là interface để các ứng dụng giao tiếp với nhau
- REST (Representational State Transfer): là một tập các quy tắc hay kiểu kiến trúc giúp tạo các API theo giao thức HTTP một cách có hệ thống, dễ mở rộng.
- RESTful API: là các API tuân theo chuẩn của REST

## REST Constraints

### Uniform Interface

- Cách ta giao tiếp với một server phải thống nhất
- **Identification of Resources:** 1 business entity ứng với 1 resource được định danh bằng 1 URI (vd: /api/user/1)
- **Manipulation of resources through representations:** Khi client có 1 “representation” cho 1 resource trên server thì client có đầy đủ thông tin để chỉnh sửa hay xóa resource đó (nếu được phân quyền) thông qua các HTTP verbs: GET, POST, DELETE, PATCH, PUT…
- **Self-descriptive messages:** mỗi message giao tiếp giữa client và server phải có đầy đủ thông tin để mỗi bên xử lí, sử dụng các header như Content-Type, Accept…, status code, các thông tin đi kèm trong body
- **Hypermedia As The Engine Of Application State(HATEOAS):** data trả về từ server nên đi kèm các link để client có thể truy cập tới các resource liên quan

### Stateless

- server không lưu dữ liệu về client session để phục vụ cho các request tiếp theo, mọi request gửi tới đều được xem là request mới và chứa đủ thông tin để server có thể xử lý

### Cacheable

- Server có thể hướng dẫn cho client nên và không nên cache response nào, cache trong bao lâu… Thông qua HTTP header: Cache-Control, Age, Expires…

### Client - Server

- Tách UI logic khỏi business logic và data access. Giúp server và client không bị phụ thuộc nhau, 1 server có thể phục vụ nhiều loại client khác nhau (mobile, web…)

### **Layered system**

- Hệ thống có thể có nhiều lớp khác nhau, nằm ở nhiều server khác nhau. Mỗi lớp chỉ cần quan tâm đến kế tiếp. Giúp tăng khả năng mở rộng. Phía client chỉ cần gửi request tới địa chỉ của server mà không cần biết sự tồn tại của các lớp này.

### Code on demand (optional)

- Server nếu cần thì có thể custom hoặc mở rộng chức năng của client bằng cách gửi các đoạn code

## Conventions & best practices

- **Organize the API design around resources:**
    
    - URI sử dụng danh từ chỉ resource thay vì động từ chỉ các hành động lên resource: POST /api/orders thay cho /api/create-orders
    - resource không cần map 1:1 với các entity trong db, tránh để lộ internal implementation thông qua API
    - Thể hiện mối quan hệ giữa các resource
        - `/customers/5/orders` hoặc `/orders/99/customer` : cần tránh các URI phức tạp hơn dạng _collection/item/collection_
        - nếu quá phức tạp thì có thể đính kèm links dẫn tới các resource liên quan trong response body (HATEOAS)
    - Tránh “chatty APIs”: muốn lấy đầy đủ thông tin phải gọi tới nhiều api khác. Nên gom thành 1 response lớn. Cân bằng giữa việc gom và tách data theo nhu cầu của client
- **Define API operations in terms of HTTP methods**
    
    - Các HTTPS methods phải được sử dụng đúng mục đích và không được tạo ra các side-effects
    - **GET** retrieves a representation of the resource. The body contains the details of the requested resource.
    - **POST** creates a new resource. The body provides the details of the new resource.
    - **PUT** either creates or replaces the resource. The body specifies the resource to be created or updated.
    - **PATCH** performs a partial update of a resource. The request body specifies the set of changes to apply to the resource.
    - **DELETE** removes the resource at the specified URI.
    ![Pasted image 20230729223752](attachments/Pasted%20image%2020230729223752.png)
    
- **Conform to HTTP semantics:** sử dụng đúng các header và status code
    
- **Filter and paginate data:**
    
    - sử dụng query strings và cung cấp các link dẫn tới page tiếp theo trong response body
    - áp dụng pagination khi số lượng object trả về lớn
- **Capture exceptions and return a meaningful response to clients:**
    
    - sử dụng đúng các status code và có thể kèm với message để mô tả về nguyên nhân lỗi
    - phân biệt các lỗi client-side (4xx) và server-side (5xx)
- **Caching data:** nên sử dụng response cache để giảm tải cho server và tăng tốc độ response
    
- **Versioning API:** để hạn chế breaking changes gây ảnh hưởng tới phía client.

## [ASP.NET](http://ASP.NET) Web API

- Gồm controller-based APIs và minimal APIs
    
- Controller-based web API gồm các controller kế thừa ControllerBase, cung cấp nhiều properties và methods hỗ trợ việc xử lí các HTTP requests
    
- [Microsoft.AspNetCore.Mvc](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.mvc): cung cấp các attribute để config controller và action
    
    - [Route]: URL pattern cho controller và action
    - [HttpGet], [HttpPost]… : xác định HTTP methods của action
    - [ProducesResponseType] : chỉ rõ kiểu mà action đó trả về
    - [Consumes]: chỉ rõ kiểu dữ liệu
- [ApiController] attribute:
    
    - **Attribute routing requirement**
        
    - **Automatic HTTP 400 responses:** tự động gọi model validation và trả về 400 response nếu có lỗi (dùng [ModelStateInvalidFilter](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.mvc.infrastructure.modelstateinvalidfilter)). Không cần phải gọi đoạn code sau:
        
        ```csharp
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        ```
        
    - **Binding source parameter inference:** tự ngầm định nơi tìm các tham số được truyền vào các action
        
        - [FromServices]: lấy tham số từ kiểu đã được đăng ký trong DI container
        - [FromBody]: các complex type parameter chưa dky trong DI container
        - [FromForm]: từ các tham số kiểu IFormFile và IFormFileCollection
        - [FromRoute]: khi tên của action parameter trùng với tên parameter trong route template
        - [FromQuery]: cho các kiểu khác
    - **Multipart/form-data request inference:** những action có parameter là IFromFile và IFormFileCollection thì được ngầm hiểu là có content type là `multipart/form-data`
        
    - **Problem details for error status codes:** tự động chuyển những error result thành result theo kiểu `ProblemDetails` (RFC 7807)
        ![Pasted image 20230729223915](attachments/Pasted%20image%2020230729223915.png)
        
- Action return type
    
    - Specific type: khi action chỉ trả về 1 kiểu dữ liệu
        
        ```csharp
        public Product GetById_IActionResult(int id)
        {
            var product = _productContext.Products.Find(id);
            return product;
        }
        ```
        
    - IActionResult: khi action có thể trả về nhiều `ActionResult` có kiểu trả về khác nhau
        
        ```csharp
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Product))]
        public IActionResult GetById_IActionResult(int id)
        {
            var product = _productContext.Products.Find(id);
            return product == null ? NotFound() : Ok(product);
        }
        ```
        
    - `ActionResult<T>`: Cho phép trả về các `ActionResult` hoặc specific type (implicit cast). Không cần phải ghi rõ kiểu nếu sử dụng `[ProducesResponseType()]`
        
        ```csharp
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<Product> GetById_ActionResult(int id)
        {
            var product = _productContext.Products.Find(id);
            return product == null ? NotFound() : product;
        }
        ```