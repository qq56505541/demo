// 导出该模块路由
export default [
  {
    title: '角色权限管理',
    name: 'roleAuthorityManagement',
    path: 'roleAuthorityManagement',
    component: () => import(/* webpackChunkName: "routes/orgModules/roleAuthorityManagement" */ './roleAuthorityManagement.vue'),
    children: [
      {
        name: 'publicRoleManager',
        path: 'publicRoleManager',
        component: () => import(/* webpackChunkName: "routes/orgModules/publicRoleManager" */ './part/publicRole/publicRoleManager.vue'),
      },
      {
        name: 'userRole',
        path: 'userRole',
        component: () => import(/* webpackChunkName: "routes/orgModules/userRole" */ './part/userRole/userRole.vue'),
      },
      {
        name: 'publicRoleUser',
        path: 'publicRoleUser',
        component: () => import(/* webpackChunkName: "routes/orgModules/publicRoleUser" */ './part/publicRole/publicRoleUser.vue'),
      },
      {
        name: 'publicRoleAuthority',
        path: 'publicRoleAuthority',
        component: () => import(/* webpackChunkName: "routes/orgModules/publicRoleAuthority" */ './part/publicRole/publicRoleAuthority.vue'),
      },
      {
        name: 'publicRoleCustomAuthority',
        path: 'publicRoleCustomAuthority',
        component: () => import(/* webpackChunkName: "routes/orgModules/publicRoleCustomAuthority" */ './part/publicRole/publicRoleCustomAuthority.vue'),
      },
      {
        name: 'roleMg',
        path: 'roleMg',
        component: () => import(/* webpackChunkName: "routes/orgModules/roleMg" */ './part/userRole/roleMg.vue'),
      },
      {
        name: 'batchAuthority',
        path: 'batchAuthority',
        component: () => import(/* webpackChunkName: "routes/orgModules/batchAuthority" */ './part/publicRole/batchAuthority.vue'),
      }
    ],
  }
]
