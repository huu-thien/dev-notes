const s = "tammaek004";

const handleDuplicate = (strings: string): string => {
  const stack :string[] = [strings[0]];

  for(let i = 1; i < strings.length; i++) {
    const top : string = stack[stack.length - 1];
    if(top !== strings[i]) {
        stack.push(strings[i]);
    } else {
        stack.pop()
    }
  }
  return stack.join('')
};
console.log(handleDuplicate(s));

