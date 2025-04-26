---
tags: aspnet 
---
1. Install [ASP.NET](http://asp.net/) Core Module (ANCM) from .NET core hosting bundle
2. Create IIS site:

- in IIS manager, Select **Add Website** from the Connections panel
![Pasted image 20230729225215](Pasted%20image%2020230729225215.png)

- Create a folder to contain the app's published folders and files. Provide a **Site name** and set the **Physical path** to the app's deployment folder
![Pasted image 20230729225228](Pasted%20image%2020230729225228.png)

3. Publish the application:

```docker
dotnet publish --configuration Release
```

- Or using Visual Studio to publish:
![Pasted image 20230729225240](Pasted%20image%2020230729225240.png)

4. Copy the published app folder to the site folder
![Pasted image 20230729225254](Pasted%20image%2020230729225254.png)

5. Browse the application website
![Pasted image 20230729225307](Pasted%20image%2020230729225307.png)