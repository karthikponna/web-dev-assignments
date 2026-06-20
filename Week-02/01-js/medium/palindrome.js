/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isPalindrome(str) {
  let lowerStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  let reversedStr = lowerStr.split('').reverse().join('');

  return lowerStr === reversedStr;
}

module.exports = isPalindrome;
