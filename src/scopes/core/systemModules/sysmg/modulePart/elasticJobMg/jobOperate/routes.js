// 导出该模块路由
export default [
  {
    title: '作业操作',
    name: 'jobOperate',
    path: 'jobOperate',
    component: () => import(/* webpackChunkName: "routes/systemModules/jobOperate" */ './jobOperate.vue'),
    children: [
      {
        path: 'jobDimensionality',
        name: 'jobDimensionality',
        component: () => import(/* webpackChunkName: "routes/systemModules/jobDimensionality" */ './part/jobDimensionality.vue'),
      },
      {
        path: 'serverDimensionality',
        name: 'serverDimensionality',
        components: {
          serverDimensionality: () => import(/* webpackChunkName: "routes/systemModules/serverDimensionality" */ './part/serverDimensionality.vue'),
        },
      }
    ],
  }
]
