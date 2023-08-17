<template>
  <div class="fit">
    <div v-if="this.formItemConfig && Object.keys(this.formItemConfig).length > 0">
      <component :is="getComponent" v-model="formItemConfig"/>
    </div>
  </div>
</template>

<script>
// 同步批量引入基础组件config
const requireComponent = require.context('./componentConfig', false, /\w+\.(vue|jsx)$/)
// 同步批量引入自定义组件config
const requireCustomComponent = require.context('./custom/componentConfig', false, /\w+\.(vue|jsx)$/)

const components = {} // 组件config注册obj
// 基础组件config添加在组件注册obj
requireComponent.keys().map(fileName => {
  const component = requireComponent(fileName).default
  components[component.name] = component
})
// 自定义组件config添加在组件注册obj
requireCustomComponent.keys().map(fileName => {
  const component = requireCustomComponent(fileName).default
  components[component.name] = component
})
// 日期type
const dateArr = ['year', 'quarter', 'month', 'week', 'date', 'datetime', 'time', 'daterange', 'timerange', 'datetimerange', 'dates']
export default {
  name: 'formItemConfig',
  components: components,
  props: {
    formItemConfig: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },
  data () {
    return {
      dateArr,
    }
  },
  computed: {
    // 获取component注册的名字
    getComponent () {
      const prefix = '-config'
      const { type, } = this.formItemConfig
      let result = 'single-input'

      if ([undefined, 'single-input', 'password'].includes(type)) result = 'single-input'
      else if (dateArr.includes(type)) result = 'dataAndTime'
      else result = type

      return result + prefix
    },
  },
}
</script>
