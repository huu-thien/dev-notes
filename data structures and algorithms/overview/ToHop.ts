
const giaithua = (n: number) :number => {
    let result = 1;
    for(let i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}
const TinhToHop = (k: number, n: number) : number => {
    let a = giaithua(n)
    let b = giaithua(k)*giaithua(n-k)
    let result = a/b
    return result;
}

console.log(TinhToHop(6, 12));
