// Vi du 1:
//Cho một mảng số nguyên nums, một mảng queries trong đó queries[i] = [x, y] và một số nguyên limit, hãy tạo mảng boolean trả về kết quả của từng truy vấn. Một truy vấn là true nếu tổng của mảng con từ x đến y nhỏ hơn limit, ngược lại là false.

const numsss: number[] = [1, 6, 3, 2, 7, 2];
const queries = [
  [0, 3],
  [2, 5],
  [2, 4],
];
const limit: number = 13;

const MangCongDon = (
  nums: number[],
  queries: number[][],
  limit: number
): boolean[] => {
  let prefix: number[] = [nums[0]];
  for (let i = 1; i < numsss.length; i++) {
    prefix.push(nums[i] + prefix[prefix.length - 1]);
  }
  const result: boolean[] = [];
  for (let query of queries) {
    const sum = prefix[query[1]] - prefix[query[0]] + numsss[query[0]];
    result.push(limit < sum);
  }
  return result;
};

// console.log(MangCongDon(numsss, queries, limit));

// Vi du 2:
//Cho mảng số nguyên nums, có bao nhiêu cách chia mảng thành 2 phần sao cho tổng của phần 1 lớn hơn hoặc bằng tổng của phần 2, sao cho phần 2 có ít nhất 1 phần tử.

const nums4: number[] = [7, 5, 2, -4];

const CountDevideArray = (nums: number[]): number => {
  const prefix: number[] = [nums[0]];
  for (let i = 1; i < nums.length; i++) {
    prefix.push(nums[i] + prefix[prefix.length - 1]);
  }
  let count = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    const leftSum = prefix[i];
    const rightSum = prefix[prefix.length - 1] - leftSum;
    if (leftSum >= rightSum) {
      count += 1;
    }
  }
  return count;
};
// console.log(CountDevideArray(nums4));

//  Ham tinh mnag dong don

const inputt: number[] = [1, 1, 1, 1, 1, 1];
const handlePrefixsum = (numbers: number[]): number[] => {
  const prefix: number[] = [numbers[0]];

  for (let i = 1; i < numbers.length; i++) {
    prefix.push(numbers[i] + prefix[prefix.length - 1]);
  }
  return prefix;
};
// console.log(handlePrefixsum(inputt));

// Tổng bước nhảy
// Yêu cầu
// Cho mảng nums có các phần tử là các số nguyên.
// Giả sử bạn chọn 1 số nguyên dương bất kỳ startValue. Trong mỗi vòng lặp, lần lượt tính tổng của số nguyên dương đó với các số nguyên trong mảng theo thứ tự từ trái sang phải. Kết quả thu được một giá trị là sumArray.
// Hãy tìm số nguyên dương startValue nhỏ nhất để sao cho tổng sumArray không nhỏ hơn 1.

const inputt1: number[] = [1,-2, -3];

// const TongBuocNhay = (numbers: number[]): number => {
//   let sum: number = 0;
//   for (let i = 0; i < numbers.length; i++) {
//     sum += numbers[i];
//   }
//   let k = 1;
//   while (true) {
//     if (sum * k >= 1) {
//       break;
//     }
//     k++;
//   }
//   return k;
// };
// console.log(TongBuocNhay(inputt1));

const Min = (numbers: number[]): number => {
  let min = numbers[0];
  for (let i = 0; i < numbers.length; i++) {
    if (min > numbers[i]) {
      min = numbers[i];
    }
  }
  let k = 1;
  while (true) {
    if (k + min > 1) {
      break;
    }
    k++;
  }
  return k;
};
console.log(Min(inputt1));
