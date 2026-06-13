# IdeaDelta

**Tagline:** Describe an idea. See what already exists. Build what doesn't.

## What it does

IdeaDelta helps you explore your project ideas by searching GitHub for similar repositories, extracting common patterns and topics, and generating mutated versions of your idea in different ways. Whether you want to swap domains, invert the concept, combine ideas, scale to extremes, or strip it down to essentials, IdeaDelta helps you discover unexplored directions.

## Live demo

🚀 **Coming soon:** https://pavanadithyak.github.io/IdeaDelta/

(This link will work after the first deploy to GitHub Pages)

## Project structure

This is a **static frontend application** with no backend:

```
frontend/
├── src/
│   ├── components/      # React components
│   ├── lib/             # API, mutations, templates
│   ├── App.tsx          # Main app
│   ├── main.tsx         # Entry point
│   └── types.ts         # TypeScript types
├── vite.config.ts       # Build config
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies
```

## Getting started in Codespaces

1. **Open in Codespaces** — dependencies install automatically on container creation
2. **Run the dev server:**
   ```bash
   cd frontend
   npm run dev
   ```
   Opens on `http://localhost:5173`
3. **Type an idea and click "Scan"** — the app calls the GitHub REST Search API directly from your browser (no environment variables or API keys needed)

## Deployment

This repo deploys automatically to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main`.

**One-time setup:**

- Go to your repo **Settings → Pages**
- Set **Source** to "GitHub Actions"

**First deploy:**

- Push to `main` and wait for the GitHub Actions workflow to complete (usually 1-2 minutes)
- Your site will be live at `https://<username>.github.io/IdeaDelta/`

## How mutation works

IdeaDelta extracts "variables" (topics and keywords from similar repos) and lets you mutate your idea in five ways:

1. **Domain Swap** — Replace one domain/context with another
2. **Invert** — Reverse the logic or flip the constraint
3. **Combine** — Merge two variables into a hybrid idea
4. **Extreme** — Scale the idea up dramatically or simplify it down
5. **Minus** — Remove a key constraint or feature

Each mutation generates a new name, tagline, description, keywords, and a ready-to-use Copilot prompt.

## Tech stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **API**: GitHub REST Search API (called directly from browser, no backend)
- **Hosting**: GitHub Pages (free, zero maintenance)
- **Deployment**: GitHub Actions workflow on push to `main`

## Rate limits

The GitHub REST Search API allows **10 requests per minute** for unauthenticated requests. This is sufficient for normal interactive use — that's one search every 6 seconds. If you hit the rate limit, wait a minute and try again.

## License

MIT
