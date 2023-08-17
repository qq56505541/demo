const HtmlWebpackPlugin = require('html-webpack-plugin')

class InsertCodeToHtmlPlugin {
  apply (compiler) {
    compiler.hooks.compilation.tap('InsertCodeToHtmlPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'InsertCodeToHtmlPlugin', // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          const injectCode = data.plugin.options.injectCode
          if (injectCode) {
            const allScript = Object.keys(injectCode).map(key => {
              const value = injectCode[key]
              return `window.${key} = '${value}'`
            }).join(';')
            data.html = data.html.replace('<head>', `<head>\n<script>${allScript}</script>\n`)
          }
          cb(null, data)
        }
      )
    })
  }
}

module.exports = InsertCodeToHtmlPlugin
