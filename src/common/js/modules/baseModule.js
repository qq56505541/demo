import Vue from 'vue'
// 引入基础工具
import formUtil from '@yh/ta404-ui/es/utils/js/form.util'
import downloadFile from '@yh/ta404-ui/es/utils/js/downloadFile'
import windowUtil from '@yh/ta404-ui/es/utils/js/window.util'
// 兼容旧的Base Util API
import { baseUtil, } from '../polyfill/base.util.polyfill'
// 引入基础组件
import {
  borderLayout,
  button,
  col,
  configProvider,
  containerMask,
  form,
  icon,
  input,
  message,
  modal,
  notification,
  row,
  spin,
} from '@yh/ta404-ui'

import '@yh/ta-utils/crossDomain'

Vue.use(button)
Vue.use(form)
Vue.use(input)
Vue.use(modal)
Vue.use(icon)
Vue.use(spin)
Vue.use(containerMask)
Vue.use(message)
// Vue.use(localeProvider)
Vue.use(configProvider)
Vue.use(borderLayout)
Vue.use(row)
Vue.use(col)
Vue.use(notification)

const uiUtils = {
  downloadFile,
  ...formUtil,
  ...windowUtil,
  ...containerMask.$mask,
}

// 注册工具到Base上
Vue.prototype.Base = {
  ...uiUtils,
  // 用于兼容旧的Base
  ...baseUtil,
}

Vue.prototype.$message = message
Vue.prototype.$info = modal.info
Vue.prototype.$success = modal.success
Vue.prototype.$error = modal.error
Vue.prototype.$warning = modal.warning
Vue.prototype.$confirm = modal.confirm
Vue.prototype.$notification = notification
window.message = message
window.notification = notification
window.Modal = modal
window.Spin = spin
window.Base = Vue.prototype.Base

window.TaUtils = {
  ...baseUtil,
}
