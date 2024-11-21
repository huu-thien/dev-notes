
# Angular Core Concepts

Angular là một framework phát triển ứng dụng web mạnh mẽ, được xây dựng bởi Google, sử dụng TypeScript làm ngôn ngữ chính. Dưới đây là các kiến thức cốt lõi của Angular được trình bày chi tiết.

---

## 1. **Kiến trúc Angular**

Angular dựa trên kiến trúc **Component-Based** và có các phần chính sau:

### **1.1. Modules**
- **NgModules** tổ chức ứng dụng thành các khối module.
- Module chính: `AppModule`.
- Các module thông dụng:
  - **BrowserModule**: Cần thiết cho ứng dụng chạy trên trình duyệt.
  - **CommonModule**: Cung cấp các chỉ thị như `ngIf`, `ngFor`.
  - **FormsModule**: Hỗ trợ làm việc với form (template-driven).
  - **ReactiveFormsModule**: Hỗ trợ form reactive.
  - **RouterModule**: Cung cấp chức năng định tuyến.

### **1.2. Components**
- Thành phần cốt lõi để xây dựng giao diện người dùng (UI).
- Mỗi Component bao gồm:
  - **HTML template**: Giao diện hiển thị.
  - **CSS styles**: Định nghĩa kiểu dáng.
  - **TypeScript class**: Logic và dữ liệu liên kết với giao diện.
  - **Metadata (decorator)**: Được khai báo bằng `@Component`.

### **1.3. Templates**
- Templates chứa HTML và Angular Directives:
  - **Structural directives**: `*ngIf`, `*ngFor`.
  - **Attribute directives**: `[class]`, `[style]`, `[disabled]`.

### **1.4. Directives**
- **Component** cũng là một dạng Directive.
- **Directive types**:
  - **Attribute directives**: Thay đổi giao diện hoặc hành vi phần tử (e.g., `ngClass`, `ngStyle`).
  - **Structural directives**: Thêm hoặc xóa DOM (e.g., `*ngIf`, `*ngFor`).

### **1.5. Services và Dependency Injection (DI)**
- **Services** dùng để chia sẻ logic giữa các component.
- **Dependency Injection** cung cấp các service khi cần.

---

## 2. **Data Binding**

Angular hỗ trợ 4 kiểu liên kết dữ liệu chính:

### **2.1. Interpolation (`{{ }}`)**
- Hiển thị dữ liệu từ component trong template:
  ```html
  <h1>{{ title }}</h1>
  ```

### **2.2. Property Binding (`[property]`)**
- Gán giá trị từ component vào thuộc tính của HTML element:
  ```html
  <img [src]="imageUrl" />
  ```

### **2.3. Event Binding (`(event)`)**
- Lắng nghe sự kiện và gọi phương thức trong component:
  ```html
  <button (click)="handleClick()">Click me</button>
  ```

### **2.4. Two-Way Binding (`[(ngModel)]`)**
- Kết hợp cả Property Binding và Event Binding (sử dụng với FormsModule):
  ```html
  <input [(ngModel)]="username" />
  ```

---

## 3. **Routing và Navigation**

Angular Router cho phép xây dựng SPA (Single-Page Application):

### **3.1. Định nghĩa Routes**
- Định nghĩa trong `RouterModule`:
  ```typescript
  const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent },
  ];
  ```

### **3.2. RouterLink**
- Điều hướng qua template:
  ```html
  <a routerLink="/about">About</a>
  ```

### **3.3. Router-outlet**
- Nơi hiển thị các component tương ứng với route:
  ```html
  <router-outlet></router-outlet>
  ```

---

## 4. **Forms**

Angular hỗ trợ 2 loại form:

### **4.1. Template-driven Forms**
- Sử dụng `FormsModule`.
- Dựa trên template:
  ```html
  <form #form="ngForm" (ngSubmit)="onSubmit(form.value)">
    <input [(ngModel)]="name" name="name" required />
    <button type="submit">Submit</button>
  </form>
  ```

### **4.2. Reactive Forms**
- Sử dụng `ReactiveFormsModule`.
- Dựa trên FormControl và FormGroup:
  ```typescript
  this.form = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  ```
  Template:
  ```html
  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <input formControlName="name" />
    <button type="submit">Submit</button>
  </form>
  ```

---

## 5. **HttpClient**

Angular cung cấp HttpClient để làm việc với HTTP requests.

### **5.1. Import HttpClientModule**
- Thêm vào `AppModule`:
  ```typescript
  import { HttpClientModule } from '@angular/common/http';

  @NgModule({
    imports: [HttpClientModule],
  })
  export class AppModule {}
  ```

### **5.2. Sử dụng HttpClient**
- Thực hiện GET, POST, PUT, DELETE:
  ```typescript
  constructor(private http: HttpClient) {}

  getData() {
    this.http.get('https://api.example.com/data').subscribe((data) => {
      console.log(data);
    });
  }
  ```

---

## 6. **Lifecycle Hooks**

Angular cung cấp các hooks để xử lý logic trong các giai đoạn khác nhau của vòng đời component:

1. **ngOnInit**: Chạy sau khi khởi tạo component.
2. **ngOnChanges**: Theo dõi sự thay đổi của input bindings.
3. **ngDoCheck**: Dùng để tùy chỉnh detection logic.
4. **ngAfterViewInit**: Chạy sau khi view được khởi tạo.
5. **ngOnDestroy**: Chạy trước khi component bị hủy.

---

## 7. **State Management**

### **7.1. Local State**
- Sử dụng các service để lưu trữ state local cho từng module.

### **7.2. Global State**
- Sử dụng thư viện như **NgRx** hoặc **Akita** để quản lý state toàn cục.

---

## 8. **Testing**

Angular hỗ trợ testing qua **Jasmine** và **Karma**:

### **8.1. Unit Testing**
- Viết unit test cho component/service:
  ```typescript
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
  ```

### **8.2. End-to-End Testing**
- Sử dụng **Protractor** (hoặc **Cypress** nếu cần thay thế).

---

## 9. **Performance Optimization**

1. **Lazy Loading Modules**: Chỉ tải module khi cần thiết.
2. **Change Detection Strategy**: Sử dụng `OnPush` để giảm số lần detect changes.
3. **AOT Compilation**: Dùng Ahead-of-Time để biên dịch trước khi chạy.
4. **TrackBy trong *ngFor**: Tối ưu rendering danh sách.
5. **Preloading Modules**: Tải trước các module cần thiết trong nền.

---

## 10. **Best Practices**

1. **Sử dụng file riêng cho từng Component, Service.**
2. **Chia nhỏ module để tăng khả năng tái sử dụng.**
3. **Tận dụng Dependency Injection.**
4. **Luôn kiểm tra lỗi với Angular CLI.**
5. **Tuân thủ Angular Style Guide.**

--- 

Với kiến thức này, bạn có thể xây dựng ứng dụng Angular một cách hiệu quả và chuyên nghiệp. Hãy luyện tập thường xuyên để thành thạo hơn! 🚀
