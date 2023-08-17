<template>
  <div id="publicRoleManager" class="fit">
    <ta-border-layout layout-type="flexBorder" style="padding: 10px">
      <div slot="header" style="text-align:center;">
        <ta-input-search v-model="searchInfo" placeholder="请输入角色名称" class="search-box" @search="fnQueryRolesByOrgId">
          <ta-button slot="enterButton" type="primary">
            搜索
          </ta-button>
        </ta-input-search>
      </div>
      <ta-border-layout layout-type="flexBorder">
        <div slot="header" style="line-height:45px;">
          <ta-tree-select
              v-model="casValue"
              style="width:250px; margin-right: 10px"
              :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
              placeholder="请选择组织机构"
              :url="organizationTreeData"
              :tree-data.sync="orgOptions"
              tree-node-label-prop="namePath"
              tree-id="orgVos"
              tree-node-id="orgId"
              tree-data-label="orgName"
              tree-data-value="orgId"
              allow-clear
              search-placeholder="请输入组织机构名称"
              show-search
              :filter-tree-node="filter"
              :loaded-data-call-back="fnLoadedOrgCallBack"
              @change="onChange"
          />
          <ta-checkbox :checked="isSub" @change="onChangeIsSub">
            包含子组织
          </ta-checkbox>
          <ta-tag-select
              v-model="effective"
              title="状态"
              :data="[{value:'1',label:'启用'},{value:'0',label:'禁用'}]"
              @change="fnQueryRolesByOrgId"
          />
          <ta-tag-select
              v-model="subordinate"
              title="该角色是否对子组织管理员可见"
              :data="[{value:'1',label:'是'},{value:'0',label:'否'}]"
              @change="fnQueryRolesByOrgId"
          />
          <div style="float: right">
            <ta-button type="primary" class="step1" @click="fnNewPublicRole">
              新增角色
            </ta-button>
            <ta-dropdown :trigger="['click']">
              <ta-menu slot="overlay">
                <ta-menu-item :disabled="!selectedRowKeys.length">
                  <ta-popconfirm title="确认启用所选角色?" cancel-text="取消" ok-text="确认" @confirm="handleMenuClick('1')">
                    <ta-icon type="check-circle" />
                    <span class="mg-l12">启用</span>
                  </ta-popconfirm>
                </ta-menu-item>
                <ta-menu-divider />
                <ta-menu-item :disabled="!selectedRowKeys.length">
                  <ta-popconfirm title="确认禁用所选角色?" cancel-text="取消" ok-text="确认" @confirm="handleMenuClick('0')">
                    <ta-icon type="stop" />
                    <span class="mg-l12">禁用</span>
                  </ta-popconfirm>
                </ta-menu-item>
                <ta-menu-divider />
                <ta-menu-item
                    :disabled="!selectedRowKeys.length"
                    @click="selectedRowKeys.length === 0 ?$message.warning('请先选择数据'):batchDeleteVisible = true"
                >
                  <ta-icon type="close-circle" />
                  删除
                </ta-menu-item>
                <ta-menu-divider />
                <ta-menu-item key="1" :disabled="!selectedRowKeys.length" @click="fnBatchRoles(1)">
                  <ta-icon type="setting" />
                  批量授予
                </ta-menu-item>
                <ta-menu-divider />
                <ta-menu-item key="2" :disabled="!selectedRowKeys.length" @click="fnBatchRoles(2)">
                  <ta-icon type="setting" />
                  批量收回
                </ta-menu-item>
              </ta-menu>
              <ta-button>
                批量操作
                <ta-icon type="down" />
              </ta-button>
            </ta-dropdown>
          </div>
        </div>
        <!--        <ta-table
          :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          :columns="roleColumns"
          :data-source="roleData"
          :pagination="false"
          :custom-row="onRowClick"
          :row-class-name="changeRowStyle"
          :scroll="{ x: 1200 }"
        >
          <template slot="customOrgName" slot-scope="text,record">
            <span
              :class="{'invalidStyle': record.effective == '0' || record.expire == '1' || (record.effectiveTime && record.effectiveTime < currentTime) }"
            >{{
              text
            }}</span>
          </template>
          <template slot="effectiveTime" slot-scope="text,record">
            <span :class="{'invalidStyle': record.expire == '1' }">
              {{ record.effectiveTime == null ? '永久' : moment(record.effectiveTime).format('YYYY-MM-DD') }}
            </span>
          </template>
          <span slot="expire" slot-scope="text">
            <ta-tag v-if="text == '0'" type="success" class="no-cursor">未过期</ta-tag>
            <ta-tag v-else-if="text == '1'" type="danger" class="no-cursor">过期</ta-tag>
          </span>
          <span slot="effective" slot-scope="text">{{ CollectionLabel('STATE', text) }}</span>
          <span slot="roleSign" slot-scope="text">{{ CollectionLabel('ROLESIGN', text) }}</span>
          <span slot="roleOperationTitle" class="step2">角色操作</span>
          <span slot="roleOperation" slot-scope="text,record">
            <ta-table-operate :operate-menu="operateMenu" />
          </span>
          <span slot="operationTitle" class="step3">管理</span>
          <span slot="operation" slot-scope="text, record" class="step3">
            <ta-table-operate :operate-menu="manageOperateMenu" />
          </span>
        </ta-table>-->
        <ta-big-table
            stripe
            resizable
            highlight-hover-row
            height="auto"
            :checkbox-config="{highlight:true,checkMethod: customCheckbox}"
            :data="roleData"
            @checkbox-all="onSelectChange"
            @checkbox-change="onSelectChange"
            @cell-click="onRowClick"
        >
          <ta-big-table-column type="checkbox" width="40" fixed="left" />
          <ta-big-table-column field="roleName" fixed="left" width="120" title="角色名称" sortable show-overflow="tooltip">
            <template #default="{ row }">
              <span
                  :class="{'invalidStyle': row.effective == '0' || row.expire == '1' || (row.effectiveTime && row.effectiveTime < currentTime) }"
              >{{
                  row.roleName
                }}</span>
            </template>
          </ta-big-table-column>
          <ta-big-table-column width="120" field="namePath" title="组织路径" show-overflow="ellipsis" sortable>
            <template #default="{ row }">
              <ta-tooltip>
                <span slot="title">{{ row.namePath }}</span>
                <span>{{ row.namePath.slice(row.namePath.lastIndexOf('/') + 1) }}</span>
              </ta-tooltip>
            </template>
          </ta-big-table-column>
          <ta-big-table-column
              field="roleSign"
              title="角色标识"
              collection-type="ROLESIGN"
              width="120"
          />
          <ta-big-table-column field="roleDesc" title="角色描述" min-width="120" show-overflow="tooltip" />
          <ta-big-table-column field="subordinate" width="120" title="该角色是否对子组织管理员可见" align="center">
            <template #default="{ row }">
              {{ row.subordinate === '1' ? '是' : '否' }}
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="effectiveTime" width="120" title="有效期" sortable>
            <template #default="{ row }">
              <span :class="{'invalidStyle': row.expire == '1' }">
                {{ row.effectiveTime == null ? '永久' : Base.getMoment(row.effectiveTime).format('YYYY-MM-DD') }}
              </span>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="expire" width="120" title="是否过期">
            <template #default="{ row}">
              <ta-tag v-if="row.expire== '0'" type="success" class="no-cursor">
                未过期
              </ta-tag>
              <ta-tag v-else-if="row.expire == '1'" type="danger" class="no-cursor">
                过期
              </ta-tag>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="effective" title="状态" width="120">
            <template #default="{ row}">
              <ta-tag :type="row.effective== '1'?'success':'danger'" class="no-cursor">
                {{ CollectionLabel('STATE', row.effective) }}
              </ta-tag>
            </template>
          </ta-big-table-column>
          <ta-big-table-column
              fixed="right"
              field="roleOperation"
              width="150"
              align="center"
          >
            <template #header>
              <span class="step2">角色操作</span>
            </template>
            <span slot-scope="rowInfo">
              <ta-table-operate :operate-menu="operateMenu" :row-info="rowInfo" />
            </span>
          </ta-big-table-column>
          <ta-big-table-column
              fixed="right"
              field="operation"
              title="管理"
              width="200"
              align="center"
          >
            <template #header>
              <span class="step3">管理</span>
            </template>
            <span slot-scope="rowInfo">
              <ta-table-operate :operate-menu="manageOperateMenu" :row-info="rowInfo" />
            </span>
          </ta-big-table-column>
        </ta-big-table>
      </ta-border-layout>
      <div slot="footer">
        <ta-pagination
            ref="roleGridPager"
            style="float: right; margin-top: 10px;"
            show-size-changer
            show-quick-jumper
            :data-source.sync="roleData"
            :default-page-size="10"
            :params="rolePageParams"
            url="org/authority/roleAuthorityManagementRestService/queryRolesByOrgId"
        />
      </div>
    </ta-border-layout>
    <ta-modal
        v-model="roleCopyVisible"
        title="角色复制"
        centered
        width="1000px"
        :body-style="{height:'500px',padding:'0'}"
        :destroy-on-close="true"
        :mask-closable="false"
        :getContainer="fnGetContainer"
    >
      <template slot="footer">
        <ta-button @click="roleCopyVisible=false">
          取消
        </ta-button>
        <ta-button key="submit" type="primary" @click="fnRoleCopySave">
          保存
        </ta-button>
      </template>
      <roleCopy
          ref="roleCopyChild"
          :role-obj="currentSelectedPublicRole"
          :org-tree-data="orgOptions"
          @fnQueryRolesByOrgId="fnQueryRolesByOrgId"
      />
    </ta-modal>
    <ta-modal
        v-model="authorityCopyVisible"
        title="权限复制"
        centered
        width="1000px"
        :body-style="{height:'500px',padding:'0'}"
        :destroy-on-close="true"
        :mask-closable="false"
        :getContainer="fnGetContainer"
    >
      <template slot="footer">
        <ta-button @click="authorityCopyVisible=false">
          取消
        </ta-button>
        <ta-button key="submit" type="primary" @click="fnAuthorityCopySave">
          保存
        </ta-button>
      </template>
      <authorityCopy ref="authorityCopyChild" :role-obj="currentSelectedPublicRole" />
    </ta-modal>
    <ta-drawer
        :title="newRoleTitle + '667'"
        placement="right"
        :visible="newRoleVisible"
        :destroy-on-close="true"
        width="500"
        :get-container="fnGetContainer"
        @close="newRoleVisible = false"
    >
      <newRole
          ref="newRole"
          :update-obj="updateObj"
          @onNewRoleClose="newRoleVisible = false"
          @fnQueryRolesByOrgId="fnQueryRolesByOrgId"
      />
      <div slot="footer">
        <ta-button-group>
          <ta-button @click="$refs.newRole.fnResetForm()">
            重置
          </ta-button>
          <ta-button type="primary" @click="$refs.newRole.fnAddOrUpdateRole()">
            保存
          </ta-button>
        </ta-button-group>
      </div>
    </ta-drawer>
    <ta-careful-delete
        :visible="batchDeleteVisible"
        title="角色删除"
        description="选中角色"
        @close="batchDeleteVisible = false"
        @delete="fnBeforeDeleteRole"
    />
  </div>
