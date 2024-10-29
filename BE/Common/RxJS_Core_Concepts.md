
# RxJS - Tài liệu chi tiết

RxJS (Reactive Extensions for JavaScript) là một thư viện mạnh mẽ giúp xử lý và quản lý các luồng dữ liệu bất đồng bộ và sự kiện. Dưới đây là các khái niệm chính cần nắm rõ khi làm việc với RxJS:

## 1. Observable (Quan sát được)
- **Observable** là một luồng dữ liệu (có thể là dữ liệu đồng bộ hoặc bất đồng bộ) mà bạn có thể "quan sát" hoặc "lắng nghe".
- Observable có thể phát ra ba loại thông báo:
  - `next`: phát ra một giá trị mới.
  - `error`: phát ra lỗi và ngừng luồng.
  - `complete`: phát tín hiệu hoàn thành luồng.

**Ví dụ:**
```javascript
import { Observable } from 'rxjs';

const observable = new Observable(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();
});

observable.subscribe({
  next(x) { console.log('Received:', x); },
  complete() { console.log('Done'); }
});
```

## 2. Observer (Người quan sát)
- **Observer** là một đối tượng có thể chứa các phương thức để lắng nghe `next`, `error`, và `complete` từ một `Observable`.
- Khi `Observable` phát ra dữ liệu, `Observer` sẽ xử lý dữ liệu đó qua các hàm đã khai báo.

**Ví dụ:**
```javascript
const observer = {
  next: value => console.log('Next:', value),
  error: err => console.error('Error:', err),
  complete: () => console.log('Complete!')
};

observable.subscribe(observer);
```

## 3. Subscription (Đăng ký)
- **Subscription** đại diện cho mối liên kết giữa `Observable` và `Observer`.
- Khi sử dụng `subscribe`, bạn sẽ tạo ra một `Subscription`. Để ngừng lắng nghe, bạn có thể gọi `unsubscribe`.

**Ví dụ:**
```javascript
const subscription = observable.subscribe(observer);

// Hủy đăng ký sau 2 giây
setTimeout(() => subscription.unsubscribe(), 2000);
```

## 4. Operators (Toán tử)
RxJS có rất nhiều toán tử giúp chuyển đổi và thao tác trên các luồng dữ liệu. Các toán tử này có thể được kết hợp với nhau qua `pipe`.

- **Creation Operators** (Toán tử tạo): Tạo `Observable` mới.
  - `of`: Tạo một `Observable` từ các giá trị cụ thể.
  - `from`: Tạo một `Observable` từ mảng, promise, hoặc iterable.
  - `interval`: Phát ra giá trị cách nhau một khoảng thời gian cố định.

- **Transformation Operators** (Toán tử biến đổi): Thay đổi dữ liệu trong luồng.
  - `map`: Áp dụng hàm chuyển đổi cho mỗi giá trị.
  - `mergeMap`: Ánh xạ và gộp các `Observable`.
  - `switchMap`: Hủy `Observable` trước đó nếu có `Observable` mới phát ra.

- **Filtering Operators** (Toán tử lọc): Lọc các giá trị trong luồng.
  - `filter`: Lọc giá trị theo điều kiện.
  - `take`: Lấy một số lượng giá trị nhất định.
  - `debounceTime`: Chỉ phát giá trị sau một khoảng thời gian xác định.

**Ví dụ sử dụng `pipe` và toán tử `map`:**
```javascript
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

of(1, 2, 3).pipe(
  map(x => x * 2)
).subscribe(console.log); // Output: 2, 4, 6
```

## 5. Subjects
- **Subject** là một kiểu `Observable` đặc biệt vừa có thể phát (`emit`) dữ liệu vừa có thể lắng nghe nó.
- Các loại `Subject` phổ biến:
  - **Subject**: Phát dữ liệu cho tất cả các subscriber cùng lúc.
  - **BehaviorSubject**: Giữ giá trị mới nhất và phát lại cho subscriber mới.
  - **ReplaySubject**: Phát lại tất cả các giá trị trước đó (hoặc số lượng nhất định) cho subscriber mới.
  - **AsyncSubject**: Chỉ phát giá trị cuối cùng và chỉ khi luồng `complete`.

