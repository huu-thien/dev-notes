const DaoChuoi1 = (string :string) :string => {
  let array = string.split('')
  let left : number= 0;
  let right : number= array.length - 1;
  while (left <= right) {
    let temp = array[right];
    array[right] = array[left];
    array[left] = temp;
    left++;
    right--;
  }
  return array.join('');
};

const DaoChuoi2 = (strings: string): string => {
  if(strings.length < 2) return strings
  return DaoChuoi1(strings.slice(1)) + strings[0]
}
console.log(DaoChuoi2("abcdef"));
