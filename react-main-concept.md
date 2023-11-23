# Chương I: React Main Concept

## 1. JSX

- Là phần mở rộng cho JS, giúp tạo ra các `react element`
- Có thể viết HTML trong JS

## 2. Render Element

- React chỉ render những element cần thiết, những element không bị thay đổi sẽ không bị re-render

## 3. Component và props?

- Component có tính tái sử dụng cao, là những thành phần được bóc tách từ website
- `Props` là một object chứa những thông tin giá trị được truyền vào 1 component con

## 4. State và lifecycle

- `state` là một object chứa dữ liệu hoặc thông tin về `component`
- `State` trong một `component` có thể thay đổi và bất cứ khi nào nó thay đổi, `component` sẽ render lại.

- lifecycle là 1 vòng đời đời của 1 component, gồm 3 giai đoạn:
  - mounting
  - updating
  - unmounting

## 5. Cách dùng Props và PropTypes

- Có thể dùng toán tử spread để lấy ra hết props hoặc destructuring để lấy ra các phần tử của 1 props
- Dùng `children`
- PropTypes : kiểm tra dữ liệu đầu vào khi truyền props

## 6. Xử lý event

- Xử lý `event` trong React thì rất tương đồng với HTML. Có 1 vài điểm khác là:
  - Các event trong React `được đổi tên lại theo camelCase thay vì lowercase`
  - Với JSX thì `phải truyền function như một function handler` thay vì truyền một function thực thi hay string

## 7. Render có điều kiện

- Dùng toán tử && để render có điều kiện
- Hoặc có thể dùng toán tử null list

## 8. Sử dụng state đúng cách

- Quá trình cập nhật state có thể diễn ra bất đồng bộ
- React có thể gọi setState() nhiều lần trong 1 lần cập nhật để tăng hiệu suất -> sử dụng `callback` với `prevState`
- Chú ý: `class component` có tính năng `merge state`

## 9. List và key trong React? Tại sao không nên dùng key là index?

- React hỗ trợ render 1 list element bằng **`phương thức map()`** của array.
- Mỗi child trong list nên có 1 key `(unique key)`
- Không nên dùng key là index vì:
  - dễ gây ra bug
  - performance kém đi (khi index thay đổi thì sẽ render lại toàn bộ list)
- Mục đich sử dụng `props key`:
  - Xác định phần tử duy nhất
  - Tối ưu hóa hiệu suất
  - Loại bỏ lặp lại
  - Giúp react theo dõi thứ tự

## 10. Form trong React

- HTML form hoạt động hơi khác so với React form
- Để lưu trữ giá trị của các input trong React , ta sử dụng kĩ thuật `Controlled components`:

  - Nghĩa là quản lý state của các element trên và cập nhật chúng bằng `setState`

- Thẻ input type file
  - Có 1 cái đặc biệt: read only -> gọi là uncotrolled component

## 11. Uncotrolled Components

- Trong `Controlled Component` thì data được quản lý bởi `React component`
- Trong `Uncontrolled Component` thì data được quản lý bởi `DOM của chính nó`
- Input type file là 1 `Uncontrolled Component`
- Cách fix những lỗi phổ biến liên quan đến `Uncontrolled Component` (vô tình truyền undefined vào input )
  - Truyền dữ liệu đúng là string vào input

## 12. Lifting State Up - Đưa state lên trên

- Thường những component nào mà có sự tương tác lẫn nhau khi thay đổi dữ liệu thì chúng ta nên đưa state lên components cha gần nhất chứa chúng, state lúc này sẽ được chia sẻ với những components con. Kĩ thuật này gọi là `Lifting State Up`

## 13. Dùng React Developer Tool để debug

- Cài react developer extension để debug ứng dụng React

## 14. Composition vs Inheritance (dùng trong class component)

- Inheritance: kế thừa (không nên dùng)
- Composition đơn giản là việc chúng ta sử dụng những props để truyền value, làm cho component có tính tải sử dụng

