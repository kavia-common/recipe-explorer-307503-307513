import React, { useEffect, useMemo, useState } from 'react';
import { CategoryNav } from '../components/CategoryNav';
import { PaginationControls } from '../components/PaginationControls';
import { RecipeCard } from '../components/RecipeCard';
import { SearchBar } from '../components/SearchBar';
import { listCategories, listRecipes, addFavorite, removeFavorite } from '../api/recipes';
import { loadFavoriteIds, saveFavoriteIds } from '../utils/favoritesStorage';

// PUBLIC_INTERFACE
export function HomePage({ onOpenRecipe, onGoFavorites, favoritesCount }) {
  /** Home page: browse recipes with search/category/ingredient filters. */
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [query, setQuery] = useState('');
  const [ingredientTokens, setIngredientTokens] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [favoriteIds, setFavoriteIds] = useState(() => loadFavoriteIds());

  const ingredientCsv = useMemo(() => ingredientTokens.join(','), [ingredientTokens]);

  useEffect(() => {
    let mounted = true;
    listCategories()
      .then(cats => mounted && setCategories(cats))
      .catch(() => {
        // non-blocking
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    saveFavoriteIds(favoriteIds);
  }, [favoriteIds]);

  useEffect(() => {
    setLoading(true);
    setError('');
    listRecipes({ page, limit, q: query || undefined, category: activeCategory || undefined, ingredients: ingredientCsv || undefined })
      .then(res => setData(res))
      .catch(err => setError(err.message || 'Failed to load recipes'))
      .finally(() => setLoading(false));
  }, [page, limit, query, activeCategory, ingredientCsv]);

  const toggleFavorite = async recipeId => {
    const isFav = favoriteIds.includes(recipeId);
    // optimistic
    const next = isFav ? favoriteIds.filter(id => id !== recipeId) : [...favoriteIds, recipeId];
    setFavoriteIds(next);

    try {
      if (isFav) await removeFavorite(recipeId);
      else await addFavorite(recipeId);
    } catch (e) {
      // revert on failure
      setFavoriteIds(favoriteIds);
    }
  };

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Recipe Explorer</h1>
          <div className="muted">Browse, search, and save your favorites</div>
        </div>
        <button className="pillButton pillButtonPrimary" onClick={onGoFavorites} aria-label="Go to favorites">
          Favorites ({favoritesCount})
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
        <SearchBar
          value={query}
          onChange={val => {
            setPage(1);
            setQuery(val);
          }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <CategoryNav
          categories={categories}
          active={activeCategory}
          onSelect={name => {
            setPage(1);
            setActiveCategory(name);
          }}
        />
      </div>

      <div className="notice" style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Ingredient filter</div>
        <div className="muted" style={{ marginBottom: 8 }}>
          Add comma-separated ingredients. Matches recipes that contain any token.
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            value={ingredientTokens.join(',')}
            onChange={e => {
              const nextTokens = e.target.value
                .split(',')
                .map(s => s.trim())
                .filter(Boolean);
              setPage(1);
              setIngredientTokens(nextTokens);
            }}
            placeholder="e.g. garlic, lemon"
            aria-label="Ingredients filter"
            style={{
              flex: 1,
              minWidth: 220,
              borderRadius: 12,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              padding: '10px 12px',
              outline: 'none',
            }}
          />
          <button
            className="pillButton"
            onClick={() => {
              setPage(1);
              setIngredientTokens([]);
            }}
            aria-label="Clear ingredients"
            disabled={ingredientTokens.length === 0}
            style={{ opacity: ingredientTokens.length ? 1 : 0.5 }}
          >
            Clear
          </button>
        </div>
      </div>

      {loading && <div className="notice noticeLoading">Loading recipes…</div>}
      {error && <div className="notice noticeError">Error: {error}</div>}

      {!loading && !error && data && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0', color: 'var(--secondary)' }}>
            <span>
              Showing <strong>{data.items.length}</strong> of <strong>{data.total}</strong>
            </span>
          </div>

          <div className="grid">
            {data.items.map(r => (
              <div key={r.id} className="gridCol">
                <RecipeCard
                  recipe={r}
                  isFavorite={favoriteIds.includes(r.id)}
                  onToggleFavorite={() => toggleFavorite(r.id)}
                  onOpen={() => onOpenRecipe(r.id)}
                />
              </div>
            ))}
          </div>

          <PaginationControls page={data.page} totalPages={data.total_pages} onPage={p => setPage(p)} />
        </>
      )}
    </div>
  );
}
