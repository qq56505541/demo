<template>
  <div id="app" class="body">
    <header>
      <div class="logo">
        <img v-if="false" src="./img/logo.png" alt="log">
      </div>
    </header>

    <img src="./img/taimg.png" style="height:60%;margin-left: 10%">
    <!--    <article>-->
    <div class="login-con">
      <div v-if="!showSmsLogin">
        <div class="header1">
          {{ $t('login.systemLogin') }}
          <span>{{ $t('login.systemLoginTips') }}</span>
        </div>
        <login-form ref="loginForm" @modifyPasswordPaneCtr="modifyPasswordPaneCtr" />
      </div>
      <div v-if="showSmsLogin">
        <div class="header1">
          {{ $t('login.loginMode.SMSLogin') }}
          <span>{{ $t('login.SMSLoginTips') }}</span>
        </div>
        <sms-login-form />
      </div>
      <div v-if="this.openSocialLogin||this.openSmsLogin" class="header2">
        {{ $t('login.loginMode.OtherLogin') }}
        <span>{{ $t('login.loginMode.OtherLoginTips') }}</span>
      </div>
      <div>
        <ta-button v-if="this.openSmsLogin" style="float:left;font-size: 12px;border:none;" @click="showSmsLoginMethod">
          {{ showSmsLogin?$t('login.loginMode.userPwdLoginTips'):$t('login.loginMode.smsLoginTips') }}
        </ta-button>
        <div v-if="this.openSocialLogin" style="float: right">
          <social-list pass-state="1" />
        </div>
      </div>
    </div>

    <ta-modal
      :title="$t('login.changePassword')"
      :visible="showModifyPasswordPane"
      :footer="null"
      :mask-closable="false"
      :destroy-on-close="true"
      width="390px"
      :body-style="{paddingBottom:'10px'}"
      @cancel="modifyPasswordPaneCtr"
    >
      <modify-password :show.sync="showModifyPasswordPane" pass-state="1" />
    </ta-modal>

    <!--    </article>-->

    <footer>
      <span>{{ $t('login.explain') }}</span>
    </footer>
  </div>
</template>

<script>

import loginForm from './part/loginForm'
import modifyPassword from './part/modifyPassword'
import socialList from './part/socialList'
import smsLoginForm from './part/smsLoginForm'
import { mapGetters, } from 'vuex'

export default {
  name: 'login',
  components: { smsLoginForm, modifyPassword, loginForm, socialList, },
  data () {
    return {
      showModifyPasswordPane: false,
      showSocialList: true,
      showSmsLogin: false,
    }
  },
  computed: {
    ...mapGetters({
      openSocialLogin: 'openSocialLogin',
      openSmsLogin: 'openSmsLogin',
    }),
  },
  watch: {
    showModifyPasswordPane (value, old) {
      if (value === false) {
        this.$refs.loginForm.refreshCode()
      }
    },
  },
  created () {
    this.$store.dispatch('getSysCfg')
  },
  methods: {
    modifyPasswordPaneCtr () {
      this.showModifyPasswordPane = !this.showModifyPasswordPane
    },
    showSmsLoginMethod () {
      this.showSmsLogin = !this.showSmsLogin
    },

  },

}
</script>

<style scoped type="text/less" lang="less">

  .body {
    background: @primary-color;
    height: 100%;
  }

  header {
    padding: 50px 50px;
  }

  footer {
    width: 100%;
    position: fixed;
    bottom: 0px;
    text-align: center;

    span {
      width: 576px;
      height: 13px;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 90px;
      letter-spacing: 0px;
      color: #ffffff;
    }
  }

  .login-con {
    background: @body-background;
    border-radius: 2px;
    padding: 50px;
    width: 366px;
    box-sizing: border-box;
    position: absolute;
    right: 15%;
    top: 25%;

    .header1 {
      height: 60px;
      font-size: 24px;
      color: @text-color;

      > span {
        margin-left: 10px;
        font-size: 16px;
        color: @text-color-secondary;
      }
    }

    .header2 {
      height: 60px;
      font-size: 20px;
      color: @text-color;

      > span {
        margin-left: 10px;
        font-size: 12px;
        color: @text-color-secondary;
      }
    }

  }

</style>
