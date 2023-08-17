<template>
  <ta-form :auto-form-create="(form)=>{this.form = form}" layout="vertical">
    <ta-form-item
      field-decorator-id="username"
      :field-decorator-options="{rules: [
          { required: true, message: $t('login.userNameRequire') },
          { max: 30, message: $t('login.userNameLength') }
          ]}"
    >
      <ta-input :placeholder="$t('login.userName')" @blur="checkUser" @pressEnter="gotoDeal($event,'password')">
        <ta-icon slot="prefix" type="user" />
      </ta-input>
    </ta-form-item>
    <ta-form-item
      field-decorator-id="password"
      :field-decorator-options="{rules: [{ required: true, message: $t('login.passwordRequire') }]}"
    >
      <ta-input
        :placeholder="$t('login.password')"
        type="password"
        style="width: 70%"
        autocomplete="new-password"
        @pressEnter="gotoDeal($event,simpleCheckCodeState?'checkCode':'sbbtn')"
      >
        <ta-icon slot="prefix" type="lock" />
      </ta-input>
      <ta-button
        tabindex="-1"
        style="width: 30%; font-size: 12px; border:none; margin: 0; box-shadow: none;"
        @click="showModifyPasswordPane"
      >
        {{ $t('login.changePassword') }}
      </ta-button>
    </ta-form-item>
    <ta-form-item
      v-if="simpleCheckCodeState"
      field-decorator-id="checkCode"
      :field-decorator-options="{rules: [{ required: true, message: $t('login.verificationCodeRequire') }]}"
    >
      <ta-input
        ref="checkCode"
        style="width: 60%"
        :placeholder="$t('login.verificationCode')"
        @pressEnter="gotoDeal($event,'sbbtn')"
      >
        <ta-icon slot="prefix" type="appstore" />
      </ta-input>
      <img style="width: 40%" :src="imgSrc" :title="$t('login.getVerificationCodeTips')" @click="refreshCode()">
    </ta-form-item>

    <div v-show="slideCheckCodeState" id="loginCheckCodeDiv">
      <div class="codeDragValidate-layout-div">
        <div class="codeDragBar-drag-div">
          <div class="codeDrag-win-div">
            <div class="codeDrag-win-div-body">
              <div class="codeDrag-bg-img-div">
                <img class="codeDrag-code-img" src="#" :alt="$t('login.backgroundImg')">
                <img class="codeDrag-darg-img" src="#" :alt="$t('login.dragImg')">
              </div>
              <div class="codeDrag-code-refresh" />
            </div>
          </div>
          <div class="dragBar">
            <span />
          </div>
          <div class="dragBar-inDrag-bg" />
          <div class="dragBar-base-bg">
            <span>{{ $t('login.sureToChange') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 新版验证码 -->
    <Verify
      v-if="showClickWordCheckCode"
      ref="verify"
      :captcha-type="captchaType"
      :img-size="{ width: '330px', height: '155px' }"
      @success="success"
    />

    <ta-form-item>
      <ta-button id="sbbtn" type="primary" block @click="useVerify">
        {{ $t('login.login') }}
      </ta-button>
    </ta-form-item>
  </ta-form>
</template>

<script>
import '../css/SlideCheckCode.less'

import getCodeSrc from '../js/getCodeSrc'
import systemInfo from '../js/clientEnvironment'
import Verify from './verifition/Verify'

import { mapGetters, } from 'vuex'

export default {
  name: 'loginForm',
  components: { Verify, },
  data () {
    return {
      imgSrc: getCodeSrc(),
      slideCode: null,
      cryptInfo: null,
      captchaType: 'clickWord',
      captchaParams: null,
    }
  },
  computed: {
    ...mapGetters({
      sysState: 'getSysState',
      showSimpleCheckCode: 'showSimpleCheckCode',
      simpleCheckCodeState: 'simpleCheckCodeState',
      slideCheckCodeState: 'slideCheckCodeState',
      showSlideCheckCode: 'showSlideCheckCode',
      passwordRSAState: 'passwordRSAState',
      showClickWordCheckCode: 'showClickWordCheckCode',
    }),
  },
  watch: {
    simpleCheckCodeState (now, old) {
      this.refreshCode()
    },
  },
  mounted () {
    document.getElementById('username').focus()
    this.cryptInfo = TaUtils.webStorage.getStorage('Ta$cacheCryptInfo', 'Ta$cacheCryptInfo', { isLocal: true, })
  },
  methods: {
    success (params) {
      // params 返回的二次验证参数, 和登录参数一起回传给登录接口，方便后台进行二次验证
      this.captchaParams = params
      this.handleSubmit()
    },
    useVerify () {
      if (this.showClickWordCheckCode) {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.$refs.verify.show()
          }
        })
      } else {
        this.handleSubmit()
      }
    },
    // checkUser
    checkUser (e) {
      let value = e.target.value
      if (!value) {
        return false
      }
      if (this.sysState?.encryptLoginId === true) {
        value = Base.cryptoAsymmetricFn(value)
      }
      if (value) {
        this.Base.submit(null, {
          url: 'loginRestService/checkUser',
          showPageLoading: false,
          withCredentials: true,
          data: {
            username: value,
          },
        }).then((data) => {
          // 校验成功处理次数
          this.$store.commit('setSysCfg', {
            sessionPasswordErrorNumber: data.data.sessionPasswordErrorNumber,
          })
        })
      }
    },
    refreshCode () {
      if (this.showSimpleCheckCode) {
        this.imgSrc = getCodeSrc()
      }

      if (this.showSlideCheckCode && this.slideCode != null) {
        this.slideCode.refreshSlideCheckCode()
      }
    },
    handleSubmit () {
      let formData = this.form.getFieldsValue()
      // 系统信息
      formData = Object.assign(formData, systemInfo)
      // 加密
      this.passwordRSAState && (formData.password = Base.cryptoAsymmetricFn(formData.password))
      // 用户名
      if (this.sysState?.encryptLoginId === true) {
        formData.username = Base.cryptoAsymmetricFn(formData.username)
      }

      // 针对新版本验证码进行二次校验
      if (this.showClickWordCheckCode) {
        formData.captchaVerification = this.captchaParams.captchaVerification
      }

      this.Base.submit(
        this.form, {
          url: '/login',
          data: formData,
          autoValid: true,
        }, {
          successCallback: (data) => {
            if (this.showClickWordCheckCode) {
              this.$refs.verify.closeBox()
            }
            const accessToken = data.data['TA-JTOKEN']
            const refreshToken = data.data['TA-RJTOKEN']
            if (accessToken !== null && accessToken !== undefined && accessToken !== '') {
              TaUtils.setCookie(faceConfig.basePath + 'TA-JTOKEN', accessToken, 0, '/')
            }
            if (refreshToken !== null && accessToken !== undefined && refreshToken !== '') {
              TaUtils.setCookie(faceConfig.basePath + 'TA-RJTOKEN', refreshToken, 0, '/')
            }
            window.location.href = 'index.html'
          },
          failCallback: (data) => {
            if (this.showClickWordCheckCode) {
              this.$refs.verify.closeBox()
            }
            if (data.errors[0].errorCode === '418') {
              this.refreshCode()
            } else {
              document.getElementById('username').focus()
              // 修改次数
              data.data.passwordDefaultNum !== null &&
              this.$store.commit('setSysCfg', {
                sessionPasswordErrorNumber: data.data.passwordDefaultNum,
              })
              this.refreshCode()
            }
          },
        })
    },
    gotoDeal (e, nextEl) {
      const event = e || window.event
      const el = event.target || event.srcElement
      if (el.value) {
        document.getElementById(nextEl).focus()
      } else {
        el.focus()
      }
    },
    showModifyPasswordPane () {
      this.$emit('modifyPasswordPaneCtr')
    },
  },
}
</script>
