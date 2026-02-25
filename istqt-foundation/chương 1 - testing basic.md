## CHƯƠNG 1: CƠ BẢN VỀ KIỂM THỬ

### 1. Kiểm thử phần mềm là gì? (What is Testing?)

Kiểm thử không chỉ là việc chạy phần mềm để tìm lỗi. Nó bao gồm một tập hợp các hoạt động từ lập kế hoạch, phân tích, thiết kế đến báo cáo kết quả.

- **Mục tiêu của kiểm thử:**
    - Đánh giá các sản phẩm làm ra (tài liệu, code).
    - Kiểm tra xem các yêu cầu đã được đáp ứng chưa.
    - Xây dựng sự tin tưởng vào mức độ chất lượng của đối tượng kiểm thử.
    - Ngăn ngừa lỗi (Testing sớm giúp giảm chi phí sửa lỗi).
    - Tìm ra các khuyết tật (Defects) và sai sót (Failures).
- **Phân biệt Testing và Debugging:**

|**Đặc điểm**|**Kiểm thử (Testing)**|**Gỡ lỗi (Debugging)**|
|---|---|---|
|**Mục đích**|Phát hiện các lỗi (defects) thông qua việc thực thi hoặc kiểm tra tĩnh. Xác nhận hệ thống đáp ứng yêu cầu.|Tìm ra nguyên nhân gốc rễ của lỗi, phân tích và thực hiện sửa lỗi (fix bug).|
|**Hoạt động**|Thiết kế test case, chạy test, báo cáo kết quả.|Phân tích code, tái hiện lỗi, chỉnh sửa mã nguồn và kiểm tra lại.|
|**Người thực hiện**|Tester (Kiểm thử viên).|Developer (Lập trình viên).|

---

### 2. Tại sao kiểm thử lại cần thiết?

Kiểm thử giúp giảm rủi ro phần mềm hoạt động sai trong môi trường thực tế.

- **Đóng góp vào thành công:** Tester tham gia sớm vào việc review yêu cầu (Requirements) hoặc thiết kế (Design) sẽ giúp phát hiện lỗi ngay từ "trong trứng nước".
- **Đảm bảo chất lượng (QA) vs Kiểm soát chất lượng (QC):**
    - **QA (Quality Assurance):** Tập trung vào **quy trình**, mang tính phòng ngừa lỗi.
    - **QC (Quality Control):** Tập trung vào **sản phẩm**, mang tính phát hiện lỗi (Testing là một phần của QC).
- **Lỗi (Error) - Khuyết tật (Defect) - Sự cố (Failure) - Root Cause (Nguyên nhân gốc rễ):**
    - **Error (Mistake):** Do con người tạo ra (ví dụ: Dev hiểu sai yêu cầu, gõ nhầm dòng code).
    - **Defect (Bug/Fault):** Là "kết quả" của Error nằm trong code hoặc tài liệu. Nếu code này không được chạy, nó vẫn nằm im đó.
    - **Failure (Sự cố):** Khi chúng ta chạy phần mềm và cái Defect kia được kích hoạt, làm cho phần mềm chạy sai so với mong đợi.
    - **Root Cause (Nguyên nhân gốc rễ):** Là lý do sâu xa nhất dẫn đến Error (ví dụ: Thiếu đào tạo, áp lực thời gian quá lớn).

---

### 3. 7 Nguyên lý của kiểm thử (7 Testing Principles)

Đây là phần cực kỳ quan trọng, thường xuyên xuất hiện trong đề thi:

1. **Kiểm thử đưa ra bằng chứng về sự hiện diện của lỗi:** Kiểm thử chỉ ra rằng lỗi có tồn tại, chứ không thể chứng minh phần mềm 100% không có lỗi.
2. **Kiểm thử kiệt xuất là không thể:** Không thể test mọi tổ hợp dữ liệu và điều kiện. Chúng ta cần dựa vào phân tích rủi ro để ưu tiên.
3. **Kiểm thử sớm (Early Testing):** Nên bắt đầu càng sớm càng tốt để tiết kiệm thời gian và chi phí.
4. **Sự tập trung của lỗi (Defect Clustering):** Lỗi thường tập trung ở một số module trọng yếu hoặc phức tạp (nguyên lý 80/20).
5. **Nghịch lý thuốc trừ sâu (Pesticide Paradox):** Nếu lặp lại cùng một bộ test case nhiều lần, chúng sẽ không tìm thêm được lỗi mới. Cần cập nhật test case thường xuyên.
6. **Kiểm thử phụ thuộc vào ngữ cảnh  (Testing is context dependent):** Test một app ngân hàng sẽ khác hoàn toàn với test một trò chơi điện tử.
7. **Sự vắng mặt của lỗi là một sai lầm (Absence-of-errors fallacy):** Nếu phần mềm không có lỗi nhưng lại không đáp ứng được nhu cầu người dùng thì nó vẫn là một sản phẩm thất bại.

