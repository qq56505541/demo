<template>
  <div class="fit">
    <ta-border-layout :layout="{header:'70px'}">
      <div slot="header" style="text-align:center; overflow: hidden;">
        <ta-breadcrumb separator=">" style="line-height: 42px;float: left">
          <ta-breadcrumb-item><a @click="fnBackToHome">角色维度</a></ta-breadcrumb-item>
          <ta-breadcrumb-item>功能使用权限</ta-breadcrumb-item>
        </ta-breadcrumb>
        <div class="divider-header" />
        <ta-alert :message="'当前角色为：'+this.$route.query.roleName" type="info" style="float: left;margin-top: 2px" show-icon />
        <ta-button style="float: right;margin-top: 8px" @click="fnBackToHome">
          <ta-icon type="rollback" />返回
        </ta-button>
      </div>
      <ta-tabs class="fit content-box">
        <ta-tab-pane tab="功能使用权限">
          <ta-row class="fit">
            <ta-col :span="4" class="fit authority-box" style="border-right: 1px solid #eee;height: 100%">
              <admin-left-menu
                title="功能使用一级菜单"
                :data="menuData"
                :selected-keys="menuSelectedKeys"
                @click="onSelectMenu"
              />
            </ta-col>
            <ta-col :span="20" class="right-box fit">
              <div style="border: 1px solid #e8e8e8;height: 100%" class="fit">
                <ta-big-table
                  :key="adminUseTreeData.length"
                  ref="xTable"
                  height="100%"
                  resizable
                  border
                  row-id="resourceId"
                  :cell-class-name="cellClassName"
                  :tree-config="{children: 'children', expandAll: true }"
                  :expand-config="{lazy: true,}"
                  :data="adminUseTreeData"
                  :checkbox-config="{labelField: 'name',checkField: 'checked',showHeader: false}"
                >
                  <ta-big-table-column
                    type="checkbox"
                    field="name"
                    title="可授权的功能菜单"
                    tree-node
                    :filter-method="filterAgeMethod"
                    :filters="[{ data: '' }]"
                  >
                    <template #header="{row}">
                      <span>可授权的功能菜单</span>
                      <ta-input
                        v-model="filterText"
                        placeholder="输入关键字进行过滤"
                        style="width: 250px;margin-left: 10px;"
                        @click.stop.prevent=""
                      />
                      <ta-button type="primary" @click.stop.prevent="fnSaveAdminUsePermission('refresh')">
                        权限保存
                      </ta-button>
                    </template>
                  </ta-big-table-column>
                  <ta-big-table-column field="effectTime" title="有效期" width="25%">
                    <template #header="{ row }">
                      <span>有效期</span>
                      <ta-popover
                        placement="bottom"
                        trigger="manual"
                        :value="batchPop"
                      >
                        <div class="pop-calendar">
                          <ta-calendar :fullscreen="false" @select="onPanelChange" />
                        </div>
                        <div style="float: right;margin-top: 10px;">
                          <ta-button size="small" @click="batchPop=false">
                            取消
                          </ta-button>
                          <ta-button size="small" @click="fnSaveAuthorityEffectiveTime(true)">
                            设为永久
                          </ta-button>
                          <ta-button type="primary" size="small" @click="fnSaveAuthorityEffectiveTime(false)">
                            确定
                          </ta-button>
                        </div>
                        <ta-button slot="reference" style="float: right;margin-right: 10px" @click="batchPop = true">
                          批量设置有效期
                        </ta-button>
                      </ta-popover>
                    </template>
                    <template #default="{ row, }">
                      <span v-if="row.checked" style="float: right">
                        {{ !row.effectTime|| null == row.effectTime?'永久':moment(row.effectTime).format('YYYY-MM-DD') }}
                        <!--begin 设置单个有效期-->
                        <ta-popover
                          placement="bottom"
                          trigger="manual"
                          :value="row.resourceId==indexClick"
                        >
                          <div class="pop-calendar">
                            <ta-calendar :fullscreen="false" @select="onPanelChange" />
                          </div>
                          <div style="float: right;margin-top: 10px;">
                            <ta-button size="small" @click="indexClick=null">取消</ta-button>
                            <ta-button size="small" @click="onCellChange(row,true)">设为永久</ta-button>
                            <ta-button type="primary" size="small" @click="onCellChange(row,false)">确定
                            </ta-button>
                          </div>
                          <ta-icon
                            slot="reference"
                            style="margin-left: 10px;"
                            type="edit"
                            @click="indexClick = row.resourceId"
                          />
                        </ta-popover>
                        <!--end 设置单个有效期-->
                      </span>
                    </template>
                  </ta-big-table-column>
                </ta-big-table>
              </div>
            </ta-col>
          </ta-row>
        </ta-tab-pane>
      </ta-tabs>
    </ta-border-layout>
  </div>
