const indexTools = (indexObj) => {
  // 获取当前登录人员信息
  function getUserInfo () {
    return indexObj.$store.state.indexStore.userInfo
  }

  // 获取菜单的权限
  function getMenuAuthority (moduleId) {
    const list = indexObj.$store.state.indexStore.authority
    const index = list.findIndex(el => el.resourceId === moduleId)
    // 有权限数据   有权限验证要求 才进行权限验证
    if (list[index] && list[index].authority !== '0') {
      return list[index]
    }
    return false
  }

  // 打开一个菜单页
  function openTabMenu (item) {
    if (!item.name) {
      item.name = 'new tab'
    }
    indexObj.$store.dispatch('addTabMenuList', { value: item, })
    if (item.refresh) {
      reload(item)
    }
  }

  /**
   *
   * @param item
   * @param location {absolutelyLocation,location} 在指定位置打开tab页
   * @param location.absolutelyLocation 在绝对的位置上打开
   * @param location.location 传入 1，0，-2，-1等，相对于当前页面的前一个后一个
   */
  function openTabMenuInLocation (params) {
    const { item, location, } = params
    if (!item.name) {
      item.name = 'new tab'
    }
    if (location) {
      indexObj.$store.dispatch('addTabMenuListByLocation', { value: item, location, })
    } else {
      indexObj.$store.dispatch('addTabMenuList', { value: item, })
    }
    if (item.refresh) {
      reload(item)
    }
  }

  // 关闭一个菜单页 param= string||object
  // value:id
  // force:false 是否强制关闭,强制关闭不会调用回调
  function closeTabMenu (param) {
    // 如果是string那么就必须是id
    if (typeof param == 'string') {
      indexObj.$refs.indexTab.closeTabFn({ id: param, })
    } else if (typeof param == 'object') { // 如果是对象那么一定是id + force
      indexObj.$refs.indexTab.closeTabFn({ id: param.id, }, param.force)
    }
  }

  // 关闭首页的所有弹出泡泡
  function closeIndexPops () {
    // 关闭用户框框
    indexObj.$store.dispatch('setStateValue', { showUserInfo: false, })
    // 关闭tab更多选项卡框框
    indexObj.$refs.indexTab.ifShowMore = false
  }

  // 获取当前菜单id
  function getActiveTabMenuId () {
    let menuId = ''
    try {
      menuId = indexObj.$store.state.indexStore.activeTabMenu
      // eslint-disable-next-line no-empty
    } catch (e) {

    }
    return menuId
  }

  /**
   * 通过url或者name获取菜单信息
   * @param params
   * @returns {{tabMenuId, tabMenu: *}|null}
   */
  function getTabMenuId (params) {
    const { name, url, } = params
    const menuList = indexObj.$store.state.indexStore.commonMenuList
    if (!menuList?.length) return null
    for (let i = 0; i < menuList.length; i++) {
      if (menuList[i].name === name || menuList[i].url === url) {
        return { tabMenuId: menuList[i].id, tabMenu: menuList[i], }
      }
    }
  }

  // 获取当前人员所有菜单
  function getMenuList () {
    let menu = []
    try {
      menu = menu.concat(indexObj.$store.state.indexStore.menuList)
      // eslint-disable-next-line no-empty
    } catch (e) {

    }
    return menu
  }

  // 刷新指定页面,如果传入页面的url,那么刷新指定url页面,如果不传入,那么刷新当前页面
  // page:{url:'页面url',id:'页面id','prefix':'url前缀'}
  function reload (page) {
    try {
      let pageName = ''
      let pageId = ''
      let pagePart = ''
      let menu = ''
      if (page) {
        menu = indexObj.$store.getters.getTabMenuByUrl(page)
      } else {
        menu = indexObj.$store.getters.getActiveIframe
      }
      pageName = menu.prefix + menu.module
      pagePart = menu.part
      pageId = menu.partId
      const pageObj = document.getElementById(pageName).contentWindow.pageVmObj
      pageObj.$bus.emit('refresh', pageId, pagePart)
    } catch (e) {
      message.error('刷新不成功,请确认菜单是否正确')
    }
  }

  // 退出系统
  function logout () {
    indexObj.$refs.userMenu.logout()
  }
  /**
   * gotoLogin 进入登录页面 可能是login,也可能是单点的登录页面,
   * 在session过期之后会调用这个函数
   *options:
   * url: 跳转路径
   * **/
  function gotoLogin (options) {
    const url = options?.url || 'login.html'
    window.location.href = url
  }

  const EventBus = function () {
  }

  EventBus.prototype = {
    registeredEventList: [],
  }

  const eventBus = new EventBus()

  EventBus.prototype.on = (event, callback) => {
    if (typeof event === 'string') {
      eventBus.registeredEventList.push(event)
    }
    if (Array.isArray(event)) {
      eventBus.registeredEventList.push(...event)
    }
    indexObj.$bus.on(event, callback)
  }

  EventBus.prototype.off = (event, callback) => {
    if (typeof event === 'string') {
      eventBus.registeredEventList = eventBus.registeredEventList.filter(item => item !== event)
    }
    if (Array.isArray(event)) {
      eventBus.registeredEventList = eventBus.registeredEventList.filter(item => !event.includes(item))
    }
    indexObj.$bus.off(event, callback)
  }

  EventBus.prototype.once = (event, callback) => {
    if (typeof event === 'string') {
      eventBus.registeredEventList.push(event)
    }
    indexObj.$bus.once(event, (...args) => {
      eventBus.registeredEventList = eventBus.registeredEventList.filter(item => item !== event)
      // eslint-disable-next-line no-useless-call
      callback.call(null, ...args)
    })
  }

  EventBus.prototype.emit = (event, ...args) => {
    indexObj.$bus.emit(event, ...args)
  }

  return {
    getUserInfo,
    getMenuAuthority,
    openTabMenu,
    openTabMenuInLocation,
    closeTabMenu,
    closeIndexPops,
    getActiveTabMenuId,
    reload,
    getMenuList,
    getTabMenuId,
    logout,
    globalEvent: eventBus,
    gotoLogin,
  }
}

export default indexTools
