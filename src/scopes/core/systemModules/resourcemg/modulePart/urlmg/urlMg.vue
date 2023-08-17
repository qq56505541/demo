<template>
  <div class="fit">
    <ta-border-layout layout-type="fixTop">
      <div slot="header" class="center-box">
        <ta-input-search
          v-model="search"
          class="search-box"
          placeholder="名称/URL"
          enter-button="搜索"
          @search="searchUrl"
        />
      </div>
      <ta-border-layout layout-type="fixTop" class="noborder" style="padding: 5px">
        <div slot="header" style="line-height: 44px;  float: right">
          <ta-button @click="refreshTable">
            刷新
          </ta-button>
          <ta-button type="primary" @click="addNameSpace">
            新增
          </ta-button>
          <ta-dropdown :trigger="['click']">
            <ta-menu slot="overlay">
              <ta-menu-item :disabled="!selectedRowKeys.length">
                <ta-popconfirm title="确认启用所选URL以及下级URL?" cancel-text="取消" ok-text="确认" @confirm="enableBatch(false)">
                  <ta-icon type="check-circle" />
                  <span class="mg-l12">启用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider />
              <ta-menu-item :disabled="!selectedRowKeys.length">
                <ta-popconfirm title="确认禁用所选动态服务?" cancel-text="取消" ok-text="确认" @confirm="disableBatch(false)">
                  <ta-icon type="stop" />
                  <span class="mg-l12">禁用</span>
                </ta-popconfirm>
              </ta-menu-item>
              <ta-menu-divider />
              <ta-menu-item :disabled="!selectedRowKeys.length" @click="deleteVisible = true">
                <ta-icon type="close-circle" style="margin-right: 20px" />
                删除
              </ta-menu-item>
            </ta-menu>
            <ta-button>
              批量操作
              <ta-icon type="down" />
            </ta-button>
          </ta-dropdown>
        </div>
        <ta-big-table
          border
          resizable
          row-id="id"
          height="auto"
          :tree-config="{
            lazy: true,
            reserve:true,
            children: 'children',
            hasChild: 'hasChild',
            loadMethod:loadChildrenMethod}"
          :checkbox-config="{checkStrictly: true}"
          :data="tableData"
          @checkbox-change="onSelectChange"
        >
          <ta-big-table-column type="checkbox" width="40" />
          <ta-big-table-column field="name" tree-node title="名称" width="200" show-overflow="tooltip">
            <template #default="{ row }">
              <span :class="{'disable-color': row.effective === '0' }">{{ row.name }}</span>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="url" title="URL" min-width="200" show-overflow="tooltip" />
          <ta-big-table-column field="type" title="类型" width="120" collection-type="URLTYPE" />
          <ta-big-table-column field="effective" title="有效性" width="80">
            <template #default="{ row}">
              <ta-tag v-if="row.effective== '1'" type="success" class="no-cursor">
                有效
              </ta-tag>
              <ta-tag v-else-if="row.effective == '0'" type="danger" class="no-cursor">
                无效
              </ta-tag>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="createTime" title="创建时间" width="180" show-overflow="tooltip" />
          <ta-big-table-column
            fixed="right"
            title="操作"
            field="operation"
            width="200"
            align="center"
          >
            <span slot-scope="rowInfo">
              <ta-table-operate :operate-menu="operateMenu" :row-info="rowInfo" />
            </span>
          </ta-big-table-column>
        </ta-big-table>
      </ta-border-layout>
    </ta-border-layout>
    <url-edit
      :visible="formVisible"
      :row-data="rowData"
      @close="closeForm"
      @searchUrl="searchUrl"
    />
    <ta-careful-delete
      :visible="deleteVisible"
      title="URL删除"
      description="所选URL"
      @close="deleteVisible = false"
      @delete="deleteBatch"
    />
  </div>
</template>

<script>

import $api from './api/index'
import urlEdit from './part/edit'

