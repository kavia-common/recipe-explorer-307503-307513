import React from 'react';

function Star({ filled, onClick, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: 2,
        color: filled ? 'var(--primary)' : 'rgba(100, 116, 139, 0.6)',
        fontSize: 18,
      }}
    >
      ★
    </button>
  );
}

// PUBLIC_INTERFACE
export function RatingStars({ value = 0, onRate, size = 18, readOnly = false }) {
  /** 1-5 star rating control. */
  const v = Number(value) || 0;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          filled={n <= v}
          onClick={readOnly ? undefined : () => onRate?.(n)}
          label={readOnly ? `Rating ${v} out of 5` : `Rate ${n} out of 5`}
          style={{ fontSize: size }}
        />
      ))}
      <span style={{ marginLeft: 8, color: 'var(--secondary)', fontSize: 12 }}>
        {v > 0 ? `${v}/5` : 'No rating'}
      </span>
    </div>
  );
}
