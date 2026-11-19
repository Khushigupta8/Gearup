/** £1,234 or £1,234.56 */
export function gbp(value: number, decimals = 0): string {
  return `£${value.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

/** Monthly repayment at 19.9% APR representative. */
export function monthlyPayment(amount: number, months: number, apr = 0.199): number {
  const rate = Math.pow(1 + apr, 1 / 12) - 1;
  return (amount * rate) / (1 - Math.pow(1 + rate, -months));
}
