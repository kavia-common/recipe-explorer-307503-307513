const KEY = 'recipeExplorer.favorites';

// PUBLIC_INTERFACE
export function loadFavoriteIds() {
  /** Load favorites from localStorage as an array of recipe ids. */
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(Number).filter(n => Number.isFinite(n));
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function saveFavoriteIds(ids) {
  /** Save favorites to localStorage. */
  localStorage.setItem(KEY, JSON.stringify(Array.from(new Set(ids.map(Number)))));
}
