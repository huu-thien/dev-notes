const BinarySearch1 = (array: number[], target: number): number => {
  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (array[mid] === target) return mid;
    else if (array[mid] > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return -1;
};
console.log(BinarySearch1([1, 2, 3, 5, 7, 9], 7));
