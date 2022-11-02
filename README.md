# Alpine JS Emit

Emit data changes to other Alpine JS elements 📣

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

## Stats

![](https://img.shields.io/bundlephobia/min/alpinejs-emit)
![](https://img.shields.io/npm/v/alpinejs-emit)
![](https://img.shields.io/npm/dt/alpinejs-emit)
![](https://img.shields.io/github/license/markmead/alpinejs-emit)