* Tại Facebook, họ đã sử dụng hàng ngàn component React, họ chưa bao giờ gặp trường hợp nào phải sử dụng đến inheritance component.

- Nếu muốn sử dụng lại những function không liên quan đến UI giữa các componnet với nhau, ta có thể đưa nó ra thành một function riêng như kiểu Javascript module. Sau đó có thể imort vào component nào muốn dùng, đừng kế thừa làm gì cho mệt.

## 15. Fragment

- Hữu ích khi muốn return về nhiều element

## 16. Thinking in React

- React có thể xây dựng các web app từ nhỏ đến lớn. Điều quan trọng là cách chúng ta suy nghĩ thiết kế làm sao cho web app của chúng ta có thể mở rộng dễ dàng
- Phần tuyệt vời nhất của react chính là cách suy nghĩ về việc build app như thế nào

### a. Bắt đầu với mock

### b. Xác định những thành phần nhỏ như state và event trong các component

- Nó có thể được truyền từ component cha xuống thông qua props hay không? Nếu có, chúng ta không nên dùng state ch nó
- Nó có cố định theo thời gian không? Nếu có, state không phải là lựa chọn hay
- Có thể tính toán nó dựa vào bất cứ giá trị state hoặc props nào đó trong component của bạn hay không? Nếu có, cũng không cần dùng state

### c. Xác định state nên đặt ở đâu

- `Nhớ rằng react chỉ có 1 luồng duy nhất là truyền data từ trên xuống dưới. Sẽ không có chuyện component con truyền data ngược lên cho component cha`

- Dưới đây là 1 số mẹo để chúng ta xác định nên đặt state ở đâu:
  - Tìm những component mà data của chúng có sự tương tác lẫn nhau => chúng ta nên đặt state ở component cha chung của các component con này.
  - Tìm component cha chung: Component cha chung thường là nơi đặt state để truyền xuống các component con
  - Nếu không tìm thấy component nào phù hợp để đặt state => Tạo 1 component cha mới để bọc các component con và đặt state ở component cha đó

# Chương II: CSS trong React

## 1. Vấn đề Global Scoped CSS trong React

- CSS trong React không được `component scope`
- Những cách để khắc phục:
  - `Inline CSS`
  - `Atomic CSSS`: tailwind
  - `Styled Component` : Scoped được CSS những lại tạo ra một component mới, viết dài dòng, bù lại có thêm vài tính năng mới như truyền props vào, kế thừa css

## 2. Sử dụng SASS trong React

- Cần phải cài 1 số thứ : npm i sass

## 3. Sử dụng Inline CSS trong React

- Dùng trong trường hợp cần css theo 1 điều kiện nào đó

## 4. Atomic CSS là gì ?

- Những thư viện như bootstrap, tailwind

## 5. Sử dụng Styled Component trong React

- `https://styled-components.com/`

## 6. Sử dụng CSS module trong React

- Tạo file css có dạng .module.scss
- Nhớ cài sass

# Chương III: React Hook cơ bản

## 1. Giới thiệu về Hook

- `"Hook"` trong React là một khái niệm liên quan đến React Hooks, một tính năng đã được giới thiệu trong React 16.8 để cho phép bạn sử dụng state và các tính năng của React trong các thành phần hàm thay vì chỉ trong các thành phần lớp. Hooks là một cách để bạn có thể sử dụng các tính năng của React trong các thành phần hàm function-based components (FBC) mà không cần phải sử dụng class-based components.
- Một số hooks phổ biến trong React:

  - `useState`: Hook này cho phép bạn sử dụng state trong các `Functional Component`
  - `useEffect`: Hook này cho phép bạn thực hiện các side effect phụ thuộc vào state hoặc props trong các `Functional Component`
  - `useContext`: Hook này cho phép bạn truy cập context trong các `Functional Component`

  - `useReducer`: Hook này cho phép bạn quản lý state phức tạp hơn thông qua một hàm reducer.

  - `useRef`: Hook này cho phép bạn tạo một tham chiếu đến một DOM element hoặc một giá trị không bị thay đổi trong các renders.

