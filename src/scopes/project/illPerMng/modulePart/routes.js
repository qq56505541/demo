// 导出该模块路由
export default [
  {
    title: '患者管理',
    name: 'modulePart',
    path: 'modulePart',
    component: () => import('./modulePart.vue'),
  }
]
