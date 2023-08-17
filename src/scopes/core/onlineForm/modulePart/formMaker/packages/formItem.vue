<template>
  <div style="display: inherit;">
    <component
      :is="`form-item-${item.type}`"
      :item="item"
      :value="value"
      :checked="checked"
      :modulePartId="modulePartId"
      v-on="$listeners"></component>
  </div>
</template>

<script>
// 同步引入基础组件
const requireComponent = require.context('./component', false, /\w+\.(vue|jsx)$/)
// 同步引入自定义组件
const requireCustomComponent = require.context('./custom/component', false, /\w+\.(vue|jsx)$/)

let components = {} // 组件注册obj
// 基础组件添加在组件注册obj
requireComponent.keys().map(fileName => {
  let component = requireComponent(fileName).default
  components[component.name] = component
})
// 自定义组件添加在组件注册obj
requireCustomComponent.keys().map(fileName => {
  let component = requireCustomComponent(fileName).default
  components[component.name] = component
})
export default {
  name: 'formItem',
  components: components,
  props: {
    // 组件的配置数据
    item: {
      type: Object,
      required: true
    },
    // ta-form-item设置进来的value
    value: undefined,
    // ta-form-item设置进来的checked，应对特殊组件
    checked: Boolean,
    // 请求的modulePartId
    modulePartId: String
  },
}
</script>
