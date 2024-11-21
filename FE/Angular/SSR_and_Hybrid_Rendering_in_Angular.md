
# Server-Side Rendering (SSR) và Hybrid Rendering trong Angular

## **1. Server-Side Rendering (SSR)**

### **1.1. SSR là gì?**
Server-Side Rendering (SSR) là một kỹ thuật render ứng dụng Angular trên server thay vì client. Kết quả là HTML đầy đủ nội dung được gửi về browser, thay vì một ứng dụng SPA chỉ chứa JavaScript và khung HTML rỗng.

- **Framework Angular Universal**: Cung cấp khả năng triển khai SSR trong Angular.

---

### **1.2. Lợi ích của SSR**
1. **Tối ưu SEO**:
   - Các công cụ tìm kiếm có thể dễ dàng thu thập dữ liệu từ HTML render sẵn.
   - Hữu ích cho các trang cần SEO tốt (blog, trang thương mại điện tử).

2. **Tăng tốc tải trang lần đầu (First Contentful Paint)**:
   - Người dùng thấy nội dung ngay lập tức thay vì chờ tải và render JavaScript.

3. **Cải thiện hiệu suất trên thiết bị yếu**:
   - Tải trước HTML trên server, giảm tải công việc xử lý cho thiết bị người dùng.

---

### **1.3. Cách triển khai SSR trong Angular**
#### **Bước 1: Cài đặt Angular Universal**
- Sử dụng Angular CLI để thêm Universal vào dự án:
  ```bash
  ng add @nguniversal/express-engine
  ```
- Angular CLI sẽ tạo các file cần thiết, bao gồm:
  - **`server.ts`**: File khởi động Express server.
  - **`app.server.module.ts`**: Module cho SSR.

#### **Bước 2: Cấu hình SSR**
- Thêm các route và module cần thiết vào `app.server.module.ts`.
- Cấu hình file `server.ts` để render ứng dụng Angular với `ngExpressEngine`.

#### **Bước 3: Build và chạy ứng dụng**
- Build cả client và server:
  ```bash
  npm run build:ssr
  ```
- Start server:
  ```bash
  npm run serve:ssr
  ```

---

### **1.4. Hạn chế của SSR**
1. **Chi phí server cao**:
   - Server cần xử lý nhiều yêu cầu hơn, gây áp lực khi lưu lượng lớn.
2. **Phức tạp hơn khi phát triển**:
   - Cần quản lý cả client-side và server-side.
3. **Latency cao hơn trong một số trường hợp**:
   - Thời gian render trên server có thể tăng nếu xử lý dữ liệu phức tạp.

---

## **2. Hybrid Rendering**

### **2.1. Hybrid Rendering là gì?**
Hybrid Rendering kết hợp cả Server-Side Rendering (SSR) và Client-Side Rendering (CSR) để tận dụng ưu điểm của cả hai phương pháp.

- **SSR cho trang đầu tiên (First Load)**:
  - HTML render sẵn từ server giúp tăng tốc thời gian tải ban đầu.
- **CSR cho các tương tác tiếp theo**:
  - SPA tiếp quản để xử lý các hành động người dùng và điều hướng nội bộ.

---

### **2.2. Lợi ích của Hybrid Rendering**
1. **Tối ưu tốc độ ban đầu và tương tác sau**:
   - Tốc độ render ban đầu nhanh nhờ SSR.
   - Trải nghiệm người dùng mượt mà nhờ CSR khi đã tải xong ứng dụng.
2. **Cân bằng hiệu suất và tài nguyên**:
   - Server xử lý trang đầu tiên, client xử lý các phần khác.
3. **Khả năng SEO mạnh mẽ**:
   - Nội dung cần SEO sẽ được server render, trong khi nội dung không cần SEO được xử lý bởi client.

---

### **2.3. Triển khai Hybrid Rendering**
Hybrid Rendering yêu cầu SSR cho một số route và CSR cho các route khác.

#### **Các bước triển khai Hybrid Rendering trong Angular**:
1. **Cấu hình route với SSR**:
   - Chỉ định các route cần render trên server.
   - Sử dụng `TransferState` để chia sẻ dữ liệu giữa server và client.

2. **Kết hợp SSR và CSR**:
   - Sử dụng Angular Universal cho SSR.
   - Sử dụng ứng dụng Angular tiêu chuẩn cho CSR.

3. **Pre-render cho các route tĩnh**:
   - Dùng công cụ như `ngx-prerender` để render trước các route tĩnh.

---

### **2.4. Hạn chế của Hybrid Rendering**
1. **Độ phức tạp cao**:
   - Quản lý hai phương pháp render đòi hỏi sự hiểu biết sâu về cả SSR và CSR.
2. **Chi phí phát triển và bảo trì lớn**:
   - Cần đồng bộ hóa dữ liệu và logic giữa client và server.

---

### **2.5. Sử dụng TransferState để tối ưu Hybrid Rendering**
`TransferState` là một service trong Angular Universal cho phép truyền dữ liệu giữa server và client.

#### **Cách sử dụng TransferState**:
1. **Truyền dữ liệu từ server**:
   ```typescript
   import { TransferState, makeStateKey } from '@angular/platform-browser';

   const DATA_KEY = makeStateKey<any>('data');

   export class AppComponent {
     constructor(private state: TransferState) {
       const data = { message: 'Hello from server' };
       this.state.set(DATA_KEY, data);
     }
   }
   ```

2. **Truy cập dữ liệu trên client**:
   ```typescript
   const data = this.state.get(DATA_KEY, null);
   console.log(data);
   ```

---

## **3. So sánh SSR và Hybrid Rendering**

| **Tiêu chí**               | **SSR**                                    | **Hybrid Rendering**                          |
|----------------------------|--------------------------------------------|----------------------------------------------|
| **Tốc độ tải trang đầu**   | Nhanh nhờ render trước trên server         | Nhanh như SSR                                |
| **Tương tác tiếp theo**    | Có thể chậm nếu phụ thuộc nhiều vào server | Mượt mà hơn nhờ CSR                          |
| **SEO**                    | Tối ưu tốt                                 | Tối ưu tương đương SSR                       |
| **Chi phí tài nguyên**     | Cao (phụ thuộc vào server)                 | Trung bình (phân bổ giữa server và client)   |
| **Độ phức tạp phát triển** | Cao                                       | Cao nhất trong cả hai phương pháp            |

---

Với SSR và Hybrid Rendering, Angular mang lại sự linh hoạt để xây dựng ứng dụng nhanh, mạnh mẽ và tối ưu cho cả người dùng lẫn công cụ tìm kiếm.
