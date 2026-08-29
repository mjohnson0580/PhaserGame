# PhaserGame — Phaser 4 + Vite + TypeScript template

[![Build](https://github.com/mjohnson0580/PhaserGame/actions/workflows/build.yml/badge.svg)](https://github.com/mjohnson0580/PhaserGame/actions/workflows/build.yml)
[![Release](https://github.com/mjohnson0580/PhaserGame/actions/workflows/release.yml/badge.svg)](https://github.com/mjohnson0580/PhaserGame/actions/workflows/release.yml)

A minimal, best-practice "Hello World" starter for [Phaser 4](https://phaser.io/)
using [Vite](https://vite.dev/) and TypeScript. Clone/copy this folder as the
starting point for new games.

## Start a new game from this template

Click **"Use this template"** on GitHub to create a new repository, clone it,
then run:

```bash
npm install
npm run setup   # rebrands the template to your game, then removes itself
npm run dev
```

`npm run setup` prompts for your game's name and automatically updates the
package name, window title, Tauri app identifier, README, and the CI badge /
GitHub Pages URLs — so you don't have to hand-edit them.

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

## Deploying the web build

`npm run build` produces a folder of static files in `dist/` — no server
runtime required, so it can be hosted anywhere (itch.io, Cloudflare Pages,
Netlify, Vercel, S3, etc.). `vite.config.ts` uses `base: './'` so the build
works from any path.

### GitHub Pages (automated)

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push
to `main`. **One-time setup:** in the repo, go to **Settings → Pages → Build and
deployment → Source** and select **"GitHub Actions"**. After the next push the
game is live at `https://mjohnson0580.github.io/PhaserGame/`.

## Desktop builds (Tauri)

The game can be packaged as a small native executable (`.exe`/`.msi` on Windows,
`.dmg` on macOS, AppImage/`.deb` on Linux) using [Tauri](https://tauri.app/),
which wraps the web build in the OS's native webview.

**Prerequisites (one-time):**

1. Install the [Rust toolchain](https://rustup.rs/):
   ```powershell
   winget install --id Rustlang.Rustup
   ```
   (Restart the shell afterwards so `cargo` is on PATH.)
2. Windows also needs the **Microsoft C++ Build Tools** and **WebView2** (the
   latter ships with Windows 11). See the
   [Tauri prerequisites](https://tauri.app/start/prerequisites/) for macOS/Linux.

**Commands:**

```bash
npm run tauri:dev     # run the game in a native window with hot-reload
npm run tauri:build   # produce a distributable installer/executable
```

Build output lands in `src-tauri/target/release/bundle/`. Tauri config lives in
`src-tauri/tauri.conf.json` (window size, app identifier, icons).

### Automated cross-platform releases

`.github/workflows/release.yml` builds installers for **Windows, macOS (Intel +
Apple Silicon), and Linux** and publishes them to a GitHub Release whenever you
push a version tag:

```bash
# bump "version" in package.json (the single source of truth — Tauri reads it
# via "version": "../package.json" in tauri.conf.json), then tag and push:
git tag v0.1.0
git push origin v0.1.0
```

The workflow creates a **draft** release with all platform installers attached —
review it, then publish from the repo's Releases page.

## Notes

- Phaser 4 ships its own TypeScript definitions, so no `@types/phaser` package
  is needed.
- The game renders with `Phaser.AUTO` (WebGL with Canvas fallback) and scales
  with `Scale.FIT` + `CENTER_BOTH`, so it fits any window while keeping the
  1280×720 design resolution.
