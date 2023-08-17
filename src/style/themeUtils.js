import client from 'webpack-theme-color-replacer/client'
import { generate, } from '@ant-design/colors'
import { message, } from '@yh/ta404-ui'

export const themeColor = {
  /**
   * 获取颜色系
   * @param color
   * @returns {string[]}
   */
  getAntdSerials: function getAntdSerials (color) {
    // 淡化（即less的tint）
    const lightens = new Array(9).fill().map(function (t, i) {
      return client.varyColor.lighten(color, i / 10)
    }) // colorPalette 变换得到颜色值

    const colorPalettes = generate(color)
    const rgb = client.varyColor.toNum3(color.replace('#', '')).join(',')
    return lightens.concat(colorPalettes).concat(rgb)
  },
  /**
   * 改变主题颜色
   * @param newColor
   * @returns {Promise<unknown>}
   */
  changeColor: function changeColor (newColor) {
    const newColors = []
    newColor.forEach(color => {
      newColors.push(...this.getAntdSerials(color))
    })
    const options = {
      newColors: newColors,
      // new colors array, one-to-one corresponde with `matchColors`
      changeUrl: function changeUrl (cssUrl) {
        let actualUrl = '/'
        // 需要添加一个上下文才可以正确获取到横撑的css文件
        if (process.env.BASE_URL !== '/') {
          actualUrl = process.env.BASE_URL
        }
        return actualUrl.concat(cssUrl) // while router is not `hash` mode, it needs absolute path
      },
    }
    return client.changer.changeColor(options)
  },
}

/**
 * 切换主题颜色
 * @param newPrimaryColor
 * @param iFrameShowMessage
 */
export function updateTheme (newPrimaryColor, iFrameShowMessage) {
  let hideMessage
  if (iFrameShowMessage) {
    hideMessage = message.loading(window.pageVmObj.$t('theme.changing'), 0)
  }
  themeColor.changeColor(newPrimaryColor).then(() => {
    if (hideMessage) {
      hideMessage()
    }
  })
}

/**
 * 切换暗黑模式
 * @param colorWeak
 */
export function updateColorWeak (colorWeak) {
  const app = document.body
  colorWeak ? app.classList.add('colorWeak') : app.classList.remove('colorWeak')
}
