const temperatures: number[] = [26, 15, 17, 13, 30, 37];

const DailyTemperature = (temperatures: number[]): number[] => {
  const stack: number[] = [];
  const answer: number[] = [];
  for (let i = 0; i < temperatures.length; i++) {
    answer.push(0);
  }
  for (let i = 0; i < temperatures.length; i++) {
    while (
      stack.length !== 0 &&
      temperatures[stack[stack.length - 1]] < temperatures[i]
    ) {
      let top = stack[stack.length - 1];
      answer[top] = i - top;
      stack.pop();
    }
    stack.push(i);
  }
  return answer;
};

console.log(DailyTemperature(temperatures));
