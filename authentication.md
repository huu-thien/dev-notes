# 1. Authentication là gì? Token based authentication là gì?

- **Authentication** là việc xác thực danh tính người dùng
- Vd: Khi vào fb thì bạn cần nói cho server biết là ai để có thể trả về profile
- Bản chất của **authentication** vẫn là:

  - Tạo ra 1 dấu hiệu gì để server biết bạn
  - Lưu trữ dấu hiệu này ở đâu (server || client)
  - Thực hành kiểm tra dấu hiệu này như thế nào

- Thế giới bây giờ có khá nhiều kiểu xác thực **authetication** khác nhau:
  - Basic authentication
  - Session based authentication
  - **Token based authentication** (phổ biến nhất)
  - Oauth 1.0
  - Oauth 2.0
  - API key

# 2. Token based authentication

- **Token based authentication** là cơ chế xác minh danh tính thông qua việc tạo `token`.
- Server sẽ tạo ra một chuỗi kí tự được gọi là `token` để định danh người dùng.
- `Client` sẽ lưu `token` này ở bộ nhớ, mỗi lần gọi `request` sẽ gửi `token` này lên để server xác nhận.
- `Server` có thể lưu hoặc không lưu token này tùy usecase

# 3. Luồng hoạt động của `Token based authentication`

1. Thực hiện login ở client (web, app) : _username_ và _password_ được gửi lên `server`
2. `Server` sẽ kiểm tra trong `database`, nếu có tồn tại _username_ và _password_ thì sẽ tạo ra 1 `token` gửi về cho `client`
3. `Client` sẽ lưu trữ `token` trong `local storage` hoặc `cookie`
4. `Client` sẽ quản lý việc đã đăng nhập hay chưa bằng việc có `token` trong bộ nhớ thiết bị hay chưa. Nếu không có nghĩa là chưa đăng nhập
5. `Client` muốn truy cập đến những tài nguyên cần xác thực danh tính thì `client` sẽ gửi `token` lên `server` thông qua `HTTP Header Authorization`
6. Server nhận được token sẽ tiến hành kiểm tra và giải mã, nếu đúng thì sẽ trả về data, không thì trả về lỗi

# 4. JWT là gì?

- `JWT` hay `JSON Web Token` là một tiêu chuẩn mở `RFC 7519` để đảm bảo an toàn thông tin
- Nói cách khác, `JWT` là một cách để tạo ra `token` và kiểm tra `token` có đúng hay không, các thông tin trong chuỗi `JWT` được định dạng bằng `JSON`
- Một số đặc điểm của `JWT`:
  - Một chuỗi `JWT` có 3 thành phần tách nhau bằng dấu chấm: `header.payload.signature`
  - `header:` chứa thông tin thuật toán mã hóa. Nó được tạo ra bằng thuật toán và dễ dàng giải mã
  - `playload`: chứa `thông tin người dùng` và thời gian hết hạn `token`. Nó cũng được tạo ra bằng thuật toán và dễ dàng giải mã
  - `signature:` là chữ kí, phần quan trọng nhất. Cái này không thể giải mã, vì nó là mã hóa 1 chiều. Chỉ có thể kiểm tra nó có đúng hay không bằng cách `mã hóa header`
  - `payload` kết hợp với một `private key` (`private key` thường `server` sẽ lưu trữ). Vậy nên nếu `header` hoặc `payload` thay đổi thì `signature` sẽ thay đổi theo
- Vậy nên nếu bạn là người code `server` thì đừng bao giờ lưu thông tin nhạy cảm ở `payload` JWT
- `JWT` được dùng hầu hết ở các ngôn ngữ phổ biến hiện nay, ví dụ `nodejs` thì cài `jsonwebtoken`

# 5. Access token và Refresh token

- `Access token` là token dùng cho `authentication`. `Token` này có thời gian hết hạn khá ngắn (30p hoặc 1h)
- `Refresh token` là `token` dùng cho `việc tạo một access token khi access token hết hạn`. Khi `access token` hết hạn, bạn gửi `refresh token` lên server để server kiểm tra và trả về cho bạn 1 `access token mới`, từ đó bạn có thể tiếp tục phiên làm việc của mình. `Refresh token` có thời gian lưu trữ rất lâu, vài chục ngày hoặc vài năm

