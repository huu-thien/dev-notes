# RxJS (Reactive Extensions for JavaScript)

- RxJS là một thư viện để lập trình phản ứng (reactive programming) sử dụng Observables. RxJS cho phép bạn làm việc với các luồng dữ liệu bất đồng bộ (asynchronous data streams) một cách dễ dàng và hiệu quả.

## Các khái niệm cơ bản

### Observable

- Là một đối tượng đại diện cho một luồng dữ liệu có thể được theo dõi. Bạn có thể tạo Observable từ nhiều nguồn dữ liệu khác nhau như sự kiện DOM, promise, hoặc các luồng dữ liệu khác.

- Ví dụ

```js
import { Observable } from "rxjs";

const observable = new Observable((subscriber) => {
  subscriber.next("Hello");
  subscriber.next("World");
  subscriber.complete();
});

observable.subscribe({
  next(value) {
    console.log(value);
  },
  complete() {
    console.log("Done!");
  },
});
// Hello
// World
// Done!
```

### Observer

- Là một đối tượng nhận các thông báo từ `Observable`. Một Observer có thể có các phương thức `next`, `error`, và `complete` để xử lý các giá trị phát ra, lỗi, và sự hoàn thành của `Observable`.
- Ví dụ

```js
const observable = new Observable((subscriber) => {
  subscriber.next("Hello");
  subscriber.next("World");
  subscriber.complete();
});

const observer = {
  next: (value) => console.log("Value:", value),
  error: (err) => console.error("Error:", err),
  complete: () => console.log("Completed!"),
};

observable.subscribe(observer);

// Value: Hello
// Value: World
// Completed!
```

### Subscription

- Là quá trình mà `Observer` đăng ký (`subscribe`) để nhận dữ liệu từ `Observable`. Khi đăng ký, `Observer` sẽ bắt đầu nhận các giá trị mà `Observable` phát ra.
- Ví dụ

```js
const subscription = observable.subscribe((value) => console.log(value));
// Hủy bỏ subscription
subscription.unsubscribe();
// Kết quả: Không có kết quả nào sau khi hủy bỏ.
```

## Publish và Subscribe Mechanism

- **Publish**: Là một toán tử trong `RxJS` cho phép bạn chia sẻ một `Observable` giữa nhiều `Subscribers`. Điều này giúp tránh việc tạo ra nhiều luồng dữ liệu độc lập từ cùng một nguồn.
- **Subscribe**: Là hành động mà `Observer` đăng ký để nhận dữ liệu từ `Observable`. Một `Observable` chỉ bắt đầu phát dữ liệu khi có ít nhất một Subscriber đăng ký.

- Ví dụ

```js
import { Observable, Subject } from "rxjs";
import { publish, refCount } from "rxjs/operators";

// Tạo một Observable phát ra giá trị mỗi giây
const source = new Observable((subscriber) => {
  let count = 0;
  const interval = setInterval(() => {
    count++;
    subscriber.next(count);
  }, 1000);

  // Dọn dẹp khi Observer hủy đăng ký
  return () => clearInterval(interval);
});

// Sử dụng publish để chia sẻ Observable
const sharedObservable = source.pipe(publish(), refCount());

// Đăng ký hai Subscribers
sharedObservable.subscribe((value) => console.log("Subscriber 1:", value));
setTimeout(() => {
  sharedObservable.subscribe((value) => console.log("Subscriber 2:", value));
}, 3000); // Subscriber 2 sẽ đăng ký sau 3 giây
```

- Kết quả

```yaml
Subscriber 1: 1
Subscriber 1: 2
Subscriber 1: 3
Subscriber 1: 4
Subscriber 2: 4
Subscriber 1: 5
Subscriber 2: 5
Subscriber 1: 6
Subscriber 2: 6
```

## Subject

