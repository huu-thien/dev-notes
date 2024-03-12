---
tags: general 
---
- Top-down approach là cách tiếp cận vấn đề theo hướng “chia để trị”, ta chia một vấn đề lớn thành cách vấn đề nhỏ hơn.
    - Giúp ta xác định rõ ràng hơn những công việc cần thực hiện
    - Giải quyết những vấn đề nhỏ sẽ dễ dàng hơn
    - Cho phép nhiều người tham gia vào giải quyết vấn đề
- Ứng dụng trong lập trình:
    - Ghi ra các bước chung cần thực hiện
    - Liệt kê ra cần những hàm, class… có chức năng gì để thực hiện công việc này (chưa cần code)
    - Từ khung sườn có được, ta thực hiện xây dựng và test từng hàm một
        
        ```csharp
        //chức năng tạo đơn hàng
        1.kiểm tra số lượng
        2.tính giá trị đơn hàng
        3.lưu thông tin đơn hàng
        4.trừ số lượng trong kho
        5.tạo và trả về thông tin thanh toán
        
        //liệt kê ra các hàm
        public PaymentInfo CreateOrder(OrderInfo orderInfo)
        {
        		var isValidQuantity = CheckQuantity(orderInfo.Items);
        		if (!isValidQuantity)
        		{
        				throw Exception("Not enough products left!");
        		}
        		double orderTotal = CaculateOrder(orderInfo);
        		SaveOrderInfoToDB(orderInfo, orderTotal);
        		DecreaseProductCount(orderInfo.Items);
        		var paymentInfo = CreatePaymentInfo(orderInfo.Items, orderTotal);
        		return paymentInfo;
        }
        ```
        
- Tips:
    - Với mỗi class ta cần hiểu rõ vai trò của nó, xem xét nó thuộc layer nào và phải đảm bảo nguyên tắc Single Responsibility
    - Tương tự, mỗi method cần đảm bảo nguyên tắc Single Responsibility, cần hiểu rõ trình tự thực hiện của mỗi method trước khi code
    - Thường xuyên thực hiện refactor:
        - Mỗi khi hoàn thiện 1 feature và nó hoạt động đúng
        - Đặt ra các câu hỏi:
            - Hàm/class đã ở đúng layer chưa
            - Đặt hàm ở trong class này đã đảm bảo tính Single Responsibility chưa?
            - Có thể cho class thành abstract class và cho các hàm được thừa kế không?
            - Có code bị trùng lặp không?
    - Giải quyết vấn đề: kiến thức chuyên môn và kinh nghiệm
        - hiểu rõ công nghệ → hiểu rõ vấn đề và cách giải quyết
        - chia sẻ kiến thức là một cách tốt để củng cố kiến thức
        - Note lại những vấn đề đã gặp để tiện tra cứu