---
tags: architecture
---
## What is microservice
- An approach to building a server application as a set of small services. Each service runs in its own process and communicates with other processes using protocols such as HTTP/HTTPS, WebSockets, or AMQP
- Each microservice implements a specific domain or business capability within a certain *context boundary*, and each must be developed autonomously and be deployable independently
- Each microservice should own its related domain data model and domain logic (could be based on different technologies)
![](attachments/Microservice%20architecture-100820231558%201.png)

## Monolithic vs microservice
![](attachments/Microservice%20architecture-100820231603.png)

### Monolithic
- Is an architectural pattern of **designing** and **developing** a **complete application** as a **single unit** -> **Easy development**
- **Performance**: In a centralized code base and repository
- **Easy debugging**: With all code located in one place, it’s easier to follow a request and find an issue
------
- **Slower development speed**: A large, monolithic application makes development more complex and slower
- **Scalability**: Can’t scale individual components
- **Reliability**: If there’s an error in any module, it could affect the entire application’s availability
- **Lack of flexibility**: A monolith is constrained by the technologies already used in the monolith, making changes in framework or language often expensive and time-consuming
- **Deployment**: A small change to a monolithic application requires the redeployment of the entire monolith

### Microservice 
> Microservices are by no means a silver bullet, but they solve a number of problems for growing software and companies
- **Flexible scaling**: If a microservice reaches its load capacity, new instances of that service can be deployed
- **Independently deployable**: allow for fast and easy independent deployment of individual features
- **Technology flexibility**: allow teams the freedom to select the tools they desire
- **High reliability**: can deploy changes for a specific service without the threat of bringing down the entire application
------
- **Debugging challenges**: a single business process can run across multiple machines, further complicating debugging
- **Added organizational overhead**: need to add another level of collaboration to coordinate updates and interfaces

## Challenges for distributed data management
> **How to define the boundaries of each microservice?**
- The main goal should be to get to the most meaningful separation guided by domain knowledge. *The emphasis isn't on the size, but instead on business capabilities*
- Cohesion is a way to identify how to break apart or group together microservices
- We should design microservices based on the Bounded Context. A BC could be composed of several physical services, but not vice versa

> **How to create queries that retrieve data from several microservices?**
- **API Gateway**: 
	- For simple data aggregation from multiple microservices that own different databases
	- *Can be a choke point and can violate the principle of microservice autonomy*
	- can have multiple API Gateways focusing on a  business area of the system
-  **GraphQL Federation**: allows to define "subgraphs" from other services and compose them into an aggregate "supergraph" that acts as a standalone schema
- **CQRS with query/reads tables**: 
	- Generate a read-only table with the data that's owned by multiple microservices. The table has a format suited to the client app's needs
	- Also improves performance when compared with a complex join
-  **"Cold data" in central databases**: For complex reports and queries that might not require real-time data
 
> **How to achieve consistency across multiple microservices?**

![](attachments/Microservice%20architecture-110820231029.png)
- A good solution for this problem is to use eventual consistency between microservices articulated through event-driven communication and a publish-and-subscribe system

> **How to design communication across microservice boundaries?**

- If you create long chains of synchronous HTTP calls across microservices:
	- Blocking and low performance
	- Coupling microservices with HTTP. Ideally, they shouldn't "know" about the existence of other microservices
	- Failure in any one microservice -> the whole chain will fail
 - We should:
	- Minimize the use of chains of request/response communication across microservices
	- Use only asynchronous interaction for inter-microservice communication:
		- asynchronous message and event-based communication
		- (asynchronous) HTTP polling independently of the original HTTP request/response cycle

## API gateway
- A service that provides a single-entry point for certain groups of microservices
![](attachments/Microservice%20architecture-110820231907.png)

- It acts as a reverse proxy, routing requests from clients to services. It can also provide other cross-cutting features such as authentication, SSL termination, and cache
- The API Gateways should be segregated based on business boundaries and the client apps and not act as a single aggregator for all the internal microservices
- When splitting the API Gateway tier into multiple API Gateways, we can have a different facade for the needs of each client app
![](attachments/Microservice%20architecture-110820231912.png)

