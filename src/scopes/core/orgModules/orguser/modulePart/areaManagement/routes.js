// 导出该模块路由
export default [
  {
    title: '行政区划管理',
    name: 'areaManagement',
    path: 'areaManagement',
    component: () => import(/* webpackChunkName: "routes/orgModules/areaManagement" */ './areaManagement.vue'),
  },
  { path: '', redirect: { name: 'areaManagement', }, }
]