## 2. useState()

- Để khai báo hook useState() -> dùng cú pháp destructuring
- Cú pháp:

```javascript
import React, { useState } from "react";

function Counter() {
  // const [state, setState] = useState(initialValue);
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

- Không nhất thiết phải khai báo đầy đủ 2 item
- initialValue có thể là 1 callback

## 3. useEffect()

- `useEffect` được sử dụng trong functional component đóng vai trò như những life cicle bên class component
- `useEffect` nhận vào 2 tham số là `effect function (callback)` và `deps array`
- `effect function` sẽ chạy `sau khi component render và mounted`

- Có 3 trường hợp sử dụng useEffect():
  #### Không truyền depedency
- Trường hợp này nó đóng vai trò như một `componentDidUpdate`
- Effect function sẽ được gọi mỗi khi component re-render

  #### Depedency là array rỗng `[]`

- Trường hợp này nó đóng vai trò như một `componentDidMount`
- Effect function chạy `duy nhất 1 lần` sau khi component re-render lần đầu
- Thường dùng khi gọi API

  #### Depedency có các item `[a, b]`

- Những giá trị phải truyền vào deps: state, biến sử dụng trong functional component

- useEffect `return 1 clean up function chạy trước effect fuction tiếp theo`: nghĩa là `clean up function` sẽ chạy trước khi component `unmounted` (destroy)

## 4. useContext()

- `useContext` là một trong những React Hook cho phép bạn truy cập vào context (bối cảnh) trong các thành phần hàm của ứng dụng React. Context là một cách để chia sẻ dữ liệu giữa các thành phần con mà không cần phải truyền dữ liệu qua nhiều cấp độ của cây thành phần (prop drilling). Điều này giúp cải thiện tính tái sử dụng và quản lý trạng thái ứng dụng một cách hiệu quả.

- Sử dụng `useContext`

```jsx
import React, { useContext } from "react";

// Bước 1: Tạo một context
const MyContext = React.createContext();

// Bước 2: Tạo một Provider để cung cấp dữ liệu
function MyProvider({ children }) {
  const data = "Dữ liệu từ Context";

  return <MyContext.Provider value={data}>{children}</MyContext.Provider>;
}

// Bước 3: Sử dụng useContext trong các thành phần con
function MyComponent() {
  const contextData = useContext(MyContext);

  return (
    <div>
      <p>Dữ liệu từ Context: {contextData}</p>
    </div>
  );
}

function App() {
  return (
    <MyProvider>
      <MyComponent />
    </MyProvider>
  );
}

export default App;
```

## 5. Nguyên tắc khi dùng hook

- Bản chất của hook là 1 javascript function
- Chỉ gọi hook ở top level
  - Đừng gọi hook bên trong vòng lặp, câu lệnh điều kiện hoặc nested function. Thay vào đó hãy sử dụng hooks ở top level của React Function, trước bất kì return nào
  - Nguyên tắc này sẽ đảm bảo hooks được gọi cùng thời điểm khi component render
- Chỉ gọi hook trong React Function

## 6. Tính năng mới trong React 18 - Batching of state updates

- Có nghĩa là react là nhóm những lần setState lại thành 1 lần render duy nhất -> tăng hiệu suất

- Nếu trong trường hợp không cần dùng chức năng `Batching` này thì dùng `flushSycn` của `react-dom`

## 7. React re-render 2 lần mặc dù setState cùng value? Lý do tại sao?

- Điều kiện để component re-render khi dùng setState là chúng ta phải setState với giá trị khác với State hiện tại
- Đối với kiểu dữ liệu nguyên thủy thì khác giá trị
- Đối với object thì khác tham chiếu
- Nhưng ta sẽ gặp 1 trường hợp dưới đây. Khi nhấn button lần đầu thì re-render 1 lần, nhấn lần nữa thì re-render lần thứ 2 mặc dù giá trị `name` không thay đổi

```jsx
export default function RuleOfHook() {
  //1. use the name state variable
  const [name, setName] = useState("Mary");
  return (
    <div>
      <button onClick={() => setName("Alex")}>Change name</button>
    </div>
  );
}
```

- Theo như team React giải thích thì khi chúng ta set state với giá trị không đổi, ban đầu React sẽ không biết liệu bạn có thực sự muốn set state và re-render hay không nên React sẽ re-render. Ở lần set state tiếp theo, khi chúng ta lại set state với giá trị cũ thì bây giờ React sẽ không re-render nữa

## 8. Custom Hook

- Là tạo ra những hook mới do chúng ta tự định nghĩa để giải quyết một công việc nào đó
- KHi custom hook thì xem ta cần return ta gì, thường là 1 object hoặc 1 array
- Những trường hợp có thể custom hook :
  - Logic lặp lại nhiều nơi

```jsx
//api.js
export const getUser = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: {
          name: "Nguyen Huu Thien",
          age: "26",
          address: "Da nang",
        },
        status: 200,
      });
    }, 1500);
  });
};
```

```jsx
import { useEffect, useState } from "react";
import { getUser } from "./api";

