import React, { useEffect, useMemo, useState } from 'react';
import { getRecipe, addFavorite, removeFavorite, upsertRating } from '../api/recipes';
import { IngredientChips } from '../components/IngredientChips';
import { RatingStars } from '../components/RatingStars';
import { loadFavoriteIds, saveFavoriteIds } from '../utils/favoritesStorage';

// PUBLIC_INTERFACE
export function RecipeDetailPage({ recipeId, onBack, onGoFavorites }) {
  /** Recipe detail page. */
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [favoriteIds, setFavoriteIds] = useState(() => loadFavoriteIds());
  const isFavorite = useMemo(() => favoriteIds.includes(Number(recipeId)), [favoriteIds, recipeId]);

  const [myRating, setMyRating] = useState(0);
  const [ratingSaving, setRatingSaving] = useState(false);

  useEffect(() => saveFavoriteIds(favoriteIds), [favoriteIds]);

  useEffect(() => {
    setLoading(true);
    setError('');
    getRecipe(recipeId)
      .then(r => {
        setRecipe(r);
        setMyRating(0);
      })
      .catch(err => setError(err.message || 'Failed to load recipe'))
      .finally(() => setLoading(false));
  }, [recipeId]);

  const toggleFavorite = async () => {
    const rid = Number(recipeId);
    const next = isFavorite ? favoriteIds.filter(id => id !== rid) : [...favoriteIds, rid];
    setFavoriteIds(next);

    try {
      if (isFavorite) await removeFavorite(rid);
      else await addFavorite(rid);
    } catch {
      setFavoriteIds(favoriteIds);
    }
  };

  const rate = async n => {
    setMyRating(n);
    setRatingSaving(true);
    try {
      await upsertRating(Number(recipeId), n);
      // best-effort refresh aggregate from server
      const updated = await getRecipe(recipeId);
      setRecipe(updated);
    } catch {
      // keep optimistic UI
    } finally {
      setRatingSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Recipe</h1>
          <div className="muted">Details, ingredients, steps, and rating</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="pillButton" onClick={onBack} aria-label="Back to home">
            Back
          </button>
          <button className="pillButton pillButtonPrimary" onClick={onGoFavorites} aria-label="Go to favorites">
            Favorites
          </button>
        </div>
      </div>

      {loading && <div className="notice noticeLoading">Loading recipe…</div>}
      {error && <div className="notice noticeError">Error: {error}</div>}

      {!loading && !error && recipe && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: 320, objectFit: 'cover' }} />
          <div style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em' }}>{recipe.title}</div>
                <div style={{ marginTop: 6, color: 'var(--secondary)' }}>{recipe.category}</div>
              </div>

              <button
                className="pillButton"
                onClick={toggleFavorite}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                style={{
                  borderColor: isFavorite ? 'rgba(239, 68, 68, 0.35)' : 'var(--border)',
                  color: isFavorite ? 'var(--error)' : 'inherit',
                }}
              >
                {isFavorite ? '♥ Favorited' : '♡ Add Favorite'}
              </button>
            </div>

            <p style={{ marginTop: 12, marginBottom: 10, color: 'var(--secondary)', lineHeight: 1.5 }}>
              {recipe.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontWeight: 700 }}>Community rating</div>
                <div style={{ color: 'var(--secondary)' }}>
                  {recipe.rating_avg} avg • {recipe.rating_count} rating{recipe.rating_count === 1 ? '' : 's'}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontWeight: 700 }}>Your rating {ratingSaving ? '(saving...)' : ''}</div>
                <RatingStars value={myRating} onRate={rate} />
              </div>
            </div>

            <hr style={{ margin: '18px 0', border: 'none', borderTop: '1px solid var(--border)' }} />

            <h2 style={{ margin: '0 0 10px' }}>Ingredients</h2>
            <IngredientChips ingredients={recipe.ingredients} />

            <h2 style={{ margin: '18px 0 10px' }}>Steps</h2>
            <ol style={{ margin: 0, paddingLeft: 18, color: 'var(--secondary)', lineHeight: 1.6 }}>
              {recipe.steps.map((s, idx) => (
                <li key={idx} style={{ marginBottom: 8 }}>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
