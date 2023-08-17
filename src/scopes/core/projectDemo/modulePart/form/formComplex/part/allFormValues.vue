<template>
  <ta-form layout="horizontal" :form-layout="true" :auto-form-create="(form)=>{this.form = form}" :label-width="100" :disabled="isDisabled" :self-update="true">
    <ta-form-item label="输入框" field-decorator-id="input1" :init-value="formData.input1">
      <ta-input />
    </ta-form-item>
    <ta-form-item label="数字框" field-decorator-id="inputNumber" :init-value="formData.inputNumber">
      <ta-input-number class="full-width" />
    </ta-form-item>
    <ta-form-item label="自动完成" field-decorator-id="autoComplete" :init-value="formData.autoComplete">
      <ta-auto-complete :data-source="dataSource1" @search="handleSearch1" />
    </ta-form-item>
    <ta-form-item label="颜色选择" field-decorator-id="colorPicker" :init-value="formData.colorPicker">
      <ta-color-picker default-color="#ffffff" />
    </ta-form-item>
    <ta-form-item label="级联选择" field-decorator-id="cascader1" :init-value="formData.cascader1">
      <ta-cascader :options="formInfo.options" />
    </ta-form-item>
    <ta-form-item label="选择器" field-decorator-id="select" :init-value="formData.select">
      <ta-select :options="formInfo.plainOptions" />
    </ta-form-item>
    <ta-form-item label="树选择" field-decorator-id="treeSelect" :init-value="formData.treeSelect">
      <ta-tree-select
        :tree-data="treeData"
        show-search
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        allow-clear
      />
    </ta-form-item>
    <ta-form-item label="RPC" field-decorator-id="suggest" :init-value="formData.suggest">
      <ta-suggest
        ref="suggest"
        :data-source="dataSource"
        :table-title-map="titleMap"
        :option-config="optionConfig"
        @search="handleSearch"
      />
    </ta-form-item>
    <ta-form-item label="日期选择" field-decorator-id="datePicker" :init-value="formData.datePicker">
      <ta-date-picker class="full-width" />
    </ta-form-item>
    <ta-form-item label="月份选择" field-decorator-id="monthPicker" :init-value="formData.monthPicker">
      <ta-month-picker class="full-width" />
    </ta-form-item>
    <ta-form-item label="季度选择" field-decorator-id="quarterPicker" :init-value="formData.quarterPicker">
      <ta-quarter-picker class="full-width" />
    </ta-form-item>
    <ta-form-item label="年份选择" field-decorator-id="yearPicker" :init-value="formData.yearPicker">
      <ta-year-picker class="full-width" />
    </ta-form-item>
    <ta-form-item label="时间选择" field-decorator-id="timePicker" :init-value="formData.timePicker">
      <ta-time-picker class="full-width" />
    </ta-form-item>
    <ta-form-item label="日期区间" field-decorator-id="rangePicker" :init-value="formData.rangePicker">
      <ta-range-picker class="full-width" />
    </ta-form-item>
    <ta-form-item label="月份区间" field-decorator-id="rangePicker1" :init-value="formData.rangePicker1">
      <ta-range-picker format="YYYY-MM" :mode="mode1" @panelChange="handlePanelChange1" />
    </ta-form-item>
    <ta-form-item label="年份区间" field-decorator-id="rangePicker2" :init-value="formData.rangePicker2">
      <ta-range-picker format="YYYY" :mode="['year', 'year']" @panelChange="handlePanelChange2" />
    </ta-form-item>
    <ta-form-item label="日期预设" field-decorator-id="pickerOptions1" :init-value="formData.pickerOptions1">
      <ta-date-picker :picker-options="datePickerOptions" class="full-width" />
    </ta-form-item>
    <ta-form-item label="月份预设" field-decorator-id="pickerOptions2" :init-value="formData.pickerOptions2">
      <ta-month-picker :picker-options="monthPickerOptions" class="full-width" />
    </ta-form-item>
    <ta-form-item label="季度预设" field-decorator-id="pickerOptions3" :init-value="formData.pickerOptions3">
      <ta-quarter-picker :picker-options="quarterPickerOptions" class="full-width" />
    </ta-form-item>
    <ta-form-item label="年份预设" field-decorator-id="pickerOptions4" :init-value="formData.pickerOptions4">
      <ta-year-picker :picker-options="yearPickerOptions" class="full-width" />
    </ta-form-item>
    <ta-form-item label="区间预设" field-decorator-id="pickerOptions5" :init-value="formData.pickerOptions5">
      <ta-range-picker :format="dateFormat" :picker-options="rangePickerOptions" :align="align2" />
    </ta-form-item>
    <ta-form-item label="用户录入" field-decorator-id="userInput" :init-value="formData.userInput">
      <ta-user-input
        select-title="XX人员选择"
        :org-load-fn="handleLoadOrgNode"
        :user-load-fn="handleQueryUserList"
        :user-select-call="handleGetUserListResult"
      />
    </ta-form-item>
    <ta-form-item label="单选框" field-decorator-id="radioGroup" :init-value="formData.radioGroup">
      <ta-radio-group collection-type="sex" />
    </ta-form-item>
    <ta-form-item label="多选框" field-decorator-id="checkbox" :init-value="formData.checkbox">
      <ta-checkbox-group :options="formInfo.plainOptions" />
    </ta-form-item>
    <ta-form-item label="评分" field-decorator-id="rate" :init-value="formData.rate">
      <ta-rate allow-half />
    </ta-form-item>
    <ta-form-item label="开关" field-decorator-id="switch1" :field-decorator-options="{valuePropName: 'checked'}" :init-value="formData.switch1">
      <ta-switch />
    </ta-form-item>
    <ta-form-item label="文本域" field-decorator-id="textarea1" :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 8, xxl: 12 }" :init-value="formData.textarea1">
      <ta-textarea :rows="4" />
    </ta-form-item>
    <ta-form-item label="" :span="24">
      <ta-button-group>
        <ta-button @click="fnSetValue">
          设置值
        </ta-button>
        <ta-button @click="fnGetValue">
          获取值
        </ta-button>
        <ta-button @click="fnSetDisabled">
          可用与否
        </ta-button>
        <ta-button @click="fnSubmit">
          提交
        </ta-button>
        <ta-button @click="fnClearValue">
          重置
        </ta-button>
      </ta-button-group>
    </ta-form-item>
  </ta-form>
