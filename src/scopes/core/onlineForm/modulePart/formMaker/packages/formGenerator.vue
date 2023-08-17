<template>
  <div class="fit">
    <ta-form
      :auto-form-create="(form)=>{this.form = form}"
      :layout="formData.formConfig.layout"
      :form-layout="true"
      :label-col="{span: formData.formConfig.labelCol}"
      :wrapper-col="{span: formData.formConfig.wrapperCol}"
      :gutter="formData.formConfig.gutter"
    >
      <template v-for="(column, index) in formData.formColumns">
        <template v-if="column.type === 'dynamic'">
          <ta-label-con
            style="width: 100%;position: static"
            :key="index"
            :label="column.label"
            v-if="column.label !== ''"
            :label-col="{span: formData.formConfig.labelCol}"
            :wrapper-col="{span: formData.formConfig.wrapperCol}"
          >
            <ta-table :data-source="column.data">
              <ta-table-column data-index="addItem" width="20px">
                <ta-button
                  slot="title"
                  @click="addItem(column, index)"
                  shape="circle"
                  type="primary"
                  icon="plus"
                />
                <template slot-scope="text, record, recordIndex">
                  <ta-button
                    slot="title"
                    @click="deleteItem(index, recordIndex)"
                    shape="circle"
                    type="danger"
                    icon="minus"
                  />
                </template>
              </ta-table-column>
              <ta-table-column
                v-for="item in column.children.column"
                :data-index="item.fieldDecoratorId"
                :width="item.width || '100px'"
                :key="item.fieldDecoratorId"
              >
                <span slot="title">
                  <span :class="item.required ? 'column-required' : ''">{{ item.label }}</span>
                </span>
                <template slot-scope="text, record, recordIndex">
                  <ta-form-item
                    :span="24"
                    :class="{'multi-input-form-item': item.type === 'multi-input'}"
                    v-show="item.display"
                    :wrapper-col="{span: 24}"
                    :extra="item.extra"
                    :field-decorator-id="item.fieldDecoratorId + '_' + recordIndex"
                    :required="item.required || false"
                    :field-decorator-options="{
                      valuePropName: item.type !== 'switch' ? 'value' : 'checked',
                      initialValue: item.type !== 'switch' ? item.initialValue : item.initialValue === 'true',
                      validateTrigger: item.validateTrigger && item.validateTrigger.length > 0 ? item.validateTrigger : ['change'],
                      rules: [{
                        required: item.required || false,
                        message: item.message}].concat(item.rules ? JSON.parse(item.rules) : [])
                    }"
                  >
                    <form-item :item="item" :module-part-id="modulePartId" />
                  </ta-form-item>
                </template>
              </ta-table-column>
            </ta-table>
          </ta-label-con>

          <ta-table
            :key="index"
            class="ant-col-24"
            style="margin-bottom: 24px"
            :scroll="{x: column.tableWidth ? parseInt(column.tableWidth) : 0}"
            :data-source="column.data"
            v-if="column.label === ''"
          >
            <ta-table-column data-index="addItem" width="20px">
              <ta-button
                slot="title"
                @click="addItem(column, index)"
                shape="circle"
                type="primary"
                icon="plus"
              />
              <template slot-scope="text, record, recordIndex">
                <ta-button
                  slot="title"
                  @click="deleteItem(index, recordIndex)"
                  shape="circle"
                  type="danger"
                  icon="minus"
                />
              </template>
            </ta-table-column>
            <ta-table-column
              v-for="item in column.children.column"
              :data-index="item.fieldDecoratorId"
              :width="item.width || '100px'"
              :key="item.fieldDecoratorId"
            >
              <span slot="title">
                <span :class="item.required ? 'column-required' : ''">{{ item.label }}</span>
              </span>
              <template slot-scope="text, record, recordIndex">
                <ta-form-item
                  :span="24"
                  :class="{'multi-input-form-item': column.type === 'multi-input'}"
                  v-show="item.display"
                  :wrapper-col="{span: 24}"
                  :extra="item.extra"
                  :field-decorator-id="item.fieldDecoratorId + '_' + recordIndex"
                  :required="item.required || false"
                  :field-decorator-options="{
                    valuePropName: item.type !== 'switch' ? 'value' : 'checked',
                    initialValue: column.type !== 'switch' ? column.initialValue : column.initialValue === 'true',
                    validateTrigger: item.validateTrigger && item.validateTrigger.length > 0 ? item.validateTrigger : ['change'],
                    rules: [{
                      required: item.required || false,
                      message: item.message}].concat(item.rules ? JSON.parse(item.rules) : [])
                  }"
                >
                  <form-item :item="item" :module-part-id="modulePartId" />
                </ta-form-item>
              </template>
            </ta-table-column>
          </ta-table>
        </template>
        <template v-else-if="column.type === 'divider'">
          <br>
        </template>
        <template v-else-if="column.type === 'slot'">
          <div :key="column.slotName" class="ant-col-24">
            <slot :name="column.slotName" />
          </div>
        </template>
        <ta-form-item
          v-else
          :key="index"
          :class="{'multi-input-form-item': column.type === 'multi-input'}"
          v-show="column.display"
          :span="column.span"
          :label="column.label"
          :extra="column.extra"
          :field-decorator-id="column.fieldDecoratorId"
          :required="column.required || false"
          :field-decorator-options="{
            valuePropName: column.type !== 'switch' ? 'value' : 'checked',
            initialValue: column.type !== 'switch' ? column.initialValue : column.initialValue === 'true',
            validateTrigger: column.validateTrigger && column.validateTrigger.length > 0 ? column.validateTrigger : ['change'],
            rules: [{
              required: column.required || false,
              message: column.message}].concat(column.rules && column.rules !== '' ? transformRules(column) : [])
          }"
        >
          <form-item :item="column" :module-part-id="modulePartId" />
        </ta-form-item>
      </template>
    </ta-form>
    <ta-row v-if="formData.formConfig.showButton">
      <ta-col :span="6" :offset="6">
        <ta-button type="primary" @click="handleSubmit">
          提交
        </ta-button>
        <ta-button @click="handleReset">
          重置
        </ta-button>
      </ta-col>
    </ta-row>
  </div>
