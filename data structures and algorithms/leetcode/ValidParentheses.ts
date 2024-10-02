
const Parentheses :string = "(])"

const isValid = (strings: string) : boolean => {
    const stack : string[] = []
    const listParentheses = new Map<string, string>([
        ['(', ')'],
        ['{', '}'],
        ['[', ']'],

    ])
    let i = 0
    while(i < strings.length) {
        if(listParentheses.has(strings[i])) {
            stack.push(strings[i])
        } else {
            if(stack.length === 0) return false
            const top = stack[stack.length - 1]
            if(strings[i] === listParentheses.get(top)) {
                stack.pop()
            } else {
                return false
            }
        }
        i++;
    }
    return stack.length === 0
}
console.log(isValid(Parentheses));
