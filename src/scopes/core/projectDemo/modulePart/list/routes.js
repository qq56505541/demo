export default [{
  title: '标准列表',
  name: 'standardList',
  path: 'standardList',
  component: () => import(/* webpackChunkName: "routes/projectDemo/standardList/standardList" */ './standardList/standardList.vue'),
}, {
  title: '搜索列表',
  path: 'searchList',
  component: () => import(/* webpackChunkName: "routes/projectDemo/searchList/searchList" */ './searchList/searchList.vue'),
  children: [{
    title: '文章搜索',
    name: 'articleSearch',
    path: 'articleSearch',
    component: () => import(/* webpackChunkName: "routes/projectDemo/searchList/part/articleList" */ './searchList/part/articleList.vue'),
  }, {
    title: '项目搜索',
    name: 'projectSearch',
    path: 'projectSearch',
    component: () => import(/* webpackChunkName: "routes/projectDemo/searchList/part/projectList" */ './searchList/part/projectList.vue'),
  }, {
    title: '应用搜索',
    name: 'appSearch',
    path: 'appSearch',
    component: () => import(/* webpackChunkName: "routes/projectDemo/searchList/part/appList" */ './searchList/part/appList.vue'),
  }],
}, {
  title: '查询表格',
  name: 'tableSearch',
  path: 'tableSearch',
  component: () => import('./searchTable/searchTable.vue'),
},
{
  title: '编辑表格',
  name: 'tableEdit',
  path: 'tableEdit',
  component: () => import('./tableEdit/tableEdit.vue'),
},
{
  title: '卡片列表',
  name: 'cardList',
  path: 'cardList',
  component: () => import('./cardList/cardList.vue'),
}

]
