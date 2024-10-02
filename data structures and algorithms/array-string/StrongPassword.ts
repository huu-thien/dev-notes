function isStrongPassword(password: string): boolean {
  if (password.length <= 6) {
    return false;
  }

  const hasDigit = /\d/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()-+]/.test(password);

  return hasDigit && hasLowercase && hasUppercase && hasSpecialChar;
}

// Example usage
const password = "Abc123@";
const isStrong = isStrongPassword(password);
console.log(isStrong); // Output: true