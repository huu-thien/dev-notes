---
tags: architecture
---
## What is 3-tier architecture?
- 3-tier architecture divides application into 3 tier and deploys them into different physical machines:
		- Presentation tier: User interface to display information and collect data from users. Can be run on a web browser or desktop/mobile app
		- Application tier: Process information, apply business logic and rules; access or modify data in the data layer 
		- Data tier: stores and manages data using SQL Server, MySQL, MongoDB...
  
 ![](Pasted%20image%2020230802092808.png)
 
### Tiers and layers

| Layer                                                 | Tier                                  |     |
| ----------------------------------------------------- | ------------------------------------- | --- |
| logical separation of code                            | physical separation of code           |     |
| in different projects (.dll code) in the same machine | deployed on different machines        |     |
| communicates by passing object between layers         | send data over the network            |     |
| improve **readability** and **reusability**           | advantage of layers + **scalability** |     |

- A tier can contains multiple layers:
	- Presentation tier: HTML/CSS/JS, Flutter code...
	- Application tier (Web server): 
		- API layer: contains controllers to handle HTTP requests
		- Business logic layer: Contains business logic
		- Data access layer: providing simplified access to data in database 
	- Data tier: MSSQL Server
  
![](3%20tier%20architecture-020820231018.png)

![](3%20tier%20architecture-220820232016.png)


