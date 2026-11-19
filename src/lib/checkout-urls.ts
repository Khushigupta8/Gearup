/** After payment we land on the account with ?clear=1, which empties the browser basket (see ClearBasket). */
export const basketClearUrl = (path: string) => `${path}${path.includes('?') ? '&' : '?'}clear=1`;