**Ví dụ với `BehaviorSubject`:**
```javascript
import { BehaviorSubject } from 'rxjs';

const behaviorSubject = new BehaviorSubject(0);

behaviorSubject.subscribe(value => console.log('Subscriber 1:', value));
behaviorSubject.next(1);
behaviorSubject.subscribe(value => console.log('Subscriber 2:', value));
behaviorSubject.next(2);
```

## 6. Schedulers (Bộ lập lịch)
- **Schedulers** quản lý thời gian thực thi của `Observable`.
- Các kiểu `Scheduler`:
  - **asyncScheduler**: Thực thi bất đồng bộ.
  - **queueScheduler**: Thực thi đồng bộ trong hàng đợi.
  - **animationFrameScheduler**: Sử dụng `requestAnimationFrame`, thích hợp cho việc xử lý đồ họa.

## 7. Multicasting (Phát đa hướng)
- **Multicasting** cho phép một `Observable` chia sẻ luồng dữ liệu cho nhiều `Observer` mà không cần khởi động lại quá trình phát.
- Các `Subject` thường được dùng để triển khai multicasting (`share`, `shareReplay`).

**Ví dụ với `share` operator:**
```javascript
import { interval } from 'rxjs';
import { share, take } from 'rxjs/operators';

const source$ = interval(1000).pipe(take(5), share());
source$.subscribe(val => console.log('Subscriber 1:', val));
setTimeout(() => source$.subscribe(val => console.log('Subscriber 2:', val)), 2000);
```

## 8. Hot vs Cold Observable
- **Cold Observable**: Chỉ phát dữ liệu khi có subscriber và bắt đầu từ đầu cho mỗi subscriber.
- **Hot Observable**: Phát dữ liệu ngay cả khi không có subscriber, các subscriber mới sẽ chỉ nhận dữ liệu tại thời điểm đăng ký.

## 9. Error Handling (Xử lý lỗi)
- RxJS có các toán tử để xử lý lỗi trong `Observable`, giúp tránh làm gián đoạn luồng dữ liệu.
  - **catchError**: Bắt lỗi và xử lý, có thể thay thế luồng lỗi bằng một `Observable` khác.
  - **retry**: Thử lại luồng khi gặp lỗi.
  - **retryWhen**: Xác định điều kiện hoặc thời gian thử lại luồng.

**Ví dụ với `catchError`:**
```javascript
import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

throwError('Error!').pipe(
  catchError(err => of('Handled error:', err))
).subscribe(console.log);
```

## 10. Marble Testing (Kiểm thử Marble)
- **Marble Testing** biểu diễn các luồng dữ liệu và thời gian xử lý qua biểu đồ Marble, giúp dễ dàng kiểm tra và phân tích các toán tử.
- Trong Marble, các ký hiệu biểu diễn các sự kiện `next`, `error`, và `complete` theo thời gian.

---

## Ví dụ Thực Tế

### Tạo một Observable từ sự kiện `click` và lắng nghe sự kiện
```javascript
import { fromEvent } from 'rxjs';

const clicks = fromEvent(document, 'click');
clicks.subscribe(x => console.log(x));
```

### Sử dụng `map` và `filter` để chỉ lấy số chẵn và nhân đôi giá trị
```javascript
import { of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

of(1, 2, 3, 4, 5).pipe(
  filter(x => x % 2 === 0),
  map(x => x * 2)
).subscribe(console.log); // Output: 4, 8
```

## Tổng Kết
RxJS là một thư viện mạnh mẽ cho lập trình phản ứng (Reactive Programming) trong JavaScript. Nắm vững các khái niệm `Observable`, `Observer`, `Operators`, và `Subject` sẽ giúp bạn tối ưu hóa việc xử lý luồng dữ liệu bất đồng bộ. Với khả năng quản lý hiệu quả các sự kiện và dữ liệu bất đồng bộ, RxJS là công cụ không thể thiếu trong phát triển ứng dụng hiện đại.
