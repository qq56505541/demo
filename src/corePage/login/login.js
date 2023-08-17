import '@/common/js/util/ieCompatibility'
import faceConfig from 'faceConfig'
import Vue from 'vue'
import './js/module' // 引入需要的组件
import app from './login.vue'
import store from './store/loginStore'
import '@/common/less/dark-mode.less'
import { isIE, } from '@yh/ta-utils'
import { i18nFunc, i18nMixins, } from 'common/js/util/i18nConfig'
import { themeMixins, } from '@/common/js/mixins/themeMixins'
import { initCrypto, } from '@common/js/crypto/crypto'

window.faceConfig = faceConfig

// 动态注入主题设置
if (!isIE()) {
  // 动态注入主题设置
  import('common/js/util/themeConfig').then(({ injectTheme, }) => {
    injectTheme(Vue)
  })
}
const i18n = i18nFunc(require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i))

async function cryptoFn () {
  await initCrypto(true)
  new Vue({
    mixins: [themeMixins, i18nMixins],
    store,
    render: h => h(app),
    i18n,
  }).$mount('#app')
}

cryptoFn()
