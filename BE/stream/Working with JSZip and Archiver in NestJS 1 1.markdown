# Làm việc với JSZip và Archiver trong NestJS

## Giới thiệu

Cả `jszip` và `archiver` là các thư viện phổ biến để xử lý file ZIP trong JavaScript, có thể được sử dụng trong môi trường Node.js và NestJS. Chúng hỗ trợ tạo, đọc và chỉnh sửa file ZIP, nhưng có cách tiếp cận và tính năng khác nhau, đặc biệt khi làm việc với file và stream.

### 1. Khái niệm Stream và Buffer

#### Buffer là gì?

- **Buffer** trong Node.js là một đối tượng được thiết kế để xử lý dữ liệu nhị phân thô (raw binary data). Nó đại diện cho một khối bộ nhớ được cấp phát bên ngoài V8 engine, được sử dụng để lưu trữ dữ liệu tạm thời trước khi xử lý hoặc ghi ra file.
- Buffer hoạt động giống như một mảng các số nguyên (integer) từ 0 đến 255, nhưng không thể thay đổi kích thước sau khi tạo.
- Ví dụ: Khi đọc một file hoặc nhận dữ liệu từ một nguồn, dữ liệu thường được lưu vào buffer trước khi được xử lý.

#### Stream là gì?

- **Stream** là một cơ chế xử lý dữ liệu theo luồng, cho phép đọc hoặc ghi dữ liệu theo từng phần nhỏ (chunks) thay vì tải toàn bộ dữ liệu vào bộ nhớ cùng một lúc.
- Stream rất hữu ích khi làm việc với các file lớn hoặc dữ liệu từ các nguồn như mạng, vì nó giúp giảm tiêu thụ bộ nhớ và tăng hiệu suất.
- Có 4 loại stream chính trong Node.js:
  - **Readable**: Đọc dữ liệu từ nguồn (ví dụ: đọc file).
  - **Writable**: Ghi dữ liệu vào đích (ví dụ: ghi vào file).
  - **Duplex**: Kết hợp cả đọc và ghi.
  - **Transform**: Biến đổi dữ liệu trong quá trình đọc/ghi.

#### So sánh Stream và Buffer

| **Tiêu chí**           | **Buffer**                                           | **Stream**                                                     |
| ---------------------- | ---------------------------------------------------- | -------------------------------------------------------------- |
| **Định nghĩa**         | Một khối bộ nhớ tạm thời chứa dữ liệu nhị phân       | Luồng dữ liệu được xử lý theo từng phần nhỏ                    |
| **Cách sử dụng**       | Lưu trữ toàn bộ dữ liệu trong bộ nhớ trước khi xử lý | Xử lý dữ liệu theo từng phần, không cần tải toàn bộ vào bộ nhớ |
| **Hiệu suất bộ nhớ**   | Tiêu thụ nhiều bộ nhớ với dữ liệu lớn                | Tiết kiệm bộ nhớ, phù hợp với file lớn                         |
| **Trường hợp sử dụng** | Phù hợp với dữ liệu nhỏ, cần xử lý toàn bộ cùng lúc  | Phù hợp với file lớn, dữ liệu truyền qua mạng                  |
| **Ví dụ**              | Đọc toàn bộ nội dung file vào buffer                 | Đọc file lớn từng phần và ghi vào file ZIP                     |

### 2. Làm việc với JSZip trong NestJS

#### Tổng quan về JSZip

- **JSZip** là một thư viện JavaScript thuần, hoạt động tốt cả trong trình duyệt và Node.js. Nó cung cấp API đơn giản để tạo, đọc và chỉnh sửa file ZIP.
- Phù hợp với các ứng dụng cần xử lý file ZIP ở phía client hoặc server với dữ liệu nhỏ gọn.
- Hỗ trợ xử lý dữ liệu dưới dạng buffer hoặc chuỗi, nhưng không tối ưu cho stream lớn.

#### Cách sử dụng JSZip trong NestJS

Dưới đây là cách tích hợp JSZip trong một ứng dụng NestJS để tạo file ZIP từ một mảng chuỗi và trả về dưới dạng buffer.

