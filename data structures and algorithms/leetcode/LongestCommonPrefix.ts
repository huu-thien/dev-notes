const innpuut: string[] =["ab", "a"]
const longestCommonPrefix = (input: string[]) : string => {
  if (input.length <=1) return input.join('')
  let minItem = input[0];
  for (let i = 1; i < input.length; i++) {
    if (input[i].length < minItem.length) minItem = input[i];
  }
  if (minItem.length === 0) return "";
  for (let i = 0; i < minItem.length; i++) {
    const char = minItem[i];

    for (const str of input) {
      if (str[i] !== char) {
        return minItem.slice(0, i);
      }
    }
  }
  return minItem
};

console.log(longestCommonPrefix(innpuut));
