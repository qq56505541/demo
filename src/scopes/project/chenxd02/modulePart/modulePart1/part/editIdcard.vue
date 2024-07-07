<template>
  <div>
    <ta-modal
      width="50%"
      height="200"
      :visible="visible"
      title="身份证修改"
      :destroy-on-close="true"
      :mask-closable="false"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <ta-alert
        message="请核对身份证号无误，对同一患者请勿修改多次。"
        type="info"
        show-icon
        closable
        style="margin-bottom: 20px"
      />
      <ta-form layout="horizontal" :form-layout="true" label-width="100px" :auto-form-create="(form)=>{this.form3 = form}">
        <ta-form-item
          label="身份证号"
          field-decorator-id="paIdcard"
          :required="false"
          :field-decorator-options="{initialValue:paIdcard,rules: [{whitespace:true , require:true,idCard: '2', message: '输入的身份证号码不合法'},{validator:checkIdCard}],}"
          :span="24"
          :has-feedback="true"
        >
          <ta-input placeholder="请输入身份证号" />
        </ta-form-item>
        <ta-form-item
          v-if="sex!==''"
          :span="12"
        >
          <span>
            性别：{{ CollectionLabel('SEX', sex) }}
          </span>
        </ta-form-item>
        <ta-form-item
          v-if="age!==''"
          :span="12"
        >
          <span>
            年龄：{{ age }}
          </span>
        </ta-form-item>
      </ta-form>
    </ta-modal>
  </div>
</template>

<script>
import { getMoment, } from '@yh/ta-utils'

export default {
  name: 'editIdcard',
  props: {
    visible: {
      type: Boolean,
    },
    paIdcard: {
      type: String,
    },
  },
  data () {
    return {
      sex: '',
      age: '',
    }
  },
  methods: {
    handleSubmit () {
      // 获取数据，数据处理
      this.$emit('cancel')
    },
    handleCancel () {
      this.$emit('cancel')
    },
    checkIdCard (rule, value, callback) {
      if (value.length === 18) {
        const sexNum = value.substring(value.length - 2, value.length - 1)
        const sex = (sexNum % 2) === 0 ? 2 : 1
        // 身份证号 获取生日
        const birthDay = value.substring(6, 14)
        const year = parseInt(birthDay.substring(0, 4))
        const month = parseInt(birthDay.substring(4, 6))
        const day = parseInt(birthDay.substring(6, 8))
        // 身份证号 获取年龄
        const now = new Date()
        const nowMonth = now.getMonth() + 1
        const nowDay = now.getDate()
        let age = now.getFullYear() - year - 1
        if (month < nowMonth || (month === nowMonth && day <= nowDay)) {
          age++
        }
        this.sex = sex
        this.age = age
        callback()
      }
      callback()
    },
  },
}
</script>

<style scoped>

</style>
