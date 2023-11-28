# 2. HTTP Protocol

- Là cách thức website được truyền tải qua internet

- Trong việc xử lý HTTP requests trong một ứng dụng web, như một ứng dụng Express.js, các thông tin từ client (người dùng gửi lên) thường được truyền qua ba phần chính: req.body, req.query, và req.params. Đây là cách để truy cập và sử dụng các thông tin này:

  - req.body: Được sử dụng khi client gửi dữ liệu thông qua HTTP methods như POST, PUT, DELETE, vv. và dữ liệu này gửi kèm theo trong phần body của request.Thường được sử dụng khi bạn muốn gửi dữ liệu lên server như thông tin form, dữ liệu JSON, vv.Để truy cập dữ liệu trong req.body, bạn cần sử dụng middleware như express.json() để parse dữ liệu và đảm bảo rằng nó sẽ có sẵn trong biến req.body.

  - req.query: Được sử dụng để truyền thông tin qua URL parameters (còn gọi là query parameters) trong các request HTTP. Thường được sử dụng trong các trường hợp như tìm kiếm, sắp xếp hoặc lọc dữ liệu. Ví dụ: /api/products?category=electronics&page=1&limit=10 - ở đây, category, page, và limit là các query parameters.
    -> không cần khai báo thêm route : /?key=value&key2=value2
 
  - req.params (/:): Được sử dụng để trích xuất thông tin từ URL parameters khi chúng được định nghĩa trong biểu thức định tuyến (route) của ứng dụng. Thường được sử dụng khi bạn cần truy cập các giá trị có trong URL để xác định tài nguyên cụ thể mà request đang thao tác. Ví dụ: Nếu bạn có biểu thức định tuyến như /api/users/:id, thì id trong req.params.id sẽ chứa giá trị của id trong URL. -> phải khai báo thêm route : /:id/:name

# 3. SSR & CSR

- Server side rendering : mã được render ở server, tốt cho SEO, thời gian phát triển nhanh hơn
- Client side rendering : mã được render ở client , có tính kế thừa cao hơn, phát triển dài hạn
- Có những website 1 nữa SSR, 1 nửa CSR

# 3. Install Express

# 4. Install nodemon , debug

- Package giúp server tự động restart sau khi code, giúp debug dễ dàng

# 5. Template engine (handlebars)

# 6. Static & SASS

# 7. Basic Routing

- Tuyến đường
- app.get("/", (req, res) => res.render("home"));
- Trong đó:
  - req : request
  - res : response

# 7. Get Method

# 8. Query Parameter

- Là việc truyền dữ liệu qua url, tồn tại ở mọi method: get, put, delete nhưng thường được xử dụng với GET method
- Mỗi param cách nhau bới dấu &, nhưng param đầu tiên là dấu ?
- Vd: https://www.google.com/search?q=f8laptrinh&ref=f8&author=thien
- Query nằm ở req.query (là 1 object)

# 9. Form Default Behavior

- Khi submit form với phương thức POST thì sau đó reload trang phương thức cũng là POST
- attribute "action" của form dùng để chỉ định url submit

# 10. POST Method

- Gửi dữ liệu từ client lên Server
- Để lấy dữ liệu gửi từ form thì dùng req.body
- req.query thì có nhưng req.body thì trả undefined vì dữ liệu chưa đc lưu trong req.body
- -> Cần thêm middleware để xử lý:
  - app.use(express.urlencoded({extended: true}));
  - app.use(express.json())

# 11. Mô hình MVC - Model - View - Controler

- Là 1 design pattern
- Bóc tách thành 3 thành phần chính: View , Model, Controler

  - Model: Quản lý xử lý các dữ liệu
  - View: Nơi hiển thị dữ liệu cho người dùng
  - Controler: Điều khiển sự tương tác của hai thành phần Model và View

- Luồng xử lý trong của mô hình MVC:
  - Khi một yêu cầu của từ máy khách (Client) gửi đến Server. Thì bị Controller trong MVC chặn lại để xem đó là URL request hay sự kiện.
  - Sau đó, Controller xử lý input của user rồi giao tiếp với Model trong MVC.
  - Model chuẩn bị data và gửi lại cho Controller
  - Cuối cùng, khi xử lý xong yêu cầu thì Controller gửi dữ liệu trở lại View và hiển thị cho người dùng trên trình duyệt.
- Ở đây, View không giao tiếp trực tiếp với Model. Sự tương tác giữa View và Model sẽ chỉ được xử lý bởi Controller.

# 12. Routes & Controller

- Tạo thư mục routes để định tuyến các tuyến đường
- Tạo thư mục Controller để viết excuted function handler khi match với route

# 13. Prettier

- Prettier
- Lint-staged
- Husky

# 14. Model MVC

- Khi dùng nodejs làm việc với mongoDB thì mongoose như 1 driver đứng giữa để giúp làm việc dễ dàng và chặt chẽ hơn
- Đối với SQL: Dữ liệu có quan hệ
- Đối với NoSQL : Dữ liệu không nhất thiết phải có quan hệ

- Mongoose là công cụ giúp mô hình hóa dữ liệu dưới dạng đối tượng và quản lý các field được chặt chẽ hơn
- Mongoose được hỗ trợ cả promise và call back
  +B1: cài đặt mongoose -> tạo config cho mongoDB -> src/config/db/index.js
  +B2: Connect mongoose
  +B3: Create Model

- Controler chọc vào Model

# 14. [CRUD] Read from DB

- Mỗi document trong mongoDB trả về object dạng constructor, nên khi nhận lại phải chuyển sang object thường
  courses = courses.map((course) => course.toObject());

# 15. Course details page

- Có thế lấy query parameter bằng req.params.slug

