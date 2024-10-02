const isNarcissisticNumber = (number: number): boolean => {
  // Biến số thành chuỗi vaf tách thành 1 mảng kí tự số
  let digits: string[] = number.toString().split("");
  // Tính độ dài của mảng
  const lenght: number = digits.length;
  // tính tổng lỹ thừa của từng kí tự số mũ length
  const sum: number = digits.reduce((acc: number, digit: string) => {
    return acc + Math.pow(Number(digit), lenght);
  }, 0);
  // nếu sum = num -> return true
  return sum === number;
};

const CheckArrayNarcissistic = (arr: number[]): boolean => {
  let result = true;
  for (let num of arr) {
    if (!isNarcissisticNumber(num)) result = false;
  }
  return result;
};

const array: number[] = [153, 370, 371, 407];
console.log(CheckArrayNarcissistic(array));
