// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR CALCULATING INTEGER DIVISOR AND REMAINDER
// ---------------------------------------------------------------------------------------------------------------------
export default (dividend, divisor) => {
  let quotient = 0;
  let remainder = 0;
  if (dividend % divisor === 0) {
    quotient = dividend / divisor;
    // keep remainder = 0
  } else {
    quotient = Math.floor(dividend / divisor);
    remainder = dividend % divisor;
  }
  return { quotient, remainder };
};
