<template>
  <ta-form layout="horizontal" :form-layout="true" :auto-form-create="(form)=>{this.form = form}" :label-width="100" :self-update="true">
    <ta-form-item label="输入框" field-decorator-id="input">
      <ta-input />
    </ta-form-item>
    <ta-form-item label="数字框" field-decorator-id="inputNumber">
      <ta-input-number class="full-width" />
    </ta-form-item>
    <ta-form-item label="自动完成" field-decorator-id="autoComplete">
      <ta-auto-complete :data-source="dataSource1" @search="handleSearch1" />
    </ta-form-item>
    <ta-form-item label="颜色选择" field-decorator-id="colorPicker">
      <ta-color-picker default-color="#ffffff" />
    </ta-form-item>
    <ta-form-item label="级联选择" field-decorator-id="cascader">
      <ta-cascader :options="formInfo.options" />
    </ta-form-item>
    <ta-form-item label="选择器" field-decorator-id="select">
      <ta-select :options="formInfo.plainOptions" />
    </ta-form-item>
    <ta-form-item label="树选择" field-decorator-id="treeSelect">
      <ta-tree-select
        tree-node-filter-prop="label"
        :tree-data="treeData"
        show-search
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        allow-clear
      />
    </ta-form-item>
    <ta-form-item label="RPC" field-decorator-id="suggest">
      <ta-suggest
        ref="suggest"
        :data-source="dataSource"
        :table-title-map="titleMap"
        :option-config="optionConfig"
        :get-popup-container="setPopupContainer"
        @search="handleSearch"
      />
    </ta-form-item>
    <ta-form-item label="日期选择" field-decorator-id="datePicker">
      <ta-date-picker class="full-width" />
    </ta-form-item>
    <ta-form-item label="月份选择" field-decorator-id="monthPicker">
      <ta-month-picker class="full-width" />
    </ta-form-item>
    <ta-form-item label="季度选择" field-decorator-id="quarterPicker">
      <ta-quarter-picker class="full-width" />
    </ta-form-item>
    <ta-form-item label="年份选择" field-decorator-id="yearPicker">
      <ta-year-picker class="full-width" />
    </ta-form-item>
    <ta-form-item label="时间选择" field-decorator-id="timePicker">
      <ta-time-picker class="full-width" />
    </ta-form-item>
    <ta-form-item label="日期区间" field-decorator-id="rangePicker">
      <ta-range-picker class="full-width" />
    </ta-form-item>
    <ta-form-item label="月份区间" field-decorator-id="rangePicker1">
      <ta-range-picker ref="rangePicker1" format="YYYY-MM" :mode="mode1" :show-today="false" @panelChange="handlePanelChange1">
        <template slot="renderExtraFooter">
          <a role="button" @click="returnThisMonth">返回本月</a>
        </template>
      </ta-range-picker>
    </ta-form-item>
    <ta-form-item label="年份区间" field-decorator-id="rangePicker2">
      <ta-range-picker ref="rangePicker2" format="YYYY" :mode="['year', 'year']" :show-today="false" @panelChange="handlePanelChange2" />
    </ta-form-item>
    <ta-form-item label="日期预设" field-decorator-id="pickerOptions1">
      <ta-date-picker :picker-options="datePickerOptions" class="full-width" />
    </ta-form-item>
    <ta-form-item label="月份预设" field-decorator-id="pickerOptions2">
      <ta-month-picker :picker-options="monthPickerOptions" class="full-width" :align="align1" />
    </ta-form-item>
    <ta-form-item label="季度预设" field-decorator-id="pickerOptions3">
      <ta-quarter-picker :picker-options="quarterPickerOptions" class="full-width" />
    </ta-form-item>
    <ta-form-item label="年份预设" field-decorator-id="pickerOptions4">
      <ta-year-picker :picker-options="yearPickerOptions" class="full-width" />
    </ta-form-item>
    <ta-form-item label="区间预设" field-decorator-id="pickerOptions5">
      <ta-range-picker :format="'YYYY-MM'" :picker-options="rangePickerOptions" :show-today="false" :align="align2" />
    </ta-form-item>
    <ta-form-item label="用户录入" field-decorator-id="userInput">
      <ta-user-input
        select-title="XX人员选择"
        :org-load-fn="handleLoadOrgNode"
        :user-load-fn="handleQueryUserList"
        :user-select-call="handleGetUserListResult"
      />
    </ta-form-item>
    <ta-form-item label="单选框" field-decorator-id="radioGroup">
      <ta-radio-group collection-type="sex" />
    </ta-form-item>
    <ta-form-item label="多选框" field-decorator-id="checkbox">
      <ta-checkbox-group :options="formInfo.plainOptions" />
    </ta-form-item>
    <ta-form-item label="评分" field-decorator-id="rate">
      <ta-rate allow-half />
    </ta-form-item>
    <ta-form-item label="开关" field-decorator-id="switch" :field-decorator-options="{valuePropName: 'checked'}">
      <ta-switch />
    </ta-form-item>
    <ta-form-item label="文本域" field-decorator-id="textarea" :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 8, xxl: 12 }">
      <ta-textarea :rows="4" />
    </ta-form-item>
  </ta-form>
