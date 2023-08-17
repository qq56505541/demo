const path = require('path')

const utils = require('./build/utils')
const { webpackCommonConfig, } = require('./webpackCommonConfig')

// 旧式的webpack 配置方式
const webpackConfigure = process.env.NODE_ENV !== 'production' ? require('./build/webpack.dev.conf').dev : require('./build/webpack.prod.conf').prod

// 新的webpack 配置方式
// dev/prod模式均需要引入的webpack配置
const baseChain = require('./build/webpack.base.conf').baseChain

const config = require('./build/config')

// 主机及端口配置佛祖保佑
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const cliArgs = process.argv
const isBuildLib = cliArgs.indexOf('lib') >= 0
// vue/cli 配置：https://cli.vuejs.org/zh/config
/**
 * 自定义的@vue/cli配置,通过@type提供了智能提示
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  // 设置public path，即上下文
  // 这个选项为.env.[development|production]文件中的VUE_APP_PUBLIC_PATH
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  indexPath: 'index.html',
  outputDir: process.env.OUTPUT_DIR,
  productionSourceMap: webpackCommonConfig.enableSourceMap.javascript,
  pages: utils.entries(),
  lintOnSave: false, // 可选值：true/false/warning/default/error
  runtimeCompiler: true,
  transpileDependencies: true,
  configureWebpack: webpackConfigure,
  chainWebpack: (webpackConfig) => {
    webpackConfig = baseChain(webpackConfig)

    // dev
    if (process.env.NODE_ENV === 'development') {
      webpackConfig.resolve.symlinks(true)
      webpackConfig = require('./build/webpack.dev.conf').devChain(webpackConfig)
    }

    // prod
    if (process.env.NODE_ENV === 'production') {
      webpackConfig = require('./build/webpack.prod.conf').prodChain(webpackConfig, isBuildLib)
    }

    return webpackConfig
  },
  css: {
    extract: webpackCommonConfig.supportIE.dev || process.env.NODE_ENV === 'production', // dev:false,production:true;自动设置
    sourceMap: webpackCommonConfig.enableSourceMap.css,
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          // 主题替换
          modifyVars: {
            ...utils.theme,
            'public-path': process.env.VUE_APP_PUBLIC_PATH.endsWith('/') ? process.env.VUE_APP_PUBLIC_PATH : `${process.env.VUE_APP_PUBLIC_PATH}/`,
          },
          math: 'always',
        },
      },
      postcss: {
        postcssOptions: {
          plugins: [
            require('autoprefixer')({ // 配置使用 autoprefixer
              overrideBrowserslist: ['> 1%', 'last 3 versions', 'not ie <= 10', 'chrome >= 41'], // 记得这里要把 browsers 改为 overrideBrowserslist，autoprefixer 新版本的写法有变
            })
          ],
        },
      },
      css: {
        url: {
          filter: (url) => {
            // 如果url以.开始,则说明是相对路径,那么需要将它交给css-loader处理
            return url.indexOf('.') === 0
          },
        },
      },
    },
  },
  devServer: {
    hot: true,
    compress: true,
    host: HOST || '0.0.0.0',
    port: PORT || '8080',
    open: false,
    proxy: config.proxy(),
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join('/', '404.html'), }
      ],
    },
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/common/less/index.less')
      ],
    },
    i18n: {
      locale: process.env.VUE_APP_DEFAULT_LOCALE,
      fallbackLocale: 'zh_CN',
    },
  },
}

// 启动仪式
if (process.env.NODE_ENV !== 'production') {
  console.error([
    '888888  db          dP88   dPYb     dP88',
    '  88   dPYb        dP 88  dP   Yb  dP 88',
    '  88  dP__Yb      d888888 Yb   dP d888888',
    '  88 dP    Yb         88   YbodP      88'
  ].join('\n'))
  console.warn([
    '',
    '                   _ooOoo_',
    '                  o8888888o',
    '                  88" . "88',
    '                  (| -_- |)',
    '                  O\\  =  /O',
    '               ____/`---\'\\____',
    '             .\'  \\\\|     |//  `.',
    '            /  \\\\|||  :  |||//  \\',
    '           /  _||||| 卍 |||||-  \\',
    '           |   | \\\\\\  -  /// |   |',
    '           | \\_|  \'\'\\---/\'\'  |   |',
    '           \\  .-\\__  `-`  ___/-. /',
    '         ___`. .\'  /--.--\\  `. . __',
    '      ."" \'<  `.___\\_<|>_/___.\'  >\'"".',
    '     | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |',
    '     \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /',
    '======`-.____`-.___\\_____/___.-`____.-\'======',
    '                   `=---=\'',
    '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    '         佛祖保佑       永无BUG'
  ].join('\n'))
}
