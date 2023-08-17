// 导出该模块路由
export default [
  {
    title: '作业历史管理',
    name: 'jobHistory',
    path: 'jobHistory',
    component: () => import(/* webpackChunkName: "routes/systemModules/jobHistory" */ './jobHistory.vue'),
    children: [
      {
        path: 'jobDatasourceConfig',
        name: 'jobDatasourceConfig',
        component: () => import(/* webpackChunkName: "routes/systemModules/jobDatasourceConfig" */ './part/jobDatasourceConfig.vue'),
      },
      {
        path: 'jobExecutionTrace',
        name: 'jobExecutionTrace',
        component: () => import(/* webpackChunkName: "routes/systemModules/jobExecutionTrace" */ './part/jobExecutionTrace.vue'),
      },
      {
        path: 'jobStatusTrace',
        name: 'jobStatusTrace',
        component: () => import(/* webpackChunkName: "routes/systemModules/jobStatusTrace" */ './part/jobStatusTrace.vue'),
      },
      { path: '', redirect: { name: 'jobDatasourceConfig', }, }
    ],
  }
]
