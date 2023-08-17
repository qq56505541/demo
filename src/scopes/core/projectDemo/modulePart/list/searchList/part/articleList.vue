<template>
  <ta-card :bordered="false">
    <ta-list
      size="large"
      row-key="id"
      item-layout="vertical"
      :data-source="data"
    >
      <ta-list-item :key="item.id" slot="renderItem" slot-scope="item">
        <template v-if="!loading" slot="actions">
          <icon-text type="star-o" :text="item.star" />
          <icon-text type="like-o" :text="item.like" />
          <icon-text type="message" :text="item.message" />
        </template>
        <ta-skeleton :loading="loading" active avatar>
          <ta-list-item-meta>
            <a slot="title" href="https://vue.ant.design/">{{ item.title }}</a>
            <template slot="description">
              <span>
                <ta-tag>Ant Design</ta-tag>
                <ta-tag>设计语言</ta-tag>
                <ta-tag>蚂蚁金服</ta-tag>
              </span>
            </template>
          </ta-list-item-meta>
          <article-list-content :description="item.description" :owner="item.owner" :avatar="item.avatar" :href="item.href" :update-at="item.updatedAt" />
        </ta-skeleton>
      </ta-list-item>
      <div slot="footer" v-if="data.length > 0" style="text-align: center; margin-top: 16px;">
        <ta-button @click="loadMore" :loading="loadingMore">
          加载更多
        </ta-button>
      </div>
    </ta-list>
  </ta-card>
</template>
<script>
import ArticleListContent from '../components/articleListContent.vue'
import IconText from '../components/iconText.vue'
export default {
  name: 'articleList',
  components: { ArticleListContent, IconText, },
  data () {
    return {
      loading: true,
      loadingMore: false,
      data: Array.from({ length: 5, }).map((_, index) => ({ id: index, })),
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      Base.submit(null, { url: 'http/mock/projectDemo/list/article', showPageLoading: false, }).then(res => {
        this.data = res.data.list
        this.loading = false
      })
    },
    loadMore () {
      this.loadingMore = true
      Base.submit(null, { url: 'http/mock/projectDemo/list/article', showPageLoading: false, }).then(res => {
        this.data = this.data.concat(res.data.list)
      }).finally(() => {
        this.loadingMore = false
      })
    },
  },
}
</script>
