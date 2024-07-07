<template>
  <ta-modal
    width="40%"
    height="300px"
    :visible="visible"
    title="新增患者"
    :destroy-on-close="true"
    :mask-closable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <ta-form layout="horizontal" :form-layout="true" label-width="100px" :auto-form-create="(form)=>{this.form = form}">
      <ta-form-item
        label="身份证号"
        field-decorator-id="paIdcard"
        :required="false"
        :field-decorator-options="{rules: [{whitespace:true , require:true,idCard: '2', message: '输入的身份证号码不合法'} ,{validator:checkIdCard}],}"
        :span="24"
        :has-feedback="true"
      >
        <ta-input placeholder="请输入身份证号" />
      </ta-form-item>

      <ta-form-item
        label="姓名"
        :required="false"
        field-decorator-id="paName"
        :field-decorator-options="{rules: [{ whitespace:true , require:true, message: '请输入姓名'} ]}"
        :span="12"
      >
        <ta-input
          placeholder="请输入姓名"
        />
      </ta-form-item>
      <ta-form-item label="性别" field-decorator-id="paSex" :span="12">
        <ta-radio-group collection-type="SEX" collection-filter="1,2" :reverse-filter="true" />
      </ta-form-item>
      <ta-form-item label="出生日期" field-decorator-id="paBirth" :span="12">
        <ta-date-picker placeholder="yyyy/mm/dd" />
      </ta-form-item>
      <ta-form-item
        label="年龄"
        field-decorator-id="paAge"
        :required="false"
        :field-decorator-options="{rules: [{ whitespace:true , require:true, message: '请输入年龄'} ],}"
        :span="12"
      >
        <ta-input
          placeholder="请输入年龄"
        />
      </ta-form-item>
      <ta-form-item label="联系电话" field-decorator-id="paTel" :span="24">
        <ta-input
          placeholder="（非必填）请填写联系电话"
        />
      </ta-form-item>
      <ta-form-item label="了解途径" field-decorator-id="knowWays" :span="24">
        <ta-select collection-type="KNOWWAYS" placeholder="（非必填）请填写了解途径" />
      </ta-form-item>
    </ta-form>
  </ta-modal>
</template>

<script>
import { getMoment, } from '@yh/ta-utils'

export default {
  name: 'addPatient',
  props: {
    visible: {
      type: Boolean,
    },
  },
  data () {
    return {
    }
  },
  methods: {
    handleSubmit () {
      // 获取数据，数据处理
      const formData = this.form.getFieldsMomentValue()
      this.Base.submit(
        this.form,
        {
          url: 'basePatient/addPatient',
          data: formData,
          autoValid: true,
        }).then(data => {
        // 保存完毕后，调用父组件的分页查询方法刷新页面
        this.$emit('cancel', true)
        this.$message.success(msg)
      })
    },
    handleCancel () {
      this.$emit('cancel')
    },
    async checkIdCard (rule, value, callback) {
      if (value === undefined) {
        callback('请输入身份证号码')
      }
      if (value.length === 18) {
        const res = await Base.submit(null, {
          url: 'basePatient/checkIdcard',
          data: { idcard: value, },
        })

        if (res.data.patient) {
          callback('身份证号重复，请检查输入是否正确')
        } else {
          const sexNum = value.substring(value.length - 2, value.length - 1)
          const sex = (sexNum % 2) === 0 ? 2 : 1
          // 身份证号 获取生日
          const birthDay = value.substring(6, 14)
          const year = parseInt(birthDay.substring(0, 4))
          const month = parseInt(birthDay.substring(4, 6))
          const day = parseInt(birthDay.substring(6, 8))
          const birthDayDate = year + '-' + month + '-' + day
          // 身份证号 获取年龄
          const now = new Date()
          const nowMonth = now.getMonth() + 1
          const nowDay = now.getDate()
          let age = now.getFullYear() - year - 1
          if (month < nowMonth || (month === nowMonth && day <= nowDay)) {
            age++
          }
          this.form.setFieldsValue({ paSex: sex + '', paAge: age + '', paBirth: getMoment(birthDayDate, 'YYYY-MM-DD'), })
          callback()
        }
      }
      callback()
    },

  },
}
</script>

<style scoped>

</style>
