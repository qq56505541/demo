// 导出该模块路由
export default [{
  title: '基础详情',
  name: 'baseDetail',
  path: 'baseDetail',
  component: () => import(/* webpackChunkName: "routes/projectDemo/baseDetail" */ './baseDetail.vue'),
}, {
  title: '高级详情页',
  name: 'advancedDetail',
  path: 'advancedDetail',
  component: () => import(/* webpackChunkName: "routes/projectDemo/advancedDetail" */ './advancedDetail.vue'),
}, {
  title: '表单详情页',
  name: 'formDetail',
  path: 'formDetail',
  component: () => import(/* webpackChunkName: "routes/projectDemo/formDetail" */ './formDetail.vue'),
}]
