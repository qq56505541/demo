// 导出该模块路由
export default [
  {
    title: '作业管理',
    name: 'jobManager',
    path: 'jobManager',
    component: () => import(/* webpackChunkName: "routes/systemModules/jobManager" */ './jobManager.vue'),
    children: [
      {
        path: 'zookeeperRegistryCenterConfig',
        name: 'zookeeperRegistryCenterConfig',
        component: () => import(/* webpackChunkName: "routes/systemModules/zookeeperRegistryCenterConfig" */ './part/zookeeperRegistryCenterConfig.vue'),
      },
      {
        path: 'jobDimensionality',
        name: 'jobDimensionality',
        component: () => import(/* webpackChunkName: "routes/systemModules/jobDimensionality" */ './part/jobDimensionality.vue'),
      },
      {
        path: 'serverDimensionality',
        name: 'serverDimensionality',
        component: () => import(/* webpackChunkName: "routes/systemModules/serverDimensionality" */ './part/serverDimensionality.vue'),
      },
      {
        path: 'freeBusyJobManager',
        name: 'freeBusyJobManager',
        component: () => import(/* webpackChunkName: "routes/systemModules/freeBusyJobManager" */ './part/freeBusyJobManager.vue'),
      },
      {
        path: 'jobDetail',
        name: 'jobDetail',
        component: () => import(/* webpackChunkName: "routes/systemModules/jobDetail" */ './part/jobDetail.vue'),
      },
      {
        path: 'serverDetail',
        name: 'serverDetail',
        component: () => import(/* webpackChunkName: "routes/systemModules/serverDetail" */ './part/serverDetail.vue'),
      },
      { path: '', redirect: { name: 'zookeeperRegistryCenterConfig', }, }
    ],
  }
]
