/**
 * Upload guidance shown to staff in the DMS (client question, 19 Nov: "what's the highest quality
 * the DMS can support… my phone can take 64MP"). The numbers here are what the uploader enforces.
 */

/** Longest side (px) photos are saved at, after the browser shrinks them. */
export const PHOTO_MAX_SIDE = { main: 2000, detail: 2000, receipt: 2400, promo: 2000 } as const;

export const VIDEO_LIMITS = {
  maxBytes: 500 * 1024 * 1024,
  types: ['video/mp4', 'video/quicktime', 'video/webm'],
  label: 'MP4 or MOV, up to 500 MB',
} as const;

export const mediaGuide: { title: string; points: string[] }[] = [
  {
    title: 'Main photos',
    points: [
      'Use the phone’s normal photo mode (12 MP). Leave 48/50/64 MP “high-res” mode off: the website never shows more than about 2,000 pixels, and high-res mode is often noisier in normal light.',
      'Landscape (sideways), 4:3. Bike fills the frame, shot at bike height, in daylight or even light.',
      'Any size phone photo is fine. The DMS shrinks it to 2,000 px WebP (about 300–600 KB) before upload, so pages stay fast.',
      'The first photo is the listing picture. Tick “Add GearUp frame” to put the logo and finance/delivery bar on each photo.',
    ],
  },
  {
    title: 'Detailed pictures',
    points: [
      'Same settings as main photos. Get close, keep the mark in focus and in the centre, no zoom (move closer instead).',
      'Add a caption to every one, e.g. “Light scuff on left pannier”.',
    ],
  },
  {
    title: 'Receipts & documents',
    points: [
      'Lay the page flat on a darker surface, shoot from straight above, whole page in frame, no flash glare.',
      'Leave “Clean up document” ticked: it finds the page, cuts away the background, straightens it and whitens the paper.',
      'Saved at 2,400 px so small print stays readable. Cover personal details of previous owners before shooting.',
    ],
  },
  {
    title: 'Walkaround video',
    points: [
      'Record in 1080p (Full HD) at 30 fps, landscape. 4K is not needed and makes the file 3–4 times bigger.',
      'Keep it 1–3 minutes: walk round the bike, show the dash with the engine running, then the marks.',
      `Upload the file (${VIDEO_LIMITS.label}) or paste a YouTube link. For anything longer, upload to YouTube as “Unlisted” and paste the link.`,
    ],
  },
];