##### Ví dụ: Tạo file ZIP từ mảng chuỗi

```typescript
import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import * as JSZip from "jszip";

@Controller("zip")
export class ZipController {
  @Get("create")
  async createZip(@Res() res: Response) {
    const zip = new JSZip();
    const stringsArray = ["Hello ", "World.", "\nThis ", "is", " a ", "test."];

    // Thêm file vào ZIP
    zip.file("file.txt", stringsArray.join(""));

    // Tạo buffer từ file ZIP
    const content = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    // Thiết lập header và gửi file ZIP
    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=example.zip",
    });
    res.send(content);
  }
}
```

#### Cách JSZip xử lý Buffer và Stream

- **Buffer**: JSZip thường tạo file ZIP dưới dạng buffer (sử dụng `generateAsync({ type: 'nodebuffer' })`). Toàn bộ nội dung file được tải vào bộ nhớ trước khi nén.
- **Stream**: JSZip hỗ trợ stream thông qua `generateNodeStream`, nhưng không mạnh bằng `archiver`. Stream được tạo ra từ nội dung ZIP đã được nén, phù hợp để gửi trực tiếp đến client hoặc ghi vào file.

#### Ưu điểm và hạn chế của JSZip

- **Ưu điểm**:
  - API đơn giản, dễ sử dụng.
  - Hoạt động tốt trong cả trình duyệt và Node.js.
  - Hỗ trợ nhiều định dạng dữ liệu (chuỗi, buffer, base64).
- **Hạn chế**:
  - Không tối ưu cho file lớn vì toàn bộ dữ liệu được tải vào bộ nhớ.
  - Hỗ trợ stream hạn chế so với `archiver`.

### 3. Làm việc với Archiver trong NestJS

#### Tổng quan về Archiver

- **Archiver** là một thư viện Node.js mạnh mẽ, được thiết kế để tạo file ZIP và TAR, với hỗ trợ stream vượt trội.
- Phù hợp với các ứng dụng server-side cần xử lý file lớn hoặc tạo file ZIP động từ nhiều nguồn (như file từ đĩa hoặc dữ liệu từ cơ sở dữ liệu).

#### Cách sử dụng Archiver trong NestJS

Dưới đây là cách sử dụng `archiver` trong NestJS để tạo file ZIP từ nhiều file và stream trực tiếp đến client.

##### Ví dụ: Tạo file ZIP từ nhiều file

```typescript
import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import * as archiver from "archiver";
import * as fs from "fs";

@Controller("zip")
export class ZipController {
  @Get("create")
  createZip(@Res() res: Response) {
    // Tạo đối tượng archiver
    const archive = archiver("zip", { zlib: { level: 9 } });

    // Thiết lập header
    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=example.zip",
    });

    // Pipe stream từ archiver đến response
    archive.pipe(res);

    // Thêm file từ đĩa
    archive.append(fs.createReadStream("path/to/file1.txt"), {
      name: "file1.txt",
    });
    archive.append("Hello World", { name: "file2.txt" });

    // Kết thúc quá trình nén
    archive.finalize();
  }
}
```

#### Cách Archiver xử lý Buffer và Stream

- **Buffer**: Archiver có thể tạo buffer bằng cách sử dụng `BufferStream` (thay vì ghi trực tiếp vào file hoặc response), nhưng stream là cách tiếp cận chính.
- **Stream**: Archiver được thiết kế để làm việc với stream, cho phép nén và gửi dữ liệu theo từng phần. Điều này giúp giảm tiêu thụ bộ nhớ khi xử lý file lớn.

#### Ưu điểm và hạn chế của Archiver

- **Ưu điểm**:
  - Hỗ trợ stream mạnh mẽ, lý tưởng cho file lớn.
  - Hỗ trợ nhiều định dạng nén (ZIP, TAR).
  - Tích hợp tốt với các luồng đọc/ghi trong Node.js.
