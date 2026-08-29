# PhaserGame — Phaser 4 + Vite + TypeScript template

[![Build](https://github.com/mjohnson0580/PhaserGame/actions/workflows/build.yml/badge.svg)](https://github.com/mjohnson0580/PhaserGame/actions/workflows/build.yml)
[![Release](https://github.com/mjohnson0580/PhaserGame/actions/workflows/release.yml/badge.svg)](https://github.com/mjohnson0580/PhaserGame/actions/workflows/release.yml)

A minimal, best-practice "Hello World" starter for [Phaser 4](https://phaser.io/)
using [Vite](https://vite.dev/) and TypeScript — a GitHub template repository to
spin up new games from.

## Start a new game from this template

Click **"Use this template"** on GitHub to create a new repository, clone it,
then run:

```bash
npm install
npm run setup   # rebrands the template to your game, then removes itself
npm run dev
```

`npm run setup` prompts for your game's name and author and automatically
updates the package name, window title, Tauri app identifier, LICENSE, README,
and the CI badge / GitHub Pages URLs — so you don't have to hand-edit them. It
detects your repo from git, so the new URLs point at _your_ GitHub repo.

## Stack

| Tool       | Version | Purpose                           |
| ---------- | ------- | --------------------------------- |
| Phaser     | ^4.2.1  | Game framework (bundled TS types) |
| Vite       | ^8.x    | Dev server + bundler              |
| TypeScript | ^7.x    | Type checking                     |

## Getting started

```bash
npm install       # install dependencies (run once)
npm run dev       # start the Vite dev server at http://localhost:8080
```

Node **22 or newer** is required (pinned in [`.nvmrc`](.nvmrc), which both CI and
`nvm use` read). The dev server also listens on your LAN address — the terminal
prints a `Network:` URL you can open on a phone on the same Wi-Fi to test touch
input and real mobile performance.

`npm run dev` is the **recommended** workflow: it compiles TypeScript on the
fly, hot-reloads on save, and serves working source maps for debugging.

## Scripts

| Script                  | What it does                                       |
| ----------------------- | -------------------------------------------------- |
| `npm run dev`           | Start Vite dev server with hot-reload (port 8080). |
| `npm run build`         | Type-check, then bundle to `dist/`.                |
| `npm run preview`       | Serve the production `dist/` build locally.        |
| `npm run typecheck`     | Run the TypeScript type checker only.              |
| `npm run test`          | Run the Vitest suite once (used in CI).            |
| `npm run test:watch`    | Re-run tests on change while developing.           |
| `npm run test:ui`       | Run tests in Vitest's browser UI.                  |
| `npm run test:coverage` | Run tests once and write a coverage report.        |
| `npm run format`        | Format the whole project with Prettier.            |
| `npm run format:check`  | Check formatting without writing (used in CI).     |

## Testing

Unit tests run on [Vitest](https://vitest.dev/), which reuses this project's
Vite pipeline so tests transform TypeScript exactly like the app does.

```bash
npm run test         # run once
npm run test:watch   # re-run on change
```

Test files use the `*.spec.ts` convention and live **alongside the code they
cover**. Phaser scenes want a real canvas/WebGL context, which headless test
runners don't have, so the template uses a **two-layer** strategy:

1. **Pure logic (most of your tests).** Keep game rules — scoring, movement,
   state — in plain functions/classes with no Phaser imports, and test them
   directly. See [`src/utils/math.ts`](src/utils/math.ts) and its spec. These are
   fast and rock-solid.
2. **Scene wiring (a thin layer).** Construct a scene and inject fake Phaser
   systems (`add`, `tweens`, `input`, …) to assert `create()` builds the right
   objects, without booting a real game. See
   [`src/scenes/MainScene.spec.ts`](src/scenes/MainScene.spec.ts).

[`test/setup.ts`](test/setup.ts) stubs the canvas 2D context jsdom lacks, so
`import Phaser from 'phaser'` doesn't throw. To boot an actual `Phaser.Game` in a
test, use the `Phaser.HEADLESS` renderer and add
[`vitest-canvas-mock`](https://www.npmjs.com/package/vitest-canvas-mock) for a
fuller canvas fake. Tests run in CI via `.github/workflows/build.yml`.

### Coverage

```bash
npm run test:coverage
```

Prints a summary in the terminal and writes a browsable HTML report to
`coverage/index.html` (plus `lcov.info` for editor extensions and CI services).
Coverage is measured across **all** of `src/` — not just files a test imports —
so untested modules show up as 0% rather than silently disappearing. `main.ts`
is excluded, since it only constructs the game.

> The terminal table lists only files with **less than** 100% coverage — a file
> missing from it is fully covered, not untested (it still counts toward the
> totals). The HTML report lists every file.

## Formatting

Code style is enforced with [Prettier](https://prettier.io/). Config lives in
[`.prettierrc.json`](.prettierrc.json) (single quotes, no trailing commas, 100-char
width). An [`.editorconfig`](.editorconfig) applies the same indent/charset/EOL
rules in your editor as you type — most editors read it natively (VS Code needs
the [EditorConfig extension](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)).

```bash
npm run format         # format everything in place
npm run format:check   # verify formatting (fails if anything is off — runs in CI)
```

> **Linting (ESLint):** not yet included. The standard TypeScript linter,
> `typescript-eslint`, does not yet support **TypeScript 7** (this template's
> compiler) and refuses to run against it —
> [tracking issue](https://github.com/typescript-eslint/typescript-eslint/issues/10940).
> Once TS 7 support ships, add ESLint with `eslint-config-prettier` so it and
> Prettier don't overlap. In the meantime, `tsc`'s strict settings
> ([`tsconfig.json`](tsconfig.json)) catch most correctness issues.

### Pre-commit hook

A [husky](https://typicode.github.io/husky/) `pre-commit` hook runs
[lint-staged](https://github.com/lint-staged/lint-staged), which formats **only
the files you're committing** with Prettier and re-stages them. CI checks
formatting on every push, so this catches the problem at commit time instead of
after a failed build. The hook installs itself via the `prepare` script when you
run `npm install` — no extra setup.

To bypass it for a single commit (it won't be formatted, and CI will say so):

```bash
git commit --no-verify -m "wip"
```

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
> rebuild step) and it's the only mode with source maps — the production build
> ships without them (see `build.sourcemap` in
> [`vite.config.ts`](vite.config.ts)), so stack traces there point at minified
> code. Flip `sourcemap` to `true` if you need to debug the built bundle.

## Project structure

```
PhaserGame/
├── index.html            # Page host for the game canvas
├── vite.config.ts        # Vite + build config (relative base, phaser chunk)
├── vitest.config.ts      # Vitest config (jsdom, reuses Vite pipeline, coverage)
├── tsconfig.json         # Strict TypeScript config (type-check only)
├── .nvmrc                # Node version, read by CI and `nvm use`
├── .husky/
│   └── pre-commit        # Formats staged files with Prettier before committing
├── .github/
│   ├── dependabot.yml    # Weekly npm / Actions / Cargo update PRs
│   └── workflows/
│       ├── build.yml     # CI: format, test, type-check, build
│       ├── deploy.yml    # Publishes the web build to GitHub Pages
│       └── release.yml   # Builds native installers on a version tag
├── scripts/
│   └── setup.mjs         # One-time rebrand (`npm run setup`); deletes itself
├── src-tauri/            # Desktop app shell — Rust + Tauri config and icons
├── public/               # Copied to the build root as-is
│   ├── favicon.svg       # Browser tab icon
│   └── assets/           # Images, audio, spritesheets — load in Preloader.ts
├── test/
│   └── setup.ts          # Vitest setup — stubs the canvas context jsdom lacks
└── src/
    ├── main.ts           # Game config + entry point
    ├── utils/
    │   ├── math.ts       # Pure, testable game math helpers
    │   └── math.spec.ts  # Co-located unit tests
    └── scenes/
        ├── Boot.ts          # Boots first; loads assets for the Preloader
        ├── Preloader.ts     # Loads game assets with a progress bar
        ├── MainScene.ts     # Hello World gameplay — replace this
        └── MainScene.spec.ts # Scene-wiring test (fake Phaser systems)
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
to `main`, running the same format / test / type-check gates as CI first so a
commit that compiles but fails its tests never reaches production. **One-time setup:** in the repo, go to **Settings → Pages → Build and
deployment → Source** and select **"GitHub Actions"**. After the next push the
game is live at `https://mjohnson0580.github.io/PhaserGame/`.

## Desktop builds (Tauri)

The game can be packaged as a small native executable (`.exe`/`.msi` on Windows,
`.dmg` on macOS, AppImage/`.deb` on Linux) using [Tauri](https://tauri.app/),
which wraps the web build in the OS's native webview.

### Cloud releases (recommended — no local tools, no admin)

`.github/workflows/release.yml` builds installers for **Windows, macOS (Intel +
Apple Silicon), and Linux** on GitHub's runners and publishes them to a GitHub
Release whenever you push a version tag — no Rust, C++ toolchain, or admin
rights needed on your machine:

```bash
# bump "version" in package.json (the single source of truth — Tauri reads it
# via "version": "../package.json" in tauri.conf.json), then tag and push:
git tag v0.1.0
git push origin v0.1.0
```

The workflow creates a **draft** GitHub Release with all platform installers
attached as assets. Find it under the repo's **Releases** tab, review the
installers, then click **Publish release** to make it public.

Each release also includes **portable, no-install** downloads: a raw
`*_portable.exe` for Windows (runs standalone wherever the WebView2 runtime is
present — always on Windows 11), plus the Linux **AppImage** and macOS **`.app`**
(inside the `.dmg`), which are portable by nature. To build _only_ portable
artifacts and skip the installers, set `bundle.targets` in
`src-tauri/tauri.conf.json` (e.g. `["app", "appimage"]`) or narrow the
`args` in the release workflow.

### Local builds (optional — requires admin to set up)

Building on your own machine is only needed if you want to run/debug the game in
a native window. It requires a C++ toolchain, which needs administrator rights
to install — if you don't have admin, use the cloud releases above instead.

**Prerequisites (one-time):**

1. Install the [Rust toolchain](https://rustup.rs/):
   ```powershell
   winget install --id Rustlang.Rustup
   ```
   (Restart the shell afterwards so `cargo` is on PATH.)
2. Windows also needs the **Microsoft C++ Build Tools** (admin install) and
   **WebView2** (ships with Windows 11). See the
   [Tauri prerequisites](https://tauri.app/start/prerequisites/) for macOS/Linux.

**Commands:**

```bash
npm run tauri:dev     # run the game in a native window with hot-reload
npm run tauri:build   # produce a distributable installer/executable
```

Build output lands in `src-tauri/target/release/bundle/`. Tauri config lives in
`src-tauri/tauri.conf.json` (window size, app identifier, icons).

### Code signing

Unsigned installers trigger a warning on end users' machines — **"Windows
protected your PC / Unknown publisher"** (SmartScreen) on Windows, and
**"unidentified developer"** (Gatekeeper) on macOS. This is expected for an
unsigned build; while testing, choose **More info → Run anyway** on Windows or
right-click → **Open** on macOS. To remove the warning for everyone else, sign
the installers.

**Windows** — options, cheapest first:

| Option                                                                      | Cost         | SmartScreen reputation           |
| --------------------------------------------------------------------------- | ------------ | -------------------------------- |
| [Azure Trusted Signing](https://learn.microsoft.com/azure/trusted-signing/) | ~$10/mo      | Good, builds quickly             |
| OV certificate                                                              | ~$100–400/yr | Accrues over time                |
| EV certificate                                                              | ~$300–700/yr | Instant (needs a hardware token) |

To enable **Azure Trusted Signing** (recommended) in the release workflow:

1. Set up a Trusted Signing account + certificate profile in Azure, and add
   `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID` as repository
   secrets (Settings → Secrets and variables → Actions).
2. Uncomment the "Install Windows signing tool" step and the `AZURE_*` env lines
   in `.github/workflows/release.yml`.
3. Add a `signCommand` to the `bundle` block of `src-tauri/tauri.conf.json`
   (this file is strict JSON and can't hold comments, so the snippet lives here —
   replace the endpoint region, account, and certificate profile):

   ```jsonc
   "bundle": {
     "windows": {
       "signCommand": "trusted-signing-cli -e https://eus.codesigning.azure.net -a MyAccount -c MyCertProfile %1"
     }
   }
   ```

**macOS** — signing + notarization needs an [Apple Developer account](https://developer.apple.com/)
($99/yr). Add `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`,
`APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, and `APPLE_TEAM_ID` as
repository secrets, then uncomment the matching `APPLE_*` env lines in the
release workflow. See the
[Tauri macOS signing guide](https://tauri.app/distribute/sign/macos/).

## Dependency updates

[`.github/dependabot.yml`](.github/dependabot.yml) opens weekly PRs for npm
packages, GitHub Actions, and the Rust crates behind the Tauri build. Routine
dev-dependency patches are grouped into a single PR; major bumps arrive
separately so breaking changes get reviewed on their own. CI runs on each PR, so
a green check means the update is safe to merge.

## Notes

- Phaser 4 ships its own TypeScript definitions, so no `@types/phaser` package
  is needed.
- The game renders with `Phaser.AUTO` (WebGL with Canvas fallback) and scales
  with `Scale.FIT` + `CENTER_BOTH`, so it fits any window while keeping the
  1280×720 design resolution.
