# PhaserGame — Phaser 4 + Vite + TypeScript template

A minimal, best-practice "Hello World" starter for [Phaser 4](https://phaser.io/)
using [Vite](https://vite.dev/) and TypeScript. Clone/copy this folder as the
starting point for new games.

## Stack

| Tool       | Version | Purpose                          |
| ---------- | ------- | -------------------------------- |
| Phaser     | ^4.2.1  | Game framework (bundled TS types) |
| Vite       | ^8.x    | Dev server + bundler             |
| TypeScript | ^7.x    | Type checking                    |

## Getting started

```bash
npm install       # install dependencies (run once)
npm run dev       # start the Vite dev server at http://localhost:8080
```

`npm run dev` is the **recommended** workflow: it compiles TypeScript on the
fly, hot-reloads on save, and serves working source maps for debugging.

## Scripts

| Script              | What it does                                              |
| ------------------- | -------------------------------------------------------- |
| `npm run dev`       | Start Vite dev server with hot-reload (port 8080).       |
| `npm run build`     | Type-check, then bundle to `dist/`.                      |
| `npm run preview`   | Serve the production `dist/` build locally.              |
| `npm run typecheck` | Run the TypeScript type checker only.                    |

## Using the "Live Server" VS Code extension

Live Server serves **static files** — it does not compile TypeScript. So build
first, then point Live Server at the output:

```bash
npm run build
```

Then right-click **`dist/index.html`** → **"Open with Live Server"**. Because
`vite.config.ts` sets `base: './'`, the built bundle uses relative paths and
runs correctly under Live Server.

> For day-to-day development, `npm run dev` is smoother (instant hot-reload, no
> rebuild step). Use Live Server when you specifically want to debug the
> production build.

## Project structure

```
PhaserGame/
├── index.html            # Page host for the game canvas
├── vite.config.ts        # Vite + build config (relative base, phaser chunk)
├── tsconfig.json         # Strict TypeScript config (type-check only)
├── public/
│   └── assets/           # Static assets — copied to build root as-is
└── src/
    ├── main.ts           # Game config + entry point
    └── scenes/
        ├── Boot.ts       # Boots first; loads assets for the Preloader
        ├── Preloader.ts  # Loads game assets with a progress bar
        └── MainScene.ts  # Hello World gameplay — replace this
```

## Adding assets

Drop files into `public/assets/` and load them in `Preloader.ts`:

```ts
this.load.setPath('assets');
this.load.image('logo', 'logo.png');
```

Then use them in a scene: `this.add.image(400, 300, 'logo');`

## Notes

- Phaser 4 ships its own TypeScript definitions, so no `@types/phaser` package
  is needed.
- The game renders with `Phaser.AUTO` (WebGL with Canvas fallback) and scales
  with `Scale.FIT` + `CENTER_BOTH`, so it fits any window while keeping the
  1280×720 design resolution.
