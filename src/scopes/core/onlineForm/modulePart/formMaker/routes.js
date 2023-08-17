// 导出该模块路由
export default [
  {
    title: '表单设计',
    name: 'formMaker',
    path: 'formMaker',
    component: () => import(/* webpackChunkName: "routes/onlineDev/formMaker" */'./formMaker.vue'),
  }
]
