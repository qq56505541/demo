// 导出该模块路由
export default [
  {
    title: '相似权限授权管理',
    name: 'similarAuthority',
    path: 'similarAuthority',
    component: () => import(/* webpackChunkName: "routes/orgModules/similarAuthority" */ './similarAuthority.vue'),
  },
  {
    path: 'grantAuthority',
    name: 'grantAuthority',
    component: () => import(/* webpackChunkName: "routes/orgModules/grantAuthority" */ './part/grantAuthority.vue'),
  }
]
