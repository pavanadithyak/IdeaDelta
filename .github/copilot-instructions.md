# IdeaDelta — Copilot Context

## Project Overview

**IdeaDelta** is a static web app that takes a project idea, searches GitHub directly (client-side, no backend) for similar repos via the GitHub REST Search API, extracts "variables" (recurring patterns and topics from those repos), and mutates them into new project ideas with a name, tagline, description, keywords, and a Copilot prompt for building that idea.

## Architecture

- **Static Frontend** (`frontend/`): A React + Vite + TypeScript + Tailwind app with NO backend. All logic, including GitHub API calls, runs in the browser.
- **Hosting**: Deployed to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main`.
- **API**: Calls `https://api.github.com/search/repositories` directly from the browser (unauthenticated, 10 requests/minute limit — sufficient for single-user interactive use).

**Note:** There is no `.env` file and no backend folder. If GitHub API rate limits ever become a real problem, the recommended fix is a small Cloudflare Worker proxy — not a Node/Express server.

## Coding Conventions

- TypeScript strict mode enabled everywhere
- Functional React components with hooks (no class components)
- Tailwind utility classes only (no custom CSS files beyond `index.css` base layer)
- Named exports preferred except for React components (default exports)
- Async functions and error handling with try/catch
- JSDoc comments on public functions and exports

## API Contract

- **Function**: `searchIdeas(query: string): Promise<SearchResponse>`
- **Calls**: `https://api.github.com/search/repositories?q=<query>&sort=stars&order=desc&per_page=6`
- **Response**: `{ repos: RepoResult[], variables: string[] }`
- **RepoResult**: `{ name: string, description: string, url: string, topics: string[], stars: number }`
- **Authentication**: None. This is intentional — do not add a GitHub token to client-side code under any circumstances, as it would be exposed to anyone viewing the deployed site.

## Important Security Note

- Do not commit `.env` files or add authentication tokens to the frontend code.
- The GitHub API's unauthenticated rate limit (10 requests/minute) is sufficient for normal interactive use.

## Mutation Modes

The five mutation modes transform an idea by altering the extracted variables:
1. **Domain swap**: Replace one domain/context with another
2. **Invert**: Reverse the logic or flip the constraint
3. **Combine**: Merge two variables into a hybrid idea
4. **Extreme**: Scale the idea up dramatically or simplify it down
5. **Minus**: Remove a key constraint or feature
