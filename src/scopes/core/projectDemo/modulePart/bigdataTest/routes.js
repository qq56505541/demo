// 导出该模块路由
export default [
  {
    title: 'select组件测试',
    name: 'selectTest',
    path: 'selectTest',
    component: () => import('./selectTest.vue'),
  },
  {
    title: 'treeSelect组件测试',
    name: 'treeSelectTest',
    path: 'treeSelectTest',
    component: () => import('./treeSelectTest.vue'),
  },
  {
    title: 'cascader组件测试',
    name: 'cascaderTest',
    path: 'cascaderTest',
    component: () => import('./cascaderTest.vue'),
  },
  {
    title: 'tree组件测试',
    name: 'treeTest',
    path: 'treeTest',
    component: () => import('./treeTest.vue'),
  },
  {
    title: '大数据表格测试',
    name: 'bigTableTest',
    path: 'bigTableTest',
    component: () => import('./bigTableTest/bigTableTest.vue'),
  }
]