</template>
<script>
import $api from '../../api/index'
import roleCopy from './roleCopy'
import authorityCopy from '../common/authorityCopy'
import newRole from './newRole'
import moment from 'moment'
import guideMixins from '@projectCommon/js/extendConfig/guideMixins'
import { filterTree, } from '@yh/ta-utils'

const steps = [
  {
    element: '.step1',
    popover: {
      title: '新增角色',
      description: '创建角色，多个人员可同属一个角色，一个人员可同时拥有多个角色',
      position: 'left',
    },
  },
  {
    element: '.step2',
    popover: {
      title: '角色操作',
      description: '可对角色信息进行编辑，还可启用、禁用、删除角色，同时可以复制角色和角色权限',
      position: 'left',
    },
  },
  {
    element: '.step3',
    popover: {
      title: '管理',
      description: '角色下可通过【人员管理】绑定人员，通过【权限管理】进行【功能菜单权限管理】和【自定义对象权限管理】',
      position: 'left',
    },
  }
]
export default {
  name: 'PublicRoleManager',
  components: { roleCopy, authorityCopy, newRole, },
  mixins: [guideMixins],
  data () {
    return {
      organizationTreeData: 'org/authority/roleAuthorityManagementRestService/queryCurrentAdminRoleWrapeOrgTree',
      searchInfo: '',
      orgOptions: [],
      isSub: true,
      casValue: undefined,
      operateMenu: [
        {
          name: '编辑',
          isShow: record => record.roleMark === '1',
          disabled: record => record.effective === '0',
          title: record => record.effective === '0' ? '禁用的角色不允许编辑' : '',
          onClick: record => this.updatePublicRole(record),
        }, {
          name: '编辑',
          style: {
            color: 'rgb(204,204,204)',
            cursor: 'not-allowed',
          },
          isShow: record => record.roleMark !== '1',
          title: record => record.roleMark !== '1' ? '您对相应组织下的该角色无编辑权限' : '',
        }, {
          name: '更多',
          type: 'more',
          isShow: record => record.roleMark === '1',
          moreMenuList: [{
            name: '启用',
            type: 'confirm',
            confirmTitle: '确认启用该角色?',
            onOk: (record) => {
              this.handleMenuClick('1', record)
            },
          }, {
            name: '禁用',
            type: 'confirm',
            confirmTitle: '确认禁用该角色?',
            onOk: (record) => {
              this.handleMenuClick('0', record)
            },
          }, {
            name: '删除',
            type: 'confirm',
            confirmTitle: '确认删除该角色?',
            onOk: (record) => {
              this.fnBeforeDeleteRole(record)
            },
          }, {
            name: '角色复制',
            disabled: record => record.effective === '0',
            onClick: record => this.fnRoleCopy(record),
          }, {
            name: '权限复制',
            disabled: record => record.effective === '0',
            onClick: record => this.fnAuthorityCopy(record),
          }],
        }, {
          name: '更多',
          type: 'more',
          style: {
            color: 'rgb(204,204,204)',
            cursor: 'not-allowed',
          },
          isShow: record => record.roleMark !== '1',
          title: record => record.roleMark !== '1' ? '您对相应组织下的该角色无操作权限' : '',
        }],
      manageOperateMenu: [{
        name: '人员管理',
        disabled: (record) => record.effective === '0',
        title: record => record.effective === '0' ? '禁用的角色不允许进行人员管理' : '',
        onClick: (record) => this.fnRouteTo(record, 'publicRoleUser'),
      }, {
        name: '权限管理',
        type: 'more',
        disabled: record => record.effective === '0',
        title: record => record.effective === '0' ? '禁用的角色不允许进行权限管理' : '',
        isShow: record => record.roleMark === '1',
        moreMenuList: [{
          name: '功能菜单权限管理',
          onClick: record => this.fnRouteTo(record, 'publicRoleAuthority'),
        }, {
          name: '自定义对象权限管理',
          onClick: record => this.fnRouteTo(record, 'publicRoleCustomAuthority'),
        }],
      }, {
        name: '权限管理',
        type: 'more',
        title: record => record.roleMark !== '1' ? '您对相应组织下的该角色无权限管理权限' : '',
        isShow: record => record.roleMark !== '1',
        style: {
          color: 'rgb(204,204,204)',
          cursor: 'not-allowed',
        },
      }],
      roleData: [],
      selectedRowKeys: [],
      selectedPublicRole: [],
      currentSelectedPublicRole: {},
      roleCopyVisible: false,
      authorityCopyVisible: false,
      updateObj: {},
      newRoleVisible: false,
      newRoleTitle: '新增角色',
      batchRoles: {},
      effective: [],
      subordinate: [],
      batchDeleteVisible: false,
      currentTime: '',
      steps,
    }
  },
  mounted () {
    this.currentTime = moment().format('YYYY-MM-DD HH:MM:SS')
    this.fnCommonGuide(this.steps)
  },
  methods: {
    moment, // 处理时间的方法
    // 分页参数
    rolePageParams () {
      const orgId = this.orgOptions[0] && this.orgOptions[0].orgId ? this.orgOptions[0].orgId : ''
      return {
        // orgId: this.casValue.length > 0 ? this.casValue[this.casValue.length - 1] : orgId, // 'fd811ab9c30440088df3e29ea784460a',
        orgId: this.casValue ?? orgId,
        isSub: this.isSub,
        roleType: '01',
        roleName: this.searchInfo,
        effective: this.effective.length > 0 ? this.effective[0] : null,
        subordinate: this.subordinate.length > 0 ? this.subordinate[0] : null,
      }
    },
    // 路由到界面
    fnRouteTo (record, name) {
      this.$router.push({
        name: name,
        params: { role: record, },
      })
    },
    fnBatchRoles (type) {
      if (this.selectedPublicRole.length < 1) {
        this.$message.warn('请先选择角色')
        return
      }
      this.$router.push({
        name: 'batchAuthority',
        params: {
          roles: this.selectedPublicRole,
          batchType: type === 1 ? 'add' : 'delete',
        },
      })
    },
    fnAuthorityMgSave () {
      this.$refs.authorityMgChild.fnSave()
    },
    handleMenuClick (e, record) {
      const roleIdArray = []
      if (record) {
        if (e === '1' && record.effective === '1') {
          this.$message.warning('该记录已经启用，请勿重复操作！')
          return
        }
        if (e === '0' && record.effective === '0') {
          this.$message.warning('该记录已经禁用，请勿重复操作！')
          return
        }
        roleIdArray.push(record.roleId)
      } else {
        this.selectedPublicRole.forEach(function (value, index) {
          roleIdArray.push(value.roleId)
        })
        if (roleIdArray.length < 1) {
          this.$message.warn('请先勾选要操作的角色')
          return
        }
      }
      $api.updateRoleEffectiveByRoleId({
        roleIds: roleIdArray.join(','),
        effective: e === '1' ? '1' : '0',
      }, (data) => {
        this.$message.success(e === '1' ? '启用成功' : '禁用成功')
        this.fnQueryRolesByOrgId()
      })
    },
    fnBeforeDeleteRole (record) {
      const roleIdArry = []
      if (record) {
        roleIdArry.push(record.roleId)
      } else {
        this.selectedPublicRole.forEach(function (value, index) {
          roleIdArry.push(value.roleId)
        })
        if (roleIdArry.length < 1) {
          this.$message.warn('请勾选要删除的角色')
          return
        }
      }
      this.deletePublicRole(roleIdArry)
    },
    deletePublicRole (roleIdArry) {
      $api.deleteBatchRole({ roleIds: roleIdArry.join(','), }, (data) => {
        this.$message.success('删除角色成功')
        this.batchDeleteVisible = false
        this.fnQueryRolesByOrgId()
      })
    },
    fnLoadedOrgCallBack (data) {
      this.orgOptions = data
      this.fnQueryRolesByOrgId()
    },
    onChange (value, selectedOptions) {
      this.casValue = value
      this.fnQueryRolesByOrgId()
    },
    onChangeIsSub (e) {
      this.isSub = e.target.checked
      this.fnQueryRolesByOrgId()
    },
    filter (inputValue, treeNode) {
      const inputV = inputValue.toLowerCase()
      let result = null
      result = filterTree([treeNode], item => {
        return item.label.toLowerCase().indexOf(inputV) > -1
      })
      return result && result.length > 0
    },
    onSelectChange ({ records, }) {
      this.selectedRowKeys = records
      this.selectedPublicRole = records
    },
    customCheckbox ({ row, }) {
      return row.roleMark === '1'
    },
    onRowClick ({ row, rowIndex, }) {
      this.currentSelectedPublicRole = row
      this.rowFlag = rowIndex
    },
    changeRowStyle (record, index) {
      if (this.rowFlag === index) {
        return 'row-active-bg'
      }
    },
    fnRoleCopy (record) {
      this.roleCopyVisible = true
      this.currentSelectedPublicRole = record
    },
    fnRoleCopySave () {
      this.$refs.roleCopyChild.fnSave()
    },
    fnAuthorityCopy (record) {
      this.authorityCopyVisible = true
      this.currentSelectedPublicRole = record
    },
    fnAuthorityCopySave () {
      this.$refs.authorityCopyChild.fnSave()
    },
    fnNewPublicRole () {
      this.newRoleTitle = '新增角色'
      this.newRoleVisible = true
      this.updateObj = {
        isUpdate: false,
      }
    },
    updatePublicRole (record) {
      this.newRoleTitle = '修改角色'
      this.newRoleVisible = true
      this.updateObj = {
        isUpdate: true,
        roleObj: record,
      }
    },
    fnQueryRolesByOrgId () {
      this.$refs.roleGridPager.loadData()
      this.selectedRowKeys = []
      this.selectedPublicRole = []
    },
    fnGetContainer () {
      return document.getElementById('publicRoleManager')
      // return document.querySelector('#publicRoleManager')
    },
  },
}
</script>
<style scoped type="text/less" lang="less">
.mg-l12 {
  margin-left: 12px;
}

.row-active-bg {
  background: #E6F7FF;
}

.cascader-box {
  width: 50%;
}

.ant-divider-vertical {
  margin: 0 3px;
}

.ant-modal-header {
  text-align: center;
}

.ant-modal-footer {
  text-align: center;
}

.vertical-space {
  &.btn-group-position {
    float: left;
  }
}

.ant-calendar-picker-container {
  z-index: 2012;
}

.no-cursor {
  cursor: default;
}

.filter-name {
  margin-left: 20px
}

.filter-box {
  display: inline-block
}

.search-box {
  width: 340px;
}

.invalidStyle {
  color: @normal-color;

  &:hover {
    color: @normal-color
  }

  cursor: not-allowed;
}
</style>
