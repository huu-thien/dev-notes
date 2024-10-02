const SoMuTuNhien = (n: number, k: number): number => {
  if (n === 0) return 0;
  if (k === 0) return 1;
  return n * SoMuTuNhien(n, k - 1);
};

console.log(SoMuTuNhien(5, 2));