- **Subject**: Là một dạng đặc biệt của `Observable` (có khả năng multicast) cho phép phát ra giá trị mới và cũng có thể đăng ký các `Observer`. `Subjects` có thể được coi như một kênh phát sóng, mà bạn có thể phát ra giá trị đến nhiều `Subscribers`.
- Sử dụng khi ta muốn nhiều `observer` nhận dữ liệu từ cùng một nguồn.

```js
import { Subject } from "rxjs";

const subject = new Subject();

subject.subscribe((value) => console.log("Subscriber 1:", value));
subject.next("Data 1");

subject.subscribe((value) => console.log("Subscriber 2:", value));
subject.next("Data 2");
```

- Kết quả

```yaml
Subscriber 1: Data 1
Subscriber 2: Data 2
```

- **BehaviorSubject**: Là một loại `Subject` giữ lại giá trị hiện tại của nó và phát lại giá trị đó cho bất kỳ `Observer` nào mới đăng ký. Lưu trữ giá trị hiện tại và phát lại giá trị đó cho `subscriber` mới. Khi một `Observer` đăng ký vào `BehaviorSubject`, nó sẽ nhận được giá trị mới nhất ngay lập tức.
- Sử dụng khi ta muốn đảm bảo mọi `subscriber` nhận được giá trị hiện tại.

```js
import { BehaviorSubject } from "rxjs";

const behaviorSubject = new BehaviorSubject("Initial Value");

behaviorSubject.subscribe((value) => console.log("Subscriber 1:", value));
behaviorSubject.next("New Value 1");

behaviorSubject.subscribe((value) => console.log("Subscriber 2:", value));
behaviorSubject.next("New Value 2");
```

- Kết quả

```yaml
Subscriber 1: Initial Value
Subscriber 1: New Value 1
Subscriber 2: New Value 1
Subscriber 1: New Value 2
Subscriber 2: New Value 2
```

- **ReplaySubject**: `Subject` lưu tất cả các giá trị đã phát và phát lại các giá trị đó cho `subscriber` mới. Sử dụng khi ta cần đảm bảo rằng các subscriber nhận được tất cả các giá trị đã phát.

```js
const { ReplaySubject } = rxjs;

// Tạo một ReplaySubject với buffer size là 2
const replaySubject = new ReplaySubject(2);

// Đăng ký Observer đầu tiên
replaySubject.subscribe({
  next: (value) => console.log(`Observer 1: ${value}`),
});

// Phát một số giá trị
replaySubject.next("Value 1");
replaySubject.next("Value 2");
replaySubject.next("Value 3");

// Đăng ký Observer thứ hai
replaySubject.subscribe({
  next: (value) => console.log(`Observer 2: ${value}`),
});

// Phát thêm một giá trị
replaySubject.next("Value 4");
```

- Kết quả

```yaml
Observer 1: Value 1
Observer 1: Value 2
Observer 1: Value 3
Observer 2: Value 2
Observer 2: Value 3
Observer 2: Value 4
```

- **AsyncSubject**: `Subject` phát ra giá trị cuối cùng khi `observable` hoàn thành. Sử dụng khi ta chỉ cần giá trị cuối cùng và chỉ khi hoàn tất.

```js
// Import AsyncSubject từ rxjs
import { AsyncSubject } from "rxjs";

// Tạo một AsyncSubject
const asyncSubject = new AsyncSubject();

// Đăng ký Observer
asyncSubject.subscribe({
  next: (value) => console.log(`Observer: ${value}`),
  complete: () => console.log("Completed!"),
});

// Phát một số giá trị
asyncSubject.next("Value 1");
asyncSubject.next("Value 2");
asyncSubject.next("Value 3");

// Hoàn thành subject
asyncSubject.complete();
```

```yaml
Observer: Value 3
Completed!
```

## Toán tử (Operators)

- **of**: Tạo một `Observable` từ một hoặc nhiều giá trị. Biến đổi tham số truyền vào thành 1 chuỗi `observable` :
  - Nếu 1 `promise` được truyền vào, hàm `of` sẽ không đợi `promise` hoàn thành mà `emit` ra 1 `promise`
  - Nếu truyền 1 array(hoặc string), `emit` toàn bộ array(hoặc string), nếu truyền nhiều tham số, `emit` tuần tự từng tham số

