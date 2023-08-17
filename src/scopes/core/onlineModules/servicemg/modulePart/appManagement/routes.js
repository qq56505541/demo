// 导出该模块路由
export default [
  {
    title: '应用管理',
    name: 'appManagement',
    path: 'appManagement',
    component: () => import(/* webpackChunkName: "routes/onlineModules/appManagement" */ './appManagement.vue'),
  },
  {
    title: '概况',
    path: 'console',
    component: () => import(/* webpackChunkName: "routes/onlineModules/console" */ './part/console.vue'),
    children: [
      {
        path: '/',
        component: () => import(/* webpackChunkName: "routes/onlineModules/dashboard" */ './part/dashboard.vue'),
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import(/* webpackChunkName: "routes/onlineModules/dashboard" */ './part/dashboard.vue'),
      },
      {
        path: '/assemble',
        name: 'assemble',
        component: () => import(/* webpackChunkName: "routes/onlineModules/assemble" */ './part/assemble.vue'),
      },
      {
        path: '/dataInfo',
        name: 'dataInfo',
        component: () => import(/* webpackChunkName: "routes/onlineModules/dataInfo" */ './part/dataInfo.vue'),
      },
      {
        path: '/siteSetting',
        component: () => import(/* webpackChunkName: "routes/onlineModules/siteSetting" */ './part/siteSetting.vue'),
        children: [
          {
            path: '/',
            name: 'deploymentSetting',
            component: () => import(/* webpackChunkName: "routes/onlineModules/deploymentSetting" */ './part/deploymentSetting.vue'),
          }
        ],
      }
    ],
  }
]
