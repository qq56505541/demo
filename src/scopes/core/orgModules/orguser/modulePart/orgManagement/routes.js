// 导出该模块路由
export default [
  {
    title: '组织机构管理',
    name: 'orgManagement',
    path: 'orgManagement',
    component: resolve => {
      routeLoading.show()// 加载时开启loading
      require(['./orgManagement.vue'], routeLoading.resolve(resolve))// 路由懒加载
    },
  }
]
