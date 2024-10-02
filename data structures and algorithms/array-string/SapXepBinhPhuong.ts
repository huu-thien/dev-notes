

const numms: number[] = [-4, -1, 0, 3, 10];

const PowArray = (array: number[]): number[] => {
    const result: number[] = array.map((number) => number*number)
    return result.sort((a,b) => a-b)
};
console.log(PowArray(numms));