export default function useUser(value) {
  const [user, setUser] = useState(value);
  useEffect(() => {
    getUser().then((res) => {
      setUser(res.data);
    });
  }, []);
  return { user };
}
```

# Chương IV: Project Todo List với Typescript

## 1. Tư duy phân tích component

## 2. Khởi tạo dự án React Typescript với các config prettier eslint

`https://duthanhduoc.com/blog/tao-du-an-react-vite-typescript-eslint`

# Chương V: React Hook nâng cao [React 18]

## 1. Higher Order Component

- `HOF (Higher Order Function)` là 1 function mà nhận vào đối số là một function hoặc return về một function. Ví dụ: các hàm map, filter ..., kĩ thuật currying

- `HOC (Higher Order Component)` là kỹ thuật nâng cao trong React, không phải là một React Api. HOC là một function nhận vào một component và return về một component mới

```jsx
const EnhacedComponent = higherOrderComponent(WrappedComponent);
```

- HOC phổ biến trong các thư viện React: `connect(mapStateToProps, mapDispatchToProps)(UserPage)` của react-redux, `withRouter(UserPage)` của react-router, `withStyles(styles)(UserPage)` của material-ui
- HOC thường được dùng khi: muốn tái sử dụng logic gì đấy
- Trong một số trường hợp thì chúng ta có thể custom hook để xử lý mà không cần dùng đến HOC
- Đừng dùng HOC bên trong render method hoặc trong function component

## 2. React.memo

- `Các tác nhân làm component re-render`: cập nhật state, cập nhật props, component cha re-render
- Chúng ta dùng `React.memo` khi không muốn component bị re-render mỗi khi component cha re-render
- React.memo là một HOC, vậy nên chỉ cần bao bọc component là được
- React.memo sẽ giúp component con chỉ bị re-render khi props thay đổi.

```jsx
// thay vì export Component con thì hãy bọc lại bằng react.memo
const equal = (prevProps, nextProps) => {
  if (prevProps.address.street === nextProps.address.street) {
    return true;
  }
  return false;
};
export default React.memo(Component, equal);
// Ngoài nhận tham số đầu tiên là 1 component, React.memo còn nhận tham số thứ 2 là 1 function để check xem props có thay đổi để re-render hay không
// Có những trường hợp khi component cha re-render khiến cho props của component con bị đổi tham chiếu thì có thể dùng hàm truyền vào tham số thứ 2 để can thiệp. Nếu equal return true nghĩa là props không thay đổi -> không re-render. Nếu equal return false nghĩa là props thay đổi -> re-render.
```

- React.memo chỉ ảnh hưởng đến props, không ảnh hưởng đến state
- Cơ chế memo là cơ chế dùng bộ nhớ (RAM) để lưu trữ, vì thế khi dùng những thứ liên quan đến memo nghĩa là chúng ta đang đánh đổi giữa tốn nhiều bộ nhớ hơn để tăng tóc performance.
- Vì thế không nên lạm dụng quá

