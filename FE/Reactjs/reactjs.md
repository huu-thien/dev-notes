1. SPA: Single Page Application: ứng dụng 1 trang !== MPA Multi_page

- ReactJS là 1 trong những thư viện tạo ra SPA
- SPA là cách tiếp cận hiện đại hơn
- Không yêu cầu tải lại trang trong quá trình sử dụng
- MPA là cách tiếp cận cổ điển hơn
- Tải lại trang trong quá trình sử dụng

## So sánh

SPA: CSR -> Client Side Redering
MPA : SSR -> Server Side Redering

- SPA:

* Nhanh hơn khi sử dụng: phần lớn tài nguyên được tải trong lần đầu
* Trang chỉ tải thêm dữ liệu mới khi cần

- MPA:

* Chậm hơn khi sử dụng: luôn tải lại toàn bộ trnag khi truy cập và chuyển hướng

## Bóc tách:

- SPA có phần Front-end riêng biệt
- MPA Front-end & Back-end phụ thuộc nhau nhiều hơn, được đặt trong cùng 1 dự án

## SEO:

- SPA không thân thiện với SEO như MPA
- Trải nghiệm trên thiết bị di động tốt hơn

## UX:

- SPA cho trải nghiệm tốt hơn, nhất là các thao tác chuyển trang
- Trải nghiệm trên thiết bị di động tốt hơn

## Quá trình phát triển:

- SPA dễ dàng tái sử dụng code (component)
- SPA bóc tách FE & BE -> chia team phát triển song song, phát triển mobile app

## Phụ thuộc javascript:

- SPA phụ thuộc hoàn toàn vào js
- MPA có thể không cần js

# 2. React.createElement() -> tạo ra 1 React element

- React.createElement(type, props, children, n) nhận vào 3 đối số: + 'h1': thẻ muốn thêm vào + props : {}= 1 object thể hiện các attribute của thẻ đó + children: con của thẻ đó
  const h1react = React.createElement('h1', {
  title: 'Hello React',
  className: 'heading'
  }, 'Hello React')
  -> Lưu ý: children cũng là 1 props

# 3. React DOM

- Sử eldụng React DOM để render Reactement ra trình duyệt
- Là cầu nối giữa React và DOM
- Render UI
- React Native -> ios, android
  = ReactDOM gọi hàm render(reactElement, container) truyền vào 2 đối số
- Lưu ý đối với React phiên bản 18:
  const container= document.getElementById('root');
  const ulReact = React.createElement(
  'ul',
  {},
  React.createElement('li', {}, 'Javascript'),
  React.createElement('li', {}, 'ReactJS')
  )
  const root = ReactDOM.createRoot(container);
  root.render(ulReact);

# 4. JSX -> Javascript XML

- JSX không phải là HTML
- Cần có Javascript, Babel để dùng JSX
- Babel là 1 thư viện dùng để chuyển đổi JSX thành Javascript-> hỗ trợ hầu hết trình duyệt chạy JS
- Có thể gán jsx cho 1 biến
- Khi làm JSX mà muốn viết xen lẫn code javascript vào thì dùng dấu {}
- Khi viết css vào JSX thì viết dưới dạng object {{}}
- Có render được 2 element cùng 1 lúc hay không: được, với điều kiện là phải có 1 thẻ ôm 2 element đó lại
  -> Phương án tối ưu: Sử dụng React.Fragment để ôm 2 element đó lại

# . React Element types (đối số đầu tiên của React.creaeElement)

- Vì tư tưởng bóc tách, chia thành nhiều component nên
- có nhiều kiểu: string, function/class
  -> Nếu dùng function thì gọi là function component, dùng class thì gọi là class component
- Viết 1 function trả về 1 element rồi trong app gọi function đó dưới dạng tag
  -> Dùng function component khi hook ra đời (100%) - Wrapper: + Header -> Header component + Content -> Content component + Footer -> Footer component

# 6. Props là gì? Sử dụng Props khi nào ?

- Props là 1 object chứa các thuộc tính để mô tả cho React Element mà chúng ta tạo ra
- React element:
  - Sử dụng props giống như với attribute của thẻ HTML
  - 2 props class, for => className , htmlFor
  - Phải tuân theo quy ước có sẵn
