## 1. Client component

- Những dữ liệu thay đổi thường xuyên, phụ thuộc vào người dùng
- Dữ liệu động

## 2. Server component

- Những dữ liệu liệu ít thay đổi: logo, category, ...
- Dữ liệu tĩnh

## 3. Routing & Layout

- Với Next 13, chúng ta sử dụng thư mục "app" để khai báo route.
- Mặc định, tất cả "component" khai báo bên trong thư mục "app" sẽ là SERVER
  COMPONENT
- Với Next < 13 (v12 trở về trước). chúng ta có thư mục `"pages"` để khai báo route
  Component khai báo bên trong thư mục "pages" là client component
- Khi học Next 13, không cần thư mục `"pages"` nữa, vì Next sẽ cung cấp giải pháp mới
  giúp phân biệt `"client component"` và `"server component"`.

## 4. Định nghĩa Route (Page)

###### 1. Nguyên tắc cần tuân theo: `File-system based routing`

- Do NextJS là framework, bạn không cần phải tích hợp thư viện "react-router" như cách truyền thống, Nextjs đã tích hợp sẵn cho bạn
- định nghĩa route dựa vào cấu trúc thư mục của Nextjs
- Tên thư mục viết thường

###### 2. Các bước thực hiện:

- route "/" => component render là "page.tsx" nằm ở ngoài cùng
- route "/admin" => cần tạo folder "admin" và tạo file `page.tsx`
- route "/admin/dashboard" => cần tạo folder "admin" => folder "dashboard" và tạo file
  page.tsx ở folder "dashboard"
- Ý tưởng ở đây là, mỗi folder, là 1 thành phần trên đường link URL. file page.tsx chính là
  giao diện component được render ứng với route đấy.

## 5. Điều hướng trang Navigation

#### 1. Dùng thẻ `<Link/>` của `"next/link"`

```tsx
import Link from "next/link";

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>;
}
```

### 2. Dùng `useRouter`

```tsx
"use client";
// Nhớ phải dùng use client
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.push("/dashboard")}>
      Dashboard
    </button>
  );
}
```

## 6. Layout

- Tài liệu: [Tài liệu](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layout)
  s

###### Nguyên tắc:

- Layout giúp bạn reuse-code (share phần chung html cho các component khác nhau)
- Cần ít nhất/tối thiểu 01 layout để Next.js hoạt động
- file layout là React component, có tên bắt buộc là `"layout.tsx"` (dùng cho typescript)
- Có 2 loại layout: `root layout` và `layout bạn tự định nghĩa` (dùng cho route bạn muốn).

#### 1. Root layout

- là file layout.tsx bên trong thư mục `"app"`
- cần định nghĩa tags: <html> và <body>
- Root layout là server component => không thể là server component

#### 2. Nested layout

- khi có nhiều layout.tsx => layout sẽ tự động được "nested"

## 7. Sử dụng CSS với nextjs

- Tài liệu: [Tài liệu](https://nextjs.org/docs/app/building-your-application/styling)
- Có 2 trường phái code CSS
  + Code CSS thuần: CSS, SASS, Tailwind
  + CSS in JS (styled component - tương tự React Native)

## 8. Fetching data
- Dung use client
## 9. swr and useSWR
- useSWR chi o trong use client
