const array1: number[] = [1, 2, 4, 3, -2];

const CheckDayDonDieu = (arr: number[]): boolean => {
  let min = Math.min(arr[0], arr[1]);
  let result: boolean = true;
  switch (min) {
    case arr[0]:
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i + 1] - arr[i] <= 0) {
          result = false;
          break;
        }
      }
      break;
    case arr[1]:
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i + 1] - arr[i] >= 0) {
          result = false;
          break;
        }
      }
      break;
  }
  return result;
};
console.log(CheckDayDonDieu(array1));