</template>
<script>
import { getMoment, } from '@yh/ta-utils'
export default {
  data () {
    return {
      dataSource: [],
      dataSource1: [],
      titleMap: null,
      optionConfig: {
        value: 'id', // option的value配置
        label: 'name', // 回显内容配置
      },
      formData: {},
      isDisabled: false,
      formInfo: {},
      treeData: [{ value: 'zhejiang', label: '浙江', children: [{ value: 'hangzhou', label: '杭州', children: [{ value: 'xihu', label: '西湖', }], }], }, { value: 'jiangsu', label: '江苏', children: [{ value: 'nanjing', label: '南京', children: [{ value: 'zhonghuamen', label: '中华门', }], }], }],
      mode1: ['month', 'month'],
      value1: [],
      dateFormat: 'YYYY-MM-DD',
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
            text: '跳转到19后前所在的年代',
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
          text: '昨天到今天',
          onClick: [getMoment().subtract(1, 'days'), getMoment()],
        }, {
          text: '今年年初到今年年底',
          onClick: [getMoment().startOf('year'), getMoment().endOf('year')],
        }],
      },
      align2: {
        offset: [110, 0],
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
    this.dataSource = [{ id: '1', name: '张三1', sex: '男', }, { id: '2', name: '张三2', sex: '男', }]
    this.formData = {
      input1: 'name',
      inputNumber: 123,
      autoComplete: '13579@qq.com',
      colorPicker: '#ff9494',
      cascader1: ['zhejiang', 'hangzhou', 'xihu'],
      select: '1',
      treeSelect: ['zhejiang'],
      suggest: '1',
      datePicker: TaUtils.getMoment('2014-5-20', this.dateFormat),
      monthPicker: TaUtils.getMoment('2014-05', this.dateFormat),
      yearPicker: TaUtils.getMoment('2014', this.dateFormat),
      quarterPicker: TaUtils.getMoment('2014-5-20', this.dateFormat),
      rangePicker: [TaUtils.getMoment('2014-5-20', this.dateFormat), TaUtils.getMoment('2021-5-25', this.dateFormat)],
      rangePicker1: [TaUtils.getMoment('2014-5-20', this.dateFormat), TaUtils.getMoment('2021-7-20', this.dateFormat)],
      rangePicker2: [TaUtils.getMoment('2018', this.dateFormat), TaUtils.getMoment('2021', this.dateFormat)],
      timePicker: TaUtils.getMoment('12:34:56', 'HH:mm:ss'),
      pickerOptions1: TaUtils.getMoment('2014-5-20', this.dateFormat),
      pickerOptions2: TaUtils.getMoment('2014-5-20', this.dateFormat),
      pickerOptions3: TaUtils.getMoment('2014-5-20', this.dateFormat),
      pickerOptions4: TaUtils.getMoment('2014-5-20', this.dateFormat),
      pickerOptions5: [TaUtils.getMoment('2014-5-20', this.dateFormat), TaUtils.getMoment('2019-5-25', this.dateFormat)],
      radioGroup: '2',
      checkbox: ['2'],
      rate: 2,
      switch1: true,
      textarea1: '文本域默认值',
      userInput: '1-1',
    }
  },
  methods: {
    queryFormData () {
      this.Base.submit(null, { url: 'http/mock/projectDemo/formComplex/queryFormData', }, {
        successCallback: (data) => {
          this.formInfo = data.data
        },
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
    handleSearch (value) {
      // 此处进行加载数据
      this.dataSource = this.formInfo.dataSource
    },
    handlePanelChange1 (value, mode) {
      this.form.setFieldsValue({
        rangePicker1: value,
      })
      this.mode1 = [
        mode[0] === 'date' ? 'month' : mode[0],
        mode[1] === 'date' ? 'month' : mode[1]
      ]
    },
    handlePanelChange2 (value, mode) {
      this.form.setFieldsValue({
        rangePicker2: value,
      })
    },
    handleLoadOrgNode (node, resolve) {
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
    // 重置
    fnClearValue () {
      this.form.resetFields()
      this.isDisabled = false
    },
    // 设置值
    fnSetValue () {
      this.form.setFieldsValue({
        input1: 'haha',
        inputNumber: 345,
        autoComplete: '24680@qq.com',
        colorPicker: '#47acc5',
        cascader1: ['jiangsu', 'nanjing', 'zhonghuamen'],
        select: '2',
        treeSelect: ['jiangsu'],
        suggest: '2',
        radioGroup: '1',
        checkbox: ['1'],
        rate: 5,
        switch1: false,
        textarea1: '文本域修改之后的值',
        userInput: '2-2',
      })
      this.form.setFieldsMomentValue({
        datePicker: '2021-09-20',
        monthPicker: '2019-09',
        yearPicker: '2022',
        quarterPicker: '2021-09-20',
        rangePicker: ['2021-06-20', '2021-09-25'],
        rangePicker1: ['2021-06', '2022-07'],
        rangePicker2: ['2012', '2025'],
        timePicker: '2021-05-20 11:33:55',
        pickerOptions1: '2021-08-20',
        pickerOptions2: '2021-08-20',
        pickerOptions3: '2021-08-20',
        pickerOptions4: '2022-08-20',
        pickerOptions5: ['2021-08-20', '2021-12-25'],
      })
    },
    // 获取值
    fnGetValue () {
      this.$message.info(JSON.stringify(this.form.getFieldsValue()))
    },
    // 设置可用不可用
    fnSetDisabled () {
      this.isDisabled = !this.isDisabled
    },
    // 提交
    fnSubmit () {
      const formData = this.form.getFieldsValue()
      this.Base.submit(
        // 表单对象this.form,如果没有自动校验可以为null
        this.form, {
          url: 'http/mock/projectDemo/formComplex/submitAll', // url
          data: formData, // 表单数据
          autoValid: true, // 提交前是否自动验证
        }, {
          // 成功回调
          successCallback: (data) => {
            this.$message.success('提交成功')
          },
          // 失败回调
          failCallback: (data) => {
            this.$message.error('提交失败')
          },
        })
    },
  },
}
</script>
<style lang="less" scoped>
  .full-width { width: 100%; }
</style>
