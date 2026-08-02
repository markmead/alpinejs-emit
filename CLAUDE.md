# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`alpinejs-emit` is a small Alpine.js plugin that registers a `$emit` magic. It lets one Alpine component write data into the `x-data` scope of other components, selected by CSS selector or by element reference.

## Commands

This repo uses **pnpm** (see `packageManager` in `package.json`).

```shell
pnpm install
pnpm run build              # esbuild -> dist/{emit.min.js, emit.mjs, emit.cjs}
pnpm test                   # vitest run (jsdom)
pnpm vitest run test/emit.test.js -t 'toggle'   # single file / single test by name
```

There is no `prepublishOnly` hook — the project is sunset, so releases are manual: run `pnpm run build` and commit `dist/` before publishing.

## Architecture

The whole plugin is ~25 lines across two source files plus two build entry points.

- `src/index.js` — the plugin's default export. Registers `Alpine.magic('emit', ...)` and owns *all* target resolution: it normalises both call forms into `[selector, data]` pairs (`Array.isArray` distinguishes the array form from a single target), then expands string selectors via `querySelectorAll` and passes non-string targets straight through as elements. Falsy targets are skipped.
- `src/handleData.js` — assigns each key of `newData` onto an Alpine scope obtained from `Alpine.$data(el)`. The sentinel value `'!!'` means "toggle the current boolean" rather than "assign the string `!!`".

`Alpine` is threaded explicitly from the plugin argument through to `handleData` rather than read off the global. Keep it that way — the module build has no guarantee `window.Alpine` exists.

Both call forms go through the same `querySelectorAll` expansion, so a shared selector like `.target` updates every match in *either* form. This was previously inconsistent (the array form used `querySelector` and silently hit only the first match); `test/emit.test.js` has a regression test for it.

### Build layout

`builds/` holds the entry points that wrap `src/index.js`:

- `builds/cdn.js` self-registers on the `alpine:init` event against `window.Alpine` → `dist/emit.min.js` (IIFE, what unpkg serves).
- `builds/module.js` re-exports the plugin so consumers call `Alpine.plugin(emit)` themselves → `dist/emit.mjs` (ESM) and `dist/emit.cjs` (CJS).

`scripts/build.js` calls `esbuild.buildSync` directly (minified, bundled). Three things there are load-bearing and easy to undo by accident:

- The CDN bundle is *not* a valid `main` — it exports nothing and has import side effects — which is why `main` points at the CJS build.
- The CJS build needs the `footer` that reassigns `module.exports`. Without it esbuild emits `{ default: fn }`, and `Alpine.plugin(require('alpinejs-emit'))` throws.
- Output extensions are `.mjs`/`.cjs` rather than `.js` because `package.json` has no `"type"` field; a bare `.js` ESM file is a parse error for Node ESM consumers.

`test/dist.test.js` asserts the shape of both built entry points, so these stay honest.

`dist/` is committed and served directly by unpkg, so rebuild and commit it alongside any `src/` or `builds/` change.

## Testing

`test/emit.test.js` starts Alpine once, then remounts DOM per test via `Alpine.initTree`. To invoke the magic it uses `Alpine.evaluate(el, '$emit(...)', { scope })` — note the third argument is `{ scope, params }`, not a bare scope object.
