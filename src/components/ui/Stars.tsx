/** Trustpilot-style stars: `full` whole stars, plus one half star if `half`. */
export function Stars({ full, half = false }: { full: number; half?: boolean }) {
  return (
    <span className="stars">
      {Array.from({ length: full + (half ? 1 : 0) }, (_, i) => (
        <i key={i} className={half && i === full ? 'half' : undefined}>
          <svg aria-hidden="true">
            <use href="#i-star" />
          </svg>
        </i>
      ))}
    </span>
  );
}
