// 导出该模块路由
export default [
  {
    title: '登录日志统计',
    name: 'loginLogAnalysis',
    path: 'loginLogAnalysis',
    component: () => import(/* webpackChunkName: "routes/audit/loginLogAnalysis" */ './loginLogAnalysis.vue'),
    children: [
      {
        path: 'online',
        name: 'online',
        component: () => import(/* webpackChunkName: "routes/audit/online" */ './part/online.vue'),
      },
      {
        path: 'loginHistory',
        name: 'loginHistory',
        components: {
          loginHistory: () => import(/* webpackChunkName: "routes/audit/loginhistory" */ './part/loginHistory.vue'),
        },
      },
      {
        path: 'environment',
        name: 'environment',
        components: {
          environment: () => import(/* webpackChunkName: "routes/audit/environment" */ './part/environment.vue'),
        },
      }
    ],
  }
]
