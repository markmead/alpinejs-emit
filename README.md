# Alpine JS Emit

Emit data changes to other Alpine JS elements 📣

> [!NOTE]
> **This project is archived.** For most cross-component state, use
> [`Alpine.store`](https://alpinejs.dev/globals/alpine-store) — it's built in
> and better suited to the job. This plugin is still useful when you don't
> control the markup structure (server-rendered templates, for example) and
> can't restructure into a store. The 2.0.0 release was tested against Alpine
> 3.x before publishing, but the project is no longer developed.

## Breaking Changes in 2.0.0

- A selector in the array form now emits to **every** match, not just the
  first. `$emit([['.target', {}]])` previously updated only the first `.target`.
- Targets with no Alpine component ancestor are skipped rather than throwing
  part-way through an emit.
- The package now ships `dist/emit.mjs` and `dist/emit.cjs` (previously
  `dist/emit.esm.js`, with no CommonJS build at all). `import`/`require` of the
  package name both work; update any deep imports of the old file paths.

## Install

### With a CDN

```html
<script
  defer
  src="https://unpkg.com/alpinejs-emit@latest/dist/emit.min.js"
></script>

<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### With a Package Manager

```shell
pnpm add -D alpinejs-emit

yarn add -D alpinejs-emit

npm install -D alpinejs-emit
```

```js
import Alpine from 'alpinejs'
import emit from 'alpinejs-emit'

Alpine.plugin(emit)

Alpine.start()
```

## Example

### Single Target

```html
<button x-data x-on:click="$emit('#TargetEl', { isChecked: false })">
  Click
</button>

<div x-data="{ isChecked: false }" id="TargetEl">
  <button x-on:click="isChecked = !isChecked">Toggle</button>

  <span x-show="isChecked">Checked</span>
</div>
```

The `$emit` will change the value of `isChecked` on the `TargetEl` element.

You'll notice within the `TargetEl` element it has its own method of changing
the `isChecked` value, this will still work.

If you wanted to toggle the value of `isChecked` you can do so with
`{ isChecked: '!!' }`, this will check for `!!` and if found, toggle the value
based on the `isChecked` value on the `TargetEl` element.

#### Multiple Targets with a Shared Selector

This has been handled before you behind the scenes.

_`isChecked` is just an example, you don't need to call your Alpine JS data
that_

### Multiple Targets

```html
<div
  x-data="{ isChecked: false }"
  x-init="$watch('isChecked', () => $emit([
        ['#TargetEl', { isChecked }],
        ['#TargetEl2', { userName: 'Doe' }]
    ]))"
>
  <button x-on:click="isChecked = !isChecked">Toggle</button>

  <span x-show="isChecked">Checked</span>
</div>

<div x-data="{ isChecked: false }" id="TargetEl">
  <button x-on:click="isChecked = !isChecked">Toggle</button>

  <span x-show="isChecked">Checked</span>
</div>

<div x-data="{ userName: 'John' }" id="TargetEl2">
  <span x-text="userName"></span>
</div>
```

This works exactly the same as the above but you pass an array of arrays
instead.

```js
$emit([
  ['.select1', {}],
  ['#select2', {}],
])
```

Every element matching a selector is updated, so `.select1` above will emit to
all of its matches. The `'!!'` toggle works here too.

A target with no Alpine component ancestor is skipped.

Targets resolve to the nearest enclosing component, so a target that isn't
itself an `x-data` root but sits inside one is _not_ skipped — it writes to that
enclosing component. If `.card` matches three plain `<div>`s inside a single
`x-data` root, `$emit('.card', { open: true })` sets `open` on that one root,
three times over. Point your selectors at the `x-data` elements themselves.

### Element Targets

As well as a selector string you can pass an element directly, which is useful
when you already hold a reference to one.

Note that `x-ref` won't help you here: refs register against their own
`x-data` root, so `$refs` can't reach *another* component's root element. Use a
selector for cross-component emits.

## Stats

![](https://img.shields.io/bundlephobia/min/alpinejs-emit)
![](https://img.shields.io/npm/v/alpinejs-emit)
![](https://img.shields.io/npm/dt/alpinejs-emit)
![](https://img.shields.io/github/license/markmead/alpinejs-emit)
