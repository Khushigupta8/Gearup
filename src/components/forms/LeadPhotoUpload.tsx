'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { LEAD_PHOTO_MAX_COUNT } from '@/lib/lead-photos';

type Photo = { file: File; preview: string };

export function LeadPhotoUpload() {
  const input = useRef<HTMLInputElement>(null);
  const urls = useRef(new Set<string>());
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const active = urls.current;
    return () => { for (const url of active) URL.revokeObjectURL(url); };
  }, []);

  function sync(next: Photo[]) {
    const transfer = new DataTransfer();
    next.forEach(({ file }) => transfer.items.add(file));
    if (input.current) input.current.files = transfer.files;
    setPhotos(next);
  }

  function add(files: File[]) {
    if (photos.length + files.length > LEAD_PHOTO_MAX_COUNT) {
      setError('Choose up to 12 photos. Remove a photo before adding another.');
      sync(photos);
      return;
    }
    if (files.some((file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 20 * 1024 * 1024)) {
      setError('Use JPG, PNG or WebP photos, up to 20 MB each.');
      sync(photos);
      return;
    }
    setError('');
    sync([...photos, ...files.map((file) => {
      const preview = URL.createObjectURL(file);
      urls.current.add(preview);
      return { file, preview };
    })]);
  }

  return <div className="lead-photos">
    <label className="upl lead-photo-drop" onDragOver={(event) => event.preventDefault()} onDrop={(event) => {
      event.preventDefault();
      add(Array.from(event.dataTransfer.files));
    }}>
      <input ref={input} name="photos" aria-label="Bike photos" type="file" className="sr" multiple accept="image/jpeg,image/png,image/webp"
        onChange={(event) => add(Array.from(event.currentTarget.files ?? []))} />
      <Icon name="upload" /><b>Add bike photos</b>
      <small>Tap to choose or drag here. JPG, PNG or WebP, up to 12 photos.</small>
    </label>
    <p className="muted">Include both sides, the front, mileage, tyres and any damage.</p>
    {error && <p className="ferr" role="alert">{error}</p>}
    {photos.length > 0 && <>
      <p role="status">{photos.length} of {LEAD_PHOTO_MAX_COUNT} photos selected. They will be sent with your valuation request.</p>
      <div className="lead-photo-grid">{photos.map((photo, index) => <div key={photo.preview} className="lead-photo-preview">
        {/* eslint-disable-next-line @next/next/no-img-element -- local browser preview */}
        <img src={photo.preview} alt={`Selected bike photo ${index + 1}`} />
        <button type="button" aria-label={`Remove photo ${index + 1}`} onClick={() => {
          URL.revokeObjectURL(photo.preview);
          urls.current.delete(photo.preview);
          sync(photos.filter((item) => item !== photo));
        }}>Remove</button>
      </div>)}</div>
    </>}
  </div>;
}
