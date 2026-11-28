import test from 'node:test';
import assert from 'node:assert/strict';
import { poundsToPence } from './money-input';
import { mergeBasketLines } from './basket-lines';
import { validateLead } from './lead-validation';
import { workshopDates } from './workshop-booking';
import { canTransitionOrder } from './order-transitions';

test('invalid price text cannot become a free or positive-price product', () => {
  for (const value of ['abc', '', '-25', '1e2', '25.123', '25p', 'Infinity']) assert.ok(Number.isNaN(poundsToPence(value)));
  assert.equal(poundsToPence('25.50'), 2550);
  assert.equal(poundsToPence('0'), 0);
});

test('duplicate basket quantities are preserved and aggregated before stock checks', () => {
  assert.deepEqual(mergeBasketLines([{ variantId: 'v', qty: 2 }, { variantId: 'v', qty: 2 }, { variantId: 'b', qty: 1 }]), [{ variantId: 'v', qty: 4 }, { variantId: 'b', qty: 1 }]);
  assert.equal(mergeBasketLines([{ variantId: 'v', qty: 10 }, { variantId: 'v', qty: 10 }])[0].qty, 20);
});

const now = new Date('2026-11-28T12:00:00Z');
const application = { type: 'finance', email: 'test@example.invalid', phone: '07700900123', values: { ftt: 'Mr', ffn: 'Test', fln: 'Customer', fdob: '01 / 01 / 1990', fms: 'Single', fdep: '0', flic: 'Full A licence', fpc: 'LS1 1AA', fa1: '1 Test Street', fty: 'Leeds', fres: 'Homeowner', fyy: '3', fmm: '2', fes: 'Full-time employed', foc: 'Engineer', femp: 'Test', fet: 'Under 1 year', finc: '2500', fout: '700', financeEligibility: 'yes', financeSearch: 'yes', privacyAcknowledged: 'yes' } };

test('finance requires full information and each consent separately', () => {
  assert.ok(validateLead({ type: 'finance', email: 'test@example.invalid' }, now));
  assert.equal(validateLead(application, now), null);
  for (const key of ['financeEligibility', 'financeSearch', 'privacyAcknowledged']) assert.match(validateLead({ ...application, values: { ...application.values, [key]: 'no' } }, now)!, /declarations/);
  assert.ok(validateLead({ ...application, values: { ...application.values, fdob: '31 / 02 / 1990' } }, now));
  assert.ok(validateLead({ ...application, values: { ...application.values, fdob: '01 / 01 / 2015' } }, now));
  assert.ok(validateLead({ ...application, values: { ...application.values, fmm: '12' } }, now));
});

test('insurance cannot be accepted without the sharing agreement', () => {
  const input = { type: 'insurance', email: 'test@example.invalid', phone: '07700900123', values: { ireg: 'AB12CDE', idob: '01 / 01 / 1990', ilic: 'A2', ipc: 'LS1 1AA', icov: 'Fully comprehensive', insuranceSharing: 'no' } };
  assert.match(validateLead(input, now)!, /sharing/);
  assert.equal(validateLead({ ...input, values: { ...input.values, insuranceSharing: 'yes' } }, now), null);
});

test('workshop requests use upcoming UK dates and reject stale or unknown slots', () => {
  const dates = workshopDates(now);
  assert.equal(dates[0].value, '2026-11-30');
  assert.ok(dates.every((d) => d.value > '2026-11-28' && new Date(d.value).getUTCDay() !== 0));
  assert.ok(validateLead({ type: 'workshop', values: { wdt: '2026-11-18', wtm: '10:00' } }, now));
  assert.ok(validateLead({ type: 'workshop', values: { wdt: dates[0].value, wtm: '23:00' } }, now));
  assert.equal(validateLead({ type: 'workshop', values: { wdt: dates[0].value, wtm: '9:00' } }, now), null);
});

test('completed and cancelled orders cannot be reopened or restocked twice', () => {
  for (const from of ['completed', 'cancelled', 'refunded']) for (const to of ['ready', 'reserved', 'cancelled', 'refunded']) assert.equal(canTransitionOrder(from, to), false);
  assert.equal(canTransitionOrder('reserved', 'completed'), true);
  assert.equal(canTransitionOrder('payment_review', 'completed'), false);
  assert.equal(canTransitionOrder('payment_review', 'refunded'), true);
});
