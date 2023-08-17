<template>
  <ta-drawer
    :visible="state.showUserInfo"
    destroy-on-close
    width="300px"
    wrap-class-name="user-menu"
    @close="onClose"
  >
    <div class="user-info">
      <div class="person-head">
        <img
          :alt="userInfo.userName"
          :src="userAvatar"
          @error="userAvatar = require('../../img/person-head.png')"
        >
      </div>
      <div>
        <div class="user-name">
          {{ userInfo.userName }}
        </div>
        <div class="user-position">
          {{ userInfo.mainRoleName }}
        </div>
      </div>
    </div>
    <div class="menu-item">
      {{ $t('user.signIn') }}
    </div>
    <div v-if="sysInfo.openSocialLogin||sysInfo.openSmsLogin" class="menu-item" @click="socialBinding = !socialBinding; changePwd=false" :class="{'active': socialBinding}">
      {{ $t('user.accountAssociation') }}
    </div>
    <div class="user-panel" v-if="socialBinding">
      <social-binding @close="socialBinding = false" />
    </div>
    <div class="menu-item" @click="changePwd = !changePwd, socialBinding= false" :class="{'active': changePwd}">
      {{ $t('user.changePassword') }}
    </div>
    <div class="user-panel" v-if="changePwd">
      <img src="../../img/user-pw-bg.png" style="width: 100%">
      <modify-password @close="changePwd = false" />
    </div>
    <!-- 在线换肤 -->
    <div class="menu-item" v-if="onlineTheme && !isIE">
      {{ $t('user.changeTheme') }}
      <ul class="menu-color">
        <li
          v-for="(item, key, index) in colorList"
          :key="index"
          :style="{'background-color': item['primary-color']}"
          @click="themeChange(key)"
          :class="{'active': key === colorDefault}"
        />
        <ta-tooltip style="height: 20px;padding:0;margin: 0;width: 20px;">
          <template slot="title">
            <span>{{ $t('user.customColors') }}</span>
          </template>
          <ta-popover trigger="click" style="height: 20px;padding:0;margin: 0;width: 20px;">
            <ta-color-picker v-model="colorPicker" @change="changeColor" />
            <ta-button class="rainbow" slot="reference" style="height: 20px;padding:0;margin: 0;width: 20px;" />
          </ta-popover>
        </ta-tooltip>
      </ul>
    </div>
    <!-- 暗黑模式 -->
    <div class="menu-item" v-if="onlineTheme && !isIE">
      {{ $t('user.darkMode') }}
      <ul class="menu-color">
        <ta-switch @change="changeDarkMode" :default-checked="darkModeChecked" />
      </ul>
    </div>
    <div class="menu-item">
      {{ $t('user.language') }}
      <ta-select class="" @select="onLocaleSelect" :default-value="defaultLocale">
        <ta-select-option v-for="(item, key) in localeList" :key="key">
          {{ item }}
        </ta-select-option>
      </ta-select>
    </div>
    <div class="menu-item">
      {{ $t('user.navigationMode') }}
      <ul class="menu-mode">
        <li
          v-for="(item, index) in modeList"
          :key="index"
          :style="{'background-image': 'url('+ require('../../img/' + item + '.png') +')'}"
          @click="modeChange(item)"
          :class="{'active': item === state.menuType}"
          :title="modeListCN[index]"
        />
      </ul>
    </div>
    <div class="btn-logout">
      <ta-button block @click="logout()">
        {{ $t('user.exit') }}
      </ta-button>
    </div>
  </ta-drawer>
</template>
<script>
import modifyPassword from './modifyPassword'
import socialBinding from './socialBinding'
import { mapGetters, } from 'vuex'
import colorList from '@/style/theme.js'
import faceConfig from 'faceConfig'
import localeList from 'common/locales/locale'
import { webStorage, isIE, } from '@yh/ta-utils'

const modeList = ['left', 'top', 'leftTop', 'simple', 'workTable']
const modeListCN = ['左', '上', '左上', '极简', '工作台']

