setTimeout(() => {
  console.log('1');
})

new Promise((resolve, reject) => {
  console.log('2');
  resolve('3')
}).then((val) => console.log(val))

console.log('4');
// Output: 4 2 3 1

// =================================================================================
const bar = () => console.log('bar');
const baz = () => console.log('baz');

const foo = () => {
  console.log('foo');
  setTimeout(bar, 0);
  baz();
}

foo()

// Output: foo baz bar
