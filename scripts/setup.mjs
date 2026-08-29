#!/usr/bin/env node
/**
 * Interactive project setup for the Phaser 4 + Vite + TypeScript template.
 *
 * Rebrands the template to your new game by rewriting the name, window title,
 * Tauri app identifier, LICENSE author, README, and CI badge / Pages URLs.
 * Run once:
 *
 *   npm run setup
 *
 * The template's *current* identity is detected from its own files, so this
 * works no matter who owns the template (including a fork of a fork). It
 * offers to delete itself afterwards so it doesn't ship with your game.
 */
import { readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const rl = createInterface({ input, output });

// Queue-based line reader so no input is dropped when answers are piped in,
// while still working interactively at a TTY.
const queued = [];
const waiters = [];
let closed = false;
rl.on('line', (line) => {
  const w = waiters.shift();
  if (w) w(line);
  else queued.push(line);
});
rl.on('close', () => {
  closed = true;
  while (waiters.length) waiters.shift()(undefined);
});
const nextLine = () =>
  queued.length
    ? Promise.resolve(queued.shift())
    : closed
      ? Promise.resolve(undefined)
      : new Promise((resolve) => waiters.push(resolve));

/** "Space Blaster" -> "space-blaster" (npm package name). */
const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** "Space Blaster" -> "spaceblaster" (a reverse-DNS / Android id segment). */
const idSeg = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/^[0-9]+/, '') || 'app';

const sh = (cmd) => {
  try {
    return execSync(cmd, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
};

/** Read owner/repo from the git `origin` remote. */
function detectRemote() {
  const url = sh('git remote get-url origin');
  const m = url.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/i);
  return m ? { owner: m[1], repo: m[2] } : { owner: '', repo: '' };
}

const ask = async (q, def) => {
  output.write(def ? `${q} [${def}]: ` : `${q}: `);
  const a = ((await nextLine()) ?? '').trim();
  return a || def || '';
};

async function main() {
  console.log('\n  Phaser 4 template setup\n  -----------------------\n');

  // --- Detect the template's CURRENT identity from its own files, so nothing
  // is tied to a specific original owner/name. ---
  const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
  const confPath = join(root, 'src-tauri', 'tauri.conf.json');
  const conf = existsSync(confPath) ? JSON.parse(await readFile(confPath, 'utf8')) : null;
  const readme = existsSync(join(root, 'README.md'))
    ? await readFile(join(root, 'README.md'), 'utf8')
    : '';

  const oldSlug = pkg.name;
  const oldName = conf?.productName || oldSlug;
  const urlMatch = readme.match(/github\.com\/([^/\s)]+)\/([^/\s)]+)\/actions/i);
  const oldOwner = urlMatch?.[1] || '';
  const oldRepo = urlMatch?.[2] || oldName;

  const guess = detectRemote();

  // --- Prompts ---
  let displayName = '';
  while (!displayName) displayName = await ask('Game display name (e.g. "Space Blaster")');
  const owner = await ask('GitHub owner / username', guess.owner || oldOwner);
  const repo = await ask('GitHub repository name', guess.repo || slugify(displayName));
  const author = await ask('Author name (for LICENSE)', sh('git config user.name') || owner);

  const pkgName = slugify(displayName);
  const identifier = `io.github.${idSeg(owner || 'dev')}.${idSeg(displayName)}`;
  const year = new Date().getFullYear();

  console.log('\n  Will apply:');
  console.log(`    Display name : ${displayName}`);
  console.log(`    Package name : ${pkgName}`);
  console.log(`    App id       : ${identifier}`);
  console.log(`    GitHub       : ${owner || '(none)'}/${repo}`);
  console.log(`    License      : (c) ${year} ${author}\n`);

  const ok = (await ask('Proceed? (Y/n)', 'Y')).toLowerCase();
  if (ok !== 'y' && ok !== 'yes') {
    console.log('Aborted - no files changed.');
    rl.close();
    return;
  }

  const edit = async (rel, fn) => {
    const p = join(root, rel);
    if (!existsSync(p)) {
      console.warn(`  skip  ${rel} (not found)`);
      return;
    }
    const before = await readFile(p, 'utf8');
    const after = fn(before);
    if (after !== before) {
      await writeFile(p, after);
      console.log(`  edit  ${rel}`);
    }
  };
  const editJson = async (rel, fn) =>
    edit(rel, (t) => JSON.stringify(fn(JSON.parse(t)), null, 2) + '\n');
  const replaceAll = (t, from, to) => (from ? t.split(from).join(to) : t);

  await editJson('package.json', (j) => {
    j.name = pkgName;
    j.version = '0.1.0';
    j.description = `${displayName} - a Phaser 4 game`;
    return j;
  });

  await edit('index.html', (t) =>
    t.replace(/<title>[\s\S]*?<\/title>/, `<title>${displayName}</title>`)
  );

  await editJson('src-tauri/tauri.conf.json', (j) => {
    j.productName = displayName;
    j.identifier = identifier;
    if (j.app?.windows?.[0]) j.app.windows[0].title = displayName;
    return j;
  });

  await edit('.github/workflows/release.yml', (t) =>
    replaceAll(t, `releaseName: '${oldName} `, `releaseName: '${displayName} `)
  );

  await edit('LICENSE', (t) => t.replace(/Copyright \(c\) .*/, `Copyright (c) ${year} ${author}`));

  await edit('README.md', (t) => {
    let out = t;
    out = replaceAll(out, `${oldOwner}/${oldRepo}`, `${owner}/${repo}`); // repo URLs
    out = replaceAll(out, `${oldOwner}.github.io/${oldRepo}`, `${owner}.github.io/${repo}`); // pages
    out = replaceAll(out, `${oldRepo}/`, `${repo}/`); // structure-diagram folder
    out = replaceAll(out, oldName, displayName); // H1 + prose
    return out;
  });

  const clean = (await ask('Remove this setup script now? (Y/n)', 'Y')).toLowerCase();
  if (clean === 'y' || clean === 'yes') {
    await editJson('package.json', (j) => {
      delete j.scripts.setup;
      return j;
    });
    await rm(join(root, 'scripts'), { recursive: true, force: true });
    console.log('  removed scripts/setup.mjs');
  }

  console.log(`\n  Done! Next steps:\n    npm run dev        # start building your game\n`);
  rl.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
