---
tags: dotnet 
---
### Boxing - Unboxing

- Boxing là qtrinh chuyển tham trị sang tham chiếu
    1. Khởi tạo đối tượng trong vùng Heap
    2. Copy giá trị của biến vào đối tượng
    3. object obj = value;
- Unboxing là qtrinh đưa giữ liệu tham chiếu về tham trị
    1. Kiểm trả đối tượng cần unboxing có đúng kiểu dữ kiệu đưa ra không
    2. Copy giá trị của đối tượng sang biến tham trị (hoặc thông báo lỗi)
    3. int newValue = (int)obj