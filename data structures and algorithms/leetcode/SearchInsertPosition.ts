

const input : number[] =  [1,3,5,6]
const targe : number = 7

const searchInsert = (nums: number[], target: number) :number =>{
    if(nums.length === 0) return 0;
    for(let i = 0; i < nums.length; i++) {
        if(nums[i] >= target) {
            return i
        } 
    }
    return nums.length
}
console.log(searchInsert(input, targe));
