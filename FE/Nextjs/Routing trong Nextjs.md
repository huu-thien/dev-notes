[Video](https://www.youtube.com/watch?v=Eaz4c1VN7Yg&list=PLFfVmM19UNqn1ZIWvxn1artfz-C6dgAFb&index=9)
- Routing trong nextjs sẽ được quy định dựa trên `tên folder` trong file `app`
- File `page` đại diện cho route `/`
- Muốn tạo các route khác chỉ cần tạo thư mục chứa file `page.tsx` bên trong file `app`

Ví dụ: Tạo folder `login` bên trong `app` và chứa file` page.tsx` thì ta có route ` /login`


   ![](route-segments-to-path-segments.avif)
#### Nhóm các route
- Sử dụng dấu ngoặc tròn để nhóm các route cùng phân khu, không ảnh hưởng về mặt routing, giúp dễ quản lý
- Ví dụ:  `(auth)`  bên trong chứa `login` và `register` thì routing vẫn là `/login` và `/register`

#### Thêm layout cho các Page
- Các route vẫn bị ảnh hưởng bới RootLayout
- Có thể thêm layout cho các page bằng cách tạo thư mục `layout.tsx` 
   ![](strucure_folder.png)
- Vẫn có thế thêm layout cho (auth) trong ví dụ trên
- Thứ tự apply các layout như sau

## [File Conventions](https://nextjs.org/docs/app/building-your-application/routing#file-conventions)

Next.js provides a set of special files to create UI with specific behavior in nested routes:

|||
|---|---|
|[`layout`](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts)|Shared UI for a segment and its children|
|[`page`](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#pages)|Unique UI of a route and make routes publicly accessible|
|[`loading`](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)|Loading UI for a segment and its children|
|[`not-found`](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)|Not found UI for a segment and its children|
|[`error`](https://nextjs.org/docs/app/building-your-application/routing/error-handling)|Error UI for a segment and its children|
|[`global-error`](https://nextjs.org/docs/app/building-your-application/routing/error-handling)|Global Error UI|
|[`route`](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)|Server-side API endpoint|
|[`template`](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#templates)|Specialized re-rendered Layout UI|
|[`default`](https://nextjs.org/docs/app/api-reference/file-conventions/default)|Fallback UI for [Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)|


# Linking and Navigating

There are four ways to navigate between routes in Next.js:

- Using the [`<Link>` Component](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#link-component)
- Using the [`useRouter` hook](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#userouter-hook) ([Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)) (next/navigation)
- Using the [`redirect` function](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#redirect-function) ([Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)) (redirect có thể chạy trong client component nhưng không work trong các event handler)
- Using the native [History API](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#using-the-native-history-api)

This page will go through how to use each of these options, and dive deeper into how navigation works.

- Có trường hợp không muốn cả page to thành `client component` thì nên tách nhỏ thành phần làm cho nó trở thành `client component` ra 1 file khác. Ví dụ như khi muốn sử dụng hook,...
- Và nên giữ các file là `server component` nhiều nhất có thể (dùng Link)