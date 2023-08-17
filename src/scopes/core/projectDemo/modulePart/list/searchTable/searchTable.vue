<template>
  <ta-border-layout layout-type="fixTop">
    <ta-card slot="header" title="查询条件">
      <ta-form layout="horizontal" :form-layout="true" :auto-form-create="(form)=>{this.form = form}">
        <ta-form-item
          label="业务编号"
          key="num"
          field-decorator-id="num"
          :require="true"
        >
          <ta-input />
        </ta-form-item>
        <ta-form-item
          label="申办类型"
          key="type"
          field-decorator-id="type"
          init-value="0"
        >
          <ta-select>
            <ta-select-option value="0">
              单位
            </ta-select-option>
            <ta-select-option value="1">
              个人
            </ta-select-option>
            <ta-select-option value="2">
              其他
            </ta-select-option>
          </ta-select>
        </ta-form-item>
        <ta-form-item
          label="经办人"
          key="name"
          v-if="expand"
          field-decorator-id="name"
        >
          <ta-input />
        </ta-form-item>
        <ta-form-item
          label="经办地点"
          key="address"
          v-if="expand"
          field-decorator-id="address"
        >
          <ta-input />
        </ta-form-item>
        <ta-form-item
          label="备注"
          key="more"
          v-if="expand"
          field-decorator-id="more"
        >
          <ta-input />
        </ta-form-item>
        <ta-form-item label=":">
          <div style="width:100%;text-align: right">
            <ta-button @click="expandFn">
              {{ expand==true?'收起':'展开' }}
            </ta-button>
            <ta-button @click="resetFn">
              重置
            </ta-button>
            <ta-button type="primary" @click="searchFn">
              查询
            </ta-button>
          </div>
        </ta-form-item>
      </ta-form>
    </ta-card>
    <ta-big-table
      ref="searchList"
      border
      stripe
      resizable
      auto-resize
      highlight-hover-row
      height="100%"
      :export-config="{}"
      :import-config="{}"
    >
      <template #topBar>
        <ta-big-table-toolbar
          :import="true"
          :export="true"
          :print="true"
          :custom="true"
        >
          <div slot="buttons">
            <span style="font-size: 16px">查询表格</span>
          </div>
          <div slot="tools">
            <ta-button>其他工具</ta-button>
            <ta-button>其他功能</ta-button>
          </div>
        </ta-big-table-toolbar>
      </template>
      <ta-big-table-column type="seq" width="60" />
      <ta-big-table-column field="no" title="规则编号" sortable />
      <ta-big-table-column field="description" title="描述" />
      <ta-big-table-column field="callNo" title="服务调用次数" />
      <ta-big-table-column field="status" title="状态" />
      <ta-big-table-column field="updatedAt" title="更新时间" />
      <ta-big-table-column
        fixed="right"
        field="operate"
        title="操作"
      >
        <span slot-scope="rowInfo">
          <ta-table-operate :operate-menu="operateMenu" :row-info="rowInfo" />
        </span>
      </ta-big-table-column>
      <template #bottomBar>
        <ta-pagination
          ref="gridPager"
          style="text-align: right;"
          url="http/mock/projectDemo/searchTableQuery"
          :params="userPageParams"
          @loaded="handleLoaded"
        />
      </template>
    </ta-big-table>
    <ta-modal
      :visible="modalVisible"
      v-if="modalVisible"
      @ok="handleOk"
      @cancel="handleCancel"
      :title="'弹出框中显示的表格数据'"
      :destroy-on-close="true"
    >
      <form-part :custom-data="customData" />
    </ta-modal>
    <ta-drawer
      v-if="drawerVisible"
      :visible="drawerVisible"
      :title="'抽屉中显示的表格数据'"
      width="350px"
      :mask-closable="true"
      @close="handleCancel"
    >
      <form-part :custom-data="customData" />
    </ta-drawer>
  </ta-border-layout>
</template>

<script>
import formPart from '@/scopes/core/projectDemo/modulePart/list/searchTable/part/formPart'
export default {
  name: 'searchTable',
  components: {
    formPart,
  },
  data () {
    return {
      expand: false,
      tableData: [],
      operateMenu: [
        {
          name: '打开弹出框',
          icon: 'setting',
          onClick: (record) => {
            this.customData = record
            this.modalVisible = true
          },
        },
        {
          name: '打开抽屉',
          icon: 'setting',
          onClick: (record) => {
            this.customData = record
            this.drawerVisible = true
          },
        }

      ],
      modalVisible: false,
      drawerVisible: false,
      customData: {},
    }
  },
  mounted () {
    this.$refs.gridPager.loadData((data) => {})
  },
  methods: {
    handleLoaded (data) {
      this.$refs.searchList.loadData(data.data.pageBean.list)
    },
    expandFn () {
      this.expand = !this.expand
    },
    // 重置
    resetFn () {
      this.form.resetFields()
    },
    // 查询
    searchFn () {
      // const searchValue = this.form.getFieldsValue()
      // 提交后端数据
    },
    userPageParams () {
      // 这里返回的对象是分页要一同提交的参数
      return this.form.getFieldsValue()
    },
    handleOk () {
      this.modalVisible = false
      this.customData = {}
    },
    handleCancel () {
      this.modalVisible = false
      this.drawerVisible = false
      this.customData = {}
    },
  },

}
</script>
