---
tags: architecture
---
## The Domain Entity pattern
> “an object primarily defined by its identity is called an Entity.”
- An entity’s identity can cross multiple microservices or Bounded Contexts
- Domain entities must implement behavior in addition to implementing data attributes
- The entity’s methods take care of the invariants and rules instead of having those rules spread across the application layer

![](attachments/Designing%20a%20DDD-oriented%20microservice-160820232225.png)

- If microservice or Bounded Context is very simple, the anemic domain model with just data properties might be good enough, and it might not be worth implementing more complex DDD patterns

## The Value Object pattern
> “Many objects do not have conceptual identity. These objects describe certain characteristics of a thing.”
- Something that is an entity in a microservice might not be an entity in another microservice
- A value object can reference other entities
- There are two main characteristics for value objects:
	- They have no identity
	- They are immutable
- We can have a value object base class that has basic utility methods like equality based on the comparison between attributes

```csharp
public class Address : ValueObject
{
    public String Street { get; private set; }
    public String City { get; private set; }

    public Address() { }

    public Address(string street, string city)
    {
        Street = street;
        City = city;
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Street;
        yield return City;
    }
}
```
- value objects are usually serialized and deserialized to go through message queues, and being read-only stops the deserializer from assigning values -> just leave them as private set, which is read-only enough to be practical

#### Persist value objects in the database
##### Background and older approaches using EF Core 1.1
- Hide its ID (by using shadow property) to make clear that the identity of a value object is not important in the domain model

```csharp
void ConfigureAddress(EntityTypeBuilder<Address> addressConfiguration)
{
    addressConfiguration.ToTable("address", DEFAULT_SCHEMA);

    addressConfiguration.Property<int>("Id")  // Id is a shadow property
        .IsRequired();
    addressConfiguration.HasKey("Id");   // Id is a shadow property
}
```

##### Persist value objects as owned entity types in EF Core 2.0 and later
```csharp
public void Configure(EntityTypeBuilder<Order> orderConfiguration)
{
    orderConfiguration.ToTable("orders", OrderingContext.DEFAULT_SCHEMA);
    orderConfiguration.HasKey(o => o.Id);
    orderConfiguration.Ignore(b => b.DomainEvents);
    orderConfiguration.Property(o => o.Id)
        .ForSqlServerUseSequenceHiLo("orderseq", OrderingContext.DEFAULT_SCHEMA);

    //Address value object persisted as owned entity in EF Core 2.0
    orderConfiguration.OwnsOne(o => o.Address);

    orderConfiguration.Property<DateTime>("OrderDate").IsRequired();

    //...Additional validations, constraints and code...
    //...
}
```
- the internal properties of `Address` will appear in the `Orders` table with the names `Address_Street`, `Address_City`
- We can append the Property().HasColumnName() fluent method to rename those columns
```csharp
orderConfiguration.OwnsOne(p => p.Address)
                            .Property(p=>p.Street).HasColumnName("ShippingStreet");

orderConfiguration.OwnsOne(p => p.Address)
                            .Property(p=>p.City).HasColumnName("ShippingCity");
```
- Eager loading is performed automatically on owned types
- No support for optional (nullable) owned types
## The Aggregate pattern
- describes a cluster or group of entities and behaviors that can be treated as a cohesive unit
- We usually define an aggregate based on the transactions. We must start with a domain concept and think about the entities that are used in the most common transactions related to that concept

### The Aggregate Root or Root Entity pattern
- An aggregate is composed of at least one entity: the aggregate root
- It can have multiple child entities and value objects
- Is to ensure the consistency of the aggregate. We should make changes to entities within the aggregate only via the aggregate root
- Having an aggregate root means that most of the code related to consistency and business rules of the aggregate’s entities should be implemented as methods in the aggregate root class

![](attachments/Designing%20a%20DDD-oriented%20microservice-160820232233.png)

- it is a good practice in a DDD domain model to disallow direct navigation between aggregates and only having the foreign key (FK) field

```csharp
public class Order : Entity, IAggregateRoot
{
    private DateTime _orderDate;
    public Address Address { get; private set; }
    private int? _buyerId; // FK pointing to a different aggregate root
    public OrderStatus OrderStatus { get; private set; }
    private readonly List<OrderItem> _orderItems;
    public IReadOnlyCollection<OrderItem> OrderItems => _orderItems;
    // ... Additional code
}
```

- At no point should logic involving `OrderItem`s be exposed outside of an instance of `Order`
- Private parameterless constructor to prevent creating Entity directly, use Factory method or parameter constructor instead to apply validation
	- We still need parameterless constructor for EFCore to materialize object
- We use `private set` and `IReadOnlyCollection` for properties for the same reason

## Domain events
- If executing a command related to one aggregate instance requires additional domain rules to be run on one or more additional aggregates, you should design and implement those side effects to be triggered by domain events

![](attachments/Designing%20a%20DDD-oriented%20microservice-160820232330.png)

- The domain events and their side effects should occur almost immediately, usually in-process, and within the same domain. Thus, domain events could be synchronous or asynchronous
- Just like a database transaction, either all the operations related to a
domain event finish successfully or none of them do
- Handling the domain events is an application concern, because you’ll use infrastructure objects like repositories or an application API for the microservice’s behavior
- A command should be processed only once. A domain event could be processed zero or n times
- There can be several handlers for the same domain event in the Application Layer 

![](attachments/Designing%20a%20DDD-oriented%20microservice-160820232335.png)

### Domain events versus integration events
- Domain and integration events are the same thing: notifications about something that just happened
- Integration events is to propagate committed transactions and updates to additional subsystems, whether they are other microservices, Bounded Contexts or even external applications

