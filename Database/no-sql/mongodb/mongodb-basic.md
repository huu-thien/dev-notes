# 📌 MongoDB Overview

## 1. Giới thiệu
- **MongoDB** là **cơ sở dữ liệu NoSQL** dạng **document-oriented**.
- Lưu dữ liệu dưới dạng **document** theo chuẩn **BSON** (Binary JSON), rất giống JSON nhưng hỗ trợ thêm kiểu dữ liệu như `Date`, `ObjectId`.
- Không yêu cầu schema cố định như SQL → linh hoạt thay đổi cấu trúc dữ liệu.
- Ra mắt năm 2009 bởi MongoDB Inc, hiện là 1 trong những NoSQL phổ biến nhất.

---

## 2. Ưu điểm
✅ **Linh hoạt**: Không cần thiết kế bảng chặt chẽ, document có thể khác nhau về field.  
✅ **Dễ mở rộng**: Hỗ trợ **horizontal scaling** (sharding) để xử lý lượng dữ liệu lớn.  
✅ **Hiệu suất cao**: Tốc độ truy xuất nhanh nhờ lưu document nguyên khối và index tối ưu.  
✅ **Hỗ trợ dữ liệu phức tạp**: Có thể lưu mảng, object lồng nhau ngay trong document.  
✅ **Tích hợp tốt với Node.js**: JSON-like structure giúp lập trình dễ dàng.

---

## 3. Nhược điểm
❌ **Không phù hợp transaction phức tạp**: Dù MongoDB có hỗ trợ ACID (phiên bản mới), nhưng vẫn không tối ưu cho nghiệp vụ cần nhiều bảng và quan hệ phức tạp.  
❌ **Chiếm nhiều dung lượng hơn** so với SQL vì lưu cả key và dữ liệu trong mỗi document.  
❌ **Dễ loạn dữ liệu** nếu không kiểm soát schema (document không đồng nhất).  
❌ **Join hạn chế**: Không mạnh như SQL trong việc join nhiều bảng.

---

## 4. Các thành phần chính

### 📍 Database
- Nơi chứa collections.
- Mỗi database có namespace riêng.
- Ví dụ: `myDatabase`.

### 📍 Collection
- Tương tự "bảng" trong SQL, chứa nhiều document.
- Không yêu cầu schema cố định.
- Ví dụ: `users`, `products`.

### 📍 Document
- Đơn vị dữ liệu nhỏ nhất trong MongoDB.
- Dạng BSON (giống JSON).
- Ví dụ:

```json
{
  "_id": ObjectId("64b1234..."),
  "name": "Thiện",
  "age": 23,
  "skills": ["Node.js", "MongoDB"]
}
```

### 📍 Field
- Tương tự "cột" trong SQL.
- Một document có thể có các field khác nhau.
### 📍 id
- Mỗi document có `_id` duy nhất (mặc định là `ObjectId`).
- Có thể dùng `_id` tự tạo

## 5. Kiến trúc MongoDB

- **mongod** → Database server, xử lý lưu trữ và truy vấn.
- **mongos** → Router khi dùng sharding.
- **Mongo Shell (mongosh)** → CLI để quản lý database.
- **Driver** → Thư viện cho các ngôn ngữ lập trình (Node.js, Python, Java…).

## 6. MongoDB Atlas

- **MongoDB Atlas** là dịch vụ **Database-as-a-Service (DBaaS)** do MongoDB Inc cung cấp.
- Chạy trên cloud (AWS, GCP, Azure).
- Cho phép:
	- Tạo cluster MongoDB trong vài phút.
    - Tự động scale và backup.
    - Quản lý qua giao diện web.
- Kết nối với URI:

```bash
mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
```

## 7. Use Case phổ biến

- Social Network (Facebook, Twitter clone).
- E-commerce (lưu sản phẩm, giỏ hàng).
- Real-time chat app.
- IoT data logging.
- Content Management System (CMS).

## 8. Kết nối MongoDB

- Dùng Mongo Compass
- Dùng MongoSH (terminal)
- Dùng mongo driver (SDK tích hợp vào code)
- Dùng extension Mongo cho VS Code