// 导出该模块路由
export default [
  {
    title: '系统字典管理',
    name: 'dictionaryManager',
    path: 'dictionaryManager',
    component: () => import(/* webpackChunkName: "routes/systemModules/dictionaryManager" */ './dictionaryManager.vue'),
    children: [
      {
        path: 'dictMg',
        name: 'dictMg',
        component: () => import(/* webpackChunkName: "routes/systemModules/dictMg" */ './part/dictMg.vue'),
      },
      {
        path: 'dictTypeMg',
        name: 'dictTypeMg',
        component: () => import(/* webpackChunkName: "routes/systemModules/dictTypeMg" */ './part/dictTypeMg.vue'),
      },
      { path: '', redirect: { name: 'dictMg', }, }
    ],
  }
]
