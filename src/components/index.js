import Vue from 'vue'
import { button, } from '@yh/ta404-ui'
import demo from './demo.vue'

const install = (Vue) => {
  if (install.installed) {
    return
  }
  Vue.use(demo)
}

export default {
  install,
}
