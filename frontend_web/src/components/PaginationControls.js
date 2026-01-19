import React from 'react';

// PUBLIC_INTERFACE
export function PaginationControls({ page, totalPages, onPage }) {
  /** Basic pagination controls. */
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
      <button className="pillButton" onClick={() => onPage(page - 1)} disabled={!canPrev}>
        Prev
      </button>
      <span style={{ color: 'var(--secondary)' }}>
        Page <strong>{page}</strong> / {totalPages || 1}
      </span>
      <button className="pillButton" onClick={() => onPage(page + 1)} disabled={!canNext}>
        Next
      </button>
    </div>
  );
}
