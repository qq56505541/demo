<template>
  <ta-form :auto-form-create="form=>this.form1=form" title="抽屉">
    <ta-form-item label="规则编号" :field-decorator-id="'no'">
      <ta-input />
    </ta-form-item>
    <ta-form-item label="描述" :field-decorator-id="'description'">
      <ta-input />
    </ta-form-item>
    <ta-form-item label="更新时间" :field-decorator-id="'updatedAt'">
      <ta-input />
    </ta-form-item>
  </ta-form>
</template>

<script>
export default {
  name: 'formPart',
  props: {
    customData: {
      type: Object,
    },
  },
  mounted () {
    this.$nextTick(() => {
      console.log(this.customData)
      this.form1.setFieldsValue(this.customData)
    })
  },
}
</script>

<style scoped>

</style>
