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

- Các thuộc tính CSS có tính kế thừa là những thuộc tính mà giá trị được áp dụng cho một phần tử con sẽ được "kế thừa" từ phần tử cha nếu phần tử con không có giá trị riêng cho thuộc tính đó : `font-family`, `font-size`,`font-weight`, `font-style`, `color`, `line-height`,...

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
#### Tham khảo `flex-grow` `flex-shrink` `flex-basic`
[evondev](https://evondev.com/css-flexbox-phan-3/)
[Blog](https://homiedev.com/tim-hieu-ve-flex-grow-flex-shrink-va-flex-basis/)

### 4. Grid Layout

[Link tài liệu](https://viblo.asia/p/giai-thich-thuat-ngu-css-grid-layout-RnB5p10wKPG)

- Bao gồm grid container và grid item

##### a.Column - cột

- Các hàng dọc của các thành phần grid được gọi là cột.
- `grid-template-columns`:
  - auto auto auto => 3 cột tự động cân bằng
  - 20% 30% 50% => 3 cột tùy chỉnh tỷ lệ

##### b. Rows - hàng

- Các hàng ngang của các thành phần grid được gọi là hàng
- `grid-template-rows`: (tương tự cột)

##### c. Gap - khoảng cách

- Khoảng cách giữa mỗi cột / hàng được gọi là khoảng trống.
- `grid-column-gap` : khoảng cách giữa các cột
- `grid-row-gap` : khoảng cách giữa các hàng
- `grid-gap`: khoảng cách hàng và cột

##### d. Line - Viền nằm giữa các cột và hàng

- Tùy chỉnh gộp cột bằng cách CSS ở từng ô (cell) theo các thuộc tính sau :
  - grid-columns-start: [line bắt đầu]
  - grid-columns-end: [line kết thúc]
  - grid-row-start: [line bắt đầu]
  - grid-row-end: [line kết thúc]
  - `short-hand` : grid-row : [line bắt đầu] / [line kêt thúc]
  - `short-hand` : grid-colunms : [line bắt đầu] / [line kêt thúc]

### 4. Giải thích về box-model trong css

- Mô hình `box model` là một khái niệm quan trọng trong CSS, mô tả cách mỗi phần tử HTML được hiển thị trên trang web bằng cách đặt vào một "hộp" (box). Mỗi hộp này bao gồm các thành phần chính: `content, padding, border, và margin`. Dưới đây là giải thích chi tiết về mỗi thành phần:
  - `Content` (Nội dung):
    - Đại diện cho khu vực chứa nội dung thực tế của phần tử, chẳng hạn như văn bản, hình ảnh, hoặc phần tử con.
    - Kích thước của phần `content` có thể được xác định bằng các thuộc tính như width và height.
  - `Padding` (Khoảng đệm):
    - Là khoảng trắng giữa nội dung và ranh giới của phần tử (border).
    - Padding được xác định bằng các thuộc tính như `padding-top, padding-right, padding-bottom, và padding-left.`
  - `Border` (Ranh giới):
    - Là ranh giới xung quanh phần nội dung và padding.
    - Được xác định bằng các thuộc tính như `border-width, border-style, và border-color.`
  - `Margin` (Khoảng trống):
    - Là khoảng trống bên ngoài phần border, giữa ranh giới của phần tử và các phần tử khác xung quanh.
    - Được xác định bằng các thuộc tính như `margin-top, margin-right, margin-bottom, và margin-left.`

### 5. `box-sizing`: phân biệt `border-box`, `content-box`

- Thuộc tính `box-sizing` trong CSS được sử dụng để xác định cách kích thước tổng của một phần tử được tính toán. Có hai giá trị chính cho `box-sizing`: `content-box` và `border-box`.
- `content-box` (Giá trị mặc định):

  - Kích thước tổng của một phần tử là tổng của width và height, chỉ bao gồm nội dung (content).
  - Padding và border sẽ được thêm vào kích thước này.
  - Điều này có nghĩa là nếu bạn đặt width: 100px;, và thêm padding: 10px; và border: 5px;, tổng chiều rộng của phần tử sẽ là 100px + 10px + 5px = 115px.

- `border-box:`
  - Kích thước tổng của một phần tử bao gồm width, height, padding, và border.
  - Điều này có nghĩa là nếu bạn đặt width: 100px;, và thêm padding: 10px; và border: 5px;, kích thước tổng sẽ vẫn là 100px, và padding cũng như border sẽ được tính trong kích thước này.
- Lựa chọn giữa content-box và border-box phụ thuộc vào yêu cầu cụ thể của bạn. Sử dụng border-box thường được ưa chuộng trong quá trình thiết kế giao diện, vì nó giúp quản lý kích thước của các phần tử một cách dễ dàng hơn trong môi trường responsive và layout.

### 6. Phân biệt giữa `animation` với `transition` ?

- Cả `animation` và `transition` đều là các tính năng trong CSS được sử dụng để tạo hiệu ứng chuyển động, nhưng chúng có sự khác biệt về cách chúng được sử dụng và cung cấp các khả năng khác nhau.

##### Transition:

###### 1. Mô tả:

- Transition hoạt động bằng cách thay đổi giá trị thuộc tính một cách trơn tru từ giá trị này sang giá trị khác trong khoảng thời gian nhất định. Các tham số thường được sử dụng:

  - transition-delay: khoảng thời gian dừng cho mỗi hiệu ứng chuyển đổi.
  - transition-duration: khoảng thời gian chuyển đổi diễn ra.
  - transition-property: thuộc tính cần chuyển đổi.
  - transition-timing-function: tốc độ chuyển đổi diễn ra.

```css
div {
  width: 100px;
  height: 100px;
  background: purple;
  -webkit-transition: width 2s; /* For Safari 3.1 to 6.0 */
  transition: width 2s;
}
div:hover {
  width: 300px;
}
```

###### 1. Cách sử dụng:

- Được kích hoạt bởi sự thay đổi của một thuộc tính CSS.
- Được đặt trong quy tắc CSS của phần tử.
- Có thể được thiết lập bằng cách sử dụng thuộc tính transition và xác định thuộc tính nào muốn tạo hiệu ứng.

```css
.example {
  transition: property duration timing-function delay;
}
```

##### Animation:

###### 1. Mô tả:

- Animation là cách tạo ra các hiệu ứng chuyển động phức tạp hơn bằng cách sử dụng khung hình (frames).
- Cho phép định rõ các keyframe (khung hình cụ thể) và cách thuộc tính thay đổi qua từng khung hình.

###### 1. Cách sử dụng:

- Được định rõ thông qua @keyframes rule, mô tả các trạng thái khác nhau của phần tử qua thời gian.
- Được kích hoạt bằng sự kiện hoặc bằng cách thêm class có chứa animation vào phần tử.

```css
@keyframes example {
  0% {
    /* initial state */
  }
  50% {
    /* intermediate state */
  }
  100% {
    /* final state */
  }
}

.example {
  animation: example duration timing-function delay iteration-count direction
    fill-mode;
}
```

##### Tóm tắt:

- `Transition`: Đơn giản, dễ sử dụng, thích hợp cho các hiệu ứng đơn giản. Chuyển đổi từ trạng thái này sang trạng thái khác một cách mềm dẻo.
- `Animation`: Mạnh mẽ và linh hoạt, thích hợp cho các hiệu ứng phức tạp hơn. Sử dụng khung hình và có thể đặc tả chi tiết các trạng thái của phần tử qua thời gian.

### 8. Các cách để select 1 element html để css ?

- Chọn theo tên thẻ
- Chọn theo ID
- Chọn theo Class
- Chọn theo Attribute
- Chọn phần tử con cụ thể
- Chọn phần tử anh em

### 8. Psudo class, Psudo element là gì ?

###### Pseudo-classes (Lớp giả tưởng):

- được sử dụng để chọn phần của các phần tử dựa trên trạng thái hoặc vị trí của phần tử trong DOM. Dưới đây là một số pseudo-classes phổ biến:
  - `:hover`: Chọn phần tử khi chuột di chuyển qua nó.
  - `:active`: Chọn phần tử khi nó được kích hoạt (được nhấn giữ).
  - `:focus`: Chọn phần tử khi nó đang được tập trung.
  - `:first-child`: Chọn phần tử là con đầu tiên của phần tử cha.
  - `:last-child`: Chọn phần tử là con cuối cùng của phần tử cha.

###### Pseudo-elements (Thẻ giả tưởng):

- Cho phép bạn chọn và định dạng một phần cụ thể của phần tử, thường là nơi để thêm nội dung mới hoặc tạo kiểu cho phần của phần tử mà không cần thêm phần tử HTML mới.
  - `::before`: Thêm nội dung vào phần đầu của phần tử.
  - `::after`: Thêm nội dung vào phần cuối của phần tử.
  - `::first-line`: Chọn và kiểu định dạng dòng đầu tiên trong một phần tử văn bản.
  - `::first-letter`: Chọn và kiểu định dạng chữ cái đầu tiên trong một phần tử văn bản.

### 9. Sắp xếp các thứ tự ưu tiên khi css ?

- Trong CSS, thứ tự ưu tiên của các quy tắc (rules) được xác định bởi một số yếu tố, và nếu có xung đột giữa chúng, quy tắc nào có ưu tiên cao hơn sẽ được áp dụng. Dưới đây là thứ tự ưu tiên chung từ cao đến thấp:
  - `!important` : Quy tắc có thuộc tính được khai báo với `!important` sẽ có ưu tiên cao nhất.
  - `Inline Styles`: Styles được đặt trực tiếp trong thẻ HTML sẽ có ưu tiên cao hơn so với các quy tắc khác
  - `#id Selector` : Selector có độ ưu tiên cao hơn nếu nó là một #id selector.
  - `.class Selector, [attribute], and :pseudo-class` : `Selector .class, [attribute], và :pseudo-class` có độ ưu tiên thấp hơn so với `#id`.
  - `Element Selector`: Selector phần tử có độ ưu tiên thấp nhất.

### 10. Thẻ select option có css được giống như design không?

- Thẻ `<select>` và các phần tử `<option>` có thể được tùy chỉnh bằng CSS để thay đổi giao diện của chúng, tuy nhiên, mức độ tùy chỉnh có thể bị giới hạn so với một số phần tử HTML khác. Thực tế, khả năng tùy chỉnh của các phần tử này phụ thuộc vào trình duyệt và các giả mạo (polyfill) CSS có thể sử dụng.
- Có thể css được các dạng: màu nền, màu chữ, kích thước, độ cao, màu option được chọn

### 11. Thẻ radio có css được giống như design không? Nếu được thì dựa vào cái gì để thay đổi màu khi người dùng nhấn vào?

- Có thể tùy chỉnh giao diện của thẻ radio bằng CSS, tuy nhiên, cấp độ tùy chỉnh có thể khá giới hạn và phụ thuộc vào khả năng hỗ trợ của trình duyệt
  - Ẩn giao diện mặc định và thêm giao diện tùy chỉnh

```css
input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

input[type="radio"]:checked {
  background-color: #3498db;
  color: #fff;
}
```

- Thay đổi màu khi người dùng nhấn vào: dùng checked

### 12. BEM có ưu nhược điểm gì ? Tại sao người ta lại sử dụng BEM ?

- BEM (Block, Element, Modifier) là một phương pháp đặt tên lớp CSS giúp tổ chức và quản lý mã nguồn CSS một cách rõ ràng và có tổ chức, thường được sử dụng cho những dự án có nhiều người tham gia để tránh xung đột khi đặt tên class. Dưới đây là một số ưu và nhược điểm của BEM:
- `Ưu điểm của BEM:`

  - `Tổ chức Cấu trúc Tốt` : BEM cung cấp một cấu trúc đặt tên rõ ràng và có tổ chức, giúp dễ dàng hiểu và duy trì mã nguồn CSS.
  - `Tính Tái Sử Dụng Cao`: Các khối (blocks), yếu tố (elements), và các sự điều chỉnh (modifiers) được định nghĩa rõ ràng, giúp tái sử dụng mã nguồn một cách dễ dàng.
  - `Giảm Xung Đột`: Do việc đặt tên lớp được quản lý và chia thành các phạm vi (scope) nhất định, BEM giảm xung đột giữa các phần tử và modules.
  - `Dễ Đọc và Hiểu`: BEM làm cho mã nguồn CSS dễ đọc và hiểu, đặc biệt là đối với nhóm phát triển lớn hoặc các dự án có mã nguồn lớn.

- `Nhược điểm của BEM:`
  - `Tên Class Dài`: Các tên lớp theo chuẩn BEM có thể trở nên khá dài và phức tạp, đặc biệt khi sử dụng nhiều mức (blocks, elements, modifiers) cùng một lúc.
  - `Khả Năng Dư Thừa`: BEM có thể dẫn đến việc có nhiều lớp không cần thiết trong HTML, làm tăng kích thước của tài liệu và gây ra khả năng dư thừa
  - `Thách Thức với Inline Styles hoặc Thư viện CSS-in-JS`: Nếu bạn sử dụng inline styles hoặc các thư viện CSS-in-JS, BEM có thể trở nên ít quan trọng hơn do các phương pháp này không dựa vào lớp CSS.
  - `Khó Dùng Cho Dự Án Nhỏ`: Trong các dự án nhỏ, việc sử dụng BEM có thể cảm thấy quá nặng nề và không cần thiết.
- Mặc dù BEM có nhược điểm, nhưng nó vẫn được ưa chuộng trong cộng đồng phát triển web do những ưu điểm về tổ chức và hiệu quả trong quản lý mã nguồn. Sự chọn lựa giữa việc sử dụng BEM hay không thường phụ thuộc vào quy mô và yêu cầu cụ thể của dự án.

- Các rule trong BEM :

  - Block:

    - Là thành phần cấp cao nhất, một phần tử độc lập có thể tồn tại mà không phụ thuộc vào các phần tử khác.
    - Đặt tên lớp của block bắt đầu bằng tên block.

  - Element:
    - Là các phần tử con của block, không thể tồn tại mà không có block cha.
    - Tên lớp của element được đặt bằng tên block, sau đó là hai dấu gạch dưới và tên element.
  - Modifier:
    - Là các biến thể hoặc trạng thái của block hoặc element.
    - Tên lớp của modifier được đặt bằng tên block hoặc element, sau đó là hai dấu gạch dưới, tên modifier.

```css
.block {
  /* styles for the block */
}
```

```css
.block__element {
  /* styles for the element */
}
```

```css
.block--modifier {
  /* styles for the block modifier */
}

.block__element--modifier {
  /* styles for the element modifier */
}
```

### 13. So sánh `after` và `before` ?

[Link tài liệu](https://evondev.com/before-va-after-trong-css/)

- `::before` và `::after` là hai `pseudo-elements` trong CSS được sử dụng để thêm nội dung vào trước và sau nội dung thực tế của một phần tử HTML mà không phải thêm thẻ HTML thêm vào. Dưới đây là so sánh giữa `::before` và `::after:`

- Thứ tự xuất hiện:
  - `::before`: thêm nội dung vào phần trước nội dung thực tế của phần tử. Dùng để chèn nội dung vào trước nội dung thực tế, thường theo chiều ngang.
  - `::after`: thêm nội dung vào phần sau nội dung thực tế của phần tử. Dùng để chèn nội dung vào sau nội dung thực tế, thường theo chiều ngang.

### 14. `Float` trong css

- Trong CSS, thuộc tính float được sử dụng để định vị một phần tử theo hướng của float (trôi lơ lửng). Điều này thường được sử dụng để định vị các phần tử theo chiều ngang của trang hoặc container.

```css
.selector {
  float: value;
}
```

- Trong đó, `value` có thể là một trong những giá trị sau:

  - `left`: Phần tử sẽ được đặt về phía trái và nội dung khác sẽ chảy quanh phải của nó.
  - `right`: Phần tử sẽ được đặt về phía phải và nội dung khác sẽ chảy quanh trái của nó.
  - `none` (giá trị mặc định): Phần tử sẽ không trôi lơ lửng và sẽ xuất hiện theo thứ tự bình thường trong văn bản.

### 15. Responsive

- `Responsive web design` là một phương pháp thiết kế web nhằm tối ưu hóa trải nghiệm người dùng trên nhiều thiết bị và kích thước màn hình khác nhau. Trong CSS, có nhiều kỹ thuật được sử dụng để làm cho trang web đáp ứng một cách linh hoạt

###### Media query

[Link tài liệu](https://viblo.asia/p/tim-hieu-ve-media-query-3ZabG9oRzY6E)

- Media queries là một cơ chế trong CSS giúp điều chỉnh giao diện của trang web dựa trên các đặc tính của thiết bị hiển thị, chẳng hạn như kích thước màn hình, loại thiết bị, độ phân giải, hoặc các tính chất khác. Chúng cho phép bạn áp dụng các quy tắc CSS chỉ trong trường hợp nào đó, tùy thuộc vào điều kiện bạn đặt ra.
- Cú pháp cơ bản của một media query như sau:

```css
@media only screen and (max-width: 600px) {
  /* Styles applied only when the screen width is 600 pixels or less */
  body {
    background-color: lightblue;
  }
}
```

- Trong ví dụ trên:

  - `@media`: Bắt đầu một media query.
  - `only screen`: Xác định rằng media query chỉ nên áp dụng cho các thiết bị màn hình.
  - `(max-width: 600px)`: Điều kiện cho media query, trong trường hợp này, là khi kích thước màn hình không lớn hơn 600 pixels.
  - Trong phần nằm trong ngoặc nhọn {}, bạn có thể đặt các quy tắc CSS mà bạn muốn áp dụng khi điều kiện media query được đáp ứng.

- Dưới đây là một số điều bạn có thể điều chỉnh bằng media queries:
- Kích thước và hình dạng màn hình:

```css
@media only screen and (orientation: landscape) {
  /* Styles for landscape orientation */
}
```

- Độ phân giải:

```css
@media only screen and (min-resolution: 300dpi) {
  /* Styles for high-resolution displays */
}
```

- Loại thiết bị:

```css
@media only screen and (device-type: handheld) {
  /* Styles for handheld devices */
}
```

### 16. Responsive `mobile first` khác gì `desktop first` ?

- Responsive web design có thể được thiết kế theo hai phương pháp chính: "Mobile-First" và "Desktop-First." Cả hai phương pháp đều có mục tiêu là tối ưu hóa trải nghiệm người dùng trên nhiều thiết bị và kích thước màn hình khác nhau, nhưng chúng khác nhau về tiếp cận ban đầu.

###### Mobile first:

- Đặc điểm:
  - Bắt đầu với việc thiết kế cho các thiết bị di động nhỏ trước (ví dụ: điện thoại di động).
  - Sử dụng các media queries để điều chỉnh và cải thiện trải nghiệm người dùng khi màn hình lớn hơn được detect.
  - Ưu tiên việc tối giản hóa và chú trọng vào nội dung quan trọng cho các thiết bị di động.
- Ưu điểm:
  - Giảm bớt đầu tư ban đầu vào mã nguồn và tài nguyên, tập trung vào yếu tố quan trọng nhất trước.
  - Tăng cường trải nghiệm người dùng trên thiết bị di động, nơi có nhiều người dùng truy cập.
- Cú pháp media query:

```css
/* Base styles for all screens */
body {
  font-size: 16px;
}

/* Styles for screens 600px and larger */
@media only screen and (min-width: 600px) {
  body {
    font-size: 18px;
  }
}
```

###### Desktop first:

- Đặc điểm:
  - Bắt đầu với việc thiết kế cho các màn hình lớn (ví dụ: máy tính).
    Sử dụng media queries để điều chỉnh và tối ưu hóa trải nghiệm cho các thiết bị di động khi chúng được detect.
  - Thường dành cho các dự án truyền thống đã được phát triển cho máy tính trước.
- Ưu điểm:
  - Dễ hiểu và triển khai đối với các dự án lớn đã có sẵn cho môi trường máy tính.
- Cú pháp media query:

```css
/* Base styles for desktop screens */
body {
  font-size: 18px;
}

/* Styles for screens smaller than 600px */
@media only screen and (max-width: 600px) {
  body {
    font-size: 16px;
  }
}
```

###### Lựa chọn giữa Mobile-First và Desktop-First ?

- Quyết định dựa trên người dùng:
  - Nếu hầu hết người dùng của bạn truy cập từ thiết bị di động, Mobile-First có thể là sự lựa chọn tốt.
  - Nếu trang web của bạn chủ yếu được truy cập từ máy tính, Desktop-First có thể là lựa chọn phù hợp.
- Quy mô dự án:
  - Dự án lớn có thể chọn Desktop-First để sử dụng lại nhiều mã nguồn đã có cho máy tính.
  - Dự án mới hoặc nhỏ có thể chọn Mobile-First để bắt đầu với một cơ sở dữ liệu nhỏ và tăng cường dần dần.

### 17. `vendor prefix` là gì, cách sử dụng ?

- `Vendor prefix` là một tiền tố (prefix) được thêm vào trước các thuộc tính CSS để hỗ trợ các trình duyệt web trong quá trình triển khai các tính năng CSS mới mà chưa được chuẩn hóa hoặc đưa vào sử dụng rộng rãi. Điều này giúp đảm bảo tính tương thích trên nhiều trình duyệt khác nhau trong giai đoạn thử nghiệm và phát triển của các tính năng mới.
- Một số vendor prefixes phổ biến bao gồm:
  - -webkit- (Google Chrome, Safari, Opera)
  - -moz- (Firefox)
  - -o- (Opera)
  - -ms- (Internet Explorer/Edge)
- Ví dụ, nếu bạn muốn sử dụng một tính năng CSS3 như border-radius, bạn có thể viết như sau với các vendor prefixes:

```css
.element {
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}
```

- Ở đây, -webkit- là vendor prefix cho trình duyệt WebKit-based (chẳng hạn như Chrome và Safari), -moz- là cho Firefox, và không có tiền tố nào cho các trình duyệt khác vì chúng hỗ trợ tính năng này mà không cần tiền tố.

- Tuy nhiên, hãy lưu ý rằng việc sử dụng vendor prefixes không phải lúc nào cũng là cách tốt nhất. Khi một tính năng đã được chuẩn hóa và được hỗ trợ rộng rãi, việc giữ lại các vendor prefixes có thể trở nên lạc quan. Thông thường, bạn có thể kiểm tra trang web như `Can I Use` để xem tính năng đó đã được hỗ trợ trong các trình duyệt nào và từ phiên bản nào.

### 19. SCSS

- SCSS (Sassy CSS) là một mở rộng của CSS với cú pháp mở rộng và các tính năng bổ sung. Dưới đây là một số tính năng quan trọng của SCSS:

1. `Variables`:

```scss
$primary-color: #3498db;
body {
  background-color: $primary-color;
}
```

2. `Nesting`:

```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: inline-block;
  }

  a {
    text-decoration: none;
  }
}
```

3. `Partials`: Được sử dụng để chia nhỏ mã nguồn SCSS thành các phần nhỏ để quản lý dễ dàng hơn.

```scss
// _variables.scss
$primary-color: #3498db;

// main.scss
@import "variables";

body {
  background-color: $primary-color;
}
```

4. Mixins: Cho phép tái sử dụng các đoạn mã CSS.

```scss
@mixin border-radius($radius) {
  border-radius: $radius;
  -webkit-border-radius: $radius;
  -moz-border-radius: $radius;
}

.box {
  @include border-radius(10px);
}
```

5. Functions: Cung cấp khả năng tạo các hàm tái sử dụng trong mã SCSS.

```scss
@function calculate-width($width, $padding) {
  @return $width + $padding * 2;
}

.container {
  width: calculate-width(200px, 20px);
}
```

6. Extends: Cho phép kế thừa các thuộc tính từ một lớp khác.

```scss
%message-shared {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.success {
  @extend %message-shared;
  border-color: green;
}

.error {
  @extend %message-shared;
  border-color: red;
}
```

7. Operators: Hỗ trợ các toán tử trong quá trình tính toán giá trị.

```scss
.container {
  width: 100% - 20px;
}
```

8. Control Directives: @if, @else if, @else, @for, @each, @while

- SCSS giúp tăng cường khả năng quản lý, tái sử dụng, và hiệu suất trong quá trình phát triển CSS. Nó được biên dịch thành CSS thông thường để triển khai trên trình duyệt web.

### 20. Breakpoint

- Mobile: 320px, 480px,
- Tablet: 786px, 1024px,
- Laptop: 1280, 1366, 1440, 1600, 1920px

# JAVASCRIPT

### 1. Các cách thêm sự kiện cho 1 element trong html

- Sử dụng Thuộc tính Sự kiện (Event Attributes): Thêm bằng cách trực tiếp trong HTML:

```html
<button onclick="myFunction()">Click me</button> // Ưu điểm : Dễ hiểu và thực
hiện nhanh chóng // Nhược điểm: Khả năng tái sử dụng kém: Nếu bạn muốn sử dụng
cùng một hàm xử lý sự kiện cho nhiều phần tử, bạn phải sao chép mã HTML hoặc tạo
ra nhiều hàm gọi cùng một tác vụ.
```

- Thêm bằng cách sử dụng thuộc tính trong JavaScript:

```html
<button id="myButton">Click me</button>
<script>
  document.getElementById("myButton").onclick = function () {
    myFunction();
  };
</script>
```

- Sử dụng AddEventListener trong JavaScript

```html
<button id="myButton">Click me</button>
<script>
  document.getElementById("myButton").addEventListener("click", function () {
    myFunction();
  });
  // Ưu Điểm:
  //   Tái sử dụng tốt hơn: Bạn có thể sử dụng cùng một hàm xử lý sự kiện cho nhiều phần tử mà không cần phải sao chép mã.
  // Dễ duy trì: Mã JavaScript và HTML được tách biệt, giúp dễ dàng theo dõi và duy trì khi dự án phát triển.
  // Linhhọat hơn: Bạn có thể thêm và xóa sự kiện một cách linh hoạt, và nó giúp tránh ghi đè sự kiện.

  //   Nhược Điểm:
  // Cú pháp phức tạp hơn: Việc sử dụng addEventListener đòi hỏi viết thêm mã JavaScript, điều này có thể làm tăng độ phức tạp của mã nếu bạn chỉ muốn thêm một vài sự kiện.

  // Yêu cầu kiến thức JavaScript: Bạn cần có một hiểu biết cơ bản về JavaScript để sử dụng cách này.

  // Tăng kích thước file và tải nhanh hơn: Mặc dù độ chậm có thể không đáng kể, nhưng việc tải một tệp JavaScript bên ngoài có thể làm tăng thời gian tải trang so với việc sử dụng thuộc tính sự kiện trực tiếp.
</script>
```

### 2. Phân biệt null và undefined

- Giống nhau: `null` và `undefined` đều có nghĩa là `không có gì cả`, nếu so sánh bởi toán tử `==` thì kết quả là `true`
- Khác nhau:
  `Null`:
- `null` là một giá trị gán ,là giá trị được gán cho 1 biến
- type of null là `object`

`undefined`

- Một biến khi được khai báo nhưng không được gán giá trị thì nó được coi là có giá trị undefined
- typeof undefined là `undefined`

#### console.log(obj.prop) với obj = null thì nó báo lỗi gì?

```javascript
var obj = null;
console.log(obj.prop); // TypeError: Cannot read property 'prop' of null
```

# REACT

###### 1. Phân biệt state và props trong react

##### State

- State là một object chứa dữ liệu hoặc thông tin về `component`
- state có thể thay đổi thông qua hàm cập nhật của hook (setState)
- Thay đổi state sẽ gây ra việc re-render component

##### Props

- Props là một object chứa những thông tin giá trị được truyền vào 1 component con
- props là không thay đổi (immutable) từ phía component con.
- Thay đổi props sẽ gây ra việc re-render component

###### 2. Life Circle trong react

![Redux Data Flow](./life-circle.webp)

###### Lifecycle là 1 vòng đời đời của 1 component, gồm 3 giai đoạn:

- Mounting
- Updating
- Unmounting

**1. Mounting**

- Khi mà Component được Mounting thì React sẽ follow theo trình tự như sau :
  - Khởi tạo class đã kế thừa từ Component
  - Khởi tạo giá trị mặc định cho Props và State
  - Gọi hàm `componentWillMount()`
  - Gọi hàm `render()`
  - Gọi hàm `componentDidMount()`: ở đây cũng là nơi thực hiện các hàm AJAX, axios request, DOM hay update state sẽ được thực thi tại đây

**2. Updating**

- Một component được update khi có sự thay đổi về state hay props
- Lần lượt chạy các hàm sau:
  - `componentWillReceiveProps()`: Chạy khi component con nhận props từ component cha. Sau khi nhận được props mới từ component cha rồi có thì component con có thể set lại state.
  - `shouldComponentUpdate()`: Hàm này có thể nói là nó tăng hiệu năng của React lên. Nếu như return false thì các phương thực `componentWillUpdate, render, componentDidUpdate` sẽ không được chạy nữa(vì mặc định nó return về true để chạy được 3 hàm tiếp theo, nhiều trường hợp mình không cần chạy 3 hàm tiếp theo).
  - `componentDidUpdate()`: hàm này được gọi đến sau khi đã re-render lại hay React đã cập nhật lại UI, nếu mà chúng ta muốn chạy animation thì đây chính là lúc chúng ta nên gọi trong hàm này.

**3. Unmount**

- componentWillUnmount() method được gọi khi một component được remove khỏi DOM

### 3. Giải thích rõ về shouldComponentUpdate()

- `shouldComponentUpdate` là một phương thức của class component trong React. Nó được gọi mỗi khi một component sẽ được rerender, trước khi render() được gọi. Phương thức này cho phép bạn kiểm soát liệu component có nên được rerender hay không, dựa trên sự so sánh giữa `nextProps`, `nextState`, và `nextContext` với `this.props`, `this.state`, và `this.context`.

- Có ba tham số đầu vào: nextProps, nextState, và nextContext.
  Bạn có thể so sánh chúng với this.props, this.state, và this.context để quyết định liệu component có cần rerender hay không.
- Trả về Giá Trị Boolean: true -> render , false -> không render
- Tối Ưu Hóa Hiệu Suất: hường được sử dụng để tối ưu hiệu suất, tránh việc rerender không cần thiết.

### 4. Mutable và Immutable

- Trong lập trình, khái niệm "mutable" đề cập đến tính khả năng thay đổi của một đối tượng sau khi nó đã được tạo ra. Nếu một đối tượng là mutable, điều này có nghĩa là nó có thể bị thay đổi, cập nhật, hoặc biến đổi giá trị của các trạng thái nội tại của nó sau khi nó đã được khởi tạo.

- Ngược lại, nếu một đối tượng là "immutable", nó không thể thay đổi sau khi đã được tạo ra. Bất kỳ thay đổi nào đối với đối tượng immutable sẽ tạo ra một đối tượng mới, giữ nguyên giá trị của đối tượng cũ.
- Ví dụ:
  Mutable

```javascript
let mutableArray = [1, 2, 3];
mutableArray.push(4);
console.log(mutableArray); // [1, 2, 3, 4]
```

Immutable

```javascript
let immutableArray = [1, 2, 3];
let newArray = [...immutableArray, 4];
console.log(immutableArray); // [1, 2, 3]
console.log(newArray); // [1, 2, 3, 4]
```

### 5. Virtual Dom là gì ? tại sao sử dụng ?

- Virtual DOM (Document Object Model) là một khái niệm quan trọng trong React, được sử dụng để cải thiện hiệu suất và tối ưu hóa quá trình render của ứng dụng web.
- Virtual DOM là một bản sao nhẹ của DOM, được React tạo và quản lý. Khi có sự thay đổi trong dữ liệu của ứng dụng, React sẽ tạo ra một cây Virtual DOM mới.
- React so sánh cây Virtual DOM mới với cây Virtual DOM cũ (trước khi có sự thay đổi).
- Nếu có sự khác biệt, React xác định các thay đổi cần được thực hiện để đưa cây Virtual DOM mới về trạng thái tương ứng với dữ liệu mới.
- Thay vì cập nhật trực tiếp DOM mỗi khi có thay đổi, React chỉ cập nhật các phần của DOM cần thiết, giúp giảm thiểu việc thao tác trực tiếp với DOM.
  **Tại sao sử dụng ?**
- Hiệu Suất: Virtual DOM giúp giảm bớt việc cập nhật trực tiếp DOM và chỉ làm những thay đổi cần thiết.
- Tối Ưu Hóa Rerender: React có thể rerender toàn bộ cây Virtual DOM mỗi khi có sự thay đổi, nhưng chỉ cập nhật các phần thực sự thay đổi trong DOM
- Virtual DOM giúp đồng bộ hóa quá trình cập nhật giữa JavaScript và DOM, giảm nguy cơ xung đột và lỗi.
- Tiện Ích Xử Lý Sự Kiện: React có thể thực hiện một loạt các tối ưu hóa như thay đổi trạng thái async, tự động gom nhóm các thay đổi, và tái sử dụng các phần tử DOM có thể
- Dễ Dàng Thao Tác với JSX: JSX, ngôn ngữ mô tả giao diện trong React, làm cho việc tạo và quản lý Virtual DOM trở nên dễ đọc và dễ bảo trì hơn.

### 6. Component cha có 1 cái state và có 1 component con không có state hay prop vậy khi component cha render lại thì component con có render lại không?

- Nếu một component con không có state hoặc prop (được truyền từ component cha), và component cha render lại, thì component con sẽ cũng render lại. Tuy nhiên, quyết định render lại component con hay không còn phụ thuộc vào cách bạn triển khai logic shouldComponentUpdate hoặc sử dụng React.memo (nếu bạn đang sử dụng functional component) trong component con.

### 7. PureComponent

- `PureComponent` là một lớp (class) trong React được thiết kế để cung cấp một cách tự động kiểm tra sự thay đổi và quyết định xem một component có cần phải render lại hay không. Nó là một phần của bộ công cụ tối ưu hóa hiệu suất trong React.
- Kiểm tra Sự Thay Đổi: Trước khi thực hiện render, `PureComponent` sẽ so sánh giá trị của props và state hiện tại với giá trị props và state trước đó, thông qua shallow comparison.
- `Shallow Comparison`: Shallow comparison chỉ kiểm tra sự thay đổi ở mức độ đầu tiên của các đối tượng. Điều này có nghĩa là nó chỉ kiểm tra xem các tham chiếu trực tiếp có bằng nhau không, không so sánh nội dung bên trong các đối tượng.

### 8. Eslint và Prettier

- ESLint là một công cụ kiểm tra mã nguồn JavaScript để phát hiện và báo cáo các lỗi cú pháp, cũng như để áp dụng quy tắc lập trình (coding conventions) và chuẩn mã nguồn (code style) theo các nguyên tắc được định nghĩa trước
- Prettier là một công cụ tự động định dạng mã nguồn (code formatting tool) dành cho nhiều ngôn ngữ lập trình, bao gồm JavaScript, TypeScript, HTML, CSS, và nhiều ngôn ngữ khác. Mục tiêu chính của Prettier là duy trì một định dạng code chính xác và nhất quán mà không cần phải quan tâm đến các quy tắc lập trình hoặc chuẩn mã nguồn cụ thể.

### 9. Trong header mỗi request call API của Axios gồm có những gì

- Trong mỗi yêu cầu (request) khi sử dụng Axios để gọi API, bạn có thể cấu hình và điều chỉnh các thông số khác nhau thông qua các tùy chọn (options). Dưới đây là một số tùy chọn phổ biến mà bạn có thể thấy trong header của mỗi yêu cầu Axios:

1. `URL (Địa chỉ URL)`: Axios sẽ chuyển điều này trong phần URL của yêu cầu.
2. `Method (Phương thức)`: GET, POST, PUT, DELETE, và các phương thức khác, tùy thuộc vào loại yêu cầu bạn đang thực hiện.
3. `Headers`: Axios cung cấp các tiêu đề mặc định như `Content-Type` và `Accept`, `authorization`, nhưng bạn có thể thêm hoặc thay đổi các tiêu đề khác thông qua tùy chọn headers.
4. `Data (Dữ liệu)`: Đối với yêu cầu POST hoặc PUT, dữ liệu sẽ được gửi đi dưới dạng payload của yêu cầu. Bạn có thể thiết lập giá trị của nó thông qua tùy chọn data.
5. `Params (Tham số)`: Đối với yêu cầu GET, tham số sẽ được thêm vào URL. Bạn có thể thiết lập giá trị của chúng thông qua tùy chọn params.
6. `Auth (Xác thực)`:
7. `Timeout (Thời gian chờ)`: Tùy chọn timeout cho phép bạn xác định thời gian tối đa mà yêu cầu có thể chờ đợi trước khi bị hủy bỏ.
8. `ResponseType (Kiểu phản hồi)`: Bạn có thể sử dụng tùy chọn responseType để xác định kiểu dữ liệu bạn muốn nhận được trong phản hồi, chẳng hạn như json, text, hoặc blob.

### 10. Sự khác nhau giữa fetch và axios (Tại sao lại dùng Axios, axios có gì hơn fetch)

- Cả `fetch` và `axios` đều là công cụ để thực hiện các yêu cầu HTTP trong JavaScript, nhưng chúng có những sự khác nhau quan trọng. Dưới đây là một số điểm khác biệt và lý do tại sao người ta thường ưa chuộng sử dụng axios thay vì fetch:
  **1. API và Sử Dụng**

- `fetch` là một hàm tích hợp trong JavaScript, tồn tại trong trình duyệt và Node.js.
- `axios` là một thư viện HTTP bên ngoài, không tích hợp sẵn trong JavaScript và cần được cài đặt.
  **2. Trình Tường Minh Về JSON:**

- `axios` tự động chuyển đổi dữ liệu giữa đối tượng JavaScript và JSON khi gửi và nhận dữ liệu.
- `fetch` không thể tự động chuyển đổi dữ liệu giữa đối tượng JavaScript và JSON, bạn cần thực hiện điều này thủ công sử dụng các phương thức như `JSON.stringify` và `json()`.

**3. Hỗ Trợ Các Tính Năng Hơn:**

- `axios` hỗ trợ các tính năng như hủy yêu cầu, quản lý interceptor, và xử lý dễ dàng hơn với phản hồi và lỗi.
- `fetch` có một số thiếu sót trong việc xử lý lỗi và không hỗ trợ các tính năng như hủy yêu cầu một cách thuận tiện

### 11. Luồng hoạt động của redux

[Link tham khảo](https://cloud.z.com/vn/news/redux/)

- Một ứng dụng quản lý state bằng redux sẽ có 3 thành phần chính: View, Action và Store.
  - View: Là giao diện mà người dùng nhìn thấy và có thể tường tác
  - Action: Action là những plain object javascript có 1 thuộc tính 'type' để mô tả loại hành động và có thể chứa dữ liệu khác (chẳng hạn `payload`)
  - Store: Nơi chứa những global state và hàm `reducer()`. `Reducer()` là một hàm pure function nhận vào một state hiện tại và một action, sau đó trả về một state mới. Ngoài ra ở `store` còn có `Dispatcher`: quản lý middlewares và chuyển dữ liệu xuống reducer
- Flow
  - Ỏ `View`, khi người dùng thực hiện 1 tương tác như click hay onChange thì sẽ dispatch 1 action
  - Action mà người dùng dispatch sẽ được gửi đến `Store`, tại đây thì hàm reducer sẽ dựa vào action để xử lý logic và cập nhật lại state
  - Sau khi state được cập nhật, giao diện sẽ re-render để người dùng thấy

### 12. Sự khác nhau giữa redux và redux toolkit ?

- Đầu tiên, 3 vấn đề là nền tảng ra đời của Redux-toolkit
  - Cấu hình store của redux quá phức tạp
  - Cần phải cài đặt thêm nhiều package để làm gì đó hữu ích
  - Redux yêu cầu quá nhiều mã soạn sẵn (boilerplate
    code)

**1. Cú Pháp Ngắn Gọn**

- Trong Redux truyền thống, bạn phải tạo rất nhiều boilerplate code để định nghĩa các action types, action creators, reducers, và store.
- Redux Toolkit cung cấp một số hàm utility như createSlice và configureStore, giúp giảm đáng kể lượng mã boilerplate. Đồng thời Có sẵn Redux DevTools, redux-thunk để thực hiện async actions
  **2. Immer Integration:**
- Trong Redux truyền thống, để thay đổi trạng thái, bạn phải trả về một bản sao mới của trạng thái hoặc sử dụng thư viện như Object.assign. (không thể mutateble state)
- Redux Toolkit tích hợp Immer, giúp bạn có thể thay đổi trạng thái trực tiếp trong reducers mà không cần tạo bản sao.

### 13. Redux Thunk là gì?

- `Redux Thunk` là một `middleware` cho Redux, được sử dụng để xử lý các tác vụ bất đồng bộ trong Redux. Nó cho phép chúng ta viết các hành động (actions) Redux mà có thể là các hàm thay vì chỉ là các đối tượng.
- Mặc định, Redux chỉ cho phép gửi các hành động là các đối tượng plain JavaScript có thuộc tính "type". Nhưng khi sử dụng `Redux Thunk`, bạn có thể trả về một hàm từ hành động thay vì một đối tượng. Hàm này có thể thực hiện các tác vụ bất đồng bộ, chẳng hạn như gọi API, lấy dữ liệu từ máy chủ, hoặc thực hiện các tác vụ không đồng bộ khác.
- Khi hàm được trả về từ một hành động `Redux Thunk`, `middleware` `Redux Thunk` sẽ xử lý nó và chạy hàm đó. Trong quá trình thực thi, hàm có thể gọi các hành động khác để cập nhật trạng thái `Redux`.

### 14. Redux Saga là gì?

[Link tham khảo](https://levunguyen.com/laptrinhjavascript/2021/12/15/su-dung-redux-saga-trong-reactjs/)
`Redux Saga` là một middleware cho Redux, được sử dụng để xử lý các side effect trong ứng dụng Redux. Side effect là mọi thứ không thuộc về việc thay đổi trạng thái (state) một cách đồng bộ trong reducer, chẳng hạn như gọi API, xử lý thời gian, hoặc thực hiện các tác vụ không đồng bộ khác.

`Redux Saga` sử dụng "Generator Functions" (hàm sinh) của JavaScript để quản lý luồng xử lý của các side effect một cách dễ đọc và kiểm soát. Nó cho phép bạn mô tả logic xử lý các side effect một cách tuần tự và rõ ràng.

##### Khái Niệm Quan Trọng:

1. **Saga:**

   - Một saga là một hàm Generator (hàm sinh) JavaScript. Saga định rõ logic xử lý các side effect và có thể được gọi và theo dõi bằng middleware Redux Saga.

2. **Effect:**

   - Trong Redux Saga, các hàm Generator tạo ra các "effect" để thực hiện các công việc không đồng bộ. Ví dụ về effect có thể là gọi API (`call`), đợi một hành động cụ thể (`take`), hoặc thực hiện một hành động (`put`) để dispatch một action mới.

3. **Watcher Saga:**

   - Một watcher saga là một saga chịu trách nhiệm theo dõi các hành động (actions) và bắt đầu các worker saga tương ứng khi nhận được một hành động.

4. **Worker Saga:**
   - Một worker saga là một saga chịu trách nhiệm thực hiện các tác vụ không đồng bộ. Worker saga thường được gọi bởi watcher saga khi có điều kiện phù hợp.

Redux Saga giúp tách rời logic xử lý side effect khỏi các reducers, giúp mã nguồn trở nên dễ đọc hơn và dễ quản lý hơn. Nó cũng cung cấp một cách linh hoạt để xử lý các tác vụ phức tạp như xử lý đồng bộ, theo dõi nhiều hành động, và quản lý luồng thời gian.

### 14. Thử viện quản lý state khác: Zustand

- Là một thư viện quản lý trạng thái (state management) dành cho ứng dụng React. Nó tập trung vào việc đơn giản hóa quá trình quản lý trạng thái và cung cấp một cách linh hoạt để quản lý trạng thái của ứng dụng React một cách hiệu quả.
- `Zustand` sử dụng hook-based API, có nghĩa là bạn có thể sử dụng hooks như `useStore` để truy cập trạng thái từ components React.
- `Zustand` có kích thước nhẹ và không có phụ thuộc nặng nề, điều này giúp giảm tải và tăng hiệu suất của ứng dụng.
- `Zustand` không phụ thuộc vào Redux hoặc Context API của React, điều này giúp giảm bớt sự phức tạp và giữ cho thư viện trở nên độc lập.
- Example

```jsx
// userStore.js
import create from "zustand";

const useUserStore = create((set) => ({
  user: {
    id: null,
    username: "",
    email: "",
  },
  setUser: (newUser) =>
    set((state) => ({ user: { ...state.user, ...newUser } })),
  clearUser: () => set({ user: { id: null, username: "", email: "" } }),
}));

export default useUserStore;
```

```jsx
// ProfileComponent.js
import React, { useState } from "react";
import useUserStore from "./userStore";

const ProfileComponent = () => {
  const { user, setUser, clearUser } = useUserStore();
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const handleUpdateProfile = () => {
    setUser({ username: newUsername, email: newEmail });
  };

  const handleClearProfile = () => {
    clearUser();
  };

  return (
    <div>
      <p>ID: {user.id}</p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>

      <input
        type="text"
        placeholder="New Username"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="New Email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
      />
      <button onClick={handleUpdateProfile}>Update Profile</button>
      <button onClick={handleClearProfile}>Clear Profile</button>
    </div>
  );
};

export default ProfileComponent;
```
