// 导出该模块路由
export default [
  {
    title: 'word转html',
    name: 'wordToHtml',
    path: 'wordToHtml',
    component: () => import(/* webpackChunkName: "routes/wordToHtml" */'./wordToHtml.vue'),
  }
]