- React components:
  - Sử dụng props giống như đối số cho Component
  - Tự do đặt tên props: đặt theo camelCase hoặc bao gồm dấu gạch ngang
- Chú ý:
  - props 'key' là props đặc biệt
  - props cơ bản là đối số của component
  - props có thể là bất cứ kiểu dữ liệu gì
  - Sử dụng destructuring để nhận props
  - Nếu cần lấy quá nhiều đối số từ props thì đặt 1 data = props

# 7. DOM event? Làm việc với JSX #1

## Phần 1

- Trong React thì khi viết sự kiện thì viết theo CamelCase-> onClick
- Xử lý DOM event
- Component do chúng ta định nghĩa phải viết in hoa kí tự đầu
- Chọn component trong 1 object
- Khi component nhận nhiều props thì prop nào là function thì để xuống cuối
- Boolean, Null & Undefined không được render
- Kết hợp toán tử logic để render theo điều kiện

## Phần 2 :Children props & render props? Làm việc với JSX #3

- Props trong JSX
  <YourComponent
        propName1="String literals"
        propName2={expression}
    />
  - Props default to 'true'
  - Spread/ rest props
  - Children prop
    - <YourComponent>String literals</YourComponent>
    - <YourComponent>{expression}</YourComponent>
  - render props: là truyền 1 function qua props

## 8. NodeJS là gì? Tại sao phải sử dụng NodeJS trong khóa ReactJS

- NodeJS là 1 Javascript runtime,tạo ra môi trường độc lập để chạy code JS
- webpack giups module hóa ứng dụng front-end
- Cấu trúc dự án:
  \*react-webpack -> thư mục gốc
  src -> thư mục chứa source code chính
  components -> thư mục chứa component
  index.js -> file khởi tạo, render App vào #root
  public
  index.htmk -> html page, nơi chứa #root element

<!-- Nâng cấp React và ReactDOM từ 17 lên 18 -->

- npm i react@latest react-dom@latest
- npm i react@17.0.2 react-dom@17.0.2 -> từ 18 xuống 17
  -> cú pháp này dùng được cho các thư viện khác

# 9. NPM, NPX và YARN là gì ?

## NPM

- Khi cài thư viện với npm thì có 2 cách cài

  - Project scope: phạm vi dự án

    - npm install react react-dom => lưu vào dependencies
    - short: npm i react react-dom
    - npm install --save-dev react react-dom => lưu vào devDependencies
    - short: npm i -D react react-dom
    - Xóa thư viện khỏi dự án: npm uninstall react react-dom

  - Global scope: phạm vi toàn cục,
    - npm install --g create-react-app
    - Gỡ: npm uninstall --g create-react-app

## NPX

- Khi cài node thì NPX được cài kèm NPM
- Tại sao dùng NPX ? : vì giúp không cần cài các thư viện lên máy,
- Gặp lỗi khi: npx create-react-app tiktok

## YARN và NPM

- Về hiệu năng, khi cài thư viện thì npm sẽ cài tuần tự, còn yarn cài song song được do đó tốn nhiều dung lượng lưu trữ hơn
- NPM là công cụ quản lý gói mặc định đi kèm với Node.js.
- Yarn là một công cụ quản lý gói phát triển bởi Facebook, được tạo ra nhằm cải thiện hiệu suất và độ tin cậy so với NPM
- Một số lợi ích và tính năng khác của Yarn bao gồm tải các gói từ bộ nhớ đệm, khả năng cài đặt các gói một cách song song, hiển thị phiên bản gói rõ ràng hơn và khả năng khóa các phiên bản cụ thể của gói.
- Cả NPM và Yarn đều hữu ích và phổ biến trong cộng đồng phát triển JavaScript. Sự lựa chọn giữa hai công cụ này thường phụ thuộc vào sự thoải mái và yêu cầu của dự án của bạn.
- https://www.codingninjas.com/codestudio/library/difference-between-npm-and-yarn#:~:text=While%20NPM%20fetches%20packages%20from,it%20comes%20to%20fetching%20packages.

## Yarn install

## Lưu ý: luôn bật development server (npm start || yarn start)

# 10. CRA Folder Structure

