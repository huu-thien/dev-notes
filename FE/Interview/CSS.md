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
