const test = "HelloAnhThienDepTrai";

const TachTu = (message: string) : string => {
  let result: string = message[0];
  for(let i = 1; i < message.length; i++) {
    if(message.charCodeAt(i) >= 65 && message.charCodeAt(i) <=90) {
      result = result + ' ' + message[i].toLowerCase();
    } else {
      result += message[i]
    }
  }
  return result;
}
console.log(TachTu(test));

