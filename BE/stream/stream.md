# 💡 Hướng dẫn sử dụng Stream trong NestJS với `ibm-cos-sdk`, `JSZip`

## I. Stream là gì?

**Stream** là kỹ thuật xử lý dữ liệu theo luồng (từng phần nhỏ), không cần tải toàn bộ dữ liệu vào RAM. Điều này cực kỳ hữu ích khi:

- Upload / Download file lớn  
- Nén hoặc giải nén file  
- Truyền dữ liệu qua mạng ổn định

### 📌 Các loại Stream:

- **Readable Stream** – Đọc dữ liệu (ví dụ: đọc từ COS, file…)  
- **Writable Stream** – Ghi dữ liệu (ví dụ: ghi ra file, upload…)

---

## II. Các tình huống sử dụng phổ biến

### ✅ 1. Upload file lên IBM COS bằng stream

```typescript
@Post('upload')  
@UseInterceptors(FileInterceptor('file'))  
async uploadFile(  
  @UploadedFile() file: Express.Multer.File,  
) {  
  const stream = Readable.from(file.buffer);  
  const uploadParams = {  
    Bucket: 'bucket-name',  
    Key: file.originalname,  
    Body: stream,  
    ContentType: file.mimetype,  
  };

  const result = await this.cosClient.upload(uploadParams).promise();  
  return result;  
}
```


> 📌 Ghi chú: `this.cosClient` là instance từ `new COS.S3({ ... })`.

---

### ✅ 2. Download file từ IBM COS rồi stream về client

```typescript
@Get('download/:filename')  
async download(@Res() res: Response, @Param('filename') filename: string) {  
  const params = {  
    Bucket: 'bucket-name',  
    Key: filename,  
  };

  const stream = this.cosClient.getObject(params).createReadStream();

  res.set({  
    'Content-Disposition': `attachment; filename="${filename}"`,  
    'Content-Type': 'application/octet-stream',  
  });

  stream.pipe(res);  
}

```

---

### ✅ 3. Nén nhiều file thành một file ZIP với `JSZip`

```typescript
import * as JSZip from 'jszip';

@Get('download-zip')  
async downloadZip(@Res() res: Response) {  
  const zip = new JSZip();  
  const files = ['file1.txt', 'file2.jpg'];

  for (const filename of files) {  
    const params = { Bucket: 'bucket-name', Key: filename };  
    const fileStream = this.cosClient.getObject(params).createReadStream();

    zip.file(filename, fileStream);  
  }

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

  res.set({  
    'Content-Type': 'application/zip',  
    'Content-Disposition': 'attachment; filename="files.zip"',  
  });

  res.send(zipBuffer);  
}

```


---

## III. Tổng hợp kiến thức quan trọng

| Tình huống             | Loại stream         | Ghi chú                                |  
|------------------------|---------------------|----------------------------------------|  
| Upload lên cloud       | `Readable` stream   | Dùng `Readable.from(file.buffer)`      |  
| Download từ cloud      | `Readable` stream   | Dùng `getObject().createReadStream()`  |  
| Nén nhiều file         | `Readable` stream   | Nén bằng `JSZip`, mỗi file là 1 stream |  
| Ghi file ra ổ đĩa      | `Writable` stream   | Dùng `fs.createWriteStream()`          |

---

## IV. Lưu ý và lỗi thường gặp

- ❌ Không bắt sự kiện `.on('error')` trên stream → dễ crash app  
- ❌ Gọi `zip.generateAsync(...)` mà không `await` → tạo ZIP lỗi  
- ❌ Không thiết lập header đúng → file trả về bị lỗi tên/loại MIME  
- ✅ Giới hạn số lượng file khi nén ZIP để tránh quá tải bộ nhớ

---

## 🔄 Tài nguyên tham khảo

- [📦 IBM COS SDK for Node.js]([https://www.npmjs.com/package/ibm-cos-sdk)](https://www.npmjs.com/package/ibm-cos-sdk\) "https://www.npmjs.com/package/ibm-cos-sdk)")  
- [📚 JSZip GitHub]([https://github.com/Stuk/jszip)](https://github.com/Stuk/jszip\) "https://github.com/stuk/jszip)")  
- [📘 NestJS - File Upload]([https://docs.nestjs.com/techniques/file-upload)](https://docs.nestjs.com/techniques/file-upload\) "https://docs.nestjs.com/techniques/file-upload)")