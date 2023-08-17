import faceConfig from 'faceConfig'// 引入配置
// 菜单搜索
function fnCreateCheckedResourceIds(item, list, value) {
    if (item.children) {
        item.children.forEach((item) => {
            fnCreateCheckedResourceIds(item, list, value)
        })
    }
    if ((!item.children || (item.children && item.children.length === 0)) && item.name && item.name.indexOf(value) >= 0) {
        list.push(item)
    }
}

/**
 * 在指定位置打开Teb页
 * @param params
 */
function handleTabMenuLocationOpen(params) {
    let {
        tabMenuList,
        nowPageId,
        location,
        value
    } = params
    const absolutelyLocation = location.absolutelyLocation
    // 使用绝对位置打开方式
    if(absolutelyLocation !== undefined) {
        // 即将打开的页面下标
        const willOpenPageIndex = tabMenuList.findIndex((page) => page.id === value.id)
        if(willOpenPageIndex !== -1) {
            tabMenuList.splice(willOpenPageIndex,1)
        }
        // 直接插入相应位置
        tabMenuList.splice(absolutelyLocation,0,value)
    } else {
        // 相对当前页面位置的方式打开
        const nowPageIndex = tabMenuList.findIndex((page) => page.id === nowPageId)
        // 即将打开的页面下标
        const willOpenPageIndex = tabMenuList.findIndex((page) => page.id === value.id)
        // 偏移量
        const offset = location.location < 0 ? 1 : 0
        let insertIndex = nowPageIndex + (location.location ?? 1) + offset
        // 边界
        if(insertIndex < 0) insertIndex = 0
        else if(insertIndex >= tabMenuList.length) insertIndex = tabMenuList.length

        // 为0替换，否则新增
        tabMenuList.splice(insertIndex, location.location === 0 ? 1 : 0,value)
        // 如果已经存在，则需要删掉之前的
        if(willOpenPageIndex !== -1) {
            if(insertIndex >= willOpenPageIndex) tabMenuList.splice(willOpenPageIndex,1)
            else if(insertIndex < willOpenPageIndex) tabMenuList.splice(willOpenPageIndex + 1,1)
        }
    }
}

function menuToModule(menu, srcPrefix) {
    if (menu.url) {
        return {
            partId: menu.id,
            module: menu.url.split('#/')[0],
            part: menu.url.split('#/')[1] || '',
            prefix: menu.prefix || srcPrefix || '',
            params:menu.params || '',
        }
    } else {
        return {
            module: '404.html',
            part: '',
            partId: 'ta404',
            prefix: menu.prefix || srcPrefix || '',
        }
    }
}

