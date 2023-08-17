// 导出该模块路由
export default [
  {
    title: '管理员权限管理',
    name: 'adminAuthority',
    path: 'adminAuthority',
    component: () => import(/* webpackChunkName: "routes/orgModules/adminAuthority" */ './adminAuthority.vue'),
    children: [
      {
        path: 'adminRoleManagement',
        name: 'adminRoleManagement',
        component: () => import(/* webpackChunkName: "routes/orgModules/adminRoleManagement" */ './part/role/adminRoleManagement.vue'),
      },
      {
        path: 'adminUserMg',
        name: 'adminUserMg',
        component: () => import(/* webpackChunkName: "routes/orgModules/adminUserMg" */ './part/role/adminUserMg.vue'),
      },
      {
        path: 'adminUseAuthority',
        name: 'adminUseAuthority',
        component: () => import(/* webpackChunkName: "routes/orgModules/adminUseAuthority" */ './part/role/adminUseAuthority.vue'),
      },
      {
        path: 'adminGrantAuthority',
        name: 'adminGrantAuthority',
        component: () => import(/* webpackChunkName: "routes/orgModules/adminGrantAuthority" */ './part/role/adminGrantAuthority.vue'),
      },
      {
        path: 'adminOrgAuthority',
        name: 'adminOrgAuthority',
        component: () => import(/* webpackChunkName: "routes/orgModules/adminOrgAuthority" */ './part/role/adminOrgAuthority.vue'),
      },
      {
        path: 'adminObjectUseAuthority',
        name: 'adminObjectUseAuthority',
        component: () => import(/* webpackChunkName: "routes/orgModules/adminObjectUseAuthority" */ './part/role/adminObjectUseAuthority.vue'),
      },

      {
        path: 'adminObjectGrantAuthority',
        name: 'adminObjectGrantAuthority',
        component: () => import(/* webpackChunkName: "routes/orgModules/adminObjectGrantAuthority" */ './part/role/adminObjectGrantAuthority.vue'),
      },
      {
        path: 'adminUserManagement',
        name: 'adminUserManagement',
        component: () => import(/* webpackChunkName: "routes/orgModules/adminUserManagement" */ './part/user/adminUserManagement.vue'),
      },
      {
        path: 'adminUserRoleMg',
        name: 'adminUserRoleMg',
        component: () => import(/* webpackChunkName: "routes/orgModules/adminUserRoleMg" */ './part/user/adminUserRoleMg.vue'),
      }
    ],
  }
]
