<template>
  <div class="fit">
    <ta-border-layout :layout="{header:'70px', footer: '70px'}" :footer-cfg="{showBorder: false}">
      <div slot="header" class="center-box">
        <ta-breadcrumb separator=">" style="line-height: 42px; float: left">
          <ta-breadcrumb-item><a @click="fnBackToHome">角色维度</a></ta-breadcrumb-item>
          <ta-breadcrumb-item>人员管理</ta-breadcrumb-item>
        </ta-breadcrumb>

        <div class="divider" />
        <ta-alert :message="'当前角色为：'+this.$route.query.roleName" type="info" show-icon class="notice-box" />

        <ta-button style="float: right;margin-top: 8px" @click="fnBackToHome">
          <ta-icon type="rollback" />
          返回
        </ta-button>
      </div>
      <ta-tabs class="fit">
        <div slot="tabBarExtraContent">
          <ta-button-group>
            <ta-button @click="fnBatchDeleteUser">
              批量移除
            </ta-button>
            <ta-button type="primary" @click="fnShowUserModal">
              分配人员
            </ta-button>
          </ta-button-group>
        </div>
        <ta-tab-pane :tab="tabTitle">
          <ta-table
            ref="userRef"
            :columns="userColumns"
            :data-source="userData"
            :pagination="false"
            row-key="orgId"
            :row-selection="{selectedRowKeys: selectedRowKeys, onChange:fnOnChange}"
            style="padding-top: 10px"
          >
            <template slot="sex" slot-scope="text">
              {{ CollectionLabel('SEX', text) }}
            </template>
            <span slot="namePath" slot-scope="text">{{ getLastName(text) }}</span>
            <span slot="action" slot-scope="text,record">
              <ta-table-operate :operate-menu="operateMenu" />
            </span>
          </ta-table>
        </ta-tab-pane>
      </ta-tabs>
      <div slot="footer">
        <ta-pagination
          ref="adminUserPager"
          style="float: right; margin-top: 10px;"
          show-size-changer
          show-quick-jumper
          :data-source.sync="userData"
          :default-page-size="10"
          :params="adminUserParams"
          :url="userPageUrl"
        />
      </div>
    </ta-border-layout>
    <ta-user-select
      id="adminMg"
      title="新增管理员角色"
      :props="defaultProps"
      width="800px"
      :is-show="isShow"
      :user-tree-data="orgTreeData"
      :load="loadOrgTreeNode"
      :user-list-data="userListData"
      :default-user-list="result"
      :pagination="true"
      @close="isShow = false"
      @queryUserList="fnQueryUserList"
      @getUserListResult="fnGetUserListResult"
      @checkAllMembers="checkAllMembers"
    />
  </div>
</template>

<script>
import $api from '../../api/index'

const userColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: '15%',
  },
  {
    title: '登录号',
    dataIndex: 'loginId',
    width: '15%',
  },
  {
    title: '所属组织',
    dataIndex: 'namePath',
    scopedSlots: { customRender: 'namePath', },
    width: '20%',
  },
  {
    title: '证件号',
    dataIndex: 'idCardNo',
    width: '20%',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '10%',
    scopedSlots: { customRender: 'sex', },
  },
  {
    title: '操作',
    align: 'center',
    width: '20%',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action', },
  }
]
export default {
  name: 'adminUserMg',
  data () {
    return {
      item: {}, // 路由数据
      tabTitle: '管理员角色人员管理列表', //
      searchInfo: '', // 人员搜索信息
      userData: [], // 用户数据
      userColumns, // 用户列名称,
      operateMenu: [{
        name: '移除',
        type: 'confirm',
        confirmTitle: '确定要移除该人员吗?',
        onOk: (record) => {
          this.fnAdminUserDelete(record)
        },
      }],
      userPageUrl: 'org/authority/adminAuthorityManagementRestService/queryUsersByRoleId', // 用户分页请求url
      isShow: false, // 是否打开人员选择框
      orgTreeData: [], // 人员选择的左侧组织树
      userListData: [], // 相应组织人员信息
      result: [], // 选择的人员信息
      defaultProps: {
        treeNodeKey: 'value', // 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
        treeLabel: 'label', // 树节点的属性名称
        treeChildren: 'children', // 树子节点对象的属性名称
        listKey: 'userId', // 每条用户信息的唯一标识（默认：roleId）
        listTitle: 'name', // 用户信息第一行显示内容
        listSubTitle: 'mobile', // 用户信息第二行显示内容
        listDescription: 'namePath', // 用户信息鼠标移上去显示描述信息
      },
      roleId: '', // 角色id
      selectedRows: [], // 选中的人员列表
      selectedRowKeys: [], // 选中的keys
    }
  },
  activated () {
    this.item = this.$route.query
    if (!this.item.roleId) {
      this.fnBackToHome()
      return
    }
    this.roleId = this.item.roleId
    this.fnLoadUserData()
    this.initTableColumn(this.$refs.userRef, ['sex', 'action'])
  },
  methods: {
    fnOnChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 获取路径的最后一个
    getLastName (name) {
      return name && name.indexOf('/') !== -1 ? name.slice(name.lastIndexOf('/') + 1) : ((name == null || name === '' || name === undefined) ? '--' : name)
    },
    // 删除人员
    fnAdminUserDelete (record) {
      const data = {
        roleId: this.roleId,
        userId: record.userId,
      }
      $api.deleteRoleUserByKey(data, data => {
        this.$message.success('移除人员成功')
        this.fnLoadUserData()
        // const userData = this.userData.filter(item => item.userId !== record.userId);
        // this.userData = userData;
      })
    },
    // table引用,排除的元素,传入数组eg:this.initTableColumn(this.$refs.adminRef,['operation'])
    initTableColumn (ref, excludeArray) {
      const columns = [...ref.columns]
      const column = columns.map(v => {
        if (excludeArray && excludeArray.length > 0) {
          for (const key in excludeArray) {
            if (v.dataIndex === excludeArray[key] || v.key === excludeArray[key]) {
              return v
            }
          }
        }
        v.overflowTooltip = true
        return v
      })
      Object.assign(column, ref.columns)
    },
    adminUserParams () {
      const params = {}
      params.roleId = this.item.roleId
      if (this.searchInfo) {
        params.userName = this.searchInfo
      }
      return params
    },
    // 加载默认数据
    fnLoadUserData () {
      this.$refs.adminUserPager.loadData()
    },
    // 返回
    fnBackToHome () {
      this.$router.push({ name: 'adminRoleManagement', })
    },
    // 查询人员信息
    fnQueryUserList (orgId, includeChildren, pageNum, searchType, searchParam) {
      // 查询用户信息
      const data = {
        roleId: this.roleId,
        orgId: orgId,
        pageNumber: pageNum,
        pageSize: 10,
        includeChild: includeChildren ? '1' : '0',
      }
      if (searchType) {
        data[searchType] = searchParam
      }
      $api.queryBatchUserByOrgId(data, (data) => {
        this.userListData = data.data.pageBean.list
      })
    },
    // 提交选择的人员信息
    fnGetUserListResult (data, selectAll) {
      // 查找已经被删除的人员信息
      const delUsers = this.result.filter(el => {
        const userIds = []
        data.forEach((value) => {
          userIds.push(value.userId)
        })
        return !userIds.includes(el.userId)
      })
      // 查找新增的人员信息
      const addData = data.filter(el => {
        const userIds = []
        this.result.forEach((value) => {
          userIds.push(value.userId)
        })
        return !userIds.includes(el.userId)
      })

      const userIdArray = []
      const delUserIdArray = []

      // 保存数组中的人员
      if (addData.length > 0) {
        addData.forEach((value, index) => {
          userIdArray.push(value.userId)
        })
      }
      // 删除数组中剔除的人
      if (delUsers.length > 0) {
        delUsers.forEach((value, index) => {
          delUserIdArray.push(value.userId)
        })
      }
      new Promise((resolve, reject) => {
        if (userIdArray.length) {
          $api.addBatchAdminUser({ roleId: this.roleId, userIds: userIdArray.join(','), }, (data) => {
            this.$message.success('关联人员成功')
            resolve()
          })
        } else {
          resolve()
        }
      }).then(() => {
        return new Promise((resolve, reject) => {
          if (delUserIdArray.length) {
            $api.deleteBatchRoleUsers({ roleId: this.roleId, userIds: delUserIdArray.join(','), }, (data) => {
              this.$message.success('移除人员成功')
              resolve()
            })
          } else {
            resolve()
          }
        })
      }).then(() => {
        if (!selectAll) {
          this.isShow = false
          this.fnLoadUserData()
        }
      })
    },
    // 批量删除人员信息
    fnBatchDeleteUser () {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择需要移除的人员')
        return
      }
      this.$confirm({
        title: '移除人员',
        content: '确认移除这些人员吗?',
        cancelText: '取消',
        okText: '确认',
        onOk: () => {
          const userIds = this.selectedRows.map(v => {
            return v.userId
          })
          const data = {
            userIds: userIds.join(','),
            roleId: this.roleId,
          }
          $api.deleteBatchRoleUsers(data, dd => {
            this.$message.success('移除成功')
            this.fnLoadUserData()
          })
        },
      })
    },
    // 展示人员模态框
    fnShowUserModal () {
      this.isShow = true
      this.result = []
      this.userListData = []
      $api.queryUsersByRoleIdNoPage({ roleId: this.item.roleId, }, (data) => {
        this.result = data.data.list
      })
    },
    // 加载左侧组织树
    loadOrgTreeNode (node, resolve) {
      if (node.level === 0) {
        $api.queryAllTaOrg(null, data => {
          // 数据成功后默认返回的数据
          const orgVos = data.data.orgVos
          if (orgVos[0].children) {
            // eslint-disable-next-line array-callback-return
            const dd = orgVos[0].children.map(v => {
              const obj = v
              if (v.childNum > 0) {
                obj.children = []
              }
            })
            orgVos[0].children = dd
          }
          return resolve(orgVos)
        })
      }
      if (node.level >= 1) {
        const orgId = node.data.orgId
        const isLeaf = node.data.isLeaf
        const data = {
          orgId: orgId,
        }
        $api.queryAllTaOrg(data, data => {
          // 数据成功后默认返回的数据
          let dd = data.data.orgVos
          if (isLeaf) {
            // eslint-disable-next-line array-callback-return
            dd = dd.map(v => {
              const obj = v
              obj.children = []
            })
          }
          return resolve(dd)
        })
      }
    },
    checkAllMembers (orgId, includeChild, cb) {
      $api.queryBatchUserByOrgIdNoPage({
        roleId: this.item.roleId,
        orgId: orgId,
        includeChild: includeChild,
      }, (data) => {
        cb(data.data.list)
      })
    },
  },
}
</script>
<style scoped type="text/less" lang="less">
.search-box {
  width: 340px;
  line-height: 42px;
}

.center-box {
  text-align: center;
  overflow: hidden;
}

.notice-box {
  float: left;
  margin-top: 2px
}

.divider {
  background-color: #ccc;
  height: 21px;
  margin: 11px 10px;
  float: left;
  width: 1px;
}
</style>
