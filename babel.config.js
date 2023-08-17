const webpackCommonConfig = require('./webpackCommonConfig').webpackCommonConfig
let polyfillsList = []
if (webpackCommonConfig.polyfills.enable) {
  const {
    list,
  } = require('core-js-compat')(webpackCommonConfig.polyfills)
  polyfillsList = list
}

module.exports = {
  presets: [
    ['@vue/app', {
      useBuiltins: 'usage',
      polyfills: polyfillsList,
    }]
  ],
  compact: false,
  plugins: [
    // ['import', { libraryName: '@yh/ta404-ui', libraryDirectory: 'es', style: true, }], // `style: true` 会加载 less 文件
    '@yh/babel-plugin-import-utils',
    '@yh/babel-plugin-ui-importer'
  ],
}
