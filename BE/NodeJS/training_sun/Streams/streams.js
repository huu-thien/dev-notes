const fs = require('fs');
const {Transform} = require('stream');

// Readable stream

// Tạo một readable stream từ tệp
const readableStream = fs.createReadStream('example.txt', 'utf8');
readableStream.on('data', (chunk) => {
  console.log('new chunk received: ' + chunk);
})
readableStream.on('end', () => {
  console.log('No more data to read');
});

// Writable Streams
const writeableStream = fs.createWriteStream('output.txt', 'utf8');
// writeableStream.write('Hello, world \n')
// writeableStream.write('Writing some one data \n')
// writeableStream.write('End of the stream')

// Piping Streams
readableStream.pipe(writeableStream) // Khi luồng đọc nhận được dữ liệu từ tệp example.txt, dữ liệu đó sẽ được chuyển trực tiếp vào luồng ghi và sau đó được ghi vào tệp output.txt.

// Transform Streams

// Tạo một transform stream để chuyển đổi văn bản thành chữ hoa
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase())
    callback()
  }
})
// tạo 1 readable stream và 1 writeable stream
const readableStream1 = fs.createReadStream('example1.txt')
const writableStream1 = fs.createWriteStream('output1.txt')

// Kết nối các streams với nhau
readableStream1.pipe(upperCaseTransform).pipe(writableStream1)
