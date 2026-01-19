# Recipe Explorer - Frontend (React)

Modern lightweight React UI for browsing recipes, searching, filtering, saving favorites, and rating recipes.

## Run locally

From `frontend_web/`:

```bash
npm install
npm start
```

The preview system manages the dev server/port.

## Configuration

- API base URL (optional): `REACT_APP_API_BASE_URL`  
  Default: `http://localhost:3001`

## Features

- Browse recipes with pagination
- Search by query (title/description)
- Filter by category
- Filter by ingredients (comma-separated OR match)
- View recipe detail
- Favorites stored locally in `localStorage` (also calls backend favorites endpoints)
- Rate a recipe (optimistic UI; persists via backend ratings endpoints)
