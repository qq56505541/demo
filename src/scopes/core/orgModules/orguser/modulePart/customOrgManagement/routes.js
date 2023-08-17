// 导出该模块路由
export default [
  {
    title: '自定义组织管理',
    name: 'customOrgManagement',
    path: 'customOrgManagement',
    component: () => import(/* webpackChunkName: "routes/orgModules/customOrgManagement" */ './customOrgManagement.vue'),
  },
  {
    path: 'customOrgUser',
    name: 'customOrgUser',
    component: () => import(/* webpackChunkName: "routes/orgModules/customOrgUser" */ './part/customOrgUser.vue'),
  },
  { path: '', redirect: { name: 'customOrgManagement', }, }
]
