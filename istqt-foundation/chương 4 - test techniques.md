## CHƯƠNG 4: KỸ THUẬT KIỂM THỬ (TEST TECHNIQUES)

### 1. Kỹ thuật Hộp đen (Black-box Techniques)

Dùng để thiết kế test case dựa trên tài liệu đặc tả mà không cần xem code. Có 4 kỹ thuật kinh điển bạn buộc phải thành thạo:

- **Phân vùng tương đương (Equivalence Partitioning - EP):**
    - **Nguyên lý:** Chia dữ liệu đầu vào thành các nhóm (vùng) mà hệ thống sẽ xử lý giống hệt nhau. Bạn chỉ cần chọn 1 giá trị đại diện trong mỗi vùng để test.
    - **Mục tiêu:** Giảm số lượng test case mà vẫn đảm bảo độ bao phủ.
    - **Ví dụ:** Một ô nhập tuổi từ 18 đến 60. • Vùng hợp lệ: [18, 60] (Chọn 25 để test). • Vùng không hợp lệ 1: < 18$ (Chọn 10 để test). • Vùng không hợp lệ 2: > 60$ (Chọn 70 để test).
- **Phân tích giá trị biên (Boundary Value Analysis - BVA):**
    - **Nguyên lý:** Lỗi thường tập trung ở "biên" của các vùng tương đương.
    - **Cách làm:** Test tại các giá trị: **Biên, ngay dưới biên, và ngay trên biên.**
    - **Ví dụ:** Với dải [18, 60] ở trên: • Các giá trị cần test: 17, 18, 19 và 59, 60, 61.
- **Bảng quyết định (Decision Table Testing):**
    - **Nguyên lý:** Dùng khi hệ thống có nhiều điều kiện kết hợp với nhau để tạo ra các hành động khác nhau.
    - **Cấu trúc:** Gồm các cột (quy tắc), hàng trên là các điều kiện (Conditions), hàng dưới là hành động (Actions).
    - **Ví dụ:** Nếu (là khách hàng thân thiết) VÀ (có mã giảm giá) THÌ (giảm 20%). Nếu chỉ có 1 trong 2 THÌ (giảm 5%).
- **Chuyển đổi trạng thái (State Transition Testing):**
    - **Nguyên lý:** Dựa trên sơ đồ trạng thái của hệ thống. Một thực thể thay đổi từ trạng thái này sang trạng thái khác dựa trên các sự kiện.
    - **Ví dụ:** Trạng thái của một đơn hàng: _Chờ thanh toán -> Đã thanh toán -> Đang giao -> Đã nhận._

### 2. Kỹ thuật Hộp trắng (White-box Techniques)

Dựa trên cấu trúc mã nguồn. Cần nắm 2 khái niệm về độ bao phủ (Coverage):

- **Statement Testing & Coverage (Kiểm thử câu lệnh):** Thiết kế test case sao cho mọi dòng code đều được thực thi ít nhất 1 lần.
    - Mục tiêu: Chạy qua càng nhiều dòng code càng tốt.
    - Công thức Độ bao phủ (Coverage) = (Số câu lệnh đã thực thi / Tổng số câu lệnh) x 100%.
- **Decision Testing & Coverage (Kiểm thử nhánh/quyết định):** Thiết kế test case sao cho mọi kết quả của câu lệnh điều kiện (True/False của lệnh `if`) đều được thực thi.
    - Mục tiêu: Chạy qua các kết quả Đúng (True) và Sai (False) của các câu lệnh điều kiện (như IF, CASE).
    - **Lưu ý quan trọng:** Nếu đạt 100% Decision Coverage thì chắc chắn đạt 100% Statement Coverage.

### 3. Kỹ thuật dựa trên kinh nghiệm (Experience-based)

- **Error Guessing (Đoán lỗi):** Tester dựa vào kinh nghiệm để dự đoán nơi nào Dev hay code sai (ví dụ: chia cho 0, để trống ô nhập liệu, nhập ký tự đặc biệt).
- **Exploratory Testing (Kiểm thử thăm dò):** Vừa thiết kế test case, vừa chạy test, vừa học hỏi hệ thống cùng một lúc. Thường dùng khi thiếu tài liệu hoặc áp lực thời gian.
- **Checklist-based Testing:** Tester dùng một danh sách các điểm quan trọng đã được soạn sẵn để kiểm tra.

### 4. Cách chọn kỹ thuật kiểm thử

Không có kỹ thuật nào là vạn năng. Việc chọn kỹ thuật tùy thuộc vào:

- Loại hệ thống (App ngân hàng cần BVA/Decision Table kỹ hơn).
- Tiêu chuẩn bắt buộc (Y tế, hàng không cần White-box cực cao).
- Thời gian và ngân sách.
- Kiến thức của Tester.