- Configuring EFCore: a process the EF Core does on the first use of application’s DbContext
- EFCore never look at the database to build models, it only uses the entity classes and configuration commands -> any mismatch will result in failure when it tried to access the database 
![](attachments/Configuring%20in%20depth-181220230917.png)

#### Relationship conventions
- Name your primary key as _Id_ or _<ClassName>Id_ (e.g. BookId)
- Use the _<ClassName>Id_ name on your foreign key
- Set up the property that links the two entity classes (navigational property) using the entity class type (**the name doesn’t matter**), e.g. _ICollection<Review> Reviews { get; set; }_
- **Notes**:
	- EF Core can only configure a one-to-one relationship By Convention if both ends of the have navigational properties, otherwise it will think it’s a one-to-many relationship
	- If you have two navigational properties going to the same class, for instance BillingAddress and DeliveryAddress both pointing to the Address entity class, then you do need to configure that manually (but an [Owned type](https://docs.microsoft.com/en-us/ef/core/modeling/owned-entities) would be better for that)
	- Some very advanced things like setting the constraint name need Fluent API

#### String type
- Set the size of the string using [MaxLength(123)] attribute. NVARCHAR(NNN) is slightly quicker than NVARCHAR(MAX)
- If you filter or sort on a string, then adding an SQL index is useful. NOTE an index has a limit of 900 bytes, so your NVARCHAR must be 450 or lower
- Some strings are 8-bit ASCII -> Use Fluent API command IsUnicode(false)), which will turn the SQL type from NVARCHAR to VARCHAR
- Try adding the [Required(AllowEmptyStrings = false)] attribute on strings you expect to contain a string. The [Required] part will change the SQL type from NVARCHAR(MAX) NULL to NVARCHAR(MAX) NOT NULL (the AllowEmptyStrings = false part doesn’t affect the database; it is only used in any NET validations)

#### DateTime type properties
- By default, NET’s DateTime type is saved as SQL DATETIME2, which has a resolution of 100ns and take up 7 bytes. In some cases that is great, but SQL DATE type is only 3 bytes. As well as saving bytes a sort or filter of a DATE type is going to be much quicker sort/filter than on a DATETIME2 type
- NOTE: If you save a DateTime that is using DateTimeKind.Utc, then you should know that the DateTimeKind of a DateTime is not preserved in the database. That matters if your front-end is going to send the data using JSON, as the JSON datatime string won’t end with a “Z” and your front-end might get the date offset right. You can fix this using EF Core’s [ValueConverters](https://docs.microsoft.com/en-us/ef/core/modeling/value-conversions)

#### decimal type properties
- By default, a NET decimal type is saved as DECIMAL(18,2), which is SQL Servers default, which means it has 16 digits before the decimal point and 2 after the decimal point and takes up 9 bytes. If your dealing with money that might be too big, and DECIMAL(9,2) would work and that’s only 5 bytes

#### Avoid expression body properties with EF Core

![](attachments/Configuring%20in%20depth-191220230901.png)

- Sort/filter on FullName -> exception
- Need to add an actual FullName property that will be mapped to the database and set the properties via a constructor, or use EF Core’s [backing fields](https://docs.microsoft.com/en-us/ef/core/modeling/backing-field)

![](attachments/Configuring%20in%20depth-191220230910.png)

#### Adding your configuration rules automatically

![](attachments/Configuring%20in%20depth-191220230915.png)

