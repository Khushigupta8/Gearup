import { workshopDates, workshopTimes } from './workshop-booking';

type Submission = { type: string; email?: string; phone?: string; bikeSlug?: string; values?: Record<string, string> };

function birthDate(text: string) {
  const parts = /^(\d{2})\s*\/\s*(\d{2})\s*\/\s*(\d{4})$/.exec(text);
  if (!parts) return null;
  const date = new Date(`${parts[3]}-${parts[2]}-${parts[1]}T12:00:00Z`);
  return Number.isFinite(+date) && date.getUTCDate() === +parts[1] && date.getUTCMonth() + 1 === +parts[2] ? date : null;
}

export function validateLead(input: Submission, now = new Date()): string | null {
  const v = input.values ?? {};
  const required = (fields: Record<string, string>) => Object.entries(fields).find(([key]) => !v[key]?.trim() || v[key] === 'Please choose')?.[1];
  if (input.type === 'finance') {
    const missing = required({ ftt: 'title', ffn: 'first name', fln: 'last name', fdob: 'date of birth', fms: 'marital status', fdep: 'number of dependants', flic: 'licence', fpc: 'postcode', fa1: 'address', fty: 'town or city', fres: 'residential status', fyy: 'years at your address', fmm: 'months at your address', fes: 'employment status', finc: 'monthly income', fout: 'monthly rent or mortgage' });
    if (missing) return `Please add your ${missing}.`;
    if (!input.email || (input.phone?.replace(/\D/g, '').length ?? 0) < 7) return 'Please add your email and mobile number.';
    if (['Full-time employed', 'Part-time employed', 'Self-employed'].includes(v.fes) && required({ foc: 'job title', femp: 'employer', fet: 'time with employer' })) return 'Please complete your employment details.';
    const dob = birthDate(v.fdob);
    const adult = new Date(now); adult.setUTCFullYear(adult.getUTCFullYear() - 18);
    if (!dob || dob > adult || dob.getUTCFullYear() < 1900) return 'Please enter a valid date of birth (DD / MM / YYYY). Finance applicants must be 18 or over.';
    for (const key of ['finc', 'fout', 'fyy', 'fmm', ...(v.fd ? ['fd'] : [])]) {
      if (!/^\d+(?:\.\d{1,2})?$/.test(v[key]) || Number(v[key]) > 1_000_000) return 'Please enter valid amounts and time at your address.';
    }
    if (!Number.isInteger(+v.fyy) || +v.fyy > 100 || !Number.isInteger(+v.fmm) || +v.fmm > 11) return 'Time at address must use whole years and 0 to 11 months.';
    if (['financeEligibility', 'financeSearch', 'privacyAcknowledged'].some((key) => v[key] !== 'yes')) return 'Please read and accept all three required finance declarations.';
  }
  if (input.type === 'insurance') {
    if (!input.bikeSlug && !v.ireg?.trim()) return 'Please enter the bike registration or select a GearUp bike.';
    if (required({ idob: 'date of birth', ilic: 'licence', ipc: 'postcode', icov: 'cover' }) || !birthDate(v.idob) || birthDate(v.idob)! >= now) return 'Please complete your date of birth, licence, postcode and cover details.';
    if (!input.email || (input.phone?.replace(/\D/g, '').length ?? 0) < 7) return 'Please add your email and mobile number.';
    if (v.insuranceSharing !== 'yes') return 'Please agree to sharing your details before requesting insurance help.';
  }
  if (input.type === 'workshop') {
    if (!workshopDates(now).some((d) => d.value === v.wdt)) return 'Please select an available future date. Refresh the page if it has been open overnight.';
    if (!workshopTimes.some((t) => t === v.wtm)) return 'Please choose a preferred drop-off time.';
  }
  return null;
}