</template>
<script>
import { getMoment, } from '@yh/ta-utils'
export default {
  data () {
    return {
      align1: {
        offset: [200, 0],
      },
      align2: {
        offset: [110, 0],
      },
      index: 0,
      index1: 0,
      dataSource: [],
      dataSource1: [],
      titleMap: null,
      optionConfig: {
        value: 'id', // option的value配置
        label: 'name', // 回显内容配置
      },
      treeData: [{ value: 'zhejiang', label: '浙江', children: [{ value: 'hangzhou', label: '杭州', children: [{ value: 'xihu', label: '西湖', }], }], }, { value: 'jiangsu', label: '江苏', children: [{ value: 'nanjing', label: '南京', children: [{ value: 'zhonghuamen', label: '中华门', }], }], }],
      formInfo: {},
      mode1: ['month', 'month'],
      value1: [],
      datePickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick: getMoment(),
        }, {
          text: '跳转到去年的这个月',
          onClick: {
            time: getMoment().subtract(1, 'year'),
          },
        }, {
          text: '跳转到上个月',
          onClick: {
            time: getMoment().subtract(1, 'month'),
          },
        }],
      },
      monthPickerOptions: {
        shortcuts: [
          {
            text: '这个月',
            onClick: getMoment(),
          },
          {
            text: '上个月',
            onClick: getMoment().subtract(1, 'month'),
          },
          {
            text: '跳转到明年',
            onClick: {
              time: getMoment().add(1, 'year'),
            },
          }
        ],
      },
      yearPickerOptions: {
        shortcuts: [
          {
            text: '抗美援朝发生那一年',
            onClick: getMoment('1950-10', 'YYYY-MM'),
          },
          {
            text: '明年',
            onClick: getMoment().add(1, 'year'),
          },
          {
            text: '跳转到19后前所在的年份',
            onClick: {
              time: getMoment().add(19, 'year'),
            },
          }
        ],
      },
      quarterPickerOptions: {
        shortcuts: [
          {
            text: '下个季度',
            onClick: getMoment().add(1, 'quarter'),
          },
          {
            text: '这个季度',
            onClick: getMoment(),
          },
          {
            text: '跳转到明年',
            onClick: {
              time: getMoment().add(1, 'year'),
              before: (picker) => {
                console.log(1)
              },
              after: (picker) => {
                console.log(2)
              },
            },
          }
        ],
      },
      rangePickerOptions: {
        shortcuts: [{
          text: '上个月到这个月',
          onClick: [getMoment().subtract(1, 'month'), getMoment()],
        }, {
          text: '今年的1月到12月',
          onClick: [getMoment().startOf('year'), getMoment().endOf('year')],
        }, {
          text: '抗美援朝的时间段',
          onClick: [getMoment('1950-10', 'YYYY-MM'), getMoment('1953-7', 'YYYY-MM')],
        }],
      },
    }
  },
  created () {
    this.titleMap = new Map()
    this.titleMap.set('id', 'ID')
    this.titleMap.set('name', '姓名')
    this.titleMap.set('sex', '性别')
  },
  mounted () {
    this.queryFormData()
  },
  methods: {
    queryFormData () {
      this.Base.submit(null, { url: 'http/mock/projectDemo/formComplex/queryFormData', }, {
        successCallback: (data) => {
          this.formInfo = data.data
        },
      })
    },
    handleSearch (value) {
      // 此处进行加载数据
      this.dataSource = this.formInfo.dataSource.filter(ds => {
        return ds.name.indexOf(value) >= 0
      })
    },
    handleSearch1 (value) {
      let result
      if (!value || value.indexOf('@') >= 0) {
        result = []
      } else {
        result = ['gmail.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`)
      }
      this.dataSource1 = result
    },
    handlePanelChange1 (value, mode) {
      this.index++
      this.form.setFieldsValue({
        rangePicker1: value,
      })
      if (this.index === 2) {
        this.index = 0
        this.$refs.rangePicker1.$refs.picker.$children[0].$children[0].setPopupVisible(false, new Event('popup'))
      }
    },
    returnThisMonth () {
      this.form.setFieldsValue({
        rangePicker1: [Base.getMoment(), Base.getMoment()],
      })
      this.$refs.rangePicker1.$refs.picker.$children[0].$children[0].setPopupVisible(false, new Event('popup'))
    },
    handlePanelChange2 (value, mode) {
      this.index1++
      this.form.setFieldsValue({
        rangePicker2: value,
      })
      if (this.index1 === 2) {
        this.index1 = 0
        this.$refs.rangePicker2.$refs.picker.$children[0].$children[0].setPopupVisible(false, new Event('popup'))
      }
    },
    handleLoadOrgNode (node, resolve) {
      // const nodeOrgId = (node.data && node.data.orgId) || ''
      // api请求
      if (node.level === 0) {
        return resolve([{ label: '久远银海', value: 1, }])
      }
      if (node.level > 1) return resolve([])

      setTimeout(() => {
        const data = [{
          label: '研发中心',
          value: 2,
          leaf: true,
        }, {
          label: '创新中心',
          value: 3,
        }]
        resolve(data)
      }, 500)
    },
    handleQueryUserList ({ orgId, userId, includeChild, pageSize, pageNum, searchVal, searchParam, }, resolve) {
      if (pageNum > 1) {
        resolve([])
        return false
      }
      this.Base.submit(null, {
        url: 'http/mock/projectDemo/formComplex/getUserInfo',
        data: {
          orgId: orgId,
          userId: userId,
          showChildUser: includeChild ? 1 : 0,
          pageSize: pageSize,
          pageNumber: pageNum,
          name: searchVal,
        },
        showPageLoading: true,
      }, {
        successCallback: (data) => {
          const result = data.data.result
          if (userId) {
            resolve(result.filter(item => item.userId === userId))
          } else if (searchParam) {
            resolve(result.filter(item => item.name.indexOf(searchParam) !== -1))
          } else {
            resolve(result)
          }
        },
      })
    },
    handleGetUserListResult (dataObj) {
      // 处理
      console.log(dataObj)
    },
    setPopupContainer (node) {
      return node.parentNode
    },
  },
}
</script>
<style lang="less" scoped>
  .full-width { width: 100%; }
</style>
