// 导出该模块路由
export default [
  {
    title: '作业进度',
    name: 'jobProgress',
    path: 'jobProgress',
    component: () => import(/* webpackChunkName: "routes/systemModules/jobProgress" */ './jobProgress.vue'),
  }
]
