<template>
  <div ref="iframeCon" class="iframeList">
    <ta-page-tool v-if="isPageTool" :is-move="true" :tool-menu="toolMenu" :is-refresh="false" />
    <iframe
      :id="worktable.id"
      :style="worktableShow ? '' : 'display:none'"
      :src="worktable.src"
      frameborder="none"
      scrolling="auto"
    />
  </div>
</template>
<script>
import { mapGetters, } from 'vuex'

export default {
  name: 'iframeList',
  data () {
    return {
      src: '',
      CacheWebStorage: null,
      cacheTabListStorage: null,
      toolMenu: [{
        icon: 'rocket',
        name: this.$t('refresh.refreshAll'),
        onClick: () => {
          this.CacheWebStorage.cleanData()
          window.location.reload()
        },
      }, {
        icon: 'sync',
        name: this.$t('refresh.refreshPage'),
        onClick: () => {
          top.indexTool.reload()
        },
      }, {
        icon: 'question-circle',
        name: this.$t('refresh.help'),
        onClick: () => {
          sendMessage(this.activeTab.module, 'fnPageGuide')
          const hasGuide = document.getElementById(this.activeTab.module).contentWindow.fnPageGuide
          if (typeof hasGuide !== 'function') {
            this.$message.info('该页面暂无帮助导航')
          }
        },
      }],
      iframeList: {},
      worktableShow: true,
    }
  },
  created () {
    this.CacheWebStorage = TaUtils.webStorage.createWebStorage('Ta$CacheStorage')
    this.cacheTabListStorage = TaUtils.webStorage.createWebStorage('Ta$cacheTabListStorage')
  },
  computed: {
    ...mapGetters({
      tabList: 'getTabMenuList',
      activeTab: 'getActiveIframe',
      state: 'getStateValue',
    }),
    isPageTool () {
      const { notPageTool, } = this.state
      /* faceConfig.js 中配置的菜单不显示 */
      return notPageTool.indexOf(this.activeTab.module) === -1 && notPageTool.indexOf(this.activeTab.partId) === -1
    },
    worktable () {
      const { worktable, } = this.state
      const cg = {
        ...worktable,
        partId: 'worktable',
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.iframeList[this.createId(cg)] = cg
      return {
        id: this.createId(cg),
        src: this.createSrc(cg),
      }
    },
  },
  methods: {
    createIframe (menu) {
      const iframe = document.createElement('iframe')
      iframe.setAttribute('frameBorder', 'none')
      iframe.setAttribute('frameBorder', '0')
      iframe.setAttribute('scrolling', 'auto')
      iframe.id = this.createId(menu)
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      const src = this.createSrc(menu)
      iframe.setAttribute('src', src)
      return iframe
    },
    createSrc (menu) {
      let src = ''
      let _modulePartId_ = ''
      src = this.createId(menu) + '#/' + menu.part
      _modulePartId_ = '_modulePartId_=' + menu.partId
      if (src.indexOf('?') > -1) {
        src += '&' + _modulePartId_
      } else {
        src += '?' + _modulePartId_
      }
      if (menu.params) {
        src += '&' + menu.params
      }
      return src
    },
    createId (menu) {
      return menu.prefix + menu.module
    },
    hideIframe (menu) {
      if (menu.id === 'worktable') {
        this.worktableShow = false
        return
      }
      const el = document.getElementById(this.createId(menu))
      if (el) {
        el.style.display = 'none'
      }
    },
    showIframe (menu) {
      if (menu.id === 'worktable') {
        this.worktableShow = false
        return
      }
      const el = document.getElementById(this.createId(menu))
      const src = this.createSrc(menu)
      el.setAttribute('src', src)
      if (el) {
        el.style.display = 'block'
      }
    },
    menuToModule (menu) {
      if (menu.url) {
        return {
          partId: menu.id,
          module: menu.url.split('#/')[0],
          part: menu.url.split('#/')[1] || '',
          params: menu.params || '',
          prefix: menu.prefix || this.state.srcPrefix,
        }
      } else {
        return {
          module: '404.html',
          part: '',
          partId: 'ta404',
          prefix: menu.prefix || this.state.srcPrefix,
        }
      }
    },
    deleteIframe (list) {
      list.map((item) => {
        if (this.iframeList[item] && this.iframeList[item].partId !== 'worktable') {
          delete this.iframeList[item]
          const el = document.getElementById(item)

          if (el) {
            el.parentNode.removeChild(el)
          }
        }
      })
    },
  },
  watch: {
    activeTab (nowTab, oldTab) {
      const mdId = this.createId(nowTab)
      if (this.iframeList[mdId]) {
        this.showIframe(nowTab)
        this.iframeList[mdId] = { ...nowTab, }
        if (oldTab.module !== nowTab.module) sendMessage(nowTab.module, 'loadCachedRouter')
      } else {
        this.iframeList[mdId] = { ...nowTab, }
        this.createIframe(nowTab)
        this.$refs.iframeCon.appendChild(this.createIframe(nowTab))
      }
      if (mdId === this.createId(oldTab)) {
        //
      } else {
        this.hideIframe(oldTab)
      }
    },
    tabList (list) {
      // 不在tablist中的iframe 应该删除
      const iList = Object.keys(this.iframeList)
      const listModule = []
      const listObj = []
      const tabL1 = list.map((item) => {
        const m = this.menuToModule(item)
        listModule.push(m.part)
        listObj.push(m)
        return this.createId(m)
      })
      const tabL2 = [...new Set(tabL1)]
      const arr = iList.filter(item => tabL2.indexOf(item) < 0)

      this.deleteIframe(arr)
      // 不在tablist中的模块应该换成同html页面的另一个模块(src)
      for (let i = 0; i < iList.length; i++) {
        const item = iList[i]
        if (listModule.length > 0 && this.iframeList[item] && this.iframeList[item].partId !== 'worktable' && listModule.indexOf(this.iframeList[item].part) < 0) {
          listObj.forEach((itm) => {
            if (itm.module === item) {
              // this.iframeList[item]=itm;
              this.$set(this.iframeList, item, itm)
              const el = document.getElementById(item)
              if (el) {
                el.setAttribute('src', this.createSrc(itm))
              }
              return false
            }
          })
        }
      }

      // 存储list
      this.cacheTabListStorage.set('Ta$cacheTabListStorage', listModule)
      for (let i = 0; i < tabL2.length; i++) {
        sendMessage(tabL2[i], 'setIncludeTabList')
      }
    },
  },
}
</script>
<style scoped lang="less" type="text/less">
  .iframeList {
    width: 100%;
    height: 100%;
    .user-select();
  }

  iframe {
    width: 100%;
    height: 100%;
  }
</style>
