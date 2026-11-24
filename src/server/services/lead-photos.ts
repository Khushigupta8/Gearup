import 'server-only';
import { randomUUID } from 'node:crypto';

export type StoredLeadPhoto = { storagePath: string; name: string; size: number };

function storage() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.LEAD_PHOTO_BUCKET;
  if (!url || !key || !bucket) throw new Error('Enquiry photo storage is not configured');
  return { url: `${url.replace(/\/$/, '')}/storage/v1`, bucket, headers: { apikey: key, Authorization: `Bearer ${key}` } };
}

export async function removeLeadPhotos(photos: StoredLeadPhoto[]) {
  if (!photos.length) return;
  const s = storage();
  const response = await fetch(`${s.url}/object/${encodeURIComponent(s.bucket)}`, {
    method: 'DELETE', headers: { ...s.headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefixes: photos.map((photo) => photo.storagePath) }),
  });
  if (!response.ok) throw new Error('Could not remove incomplete enquiry photos');
}

/** Private objects: only the staff-only download route can read them. */
export async function storeLeadPhotos(files: File[]): Promise<StoredLeadPhoto[]> {
  if (!files.length) return [];
  const s = storage();
  const uploaded: StoredLeadPhoto[] = [];
  const folder = randomUUID();
  try {
    for (const [index, file] of files.entries()) {
      const storagePath = `enquiries/${folder}/${randomUUID()}.webp`;
      const response = await fetch(`${s.url}/object/${encodeURIComponent(s.bucket)}/${storagePath}`, {
        method: 'POST', headers: { ...s.headers, 'Content-Type': 'image/webp', 'x-upsert': 'false' },
        body: await file.arrayBuffer(),
      });
      if (!response.ok) throw new Error('Could not upload enquiry photos');
      uploaded.push({ storagePath, name: `Bike photo ${index + 1}`, size: file.size });
    }
    return uploaded;
  } catch (error) {
    await removeLeadPhotos(uploaded).catch(() => console.error('[lead photos] incomplete upload cleanup failed'));
    throw error;
  }
}

export async function readLeadPhoto(storagePath: string) {
  const s = storage();
  return fetch(`${s.url}/object/authenticated/${encodeURIComponent(s.bucket)}/${storagePath}`, { headers: s.headers, cache: 'no-store' });
}
