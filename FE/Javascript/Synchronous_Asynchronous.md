  

# Đồng Bộ và Bất Đồng Bộ trong JavaScript

  

## 1. Code Đồng Bộ (Synchronous Code)

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

  

## 2. Code Bất Đồng Bộ (Asynchronous Code)

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

  

## 3. Tại Sao JavaScript Lại Bất Đồng Bộ?

JavaScript là ngôn ngữ đơn luồng (single-threaded), có nghĩa là nó chỉ có một ngăn xếp thực thi (call stack). Nếu JavaScript chỉ sử dụng cách thực thi đồng bộ, mọi tác vụ dài như gọi API, xử lý file, hay truy vấn cơ sở dữ liệu sẽ khiến toàn bộ chương trình bị tắc nghẽn cho đến khi tác vụ đó hoàn thành. Điều này sẽ làm cho giao diện người dùng bị đóng băng hoặc trải nghiệm người dùng trở nên chậm chạp.

  

**Bất đồng bộ** được giới thiệu để giải quyết vấn đề này bằng cách cho phép JavaScript xử lý các tác vụ dài mà không làm gián đoạn luồng thực thi chính. Thay vì chặn, các tác vụ này được xử lý riêng biệt và JavaScript tiếp tục thực thi các dòng code khác. Khi tác vụ bất đồng bộ hoàn thành, nó sẽ "quay lại" và đưa kết quả vào ngăn xếp thực thi thông qua cơ chế **callback**, **Promises**, hoặc **async/await**.

  

- **Event Loop**: JavaScript sử dụng một cơ chế gọi là `event loop` để quản lý cách các tác vụ bất đồng bộ được xử lý. Khi một tác vụ bất đồng bộ hoàn thành, nó sẽ được đưa vào hàng đợi (queue) và chờ đợi `event loop` đưa nó trở lại ngăn xếp thực thi.

  

## 4. Các Cơ Chế Bất Đồng Bộ Phổ Biến

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

  ```javascript

  async function main() {

    const result = await doSomethingAsync();

    console.log(result); // In ra "Kết quả đã sẵn sàng" sau 1 giây

  }

  

  main();

  ```

  

Nhờ cơ chế bất đồng bộ, JavaScript có thể xử lý nhiều tác vụ đồng thời mà không làm gián đoạn trải nghiệm người dùng, đặc biệt là trong các ứng dụng web hiện đại.


  

# Các Trạng Thái của Promise trong JavaScript

  

## 1. Promise là gì?

**Promise** là một đối tượng trong JavaScript đại diện cho một giá trị có thể có ngay bây giờ, trong tương lai, hoặc không bao giờ có. Nó được sử dụng để xử lý các tác vụ bất đồng bộ một cách hiệu quả và dễ đọc hơn.

  

## 2. Các Trạng Thái của Promise

Một Promise có thể ở trong một trong ba trạng thái sau:

  

1. **Pending** (Đang chờ)

2. **Fulfilled** (Hoàn thành)

3. **Rejected** (Bị từ chối)

  

### 2.1. Pending (Đang chờ)

- **Mô tả**: Đây là trạng thái khởi đầu của một Promise khi nó được tạo ra. Trong trạng thái này, Promise đang chờ đợi để được giải quyết hoặc bị từ chối.

- **Đặc điểm**:

  - Giá trị kết quả (result value) chưa được xác định.

  - Không có hành động nào được thực hiện với giá trị kết quả.

  

**Ví dụ**:

```javascript

const promise = new Promise((resolve, reject) => {

  // Thực hiện một số tác vụ bất đồng bộ

});

console.log(promise); // Promise { <pending> }

```

  

### 2.2. Fulfilled (Hoàn thành)

- **Mô tả**: Promise chuyển sang trạng thái "Fulfilled" khi tác vụ bất đồng bộ hoàn thành thành công và trả về một giá trị kết quả.

- **Đặc điểm**:

  - Giá trị kết quả được xác định và có sẵn.

  - Phương thức `.then()` được gọi với giá trị kết quả.

  

**Ví dụ**:

```javascript

const promise = new Promise((resolve, reject) => {

  setTimeout(() => {

    resolve('Dữ liệu đã được tải thành công!');

  }, 2000);

});

  

promise.then(result => {

  console.log(result); // "Dữ liệu đã được tải thành công!" sau 2 giây

});

```

  

### 2.3. Rejected (Bị từ chối)

- **Mô tả**: Promise chuyển sang trạng thái "Rejected" khi tác vụ bất đồng bộ gặp lỗi hoặc không thể hoàn thành, và trả về một lý do từ chối (thường là một đối tượng lỗi).

