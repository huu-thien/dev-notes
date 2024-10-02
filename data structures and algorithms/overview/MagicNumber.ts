const primeFactors = (n: number): number => {
  let sum = 0;
  while (n % 2 === 0) {
    sum += 2;
    n = n / 2;
  }
  for (let i = 3; i <= Math.sqrt(n); i = i + 2) {
    while (n % i === 0) {
      sum += i;
      n = n / i;
    }
  }
  if (n > 2) sum += n;
  return sum;
};

const factorSum = (n: number): number => {
  while (n !== primeFactors(n)) {
    n = primeFactors(n);
  }
  return n;
};

console.log(factorSum(315));