```js
import { of } from "rxjs";

const observableOf = of(1, 2, 3);
observableOf.subscribe((value) => console.log("Of Value:", value));
```

```yaml
Of Value: 1
Of Value: 2
Of Value: 3
```

- **from**: Tạo một `Observable` từ một promise, một mảng, hoặc một iterable khác. Biến đổi tham số truyền vào, array, promise, đối tượng có thể lặp,…, thành `Observable`:
  - Nếu 1 `promise` được truyền vào, hàm `from` sẽ đợi nó hoàn thành và `emit` ra kết quả.
  - Nếu 1 array các `promise` được truyền vào, hàm `from` sẽ không đợi `promise` hoàn thành mà sẽ `emit` từng `promise`
  - Nếu truyền vào 1 array(hoặc string), sẽ `emit` ra từng phần tử của array (hoặc string )đó

```js
import { from } from "rxjs";

const array = [1, 2, 3];
const observableFrom = from(array);
observableFrom.subscribe((value) => console.log("From Value:", value));

const promise1 = new Promise((resolve, reject) => {
  resolve(123);
});
const promise2 = new Promise((resolve, reject) => {
  resolve(456);
});

const observableFrom2 = from([promise1, promise2]);
observableFrom2.subscribe((value) => console.log("From value: ", value));
```

```yaml
From Value: 1
From Value: 2
From Value: 3

From value:  Promise {<fulfilled>: 123}
From value:  Promise {<fulfilled>: 456}
```

- **pipe**: Làm cho việc kết hợp nhiều toán tử trở nên dễ dàng hơn. Bạn có thể truyền các toán tử như `map`, `switchMap`, `concatMap`, `mergeMap`, `catchError`, `throwError`.

## Các toán tử chính

- **map**: gần giống như phương thức `map` của Array. Chuyển đổi các giá trị phát ra từ một `Observable` bằng cách áp dụng một hàm.
- Thường được sử dụng để biến đổi data thành dạng data cần thiết để trả về cuối cùng

```js
import { of } from "rxjs";
import { map } from "rxjs/operators";

const numbers = of(1, 2, 3);
const squaredNumbers = numbers.pipe(map((value) => value * value));

squaredNumbers.subscribe((value) => console.log("Squared:", value));
```

```yaml
Squared: 1
Squared: 4
Squared: 9
```

- **switchMap**: Thay thế một `Observable` cũ bằng một `Observable` mới khi có giá trị mới phát ra. Thường được sử dụng trong các tác vụ tìm kiếm tự động, nơi bạn muốn chỉ giữ lại kết quả từ tìm kiếm gần nhất.
  - Nhận vào 1 callback function, có parameter là value mà operator trước đó, hoặc observable emit ra - src value
  - Biến mỗi src value thành 1 `observable` và chạy xử lý luồng data của `observable` đó, nếu trong thời gian xử lý `observable` đó, có src value mới được emit từ `observable` gốc thì `switchMap` hủy xử lý `observable`, chuyển sang subscribe value mới mà `observable` gốc emit

```js
import { fromEvent } from "rxjs";
import { switchMap, map } from "rxjs/operators";

const input = document.getElementById("search-input");

fromEvent(input, "input")
  .pipe(
    map((event) => event.target.value),
    switchMap((searchTerm) => {
      return of(`Results for ${searchTerm}`);
    })
  )
  .subscribe((result) => console.log(result));
// Kết quả: Kết quả sẽ hiển thị trong console mỗi khi có sự thay đổi trong input.
// Result for 1
// Result for 12
// Result for 123
// Result for 1234
// Result for 12345
```

- **concatMap**: Lần lượt xử lý từng `Observable` mà không bao giờ hủy bỏ một `Observable` trước đó. Sử dụng khi bạn cần thực hiện các tác vụ tuần tự.
  - Nhận vào 1 `callback function`, có parameter là value mà `observable` emit ra - src value
  - Biến mỗi src value được `emit` bởi `observable` gốc thành mỗi `observable` mới sau đó `merge` vào `observable` gốc và chờ hoàn thành luồng xử lý của `observable` mới đó trước khi nhận value tiếp theo từ `observable` gốc

