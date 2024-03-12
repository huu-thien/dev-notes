---
tags: architecture
---
## What is DDD
- Domain-Driven Design (DDD) is an approach to software development that centers the development for a specific domain. It also helps developer to build a flexible, modular and maintainable code base
### Advantages
- **Loose coupling**: parts of the system interact with each other through definitions and principles (interfaces, base classes...) in the Core layer.
- **Flexibility**: Allow to enhance and adapt new functional requirements more flexibly without considerable impact on the overall system
- **Testability**: From interfaces in the Core, testing with mock data in a separate environment in allowed

### Disadvantages
- **Domain expertise**: Need domain expert(s) to define all of the process, procedures and terminology of that domain
- **Low interactions**: The loose connection among different parts requires the team to communicate and exchange regularly
- **Development costs**: deal with isolation and encapsulation within the domain model -> more extended development and duration 

## Layers in DDD
![](attachments/Domain%20driven%20design-160820232157.png)

- Each layer is a project: Application layer is Ordering.API, Domain layer is Ordering.Domain and the Infrastructure layer is Ordering.Infrastructure


- **Domain**: A place to define logic concepts, principles, patterns and behaviors of data: domain validation, calculations,...
	- *Entities*: construction, model validation
	- *Value objects*: The value of an object related to Domain entities. Have no identity and immutable
	- *Aggregate*: The rules, computation, logic of domains and related objects when updating the domain.
	 >"an aggregate is a cluster of domain objects that can be treated as a single unit" - Martin Fowler
		- An aggregate root is responsible for ensuring the integrity of the aggregate as a whole. Any references from outside the aggregate should only go to the aggregate root
		  ![](attachments/Domain%20driven%20development-090820231540.png)
		  ![](attachments/Domain%20driven%20development-090820231634.png)
	- *Interfaces*: Define business behaviors 
	- *Repository interfaces/Service base*: of generic repositories, domain repositories and services
	- *ILogger/Dtos/Exceptions*: Notifications and transformation are transferred to other services
 - **Application**: This layer does not contain business rules or knowledge, but only coordinates tasks and delegates work to collaborations of domain object
 - **Infrastructure**:  is how the data that is initially held in domain entities (in memory) is persisted in databases or another persistent store
	- *Repositories*: including GenericRepository and EntityRepository
	- *Data access*: Contexts and API connections link to databases
		- SQL: ADO.NET, EF, Dapper...
		- In-memory stores
		- Caching, NoSQL
		- Data seeding
	- *Others*: Logging, Cryptography
 
![](attachments/Domain%20driven%20design-160820232210.png)

### Other concepts
- **Ubiquitous language**: a shared language spoken by all parties of the project: developers, stakeholders, managers, and business analysts
![](attachments/Domain%20driven%20development-090820231533.png)

- **Bounded context**: the boundary within a domain where a particular domain model applies 
 ![](attachments/Domain%20driven%20development-090820231531.png)

