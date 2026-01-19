import React from 'react';

// PUBLIC_INTERFACE
export function CategoryNav({ categories, active, onSelect }) {
  /** Horizontal category chips navigation. */
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <button
        className="pillButton pillButtonPrimary"
        onClick={() => onSelect('')}
        style={{
          background: active ? 'var(--surface)' : 'rgba(59, 130, 246, 0.10)',
          borderColor: active ? 'var(--border)' : 'rgba(59, 130, 246, 0.35)',
          color: active ? 'inherit' : 'var(--primary)',
        }}
        aria-label="All categories"
      >
        All
      </button>
      {categories.map(c => {
        const isActive = (active || '').toLowerCase() === (c.name || '').toLowerCase();
        return (
          <button
            key={c.name}
            className="pillButton"
            onClick={() => onSelect(c.name)}
            style={{
              background: isActive ? 'rgba(59, 130, 246, 0.10)' : 'var(--surface)',
              borderColor: isActive ? 'rgba(59, 130, 246, 0.35)' : 'var(--border)',
              color: isActive ? 'var(--primary)' : 'inherit',
            }}
            aria-label={`Category ${c.name}`}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