### Main features in the API Gateway pattern
- **Reverse proxy or gateway routing**: provides a single endpoint or URL for the client apps
- **Requests aggregation**: reduce chattiness between the client apps and the backend API
- **Cross-cutting concerns or gateway offloading**: simplifies the implementation of each microservice by consolidating cross-cutting concerns into one tier:
	- Authentication and authorization
	- Load balancing
	- IP allowlisting
	- Logging, tracing, correlation
	- Rate limiting and throttling
	- Response caching
### Drawbacks of the API Gateway pattern
- Creates an additional possible single point of failure
- If not scaled out properly, the API Gateway can become a bottleneck
- requires additional development cost and future maintenance if it includes custom logic and data aggregation

### Implementing API Gateway with Ocelot
```csharp
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

builder.Services.AddOcelot(builder.Configuration)
```

![](attachments/Microservice%20architecture-150820231342.png)

ocelot.json
```json
{
	"Routes": [
		{
			"DownstreamPathTemplate": "/api/product",
			"DownstreamScheme": "https",
			"DownstreamHostAndPorts": [
				{
				"Host": "localhost",
				"Port": 44337
				}
			],
			"UpstreamPathTemplate": "/gateway/product",
			"UpstreamHttpMethod": [ "POST", "PUT", "GET" ]
		}
	]
}
```

- **DownstreamPathTemplate** denotes the route of the actual endpoint in the Microservice.  
- **DownstreamScheme** is the scheme of the Microservice  
- **DownstreamHostAndPorts** defines the location of the Microservice
- **UpstreamPathTemplate** is the path at which the client will request the Ocelot API Gateway  
- **UpstreamHttpMethod** are the supported HTTP Methods to the API Gateway

#### Ocelot features
##### Rate limiting
```json
{
    "UpstreamPathTemplate": "/gateway/articles",
    "UpstreamHttpMethod": ["Get"],
    "DownstreamPathTemplate": "/api/articles",
    "DownstreamScheme": "https",
    "DownstreamHostAndPorts": [{
        "Host": "localhost",
        "Port": 5001
    }],
    "RateLimitOptions": {
        "EnableRateLimiting": true,
        "Period": "10s",
        "PeriodTimespan": 10,
        "Limit": 3
    }
}
```
- `Period`: time window that this rate limit is acting on
- `PeriodTimespan`: the number of seconds we need to wait after we got the maximum number of requests
- `Limit`: maximum number of requests

##### Aggregation
![](attachments/Microservice%20architecture-150820231355.png)

##### Caching
```csharp
builder.Services.AddOcelot(builder.Configuration)
	.AddCacheManager(x =>
	{
		x.WithDictionaryHandle();
	});
```

```json
"FileCacheOptions": {
	"TtlSeconds": 10
}
```
## Communication in a microservice architecture
- The challenges of designing distributed system: 8 [Fallacies of distributed computing](https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing)
- One solution: isolating the business microservices as much as possible
#### Communication types
- *By protocols*: 
	- Synchronous: HTTP is a synchronous protocol. The client code can only continue its task when it receives the HTTP server response
	- Asynchronous: Other protocols like AMQP use asynchronous messages. The client code or message sender usually doesn't wait for a response
- *By receiver*:
	- Single: Each request must be processed by exactly one receiver or service
	- Multiple: Must be asynchronous. Based on an event-bus interface or message broker when propagating data updates between multiple microservices through events

- The communication between the microservices should be asynchronous. Having HTTP dependencies between microservices not only makes microservices not autonomous but also impact on performance 
![](attachments/Microservice%20architecture-110820232329.png)

- If a microservice needs data that's owned by other microservices, do not rely on making synchronous requests. Instead, replicate or propagate that data into the service's database by using eventual consistency

### Asynchronous message-based communication
#### Single-receiver message-based communication
![](attachments/Microservice%20architecture-110820232352.png)

#### Multiple-receivers message-based communication
- use a publish/subscribe mechanism and an event bus interface so that the communication available to additional subscriber microservices or to external applications -> open/closed principle in the sending service

![](attachments/Microservice%20architecture-120820230016.png)
- One microservice publishes events to an event bus and many microservices can subscribe to it, to get notified and act on it

### Implementing event-based communication between microservices (integration events)

