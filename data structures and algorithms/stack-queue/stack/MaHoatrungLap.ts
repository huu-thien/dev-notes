

const exp :string = 'aaabbbaaaacca'

const EncodeDuplicate = (strings :string) => {
    if (strings.length === 0) return "Not valid";
    let result = "";
    let count = 1;

    for (let i = 1; i <= strings.length; i++) {
      if (i === strings.length || strings[i] !== strings[i - 1]) {
        result += strings[i - 1] + count;
        count = 1;
      } else {
        count++;
      }
    }
  
    return result;
  };
  
console.log(EncodeDuplicate(exp));
