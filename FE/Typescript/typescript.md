# 1. Type Annotations

- :type sau khi định nghĩa biến
- Một khi đã khai báo type, dúng ta sẽ không thể thay đổi nó
- vd: let arr : string[] = ['1', '2'];

# 2. Trong trường hợp không định nghĩa type thì typescript sẽ dự đoạn kiểu

# 3. Number type

# 4. String type

# 5. Boolean type

# 6. Object type

- let data: {id: number, name: string} = { id: 1, name: "thien" };

# 7. Array type

- var listUser: (string | number)[] = ['thien', 123];

# 8. Tuple type

- Hoạt động như Array tuy nhiên có thêm 1 vài quy định bắt buộc:
  - Số phần tử của tuple cần được khai báo trước (cố định)
  - Type của từng phần tử trong array cần được khai báo trước và không nhất thiết phải giống nhau
- Với tuple thì thứ tự rất quan trọng
- let skills2: [string, number, boolean?] = ["123", 123];

# 9. Enums type: liệt kê

- Enum là liệt kê 1 nhóm các giá trị hằng số, giups cộng gộp các biến constant
- Để định nghĩa enum cần:
  - Sử dụng keyword enum và tên cho enum
  - Định nghĩa các giá trị hằng số
    enum Tên {constan1, ....}

# 10. Any type

let fullName: any = "thien"
fullName = 123 // compile

- không nên lạm dụng

# 11. Void type

- Khi không muốn trả về gì hoặc trả về cái gì cũng đc thì dùng void (dùng cho function)
- Vẫn trả ra undefined

# 11. Typescript data type - Never

- Thường gặp khi sử dụng thư viện, function handle exception, function chạy không có điểm dừng
- Kiểu dữ liệu never được sử dụng khi chúng ta chắc chắn rằng một điều gì đấy không bao giờ xảy ra

# 12. TypeScript Union Type

- Cộng gộp kiểu dữ liệu : number | string | boolean

# 13. TypeScript Type Aliases

- viết ngắn gọn hơn thằng union
- Cho phép chúng ta tạo mới 1 kiểu type từ những type đã tồn tại
- Cú pháp: type alias = existingType
  Vd: type superType = string | number| boolean;
  const result : superType = "123"

# 14. Functions

# 15. Type Assertion

- Dùng để chỉ định một biến được coi như một kiểu dữ liệu nào đó

```typescript
type One = string;
type Two = string | number;
type Three = "hello";

// convert to more or less specific types
let a: One = "hello";
let b = a as Two; // less specific
let c = a as Three; // more specific
console.log(">>check type b: ", typeof b);
console.log(">>check type c: ", typeof c);

let d = <One>"World";
let e = <string | number>"World";

const addOrConcat = (
  a: number,
  b: number,
  c: "add" | "concat"
): number | string => {
  if (c === "add") return a + b;
  return "" + a + b;
};
let myVal: string = addOrConcat(2, 2, "concat") as string;

let naxtVal: number = addOrConcat(2, 2, "concat") as number;

10 as string | number;
10 as unknown as string;

// The DOM
const img = document.querySelector("img")!;
const myImg = document.getElementById("#img") as HTMLImageElement;
const myImage = <HTMLImageElement>document.getElementById("img");
img.src = "";
myImg.src;
myImage.src;
```

# 16. Classes

- Classes can extend each other through the extends keyword. A class can only extends one other class.

```typescript
interface Shape {
  getArea: () => number;
}

class Rectangle implements Shape {
  public constructor(
    protected readonly width: number,
    protected readonly height: number
  ) {}

  public getArea(): number {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  public constructor(width: number) {
    super(width, width);
  }

  // getArea gets inherited from Rectangle
}
```

```typescript
interface Shape {
  getArea: () => number;
}

class Rectangle implements Shape {
  // using protected for these members allows access from classes that extend from this class, such as Square
  public constructor(
    protected readonly width: number,
    protected readonly height: number
  ) {}

  public getArea(): number {
    return this.width * this.height;
  }

  public toString(): string {
    return `Rectangle[width=${this.width}, height=${this.height}]`;
  }
}

class Square extends Rectangle {
  public constructor(width: number) {
    super(width, width);
  }

  // this toString replaces the toString from Rectangle
  public override toString(): string {
    return `Square[width=${this.width}]`;
  }
}
```

