import React from 'react';
import { RatingStars } from './RatingStars';

// PUBLIC_INTERFACE
export function RecipeCard({ recipe, isFavorite, onToggleFavorite, onOpen }) {
  /** Card view for recipe in a grid. */
  return (
    <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <button
        onClick={onOpen}
        style={{ border: 'none', padding: 0, background: 'transparent', cursor: 'pointer' }}
        aria-label={`Open recipe ${recipe.title}`}
      >
        <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
      </button>

      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div>
            <div style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{recipe.title}</div>
            <div style={{ color: 'var(--secondary)', fontSize: 13, marginTop: 2 }}>{recipe.category}</div>
          </div>

          <button
            className="pillButton"
            onClick={onToggleFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            style={{
              borderColor: isFavorite ? 'rgba(239, 68, 68, 0.35)' : 'var(--border)',
              color: isFavorite ? 'var(--error)' : 'inherit',
              padding: '8px 10px',
            }}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        </div>

        <div style={{ color: 'var(--secondary)', fontSize: 14, lineHeight: 1.35 }}>
          {recipe.description}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <RatingStars value={Math.round(recipe.rating_avg)} readOnly />
          <span style={{ color: 'var(--secondary)', fontSize: 12 }}>
            {recipe.rating_count} rating{recipe.rating_count === 1 ? '' : 's'}
          </span>
        </div>
      </div>
    </div>
  );
}
