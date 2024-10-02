// //  Độ phức tạp về thời gian: O(n*log n)
// // Độ phức tạp không gian của sắp xếp hợp nhất là O(n)
const numLists: number[] = [3, 6, -1, 8, 2, 4, 9, -4, 11];

const merge = (arr_left: number[], arr_right: number[]): number[] => {
  let i = 0;
  let j = 0;
  const result: number[] = [];

  while (i < arr_left.length && j < arr_right.length) {
    if (arr_left[i] < arr_right[j]) {
      result.push(arr_left[i]);
      i++;
    } else {
      result.push(arr_right[j]);
      j++;
    }
  }
  while (i < arr_left.length) {
    result.push(arr_left[i]);
    i++;
  }
  while (j < arr_right.length) {
    result.push(arr_right[j]);
    j++;
  }
  return result;
};

const MergeSort = (arr: number[]): number[] => {
  if (arr.length <= 1) {
    return arr;
  }
  const middle = Math.floor(arr.length / 2);
  const arr_left: number[] = arr.slice(0, middle);
  const arr_right: number[] = arr.slice(middle);

  return merge(MergeSort(arr_left), MergeSort(arr_right));
};

console.log(MergeSort(numLists));


