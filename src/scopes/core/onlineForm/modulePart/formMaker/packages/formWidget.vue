<template>
  <div id="formWidget" class="form-widget fit">
    <ta-form
      :auto-form-create="(form)=>{this.form = form}"
      :layout="formConfig.layout"
      :form-layout="true"
      :label-col="{span: formConfig.labelCol}"
      :wrapper-col="{span: formConfig.wrapperCol}"
      :gutter="formConfig.gutter"
    >
      <draggable
        class="form-widget-content"
        :list="formColumns"
        :group="{ name: 'form' }"
        :ghost-class="ghostClass"
        :animation="300"
        @add="handleWidgetAdd"
      >
        <template v-for="(column, index) in formColumns">
          <div
            class="form-widget-table"
            v-if="column.type === 'dynamic'"
            :key="index"
            :class="{ active: selectWidget === column }"
            @click="handleSelectWidget(index)"
          >
            <form-widget-table
              :form-columns="formColumns"
              :column="column"
              :index="index"
              :select.sync="selectWidget"
            />
          </div>
          <template v-else-if="column.type === 'divider'">
            <ta-form-item
              class="form-widget-item"
              style="height: 20px"
              :key="index"
              :span="24"
              :wrapper-col="{span: 24}"
              :class="{ active: selectWidget === column }"
              @click.native="handleSelectWidget(index)"
            >
              <br>
              <div style="width: 100%; position: relative;background-color: white;">
                <ta-button
                  title="删除"
                  @click.stop="handleWidgetDelete(index)"
                  class="widget-action-delete"
                  :style="{bottom: '12px'}"
                  v-if="selectWidget === column"
                  shape="circle"
                  size="small"
                  type="danger"
                  icon="delete"
                />
                <ta-button
                  title="复制"
                  @click.stop="handleWidgetClone(index)"
                  class="widget-action-clone"
                  :style="{bottom: '12px'}"
                  v-if="selectWidget === column"
                  shape="circle"
                  size="small"
                  type="primary"
                  icon="copy"
                />
              </div>
            </ta-form-item>
          </template>
          <template v-else-if="column.type === 'slot'">
            <ta-form-item
              class="form-widget-item"
              style="height: 40px"
              :key="index"
              :span="24"
              :wrapper-col="{span: 24}"
              :class="{ active: selectWidget === column }"
              @click.native="handleSelectWidget(index)"
            >
              {{ `插槽名：${column.slotName}` }}
              <div style="width: 100%; position: relative;background-color: white;">
                <ta-button
                  title="删除"
                  @click.stop="handleWidgetDelete(index)"
                  class="widget-action-delete"
                  :style="{bottom: '5px'}"
                  v-if="selectWidget === column"
                  shape="circle"
                  size="small"
                  type="danger"
                  icon="delete"
                />
                <ta-button
                  title="复制"
                  @click.stop="handleWidgetClone(index)"
                  class="widget-action-clone"
                  :style="{bottom: '5px'}"
                  v-if="selectWidget === column"
                  shape="circle"
                  size="small"
                  type="primary"
                  icon="copy"
                />
              </div>
            </ta-form-item>
          </template>
          <ta-form-item
            :key="index"
            class="form-widget-item"
            :class="{'multi-input-form-item': column.type === 'multi-input', active: selectWidget === column }"
            v-else
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
            @click.native="handleSelectWidget(index)"
          >
            <form-item :item="column" />
            <div style="width: 100%; position: relative;background-color: white;">
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
          </ta-form-item>
        </template>
      </draggable>
    </ta-form>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { clone as cloneDeep, } from '@yh/ta-utils'
import formItem from './formItem'
import formWidgetTable from './formWidgetTable'

export default {
  name: 'FormWidget',
  components: { draggable, formItem, formWidgetTable, },
  props: {
    // fromconfig
    formConfig: {
      type: Object,
      required: true,
      default: () => {
        return {
          layout: 'horizontal',
          labelCol: 6,
          wrapperCol: 18,
          gutter: 0,
        }
      },
    },
    // form-item数据
    formColumns: {
      type: Array,
      required: true,
    },
    // 当前选中的item数据
    select: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },
  data () {
    return {
      selectWidget: this.select, // 当前选中
    }
  },
  computed: {
    ghostClass () {
      return `ghost-col-${this.selectWidget.span || 24}`
    },
  },
  methods: {
    // 选中item回调
    handleSelectWidget (index) {
      this.selectWidget = this.formColumns[index]
    },
    // 工作区添加item
    handleWidgetAdd (evt) {
      // 获取新添加的item在中间工作区的list中的index
      const newIndex = evt.newIndex
      // 深度克隆一个添加的item的对象
      const data = cloneDeep(this.formColumns[newIndex])
      // 设置id
      if (!data.fieldDecoratorId) { data.fieldDecoratorId = Date.now() + '_' + Math.ceil(Math.random() * 99999) }
      // 统一删除icon
      delete data.icon
      // 统一删除parent属性，应对从子表单移出
      delete data.parent
      // 将新添加的item动态加入到工作区的对象中
      this.$set(this.formColumns, newIndex, { ...data, })
      // 选中新添加的item
      this.handleSelectWidget(newIndex)
    },
    // 删除工作区item
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
    // 克隆item
    handleWidgetClone (index) {
      // 深度克隆被克隆的item
      const cloneData = cloneDeep(this.formColumns[index])
      // 重新设置id
      cloneData.fieldDecoratorId = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      // 添加被克隆的item
      this.formColumns.splice(index, 0, cloneData)
      // 设置选中
      this.$nextTick(() => {
        this.handleSelectWidget(index + 1)
      })
    },
    // 解析form-item的校验规则，将转义字符转为',将'转为"
    transformRules (column) {
      let rulesObj = null
      try {
        rulesObj = JSON.parse(column.rules.replace(/&#x27;/g, '\'').replace(/'/g, '"'))
        console.log(`${column.fieldDecoratorId}的校验规则解析成功，为${JSON.stringify(rulesObj)}`)
      } catch (e) {
        console.warn(`解析${column.fieldDecoratorId}的校验rules失败`)
        rulesObj = null
      } finally {
        return rulesObj || []
      }
    },
  },
  watch: {
    // 侦听select
    select (val) {
      this.selectWidget = val
    },
    // 抛出update事件
    selectWidget: {
      handler (val) {
        this.$emit('update:select', val)
      },
      deep: true,
    },
  },
}
</script>
