# Tối Ưu Hiệu Suất Web, Google Score, và SEO với Next.js và React.js

## 1. Tối ưu hóa hình ảnh trong Next.js
- **Next.js Image Component**:
  - Sử dụng `<Image>` của Next.js để tự động tối ưu hóa hình ảnh với các kích thước khác nhau và định dạng WebP.
  - Ví dụ:
```js
import Image from 'next/image';

    function MyComponent() {
      return (
        <Image
          src="/images/my-image.jpg"
          alt="My Image"
          width={500}
          height={300}
          priority={true} // Load sớm cho hình ảnh quan trọng
        />
      );
    }
```
- **Image Optimization Caching**:
  - Tận dụng khả năng caching tự động của Next.js cho hình ảnh để cải thiện thời gian tải trang.

## 2. Tối ưu hóa CSS và JavaScript trong React.js
- **Styled Components và CSS-in-JS**:
  - Sử dụng Styled Components hoặc Emotion để quản lý CSS một cách động, giảm thiểu CSS không sử dụng và hỗ trợ server-side rendering (SSR).
  
  - Ví dụ với Styled Components:
    ```javascript
    import styled from 'styled-components';

    const Button = styled.button`
      background-color: #0070f3;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      &:hover {
        background-color: #005bb5;
      }
    `;
    ```

- **Code Splitting với React.lazy() và Suspense**:
  - Chia nhỏ các component lớn thành các phần nhỏ hơn để chỉ tải khi cần thiết.
  - Ví dụ:
    ```javascript
    const OtherComponent = React.lazy(() => import('./OtherComponent'));

    function MyComponent() {
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <OtherComponent />
        </Suspense>
      );
    }
    ```

## 3. Tối ưu hóa Server-Side Rendering (SSR) và Static Site Generation (SSG)
- **Static Site Generation (SSG)**:
  - Sử dụng `getStaticProps` và `getStaticPaths` để tạo các trang tĩnh tại thời điểm build.
  - Ví dụ:
    ```javascript
    export async function getStaticProps() {
      const res = await fetch('https://api.example.com/data');
      const data = await res.json();

      return {
        props: { data },
      };
    }

    function MyPage({ data }) {
      return <div>{data.title}</div>;
    }

    export default MyPage;
    ```
- **Incremental Static Regeneration (ISR)**:
  - Kết hợp SSG với khả năng cập nhật nội dung theo thời gian thông qua ISR.
  - Ví dụ:
    ```javascript
    export async function getStaticProps() {
      const res = await fetch('https://api.example.com/data');
      const data = await res.json();

      return {
        props: { data },
        revalidate: 60, // Rebuild sau mỗi 60 giây
      };
    }
    ```