</template>

<script>
import formItem from './formItem'
import { isEmpty, } from '@yh/ta-utils'

export default {
  name: 'FormGenerator',
  components: { formItem, },
  data () {
    return {
      formData: isEmpty(this.initData) ? {
        formConfig: {
          layout: 'horizontal',
          labelCol: 6,
          wrapperCol: 18,
          gutter: 0,
          previewDrawerWidth: 800,
        },
        formColumns: [],
      } : this.initData, // 初始化formData数据
    }
  },
  props: {
    initData: { // 初始化数据
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
    modulePartId: String,
  },
  mounted () {
    // 初始化子表单的数据
    this.formData.formColumns.forEach(item => {
      if (item.type === 'dynamic') {
        item.data = []
      }
    })
    this.$emit('loadInitData', this.form)
  },
  methods: {
    // 初始化子表单的列，一个table，多个列
    getTableColumns (column, index) {
      const columns = []
      column.children.column.forEach((item, index) => {
        columns.push({
          title: item.label,
          dataIndex: item.fieldDecoratorId,
          scopedSlots: { customRender: item.fieldDecoratorId, },
        })
      })
      return columns
    },
    // 子表单添加行
    addItem (column, index) {
      const record = {}
      record.addItem = column.data.length + 1
      column.children.column.forEach(item => {
        record[item.fieldDecoratorId] = ''
      })
      this.formData.formColumns[index].data.push(record)
      this.$forceUpdate()
    },
    // 子表单删除行
    deleteItem (index, recordIndex) {
      this.formData.formColumns[index].data.splice(recordIndex, 1)
      this.$forceUpdate()
    },
    // 抛出submitForm事件
    handleSubmit () {
      if (this.formData.formConfig.showButton) {
        this.$emit('submitForm', this.form)
      } else {
        return this.form
      }
    },
    // 重置表单
    handleReset () {
      this.form.resetFields()
    },
    // 解析form-item的校验规则，将转义字符转为',将'转为"
    transformRules (column) {
      let rulesArr = []
      try {
        rulesArr = JSON.parse(column.rules.replace(/&#x27;/g, '\'').replace(/'/g, '"'))
        console.log(`${column.fieldDecoratorId}的校验规则解析成功，为${JSON.stringify(rulesArr)}`)
      } catch (e) {
        console.warn(`解析${column.fieldDecoratorId}的校验rules失败`)
        rulesArr = []
      } finally {
        return rulesArr || []
      }
    },
  },
}
</script>
<style>
.column-required:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
</style>
