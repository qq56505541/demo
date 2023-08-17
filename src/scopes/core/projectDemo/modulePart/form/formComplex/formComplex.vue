<template>
  <ta-border-layout>
    <ta-card title="切换型表单校验" class="mg-b20">
      <switch-check />
    </ta-card>
    <ta-card title="所有表单元素" class="mg-b20">
      <all-form />
    </ta-card>
    <ta-card title="所有表单元素对值的操作">
      <all-form-values />
    </ta-card>
  </ta-border-layout>
</template>
<script>
import switchCheck from './part/switchCheck'
import allForm from './part/allForm'
import allFormValues from './part/allFormValues'
export default {
  name: 'formComplex',
  data () {
    return {}
  },
  components: { switchCheck, allForm, allFormValues, },
  mounted () {

  },
}
</script>
<style lang="less" scoped>
  .mg-b20 {
    margin-bottom: 20px;
  }
</style>