## 4. Tối ưu hóa Routing và Navigation
- **Dynamic Routing**:
  - Sử dụng dynamic routes của Next.js để tạo các trang dựa trên dữ liệu động.
  - Ví dụ:
    ```javascript
    export async function getStaticPaths() {
      const res = await fetch('https://api.example.com/posts');
      const posts = await res.json();

      const paths = posts.map((post) => ({
        params: { id: post.id },
      }));

      return { paths, fallback: false };
    }

    export async function getStaticProps({ params }) {
      const res = await fetch(`https://api.example.com/posts/${params.id}`);
      const post = await res.json();

      return { props: { post } };
    }

    function Post({ post }) {
      return <div>{post.title}</div>;
    }

    export default Post;
    ```
- **Prefetching Links**:
  - Sử dụng thuộc tính `prefetch` của `next/link` để tải trước các trang khi người dùng hover hoặc focus vào liên kết.
  - Ví dụ:
    ```javascript
    import Link from 'next/link';

    function MyComponent() {
      return (
        <Link href="/about" prefetch={true}>
          <a>About</a>
        </Link>
      );
    }
    ```

## 5. Tối ưu hóa SEO trong Next.js
- **Meta Tags với Head Component**:
  - Sử dụng component `<Head>` của Next.js để thêm các thẻ meta cần thiết cho SEO.
  - Ví dụ:
    ```javascript
    import Head from 'next/head';

    function MyPage() {
      return (
        <>
          <Head>
            <title>My Page Title</title>
            <meta name="description" content="My page description" />
            <meta property="og:title" content="My Page Title" />
            <meta property="og:description" content="My page description" />
            <meta property="og:image" content="/images/my-image.jpg" />
          </Head>
          <div>My page content</div>
        </>
      );
    }

    export default MyPage;
    ```
- **Sitemap và Robots.txt**:
  - Tạo sitemap và robots.txt để giúp các công cụ tìm kiếm hiểu rõ hơn cấu trúc trang web của bạn.
  - Sử dụng gói `next-sitemap` để tự động tạo sitemap:
    ```bash
    npm install next-sitemap
    ```
    - Cấu hình trong `next-sitemap.js`:
      ```javascript
      module.exports = {
        siteUrl: 'https://www.example.com',
        generateRobotsTxt: true,
      };
      ```

## 6. Tối ưu hóa Caching và CDN trong Next.js
- **Caching Headers**:
  - Cấu hình header caching cho các tài nguyên tĩnh trong Next.js bằng cách sử dụng `next.config.js`.
  - Ví dụ:
    ```javascript
    module.exports = {
      async headers() {
        return [
          {
            source: '/(.*)',
            headers: [
              {
                key: 'Cache-Control',
                value: 'public, max-age=31536000, immutable',
              },
            ],
          },
        ];
      },
    };
    ```
- **CDN với Vercel**:
  - Tận dụng khả năng CDN tích hợp của Vercel khi triển khai Next.js để phân phối nội dung từ máy chủ gần người dùng nhất.

## 7. Tối ưu hóa Fonts và Text Rendering
- **Google Fonts Optimization**:
  - Tải font Google với thuộc tính `display=swap` để tránh FOIT (Flash of Invisible Text).
  - Ví dụ:
    ```javascript
    import Document, { Html, Head, Main, NextScript } from 'next/document';

    class MyDocument extends Document {
      render() {
        return (
          <Html>
            <Head>
              <link
                href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
                rel="stylesheet"
              />
            </Head>
            <body>
              <Main />
              <NextScript />
            </body>
          </Html>
        );
      }
    }

    export default MyDocument;
    ```
- **Font Subsetting**:
  - Tạo các subset font chỉ chứa những ký tự cần thiết để giảm kích thước font.

## 8. Monitoring và Performance Analysis
- **Google Lighthouse**:
  - Tích hợp Lighthouse vào quá trình phát triển để kiểm tra và tối ưu hóa các chỉ số hiệu suất.
  - Chạy Lighthouse audit:
    ```bash
    npx lighthouse https://www.example.com --view
    ```
- **React Profiler**:
  - Sử dụng React Profiler để phân tích hiệu suất của các component trong ứng dụng React.
  - Ví dụ:
    ```javascript
    import { Profiler } from 'react';

    function MyApp() {
      return (
        <Profiler id="MyComponent" onRender={(id, phase, actualDuration) => {
          console.log({ id, phase, actualDuration });
        }}>
          <MyComponent />
        </Profiler>
      );
    }
    ```

## 9. CI/CD và Tự động hóa
- **Lighthouse CI Integration**:
  - Tích hợp Lighthouse vào CI/CD pipeline để tự động kiểm tra hiệu suất mỗi khi deploy.
  - Cấu hình `lighthouserc.js`:
    ```javascript
    module.exports = {
      ci: {
        collect: {
          url: ['https://www.example.com'],
          startServerCommand: 'npm start',
        },
        assert: {
          assertions: {
            'categories:performance': ['error', { minScore: 0.9 }],
          },
        },
        upload: {
          target: 'temporary-public-storage',
        },
      },
    };
    ```
- **GitHub Actions for Deployment**:
  - Sử dụng GitHub Actions để triển khai tự động và kiểm tra hiệu suất:
    ```yaml
    name: Deploy and Test
    on:
      push:
        branches:
          - main
    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout code
            uses: actions/checkout@v2
          - name: Install dependencies
            run: npm install
          - name: Run build
            run: npm run build
          - name: Run Lighthouse CI
            run: npx lhci autorun
    ```

## 10. Tối ưu hóa React State Management
- **Sử dụng React Context và useReducer**:
  - Quản lý state hiệu quả với Context API và `useReducer` để tránh re-renders không cần thiết.
  - Ví dụ:
    ```javascript
    const initialState = { count: 0 };

    function reducer(state, action) {
      switch (action.type) {
        case 'increment':
          return { count: state.count + 1 };
        case 'decrement':
          return { count: state.count - 1 };
        default:
          throw new Error();
      }
    }

    function Counter() {
      const [state, dispatch] = React.useReducer(reducer, initialState);
      return (
        <>
          Count: {state.count}
          <button onClick={() => dispatch({ type: 'increment' })}>+</button>
          <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
        </>
      );
    }
    ```
- **Memoization với useMemo và useCallback**:
  - Sử dụng `useMemo` và `useCallback` để memoize các giá trị và hàm để tránh các phép tính lại không cần thiết.
  - Ví dụ:
    ```javascript
    const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```


