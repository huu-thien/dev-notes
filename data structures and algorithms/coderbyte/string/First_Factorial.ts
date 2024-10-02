

const FirstFactorial = (num : number) : number => {
    if(num <=1 ) return 1
    return num * FirstFactorial(num-1)
}
console.log(FirstFactorial(8));
