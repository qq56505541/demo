<template>
  <ta-modal :getContainer="setContainer" title="更改组织" :visible="visible" ok-text="确认" cancel-text="关闭" width="500px" size="small" destroy-on-close @ok="saveOrg" @cancel="closeModal">
    <ta-form id="orgForm" :auto-form-create="(form)=>{this.formOrg = form}">
      <ta-form-item v-show="config == '0' || config == '2'" :label="config == '0' ? '所属组织' :'直属组织'" field-decorator-id="orgId">
        <!--   <ta-cascader
          url="org/orguser/orgManagementRestService/getOrgByAsync"
          treeId="orgTreeData"
          :options.sync="changeOptions"
          changeOnSelect
          @change="orgChange"
          allowClear
          expandTrigger="hover"
          :fieldNames="{ label: 'orgName', value: 'orgId', children: 'children' }"
          :placeholder="namePath || ''"/>-->
        <project-search-tree getContainerId="userManagement" :init-value="namePath || ''" />
      </ta-form-item>
      <ta-form-item v-show="config == '1' || config == '2'" :label="config == '1' ? '所属组织' :'副属组织'" class="item-tree">
        <ta-e-tree
          ref="tree"
          :load="handleLoadTreeNode"
          class="tree-style"
          show-checkbox
          highlight-current
          :props="defaultProps"
          node-key="orgId"
          check-strictly
          :default-checked-keys="checkedKeys"
          lazy
          @check="handleNodeCheck"
        />
      </ta-form-item>
    </ta-form>
  </ta-modal>
</template>
<script>
import $api from '../api/index'

export default {
  name: 'changeOrg',
  props: ['visible', 'rowData', 'config'],
  data () {
    return {
      formOrg: null,
      changeOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'isLeaf',
        id: 'orgId',
      },
      checkedKeys: [],
      removeOrgIds: [],
      namePath: '',
      currOrgId: '',
      direct: '',
    }
  },
  watch: {
    visible (val) {
      if (val) {
        $api.getOrgUserByUserId({ userId: this.rowData.userId, }, (data) => {
          const { list, direct, } = data.data
          this.checkedKeys = list
          this.direct = direct ? direct.orgId : ''
          this.namePath = direct ? direct.namePath : ''
          this.currOrgId = this.direct
        })
      }
    },
  },
  methods: {
    setContainer() {
      return document.getElementById('userManagement')
    },
    saveOrg () {
      const param = {}; const orgId = this.formOrg.getFieldValue('orgId')
      if (orgId && orgId.length) {
        param.directOrgId = orgId
      } else {
        param.directOrgId = this.direct
      }
      param.userId = this.rowData.userId
      if (this.config != '0') {
        const addOrgIds = this.$refs.tree.getCheckedKeys()
        param.addOrgIds = addOrgIds.filter((item) => this.checkedKeys.indexOf(item) == -1).join(',')
        param.removeOrgIds = this.removeOrgIds.join(',')
      }
      $api.updateOrgUserByUserId(param, (data) => {
        this.$message.success('重置所属组织成功')
        this.$emit('queryTable')
        this.closeModal()
      })
    },
    closeModal () {
      this.formOrg.resetFields()
      this.checkedKeys = []
      this.removeOrgIds = []
      this.currOrgId = this.direct
      this.namePath = ''
      this.$emit('close')
    },
    handleLoadTreeNode (node, resolve) {
      if (node.level === 0) {
        $api.loadOrgTree(null, (data) => resolve(data.orgTreeData))
      }
      if (node.level >= 1) {
        const nodeOrgId = node.data.orgId || ''
        $api.loadOrgTree(nodeOrgId, (data) => resolve(data.orgTreeData))
      }
    },
    orgChange (value) {
      const checkedList = this.$refs.tree.getCheckedKeys().concat(this.checkedKeys); const checkedId = value[value.length - 1]
      if (value.length) {
        if (checkedList.indexOf(checkedId) != -1) {
          this.$message.warning('直属组织不能与副属组织相同')
          this.$nextTick(() => {
            this.currOrgId = this.direct
            this.formOrg.resetFields()
          })
        } else {
          this.currOrgId = checkedId
        }
      } else {
        this.direct = ''
        this.currOrgId = ''
        this.namePath = ''
      }
    },
    handleNodeCheck (checkedNodes, checkedStatus) {
      const checkedList = checkedStatus.checkedKeys; const checkedId = checkedNodes.orgId; const isCheck = checkedList.indexOf(checkedId) != -1
      if (isCheck) {
        if (checkedId == this.currOrgId) {
          this.$message.warning('副属组织不能与直属组织相同')
          const checkedIndex = checkedList.indexOf(checkedId); const checked = checkedList.slice(0, checkedIndex).concat(checkedList.slice(checkedIndex + 1))
          this.$refs.tree.setCheckedKeys(checked)
        }
        const removeIndex = this.removeOrgIds.indexOf(checkedId)
        if (removeIndex != -1) {
          if (removeIndex == 0) {
            this.removeOrgIds = []
          } else {
            this.removeOrgIds.slice(0, removeIndex).concat(this.removeOrgIds.slice(removeIndex + 1))
          }
        }
      } else {
        if (this.checkedKeys.indexOf(checkedId) != -1) {
          this.removeOrgIds.push(checkedId)
        }
      }
    },
  },
}
</script>
<style type="text/less" lang="less">
  .item-tree .ant-form-item-control { line-height: 26px; }
  .tree-style { padding-top: 6px; height: 300px; overflow: auto; .beautifyScrollbar(); }
</style>
