# 1. MỘT SỐ HÀM BUILT-IN (được xây dựng sẵn)

1. Alert : hiển thị hộp thoại
2. Console : in ra thông báo trong tab console
3. Confirm : tạo hộp thoại xác nhận trên màn hình
4. Prompt : tạo hộp thoại để lấy giá trị của người dùng
5. setTimeout : cho 1 đoạn code được chạy sau 1 khoảng thời gian, đơn vị mili giây
6. setInterval : thực thi liên tục một đoạn code sau 1 khoảng thời gian

# 2. CÁC LOẠI TOÁN TỬ TRONG JAVASCRIPT

1. toán tử số học
2. toán tử gán
3. toán tử so sánh
4. toán tử logic

# 3. TOÁN TỬ SỐ HỌC

```javascript
  +    // cộng
 -    // trừ
 *    // nhân
 **   // lũy thừa
 /    // chia
 %    // chia lấy số dư
 ++   // tăng một giá trị
 --   // giảm một giá trị
```

# 4. TOÁN TỬ ++/-- VỚI TIỀN TỐ, HẬU TỐ

- ++a trả về giá trị SAU khi tăng; a++ trả về giá trị TRƯỚC khi tăng;
- a-- trả về giá trị TRƯỚC khi giảm; --a trả về giá trị SAU khi giảm.

```javascript
let a = 5;
let b = 8;
console.log(a++); // 5
console.log(++a); // 6
console.log(++a + a++); // 6 + 6 = 12
console.log(++b + ++b); // 9 + 10 = 19
```

# 5. TOÁN TỬ GÁN
```html
div
```

```javascript
// Toán tử            Ví dụ            Tương đương
//   =               x=y                 x=y
//  +=               x+=y                x= x+y
//  -=               x-=y                x= x-y
//  *=               x*=y                x= x*y
//  /=               x/=y                x= x/y
//  **=               x**=y                x= x**y
```

# 6.LÀM VIỆC VỚI KIỂU CHUỖI

1. Lenght : trả về độ dài của chuỗi

```javascript
const myString = "abc";
console.log(myString.lenght); // 3
```

2. Find Index: Tìm chỉ mục giá trị trong chuỗi

```javascript
const myString = "html css js";
console.log(myString.search("js")); //=> trả về chỉ mục đầu tiên xuất hiện 'js'
console.log(myString.indexOf("js")); //=> trả về chỉ mục đầu tiên xuất hiện 'js'
console.log(myString.lastIndexOf("js")); //=> trả về chỉ mục cuối cùng xuất hiện 'js'
```

3. Cut String: cắt chuỗi

```javascript
const myString = "html css js";
console.log(myString.slice("vị trí đầu, vị trí cuối")); // cắt từ vị trí đầu đén vị trí cuối - 1
```

4. Replace : thay thế chuỗi, thay tất cả các kí tự nào bằng kì tự nào

```javascript
const myString = "html css js";
console.log(myString.replace("Kí tự cần sửa", "Kí tự đã sửa"));
console.log(myString.replaceAll("Kí tự cần sửa", "Kí tự đã sửa"));
// -> replace: sửa đổi giá trị đầu tiên, replaceAll: sửa đổi tất cả giá trị
```

5. Convert to upper case : thay đổi tất cả kí tự thành kí tự in hoa

```javascript
console.log(myString.toUpperCase());
```

6.  Convert to lower case : thay đổi tất cả kí tự thành kí tự thường

```javascript
console.log(myString.toLowerCase());
```

7.  Trim: loại bỏ khoảng trắng đầu và cuối chuỗi

```javascript
console.log(myString.trim());
```

8.  Split : cắt 1 chuỗi thành 1 array , tìm ra điểm chung để cắt

```javascript
var languages = "javascript, javascript, Ruby";
console.log(languages.split(", ")); // ['javascript', 'javascript', 'Ruby']
```

9. Lấy kí tự theo index

```javascript
const myString2 = "acbdefgh";
console.log(myString2.charAt(5)); // f
```

# 7. LÀM VIỆC VỚI KIỂU SỐ

- toString() : biến số thành kiểu string

```javascript
let a = 123;
console.log(a.toString()); // '123'
```

- toFixed(số chữ số cần làm tròn sau dấu phẩy), làm tròn một số

```javascript
let a = 123.456;
console.log(a.toFixed(2)); // 123.45
```

# 8. LÀM VIỆC VỚI KIỂU MẢNG - ARRAY

```javascript
var languages = ["JS", "javascript", "C#"];
```

1. Array.isArray() : Kiểm tra có phải là array không -> true/false

```javascript
console.log(Array.isArray(languages)); // true
```

2. toString(): chuyển array thành string

