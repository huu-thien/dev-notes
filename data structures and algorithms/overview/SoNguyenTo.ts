const checkNguyenTo = (n: number): string => {
  if(n <= 1) return "False"
  for(let i = 2; i <= Math.sqrt(n); i++) {
    if(n % i === 0) return "False"
  }
  return "True"
};
console.log(checkNguyenTo(16));



