import { mediaGuide } from '@/lib/media-guide';

/** Collapsible "what to upload" guide for staff, shown above the photo sections. */
export function MediaGuide({ open = false }: { open?: boolean }) {
  return (
    <details className="adm-card adm-guide" open={open}>
      <summary>
        <span className="adm-guide-ic" aria-hidden="true">
          i
        </span>
        Photo & video guide: what quality to use
      </summary>
      <div className="adm-guide-grid">
        {mediaGuide.map((g) => (
          <section key={g.title}>
            <h3>{g.title}</h3>
            <ul>
              {g.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </details>
  );
}
