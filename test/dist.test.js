import { createRequire } from 'node:module'

import { describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)

describe('built artifacts', () => {
  it('exposes the plugin function directly from the CJS build', () => {
    const emit = require('../dist/emit.cjs')

    expect(typeof emit).toBe('function')
  })

  it('exposes the plugin function as the ESM default', async () => {
    const emit = await import('../dist/emit.mjs')

    expect(typeof emit.default).toBe('function')
  })
})