- Thư mục public có thể được hiển thị qua web, mặc định là index.html
- Thư mục src chứa source code chính của dự án
- File reportWebVital.js : thống kê hiệu năng, thời gian chạy của web
- File setupTest.js: chạy test, viết test
- File gitgnore: để chỉ định những file bị ẩn khi up git hoặc production

# 11. Hooks là gì ? React Hooks

- Mang ý nghĩ gắn vào, móc vào
- Là những hàm được viết sẵn và được cung cấp bới thư viện reactjs, mỗi hàm sẽ có 1 tính năng và 1 trường hợp cụ thể để sử dụng
- Khi làm việc với function component mà cần thêm những tính năng mà Hooks cung cấp thì sẽ lấy ra những cái hooks tương ứng để dùng trong component
- Vấn đề: mỗi hooks có 1 chức năng, khi nào cần sử dụng hooks nào ?

- Hooks chỉ dùng cho function component
- Giúp component trở nên đơn giản và dễ hiểu: không bị chia logic ra như methods trong lifecycle của class component và không cần sử dụng 'this'

## Sử dụng Hooks khi nào ?

- Dự án mới -> dùng hooks
- Dự án cũ:
  - Component mới => Fuonction component + Hooks
  - Component cũ => Giữ nguyên, có thời gian thì tối ưu sau
  - Logic nghiệp vụ cần sử dụng các tính chất của OOP => dùng Class component
- Có thể kết hợp sử dụng Class component và Function Component

## useState trong React Hook (trạng thái của dữ liệu)

- Giúp đơn giản hóa việc thể hiện trạng thái của dữ liệu ra giao diện người dùng, dữ liệu thay đổi gì -> giao diện thay đổi
- Khi nào dùng useState hook: + Khi muốn dữ liệu thay đổi thì giao diện tự động cập nhật (render lại theo dữ liệu)
  -Cách dùng:
  import { useState } from 'react'
  function Component() {
  const [state, setState] = useState(initState)
  ...
  }
- Đối số: nhận đối số đầu vào là giá trị khởi tạo(chỉ dùng trong lần đầu),

- Trả về 1 mảng gồm 2 phần tử: state ban đầu được gán là initState, đối số thứ 2 setState là 1 hàm được gọi để set lại giá trị của state( setState return ra state)
- Có thể đổi lại tên biến, ví dụ: const [counter, setCounter] = useState(1)
- Quy tắc là khi đặc state là gì thì setState phải có set và viết theo camelCase

### Lưu ý:

- Component sẽ được re-render sau khi `setState`
- Initial state chỉ dùng cho lần đầu
- Set statte với callback ?
- Initial state với callback ? -> nếu dùng 1 hàm làm initialState thì initialState sẽ nhận giá trị của hàm đó trả về
- Set state là thay thế state bằng gia trị mới

# 12. Two-way binding trong react (ràng buộc 2 chiều)

- Khi dữ liệu trên giao diện thay đổi thì trong code cũng thay đổi và ngược lại

# 13. Todolist with useState()

- Toán tử ?? null list: nếu vế trước null hoặc undefined thì lấy vế đằng sau
- vd: a ?? b -> nếu a là null hoặc undefined thì lấy b

# 14. Mounted & Unmount (Lắp vào & gỡ ra)

- Mounted: thời điểm đưa component được gắn vào vào để sử dụng
- Unmount: thời điểm gỡ component ra

# 15. useEffect hook

- Side effects: gọi API lấy dữ liệu, tương tác với DOM, Subscriptions, setTimeOut, setInterval
- Dùng useEffect khi muốn sử dụng các side Effect (1 chương trình phần mềm khi có 1 tác động xảy ra thì dữ liệu thay đổi)
- Hàm useEffect() nhận 2 đối số:
  - 1 callback -> bắt buộc, là hàm do mình tự viết
  - 1 mảng chứa sự phụ thuộc về mặt dữ liệu, gọi là deps -> không bắt buộc
- Các trường hợp truyền đối số:
  - useEffect(callback) : ít dùng
    +=> Gọi callback mỗi khi component re-render, gọi callback sau khi component thêm element vào DOM
  - useEffect(callback, [])
    +=> Chỉ gọi callback 1 lần sau khi component mounted -> áp dụng cho những logic muốn chạy 1 lần khi component mounted, chẳng hạn gọi API
  - useEffect(callback, [deps]) -> deps có thể là props, là biến, là 1 giá trị
    +=> callback sẽ được gọi lại mỗi khi deps thay đổi
