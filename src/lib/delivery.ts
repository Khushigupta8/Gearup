/**
 * Placeholder delivery price: a stable fake distance from the postcode, £1.20 a mile, £49 minimum.
 * Replace with a real road-distance lookup on the server.
 */
export function demoDeliveryQuote(postcode: string): { miles: number; price: number } {
  const pc = postcode.trim().toUpperCase();
  let h = 0;
  for (let i = 0; i < pc.length; i++) h = (h * 31 + pc.charCodeAt(i)) % 997;
  const miles = 25 + (h % 260);
  return { miles, price: Math.max(49, Math.round(miles * 1.2)) };
}
