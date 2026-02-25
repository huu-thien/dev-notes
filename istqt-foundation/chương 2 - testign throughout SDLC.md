## CHƯƠNG 2: KIỂM THỬ TRONG VÒNG ĐỜI PHÁT TRIỂN PHẦN MỀM (SDLC)

### 1. Kiểm thử và Mô hình vòng đời phát triển phần mềm

Kiểm thử không đứng độc lập mà phải thích ứng với mô hình SDLC mà dự án đang sử dụng.

- **Mô hình tuần tự (Sequential Models - như Waterfall, V-model):** Kiểm thử thường diễn ra sau khi giai đoạn phát triển kết thúc. V-model nhấn mạnh việc lập kế hoạch kiểm thử sớm (ví dụ: lập kế hoạch Acceptance Test ngay khi có yêu cầu).
- **Mô hình lặp và tăng trưởng (Iterative and Incremental Models - như Agile, Scrum):** Kiểm thử diễn ra liên tục trong mỗi lần lặp (Sprint).
- **Shift-Left Approach (Kiểm thử dịch trái):** Nguyên lý quan trọng của ISTQB v4.0. Ý tưởng là thực hiện kiểm thử càng sớm càng tốt trong SDLC để phát hiện lỗi sớm, giảm chi phí.

---

### 2. Các cấp độ kiểm thử (Test Levels)

ISTQB phân chia thành 4 cấp độ chính. Với mỗi cấp độ, bạn cần nhớ: Đối tượng kiểm thử, mục tiêu và người thực hiện.

|**Cấp độ**|**Đối tượng kiểm thử (Test Object)**|**Mục tiêu chính**|**Người thực hiện**|
|---|---|---|---|
|**Component Testing** (Unit Test)|Các đơn vị code nhỏ, class, module.|Tìm lỗi trong code, kiểm tra logic xử lý.|Developer|
|**Integration Testing**|Giao tiếp giữa các module hoặc giữa các hệ thống.|Tìm lỗi tại các điểm giao tiếp (interfaces), sự tương tác giữa các phần.|Developer hoặc Tester|
|**System Testing**|Toàn bộ hệ thống hoàn chỉnh.|Kiểm tra các yêu cầu chức năng và phi chức năng của cả hệ thống.|Tester độc lập|
|**Acceptance Testing** (UAT)|Hệ thống trong môi trường gần giống thật.|Xác nhận hệ thống sẵn sàng để bàn giao, khách hàng chấp nhận sản phẩm.|Khách hàng, User|

### 3. Các loại kiểm thử (Test Types)

Một loại kiểm thử là một nhóm các hoạt động kiểm thử nhằm kiểm tra các đặc tính cụ thể của phần mềm dựa trên các mục tiêu cụ thể. **Lưu ý:** Tất cả các loại kiểm thử này đều có thể thực hiện ở bất kỳ cấp độ nào (Unit, Integration, System, UAT).

### a. Kiểm thử chức năng (Functional Testing)

Tập trung vào câu hỏi: **"Hệ thống làm được cái gì?" (What the system does?)**

- **Mục tiêu:** Kiểm tra các chức năng mà phần mềm phải thực hiện theo yêu cầu của khách hàng.
- **Cơ sở kiểm thử (Test Basis):** Tài liệu đặc tả yêu cầu (Requirements), Đặc tả chức năng (Functional specs), User stories.
- **Đặc điểm:** Thường là kiểm thử Hộp đen (Black-box).
- **Đo lường:** Độ bao phủ chức năng (Functional Coverage) - tức là bao nhiêu % yêu cầu đã được test.

### b. Kiểm thử phi chức năng (Non-functional Testing)

Tập trung vào câu hỏi: **"Hệ thống hoạt động như thế nào?" (How the system behaves?)**

Đây là kiểm thử các đặc tính chất lượng của hệ thống. Các loại phổ biến gồm:

- **Performance (Hiệu năng):** Kiểm tra tốc độ phản hồi, khả năng chịu tải.
- **Load Testing:** Kiểm tra hệ thống dưới mức tải dự kiến.
- **Stress Testing:** Kiểm tra hệ thống dưới mức tải cực hạn (để xem khi nào nó "sập").
- **Security (Bảo mật):** Kiểm tra khả năng chống lại các cuộc tấn công, bảo vệ dữ liệu.
- **Usability (Khả năng sử dụng):** Kiểm tra xem phần mềm có dễ dùng, thân thiện với người dùng không.
- **Reliability (Độ tin cậy):** Khả năng hệ thống hoạt động ổn định trong một khoảng thời gian mà không bị lỗi.

### c. Kiểm thử hộp đen và Hộp trắng (Black-box & White-box)

- Black-box Testing (Kiểm thử Hộp đen)
    
    Đúng như cái tên, bạn coi phần mềm như một chiếc hộp đen kín mít, bạn không biết bên trong nó được viết bằng ngôn ngữ gì hay thuật toán ra sao.
    
    - **Cơ sở kiểm thử (Test Basis):** Dựa vào tài liệu đặc tả (Requirements), tài liệu thiết kế hệ thống, hoặc các User Stories.
    - **Tập trung vào:** **ĐẦU VÀO (Input)** và **ĐẦU RA (Output)**. Bạn nhập dữ liệu A, hệ thống phải trả về kết quả B. Nếu trả về C => Có lỗi.
    - **Mục tiêu:** Kiểm tra xem phần mềm có làm đúng những gì khách hàng yêu cầu hay không ("What the system does").
    - **Ưu điểm:**
        - Tester không cần biết lập trình.
        - Kiểm thử khách quan, đứng dưới góc độ người dùng cuối.
        - Phát hiện được các lỗi về yêu cầu bị thiếu hoặc hiểu sai.
    - **Nhược điểm:** Chỉ kiểm tra được những gì có trong tài liệu. Những đoạn code "thừa" hoặc các lỗi logic ẩn sâu bên trong mà input thông thường không chạm tới sẽ bị bỏ sót.