```javascript
console.log(languages.toString()); // JS,javascript,C#
```

3. join(): chuyển array thành string, thay thế kí tự ngăn cách giữa các phần tử trong array sau khi đã chuyển thành chuỗi

```javascript
console.log(languages.join("")); // JSjavascriptC# -> chuyển thành string và thanh thế kí tự ngăn cách thành ""
```

4. pop(): Xóa 1 phần tử ở cuối mảng và trả về phần tử đã xóa

```javascript
console.log(languages.pop()); // C#
```

5. push(): Thêm 1 phần tử vào cuối mảng và trả về độ dài mới của mảng

```javascript
console.log(languages.push("Ruby")); // 4
```

6. shift(): Xóa 1 phần tử ở đầu mảng và trả về phần tử đã xóa

```javascript
console.log(languages.pop()); // JS
```

7. unshift(): Thêm 1 phần tử vào đầu mảng và trả về độ dài mới của mảng

```javascript
console.log(languages.push("Ruby")); // 4
```

8. splice('vị trí đặt con trỏ', 'số lượng element muốn xóa', 'các element thêm vào')

- XÓA: languages.splice(vị trí đặt con trỏ, số lượng element muốn xóa); trả về phần tử đã xóa

```javascript
// Tính từ vị trí đặt con trỏ sẽ xóa đi bao nhiêu phần tử
console.log(languages.splice(1, 1)); // javascript
// bắt đầu ở vị trí số 1 và xóa 1 phần tử, trả ra phần tử đã xóa
```

- CHÈN: languages.splice(vị trí đặt con trỏ, SL element muốn xóa, 'element thêm');

```javascript
// Tính từ vị trí đặt con trỏ, không xóa element nào và thêm element
console.log(languages.splice(1, 0, "hihi")); // []
// bắt đầu ở vị trí số 1, không xóa, thêm 1 element "hihi"
```

9. concat() : nối 2 mảng

```javascript
const arr1 = [1, 2, 3, 4, 5];
const arr2 = [6, 7, 8, 9, 10];
console.log(arr1.concat(arr2)); // [1,2,3,4,5,6,7,8,9,10]
```

10. slice() : trích xuất 1 số phần tử trong mảng

```javascript
const animals = ["ant", "bison", "camel", "duck", "elephant"];

console.log(animals.slice(2)); // output: Array ["camel", "duck", "elephant"]
console.log(animals.slice(2, 4)); // output: Array ["camel", "duck"]
console.log(animals.slice(1, 5)); // output: Array ["bison", "camel", "duck", "elephant"]
console.log(animals.slice(-2)); // output: Array ["duck", "elephant"]
console.log(animals.slice(2, -1)); // output: Array ["camel", "duck"]
console.log(languages.slice(0)); // copy mảng
```

# 9. FUNCTION TRONG JAVASCRIPT

- Trong Javascript có hai loại hàm là:
  - Khai báo hàm (Function Declaration) : có hoisting
  - Biểu thức hàm (Function Expression) : không có hoisting

```javascript
// Function declaration
function speak() {
  console.log("Hello");
}
// Function expression
const speak = function () {
  console.log("Hello");
};
```

# 10. OBJECT TRONG JAVASCRIPT

- objects prototype : thêm được 1 thuộc tính ở bên ngoài hàm tạo : user.prototype.className = 'F8';
- tất cả những thuộc tính và phương thức được thêm bằng prototype sẽ không hiện trong
  hàn tạo mà hiện ở **_proto_**
  - ĐỐI TƯỢNG DATE

```javascript
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
```

# 11. VÒNG LẶP - LOOP

1. for - lặp với điều kiện đúng
2. for/in : lặp qua key của đối tượng

   ```javascript
   var myInfo = {
     name: "Nguyễn Hữu Thiện",
     age: 18,
     address: "5/11 Lê Đình Chinh, Huế",
   };
   for (var key in myInfo) {
     console.log(myInfo[key]);
   }
   // Nguyễn Hữu Thiện 18 5/11 Lê Đình Chinh, Huế
   ```

3. for/of : lặp qua value của đối tượng, dùng để lấy ra phần tử của 1 mảng hay từng chữ cái của 1 chuỗi

```javascript
var myInfo = {
  name: "Nguyễn hữu Thiện",
  age: 19,
};
for (var value of Object.keys(myInfo)) {
  console.log(myInfo[value]);
}
// Nguyễn hữu Thiện 19
```

4. while : lặp khi điều kiện đúng
5. do/while : lặp ít nhất 1 lần, sau đó lặp khi điều kiện đúng

# 12. MỘT SỐ PHƯƠNG THỨC QUAN TRỌNG KHI LÀM VIỆC VỚI ARRAY

