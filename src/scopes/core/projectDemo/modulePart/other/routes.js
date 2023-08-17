// 导出该模块路由
export default [
  {
    title: '润乾',
    name: 'runqianPage',
    path: 'runqianPage',
    component: () => import(/* webpackChunkName: "routes/projectDemo/runqianPage" */ './runqian/runqianPage.vue'),
  },
  {
    title: 'parent1',
    name: 'parent1',
    path: 'parent1',
    component: () => import('./modulePart1/parent1'),
    children: [{
      title: 'child1-1',
      name: 'child1-1',
      path: 'child1-1',
      component: () => import('./modulePart1/part/child1-1'),
    }, {
      title: 'child1-2',
      name: 'child1-2',
      path: 'child1-2',
      component: () => import('./modulePart1/part/child1-2'),
    }],
  },
  {
    title: 'parent2',
    name: 'parent2',
    path: 'parent2',
    component: () => import('./modulePart2/parent2'),
    children: [{
      title: 'child2-1',
      name: 'child2-1',
      path: 'child2-1',
      component: () => import('./modulePart2/part/child2-1'),
    }, {
      title: 'child2-2',
      name: 'child2-2',
      path: 'child2-2',
      component: () => import('./modulePart2/part/child2-2'),
    }],
  }
]
