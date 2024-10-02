

const word : string = "    day"

const lengthOfLastWord = (strings: string) => {
    const newString : string = strings.trim();
    if(newString.length <=1) return newString.length
    let result : number = 0;
    let noSpace = 0;
    for(let i = newString.length - 1; i>=0 ; i--) {
        if(newString[i] === ' ') {
            result = newString.length - 1 -i
            break
        } else {
            noSpace++;
        }
    }
    return result === 0 ? noSpace : result
}
console.log(lengthOfLastWord(word));