const indexStore = {
    state: {
        menuList: [], // 所有菜单
        commonMenuList: [], // 常用菜单
        ...faceConfig.indexPageConfig, // 首页配置数据
        collapsed: false, // 左侧菜单展开收起状态（默认展开）
        showUserInfo: false, // 是否显示右侧用户信息
        tabMenuList: [], // 被打开的作为tab的菜单
        activeTabMenu: 'worktable', // 默认被打开的为工作台
        activeMenuOne: false, // 一级菜单激活的选项 false为没有激活选项（默认选中第一个）
        activeMenuTwo: '', // 二级菜单激活的选项false//''没有激活选项,
        ifSearchPane: false, // 是否显示搜索框
        searchValue: '', // 搜索框的值
        userInfo: {
            userName: '未登录',
            userImg: 'person-head.png',
            mainRoleName: '',
        },
        sysInfo: {
            openSocialLogin: false,
            openSmsLogin: false,
        },
        authority: [],
        breadcrumb: [], // 面包屑
        workTableMenuVertical: false,
        workTableMenuHorizon: false,
    },
    getters: {
        getStateValue: state => state,
        getMenuListLeft: (state) => {
            let list = []
            if (state.menuType == 'leftTop' || state.menuType == 'simple' || state.menuType == 'workTable') {
                try {
                    // 判断activeMenuOne是否有子节点
                    const l = state.menuList.filter(item => item.id === state.activeMenuOne)
                    list = l[0].children || []
                } catch (error) {
                    list = []
                }
            } else if (state.menuType == 'left') {
                list = state.menuList
            }
            return list
        },
        getCollapsed: (state) => {
            return state.menuType == 'simple' ? true : state.menuType == 'workTable' ? false : state.collapsed
        },
        getSearchMenuList: (state) => {
            const list = []
            fnCreateCheckedResourceIds({children: state.menuList,}, list, state.searchValue)
            return list
        },
        getTabMenuList: (state) => {
            return state.tabMenuList
        },
        getCommonMenuList: (state) => {
            return state.commonMenuList
        },
        getActiveIframe: (state) => {
            const menuId = state.activeTabMenu

            if (menuId === 'worktable') {
                const {worktable,} = state
                return {
                    ...worktable,
                    partId: 'worktable',
                }
            }
            const menu = state.tabMenuList.filter(item => item.id === menuId)[0] || ''
            return menuToModule(menu, state.srcPrefix)
        },
        getTabMenuByUrl: (state, getters) => ({url, prefix, id,}) => {
            let menu = ''
            // 有id以id为准,没有id则url+prefix判断
            if (id) {
                menu = state.tabMenuList.filter(item => item.id === id)[0] || ''
                if (menu) {
                    return menuToModule(menu, state.srcPrefix)
                }
            }
            if (url) {
                menu = state.tabMenuList.filter(item => (item.url === url && (!prefix || prefix == item.prefix || prefix == state.prefix)))[0] || ''
                return menuToModule(menu, state.srcPrefix)
            } else {
                return false
            }
        },
        getHeaderHeight: (state) => {
            return state.menuType === 'simple' ? '48px': state.headerHeight
        },
    },
    actions: {
        // state 赋值
        setStateValue({commit,}, value) {
            commit('_setStateValue', value)
        },
        loadMenuList({commit,}, {menuList,}) {
            // 设置菜单menuList
            commit('_setStateValue', {menuList: JSON.parse(JSON.stringify(menuList || [])),})
            // 初始化激活的菜单
            let actMenu = false
            if (menuList[0] && menuList[0].id) {
                actMenu = menuList[0].id
            }
            commit('_setActiveMenu', {level: 'one', menuId: actMenu, init: true,})
        },
        setActiveMenu({commit,}, {level, menuId,}) {
            commit('_setActiveMenu', {level, menuId,})
        },
        setUserInfo({state, commit,}) {
            if (state.userInfo.userName == '未登录') {
                return new Promise((resolve, reject) => {
                    Base.submit(null, {
                        url: 'indexRestService/getCurUserAccount',
                    }, {
                        successCallback: (data) => {
                            const info = {
                                ...data.data.curUserAccount,
                                passwordRSA: data.data.passwordRSA || true,
                                isSSO: data.data.isSSO || false,
                                passwordLevel:data.data.passwordLevel || 3
                            }
                            commit('_setUserInfo', info || {})
                            resolve(state.userInfo)
                        },
                    })
                })
            } else {
                return new Promise((resolve, reject) => {
                    resolve(state.userInfo)
                })
            }
        },
        setSysInfo({state, commit,}) {
            return new Promise((resolve, reject) => {
                Base.submit(null, {
                    url: 'indexRestService/getSysInfo',
                }, {
                    successCallback: (data) => {
                        const sysInfo = {
                            openSocialLogin: data.data.openSocialLogin || false,
                            openSmsLogin: data.data.openSmsLogin || false,
                        }
                        commit('_setSysInfo', sysInfo || {})
                        resolve(state.sysInfo)
                    },
                })
            })
        },
        setAuthority({commit,}) {
            Base.submit(null, {
                url: 'menu/menuAction/queryAllElement',
            }, {
                successCallback: (data) => {
                    commit('_setAuthority', data.data.list || [])
                },
            })
        },
        addTabMenuList({commit,}, {value,}) {
            // 如果url是空那么直接提示
            if(!value?.url && !value?.exist){
                message.error("该菜单没有配置对应的页面!")
                return false
            }
            if (value && value.id && (value.children === undefined || value.children.length <= 0)) {
                commit('_addTabMenuList', value)
            }
        },
        addTabMenuListByLocation({commit,}, {value,location}) {
            // 如果url是空那么直接提示
            if(!value?.url && !value?.exist){
                message.error("该菜单没有配置对应的页面!")
                return false
            }
            if (value && value.id && (value.children === undefined || value.children.length <= 0)) {
                commit('_addTabMenuListByLocation', {value,location})
            }
        },
        deleteTabMenuList({commit,}, {value,}) {
            commit('_deleteTabMenuList', value)
        },
        addCommonMenu({state, commit,}, menu) {
            Base.submit(null, {
                url: 'menu/common/bindCommonResource',
                data: {
                    resourceId: menu.id,
                },
            }).then((data) => {
                if (data.data.result && state.commonMenuList.filter(item => item.id === menu.id).length === 0) {
                    const list = state.commonMenuList.concat([menu])
                    commit('_setStateValue', {commonMenuList: list,})
                    message.success('添加成功!')
                } else {
                    message.error('添加失败!')
                }
            })
        },
        deleteCommonMenu({state, commit,}, menu) {
            Base.submit(null, {
                url: 'menu/common/unbindCommonResource',
                data: {
                    resourceIds: menu.id,
                },
            }).then((data) => {
                if (data.data.result) {
                    const list = state.commonMenuList.filter(item => item.id !== menu.id)
                    commit('_setStateValue', {commonMenuList: list,})
                    message.success('删除成功!')
                } else {
                    message.error('删除失败!')
                }
            })
        },
    },
    mutations: {
        _setStateValue(state, value) {
            Object.assign(state, value)
        },
        _setActiveMenu(state, {level, menuId, init,}) {
            const {activeMenuOne, menuList,} = state
            // 一级菜单设置，默认选中第一个（可设置其他默认值）
            if (level == 'one' && !(init && activeMenuOne != false)) {
                state.activeMenuOne = menuId
                // 第一个菜单没有子菜单时，不选中
                if (init && !(menuList[0].children && menuList[0].children.length)) {
                    state.activeMenuOne = ''
                }
            } else if (level == 'two') {
                state.activeMenuTwo = menuId
            }
        },
        _setUserInfo(state, value) {
            state.userInfo = Object.assign(state.userInfo, value || {})
        },
        _setSysInfo(state, value) {
            state.sysInfo = Object.assign(state.sysInfo, value || {})
        },
        _setAuthority(state, auth) {
            state.authority = auth
        },
        _addTabMenuList(state, value) {
            value.params=value?.url?.split("?")[1] || value?.params
            value.url=value?.url?.split("?")[0]
            if (value.id === 'b93e89515da24041b9f1459f77de38fe') {
                state.activeTabMenu = 'worktable'
                return false
            }
            if (state.barType === 'breadcrumb') {
                state.tabMenuList = [value]
                state.activeTabMenu = value.id
                return false
            }
            if (state.tabMenuList.filter(item => item.id === value.id).length <= 0) {
                state.tabMenuList.push(value)
            }
            state.activeTabMenu = value.id
        },
        _addTabMenuListByLocation(state,{value,location}) {
            value.params=value?.url?.split("?")[1] || value?.params
            value.url=value?.url?.split("?")[0]
            if (value.id === 'b93e89515da24041b9f1459f77de38fe') {
                state.activeTabMenu = 'worktable'
                return false
            }
            if (state.barType === 'breadcrumb') {
                state.tabMenuList = [value]
                state.activeTabMenu = value.id
                return false
            }


            // ***** location start ********
            // 已经打开的tab列表
            const tabMenuList = state.tabMenuList
            // 当前页面
            let nowPageId = state.activeTabMenu
            handleTabMenuLocationOpen({
                tabMenuList,
                nowPageId,
                location,
                value
            })
            // ***** location end ********

            state.activeTabMenu = value.id
        },
        _deleteTabMenuList(state, value) {
            try {
                state.tabMenuList = JSON.parse(JSON.stringify(state.tabMenuList.filter(item => item.id !== value)))
            } catch (error) {
                console.log(error)
            }
        },
    },
}

export default indexStore
