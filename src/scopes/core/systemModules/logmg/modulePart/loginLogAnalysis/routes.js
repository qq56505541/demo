// 导出该模块路由
export default [
  {
    title: '登录日志统计',
    name: 'loginLogAnalysis',
    path: 'loginLogAnalysis',
    component: () => import(/* webpackChunkName: "routes/systemModules/loginLogAnalysis" */ './loginLogAnalysis.vue'),
    children: [
      {
        path: 'online',
        name: 'online',
        component: () => import(/* webpackChunkName: "routes/systemModules/online" */ './part/online.vue'),
      },
      {
        path: 'loginHistory',
        name: 'loginHistory',
        components: {
          loginHistory: () => import(/* webpackChunkName: "routes/systemModules/loginHistory" */ './part/loginHistory.vue'),
        },
      },
      {
        path: 'environment',
        name: 'environment',
        components: {
          environment: () => import(/* webpackChunkName: "routes/systemModules/environment" */ './part/environment.vue'),
        },
      }
    ],
  }
]
