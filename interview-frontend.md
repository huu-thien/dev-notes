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
  - `<header>`: Đại diện cho phần tiêu đề của trang hoặc một phần của trang.
  - `<nav>`: Chứa các liên kết điều hướng (navigation) của trang web.
  - `<main>`: Đóng gói nội dung chính của trang.
  - `<article>`: Được sử dụng để bao bọc một phần độc lập, tự đủ nghĩa trong trang, như một bài viết hoặc bài blog.
  - `<section>`: Đại diện cho một phần trong một trang, thường kèm theo tiêu đề.
  - `<aside>`: Chứa thông tin bổ sung hoặc liên quan đến nội dung chính, thường được đặt bên cạnh nó.
  - `<footer>`: Đại diện cho phần chân trang, thường chứa thông tin về tác giả, bản quyền, hoặc liên kết liên quan.

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

### 9. So sánh icon khi sử dụng bằng SVG và class, hai cái đó khác gì nhau ?

- `SVG` là một định dạng hình ảnh vector
- `Class` là một phần của CSS được sử dụng để áp dụng kiểu thiết kế cho các phần tử HTML

###### `SVG`

- SVG có thể tùy chỉnh kích thước mà không làm mất chất lượng.
- Có thể tương tác với JavaScript để thêm hiệu ứng hoặc sự kiện.

###### `Class`

- Dễ dàng thêm các hiệu ứng hoặc kiểu dáng bổ sung thông qua CSS.
- Thường dễ quản lý và tái sử dụng.

###### `Làm sao có thể lấy được Icon dạng SVG?`

- Tìm kiếm trên Internet: Có nhiều trang web cung cấp bộ sưu tập icon vector miễn phí như FontAwesome, Iconmonstr, Material Icons, và nhiều trang web khác.

- Tích hợp từ thư viện hoặc framework: Một số thư viện và framework front-end cung cấp icon dạng SVG sẵn có, và bạn có thể tích hợp chúng vào dự án của mình. Ví dụ, Bootstrap, FontAwesome, Material-UI đều cung cấp icon dạng SVG.

# CSS

### 1. Kể tên các loại đơn vị trong css

- Đơn vị tuyệt đối: absolute
  - `px`: kích thước cố định, không thay đổi
- Đơn vị tương đối:
  - `%`: kích thước phụ thuộc vào thẻ chứa nó, có thể thay đổi
  - `rem`: phụ thuộc vào thẻ `<html>` chứa thuộc tính font-size, giá trị mặc định nếu thẻ `<html>` không có thuộc tính font-size là `1 rem = 16px`
  - `em`: phụ thuộc vào thẻ gần nhất chứa nó có thuộc tính font-size
  - `vw` - (viewport-width): 1vw = 1% chiều ngang trình duyệt
  - `vh` - (viewport-height): 1vh = 1% chiều dọc trình duyệt

### 2. Thuộc tính `position` trong css:

- Thuộc tính `position` trong CSS được sử dụng để xác định cách một phần tử được định vị (vị trí) trong trang web. Có năm giá trị cơ bản cho thuộc tính position:

```css
position: static | relative | absolute | fixed | sticky;
```

- Các thuộc tính có nhiệm vụ căn chỉnh vị trí của element ( gọi chúng là các thuộc tính Helper):

```css
top | right | bottom | left | z-index
```

###### Vậy `z-index` là gì?

- Chúng ta có chiều cao (height) và chiều rộng (width) (x,y) là 2 chiều của element. Z chính là chiều thứ 3 của element. Một element hiện thị đè lên trên một element khác có nghĩa là giá trị `z-index` của nó đã được tăng. `z-index` cũng không hoạt động với `position: static` hoặc khi không có thuộc tính `position`
- Element càng ở bên trên thì `z-index` của nó càng cao.

###### a. Position : static

- `position: static` là giá trị mặc định của position. Dù chúng ta có khai báo chúng hay không thì các element sẽ được sắp xếp vị trí một cách như bình thường trên trang web.

###### b. Position : relative

- `position: relative` :vị trí tương đối, vị trí mới của một element tương quan tới vị trí mặc định của nó.

- Với `position: relative` và các giá trị khác ngoài `static`, chúng ta có thể dễ dàng thay đổi vị trí của chúng. Nhưng chỉ khai báo `position: relative` thôi chưa đủ, chúng ta cần đến việc điều chỉnh vị trí của element bằng các thuộc tính `helper`. ví dụ:

```css
.box-orange {
  position: relative; // chúng ta có thể di chuyển được element
  background: orange;
  width: 100px;
  height: 100px;
  top: 100px; // dịch chuyển xuống 100px từ vị trí ban đầu của nó
  left: 100px; // dịch chuyển sang phải 100px
}
```

