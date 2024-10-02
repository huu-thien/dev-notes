const numbers: number[] = [2, 4, 6, 8, 10];

const checkCapSoCong = (arr: number[]): string => {
  for (let i = 0; i < arr.length - 2; i++) {
    if (arr[i] - arr[i + 1] !== arr[i + 1] - arr[i + 2]) {
      return "NO";
    }
  }
  return "YES";
};
console.log(checkCapSoCong(numbers));
