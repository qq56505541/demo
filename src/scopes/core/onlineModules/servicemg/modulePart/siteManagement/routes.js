// 导出该模块路由
export default [
  {
    title: '站点管理',
    name: 'siteManagement',
    path: 'siteManagement',
    component: () => import(/* webpackChunkName: "routes/onlineModules/siteManagement" */ './siteManagement.vue'),
  }
]
