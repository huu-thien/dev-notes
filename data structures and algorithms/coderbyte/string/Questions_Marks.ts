const QuestionsMarks = (str: string) => {
  const arr: string[] = [];
  for (let i = 0; i < str.length; i++) {
    if (!(str.charCodeAt(i) >= 97 && str.charCodeAt(i) <= 122)) {
      arr.push(str[i]);
    }
  }

  let left = 0;
  let right = left + 4;
  while (right < arr.length) {
    if (
      arr[left] !== "?" &&
      arr[right] !== "?" &&
      Number(arr[left]) + Number(arr[right]) === 10
    ) {
      if (
        arr[left + 1] === "?" &&
        arr[left + 2] === "?" &&
        arr[left + 3] === "?"
      ) {
        return true;
      }
    } else {
      left++;
      right++;
    }
  }
  return false;
};

console.log(QuestionsMarks("arrb6???4xxbl5???eee5"));
