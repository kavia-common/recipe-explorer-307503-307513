import React from 'react';

// PUBLIC_INTERFACE
export function IngredientChips({ ingredients = [], onAdd, selected = [] }) {
  /** Display ingredients with quick-add to filter chips. */
  const selectedSet = new Set(selected.map(s => (s || '').toLowerCase()));

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {ingredients.map(ing => {
        const name = ing?.name || '';
        const isSelected = selectedSet.has(name.toLowerCase());
        return (
          <button
            key={name}
            className="pillButton"
            onClick={onAdd ? () => onAdd(name) : undefined}
            disabled={!onAdd}
            style={{
              padding: '6px 10px',
              borderRadius: 999,
              background: isSelected ? 'rgba(6, 182, 212, 0.10)' : 'var(--surface)',
              borderColor: isSelected ? 'rgba(6, 182, 212, 0.35)' : 'var(--border)',
              color: isSelected ? 'var(--success)' : 'inherit',
              cursor: onAdd ? 'pointer' : 'default',
            }}
            aria-label={`Ingredient ${name}`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
