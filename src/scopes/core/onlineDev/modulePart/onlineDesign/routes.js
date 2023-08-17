// 导出该模块路由
export default [
  {
    title: '在线开发设计',
    name: 'onlineDesign',
    path: 'onlineDesign',
    component: () => import(/* webpackChunkName: "routes/onlineDev/OnlineDesign" */ './OnlineDesign.vue'),
  }
]