Lưu ý: callback trong useEffect chỉ được gọi sau khi element đã được thê
## m vào DOM

- callback luôn được gọi sau khi component mounted
- clean up function luôn được gọi trước khi component unmount
- cleanup function (hàm dọn dẹp) là hàm mà useEffect return ra, sinh ra để có thể dọn dẹp những thứ trong bộ nhớ khi unmounted component

  - cleanup function luôn được gọi trước khi callback được gọi (trừ lần mounted)
  - Effect không cần clean up: gọi API, tương tác DOM
  - Effect cầm clean up: Subscriptions, setTimeOut, setInterval

- event: add/ remove event listener
- Observer pattern: Subscribe / Unsubscribe
- Closure
- Times: setInterval, setTimeout, clearTimeOut, clearInterval
- useState
- Mounted/ Unmounted
- ===
- call API- > dùng useEffect

## useEffect with DOM event

- Cách listen DOM event trong React component : component chỉ re-render khi state thay đổi
- Vấn đề xảy ra khi listen DOM event trong React component : Khi component bị unmounted thì có lúc DOM event vẫn tồn tại -> gây ra rò rỉ bộ nhớ
- Cách khắc phục: khi xử lý DOM event trong use effect thì truyển đối số thứ 2 là mảng rỗng và nhớ return hàm clean up function để tránh rò rỉ bộ nhớ

## useEffect with timer functions

- Cách sử dụng setInterval và setTimeout trong React component
- Vấn đề xảy ra:
- Cách khắc phục

## useEffect with preview avatar

## useEffect with fake Chat App

## useLayoutEffect hook

- Hoạt động tương tự như useEffect. Điểm khác nhau giữa 2 hook này là thứ tự thực hiện các công việc
- Phân biệt :
- useEffect -> thường dùng
  1. Cập nhật lại state
  2. Cập nhật lại DOM (mutated)
  3. Render lại UI
  4. Gọi cleanup nếu deps thay đổi
  5. gọi useEffect callback
- useLayoutEffect
  1. Cập nhật lại state
  2. Cập nhật DOM (mutated)
  3. Gọi cleanup nếu deps thay đổi (sync: đồng bộ)
  4. Gọi useLayoutEffect callback (sync)
  5. Render lại UI

## useRef hook (tham chiếu)

- Ra đời để lưu được 1 giá trị bất kì qua một tham chiếu bên ngoài function component
- useRef là 1 hàm nhận đối số là 1 initial value , có thể là bất cứ giá trị gì, chỉ dùng ở lần đầu tiên component mounted
- luôn return về 1 object có 1 property là curent => {curent : initialValue} => muốn lấy giá trị thì phải chọc vào ref.current

## React.memo HOC (ghi nhớ)

- memo() -> Higher Order Component (HOC)
- useCallback()
- React.memo được gọi là Higher order component (HOC). Dùng để ghi nhớ các props của một component, quyết định xem có render lại component đó hay không để tối ưu về hiệu năng.
- Ngắn gọn React.memo dùng để xử lý component tránh re-render trong tình huống không cần thiết.
- Nguyên lý hoạt động: memo() nhận vào 1 component và check các props của component này sau mỗi lần render có bị thay đổi hay không, nếu có 1 props bị thay đổi thì sẽ render lại component, nếu không thì không render

## useCallback hook

- useCallback sinh ra để tránh tạo ra những hàm mới 1 cách không cần thiết trong function component
- useCallback nhận 2 đối số:
  - hàm của chúng ta viết
  - mảng chứa những deps, hoạt động tương tự như useEffect
  * nếu deps trống thì sẽ trả ra tham chiếu trước đó thay vì deps mới
- Chốt lại: 1 component có thể nhận rất nhiều props, trong đó có thể có props là dữ liệu tham chiếu ( hàm, object, array) => nếu đã sử dụng react.memo() thì những function truyền qua props phải sử dụng useCallback để tránh bị re-render. Nếu không có react.memo() thì không cần sử dụng useCallback