# 17. Index Signatures & keyof Assertions

- Index Signatures cho phép bạn xác định các loại dữ liệu của các thuộc tính trong object type mà không cần chỉ định tên cụ thể của chúng. Chúng cho phép bạn sử dụng cú pháp một dấu ngoặc vuông [] để xác định kiểu dữ liệu của các key không biết trước trong object.

```typescript
interface MyObject {
  [key: string]: number;
}

const obj: MyObject = {
  apple: 5,
  banana: 10,
  orange: 7,
};

console.log(obj.apple); // 5
console.log(obj.banana); // 10
console.log(obj.orange); // 7
// Lưu ý rằng khi sử dụng Index Signatures, TypeScript sẽ cho phép bạn thêm các thuộc tính có kiểu dữ liệu đã xác định trong Index Signature hoặc là một union type của các kiểu dữ liệu đó.
```

- keyof Assertions cho phép bạn tạo union type của tất cả các key có thể có trong một object type. Điều này hữu ích khi bạn muốn tạo các union type dựa trên các key tồn tại trong object type.

```typescript
interface MyObject {
  name: string;
  age: number;
  city: string;
}

type MyObjectKeys = keyof MyObject; // "name" | "age" | "city"

function getProperty(obj: MyObject, key: keyof MyObject) {
  return obj[key];
}

const obj: MyObject = {
  name: "John",
  age: 30,
  city: "New York",
};

const nameValue = getProperty(obj, "name"); // OK
const ageValue = getProperty(obj, "age"); // OK
const cityValue = getProperty(obj, "city"); // OK
const invalidValue = getProperty(obj, "address"); // Error: "address" không phải là một key hợp lệ trong MyObject
```

- Trong ví dụ trên, MyObjectKeys là một union type của tất cả các key có thể có trong MyObject. Khi chúng ta sử dụng keyof Assertion với biến key trong hàm getProperty, TypeScript sẽ đảm bảo key là một key hợp lệ trong MyObject, giúp tránh việc truy cập các thuộc tính không tồn tại.

# 18. Utility types

- Trong TypeScript, các Utility type là các loại type được xây dựng sẵn trong ngôn ngữ để giúp bạn thao tác và sắp xếp các loại type một cách hiệu quả và linh hoạt hơn. Chúng giúp bạn tái sử dụng code và giảm thiểu lỗi trong quá trình phát triển ứng dụng TypeScript. Dưới đây là một số Utility type phổ biến trong TypeScript:

* `Awaited<Type>`: Loại này nhằm mô hình hóa các hoạt động như chờ đợi trong các hàm không đồng bộ hoặc phương thức .then() trên Lời hứa - cụ thể là cách chúng mở ra các Lời hứa một cách đệ quy.

```typescript
type A = Awaited<Promise<string>>;

//type A = string

type B = Awaited<Promise<Promise<number>>>;

//type B = number

type C = Awaited<boolean | Promise<number>>;

//type C = number | boolean
```

- `Partial<T>`: Tạo một type mới bằng cách làm cho tất cả các thuộc tính trong type T trở thành optional (có thể tồn tại hoặc không tồn tại).

```typescript
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};

const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});
```

- `Required<T>`: Tạo một type mới bằng cách làm cho tất cả các thuộc tính trong type T trở thành bắt buộc (không thể thiếu).

```typescript
interface Props {
  a?: number;
  b?: string;
}

const obj: Props = { a: 5 };

const obj2: Required<Props> = { a: 5 };
//Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.
```

- `Readonly<T>`: Tạo một type mới bằng cách làm cho tất cả các thuộc tính trong type T trở thành chỉ đọc (không thể thay đổi giá trị).

```typescript
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users",
};

todo.title = "Hello";
//Cannot assign to 'title' because it is a read-only property.
```

