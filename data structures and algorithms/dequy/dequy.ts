const logMessage = (n: number): void => {
  if (n > 3) return;
  console.log(n);
  logMessage(n + 1);
  console.log("End of call where n = ", n);

  return;
};

const fibonanci = (n: number): number => {
  if (n === 0) return 1;
  else if (n === 1) return 1;
  else return fibonanci(n - 1) + fibonanci(n - 2);
};

console.log(fibonanci(9));

