<template>
  <div>
    <h3
      style="margin: 10px"
      v-show="column.label"
    >
      {{ column.label }}
    </h3>
    <draggable
      class="form-widget-table-content"
      :list="column.children.column"
      :group="{ name: 'form' }"
      ghost-class="ghost"
      :animation="200"
      handle=".form-widget-table-item"
      @add="handleWidgetAdd($event, column)"
    >
      <template v-if="column.children.column.length > 0">
        <div
          v-for="(item, tableIndex) in column.children.column"
          :key="tableIndex"
          class="form-widget-table-item"
          :class="{ active: selectWidget === item }"
          :style="{minWidth: item.width ? `${item.width}px`: '33.3%', width: item.width ? `${item.width}px`: '33.3%'}"
          @click.stop="handleTableWidgetSelect(item)"
        >
          <ta-table :key="tableIndex" :columns="getTableColumns(item)" :data-source="getTableColumnsData(item)">
            <span :slot="item.fieldDecoratorId" slot-scope="text, index">
              <ta-form-item
                :key="tableIndex"
                :class="{'multi-input-form-item': item.type === 'multi-input'}"
                :span="24"
                :wrapper-col="{span: 24}"
                :extra="item.extra"
                :field-decorator-id="item.fieldDecoratorId + '_0'"
                :required="item.required || false"
                :field-decorator-options="{
                  valuePropName: item.type !== 'switch' ? 'value' : 'checked',
                  initialValue: item.type !== 'switch' ? item.initialValue : item.initialValue === 'true',
                  validateTrigger: item.validateTrigger && item.validateTrigger.length > 0 ? item.validateTrigger : ['change'],
                  rules: [{
                    required: item.required || false,
                    message: item.message}].concat(item.rules && item.rules !== '' ? transformRules(column) : [])
                }"
                @click.native="handleSelectWidget(index)"
              >
                <form-item :item="item" />
                <div style="width: 100%; position: relative">
                  <ta-button
                    title="删除"
                    @click.stop="handleTableWidgetDelete(column, item)"
                    class="widget-table-action-delete"
                    v-if="selectWidget === item"
                    shape="circle"
                    size="small"
                    type="danger"
                    icon="delete"
                  />
                  <ta-button
                    title="复制"
                    @click.stop="handleTableWidgetClone(column, item)"
                    class="widget-table-action-clone"
                    v-if="selectWidget === item"
                    shape="circle"
                    size="small"
                    type="primary"
                    icon="copy"
                  />
                </div>
              </ta-form-item>
            </span>
          </ta-table>
        </div>
      </template>
    </draggable>
    <div style="width: 100%; position: relative">
      <ta-button
        title="删除"
        @click.stop="handleWidgetDelete(index)"
        class="widget-action-delete"
        v-if="selectWidget === column"
        shape="circle"
        size="small"
        type="danger"
        icon="delete"
      />
      <ta-button
        title="清空"
        @click.stop="handleWidgetClear(index)"
        class="widget-action-clear"
        v-if="selectWidget === column"
        shape="circle"
        size="small"
        type="warning"
        icon="reload"
      />
      <ta-button
        title="复制"
        @click.stop="handleWidgetClone(index)"
        class="widget-action-clone"
        v-if="selectWidget === column"
        shape="circle"
        size="small"
        type="primary"
        icon="copy"
      />
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { clone as cloneDeep, } from '@yh/ta-utils'
import formItem from './formItem'

