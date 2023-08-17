const closeCallbackMixins = {
  data () {
    return {
      pageModuleId: '',
    }
  },
  created () {
    this.pageModuleId = this.$route.query._modulePartId_
    this.$bus.on('closeTabCallBack', this.closeTabCallBackFn)
  },
  methods: {
    closeTabCallBackFn (menu) {
      if (menu.partId === this.pageModuleId) {
        if (typeof this.closeTabCallBack === 'function') {
          this.closeTabCallBack(menu)
        } else {
          this.Base.closeTabMenu({ id: this.pageModuleId, force: true, })
        }
      } else {

      }
    },

  },
  beforeDestroy () {
    this.$bus.off('closeTabCallBack', this.closeTabCallBackFn)
  },

}

export default closeCallbackMixins
