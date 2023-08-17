// 导出该模块路由
export default [
  {
    title: '在线功能页面',
    name: 'onlinePage',
    path: 'onlinePage',
    component: () => import(/* webpackChunkName: "routes/onlineDev/OnlinePage" */ './OnlinePage.vue'),
  }
]