- `Pick<T, K>`: Tạo một type mới bằng cách chọn một tập hợp con các thuộc tính từ type T dựa trên union type K chứa tên các thuộc tính bạn muốn chọn.

```typescript
  interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};

todo;

const todo: TodoPreview
```

- `Omit<T, K>`: Tạo một type mới bằng cách loại bỏ một tập hợp các thuộc tính từ type T dựa trên union type K chứa tên các thuộc tính bạn muốn loại bỏ.

```typescript
  interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
  createdAt: 1615544252770,
};

todo;

const todo: TodoPreview

type TodoInfo = Omit<Todo, "completed" | "createdAt">;

const todoInfo: TodoInfo = {
  title: "Pick up kids",
  description: "Kindergarten closes at 5pm",
};

todoInfo;
```

- `Record<K, T>`: Tạo một type mới bằng cách tạo một object với các key là các phần tử trong union type K và các value là type T.

```typescript
  interface CatInfo {
  age: number;
  breed: string;
}

type CatName = "miffy" | "boris" | "mordred";

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};

cats.boris;
```

- `Exclude<T, U>`: Tạo một type mới bằng cách loại bỏ tất cả các kiểu trong union type T mà là phần tử của union type U.

```typescript
type T0 = Exclude<"a" | "b" | "c", "a">;

//type T0 = "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;

 //type T1 = "c"
type T2 = Exclude<string | number | (() => void), Function>;

//type T2 = string | number

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };

type T3 = Exclude<Shape, { kind: "circle" }>

// type T3 = {
//     kind: "square";
//     x: number;
// } | {
//     kind: "triangle";
//     x: number;
//     y: number;
// }
```

- `Extract<T, U>`: Tạo một type mới bằng cách chọn tất cả các kiểu trong union type T mà là phần tử của union type U.

```typescript
type T0 = Extract<"a" | "b" | "c", "a" | "f">;

//type T0 = "a"
type T1 = Extract<string | number | (() => void), Function>;

//type T1 = () => void

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };

type T2 = Extract<Shape, { kind: "circle" }>

// type T2 = {
//     kind: "circle";
//     radius: number;
// }
```

- `NonNullable<T>`: Tạo một type mới bằng cách loại bỏ tất cả các kiểu nullable (null hoặc undefined) từ type T.

```typescript

type T0 = NonNullable<string | number | undefined>;

//type T0 = string | number
type T1 = NonNullable<string[] | null | undefined>;

//type T1 = string[]
```

- `ReturnType<T>`: Trích xuất kiểu dữ liệu của giá trị trả về từ một hàm T.

```typescript
declare function f1(): { a: number; b: string };

type T0 = ReturnType<() => string>;

//type T0 = string
type T1 = ReturnType<(s: string) => void>;

//type T1 = void
type T2 = ReturnType<<T>() => T>;

//type T2 = unknown
type T3 = ReturnType<<T extends U, U extends number[]>() => T>;

//type T3 = number[]
type T4 = ReturnType<typeof f1>;

// type T4 = {
//     a: number;
//     b: string;
// }
type T5 = ReturnType<any>;

//type T5 = any
type T6 = ReturnType<never>;

//type T6 = never
type T7 = ReturnType<string>;
Type 'string' does not satisfy the constraint '(...args: any) => any'.

//type T7 = any
type T8 = ReturnType<Function>;
Type 'Function' does not satisfy the constraint '(...args: any) => any'.
  Type 'Function' provides no match for the signature '(...args: any): any'.

//type T8 = any
```

# Generics

- Generics là các mẫu cho phép cùng một hàm có thể chấp nhận các tham số với nhiều kiểu khác nhau. Việc tạo ra các thành phần có thể tái sử dụng với generics tốt hơn sử dụng kiểu any, vì generics bảo tồn kiểu của các biến vào và ra của chúng.

