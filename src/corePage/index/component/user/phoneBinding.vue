<template>
  <div>
    <p>{{ $t('phone.note') }}</p>
    <ta-form :auto-form-create="(form)=>{this.form = form}">
      <ta-form-item
        :label="$t('phone.pwd')"
        field-decorator-id="password"
        :require="{message: $t('phone.pwdRequire')}"
      >
        <ta-input :disabled="lockInput" type="password" :placeholder="$t('phone.pwdPlh')" />
      </ta-form-item>
      <ta-form-item
        :label="$t('phone.phone')"
        field-decorator-id="mobile"
        :require="{message: $t('phone.phoneRequire')}"
      >
        <ta-input :disabled="lockInput" type="input" :placeholder="$t('phone.phonePlh')" />
      </ta-form-item>
      <ta-form-item
        :label="$t('phone.code')"
        field-decorator-id="smsCode"
        :require="{message: $t('phone.codeRequire')}"
      >
        <ta-input style="width: 50%" type="input" :placeholder="$t('phone.codePlh')" />
        <ta-button
          @click="sendSms"
          style="width: 50%;font-size: 12px;border:none;"
          :disabled="time"
        >
          {{ time == false ? $t('phone.sendCode') : time + $t('phone.sendAfter') }}
        </ta-button>
      </ta-form-item>

      <ta-form-item :wrapper-col="{span: 18,offset: 6}">
        <ta-button :disabled="lockSubmitButton" type="primary" @click="doBinding" :block="true">
          {{ $t('submit') }}
        </ta-button>
      </ta-form-item>
      <!--     <ta-sensitive-input inputKey="" placeholder="请绑定手机号" description="手机号" :auth-user="true" :authRequest="authRequest"/>-->
    </ta-form>
  </div>
</template>

<script>
import { mapGetters, mapActions, } from 'vuex'

export default {
  name: 'phone-Binding',
  data () {
    return {
      time: false,
      lockInput: false,
      lockSubmitButton: true,
    }
  },
  mounted () {
  },
  computed: {
    ...mapGetters({
      passwordRSAState: 'passwordRSAState',
    }),
  },
  props: {
    showPhoneBindingPane: {
      type: Boolean,
    },
  },
  methods: {
    authRequest: (param, resolve) => {
      const { userId, } = this.rowData
      $api.authRequestForOrgInfo({
        ...param,
        userId,
      }, (data) => { resolve(data.orgInfo[param.inputKey]) })
    },
    doBinding () {
      const mobile = this.form.getFieldValue('mobile')
      const smsCode = this.form.getFieldValue('smsCode')
      this.Base.submit(null, {
        url: '/phone/binding',
        data: {
          mobile: mobile,
          smsCode: smsCode,
        },
      }, {
        successCallback: (data) => {
          this.cancelThis()
          const modal = this.$success({
            content: data.data.msg,
          })
          setTimeout(() => modal.destroy(), 2000)
        },
      })
    },
    sendSms () {
    	// TODO 电话号码加密
      const mobile = this.form.getFieldValue('mobile')
      let password = this.form.getFieldValue('password')
      // 加密
      this.passwordRSAState && (password = Base.cryptoAsymmetricFn(password))
      this.Base.submit(null, {
        url: '/phone/sendSms',
        data: {
          mobile: mobile,
          password: password,
        },
      }, {
        successCallback: (data) => {
          this.lockInput = true
          this.lockSubmitButton = false
          let canResendTime = data.data.canResendTime
          const timeInterval = setInterval(() => {
            if (canResendTime == 0) {
              clearInterval(timeInterval)
              this.time = false
            } else {
              this.time = canResendTime--
            }
          }, 1000)
          console.log(data)
        },
        failCallback: (data) => {

        },
      })
    },
    cancelThis () {
      this.form.resetFields()
      this.$emit('update:show', false)
    },
  },

}
</script>
