<template>
  <div id="searchList" class="fit">
    <ta-border-layout layout-type="fixTop" class="noborder">
      <ta-page-header
        slot="header"
        class="page-header"
      >
        <template slot="footer">
          <ta-tabs v-model="tabsKey" @change="onTabsChange">
            <ta-tab-pane key="article" tab="文章" />
            <ta-tab-pane key="project" tab="项目" />
            <ta-tab-pane key="app" tab="应用" />
          </ta-tabs>
        </template>
        <div class="header-content">
          <ta-input-search placeholder="请输入查询关键字" enter-button style="width: 600px" />
        </div>
        <SearchPanel />
      </ta-page-header>
      <ta-card :bordered="false" class="fit content-card">
        <transition name="normal-fade" mode="out-in">
          <router-view />
        </transition>
      </ta-card>
    </ta-border-layout>
  </div>
</template>

<script>
import SearchPanel from './components/searchPanel.vue'

export default {
  name: 'searchList',
  components: { SearchPanel, },
  data () {
    return {
      tabsKey: null,
      pageInfo: {
        article: '文章',
        project: '项目',
        app: '应用',
      },
    }
  },
  created () {
    this.tabsKey = this.$route.name.substr(0, this.$route.name.length - 6)
  },
  methods: {
    onTabsChange (activeKey) {
      this.$router.push({ name: `${activeKey}Search`, })
    },
    getTarget () {
      return document.querySelector('.fit.content-card').querySelector('.ant-card-body')
    },
  },
}
</script>

<style>
.normal-fade-enter-active, .normal-fade-leave-active {
  transition: all .5s;
}
.normal-fade-enter, .normal-fade-leave-to {
  opacity: 0;
}
</style>
<style lang="less" scoped>

.page-header {

  .header-content{
    text-align: center;
  }

  & /deep/ .ant-tabs {
    padding: 0;
  }

  & /deep/ .ant-page-header-footer {
    margin-top: 0;
  }
}

.content-card {
  background-color: @background-color-base;
}

</style>
