<template>
  <ta-search-panel id="form1" :form="form1" :width="800" @search="advancedQuery">
    <ta-button slot="target">
      高级搜索
    </ta-button>
    <div slot="formPanel">
      <ta-form :auto-form-create="(form)=>{this.form1 = form}" :form-layout="true" :col="2">
        <template v-if="form1">
          <ta-row>
            <ta-form-item
              label="所属行政区"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              field-decorator-id="areaParam"
            >
              <ta-cascader
                url="org/orguser/areaManagementRestService/queryAreaByAsync"
                tree-id="areaList"
                :options.sync="areaOptions"
                expand-trigger="hover"
                change-on-select
                :field-names="{ label: 'areaName',value: 'areaId',children: 'children'}"
                placeholder="请选择行政区域"
                style="width: 100%"
              />
            </ta-form-item>
            <ta-form-item
              label="有效标识"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              field-decorator-id="effectiveParam"
            >
              <ta-select mode="multiple" style="width: 100%" placeholder="请选择有效标识">
                <ta-select-option v-for="item in CollectionData('EFFECTIVE')" :key="item.value" :value="item.value">
                  {{ item.label }}
                </ta-select-option>
              </ta-select>
            </ta-form-item>
            <ta-form-item
              label="组织类型"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              field-decorator-id="orgTypeParam"
            >
              <ta-select mode="multiple" style="width: 100%" placeholder="请选择组织类型">
                <ta-select-option v-for="item in CollectionData('ORGTYPE')" :key="item.value" :value="item.value">
                  {{ item.label }}
                </ta-select-option>
              </ta-select>
            </ta-form-item>
            <ta-form-item
              label="组织代码"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              field-decorator-id="orgCode"
            >
              <ta-input />
            </ta-form-item>
            <ta-form-item
              label="负责人"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              field-decorator-id="orgManager"
            >
              <ta-user-input select-title="选择负责人" :org-load-fn="handleLoadOrgNode" :user-load-fn="handleQueryUserList" :user-select-call="() => {}" />
            </ta-form-item>
            <ta-form-item
              label="联系人"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              field-decorator-id="contacts"
            >
              <ta-user-input select-title="选择联系人" :org-load-fn="handleLoadOrgNode" :user-load-fn="handleQueryUserList" :user-select-call="() => {}" />
            </ta-form-item>
            <ta-form-item
              label="联系电话"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              field-decorator-id="tel"
            >
              <ta-input />
            </ta-form-item>
            <ta-form-item
              label="联系地址"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              field-decorator-id="address"
            >
              <ta-input />
            </ta-form-item>
            <ta-form-item
              label="创建时间"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              field-decorator-id="createTime"
            >
              <ta-range-picker />
            </ta-form-item>
          </ta-row>
        </template>
      </ta-form>
    </div>
  </ta-search-panel>
</template>
<script>
import moment from 'moment'
import $api from '../api/index'
import momentToString from '@yh/ta-utils/momentToString'
export default {
  name: 'searchInfo',
  data () {
    return {
      form1: null,
      formItemLayout: { labelCol: { span: 6, }, wrapperCol: { span: 18, }, },
      areaOptions: [],
    }
  },
  methods: {
    moment,
    // 通过高级查询框触发查询
    advancedQuery (data) {
      if (data.areaParam) {
        data.areaParam = data.areaParam[data.areaParam.length - 1]
      }
      if (data.orgTypeParam) { data.orgTypeParam = data.orgTypeParam.toString() }
      if (data.effectiveParam) { data.effectiveParam = data.effectiveParam.toString() }

      if (data.createTime && data.createTime.length) {
        data.createTimeMin = momentToString(data.createTime[0], 'YYYY-MM-DD') + ' 00:00:00'
        data.createTimeMax = momentToString(data.createTime[1], 'YYYY-MM-DD') + ' 23:59:59'
        delete data.createTime
      }
      const hasData = Object.keys(data).some(key => data[key])
      data.needSearch = hasData ? '1' : '0'
      this.$emit('search', data)
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
  },
}
</script>
