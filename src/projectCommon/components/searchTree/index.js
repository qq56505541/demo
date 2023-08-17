/**
 * 组织树搜索组件
 * add by Selina
 */
import Vue from 'vue'
import searchTree from './src/searchTree.vue'
import { suggest, } from '@yh/ta404-ui'

Vue.use(suggest)

searchTree.install = (Vue) => {
  Vue.component(searchTree.name, searchTree)
}

export default searchTree
