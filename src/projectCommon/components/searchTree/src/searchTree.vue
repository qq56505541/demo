<template>
   <div class="project-search-tree">
      <ta-input-search :placeholder="'请选择' + name" @search="openModal" @click="clickInput" @input="changeInput" :value="inputLabel">
         <ta-button slot="enterButton" icon="plus"></ta-button>
      </ta-input-search>
      <ta-modal
              :visible="treeVisible"
              :title="'选择' + name"
              @cancel="treeVisible = false"
              :centered="true"
              width="800px"
              :destroy-on-close="true"
              :maskClosable="false"
              :getContainer="setContainer"
              wrapClassName="project-search-tree-modal"
              :body-style="{'height': '500px', 'padding': '20px'}"
              :zIndex="1001">
         <ta-suggest
                 :placeholder="'输入' + name + '进行过滤'"
                 :data-source="dataSource"
                 :table-title-map="titleMap"
                 :option-config="optionConfig"
                 @select="onSelect"
                 @search="handleSearch"
                 style="width: 100%"
         />
         <div style="height: calc(100% - 32px);">
            <ta-tabs class="fit">
               <ta-tab-pane :tab="name + '树'">
                  <ta-e-tree v-show="treeDataFlag" :url="url" show-checkbox check-strictly check-on-click-node highlight-current ref="tree" :filter-node-method="filterNode" :default-expanded-keys="['fd811ab9c30440088df3e29ea784460a']" :props="defaultProps" :urlParam="{}" node-key="orgId" tree-id="orgTreeData" tree-node-id="orgId"  @check-change="handleCheckNodeChange">
                     <div class="custom-tree-node" slot-scope="{ node, data }">
                        {{data.orgName}}
                        <span v-if="data.isAuthority === '0'" class="no-authority">无操作权限</span>
                     </div>
                  </ta-e-tree>
                  <ta-e-tree v-show="!treeDataFlag" :data="treeData" highlight-current ref="tree1" node-key="orgId" show-checkbox :props="defaultProps1" :default-expand-all="true" check-strictly check-on-click-node :default-checked-keys="defaultCheckedKeys" @check-change="handleCheckNodeChange"/>
               </ta-tab-pane>
            </ta-tabs>
         </div>
         <div slot="footer" style="text-align: center">
            <ta-button type="primary" @click="fnConfirmNode">确定</ta-button>
         </div>
      </ta-modal>
   </div>
