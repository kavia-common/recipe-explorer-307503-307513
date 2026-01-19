import React, { useEffect, useMemo, useState } from 'react';

// PUBLIC_INTERFACE
export function SearchBar({ value, onChange, placeholder = 'Search recipes…' }) {
  /** Controlled search input with a small clear button. */
  const [draft, setDraft] = useState(value || '');

  useEffect(() => setDraft(value || ''), [value]);

  const canClear = useMemo(() => (draft || '').length > 0, [draft]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
      <input
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') onChange(draft);
        }}
        placeholder={placeholder}
        aria-label="Search recipes"
        style={{
          width: '100%',
          borderRadius: 999,
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          padding: '10px 12px',
          outline: 'none',
        }}
      />
      <button
        className="pillButton"
        onClick={() => onChange(draft)}
        aria-label="Apply search"
        style={{ borderColor: 'rgba(59, 130, 246, 0.35)' }}
      >
        Search
      </button>
      <button
        className="pillButton"
        onClick={() => {
          setDraft('');
          onChange('');
        }}
        disabled={!canClear}
        aria-label="Clear search"
        style={{ opacity: canClear ? 1 : 0.5, cursor: canClear ? 'pointer' : 'not-allowed' }}
      >
        Clear
      </button>
    </div>
  );
}
