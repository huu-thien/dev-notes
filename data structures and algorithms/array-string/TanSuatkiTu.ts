const CountCharacters = (input: string): void => {
  const listChars = new Map<string, number>();
  for (let char of input) {
    if (!listChars.has(char)) {
      listChars.set(char, 1);
    } else {
      listChars.set(char, listChars.get(char)! + 1);
    }
  }
  for (let [char, count] of listChars) {
    console.log(`${char} : ${count}`);
  }
};

CountCharacters("12312asfsdf");
