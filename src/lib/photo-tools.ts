'use client';

/**
 * Browser-side photo tools for the DMS (client, 19 Nov):
 *  - applyFrame: puts the GearUp "main picture template" (logo + delivery/finance bar) over a bike photo.
 *  - findDocument / cleanDocument: finds a receipt or document in a photo, cuts away the background,
 *    flattens the perspective and whitens the paper so it reads cleanly on the website.
 * Everything runs on the staff member's device: no upload of originals, no paid API.
 */

export type Pt = { x: number; y: number };
/** Corners in order: top-left, top-right, bottom-right, bottom-left (source pixel coordinates). */
export type Quad = [Pt, Pt, Pt, Pt];

export const FRAME_SRC = '/assets/brand/photo-frame.png';

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('This browser cannot edit images.');
  return [c, ctx] as const;
}

async function toWebp(c: HTMLCanvasElement, name: string, quality = 0.88) {
  const blob = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/webp', quality));
  if (!blob) throw new Error('Could not save the image.');
  return new File([blob], name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
}

let framePromise: Promise<ImageBitmap> | null = null;
function loadFrame() {
  framePromise ??= fetch(FRAME_SRC)
    .then((r) => {
      if (!r.ok) throw new Error('Frame image missing');
      return r.blob();
    })
    .then((b) => createImageBitmap(b))
    .catch((e) => {
      framePromise = null;
      throw e;
    });
  return framePromise;
}

/**
 * 4:3 photo with the GearUp frame on top. Landscape photos are cropped to fill;
 * portrait ones sit on a blurred copy of themselves so nothing important is cut off.
 */
export async function applyFrame(file: File, width = 2000): Promise<File> {
  const [photo, frame] = await Promise.all([createImageBitmap(file), loadFrame()]);
  const W = width;
  const H = Math.round((width * 3) / 4);
  const [c, ctx] = canvas(W, H);
  ctx.imageSmoothingQuality = 'high';
  const ratio = photo.width / photo.height;

  if (ratio >= 1.15) {
    const s = Math.max(W / photo.width, H / photo.height);
    const w = photo.width * s;
    const h = photo.height * s;
    ctx.drawImage(photo, (W - w) / 2, (H - h) / 2, w, h);
  } else {
    const sCover = Math.max(W / photo.width, H / photo.height);
    ctx.filter = 'blur(28px) brightness(.8)';
    ctx.drawImage(photo, (W - photo.width * sCover) / 2, (H - photo.height * sCover) / 2, photo.width * sCover, photo.height * sCover);
    ctx.filter = 'none';
    const s = Math.min(W / photo.width, H / photo.height);
    ctx.drawImage(photo, (W - photo.width * s) / 2, (H - photo.height * s) / 2, photo.width * s, photo.height * s);
  }
  ctx.drawImage(frame, 0, 0, W, H);
  photo.close();
  return toWebp(c, file.name, 0.86);
}

// ───────────── documents ─────────────

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

export function wholeImage(w: number, h: number, inset = 0.03): Quad {
  const ix = w * inset;
  const iy = h * inset;
  return [
    { x: ix, y: iy },
    { x: w - ix, y: iy },
    { x: w - ix, y: h - iy },
    { x: ix, y: h - iy },
  ];
}

/** Otsu threshold of an 8-bit histogram. */
function otsu(hist: Uint32Array, total: number) {
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * hist[i];
  let sumB = 0;
  let wB = 0;
  let best = 0;
  let threshold = 128;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (!wB) continue;
    const wF = total - wB;
    if (!wF) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) ** 2;
    if (between > best) {
      best = between;
      threshold = t;
    }
  }
  return threshold;
}

/**
 * Finds the page: the largest bright, low-colour area in the photo. Works best with the page on a darker
 * surface (as staff are told in the guide). Falls back to the whole photo when nothing clear is found.
 */
