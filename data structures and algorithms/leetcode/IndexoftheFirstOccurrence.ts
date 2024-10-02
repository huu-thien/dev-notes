
const haystack :string = "sadbutsad" //9
const needle : string= "sad" //3

const strStr = (haystack: string, needle: string) : number => {
    return haystack.indexOf(needle)
}
console.log(strStr(haystack, needle));