1. forEach(item, index): duyệt qua từng phần tử của mảng, thay đổi trực tiếp phần tử của mảng không return gì cả
2. every(item, index) : kiểm tra tất cả phần tử của mảng phải thỏa mảng điều kiện gì đó -> true/false
3. some(item, index) : kiểm tra chỉ cần 1 phần tử của mảng thỏa mãn điều kiện gì đó -> true/false
4. find(item, index): trả về phần tử đầu tiên thỏa mãn điều kiện
5. filter(item, index, originArray): trả về 1 mảng mới các phần tử thỏa mãn điều kiện nào đó
6. map(item, index, originArray): chỉnh sửa và thay đổi các element của 1 array, trả ra một mảng mới
7. reduce(accumulator, currentItem, index, originArray): tính toán logic và trả về 1 giá trị duy nhất (phụ thuộc vào lần return cuối cùng , return acc của lần chạy cuối cùng)

- accumulator: biến lưu trữ, lần lặp trước return gì thì lần lặp sau acc sẽ nhận giá trị đó
- currentItem: item hiện tại
- index: chỉ mục của item hiện tại
- originArray: mảng gốc

```javascript
// Làm phẳng mảng từ "mảng sâu"
var depthArray = [1, 2, [3, 4], [5, 6], [7, 8], [9, 10]];
var flatArray = depthArray.reduce(function (flatOutput, depthItem) {
  return flatOutput.concat(depthItem);
}, []);
//output: [1,2,3,4,5,6,7,8,9,10]
```

8. Array.includes() : kiểm tra xem 1 phần tử có tồn tại trong mảng hay không -> true/ false
9. Array.from(): trả về một đối tượng Array từ bất kì đối tượng nào có thuộc tính length hoặc bất kì đối tượng nào có thể lặp lại

# 13. MATH OBJECT

- Math.PI: trả về số pi
  - Math.round(): làm tròn số
  - Math.abs(): trị tuyệt đối
  - Math.ceil(): làm tròn trên
  - Math.floor(): làm tròn dưới
  - Math.random(): trả về dãy số thập phân nhỏ hơn 1 ngẫu nhiên
    console.log(Math.floor(Math.random()\*100));
  - Math.min(): trả về số nhỏ nhất
  - Math.max(): trả về số lớn nhất

# 14. CALLBACK

- Là function được truyền qua đối số khi gọi hàm khác

# 15. HTML DOM

```javascript
// - Có 3 thành phần
// 	  + Element: id, class, tag, CSS selector, HTML collection
// 		document.getElementById(''); : trả về trực tiếp element
// 		document.querySelector(''); : trả về trực tiếp element
// 		document.getElementsByTagName(''); : trả về HTML collection
// 		document.getElementsByClassName(''); : trả về HTML collection
// 		document.querySelectorAll('');: trả về nodeList
// 		HTML collection: img,a,form,...
// 		document.write('hello');

// 	  + Atribute
// 		setAttribute('',''): thêm thuộc tính, tùy biến thuộc tính cho thẻ
// 		getAttribute(''): lấy value của 1 thuộc tính
// 	  + Texts
// dom là 1 web API được viết bằng ngôn ngữ javascript hoặc các ngôn ngữ bậc thấp hơn
// ==================================
// innerText và textContent:
// 	var headingElement = document.querySelector('h1');
// 	console.log(headingElement.innerText);: **trả lại cái nhìn thấy ở web
//       ------------
// 	var headingElement = document.querySelector('h1');
// 	console.log(headingElement.textContent);  :** lấy nguyên bản textNode
// *Thay đổi textNode
// 	headingElement.textContent = 'New heading';
// => lấy ra nội dung của textNode trong cái element h1
// ==================================
// innerHTML và outerHTML: 2 thuộc tính của elementNode
// 	innerHTML: thêm 1 element bên trong 1 element
// 		var boxElement = document.querySelector('.box');
// 		boxElement.innerHTML = '<h1>Đây là heading</h1>';
// ==> thêm element h1 vào element có class là box
// 	outerHTML: ghi đè 1 element bởi 1 element khác
// 		var boxElement = document.querySelector('.box');
// 		boxElement.outerHTML = '<h1>Đây là heading</h1>';
// ==> ghi đè element có class box thành element h1
```

# 16. DOM CSS