export function findDocument(img: ImageBitmap): Quad {
  const scale = Math.min(1, 360 / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const [, ctx] = canvas(w, h);
  ctx.drawImage(img, 0, 0, w, h);
  const px = ctx.getImageData(0, 0, w, h).data;

  // "Paperness": bright and unsaturated.
  const score = new Uint8Array(w * h);
  const hist = new Uint32Array(256);
  for (let i = 0, p = 0; i < w * h; i++, p += 4) {
    const r = px[p];
    const g = px[p + 1];
    const b = px[p + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const v = Math.max(0, Math.min(255, Math.round(0.299 * r + 0.587 * g + 0.114 * b - (max - min) * 0.6)));
    score[i] = v;
    hist[v]++;
  }
  const t = otsu(hist, w * h);

  // Largest 4-connected component above the threshold.
  const label = new Int32Array(w * h).fill(-1);
  const stack = new Int32Array(w * h);
  let bestId = -1;
  let bestSize = 0;
  let id = 0;
  for (let start = 0; start < w * h; start++) {
    if (label[start] !== -1 || score[start] <= t) continue;
    let top = 0;
    stack[top++] = start;
    label[start] = id;
    let size = 0;
    while (top) {
      const i = stack[--top];
      size++;
      const x = i % w;
      const y = (i - x) / w;
      const n = [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1];
      for (const j of n) {
        if (j >= 0 && label[j] === -1 && score[j] > t) {
          label[j] = id;
          stack[top++] = j;
        }
      }
    }
    if (size > bestSize) {
      bestSize = size;
      bestId = id;
    }
    id++;
  }
  if (bestId < 0 || bestSize < w * h * 0.12) return wholeImage(img.width, img.height);

  // Corners = extreme points along the two diagonals.
  let tl = { x: 0, y: 0, v: Infinity };
  let br = { x: 0, y: 0, v: -Infinity };
  let tr = { x: 0, y: 0, v: -Infinity };
  let bl = { x: 0, y: 0, v: Infinity };
  for (let i = 0; i < w * h; i++) {
    if (label[i] !== bestId) continue;
    const x = i % w;
    const y = (i - x) / w;
    if (x + y < tl.v) tl = { x, y, v: x + y };
    if (x + y > br.v) br = { x, y, v: x + y };
    if (x - y > tr.v) tr = { x, y, v: x - y };
    if (x - y < bl.v) bl = { x, y, v: x - y };
  }
  const up = (p: { x: number; y: number }): Pt => ({
    x: Math.min(img.width, Math.max(0, (p.x + 0.5) / scale)),
    y: Math.min(img.height, Math.max(0, (p.y + 0.5) / scale)),
  });
  const quad: Quad = [up(tl), up(tr), up(br), up(bl)];
  // Reject degenerate shapes (e.g. a thin strip): use the whole photo instead.
  const wTop = dist(quad[0], quad[1]);
  const hLeft = dist(quad[0], quad[3]);
  if (wTop < img.width * 0.15 || hLeft < img.height * 0.15) return wholeImage(img.width, img.height);
  return quad;
}

/** Solves the 3x3 homography that maps the unit output rectangle (w x h) onto the source quad. */
function homography(q: Quad, w: number, h: number) {
  const src = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];
  const A: number[][] = [];
  const B: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i];
    const { x: u, y: v } = q[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    B.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    B.push(v);
  }
  // Gaussian elimination.
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    [B[c], B[p]] = [B[p], B[c]];
    for (let r = c + 1; r < 8; r++) {
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k];
      B[r] -= f * B[c];
    }
  }
  const x = new Array<number>(8).fill(0);
  for (let r = 7; r >= 0; r--) {
    let s = B[r];
    for (let k = r + 1; k < 8; k++) s -= A[r][k] * x[k];
    x[r] = s / A[r][r];
  }
  return x; // a b c d e f g h  (i = 1)
}

/**
 * Cuts the page out along the quad, flattens it to a rectangle, then evens out the lighting so the
 * paper goes white and the print stays sharp (colour stamps are kept). rotate: quarter turns clockwise.
 */
