<template>
  <div :class="[`commonMenu`,`commonMenu--${state.leftTheme}`]">
    <ta-menu
      mode="inline"
      :theme="state.leftTheme"
      :data="menuList"
      :props="props"
      :selected-keys="[state.activeMenuTwo || '']"
      @click="clickMenu"
      :style="{width:'100%'}"
      :custom-menu-item="customMenuItem"
    />
  </div>
</template>
<script type="text/jsx">
import { mapGetters, } from 'vuex'

export default {
  name: 'commonMenu.vue',
  data () {
    return {
      props: {
        key: 'id',
        title: 'name',
      },
    }
  },
  computed: {
    ...mapGetters({
      state: 'getStateValue',
      menuList: 'getCommonMenuList',
    }),
  },
  methods: {
    clickMenu ({ key, keyPath, }) {
      this.$store.dispatch('setActiveMenu', { level: 'two', menuId: key, })
      const tabMenu = this.menuList.filter(item => item.id == key)[0]
      this.$store.dispatch('addTabMenuList', { value: tabMenu, })
    },
    customMenuItem (item) {
      return (
        <span>
          {item.name}
          <ta-icon class="menuDelete" type="delete" title={this.$t('search.removeFavorites')} onClick={(e) => {
            e.stopPropagation()
            this.deleteCommonMenu(item)
          }}></ta-icon>
        </span>
      )
    },
    deleteCommonMenu (item) {
      this.$store.dispatch('deleteCommonMenu', item)
    },
  },
}
</script>

<style scoped type="text/less" lang="less">
    .commonMenu {
        height: 100%;
        width: 100%;
        overflow: auto;
        position: absolute;
        top: 0px;
        left: 0px;
        .beautifyScrollbar();
        &--dark {
            background-color: @menu-dark-bg;
        }
        &--base {
            background-color: @menu-base-bg;
        }
        &--light {
            background-color: @menu-bg;
        }
    }
  .menuDelete{
    float: right;
    margin-top: 13px;
    &:hover {
      color: @error-color !important;
    }
  }
</style>
