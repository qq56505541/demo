<template>
  <ta-drawer  title="自定义资源信息" placement="right" :closable="true" @close="closeDrawer" :visible="visible" destroyOnClose width="500px">
    <ta-form :autoFormCreate="(form)=>{this.form = form}">

      <ta-form-item
label='资源名称'
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol">
        {{formData.resourceName}}
      </ta-form-item>
      <ta-form-item
label='自定义编码'
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol">
        {{formData.code}}
      </ta-form-item>

      <ta-form-item
label='所属类别'
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol">
        {{formData.resourceCategory}}
      </ta-form-item>

      <ta-form-item
label='上级节点'
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol">
        {{formData.parentId}}
      </ta-form-item>

      <ta-form-item
label='自定义资源内容'
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol">
        {{formData.resourceContent}}
      </ta-form-item>

      <ta-form-item
label='所属系统'
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol">
        {{formData.system}}
      </ta-form-item>

    </ta-form>

  </ta-drawer>

</template>
<script>
import $api from '../../api/index'
export default {
  name: 'showCustomResource',
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
