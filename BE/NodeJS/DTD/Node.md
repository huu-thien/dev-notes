# Server NodeJS
```js
// Module: ServerNodejs

const http = require('http');
const PORT = 4000;
const server = http.createServer((req, res) => {

  res.setHeader('Content-Type', 'application/json');

  res.end(`{"message": "Hello World"}`);

});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

})
```

hrhr