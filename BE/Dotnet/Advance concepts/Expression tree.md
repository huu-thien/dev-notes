- An Expression Tree is a data structure that defines code. Expression trees are based on the same structures that a compiler uses to analyze code and generate the compiled output
- Expression Trees are **immutable** data structures. If you want to mutate (change) an expression tree, you must create a new tree that is a copy of the original, but with your desired changes

### Executing expression tree
```csharp
Expression<Func<int>> add = () => 1 + 2; 
var func = add.Compile(); // Create Delegate 
var answer = func(); // Invoke Delegate 
Console.WriteLine(answer);
```

- Don't create any more sophisticated caching mechanisms to increase performance by avoiding unnecessary compile calls. Comparing two arbitrary expression trees to determine if they represent the same algorithm is a time consuming operation. 
- Lambda Expressions create closures over any local variables that are referenced. You must guarantee that any variables are usable at the location where you call `Compile`, and when you execute the delegate. The compiler ensures that variables are in scope. However, if your expression accesses a variable that implements `IDisposable`, it's possible that the variable is disposed while it's still held by the expression tree. 

### Interpret expressions
```csharp
Expression<Func<int, bool>> exprTree = num => num < 5;

// Decompose the expression tree.
ParameterExpression param = (ParameterExpression)exprTree.Parameters[0];
BinaryExpression operation = (BinaryExpression)exprTree.Body;
ParameterExpression left = (ParameterExpression)operation.Left;
ConstantExpression right = (ConstantExpression)operation.Right;

Console.WriteLine("Decomposed expression: {0} => {1} {2} {3}", param.Name, left.Name, operation.NodeType, right.Value);

// Decomposed expression: num => num LessThan 5


var constant = Expression.Constant(24, typeof(int)); 
Console.WriteLine($"This is a/an {constant.NodeType} expression type"); 
Console.WriteLine($"The type of the constant value is {constant.Type}"); 
Console.WriteLine($"The value of the constant value is {constant.Value}");

/*
This is a/an Constant expression type
The type of the constant value is System.Int32
The value of the constant value is 24
*/
```

### Build expression tree
#### Build a node
```csharp
Expression<Func<int>> sum = () => 1 + 2;

var one = Expression.Constant(1, typeof(int));
var two = Expression.Constant(2, typeof(int));
var addition = Expression.Add(one, two);
var lambda = Expression.Lambda(addition);

var lambda2 = Expression.Lambda( 
	Expression.Add( 
		Expression.Constant(1, typeof(int)), 
		Expression.Constant(2, typeof(int)) 
	) 
);
```
- this lambda expression contains no argument
#### Build a tree
```csharp
Expression<Func<double, double, double>> distanceCalc = (x, y) => Math.Sqrt(x * x + y * y);

var xParameter = Expression.Parameter(typeof(double), "x");
var yParameter = Expression.Parameter(typeof(double), "y");

var xSquared = Expression.Multiply(xParameter, xParameter); 
var ySquared = Expression.Multiply(yParameter, yParameter); 
var sum = Expression.Add(xSquared, ySquared);

var sqrtMethod = typeof(Math).GetMethod("Sqrt", new[] { typeof(double) }) 
	?? throw new InvalidOperationException("Math.Sqrt not found!");
var distance = Expression.Call(sqrtMethod, sum);

var distanceLambda = Expression.Lambda( distance, xParameter, yParameter);
```

- create the objects that represent parameters or local variables
- create an expression tree to access `Sqrt` method











