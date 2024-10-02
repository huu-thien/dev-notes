const test: number[] = [8, 4, 1, -3, 9, 10, 42, 6, 12];
const n = 3; // Phan tu lon thu 2

const BBSort = (arr: number[], n: number): number => {
  let isSwapped: boolean = false;

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
      isSwapped = true;
    }
    if (!isSwapped) break;
  }

  return arr[arr.length - n];
};
console.log(BBSort(test, n));
