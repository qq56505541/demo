<template>
  <div id="app">
    <index-layout ref="indexLayout">
      <div
          slot="logo"
          class="logo-image"
          :title="showLogoTitle ? '' : indexStore.logoTitle"
          :class="{'logo-collapse': !showLogoTitle}"
          :style="{backgroundImage: 'url(' + require('./img/' + indexStore.logoImage) + ')'}">
        <span v-if="showLogoTitle">{{ indexStore.logoTitle }}</span>
      </div>
      <!--顶部菜单-->
      <menu-horizon slot="topMenu" v-show="indexStore.menuType !== 'left'"></menu-horizon>
      <!--左侧菜单-->
      <menu-vertical slot="leftMenu"></menu-vertical>
      <search-pane slot="searchPane"></search-pane>
      <common-menu slot="commonMenu"></common-menu>
      <index-tab slot="tabs" ref="indexTab"></index-tab>
      <iframe-list slot="iframes"></iframe-list>
      <user-menu slot="userInfo" ref="userMenu"></user-menu>
    </index-layout>
    <div id="popCon"></div>
  </div>
</template>
<script>
import indexLayout from './component/indexLayout'
import MenuHorizon from './component/menu/menuHorizon'
import MenuVertical from './component/menu/menuVertical'
import searchPane from './component/menu/searchPane'
import commonMenu from './component/menu/commonMenu'
import IndexTab from './component/menu/indexTab'
import IframeList from './component/menu/iframeList'
import UserMenu from './component/user/userMenu'
import indexTool from './js/indexTools'

export default {
  name: 'index',
  components: {
    UserMenu,
    IframeList,
    IndexTab,
    MenuVertical,
    MenuHorizon,
    indexLayout,
    searchPane,
    commonMenu,
  },
  created () {
    // 获取用户信息
    this.$store.dispatch('setUserInfo')
    // 获取系统信息
    this.$store.dispatch('setSysInfo')
    // 获取menu 常用菜单
    this.Base.submit(null, {
      url: 'menu/menuAction/queryRootChildrenMenus',
    }).then((data) => {
      let menuList = []
      let commonMenuList = []
      menuList = data?.data?.menus?.children || []
      commonMenuList = data?.data?.commonMenuList || []

      this.$store.dispatch('loadMenuList', { menuList: menuList, })
      this.$store.dispatch('setStateValue', { commonMenuList: commonMenuList, })
    }).catch(() => {
      this.$store.dispatch('loadMenuList', { menuList: [], })
      this.$store.dispatch('setStateValue', { commonMenuList: [], })
    })
    // 获取权限信息
    this.$store.dispatch('setAuthority')
    const modeStorage = TaUtils.webStorage.createWebStorage('index_mode', { isLocal: true, })
    this.$store.dispatch('setStateValue', { menuType: modeStorage.get('mode') || this.indexStore.menuType, })
  },
  computed: {
    indexStore () {
      return this.$store.state.indexStore
    },
    showLogoTitle () {
      const { menuType, collapsed, } = this.indexStore
      return menuType === 'simple' || menuType === 'workTable' || menuType === 'top' ? true : !collapsed
    },
  },
  mounted () {
    // ie9 不存在history.pushState
    // TODO:引入html5.js保证一致体验
    if (history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL)
      })
    }
    window.indexTool = indexTool(this)
  },
}
</script>
<style scoped type="text/less" lang="less">
#app {
  height: 100%
}

.logo-image {
  width: 100%;
  height: 100%;
  background-size: 40px 40px;
  box-sizing: border-box;
  background-position: 5px center;
  background-repeat: no-repeat;
  color: #ffffff;
  padding-left: 50px;
  text-align: left;
  font-size: 20px;
}

.logo-collapse {
  background-position: center;
  padding-left: 0px;
}
</style>
