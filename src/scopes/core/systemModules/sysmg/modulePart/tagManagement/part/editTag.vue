<template>
  <ta-drawer
    :destroy-on-close="true"
    width="500"
    :title="tag.tagId? '编辑标签':'新增标签'"
    placement="right"
    :closable="true"
    :visible="visible"
    :get-container="false"
    @close="closeDrawer"
  >
    <ta-form :auto-form-create="(form)=>{this.form = form}">
      <ta-form-item
        label="标签名称"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        field-decorator-id="tagName"
        :field-decorator-options="{ rules: [{ required: true, message: '标签名称不能为空' }], initialValue: formData.tagName}"
      >
        <ta-input placeholder="请输入标签名称" />
      </ta-form-item>
      <ta-form-item
        label="标签组"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        field-decorator-id="tagGroupId"
        :field-decorator-options="{ rules: [{ required: true, message: '标签组不能为空' }], initialValue: formData.tagGroupId}"
      >
        <ta-select placeholder="请选择标签组" :disabled="tag.tagId !== undefined">
          <ta-select-option v-for="(item, index) in tagGroupList" :key="index" :value="item.tagGroupId">
            {{ item.tagGroupName }}
          </ta-select-option>
        </ta-select>
      </ta-form-item>
      <ta-form-item
        label="有效标识"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        field-decorator-id="effective"
        :field-decorator-options="{ valuePropName: 'checked', initialValue: formData.effective}"
      >
        <ta-switch checked-children="有效" un-checked-children="无效" />
      </ta-form-item>
    </ta-form>
    <div slot="footer">
      <ta-button-group>
        <ta-button @click="form.resetFields()">
          重置
        </ta-button>
        <ta-button type="primary" @click="fnSave">
          保存
        </ta-button>
      </ta-button-group>
    </div>
  </ta-drawer>
</template>
<script>
import $api from '../api/index'
export default {
  name: 'editTag',
  props: ['visible', 'tag', 'tagGroupList'],
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 6, },
        wrapperCol: { span: 18, },
      },
      formData: {},
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.setValue()
      }
    },
  },
  methods: {
    setValue () {
      const { tagId, tagGroupId, effective, tagName, } = this.tag
      if (tagId == undefined) {
        this.formData = {
          effective: true,
          tagGroupId: tagGroupId,
        }
      } else {
        this.formData = {
          tagName: tagName,
          effective: effective == '1',
          tagGroupId: tagGroupId,
        }
      }
    },
    // 提交修改或者新增标签
    fnSave () {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.effective = values.effective ? '1' : '0'
          if (this.tag.tagId == undefined) {
            $api.addTag(values, (data) => {
              this.$message.success('新增标签成功')
              this.$emit('search', { tagGroupId: values.tagGroupId, })
              this.closeDrawer()
            })
          } else {
            values.tagId = this.tag.tagId
            $api.updateTag(values, (data) => {
              this.$message.success('修改标签成功')
              this.$emit('search', { tagGroupId: values.tagGroupId, })
              this.closeDrawer()
            })
          }
        }
      })
    },
    closeDrawer () {
      this.formData = {}
      this.$emit('close')
    },
  },
}
</script>
