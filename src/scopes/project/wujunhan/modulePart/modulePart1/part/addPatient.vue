<template>
  <ta-modal
    width="40%"
    height="300px"
    :visible="visible"
    :title="title"
    :destroy-on-close="true"
    :mask-closable="false"
    @cancel="cancel"
    @ok="onSubmit"
  >
    <ta-form
      style="width: 90%"
      layout="horizontal"
      :form-layout="true"
      label-width="100px"
      :auto-form-create="(form) => {this.addForm = form}"
    >
      <ta-form-item
        label="身份证号"
        field-decorator-id="idCard"
        :span="24"
        :require="{message: '请输入身份证号',trigger:'blur'}"
        :field-decorator-options="{
          rules:[{
            pattern:'(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)',
            message:'请输入正确的身份证号',
          }]
        }"
      >
        <ta-input @blur="formAutoComplete" />
      </ta-form-item>
      <ta-form-item
        label="姓名"
        :span="14"
        field-decorator-id="paName"
        :require="{message:'请输入姓名'}"
      >
        <ta-input placeholder="请输入姓名" />
      </ta-form-item>
      <ta-form-item label="性别" field-decorator-id="paSex" :span="10" :require="{message:'请输入性别'}">
        <ta-radio-group :options="plainOptions">
        </ta-radio-group>
      </ta-form-item>
      <ta-form-item label="出生年月" :format="{dateFormat:'YYYY-MM-DD'}" field-decorator-id="paBirth" :span="16" :require="{message:'请输入出生年月'}">
        <ta-date-picker />
      </ta-form-item>
      <ta-form-item label="年龄" field-decorator-id="paAge" :span="8" :require="{message:'请输入年龄'}">
        <ta-input />
      </ta-form-item>
      <ta-form-item
        label="联系电话"
        field-decorator-id="telMask"
        :span="24"
        :field-decorator-options="{
          rules:[{
            pattern: '^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\\d{8}$',
            message:'请输入正确的手机号',
          }]
        }"
      >
        <ta-input placeholder="非必填，输入大陆手机号" />
      </ta-form-item>
      <ta-form-item label="了解途径" field-decorator-id="knowWay" :span="24">
        <ta-input placeholder="非必填" />
      </ta-form-item>
    </ta-form>
  </ta-modal>
</template>

<script>
export default {
  name: 'addPatient',
  props: {
    visible: {
      type: Boolean,
    },
    title: {
      type: String,
    },
    patientId: {
      type: String,
    },
  },
  data () {
    return {
      plainOptions:[
        {
          label: '男',
          value: '1',
        }, {
          label: '女',
          value: '2',
        },
      ],
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.addForm.setFieldsValue(this.data1)
    })
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    formAutoComplete () {
      if (!this.addForm.getFieldError('paIdcard') && this.addForm.getFieldValue('paIdcard') !== undefined) {
        this.parseCard(this.addForm.getFieldValue('paIdcard'))
      }
    },
    onSubmit () {
      const formData = this.addForm.getFieldsValue()
      if(this.title === '新增'){
        formData.paBirth = formData.paBirth.format('YYYY-MM-DD')
        formData.patientId = Math.ceil(Math.random() * 1000)
        formData.createTime = this.getTime()
        formData.tel = '点击查看'
        this.$emit('add', formData)
      } else if (this.title = '编辑'){
        formData.patientId = this.patientId
        this.$emit('edit', formData)
      }
    },
    parseCard (idCard) {
      let birthday = ''
      let sex = 0
      let now = Object
      let birthdays = Object
      let age = Object
      if (idCard != null && idCard !== '') {
        if (idCard.length === 15) {
          birthday = '19' + idCard.slice(6, 12)
        } else if (idCard.length === 18) {
          birthday = idCard.slice(6, 14)
        }
        birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
        // 通过正则表达式来指定输出格式为:1990-01-01
        sex = parseInt(idCard.slice(-2, -1)) % 2
      }
      this.$nextTick(function () {
        now = new Date()
        birthdays = new Date(birthday)
        age = now.getFullYear() - birthdays.getFullYear() - (now.getMonth() < birthdays.getMonth() || (now.getMonth() === birthdays.getMonth() && now.getDate() < birthdays.getDate()) ? 1 : 0)
        this.addForm.setFieldsValue({ paSex: sex, paAge: age, })
        this.addForm.setFieldsMomentValue({ paBirth: birthday, })
      })
    },
    getTime () {
      const date = new Date()
      const y = date.getFullYear()
      const m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
      const d = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
      return y + '-' + m + '-' + d
    },
  },
}
</script>

<style scoped type="text/less">

</style>
