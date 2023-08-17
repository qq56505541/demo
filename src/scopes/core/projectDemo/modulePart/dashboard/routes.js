// 导出该模块路由
export default [
  {
    title: '仪表盘',
    name: 'dashboardPage',
    path: 'dashboardPage',
    component: () => import(/* webpackChunkName: "routes/projectDemo/dashboardPage" */ './dashboardPage.vue'),
  }, {
    title: '404Pro工作台',
    name: 'worktable',
    path: 'worktable',
    component: () => import(/* webpackChunkName: "routes/projectDemo/dashboardPage" */ './worktable/worktable.vue'),
  }, {
    title: '分析页',
    name: 'analysisPage',
    path: 'analysisPage',
    component: () => import(/* webpackChunkName: "routes/projectDemo/dashboardPage" */ './analysisPage/analysisPage.vue'),
  }
]
