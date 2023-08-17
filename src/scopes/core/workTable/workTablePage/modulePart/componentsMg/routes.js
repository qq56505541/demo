// 导出该模块路由
export default [
  {
    title: '工作台组件管理',
    name: 'componentsMg',
    path: 'componentsMg',
    component: () => import(/* webpackChunkName: "routes/workTablePage/componentsMg" */ './componentsMg.vue'),
  }
]
