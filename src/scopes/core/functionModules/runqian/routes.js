// 导出该模块路由
export default [
  {
    title: '润乾',
    name: 'runqian',
    path: 'runqian',
    component: () => import(/* webpackChunkName: "routes/functionModules/runqian" */ './runqian.vue'),
  }
]