## 3. useMemo

- `useMemo` giúp ta không thực hiện việc tính toán lại hay thay đổi tham chiếu của 1 biến khi component re-render
- `useMemo` nhận vào 2 đối số, thứ nhất là 1 callback function phải return về gì đó, chúng ta muốn trả về gì thì return ở call back, đối số thứ 2 là một dependence tương tự như useEffect (không truyền, mảng rỗng, mảng deps)

```jsx
const address = useMemo(() => {
  return {
    street: "10 tran hung dao",
  };
}, []);
// Biến address không bị thay đổi tham chiếu khi component re-render
```

## 4. useCallback

- Chúng ta dùng `useCallback` khi chúng ta không muốn function của mình được khởi tạo lại mỗi lần component của chúng ta re-render

```jsx
// Cách 1:
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
// Cách 2:
const handleClickTitle = useCallback((value: any) => {
  console.log(value);
}, []);
```

- Cách sử dụng tương tự như `useMemo`, ngoài ra thì chúng ta có thể dùng `useMemo` thay cho useCallback cũng được

```jsx
const memoizedCallback = useMemo(() => {
  return () => doSomething(a, b);
}, [a, b]);
```

## 5. ref, useRef, forwardRef

#### Kiến thức cũ:

- `Mutate`: là chúng ta thay đổi giá trị bên trong mà không làm thay đổi tham chiếu của nó.

```jsx
const A = { name: "thien" };
const B = A;
A.name = "Cuong";
console.log(A === B); // true vì tham chiếu của A và B giống nhau
```

- `State hay prop thì không được mutate ?`: Đối với React thì chúng ta dùng state để lưu trữ những giá trị có thể thay đổi theo thời gian, và chúng ta không mutate state, chúng ta thay thế bằng một giá trị mới với tham chiếu mới dùng set state để nói cho React biết

```jsx
const [todo, setTodo] = useState({ name: "Hoc Bai", time: "08:20:PM" });
const handleClick = () => {
  // todo.name = 'Tap Gym' // chúng ta không được mutate như thế này
  setState((prev) => ({ ...prev, name: "Tap Gym" })); // Chúng ta set state với một giá trị object mới khác tham chiếu object cũ
};
```

- Việc cập nhật state sẽ làm component re-render
- Tất nhiên về mặt lý thuyết chúng ta vẫn có thể mutate trong trường hợp chúng ta không muốn component re-render, nhưng không nên làm như vậy, vì chúng ta sẽ không kiểm soát được state, rất dễ sinh bug. Và useState của React không sinh ra để chúng ta làm vậy
- Giờ đặt vấn đề là có cách nào để mutate biến mà không làm component render hay không?

#### useRef

- `useRef` là một hook lưu trữ một biến có thể mutate hoặc cho phép chúng ta truy cập DOM node
- Một số đặc điểm của ref:
  - Tham chiếu ref sẽ không thay đổi khi re-render (không như biến thông thường, bị reset mỗi khi re-render)
  - Thay đổi nó sẽ không làm re-render
  - Thông tin được bao gói bên trong component (không như biến bên ngoài, bị chia sẻ nhiều chỗ khác dùng được)
- Cạm bẫy khi dùng useRef:
  - Đừng nên đọc hay ghi `ref.current` suốt quá trình render. Đây là nguyên tắc React!

```jsx
function MyComponent() {
  const myRef = useRef(100);
  // 🚩Không ghi ref suốt quá trình render.
  myRef.curent = 123;
  // 🚩Không đọc ref suốt quá trình render.
  return <h1>{myRef.curent}</h1>;
}
```

- Bạn có thể đọc và ghi `ref.current` trong `event handler` hoặc `useEffect`

```jsx
function Mycomponent() {
  // ...
  useEffect(() => {
    // You can read or write refs in effect
    myRef.curent = 123;
  });
  const handlerClick = () => {
    // You can read or write refs in event handler
    doSomething(myOtherRef.curent);
  };
}
```

