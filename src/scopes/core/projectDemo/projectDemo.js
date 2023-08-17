import { Vue, store, taMixins, checkLogin} from 'common/js/public-ant-modules.js'// 引入模块化公共文件// 引入公共文件
import router from './router/index' // 引入 改模块的路由模块
import './mock/index'



// 自己引入各种插件
import {
  tagSelect,
  table,
  drawer,
  pagination,
  checkbox,
  select,
  tableOperate,
  tooltip,
  pdfViewer,
  card,
  radio,
  list,
  avatar,
  progress,
  BigTable,
  tabs,
  pageHeader,
  tag,
  rate,
  inputNumber,
  Switch,
  cascader,
  treeSelect,
  datePicker,
  timePicker,
  userInput,
  suggest,
  colorPicker,
  affix,
  skeleton,
  Descriptions,
  Result,
  Statistic,
  badge,
  Steps,
  echarts,
  labelCon,
  tree,
} from '@yh/ta404-ui'

Vue.use(inputNumber)
Vue.use(timePicker)
Vue.use(datePicker)
Vue.use(Switch)
Vue.use(cascader)
Vue.use(treeSelect)
Vue.use(BigTable)
Vue.use(tagSelect)
Vue.use(table)
Vue.use(drawer)
Vue.use(pagination)
Vue.use(checkbox)
Vue.use(Descriptions)
Vue.use(select)
Vue.use(tableOperate)
Vue.use(tooltip)
Vue.use(pdfViewer)
Vue.use(card)
Vue.use(radio)
Vue.use(list)
Vue.use(avatar)
Vue.use(progress)
Vue.use(tabs)
Vue.use(pageHeader)
Vue.use(tag)
Vue.use(rate)
Vue.use(userInput)
Vue.use(suggest)
Vue.use(colorPicker)
Vue.use(echarts)
Vue.use(affix)
Vue.use(skeleton)
Vue.use(Result)
Vue.use(Statistic)
Vue.use(Descriptions)
Vue.use(badge)
Vue.use(Steps)
Vue.use(labelCon)
Vue.use(tree)

// 判断登录状态然后确认是否渲染页面
checkLogin(() => {
  // 把组件化页面挂载到节点app上
  new Vue({
    mixins: [taMixins],
    router,
    store,
  }).$mount('#app')
})
