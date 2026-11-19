/** Temporary body for routes not yet ported from legacy/pages. Remove once every page is done. */
export function PagePlaceholder({ title, legacyFile }: { title: string; legacyFile: string }) {
  return (
    <section className="sec">
      <div className="wrap">
        <h1>{title}</h1>
        <p>
          To port: <code>legacy/pages/{legacyFile}</code>
        </p>
      </div>
    </section>
  );
}
