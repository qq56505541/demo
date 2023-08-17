// 导出该模块路由
export default [
  {
    title: '项目模块实例part 1',
    name: 'modulePart1',
    path: 'modulePart1',
    component: () => import(/* webpackChunkName: "routes/onlineDev/modulePart1" */'./modulePart1.vue'),
  }
]
