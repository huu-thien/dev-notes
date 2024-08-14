

// Tạo một Buffer từ một chuỗi
const buf1 = Buffer.from('Hello, World!', 'utf8');

// Tạo một Buffer với kích thước cố định
const buf2 = Buffer.alloc(10); // Buffer với 10 byte

// Tạo một Buffer với kích thước cố định và khởi tạo bằng giá trị tùy ý
const buf3 = Buffer.allocUnsafe(10); // Buffer với 10 byte, không khởi tạo

// Ghi dữ liệu vào Buffer
const buf = Buffer.alloc(256)
const len = buf.write('Hello, World!', 'utf8')
console.log(`Octets written: ${len}`);

// Đọc dữ liệu từ Buffer
const bufA = Buffer.from('Hello, World!', 'utf8');
console.log(bufA.toString('utf8')); // In ra 'Hello, World!'
console.log(bufA.toString('hex')); // In ra chuỗi hex của buffer: 48656c6c6f2c20576f726c6421
console.log(bufA.toString('base64')); // In ra chuỗi base64 của buffer: SGVsbG8sIFdvcmxkIQ==

// So sánh Buffers
const bufB = Buffer.from('ABC');
const bufC = Buffer.from('ABD');
const result = bufB.compare(bufC);

if (result < 0) {
  console.log(`${bufB} comes before ${bufC}`);
} else if (result === 0) {
  console.log(`${bufB} is the same as ${bufC}`);
} else {
  console.log(`${bufB} comes after ${bufC}`);
}

// Cắt Buffer
const bufD = Buffer.from('Hello, World!', 'utf8');
const slicedBuf = bufD.slice(0, 5);
console.log(slicedBuf.toString()); // In ra 'Hello'

// Copy Buffer
const bufI = Buffer.from('Hello, World!', 'utf8');
const bufK = Buffer.alloc(5);
bufI.copy(bufK, 0, 0, 5);
console.log(bufK.toString()); // In ra 'Hello'
