const array2: number[] = [30,10, 20, 15, 2, 23, 90, 67, 70];

const PhanTuCuctri = (arr: number[]): void => {
  let result: number[] = [];
  if (arr[0] > arr[1]) result.push(0);
  for (let i = 1; i < arr.length - 2; i++) {
    if (arr[i] > arr[i - 1] && arr[i] > arr[i + 1]) {
      result.push(i);
    }
  }
  if (arr[arr.length - 1] > arr[arr.length - 2]) result.push(arr.length - 1);
  console.log(...result);
};

PhanTuCuctri(array2);
