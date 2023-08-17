<template>
  <ta-form :auto-form-create="(form)=>{this.form = form}" :form-layout="true" :col="2" :label-width="100" :self-update="true">
    <ta-form-item
      label="切换选项"
      field-decorator-id="switch"
      :span="24"
      init-value="1"
    >
      <ta-radio-group :options="[{label:'选项1',value:'1'},{label:'选项2',value:'2'}]" @change="fnOnRadioChange"/>
    </ta-form-item>
    <ta-form-item
      v-if="radioChecked == '1'"
      label="输入框1"
      field-decorator-id="data1"
      :field-decorator-options="{initialValue:'',rules: [{ required: true, message: '输入框1不能为空!' }]}"
    >
      <ta-input key="input1" />
    </ta-form-item>
    <ta-form-item
      v-if="radioChecked == '1'"
      label="数字框1"
      field-decorator-id="number1"
    >
      <ta-input-number style="width: 100%" />
    </ta-form-item>
    <ta-form-item
      v-if="radioChecked == '2'"
      label="输入框2"
      field-decorator-id="data2"
      :field-decorator-options="{initialValue:'',rules: [{ required: true, message: '输入框2不能为空!' }]}"
    >
      <ta-input key="input2" />
    </ta-form-item>
    <ta-form-item label="" :span="24">
      <ta-button type="primary" @click="handleSubmit">
        提交
      </ta-button>
    </ta-form-item>
  </ta-form>
</template>
<script>
export default {
  name: 'switchCheck',
  data () {
    return {
      radioChecked: '1',
    }
  },
  methods: {
    fnOnRadioChange (e) {
      if (e.target.value === '1') {
        this.radioChecked = '1'
      } else {
        this.radioChecked = '2'
      }
    },
    handleSubmit () {
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
            this.$message.success('提交成功值为：' + JSON.stringify(formData))
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
