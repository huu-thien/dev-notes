## Introduction to Event Emitter

Trong Node.js, `EventEmitter` là một phần của core module `'events'`, cung cấp cơ chế để tạo và quản lý các sự kiện tùy chỉnh. `EventEmitter` cho phép các đối tượng trong ứng dụng Node.js giao tiếp với nhau thông qua các sự kiện, cung cấp một cách để thực hiện lập trình hướng sự kiện (event-driven programming).

## EventEmitter Class

Lớp `EventEmitter` là nền tảng của module 'events'. Có thể sử dụng lớp này để tạo ra các đối tượng có khả năng phát và lắng nghe các sự kiện

```js
const EventEmitter = require("events");
const myEmitter = new EventEmitter();

myEmitter.on("event", () => {
  console.log("An event occurred!");
});

myEmitter.emit("event");
```

Trong ví dụ này:

- `EventEmitter` được import từ module `'events'`.
- `myEmitter` là một instance của EventEmitter.
- `myEmitter.on('event', callback)` đăng ký một listener cho sự kiện 'event'.
- `myEmitter.emit('event')` phát ra sự kiện 'event', làm cho callback đã đăng ký được gọi.

## Methods & Events

| **Phương thức / Sự kiện**     | **Mô tả**                                                               | **Ví dụ**                                                                                                          |
| ----------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Phương thức**               |                                                                         |                                                                                                                    |
| `on(event, listener)`         | Đăng ký một listener cho sự kiện được chỉ định.                         | `myEmitter.on('event', () => { console.log('An event occurred!'); });`                                             |
| `emit(event, [...args])`      | Phát ra sự kiện với các tham số tùy chọn.                               | `myEmitter.emit('event');`                                                                                         |
| `once(event, listener)`       | Đăng ký một listener sẽ chỉ được gọi một lần cho sự kiện được chỉ định. | `myEmitter.once('event', () => { console.log('This will be logged only once.'); });`                               |
| `off(event, listener)`        | Hủy đăng ký một listener cho sự kiện được chỉ định.                     | `const listener = () => console.log('Hello!'); myEmitter.on('event', listener); myEmitter.off('event', listener);` |
| `removeAllListeners([event])` | Hủy đăng ký tất cả các listener cho sự kiện được chỉ định.              | `myEmitter.removeAllListeners('event');`                                                                           |
| `listenerCount(event)`        | Trả về số lượng listener đăng ký cho sự kiện được chỉ định.             | `console.log(myEmitter.listenerCount('event'));`                                                                   |
| **Sự kiện**                   |                                                                         |                                                                                                                    |
| `newListener`                 | Được phát ra khi một listener mới được thêm vào.                        | `myEmitter.on('newListener', (event, listener) => { console.log('Listener added for event: ' + event); });`        |
| `removeListener`              | Được phát ra khi một listener bị loại bỏ.                               | `myEmitter.on('removeListener', (event, listener) => { console.log('Listener removed for event: ' + event); });`   |

**Chi tiết các phương thức và sự kiện**

- `on(event, listener)`: Đăng ký một listener cho sự kiện được chỉ định. Listener sẽ được gọi mỗi khi sự kiện được phát ra.

- `emit(event, [...args])`: Phát ra sự kiện với các tham số tùy chọn. Tất cả các listener đăng ký cho sự kiện này sẽ được gọi theo thứ tự đăng ký.

- `once(event, listener)`: Đăng ký một listener sẽ chỉ được gọi một lần cho sự kiện được chỉ định. Sau khi sự kiện được phát ra và listener được gọi, listener sẽ tự động bị hủy đăng ký.

- `off(event, listener)`: Hủy đăng ký một listener cho sự kiện được chỉ định. Listener sẽ không còn được gọi khi sự kiện được phát ra nữa.

- `removeAllListeners([event])`: Hủy đăng ký tất cả các listener cho sự kiện được chỉ định. Nếu không truyền tham số event, tất cả các listener của tất cả các sự kiện sẽ bị hủy đăng ký.

- `listenerCount(event)`: Trả về số lượng listener hiện đang đăng ký cho sự kiện được chỉ định.

- `newListener`: Sự kiện này được phát ra bất cứ khi nào một listener mới được thêm vào. Được truyền vào với tên của sự kiện và chính listener được thêm vào.

- `removeListener`: Sự kiện này được phát ra bất cứ khi nào một listener bị loại bỏ. Được truyền vào với tên của sự kiện và chính listener bị loại bỏ.
