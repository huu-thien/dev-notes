const UocChung = (a: number, b: number, c: number): number => {
  let small = Math.min(a, b);
  let arr: number[] = [];
  for (let i = 1; i <= small; i++) {
    if (a % i === 0 && b % i === 0) {
      arr.push(i);
    }
  }
  console.log(arr);
  if (c > arr.length) {
    return -1;
  }
  const result = arr[c - 1];
  return result;
};
console.log(UocChung(20, 24, 3));
