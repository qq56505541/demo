<template>
  <ta-modal
    width="400px"
    height="500px"
    :title="title"
    :visible="visible"
    :destory-on-close="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <ta-form :auto-form-create="handleCreate">
      <ta-row :gutter="32">
        <ta-col :span="24">
          <ta-form-item
            v-show="false"
            label="ID"
            field-decorator-id="illId"
          >
            <ta-input disabled placeholder="自动生成" />
          </ta-form-item>
          <ta-form-item
            label="证件号码"
            field-decorator-id="illZjhm"
            :require="{message:'请输入证件号码!'}"
            :field-decorator-options="{rules: [{ idCard: '2', message: '输入的身份证号码不合法' }]}"
          >
            <ta-input placeholder="请输入证件号码" />
          </ta-form-item>
          <ta-form-item
            field-decorator-id="illName"
            label="姓名"
            :require="{message: '请输入姓名'}"
          >
            <ta-input placeholder="请输入姓名" />
          </ta-form-item>
          <ta-form-item
            field-decorator-id="illSex"
            label="性别"
            :require="{message: '请选择性别'}"
          >
            <ta-radio-group
              collection-type="sex"
              collection-filter="1,2"
              :reverse-filter="true"
            />
          </ta-form-item>
          <ta-form-item
            label="出生日期"
            field-decorator-id="illBirth"
            :require="{message:'请输入出生日期!'}"
          >
            <ta-date-picker
              style="width: 100%"
              format="YYYY-MM-DD"
              placeholder="请输入出生日期"
            />
          </ta-form-item>
          <ta-form-item
            label="年龄"
            field-decorator-id="illAge"
            :require="{message:'请输入年龄!'}"
            :field-decorator-options="{rules: [{validator: fnValidateAge}]}"
          >
            <ta-input-number
              style="width: 100%"
              placeholder="请输入年龄"
            />
          </ta-form-item>
          <ta-form-item
            label="联系电话"
            field-decorator-id="illPhone"
            :field-decorator-options="{rules: [{ pattern: /^((0\d{2,3}-\d{7,8})|(1[3-9]\d{9}))$/, message: '请输入手机号或座机号' }]}"
          >
            <ta-input placeholder="(非必填)请输入手机号码" />
          </ta-form-item>
          <ta-form-item
            label="了解途径"
            field-decorator-id="illWay"
          >
            <ta-input placeholder="(非必填)请输入了解途径" />
          </ta-form-item>
        </ta-col>
      </ta-row>
    </ta-form>
  </ta-modal>
</template>

<script>
export default {
  name: 'editHealthCheckSet',
  props: {
    title: {
      type: String,
    },
    visible: {
      type: Boolean,
    },
    record: {
      type: Object,
    },
  },
  data () {
    return {
    }
  },
  methods: {
    handleCancel () {
      this.$emit('cancel', false)
    },
    fnValidateAge (rule, value, callback) {
      if (value < 0 || value > 150) {
        callback('年龄必须大于0小于150')
      } else {
        callback()
      }
    },
    handleSubmit () {
      this.editForm.validateFields((errors, value) => {
        if (errors) {
          // 有错误信息，触发校验规则
        } else {
          // 完成数据提交
          const formData = this.editForm.getFieldsValue() // 获取数据
          formData.illBirth = formData.illBirth.format('YYYY-MM-DD')
          this.$emit('saveIllPer', formData)
        }
      })
    },
    handleCreate (form) {
      this.editForm = form
      this.editForm.setFieldsValue(null)
      this.$nextTick(function () {
        if (this.record !== null && this.record !== undefined && this.record.illId !== undefined) {
          this.editForm.setFieldsValue(this.record)
          if (this.record.illBirth !== undefined && this.record.illBirth != null) {
            this.editForm.setFieldsMomentValue({ illBirth: this.record.illBirth, }) // 设置时间组件的值
          }
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
