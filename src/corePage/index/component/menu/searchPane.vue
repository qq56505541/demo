<template>
  <div :class="[`searchPane`,`searchPane--${state.leftTheme}`]">
    <ta-menu mode="inline" :theme="state.leftTheme" :data="menuList" :props="props" :selected-keys="[state.activeMenuTwo || '']" @click="clickMenu" :style="{width:'100%'}" />
  </div>
</template>
<script>
import { mapGetters, } from 'vuex'
export default {
  name: 'search-pane',
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
      menuList: 'getSearchMenuList',
    }),
  },
  methods: {
    clickMenu ({ key, keyPath, }) {
      this.$store.dispatch('setActiveMenu', { level: 'two', menuId: key, })
      const tabMenu = this.menuList.filter(item => item.id == key)[0]
      this.$store.dispatch('addTabMenuList', { value: tabMenu, })
    },
  },
}
</script>

<style scoped type="text/less" lang="less">
  .searchPane {
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
</style>
