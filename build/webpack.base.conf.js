const path = require('path')
const { webpackCommonConfig, } = require('../webpackCommonConfig')
const createThemeColorReplacerPlugin = require('./config/themePlugin.config')
const InsertCodeToHtmlPlugin = require('./plugins/InsertCodeToHtmlPlugin')
/**
 * @type {import('./webpack').Configuration}
 */
exports.base = {
  resolve: {
    fallback: {
      crypto: false,
    },
  },
  snapshot: {
    managedPaths: [],
  },
}

// eslint-disable-next-line no-unused-vars
exports.baseChain = (webpackConfig) => {
  const { alias, copyResources, env, supportIE, } = webpackCommonConfig
  // alias
  Object.keys(alias).forEach((key) => {
    webpackConfig.resolve.alias.set(key, path.join(__dirname, '..', alias[key]))
  })

  // 通过webpackConfig来修改webpack的配置
  // 复制pdfjs到dist目录
  webpackConfig.plugins.has('copy') && webpackConfig.plugin('copy').tap(args => {
    copyResources.filter(res => {
      return res.type === 'common'
    }).forEach(res => {
      const { type, ...copyRes } = res
      args[0].patterns.push(copyRes)
    })
    return args
  })

  // 修改vue-loader的options
  // 修改vue-template-compiler的whitespace配置为preserve：inline-block布局的按钮之间会显示一个小的空格
  // webpackConfig.module.rule('vue').use('vue-loader').tap(options => {
  //   Object.assign(options, {
  //     compilerOptions: {
  //       whitespace: 'preserve'
  //     }
  //   })
  //   return options
  // })

  if (process.env.VUE_APP_ONLINE_THEME === 'true') {
    webpackConfig.plugin('theme').use(createThemeColorReplacerPlugin())
  }
  // i18n 信息
  webpackConfig.plugin('define').tap(args => {
    const options = args[0]
    options['process.env'] = {
      ...options['process.env'],
      ...env,
    }
    return args
  })

  if (supportIE.dev) {
    // 忽略提取样式的顺序
    webpackConfig.plugin('extract-css') && webpackConfig.plugin('extract-css').tap(args => {
      const options = args[0]
      options.ignoreOrder = true
      return args
    })
  }

  webpackConfig.plugin('InsertCodeToHtmlPlugin').use(new InsertCodeToHtmlPlugin())


  webpackConfig.module.rule('vue').uses.delete('cache-loader')
  webpackConfig.module.rule('js').uses.delete('cache-loader')
  webpackConfig.module.rule('jsx').uses.delete('cache-loader')
  webpackConfig.module.rule('ts').uses.delete('cache-loader')
  webpackConfig.module.rule('tsx').uses.delete('cache-loader')
  webpackConfig.module
    .rule('vue')
    .use('vue-loader')
    .tap(options => {
      // 修改它的选项...
      return {
        ...options,
        cacheDirectory: false,
      }
    })
  webpackConfig.module
    .rule('js')
    .use('babel-loader')
    .tap(options => {
      // 修改它的选项...
      return {
        ...options,
        cacheDirectory: false,
      }
    })
  return webpackConfig
}