---

- White-box Testing (Kiểm thử Hộp trắng)
    
    Lúc này chiếc hộp trở nên trong suốt. Bạn nhìn thấu được cấu trúc code, các câu lệnh `if-else`, vòng lặp `for/while`, và các đường đi của dữ liệu bên trong.
    
    - **Cơ sở kiểm thử (Test Basis):** Dựa vào mã nguồn (Source code), sơ đồ luồng dữ liệu, kiến trúc phần mềm.
    - **Tập trung vào:** **CẤU TRÚC (Structure)**. Bạn phải đảm bảo mọi dòng code đều được chạy qua, mọi nhánh của câu lệnh điều kiện đều được kiểm tra.
    - **Mục tiêu:** Đảm bảo tính đúng đắn về mặt kỹ thuật, tối ưu hóa code và loại bỏ các đoạn code dư thừa ("How the system is implemented").
    - **Ưu điểm:**
        - Tìm được các lỗi logic cực khó (ví dụ: lỗi chia cho 0, lỗi tràn bộ nhớ).
        - Giúp tối ưu hóa mã nguồn ngay từ giai đoạn đầu.
    - **Nhược điểm:**
        - Đòi hỏi kiến thức lập trình rất sâu (thường là Developer thực hiện).
        - Rất tốn thời gian nếu hệ thống quá phức tạp.
        - Có thể "vượt qua" bài test nhưng thực tế vẫn sai yêu cầu khách hàng (vì code đúng logic nhưng sai đề bài).

|**Đặc điểm**|**Black-box (Hộp đen)**|**White-box (Hộp trắng)**|
|---|---|---|
|**Dựa vào đâu?**|Tài liệu yêu cầu (Specifications).|Mã nguồn, thiết kế chi tiết (Code/Design).|
|**Câu hỏi chính?**|Hệ thống làm gì? (What?)|Hệ thống hoạt động ra sao? (How?)|
|**Kiến thức IT?**|Không bắt buộc biết code.|Bắt buộc biết code & cấu trúc hệ thống.|
|**Thực hiện ở đâu?**|Chủ yếu ở System Test, Acceptance Test.|Chủ yếu ở Component (Unit) Test, Integration Test.|
|**Kỹ thuật tiêu biểu**|Phân vùng tương đương, Giá trị biên,...|Kiểm thử câu lệnh (Statement), Kiểm thử nhánh (Branch).|

---

### d. Kiểm thử liên quan đến thay đổi (Change-related Testing)

Confirmation Testing (Retesting - Kiểm thử xác nhận)

- **Khi nào dùng:** Sau khi bạn tìm thấy 1 lỗi (Bug), Dev sửa xong và báo lại cho bạn.
- **Mục đích:** Chạy lại **đúng cái test case đã fail** đó để xem lỗi đã thực sự được sửa hay chưa.
- **Key word:** "Verify a fix" (Xác nhận việc sửa lỗi).

Regression Testing (Kiểm thử hồi quy)

- **Khi nào dùng:** Sau khi phần mềm có một sự thay đổi (Sửa bug, thêm tính năng mới, hoặc đổi môi trường).
- **Mục đích:** Chạy lại các **test case đã từng Pass** trước đó ở các vùng liên quan để đảm bảo việc thay đổi mới không làm phát sinh lỗi ở các chức năng cũ đang chạy bình thường.
- **Key word:** "Side effects" (Tác dụng phụ), "Unintended changes" (Thay đổi ngoài ý muốn).
- **Lưu ý:** Kiểm thử hồi quy cực kỳ tốn thời gian vì bộ test case ngày càng dài ra, nên đây là đối tượng hàng đầu để áp dụng **Automation Testing**.

### 4. Kiểm thử bảo trì (Maintenance Testing)

Diễn ra sau khi phần mềm đã được bàn giao và đi vào sử dụng.

- **Lý do cần bảo trì:**
    - **Modification:** Thay đổi, nâng cấp tính năng.
    - **Migration:** Chuyển phần mềm sang môi trường mới (ví dụ từ Window sang Linux).
    - **Retirement:** Khi ngừng sử dụng hệ thống (kiểm tra việc lưu trữ dữ liệu sau khi tắt hệ thống).
- **Impact Analysis (Phân tích tác động):** Trước khi bảo trì, cần phân tích xem thay đổi đó sẽ ảnh hưởng đến những vùng nào của hệ thống để xác định phạm vi kiểm thử hồi quy cần thiết.

---

### 5. Tóm tắt sự khác biệt chính trong v4.0

- Nhấn mạnh hơn vào **Agile** và **DevOps**.
- Nhấn mạnh vào **Whole Team Approach**: Mọi người đều có trách nhiệm với chất lượng, không chỉ riêng Tester.
- **Test-First Approaches:** Giới thiệu sơ lược về TDD (Test Driven Development), BDD (Behavior Driven Development), ATDD.