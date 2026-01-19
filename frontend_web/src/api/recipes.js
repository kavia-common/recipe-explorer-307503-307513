import { apiFetch } from './client';
import { config } from '../config';

// PUBLIC_INTERFACE
export function listRecipes({ page = 1, limit = 12, q, category, ingredients, sort = 'rating' } = {}) {
  /** List recipes with filters. */
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  if (ingredients) params.set('ingredients', ingredients);
  if (sort) params.set('sort', sort);
  return apiFetch(`/recipes?${params.toString()}`);
}

// PUBLIC_INTERFACE
export function getRecipe(recipeId) {
  /** Fetch recipe detail. */
  return apiFetch(`/recipes/${recipeId}`);
}

// PUBLIC_INTERFACE
export function listCategories() {
  /** List categories. */
  return apiFetch('/categories');
}

// PUBLIC_INTERFACE
export function listRecipesByCategory(categoryName, { page = 1, limit = 12, sort = 'rating' } = {}) {
  /** List recipes for a category. */
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  params.set('sort', sort);
  return apiFetch(`/categories/${encodeURIComponent(categoryName)}/recipes?${params.toString()}`);
}

// PUBLIC_INTERFACE
export function searchByIngredients(includeCsv, { page = 1, limit = 12, sort = 'rating' } = {}) {
  /** Search recipes requiring all ingredients. */
  const params = new URLSearchParams();
  params.set('include', includeCsv);
  params.set('page', String(page));
  params.set('limit', String(limit));
  params.set('sort', sort);
  return apiFetch(`/ingredients/search?${params.toString()}`);
}

// PUBLIC_INTERFACE
export function listFavorites() {
  /** List favorites for mock user. */
  const params = new URLSearchParams();
  params.set('user_id', config.mockUserId);
  return apiFetch(`/favorites?${params.toString()}`);
}

// PUBLIC_INTERFACE
export function addFavorite(recipeId) {
  /** Add favorite for mock user. */
  const params = new URLSearchParams();
  params.set('user_id', config.mockUserId);
  return apiFetch(`/favorites?${params.toString()}`, { method: 'POST', body: { recipe_id: recipeId } });
}

// PUBLIC_INTERFACE
export function removeFavorite(recipeId) {
  /** Remove favorite for mock user. */
  const params = new URLSearchParams();
  params.set('user_id', config.mockUserId);
  return apiFetch(`/favorites/${recipeId}?${params.toString()}`, { method: 'DELETE' });
}

// PUBLIC_INTERFACE
export function upsertRating(recipeId, rating) {
  /** Upsert rating for mock user. */
  const params = new URLSearchParams();
  params.set('user_id', config.mockUserId);
  return apiFetch(`/ratings/${recipeId}?${params.toString()}`, { method: 'PUT', body: { rating } });
}
