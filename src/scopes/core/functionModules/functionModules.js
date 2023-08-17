// import {Vue, store, taMixins} from 'common/js/public-ant.js'// 引入公共文件
import { Vue, store, taMixins, checkLogin} from 'common/js/public-ant-modules.js'// 引入模块化公共文件
import router from './router/index' // 引入 改模块的路由模块

import {
  tagSelect,
  table,
  tableOperate,
  drawer,
  select,
  checkbox,
  pagination,
  divider,
  tooltip,
  popconfirm,
  pdfViewer,
  cascader,
  datePicker,
  inputNumber,
  radio,
  Switch,
  timePicker,
  treeSelect,
  collapse,
  popoverEx,
  userSelect,
  searchPanel,
  dropdown,
  menu,
  tag,
  card,
  tableEdit,
  colorPicker,
  tabs,
  carefulDelete,
  breadcrumb, alert, labelCon,
} from '@yh/ta404-ui'

Vue.use(tagSelect)
Vue.use(table)
Vue.use(tableOperate)
Vue.use(drawer)
Vue.use(select)
Vue.use(checkbox)
Vue.use(pagination)
Vue.use(divider)
Vue.use(tooltip)
Vue.use(popconfirm)
Vue.use(pdfViewer)
Vue.use(cascader)
Vue.use(datePicker)
Vue.use(inputNumber)
Vue.use(radio)
Vue.use(Switch)
Vue.use(timePicker)
Vue.use(treeSelect)
Vue.use(collapse)
Vue.use(popoverEx)
Vue.use(userSelect)
Vue.use(searchPanel)
Vue.use(dropdown)
Vue.use(menu)
Vue.use(tag)
Vue.use(card)
Vue.use(tableEdit)
Vue.use(colorPicker)
Vue.use(tabs)
Vue.use(carefulDelete)
Vue.use(breadcrumb)
Vue.use(alert)
Vue.use(labelCon)

Vue.directive('disabled', {
  bind: function (el, binding, vnode) {
    console.log(el) // el代表当前绑定的元素
    console.log(vnode.data)
  },
})

// 判断登录状态然后确认是否渲染页面
checkLogin(() => {
  // 把组件化页面挂载到节点app上
  new Vue({
    mixins: [taMixins],
    router,
    store,
  }).$mount('#app')
})