#### Integration events
- is basically a data-holding class
-  When an event is published to multiple receiver microservices, the appropriate event handler in each receiver microservice handles the event

```csharp
public class ProductPriceChangedIntegrationEvent : IntegrationEvent
{
	public int ProductId { get; private set; }
	public decimal NewPrice { get; private set; }
	public decimal OldPrice { get; private set; }
 
	public ProductPriceChangedIntegrationEvent(int productId, decimal newPrice,
	decimal oldPrice)
	{
	ProductId = productId;
	NewPrice = newPrice;
	OldPrice = oldPrice;
	}
}
```

#### The event bus
- An event bus allows publish/subscribe-style communication between microservices without requiring the components to be aware of each other
- An event bus is typically composed of two parts:
	- The abstraction or interface
	- One or more implementations
 
![](attachments/Microservice%20architecture-150820231430.png)

```csharp
public interface IEventBus
{
    void Publish(IntegrationEvent @event);

    void Subscribe<T, TH>()
        where T : IntegrationEvent
        where TH : IIntegrationEventHandler<T>;

    void SubscribeDynamic<TH>(string eventName)
        where TH : IDynamicIntegrationEventHandler;

    void UnsubscribeDynamic<TH>(string eventName)
        where TH : IDynamicIntegrationEventHandler;

    void Unsubscribe<T, TH>()
        where TH : IIntegrationEventHandler<T>
        where T : IntegrationEvent;
}
```

#### RabbitMQ
RabbitMQ functions as an intermediary between message publisher and subscribers, to handle distribution
![](attachments/Microservice%20architecture-150820231433.png)

```csharp
public class EventBusRabbitMQ : IEventBus, IDisposable
{
    // Member objects and other methods ...
    // ...
    public void Publish(IntegrationEvent @event)
    {
        var eventName = @event.GetType().Name;
        var factory = new ConnectionFactory() { HostName = _connectionString };
        using (var connection = factory.CreateConnection())
        using (var channel = connection.CreateModel())
        {
            channel.ExchangeDeclare(exchange: _brokerName, type: "direct");
			
            string message = JsonConvert.SerializeObject(@event);
            var body = Encoding.UTF8.GetBytes(message);
            channel.BasicPublish(exchange: _brokerName,
                routingKey: eventName,
                basicProperties: null,
                body: body);
       }
    }

	public void Subscribe<T, TH>()
	        where T : IntegrationEvent
	        where TH : IIntegrationEventHandler<T>
	{
		var eventName = _subsManager.GetEventKey<T>();

		var containsKey = _subsManager.HasSubscriptionsForEvent(eventName);
		if (!containsKey)
		{
			if (!_persistentConnection.IsConnected)
				_persistentConnection.TryConnect();

			using (var channel = _persistentConnection.CreateModel())
			{
				channel.QueueBind(queue: _queueName,
								exchange: BROKER_NAME,
								routingKey: eventName);
			}
		}
		_subsManager.AddSubscription<T, TH>();
	}
}
```

#### Designing atomicity and resiliency when publishing to the event bus
- If the service crashes after the database is updated, but before the integration event is published, the overall system could become inconsistent
	- Using the full [Event Sourcing pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing): great but not the easiest solution
	- Using transaction log mining: coupled to RDBMS transaction log
	- Using the [Outbox pattern](https://www.kamilgrzybek.com/design/the-outbox-pattern/). This is a transactional table to store the integration events (extending the local transaction)
 <br>

 - A balanced approach is a mix of a transactional database table and a simplified ES pattern:
	1. The application begins a local database transaction.
	2. It then updates the state of your domain entities and inserts an event into the integration event table.
	3. Finally, it commits the transaction, so you get the desired atomicity and then
	4. You publish the event somehow (next).
		- Publish the integration event right after committing the transaction and use another local transaction to mark the events in the table as being published. Need an additional worker microservice that is in charge of checking and confirming the success of the published integration events
		![](attachments/Microservice%20architecture-150820231523.png)

		- Use the table as a kind of queue. A separate thread/process queries the integration event table, publishes the events to the event bus, and then uses a local transaction to mark the events as published.
		![](attachments/Microservice%20architecture-150820231524.png)
























