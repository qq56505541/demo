<template>
  <div id="userRole" class="fit">
    <ta-border-layout :layout="{header:'55px',footer:'70px'}" :center-cfg="{showBar: true, toolBarStyle: {height: '50px', lineHeight: '48px'}}" :header-cfg="{showBorder: false}" :show-border="false" :footer-cfg="{showBorder: false}">
      <div slot="header" class="center-box">
        <ta-input-search v-model="searchInfo" placeholder="请输入人员姓名、帐号、证件号" class="search-box" @search="onSearchUser">
          <ta-button slot="enterButton" type="primary">
            搜索
          </ta-button>
        </ta-input-search>
      </div>
      <div slot="centerExtraContent">
        <!--        <ta-cascader
          :value="casValue"
          :options.sync="orgOptions"
          :show-search="{filter}"
          @change="onChange"
          change-on-select
          placeholder="请选择人员所属组织"
          expand-trigger="hover"
          :field-names="{label:'orgName',value:'orgId',children:'children'}"
          url="org/authority/roleAuthorityManagementRestService/queryCurrentAdminRoleWrapeOrgTree"
          tree-id="orgVos"
          style="width:250px; margin-right: 10px;"
          :loaded-data-call-back="fnLoadedOrgCallBack"
        />-->
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
        <ta-tag-select v-model="islockList" title="锁定" :data="[{value: '1', label: '是'},{value: '0', label: '否'}]" class="filter-name" @change="filterClick" />
      </div>
      <ta-table
        :columns="userColumns"
        :data-source="userList"
        :pagination="false"
      >
        <span slot="sex" slot-scope="text">{{ CollectionLabel('SEX',text) }}</span>
        <span slot="isLock" slot-scope="text">
          <ta-tag v-if="text == '1'" type="danger" class="no-cursor">是</ta-tag>
          <ta-tag v-else type="success" class="no-cursor">否</ta-tag>
        </span>
        <span slot="operation" slot-scope="text, record">
          <ta-table-operate :operate-menu="operateMenu" />
        </span>
      </ta-table>
      <div slot="footer">
        <ta-pagination
          ref="gridPager"
          style="float: right;margin-top: 10px"
          show-size-changer
          show-quick-jumper
          :data-source.sync="userList"
          :default-page-size="10"
          :params="userPageParams"
          url="org/authority/roleAuthorityManagementRestService/queryUserByCondition"
        />
      </div>
    </ta-border-layout>
  </div>
</template>
<script>
import { filterTree, } from '@yh/ta-utils'

const userColumns = [
  { title: '姓名', dataIndex: 'name', width: '15%', overflowTooltip: false, scopedSlots: { customRender: 'name', }, },
  { title: '帐号', dataIndex: 'loginId', width: '15%', overflowTooltip: true, },
  { title: '性别', dataIndex: 'sex', width: 80, scopedSlots: { customRender: 'sex', }, },
  {
    title: '所属组织',
    width: '15%',
    overflowTooltip: 'namePath',
    dataIndex: 'namePath',
    customRender: (text) => {
      return text ? text.slice(text.lastIndexOf('/') + 1) : '--'
    },
  },
  { title: '手机号', dataIndex: 'mobile', width: '15%', overflowTooltip: true, },
  { title: '锁定', dataIndex: 'isLock', width: 80, scopedSlots: { customRender: 'isLock', }, },
  { title: '操作', dataIndex: 'operation', align: 'center', width: 240, scopedSlots: { customRender: 'operation', }, }
]

export default {
  name: 'UserRole',
  data () {
    return {
      organizationTreeData: 'org/authority/roleAuthorityManagementRestService/queryCurrentAdminRoleWrapeOrgTree',
      orgOptions: [],
      casValue: [],
      isSub: true,
      userColumns,
      operateMenu: [{
        name: '角色管理',
        isShow: record => record.admin === '1',
        title: '该角色已关联管理员角色，无法再关联普通角色',
        style: {
          cursor: 'not-allowed',
          color: '#ccc',
        },
      }, {
        name: '角色管理',
        isShow: record => record.admin !== '1',
        onClick: record => this.fnRouteToRoleMg(record),
      }],
      userList: [],
      searchInfo: '',
      islockList: [],
    }
  },
  methods: {
    fnRouteToRoleMg (record) {
      this.$router.push(
        {
          name: 'roleMg',
          params: {
            user: record,
          },
        }
      )
    },
    filter (inputValue, treeNode) {
      const inputV = inputValue.toLowerCase()
      let result = null
      result = filterTree([treeNode], item => {
        return item.label.toLowerCase().indexOf(inputV) > -1
      })
      return result && result.length > 0
    },
    onChange (value, selectedOptions) {
      this.casValue = value
      this.$nextTick(() => {
        this.fnQueryUserByOrgId()
      })
    },
    onChangeIsSub (e) {
      this.isSub = e.target.checked
      this.$nextTick(() => {
        this.fnQueryUserByOrgId()
      })
    },
    fnLoadedOrgCallBack (data) {
      this.orgOptions = data
      this.fnQueryUserByOrgId()
    },
    fnQueryUserByOrgId () {
      this.$refs.gridPager.loadData()
    },
    onSearchUser () {
      this.fnQueryUserByOrgId()
    },
    userPageParams () {
      const params = {}
      const orgId = this.orgOptions[0] && this.orgOptions[0].orgId ? this.orgOptions[0].orgId : ''
      params.orgId = this.casValue ?? orgId
      params.showChildUser = this.isSub ? '1' : '0'
      params.searchType = 'normal'
      if (this.searchInfo !== '') {
        params.name = this.searchInfo
        params.loginId = this.searchInfo
        params.idCardNo = this.searchInfo
      }
      params.islock = this.islockList
      return params
    },
    filterClick () {
      this.fnQueryUserByOrgId()
    },
  },
}
</script>
<style scoped type="text/less" lang="less">
  .ant-tabs-tabpane-active{
    padding-top: 10px;
  }
  .no-cursor {cursor: default;}
  .filter-name { margin-left: 20px }
  .filter-box { display: inline-block }
  .search-box { width: 340px; line-height:42px; }
  .center-box { text-align:center; overflow: hidden; }
</style>
