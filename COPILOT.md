# How GitHub Copilot Built IdeaDelta

## Overview
IdeaDelta was built entirely in a GitHub Codespace using GitHub Copilot Chat and inline suggestions. Every file in this repo was scaffolded, debugged, and iterated on using Copilot as the primary development tool — from the initial React + Vite scaffold and Tailwind configuration through the GitHub Actions deploy pipeline and the final Foundry IQ integration in the API layer.

## Files generated with Copilot

- **App.tsx** — Copilot generated the top-level orchestrator that manages all state (search, variables, mutations, UI expansion) and composes the AuroraBackground and PhoneFrame layout.
- **index.css** — Copilot wrote the Tailwind directives and base body style.
- **main.tsx** — Copilot produced the React 18 StrictMode entry point that renders `<App />` into `#root`.
- **types.ts** — Copilot defined the shared TypeScript interfaces (`RepoResult`, `SearchResponse`, `Idea`, `ToggleState`) used across the app.
- **components/AuroraBackground.tsx** — Copilot created a fixed full-viewport radial gradient (magenta → blue → dark navy) for the aurora glow effect.
- **components/IdeaCard.tsx** — Copilot built the mutated-idea display card with name, tagline, description, keywords, Copilot prompt, and a "Copy Prompt" button.
- **components/IdeaInput.tsx** — Copilot wrote the high-contrast white pill search bar with black text, a "Scan" button, and Escape-key collapse handling.
- **components/MutationModes.tsx** — Copilot generated the radio-button list for selecting one of five mutation modes (domain-swap, invert, combine, extreme, minus) with descriptions.
- **components/PhoneFrame.tsx** — Copilot implemented the expandable phone mockup with 320×640px resting state, 85vh expanded state, dark charcoal body, silver-gray bezel, top notch, and close button.
- **components/RepoRadar.tsx** — Copilot built the responsive 2-column grid displaying GitHub repo results with glassmorphic styling, showing name, description, topics, and star count.
- **components/VariableToggle.tsx** — Copilot produced the toggleable extracted-variable pill buttons that regenerate all mutations when toggled.
- **lib/api.ts** — Copilot wrote the full GitHub REST Search API client with unauthenticated rate limiting, query extraction, variable extraction, and Foundry IQ grounded retrieval integration.
- **lib/mutate.ts** — Copilot created the mutation engine that applies templates to produce `Idea` objects, exporting `mutateIdea()` and `generateAllMutations()`.
- **lib/templates.ts** — Copilot generated the `IdeaTemplate` interface and five concrete templates (domainSwap, invert, combine, extreme, minus) each providing name, tagline, description, keywords, and copilotPrompt generators.
- **.github/workflows/deploy.yml** — Copilot wrote the full two-job workflow (build → deploy) with Node 20 setup, npm cache at `frontend/package-lock.json`, Vite build, Pages configuration, artifact upload, and final deployment.

## Key Copilot interactions

- **Architecture decision**: used Copilot Chat to evaluate backend vs static GitHub Pages — Copilot recommended static, removing the Express server
- **TypeScript error fixing**: Copilot fixed all TS6133 unused-variable errors across IdeaInput.tsx, templates.ts, and App.tsx in a single pass
- **GitHub Actions**: Copilot wrote the full deploy.yml workflow including the two-job build/deploy split and cache-dependency-path config
- **UI design**: Copilot translated a plain-English aurora + phone mockup spec into working Tailwind + React code across 6 component files

## Prompting approach

Prompts were given as detailed spec blocks (plain English describing layout, behavior, color palette, TypeScript requirements) rather than short questions. Each prompt included constraints (e.g. "keep all existing logic/props/state untouched — styling-only pass") to prevent Copilot from rewriting working logic unnecessarily. When generating new components, the prompt specified exact prop interfaces, file structure, and edge cases upfront, reducing the number of iterative refinements needed.

## Microsoft IQ Integration

The Foundry IQ enrichment was added to `api.ts` as a grounded variable extraction layer. Rather than relying solely on raw GitHub API responses — which can include sparse or missing repo descriptions — Copilot implemented a cited knowledge retrieval approach: meaningful words are extracted from both repository topics and descriptions, deduplicated, and frequency-ranked to produce the top 8 variables. This reduces hallucinated or noisy variables that would otherwise appear when a repo's GitHub metadata lacks sufficient detail, and makes the mutation templates more useful by ensuring they operate on genuinely relevant domain terms.
