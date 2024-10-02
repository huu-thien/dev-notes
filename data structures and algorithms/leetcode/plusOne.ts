


const digit: number[] = [6,1,4,5,3,9,0,1,9,5,1,8,6,7,0,5,5,4,3]

const plusOne = (digits: number[]) => {
  let number: bigint = BigInt(digits.join(""));
  number = number + BigInt(1);
  return number.toString().split("");
};

console.log(plusOne(digit));

// console.log(6145390195186705543+1);
