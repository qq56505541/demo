<template>
  <div class="fit">
    <ta-border-layout
      :show-border="true"
      :header-cfg="{showBorder: true}"
      :footer-cfg="{showBorder: false}"
    >
      <div slot="header" class="center-box">
        <ta-input-search placeholder="请输入角色名称" @search="fnOnSearch" v-model="search" class="search-box">
          <ta-button slot="enterButton" type="primary">
            搜索
          </ta-button>
        </ta-input-search>
      </div>
      <ta-table :columns="roleColumns" :data-source="roleData" :pagination="false" row-key="roleId">
        <span slot="operate" slot-scope="text, record">
          <ta-table-operate :operate-menu="operateMenu" />
        </span>
      </ta-table>
      <div slot="footer">
        <ta-pagination
          style="float: right;margin-top: 10px"
          show-size-changer
          show-quick-jumper
          :data-source.sync="roleData"
          :default-page-size="10"
          :params="pageParams"
          url="org/sysmg/WorkbenchManageRestService/queryRole"
          ref="gridPager"
        />
      </div>
    </ta-border-layout>
  </div>
</template>

<script>
import TaTable from '@yh/ta404-ui/es/table/index'
import '@yh/ta404-ui/es/table/style'

export default {
  name: 'RoleTemplateMg',
  components: { TaTable, },
  data () {
    const roleColumns = [{
      title: '角色名称',
      dataIndex: 'roleName',
      width: '25%',
      overflowTooltip: true,
      scopedSlots: { customRender: 'rolename', },
    }, {
      title: '组织名称',
      dataIndex: 'namePath',
      width: '25%',
      overflowTooltip: 'namePath',
      customRender: (text) => {
        return text.slice(text.lastIndexOf('/') + 1)
      },
    }, {
      title: '角色描述',
      dataIndex: 'roleDesc',
      width: '30%',
      overflowTooltip: true,
    }, {
      title: '操作',
      align: 'center',
      width: '20%',
      scopedSlots: { customRender: 'operate', },
    }]
    return {
      roleColumns: roleColumns,
      operateMenu: [{
        name: '修改该角色默认模板',
        onClick: (record) => {
          this.fnModifyRoleTemplate(record)
        },
      }],
      roleData: [], // 表格数据
      search: '',
    }
  },
  mounted () {
    this.$refs.gridPager.loadData()
  },
  methods: {
    pageParams () {
      const param = {}
      param.search = this.search
      return param
    },
    fnOnSearch () {
      this.$refs.gridPager.loadData()
    },
    fnModifyRoleTemplate (record) {
      // Base.closeTabMenu('roleWorktableTemplateModify')
      Base.openTabMenu({
        id: 'roleWorktableTemplateModify',
        name: '修改角色工作台模板',
        url: `workTablePage.html#/page?type=1&roleId=${record.roleId}`,
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

  .no-cursor {
    cursor: default;
  }

  .filter-name {
    margin-left: 20px
  }

  .filter-box {
    display: inline-block
  }
</style>
