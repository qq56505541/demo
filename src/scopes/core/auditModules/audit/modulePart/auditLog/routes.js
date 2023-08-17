// 导出该模块路由
export default [
  {
    title: '审计日志',
    name: 'auditLog',
    path: 'auditLog',
    component: () => import(/* webpackChunkName: "routes/audit/auditLog" */ './auditLog.vue'),
  }
]
