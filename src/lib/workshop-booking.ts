export const workshopTimes = ['9:00', '10:00', '11:30', '13:30', '15:00'] as const;

/** Requests start tomorrow; staff confirm availability before a booking is made. */
export function workshopDates(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const value = (type: string) => parts.find((p) => p.type === type)!.value;
  const start = new Date(`${value('year')}-${value('month')}-${value('day')}T12:00:00Z`);
  const result: { value: string; label: string }[] = [];
  for (let offset = 1; offset <= 30; offset++) {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + offset);
    if (day.getUTCDay() === 0) continue;
    result.push({ value: day.toISOString().slice(0, 10), label: day.toLocaleDateString('en-GB', { timeZone: 'Europe/London', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) });
  }
  return result;
}