```javascript
//   var boxElement = document.querySelector('.box');
// // CÁCH 1
// boxElement.style.width = '100px';
// boxElement.style.height = '100px';
// boxElement.style.backgroundColor = 'red';
// // CÁCH 2

// Object.assign(boxElement.style, {
//     width: '200px',
//     height: '200px',
//     backgroundColor: 'green'
// })
// ==================================
// **CLASSLIST PROPERTY: làm việc với class của element
// 	add: thêm element => boxElement.classList.add('red','blue');
// 	contains: kiểm tra xem class có nằm trong element không
// 	remove: xóa bỏ class khỏi element
// 	toggle: nếu có class thì xóa, không có class thì thêm
// ==================================
// **DOM EVENT: sự kiện diễn ra ở trong DOM
// 	1. Attributes Events:

// 	2. sử dụng elementNode để gán:
// 		var h1Element = document.querySelector('h1');
// 		h1Element.onclick = function() {
//     		// code thực thi khi h1 bị click
//     		console.log(Math.random());
// 		}
//  Ví dụ:
// 2 phương thức của đối tượng event
// 	1. preventDefault: loại bỏ hành vi mặc định cua trình duyệt
// 	2. stopPropagation: loại bỏ sự kiện nổi bọt
```

# 17. JSON

```javascript
// - Là 1 định dạng dữ liệu (chuỗi)
// 	- JavaScript Object Notation
// 	- JSON: Number, Boolean, Null, Array, Object, String
// 	- Có 2 thao tác: mã hóa (encode)/ giải mã (decode)
// 	=> parse: chuyển từ JSON sang Javascript:
// 		var a = '1';
// 		console.log(JSON.parse(a));
// 	=> stringify: chuyển từ Javascript  sang JSON:
// 		console.log(JSON.stringify(null));
```

# 18. PROMISE (sync, async)

```javascript
// -Sync (đồng bộ): viết trước thì chạy trước
// 	-Async (bất đồng bộ): setTimeout,setinterval, fetch,
// 				 XMLHttpRequest, thao tác đọc file
// 	    => đều có call back, để biết khi nào chạy
// 	-Lý thuyết, cách hoạt động: promise có 3 trạng thái
// 		+Penđing: đang chờ đợi
// 		+Fulfilled: thành công
// 		+Reject: thất bại
// 	    -> Promise là 1 khái niệm sinh ra để giúp xử lý những thao
// 		tác bất đồng bộ. Trước khi có Promise thì chúng ta thường
// 		dùng callback nhưng gặp vấn đề là callback hell(code bị rối)
// 		Promise sinh ra ở phiên bản ES6 để giúp chúng ta viết code
// 		dễ đọc, dễ hiểu. Để tạo ra 1 Promise thì sử dụng từ khóa new
// 		Promise rồi truyền vào một Executor function nhận 2 tham số,
// 		là resolve và reject,khi mà Executor function thực thi thì 1
//         		trong 2  được gọi,khi thao tác thành công thì gọi resolve,
// 		thất bại thì gọi reject, còn đối tượng promise được tạo ra thì
// 		sử dụng qua những phương thức .then() khi promise resolve và
// 		.catch() khi promise bị reject

// 		var promise = new Promise(
// 			  function(resolve, reject) {
//      			 // Logic
//      			 // Thành công : gọi resolve()
//      			 // Thất bại : gọi reject()
//  			 }
// 		)
// 		promise
//  			 .then(function() {
//     			  // thành công
//  			 })
//   			.catch(function() {
//   			    // thất bại
//  			 })
//   			.finally(function() {
//     			  // Thành công or thất bại
//   			})
```

# 19. Destructuring

- Destructuring với object: dùng để lấy các giá trị của object, phải truyền đúng key, nếu đổi key thì dùng dấu :

```javascript
const user = {
  name: "John",
  age: 36,
  email: "john@example.com",
  s,
};
const { name, age: userAge, email } = user;
console.log(name, userAge, email); // John 36 john@example.com
```

- Destructuring với array: dùng để lấy các phần tử của 1 mảng rồi gán vào cho các biến xác định

```javascript
const list = [
  1,
  function (a, b) {
    return a + b;
  },
];
const [value, sum] = list;
console.log(value); // 1
console.log(sum(2, 3)); // 5
```

# 20. Rest parameter

- Lấy phần còn lại, trả về dưới dạng mảng

```javascript
const handle = (a, b, ...c) => {
  console.log(c);
};

handle(1, 2, 3, 4, 5, 6); // output: [ 3, 4, 5, 6 ]

const handle1 = ({a, b, ...c}) => {
  return c;
};

const value = handle1({a:1, b:2, c:3, d:4, e:5})
console.log(value) // {c: 3. d:4, e:5}
```

# 21. Spread syntax

- Toán tử rải, được dùng để copy mảng hoặc object

```javascript
const user = {
  name: "John",
  age: 21,
  city: ["San Francisco"],
};

// Shallow copy (Copy nông)
const clonedUser = { ...user };
console.log(clonedUser === user); // false
console.log(clonedUser.city === user.city); // output : true
```

