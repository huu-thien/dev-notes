---
tags: aspnet 
---
- Internet Information Services (IIS) is a Microsoft web server that runs on Windows
- IIS uses various protocols for communication and data exchange, such as HTTP, SMTP, and FTP
- Benefits:
    - Built-in authentication, authorization, and access control features to strengthen security.
    - Application pools: An application pool has one or multiple applications managed by worker processes in IIS. A worker process handles requests specific to an application pool. → Ensure failure of an application in a particular pool doesn’t affect other pools.
    - Scalability and reliability

- Microsoft uses [ASP.NET](http://ASP.NET) Core Module (ANCM - a native IIS module) that plugs into the pipeline. Allowing [Asp.Net](http://Asp.Net) Core application to work with IIS
    - Hosting an app inside IIS worker process (w3wp.exe) → _in-process hosting model
    - Fowarding requests to a backend app running the Kestrel server → _out-of-process hosting model_

## In-process hosting

- Runs [ASP.NET](http://ASP.NET) Core app in the same process as its IIS worker process → improve performance
    ![Pasted image 20230729225427](attachments/Pasted%20image%2020230729225427.png)
    
    ```csharp
    <PropertyGroup>
      <AspNetCoreHostingModel>InProcess</AspNetCoreHostingModel>
    </PropertyGroup>
    ```
    
    General flow:
    
    1. A request arrives 
    2. The driver routes the request to IIS on configured port (80, 443…)
    3. ANCM receives the request and passes to IISHttpServer
    4. The request is sent to [ASP.NET](http://ASP.NET) Core middleware pipeline. The pipeline handles the request and passes it as an HttpContext to app’s logic
    5. IISHttpServer receives app’s response, IIS send the reponse to the client

## Out-of-process hosting

- The ANCM handles process management, it starts the process for the app when first request arrives and restarts the app if it shuts down or crashes
    ![Pasted image 20230729225439](attachments/Pasted%20image%2020230729225439.png)
    
    ```csharp
    <PropertyGroup>
      <AspNetCoreHostingModel>OutOfProcess</AspNetCoreHostingModel>
    </PropertyGroup>
    ```
    
- Kestrel server is used instead of IIS HTTP Server (`IISHttpServer`)

## Other ways to host ASP.NET Core application 
 - Kestrel self-hosting: The Kestrel web server runs without requiring any other external web server such as IIS or HTTP.sys
	 ![Pasted image 20230730211338](attachments/Pasted%20image%2020230730211338.png)
- Use with other reverse proxy server:
	![Pasted image 20230730211545](attachments/Pasted%20image%2020230730211545.png)
 - If ASP.NET Core apps are run on Windows, HTTP.sys is an alternative to Kestrel. Kestrel is recommended over HTTP.sys unless the app requires features not available in Kestrel
	 ![Pasted image 20230730211744](attachments/Pasted%20image%2020230730211744.png)
  