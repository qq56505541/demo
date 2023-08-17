// 导出该模块路由
export default [
  {
    title: '审核权限',
    name: 'examineManagement',
    path: 'examineManagement',
    component: () => import(/* webpackChunkName: "routes/orgModules/examineManagement" */ './examineManagement.vue'),
  },
  {
    title: '审核记录',
    name: 'examineManagementLog',
    path: 'examineManagementLog',
    component: () => import(/* webpackChunkName: "routes/orgModules/examineManagementLog" */ './examineManagementLog.vue'),
  }
]
