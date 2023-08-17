<template>
  <div id="formConfig" class="form-config fit">
    <ta-label-con label="表单布局">
      <ta-select :default-value="formConfig.layout" @change="fnOnLayoutChange">
        <ta-select-option value="horizontal">Horizontal</ta-select-option>
        <ta-select-option value="vertical">Vertical</ta-select-option>
      </ta-select>
    </ta-label-con>
    <ta-label-con label="LabelCol">
      <ta-input-number
        :min="0"
        :max="24"
        v-model="formConfig.labelCol"
        @change="fnOnLabelColChange"/>
    </ta-label-con>
    <ta-label-con label="WrapperCol">
      <ta-input-number
        :min="0"
        :max="24"
        v-model="formConfig.wrapperCol"
        @change="fnOnWrapperColChange"/>
    </ta-label-con>
    <ta-label-con label="Gutter">
      <ta-input-number
        :default-value="formConfig.gutter"
        @change="fnOnGutterChange" />
    </ta-label-con>
    <ta-label-con label="预览Drawer宽度">
      <ta-input-number
        :min="256"
        :step="20"
        v-model="formConfig.previewDrawerWidth"/>
    </ta-label-con>
    <ta-label-con label="是否显示按钮">
      <ta-switch
        v-model="formConfig.showButton"/>
    </ta-label-con>
  </div>
</template>

<script>
export default {
  name: 'formConfig',
  props: {
    formConfig: { // form默认config
      type: Object,
      required: true,
      default: () => {
        return {
          layout: 'horizontal',
          labelCol: 6,
          wrapperCol: 18,
          gutter: 0
        }
      }
    }
  },
  methods: {
    fnOnLayoutChange (value) {
      const newFormConfig = Object.assign(this.formConfig, { layout: value })
      this.$emit('update:formConfig', newFormConfig)
    },
    fnOnLabelColChange (value) {
      const newFormConfig = Object.assign(this.formConfig, { labelCol: value, wrapperCol: 24 - value })
      this.$emit('update:formConfig', newFormConfig)
    },
    fnOnWrapperColChange (value) {
      const newFormConfig = Object.assign(this.formConfig, { labelCol: 24 - value, wrapperCol: value })
      this.$emit('update:formConfig', newFormConfig)
    },
    fnOnGutterChange (value) {
      const newFormConfig = Object.assign(this.formConfig, { gutter: value })
      this.$emit('update:formConfig', newFormConfig)
    }
  }
}
</script>
