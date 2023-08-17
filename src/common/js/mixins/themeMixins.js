import { changeTheme as actualChangeTheme, } from 'common/js/util/themeConfig'
import faceConfig from 'faceConfig'
import { updateColorWeak, } from '@/style/themeUtils'

export const themeMixins = {
  methods: {
    /**
     * 切换主题颜色
     * @param value
     */
    changeTheme (value) {
      if (faceConfig.onlineTheme) {
        return actualChangeTheme(value)
      }
    },
    /**
     * 是否启用暗黑模式
     * @param checked
     */
    updateColorWeak (checked) {
      return updateColorWeak(checked)
    },
  },
}
