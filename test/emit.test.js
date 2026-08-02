import Alpine from 'alpinejs'
import { beforeAll, describe, expect, it } from 'vitest'

import emit from '../src/index.js'

beforeAll(() => {
  Alpine.plugin(emit)
  Alpine.start()
})

async function mount(html) {
  document.body.innerHTML = html

  Alpine.initTree(document.body)

  await Alpine.nextTick()
}

async function callEmit(args, scope = {}) {
  const sourceEl = document.querySelector('#Source')

  Alpine.evaluate(sourceEl, `$emit(${args})`, { scope })

  await Alpine.nextTick()
}

const source = '<div x-data id="Source"></div>'

describe('single target', () => {
  it('updates every element matching the selector', async () => {
    await mount(`
      ${source}
      <div x-data="{ count: 0 }" class="target" id="A"></div>
      <div x-data="{ count: 0 }" class="target" id="B"></div>
    `)

    await callEmit(`'.target', { count: 5 }`)

    expect(Alpine.$data(document.querySelector('#A')).count).toBe(5)
    expect(Alpine.$data(document.querySelector('#B')).count).toBe(5)
  })

  it('is a no-op when the selector matches nothing', async () => {
    await mount(source)

    await expect(callEmit(`'#Missing', { count: 1 }`)).resolves.not.toThrow()
  })

  it('skips matches that are not Alpine components', async () => {
    await mount(`
      ${source}
      <div x-data="{ count: 0 }" class="target" id="A"></div>
      <div class="target" id="B"></div>
      <div x-data="{ count: 0 }" class="target" id="C"></div>
    `)

    await callEmit(`'.target', { count: 5 }`)

    expect(Alpine.$data(document.querySelector('#A')).count).toBe(5)
    expect(Alpine.$data(document.querySelector('#C')).count).toBe(5)
  })
})

describe('multiple targets', () => {
  it('updates every match for a shared selector in the array form', async () => {
    await mount(`
      ${source}
      <div x-data="{ count: 0 }" class="target" id="A"></div>
      <div x-data="{ count: 0 }" class="target" id="B"></div>
      <div x-data="{ name: 'John' }" id="C"></div>
    `)

    await callEmit(`[['.target', { count: 5 }], ['#C', { name: 'Doe' }]]`)

    expect(Alpine.$data(document.querySelector('#A')).count).toBe(5)
    expect(Alpine.$data(document.querySelector('#B')).count).toBe(5)
    expect(Alpine.$data(document.querySelector('#C')).name).toBe('Doe')
  })
})

describe('toggle sentinel', () => {
  it("flips a boolean when the value is '!!'", async () => {
    await mount(`
      ${source}
      <div x-data="{ isChecked: false }" id="A"></div>
      <div x-data="{ isChecked: true }" id="B"></div>
    `)

    await callEmit(`'#A, #B', { isChecked: '!!' }`)

    expect(Alpine.$data(document.querySelector('#A')).isChecked).toBe(true)
    expect(Alpine.$data(document.querySelector('#B')).isChecked).toBe(false)
  })
})

describe('element targets', () => {
  it('accepts a DOM element instead of a selector', async () => {
    await mount(`
      ${source}
      <div x-data="{ count: 0 }" id="A"></div>
    `)

    await callEmit(`targetEl, { count: 9 }`, {
      targetEl: document.querySelector('#A'),
    })

    expect(Alpine.$data(document.querySelector('#A')).count).toBe(9)
  })

  it('ignores a null target', async () => {
    await mount(source)

    await expect(
      callEmit(`targetEl, { count: 1 }`, { targetEl: null })
    ).resolves.not.toThrow()
  })
})
