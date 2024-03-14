#### Sử dụng Fonts trong Next.js có 3 cách (Google Fonts, Local Fonts, Tailwind CSS)
[using font](https://www.youtube.com/watch?v=F3iDXE8Y6Es&list=PLFfVmM19UNqn1ZIWvxn1artfz-C6dgAFb&index=7)


#### Sử dụng Image trong Next.js (với next/image)
- Có 2 loại ảnh là ảnh lưu trong source code và ảnh lưu ở website bên ngoài


### Ảnh lưu trong source
  
- Sử dụng `Image` từ `next/image`: có 4 thuộc tính bắt buộc
```tsx
import Image from "next/image";

export default function Home() {

  return (

    <main>

      <div className="w-[700px] h-[700px] bg-red-300">

        <Image src="/images/suffer.png" alt="suffer" width={500} height={500} />

      </div>

    </main>

  );

}
```

- Bằng cách nào đó mà Nextjs đã giảm dung lượng  của ảnh so với ảnh gốc.
- Có thể set lại chất lượng của ảnh đầu ra bằng prop `quanlity`, mặc định là 75

```tsx
<Image

          src="/images/suffer.png"

          alt="suffer"

          width={500}

          height={500}

          quality={100}

        />
```

- `width` và `height` là 2 thuộc tính bắt buộc nhưng có thể set lại bằng cách css className

### Ảnh trên mạng (url)
- Khi xử dụng 1 ảnh từ bên ngoài thì nextjs sẽ chặn lại để đảm bảo app không bị tấn công
- Nếu muốn sử dụng thì phải vào trong `next.config.js` để config
```tsx
import Image from "next/image";

import suffer from "../../public/images/suffer.png";

export default function Home() {

  return (

    <main>

      <div className="w-[700px] h-[700px] bg-red-300">

        <Image

          src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"

          alt="suffer"

          width={500}

          height={500}

          quality={100}

        />

      </div>

    </main>

  );

}
```

```js
/** @type {import('next').NextConfig} */

const nextConfig = {

  images: {

    remotePatterns: [

      {

        protocol: "https",

        hostname: "assets.example.com",

        port: "",

        pathname: "/account123/**",

      },

    ],

  },

};

  

export default nextConfig;
```