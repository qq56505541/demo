// 导出该模块路由
export default [
  {
    title: '审核角色管理',
    name: 'examinerAuthority',
    path: 'examinerAuthority',
    component: () => import(/* webpackChunkName: "routes/orgModules/examinerAuthority" */ './examinerAuthority.vue'),
    children: [
      {
        path: 'addRole',
        name: 'addRole',
        component: () => import(/* webpackChunkName: "routes/orgModules/addRole" */ './part/role/addRole.vue'),
      },
      {
        path: 'roleAuthority',
        name: 'roleAuthority',
        component: () => import(/* webpackChunkName: "routes/orgModules/roleAuthorityMg" */ './part/role/roleAuthorityMg.vue'),
      },
      {
        path: 'roleManagement',
        name: 'roleManagement',
        component: () => import(/* webpackChunkName: "routes/orgModules/roleManagement" */ './part/role/roleManagement.vue'),
      },
      {
        path: 'roleOrgAuthority',
        name: 'roleOrgAuthority',
        component: () => import(/* webpackChunkName: "routes/orgModules/roleOrgAuthority" */ './part/role/roleOrgAuthority.vue'),
      },
      {
        path: 'roleUserMg',
        name: 'roleUserMg',
        component: () => import(/* webpackChunkName: "routes/orgModules/roleUserMg" */ './part/role/roleUserMg.vue'),
      },

      {
        path: 'userManagement',
        name: 'userManagement',
        component: () => import(/* webpackChunkName: "routes/orgModules/userManagement" */ './part/user/userManagement.vue'),
      },
      {
        path: 'userRoleMg',
        name: 'userRoleMg',
        component: () => import(/* webpackChunkName: "routes/orgModules/userRoleMg" */ './part/user/userRoleMg.vue'),
      }
    ],
  }
]
