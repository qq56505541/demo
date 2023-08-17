import '@/common/js/util/ieCompatibility'
import faceConfig from 'faceConfig'
import Vue from 'vue'
import Vuex from 'vuex'
import indexStore from './store/indexStore'
import componentStore from '@yh/ta404-ui/es/store'
import '@yh/ta-utils/crossDomain'
import { themeMixins, } from '@/common/js/mixins/themeMixins'
// 完整引入
// import Vue from 'vue'
// import Ta404UI from '@yh/ta404-ui'
// import '@yh/ta404-ui/es/style/components.less'
// import '@yh/ta404-ui/es/style/index.less'
// 模块化引入
import './js/module'
import app from './index.vue'
import '@/common/less/reset.less'
import '@/common/less/dark-mode.less'
import { colorPicker, Tooltip, PopoverEx, richEditor, } from '@yh/ta404-ui'
import { isIE, } from '@yh/ta-utils'
import { i18nFunc, i18nMixins, } from 'common/js/util/i18nConfig'
import { checkLogin, } from 'common/js/crypto/crypto'

window.faceConfig = faceConfig

Vue.use(Vuex)
Vue.use(colorPicker)
Vue.use(Tooltip)
Vue.use(PopoverEx)
Vue.use(richEditor)
if (!isIE()) {
  // 动态注入主题设置
  import('common/js/util/themeConfig').then(({ injectTheme, }) => {
    injectTheme(Vue)
  })
}

const i18n = i18nFunc(require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i))
require('./js/SSOAdapt')

// 判断登录状态然后确认是否渲染页面
checkLogin(() => {
  const store = new Vuex.Store({
    modules: {
      indexStore,
      ...componentStore,
    },
  })
  new Vue({
    mixins: [themeMixins, i18nMixins],
    store,
    render: h => h(app),
    i18n,
  }).$mount('#app')
})
