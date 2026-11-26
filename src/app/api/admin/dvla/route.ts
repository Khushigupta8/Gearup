import { NextResponse } from 'next/server';
import { getUser, STAFF_ROLES } from '@/server/auth';
import { vehicleLookupFields } from '@/lib/vehicle-lookup';

/**
 * Registration lookup for the add-bike form (DVLA Vehicle Enquiry Service).
 * Needs DVLA_API_KEY. Without it the form falls back to manual entry.
 */
export async function GET(request: Request) {
  const user = await getUser();
  if (!user || !STAFF_ROLES.includes(user.role)) return NextResponse.json({ error: 'Not allowed' }, { status: 401 });

  const reg = new URL(request.url).searchParams.get('reg')?.replace(/\s+/g, '').toUpperCase() ?? '';
  if (!/^[A-Z0-9]{2,8}$/.test(reg)) return NextResponse.json({ error: 'Enter a valid UK registration.' }, { status: 400 });

  const key = process.env.DVLA_API_KEY?.trim();
  if (!key) return NextResponse.json({ manual: true, error: 'Reg lookup is not switched on yet. Fill the details in by hand.' }, { status: 501 });

  try {
    const res = await fetch('https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles', {
      method: 'POST',
      headers: { 'x-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationNumber: reg }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 404) return NextResponse.json({ error: 'No vehicle found for that registration.' }, { status: 404 });
    if (!res.ok) return NextResponse.json({ error: 'The DVLA lookup is unavailable right now. Fill the details in by hand.' }, { status: 502 });

    const v = await res.json();
    if (!v || typeof v !== 'object' || typeof v.make !== 'string') throw new Error('Invalid vehicle response');
    return NextResponse.json({
      registration: reg,
      ...vehicleLookupFields(v),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'The registration lookup could not connect. Try again, or enter the details manually.' }, { status: 502 });
  }
}
