const DaoChuoi = (string: string): string => {
  if (string.length < 2) return string;
  return DaoChuoi(string.slice(1)) + string[0];
};



