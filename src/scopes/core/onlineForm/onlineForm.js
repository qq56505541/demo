import {Vue, store, taMixins,checkLogin} from 'common/js/public-ant-modules.js'// 引入公共文件
import router from './router/index' // 引入 改模块的路由模块

// 自己引入各种插件

import FormDesigner from './modulePart/formMaker/packages'
import {
  drawer,
  labelCon,
  select,
  inputNumber,
  Switch,
  tabs,
  radio,
  checkbox,
  table,
  divider,
  colorPicker,
  pagination,
  tableOperate,
  tag,
  popconfirm,
  dropdown,
  menu,
  tagSelect,
  carefulDelete,
  tooltip,
  popoverEx,
  cascader,
  treeSelect,
  eTree,
  datePicker,
  timePicker,
  rate,
  slider,
  collapse
} from '@yh/ta404-ui'

Vue.use(FormDesigner)
Vue.use(drawer)
Vue.use(labelCon)
Vue.use(select)
Vue.use(inputNumber)
Vue.use(Switch)
Vue.use(tabs)
Vue.use(radio)
Vue.use(checkbox)
Vue.use(table)
Vue.use(divider)
Vue.use(colorPicker)
Vue.use(pagination)
Vue.use(tableOperate)
Vue.use(tag)
Vue.use(menu)
Vue.use(carefulDelete)
Vue.use(tooltip)
Vue.use(popoverEx)
Vue.use(tagSelect)
Vue.use(dropdown)
Vue.use(popconfirm)
Vue.use(cascader)
Vue.use(treeSelect)
Vue.use(eTree)
Vue.use(datePicker)
Vue.use(timePicker)
Vue.use(rate)
Vue.use(slider)
Vue.use(collapse)



// 判断登录状态然后确认是否渲染页面
checkLogin(()=>{
  // 把组件化页面挂载到节点app上
  new Vue({
    mixins: [taMixins],
    router,
    store
  }).$mount('#app');
})
