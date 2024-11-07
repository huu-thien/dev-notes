#### JSON và JSONB

- `PostgreSQL` hỗ trợ hai loại dữ liệu: `JSON` và `JSONB`. Mặc dù các loại dữ liệu này được cho là gần như giống hệt nhau, có một số khác biệt về hiệu suất và cách thức lưu trữ.

#### JSON

- Định nghĩa: `JSON` là kiểu dữ liệu lưu trữ dữ liệu ở định dạng `JSON` (JavaScript Object Notation). Dữ liệu được lưu trữ dưới dạng văn bản thuần túy.
- `JSON`: Kiểu dữ liệu JSON lưu trữ một bản sao chính xác của dữ liệu đầu vào( khoảng trắng , thứ tự các key trong object và các khoá trùng lặp) . Điều này dẫn đến việc truy vấn chậm vì các hàm trong PostgresSql phải phân tích cú pháp mỗi khi thực hiện truy vấn.

- Ưu điểm
  - Dễ đọc: Dữ liệu được lưu trữ dưới dạng chuỗi, dễ dàng đọc và hiểu.
  - Linh hoạt: Cho phép lưu trữ cấu trúc dữ liệu không đồng nhất.
- Nhược điểm

  - Tốc độ truy vấn: Truy vấn dữ liệu từ kiểu JSON có thể chậm hơn so với JSONB.
  - Không hỗ trợ chỉ mục: Không thể tạo chỉ mục trên các trường trong JSON, điều này có thể làm giảm hiệu suất truy vấn.

#### JSONB

- Định nghĩa: `JSONB` là kiểu dữ liệu lưu trữ dữ liệu `JSON` trong định dạng nhị phân (binary). Điều này cho phép PostgreSQL tối ưu hóa lưu trữ và truy vấn dữ liệu.
- `JSONB`: `JSONB` được lưu trữ dưới dạng định dạng nhị phân và do đó không cần phân tích cú pháp khi thực hiện truy vấn. `Jsonb` sẽ không đảm bảo thứ tự chèn,khi trùng key thì sẽ lấy giá trị cuối cùng , xoá các khoảng trắng. Một lợi thế của kiểu dữ liệu `JSONB` là hỗ trợ Index do đó tạo ra sự khác biệt lớn trong vấn đề hiệu suất khi thực hiện truy vấn. Tuy nhiên, định dạng nhị phân của `JSONB` dẫn đến sự chậm trễ nhỏ trong quá trình input data(Quá trình chuyển đổi từ JSON sang định dạng nhị phân `JSONB`, Kiểm tra khóa trùng .

- Ưu điểm
  - Hiệu suất tốt hơn: Truy vấn dữ liệu nhanh hơn do được tối ưu hóa.
  - Hỗ trợ chỉ mục: Có thể tạo chỉ mục trên các trường bên trong JSONB, giúp tăng tốc độ truy vấn.
  - Tính năng tìm kiếm: Hỗ trợ các toán tử và hàm mạnh mẽ cho việc tìm kiếm và truy vấn dữ liệu JSON.
- Nhược điểm
  - Kích thước: Dữ liệu JSONB có thể chiếm nhiều dung lượng hơn so với JSON do cần không gian cho cấu trúc nhị phân.
  -Khó đọc hơn: Dữ liệu không được lưu trữ dưới dạng văn bản, có thể khó đọc hơn so với JSON.
