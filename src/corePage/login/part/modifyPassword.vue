<template>
  <ta-form :auto-form-create="(form)=>{this.form = form}" layout="vertical">
    <ta-form-item
        field-decorator-id="loginId"
        :field-decorator-options="{rules: [{ required: true, message: $t('login.userNameRequire') },
         { max: 30, message: $t('login.userNameLength') },
        ]}"
    >
      <ta-input :placeholder="$t('login.userName')">
        <ta-icon slot="prefix" type="user"/>
      </ta-input>
    </ta-form-item>
    <ta-form-item
        field-decorator-id="oldPassword"
        :field-decorator-options="{rules: [{ required: true, message: $t('login.passwordOldRequire') }]}"
    >
      <ta-input :placeholder="$t('login.password')" type="password" autocomplete="new-password">
        <ta-icon slot="prefix" type="lock"/>
      </ta-input>
    </ta-form-item>
    <ta-form-item
        field-decorator-id="newPassword"
        :field-decorator-options="{rules: [{ required: true, message: $t('login.inputNewPasswordRequire') },{validator:checkPasswordNext}]}"
    >
      <ta-input :placeholder="$t('login.newPassword')" type="password" @blur="handleConfirmBlur">
        <ta-icon slot="prefix" type="lock"/>
      </ta-input>
    </ta-form-item>

    <ta-form-item
        field-decorator-id="newPasswordConfirm"
        :field-decorator-options="{rules: [{ required: true, message: $t('login.inputNewPasswordAgain') },{validator:checkPasswordPre}]}"
    >
      <ta-input :placeholder="$t('login.inputNewPasswordAgain')" type="password">
        <ta-icon slot="prefix" type="lock"/>
      </ta-input>
    </ta-form-item>

    <ta-form-item
        v-if="showSimpleCheckCode"
        field-decorator-id="checkCode"
        :field-decorator-options="{rules: [{ required: true, message: $t('login.verificationCodeRequire') }]}"
    >
      <ta-input style="width: 60%" :placeholder="$t('login.verificationCode')">
        <ta-icon slot="prefix" type="appstore"/>
      </ta-input>
      <img style="width: 40%" @click="refreshCode()" :src="imgSrc" :title="$t('login.getVerificationCodeTips')">
    </ta-form-item>

    <div id="modifyCheckCodeDiv" v-show="showSlideCheckCode">
      <div class="codeDragValidate-layout-div">
        <div class="codeDragBar-drag-div">
          <div class="codeDrag-win-div">
            <div class="codeDrag-win-div-body">
              <div class="codeDrag-bg-img-div">
                <img class="codeDrag-code-img" src="#" :alt="$t('login.backgroundImg')">
                <img class="codeDrag-darg-img" src="#" :alt="$t('login.dragImg')">
              </div>
              <div class="codeDrag-code-refresh"/>
            </div>
          </div>
          <div class="dragBar">
            <span/>
          </div>
          <div class="dragBar-inDrag-bg"/>
          <div class="dragBar-base-bg">
            <span>{{ $t('login.sureToChange') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 新版验证码 -->
    <Verify
        v-if="showClickWordCheckCode"
        @success="success"
        :captchaType="captchaType"
        :imgSize="{ width: '330px', height: '155px' }"
        ref="verify"
    ></Verify>

    <ta-form-item>
      <span style="float: right">
        <ta-button @click="cancelModify">{{ $t('login.cancel') }}</ta-button>
        <ta-button style="margin-left: 10px" type="primary" @click="useVerify">{{ $t('login.ok') }}</ta-button>
      </span>
    </ta-form-item>
  </ta-form>
</template>

<script>
import '../css/SlideCheckCode.less'
import getCodeSrc from '../js/getCodeSrc'
import {mapGetters,} from 'vuex'
import checkPass from '@yh/ta-utils/checkPass'
import Verify from "./verifition/Verify";

export default {
  name: 'modify-password',
  components: {Verify},
  props: {
    show: {
      type: Boolean,
    },
    // 是不是登录页
    passState: {
      type: String,
    },
  },
  data() {
    return {
      confirmDirty: false,
      modes: 0,
      imgSrc: getCodeSrc(),
      modifySlideCode: null,
      captchaType: 'clickWord',
      captchaParams: null,
    }
  },
  computed: {
    ...mapGetters({
      showSimpleCheckCode: 'showSimpleCheckCode',
      showSlideCheckCode: 'showSlideCheckCode',
      passwordRSAState: 'passwordRSAState',
      sysState: 'getSysState',
      passwordLevel: 'passwordLevel',
      showClickWordCheckCode: 'showClickWordCheckCode',
    }),
  },
  watch: {
    show(newValue, oldValue) {
      if (newValue === true) {
        this.form.resetFields()
        this.refreshCode()
      }
    },
  },
  mounted() {
    if (this.showSlideCheckCode) {
      const obj = this
      this.modifySlideCode = new SlideCheckCode('modifyCheckCodeDiv', {
        successCallBack: function () {
          obj.handleSubmit()
        },
      })
    }
  },
  methods: {
    success(params) {
      // params 返回的二次验证参数, 和登录参数一起回传给登录接口，方便后台进行二次验证
      // params 返回的二次验证参数, 和登录参数一起回传给登录接口，方便后台进行二次验证
      this.captchaParams = params
      this.handleSubmit()
    },
    useVerify() {
      this.form.validateFields((err) => {
        if (!err) {
          if (this.showClickWordCheckCode) {
            this.$refs.verify.show()
          } else {
            this.handleSubmit()
          }
        }
      })
    },
    // 提交数据
    handleSubmit() {
      const formData = this.form.getFieldsValue()
      if (this.passwordRSAState) {
        formData.oldPassword = Base.cryptoAsymmetricFn(formData.oldPassword)
        formData.newPassword = Base.cryptoAsymmetricFn(formData.newPassword)
      }
      if (formData.newPasswordConfirm) {
        delete formData.newPasswordConfirm
      }
      // 姓名
      if (this.sysState?.encryptLoginId === true) {
        formData.loginId = Base.cryptoAsymmetricFn(formData.loginId)
      }

      // 针对新版本验证码进行二次校验
      if (this.showClickWordCheckCode) {
        formData.captchaVerification = this.captchaParams.captchaVerification
      }

      // 是否为登录页修改密码
      formData.indexChangePass = this.passState
      this.Base.submit(this.form, {
        url: 'loginRestService/changePassword',
        data: formData,
        autoValid: true,
      }, {
        successCallback: (data) => {
          if (this.showClickWordCheckCode) {
            this.$refs.verify.closeBox()
          }
          this.$message.success(this.$t('login.pswdChangeSuccessTips'))
          this.cancelModify()
        },
        failCallback: (data) => {
          if (this.showClickWordCheckCode) {
            this.$refs.verify.closeBox()
          }
          this.refreshCode()
        },
      })
    },
    cancelModify() {
      this.form.resetFields()
      this.$emit('update:show', false)
    },
    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    checkPasswordNext(rule, value, callback) {

      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['newPasswordConfirm'], {force: true,})
      }
      // 检查并提示密码强度
      const modes = checkPass(value)
      if (this.passwordLevel === 1) {
        if (modes !== this.passwordLevel) {
          callback(this.$t('login.passwordStrenthSimple'))
        }
      } else {
        if (modes < this.passwordLevel) {
          callback(this.$t('login.passwordStrenth1') + this.passwordLevel + this.$t('login.passwordStrenth2'))
        } else {
          callback()
        }
      }
    },
    checkPasswordPre(rule, value, callback) {
      const pwd = this.form.getFieldValue('newPassword')
      if (value && value !== pwd) {
        callback(this.$t('login.passwordDifferentTips'))
      } else {
        callback()
      }
    },
    refreshCode() {
      if (this.showSimpleCheckCode) {
        this.imgSrc = getCodeSrc()
      }

      if (this.showSlideCheckCode && this.modifySlideCode != null) {
        this.modifySlideCode.refreshSlideCheckCode()
      }
    }
  },
}
</script>
