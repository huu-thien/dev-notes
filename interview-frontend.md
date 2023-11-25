# HTML

### 1. Cấu trúc file html

- Một tập tin HTML cơ bản thường có cấu trúc như sau:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tiêu đề trang</title>
    <!-- Các thẻ <link>, <style>, hoặc các khối mã CSS khác để định dạng trang web -->
    <!-- Các thẻ <script> hoặc các khối mã JavaScript để thêm chức năng cho trang web -->
  </head>
  <body>
    <!-- Nội dung của trang web được đặt ở đây -->
    <header>
      <!-- Phần tiêu đề của trang hoặc phần header -->
      <h1>Tiêu đề chính của trang</h1>
      <!-- Các phần tử khác trong header, ví dụ: đường dẫn menu, logo, v.v. -->
    </header>

    <nav>
      <!-- Đường dẫn menu hoặc các liên kết điều hướng -->
      <ul>
        <li><a href="#home">Trang chủ</a></li>
        <li><a href="#about">Về chúng tôi</a></li>
        <!-- Thêm các mục menu khác tùy thuộc vào nhu cầu -->
      </ul>
    </nav>

    <main>
      <!-- Nội dung chính của trang -->
      <section>
        <!-- Một phần của trang, có thể là một bài viết hoặc phần nào đó khác -->
        <h2>Tiêu đề của phần</h2>
        <p>Nội dung của phần</p>
        <!-- Thêm các phần tử khác cần thiết -->
      </section>

      <!-- Thêm các section khác nếu cần -->
    </main>

    <aside>
      <!-- Thông tin bổ sung hoặc liên quan đến nội dung chính -->
      <h2>Thông tin bổ sung</h2>
      <p>Các thông tin bổ sung, quảng cáo, liên kết liên quan, v.v.</p>
    </aside>

    <footer>
      <!-- Phần chân trang -->
      <p>© 2023 Tên Công Ty. Bản quyền được bảo lưu.</p>
    </footer>

    <!-- Các thẻ <script> hoặc các khối mã JavaScript khác để thêm chức năng cho trang web -->
  </body>
