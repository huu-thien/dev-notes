// Blocking code
const fs = require('fs');
const data = fs.readFileSync('example.txt')
console.log(data.toString());
console.log("End");
// Output: Thiện học nodejs End


// Non-blocking code
fs.readFile('example.txt', 'utf8', (err, data) => {
  if(err) return console.error(err);
  console.log(data.toString());
})
console.log('End');
// Output: End Thiện học nodejs 


//Handling errors in callback
const calculateSquare = (number, callback) => {
  setTimeout(() => {
    if(typeof number !== 'number') {
      callback(new Error('Argument must be a number'));
      return 
    }
    const result = number * number
    callback(null, result);
  }, 1000)
}

const callback = (err, result) => {
  if(err !== null) {
    console.log('Caught error: ' + String(err));
    return
  }
  console.log(result);
}

calculateSquare('2', callback)
// Output:  Caught error: Error: Argument must be a number
