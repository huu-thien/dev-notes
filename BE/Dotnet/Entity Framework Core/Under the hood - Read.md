![](Under%20the%20hood%20-%20Read-191220230930.png)

#### Normal query – a _read-write query_
![](Under%20the%20hood%20-%20Read-191220230931.png)

1. **Create classes and fill in data**. This takes the values that came back for the database and fills in the non-navigational (known as _scalar_) properties, fields, etc.
2. **Relational fixup, with Identity Resolution**
- The first step will have filled in the primary keys and foreign keys. EF Core then uses these keys to set up the navigational properties
- The second stage is called _Identity Resolution_, which makes sure there is only one version of an tracked entity class with same type and same primary key. It looks at every tracked entity in the DbContext and fills in any navigational properties
3. **Creating a tracking snapshot**. The tracking snapshot is a copy of the entity classes that are passed back to the user, plus other things like a link to each entity class that it shadows – an entity is said to be _tracked_, which means it can be used in database writes

#### AsNoTracking query – read-only query
![](Under%20the%20hood%20-%20Read-191220230937.png)
1. **Create classes and fill in data**. **_(same as normal query)_**
2. **Relational fixup**: The first step will have filled in the primary keys and foreign keys, which define how the data is connected to each other. EF Core can use that to fill in the navigational properties (shown as thick blue lines) between the entity classes, but NOT looking outside the query to tracked entities.
The AsNoTracked method also turn off the Identity Resolution stage to make the query quicker (Identity Resolution can take a long time). This is why you end up with four Authors instead of three in a normal query

#### AsNoTrackingWithIdentityResolution
- makes the returned data not tracked, but it does do Identity Resolution

#### Differences between normal and AsNoTracking queries
- **The AsNoTracking query performs better**
	- Slightly faster and uses slightly less memory because it doesn’t have to create the tracking snapshot. The main performance improvement is due to not executing the Identity Resolution stage
	- Not having the tracking snapshot of the queried data improved the performance of SaveChanges because it doesn’t have to inspect the tracking snapshot for changes
- **The AsNoTracking query _relational fixup_ only links entities in the query**: the Identity Resolution links both to entities in the query AND entities that are currently tracked. But the AsNoTracking query only filled in the navigational properties between entities in the query
- **The AsNoTracking query doesn’t always represent the database relationships**: AsNoTracking query uses a quicker fixup without identity resolution. This can produce multiple instances for the same row in the database

