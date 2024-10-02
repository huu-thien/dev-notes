// Thuật toán chung cho cửa sổ trượt là:
// 1. Xác định một con trỏ cho giới hạn trái và giới hạn phải đại diện cho cửa sổ hiện tại, thường cả hai đều bắt đầu từ 0.
// 2. Lặp lại mảng với giới hạn phải để "thêm" các phần tử vào cửa sổ.
// 3. Lặp cho đến khi nào ràng buộc không được thỏa mãn, nghĩa là trong ví dụ này, nếu tổng của cửa sổ vượt quá k, chúng ta sẽ "xóa" các phần tử trái nhất khỏi cửa sổ bằng cách tăng giới hạn trái cho đến khi điều kiện được thỏa mãn một lần nữa.
// function fn(arr):
//     left = 0
//     for right in [0, arr.length - 1]:
//         Do some logic to "add" element at arr[right] to window
//         while left < right AND condition from problem not met:
//             Do some logic to "remove" element at arr[left] from window
//             left++
//         Do some logic to update the answer

// Ví dụ 1: Cho một mảng số nguyên dương nums và một số nguyên k, tìm độ dài của mảng con dài nhất có tổng nhỏ hơn hoặc bằng k.

const numss: number[] = [3, 1, 2, 7, 4, 2, 1, 1, 5];
const k: number = 8;

const LengthSubArray = (array: number[], k: number): number => {
  let left: number = 0;
  let curr: number = 0;
  let ans: number = 0;

  //   let ans: number[] = [];

  for (let right = 0; right < array.length; right++) {
    curr += array[right];
    while (curr > k) {
      curr -= array[left];
      left++;
      //   ans.shift();
    }
    ans = Math.max(ans, right - left + 1);
    // ans.push(right)
  }
  return ans;
};
// console.log(LengthSubArray(numss, k));

//Ví dụ 3: Tích các phần tử trong mảng con nhỏ hơn K.

// Cho một mảng số nguyên dương nums và một số nguyên k, hãy trả về số lượng mảng con chứa các phần tử được xếp đúng theo thứ tự của mảng gốc trong đó tích của tất cả các phần tử trong mảng con nhỏ hơn k.

// Ví dụ: với nums = [10, 5, 2, 6], k = 100, câu trả lời là 8. Các mảng con có tích nhỏ hơn k là:
// [10], [5], [2], [6], [10, 5], [5, 2], [2, 6], [5, 2, 6]
const input1: number[] = [1, 6, 4, 5, 2];
const k2: number = 45;

const CountSubArray = (array: number[], k: number): number => {
  if (k <= 1) return 0;
  let left = 0;
  let curr = 1;
  let ans = 0;
  for (let right = 0; right < array.length; right++) {
    curr *= array[right];
    if (curr >= k) {
      curr /= array[left];
      left++;
    }
    ans += right - left + 1;
  }
  return ans;
};

// Kích thước cửa sổ cố định
//Ví dụ 4: Cho mảng số nguyên nums và số nguyên k, tìm tổng của mảng con có tổng lớn nhất có độ dài là k.

const MaxSumSubArray = (array: number[], k: number): number => {
  let curr = 0;
  for (let i = 0; i < k; i++) {
    curr += array[i];
  }
  let ans = curr;
  for (let i = k; i < array.length; i++) {
    curr += array[i] - array[i - k];
    ans = Math.max(ans, curr);
  }
  return ans;
};

// Chuỗi con có trung bình lớn nhất
const input11: number[] = [1, 12, -5, -6, 50, 3];
const k1: number = 4;

const TrungBinhChuoiCon = (array: number[], k: number): number => {
  let sum = 0;
  for (let i = 0; i < k; i++) {
    sum += array[i];
  }
  let ans: number = sum / k;
  for (let i = k; i < array.length; i++) {
    sum += array[i] - array[i - k];
    ans = Math.max(sum / k, ans);
  }
  return ans;
};
// console.log(TrungBinhChuoiCon(input11, k1));

// Chuỗi số 1 dài nhất: Cho mảng nhị phân nums và cho số nguyên k.
// Bạn hãy tìm mảng con có độ dài lớn nhất mà chỉ chứa các bit số 1 sau khi thực hiện tối đa k lần lật các bit số 0 thành bit số 1 trong mảng con đó. Đầu ra hiển thị độ dài của mảng con thoả mãn.

const mess: string = "0011001110110001111";
const k3: number = 3;

const StringMaxLength = (strings: string, k: number): number => {
  let left: number = 0;
  let count_0: number = 0;
  let maxLength: number = 0;

  for (let right = 0; right < strings.length; right++) {
    if (strings[right] === "0") {
      count_0 += 1;
    }
    if (count_0 > k) {
      if (strings[left] === "0") {
        count_0 -= 1;
      }
      left++;
    }
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
};
console.log(StringMaxLength(mess, k3));