- **Hạn chế**:
  - Chỉ hoạt động trong môi trường Node.js, không hỗ trợ trình duyệt.
  - API phức tạp hơn so với JSZip.

### 4. Bảng so sánh JSZip và Archiver

| **Tiêu chí**               | **JSZip**                             | **Archiver**                               |
| -------------------------- | ------------------------------------- | ------------------------------------------ |
| **Môi trường**             | Trình duyệt và Node.js                | Chỉ Node.js                                |
| **Hỗ trợ Stream**          | Hạn chế (qua `generateNodeStream`)    | Xuất sắc (pipe stream trực tiếp)           |
| **Hỗ trợ Buffer**          | Tốt (qua `generateAsync`)             | Hỗ trợ, nhưng ít sử dụng                   |
| **API**                    | Đơn giản, dễ sử dụng                  | Phức tạp hơn, cần hiểu về stream           |
| **Hiệu suất với file lớn** | Không tối ưu (tải toàn bộ vào bộ nhớ) | Tối ưu (xử lý theo luồng)                  |
| **Định dạng hỗ trợ**       | Chỉ ZIP                               | ZIP và TAR                                 |
| **Trường hợp sử dụng**     | Client-side, file nhỏ, ứng dụng web   | Server-side, file lớn, ứng dụng cần stream |
| **Cộng đồng và bảo trì**   | Lớn, được bảo trì tốt                 | Lớn, được bảo trì tốt                      |

### 5. Hướng dẫn tích hợp vào NestJS

#### Cài đặt

```bash
npm install jszip@3.10.1 archiver@7.0.1
```

#### Cấu trúc dự án

- **Controller**: Xử lý yêu cầu HTTP và trả về file ZIP.
- **Service**: Chứa logic xử lý file (tạo ZIP, thêm file, v.v.).
- **Module**: Đăng ký controller và service.

##### Ví dụ: Service xử lý ZIP

```typescript
import { Injectable } from "@nestjs/common";
import * as JSZip from "jszip";
import * as archiver from "archiver";
import { Readable } from "stream";

@Injectable()
export class ZipService {
  async createZipWithJSZip(data: string[]): Promise<Buffer> {
    const zip = new JSZip();
    zip.file("file.txt", data.join(""));
    return await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
    });
  }

  createZipWithArchiver(data: string[]): Readable {
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.append(data.join(""), { name: "file.txt" });
    archive.finalize();
    return archive;
  }
}
```

##### Ví dụ: Controller sử dụng Service

```typescript
import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { ZipService } from "./zip.service";

@Controller("zip")
export class ZipController {
  constructor(private readonly zipService: ZipService) {}

  @Get("jszip")
  async createZipWithJSZip(@Res() res: Response) {
    const data = ["Hello ", "World.", "\nThis ", "is", " a ", "test."];
    const buffer = await this.zipService.createZipWithJSZip(data);
    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=jszip-example.zip",
    });
    res.send(buffer);
  }

  @Get("archiver")
  createZipWithArchiver(@Res() res: Response) {
    const data = ["Hello ", "World.", "\nThis ", "is", " a ", "test."];
    const stream = this.zipService.createZipWithArchiver(data);
    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=archiver-example.zip",
    });
    stream.pipe(res);
  }
}
```

### 6. Kết luận

- **JSZip**: Phù hợp với các ứng dụng cần tạo file ZIP nhỏ gọn hoặc chạy trong trình duyệt. API đơn giản, dễ tích hợp, nhưng không tối ưu cho file lớn.
- **Archiver**: Lý tưởng cho các ứng dụng server-side cần xử lý file lớn hoặc stream dữ liệu. Hỗ trợ stream mạnh mẽ, nhưng yêu cầu hiểu biết về luồng trong Node.js.
- Khi sử dụng trong NestJS, lựa chọn thư viện phụ thuộc vào yêu cầu cụ thể:
  - Dùng **JSZip** nếu bạn cần tích hợp client-side hoặc xử lý file nhỏ.
  - Dùng **Archiver** nếu bạn cần stream file lớn hoặc tích hợp với các nguồn dữ liệu phức tạp.

