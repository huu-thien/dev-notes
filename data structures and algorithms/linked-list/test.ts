const chars: string = "(){}[{";
const isValidChars = (chars: string): boolean => {
  const array = chars.split("");
  const stack: string[] = [];
  const charsMatch = new Map<string, string>([
    ["(", ")"],
    ["{", "}"],
    ["[", "]"],
  ]);
  for (let i = 0; i < array.length; i++) {
    if (charsMatch.has(array[i])) {
      stack.push(array[i]);
    } else {
      if (stack.length === 0) {
        return false;
      }
      const top = stack.pop();
      if (charsMatch.get(top!) === array[i]) {
        stack.pop();
      }
    }
  }
  // console.log(charsMatch.has('('));

  return stack.length === 0;
};
console.log(isValidChars(chars));
