const RemoveZero = (n: number): number => {
  let giaithua = 1;
  for (let i = 1; i <= n; i++) {
    giaithua *= i;
    while (giaithua %10 === 0) {
        giaithua/=10
    }
  } 
  return giaithua%10;
};


console.log(RemoveZero(6));

