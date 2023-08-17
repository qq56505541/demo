<template>
  <div :class="[`menu-vertical`,`menu-vertical--${state.leftTheme}`]">
    <ta-config-provider :get-popup-container="popupContainer">
      <ta-menu
        :mode="state.menuLeftStyle == 'dropdown' ? 'inline': 'vertical'"
        :inline-collapsed="collapsed"
        :theme="state.leftTheme"
        :inline-indent="10"
        @openChange="openChange"
        @menuItemHover="showPopCon"
        :data="menuList"
        :props="props"
        :selected-keys="[state.activeMenuTwo || '']"
        @click="clickMenu"
        :style="{width:'100%'}"
        :open-keys.sync="openKeys"
        :custom-menu-item="customMenuItem"
      />
    </ta-config-provider>
  </div>
</template>
<script type="text/jsx">
import { mapGetters, } from 'vuex'

export default {
  name: 'menu-vertical',
  data () {
    return {
      props: {
        key: 'id',
        title: 'name',
      },
      openKeys: [],
    }
  },
  computed: {
    ...mapGetters({
      state: 'getStateValue',
      collapsed: 'getCollapsed',
      menuList: 'getMenuListLeft',
    }),
  },
  methods: {
    showPopCon (obj) {
      if (this.collapsed && obj.hover) {
        document.getElementById('popCon').style.display = 'block'
      } else {
        document.getElementById('popCon').style.display = 'none'
      }
    },
    popupContainer () {
      return document.getElementById('popCon')
    },
    openChange (array) {
      if (this.state.menuLeftStyle == 'dropdown' && this.collapsed == false) {
        document.getElementById('popCon').style.display = 'none'
        return
      }
      if (array.length == 0) {
        document.getElementById('popCon').style.display = 'none'
      } else {
        document.getElementById('popCon').style.display = 'block'
      }
    },
    clickMenu ({ key, keyPath, }) {
      this.$store.dispatch('setActiveMenu', { level: 'two', menuId: key, })
      let tabMenu = this.menuList
      for (let i = keyPath.length - 1; i > -1; i--) {
        tabMenu = i ? tabMenu.filter(item => item.id == keyPath[i])[0].children : tabMenu.filter(item => item.id == keyPath[i])[0]
      }
      this.$store.dispatch('addTabMenuList', { value: tabMenu, })
      /* 面包屑名称 */
      if (this.state.barType == 'breadcrumb') {
        const breadcrumb = []
        const { menuType, menuList, activeMenuOne, } = this.state
        let leftMenu = this.menuList
        if (menuType == 'leftTop') {
          breadcrumb.push(menuList.filter(item => item.id == activeMenuOne)[0].name)
        }
        for (let i = keyPath.length - 1; i > -1; i--) {
          leftMenu = leftMenu.filter(item => item.id == keyPath[i])[0]
          breadcrumb.push(leftMenu.name)
          leftMenu = i ? leftMenu.children : leftMenu
        }
        this.$store.dispatch('setStateValue', { breadcrumb: breadcrumb, })
      }
    },
    customMenuItem (item) {
      return (
        <span>
          {item.name}
          {item.isCommonMenu ? '' : <ta-icon class="menuStar" type="star" title="点击收藏" onClick={(e) => {
            e.stopPropagation()
            this.addCommonMenu(item)
          }}></ta-icon>}
        </span>
      )
    },
    addCommonMenu (item) {
      this.$store.dispatch('addCommonMenu', item)
    },
  },
  watch: {
    menuList (now, old) {
      if (this.state.dropdownOpenMenu) {
        const keys = []
        now.map((item) => {
          if (item.id) {
            keys.push(item.id)
          }
        })
        this.openKeys = keys
      } else {
        this.openKeys = []
      }
    },
  },
}

</script>
<style type="text/less" lang="less">
    .menu-vertical {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        .beautifyScrollbar(@scrollbar-barcolor:fade(color(@primary-color),35%),@scrollbar-bgcolor:@menu-dark-bg,@active:@primary-color);

        .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title, .ant-menu-inline-collapsed > .ant-menu-item {
            text-align: center;
            padding: 0 !important;
        }
        &--light{
           .ant-menu{
               border-right:none ;
           }
        }
    }

    .menuStar {
        float: right;
        margin-top: 13px;
        opacity: 0;
        &:hover {
            color: @warning-color !important;
        }
    }
    .ant-menu-item{
        &:hover{
            .menuStar{
                transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                opacity: 1;
            }
        }
    }

    #popCon {
        position: absolute;
        display: none;
        top: 0px;
        bottom: 0px;
        width: 100%;
        height: 100%;
        overflow: auto;
        -ms-scroll-chaining: chained;
        -ms-overflow-style: none;
        -ms-content-zooming: zoom;
        -ms-scroll-rails: none;
        -ms-content-zoom-limit-min: 100%;
        -ms-content-zoom-limit-max: 500%;
        -ms-scroll-snap-type: proximity;
        -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }
</style>
