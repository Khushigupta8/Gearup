import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { getUser, STAFF_ROLES } from '@/server/auth';
import { db } from '@/server/db';
import { adminUploadPolicy } from '@/lib/admin-upload-policy';

/** Staff browsers upload directly to Blob; file data does not pass through Vercel Functions. */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;
    if (!body || !['blob.generate-client-token', 'blob.upload-completed'].includes(body.type)) {
      return NextResponse.json({ error: 'Invalid upload request.' }, { status: 400 });
    }

    if (body.type === 'blob.generate-client-token') {
      const user = await getUser();
      if (!user) return NextResponse.json({ error: 'Sign in to upload files.' }, { status: 401 });
      if (!STAFF_ROLES.includes(user.role)) return NextResponse.json({ error: 'Staff access is required.' }, { status: 403 });
      const policy = typeof body.payload?.pathname === 'string' ? adminUploadPolicy(body.payload.pathname) : null;
      if (!policy) return NextResponse.json({ error: 'Choose a supported photo or video for this upload.' }, { status: 400 });
      if (policy.bikeId && !await db.bike.findUnique({ where: { id: policy.bikeId }, select: { id: true } })) {
        return NextResponse.json({ error: 'Save the bike before adding its photos or video.' }, { status: 404 });
      }
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return NextResponse.json({ error: 'Media storage is not connected yet. Add BLOB_READ_WRITE_TOKEN to enable DMS uploads.' }, { status: 503 });
      }
    }

    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const user = await getUser();
        if (!user || !STAFF_ROLES.includes(user.role)) throw new Error('Not allowed');
        const policy = adminUploadPolicy(pathname);
        if (!policy) throw new Error('Unsupported upload');
        const { allowedContentTypes, maximumSizeInBytes, addRandomSuffix } = policy;
        return { allowedContentTypes, maximumSizeInBytes, addRandomSuffix };
      },
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'The upload request could not be processed. Refresh the page and try again.' }, { status: 400 });
  }
}
