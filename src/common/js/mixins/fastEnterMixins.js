// 表单页面enter换下一个输入框的
const fastEnterMixins = {
  mounted () {
    this.addEnterListener()
    // const item = this.findActiveItem()
    // if (item) { item.focus() }
  },
  destroy () {
    this.removeEnterListener()
  },
  methods: {
    addEnterListener () {
      if (window.__completeEnterBind__) return
      window.addEventListener('keydown', this.enterCallback)
      window.__completeEnterBind__ = true
    },
    removeEnterListener () {
      window.removeEventListener('keydown', this.enterCallback)
      window.__completeEnterBind__ = false
    },
    // 找到真实的自己
    findCon (el, clsList) {
      if (!el) return document.body
      for (let i = 0; i < clsList.length; i++) {
        if (this.hasClass(el, clsList[i]) && this.classFilter(el, clsList[i])) {
          return el
        }
      }
      return this.findCon(el.parentElement, clsList)
    },
    hasClass (node, className) {
      if (node.classList) {
        return node.classList.contains(className)
      }
      const originClass = node.className
      return ` ${originClass} `.indexOf(` ${className} `) > -1
    },
    classFilter (el, cls) {
      // 过滤出 日期框
      if (cls === 'ant-input') {
        if (this.hasClass(el, 'ant-calendar-picker-input')) {
          return false
        }
      }
      return true
    },
    // 获取当前容器后面的下一个容器
    findNextCon (curCon, cls) {
      const nodeList = document.querySelectorAll(cls)
      for (let i = 0; i < nodeList.length; i++) {
        if (curCon === nodeList[i]) {
          if (i + 1 < nodeList.length) {
            return nodeList[i + 1]
          } else {
            // 返回第一个form
            // return nodeList[0]
          }
        }
      }
    },
    // 获取下一个可激活的item
    findActiveItem (curC, curItem) {
      let curCon = curC
      if (!curCon) {
        curCon = document.querySelector('.ant-form')
      }
      const nodeList = curCon.querySelectorAll(this.activeNodeListC().join(','))
      if (curItem) {
        for (let i = 0; i < nodeList.length; i++) {
          if (curItem === nodeList[i]) {
            if (i + 1 < nodeList.length) {
              return nodeList[i + 1]
            }
          }
        }
      } else {
        return nodeList[0]
      }
    },
    activeNodeList () {
      return ['ant-calendar-picker',
        'ant-select',
        'ant-input',
        'ant-checkbox-input'
      ]
    },
    activeNodeListC () {
      return ['.ant-calendar-picker',
        '.ant-cascader-picker',
        '.ant-select:not(.ant-select-disabled):not(.ant-select-auto-complete)',
        '.ant-input:not(.ant-input-disabled):not(readonly)',
        '.ant-checkbox-input']
    },
    enterCallback (e) {
      if (e.keyCode === 13) {
        const curItem = this.findCon(document.activeElement, this.activeNodeList())
        const curCon = this.findCon(curItem, ['ant-form'])
        const nextItem = this.findActiveItem(curCon, curItem)
        console.log(nextItem)
        if (nextItem) {
          nextItem.focus()
          return
        }
        // 如果本form中已经是最后一个了那么转到下一个form中
        const nextForm = this.findNextCon(curCon, '.ant-form')
        if (nextForm) {
          const nxe = this.findActiveItem(nextForm)
          if (nxe) {
            nxe.focus()
          }
        }
      }
    },

  },

}
export default fastEnterMixins
