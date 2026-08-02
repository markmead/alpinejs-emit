buildPlugin({
  entryPoints: ['builds/cdn.js'],
  outfile: 'dist/emit.min.js',
})

// Extensions are explicit (.mjs/.cjs) because package.json has no "type"
// field, so a bare .js ESM file fails to parse for Node ESM consumers.
buildPlugin({
  entryPoints: ['builds/module.js'],
  outfile: 'dist/emit.mjs',
  format: 'esm',
  platform: 'neutral',
  mainFields: ['main', 'module'],
})

// The CJS entry must be the plugin function itself, not `{ default: fn }`, so
// that `Alpine.plugin(require('alpinejs-emit'))` works.
buildPlugin({
  entryPoints: ['builds/module.js'],
  outfile: 'dist/emit.cjs',
  format: 'cjs',
  platform: 'neutral',
  mainFields: ['main', 'module'],
  footer: { js: 'module.exports = module.exports.default' },
})

function buildPlugin(buildOptions) {
  return require('esbuild').buildSync({
    ...buildOptions,
    minify: true,
    bundle: true,
  })
}
