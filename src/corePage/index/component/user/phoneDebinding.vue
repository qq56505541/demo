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
      <p> {{ $t('phone.willSend') }} {{ phone }} {{ $t('phone.sendTo') }}</p>
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
        <ta-button :disabled="lockSubmitButton" type="primary" @click="doDebinding" block="true">
          {{ $t('submit') }}
        </ta-button>
      </ta-form-item>
    </ta-form>
  </div>
</template>

<script>
import { mapGetters, mapActions, } from 'vuex'

export default {
  name: 'phone-debinding',
  data () {
    return {
      time: false,
      lockInput: false,
      lockSubmitButton: true,
    }
  },
  computed: {
    ...mapGetters({
      passwordRSAState: 'passwordRSAState',
    }),
  },
  props: {
    phone: {
      type: String,
    },
  },
  methods: {
    sendSms () {
    	// TODO 电话号码加密
      const mobile = this.phone
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
      })
    },
    doDebinding () {
    	// TODO 加密
      const mobile = this.phone
      const smsCode = this.form.getFieldValue('smsCode')
      this.Base.submit(null, {
        url: '/phone/debinding',
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
        failCallback: (data) => {
          const modal = this.$success({
            content: data.Error,
          })
          setTimeout(() => modal.destroy(), 2000)
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
