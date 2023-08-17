<template>
  <ta-form :auto-form-create="(form)=>{this.form = form}">
    <ta-form-item
      label="角色名称"
      field-decorator-id="roleName"
      :field-decorator-options="{initialValue: formData.roleName, rules: [{ required: true, message: '请输入角色名称' },{ max: 50, message: '角色名称最大长度为50' }]}"
    >
      <ta-input placeholder="请输入角色名称" />
    </ta-form-item>
    <ta-form-item
      label="所属组织"
      field-decorator-id="orgId"
      :require="{message:'请选择所属组织'}"
      :field-decorator-options="{initialValue: formData.orgId}"
      style="margin-bottom: 0"
    >
      <!--      <ta-cascader
        :options.sync="orgOptions"
        :showSearch="{filter}"
        @change="onChange"
        changeOnSelect
        placeholder="请选择组织机构"
        expandTrigger="hover"
        class="vertical-space cascader-box"
        :fieldNames="{label:'orgName',value:'orgId',children:'children'}"
        url="org/authority/roleAuthorityManagementRestService/queryCurrentAdminRoleWrapeOrgTree"
        treeId="orgVos"
      />-->
      <project-search-tree get-container-id="publicRoleManager" :init-value="formData.namePath" />
    </ta-form-item>
    <ta-form-item
      :wrapper-col="{ span: 18, offset: 6 }"
      field-decorator-id="subordinate"
      :field-decorator-options="{initialValue: formData.subordinate, valuePropName: 'checked'}"
    >
      <ta-checkbox>
        该角色是否对子组织管理员可见
      </ta-checkbox>
    </ta-form-item>
    <ta-form-item
      label="有效期"
      field-decorator-id="effectiveTime"
      :field-decorator-options="{initialValue: formData.effectiveTime}"
    >
      <ta-date-picker style="width: 100%" format="YYYY-MM-DD" :valid-now-time="'left'" />
    </ta-form-item>
    <ta-form-item
      label="角色标识"
      field-decorator-id="roleSign"
      :field-decorator-options="{initialValue: formData.roleSign}"
    >
      <ta-select placeholder="请选择角色标识" allow-clear>
        <ta-select-option
          v-for="item in CollectionData('ROLESIGN')"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </ta-select-option>
      </ta-select>
    </ta-form-item>
    <ta-form-item
      label="角色描述"
      field-decorator-id="roleDesc"
      :field-decorator-options="{initialValue: formData.roleDesc, rules: [{ max: 50, message: '角色描述最大长度为50' }]}"
    >
      <ta-textarea :rows="4" placeholder="请选择角色描述" />
    </ta-form-item>
  </ta-form>
</template>
<script>
import moment from 'moment'
import $api from '../../api/index'
export default {
  name: 'newRole',
  props: ['updateObj'],
  data () {
    return {
      orgOptions: [],
      formData: {},
    }
  },
  mounted () {
    const { isUpdate, roleObj, } = this.updateObj
    if (isUpdate) {
      this.formData = { ...roleObj, }
      this.formData.idPath = roleObj.idPath
      this.formData.namePath = roleObj.namePath
      this.formData.subordinate = roleObj.subordinate === '1'
      this.formData.roleDesc = roleObj.roleDesc || ''
      this.formData.effectiveTime = roleObj.effectiveTime ? moment(roleObj.effectiveTime, 'YYYY-MM-DD HH:mm:ss') : null
    }
  },
  methods: {
    moment,
    fnResetForm () {
      this.form.resetFields()
    },
    onChange (value, selectedOptions) {
      if (selectedOptions && selectedOptions[selectedOptions.length - 1].isAuthority === '0') {
        this.$message.error('没有权限在该组织下操作角色')
        this.$nextTick(() => {
          this.form.resetFields('orgId')
        })
      }
    },
    filter (inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
    },
    loadOrgTree () {
      $api.queryCurrentAdminRoleWrapeOrgTree({}, (data) => {
        this.orgOptions = data.data.orgVos
      })
    },
    fnNewRole () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const casValue = values.orgId
          values.orgId = casValue ?? ''
          values.subordinate = values.subordinate ? '1' : '0'
          values.roleType = '01'
          values.effectiveTime = values.effectiveTime ? values.effectiveTime.format('YYYY-MM-DD') + ' 23:59:59' : ''
        }
        $api.addRole(this.form, { ...values, effective: '1', }, (data) => {
          this.$message.success('新增角色成功')
          this.$emit('fnQueryRolesByOrgId')
          this.$emit('onNewRoleClose')
        })
      })
    },
    fnUpdateRole () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const casValue = values.orgId
          values.orgId = casValue ?? ''
          let editFlag = false
          const keys = Object.keys(values)
          for (let i = 0; i < keys.length; i++) {
            if (values[keys[i]] !== this.formData[keys[i]]) {
              editFlag = true; break
            }
          }
          if (editFlag) {
            values.subordinate = values.subordinate ? '1' : '0'
            values.roleType = '01'
            values.effectiveTime = values.effectiveTime ? values.effectiveTime.format('YYYY-MM-DD') + ' 23:59:59' : ''
            $api.updateRoleByRoleId(this.form, { roleId: this.updateObj.roleObj.roleId, ...values, effective: '1', }, (data) => {
              this.$message.success('修改角色成功')
              this.$emit('fnQueryRolesByOrgId')
              this.$emit('onNewRoleClose')
            })
          } else {
            this.$message.warning('没有需要保存的修改')
          }
        }
      })
    },
    fnAddOrUpdateRole () {
      if (this.updateObj.isUpdate) {
        this.fnUpdateRole()
      } else {
        this.fnNewRole()
      }
    },
  },
}
</script>
