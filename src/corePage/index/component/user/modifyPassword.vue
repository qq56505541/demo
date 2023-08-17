<template>
  <ta-form :auto-form-create="(form)=>{this.form = form}" layout="horizontal" style="padding: 10px">
    <ta-form-item
      :label="$t('password.original')"
      field-decorator-id="oldPassword"
      :field-decorator-options="{rules: [{ required: true, message: $t('password.originalPwdEmpty') }]}"
    >
      <ta-input :placeholder="$t('password.originalPwd')" type="password" />
    </ta-form-item>
    <ta-form-item
      :label="$t('password.new')"
      field-decorator-id="newPassword"
      :field-decorator-options="{rules: [{ required: true, message: $t('password.newPwdEmpty') },
                                         {validator: compareToNextPassword}]}"
    >
      <ta-input :placeholder="$t('password.newPwd')" type="password" onpaste="return false" oncopy="return false" />
    </ta-form-item>
    <ta-form-item
      :label="$t('password.confirm')"
      field-decorator-id="confirm"
      :field-decorator-options="{rules: [{ required: true, message: $t('password.confirmEmpty') },
                                         {validator:compareToFirstPassword}]}"
    >
      <ta-input :placeholder="$t('password.confirmPwd')" type="password" @blur="handleConfirmBlur" onpaste="return false" oncopy="return false" />
    </ta-form-item>
    <ta-form-item :wrapper-col="{ offset: 5 }">
      <ta-button type="primary" @click="closePane">
        {{ $t('cancel') }}
      </ta-button>
      <ta-button type="primary" style="margin-left: 20px" @click="handleSubmit">
        {{ $t('submit') }}
      </ta-button>
    </ta-form-item>
  </ta-form>
</template>
<script>
import { mapGetters, } from 'vuex'
import checkPass from '@yh/ta-utils/checkPass'
export default {
  name: 'modify-password',
  props: {},
  data () {
    return {
      confirmDirty: false,
    }
  },
  computed: {
    ...mapGetters({
      state: 'getStateValue',
    }),
    userInfo () {
      return this.state.userInfo
    },
  },
  methods: {
    compareToNextPassword (rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true, })
      }
      // 检查并提示密码强度
      const modes = checkPass(value)
      if(this.userInfo.passwordLevel == 1){
        if (modes != this.userInfo.passwordLevel){
          callback('请输入6位数字')
        }
      }else{
        if (modes < this.userInfo.passwordLevel) {
          callback('请至少包含大写字母、小写字母、数字、特殊字符(除去空格)中的' + this.userInfo.passwordLevel + '种，且长度为8~20位')
        } else {
          callback()
        }
      }
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('newPassword')) {
        callback(this.$t('password.different'))
      } else {
        callback()
      }
    },
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const formData = this.form.getFieldsValue()
          formData.userId = this.userInfo.userId || ''
          if (this.userInfo.passwordRSA) {
            formData.oldPassword = Base.cryptoAsymmetricFn(formData.oldPassword)
            formData.newPassword = Base.cryptoAsymmetricFn(formData.newPassword)
          }
					if (formData.confirm) {
						delete formData.confirm
					}
          this.Base.submit(null, {
            url: 'indexRestService/changePassword',
            data: formData,
          }, {
            successCallback: (data) => {
              this.$message.success(this.$t('password.modified'))
              this.form.resetFields()
              this.closePane()
            },
          })
        }
      })
    },
    closePane () {
      this.$emit('close')
    },
  },
}
</script>
