const Inputt = [100, 4, 200, 1, 3, 2];
// function longestConsecutive(nums: number[]): number {
//     if(nums.length === 0) return 0

// };
function FirstReverse(str: number[]) {
  let left = 0;
  let right = str.length - 1;

  while (left <= right) {
    let temp = str[left];
    str[left] = str[right];
    str[right] = temp;
    left++;
    right--;
  }

  return str;
}
console.log(FirstReverse(Inputt));
