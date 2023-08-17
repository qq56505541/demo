<template>
  <ta-list :data-source="data" :grid="{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }">
    <ta-list-item slot="renderItem" slot-scope="item">
      <ta-card :body-style="{ paddingBottom: 20 }" hoverable>
        <ta-skeleton :loading="loading" active>
          <ta-card-meta :title="item.title">
            <template slot="avatar">
              <ta-avatar size="small" :src="item.avatar" />
            </template>
          </ta-card-meta>
          <div class="">
            <card-info active-user="100" new-user="999" />
          </div>
        </ta-skeleton>
        <template slot="actions">
          <ta-tooltip title="下载">
            <ta-icon type="download" />
          </ta-tooltip>
          <ta-tooltip title="编辑">
            <ta-icon type="edit" />
          </ta-tooltip>
          <ta-tooltip title="分享">
            <ta-icon type="share-alt" />
          </ta-tooltip>
          <ta-dropdown>
            <a class="ant-dropdown-link">
              <ta-icon type="ellipsis" />
            </a>
            <ta-menu slot="overlay">
              <ta-menu-item>
                <a href="javascript:;">1st menu item</a>
              </ta-menu-item>
              <ta-menu-item>
                <a href="javascript:;">2nd menu item</a>
              </ta-menu-item>
              <ta-menu-item>
                <a href="javascript:;">3rd menu item</a>
              </ta-menu-item>
            </ta-menu>
          </ta-dropdown>
        </template>
      </ta-card>
    </ta-list-item>
  </ta-list>
</template>
<script>
import cardInfo from '../components/cardInfo'
export default {
  name: 'appList',
  components: { cardInfo, },
  data () {
    return {
      loading: true,
      data: Array.from({ length: 6, }).map((_, index) => ({ id: index, })),
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      Base.submit(null, {
        url: 'http/mock/projectDemo/list/article',
        data: { count: 8, },
        showPageLoading: false,
      }).then(res => {
        this.data = res.data.list
        this.loading = false
      })
    },
  },
}
</script>
