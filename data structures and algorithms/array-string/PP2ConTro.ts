// Phuong phap con tro

const IsPalindrome = (message: string): boolean => {
  let left: number = 0;
  let right: number = message.length - 1;
  while (left < right) {
    if (message[left] !== message[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
};
// console.log(IsPalindrome("abcdcba"));

//Ví dụ 2: Cho một mảng đã sắp xếp chỉ gồm các số nguyên khác nhau và một số nguyên mục tiêu, trả về true nếu tồn tại một cặp số có tổng bằng số nguyên mục tiêu, ngược lại trả về false.
const nums = [1, 2, 4, 6, 8, 9, 14, 15];
const checkFotarget = (array: number[], target: number): number[] => {
  let left: number = 0;
  let right: number = array.length - 1;
  while (array[left] + array[right] !== target) {
    if (array[left] + array[right] > target) {
      right--;
    }
    if (array[left] + array[right] < target) {
      left++;
    }
  }
  return [left, right];
};
// console.log(checkFotarget(nums, 24))

// Ví dụ 3: Cho hai mảng số nguyên đã sắp xếp, trả về một mảng kết hợp cả hai mảng và cũng được sắp xếp.

const numbers1: number[] = [1, 3, 6, 8, 10];
const numbers2: number[] = [2, 4, 5];

const SortTwoArray = (array1: number[], array2: number[]): number[] => {
  
  let result : number[] = [];
  let i = 0; // array1
  let j = 0; // array2

  while (i < array1.length && j < array2.length) {
    if(array1[i] <= array2[j]) {
      result.push(array1[i])
      i++;
    } else {
      result.push(array2[j])
      j++;
    }
  }
  while(i < array1.length) {
    result.push(array1[i])
    i++
  }
  while(j < array2.length) {
    result.push(array2[j])
    j++
  }
  return result
};
//console.log(SortTwoArray(numbers1, numbers2));

//Ví dụ 4: Kiểm tra dãy con.
// (ví dụ: "ace" là một dãy con của "abcde" trong khi "aec" thì không phải).

const CheckSubString = (sub : string, strings: string) : boolean => {
  let i = 0;
  let j = 0;
  while(i < sub.length && j < strings.length) {
    if(sub[i] === strings[j]) {
      i++
    }
    j++
  }
  return i === sub.length
}
console.log(CheckSubString('acv', 'haqhcnv'));
