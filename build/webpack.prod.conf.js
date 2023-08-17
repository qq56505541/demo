const { merge, } = require('webpack-merge')
const webpack = require('webpack')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { webpackCommonConfig, } = require('../webpackCommonConfig')
// const utils = require('./utils')

const base = require('./webpack.base.conf').base

/**
 * 此处放置production模式下的webpack配置，请注意，此处的配置会直接merge @vue/cli 的默认配置
 * 请尽量使用`chainWebpack`来对webpack进行配置
 * 此处仅作为兼容使用
 * @type {import('./webpack').Configuration}
 */
exports.prod = merge(base, {
  externals: {
    // 提取vue/axios/vuex/vue-router为external资源
    // vue: 'Vue',
    // 'vue-router': 'VueRouter',
    // vuex: 'Vuex',
    // axios: 'axios',
  },
  optimization: {
    // splitChunks: webpackCommonConfig.splitChunks,
    // 需要在生产环境进行调试时，将minimize设置为false，禁止webpack进行minimize
    // minimize: true,
    // concatenateModules: true,
  },
  plugins: [
  ],
  cache: {
    type: 'filesystem',
    version: process.env.VUE_APP_PUBLIC_PATH,
  },
})

exports.prodChain = (webpackConfig, isBuildLib) => {
  const { jsOutputFile, cssOutputFile, copyResources, locale, } = webpackCommonConfig

  // build时修改文件大小限制
  webpackConfig.performance.hints('warning').maxEntrypointSize(50000000).maxAssetSize(30000000).assetFilter((assetFilename) => {
    return assetFilename.endsWith('.js')
  })

  webpackConfig.output.filename(jsOutputFile)
  webpackConfig.output.chunkFilename(jsOutputFile)

  // 这是一个临时的措施来缓解build的时候报大量warning的问题，具体解决方法还需要排查UI中的less文件的样式引入顺序
  webpackConfig.plugin('extract-css') && webpackConfig.plugin('extract-css').tap(args => {
    const options = args[0]
    options.ignoreOrder = true
    options.filename = cssOutputFile
    options.chunkFilename = cssOutputFile
    return args
  })

  // 补全html插入资源
  webpackConfig.plugin('insert-preload').use(require.resolve('./plugins/insertPreload'), [
    {
      defer: true,
      runtime: ['c_', 'r_'],
    }
  ])

  webpackConfig.plugins.has('copy') && webpackConfig.plugin('copy').tap(args => {
    copyResources.filter(res => {
      return res.type === 'prod'
    }).forEach(res => {
      const { type, ...copyRes } = res
      args[0].patterns.push(copyRes)
    })
    return args
  })

  // 移除moment的除zh-cn之外的语言包
  webpackConfig
    .plugin('ignore')
    .use(
      new webpack.ContextReplacementPlugin(
        /moment[/\\]locale$/,
        locale.moment
      )
    )

  // 打包分析
  // webpackConfig.plugin('webpack-report').use(BundleAnalyzerPlugin, [
  //   {
  //     analyzerMode: 'static',
  //     reportFilename: '../report.html'
  //   }
  // ])
  // 对ta404-ui进行更大的分割，即每个组件一个js文件加载
  // webpackConfig = require('./utils').extraChunks(webpackConfig)

  // cache-control
  // Object.keys(utils.cachedEntries()).forEach(name => {
  //   webpackConfig.plugin(`html-${name}`).tap(args => {
  //     const newArgs = {
  //       ...args[0],
  //       meta: {
  //         cacheControl1: { 'http-equiv': 'Cache-Control', content: 'no-cache', },
  //         cacheControl2: { 'http-equiv': 'Pragma', content: 'no-cache', },
  //         cacheControl3: { 'http-equiv': 'Expires', content: '-1', },
  //       },
  //     }
  //     return [newArgs]
  //   })
  // })

  // 修改terser配置
  webpackConfig.optimization.minimizer('terser').tap((args) => {
    args[0].terserOptions.compress.drop_console = true
    return args
  })

  if (!isBuildLib) {
    webpackConfig.optimization.splitChunks(webpackCommonConfig.splitChunks)
  }
  if (isBuildLib) {
    // 排除打包时的依赖
    webpackConfig.externals({
      vue: 'Vue',
    })
  }
  webpackConfig.optimization.minimize(webpackCommonConfig.minimize)
  webpackConfig.optimization.concatenateModules(true)
  return webpackConfig
}
