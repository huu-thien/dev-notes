function CodelandUsernameValidation(str: string) {
  if (
    /^[A-Za-z]\w+[A-Za-z0-9]$/.test(str) &&
    str.length >= 4 &&
    str.length <= 25
  ) {
    return true;
  }

  return false;
}

console.log(CodelandUsernameValidation("u__hello_world123"));
