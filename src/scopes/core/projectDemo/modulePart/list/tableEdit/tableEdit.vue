<template>
  <ta-border-layout layout-type="fixTop">
    <div slot="header" style="padding:10px;background: #fff;text-align: center;">
      <ta-input-search style="width:40%" placeholder="请输入人员姓名" class="search-box" enter-button="搜索" />
    </div>
    <ta-card class="fit">
      <div slot="extra">
        <ta-button @click="insertEvent">
          新增
        </ta-button>
        <ta-button @click="getInsertEvent">
          获取新增
        </ta-button>
        <ta-button @click="getSelectEvent">
          获取选中
        </ta-button>
        <ta-button @click="$refs.xTable.removeCheckboxRow()">
          删除选中
        </ta-button>
        <ta-button @click="getRemoveEvent">
          获取删除
        </ta-button>
        <ta-button @click="getUpdateEvent">
          获取修改
        </ta-button>
        <ta-button @click="validEvent">
          校验
        </ta-button>
        <ta-button @click="fullValidEvent">
          完整校验
        </ta-button>
        <ta-button @click="validAllEvent">
          全量校验
        </ta-button>
        <ta-button @click="selectValidEvent">
          选中校验
        </ta-button>
        <ta-popconfirm title="确定还原数据吗?" ok-text="确定" cancel-text="取消" @confirm="revertEvent">
          <ta-button>还原数据</ta-button>
        </ta-popconfirm>
      </div>
      <ta-big-table
        ref="xTable"
        border
        height="auto"
        resizable
        auto-resize
        show-overflow
        keep-source
        :data="tableData"
        :edit-rules="validRules"
        :edit-config="{trigger: 'click', mode: 'row',showStatus: true}"
      >
        <ta-big-table-column type="checkbox" width="60" fixed="left" />
        <ta-big-table-column type="seq" width="60" fixed="left" />
        <ta-big-table-column
          field="name"
          title="Name"
          width="150"
          :edit-render="{name: '$input'}"
        />
        <ta-big-table-column
          field="age"
          title="Age"
          width="150"
          :edit-render="{name: '$input-number', renderCell: renderDefaultAge, style: {color: 'red', width: '100%'}, props: {min: 0}}"
        />
        <ta-big-table-column
          field="sex"
          title="Sex"
          width="150"
          collection-type="SEX"
          :edit-render="{name: '$select'}"
        />
        <ta-big-table-column
          field="hobby"
          width="220px"
          title="多选下拉"
          :edit-render="{name: '$select', props: {maxTagCount: 2,mode: 'multiple',options: hobbyList}}"
        />
        <ta-big-table-column
          field="date"
          title="Date"
          width="150"
          :edit-render="{name: '$date-picker', props: {format: 'YYYY-MM-DD'}}"
        />
        <ta-big-table-column
          field="time"
          title="Time"
          width="150"
          :edit-render="{name: '$time-picker', props: {format: 'HH:mm:ss'}}"
        />
        <ta-big-table-column
          field="month"
          title="Month"
          width="150"
          :edit-render="{name: '$month-picker', props: {format: 'YYYY-MM'}}"
        />
        <ta-big-table-column
          field="range"
          title="Range"
          width="250"
          :edit-render="{name: '$range-picker', props: {format: 'YYYY-MM-DD'}}"
        />
        <ta-big-table-column
          field="week"
          title="Week"
          width="150"
          :edit-render="{name: '$week-picker', props: {format: 'YYYY年第ww周'}}"
        />
        <ta-big-table-column
          field="quarter"
          title="Quarter"
          width="150"
          :edit-render="{name: '$quarter-picker', props: {format: 'YYYY年Q季度'}}"
        />
        <ta-big-table-column
          field="year"
          title="Year"
          width="150"
          :edit-render="{name: '$year-picker', props: {format: 'YYYY年'}}"
        />
        <ta-big-table-column field="rate" title="Rate" width="200" :edit-render="{name: '$rate'}" />
        <ta-big-table-column
          field="switch"
          title="Switch"
          width="150"
          :edit-render="{name: '$switch', trueText: '有效', falseText: '无效'}"
        />
        <ta-big-table-column field="checkbox" title="Checkbox" width="150" :edit-render="{name: '$checkbox'}" />
        <ta-big-table-column
          field="radio"
          title="Radio"
          width="150"
          :edit-render="{name: '$radio' , props: {cancelChecked: true}}"
        />
        <ta-big-table-column
          field="radioGroup"
          title="RadioGroup"
          width="320"
          :edit-render="{name: '$radio-group', props: {options: hobbyList}}"
        />
        <ta-big-table-column
          field="checkboxGroup"
          title="CheckboxGroup"
          width="300"
          :edit-render="{name: '$checkbox-group', props: {options: hobbyList}}"
        />
        <ta-big-table-column
          field="cascader"
          title="Cascader"
          width="300"
          :edit-render="{name: '$cascader', props: {options: addressList}}"
        />
        <ta-big-table-column
          field="treeSelect"
          title="TreeSelect"
          width="300"
          :edit-render="{name: '$tree-select', showPath: true, props: {treeData: addressList}}"
        />
        <ta-big-table-column
          field="addresses"
          title="TreeSelect多选"
          width="300"
          :edit-render="{name: '$tree-select', props: {multiple: true, maxTagCount: 2, treeData: addressList}}"
        />

        <div slot="bottomBar">
          <ta-button @click="fnSubmit">
            提交修改
          </ta-button>
        </div>
      </ta-big-table>
    </ta-card>
  </ta-border-layout>
