import './util/ieCompatibility'
import faceConfig from 'faceConfig'
import Vue from 'vue'
import Router from 'vue-router'
// 引入打包好Ta404UI
import Ta404UI from '@yh/ta404-ui/dist/ta404-ui'
import '@yh/ta404-ui/es/style/components.less'

import store from '@/common/store'
import taMixins from './mixins/mixins.js'
import VueBus from 'vue-bus'
import './util/authority'
import '@/common/less/reset.less'
import '@/common/less/dark-mode.less'
// 添加框架组件样式覆盖样式文件
import '@projectCommon/styleCover/styleCover.less'

import { isIE, } from '@yh/ta-utils'
// 引入TaUtils
import * as TaUtils from '@yh/ta-utils'
import { baseUtil, } from './polyfill/base.util.polyfill'
import { checkLogin, } from 'common/js/crypto/crypto'
// 引入路由蒙层
import { routeLoading, } from './util/routeLoading'
window.TaUtils = {
  ...TaUtils,
  ...baseUtil,
}

// 动态注入主题设置
if (!isIE()) {
  // 动态注入主题设置
  import('common/js/util/themeConfig').then(({ injectTheme, }) => {
    injectTheme(Vue)
  })
}

window.faceConfig = {
  // 仅用于支持pdf-viewer,这个值不要做任何修改
  context: process.env.VUE_APP_PUBLIC_PATH,
  ...faceConfig,
}
if (!isIE()) {
  // 动态注入主题设置
  import('common/js/util/themeConfig').then(({ injectTheme, }) => {
    injectTheme(Vue)
  })
}

window.routeLoading = routeLoading

Vue.use(Ta404UI)
Vue.use(VueBus)

// 解决路由promise报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => err)
}

// 数据字典初始化
const dict = require('@yh/ta404-ui/es/_dict')
dict.default.init(Vue, store)
export {
  Vue,
  store,
  taMixins,
  checkLogin
}