# 22. Tham trị và tham chiếu

- Kiểu tham trị:
  1. number
  2. string
  3. boolean
  4. null
  5. undefined
  6. BigInt
  7. Symbol
- Kiểu tham chiếu: array, object va function
- Một biến array, object, function : không lưu trữ giá trị, chỉ lưu trữ địa chỉ bộ nhớ hay tham chiếu đến địa chỉ ô nhớ đó
- Khi chúng ta copy 1 biến object , tham chiếu của nó bị copy, object không bị nhân đôi lên

**_Clone và merge_**
- Copy một biến object sẽ tạo thêm 1 biến khác tham chiếu đến cùng object đó
- Nhưng trong nhiều trường hợp chúng ta muốn nhân đôi 1 object để khi chỉnh sửa biens này thì không ảnh hưởng đến biến kia => Chúng ta gọi đó là **clone**

**_Shallow clone_**
- Với clone thường thì dùng spread syntax để clone => clone ra 1 object mới

```ts
const user = {name: 'John', city: ['HN', 'DN']}
const cloneUser = {...user}
```

- Có thể clone bằng vòng lặp: dùng for/in

```ts
let user = {name: 'John', age: 30}
let clone = {} // Một objct rỗng

for (let key in user) {
	clone[key] = user[key] // Copy các thuộc tính
}

console.log(clone) // {name: 'John', age: 30}
```

  =>  Clone thường chỉ hiệu quả với những object 1 cấp, những object nested nhiều cấp thì phải **deep clone**

**_Deep Clone_**

- Dùng JSON.parse(JSON.stringify())

```ts
const user = {name: 'John', city: ['HN', 'DN']}
const userDeepClone = JSON.parse(JSON.stringify(user))
console.log(userDeepClone.city === user.city) // false
```

- Dùng method **\_.cloneDeep(obj)** của thư viện lodash
- Dùng các thư viện như **_immer_** -> recomand vì đôi lúc ta không cần thiết phải clone hết cả 1 object lớn, cơ chế của immer sẽ chỉnh sửa thuộc tính nào thì nó tự tính và clone cho đúng. Vậy nên giúp cải thiện về mặt performance trong 1 số trường hợp

**Lưu ý**: khai báo const obj cũng có thể chỉnh sửa

# 23. Toán tử logic và template string

### Toán tử logic

- Dựa trên Truthy và Falsy
- Ngoài những giá trị sau thì tất cả đều là truthy: **false, 0, 0n , undefined, null, '', NaN**

- Toán tử || : trả về phần tử truthy đầu tiên từ trái sang phải -> nếu không có thì trả về phần từ ngoài cùng bên phải
- Toán tử && : trả về phần tử falsy đầu tiên từ trái qua phải -> nếu không có thì trả về phần tử ngoài cùng bên phải
- Toán tử optional chaining ?. : để tránh gặp lỗi khi null hoặc undefined cố tình truy cập thuộc tính
- Toán tử nill list ?? : dùng trong trường hợp cần check một giá trị có phải là **undefined** hay **null** không
  user ?? 'hello' -> nếu user là null hoặc undefined thì là 'hello', nếu không vẫn là user

### Template string
- Nếu dùng dấu "" thì không thể xuống hàng 
- Nhưng dùng `template string` thì có thể xuống hàng
- Với `template string` thì có thể đặt biến động vào trong

```ts
const name = 'John'
console.log(`${name}`)
```

# 24. Class và con trỏ this

```ts
function Cat(name, color, type) {
	this.name = name
	this.color = color
	this.type = type
}

// Thêm Method
Cat.prototype.meow = function () {
	console.log(`${thí.nam} meows: meow meow meow`)
}

// Khởi tạo 1 instanc object
let alex = new Cat('Alex', 'Yellow', 'Bengal')

alex.meow() // Alex meows: meow meow meow
```

hoặc

```ts
function Cat(name, color, type) {
	this.name = name
	this.color = color
	this.type = type
	this.meow = function () {
		console.log(`${thí.nam} meows: meow meow meow`)
	}
}

// Khởi tạo 1 instanc object
let alex = new Cat('Alex', 'Yellow', 'Bengal')

alex.meow() // Alex meows: meow meow meow
```
## Con trỏ this

- this trả về đối tượng object gần nhất chứa nó
- nếu this đứng 1 mình ở phạm vi global thì this trả về đối tượng window
- nếu this trong function không có strict mode -> trả về đối tượng window
- nếu this trong function có strict mode -> trả về undefined
- trong 1 event, this trả về element mà event đó tác động vào

