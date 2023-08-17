// 导出该模块路由
export default [
  {
    title: '标签管理',
    name: 'tagManagement',
    path: 'tagManagement',
    component: () => import(/* webpackChunkName: "routes/systemModules/tagManagement" */ './tagManagement.vue'),
  }
]
