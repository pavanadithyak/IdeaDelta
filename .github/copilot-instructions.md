# IdeaDelta — Copilot Context

## Project Overview

**IdeaDelta** is a tool that takes a plain-English project idea, searches GitHub for similar repositories via a backend proxy, extracts "variables" (recurring patterns, techniques, and topics from those repositories), and mutates those variables into novel project ideas. Each generated idea includes a name, tagline, description, keywords, and a ready-to-paste GitHub Copilot prompt for building that idea.

## Architecture

- **Backend** (`backend/`): A small Express + TypeScript API that proxies GitHub's REST Search API to keep a personal access token server-side. Exposes `GET /api/search?q=` returning JSON shaped as `{ repos: RepoResult[], variables: string[] }` where `RepoResult = { name: string, description: string, url: string, topics: string[], stars: number }`.
- **Frontend** (`frontend/`): A React + Vite + TypeScript + Tailwind app with no other backend dependencies. Consumes the backend search API and implements a five-mode mutation engine to generate novel project ideas.

## Coding Conventions

- TypeScript strict mode enabled everywhere
- Functional React components with hooks (no class components)
- Tailwind utility classes only (no custom CSS files beyond `index.css` base layer)
- Named exports preferred except for React components and Express routers (default exports)
- Async functions and error handling with try/catch
- JSDoc comments on public functions and exports

## API Contract

- **Endpoint**: `GET /api/search?q=<query>`
- **Response**: `{ repos: RepoResult[], variables: string[] }`
- **RepoResult**: `{ name: string, description: string, url: string, topics: string[], stars: number }`

## Important Notes

- Do not commit `.env` files. GitHub personal access token goes in `backend/.env` as `GITHUB_TOKEN` with "public_repo" scope to increase rate limits from 10 to 30 requests/minute.
- Frontend dev server proxies `/api` requests to `http://localhost:3001` during development via Vite config.
- Mutation modes: "domain" (swap domain), "invert" (reverse logic), "combine" (merge two variables), "extreme" (scale or simplify), "minus" (remove a constraint).