### Implement domain events
```csharp
public class OrderStartedDomainEvent : INotification
{
    public string UserId { get; }
    public string UserName { get; }
    public int CardTypeId { get; }
    public string CardNumber { get; }
    public string CardSecurityNumber { get; }
    public string CardHolderName { get; }
    public DateTime CardExpiration { get; }
    public Order Order { get; }

    public OrderStartedDomainEvent(Order order, string userId, string userName,
                                   int cardTypeId, string cardNumber,
                                   string cardSecurityNumber, string cardHolderName,
                                   DateTime cardExpiration)
    {
        Order = order;
        UserId = userId;
        UserName = userName;
        CardTypeId = cardTypeId;
        CardNumber = cardNumber;
        CardSecurityNumber = cardSecurityNumber;
        CardHolderName = cardHolderName;
        CardExpiration = cardExpiration;
    }
}
```
- Class name of the event should be represented as a past-tense verb
- An event is something that happened in the past, it shouldn't change -> immutable class
- Instead of dispatching immediately, a better approach is to add the domain events to a collection and then to dispatch them right before/right after committing the transaction
```csharp
public abstract class Entity
{
     private List<INotification> _domainEvents;
     public List<INotification> DomainEvents => _domainEvents;

     public void AddDomainEvent(INotification eventItem)
     {
         _domainEvents = _domainEvents ?? new List<INotification>();
         _domainEvents.Add(eventItem);
     }

     public void RemoveDomainEvent(INotification eventItem)
     {
         _domainEvents?.Remove(eventItem);
     }
}
```
- Deciding to send the domain events right before or right after committing the transaction is important, since it determines whether you will include the side effects as part of the same transaction or in different transactions
```csharp
public class OrderingContext : DbContext, IUnitOfWork
{
    public async Task<bool> SaveEntitiesAsync()
    {
        // Choices:
        // A) Right BEFORE committing data (EF SaveChanges) into the DB. This makes
        // a single transaction including side effects from the domain event
        // handlers that are using the same DbContext with Scope lifetime
        // B) Right AFTER committing data (EF SaveChanges) into the DB. This makes
        // multiple transactions. You will need to handle eventual consistency and
        // compensatory actions in case of failures.
        await _mediator.DispatchDomainEventsAsync(this);

        // After this line runs, all the changes (from the Command Handler and Domain
        // event handlers) performed through the DbContext will be committed
        var result = await base.SaveChangesAsync();
    }
}
```
- Raising the events before committing, so you use a single transaction—is the simplest approach when using EF Core and a relational database
- For better scalability and less impact on database locks, use eventual consistency between aggregates within the same domain
- Eventual consistency requires more complex code in order to detect possible inconsistencies across aggregates and the need to implement compensatory actions
- A way to allow compensatory actions would be to store the domain events in additional database tables. Then have a batch process that detects inconsistencies and runs compensatory actions by comparing the list of events with the current state of the aggregates

### The domain event dispatcher: mapping from events to event handlers
![](attachments/Designing%20a%20DDD-oriented%20microservice-160820232354.png)

- Uses MediatR to propagate domain events synchronously across aggregates
- We could also use some AMQP implementation like RabbitMQ or Azure Service Bus to propagate domain events asynchronously, using eventual consistency -> have to consider the need for compensatory actions in case of failures

## Command and Query Responsibility Segregation (CQRS)
- Is an architectural pattern that separates the models for reading and writing data

![](attachments/Designing%20a%20DDD-oriented%20microservice-170820230004.png)

- This approach keeps the queries independent from restrictions/constraints coming from DDD patterns that only make sense for transactions and updates
- **Do not try to apply the same architectural patterns as CQRS or DDD everywhere**

#### Implement reads/queries in a CQRS microservice
![](attachments/Designing%20a%20DDD-oriented%20microservice-170820230008.png)

- The returned type can be specifically made for the clients, based on the data returned by the queries -> ViewModels

#### Implement the Command and Command Handler patterns
![](attachments/Designing%20a%20DDD-oriented%20microservice-170820231611.png)

##### The command class
- A command is a request for the system to perform an action that changes the state of the system
- Named with a verb in the imperative mood (for example, “create” or “update”)
- A command is send to a single receiver/handler
- A command is a special kind of DTO, based on exactly the information that is needed for processing the command
- Commands are simply data structures that contain read-only data, and no behavior

##### The command handler class
- All the domain logic should be contained in the domain classes—within the aggregate roots, child entities, or domain services, but not within the command handler, which is a class from the application layer
- A command handler receives a command and obtains a result from the aggregate that is used. The result should be either successful execution or an exception
- If multiple aggregates should be impacted by the reception of a single command -> use domain events to propagate states or actions across multiple aggregates
<br>

- *How to invoke a command handler*:
	- Manually call it from each related controller -> too coupled
	- Through an in-memory Mediator pattern artifact
	- With an asynchronous message queue, in between controllers and handlers

#### Use the Mediator pattern (in-memory) in the command pipeline
![](attachments/Designing%20a%20DDD-oriented%20microservice-170820231628.png)

- Mediator pattern makes sense in enterprise applications, when the processing requests can get complicated
- Easier to add an open number of cross-cutting concerns like logging, validations, audit, and security using mediator pipeline

#### Use message queues (out-of-proc) in the command’s pipeline
![](attachments/Designing%20a%20DDD-oriented%20microservice-170820231632.png)

- Should be used if you need to have improved scalability and performance based on asynchronous messaging
- Asynchronous commands greatly increase the complexity of a system, because there is no simple way to indicate failures
- Not recommended other than when scaling requirements are needed or in special cases when communicating the internal microservices through messaging
 


