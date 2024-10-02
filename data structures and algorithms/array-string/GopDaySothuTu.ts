const number1: number[] = [1, 3, 5, 8, 12];
const number2: number[] = [2, 4, 6, 8];

const GopDaySo = (array1: number[], array2: number[]): number[] => {
  let i: number = 0;
  let j: number = 0;
  let result: number[] = [];

  while (i < array1.length && j < array2.length) {
    if (array1[i] <= array2[j]) {
      result.push(array1[i]);
      i++;
    } else {
      result.push(array2[j]);
      j++;
    }
  }
  while (i < array1.length) {
    result.push(array1[i]);
    i++;
  }
  while (j < array2.length) {
    result.push(array2[j]);
    j++;
  }
  return result;
};

console.log(GopDaySo(number1, number2));

