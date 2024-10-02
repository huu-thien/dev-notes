// const chars1: string = "[}]";

// const isInvalidString = (strings: string): boolean => {
//   const stack: string[] = [];
//   const listCharsMatch = new Map<string, string>([
//     ["(", ")"],
//     ["{", "}"],
//     ["[", "]"],
//   ]);

//   for(let i = 0; i < strings.length; i++) {
//     if(listCharsMatch.has(strings[i])) {
//       stack.push(strings[i])
//     } else {
//       if(stack.length === 0) {
//         return false
//       }
//       const top = stack.pop()
//       if(listCharsMatch.get(top!) !== strings[i]) {
//         return false;
//       } else {
//         stack.pop()
//       }
//     }
//   }
//   return stack.length === 0
// };
// console.log(isInvalidString(chars1));



const chars1: string = "[()]{}{[()()]()}";

const isInvalidString = (strings : string) : string => {
  const stack : string[] = [];
  let result : string = ""
  let spe: string =""
  const listCharsMatch = new Map<string,string>([
    ['(', ')'],
    ['[', ']'],
    ['{', '}'],
  ])
  
  for(let i = 0; i < strings.length; i++) {
    
    if(listCharsMatch.has(strings[i])) {
      stack.push(strings[i]);
    } else {
      if(stack.length === 0) {
        return "False" + spe;
      }
      const top = stack[stack.length - 1]
      if(listCharsMatch.get(top) !== strings[i]) {
        return "False" + spe;
      } else{
        stack.pop();
        spe += "!"
      }
      
    }
  }
  
  return stack.length === 0 ? "True" + spe : "False" + spe
}
console.log(isInvalidString(chars1));

