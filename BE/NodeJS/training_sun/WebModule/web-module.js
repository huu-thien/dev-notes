
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end("Hello nodeJS")
})

server.listen(8080, () => {
  console.log('Server run on http://localhost:8080');
})
console.log("\n");

const myUrl = new URL('https://example.com:8000/path/name?query=string#hash')
console.log("myUrl.hostname: ", myUrl.hostname);
console.log("myUrl.port: ", myUrl.port);
console.log("myUrl.pathname: ", myUrl.pathname);
console.log("myUrl.search: ", myUrl.search);
console.log("myUrl.hash: ", myUrl.hash);

console.log("\n");

const newUrl = new URL('/path/name', 'https://example.com')
newUrl.searchParams.append('query', 'string')
newUrl.hash = 'hash'

console.log("newUrl: ", newUrl.href);