```typescript
// The <T> after the function name symbolizes that it's a generic function.
// When we call the function, every instance of T will be replaced with the actual provided type.

// Receives one argument of type T,
// Returns an array of type T.

function genericFunc<T>(argument: T): T[] {
  var arrayOfT: T[] = [];    // Create empty array of type T.
  arrayOfT.push(argument);   // Push, now arrayOfT = [argument].
  return arrayOfT;
}

var arrayFromString = genericFunc<string>("beep");
console.log(arrayFromString[0]);         // "beep"
console.log(typeof arrayFromString[0])   // String

var arrayFromNumber = genericFunc(42);
console.log(arrayFromNumber[0]);         // 42
console.log(typeof arrayFromNumber[0])   // number
```

# Classes

- Khi xây dựng các ứng dụng lớn, phong cách lập trình hướng đối tượng được ưa thích bởi rất nhiều lập trình viên, đặc biệt là trong các ngôn ngữ như Java hoặc C#.
- Cũng phải đề cập là từ phiên bản ECMAScript 2015, classes là một tính năng có sẵn trong JS và có thể không cần sử dụng TypeScript. Hai phiên bản khá giống nhau, nhưng chúng vẫn có điểm khác biệt, đó là TypeScript nghiêm ngặt hơn.

```typescript
  class Menu {
  // Our properties:
  // By default they are public, but can also be private or protected.
  items: Array<string>;  // The items in the menu, an array of strings.
  pages: number;         // How many pages will the menu be, a number.

  // A straightforward constructor.
  constructor(item_list: Array<string>, total_pages: number) {
    // The this keyword is mandatory.
    this.items = item_list;
    this.pages = total_pages;
  }

  // Methods
  list(): void {
    console.log("Our menu for today:");
    for(var i=0; i<this.items.length; i++) {
      console.log(this.items[i]);
    }
  }

}

// Create a new instance of the Menu class.
var sundayMenu = new Menu(["pancakes","waffles","orange juice"], 1);

// Call the list method.
sundayMenu.list();
```

# Decorators

Decorator trong TypeScript là một tính năng quan trọng và mạnh mẽ, cho phép bạn thêm hoặc thay đổi hành vi của các hàm hoặc lớp trong mã TypeScript mà không cần thay đổi mã nguồn gốc của chúng. Decorator thường được sử dụng để thực hiện các công việc như logging, kiểm tra quyền truy cập, gắn thêm metadata, hoặc thậm chí là thay đổi cấu trúc của một lớp hoặc hàm.

Decorator có thể được áp dụng cho các phần tử sau trong TypeScript:

1. Lớp (Class): Decorator có thể được sử dụng để thay đổi hành vi của một lớp hoặc thêm metadata cho lớp đó.

2. Phương thức (Method): Decorator có thể được áp dụng cho các phương thức của lớp để thay đổi hành vi hoặc thêm metadata.

3. Trường dữ liệu (Property): Decorator cũng có thể được sử dụng cho các trường dữ liệu trong lớp để thêm metadata hoặc thay đổi cách truy cập chúng.

Decorator được triển khai bằng cách sử dụng các hàm decorator. Một hàm decorator là một hàm thông thường nhận ba tham số:

1. `target`: Đối tượng mà decorator được áp dụng lên (có thể là một constructor của lớp hoặc prototype của lớp).

2. `propertyKey` (hoặc `undefined` nếu decorator được áp dụng cho lớp): Tên của phương thức hoặc trường dữ liệu mà decorator được áp dụng lên.

3. `descriptor` (hoặc `undefined` nếu decorator được áp dụng cho lớp): Một đối tượng mô tả đặc tính của phương thức hoặc trường dữ liệu.

Dưới đây là một ví dụ đơn giản về cách sử dụng decorator trong TypeScript:

```typescript
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with arguments ${args}`);
    const result = originalMethod.apply(this, args);
    console.log(`Result: ${result}`);
    return result;
  };
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}

const calculator = new Calculator();
calculator.add(1, 2); // This will log the method call and result
```
Trong ví dụ này, decorator log được áp dụng cho phương thức add trong lớp Calculator. Decorator này ghi log khi phương thức add được gọi và hiển thị các đối số và kết quả của phương thức.