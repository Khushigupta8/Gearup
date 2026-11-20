'use client';

import { upload } from '@vercel/blob/client';
import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import { setBikeVideo } from '@/app/admin/(panel)/stock/bike-actions';
import { VIDEO_LIMITS } from '@/lib/media-guide';

const isLink = (u: string) => /youtube\.com|youtu\.be|vimeo\.com/.test(u);

/** Walkaround video: upload a file or paste a YouTube / Vimeo link. Shown as the "Video" tile in the gallery. */
export function VideoManager({ bikeId, videoUrl }: { bikeId: string; videoUrl: string | null }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState('');
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [pending, startTransition] = useTransition();

  async function onFile(file: File | undefined) {
    if (input.current) input.current.value = '';
    if (!file) return;
    setError('');
    if (!(VIDEO_LIMITS.types as readonly string[]).includes(file.type)) return setError(`That file type isn't supported. Use ${VIDEO_LIMITS.label}.`);
    if (file.size > VIDEO_LIMITS.maxBytes)
      return setError(`That video is ${Math.round(file.size / 1048576)} MB. The limit is 500 MB: record in 1080p, or upload it to YouTube and paste the link.`);
    try {
      const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
      const blob = await upload(`bikes/${bikeId}/video/${safe}`, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload',
        multipart: file.size > 50 * 1048576,
        onUploadProgress: ({ percentage }) => setProgress(`Uploading ${Math.round(percentage)}%…`),
      });
      setProgress('Saving…');
      const res = await setBikeVideo(bikeId, blob.url);
      if (res && !res.ok) setError(res.error);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed. Try again.');
    } finally {
      setProgress('');
    }
  }

  const save = (url: string | null) =>
    startTransition(async () => {
      setError('');
      const res = await setBikeVideo(bikeId, url);
      if (res && !res.ok) setError(res.error);
      else {
        setLink('');
        setConfirm(false);
      }
      router.refresh();
    });

  const busy = !!progress || pending;

  return (
    <section className="adm-card adm-sec">
      <div className="adm-sec-head">
        <div>
          <h2>Walkaround video</h2>
          <p className="adm-muted">Shows as the “Video” tile at the end of the photo strip. 1080p, 1–3 minutes, landscape.</p>
        </div>
        <label className={`adm-btn adm-btn-sm ${busy ? 'is-disabled' : ''}`}>
          {progress || (videoUrl ? 'Replace video' : '+ Upload video')}
          <input ref={input} type="file" accept="video/mp4,video/quicktime,video/webm" hidden disabled={busy} onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
      </div>
      {error && <p className="adm-err">{error}</p>}
      {videoUrl ? (
        <div className="adm-video">
          {isLink(videoUrl) ? (
            <a href={videoUrl} target="_blank" rel="noopener" className="adm-link">
              {videoUrl} ↗
            </a>
          ) : (
            <video src={videoUrl} controls preload="metadata" />
          )}
          {confirm ? (
            <button type="button" className="adm-btn adm-btn-sm adm-btn-red" disabled={busy} onClick={() => save(null)}>
              Confirm remove
            </button>
          ) : (
            <button type="button" className="adm-link-btn dark" onClick={() => setConfirm(true)}>
              Remove video
            </button>
          )}
        </div>
      ) : (
        <p className="adm-muted" style={{ margin: '0 0 10px' }}>
          No video yet. The Video tile is hidden on the website until one is added.
        </p>
      )}
      <form
        className="adm-inline"
        style={{ marginTop: 12 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (link.trim()) save(link.trim());
        }}
      >
        <input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="…or paste a YouTube / Vimeo link" aria-label="Video link" />
        <button type="submit" className="adm-btn adm-btn-sm adm-btn-line" disabled={busy || !link.trim()}>
          Use link
        </button>
      </form>
    </section>
  );
}