export default {
  name: 'formWidgetTable',
  components: { draggable, formItem, },
  props: {
    // 工作区数据
    formColumns: {
      type: Array,
      required: true,
    },
    // 子表单数据
    column: {
      type: Object,
      required: true,
    },

    index: {
      type: Number,
      required: true,
    },
    // 子表单内当前选中
    select: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      selectWidget: this.select, // 当前选中
    }
  },
  methods: {
    // 生成单列table的column的list
    getTableColumns (item) {
      return [{
        title: item.label,
        dataIndex: item.fieldDecoratorId,
        scopedSlots: { customRender: item.fieldDecoratorId, },
        customHeaderCell: (column) => { // 处理列必填
          return {
            class: item.required ? 'column-required' : '',
          }
        },
      }]
    },
    // 生成单列单行table数据
    getTableColumnsData (item) {
      const record = {}
      record[item.fieldDecoratorId] = item.initialValue || ''
      return [record]
    },
    // 选中子表单
    handleSelectWidget (index) {
      this.selectWidget = this.formColumns[index]
    },
    // 添加item
    handleWidgetAdd (evt, column) {
      // 获取index
      let newIndex = evt.newIndex
      const item = evt.item
      if (newIndex === 1 && newIndex > column.children.column.length - 1) newIndex = 0
      // 处理特别item不允许加入到子表单，自定义组件需要加上notAllowInTable并设置为true
      if (['子表单', '换行', '插槽'].includes(item.textContent) || column.children.column[newIndex].notAllowInTable) {
        column.children.column.splice(newIndex, 1)
        return
      }
      const data = cloneDeep(column.children.column[newIndex])
      // 设置id
      if (!data.fieldDecoratorId) { data.fieldDecoratorId = Date.now() + '_' + Math.ceil(Math.random() * 99999) }
      // 设置parent
      data.parent = 'dynamic'
      delete data.icon
      this.$set(column.children.column, newIndex, { ...data, })
      // 设置选中
      this.selectWidget = column.children.column[newIndex]
    },
    // 删除item
    handleWidgetDelete (index) {
      // 处理选中
      if (this.formColumns.length - 1 === index) {
        if (index === 0) this.selectWidget = {}
        else {
          this.handleSelectWidget(index - 1)
        }
      } else {
        this.handleSelectWidget(index + 1)
      }
      // 删除item
      this.$nextTick(() => {
        this.formColumns.splice(index, 1)
      })
    },
    // 清空子表单
    handleWidgetClear (index) {
      this.formColumns[index].children.column = []
      this.selectWidget = this.formColumns[index]
    },
    // copy子表单
    handleWidgetClone (index) {
      const cloneData = cloneDeep(this.formColumns[index])
      cloneData.fieldDecoratorId = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      cloneData.children.column.forEach(item => {
        item.fieldDecoratorId = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      })
      this.formColumns.splice(index, 0, cloneData)
      this.$nextTick(() => {
        this.handleSelectWidget(index + 1)
      })
    },
    // 选中子表单内的item
    handleTableWidgetSelect (data) {
      this.selectWidget = data
    },
    // 子表单内的item克隆
    handleTableWidgetClone (column, item) {
      const data = cloneDeep(item)
      data.fieldDecoratorId = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      this.$set(column.children.column, column.children.column.length, { ...data, })
      this.$nextTick(() => {
        this.selectWidget = column.children.column[column.children.column.length - 1]
      })
    },
    // 子表单内的item删除
    handleTableWidgetDelete (column, index) {
      if (column.children.column.length - 1 === index) {
        if (index === 0) this.selectWidget = column
        else this.selectWidget = column.children.column[index - 1]
      } else this.selectWidget = column.children.column[index + 1]
      this.$nextTick(() => {
        column.children.column.splice(index, 1)
      })
    },
    // 解析form-item的校验规则，将转义字符转为',将'转为"
    transformRules (column) {
      let rulesObj = null
      try {
        rulesObj = JSON.parse(column.rules.replace(/&#x27;/g, '\'').replace(/'/g, '"'))
        console.log(`${column.fieldDecoratorId}的校验规则解析成功，校验规则为${JSON.stringify(rulesObj)}`)
      } catch (e) {
        console.warn(`解析${column.fieldDecoratorId}的校验rules失败`)
        rulesObj = null
      } finally {
        return rulesObj || []
      }
    },
  },
  watch: {
    select (val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler (val) {
        this.$emit('update:select', val)
      },
      deep: true,
    },
  },
}
</script>