#### Tài liệu tham khảo

- JSZip: https://stuk.github.io/jszip[](https://github.com/Stuk/jszip)
- Archiver: https://www.npmjs.com/package/archiver[](https://npm-compare.com/adm-zip%2Carchiver%2Cjszip%2Cyazl%2Czip-lib%2Czip-stream)
- NestJS: https://docs.nestjs.com[](https://docs.nestjs.com/techniques/streaming-files)

# Tùy chọn nén Zlib trong Node.js

## Tổng quan

Thư viện `zlib` là thư viện nén dữ liệu gốc của Node.js, được sử dụng bởi các thư viện như `archiver` để tạo file ZIP. Tùy chọn `{ zlib: { level: 9 } }` được truyền vào để kiểm soát mức độ nén (compression level) khi tạo file ZIP hoặc xử lý dữ liệu nén.

## Ý nghĩa của `level` trong Zlib

- **Level** là tham số xác định mức độ nén, với giá trị từ `0` đến `9`.
- Mức độ nén ảnh hưởng đến **tốc độ xử lý** và **kích thước file** sau khi nén.

| **Level** | **Ý nghĩa**           | **Ghi chú**                             |
| --------- | --------------------- | --------------------------------------- |
| 0         | Không nén (store)     | Kích thước lớn nhất, tốc độ nhanh nhất  |
| 1         | Nén rất nhẹ           | Kích thước giảm ít, tốc độ cực nhanh    |
| 6         | Mức mặc định của zlib | Cân bằng giữa tốc độ và hiệu quả nén    |
| 9         | Nén mạnh nhất         | File nhỏ nhất, tốn nhiều CPU, chậm nhất |

## So sánh tốc độ và kích thước

- **Level 1**: Nhanh hơn khoảng **5–10 lần** so với level 9, nhưng kích thước file lớn hơn đáng kể.
- **Level 9**: Tối ưu hóa kích thước file (nhỏ nhất có thể), nhưng tốn nhiều tài nguyên CPU và thời gian xử lý.
- **Level 6**: Là mức mặc định, cung cấp sự cân bằng giữa tốc độ và kích thước file, phù hợp với hầu hết các trường hợp.

## Khi nào chọn mức nén nào?

Tùy thuộc vào yêu cầu cụ thể của ứng dụng, bạn có thể chọn mức nén phù hợp:

| **Trường hợp sử dụng**                        | **Level nên dùng** |
| --------------------------------------------- | ------------------ |
| Tạo file ZIP để người dùng tải nhanh          | 1 đến 5            |
| Lưu trữ file ZIP lâu dài, tối ưu dung lượng   | 7 đến 9            |
| Cân bằng giữa tốc độ và kích thước (mặc định) | 6                  |

## Ví dụ sử dụng với Archiver

Dưới đây là cách sử dụng các mức nén khác nhau với thư viện `archiver` trong Node.js:

```typescript
import * as archiver from "archiver";

// Nén nhanh, file hơi lớn
const archiveFast = archiver("zip", { zlib: { level: 1 } });

// Nén chậm, file nhỏ nhất
const archiveMax = archiver("zip", { zlib: { level: 9 } });

// Cân bằng (mặc định, level 6)
const archiveDefault = archiver("zip");
```

## Kết luận

- **Level 1–5**: Ưu tiên tốc độ, phù hợp cho các ứng dụng cần tạo và gửi file ZIP nhanh chóng, như tải về từ server.
- **Level 7–9**: Ưu tiên kích thước file nhỏ, phù hợp cho lưu trữ lâu dài hoặc khi băng thông hạn chế.
- **Level 6**: Mức mặc định, phù hợp cho hầu hết các trường hợp không có yêu cầu đặc biệt.
- Khi sử dụng trong NestJS hoặc các ứng dụng Node.js, hãy cân nhắc giữa hiệu suất và dung lượng file để chọn mức nén phù hợp.

## Tài liệu tham khảo

- Zlib Node.js: https://nodejs.org/api/zlib.html
- Archiver: https://www.npmjs.com/package/archiver
