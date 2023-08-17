// 导出该模块路由
export default [
  {
    title: '模板管理',
    name: 'formTemplate',
    path: 'formTemplate',
    component: () => import(/* webpackChunkName: "routes/onlineDev/formTemplate" */'./formTemplate.vue'),
  }
]
