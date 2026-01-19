import React, { useEffect, useMemo, useState } from 'react';
import { getRecipe, removeFavorite } from '../api/recipes';
import { PaginationControls } from '../components/PaginationControls';
import { RecipeCard } from '../components/RecipeCard';
import { loadFavoriteIds, saveFavoriteIds } from '../utils/favoritesStorage';

// PUBLIC_INTERFACE
export function FavoritesPage({ onOpenRecipe, onBack }) {
  /** Favorites list page. */
  const [favoriteIds, setFavoriteIds] = useState(() => loadFavoriteIds());
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => saveFavoriteIds(favoriteIds), [favoriteIds]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    const ids = favoriteIds;
    Promise.all(ids.map(id => getRecipe(id).catch(() => null)))
      .then(results => {
        if (!mounted) return;
        setRecipes(results.filter(Boolean));
      })
      .catch(err => {
        if (!mounted) return;
        setError(err.message || 'Failed to load favorites');
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [favoriteIds]);

  const totalPages = useMemo(() => Math.ceil(recipes.length / limit) || 1, [recipes.length]);
  const pageItems = useMemo(() => recipes.slice((page - 1) * limit, (page - 1) * limit + limit), [recipes, page]);

  const remove = async recipeId => {
    const next = favoriteIds.filter(id => id !== recipeId);
    setFavoriteIds(next);
    try {
      await removeFavorite(recipeId);
    } catch {
      setFavoriteIds(favoriteIds);
    }
  };

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Favorites</h1>
          <div className="muted">Your saved recipes (stored locally)</div>
        </div>
        <button className="pillButton" onClick={onBack} aria-label="Back to home">
          Back
        </button>
      </div>

      {loading && <div className="notice noticeLoading">Loading favorites…</div>}
      {error && <div className="notice noticeError">Error: {error}</div>}

      {!loading && !error && favoriteIds.length === 0 && (
        <div className="notice">No favorites yet. Browse recipes and tap ♡ to save.</div>
      )}

      {!loading && !error && pageItems.length > 0 && (
        <>
          <div className="grid">
            {pageItems.map(r => (
              <div key={r.id} className="gridCol">
                <RecipeCard
                  recipe={r}
                  isFavorite
                  onToggleFavorite={() => remove(r.id)}
                  onOpen={() => onOpenRecipe(r.id)}
                />
              </div>
            ))}
          </div>
          <PaginationControls page={page} totalPages={totalPages} onPage={p => setPage(p)} />
        </>
      )}
    </div>
  );
}
