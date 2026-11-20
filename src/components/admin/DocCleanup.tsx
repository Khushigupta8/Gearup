'use client';

import { useEffect, useRef, useState } from 'react';
import { cleanDocument, findDocument, wholeImage, type Quad } from '@/lib/photo-tools';

type Step = { kind: 'adjust' } | { kind: 'busy' } | { kind: 'result'; file: File; url: string };

/**
 * One-by-one clean-up of receipt / document photos before upload.
 * The page is found automatically; staff can drag the four corners, then check the result.
 * onDone receives the files to upload (cleaned, or the original if staff chose to keep it).
 */
export function DocCleanup({ files, maxSide, onDone, onCancel }: { files: File[]; maxSide: number; onDone: (files: File[]) => void; onCancel: () => void }) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<File[]>([]);
  const [img, setImg] = useState<{ url: string; w: number; h: number } | null>(null);
  const [quad, setQuad] = useState<Quad | null>(null);
  const [step, setStep] = useState<Step>({ kind: 'busy' });
  const [rotate, setRotate] = useState<0 | 1 | 2 | 3>(0);
  const [whiten, setWhiten] = useState(true);
  const [error, setError] = useState('');
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<number | null>(null);
  const file = files[index];

  // Load each photo and find the page.
  useEffect(() => {
    let cancelled = false;
    let url = '';
    (async () => {
      try {
        const bmp = await createImageBitmap(file);
        const q = findDocument(bmp);
        url = URL.createObjectURL(file);
        if (cancelled) return;
        setImg({ url, w: bmp.width, h: bmp.height });
        setQuad(q);
        bmp.close();
        setStep({ kind: 'adjust' });
      } catch {
        if (!cancelled) setError('Could not open this photo.');
      }
    })();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => () => {
    if (step.kind === 'result') URL.revokeObjectURL(step.url);
  }, [step]);

  function next(f: File) {
    const all = [...results, f];
    if (index + 1 >= files.length) onDone(all);
    else {
      setResults(all);
      setStep({ kind: 'busy' });
      setRotate(0);
      setError('');
      setIndex(index + 1);
    }
  }

  async function run(r = rotate, w = whiten) {
    if (!quad) return;
    setStep({ kind: 'busy' });
    setError('');
    try {
      // Let the "Working…" state paint before the heavy work starts.
      await new Promise((res) => setTimeout(res, 30));
      const out = await cleanDocument(file, quad, { maxSide, rotate: r, whiten: w });
      setStep({ kind: 'result', file: out, url: URL.createObjectURL(out) });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Clean-up failed.');
      setStep({ kind: 'adjust' });
    }
  }

  function pointFromEvent(e: React.PointerEvent) {
    const el = svg.current;
    if (!el || !img) return null;
    const r = el.getBoundingClientRect();
    return {
      x: Math.min(img.w, Math.max(0, ((e.clientX - r.left) / r.width) * img.w)),
      y: Math.min(img.h, Math.max(0, ((e.clientY - r.top) / r.height) * img.h)),
    };
  }

  const handle = img ? Math.max(img.w, img.h) / 40 : 20;

  return (
    <div className="adm-modal" role="dialog" aria-modal="true" aria-label="Clean up document">
      <div className="adm-modal-card adm-doc">
        <header className="adm-modal-head">
          <div>
            <h2>Clean up document</h2>
            <p className="adm-muted">
              Photo {index + 1} of {files.length}.{' '}
              {step.kind === 'result'
                ? 'Check it reads clearly. Rotate if it is sideways.'
                : 'We found the page. Drag the red corners onto the corners of the paper if they are off.'}
            </p>
          </div>
          <button type="button" className="adm-x" aria-label="Cancel upload" onClick={onCancel}>
            ×
          </button>
        </header>

        <div className="adm-doc-stage">
          {step.kind === 'result' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={step.url} alt="Cleaned document" className="adm-doc-result" />
          ) : img && quad ? (
            <div className="adm-doc-edit">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" />
              <svg
                ref={svg}
                viewBox={`0 0 ${img.w} ${img.h}`}
                onPointerMove={(e) => {
                  if (drag.current === null) return;
                  const p = pointFromEvent(e);
                  if (!p) return;
                  const q = [...quad] as Quad;
                  q[drag.current] = p;
                  setQuad(q);
                }}
                onPointerUp={() => (drag.current = null)}
                onPointerLeave={() => (drag.current = null)}
              >
                <path
                  d={`M0 0H${img.w}V${img.h}H0Z M${quad.map((p) => `${p.x} ${p.y}`).join(' L')}Z`}
                  fill="rgba(0,0,0,.45)"
                  fillRule="evenodd"
                />
                <polygon points={quad.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#E1141B" strokeWidth={handle / 4} />
                {quad.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={handle}
                    fill="#fff"
                    stroke="#E1141B"
                    strokeWidth={handle / 3}
                    style={{ cursor: 'grab', touchAction: 'none' }}
                    onPointerDown={(e) => {
                      (e.target as Element).setPointerCapture?.(e.pointerId);
                      drag.current = i;
                    }}
                  />
                ))}
              </svg>
            </div>
          ) : (
            <p className="adm-muted">Finding the page…</p>
          )}
          {step.kind === 'busy' && img && <div className="adm-doc-busy">Working…</div>}
        </div>
        {error && <p className="adm-err">{error}</p>}

        <footer className="adm-modal-foot">
          {step.kind === 'result' ? (
            <>
              <div className="adm-inline">
                <button type="button" className="adm-btn adm-btn-sm adm-btn-line" onClick={() => setStep({ kind: 'adjust' })}>
                  ← Adjust corners
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn-sm adm-btn-line"
                  onClick={() => {
                    const r = ((rotate + 3) % 4) as 0 | 1 | 2 | 3;
                    setRotate(r);
                    run(r);
                  }}
                >
                  ↺ Rotate
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn-sm adm-btn-line"
                  onClick={() => {
                    const r = ((rotate + 1) % 4) as 0 | 1 | 2 | 3;
                    setRotate(r);
                    run(r);
                  }}
                >
                  ↻ Rotate
                </button>
              </div>
              <button type="button" className="adm-btn adm-btn-red" onClick={() => next(step.file)}>
                {index + 1 < files.length ? 'Use this, next photo →' : 'Use this and upload'}
              </button>
            </>
          ) : (
            <>
              <div className="adm-inline">
                <button type="button" className="adm-btn adm-btn-sm adm-btn-line" disabled={!img} onClick={() => img && setQuad(wholeImage(img.w, img.h, 0))}>
                  Use whole photo
                </button>
                <label className="adm-check">
                  <input type="checkbox" checked={whiten} onChange={(e) => setWhiten(e.target.checked)} /> Whiten paper
                </label>
                <button type="button" className="adm-link-btn dark" onClick={() => next(file)}>
                  Skip, keep original
                </button>
              </div>
              <button type="button" className="adm-btn adm-btn-red" disabled={step.kind === 'busy' || !quad} onClick={() => run()}>
                Clean up →
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}
