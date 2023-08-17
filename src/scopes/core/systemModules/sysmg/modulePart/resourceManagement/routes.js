// 导出该模块路由
export default [
  {
    title: '功能资源管理',
    name: 'resourceManagement',
    path: 'resourceManagement',
    component: () => import(/* webpackChunkName: "routes/systemModules/resourceManagement" */ './resourceManagement.vue'),
  }
]
