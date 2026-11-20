import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { getUser, STAFF_ROLES } from '@/server/auth';

/**
 * Issues short-lived upload tokens so staff browsers can upload bike photos straight to Vercel Blob.
 * The photo rows are saved afterwards by the addPhotos server action (no upload-completed webhook needed).
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const user = await getUser();
        if (!user || !STAFF_ROLES.includes(user.role)) throw new Error('Not allowed');
        if (!['bikes/', 'products/', 'promos/', 'cms/'].some((p) => pathname.startsWith(p))) throw new Error('Bad path');
        // Walkaround videos: bikes/<id>/video/<file>. See VIDEO_LIMITS in src/lib/media-guide.ts.
        if (/^bikes\/[^/]+\/video\//.test(pathname)) {
          return {
            allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/webm'],
            maximumSizeInBytes: 500 * 1024 * 1024,
            addRandomSuffix: true,
          };
        }
        return {
          allowedContentTypes: ['image/webp', 'image/jpeg', 'image/png'],
          maximumSizeInBytes: 8 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Upload failed' }, { status: 400 });
  }
}