###### c. Position : absolute

- `position: absolute`: vị trí tuyệt đối, phụ thuộc vào thẻ cha gần nhất có thuộc tính `position: relative`, lấy thẻ cha đó làm gốc.
- Một element được khai báo với thuộc tính `position: absolute` sẽ được loại bỏ khỏi luồng document (document flow). Vị trí mặc định của element sẽ là điểm bắt đầu (top-left) của element cha. Nếu nó không có bất cứ thẻ cha nào thì thẻ document `<html>` sẽ là cha của nó.
- Vì `position: absolute` đã được loại bỏ khỏi document flow, các element khác do element được định nghĩa `position: absolute` được coi là đã bị xóa khỏi trang web.

###### c. Position : fixed

- Giống như `position: absolute`, các element được khai báo với position này sẽ được loại bỏ khỏi document flow. Chỉ khác là:
  - Vị trí của chúng **CHỈ** tương quan với thẻ `<html>`
  - Chúng không bị ảnh hưởng bới scroll
- Việc scroll trang web không hề thay đổi vị trí của element fixed. Nó được xác định vị trí so với cửa sổ trình duyệt. Và để xác định vị trí của nó thì các bạn cũng phải kết hợp với các thuộc tính top, right, bottom, left như 2 thuộc tính phía trên.

###### c. Position : sticky

- `position: sticky` có thể hiểu đơn giản là sự kết hợp của `position: relative` và `position: fixed`.
- Nó cũng na ná `fixed` nhưng mà khi các bạn scroll đến vị trí của nó sẽ giống hệt như `fixed` và khi các bạn scroll lên ra khỏi nó thì nó sẽ quay lại vị trí ban đầu dưới dạng `relative`.

- Note: `position: sticky` không dùng được trên IE và một số version đầu của Edge nên không khuyến khích sử dụng.

### 3. Flexbox Layout

