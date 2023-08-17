// 导出该模块路由
export default [
  {
    title: '分步表单',
    name: 'stepForm',
    path: 'stepForm',
    component: () => import(/* webpackChunkName: "routes/projectDemo/stepForm" */ './stepForm/stepForm.vue'),
  },
  {
    title: '复杂表单',
    name: 'formComplex',
    path: 'formComplex',
    component: () => import(/* webpackChunkName: "routes/projectDemo/formComplex" */ './formComplex/formComplex.vue'),
  }
]
