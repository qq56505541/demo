import { Vue, store, taMixins, checkLogin, } from 'common/js/public-ant.js'// 引入公共文件
import router from './router/index' // 引入 改模块的路由模块

// 自己引入各种插件
import { cascader, alert, bigTable, Switch, datePicker, inputNumber, checkbox, upload, list, SearchPanel,} from '@yh/ta404-ui'
// 判断登录状态然后确认是否渲染页面

checkLogin(() => {
  new Vue({
    mixins: [taMixins],
    router,
    store,
  }).$mount('#app')
})
