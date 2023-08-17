// import { Vue, store, taMixins } from 'common/js/public-ant.js'// 引入公共文件
import { Vue, store, taMixins, checkLogin} from 'common/js/public-ant-modules.js'// 引入模块化公共文件
import router from './router/index' // 引入 改模块的路由模块
import {
  bigTable,
  drawer,
  popconfirm,
  menu,
  dropdown,
  tag,
  tooltip,
  divider,
  carefulDelete,
} from '@yh/ta404-ui'
import tableOperate from '@yh/ta404-ui/es/table-operate'



Vue.use(carefulDelete)
Vue.use(bigTable)
Vue.use(drawer)
Vue.use(popconfirm)
Vue.use(menu)
Vue.use(dropdown)
Vue.use(tableOperate)
Vue.use(tag)
Vue.use(tooltip)
Vue.use(divider)

// 判断登录状态然后确认是否渲染页面
checkLogin(() => {
  // 把组件化页面挂载到节点app上
  new Vue({
    mixins: [taMixins],
    router,
    store,
  }).$mount('#app')
})
