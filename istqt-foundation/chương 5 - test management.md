## CHƯƠNG 5: QUẢN LÝ KIỂM THỬ (TEST MANAGEMENT)

### 1. Tổ chức Kiểm thử (Test Organization)

- **Tính độc lập của kiểm thử (Independence of Testing):**
    - ISTQB nhấn mạnh rằng Tester nên độc lập với Developer để có cái nhìn khách quan hơn.
    - Các cấp độ độc lập (từ thấp đến cao): _Tự kiểm thử -> Tester cùng team -> Team Test độc lập trong công ty -> Tester bên thứ ba (thuê ngoài)._
- **Vai trò:**
    - **Test Manager (Quản lý kiểm thử):** Lập kế hoạch, viết Test Strategy, điều phối nguồn lực và báo cáo.
    - **Tester (Kiểm thử viên):** Phân tích, thiết kế test case, thực thi test và báo cáo lỗi.

### 2. Kế hoạch kiểm thử (Test Planning)

- **Nội dung Test Plan:** Xác định phạm vi, mục tiêu, rủi ro, lịch trình, và tiêu chí dừng kiểm thử (Exit Criteria).
- **Tiêu chí Vào/Ra (Entry & Exit Criteria):**
    - **Entry Criteria (Tiêu chí bắt đầu):** Điều kiện để bắt đầu test (ví dụ: Môi trường sẵn sàng, code đã đóng gói xong).
    - **Exit Criteria (Tiêu chí kết thúc):** Khi nào thì dừng test (ví dụ: 100% test case đã chạy, không còn bug nghiêm trọng nào mở).

### 3. Chiến lược và Cách tiếp cận (Test Strategy & Approach)

Có 7 loại chiến lược kiểm thử chính mà bạn cần nhớ tên:

1. **Analytical (Phân tích):** Dựa trên phân tích rủi ro (Risk-based testing).
2. **Model-based (Dựa trên mô hình):** Dựa trên sơ đồ luồng dữ liệu hoặc biểu đồ trạng thái.
3. **Methodical (Phương pháp):** Dựa trên checklist hoặc các tiêu chuẩn có sẵn.
4. **Process-compliant (Tuân thủ quy trình):** Dựa trên các tiêu chuẩn ngành (ví dụ: ISO).
5. **Directed (Chỉ đạo):** Dựa trên ý kiến của khách hàng hoặc chuyên gia.
6. **Regression-averse (Chống hồi quy):** Tập trung vào việc chạy lại các test case cũ để tránh lỗi phát sinh.
7. **Reactive (Phản ứng):** Đợi phần mềm có sẵn rồi mới tìm lỗi (giống Exploratory Testing).

### 4. Quản lý lỗi (Defect Management)

Bạn cần nắm vững vòng đời của một con Bug (Defect Workflow). Các trạng thái cơ bản:

- **New:** Bug mới được tạo.
- **Assigned:** Giao cho Developer xử lý.
- **Fixed:** Developer đã sửa xong.
- **Verified:** Tester kiểm tra lại và thấy đã hết lỗi.
- **Closed:** Lỗi đã được xác nhận đóng hoàn toàn.
- **Reopened:** Nếu lỗi vẫn còn sau khi sửa.

### 5. Quản lý rủi ro (Risk Management)

Đây là phần cực kỳ quan trọng trong ISTQB v4.0.

- **Project Risk (Rủi ro dự án):** Những yếu tố ảnh hưởng đến khả năng hoàn thành dự án (ví dụ: Thiếu nhân sự, chậm tiến độ, thiếu ngân sách).
- **Product Risk (Rủi ro sản phẩm):** Những yếu tố ảnh hưởng đến chất lượng phần mềm (ví dụ: Chức năng tính toán sai, bảo mật kém, hiệu năng chậm).
- **Quy trình quản lý rủi ro:** Nhận diện rủi ro -> Phân tích rủi ro (Xác suất & Tác động) -> Lập kế hoạch ứng phó.

### 6. Giám sát và Báo cáo (Monitoring and Reporting)

- **Test Metrics (Số đo kiểm thử):** Dùng để đo lường tiến độ và chất lượng (ví dụ: % test case đã đạt, mật độ lỗi/1000 dòng code).
- **Test Summary Report (Báo cáo tổng kết):** Tài liệu quan trọng nhất để đưa ra quyết định "Release" (phát hành) hay không.