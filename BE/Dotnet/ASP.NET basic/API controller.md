---
tags: aspnet 
---
### API controllers

- [Route(relativeURL)] : nếu relativeURL = [controller] thì sử dụng tên đứng trước Controller trong tên class
    
- [ApiController]: enables REST-specific behavior for controllers
    
    - Attribute routing requirement [Route]
    - Automatic HTTP 400 responses: model validation errors automatically trigger an HTTP 400 response. [ASP.NET](http://ASP.NET) uses the [ModelStateInvalidFilter](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.mvc.infrastructure.modelstateinvalidfilter) action filter
    - Binding source parameter inference:
        - `[FromBody]` is inferred for complex type parameters not registered in the DI Container. An exception to the `[FromBody]` inference rule is any complex, built-in type with a special meaning, such as [IFormCollection](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.http.iformcollection) and [CancellationToken](https://docs.microsoft.com/en-us/dotnet/api/system.threading.cancellationtoken). The binding source inference code ignores those special types.
        - `[FromForm]` is inferred for action parameters of type [IFormFile](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.http.iformfile) and [IFormFileCollection](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.http.iformfilecollection). It's not inferred for any simple or user-defined types.
        - `[FromRoute]` is inferred for any action parameter name matching a parameter in the route template. When more than one route matches an action parameter, any route value is considered `[FromRoute]`.
        - `[FromQuery]` is inferred for any other action parameters.
        - `[FromBody]`isn't inferred for simple types such as `string`or `int`. Therefore, the `[FromBody]`attribute should be used
        - When an action has more than one parameter bound from the request body, an exception is thrown
    - Multipart/form-data request inference: The `multipart/form-data`  request content type is inferred for [IFormFile](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.http.iformfile) and [IFormFileCollection](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.http.iformfilecollection)
    - Problem details for error status codes: API controllers có [ApiController], action method có kiểu trả về `IActionResult` và trả về error SC thì sẽ tự động thêm đối tượng ProblemDetails vào response
- Action method return types
    
    - `IActionResult`: sử dụng nếu có thể trả về các kiểu khác nhau
    - `ActionResult<T>`: chỉ trả về một kiểu với các status code khác nhau
    - sử dụng [ProducesResponseType] để thể hiện kiểu trả về và status code
    
    ```csharp
    [HttpGet("{id}")]
    [ProducesResponseType(200, Type = typeof(Product))]
    [ProducesResponseType(404)]
    public IActionResult Get(string id)
    ```
    
- `ControllerBase` có các method để trả về các response
    
    - `Ok`: return 200 SC và resource (JSON, XML…), thường cho GET
    - `CreatedAtRoute`: return 201 SC và đường dẫn tới source mới, thường cho POST
    - `Accepted`: return 202 SC thể hiện request đang được xử lí, thường dùng cho POST, PUT, PATCH, DELETE
    - `NoContentResult`: return 204 SC và empty body, thường cho PUT, PATCH, DELETE
    - `BadRequest`: return 400 SC và message string (optional)
    - `NotFound`: return 404 SC và tự động thêm ProblemDetails
- Lấy data qua API
    
    - Program.cs của API
    
    ```csharp
    builder.WebHost.UseUrls("<https://localhost:5002/>");
    //add CORS
    ```
    
    - Program.cs của project
    
    ```csharp
    builder.Services.AddHttpClient(name: "Northwind.WebApi",
        configureClient: options =>
        {
            options.BaseAddress = new Uri("<https://localhost:5002/>");
            options.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue(
                    "application/json", 1.0));
        });
    ```
    
    ```csharp
    HttpClient client = clientFactory.CreateClient(
    name: "Northwind.WebApi");
    HttpRequestMessage request = new(
    method: HttpMethod.Get, requestUri: uri);
    HttpResponseMessage response = await client.SendAsync(request);
    IEnumerable<Customer>? model = await response.Content
    .ReadFromJsonAsync<IEnumerable<Customer>>();
    return View(model);
    ```