## Class
- Class giúp gom các thuộc tính và phương thức lại, giúp code nhìn clean hơn
- Trong class thì this trỏ đến đối tượng class chứa nó
- Các khai báo class (lớp) không được hoisting

# 25. Arrow function, higher Order function, currying, callback

## Callback function
```ts
const nums = [1, 2, 3, 4, 5]

const callback = (item, index) => {
	console.log(`STT ${index} la ${item}`)
}

nums.forEach(callback)
```

## Currying: là function mà return về 1 function

```ts
function findNumber(num) {
	return function(func) {
		const result = []
		for(let i = 0; i <= num; i++) {
			if(func(i)) result.push(i)
		}
		return result
	}
}
// Arrow function
const findNumberArrow = (num) => (func) => {
	const result = []
	for(let i = 0; i <= num; i++) { 
		if(func(i)) result.push(i)
	}
	return result
}

const value = findNumber(10)((number) => number % 2 === 0)
console.log(value) // [2, 4, 6, 8, 10]

const value2 = findNumber(10)((number) => number % 2 !== 0)
console.log(value) // [1, 3, 5, 7, 9]
```

# 26. Bất đồng bộ với async / await và promise   

##### Đồng Bộ và Bất Đồng Bộ trong JavaScript

####  Code Đồng Bộ (Synchronous Code)

- **Khái niệm**: Trong JavaScript, code đồng bộ được thực thi theo tuần tự, từ trên xuống dưới. Khi một dòng code đang được thực thi, toàn bộ chương trình sẽ chờ đợi cho đến khi dòng code đó hoàn thành trước khi chuyển sang dòng tiếp theo.

- **Ví dụ**:

  ```javascript

  console.log('Bắt đầu'); // 1

  const result = 10 + 20; // 2

  console.log('Kết quả:', result); // 3

  console.log('Kết thúc'); // 4

  ```

  Kết quả:

  ```

  Bắt đầu

  Kết quả: 30

  Kết thúc

  ```

  

####  Code Bất Đồng Bộ (Asynchronous Code)

- **Khái niệm**: Code bất đồng bộ trong JavaScript cho phép một số đoạn mã không cần phải chờ đợi để hoàn thành trước khi tiếp tục thực thi đoạn mã khác. Điều này đặc biệt quan trọng khi xử lý các tác vụ tốn thời gian như gọi API, đọc/ghi file, hoặc xử lý hình ảnh, mà bạn không muốn làm gián đoạn toàn bộ chương trình.

- **Ví dụ**:

  ```javascript

  console.log('Bắt đầu'); // 1

  setTimeout(() => {

    console.log('Tác vụ bất đồng bộ'); // 3

  }, 1000);

  console.log('Kết thúc'); // 2

  ```

  Kết quả sẽ là:

  ```

  Bắt đầu

  Kết thúc

  Tác vụ bất đồng bộ

  ```

  

####  Tại Sao JavaScript Lại Bất Đồng Bộ?

JavaScript là ngôn ngữ đơn luồng (single-threaded), có nghĩa là nó chỉ có một ngăn xếp thực thi (call stack). Nếu JavaScript chỉ sử dụng cách thực thi đồng bộ, mọi tác vụ dài như gọi API, xử lý file, hay truy vấn cơ sở dữ liệu sẽ khiến toàn bộ chương trình bị tắc nghẽn cho đến khi tác vụ đó hoàn thành. Điều này sẽ làm cho giao diện người dùng bị đóng băng hoặc trải nghiệm người dùng trở nên chậm chạp.

  

**Bất đồng bộ** được giới thiệu để giải quyết vấn đề này bằng cách cho phép JavaScript xử lý các tác vụ dài mà không làm gián đoạn luồng thực thi chính. Thay vì chặn, các tác vụ này được xử lý riêng biệt và JavaScript tiếp tục thực thi các dòng code khác. Khi tác vụ bất đồng bộ hoàn thành, nó sẽ "quay lại" và đưa kết quả vào ngăn xếp thực thi thông qua cơ chế **callback**, **Promises**, hoặc **async/await**.

  

- **Event Loop**: JavaScript sử dụng một cơ chế gọi là `event loop` để quản lý cách các tác vụ bất đồng bộ được xử lý. Khi một tác vụ bất đồng bộ hoàn thành, nó sẽ được đưa vào hàng đợi (queue) và chờ đợi `event loop` đưa nó trở lại ngăn xếp thực thi.

  

####  Các Cơ Chế Bất Đồng Bộ Phổ Biến