</template>

<script>
const hobbyList = [{ label: '足球', value: 0, }, { label: '篮球', value: 1, }, { label: '排球', value: 2, }, {
  label: '乒乓球',
  value: 3,
}]
const addressList = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [{
      value: 'hangzhou',
      label: '杭州',
      children: [{
        value: 'xihu',
        label: '西湖',
      }],
    }],
  }, {
    value: 'jiangsu',
    label: '江苏',
    children: [{
      value: 'nanjing',
      label: '南京',
      children: [{
        value: 'zhonghuamen',
        label: '中华门',
      }],
    }],
  }]

const data = []
for (let i = 0; i < 40; i++) {
  data.push({
    key: i.toString(),
    name: `Name ${i}`,
    age: i,
    sex: `${i % 3}`,
    hobby: [i % 4],
    date: '2019-05-10',
    month: '2019-05-10',
    range: ['2019-05-10', '2019-05-19'],
    week: '2019-05-10',
    rate: i % 6,
    switch: Boolean(i % 2),
    checkbox: Boolean(i % 2),
    radio: Boolean(i % 2),
    address: ['jiangsu', 'nanjing', 'zhonghuamen'],
    treeSelect: 'nanjing',
    addresses: ['jiangsu', 'nanjing', 'zhonghuamen'],
    cascader: ['jiangsu', 'nanjing', 'zhonghuamen'],
    quarter: '2019-05-10',
    year: '2019-05-10',
    radioGroup: i % 4,
    checkboxGroup: [i % 4],
    time: '2019-05-10 09:50:50',
  })
}
export default {
  name: 'TableEdit',
  data () {
    const nameValid = ({ cellValue, }) => {
      if (cellValue && (cellValue.length < 3 || cellValue.length > 50)) {
        return new Error('名称长度在 3 到 50 个字符之间')
      }
    }
    return {
      tableData: data,
      hobbyList,
      addressList,
      // 编辑时验证条件
      validRules: {
        name: [
          { required: true, message: '姓名必须填写', },
          { validator: nameValid, }
        ],
      },
    }
  },
  methods: {
    renderDefaultAge (h, renderOpts, { cellValue, }) {
      return cellValue + ' 岁'
    },
    insertEvent () {
      // 新增后验证
      this.$refs.xTable.insert([{
        name: '这个是新增的行XXX ',
      }]).then((newRow) => {
        this.$refs.xTable.validate(newRow.rows).catch(errMap => {
          if (errMap) {
            this.$message.error('新添加的行校验不通过！(可自定义是否校验)')
          }
        })
      })
    },
    getInsertEvent () {
      const insertRecords = this.$refs.xTable.getInsertRecords()
      this.$message.info(insertRecords.length)
    },
    getSelectEvent () {
      const selectRecords = this.$refs.xTable.getCheckboxRecords()
      this.$message.info(selectRecords.length)
    },
    getRemoveEvent () {
      const removeRecords = this.$refs.xTable.getRemoveRecords()
      this.$message.info(removeRecords.length)
    },
    getUpdateEvent () {
      const updateRecords = this.$refs.xTable.getUpdateRecords()
      this.$message.info(updateRecords.length)
    },
    validEvent () {
      // 不指定数据，则默认只校验临时变动的数据，例如新增或修改，当某一列校验失败后会停止校验
      this.$refs.xTable.validate().then(() => {
        this.$message.success('校验成功！')
      }).catch(errMap => {
        errMap && this.$message.error('校验不通过！')
        console.log(errMap)
      })
    },
    fullValidEvent () {
      // 不指定数据，则默认只校验临时变动的数据，例如新增或修改，当某一列校验失败后不会停止校验
      this.$refs.xTable.fullValidate().then(() => {
        this.$message.success('校验成功！')
      }).catch(errMap => {
        if (errMap) {
          const msgList = []
          Object.values(errMap).forEach(errList => {
            errList.forEach(params => {
              const { rowIndex, column, rules, } = params
              rules.forEach(rule => {
                if (rowIndex < 0) {
                  msgList.push(`新增行${column.title} 校验错误：${rule.message}`)
                  return
                }
                msgList.push(`第 ${rowIndex + 1} 行 ${column.title} 校验错误：${rule.message}`)
              })
            })
          })
          this.$message.error(msgList.join())
        }
      })
    },
    validAllEvent () {
      // 传入true完整校验整个表格中所有数据
      this.$refs.xTable.validate(true).then(() => {
        this.$message.success('校验成功！')
      }).catch(errMap => {
        errMap && this.$message.error('校验不通过！')
      })
    },
    selectValidEvent () {
      // 传入选中行，校验选中行
      const selectRecords = this.$refs.xTable.getCheckboxRecords()
      if (selectRecords.length > 0) {
        this.$refs.xTable.validate(selectRecords).then(() => {
          this.$message.success('校验成功！')
        }).catch(errMap => {
          errMap && this.$message.error('校验不通过！')
        })
      } else {
        this.$message.warning('未选中数据！')
      }
    },
    revertEvent () {
      this.$refs.xTable.revertData()
    },
    fnSubmit () {
      console.log('click')
    },
  },

}
</script>