# 16. [CRUD] Create a Course

- Có thể lấy thông tin nhập từ form để lưu vào db với req.body
- GET: gửi yêu cầu lên server, yêu cầu server trả dữ liệu về cho client
- POST: gửi dữ liệu lên server để server lưu lại dữ liệu
- PUT/ PATH: chỉnh sửa dữ liệu
- Vấn đề: form của html chỉ support chúng ta submit dữ liệu ở POST hoặc GET -> Tải method-override
- req.body: dữ liệu mà form submit

# 17. [CRUD] Delete a Course

- Càn truyền id lên url để xem xóa khóa học nào

# 18. Soft delete: xóa mềm

- Được áp dụng trong thực tế
- Không xóa thật, chỉ mất ở view nhưng trong DB vẫn còn
- Restore: Khôi phục
- Force delete: xóa thật
- Dùng thư viện mongoose-delete để hỗ trợ xóa mềm

# 19. Deleted count document

# 20. Select all with checkbox

# 21. Middleware

- Ý nghĩa: phần mềm trung gian (đứng giữa các thành phần) kết nối, trung gian, kiểm soát các thành phần trong phần mềm

  - Browser (Client) ===== Request ======> Server (Node)
  - Browser (Client) <===== Response ===== Server (Node)

- Vai trò: giống như "Bác bảo vệ" -> soát vé

  - Kiểm soát -> Validation
  - Cho phép vào ->
  - Không cho vào
  - Chỉnh sửa / thay đổi

- Ứng dụng:

  - Dựng chức năng xác thực (Authentication)
  - Chức năng phân quyền (Authorization)
  - Chia sẻ các giá trị của biến tới tất cả các view (BE)

- Chú ý: 1 middleware không gọi hàm next() sẽ làm ứng dụng bị treo

# 22. Docker

- Docker là một nền tảng cho developers và sysadmin để develop, deploy và run application với container. Nó cho phép tạo các môi trường độc lập và tách biệt để khởi chạy và phát triển ứng dụng và môi trường này được gọi là container. Khi cần deploy lên bất kỳ server nào chỉ cần run container của Docker thì application của bạn sẽ được khởi chạy ngay lập tức.

- Docker Client: là cách mà bạn tương tác với docker thông qua command trong terminal. Docker Client sẽ sử dụng API gửi lệnh tới Docker Daemon.
- Docker Daemon: là server Docker cho yêu cầu từ Docker API. Nó quản lý images, containers, networks và volume.
- Docker Volumes: là cách tốt nhất để lưu trữ dữ liệu liên tục cho việc sử dụng và tạo apps.
- Docker Registry: là nơi lưu trữ riêng của Docker Images. Images được push vào registry và client sẽ pull images từ registry. Có thể sử dụng registry của riêng bạn hoặc registry của nhà cung cấp như : AWS, Google Cloud, Microsoft Azure.
- Docker Hub: là Registry lớn nhất của Docker Images ( mặc định). Có thể tìm thấy images và lưu trữ images của riêng bạn trên Docker Hub ( miễn phí).
- Docker Repository: là tập hợp các Docker Images cùng tên nhưng khác tags. VD: golang:1.11-alpine.
- Docker Networking: cho phép kết nối các container lại với nhau. Kết nối này có thể trên 1 host hoặc nhiều host.
- Docker Compose: là công cụ cho phép run app với nhiều Docker containers 1 cách dễ dàng hơn. - Docker Compose cho phép bạn config các command trong file docker-compose.yml để sử dụng lại. Có sẵn khi cài Docker.
- Docker Swarm: để phối hợp triển khai container.
- Docker Services: là các containers trong production. 1 service chỉ run 1 image nhưng nó mã hoá cách thức để run image — sử dụng port nào, bao nhiêu bản sao container run để service có hiệu năng cần thiết và ngay lập tức.

# 23. RESTful APi (Representational State Transfer )

- API: là cầu nối giữa client và resource
- REST: là 1 kiến trúc phần mềm, nó quy định cách thứ API nên hoạt động như thế nào cho hiệu quả với mạng internet
- Thành phần chính của RESTful API
  - Client request:
    - Mỗi nguồn tài nguyên cần 1 định danh, với REST, đấy là 1 URL (còn gọi là endpoint)
    - RESTful API thường được sử dụng với HTTP, vì vậy, chúng ta cần quan tâm tới HTTP methods, thứ nói cho server biết cần làm gì: GET, POST, PUT, PATCH
  - Server Response
    - status: 200 201
    - Message body

# 24. Status code message

- Sử dụng Status Code cho HTTP request để 'minh họa' kết quả phản hồi cho 1 request
- Chia thành 5 loại chính:
  +Informational responses (100 – 199)
  +Successful responses (200 – 299)
  +Redirection messages (300 – 399)
  +Client error responses (400 – 499)
  +Server error responses (500 – 599)

# 25. GET method

- Sử dụng method GET để 'yêu cầu lấy dữ liệu; request data
- Lưu ý: không gửi kèm body (payload) với GET request.

# 26. POST method

- Cần gửi kèm body (payload)
- Status code thành công là 201

# 27. PUT / PATCH : update

- PUT: tạo mới hoặc ghi đè, xóa toàn bộ record cũ, thay thế bằng record mới
- PATCH: chỉ update, chỉ update 1 phần (phần thay đổi)

# 28. DELETE method

- Dùng nếu muốn xóa tài nguyên
- Có thể có data ở phần body hoặc không
- Cần truyền theo ID để server xác định mục tiêu cần xóa

# 29. Giải pháp lưu trữ file với MongoDB

- Dùng form-data để gửi file lên server


# 30. Triển khai DB lên cloud