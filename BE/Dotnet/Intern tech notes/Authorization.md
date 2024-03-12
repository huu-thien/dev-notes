---
tags: aspnet 
---
- Authorization: The process of determining if a given user has the necessary attributes/permissions to access a given resource
- Authorization is expressed in requirements, and handlers evaluate a user's claims against requirements

## AuthorizeAttribute

- Can apply on controllers or actions to marks that action as requiring an _authenticated_ user
    
- We can use the `AllowAnonymousAttribute` to ignore an `AuthorizeAttribute`
    
    ```csharp
    [Authorize]
    public class AccountController: Controller
    {
        public IActionResult Manage()
        {
            return View();
        }
    
        [AllowAnonymous]
        public IActionResult Logout()
        {
            return View();
        }
    }
    ```
    
- Globally require all users to be authenticated
    
    ```csharp
    builder.Services.AddAuthorization(options =>
    {
        options.FallbackPolicy = new AuthorizationPolicyBuilder()
            .RequireAuthenticatedUser()
            .Build();
    });
    ```
    

## **Role-based authorization**

```csharp
[Authorize(Roles = "Administrator")]
public class AdministrationController : Controller
{
    public IActionResult Index() =>
        Content("Administrator");
}
```

- Multiple roles can be specified as a comma separated list

```csharp
[Authorize(Roles = "HRManager,Finance")]
public class SalaryController : Controller
{
    public IActionResult Payslip() =>
                    Content("HRManager || Finance");
}
```

- When multiple attributes are applied, an accessing user must be a member of _**all**_ the roles specified

```csharp
[Authorize(Roles = "PowerUser")]
[Authorize(Roles = "ControlPanelUser")]
public class ControlPanelController : Controller
{
    public IActionResult Index() =>
        Content("PowerUser && ControlPanelUser");
}
```

- Cons: When changes occur in roles logic, it requires expensive refactor
    
- Solution: **Policy based role checks**
    
    ```csharp
    builder.Services.AddAuthorization(options =>
    {
        options.AddPolicy("RequireAdministratorRole",
             policy => policy.RequireRole("Administrator"));
    });
    
    [Authorize(Policy = "RequireAdministratorRole")]
    public IActionResult Shutdown()
    {
        return View();
    }
    ```
    
- Specify multiple allowed roles
    
    ```csharp
    builder.Services.AddAuthorization(options =>
    {
        options.AddPolicy("ElevatedRights", policy =>
              policy.RequireRole("Administrator", "PowerUser", "BackupAdministrator"));
    });
    ```
    
- Specify a user must have all the specified roles, use fluent syntax
    
    ```csharp
    builder.Services.AddAuthorization(options =>
    {
        options.AddPolicy("ElevatedRights", policy =>
              policy.RequireRole("Administrator")
    								.RequireRole("User"));
    });
    ```
    
- The roles of a `ClaimsPrincipal` are actually just _claims_ create with a type of `ClaimsIdentity.RoleClaimType` → use claims-based authorization for more additional value to checks
    

## Claims-based authorization

```csharp
builder.Services.AddAuthorization(options =>
{
   options.AddPolicy("EmployeeOnly", policy => policy.RequireClaim("EmployeeNumber"));
});

[Authorize(Policy = "EmployeeOnly")]
public IActionResult VacationBalance()
{
    return View();
}
```

## Policy-based authorization

- Underneath the covers, [role-based authorization](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/roles?view=aspnetcore-7.0) and [claims-based authorization](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/claims?view=aspnetcore-7.0) use a requirement, a requirement handler, and a preconfigured policy.
    
- More complex authorization check
    
    ```csharp
    options.AddPolicy(AuthPolicy.AdminOrOwner, policy => policy.RequireAssertion(context =>
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        var requestUserId = new HttpContextAccessor().HttpContext?.Request.RouteValues["userId"]?.ToString();
        
        return context.User.IsInRole(AppRole.Admin) || userId == requestUserId; 
    }));
    ```
    
- Policy, Requirement and Handler
    
    - A resource may be protected by one or more **Policies**. **All** policies must be satisfied in order for access to the resource to be granted.
    - Each **Policy** has one or more **Requirements**. **All** requirements must be satisfied on a policy for the overall policy to be satisfied.
    - Each **Requirement** has one or more **Handlers**. A requirement is satisfied, if **any** of them return a `Success` result, and **none** of them return an explicit `Fail` result

```csharp
public interface IAuthorizationHandler
{
    /// Makes a decision if authorization is allowed.
    Task HandleAsync(AuthorizationHandlerContext context);
}
```

- There is a [AuthorizationHandlerContext](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authorization.authorizationhandlercontext) class to mark whether requirements have been met
    
    - If a handler calls `context.Succeed(requirement)`, that requirement is satisfied
    - If no calls to `context.Succeed(requirement)` or a handler calls `context.Fail(requirement)`, that requirement is not satisfied, hence the whole policy is not satisfied
- Default implementation of the authorization service:
    
    ```csharp
    public async Task<AuthorizationResult> AuthorizeAsync(ClaimsPrincipal user, 
                 object resource, IEnumerable<IAuthorizationRequirement> requirements)
    {
        // Create a tracking context from the authorization inputs.
        var authContext = _contextFactory.CreateContext(requirements, user, resource);
    
        // By default this returns an IEnumerable<IAuthorizationHandlers> from DI.
        var handlers = await _handlers.GetHandlersAsync(authContext);
    
        // Invoke all handlers.
        foreach (var handler in handlers)
        {
            await handler.HandleAsync(authContext);
        }
    
        // Check the context, by default success is when all requirements have been met.
        return _evaluator.Evaluate(authContext);
    }
    ```
    
- The requirement
    
    - A requirement in [ASP.NET](http://ASP.NET) Core is a simple class that implements the empty marker interface `IAuthorizationRequirement`
        
        ```csharp
        public class AdminOrOwnerRequirement : IAuthorizationRequirement
        {
        }
        ```
        
- The authorization handlers
    
    - where all the work of authorising a requirement takes place
        
    - inherit from `AuthorizationHandler<TRequirement>` for handling a specific requirement, and implement `HandleRequirementAsync()` method
        
    - Inherit from `IAuthorizationHandler` to handle more than one type of requirement
        
        ```csharp
        public class AdminOrOwnerHandler : AuthorizationHandler<AdminOrOwnerRequirement>
        {
            protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
                                                           AdminOrOwnerRequirement requirement)
            {
                var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
                var requestUserId = new HttpContextAccessor().HttpContext?.Request.RouteValues["userId"]?.ToString();
        
                if (context.User.IsInRole(AppRole.Admin) || userId == requestUserId)
                    context.Succeed(requirement);
                else 
                    context.Fail();
        
                return Task.CompletedTask;
            }
        }
        ```
        
- Add the handler to service provider:
    
    ```csharp
    services.AddSingleton<IAuthorizationHandler, AdminOrOwnerHandler>();
    ```
    
- Add policy:
    
    ```csharp
    options.AddPolicy("AdminOrOwnerHandler", policy => 
                    policy.AddRequirements(new AdminOrOwnerRequirement());
    ```