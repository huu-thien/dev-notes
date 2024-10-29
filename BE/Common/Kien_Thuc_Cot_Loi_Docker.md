
# Kiến Thức Cốt Lõi về Docker

Docker là nền tảng giúp triển khai và quản lý ứng dụng trong container, cung cấp một môi trường cô lập và nhất quán để chạy các ứng dụng. Dưới đây là các kiến thức cốt lõi về Docker mà bạn cần biết:

---

## 1. Kiến Trúc Docker

Docker hoạt động theo mô hình client-server với ba thành phần chính:
- **Docker Client**: Gửi yêu cầu tới Docker Daemon để thực thi các lệnh như tạo, khởi động hoặc dừng container.
- **Docker Daemon**: Xử lý các yêu cầu từ Docker Client và quản lý các đối tượng Docker như containers, images, networks, và volumes.
- **Docker Registry**: Kho lưu trữ để quản lý các Docker images. Docker Daemon sẽ tải xuống (pull) hoặc đẩy lên (push) images từ registry này, ví dụ như Docker Hub.

## 2. Containers và Images

- **Image**: Một mẫu chỉ đọc chứa tất cả thông tin cần thiết để chạy ứng dụng, bao gồm mã nguồn, thư viện, và các phụ thuộc.
- **Container**: Một instance đang chạy của image. Containers là môi trường cô lập có thể khởi động, tạm dừng hoặc xoá mà không ảnh hưởng tới các container khác.

Ví dụ tạo container từ một image:
```bash
docker run -it --name my_container ubuntu
```

## 3. Docker Images và Layers

- **Layers**: Docker images được xây dựng từ nhiều lớp (layer), mỗi lớp đại diện cho một lệnh trong Dockerfile. Các lớp này có thể được tái sử dụng để tối ưu dung lượng.
- **Image Cache**: Docker có thể sử dụng cache để tăng tốc quá trình build. Nếu không có thay đổi gì trong các lớp đã có, Docker sẽ không build lại từ đầu.

## 4. Dockerfile

Dockerfile là một tệp cấu hình chứa các lệnh để xây dựng Docker image. Mỗi lệnh trong Dockerfile đại diện cho một lớp trong image.

Ví dụ cơ bản của Dockerfile:
```Dockerfile
FROM node:14
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "app.js"]
```

### Các Lệnh Cơ Bản Trong Dockerfile
- **FROM**: Xác định image gốc.
- **WORKDIR**: Thiết lập thư mục làm việc mặc định trong container.
- **COPY / ADD**: Sao chép tệp hoặc thư mục từ máy chủ vào container.
- **RUN**: Thực thi lệnh khi build image.
- **CMD**: Xác định lệnh mặc định khi container được khởi chạy.
- **EXPOSE**: Khai báo cổng mà container sẽ lắng nghe.

## 5. Biến Môi Trường

Biến môi trường giúp thiết lập các giá trị cấu hình trong container mà không cần chỉnh sửa Dockerfile.

Ví dụ:
```Dockerfile
ENV NODE_ENV=production
```
Ghi đè biến môi trường:
```bash
docker run -e NODE_ENV=development my_image
```

## 6. Volumes

Volumes được sử dụng để lưu trữ dữ liệu bên ngoài container. Điều này đảm bảo dữ liệu tồn tại ngay cả khi container bị xoá.

Các loại Volumes:
- **Named Volumes**: Được lưu trữ và quản lý bởi Docker, phù hợp cho dữ liệu dài hạn.
- **Bind Mounts**: Liên kết một đường dẫn trên máy chủ với container, thường dùng cho phát triển.
- **Tmpfs Mounts**: Lưu trữ dữ liệu trong RAM, phù hợp cho dữ liệu tạm thời.

Ví dụ tạo volume:
```bash
docker volume create my_volume
docker run -v my_volume:/data my_image
```

## 7. Mạng Lưới (Networking) trong Docker

Docker cung cấp các loại mạng để container có thể giao tiếp với nhau hoặc với bên ngoài:
- **Bridge Network**: Mạng mặc định cho các container độc lập, tạo ra một mạng riêng cho container.
- **Host Network**: Chia sẻ network stack với máy chủ, giúp hiệu suất mạng tốt hơn.
- **Overlay Network**: Cho phép các container trên nhiều máy chủ giao tiếp với nhau, thường dùng trong Docker Swarm hoặc Kubernetes.

Ví dụ tạo và sử dụng bridge network:
```bash
docker network create my_network
docker run -d --name my_container --network my_network my_image
```

## 8. Docker Compose

Docker Compose giúp định nghĩa và quản lý nhiều container cho một ứng dụng. Tệp `docker-compose.yml` định nghĩa các dịch vụ và cấu hình.

Ví dụ cơ bản về Docker Compose với Node.js và MongoDB:
```yaml
version: '3'
services:
  app:
    image: node:14
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    command: "npm start"
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
```

## 9. Docker Swarm

Docker Swarm là công cụ clustering của Docker để quản lý nhiều container trên các máy chủ, thích hợp cho triển khai quy mô lớn.

Các thành phần chính của Docker Swarm:
- **Manager Node**: Quản lý các node và phân phối công việc.
- **Worker Node**: Thực thi container.

Các khái niệm trong Docker Swarm:
- **Service**: Một nhóm các container chạy cùng một image.
- **Task**: Đơn vị công việc nhỏ nhất của một container trong dịch vụ.

## 10. Tổng Quan về Kubernetes

**Kubernetes** là hệ thống mạnh mẽ để điều phối container ở quy mô sản xuất:

- **Pods**: Đơn vị nhỏ nhất trong Kubernetes, chứa một hoặc nhiều container.
- **Deployment**: Tự động mở rộng và cập nhật ứng dụng.
- **Service**: Tạo điểm truy cập ổn định cho Pods.

### So Sánh Docker Swarm và Kubernetes
- **Swarm** đơn giản hơn và phù hợp với môi trường nhỏ.
- **Kubernetes** phức tạp hơn nhưng mạnh mẽ hơn, phù hợp cho các ứng dụng lớn.

---

Đây là các kiến thức cốt lõi về Docker. Hiểu rõ những kiến thức này sẽ giúp bạn triển khai, quản lý và mở rộng ứng dụng sử dụng container một cách hiệu quả.
