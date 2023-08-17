<template>
  <div id="publicRoleCustomAuthority" class="fit">
    <ta-border-layout v-if="role.length" :layout="{header:'70px'}">
      <template #header>
        <ta-breadcrumb separator=">" style="line-height: 42px;float: left">
          <ta-breadcrumb-item><a @click="$router.push({name: 'similarAuthority'})">相似权限管理</a></ta-breadcrumb-item>
          <ta-breadcrumb-item>相似权限授权</ta-breadcrumb-item>
        </ta-breadcrumb>
        <div class="divider-header" />
        <ta-alert :message="'当前角色为：'+ getNames() " type="info" show-icon style="float: left;margin-top: 2px" />
        <ta-button style="float: right;margin-top: 8px" @click="$router.push({name: 'similarAuthority'})">
          <ta-icon type="rollback" />返回
        </ta-button>
      </template>
      <ta-tabs class="fit content-box" :tab-bar-style="{marginBottom: '0px'}">
        <ta-tab-pane tab="相似权限">
          <ta-row class="fit">
            <ta-col :span="4" class="fit" style="border-right:1px solid #eee;overflow:auto">
              <div class="menu-title">
                <ta-icon type="menu-fold" />
                <span style="margin-left: 5px;">相似权限一级菜单</span>
              </div>
              <ta-divider style="margin: 0" />
              <ta-menu mode="inline" :selected-keys="menuSelectedKeys" @click="onSelectMenu">
                <ta-menu-item v-for="item in menuData" :key="item.resourceId">
                  <ta-icon type="appstore" />
                  {{ item.name }}
                </ta-menu-item>
              </ta-menu>
            </ta-col>
            <ta-col :span="20" class="right-box">
              <ta-big-table
                  ref="xTable"
                  height="100%"
                  resizable
                  border
                  row-id="resourceId"
                  :cell-class-name="cellClassName"
                  :tree-config="{children: 'children', expandAll: true }"
                  :expand-config="{lazy: true,}"
                  :data="treeData"
                  :checkbox-config="{labelField: 'name',checkField: 'checked',showHeader: false,checkMethod: checkMethod}"
                  @checkbox-change="checkedChange"
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
                    <ta-button type="primary" @click.stop.prevent="saveAuthority()">
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
              </ta-big-table>
            </ta-col>
          </ta-row>
        </ta-tab-pane>
      </ta-tabs>
    </ta-border-layout>
  </div>
</template>
<script>
import $api from '../api/index'
import { cloneDeep, eachTree, toTreeArray, } from '@yh/ta-utils'

