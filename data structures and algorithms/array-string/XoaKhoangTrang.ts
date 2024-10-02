const input: string = " abc   a aa  a a "

const DeleteSpace = (message: string): string => {
  message = message.trim();
  const wordsList: string[] = message.split(" ");
  console.log(wordsList);
  const wordNotSpace: string[] = wordsList.filter((word) => word !== "");
  const result: string = wordNotSpace.join(" ");
  return result;
};

console.log(DeleteSpace(input));