- **Đặc điểm**:

  - Một lỗi hoặc lý do từ chối được xác định.

  - Phương thức `.catch()` được gọi với lỗi hoặc lý do từ chối.

  

**Ví dụ**:

```javascript

const promise = new Promise((resolve, reject) => {

  setTimeout(() => {

    reject(new Error('Đã xảy ra lỗi khi tải dữ liệu!'));

  }, 2000);

});

  

promise

  .then(result => {

    console.log(result);

  })

  .catch(error => {

    console.error(error.message); // "Đã xảy ra lỗi khi tải dữ liệu!" sau 2 giây

  });

```

  

## 3. Biểu Đồ Trạng Thái

```

        [Khởi tạo]

            |

         Pending

        /       \

   Fulfilled   Rejected

```

- **Lưu ý**: Một Promise chỉ có thể chuyển từ trạng thái **Pending** sang **Fulfilled** hoặc **Rejected**. Khi đã chuyển sang **Fulfilled** hoặc **Rejected**, trạng thái của Promise sẽ không thay đổi nữa (immutable).

  

## 4. Xử Lý Promise

### 4.1. Phương thức `.then()`

- Được sử dụng để xử lý kết quả khi Promise được **Fulfilled**.

- Cú pháp:

  ```javascript

  promise.then(onFulfilled, onRejected);

  ```

  - `onFulfilled`: Hàm được gọi khi Promise được hoàn thành.

  - `onRejected`: (Tùy chọn) Hàm được gọi khi Promise bị từ chối.

  

**Ví dụ**:

```javascript

promise.then(

  result => {

    console.log('Thành công:', result);

  },

  error => {

    console.error('Lỗi:', error);

  }

);

```

  

### 4.2. Phương thức `.catch()`

- Được sử dụng để xử lý lỗi khi Promise bị **Rejected**.

- Cú pháp:

  ```javascript

  promise.catch(onRejected);

  ```

**Ví dụ**:

```javascript

promise

  .then(result => {

    console.log('Thành công:', result);

  })

  .catch(error => {

    console.error('Lỗi:', error);

  });

```

  

### 4.3. Phương thức `.finally()`

- Được gọi bất kể Promise được **Fulfilled** hay **Rejected**.

- Sử dụng để thực hiện các hành động dọn dẹp hoặc kết thúc.

- Cú pháp:

  ```javascript

  promise.finally(onFinally);

  ```

**Ví dụ**:

```javascript

promise

  .then(result => {

    console.log('Thành công:', result);

  })

  .catch(error => {

    console.error('Lỗi:', error);

  })

  .finally(() => {

    console.log('Hoàn tất quá trình xử lý Promise.');

  });

```

  

## 5. Kết Hợp Nhiều Promise

### 5.1. `Promise.all()`

- Chờ tất cả các Promise trong một mảng được **Fulfilled** hoặc trả về lỗi nếu một trong số chúng bị **Rejected**.

- **Ví dụ**:

  ```javascript

  const promise1 = Promise.resolve(3);

  const promise2 = new Promise((resolve) => setTimeout(resolve, 2000, 'foo'));

  const promise3 = fetch('https://api.example.com/data');

  

  Promise.all([promise1, promise2, promise3])

    .then(results => {

      console.log(results); // [3, 'foo', Response]

    })

    .catch(error => {

      console.error(error);

    });

  ```

  

### 5.2. `Promise.race()`

- Trả về kết quả của Promise đầu tiên được **Fulfilled** hoặc **Rejected** trong mảng.

- **Ví dụ**:

  ```javascript

  const promise1 = new Promise((resolve) => setTimeout(resolve, 100, 'Nhanh'));

  const promise2 = new Promise((resolve) => setTimeout(resolve, 500, 'Chậm'));

  

  Promise.race([promise1, promise2])

    .then(result => {

      console.log(result); // "Nhanh"

    });

  ```

  

## 6. Lợi Ích của Việc Sử Dụng Promise

- **Cải thiện khả năng đọc code**: Giúp tránh việc lồng nhau quá nhiều (callback hell).

- **Xử lý lỗi hiệu quả**: Dễ dàng bắt và xử lý lỗi trong các tác vụ bất đồng bộ.

- **Dễ dàng kết hợp và chuỗi hóa các tác vụ bất đồng bộ**: Cho phép thực hiện các tác vụ tuần tự hoặc song song một cách dễ dàng.

  

## 7. Kết Luận

**Promise** là một công cụ mạnh mẽ trong JavaScript để xử lý các tác vụ bất đồng bộ một cách hiệu quả và dễ dàng. Hiểu rõ về các trạng thái của Promise và cách xử lý chúng sẽ giúp bạn viết code rõ ràng, dễ bảo trì và ít lỗi hơn.