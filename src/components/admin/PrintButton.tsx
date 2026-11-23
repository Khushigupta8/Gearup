'use client';

export function PrintButton() {
  return (
    <button type="button" className="ptools-print" onClick={() => window.print()}>
      Print / Save as PDF
    </button>
  );
}
