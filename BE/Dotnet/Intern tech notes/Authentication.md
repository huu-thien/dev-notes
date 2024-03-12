---
tags: aspnet 
---
## Authentication

- Authentication is the process of determining a user's identity
    
- 1 or more _authentication handlers_ registered in authentication service, and then used by *authentication middleware* or in endpoints (sign in, logout, …)
    
- The registered authentication handlers and their configuration options are called "schemes”.
    
- Authentication handlers do authentication-related actions:
    - Authenticating a user
    - Responding when an unauthenticated user tries to access a restricted resource
- Registers authentication services (`IAuthenticationService`) and handlers
    
    ```csharp
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme,
            options => builder.Configuration.Bind("JwtSettings", options))
        .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
            options => builder.Configuration.Bind("CookieSettings", options));
    ```
    
    - register schemes with `AddJwtBearer` and `AddCookie` after `AddAuthentication`
    - specify default scheme in `AddAuthentication`
- AuthenticationService & AuthenticationHandler
    
    - `AuthenticationService` implements `IAuthenticationService` :
        
        - [AuthenticationAsync](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authentication.iauthenticationservice.authenticateasync?view=aspnetcore-7.0#microsoft-aspnetcore-authentication-iauthenticationservice-authenticateasync(microsoft-aspnetcore-http-httpcontext-system-string)): Authenticate for the specified authentication scheme
        - [ChallengeAsync](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authentication.iauthenticationservice.challengeasync?view=aspnetcore-7.0#microsoft-aspnetcore-authentication-iauthenticationservice-challengeasync(microsoft-aspnetcore-http-httpcontext-system-string-microsoft-aspnetcore-authentication-authenticationproperties)): Challenge the specified authentication scheme when an unauthenticated user requests an endpoint that requires authentication
        - [ForbidAsync](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authentication.iauthenticationservice.forbidasync?view=aspnetcore-7.0#microsoft-aspnetcore-authentication-iauthenticationservice-forbidasync(microsoft-aspnetcore-http-httpcontext-system-string-microsoft-aspnetcore-authentication-authenticationproperties)): Forbid is used when an authenticated user attempts to access a resource they are not permitted to access.
        - [SignInAsync](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authentication.iauthenticationservice.signinasync?view=aspnetcore-7.0#microsoft-aspnetcore-authentication-iauthenticationservice-signinasync(microsoft-aspnetcore-http-httpcontext-system-string-system-security-claims-claimsprincipal-microsoft-aspnetcore-authentication-authenticationproperties)): Sign a _principal_ in for the specified authentication scheme
        - [SignOutAsync](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authentication.iauthenticationservice.signoutasync?view=aspnetcore-7.0#microsoft-aspnetcore-authentication-iauthenticationservice-signoutasync(microsoft-aspnetcore-http-httpcontext-system-string-microsoft-aspnetcore-authentication-authenticationproperties)): Sign out the specified authentication scheme
    - When calling these methods with an `IAuthenticationService` instance, the method from the specified scheme will be called, else the one from the default scheme will be used.
        
        ```csharp
        public virtual async Task<AuthenticateResult> **AuthenticateAsync**(HttpContext context, string? scheme)
            {
                if (scheme == null)
                {
                    **var defaultScheme = await Schemes.GetDefaultAuthenticateSchemeAsync();**
                    **scheme = defaultScheme?.Name;**
                    if (scheme == null)
                    {
                        throw new InvalidOperationException($"No authenticationScheme was specified, and there was no DefaultAuthenticateScheme found. The default schemes can be set using either AddAuthentication(string defaultScheme) or AddAuthentication(Action<AuthenticationOptions> configureOptions).");
                    }
                }
        
                **var handler = await Handlers.GetHandlerAsync(context, scheme);**
                if (handler == null)
                {
                    throw await CreateMissingHandlerException(scheme);
                }
        
                // Handlers should not return null, but we'll be tolerant of null values for legacy reasons.
                **var result = (await handler.AuthenticateAsync())** ?? AuthenticateResult.NoResult();
        ```
        
    - Usually, authentication methods is called through HttpContext (in middleware or somewhere else) by extension methods
        
        ```csharp
        public static Task<AuthenticateResult> AuthenticateAsync(this HttpContext context, string? scheme) =>
                GetAuthenticationService(context).AuthenticateAsync(context, scheme);
        ```
        
- `UseAuthentication` middleware
    
    - call `HttpContext.AuthenticateAsync` to authenticate request
    - must be placed after `UseRouting` in request pipeline

## **Claims-based identity**

- **Authentication is responsible for providing the [ClaimsPrincipal](https://learn.microsoft.com/en-us/dotnet/api/system.security.claims.claimsprincipal) for _authorization_** to make permission decisions against
    
- `Claim`: A claim is simply a piece of information about a subject. A claim does not dictate what a subject can, or cannot do
    
- `ClaimsIdentity`: Claims representing the same subject can be grouped together and placed in a `ClaimsIdentity`
    
    ```csharp
    public class ClaimsIdentity 
    {
      public string Name { get; }
      public IEnumerable<Claim> Claims { get; }
      public string AuthenticationType { get; }
      public bool IsAuthenticated { get; }
      // some properties have been omitted.
    }
    ```
    
- `ClaimPrincipals` : exposes a collection of identities.
    
    ```csharp
    public class ClaimsPrincipal 
    {
      public IEnumerable<Claim> Claims { get; }
      public IEnumerable<ClaimsIdentity> { get; }
      public ClaimsIdentity Identity { get; }
      // some properties have been omitted.
    }
    ```
    
- When working within an API controller in [ASP.NET](http://ASP.NET) we can access the current principal via the `User` property
    ![Pasted image 20230729224843](attachments/Pasted%20image%2020230729224843.png)

## Token-based & cookie-based authentication
![Pasted image 20230729224900](attachments/Pasted%20image%2020230729224900.png)

## Json web token
![Pasted image 20230729224912](attachments/Pasted%20image%2020230729224912.png)

- **Header**: Consists of two parts:
    - The signing algorithm that’s being used.
    - The type of token, mostly “JWT”.
- **Payload**: The payload contains the claims or the JSON object.
- **Signature**: A string that is generated via a cryptographic algorithm that can be used to verify the integrity of the JSON payload.

## Jwt authentication with custom authentication handler

- appsettings.json
    
    ```json
    "Jwt": {
        "Issuer": "<https://localhost:5000>",
        "Audience": "<https://localhost:5000>",
        "Key": "VeryVerySecretKey"
      }
    ```
    
    - Issuer: indicate where the JWT came from, might be set to the URL of identity server…
    - Audience: identifies the recipients that the JWT is intended for, ie: address of application or service
- Create a login endpoint that generates a token
    
    ```csharp
    [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            if (loginDto.userName == "admin" && loginDto.password == "admin")
            {
                var token = GenerateToken(loginDto.userName);
                return Ok(token);
            }
            return Unauthorized();
        }
    
        private string GenerateToken(string userName)
        {
            var header = new JwtHeader(new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
                SecurityAlgorithms.HmacSha256));
            
            var payload = new JwtPayload(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: // Lấy claim của user từ db
                new List<Claim>
                {
                    new(ClaimTypes.Name, userName),
                    new(ClaimTypes.Role, "Admin"),
                    new(ClaimTypes.DateOfBirth, "31/01/2002"),
                    new(ClaimTypes.Email, "pp311@yahoo.com"),
                    new(ClaimTypes.Gender, "Male")
                },
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(5));
    
            // Create and encode the JWT
            var token = new JwtSecurityToken(header, payload);
            var encodedToken = new JwtSecurityTokenHandler().WriteToken(token);
    
            return encodedToken;
        }
    ```
    
- Create a options class for our authentication handler
    
    ```csharp
    public class CustomJwtAuthenticationOptions : AuthenticationSchemeOptions
    {
    }
    ```
    
- Create the custom authentication handler
    
    ```csharp
    public class CustomJwtAuthenticationHandler : AuthenticationHandler<CustomJwtAuthenticationOptions>
    {
        private readonly IConfiguration _configuration;
        
    		// Removed constructor for brevity 
    
        protected async override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            // Check if Authorization header valid
            if (!Request.Headers.ContainsKey("Authorization"))
                return AuthenticateResult.Fail("Unauthorized");
            var authorizationHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authorizationHeader) || authorizationHeader.Length < 7)
                return AuthenticateResult.NoResult();
            if (!authorizationHeader.StartsWith("bearer", StringComparison.OrdinalIgnoreCase))
                return AuthenticateResult.Fail("Unauthorized");
     
    				// Validate the token
            var token = authorizationHeader.Substring("bearer".Length).Trim();
            
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidAudience = _configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]))
            };
     
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var principal = handler.ValidateToken(token, validationParameters, out var validatedToken);
                var ticket = new AuthenticationTicket(principal, Scheme.Name);
                return AuthenticateResult.Success(ticket);
            }
            catch (Exception ex)
            {
                return AuthenticateResult.Fail(ex.Message);
            }
        }
    }
    ```
    
    - For authentication with jwt, we can also create a handler from JwtBearerHandler base class
    - A custom authentication handler must implement a method named `HandleAuthenticateAsync` at the minimum.
    - This method return an `AuthenticateResult`. If the result is `Success`, it must contains an `AuthenticationTicket` indicates the requested user’s principal and the scheme just did the authentication
    - Then authorization handlers can use that principal for authorization actions
- Add the handler to AuthenticationService
    
    ```csharp
    builder.Services.AddAuthentication("CustomJwtAuthentication")
        .AddScheme<CustomJwtAuthenticationOptions, CustomJwtAuthenticationHandler>
            ("CustomJwtAuthentication", 
                options => {});-
    ```
    
- Test
    
    ```csharp
    [Authorize]
    [HttpGet("user-info")]
    public IActionResult GetUserInfo()
    {
        // User's type is ClaimsPrincipal
        var claimsIdentity = HttpContext.User.Identity as ClaimsIdentity;
        var claims = claimsIdentity?.Claims.Select(x => x.Value);
        return Ok(claims);
    }
    /*
    [
        "admin",
        "Admin",
        "31/01/2002",
        "pp311@yahoo.com",
        "Male",
        "1689824646",
        "1689824946",
        "<https://localhost:5000>",
        "<https://localhost:5000>"
    ]
    ```
    

## [ASP.NET](http://ASP.NET) Core Identity

- Manages users, passwords, profile data, roles, claims, tokens, email confirmation, and more
    
- Users can create an account with the login information stored in Identity or they can use an external login provider (Facebook, Google, Microsoft…)
![Pasted image 20230729224936](attachments/Pasted%20image%2020230729224936.png)
    
![Pasted image 20230729224951](attachments/Pasted%20image%2020230729224951.png)

- Create entity with custom data from Identity’s entity:
    
    ```csharp
    public class User : IdentityUser<int>
    {
        public string Name { get; set; } = null!;
    }
    ```
    
- When using Identity with support for roles, an [IdentityDbContext](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.identity.entityframeworkcore.identitydbcontext) class should be used
    
    ```csharp
    public class CRMDbContext : IdentityDbContext<User, IdentityRole<int>, int> {...}
    ```
    
- Add Identity to Services with [configurations](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-configuration?view=aspnetcore-7.0):
    
    ```csharp
    public static void ConfigureIdentity(this IServiceCollection services)
    {
        services.AddIdentity<User, IdentityRole<int>>(options =>
            {
                options.Password.RequiredLength = 8;
                options.Password.RequireDigit = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireDigit = true;
                options.Password.RequireNonAlphanumeric = true;
                
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<CRMDbContext>()
            .AddDefaultTokenProviders();
    }
    ```
    
- [ASP.NET](http://ASP.NET) Core Identity architecture:
    ![Pasted image 20230729225010](attachments/Pasted%20image%2020230729225010.png)
    
    - _Managers_ are high-level classes which an app developer uses to perform operations, such as creating an Identity user. Managers are decoupled from stores.
    - _Stores_ are lower-level classes that specify how entities, such as users and roles, are persisted. Stores follow the repository pattern and are _closely coupled_ with the persistence mechanism
    - By default, the [ASP.NET](http://asp.net/) Core Identity system stores user information in a SQL Server database using Entity Framework Core
    - To create a custom storage provider, create the data source, the data access layer, and the store classes that interact with this data access layer → don't need to customize the managers or app code