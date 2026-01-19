import React, { useMemo, useState } from 'react';
import './styles/theme.css';
import './styles/app.css';

import { HomePage } from './pages/HomePage';
import { RecipeDetailPage } from './pages/RecipeDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { loadFavoriteIds } from './utils/favoritesStorage';

// PUBLIC_INTERFACE
function App() {
  /** Simple app router without external dependencies. */
  const [route, setRoute] = useState({ name: 'home', recipeId: null });

  const favoritesCount = useMemo(() => loadFavoriteIds().length, [route]);

  const goHome = () => setRoute({ name: 'home', recipeId: null });
  const goFavorites = () => setRoute({ name: 'favorites', recipeId: null });
  const openRecipe = id => setRoute({ name: 'detail', recipeId: id });

  return (
    <div className="appShell">
      <div className="topNav">
        <div className="container">
          <div className="topNavInner">
            <div className="brand" role="banner">
              <div className="brandTitle">Recipe Explorer</div>
              <div className="brandBadge">Light</div>
            </div>

            <div className="navRow">
              <div className="navRight">
                <button className="pillButton" onClick={goHome} aria-label="Home">
                  Home
                </button>
                <button className="pillButton pillButtonPrimary" onClick={goFavorites} aria-label="Favorites">
                  Favorites ({favoritesCount})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="main">
        {route.name === 'home' && (
          <HomePage onOpenRecipe={openRecipe} onGoFavorites={goFavorites} favoritesCount={favoritesCount} />
        )}

        {route.name === 'detail' && (
          <RecipeDetailPage recipeId={route.recipeId} onBack={goHome} onGoFavorites={goFavorites} />
        )}

        {route.name === 'favorites' && <FavoritesPage onOpenRecipe={openRecipe} onBack={goHome} />}
      </main>
    </div>
  );
}

export default App;
