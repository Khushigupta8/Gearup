import { getUser, STAFF_ROLES } from '@/server/auth';
import { db } from '@/server/db';
import { readLeadPhoto } from '@/server/services/lead-photos';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user || !STAFF_ROLES.includes(user.role)) return new Response('Not authorised', { status: 403 });
  const { id } = await params;
  const photo = await db.leadPhoto.findUnique({ where: { id } });
  if (!photo) return new Response('Not found', { status: 404 });
  const response = await readLeadPhoto(photo.storagePath);
  if (!response.ok) return new Response('Photo unavailable', { status: 502 });
  return new Response(response.body, { headers: {
    'Content-Type': 'image/webp', 'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff', 'Content-Disposition': 'inline',
  } });
}
