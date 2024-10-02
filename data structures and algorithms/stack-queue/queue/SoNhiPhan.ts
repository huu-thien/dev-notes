const decialToBinary = (n: number): number => {
  let binary: string = "";

  while (n > 0) {
    binary = (n % 2) + binary;
    n = Math.floor(n / 2);
  }
  return Number(binary);
};

const BinaryToN = (n: number): number[] => {
  const result: number[] = [];
  for (let i = 1; i < n; i++) {
    result.push(decialToBinary(i));
  }
  return result;
};
console.log(BinaryToN(6));
