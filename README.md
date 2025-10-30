# Vibe Commerce

A lightweight e-commerce demo application (frontend + backend) built with React and Node.js/Express. This repository contains two main folders:

- `backend/` — Express API, MongoDB models and routes
- `frontend/` — React app (SPA) that consumes the backend API

This README explains how to set up, run, and upload the project to GitHub. All commands are written for Windows PowerShell (adjust slightly for other shells).

---

## Table of contents

- Project overview
- Prerequisites
- Install dependencies
- Environment variables
- Run locally (backend + frontend)
- Seed sample products
- How the app works (brief)
- Useful scripts
- Styling and UX libraries used
- How to push to GitHub
- Contributing
- License

---

## Project overview

Vibe Commerce is a simple e-commerce demo used for learning and demos. The backend exposes REST endpoints for products, cart and orders. The frontend is a React single-page app that shows products, lets users add items to cart and checkout.

Files of interest (top-level):

- `backend/server.js` — Express server entrypoint
- `backend/database.js` — Mongoose schemas (Product, Order)
- `backend/routes/products.js` — products API (includes a `POST /init` route to create sample products)
- `frontend/src/` — React source (App, components, api helpers)

---

## Prerequisites

Install these on your development machine before continuing:

- Node.js (LTS recommended). Download: https://nodejs.org/
  - Check: `node --version` and `npm --version`
- MongoDB Community Edition (or use a hosted MongoDB like Atlas)
  - Download: https://www.mongodb.com/try/download/community
  - Or create a free cluster at https://www.mongodb.com/cloud/atlas
- (Optional) Git: https://git-scm.com/

Notes for Windows PowerShell users
- If you encounter a script execution policy error while running npm scripts, open PowerShell as Administrator and run:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

This allows the included npm wrapper scripts to run.

---

## Install dependencies

Open two PowerShell windows/tabs (one for backend, one for frontend). All commands below assume your repository root is:

`c:\Users\<you>\OneDrive\Desktop\vibe-commerce\vibe-commerce`

Backend:

```powershell
cd "c:\Users\anilr\OneDrive\Desktop\vibe-commerce\vibe-commerce\backend"
npm install
```

Frontend:

```powershell
cd "c:\Users\anilr\OneDrive\Desktop\vibe-commerce\vibe-commerce\frontend"
npm install
# (if react-toastify and AOS were not yet installed)
npm install react-toastify aos
```

If PowerShell blocks `npm` execution, you can run the `Set-ExecutionPolicy` command above or run the commands in Command Prompt.

---

## Environment variables

Create a `.env` file in the `backend/` folder and add the following variables (example):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vibe-commerce
JWT_SECRET=your_jwt_secret_here  # if authentication is added later
```

If using MongoDB Atlas, set `MONGODB_URI` to your Atlas connection string.

Never commit `.env` to GitHub. Add `.env` to `.gitignore` (it probably already is).

---

## Run the project locally

Start MongoDB (if running locally). Example (Windows):

```powershell
# If you installed MongoDB as a service it may already be running.
# To run mongod manually (example path):
"C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe" --dbpath "C:\data\db"
```

Start the backend server:

```powershell
cd "c:\Users\anilr\OneDrive\Desktop\vibe-commerce\vibe-commerce\backend"
npm start
# or for development with auto restart (if nodemon is installed):
npm run dev
```

Start the frontend dev server:

```powershell
cd "c:\Users\anilr\OneDrive\Desktop\vibe-commerce\vibe-commerce\frontend"
npm start
```

Frontend default: http://localhost:3000
Backend default: http://localhost:5000 (or value in `PORT`)

---

## Seed sample products (one-time)

The backend includes a seed route that inserts a set of sample products into the database. Use this once after the backend is running.

Using curl (PowerShell):

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/products/init" -Method Post
```

Or use a browser / tool like Postman to POST to:

```
POST http://localhost:5000/api/products/init
```

This will wipe existing products and insert example items (Mobiles, Laptops, Accessories, Home Appliances).

---

## How the app works (brief)

- The frontend calls endpoints under `/api` (e.g. `/api/products`) using an API helper `frontend/src/api.js`.
- Products are displayed in a responsive grid. Categories can be filtered on the frontend.
- When a user adds an item to the cart, the UI shows a toast notification (using `react-toastify`) and the item is added directly (no confirmation alert).
- Animations are provided by AOS (`aos` package) to make the UI more engaging.

---

## Useful scripts (where to run them)

Backend (`backend/`):

- `npm start` — run server (production mode)
- `npm run dev` — run server with `nodemon` (development)

Frontend (`frontend/`):

- `npm start` — start React dev server
- `npm run build` — build production bundle
- `npm test` — run tests (if any present)

---

## Pushing to GitHub (simple steps)

1. Create a new repository on GitHub (do not add a README there if you will push this one).
2. From your local repo root (the folder that contains `backend/` and `frontend/`), run:

```powershell
cd "c:\Users\anilr\OneDrive\Desktop\vibe-commerce\vibe-commerce"
# initialize git (if not already initialized)
git init
# add origin (replace <your-remote-url>)
git remote add origin https://github.com/<your-username>/<repo-name>.git
# stage files
git add .
# commit
git commit -m "Initial commit: Vibe Commerce"
# push to main (first push)
git branch -M main
git push -u origin main
```

Notes
- Ensure large unneeded folders (like `node_modules/`) are in `.gitignore`. Typically both `backend/node_modules` and `frontend/node_modules` should be ignored — if they are not, add them to `.gitignore`.

---

## Recommended next steps / improvements

- Add user authentication (JWT)
- Add product images and an image hosting strategy (S3 or Cloudinary)
- Add CI (GitHub Actions) to run lint/tests on push
- Add end-to-end tests (Cypress)
- Add pagination and server-side filtering for products

---

## Contributing

Contributions are welcome. Please open an issue to propose a change, then make a branch and open a pull request.

Branching rule suggestion:
- `main` — production-ready
- `dev` — integration
- feature branches: `feature/<short-description>`

---

## License

This project does not include an explicit license file. If you plan to publish it publicly, add a `LICENSE` file (MIT or similar) and update this section.

---

## Contact / Support

If you need help setting this up on your machine, share the exact error messages and I can help debug.


 