export default {
  name: '',
  data () {
    return {
      menuSelectedKeys: [],
      menuData: [],
      treeData: [],
      storeTreeData: [],
      roleIds: [],
      defaultProps: { // 菜单组织结构
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf',
        id: 'resourceId',
      },
      filterText: '',
      grantCheckbox: [],
      resourceId: '',

      batchPop: false, // 有效期
      indexClick: null,
      effectiveTime: '',
    }
  },
  computed: {
    role () {
      return this.$route.params.roles || []
    },
    grantCheckUrlIDs () {
      const result = []
      this.grantCheckbox.forEach((item) => {
        result.push(item.urlId)
      })
      return result
    },
  },
  watch: {
    filterText (val) {
      this.filterAgeMethod(val)
    },
  },
  mounted () {
    if (!this.role.length) {
      this.$router.push({ name: 'similarAuthority', })
    }
    this.queryOne()
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

    // 给大数据表格列设置class
    cellClassName ({ row, rowIndex, column, columnIndex, }) {
      if (column.property === 'name' && !row.children) {
        return 'no-children-tree-node'
      } else {
        return ''
      }
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
      this.treeData = this.deepFilter(this.storeTreeData, val)
      this.$nextTick(() => {
        this.$refs.xTable.setAllTreeExpand(true)
      })
    },

    /**
     * 深度过滤
     * @param list
     * @param val
     * @returns {*[]}
     */
    deepFilter (list, val) {
      const aList = list.filter(item => {
        return (item.name ?? item.urlName).indexOf(val) > -1
      })
      const bList = list.filter(item => {
        return (item.name ?? item.urlName).indexOf(val) < 0
      })
      const cList = []
      bList.forEach(item => {
        if (item.children) {
          const a = this.deepFilter(item.children, val)
          cList.push(...a)
        }
      })
      cList.push(...aList)
      return cList
    },
    getNames () {
      const names = []; const roleIds = []
      this.role.forEach((item) => {
        names.push(item.roleName)
        roleIds.push(item.roleId)
      })
      this.roleIds = roleIds
      return names.join('、')
    },
    queryOne () {
      $api.queryRePermissionResource(null, (data) => {
        this.menuData = data.customRePermissions
        this.menuSelectedKeys = [this.menuData[0].resourceId]
        this.queryTwo(this.menuData[0].resourceId)
      })
    },
    queryTwo (resourceId) {
      $api.queryRePermissionResource({ resourceId: resourceId, }, (data) => {
        // this.storeTreeData = this.regenerateCustomRePermissions(data.customRePermissions)
        this.storeTreeData = cloneDeep(data.customRePermissions)
        this.treeData = data.customRePermissions
        this.$nextTick(() => {
          this.$refs.xTable.setAllTreeExpand(true)
        })
      })
    },
    onSelectMenu ({ key, keyPath, }) {
      const resourceIds = this.$refs.xTable.getCheckboxRecords() || []
      this.resourceId = key
      if (resourceIds.length) {
        this.$confirm({
          title: '提示',
          content: '当前相似权限修改未保存，是否保存?',
          cancelText: '取消',
          okText: '确认',
          onOk: () => {
            this.saveAuthority({ key, keyPath, })
          },
          onCancel: () => {
            this.changeLeftMenu(key, keyPath)
          },
        })
      } else {
        this.changeLeftMenu(key, keyPath)
      }
    },
    /**
     * 切换左边相似权限菜单
     * @param key
     * @param keyPath
     */
    changeLeftMenu (key, keyPath) {
      this.grantCheckbox = []
      this.filterText = ''
      this.menuSelectedKeys = keyPath
      this.queryTwo(key)
    },
    /**
     * 获取单独的勾选url
     * @returns {*[]}
     */
    getCheckedsRestUrl () {
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
      return jsonArray
    },
    /**
     * 保存权限
     * jump: 是否保存后跳转，保存后跳转的 key,keyPath
     */
    saveAuthority (jump) {
      let selectArray = []
      const treeObj = this.$refs.xTable
      selectArray = [...treeObj.getCheckboxRecords(), ...treeObj.getCheckboxIndeterminateRecords(true)]
      // 存放结果resourceId的
      const resultResourceArray = []
      selectArray.forEach(item => {
        resultResourceArray.push(item.resourceId)
      })

      // 独立授权的url
      const jsonArray = this.getCheckedsRestUrl()
      const param = { roleIds: this.roleIds.join(','), resourceIds: resultResourceArray.join(','), resourceId: this.resourceId, jsonArray: JSON.stringify(jsonArray), }
      $api.addBatchSimilarAuthority(param, () => {
        this.$message.success('授权成功')
        if (jump) {
          // 保存并切换
          this.changeLeftMenu(jump.key, jump.keyPath)
        }
        // this.$refs.xTable.setAllCheckboxRow(false)
      })

      // const resourceIds = this.$refs.xTable.getCheckboxRecords().map(item => {
      //   return item.resourceId
      // })
      // const jsonArray = this.grantCheckbox
      // const param = { roleIds: this.roleIds.join(','), resourceIds: resourceIds.join(','), resourceId: this.resourceId, jsonArray: JSON.stringify(jsonArray), }
      // $api.addBatchSimilarAuthority(param, () => {
      //   this.$message.success('授权成功')
      //   // this.$refs.xTable.setAllCheckboxRow(false)
      // })
    },
  },
}
</script>
<style scoped type="text/less" lang="less">
.menu-title { height: 39px; line-height: 39px; width: 100%; padding: 0 0 0 25px; overflow: hidden }
.content-box { padding-top: 5px; overflow: visible; }
.right-box { height: 100%; padding: 10px; }
.divider-header {
  background-color: #ccc;
  height: 21px;
  margin: 11px 10px;
  float: left;
  width: 1px;
}
.iterface-font{
  color: #777;
}
</style>