</template>
<script>
import $api from '../../api/index'
import AdminLeftMenu from './adminLeftMenu'
import moment from 'moment'
import { cloneDeep, searchTree, toString, } from '@yh/ta-utils'

export default {
  name: 'adminUseAuthority',
  components: { AdminLeftMenu, },
  data () {
    return {
      indexClick: null,
      menuSelectedKeys: [], // 默认选中的数据
      filterText: '', // 过滤菜单
      batchPop: false, // 批量设置有效期
      effectiveTime: '', // 有效时间
      menuData: [], // 左侧菜单栏列表
      adminUseTreeData: [], // 管理员使用权限树数据
      copyAdminUseTreeData: [], // adminUseTreeData 的备份
      defaultKeys: [], // 使用权限树默认选中的数据
      defaultProps: { // 默认树属性
        children: 'children',
        label: 'name',
        id: 'resourceId',
      },
      resourceItem: {}, // 资源信息
      row: {
        col: {
          span: 12,
        },
      },
      item: {}, // 组织人员信息
      roleId: '', // 角色id
    }
  },
  watch: {
    filterText (val) {
      // 进行筛选
      this.filterAgeMethod(val)
    },
  },
  activated () {
    this.item = this.$route.query
    if (!this.item.roleId) {
      this.fnBackToHome()
      return
    }
    this.roleId = this.item.roleId
    this.menuData = []
    this.adminUseTreeData = []
    this.defaultKeys = []
    this.batchPop = false
    this.indexClick = null
    this.fnLoadDefault()
  },
  methods: {
    // 时间处理函数
    moment,
    // 给大数据表格列设置class
    cellClassName ({ row, rowIndex, column, columnIndex, }) {
      if (column.property === 'name' && !row.children) {
        return 'no-children-tree-node'
      } else {
        return ''
      }
    },
    // 筛选方法
    filterAgeMethod (val) {
      const filterName = toString(val).trim()
      if (filterName) {
        const options = { children: 'children', }
        const searchProps = ['name']
        this.adminUseTreeData = searchTree(this.copyAdminUseTreeData, item => searchProps.some(key => toString(item[key]).indexOf(filterName) > -1), options)
        // 搜索之后默认展开所有子节点
        this.$nextTick(() => {
          this.$refs.xTable.setAllTreeExpand(true)
        })
      } else {
        this.adminUseTreeData = this.copyAdminUseTreeData
        this.$refs.xTable.setAllTreeExpand(true)
      }
    },
    // 筛选
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 修改有效期
    onCellChange (data, forever) {
      const dd = {
        roleId: this.roleId,
        resourceId: data.resourceId,
        effectTime: forever ? null : this.effectiveTime,
      }
      $api.updateAdminUsePermissionEffectiveTime(dd, () => {
        this.$message.success('更新有效期成功')
        this.fnQueryUsePermissionByResourceId(this.resourceItem)
        this.indexClick = null
        this.batchPop = false
      })
    },
    // 批量保存授权时间
    fnSaveAuthorityEffectiveTime (forever) {
      let selectArry = []
      const treeObj = this.$refs.xTable
      selectArry = [...treeObj.getCheckboxRecords(), ...treeObj.getCheckboxIndeterminateRecords()]
      const resourceIds = selectArry.map(node => {
        return node.resourceId
      })

      const param = {
        roleId: this.roleId,
        resourceIds: resourceIds.join(','),
        effectTime: forever ? null : this.effectiveTime,
      }
      $api.saveBatchAdminUsePermissionEffectiveTime(param, (data) => {
        this.$message.success('批量设置有效期成功')
        this.fnQueryUsePermissionByResourceId(this.resourceItem)
        this.indexClick = null
        this.batchPop = false
      })
    },
    onPanelChange (value, mode) {
      this.effectiveTime = value.format('YYYY-MM-DD')
    },
    onSelectMenu ({ item, key, keyPath, }) {
      if (this.resourceItem.resouceId === key) {
        return
      }
      let selectArry = []
      const treeObj = this.$refs.xTable
      selectArry = [...selectArry, ...treeObj.getCheckboxRecords(), ...treeObj.getCheckboxIndeterminateRecords()]
      const resultReasultIdArray = selectArry.map(item => item.resourceId)

      const newData = [...this.menuData]
      const menuItem = newData.filter(item => key === item.resourceId)[0]
      if (!(this.defaultKeys.sort().toString() === resultReasultIdArray.sort().toString())) {
        this.$confirm({
          title: '提示',
          content: '当前使用授权权限修改未保存，是否保存?',
          cancelText: '取消',
          okText: '确认',
          onOk: () => {
            this.fnSaveAdminUsePermission()
            this.menuSelectedKeys = keyPath
            this.fnQueryUsePermissionByResourceId(menuItem)
          },
          onCancel: () => {
            this.menuSelectedKeys = keyPath
            this.fnQueryUsePermissionByResourceId(menuItem)
          },
        })
      } else {
        this.menuSelectedKeys = keyPath
        this.fnQueryUsePermissionByResourceId(menuItem)
      }
    },
    // 保存管理员使用权限树
    fnSaveAdminUsePermission (type) {
      let selectArry = []
      const treeObj = this.$refs.xTable
      selectArry = [...selectArry, ...treeObj.getCheckboxRecords(), ...treeObj.getCheckboxIndeterminateRecords(true)]

      const resultResourceArray = selectArry.map(node => {
        return node.resourceId
      })

      const data = {
        roleId: this.roleId,
        resourceIds: resultResourceArray.join(','),
        parentResourceId: this.resourceItem.resourceId,
        resourceType: this.resourceItem.resourceType,
      }
      $api.saveAdminUsePermission(data, dd => {
        this.$message.success('更新数据成功')
        // 重新加载组织数据,如果是当期页面进行保存才进行刷新,其他进行跳转不需要刷新
        if (type === 'refresh') {
          this.fnQueryUsePermissionByResourceId(this.resourceItem)
        }
      })
    },
    fnLoadDefault () {
      const data = {
        roleId: this.roleId,
      }
      $api.queryUseSysPermission(data, dd => {
        this.menuData = dd.data.resourceList
        this.$nextTick(() => {
          if (this.menuData && this.menuData.length > 0) {
            // 默认加载数组第一条数据
            this.menuSelectedKeys = [this.menuData[0].resourceId]
            this.fnQueryUsePermissionByResourceId(this.menuData[0])
          }
        })
      })
    },
    // 点击左侧列表,加载右侧使用权限树
    fnQueryUsePermissionByResourceId (item) {
      this.adminUseTreeData = []
      this.resourceItem = item
      const data = {
        roleId: this.roleId,
        idPath: item.idPath,
      }
      $api.queryUsePermissionByResourceId(data, dd => {
        this.adminUseTreeData = dd.data.resourceTree
        // 备份
        this.copyAdminUseTreeData = cloneDeep(this.adminUseTreeData, true)
        // 清空选中项
        this.defaultKeys = []
        // 备份当前选中的元素，用于切换左侧菜单时判断是否提示用户进行保存
        this.$nextTick(() => {
          const treeObj = this.$refs.xTable
          const selectArry = [...treeObj.getCheckboxRecords(), ...treeObj.getCheckboxIndeterminateRecords(true)]
          const resultResourceArray = selectArry.map(node => {
            return node.resourceId
          })
          this.defaultKeys = resultResourceArray
        })
      })
    },
    // 返回
    fnBackToHome () {
      this.$router.push({ name: 'adminRoleManagement', })
    },
  },
}
</script>
<style type="text/less" lang="less">
.pop-calendar {
  width: 300px; border: 1px solid #d9d9d9; borderRadius: 4px;
  .ant-select { width: 100px }
}
</style>
<style scoped type="text/less" lang="less">

.notice-box{
  float:right;
  width:100%;
}
.content-box{
  overflow: visible;
}

.active {
  display: block;
  background-color: #e9f8ff;
}

.custom-tree-node {
  width: 100%;
}

.divider {
  position: absolute;
  top: 0;
  right: 20%;
  height: 100%;
  width: 1px;
  background-color: #e8e8e8;
  border-top: 10px solid #fff;
  border-bottom: 10px solid #fff;
  box-sizing: border-box;
  z-index: 1000;
}
.divider-header {
  background-color: #ccc;
  height: 21px;
  margin: 11px 10px;
  float: left;
  width: 1px;
}

.right-box {
  height: 100%;
  padding: 10px;
}

.ant-divider-horizontal {
  margin: 5px 0;
}

.authority-box {
  height: 90%;
  overflow: auto;
  .beautifyScrollbar();
}

.col-header {
  text-align: center;
  line-height: 50px;
}

.button-save {
  position: absolute;
  right: 20%;
  margin-right: 10px;
}

.menu-title {
  height: 39px;
  line-height: 39px;
  width: 100%;
  padding: 0 0 0 25px;
}
</style>
