// 导出该模块路由
export default [
  {
    title: '患者列表',
    name: 'patientList',
    path: 'patientList',
    component: () => import(/* webpackChunkName: "routes/workTablePage/modulePart1" */'./patientList.vue'),
  },
  {
    title: '管理患者',
    name: 'managePage',
    path: 'managePage',
    component: () => import(/* webpackChunkName: "routes/workTablePage/modulePart1" */'./part/managePage'),
  }
]