## useMemo hook (ghi nhớ)

- Dùng để tránh thực hiện lại 1 logic nào đó không cần thiết
- Nhận vào 2 đối số:
  - 1 call back muốn trả về
  - 1 mảng deps: nếu deps rỗng thì chỉ thực hiện tính toán 1 lần, những làn re-render sau đó chỉ trả về kết quả tính toán của lần trước

## useReducer hook

- Cung cấp thêm 1 sự lựa chọn để sử dụng state cho function component
- Khi gặp bài toán dùng useState giải quyết được thì dùng useReducer cũng giải quyết được và ngược lại
- Khi nào dùng thằng nào ?
  - Trong hầu hết trường hợp có state đơn giản, số lượng state ít: useState
  - Trong những tình huống state phức tạp, state là array, object, nhiều tầng : useReducer
- Với useState:
  - Xác định giá trị khởi tạo
  - Actions: Up (state + 1) ,Down (state - 1)
- Với useReducer(): nhận 2 đối số, thứ nhất là hàm reducer, thứ 2 là initialValue
- const [count, dispatch] = useReducer(reducer, initState)
- Khi khởi tạo thì useReducer không chạy, khi dispatch mới chạy
  - 1. Xác định giá trị khởi tạo
  - 2. Actions: Up (state + 1) ,Down (state - 1)
  - 3. tạo hàm reducer => nhận đầu vào là state và action, trả về state với tùy vào action
  - 4. dispatch -> truyền vào 1 action

## To do list with Reducer

## useReducer recap

- Khi sử dụng useReducer thì nên tách nhỏ ra những file như reducer.js, action.js để tránh code trong 1 file component trở nên quá dài

## useContext hook

- Context - đơn giản hóa việc truyền dữ liệu từ component cha đến component con mà không cần dùng props
- Component A => Component B => Component C
- nếu truyền dữ liệu bằng context thì sẽ truyền thằng từ component A đến bất cứ component nào mà không cần phải qua trung gian
- Gồm 3 bước:
  - 1. Tạo ra context: tạo ra 1 phạm vi, ví dụ tạo ở component A thì có thể truyền đến bất kì thằng con nào của A
  - 2. Provider -> để truyền dữ liệu đi thì cần 1 provider
  - 3. Consumer -> để nhận dữ liệu từ A cần consumer
- Tạo 1 createContext
  const ThemeContext = createContext()
  - hàm createContext() sẽ trả về 1 object có provider và consumer (component)
- Với provider thì tạo thẻ `<ThemeContext.Provider>` ôm hết thẻ cha, có props và `value`. Và tất cả những component con được bọc sẽ lấy được `value`
- Còn ở component con thì sẽ import context đó và sử dụng useContext để lấy dữ liệu qua Consumer
  - useContext(`tên context`) sẽ trả về value của component cha
- Thông thường người ta không dùng context ở file App mà dùng ở file Index

## Context + useReducer -> tạo ra state toàn cục, global state

### So sánh redux và React-context

- 1. Debugging capabitities: khả năng gỡ lỗi
- 2. Middleware : Phần mềm trung gian
- 3. Addons and extensibility: Addons và khả năng mở rộng
- 4. Cross-platform and cross-framework usage : Sử dụng đa nền tảng và đa khung
- 5. Depending on your app's setup, much better performance than working just context

## useImperativeHandle hook

- hook này có thể tùy chỉnh ref của function component
- Vấn đề: nếu truyền ref cho 1 element thật ở DOM thì có thể lấy được ref nhưng nếu truyền qua props 1 component function thì không
- Do đó:
  - props ref không được chuyển tiếp từ component cha đến component con
  - để giải quyết bài toán thì React cung cấp một HOC để có thể chuyển tiếp 1 ref qua function component
  - Tại component muốn nhận ref từ bên ngoài thì import forwardRef, rồi dùng forwardRef ôm component đó khi export ra
  - ref nhận được chính là đối số thứ 2 của component
- Nhưng khi dùng như vậy thì sẽ public ref ra toàn cục -> gay nguy hiểm cho component
- Vậy phải dùng useImprerativeHandle
- useImprerativeHandle() nhận 2 đối số
  - 1. ref truyền xuống
  - 2. callback -> return ra 1 object -> sẽ được lấy để làm ref mới và sẽ set các phương thức phù hợp

