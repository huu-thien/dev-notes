const numberrList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const target1: number = 7;

const BinarySearch = (arr: number[], target: number): number => {
  let left: number = 0;
  let right: number = arr.length - 1;

  while (left <= right) {
    let mid: number = Math.floor((right + left) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
};
console.log(BinarySearch(numberrList, target1));

let a = 6;
console.log(a++ + --a);
// console.log(++a);
