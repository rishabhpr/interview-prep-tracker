# 🎯 Interview Prep Tracker

Modern, extensible tracking app for senior backend engineer interview preparation.

## Features

- **DSA** — Track problems by category (Arrays, Trees, DP, Graphs...) with difficulty tags
- **System Design** — Organize topics (Fundamentals, Storage, Distributed Systems...)
- **Kubernetes** — Track concepts from Core to Advanced
- **Daily Log** — Log study sessions, track streaks, see weekly progress
- **Extensible** — Add new tabs in one file

## Quick Start

```bash
npm install
npm run dev    # http://localhost:3456
```

## Adding a New Tab

Edit `src/config/tabs.js` and add an entry:

```js
{
  id: 'my-topic',
  label: 'My Topic',
  icon: '🚀',
  type: 'checklist',    // 'checklist' or 'daily'
  showDifficulty: false,
  categories: [
    { id: 'cat-1', name: 'Category 1' },
    { id: 'cat-2', name: 'Category 2' },
  ],
}
```

That's it. The app renders it automatically.

## Data

All data lives in `localStorage`. Export/import coming soon.

## Deploy

```bash
npm run build          # Build to dist/
npx serve dist -l 3456 # Serve on port 3456
```

## Tech Stack

- React 19 + Vite
- Tailwind CSS
- localStorage persistence