export default {
  name: 'UserMenu',
  components: { modifyPassword, socialBinding, },
  data () {
    this.themeStorage = TaUtils.webStorage.createWebStorage('index_theme', { isLocal: true, })
    let darkMode
    let defaultTheme
    if (!TaUtils.isIE()) {
      darkMode = this.themeStorage.get('dark_mode')
      defaultTheme = this.themeStorage.get('index_theme')
    } else {
      darkMode = localStorage.dark_mode
      defaultTheme = localStorage.index_theme
    }
    return {
      changePwd: false,
      colorList,
      localeList,
      defaultLocale: process.env.VUE_APP_DEFAULT_LOCALE,
      modeList,
      modeListCN,
      themeStorage: null,
      modeStorage: null,
      localeStorage: null,
      socialBinding: false,
      userAvatar: '',
      // 是否启用在线换肤
      onlineTheme: faceConfig.onlineTheme,
      // 默认主题
      colorDefault: defaultTheme ?? faceConfig.defaultTheme,
      // 是否启用暗黑模式（需要dark-mode.less添加样式进行支持）
      darkModeChecked: darkMode ?? faceConfig.defaultDarkMode,
      colorPicker: defaultTheme?.indexOf('#') === 0 ? defaultTheme : '',
      isIE: isIE(),
    }
  },
  created () {
    this.themeStorage = TaUtils.webStorage.createWebStorage('index_theme', { isLocal: true, })
    this.modeStorage = TaUtils.webStorage.createWebStorage('index_mode', { isLocal: true, })
    this.localeStorage = webStorage.createWebStorage(process.env.VUE_APP_LOCALE_STORAGE_KEY, { isLocal: true, })
    this.defaultLocale = this.localeStorage.get('locale') ?? faceConfig.defaultLocale
    this.userAvatar = this.userInfo.avatar ? (this.userInfo.avatar.length === 0 ? require('../../img/' + this.userInfo.userImg) : this.userInfo.avatar) : require('../../img/' + this.userInfo.userImg)
  },
  computed: {
    ...mapGetters({
      state: 'getStateValue',
    }),
    userInfo () {
      return this.state.userInfo
    },
    sysInfo () {
      return this.$store.state.indexStore.sysInfo
    },
  },
  methods: {
    onClose () {
      this.$store.dispatch('setStateValue', { showUserInfo: false, })
      this.changePwd = false
    },
    /**
     * 设置在线换肤
     */
    themeChange (value) {
      this.changePwd = false
      this.colorDefault = value
      if (!TaUtils.isIE()) {
        this.themeStorage.set('index_theme', value)
      } else {
        localStorage.index_theme = value
      }
      this.changeTheme(value)
      this.$message.success(this.$t('user.changeThemeSuccess'))
    },
    changeColor () {
      this.themeChange(this.colorPicker)
    },
    /**
     * 设置暗黑模式
     * @param checked
     */
    changeDarkMode (checked) {
      this.changePwd = false
      this.darkModeChecked = checked
      if (!TaUtils.isIE()) {
        this.themeStorage.set('dark_mode', checked)
      } else {
        localStorage.dark_mode = checked
      }
      this.updateColorWeak(checked)
      this.$message.success(this.$t('user.changeThemeSuccess'))
    },
    onLocaleSelect (value) {
      this.localeStorage.set('locale', value)
      // this.$i18n.locale = value
      // this.defaultLocale = value
      window.location.reload()
    },
    modeChange (type) {
      this.changePwd = false
      if (!this.modeStorage) {
        this.modeStorage = TaUtils.webStorage.createWebStorage('index_mode', { isLocal: true, })
      }
      this.$store.dispatch('setStateValue', { workTableMenuVertical: false})
      this.$store.dispatch('setStateValue', { workTableMenuHorizon: false })
      this.modeStorage.set('mode', type)
      this.$store.dispatch('setStateValue', { menuType: type, })
      this.$message.success(this.$t('user.switchMode'))
    },
    // 退出登录
    logout () {
      this.Base.submit(null, {
        url: '/logout',
        frontUrl: top.window.location.href,
      }).then((data) => {
        TaUtils.setCookie(faceConfig.basePath + 'TA-JTOKEN', '', -1, '/')
        TaUtils.setCookie(faceConfig.basePath + 'TA-RJTOKEN', '', -1, '/')
        TaUtils.setCookie('ALIPAYJSESSIONID', '', -1, '/')
        const date = new Date()
        date.setTime(date.getTime())
        const expires = '; expires=' + date.toGMTString()
        document.cookie = 'ALIPAYJSESSIONID=' + expires + '; domain=alipay.com; path=/'
        if (this.userInfo.isSSO === 'false') {
          window.location.href = 'login.html'
        } else {
          top.window.location.href = data.redirectUrl || 'login.html'
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    rainbowPopover () {

    },
  },
}
</script>
<style lang="less" type="text/less">
  .user-menu {
    .ant-drawer-body {
      padding: 24px 0;
    }
  }
</style>
<style lang="less" scoped type="text/less">
  .user-info {
    padding: 0 24px;
    margin-bottom: 25px;

    &:after {
      content: "";
      display: block;
      clear: both;
    }

    > div {
      float: left;

      &:first-child {
        width: 60px;
        height: 60px;

        > img {
          width: 100%;
          height: 100%;
        }
      }

      &:last-child {
        > div {
          &:first-child {
            font-size: 18px;
            padding-top: 10px;
            margin-left: 10px;
          }

          &:last-child {
            color: @success-color;
            margin: 5px 0px 0px 10px;
          }
        }
      }
    }
  }

  .menu-item {
    padding: 10px 24px;
    cursor: pointer;
    position: relative;
    border-left: 3px solid @body-background;

    &:after {
      content: "";
      display: block;
      border-bottom: 1px solid @border-color-base;
      width: 252px;
      position: absolute;
      bottom: 0px;
    }

    &:hover {
      background: @background-color-light;
      border-left: 3px solid @primary-color;
    }

    &.active {
      border-left: 3px solid @primary-color;
    }

    .menu-color {
      list-style-type: none;
      margin: 10px 0 0;
      padding: 0;
      height: 20px;

      & > li {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 2px;
        margin-right: 5px;
        vertical-align: top;
        text-align: center;

        &.active:after {
          content: '';
          display: block;
          width: 20px;
          height: 20px;
          content: url("data:image/svg+xml;charset=utf-8,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Cpath d='M896 213.34q18.33 0 30.495 12.165T938.66 256q0 18.002-12.33 30.33l-512 512q-12.328 12.33-30.33 12.33t-30.33-12.33l-256-256Q85.34 530.003 85.34 512q0-18.33 12.165-30.495T128 469.34q18.002 0 30.33 12.33L384 707.665l481.67-481.997Q877.997 213.34 896 213.34z' fill='%23fff'/%3E%3C/svg%3E");
          background-position: center;
          background-size: 14px;
          background-repeat: no-repeat;
        }
      }
    }

    .menu-mode {
      list-style-type: none;
      margin: 10px 0 0;
      padding: 0;
      height: 39px;

      & > li {
        display: inline-block;
        width: 40px;
        height: 32.5px;
        margin-right: 8px;
        vertical-align: top;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;

        &.active:after {
          content: '';
          display: block;
          width: 48px;
          height: 39px;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Cpath d='M896 213.34q18.33 0 30.495 12.165T938.66 256q0 18.002-12.33 30.33l-512 512q-12.328 12.33-30.33 12.33t-30.33-12.33l-256-256Q85.34 530.003 85.34 512q0-18.33 12.165-30.495T128 469.34q18.002 0 30.33 12.33L384 707.665l481.67-481.997Q877.997 213.34 896 213.34z' fill='%23001529'/%3E%3C/svg%3E");
          background-position: center;
          background-size: 14px;
          background-repeat: no-repeat;
        }
      }
    }
  }

  .btn-logout {
    margin: 50px 24px 0;
  }

  .user-panel {
    position: absolute;
    width: 300px;
    height: 100%;
    right: 300px;
    top: 0px;
    overflow: auto;
    z-index: 9999;
    background: @body-background;
    box-shadow: @box-shadow-base;
    .beautifyScrollbar();
  }
  .rainbow{
    background:linear-gradient(45deg,#ff0000 0%,#ff0000 11%,
    #ffb600 11%,#ffb600 22%,
    #fff600 22%,#fff600 33%,
    #a5ff00 33%,#a5ff00 44%,
    #00a9ff 44%,#00a9ff 55%,
    #0400ff 55%,#0400ff 66%,
    #8a00fc 66%,#8a00fc 77%,
    #ff00e9 77%,#ff00e9 88%,
    #ff0000 88%,#ff0000 100%);
  }
</style>