| **STT** | **Tên Tiếng Việt**                     | **Tên Tiếng Anh**                                            | **Giải thích từ khóa (Keywords)**                                           |
| ------- | -------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------- |
| 1       | Kiểm thử cho thấy sự hiện diện của lỗi | **Testing shows the presence of defects, not their absence** | Testing nói "có lỗi", không bao giờ nói "hết lỗi".                          |
| 2       | Kiểm thử kiệt xuất là không thể        | **Exhaustive testing is impossible**                         | Không thể test mọi thứ. Cần dùng **Risk Analysis** (Phân tích rủi ro).      |
| 3       | Kiểm thử sớm                           | **Early testing**                                            | Tiết kiệm tiền. Liên quan đến khái niệm **Shift-left**.                     |
| 4       | Sự tập trung của lỗi                   | **Defect clustering**                                        | Nguyên lý **Pareto (80/20)**: 80% lỗi nằm ở 20% module.                     |
| 5       | Nghịch lý thuốc trừ sâu                | **Pesticide paradox**                                        | Test case cũ không tìm thấy lỗi mới. Phải **Review & Update**.              |
| 6       | Kiểm thử phụ thuộc ngữ cảnh            | **Testing is context dependent**                             | Mỗi loại app có cách test khác nhau (Safety-critical vs E-commerce).        |
| 7       | Sự vắng mặt của lỗi là sai lầm         | **Absence-of-errors fallacy**                                | "No bugs" $\neq$ "Useful system". Hệ thống phải chạy được và phải hữu dụng. |

---

### 4. Quy trình kiểm thử (Test Process)

Quy trình không phải là một đường thẳng mà là các hoạt động có thể lặp lại hoặc gối đầu lên nhau:

1. **Lập kế hoạch (Test Planning):** Xác định mục tiêu và cách tiếp cận.
2. **Giám sát và kiểm soát (Test Monitoring and Control):** So sánh tiến độ thực tế với kế hoạch.
3. **Phân tích (Test Analysis):** Trả lời câu hỏi _"Test cái gì?"_ (Dựa trên yêu cầu).
4. **Thiết kế (Test Design):** Trả lời câu hỏi _"Test như thế nào?"_ (Tạo test case, test data).
5. **Triển khai (Test Implementation):** Chuẩn bị môi trường, sắp xếp test case thành quy trình chạy (Test Procedure).
6. **Thực thi (Test Execution):** Chạy test và ghi nhận kết quả.
7. **Hoàn tất (Test Completion):** Thu dọn dữ liệu, lưu trữ tài liệu, đúc kết kinh nghiệm.

---

### 5. Tâm lý học trong kiểm thử

- **Tư duy (Mindset):** Tester cần sự tò mò, tư duy phản biện, chú ý đến chi tiết và có động lực tìm ra lỗi. Developer thường có tư duy "xây dựng", Tester có tư duy "kiểm chứng".
- **Giao tiếp:** Tester thường mang "tin buồn" (phát hiện lỗi). Do đó, cần giao tiếp một cách xây dựng, khách quan, không chỉ trích cá nhân để giữ mối quan hệ tốt với đội phát triển.
- **Tư duy độc lập (Independence of testing):** Để người khác test code của mình sẽ khách quan hơn tự mình test. Các cấp độ độc lập tăng dần: _Tự test -> Tester cùng team -> Tester thuộc team độc lập -> Tester thuê ngoài._
- **Giao tiếp tích cực:** Khi báo lỗi, Tester cần tập trung vào sự thật (fact), không chỉ trích cá nhân, giữ thái độ hợp tác với Developer.
- **Whole Team Approach (Cách tiếp cận toàn đội):** Trong Agile, mọi thành viên (Dev, Tester, BA) đều chịu trách nhiệm về chất lượng.