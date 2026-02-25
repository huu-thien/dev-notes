Để vượt qua kỳ thi ISTQB, bạn cần làm quen với 3 dạng câu hỏi chính: **Nhận biết (K1)**, **Thấu hiểu (K2)** và **Áp dụng/Giải bài tập (K3)**. Dạng K3 (thường nằm ở Chương 4) là dạng dễ mất điểm nhất nếu không nắm chắc phương pháp.

Dưới đây là các dạng bài tập điển hình nhất kèm cách giải chi tiết:

---

### Dạng 1: Phân vùng tương đương (EP) & Giá trị biên (BVA)

**Đề bài:** Một ứng dụng cho phép người dùng nhập "Số lượng mua hàng". Điều kiện: Số lượng phải là số nguyên từ **10 đến 50**. Hãy xác định bộ giá trị kiểm thử theo kỹ thuật **BVA 2 điểm**.

**Cách giải:**

1. **Xác định vùng:**
    
    - Vùng không hợp lệ (thấp): $< 10$
        
    - Vùng hợp lệ: $10 - 50$
        
    - Vùng không hợp lệ (cao): $> 50$
        
2. **Xác định các biên:** Biên dưới là **10**, Biên trên là **50**.
    
3. **Áp dụng quy tắc 2 điểm:** Với mỗi biên, ta lấy giá trị tại biên và giá trị ngay sát ngoài biên đó.
    
    - Biên dưới (10): Lấy **10** (Valid) và **9** (Invalid).
        
    - Biên trên (50): Lấy **50** (Valid) và **51** (Invalid).
        
        **=> Đáp án:** Bộ giá trị là $\{9, 10, 50, 51\}$.
        

---

### Dạng 2: Bảng quyết định (Decision Table)

**Đề bài:** Một hệ thống tính phí vận chuyển:

- Nếu khách hàng là "Premium" và chọn "Giao hàng nhanh": Phí 10$.
    
- Nếu khách hàng là "Premium" và chọn "Giao hàng thường": Phí 5$.
    
- Nếu khách hàng là "Normal": Phí 15$ bất kể hình thức giao hàng.
    
    Hỏi cần tối thiểu bao nhiêu test case để bao phủ hết các quy tắc?
    

**Cách giải:**

1. **Liệt kê các điều kiện (Conditions):**
    
    - C1: Loại khách hàng (Premium / Normal)
        
    - C2: Hình thức giao hàng (Nhanh / Thường)
        
2. **Lập bảng kết hợp:**
    
    - Rule 1: Premium + Nhanh -> 10$
        
    - Rule 2: Premium + Thường -> 5$
        
    - Rule 3: Normal + Nhanh -> 15$
        
    - Rule 4: Normal + Thường -> 15$
        
        **=> Đáp án:** Cần **4 test case**. (Lưu ý: Đôi khi đề bài yêu cầu rút gọn bảng nếu các điều kiện không làm thay đổi kết quả, nhưng thường trong đề Foundation, họ sẽ hỏi số quy tắc cơ bản).
        

---

### Dạng 3: Kiểm thử Hộp trắng (White-box - Độ bao phủ)

**Đề bài:** Cho đoạn mã sau:

JavaScript

```
IF (A > B) {
    Print "A lớn hơn";
}
IF (C > D) {
    Print "C lớn hơn";
}
```

Hỏi cần tối thiểu bao nhiêu test case để đạt **100% Decision Coverage (Bao phủ nhánh)**?

**Cách giải:**

1. **Vẽ luồng:** Có 2 câu lệnh IF độc lập. Mỗi IF có 2 nhánh (True/False).
    
2. **Thiết kế test case:**
    
    - TC1: $A > B$ (True) và $C > D$ (True). -> Bao phủ được 2 nhánh True.
        
    - TC2: $A \le B$ (False) và $C \le D$ (False). -> Bao phủ được 2 nhánh False.
        
        **=> Đáp án:** Cần **2 test case**.
        

---

### Dạng 4: Quản lý rủi ro (Risk Management)

**Đề bài:** Trong một dự án, việc "Hệ thống bị sập khi có 1000 người truy cập cùng lúc" được phân loại là gì?

A. Project Risk (Rủi ro dự án)

B. Product Risk (Rủi ro sản phẩm)

C. Test Risk (Rủi ro kiểm thử)

D. Business Risk (Rủi ro kinh doanh)

**Cách giải:**

- **Phân tích:** Lỗi này liên quan trực tiếp đến tính năng/chất lượng của phần mềm (hiệu năng). Những gì thuộc về lỗi phần mềm thì là Product Risk.
    
- **Project Risk** thường là về: Thiếu người, chậm deadline, thiếu thiết bị.
    
    **=> Đáp án:** **B. Product Risk**.
    

---

### Mẹo nhỏ khi làm bài:

- **Đọc kỹ từ khóa:** Đề hỏi "Minimum" (tối thiểu) hay "Maximum" (tối đa).
    
- **Loại trừ:** Trong các câu hỏi lý thuyết, thường có 2 đáp án nghe rất vô lý, hãy loại bỏ chúng trước để tăng tỉ lệ đúng.
    
- **Vẽ sơ đồ:** Với các bài Chương 4, đừng nhẩm trong đầu, hãy vẽ trục số (cho BVA) hoặc sơ đồ luồng (cho White-box) ra nháp.