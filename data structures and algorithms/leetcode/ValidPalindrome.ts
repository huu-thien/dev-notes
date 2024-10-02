const isPalindrome = (strings: string) => {
  let check: boolean = true;
  const pattern = /[^a-zA-Z0-9]/g;
  let replacedText = strings.replace(pattern, "");
  replacedText = replacedText.toLowerCase();
  for (let index = 0; index < replacedText.length / 2; index++) {
    if (replacedText[index] !== replacedText[replacedText.length - 1 - index]) {
      check = false;
      break;
    }
  }
  return check;
};
isPalindrome("A man, a plan, a canal: Panama");
