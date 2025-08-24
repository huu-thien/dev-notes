### 1. **Bảng `users`**
| id  | name     | email              | metadata                                                                                                                                         |
|-----|----------|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| 1   | Alice    | alice@example.com   | {"age": 30, "preferences": {"color": "blue", "category": ["electronics", "books"]}}                                                             |
| 2   | Bob      | bob@example.com     | {"age": 40, "preferences": {"color": "red", "category": ["home", "garden"]}}                                                                   |
| 3   | Charlie  | charlie@example.com | {"age": 25, "preferences": {"color": "green", "category": ["sports", "fashion"]}}                                                               |
| 4   | Diana    | diana@example.com   | {"age": 35, "preferences": {"color": "yellow", "category": ["food", "beauty"]}}                                                                |
| 5   | Edward   | edward@example.com  | {"age": 45, "preferences": {"color": "purple", "category": ["books", "movies"]}}                                                                |


### 2. **Bảng `orders`**
| id  | user_id | total_amount | status    | created_at          |
|-----|---------|--------------|-----------|---------------------|
| 1   | 1       | 1500.00      | completed | 2024-12-01 10:00:00 |
| 2   | 2       | 500.00       | pending   | 2024-12-02 11:30:00 |
| 3   | 3       | 300.00       | completed | 2024-12-02 14:00:00 |
| 4   | 4       | 200.00       | canceled  | 2024-12-03 09:15:00 |
| 5   | 5       | 1200.00      | pending   | 2024-12-03 12:30:00 |


### 3. **Bảng `products`**

| id  | name         | price   | attributes                                                                                      |
| --- | ------------ | ------- | ----------------------------------------------------------------------------------------------- |
| 1   | Laptop       | 1000.00 | {"brand": "Dell", "features": {"RAM": "16GB", "SSD": "512GB"}}                                  |
| 2   | Phone        | 500.00  | {"brand": "Apple", "features": {"RAM": "8GB", "SSD": "128GB"}}                                  |
| 3   | Headphones   | 150.00  | {"brand": "Sony", "features": {"type": "wireless", "battery_life": "30 hours"}}                 |
| 4   | Coffee Maker | 80.00   | {"brand": "Keurig", "features": {"capacity": "10 cups", "type": "single serve"}}                |
| 5   | Smart Watch  | 250.00  | {"brand": "Samsung", "features": {"OS": "Tizen", "battery_life": "48 hours", "color": "black"}} |
| 6   | TV           | 1200.00 | {"brand": "LG", "features": {"screen_size": "55 inches", "resolution": "4K", "type": "LED"}}    |


### 4. **Bảng `order_items`**
| id  | order_id | product_id | quantity | total_price |
|-----|----------|------------|----------|-------------|
| 1   | 1        | 1          | 1        | 1000.00     |
| 2   | 1        | 2          | 1        | 500.00      |
| 3   | 2        | 2          | 1        | 500.00      |
| 4   | 3        | 3          | 2        | 300.00      |
| 5   | 4        | 4          | 1        | 80.00       |
| 6   | 5        | 5          | 1        | 250.00      |
| 7   | 5        | 6          | 1        | 1200.00     |

## Complex Queries

### 1. Retrieve user metadata with orders
```sql
SELECT u.id, u.name, u.metadata, json_agg(o.*) AS orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;
```

### 2. Get total sales grouped by product attributes (JSONB extraction)
```sql
SELECT 
    p.attributes ->> 'brand' AS brand,
    SUM(oi.total_price) AS total_sales
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY brand;
```

### 3. Orders containing products with specific JSONB attributes
```sql
SELECT o.id AS order_id, p.name AS product_name, p.attributes
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON p.id = oi.product_id
WHERE p.attributes @> '{"brand": "Dell"}';
```

### 4. CTE for high-value orders
```sql
WITH high_value_orders AS (
    SELECT id, user_id, total_amount
    FROM orders
    WHERE total_amount > 1000
)
SELECT hvo.*, u.name AS user_name
FROM high_value_orders hvo
JOIN users u ON hvo.user_id = u.id;
```

### 5. Update product metadata with JSONB functions
```sql
UPDATE products
SET attributes = jsonb_set(attributes, '{features,Storage}', '"1TB"', true)
WHERE name = 'Laptop';
```

### 6. Aggregate total order value by user preferences (nested JSONB)
```sql
SELECT 
    u.metadata #>> '{preferences, color}' AS favorite_color,
    SUM(o.total_amount) AS total_spent
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY favorite_color;
```

### 7. Query order items with JSONB path extraction
```sql
SELECT 
    oi.id AS order_item_id,
    p.name AS product_name,
    p.attributes->'features'->>'RAM' AS ram_size
FROM order_items oi
JOIN products p ON oi.product_id = p.id
WHERE (p.attributes->'features'->>'RAM')::text = '16GB';
```

### 8. JSONB array manipulation: Find users interested in specific categories
```sql
SELECT id, name
FROM users
WHERE metadata #> '{preferences, category}' \? 'electronics';
```

### 9. Count orders based on their JSONB metadata
```sql
SELECT 
    metadata->>'age' AS user_age,
    COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY user_age;
```

### 10. Orders with detailed nested JSON result

```sql
SELECT jsonb_build_object(
    'order_id', o.id,
    'user', jsonb_build_object('name', u.name, 'email', u.email),
    'products', json_agg(jsonb_build_object('product', p.name, 'quantity', oi.quantity))
) AS detailed_order
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
GROUP BY o.id, u.id;
