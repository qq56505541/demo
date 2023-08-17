<template>
  <div id="page-wrapper" class="page-wrapper">
    <ta-config-provider :get-popup-container="popupContainer" :locale="locale">
      <template v-if="isRouterAlive==='alive'">
        <keep-alive :include="tabList" :exclude="exList">
          <router-view :key="key" />
        </keep-alive>
      </template>
      <template v-else>
        <keep-alive v-if="isRouterAlive">
          <router-view />
        </keep-alive>
      </template>
    </ta-config-provider>
  </div>
</template>
<script type="text/jsx">
// 扩展另外的locale语言或修正/覆盖已有语言时的示例代码
// import demo from '../locales/UIExtendLocale/demo'

import { webStorage, merge, } from '@yh/ta-utils'

export default {
  name: 'routesContainer',
  props: {
    routesList: Array,
  },
  data () {
    const localeStorage = webStorage.createWebStorage(process.env.VUE_APP_LOCALE_STORAGE_KEY, { isLocal: true, })
    const localeName = localeStorage.get('locale') || window.faceConfig.defaultLocale
    const locales = require.context('@yh/ta404-ui/es/locale-provider', false, /\.\/[a-z][a-z]_[A-Z][A-Z]\.js/)
    const locale = locales(`./${localeName}.js`)?.default
    // 扩展另外的locale语言或修正/覆盖已有语言时的示例代码
    // if (localeName === 'demo') {
    //   locale = demo
    // }
    // 将本地的locale覆盖到默认locale中
    const localLocale = this.$i18n?.messages[localeName] ?? {}
    return {
      isRouterAlive: 'alive',
      reloadId: '',
      locale: merge(locale, localLocale),
      tabList: [],
      exList: [],
    }
  },
  computed: {
    // 刷新用
    key () {
      let key = ''
      if (this.$route.query._modulePartId_ === this.reloadId) {
        key = this.$route.query._modulePartId_ + new Date().getTime()
      } else {
        key = this.$route.query._modulePartId_
      }
      this.resetIdAndList()
      return key
    },
  },
  created () {
    this.$bus.on('refresh', this.reload)
    window.setIncludeTabList = () => {
      this.setTabList()
    }
  },
  beforeDestroy () {
    this.$bus.off('refresh', this.reload)
  },
  mounted () {
    // 设置message的容器为每个路由页面,解决同一路由下面报错切换页面后报错不隐藏
    // message.config({
    // getContainer:()=>{ return document.getElementById("page-wrapper").firstElementChild}
    // });

    // 更新tablist
    this.setTabList()
  },
  methods: {
    resetIdAndList () {
      this.reloadId = ''
      this.exList = []
    },
    reload (menuId, menuPart) {
      // 只刷新当前模块
      this.reloadId = menuId
      this.exList.push(menuPart)
      // this.$nextTick(() => {
      //   this.$set(this, 'exList', [])
      //   this.reloadId = ''
      // })

      // 该模块的同级模块都会刷新
      // this.isRouterAlive = false
      // this.$nextTick(() => {
      //   this.isRouterAlive = true
      // })
    },
    setTabList () {
      const cacheTabListStorage = TaUtils.webStorage.createWebStorage('Ta$cacheTabListStorage')
      const listModule = cacheTabListStorage.get('Ta$cacheTabListStorage')
      this.$set(this, 'tabList', listModule)
    },
    popupContainer (trigger) {
      // 单独处理el-tree的弹出父容器
      if (trigger?.classList?.contains('el-tree-node__label')) {
        return trigger?.parentNode
      }
      // 此处将page-wrapper的第一个子元素作为所有弹出框/窗口的容器
      return this.$el.childNodes[0]
    },
  },
}
</script>
<style scoped type="text/less">
    .page-wrapper {
        height: 100%;
    }
</style>