</html>
```

### 2. Thẻ doctype dùng để làm gì

- Thẻ <!DOCTYPE html> (Document Type Declaration) được sử dụng để khai báo phiên bản HTML mà trang web của bạn sử dụng. Nó không phải là một thẻ HTML thực sự mà là một chỉ dẫn cho trình duyệt web về loại phiên bản HTML cụ thể mà trang web của bạn sử dụng.

- Khi trình duyệt nhận thấy thẻ <!DOCTYPE html>, nó sẽ biết được rằng trang web được viết theo tiêu chuẩn HTML5. Điều này giúp trình duyệt hiểu cách hiển thị và xử lý trang web đó đúng cách.

### 3. Các thẻ sematic trong HTML là gì ? Nêu ví dụ

- Trong HTML, các thẻ semantic (thẻ ngữ nghĩa) được sử dụng để mô tả ý nghĩa của nội dung mà chúng bao bọc, thay vì chỉ đơn giản là định dạng nó. Các thẻ semantic giúp trình duyệt và các công cụ tìm kiếm hiểu rõ hơn về cấu trúc và nội dung của trang web. Dưới đây là một số thẻ semantic phổ biến:
  `<header>`: Đại diện cho phần tiêu đề của trang hoặc một phần của trang.
  `<nav>`: Chứa các liên kết điều hướng (navigation) của trang web.
  `<main>`: Đóng gói nội dung chính của trang.
  `<article>`: Được sử dụng để bao bọc một phần độc lập, tự đủ nghĩa trong trang, như một bài viết hoặc bài blog.
  `<section>`: Đại diện cho một phần trong một trang, thường kèm theo tiêu đề.
  `<aside>`: Chứa thông tin bổ sung hoặc liên quan đến nội dung chính, thường được đặt bên cạnh nó.
  `<footer>`: Đại diện cho phần chân trang, thường chứa thông tin về tác giả, bản quyền, hoặc liên kết liên quan.

### 4. Phân biệt thẻ inline và block ? Nêu ví dụ

#### Thẻ inline:

- Chiều rộng và chiều cao của thẻ inline chỉ bao gồm nội dung bên trong nó. Nó chỉ chiếm một phần nhỏ trong không gian xếp hạng của nó.
- Thẻ inline không bắt buộc các phần tử khác phải xuống dòng khi chúng xuất hiện. Chúng sẽ xuất hiện liền kề nhau trên cùng một dòng
- Ví dụ về thẻ inline là `<span>`, `<a>`, `<strong>`, `<em>`, `<img>`, và `<br>`.

#### Thẻ block:

- Thẻ block chiếm toàn bộ chiều rộng của phần cha và một dòng mới bắt đầu và kết thúc sau nó.
- Các phần tử block bắt buộc phải xuống dòng và chiếm một "khối" trên trang.
- Ví dụ về thẻ block là `<div>`, `<p>`, `<h1>`, `<ul>`, `<li>`, và `<blockquote>`.

### 5. Thẻ `<img/>` có 2 thành phần nào, alt có tác dụng gì ?

- Thẻ `<img>` trong HTML có hai thuộc tính chính quan trọng là `src` và `alt`.
- `src` : Đây là thuộc tính bắt buộc, nó chỉ định đường dẫn đến nguồn ảnh (URL hoặc đường dẫn cục bộ) mà trình duyệt sẽ sử dụng để tải ảnh.
- `alt`: Đây là thuộc tính tùy chọn nhưng quan trọng, nó cung cấp một văn bản mô tả ngắn cho ảnh. Mục đích chính của alt là cung cấp thông tin cho người dùng không thể xem được hình ảnh.

### 6. Giải thích thẻ `svg`, `canvas`

- Cả thẻ `<svg>` và `<canvas>` đều là các phần tử HTML được sử dụng để vẽ đồ họa vector và bitmap trên trang web, nhưng chúng có cách tiếp cận và sử dụng khác nhau.
- `<svg>` được sử dụng để vẽ đồ họa vector, nghĩa là các hình ảnh dựa trên công nghệ vector với khả năng thay đổi kích thước mà không làm mất chất lượng.

  - Ưu Điểm:
    - Phù hợp cho việc vẽ đồ họa có tính chất thay đổi kích thước.
    - Dễ dàng tương tác và làm việc với sự kiện.

- `<canvas>` được sử dụng để vẽ đồ họa raster (bitmap), tức là hình ảnh dựa trên pixels và không có khả năng thay đổi kích thước mà không làm mất chất lượng.
  - Ưu Điểm:
    - Hiệu suất cao cho các hình ảnh tĩnh.
    - Thích hợp cho các ứng dụng yêu cầu vẽ đồ họa động và tương tác.

### 7. Thẻ `label` dùng để làm gì ?

- Thẻ `<label>` trong HTML được sử dụng để liên kết với một phần tử đầu vào (input element). Mục đích chính của nó là cung cấp một nhãn mô tả cho phần tử đầu vào, làm tăng khả năng tương tác và hiểu biết của người dùng.
- Các ưu điểm và mục đích chính của việc sử dụng thẻ `<label>` bao gồm:
  - Tăng Khả Năng Tương Tác: Khi người dùng nhấp chuột lên nhãn (`<label>`), nó sẽ kích hoạt phần tử đầu vào tương ứng (`<input>`, `<textarea>`, hoặc `<select>`). Điều này giúp tăng khả năng tương tác và giúp người dùng dễ dàng chọn hoặc nhập thông tin.
  - Tính Dễ Đọc và Hiểu: Tăng tính dễ đọc và hiểu của mẫu (form). Nhãn giúp mô tả ý nghĩa của trường dữ liệu, giúp người dùng hiểu rõ hơn về thông tin cần nhập.
- Thuộc tính `for` trong thẻ `<label>` được sử dụng để liên kết với một phần tử đầu vào cụ thể trên trang web. Nó tạo một mối quan hệ giữa nhãn và phần tử đầu vào bằng cách sử dụng giá trị của thuộc tính `id` của phần tử đầu vào.

### 8. Thẻ `<form/>` dùng để làm gì ?

- Thẻ `<form>` trong HTML được sử dụng để tạo một mẫu (form), một khu vực chứa các phần tử đầu vào (input), như ô văn bản, nút radio, nút checkbox, và nút gửi (submit button), cho phép người dùng nhập dữ liệu và gửi nó đến máy chủ để xử lý.
  - Thuộc tính `action`: xác định URL hoặc đường dẫn nơi dữ liệu mẫu sẽ được gửi đến để xử lý.
  - Thuộc tính `method`: Xác định phương thức gửi dữ liệu. Có hai giá trị phổ biến là GET và POST.
    - `GET`: Dữ liệu sẽ được gửi trong URL, thích hợp cho các tìm kiếm và yêu cầu không thay đổi dữ liệu.
    - `POST`: Dữ liệu sẽ được gửi như một phần của yêu cầu HTTP và thích hợp cho việc gửi dữ liệu lớn và nhạy cảm.
  - thuộc tính `target`: Xác định cửa sổ hoặc khung mục tiêu để hiển thị kết quả khi biểu mẫu được gửi. Các giá trị phổ biến bao gồm `_blank` (mở trong cửa sổ mới), `_self` (mở trong cùng một cửa sổ), `_parent`, và `_top`.
