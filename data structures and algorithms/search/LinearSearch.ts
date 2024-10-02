const listNmus: number[] = [1, 2, 3, 4, 5];
const target = 6;

const LinearSearch = (list: number[], k: number): number => {
  for (let i = 0; i < list.length; i++) {
    if (list[i] === k) return i;
  }
  return -1;
};

console.log(LinearSearch(listNmus, target));