- [Link tài liệu](https://topdev.vn/blog/su-dung-bo-cuc-trang-flexbox-trong-css/)
- Là một kiểu bố cục trang có khả năng tự cân đối kích thước, thay đổi chiều rộng/chiều cao và thứ tự phần tử bên trong để phù hợp với tất cả các loại thiết bị hiển thị và kích thước màn hình.
- Trường hợp sử dụng: phù hợp để thiết lập bố cục ở quy mô nhỏ như đối với những danh sách hiển thị trong 1 dòng hoặc 1 cột : navigation, card content, action list, ....

- Flexbox layout có 2 thành phần chính: flex-container và flex-item
- Các item sẽ được bố trí theo trục `main axis` (bắt đầu từ `main-start`, kết thúc ở `main-end`) hoặc theo trục `cross axis` (bắt đầu từ `cross-start`, kết thúc ở `cross-end`).

  - `main axis`: đây là trục chính để điều khiển hướng mà các item sẽ hiển thị. Lưu ý, main axis không phải lúc nào cũng nằm ngang như sơ đồ trên, bạn có thể sử dụng thuộc tính flex-direction để thay đổi hướng của trục và lúc đó các item sẽ hiển thị theo nó.
  - `main-start` | `main-end`: khi thiết lập flexbox, các item nằm trong container hiển thị từ điểm bắt đầu gọi là `main-start` tới điểm kết thúc gọi là `main-end`.
  - `main size`: kích thước (chiều rộng hoặc chiều cao) của các item, tùy thuộc vào hướng của `main axis`.
  - `cross axis`: `cross axis` luôn là trục vuông góc của `main axis`. Hướng của nó phụ thuộc vào hướng của `main axis`.
  - `cross-start | cross-end`: có ý nghĩa tương tự nhưng luôn vuông góc với `main start, main end`.
  - `cross size`: kích thước (chiều rộng hoặc chiều cao) của các item dựa trên trục `cross axis`, tùy thuộc vào hướng của `main axis`.

##### `Các thuộc tính của Flex Container`

- `display` : Để sử dụng flex trong css thì đơn giản là chúng ta chỉ cần khai báo thuộc tính `display: flex`

```css
.container {
  display: flex; /* hoặc inline-flex */
}
```

- `flex-direction`: xác định hướng của main-axis để container sắp xếp các item.

```css
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}
/* - Các tham số:
  - `row`: mặc định, flex item được sắp xếp theo chiều ngang, từ trái qua phải (main axis nằm ngang).
  - `row-reverse`: flex item được sắp xếp theo chiều ngang, từ phải qua trái (main axis nằm ngang).
  - `column`: flex item được sắp xếp theo chiều dọc, từ trên xuống dưới (main axis đứng dọc).
  - `column-reverse`: flex item được sắp xếp theo chiều dọc, từ dưới lên trên (main axis đứng dọc). */
```

- `flex-wrap`: cho phép item tự động xuống dòng khi kích thước container thay đổi.

```css
.container {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
/* Tham số:
`nowrap`: mặc định, tất cả các item sẽ nằm trên một dòng.
`wrap`: khi kích thước container thay đổi và tổng chiều rộng các item cộng lại lớn hơn chiều rộng của container thì item sẽ tự động xuống dòng.
`wrap-reverse`: tương tự như wrap, nhưng thay vì xuống dòng thì item sẽ tự động nhảy lên trên. */
```

- `flex-flow` : sử dụng để gộp chung hai thuộc tính `flex-direction` và `flex-wrap`.

```css
.flex-container {
  display: flex;
  flex-flow: row wrap;
}
```

- `justify-content`: điều chỉnh vị trí bắt đầu và căn chỉnh các item bên trong `container` theo dọc theo trục `main axis`, chiều ngang hoặc chiều dọc tùy thuộc vào `flex-direction`

```css
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around
    | space-evenly;
}
/* Các tham số:
`flex-start`: giá trị mặc định, item sẽ bắt đầu từ lề chính main-start của container.
`flex-end`: item sẽ bắt đầu từ lề chính main-end của container (khác với row-reverse là đổi hướng hiển thị).
`center`: item sẽ nằm giữa container.
`space-between`: các item sẽ có khoảng cách giữa các phần tử bằng nhau do container sẽ tự động căn khoảng cách, item đầu tiên sát lề chứa điểm main-start, item cuối cùng sát lề chứa điểm main-end.
`space-around`: tương tự space-between, nhưng khác ở chỗ là mỗi item có khoảng cách 2 bên cạnh và những khoảng cách này bằng nhau.
`space-evenly`: các item được phân phối sao cho khoảng cách giữa hai item bất kỳ, giữa item và các lề là bằng nhau. */
```

- `align-items`: sử dụng để điều chỉnh vị trí bắt đầu và căn chỉnh các item bên trong `container` theo dọc theo trục `cross axis`, chiều ngang hoặc chiều dọc tùy thuộc vào `flex-direction`.

```css
.container {
  align-items: stretch | flex-start | flex-end | center | baseline;
}
/* 
`stretch`: giá trị mặc định, các phần tử sẽ được kéo dài để lấp đầy container chứa nó, nhưng sẽ ưu tiên giá trị height/width nếu có, khi đó item sẽ không cao full mà chỉ lấy giá trị height/width mà bạn set.
`flex-start`: item sẽ bắt đầu từ lề cross-start của container.
`flex-end`: item sẽ bắt đầu từ lề cross-end của container. Trường hợp mặc định với cross axis đứng dọc, flex-direction: row thì các item sẽ dồn xuống dưới.
`center`: item sẽ căn giữa theo chiều của cross axis.
`baseline`: item được căn chỉnh theo đường cơ sở của chúng.
*/
```

- `align-content`: sử dụng để căn chỉnh khoảng cách các item bên trong container theo dọc theo trục `cross axis`, chiều ngang hoặc chiều dọc tùy thuộc vào `flex-direction`.

```css
.container {
  align-content: flex-start | flex-end | center | space-between | space-around |
    stretch;
}
```

##### `Các thuộc tính của Flex Item`

- `order`: Theo mặc định, các item sẽ hiển thị theo thứ tự xuất hiện trong HTML, nhưng với thuộc tính `order`, ta có thể sắp xếp lại vị trí sắp xếp của các item.

```css
.item {
  order: <integer>; /* mặc định là 0 */
}
```

- `flex-grow`: cho phép các phần tử giãn theo độ rộng của container.

```css
.item {
  flex-grow: <number>; /* mặc định là 0 */
}
```

- `flex-shrink`: ngược lại với thuộc tính `flex-grow` ở trên, nó không giãn ra mà lại co lại khi chúng ta thay đổi độ rộng của `container`.

  - Giá trị mặc định trong `flex-shrink` là 1, cho phép các phần tử co lại bằng nhau khi độ rộng container giảm xuống. Nếu flex-shrink: 0 thì item sẽ không co giãn mà lấy nguyên giá trị của thuộc tính width/height.

```css
.item {
  flex-shrink: <number>; /* mặc định là 1 */
}
```

- `flex-basis`: sử dụng để xác định độ dài ban đầu của một item.

```css
.item {
  flex-basis: <length> | auto; /* mặc định là auto */
}
```

- `align-self`: có tác dụng tương tự như `align-items` của phần `container` nhưng sử dụng riêng cho từng item, bạn có thsể dùng nó để đặt lại vị trí cho một số item mà `align-items` đã quy định.

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```
