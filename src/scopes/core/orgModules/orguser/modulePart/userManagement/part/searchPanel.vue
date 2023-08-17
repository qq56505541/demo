<template>
  <ta-search-panel id="demo" :form="searchForm" :width="800" :custom-show-value="customShowValue" @search="onSearch">
    <ta-button slot="target">
      高级搜索
    </ta-button>
    <div slot="formPanel">
      <ta-form :auto-form-create="(form)=>{this.searchForm = form}" :form-layout="true" :col="2">
        <template v-if="searchForm">
          <ta-form-item
            label="所属组织"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            field-decorator-id="userOrgIds"
          >
            <!--            <ta-cascader
              url="org/orguser/orgManagementRestService/getOrgByAsync"
              treeId="orgTreeData"
              :options.sync="options"
              expandTrigger="hover"
              changeOnSelect
              :fieldNames="{ label: 'orgName', value: 'orgId', children: 'children' }"
              placeholder="请选择人员的所属组织" />-->
            <project-search-tree />
          </ta-form-item>
          <ta-form-item
            label="包含子组织"
            :colon="false"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            field-decorator-id="showChildUser"
            :field-decorator-options="{initialValue: true, valuePropName: 'checked'}"
          >
            <ta-checkbox />
          </ta-form-item>
          <ta-form-item
            label="姓名"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            field-decorator-id="name1"
          >
            <ta-user-input select-title="选择姓名" :org-load-fn="handleLoadOrgNode" :user-load-fn="handleQueryUserList" :user-select-call="(data) => {selectName = data.name}" />
          </ta-form-item>
          <ta-form-item
            label="账号"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            field-decorator-id="loginId1"
          >
            <ta-input />
          </ta-form-item>
          <ta-form-item
            label="性别"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            field-decorator-id="sex"
          >
            <ta-radio-group>
              <ta-radio v-for="item in CollectionData('SEX')" :key="item.value" :value="item.value">
                {{ item.label }}
              </ta-radio>
            </ta-radio-group>
            <a @click="searchForm.resetFields('sex')">清除选项</a>
          </ta-form-item>
          <ta-form-item
            label="工号"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            field-decorator-id="jobnumber"
          >
            <ta-input />
          </ta-form-item>
          <ta-form-item
            label="证件类型"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            field-decorator-id="idCardType"
          >
            <ta-select mode="multiple">
              <ta-select-option v-for="item in CollectionData('IDCARDTYPE')" :key="item.value" :value="item.value">
                {{ item.label }}
              </ta-select-option>
            </ta-select>
          </ta-form-item>
          <ta-form-item
            label="证件号"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            field-decorator-id="idCardNo1"
          >
            <ta-input />
          </ta-form-item>
          <ta-form-item
            label="手机号"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            field-decorator-id="mobile1"
          >
            <ta-input />
          </ta-form-item>
          <ta-form-item
            label="学历"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            field-decorator-id="education"
          >
            <ta-select>
              <ta-select-option v-for="item in CollectionData('EDUCATION')" :key="item.value" :value="item.value">
                {{ item.label }}
              </ta-select-option>
            </ta-select>
          </ta-form-item>
          <ta-form-item
            label="邮箱地址"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            field-decorator-id="email"
            :field-decorator-options="{ rules: [{ type: 'email', message: '请输入正确的邮箱地址' }]}"
          >
            <ta-input />
          </ta-form-item>
          <ta-form-item
            label="邮政编码"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            field-decorator-id="zipCode"
            :field-decorator-options="{rules: [{ pattern: /^[0-9]{6}$/, message: '请输入正确的邮政编码' }]}"
          >
            <ta-input />
          </ta-form-item>
          <ta-form-item
            label="工作单位"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            field-decorator-id="workplace"
          >
            <ta-input />
          </ta-form-item>
          <ta-form-item
            label="创建时间"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            field-decorator-id="createtime"
          >
            <ta-range-picker style="width: 100%" />
          </ta-form-item>
          <ta-form-item
            label="是否锁定"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            field-decorator-id="islock"
          >
            <ta-select mode="multiple">
              <ta-select-option value="0">
                未锁定
              </ta-select-option>
              <ta-select-option value="1">
                已锁定
              </ta-select-option>
            </ta-select>
          </ta-form-item>
          <ta-form-item
            label="是否有效"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            field-decorator-id="userEffective"
          >
            <ta-select mode="multiple" style="width: 100%">
              <ta-select-option v-for="item in CollectionData('EFFECTIVE')" :key="item.value" :value="item.value">
                {{ item.label }}
              </ta-select-option>
            </ta-select>
          </ta-form-item>
        </template>
      </ta-form>
    </div>
  </ta-search-panel>
</template>
<script>
import $api from '../api/index'
import momentToString from '@yh/ta-utils/momentToString'
export default {
  name: 'search-panel',
  props: {
    result: {
      type: Object,
      default () {
        return { }
      },
    },
  },
  data () {
    return {
      searchForm: null,
      formItemLayout: {
        labelCol: { span: 6, },
        wrapperCol: { span: 18, },
      },
      userOrgIds: '',
      options: [],
      selectName: '',
    }
  },
  methods: {
    onSearch (val) {
      if (val.createtime && val.createtime.length) {
        val.createtimeMin = momentToString(val.createtime[0], 'YYYY-MM-DD') + ' 00:00:00'
        val.createtimeMax = momentToString(val.createtime[1], 'YYYY-MM-DD') + ' 23:59:59'
        delete val.createtime
      }
      if (val.mobile1) { val.mobile = val.mobile1; delete val.mobile1 }
      if (val.name1) { val.name = this.selectName; delete val.name1 }
      if (val.idCardNo1) { val.idCardNo = val.idCardNo1; delete val.idCardNo1 }
      if (val.loginId1) { val.loginId = val.loginId1; delete val.loginId1 }
      if (val.userOrgIds) {
        val.orgId = val.userOrgIds
      }
      this.$emit('dealSearchPanelResult', val)
    },
    /* 人员选择相关 */
    handleLoadOrgNode (node, resolve) {
      const nodeOrgId = (node.data && node.data.orgId) || ''
      $api.loadOrgTree(nodeOrgId, (data) => {
        resolve(data.orgTreeData)
      })
    },
    handleQueryUserList ({ orgId, userId, includeChild, pageSize, pageNum, searchVal, searchType, searchParam, }, resolve) {
      $api.queryUserList({ orgId, userId, includeChild, pageSize, pageNum, searchVal, searchType, searchParam, }, (data) => {
        resolve(data.userList.list)
      })
    },
    customShowValue (obj) {
      if (obj.className.indexOf('project-search-tree') !== -1) {
        return obj.childNodes[0].childNodes[0].childNodes[0].value
      }
    },
  },
}
</script>
