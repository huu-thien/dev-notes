//Độ phức tạp của trường hợp xấu nhất: O(n^2) Nếu chúng ta muốn sắp xếp theo thứ tự tăng dần và mảng theo thứ tự giảm dần thì trường hợp xấu nhất sẽ xảy ra.
//Độ phức tạp của trường hợp tốt nhất: O(n) . Nếu mảng đã được sắp xếp, thì không cần sắp xếp.

//Độ phức tạp của trường hợp trung bình: O(n^2).  Nó xảy ra khi các phần tử của mảng có thứ tự lộn xộn (không tăng dần cũng không giảm dần).
const arr: number[] = [2, 5, 7, 9, 1, 4];

const BubbleSort = (arr: number[]): number[] => {
  let swapped = false;
  for (let step = 0; step < arr.length - 1; step++) {
    for (let i = 0; i < arr.length - step - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        let temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
      }
    }
    if (!swapped) {
      break;
    }
  }
  return arr;
};
console.log(BubbleSort(arr));

