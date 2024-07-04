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

```js
// Module: ServerNodejs with Express

const express = require('express')

const app = express()

const port = 3000

  

app.get('/', (req, res) => {

  res.send('Hello World!')

})

  

app.listen(port, () => {

  console.log(`Example app listening on port ${port}`)

})
```
