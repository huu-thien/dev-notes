const path: string = "/home/foo/";

const handlePath = (path: string): string => {
  const stack: string[] = [path[0]];
  for (let i = 1; i < path.length; i++) {
    const top: string = stack[stack.length - 1];
    if (top === "/" && (path[i] === "/" || path[i] == ".")) {
      continue;
    } else {
      stack.push(path[i]);
    }
  }
  if (stack[stack.length - 1] === "/") {
    stack.pop();
  }
  return stack.join("");
};
console.log(handlePath(path));