- Nếu bạn phải đọc và ghi thức gì đó suốt quá trình render, sử dụng useState
- Khi bạn phá vỡ những rule này, component của bạn có thể vẫn hoạt động nhưng dễ gây ra bug. Tất cả tính năng mà React thêm vào đều dựa trên nguyên tắc là pure component

#### Truy cập DOM nodes hoặc React elements với useRef

```jsx
  const CustomTextInput = () => {
    const textInput = useRef()
    const focusTextInput = () => textInput.current.focus()
    return (
      <>
        <input type="text" ref="textInput" />
        <button onClick={focusTextInput}>Focus the text input</button>
      </input>
    )
  }
```

- `ref` sẽ không được truyền xuống component, vì `ref` không thực sự là một prop, nó được xử lý bởi React. Giải pháp cho vấn đề này là chúng ta dùng `React.forwardRef`

#### forwardRef là gì?

- Như đã tìm hiểu, `ref` giúp chúng ta truy cập đến một element, nhưng không thể truy cập đến 1 component Reacr -> dùng `forwardRef`
- `forwardRef` là một HOC
- `forwardRef` là một hàm trong React cho phép bạn truyền một `ref` từ một `thành phần cha` đến một `thành phần con` mà `không làm gián đoạn quá trình render`. Điều này rất hữu ích khi bạn muốn truy cập DOM hoặc các phương thức của một thành phần con từ một thành phần cha. forwardRef giúp bạn tránh việc truyền các props không cần thiết qua từng cấp thành phần chỉ để chuyển ref.

```jsx
import React, { useRef, forwardRef, useImperativeHandle } from "react";

// Thành phần con
const ChildComponent = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  // Sử dụng useImperativeHandle để thiết lập các phương thức có thể được gọi từ ngoài
  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current.focus();
    },
    resetInput: () => {
      inputRef.current.value = "";
    },
  }));

  return <input type="text" ref={inputRef} />;
});

// Thành phần cha
function ParentComponent() {
  const childRef = useRef(null);

  const handleFocus = () => {
    childRef.current.focusInput(); // Gọi phương thức focusInput của thành phần con
  };

  const handleReset = () => {
    childRef.current.resetInput(); // Gọi phương thức resetInput của thành phần con
  };

  return (
    <div>
      <ChildComponent ref={childRef} />
      <button onClick={handleFocus}>Focus Input</button>
      <button onClick={handleReset}>Reset Input</button>
    </div>
  );
}

export default ParentComponent;
```

- Trong ví dụ trên, `ChildComponent` là một thành phần con chứa một input. Bằng cách sử dụng `forwardRef`, chúng ta có thể truyền ref từ `ParentComponent` vào `ChildComponent`. Sau đó, chúng ta sử dụng `useImperativeHandle` để thiết lập các phương thức (focusInput và resetInput) mà `ChildComponent` cho phép gọi từ ngoài.

## 6. useLayoutEffect và tiến trình paint trên trình duyệt

