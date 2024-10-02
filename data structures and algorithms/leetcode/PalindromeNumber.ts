

const isPalindrome = ( x: number) : boolean => {
    if(x < 0) return false
    const list = x.toString().split('')
    let left = 0;
    let right = list.length - 1;
    while(left <= right) {
        let temp = list[left]
        list[left] = list[right]
        list[right] = temp;
        left++;
        right--;
    }
    if(Number(list.join('')) === x) return true;
    return false;
}

console.log(isPalindrome(12343215));