- **Callbacks**: Một hàm được truyền vào như một đối số để thực thi sau khi tác vụ bất đồng bộ hoàn thành.

  ```javascript

  function doSomethingAsync(callback) {

    setTimeout(() => {

      callback('Kết quả đã sẵn sàng');

    }, 1000);

  }

  

  doSomethingAsync(result => {

    console.log(result); // In ra "Kết quả đã sẵn sàng" sau 1 giây

  });

  ```

- **Promises**: Giúp quản lý và xử lý các tác vụ bất đồng bộ một cách tuần tự và rõ ràng hơn.
Ở then hoặc catch nếu return cái gì thì sẽ nhận được 1 promise mới
Promise có 3 trạng thái:
1. **Pending** (Đang chờ) 
2. **Fulfilled** (Hoàn thành)
3. **Rejected** (Bị từ chối)

  ```javascript

  function doSomethingAsync() {

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        resolve('Kết quả đã sẵn sàng');

      }, 1000);

    });

  }

  

  doSomethingAsync().then(result => {

    console.log(result); // In ra "Kết quả đã sẵn sàng" sau 1 giây

  });

  ```

- **Async/Await**: Cung cấp cú pháp gọn gàng và dễ đọc hơn để làm việc với Promises.

**Await** chỉ sử dụng được trong 1 **Async  function**
Chỉ sử dụng **Await** với promise

  ```javascript

  async function main() {

    const result = await doSomethingAsync();

    console.log(result); // In ra "Kết quả đã sẵn sàng" sau 1 giây

  }

  

  main();

  ```

  

Nhờ cơ chế bất đồng bộ, JavaScript có thể xử lý nhiều tác vụ đồng thời mà không làm gián đoạn trải nghiệm người dùng, đặc biệt là trong các ứng dụng web hiện đại.

# 27. ES6 module

# 28. Web Storage và cookie

- Web storage : Local Storage và Session Storage
- Web storage lưu trữ được nhiều dữ liệu và dễ dùng hơn Cookie
- Cả 3 đều dùng để lưu thông tin trên trình duyệt để tiện xử lý sau này
- Khác biệt lớn nhất giữa Local Storage, Session Storage và Cookie là thời gian lưu trên trình duyệt

## Local Storage

- Là Web Storage
- Lưu lại vĩnh viễn trên trình duyệt
- Dung lượng khoảng 5Mb - 10Mb
- Các trang khác không thể truy cập đến Local Storage nếu như khác domain

```javascript
// thêm item
localStorage.setItem("name", "john");
// đọc item
localStogare.getItem("name");
// Xóa item
localStorage.removeItem("name");
// Xóa hết local storage
localStorage.clear();
```

## Session storage

- Là Web Stogare giống Local Storage
- Lưu lại trong 1 phiên dùng web thôi, đóng tab là mất hết data
- Dung lượng khoảng 5Mb - 10Mb
- Các trang khác không thể truy cập đến Session Storage nếu như khác domain

```javascript
// thêm item
sessionStorage.setItem("name", "john");
// đọc item
sessionStorage.getItem("name");
// Xóa item
sessionStorage.removeItem("name");
// Xóa hết local storage
sessionStorage.clear();
```

## Cookie

- Không phải là web storage
- thời gian lưu trữ data có giới hạn, khi hết hạn thì cookie tự động bị xóa
- Dung lượng lưu trữ khoảng 4KB => nên lưu những data đơn giản, càng ít càng tốt
- Cookie sẽ tự động truyền từ server xuống client và truyền từ client lên server thông qua mỗi header request
- Có thể cấu hình để các sub domain (vd: sub1.domain.com) có thể set cookie cho sub2.domain.com. Lưu ý là phải cùng domain cha.

* Cookie thường được tạo trên server bằng javascript, python, java hoặc nodejs để truyền xuống client thông qua header của mỗi request
* Cookie cũng có thể được tạo thông qua javascript bằng cách dùng **_document.cookie_**, những cookie mà tạo bằng JS thì không có cờ
  **_HttpOnly_** falg

```javascript
document.cookie = "yummy_cookie=choco";
document.cookie = "tasty_cookie=strawbery";
console.log(document.cookie);
```

## Bonus: Server session

- Là phiên trên server, không phải trên client
- Server sẽ tự động quyết đinh khi nào kết thúc phiên để đưa ra quyết định với client
- Dung lượng lưu trữ không giới hạn

# 29. Phân biệt var, let, const

- Giống nhau : đều là những từ khóa dùng để khai báo
- Khác nhau:

1. Về tính gán lại và khai báo lại

- `var`: có thể gán lại và có thể khai báo lại
- `let`: có thể gán lại, không thể khai báo lại
- `const`: không thể gán lại và không thể khai báo lại

2. Hoisting:

- `var` có cơ chế `hoisting` còn let và const thì không
- `Hoisting` là cơ chế đưa

3. Phạm vi truy cập