- [Sơ đồ](https://www.figma.com/file/V0HCozEgdcOsg3QkdYeRRa/useEffect-vs-useLayoutEffect?node-id=0%3A1)
- Paint trình duyệt là thuật ngữ để mô tả việc vẽ lên trình duyệt.
- Phân biệt `useEffect` và `useLayoutEffect`
  - `callback` của `useEffect` sẽ chạy sau khi `paint`, `callback` của `useLayoutEffect` sẽ chạy trước `paint`
  - điều này có nghĩa là nếu trong `useEffect` và `useLayoutEffect` có `setState` thì `useEffect` sẽ hiển thị UI trước rồi mới chạy `callback` để `setState` để re-render thay đổi UI. Điều này dẫn đến việc UI bị giật khi re-render. Còn đối với `useLayoutEffect` thì `callback` sẽ chạy trước `paint` nên nó sẽ` block UI` một thời gian để gọi `callback` setState. Khi đó sẽ không có hiện tượng giật lag mà sẽ paint UI ở lần re-render cuối cùng
- Tóm lại, 99% các trường hợp nên dùng useEffect
- Khi nào cảm thấy UI bị flicker thì dùng useLayoutEffect(),
  nhưng hãy nhớ useLayoutEffect block UI 1 lúc

## 7. useReducer

- `useReducer` là một hook dùng để gom logic các `useState` lại với nhau thành một chỗ. `useReducer` có cơ chế hoạt động tương đồng như Redux, vậy nên học `useReducer` thì qua Redux lại rất dễ
- Đối với `useState` thì muốn cập nhật state ta cần:
  1. Gọi set state function với value mới
  2. state đã cập nhật
- Đối với `useReducer` thì dài hơn 1 tí
  1. Gọi `dispatch function` với value là `action` (action có thể là object hoặc string)
  2. `Reducer` tính toán state mới dựa vào action nhận
  3. state đã cập nhật

```jsx
  const [state, dispatch] = useRerducer(reducer, initialArg, init?)
```

```jsx
// reducer llà một function dạng
function reducer(state, action) {
  // ...
}
```

- `initialArg` là giá trị state khởi tạo, tương tự bên `useState`. Vì vậy nên behavior tương tự bên useState, tránh gọi function bên trong này để không bị gọi lên tục mỗi ần re-render: `useReducer(reducer, calculate(initialArg))`
- `init`: đây là optional, nó là một function, nếu truyền vào thì khi `useReducer` được gọi, giá trị khởi tạo của bạn sẽ là `init(initialArg)`, còn không thì `initialArg` thôi!
- Nguyên tắc: trả về một object mới thay vì mutate

## 8. useContext (Typescript Version)

- `useContext` nằm trong API của React, giúp chúng ta không còn cảnh truyền prop dài loằn ngoằn từ ông -> cha -> con -> chắt nữa.

#### Cách dùng:

1. Tạo context bằng `createContext`

```jsx
const ThemeContext = createContext(null);
```

2. Dùng 1 Provider bao bọc component muốn dùng, chỉ cần component nằm trong Provider là dùng được hết!

```jsx
const ThemeContext = createContext(null);
export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}
```

- Provider nhận vào một prop là `value`, vì thế Form component có thể nhận value này thông qua context

3. Nhận context bằng `useContext()`

```jsx
import { createContext, useContext } from "react";
function Panel() {
  const theme = useContext(ThemeContext); // 'dark'
}
```

#### Lưu ý khi dùng useContext

- Provider gần nhất sẽ override Provider xa hơn. Ví dụ dưới đây, footer sẽ nhận `value` từ context là 'light'
- Không nên **_truyền thẳng một object_** vào `value` ở Provider, vì mỗi lần re-render sẽ là một object mới, dẫn đến các component trong Provider bị re-render do value context thay đổi
- Nhớ áp dụng useMeno và useCallback khi khởi tạo context hay những hàm có thể bị khởi tạo lại

## 8. useId

- `useId` là một hook giúp tạo ra một unique ID

```jsx
function Checkbox() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}></label>
      <input id={id} />
    </>
  );
}
```

#### Công dụng

- Tạo id duy nhất, thích hợp cho label htmlFor và input
- Có thể đồng bộ ở server và client. Nếu server return về id là 'a' nhưng client render với id là 'b' nghĩa là không đồng bộ. `useId` có thể fix điều này. Dùng nextjs hoặc chạy react trên server sẽ hiểu quá trình này
- Lưu ý:
  - Vì chúng ta không biết `useId()` sẽ return ra id như thế nào nên không dùng nó để CSS được. Chưa hết, string của nó có chứa dấu `:`, cái này thì không được hỗ trợ rtong các CSS selector hay API như `querySelectorAll`
  - `useId()` không nên dùng để tạo key trong list

## 9. useImperativeHandle

- `useImperativeHandle` dùng để đưa function từ component con ra component cha thông qua `ref`. Từ đó component cha có thể thực thi được một function ở component con. (trước đây thì ta chỉ thực thi function của component cha tại component con thông qua prop)
- Trước đây: Cha -> Con: Tại con gọi func của cha thông qua props cha truyền xuống
- Bây giờ: Cha -> Con: Tại cha gọi func của con thông qua giao tiếp ref + `useImperativeHandle`
- Vì `useImperativeHandle` dùng ref nên tránh là tránh dùng trong hầu hết các trường hợp. Bí quá mới dùng thôi! `useImperativeHandle` nên kết hợp với `forwardRef` để có thể dùng ref dễ dàng hơn với component

```jsx
useImperativeHandle(ref, createHandle, [deps]);
```

## 10. useDebugValue

```jsx
useDebugValue(value);
```

- `useDebugValue` được dùng trong custom hook để hiển thị value lên React Dev Tool

```jsx
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);
  // ...
  // Show a label in DevTools next to this Hook
  // e.g "FriendStatus: Online"
  useDebugValue(isOnline ? "Online" : "Offline");
  return isOnline;
}
```

## 11. useDeferredValue

- `useDeferredValue` dùng để trả về một value bị trì hoãn giống như `debounce`. Chỉ khác một cái là `debounce` ta có thể quy định thời gian trì hoãn, còn `useDeferredValue` thì không, thời gian trì hoãn sẽ dựa vào các yếu tố sau:
  - Tính chất cập nhật liên tục của state
  - Tốc độ thiết bị
  - Độ phức tạp của thuật toán và render jsx

```jsx
const deferredValue = useDeferredValue(value);
```

## 12. startTransition và useTransition

- Có cơ chế hoạt động y hệt `useDeferredValue`

```jsx
React.startTransition(callback);
```

- callback truyền vào `startTransition` sẽ được React đánh dấu là độ ưu tiên thấp, khi nào các tác vụ có độ ưu tiên cao hơn như cập nhật các state khác, render,... hoàn thành thì cái callback trong đó mới được chạy
- thường chúng ta chỉ dùng `startTransition` khi không muốn dùng `useTransition`, vì `useTransition` sẽ cho chúng ta thêm giá trị nữa là pending
- Cơ chế trì hoãn giữa `useTransition` và `useDeferredValue` là như nhau, đều đưa biến hoặc function vào trạng thái ưu tiên thấp
- Nếu có thể dùng thì cứ dùng `useTransition` vì nó đem lại nhiều lợi ích hơn
- Chỉ dùng `useDeferredValue` khi mà không thể dùng `useTransition`. Ví dụ trong những trường hợp chúng ta không thể can thiệp vào quá trình cập nhật state của component (của 1 thư viện bên thứ 3 chẳng hạn)
- `Đừng lạm dụng`, không nên gói tất cả cập nhật state trong `useTransition` hay tất cả các value trong `useDeferredValue`. Chỉ nên dùng nếu UI và performance có vấn đề mà chúng ta không thể xử lý bằng các cách khác

## 13. Tạo Modal với React Portal

## 14. Kỹ thuật Render Props

## 15. React Strict Mode là gì? Tại sao lại bị 2 lần re-render

- Strict mode là công cụ giúp cảnh báo các vấn đề tiềm tàng trong ứng dụng của chúng ta, nó sẽ thêm một số bước kiểm tra và warning nó lên console
  > Strict Mode chỉ chạy ở chế độ development, khi bạn build cho production thì nó sẽ biến mất
- Muốn dùng strict mode cho component nào thì chỉ cần bao bọc component đó là được

## 16. Bắt lỗi ứng dụng React với Error Boundary
- React Boundary là một class component giúp chúng ta bắt lỗi trong ứng dụng react và trả về 1 fallback UI (Ui dự phòng)
- Error Boundary bắt lỗi các component trong nó
  + Lỗi trong quá trình rendering
  + Lỗi trong lifecycle
  + Lỗi trong constructor 
- Lưu ý Error Boundary không bắt được các lỗi:
  + Event Handler
  + Code bất đồng bộ
  + Server side rendering
  + Lỗi trong Error Boundary