# 12. Sử dụng css

- Khi ứng dùng react import những file .css thì trong môi trường phát triển thì sẽ tạo ra css internal (npm start / yarn start)

- Khi website được người dùng cuối sử dụng -> npm run build / yarn build -> thì css sẽ được thể hiện dưới dạng external
- serve -s build : chạy folder build dạng production

- Chú ý: các css có hiệu lực ở tất cả cá file, vì vậy phải chú ý đặt tên class

# Css module

- Tạo ra những file css độc lập và không ảnh hưởng tới nhau
- Khi có nhiều component và nhiều file css, và đặt trùng class thì cũng không ảnh hướng tới nhau
- Thêm đuôi module.css cho mỗi file class trong component
- Webpack sẽ trả ra 1 object style có key là các class, khi add class chỉ cần styles.key
- Khi css module thì không đưa tag name vào
- Khi đặt tên css module thì đặt thoe camelCase
- Muốn kế thừa css thì sẽ kết hợp giữa css thường và css module:
  - 1. Tạo 1 folder GlobalStyle chứa file index.js và GlobalStyle.css
  - 2. Ở file css thì sẽ đặt class bình thường và css chung để dùng lại
  - 3. Ở file index.js thì sẽ viết 1 component tên là GlobalStyle nhận props là children và đi return các children đó, sau đó export default component GlobalStyle và dùng component này để ôm toàn bộ app

# Thư viện clsx và classnames

- Xử dụng thư viện clsx để code css kế thừa là dễ dàng hơn
- install ở terminal
- Sử dụng: gọi hàm và truyền đối số clsx(styles. , styles. )
- clsx() có thể xử lý css động bằng cách truyền vào 1 object
  - clsx({[styles.active]: true/false})

# Install SASS để dùng SCSS?

- Học scss

# React router v6
- Đây là thư viện tạo ra cơ chế định tuyến cho những ứng dụng được viết bằng reactJS
- Định tuyến có nghĩa là cho phép di chuyển qua lại giữa các trang nằm trong 1 website
- Tạo routing cho toàn trang: import { BrowserRouter } from 'react-router-dom';
- Sau đó cho nó ôm toàn bộ component app -> tạo ra cơ chế định tuyến cho toàn bộ ứng dụng, có thể đổi tên bằng cách as Router
- 1 trang web chỉ có 1 router

- Ở app.js import { Routes, Route, Link } from "react-router-dom";
- Routes sẽ nhóm những Route lại
- Link như những thẻ a nhưng có props là 'to' để chỉ đường cho 'path' của Route
- tại vị trí muốn khi path được thay đổi nội dung thay đổi thì đặt <Routes> vào vị trí đó , bên trong Routes sẽ chứa nhiều Route và có props là 'path', đặt trùng với props 'to' của <Link/>, còn props 'element' thì truyền giá trị là component muốn chuyển đến

# Sử dụng prettier và Eslint trong React 
- Tạo file .editorconfig để setting với các editor khác nhau
```txt
  [*]
  indent_style = space
  indent_size = 2
```
- Tạo file .prettierrc để chia sẻ setting prettier giữa các editor
```json
{
  "arowParents":"always",
  "semi": false,
  "trailingComma": "es5",
  "tabWidth": 2,
  "singleQuote": true,
  "printWidth": 120,
  "jsxSingleQuote": true
}
```

- Cài các devDependencies hỗ trợ prettier và eslint trên terminal
  + Ở trên thì chúng ta mới chỉ setting prettier cho editor, bây giờ là cho terminal. Editor thì có thể mỗi máy sẽ kiểm ra khác nhau nhưng trên terminal thì không, setting trên terminal sẽ giúp code thống nhất
```bash
  npm i prettier eslint-plugin-prettier eslint-config-prettier -D
```
- Tạo file `.eslintrc` để setting eslint
- Thêm script vào packgage.json
- Thêm fiel `.prettierignore` và `eslintignore` để ignore những file không muốn prettier và eslint formast

# Setting CICD tự động deploy với Vercel

# React main concept