</template>
<script>
export default {
  name: 'projectSearchTree',
  props: {
    /** 弹框绑定的组件 */
    getContainerId: {
      type: String,
    },
    value: {
      type: String,
    },
    name: {
      type: String,
      default: '组织名称',
    },
    allowInput: {
      type: Boolean,
      default: false,
    },
    initValue: {
      type: String,
    },
  },
  data () {
    return {
      url: 'org/orguser/orgManagementRestService/getOrgByAsync',
      treeVisible: false, // 是否显示组织树模态框
      expandKeys: [], // 默认展开的树节点
      defaultProps: { // 默认树属性
        children: 'children',
        label: 'orgName',
        isLeaf: 'isLeaf',
        id: 'orgId',
        disabled: (data) => {
          return data.isAuthority === '0'
        },
      },
      defaultProps1: {
        children: 'children',
        label: 'orgName',
        isLeaf: 'isLeaf',
        id: 'orgId',
      },
      inputLabel: '',
      dataSource: [],
      titleMap: null,
      optionConfig: {
        value: 'orgId',
        label: 'orgName',
      },
      treeDataFlag: true,
      treeData: [],
      defaultCheckedKeys: [],
    }
  },
  created () {
    this.titleMap = new Map()
    this.titleMap.set('orgName', '组织名称')
    this.titleMap.set('orgType', { name: '组织类型', collectionType: 'orgType', })
  },
  mounted () {
    if (this.allowInput) {
      this.inputLabel = this.value
    }
  },
  watch: {
    initValue (val) {
      if (!this.allowInput) {
        this.inputLabel = val
      }
    },
  },
  methods: {
    setContainer () {
      return this.getContainerId ? document.getElementById(this.getContainerId) : document.body
    },
    changeInput (e) {
      if (this.allowInput) {
        this.$emit('change', e.target.value)
        this.inputLabel = e.target.value
      }
    },
    clickInput () {
      if (!this.allowInput) {
        this.openModal()
      }
    },
    openModal () {
      this.treeVisible = true
      this.treeDataFlag = true
    },
    // 过滤节点
    filterNode (value, data, node) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 处理节点点击事件
    handleCheckNodeChange (data, checked, indeterminate) {
      // 如果已经选中,则移除所有的选项,然后进行选中,如果取消选择,
      if (this.treeDataFlag) {
        const node = this.$refs.tree.getCheckedKeys()
        if (checked) { // 如果选中则进行提示
          if (data.isAuthority === '0') {
            this.$message.warning('您没有该组织的操作权限')
            this.$refs.tree.setChecked(data, false)
            return
          }
          if (node.length >= 2) {
            for (let i = 0; i < node.length; i++) {
              if (node[i] !== data.orgId) {
                this.$refs.tree.setChecked(node[i], false, false)
              }
            }
          }
        }
      } else {
        const node = this.$refs.tree1.getCheckedKeys()
        if (checked) { // 如果选中则进行提示
          if (data.isAuthority === '0') {
            // this.$message.warning('您没有该组织的操作权限')
            // this.$refs.tree1.setChecked(data, false)
            // return
          }
          if (node.length >= 2) {
            for (let i = 0; i < node.length; i++) {
              if (node[i] !== data.orgId) {
                this.$refs.tree1.setChecked(node[i], false, false)
              }
            }
          }
        }
      }
    },
    // 点击确认选择节点
    fnConfirmNode () {
      let node = this.$refs.tree.getCheckedNodes()
      let checkData = this.$refs.tree.getCheckedNodes()[0]
      if (!this.treeDataFlag) {
        node = this.$refs.tree1.getCheckedNodes()
        checkData = this.$refs.tree1.getCheckedNodes()[0]
      }
      if (node.length < 1) {
        this.$message.warning('请选择组织', 2.5)
        return false
      }
      if (node.length >= 2) {
        this.$message.warning('只能选择一个组织,或取消当前选择,再选择其他组织', 2.5)
        return
      }
      this.treeVisible = false
      this.inputLabel = checkData.orgName
      if (this.allowInput) {
        this.$emit('change', checkData.orgName)
      } else {
        this.$emit('change', checkData.orgId)
      }
      this.$emit('close', checkData)
    },
    handleSearch (value) {
      if (value?.length) {
        Base.submit(null, {
          url: '/org/orguser/orgManagementRestService/queryAllOrgByOrgId',
          data: {
            param: value,
            needSearch: value.length ? '1' : '0',
          },
        }, {
          successCallback: (data) => {
            const orgData = data.data.orgData
            this.dataSource = orgData
          },
        })
      } else {
        this.treeDataFlag = true
      }
    },
    onSelect (value, item, option) {
      this.treeDataFlag = false
      Base.submit(null, {
        url: '/org/orguser/orgManagementRestService/queryOrgTreeByOrgId',
        data: {
          orgId: value,
        },
      }, {
        successCallback: (data) => {
          const orgData = data.data.orgData
          this.treeData = orgData
          this.defaultCheckedKeys = [value]
        },
      })
    },
  },
}
</script>
<style type="text/less" lang="less">
   .project-search-tree-modal {
      .ant-tabs-nav .ant-tabs-tab {
         padding: 12px 16px 12px 0px;
      }
      .ant-tabs {
         padding: 0px;
      }
      .custom-tree-node { width: 100%; }
      .no-authority { float: right; color: @disabled-color; font-size: 12px; cursor: not-allowed }
   }
</style>
