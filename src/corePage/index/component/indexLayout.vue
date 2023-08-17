<template>
  <div class="indexLayout">
    <header
      :style="{height: headerHeight, ...menuDisplayH}"
      :class="['header',`header--${state.headerTheme}`,`header--${state.menuType}`]"
    >
      <div class="logo" :style="[logoWidth, {lineHeight:headerHeight}]">
        <slot name="logo" />
      </div>
      <div class="collapse" @click="toggleCollapsed" v-if="state.menuType !== 'top' && state.menuType !== 'simple'  && state.menuType !== 'workTable'">
        <ta-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
      </div>
      <div>
        <slot name="topMenu" />
      </div>
      <div class="userInfo" :class="{'menu-top': state.menuType === 'top'}">
        <span
          :style="{height:headerHeight,lineHeight:headerHeight}"
          @click="guide"
        >
          <span class="step3"><ta-icon type="question-circle" />{{ $t('help.title') }}</span>
        </span>
        <span
          :style="{height:headerHeight,lineHeight:headerHeight}"
          @click="fullScreen"
          v-if="fullscreenVisible"
        >{{ pageSizeCtr? $t('screen.exitFullScreen') : $t('screen.fullScreen') }}</span>
        <span :style="{height:headerHeight,lineHeight:headerHeight}" @click="visible = true">
          <ta-icon type="message" />{{ $t('news.newsTitle') }}<ta-badge
            :count="noticeNum"
            style="height:45px"
            :number-style="{boxShadow: '0 0 0 1px #d9d9d9 inset'}"
          /></span>
        <msg-list :visible.sync="visible" :notice-num.sync="noticeNum" @close="visible = false" />
        <span class="userPaneBar" :style="{height:headerHeight,lineHeight:headerHeight}" @click="showUserInfo">
          <span class="step1">
            <ta-icon type="user" />
            {{ state.userInfo.userName }}
          </span>
        </span>
      </div>
    </header>
    <slot name="userInfo" />
    <div class="content" :style="{top:headerHeight, paddingLeft: state.menuType !== 'top' ? leftWidth: 0}">
      <div
        :class="[`leftCon`,`leftCon--${state.leftTheme}`]"
        :style="{width:leftWidth, paddingTop:tabHeight, ...menuDisplayV}"
        v-if="state.menuType !== 'top'"
      >
        <div
          :class="[`leftConHeader`,`leftConHeader--${state.leftTheme}`]"
          v-if="!collapsed"
          :style="{height:tabHeight,lineHeight:tabHeight}"
        >
          <span v-if="!showStore" class="searchPaneBar" :class="{active:ifSearchPane}">
            <input
              :placeholder="$t('search.search')"
              type="text"
              v-model="seValue"
              @keyup.enter="searchMenuListHandle($event)"
            >
            <ta-icon
              class="search"
              :type="ifSearchPane? 'close': 'search'"
              @click="searchPaneBarHandle"
            />
          </span>
          <span class="store step2" :class="{active:showStore}">
            <ta-icon
              :type="showStore===false?'star':'menu-unfold'"
              @click="()=>{this.showStore=!this.showStore}"
            />
            <span v-if="showStore">{{ $t('search.favorites') }}</span>
          </span>
        </div>
        <div class="leftConContent">
          <slot name="leftMenu" />
          <slot name="searchPane" v-if="ifSearchPane" />
          <slot name="commonMenu" v-if="showStore" />
        </div>
      </div>
      <div class="dragBar" :style="{left:leftWidth}" v-if="state.menuType !== 'top'" />
      <div class="centerCon" :style="{paddingTop:tabHeight}">
        <div class="tabsCon" :style="{height:tabHeight}">
          <slot name="tabs" />
        </div>
        <div class="iframesCon">
          <slot name="iframes" />
        </div>
        <div v-if="state.menuType === 'workTable'" class="workTableType">
          <div class="close-bg left" @click="toggleWorktable('vertical')">
            <ta-icon :type="workTableMenu.vertical? 'step-backward' : 'step-forward'" />
          </div>
          <div class="close-bg top" @click="toggleWorktable('horizon')">
            <ta-icon :type="workTableMenu.horizon? 'step-backward' : 'step-forward'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, } from 'vuex'
import msgList from './user/msgList'
import Driver from '@yh/ta404-ui/es/driver'
import '@yh/ta404-ui/es/driver/style'

