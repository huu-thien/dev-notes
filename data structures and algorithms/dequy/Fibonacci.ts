const Fibonacci = (n: number): number => {
  if (n <= 1) return n;
  return Fibonacci(n - 1) + Fibonacci(n - 2);
};

// console.log(Fibonacci(9));

const Fibonacci2 = (n: number): number => {
    let result : number[] = [];
    result[1] = 1;
    result[2] = 1;
    for(let i = 3; i <= n; i++) {
        result[i] = result[i-1] + result[i-2]
    }
    console.log(result);
    
    return result[n];
}
console.log(Fibonacci2(9));