```js
import { of } from "rxjs";
import { concatMap, delay } from "rxjs/operators";

const source = of("A", "B", "C");
source
  .pipe(
    concatMap((val) => of(val).pipe(delay(1000))) // delay 1 giây cho mỗi giá trị
  )
  .subscribe((value) => console.log(value));
// Luồng hoạt động:
// 1. source phát ra "A".
// 2. concatMap chuyển "A" thành một Observable và trì hoãn phát ra "A" trong 1 giây.
// 3. Sau 1 giây, "A" được in ra console.
// 4. Tiếp theo, source phát ra "B".
// 5. Lặp lại quá trình: "B" được trì hoãn trong 1 giây và sau đó in ra console.
// 6. Cuối cùng, source phát ra "C" và cũng được trì hoãn trong 1 giây.
```

```yaml
A (sau 1 giây)
B (sau 1 giây)
C (sau 1 giây)
```

- **mergeMap**: Giống như `concatMap` nhưng cho phép các `Observable` phát ra đồng thời. Điều này có thể dẫn đến việc nhận được các giá trị phát ra không theo thứ tự.
  - Nhận vào 1 `callback function`, có parameter là value mà operator trước đó, hoặc observable emit ra - src value
  - Biến mỗi src value thành mỗi `observable` và `merge` `observable` đó vào `observable` gốc của `mergeMap`, nếu có nhiều `observable` con bên trong, các `observable` con đó có thể chạy song song với nhau

```js
import { of } from "rxjs";
import { mergeMap, delay } from "rxjs/operators";

const source = of("A", "B", "C");
source
  .pipe(
    mergeMap((val) => of(val).pipe(delay(1000))) // tất cả phát đồng thời
  )
  .subscribe((value) => console.log(value));
```

```yaml
// Tất cả sau 1 giây
A
B
C
```

- **catchError**: Xử lý các lỗi phát sinh trong luồng `Observable`, cho phép bạn trả về một `Observable` khác hoặc một giá trị mặc định.

```js
import { of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

const sourceWithError = throwError("An error occurred!");

sourceWithError
  .pipe(
    catchError((error) => {
      console.error(error);
      return of("Error handled, returning default value");
    })
  )
  .subscribe((value) => console.log(value));
```

```yaml
Error: An error occurred!
Error handled, returning default value
```

- **throwError**: Tạo một Observable phát ra lỗi.

```js
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

// Tạo một Observable phát ra lỗi
const errorObservable = throwError("An error occurred!");

// Đăng ký Observer với xử lý lỗi
errorObservable
  .pipe(
    catchError((err) => {
      console.error("Caught error:", err);
      // Trả về một Observable khác hoặc một giá trị mặc định
      return throwError("Handled error: Returning this instead");
    })
  )
  .subscribe({
    next: (value) => console.log("Value:", value),
    error: (err) => console.error("Error:", err),
    complete: () => console.log("Completed!"),
  });
```

```yaml
Caught error: An error occurred!
Error: Handled error: Returning this instead
```

Giải thích kết quả:

- Caught error: Khi `Observable` gặp lỗi (throwError phát ra lỗi), nó sẽ kích hoạt hàm `catchError`, nơi bạn có thể xử lý lỗi.

- Error: Sau khi xử lý, nếu bạn quyết định phát ra một lỗi mới (như trong ví dụ trên), `Observer` sẽ nhận được thông báo lỗi mới đó.

Lưu ý:

- `throwError` tạo ra một `Observable` mà khi được gọi, nó sẽ phát ra lỗi ngay lập tức.
- Bạn có thể sử dụng `catchError` để xử lý lỗi và quyết định cách tiếp tục (trả về một giá trị khác, hoặc phát ra một lỗi mới).
