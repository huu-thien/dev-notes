// Độ phức tạp về thời gian: O(n^2) : xấu nhất, tốt nhất, trung bình

const arr1: number[] = [3, 1, 6, 9, 2, 7];

const SelectionSort = (arr: number[]): number[] => {
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;
    for (let j = i+1; j < arr.length; j++) {
      if (arr[j] > arr[min]) min = j;
    }
    let temp = arr[min];
    arr[min] = arr[i];
    arr[i] = temp;
  }
  return arr;
};
 
console.log(SelectionSort(arr1));

// const customSelectionSort = (arr : number[]): number[] => {

//   for(let i = 0; i < arr.length - 1; i++) {
//     let min = i;
//     for(let j = i + 1; j < arr.length; j++) {
//       if(arr[j] < arr[min]) min = j;
//     }
//     let temp = arr[min];
//     arr[min] = arr[i];
//     arr[i] = temp;
//   }
//   return arr;
// }
// console.log(customSelectionSort(arr1));
