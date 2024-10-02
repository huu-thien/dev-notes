# Đệ quy là gì?

- Đệ quy là một phương pháp giải quyết vấn đề, trong đó nó sử dụng các trường hợp ví dụ đơn giản hơn của vấn đề để truy hồi, từ đó có thể giải quyết các vấn đề phức tạp hơn. Trong lập trình, đệ quy được thực hiện bằng cách sử dụng hàm gọi chính nó. Trong mức hiểu tối thiểu, mọi thuật toán đệ quy cần hai điều:

  - Một trường hợp cơ sở là giải pháp cho dạng đơn giản nhất của vấn đề. Trường hợp cơ sở hoạt động như một cách để dừng khỏi lời gọi đệ quy.
  - Một lời gọi đệ quy, thực hiện gọi chính nó.
  
- Điều kiện kết thúc: Điều kiện này là quan trọng vì nếu không có những trường hợp này, hàm sẽ tiếp tục gọi chính nó một cách vô hạn. Vì vậy, bước đầu tiên của việc viết bất kỳ hàm đệ quy nào là xác định các điều kiện mà tại đó nó có thể kết thúc.

# Cách làm việc với hàm đệ quy
- Khi làm việc với kỹ thuật đệ quy, các bạn có thể thực hiện phương pháp tư duy như sau:

    + Đưa ra trường hợp điều kiện dễ nhất (trường hợp kết thúc lời gọi đệ quy).
    + Chia bài toán hiện tại thành bài toán nhỏ hơn (dễ hơn 1 mức so với bài toán hiện tại).
    + Không cần tính toán hết các trước hợp lặp lại tương tự của bài toán nhỏ hơn mà chúng ta đã chia.
# Sự khác biệt giữa đệ quy và vòng lặp

- Khái niệm đệ quy và vòng lặp về cơ bản là thực thi một tập các câu lệnh lặp đi lặp lại. Sự khác biệt giữa chúng là kỹ thuật đệ quy chỉ đơn giản là một hàm sẽ thực hiện gọi chính nó, trong khi vòng lặp được thực hiện lặp đi lặp lại cho đến khi một điều kiện nhất định được đáp ứng. Nói tóm lại, cả đệ quy và vòng lặp đều phụ thuộc vào một điều kiện để biết khi nào thì dừng.

- Câu lệnh điều kiện quyết định việc kết thúc hàm đệ quy trong khi giá trị của biến điều khiển quyết định việc kết thúc câu lệnh lặp (ngoại trừ trường hợp vòng lặp while).

- Ngoài ra, hàm đệ quy vô hạn có thể dẫn đến sự cố hệ thống trong khi vòng lặp sẽ gây tiêu tốn CPU.