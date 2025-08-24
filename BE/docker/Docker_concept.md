## Các kiến thức cơ bản về Docker

- Docker là một nền tảng mã nguồn mở cho phép bạn xây dựng, triển khai và chạy ứng dụng trong các container. Container là các môi trường ảo hóa nhẹ, tách biệt, cho phép bạn chạy ứng dụng cùng với tất cả các phụ thuộc của nó mà không cần lo lắng về môi trường máy chủ. Điều này giúp việc phát triển, thử nghiệm và triển khai ứng dụng trở nên dễ dàng hơn và nhất quán hơn.

### 1. Container vs Virtual Machine (VM):

- `Container` chia sẻ hệ điều hành của máy chủ, nhẹ hơn và khởi động nhanh hơn VM.
- `VM` chạy trên một `hypervisor` và có hệ điều hành riêng biệt.

### 2. Docker Images:

- Docker Images là mẫu không thay đổi được sử dụng để tạo ra `container`.
- Có thể được tạo ra từ `Dockerfile`, một tệp hướng dẫn cách xây dựng `Images`.

### 3. Dockerfile

- Tệp văn bản chứa các lệnh để xây dựng Docker Images.
- Các lệnh thường gặp: `FROM`, `RUN`, `COPY`, `CMD`, `ENTRYPOINT`.

### 4. Docker Hub:

- Là kho lưu trữ `Docker Images` công cộng.
- Người dùng có thể tìm kiếm, chia sẻ và lưu trữ hình ảnh của mình.

### 5. Docker Compose:

- Công cụ để định nghĩa và chạy nhiều `container` như một ứng  dụng.
- Sử dụng tệp `docker-compose.yml` để cấu hình các dịch vụ, mạng và volume.

## Các Lệnh Cơ Bản

#### Kiểm tra phiên bản Docker:

```bash
docker --version
```

#### Kéo một Image từ Docker Hub:

```bash
docker pull nginx
```

#### Xem danh sách Image đã tải:

```bash
docker images
```

#### Chạy một container từ Image:

```bash
docker run -d -p 80:80 nginx
```

#### Xem danh sách các container đang chạy:

```bash
docker ps
```

#### Dừng một container:

```bash
docker stop <container_id>
```

#### Xóa một container:

```bash
docker rm <container_id>
```

- `Dockerfile` và `docker-compose.yml` có mối liên hệ mật thiết với nhau trong quy trình phát triển và triển khai ứng dụng sử dụng `Docker`. Dưới đây là một số điểm quan trọng về cách chúng tương tác:

#### Dockerfile

- Mục đích: `Dockerfile` được sử dụng để tạo hình ảnh `Docker` (Docker image) cho một ứng dụng. Nó chứa tất cả các chỉ thị cần thiết để thiết lập môi trường cho ứng dụng của bạn, bao gồm cài đặt phần mềm, sao chép tệp, thiết lập biến môi trường, và chỉ định lệnh khởi động.

- Cấu trúc:

  - Khai báo hình ảnh cơ sở (base image).
  - Sao chép mã nguồn vào hình ảnh.
  - Cài đặt các phụ thuộc.
  - Thiết lập các cổng mà ứng dụng sẽ lắng nghe.

- Ví dụ Dockerfile

```dockerfile
# Sử dụng Node.js làm base image

FROM node:14

# Thiết lập thư mục làm việc

WORKDIR /usr/src/app

# Sao chép package.json và cài đặt các phụ thuộc

COPY package\*.json ./
RUN npm install

# Sao chép mã nguồn

COPY . .

# Mở cổng mà ứng dụng lắng nghe

EXPOSE 3000

# Chạy ứng dụng

CMD ["npm", "start"]
```

#### docker-compose.yml

- Mục đích: `docker-compose.yml` được sử dụng để định nghĩa và khởi động nhiều dịch vụ (containers) cùng nhau. Nó cho phép bạn cấu hình các dịch vụ, mạng, và `volumes` một cách dễ dàng.

- Cấu trúc:

  - Khai báo các dịch vụ (service) và cách chúng tương tác với nhau.
  - Thiết lập cấu hình cho từng dịch vụ, bao gồm việc sử dụng hình ảnh từ Dockerfile, thiết lập biến môi trường, cổng, và volumes.

- Ví dụ docker-compose.yml

```yaml
version: "3.8"

services:
  app:
    build:
      context: ./app # Đường dẫn đến thư mục chứa Dockerfile
    ports:
      - "3000:3000"
    environment:version: "3.8"

services:
  app:
    build:
      context: ./app  # Đường dẫn đến thư mục chứa Dockerfile
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production

      NODE_ENV: production
```

**Mối quan hệ giữa Dockerfile và docker-compose.yml**

- `Build Image`: Khi bạn sử dụng docker-compose up với chỉ thị build, Docker Compose sẽ sử dụng Dockerfile trong thư mục mà bạn chỉ định để xây dựng hình ảnh cho dịch vụ đó.

- `Quản lý Dịch vụ`: Docker Compose cho phép bạn quản lý nhiều dịch vụ sử dụng hình ảnh từ Dockerfile. Bạn có thể định nghĩa các dịch vụ, mạng, và volumes cho toàn bộ ứng dụng của bạn một cách trực quan và dễ dàng.

- `Kết nối Giữa Các Dịch Vụ`: Trong docker-compose.yml, bạn có thể thiết lập các dịch vụ tương tác với nhau thông qua tên dịch vụ, điều này giúp quản lý các liên kết giữa các dịch vụ (như giữa một ứng dụng và cơ sở dữ liệu).
