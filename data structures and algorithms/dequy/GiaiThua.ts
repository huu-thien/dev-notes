
const GiaiThua = (n: number) :number => {
    if(n === 0 || n === 1) return 1
    return n * GiaiThua(n-1)
}
// console.log(GiaiThua(4));

const GiaiThua2 = (n: number) :number => {
    let result = 1;
    for(let i = 1; i <=n ;i++) {
        result *= i;
    }
    return result
}
console.log(GiaiThua2(7));

