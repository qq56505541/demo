const { merge, } = require('webpack-merge')
const { webpackCommonConfig, } = require('../webpackCommonConfig')
const base = require('./webpack.base.conf').base

/**
 * 此处放置development模式下的webpack配置，请注意，此处的配置会直接merge @vue/cli 的默认配置
 * 请尽量使用`chainWebpack`来对webpack进行配置
 * 此处仅作为兼容使用
 * @type {import('./webpack').Configuration}
 */
exports.dev = merge(base, {
  // 试验性配置
  // 使用试验性配置导致的任何问题,都不会获得技术支持,请慎重使用
  experiments: {
    /**
     * 试验性webpack配置,使用这个配置会导致webpack首次启动特别快(启动过程仅编译了部分必须的依赖)
     * 在访问页面时,可能会出现长时间白屏.这是因为webpack正在后台进行模块的编译,在编译完成后会自动刷新浏览器页面
     */
    // lazyCompilation: true,
  },
  cache: {
    type: 'filesystem',
    version: process.env.VUE_APP_PUBLIC_PATH,
  },
})

// eslint-disable-next-line no-unused-vars
exports.devChain = (webpackConfig) => {
  const { copyResources, } = webpackCommonConfig

  // 通过webpackConfig来修改webpack的配置

  webpackConfig.plugins.has('copy') && webpackConfig.plugin('copy').tap(args => {
    copyResources.filter(res => {
      return res.type === 'dev'
    }).forEach(res => {
      const { type, ...copyRes } = res
      args[0].patterns.push(copyRes)
    })
    return args
  })

  return webpackConfig
}
