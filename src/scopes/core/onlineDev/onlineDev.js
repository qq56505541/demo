import { Vue, taMixins, store,checkLogin } from 'common/js/public-ant-modules.js'// 引入公共文件
import router from './router/index'
import design from './store/index'

import {
  steps,
  eTree,
  checkbox,
  tooltip,
  empty,
  select,
  tagSelect,
  radio,
  labelCon,
  tabs,
  drawer,
  inputNumber,
  Switch,
  treeSelect,
  table,
  popconfirm,
  datePicker,
  timePicker,
  slider,
  rate,
  colorPicker,
  tableOperate,
} from '@yh/ta404-ui' // 引入 改模块的路由模块

Vue.use(steps)
Vue.use(eTree)
Vue.use(checkbox)
Vue.use(tooltip)
Vue.use(empty)
Vue.use(select)
Vue.use(tagSelect)
Vue.use(radio)
Vue.use(labelCon)
Vue.use(tabs)
Vue.use(drawer)
Vue.use(inputNumber)
Vue.use(Switch)
Vue.use(treeSelect)
Vue.use(table)
Vue.use(popconfirm)
Vue.use(datePicker)
Vue.use(timePicker)
Vue.use(rate)
Vue.use(slider)
Vue.use(colorPicker)
Vue.use(tableOperate)

store.registerModule('design', design)


let vm=null;
// 判断登录状态然后确认是否渲染页面
checkLogin(()=>{
  vm = new Vue({
    mixins: [taMixins],
    router,
    store,
  }).$mount('#app')
  window.vueBus = vm.$bus
})
