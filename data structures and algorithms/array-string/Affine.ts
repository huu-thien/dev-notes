interface Key {
  a: number;
  b: number;
}
const alphabet: string[] = Array.from({ length: 26 }, (_, index) =>
  String.fromCharCode(65 + index)
);

const Encrypted = (message: string, key: Key): string => {
  let result: string = "";
  for (let char of message.toUpperCase()) {
    if (char === " ") {
      result += " ";
      continue;
    }
    const index: number = (key.a * alphabet.indexOf(char) + key.b) % 26;
    result += alphabet[index];
  }
  return result;
};

// const Decrypted = (message: string, key: Key): void => {
//   for(let char of message.toUpperCase()) {
//     if(char === ' ') continue;
//     let index: number = alphabet.indexOf(char)
//     let x = 
//   }
// }


const testMessage = "It is nice today";
console.log(">>>>> Encode : ",Encrypted(testMessage, { a: 7, b: 3 }));
// console.log(Decrypted("HG HZ QHRF GXYDP", { a: 7, b: 3 }));