export async function cleanDocument(
  file: File,
  quad: Quad,
  opts: { maxSide?: number; whiten?: boolean; rotate?: 0 | 1 | 2 | 3 } = {},
): Promise<File> {
  const { maxSide = 2400, whiten = true, rotate = 0 } = opts;
  const img = await createImageBitmap(file);
  const [sc, sctx] = canvas(img.width, img.height);
  sctx.drawImage(img, 0, 0);
  const src = sctx.getImageData(0, 0, img.width, img.height).data;
  const SW = img.width;
  const SH = img.height;
  img.close();

  const rawW = Math.max(dist(quad[0], quad[1]), dist(quad[3], quad[2]));
  const rawH = Math.max(dist(quad[0], quad[3]), dist(quad[1], quad[2]));
  const s = Math.min(1, maxSide / Math.max(rawW, rawH));
  const W = Math.max(1, Math.round(rawW * s));
  const H = Math.max(1, Math.round(rawH * s));
  const [a, b, c, d, e, f, g, hh] = homography(quad, W, H);

  const [oc, octx] = canvas(W, H);
  const out = octx.createImageData(W, H);
  const o = out.data;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const den = g * x + hh * y + 1;
      const u = (a * x + b * y + c) / den;
      const v = (d * x + e * y + f) / den;
      const k = (y * W + x) * 4;
      if (u < 0 || v < 0 || u >= SW - 1 || v >= SH - 1) {
        o[k] = o[k + 1] = o[k + 2] = 255;
        o[k + 3] = 255;
        continue;
      }
      const x0 = u | 0;
      const y0 = v | 0;
      const fx = u - x0;
      const fy = v - y0;
      const i00 = (y0 * SW + x0) * 4;
      const i10 = i00 + 4;
      const i01 = i00 + SW * 4;
      const i11 = i01 + 4;
      for (let ch = 0; ch < 3; ch++) {
        const top = src[i00 + ch] * (1 - fx) + src[i10 + ch] * fx;
        const bot = src[i01 + ch] * (1 - fx) + src[i11 + ch] * fx;
        o[k + ch] = top * (1 - fy) + bot * fy;
      }
      o[k + 3] = 255;
    }
  }
  sc.width = sc.height = 0; // free memory
  octx.putImageData(out, 0, 0);

  if (whiten) {
    // Background estimate: shrink a lot (text averages away), blur, scale back up. Divide it out.
    const bw = Math.max(8, Math.round(W / 28));
    const bh = Math.max(8, Math.round(H / 28));
    const [bc, bctx] = canvas(bw, bh);
    bctx.imageSmoothingQuality = 'high';
    bctx.drawImage(oc, 0, 0, bw, bh);
    // Lift each background cell towards its brightest neighbour so dark text doesn't darken the estimate.
    const bd = bctx.getImageData(0, 0, bw, bh);
    const bp = bd.data;
    const copy = new Uint8ClampedArray(bp);
    for (let y = 0; y < bh; y++)
      for (let x = 0; x < bw; x++)
        for (let ch = 0; ch < 3; ch++) {
          let m = 0;
          for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++) {
              const xx = Math.min(bw - 1, Math.max(0, x + dx));
              const yy = Math.min(bh - 1, Math.max(0, y + dy));
              m = Math.max(m, copy[(yy * bw + xx) * 4 + ch]);
            }
          bp[(y * bw + x) * 4 + ch] = m;
        }
    bctx.putImageData(bd, 0, 0);
    const [fc, fctx] = canvas(W, H);
    fctx.imageSmoothingQuality = 'high';
    fctx.filter = 'blur(2px)';
    fctx.drawImage(bc, 0, 0, W, H);
    const bg = fctx.getImageData(0, 0, W, H).data;
    const im = octx.getImageData(0, 0, W, H);
    const p = im.data;
    for (let i = 0; i < p.length; i += 4) {
      for (let ch = 0; ch < 3; ch++) {
        const n = (p[i + ch] / Math.max(40, bg[i + ch])) * 255; // 0..255, paper ≈ 255
        // Gentle curve: push paper to white, keep ink dark.
        const t = Math.max(0, Math.min(1, (n - 30) / 200));
        p[i + ch] = Math.round(255 * Math.pow(t, 1.35));
      }
    }
    octx.putImageData(im, 0, 0);
    fc.width = fc.height = 0;
    bc.width = bc.height = 0;
  }

  let final = oc;
  if (rotate) {
    const swap = rotate % 2 === 1;
    const [rc, rctx] = canvas(swap ? H : W, swap ? W : H);
    rctx.translate(rc.width / 2, rc.height / 2);
    rctx.rotate((rotate * Math.PI) / 2);
    rctx.drawImage(oc, -W / 2, -H / 2);
    final = rc;
  }
  return toWebp(final, file.name, 0.9);
}