- `let`, `const` có phạm vi truy cập là `code block`
- Nếu khai báo ở ngoài function thì phạm vi của `var` là `global`

# 30. IFFE

- IFFE là 1 expression function được gọi ngay lập tức
- Sử dụng với những đoạn mã mong muốn chạy ngay lập tức, không có tính sử dụng lại

```javascript
(function () {
  // Một hàm được định nghĩa bên trong IIFE
  var message = "Hello from IIFE";

  // Code bên trong IIFE có thể truy cập biến message mà không tạo ra biến toàn cục
  console.log(message);
})();
// Biến message không thể truy cập ở đây
```

# 31. Closure

- Closure là 1 hàm có thể truy cập các biến thuộc scope chưa nó, ngay cả khi scope chứa nó đã thực thi xong
- Closure được tạo ra khi 1 hàm được khai báo bên trong 1 hàm khác. Hàm bên trong có thể truy cập tất cả các biến được khai báo ở hàm bên ngoài, ngay cả khi hàm bên ngoài đã hoàn thành việc thực thi

```javascript
function outerFunction(outerValue) {
  // Hàm innerFunction được khai báo bên trong outerFunction
  function innerFunction(innerValue) {
    // Closure xảy ra ở đây, vì innerFunction có thể truy cập outerValue
    console.log(outerValue + innerValue);
  }

  // Trả về hàm innerFunction từ outerFunction
  return innerFunction;
}

// Tạo một closure bằng cách gọi outerFunction với outerValue là 10
const closureExample = outerFunction(10);

// Gọi closure với innerValue là 5
closureExample(5); // Kết quả là 15
```

- `outerFunction` nhận một tham số `outerValue`.
- Bên trong `outerFunction`, có một hàm bên trong gọi là `innerFunction`, nhận một tham số `innerValue`.
- `innerFunction` có thể truy cập outerValue của `outerFunction` (biến nằm ở phạm vi bên ngoài của nó). Điều này là một ví dụ về closure.
- `outerFunction` trả về `innerFunction`.
- Khi gọi `outerFunction(10)`, nó trả về một hàm mới (`innerFunction`) và lưu giữ giá trị 10 của `outerValue`. Biến `closureExample` bây giờ là một closure với giá trị 10 của `outerValue`.
- Khi gọi `closureExample(5)`, nó sẽ thực hiện console.log(10 + 5), và kết quả là 15.

### 32. Các kĩ thuật copy object

- `Shallow copy` và `deep copy` là hai kỹ thuật chính để sao chép đối tượng trong JavaScript. Dưới đây là giải thích chi tiết về cả hai:

**1. Shallow Copy (Sao Chép Nông):**

- Định Nghĩa: Shallow copy là quá trình sao chép đối tượng chỉ ở mức độ bề mặt, không sao chép các đối tượng lồng nhau mà chỉ sao chép tham chiếu đến chúng.
- Sử dụng spread operator ({...}) hoặc Object.assign() để sao chép các thuộc tính của đối tượng. Dùng slice() cho mảng.

```javascript
const originalObject = { key: { nestedKey: "value" } };

// Shallow copy sử dụng spread operator
const shallowCopy = { ...originalObject };

// Shallow copy sử dụng spread operator Object.assign
const shallowCopy = Object.assign({}, originalObject);

// Thay đổi giá trị trong shallow copy sẽ ảnh hưởng đến originalObject
shallowCopy.key.nestedKey = "new value";
console.log(originalObject.key.nestedKey); // Output: 'new value'
```

**2. Deep Copy (Sao Chép Sâu):**

- Định Nghĩa: Deep copy là quá trình sao chép toàn bộ cấu trúc của đối tượng, bao gồm cả các đối tượng lồng nhau, không chia sẻ tham chiếu.
- Deep copy có thể tốn nhiều tài nguyên hơn về mặt hiệu suất so với shallow copy, đặc biệt là khi đối tượng có cấu trúc lồng nhau phức tạp.
- Cách Thực Hiện Deep Copy:
  - Sử dụng các thư viện bên ngoài như Lodash có hàm cloneDeep().
  - Sử dụng JSON.stringify() và JSON.parse() (nhưng không thích hợp cho đối tượng chứa các giá trị không thể biểu diễn trong JSON như hàm).

```javascript
const originalObject = { key: { nestedKey: "value" } };

// Deep copy sử dụng JSON.stringify và JSON.parse
const deepCopy = JSON.parse(JSON.stringify(originalObject));

// Thay đổi giá trị trong deep copy không ảnh hưởng đến originalObject
deepCopy.key.nestedKey = "new value";
console.log(originalObject.key.nestedKey); // Output: 'value'
```
