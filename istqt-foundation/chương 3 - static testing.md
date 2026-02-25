## CHƯƠNG 3: KIỂM THỬ TĨNH (STATIC TESTING)

### 1. Khái niệm cơ bản về Kiểm thử tĩnh

- **Định nghĩa:** Là việc kiểm tra các sản phẩm công việc (tài liệu hoặc mã nguồn) mà **không cần thực thi (không chạy)** mã nguồn đó trên máy tính.
- **Đối tượng kiểm thử:** Tất cả các loại tài liệu (Yêu cầu, thiết kế, kế hoạch test, kịch bản test, hướng dẫn sử dụng) và cả mã nguồn (Source code).
- **Lợi ích:** * Phát hiện lỗi sớm (Early Testing).
    - Giảm chi phí sửa lỗi (Sửa lỗi trên tài liệu rẻ hơn nhiều so với sửa lỗi khi đã code xong).
    - Phát hiện được những lỗi mà kiểm thử động khó tìm thấy (ví dụ: biến chưa khai báo, mã nguồn không thể thực thi, tài liệu yêu cầu mâu thuẫn).

---

### 2. Quy trình Review (Review Process)

Đây là hoạt động chính của kiểm thử tĩnh. Một quy trình Review chính thức thường gồm các bước:

1. **Lập kế hoạch (Planning):** Xác định phạm vi, mục tiêu và lựa chọn nhân sự tham gia.
2. **Bắt đầu (Initiate review):** Phân phối tài liệu, giải thích mục tiêu cho người tham gia.
3. **Chuẩn bị cá nhân (Individual review):** Mỗi người tự đọc tài liệu và ghi lại các lỗi tiềm năng.
4. **Hội họp/Thảo luận (Issue communication and analysis):** Mọi người họp lại để thảo luận các lỗi đã tìm thấy và đưa ra quyết định (Pass/Fail).
5. **Sửa lỗi và Theo dõi (Fixing and Reporting):** Tác giả sửa lỗi và kiểm tra xem lỗi đã được xử lý triệt để chưa.

---

### 3. Các loại Review (Review Types)

ISTQB chia thành 4 mức độ từ không chính thức đến cực kỳ nghiêm ngặt:

|**Loại Review**|**Đặc điểm chính**|
|---|---|
|**Informal Review**|Không có quy trình, không cần biên bản họp. Thường là đồng nghiệp xem hộ nhau.|
|**Walkthrough**|Tác giả (Author) là người dẫn dắt buổi họp, giải thích tài liệu cho mọi người. Mục đích chính là để mọi người hiểu tài liệu.|
|**Technical Review**|Tập trung vào giải pháp kỹ thuật, do các chuyên gia thực hiện. Kiểm tra xem thiết kế có khả thi và đúng tiêu chuẩn không.|
|**Inspection**|**Nghiêm ngặt nhất**. Có quy trình chuẩn, có danh sách kiểm tra (Checklist), có người điều phối (Moderator) và biên bản cụ thể. Mục tiêu chính là tìm lỗi.|

### 4. Các vai trò trong một buổi Review

Trong một buổi Review chính thức (như Inspection), mỗi người đóng một vai trò:

- **Author (Tác giả):** Người tạo ra sản phẩm được review.
- **Management (Quản lý):** Quyết định việc thực hiện review, phân bổ thời gian.
- **Facilitator/Moderator (Người điều phối):** Người dẫn dắt buổi họp, đảm bảo mọi người đi đúng hướng.
- **Review Leader:** Người chịu trách nhiệm chung cho kết quả review.
- **Reviewers (Người thẩm định):** Những người trực tiếp soi lỗi.
- **Scribe/Recorder (Người ghi chép):** Ghi lại các lỗi và biên bản buổi họp.

---

### 5. Các yếu tố giúp Review thành công

- Mục tiêu của buổi Review phải rõ ràng.
- Lựa chọn đúng người có chuyên môn.
- Tạo môi trường tin cậy: **Review sản phẩm, không phải review con người** (không chỉ trích tác giả).
- Sử dụng danh sách kiểm tra (Checklists) để không bỏ sót các lỗi phổ biến.
- Dành đủ thời gian cho việc chuẩn bị cá nhân.

---

### 6. Phân tích tĩnh bằng công cụ (Static Analysis)

Ngoài việc người đọc tài liệu, chúng ta còn dùng công cụ (Tools) để soi code:

- Tìm kiếm các biến chưa được sử dụng.
- Phát hiện mã nguồn vi phạm tiêu chuẩn lập trình.
- Tìm các lỗ hổng bảo mật tiềm ẩn.
- Đo lường độ phức tạp của code (Complexity).