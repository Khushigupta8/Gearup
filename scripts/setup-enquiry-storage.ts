import { config } from 'dotenv';

config({ path: '.env.local', quiet: true });

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.LEAD_PHOTO_BUCKET;
  if (!url || !key || !bucket) throw new Error('Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and LEAD_PHOTO_BUCKET first.');
  const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
  const endpoint = `${url.replace(/\/$/, '')}/storage/v1/bucket`;
  const existing = await fetch(`${endpoint}/${encodeURIComponent(bucket)}`, { headers });
  const data = await existing.json();
  if (existing.ok) {
    if (data.public) throw new Error('The enquiry bucket must be private. Choose a separate private bucket.');
    console.log(`Private enquiry bucket ready: ${bucket}`);
    return;
  }
  if (existing.status !== 404 && Number(data.statusCode) !== 404) throw new Error('Could not check enquiry storage permissions.');
  const created = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify({
    id: bucket, name: bucket, public: false, file_size_limit: 262144, allowed_mime_types: ['image/webp'],
  }) });
  if (!created.ok) throw new Error(`Could not create private enquiry bucket (${created.status}).`);
  console.log(`Created private enquiry bucket: ${bucket}`);
}
main().catch((error) => { console.error(error instanceof Error ? error.message : 'Storage setup failed'); process.exitCode = 1; });