export default {
  name: 'indexLayout',
  data () {
    return {
      // fullscreenVisible: !TaUtils.isIE(),
      fullscreenVisible: false,// f11和按钮显示不兼容 不能同步就不展示了
      pageSizeCtr: false,
      seValue: '',
      visible: false,
      tabHeight: '40px',
      noticeNum: 0,
      showStore: false,
      driver: null,
    }
  },
  components: { msgList, },
  computed: {
    ...mapGetters({
      state: 'getStateValue',
      collapsed: 'getCollapsed',
      getHeaderHeight: 'getHeaderHeight',
    }),
    logoWidth () {
      const { leftCloseWidth, logoWidth, menuType, } = this.state
      let width = logoWidth
      if (menuType !== 'top' && menuType !== 'simple') {
        if (this.collapsed) {
          width = leftCloseWidth
        }
      }
      return { width: width, minWidth: width, }
    },
    leftWidth () {
      const { leftCloseWidth, leftWidth, menuType, workTableMenuVertical  } = this.state
      if (menuType === 'workTable') {
        return workTableMenuVertical ? leftWidth : '0px'
      } else {
        return this.collapsed ? leftCloseWidth : leftWidth
      }
    },
    headerHeight () {
      const { menuType, workTableMenuHorizon } = this.state
      if (menuType === 'workTable') {
        return workTableMenuHorizon ? this.getHeaderHeight : '0px'
      } else {
        return this.getHeaderHeight
      }
    },
    ifSearchPane () {
      return this.state.ifSearchPane
    },
    workTableMenu () {
      return {
        vertical: this.state.workTableMenuVertical,
        horizon: this.state.workTableMenuHorizon,
      }
    },
    menuDisplayH () {
      const { menuType } = this.state
      const { horizon } = this.workTableMenu
      if (menuType === 'workTable') {
        return {
          display: horizon ? '' : 'none'
        }
      }  else {
        return {}
      }
    },
    menuDisplayV () {
      const { menuType } = this.state
      const { vertical } = this.workTableMenu
      if (menuType === 'workTable') {
        return {
          display: vertical ? '' : 'none'
        }
      }  else {
        return {}
      }
    },
  },
  mounted () {
    this.driver = new Driver({
      allowClose: false,
    })
    // this.guide()
  },
  methods: {
    searchMenuListHandle (e) {
      const value = e.target.value.trim()
      if (this.state.searchValue !== value) {
        this.$store.dispatch('setStateValue', { searchValue: value, })
      }
      this.$store.dispatch('setStateValue', { ifSearchPane: true, })
    },
    searchPaneBarHandle () {
      this.$store.dispatch('setStateValue', { ifSearchPane: !this.ifSearchPane, })
    },
    toggleCollapsed () {
      this.$store.dispatch('setStateValue', { collapsed: !this.collapsed, })
    },
    showUserInfo () {
      this.$store.dispatch('setStateValue', { showUserInfo: true, })
    },
    toggleWorktable (type) {
      this.$store.dispatch('setStateValue', { workTableMenuVertical: !this.workTableMenu.vertical, })
      if (type === 'horizon') {
        let temp = !this.workTableMenu.horizon
        this.$store.dispatch('setStateValue', { workTableMenuHorizon: temp, })
        this.$store.dispatch('setStateValue', { workTableMenuVertical: temp, })
      }
    },
    // 全屏显示控制
    fullScreen () {
      if (this.pageSizeCtr === true) {
        this.pageSizeCtr = false
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else {
          if (document.msExitFullscreen) {
            document.msExitFullscreen()
          } else {
            if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen()
            } else {
              if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen()
              }
            }
          }
        }
      } else {
        this.pageSizeCtr = true
        const d = document.documentElement
        if (d.requestFullscreen) {
          d.requestFullscreen()
        } else {
          if (d.msRequestFullscreen) {
            d.msRequestFullscreen()
          } else {
            if (d.mozRequestFullScreen) {
              d.mozRequestFullScreen()
            } else {
              if (d.webkitRequestFullScreen) {
                d.webkitRequestFullScreen()
              }
            }
          }
        }
      }
    },
    guide () {
      const helpList = this.$t('help')
      const steps = [
        {
          element: '.step1',
          popover: {
            title: helpList.step1Title,
            description: helpList.step1Desc,
            position: 'left',
          },
        },
        {
          element: '.step2',
          popover: {
            title: helpList.step2Title,
            description: helpList.step2Desc,
            position: 'right',
          },
        },
        {
          element: '.step3',
          popover: {
            title: helpList.step3Title,
            description: helpList.step3Desc,
            position: 'bottom',
          },
        }
      ]
      this.driver.defineSteps(steps)
      this.driver.start()
    },
  },
}
</script>
<style scoped type="text/less" lang="less">
  @import "~@yh/ta404-ui/es/style/themes/default";

  .indexLayout {
    height: 100%;
    position: relative;
  }

  .header {
    width: 100%;
    white-space: nowrap;
    display: table;
    box-sizing: border-box;
    min-width: 600px;
    .user-select();

    > div {
      display: table-cell;
      vertical-align: middle;

      &.collapse {
        width: 60px;
        min-width: 60px;
        text-align: center;
        cursor: pointer;
      }

      &.logo {
        background-color: @primary-color;
        text-align: center;
        color: #fff;
        vertical-align: top;
        box-sizing: border-box;
      }

      &.userInfo {
        width: 200px;
        padding-right: 20px;

        > span {
          vertical-align: top;
          padding: 0px 10px;
          display: inline-block;
          font-size: 12px;
          cursor: pointer;
          .text-overflow();
          .user-select();
          i {
            margin-right: 8px;
            font-size: 14px;
          }
        }

      }
    }

    &--light {
      background-color: #fff;

      > div {
        &.collapse:hover {
          background-color: rgba(0, 0, 0, 0.025);
          color: @primary-color;
        }

        &.userInfo {
          > span:hover {
            color: @primary-color;
          }
        }
      }
    }

    &--base {
      background: @primary-color;
      color: #ffffff;

      > div {
        &.collapse:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.2);
        }

        &.userInfo {
          > span:hover {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.2);
          }

          background: @primary-color;
          color: #ffffff;
        }

      }

    }
  }

  .dragBar {
    height: 100%;
    width: 8px;
    cursor: w-resize;
    position: absolute;
    opacity: 0;
  }

  .content {
    width: 100%;
    position: absolute;
    left: 0px;
    bottom: 0px;
    right: 0px;
    padding: 0px;
    box-sizing: border-box;
    margin: 0px;
    overflow: hidden;
    transition: all 0.3s;

    .leftCon {
      position: absolute;
      top: 0px;
      left: 0px;
      bottom: 0px;
      box-sizing: border-box;
      z-index: 1;
      background-color: #001529;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: bottom left;
      .user-select();
      transition: all 0.3s;

      &--dark {
        background-color: @menu-dark-bg;
      }
      &--base {
        background-color: @menu-base-bg;
      }
      &--light {
        background-color: @menu-bg;
        border-right:1px solid @border-color-split;
      }

      .leftConHeader {
        position: absolute;
        top: 0px;
        width: 100%;
        overflow: hidden;

        .searchPaneBar {
          display: inline-block;
          height: 100%;
          cursor: pointer;
          width: calc(100% - 45px);
          box-sizing: border-box;
          padding-left: 10px;
          overflow: hidden;
          white-space: nowrap;

          > input {
            width: calc(100% - 20px);
            height: 26px;
            line-height: 26px;
            padding: 0px 10px;
            box-sizing: border-box;

            border-radius: 2px;
            border: none;
            outline: none;
            color: rgba(255, 255, 255, 0.5);
            &::-webkit-input-placeholder {
              font-size: 14px;
            }
          }

          .search {
            opacity: 0.6;
            font-size: 14px;
            cursor: pointer;
            margin-left: 5px;
          }
        }

        .store {
          width: 45px;
          display: inline-block;
          height: 100%;
          vertical-align: top;
          text-align: center;

          > i {
            opacity: .5;
            cursor: pointer;

            &:hover {
              opacity: 1;
            }
          }

          &.active {
            > i {
              position: absolute;
              display: inline-block;
              height: 100%;
              left: 10px;
              line-height: inherit;
            }

            width: 100%;
          }
        }

        .step2.driver-highlighted-element .anticon-star{
          color: @primary-color;
          opacity: 1;
        }

        &--dark {
          background-color: @menu-dark-bg;
          border-bottom: 1px solid @menu-dark-bg;
          color: @menu-dark-color;
          .searchPaneBar{
            >input{
              background-color: rgba(255, 255, 255, 0.13);
              &::-webkit-input-placeholder {
                color: rgba(255, 255, 255, 0.29);
              }
            }
          }
        }
        &--base{
          background-color: @menu-base-bg;
          border-bottom: 1px solid @menu-base-bg;
          color: @menu-base-color;
          .searchPaneBar{
            >input{
              background-color: rgba(255, 255, 255, 0.13);
              &::-webkit-input-placeholder {
                color: rgba(255, 255, 255, 0.29);
              }
            }
          }
        }
        &--light{
          background-color: @menu-bg;
          border-bottom: 1px solid @border-color-split;
          color:@menu-highlight-color;
          .searchPaneBar{
            >input{
              border-radius: 4px;
              border:1px solid @border-color-base;
              color: @text-color;
              &:focus{
                border-color: @menu-highlight-color;
                box-shadow: @input-outline-offset @outline-blur-size 2px fade(@outline-color, 20%);
              }
              &::-webkit-input-placeholder {
                color: @input-placeholder-color;
              }
            }
          }
        }

      }

      .leftConContent {
        width: 100%;
        height: 100%;
        position: relative;
      }
    }

    .centerCon {
      width: 100%;
      position: relative;
      height: 100%;
      box-sizing: border-box;

      > div {
        width: 100%;
      }

      .tabsCon {
        top: 0px;
        position: absolute;
      }

      .iframesCon {
        height: 100%;
        position: relative;
      }
    }
  }
  .driver-highlighted-element {
    &.step1, &.step3 {
      color: @text-color;
    }
  }

  .workTableType {
    .close-bg {
      background: @primary-5;
      color: #fff;
      padding: 2px 3px;
      cursor: pointer;
      transition: all 0.3s;
      position: absolute;
      &:hover {
        background: @primary-6;
      }
      &.left {
        left: 0;
        bottom: 120px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      &.top {
        right: 6px;
        top: 37px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        transform: rotate(90deg);
      }
    }
  }
</style>
