const nums1 = [1, 2, 3, 4, 0, 0, 0],
  m = 3,
  nums2 = [2, 5, 6],
  n = 3;

const merge = (nums1: number[], m: number, nums2: number[], n: number) => {
  const arr1 :number[] = nums1.slice(0,m)
  const arr2 :number[] = nums2.slice(0, n)

  const arrMerge = arr1.concat(arr2)
  arrMerge.sort((a,b) => a-b)
 // Conclusion: sorted.length will always be equal to nums1.length based on requirements
 nums1.forEach((num, index) => {
    nums1[index] = arrMerge[index]
 })
};

console.log(merge(nums1, m, nums2, n));
