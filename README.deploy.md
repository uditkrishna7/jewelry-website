# Deployment / Run instructions

This repository contains a small Express + SQLite website. Follow these steps to run locally or deploy to a host like Render / Heroku.

## Local (recommended quick start)
1. Install dependencies:

```powershell
# from project root (Windows PowerShell)
cmd /c npm install
```

2. Initialize the SQLite database (creates `server/db/database.sqlite` and seeds example products):

```powershell
node server/init-db.js
```

3. Start the server:

```powershell
npm start
# or
node server/app.js
```

4. Open in browser:
- Home: http://localhost:3000/
- Product page example: http://localhost:3000/product.html?id=101
- API: http://localhost:3000/api/products

## Deploying to Render / Heroku / Railway
- Render (recommended for full app):
  - Create a new Web Service, connect the GitHub repo.
  - Build command: `npm install`
  - Start command: `node server/app.js`
  - (Optional) After first deploy, use the Web Shell to run `node server/init-db.js` once to create and seed the SQLite DB.

- Heroku:
  - Push the repo and ensure `Procfile` exists (this repo includes one).
  - After deploy, run `heroku run node server/init-db.js` once to initialize the DB.

Notes:
- The app uses a SQLite DB file at `server/db/database.sqlite`. On some hosts, filesystem changes are ephemeral; for production you should use a managed DB (Postgres) and adapt `server/db/queries.js` accordingly.
- Avoid binary dependencies like `sharp` for simple demos to keep builds fast.

## Next recommended steps before public demo
- Add HTTPS-ready environment setup and CORS if you host frontend separately.
- Create a small admin user migration and secure credentials.
- Optionally add a persistent DB (Postgres) or a small hosted DB for production.
