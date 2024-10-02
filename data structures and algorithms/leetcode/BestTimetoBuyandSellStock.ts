const prices: number[] =  [2,4,1]

const maxProfit = (prices: number[]) => {
  let min = prices[0]
  let max = 0;

  for(let i = 0; i < prices.length; i++) {
    min = Math.min(min, prices[i])
    max = Math.max(max, prices[i] - min)
  }
  return max
};
console.log(maxProfit(prices));

