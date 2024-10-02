// const Input = ["1, 3, 9, 10, 17, 18", "1, 4, 9, 10"];

// function FindIntersection(strArr: string[]) {
//   const result: string[] = [];
//   const arr1 = strArr[0].split(", ");
//   const arr2 = strArr[1].split(", ");
 
//   for(let i = 0; i< arr1.length; i++) {
//     for(let j = 0; j < arr2.length; j++) {
//       if(arr1[i] === arr2[j]) {
//         result.push(arr1[i])
//       }
//     }
//   }
//   return result.join(', ');
// }

// console.log(FindIntersection(Input));

function intersection(nums1: number[], nums2: number[]): number[] {

    const result: number[] = [];
    for(let i = 0; i < nums1.length; i++) {
      for(let j = 0; j < nums2.length; j++) {
        if(nums1[i] === nums2[j]) {
          if(!result.includes(nums1[i])) {
            result.push(nums1[i]);
          }
        }
      }
    }
    return result;
};
const nums1 = [4,9,5], nums2 = [9,4,9,8,4]
console.log(intersection(nums1, nums2));
