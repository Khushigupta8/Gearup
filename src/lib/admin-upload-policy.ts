import { VIDEO_LIMITS } from './media-guide';

const imageTypes: Record<string, string> = { webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' };
const videoTypes: Record<string, string> = { mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm' };

/** Only grant uploads into paths used by the DMS, with the matching file type and size limit. */
export function adminUploadPolicy(pathname: string) {
  if (pathname.length > 300) return null;
  const bike = /^bikes\/([a-zA-Z0-9_-]{1,128})\/(main|detail|receipt|cutout|video)\/([a-zA-Z0-9][a-zA-Z0-9._-]*)$/.exec(pathname);
  const shared = /^(?:products|promos|cms\/hero)\/([a-zA-Z0-9][a-zA-Z0-9._-]*)$/.exec(pathname);
  if (!bike && !shared) return null;
  const extension = pathname.split('.').pop()?.toLowerCase() ?? '';
  const video = bike?.[2] === 'video';
  const type = (video ? videoTypes : imageTypes)[extension];
  if (!type) return null;
  return {
    bikeId: bike?.[1],
    allowedContentTypes: [type],
    maximumSizeInBytes: video ? VIDEO_LIMITS.maxBytes : 8 * 1024 * 1024,
    addRandomSuffix: true,
  };
}
