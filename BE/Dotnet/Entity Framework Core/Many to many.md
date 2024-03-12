- Direct many-to-many: simple to configure and use -> more code to create linking table
- Indirect many-to-many: take more work to setup -> allow to put specific data in the linking table

#### Direct many-to-many
![](attachments/Many%20to%20many-211220230935.png)

- NOTE: The direct many-to-many relationship is only automatically configured if you have a collection navigational property on both ends

##### Define linking table:
- Create a class to map linking table
  ![](attachments/Many%20to%20many-211220231007.png)
- Configuring the linking table
  ![](attachments/Many%20to%20many-211220231008.png)

##### Querying
```csharp
var books = context.Books.Include(b => b.Tags).ToList()
var books = context.Books.Tags.Select(t => t.TagId).ToList()
```
- EF Core will detect that your query is using a direct many-to-many relationship and add the extra SQL to use the hidden linking table to get the correct entity

##### Add a new link
![](attachments/Many%20to%20many-211220231011.png)

- Existing Tags should be loaded using the Include method, otherwise you could lose any existing links to Tags
- You MUST load the existing Tag from the database to add to the Tags navigational collection. If you simply created a new Tag, then EF Core will add that new Tag to the database

##### Remove a link
![](attachments/Many%20to%20many-211220231037.png)

#### Indrect many-to-many
![](attachments/Many%20to%20many-211220231040.png)

- EF Core will automatically detect the relationships because of all the navigational properties. But it can’t automatically detect is the composite primary key in the BookAuthor entity class.
![](attachments/Many%20to%20many-211220231041.png)

##### Querying
```csharp
var books = context.Books
     .Include(book => book.AuthorsLink).ThenInclude(ba => ba.Authors
     .ToList();

var books = context.Books  
     .Include(book => book.AuthorsLink.OrderBy(ba => ba.Order))  
     .ThenInclude(ba => ba.Authors  
     .ToList();
```

##### Add a new link
![](attachments/Many%20to%20many-211220231052.png)

- You should load the Book’s AuthorsLink using the Include method, otherwise you will lose any existing links to Authors
- You MUST load the existing Author from the database to add to the BookAuthor linking entity. If you simply created a new Author, then EF Core will add that new Author to the database

##### Remove a link
![](attachments/Many%20to%20many-211220231058.png)


