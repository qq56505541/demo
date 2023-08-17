<template>
  <ta-drawer title="授权对象类型信息" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose width="500px">

    <ta-form :autoFormCreate="(form) => {this.form1 = form}">

      <ta-form-item
                    label = '类别名称'
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol">
        {{formData.categoryName}}
      </ta-form-item>

      <ta-form-item
                    label='类别编码'
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol">
        {{formData.code}}
      </ta-form-item>

      <ta-form-item
                    label='类别描述'
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol">
        {{formData.categoryContent}}
      </ta-form-item>

      <ta-form-item
                    label='有效标识'
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol">
        {{formData.effective == '1' ? '有效' : '无效'}}
      </ta-form-item>

    </ta-form>
  </ta-drawer>

</template>
<script>
import $api from '../../api/index'
export default {
  name: 'showCustomResourceCategory',
  props: ['visible', 'rowData', 'chooseCustomResourceResult'],
  data () {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      formData: {},
    }
  },
  watch: {
    visible (val) {
      if (val) {
        $api.queryExamineDetail({ examineId: this.rowData.id }, (result) => {
          this.formData = result.data[this.chooseCustomResourceResult]
        })
      }
    },
  },
  methods: {
    closeDrawer () {
      this.$emit('close')
    },
  },
}
</script>
