


const listNumber : number[] = [1, 2, 3, 4, 5]

const reverseList = (list : number[]): number[] => {
    const result :number[] = [];
    
    for(let value of list) {
        result.unshift(value)
    }
    return result
}

console.log(reverseList(listNumber));
