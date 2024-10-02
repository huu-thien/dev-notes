

let numss: number[] = [0, 1, 2, 2, 3, 0, 4, 2, 7];

const removeElement = (nums: number[], val: number): number => {
    
    const lenght : number = nums.length;
    let index : number = nums.indexOf(val);
    let counter :number = 0;

    while(index > -1) {
        nums.splice(index, 1);
        counter++;
        index = nums.indexOf(val);
    }
    return lenght - counter;
};
console.log(removeElement(numss, 2));
