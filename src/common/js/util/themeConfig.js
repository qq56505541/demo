import { webStorage, } from '@yh/ta-utils'
import faceConfig from 'faceConfig'
import { updateTheme, updateColorWeak, } from '@/style/themeUtils'
import { themeMixins, } from 'common/js/mixins/themeMixins'
import themeConfig from '@/style/theme/index'

/**
 * 获取主题色,并调用换肤工具
 * @param newValue
 * @param iFrameShowMessage
 */
function changeTheme (newValue, iFrameShowMessage = true) {
  const primaryColor = []
  if (newValue.indexOf('#') === 0) {
    primaryColor.push(newValue)
  } else {
    const theme = themeConfig(newValue)
    Object.keys(theme).forEach(key => {
      if (key.indexOf('color') > 0) {
        primaryColor.push(theme[key])
      }
    })
  }

  updateTheme(primaryColor, iFrameShowMessage)
}

/**
 * 启用/关闭暗黑模式
 * @param darkMode
 */
function changeDarkMode (darkMode) {
  updateColorWeak(darkMode)
}

/**
 * 进入页面时自动同步主题配置
 */
function syncThemeWhenInit () {
  const themeStorage = webStorage.createWebStorage('index_theme', { isLocal: true, })
  const onlineTheme = webStorage.getStorage('index_theme', 'index_theme', true)
  // 切换主题颜色
  changeTheme(onlineTheme ?? faceConfig.defaultTheme, false)
  // 启用暗黑模式
  updateColorWeak(themeStorage.get('dark_mode') ?? faceConfig.defaultDarkMode)
}

/**
 * 监听localStorage的storage事件
 * 用于iframe页面的动态换肤
 */
window.addEventListener('storage', function (e) {
  // 获取被修改的键值
  if (e.key === 'index_theme') {
    const indexThemeStorage = JSON.parse(e.newValue)
    const indexTheme = indexThemeStorage.index_theme
    const darkMode = indexThemeStorage.dark_mode === 'true'
    if (indexTheme) {
      changeTheme(JSON.parse(indexTheme), false)
    }
    changeDarkMode(darkMode)
  }
}, false)

/**
 * 注入主题配置代码
 *
 * @param Vue
 */
function injectTheme (Vue) {
  if (faceConfig.onlineTheme) {
    // 注入mixins,
    Vue.mixin(themeMixins)
    // 初始化页面时同步主题配置
    syncThemeWhenInit()
  }
}

export {
  syncThemeWhenInit,
  changeTheme,
  injectTheme,
}
