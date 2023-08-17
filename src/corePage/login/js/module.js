import Vue from 'vue'
// 引入@yh/ta404-ui中的工具
import formUtil from '@yh/ta404-ui/es/utils/js/form.util'
import cryptoFn from '@yh/ta404-ui/es/utils/js/cryptoFn'
import windowUtil from '@yh/ta404-ui/es/utils/js/window.util'
// 引入@yh/ta-utils中的工具
import { getNowPageParam, objectToUrlParam, getCookie, setCookie, getToken, webStorage, } from '@yh/ta-utils'
import { button, containerMask, form, icon, input, message, modal, select, spin, popoverEx, } from '@yh/ta404-ui'

Vue.use(button)
Vue.use(form)
Vue.use(input)
Vue.use(modal)
Vue.use(icon)
Vue.use(spin)
Vue.use(containerMask)
Vue.use(message)
Vue.use(select)
Vue.use(popoverEx)
const polyfill = {
  getCookie,
  setCookie,
  getToken,
  getNowPageParam,
  objectToUrlParam,
  webStorage,
}
const loginUtils = {
  ...windowUtil,
  ...formUtil,
  // 如果不需要在Base上使用polyfill中的工具，则下面的可以注释
  ...polyfill,
  ...cryptoFn
}
Vue.prototype.Base = {
  ...loginUtils,
  ...containerMask.$mask,
}
Vue.prototype.$message = message
Vue.prototype.$info = modal.info
Vue.prototype.$success = modal.success
Vue.prototype.$error = modal.error
Vue.prototype.$warning = modal.warning
Vue.prototype.$confirm = modal.confirm
window.Base = Vue.prototype.Base
window.message = message

window.TaUtils = {
  ...polyfill,
}
