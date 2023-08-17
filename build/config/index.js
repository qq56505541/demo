'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

exports.proxy = () => {
  // 动态设置代理路径
  let proxyTable
  if (process.env.NODE_ENV === 'development') {
    const pathRewrite = {}
    proxyTable = {}
    pathRewrite['^' + process.env.VUE_APP_BASE_PATH] = ''
    proxyTable[process.env.VUE_APP_BASE_PATH] = {
      target: process.env.RUN_ENV === 'mock' ? 'http://localhost:36742/' : process.env.VUE_APP_BACKEND_PATH,
      changeOrigin: true,
      logLevel: process.env.WEBPACK_PROXY_LOG_LEVEL,
      pathRewrite: {
        ...pathRewrite,
      },
    }
  } else {
    proxyTable = undefined
  }
  return proxyTable
}
