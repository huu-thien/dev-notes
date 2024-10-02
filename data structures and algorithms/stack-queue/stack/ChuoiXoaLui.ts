

const t1: string = "s#tea#k";
const t2: string = "tepo##k";

const ChuoiXoaLui = (strings: string): string => {
  const stack: string[] = [];
  if(strings.length === 0) return strings;

  for(let i= 0; i < strings.length; i++) {
    if(strings[i] === '#' && stack.length ===0) continue
    if(strings[i] === '#') {
        stack.pop()
    } else {
        stack.push(strings[i])
    }
  }
  return stack.join('')
};
console.log(ChuoiXoaLui(t1) === ChuoiXoaLui(t2));
