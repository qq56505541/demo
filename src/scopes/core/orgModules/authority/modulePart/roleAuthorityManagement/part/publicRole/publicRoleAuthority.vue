<template>
  <div id="publicRoleAuthority" class="fit">
    <ta-border-layout :layout="{header:'70px'}">
      <div slot="header" style="text-align:center; overflow: hidden;">
        <ta-breadcrumb separator=">" style="line-height: 42px;float: left">
          <ta-breadcrumb-item><a @click="fnBack">角色维度</a></ta-breadcrumb-item>
          <ta-breadcrumb-item>功能菜单权限管理</ta-breadcrumb-item>
        </ta-breadcrumb>
        <div class="divider-header" />
        <ta-alert :message="'当前角色为：'+role.roleName" type="info" show-icon style="float: left;margin-top: 2px" />
        <ta-button style="float: right;margin-top: 8px" @click="fnBack">
          <ta-icon type="rollback" />返回
        </ta-button>
      </div>
      <ta-tabs class="fit content-box">
        <ta-tab-pane tab="功能菜单权限">
          <ta-row class="fit">
            <ta-col :span="4" class="fit authority-box" style="border-right: 1px solid #eee;height: 100%">
              <div class="menu-title">
                <ta-icon type="menu-fold" />
                <span style="margin-left: 5px">功能一级菜单</span>
              </div>
              <ta-divider style="margin: 0" />
              <ta-menu
                mode="inline"
                :selected-keys="menuSelectedKeys"
                @click="onSelectMenu"
              >
                <ta-menu-item v-for="item in menuData" :key="item.resourceId">
                  <ta-icon type="appstore" />{{ item.name }}
                </ta-menu-item>
              </ta-menu>
            </ta-col>
            <ta-col :span="20" class="right-box">
              <!--              <div v-if="authrityTree.length>0" style="border: 1px solid #e8e8e8" class="fit">-->
              <div :key="authrityTree.length" style="border: 1px solid #e8e8e8" class="fit">
                <ta-big-table
                  ref="xTable"
                  height="100%"
                  resizable
                  border
                  row-id="resourceId"
                  :cell-class-name="cellClassName"
                  :tree-config="{children: 'children', expandAll: true }"
                  :expand-config="{lazy: true,}"
                  :data="authrityTree"
                  :checkbox-config="{labelField: 'name',checkField: 'checked',showHeader: false,checkMethod: checkMethod}"
                  @checkbox-change="checkedChange"
                >
                  <ta-big-table-column
                    type="checkbox"
                    field="name"
                    title="可授权的功能菜单"
                    tree-node
                  >
                    <template #header="{row}">
                      <span>可授权的功能菜单</span>
                      <ta-input
                        v-model="filterText"
                        placeholder="输入关键字进行过滤"
                        style="width: 250px;margin-left: 10px;"
                        @click.stop.prevent=""
                      />
                      <ta-button type="primary" @click.stop.prevent="fnAuthorityMgSave">
                        权限保存
                      </ta-button>
                    </template>
                    <template #default="{row}">
                      <span v-if="row.loginAccess" style="color: #67c23a;padding:0 8px">{{ row.name }} (登录即可访问)</span>
                      <span v-else style="padding:0 8px">{{ row.name }}</span>
                      <span v-if="row.restUrlAuthorityPoList" @click.stop="">
                        <ta-checkbox
                          v-for="(item,index) in row.restUrlAuthorityPoList"
                          :key="index"
                          :checked="item.checked === '1'"
                          :default-checked="item.checked=='1'?true:false"
                          @click.stop=""
                          @change="(v) => changeTempCheckedValue(v,item,row)"
                        >
                          <span class="iterface-font" @click.stop="">{{ item.urlName }}(url)</span>
                        </ta-checkbox>
                      </span>
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
                        <ta-button
                          slot="reference"
                          style="float: right;margin-right: 10px"
                          @click="batchPop=true"
                        >
                          批量设置有效期
                        </ta-button>
                      </ta-popover>
                    </template>
                    <template #default="{ row, }">
                      <span v-if="row.checked" class="node-right">
                        {{ row.effectTime?row.effectTime.split(' ')[0]:'永久' }}
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
import { toTreeArray, cloneDeep, searchTree, toString, eachTree, } from '@yh/ta-utils'
const menuColumns = [{
  title: '一级功能菜单',
  dataIndex: 'name',
}]
export default {
  name: 'publicRoleAuthority',
  data () {
    return {

      menuColumns,
      selectedRowKeys: [],
      effectiveTime: '',
      role: {},
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'resourceId',
        disabled: 'loginAccess',
      },
      indexClick: null,
      allCheckedList: [],
      currentCheckedList: [],
      tempCheckedList: [],
      authrityTree: [],
      originAuthrityTreeCopyData: [], // authrityTree的备份，用于筛选
      menuData: [],
      rootId: '',
      popVisible: false,
      batchPop: false,
      filterText: '',
      menuSelectedKeys: [],
      tempNodeCheck: [],
    }
  },
  watch: {
    filterText (val) {
      // 进行筛选
      this.filterAgeMethod(val)
    },
  },
  activated () {
    if (this.$route.params.role instanceof Object) {
      this.role = this.$route.params.role || {}
      this.fnQueryRePermissionByRoleId()
    } else {
      this.$router.push({ name: 'publicRoleManager', })
    }
    this.batchPop = false
    this.indexClick = null
  },
  methods: {
    // 勾选了前面的菜单后默认选中后面的所有单独授权
    checkedChange ({ records, row, }) {
      // 需要勾选独立授权的放开下列注释
      if (row.restUrlAuthorityPoList && row.restUrlAuthorityPoList.length > 0) {
        const restUrlAuthorityPoList = row.restUrlAuthorityPoList
        restUrlAuthorityPoList.forEach(item => {
          if (!row.checked) {
            // 取消菜单的授权时，就取消所有的URL勾选
            item.checked = '0'
          }
          // item.checked = row.checked ? '1' : '0'
        })
      }
      // 设置其子组件的单独授权
      this.setRestUrlAuthorityPoLis(row.children)
    },
    // 设置后面的所有单独授权
    setRestUrlAuthorityPoLis (list) {
      if (!list || list.length === 0) return
      eachTree(list, row => {
        if (row.restUrlAuthorityPoList && row.restUrlAuthorityPoList.length > 0) {
          const restUrlAuthorityPoList = row.restUrlAuthorityPoList
          restUrlAuthorityPoList.forEach(item => {
            item.checked = row.checked ? '1' : '0'
          })
        }
      })
    },
    // 禁止勾选
    checkMethod ({ row, }) {
      return !row.loginAccess
    },
    // 额外的 checked 选择框变化时
    changeTempCheckedValue (v, record, row) {
      if (v) {
        row.checked = true
      }
      record.checked = v.target.checked ? '1' : '0'
    },
    // 筛选方法
    filterAgeMethod (val) {
      const filterName = toString(val).trim()
      if (filterName) {
        const options = { children: 'children', }
        const searchProps = ['name']
        this.authrityTree = searchTree(this.originAuthrityTreeCopyData, item => searchProps.some(key => toString(item[key]).indexOf(filterName) > -1), options)
        // 搜索之后默认展开所有子节点
        this.$nextTick(() => {
          this.$refs.xTable.setAllTreeExpand(true)
        })
      } else {
        this.authrityTree = this.originAuthrityTreeCopyData
        this.$refs.xTable.setAllTreeExpand(true)
      }
    },
    // 给大数据表格列设置class
    cellClassName ({ row, rowIndex, column, columnIndex, }) {
      if (column.property === 'name' && !row.children) {
        return 'no-children-tree-node'
      } else {
        return ''
      }
    },

    fnBack () {
      this.$router.push(
        {
          name: 'publicRoleManager',
        }
      )
    },
    onPanelChange (value, mode) {
      this.effectiveTime = value.format('YYYY-MM-DD')
    },
    onSelectMenu ({ item, key, keyPath, }) {
      let selectArry = []
      const treeObj = this.$refs.xTable
      selectArry = [...selectArry, ...treeObj.getCheckboxRecords(), ...treeObj.getCheckboxIndeterminateRecords(true)]
      const resultReasultIdArray = []
      selectArry.forEach(item => {
        resultReasultIdArray.push(item.resourceId)
      })
      // 过滤掉登录即可访问的菜单
      // 注释该段逻辑 2019-11-25 by zhouhy
      // selectArry = selectArry.filter(el => {
      //   return !treeObj.getNode(el).data.loginAccess
      // })
      if (!(this.currentCheckedList.sort().toString() === resultReasultIdArray.sort().toString())) {
        this.$confirm({
          title: '提示',
          content: '当前菜单授权修改未保存，是否保存?',
          cancelText: '取消',
          okText: '确认',
          onOk: () => {
            this.rootId = key
            this.fnAuthorityMgSave()
            this.menuSelectedKeys = keyPath
          },
          onCancel: () => {
            this.menuSelectedKeys = keyPath
            this.fnQueryRePermissionByResourceId(key)
          },
        })
      } else {
        this.menuSelectedKeys = keyPath
        this.fnQueryRePermissionByResourceId(key)
      }
    },
    // 递归遍历权限树下所有的resouceId
    fnCreateResourceIds (item, resourceIds) {
      if (item.children) {
        item.children.forEach((value) => {
          this.fnCreateResourceIds(value, resourceIds)
        })
      }
      resourceIds.push(item.resourceId)
    },
    // 递归查找checked
    fnCreateCheckedResourceIds (item, resourceIds) {
      if (item.children) {
        item.children.forEach((value) => {
          this.fnCreateCheckedResourceIds(value, resourceIds)
        })
      }
      if (item.checked) {
        resourceIds.push(item.resourceId)
      }
    },
    fnSaveAuthorityEffectiveTime (forever) {
      const resourceIds = []
      this.fnCreateCheckedResourceIds(this.authrityTree[0], resourceIds)
      const param = {
        roleId: this.role.roleId,
        resourceIds: resourceIds.join(','),
        effectTime: forever ? null : this.effectiveTime,
      }
      $api.updateBatchUsePermissionEffectiveTime(param, (data) => {
        this.$message.success('批量设置有效期成功')
        this.fnQueryRePermissionByResourceId(this.rootId)
        this.batchPop = false
      })
      this.indexClick = null
    },
    onCellChange (data, forever) {
      const param = {
        roleId: this.role.roleId,
        resourceId: data.resourceId,
        effectTime: forever ? null : this.effectiveTime,
      }
      $api.updateUsePermissionEffectiveTime(param, (data) => {
        this.$message.success('修改有效期成功')
        this.fnQueryRePermissionByResourceId(this.rootId)
        this.indexClick = null
      })
    },
    fnAuthorityMgSave () {
      let selectArry = []
      const treeObj = this.$refs.xTable
      selectArry = [...selectArry, ...treeObj.getCheckboxRecords(), ...treeObj.getCheckboxIndeterminateRecords(true)]

      // 过滤掉登录即可访问的菜单
      selectArry = selectArry.filter(el => {
        return !el.loginAccess
      })
      // 存放结果resourceId的
      let resultResourceArray = []
      selectArry.forEach(item => {
        resultResourceArray.push(item.resourceId)
      })
      resultResourceArray = [...resultResourceArray, ...this.tempCheckedList]
      $api.addUsePermission({ roleId: this.role.roleId, resourceIds: resultResourceArray.join(','), }, (data) => {
        this.fnSaveRestUrl()
      })
    },
    // 保存额外的单独授权的
    fnSaveRestUrl () {
      const treeObj = this.$refs.xTable
      // 扁平化树结构
      const allTreeNodeArray = toTreeArray(treeObj.getData())
      const jsonArray = []
      allTreeNodeArray.forEach(item => {
        const checkBoxGroup = item.restUrlAuthorityPoList
        if (checkBoxGroup && checkBoxGroup.length > 0) {
          checkBoxGroup.forEach(value => {
            if (value.checked === '1') {
              jsonArray.push({
                resourceId: value.resourceId,
                urlId: value.urlId,
              })
            }
          })
        }
      })
      $api.changeRestAuthority({ roleId: this.role.roleId, resourceId: this.rootId, jsonArray: JSON.stringify(jsonArray), }, (data) => {
        this.$message.success('保存功能菜单权限成功')
        this.fnQueryRePermissionByResourceId(this.rootId)
      })
    },
    // 查询左侧二级菜单
    fnQueryRePermissionByRoleId () {
      $api.queryRePermissionByRoleId({ roleId: this.role.roleId, }, (data) => {
        this.menuData = data.data.rePermissions
        // 默认选中右侧第一个二级菜单
        this.$nextTick(() => {
          this.menuSelectedKeys = [this.menuData[0].resourceId]
          this.fnQueryRePermissionByResourceId(this.menuData[0].resourceId, 0)
        })
      })
    },
    // 根据点击左侧二级菜单查询右侧权限树
    fnQueryRePermissionByResourceId (resourceId, index) {
      this.authrityTree = [] // 让bigtable重新渲染，树形才能默认全部打开
      this.rootId = resourceId
      $api.queryRePermissionByRoleId({ roleId: this.role.roleId, resourceId: resourceId, }, (data) => {
        this.authrityTree = data.data.rePermissions
        // 进行备份
        this.originAuthrityTreeCopyData = cloneDeep(this.authrityTree, true)
        // 当前选中权限
        this.currentCheckedList = data.data.checkedList
        // 所有选中权限
        this.allCheckedList = data.data.allCheckedList
        // 过滤掉当前显示权限树中选中的权限
        this.tempCheckedList = this.allCheckedList.filter(el => {
          return !data.data.checkedList.includes(el)
        })
        this.$nextTick(() => {
          this.tempNodeCheck = data.data.checkedList
        })
      })
    },
  },
}
</script>
<style type="text/less" lang="less">

.no-children-tree-node {
  .vxe-cell {
    .vxe-cell--tree-node {
      .vxe-tree-cell:before {
        content: "-";
        font-weight: bolder;
        margin-right: 1px;
      }
      .vxe-tree-cell {

      }
    }
  }
}

.pop-calendar {
  width: 300px; border: 1px solid #d9d9d9; borderRadius: 4px;
  .ant-select { width: 100px }
}
</style>
<style scoped type="text/less" lang="less">

.iterface-font{
  color: #777;
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

.button-save{
  position: absolute;
  right: 30%;
  margin-right: 10px;
}

.menu-title{
  height: 39px;
  line-height: 39px;
  width:100%;
  padding: 0 0 0 25px;
}

.notice-box{
  float:right;
  width:100%;
}

.content-box{
  overflow: visible;
}

.resturl-box {
  display: inline-block;
  position: absolute;
  right: 30%;
}

.custom-tree-node {
  width:100%;
}

.node-right{
  float: right;
}
</style>
