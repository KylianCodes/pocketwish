# PocketWish

> Create and share wishlists instantly — no account, no backend, just a URL.

**[Live demo](https://kyliancodes.github.io/pocketwish/)**

---

## How it works

Everything lives in the URL. Your wishlist is compressed and encoded directly into the page hash — share the link, and the recipient sees your exact list. No server, no database, no tracking.

## Features

- **Multiple wishlists** — organize by occasion, person, or category
- **URL sharing** — one link contains everything, compressed with LZ-String
- **Optional: links** — attach a URL to any wish
- **Optional: priority** — mark wishes as low, medium, or high priority
- **Stateless** — close the tab and reopen the URL, everything's still there

## Getting started

Requires [Docker](https://www.docker.com) and [Docker Compose](https://docs.docker.com/compose/).

```bash
docker compose up
```

App available at http://localhost:5173/pocketwish/

## Tech stack

| Tool | Role |
|---|---|
| [Vue 3](https://vuejs.org) | UI framework |
| [Vite](https://vite.dev) | Build tool |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [LZ-String](https://github.com/pieroxy/lz-string) | URL compression |

## Deployment

Deployed automatically to GitHub Pages on every push to `main` via GitHub Actions.