# 6. Một số điều thú vị xoay quanh `Token Based authentication`

- Khi gửi `access token` lên server thì thường sẽ gửi thông qua `http header authorization` như dưới đây

```txt
Authorization: Bearer <access token>
```

- Tất nhiên bạn cũng có thể gửi thông qua `Http Header` khác, hoặc thậm chí là `Http Body` nếu đã thống nhất với phía `server`. Việc thông qua Header là `Authorization` đã có từ trước đây và được nhiều nơi sử dụng.
- Chữ `Bearer` trước `access token` là để phân biệt giữa các `Authorization schemes`. Có một số `Authorization Schemes` như : `Basic`, `Bearer`, `Digest`,...

# 7. Kĩ thuật lưu access token và refresh token

- Dùng thư viện `axios` và config `interceptors`
- Sau khi đăng nhập thành công thì lưu `access token` và `refresh token` vào `local storage`.
- Nếu sau đó sử dụng những chức năng cần xác thực người dùng thì config ở request gửi đi (interceptors) thêm vào header `Authorization : access token`

# 8. Kĩ thuật tự động refresh token

- Thư viện axios có 1 tính năng là khi gọi 1 api thất bại thì có thể gọi thêm 1 lần nữa bằng cách config (interceptors) ở function error
- Khi Lỗi trả về có `status : 401` và `name : "EXPIRED_ACCES_TOKEN"` thì sẽ tiến hành refresh token tự động và gọi lại api

```typescript
this.instance(error.response.config); // gọi lại api vừa bị lỗi, config là cấu hình cũ của api
// do đó phải sửa lại config Authorization của header rồi mới gọi
```

- Các bước thực hiện:
  - Chuẩn bị 1 hàm `refreshToken` có chức năng refresh token và hàm này return ra `access_token mới `
  - Gọi hàm này trước khi gọi lại api bị lỗi, sau đó gán lại `config header Authorization` bằng `accesstoken mới`

```typescript
return refreshToken().then((access_token) => {
  error.response.config.Authorization = `Bearer ${access_token}`;
  this.instance(error.response.config);
});
```

#### Vấn đề gặp phải: Khi trang web cần gọi 10 api -> refresh token 20 lần -> duplicate -> không hay

- Để xử lý vấn đề này thì cần phải lưu 1 trạng thái

```typescript
refreshTokenRequets = null;
```

- Sau đó kiểm tra: nếu 1 trong 20 api bị lỗi thì sẽ gán `refreshTokenRequets = access_token`, sau đó những api còn lại đã có `access_token mới` nên không cần `refresh token` nữa

```typescript
refreshTokenRequets = refreshTokenRequets
  ? refreshTokenRequets
  : refreshToken();
// nghĩa là: nếu refreshTokenRequets là null thì nó sẽ có giá trị access_token mới
// của hàm refreshToken() trả về
// Còn nếu đã có access_token mới rồi thì không cần gọi hàm refreshToken() nữa
return refreshTokenRequets
  .then((access_token) => {
    error.response.config.Authorization = `Bearer ${access_token}`;
    return this.instance(error.response.config);
  })
  .catch((refresh_token_err) => {
    throw refresh_token_err;
  });
```

#### Vấn đề tiếp theo: sau khi đã refresh token thành công, nhưng sau 10s thì sao, access token sẽ hết hạn, lúc đó nếu chúng ta gọi lại api thì refreshTokenRequets đã có giá trị là access token vừa hết hạn -> không refresh được token -> Lỗi gọi api vô hạn

- Giải quyết : sau mỗi phiên refresh token thì gán lại refreshTokenRequets = null

```typescript
refreshTokenRequets = refreshTokenRequets
  ? refreshTokenRequets
  : refreshToken().finally(() => {
      this.refreshTokenRequets = null;
    });
// ở đây vẫn đảm bảo refreshToken() là 1 promise và resolve về 1 access token mới
return refreshTokenRequets
  .then((access_token) => {
    error.response.config.Authorization = `Bearer ${access_token}`;
    return this.instance(error.response.config);
  })
  .catch((refresh_token_err) => {
    throw refresh_token_err;
  });
```

#### Nếu refresh token thất bại (hết hạn)-> logout phiên làm việc

```typescript
localStorage.clear();
throw error.response;
```