export default {
  name: 'urlMg',
  // 引入组件
  components: { urlEdit, },
  data () {
    return {
      selectedRowKeys: [],
      selectedRows: [],
      search: '',
      expandedRowKeys: [],
      operateMenu: [{
        name: '添加下级',
        disabled: record => record.effective === '0',
        title: record => record.effective === '0' ? '禁用的URL不允许添加下级' : '',
        isShow: (record) => {
          return record.type === '0'
        },
        onClick: (record) => {
          this.addRestUrl(record)
        },
      }, {
        name: '编辑',
        disabled: record => record.effective === '0',
        title: record => record.effective === '0' ? '禁用的URL不允许编辑' : '',
        onClick: (record) => {
          this.update(record)
        },
      }, {
        name: '更多',
        type: 'more',
        moreMenuList: [{
          name: '启用',
          type: 'confirm',
          confirmTitle: '确认启用该URL资源?',
          onOk: (record) => {
            this.enableBatch(record)
          },
        }, {
          name: '禁用',
          type: 'confirm',
          confirmTitle: '确认禁用该URL资源?',
          onOk: (record) => {
            this.disableBatch(record)
          },
        }, {
          name: '删除',
          type: 'confirm',
          confirmTitle: '确认删除该URL资源?',
          onOk: (record) => {
            this.deleteUrl(record.id)
          },
        }],
      }],
      tableData: [],
      // form control
      formVisible: false,
      rowData: {},
      deleteVisible: false,
    }
  },
  // 页面初始化时执行内容
  mounted () {
    this.queryUrl()
  },
  methods: {
    searchUrl () {
      // 搜索条件为空时，异步搜索
      if (this.search == null || this.search === '') {
        this.queryNamespace()
        return
      }
      const param = {
        url: this.search,
        name: this.search,
      }
      this.queryUrlByParam(param)
    },
    queryUrlByParam (param) {
      $api.queryUrlByParam(param, (data) => {
        this.tableData = data.data.urls
        this.expandedRowKeys = []
      })
    },
    queryNamespace () {
      $api.queryNamespace(null, (data) => {
        this.tableData = data.data.urls
        this.expandedRowKeys = []
      })
    },
    loadChildrenMethod ({ row, }) {
      return new Promise(resolve => {
        $api.queryUrlByNamespace({
          namespace: row.id,
        }, data => {
          return resolve(data.data.urls)
        })
      })
    },
    queryUrl () {
      this.queryNamespace()
    },
    deleteUrl (id) {
      const data = {
        ids: id,
      }
      $api.deleteUrl(data, () => {
        this.$message.success('删除成功！')
        // this.searchUrl()
        this.deleteVisible = false
      })
    },
    deleteBatch () {
      const arr = this.selectedRowKeys
      const idString = arr.join(',')
      this.deleteUrl(idString)
    },

    update (record) {
      this.rowData = record
      this.openForm()
    },
    addNameSpace () {
      this.rowData = {}
      this.openForm()
    },
    addRestUrl (record) {
      // 先置空
      this.rowData = {}
      this.rowData.namespace = record.id
      this.rowData.namespaceName = record.name
      this.openForm()
    },

    disableBatch (record) {
      let rowsArr = []
      if (record) {
        if (record.effective === '0') {
          this.$message.warning('该记录已经禁用，请勿重复操作！')
          return
        }
        rowsArr.push(record.id)
      } else {
        rowsArr = this.selectedRowKeys
      }
      const data = {
        ids: rowsArr.join(','),
      }
      $api.disableUrl(data, () => {
        this.$message.success('禁用成功！')
        // this.searchUrl()
      })
    },

    enableBatch (record) {
      let rowsArr = []
      if (record) {
        if (record.effective === '1') {
          this.$message.warning('该记录已经启用，请勿重复操作！')
          return
        }
        rowsArr.push(record.id)
      } else {
        rowsArr = this.selectedRowKeys
      }
      const data = {
        ids: rowsArr.join(','),
      }
      $api.enableUrl(data, () => {
        this.$message.success('启用成功！')
        // this.searchUrl()
      })
    },

    openForm () {
      this.formVisible = true
    },
    closeForm () {
      this.formVisible = false
    },

    onSelectChange ({ records, }) {
      this.selectedRowKeys = records.map(item => item.id)
      this.selectedRows = records
    },
    refreshTable () {
      top.indexTool.reload()
    },
  },
}
</script>

<style scoped type="text/less" lang="less">
.disable-color {
  color: #cccccc
}

.mg-l12 {
  margin-left: 12px
}

.search-box {
  width: 340px;
  line-height: 42px;
  line-height: 36px \0;
}

.center-box {
  text-align: center;
  padding: 10px 0px;
}
</style>
