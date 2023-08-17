<template>
  <div>
    <ta-card
      v-for="item in data"
      :key="item.id"
      :loading="loading"
      hoverable
      style="display: inline-block;width: calc(25% - 20px);margin: 10px"
    >
      <template slot="cover">
        <div
          v-if="loading"
          style="height: 200px;line-height: 200px;text-align: center;"
        >
          <ta-spin>
            <ta-icon slot="indicator" type="loading" style="font-size: 24px" spin />
          </ta-spin>
        </div>
        <img
          v-else
          alt="example"
          :src="item.cover"
        >
      </template>
      <ta-card-meta
        :title="item.title"
      >
        <template slot="description">
          <span class="project-list-item-desc-text">{{ item.description }}</span>
        </template>
      </ta-card-meta>
      <div class="cardItemContent">
        <span>{{ item.updatedAt }}</span>
        <div class="avatarList">
          <avatar-list size="small" :max-length="2">
            <avatar-list-item
              v-for="(member, i) in item.members"
              :key="`${item.id}-avatar-${i}`"
              :src="member.avatar"
              :tips="member.name"
            />
          </avatar-list>
        </div>
      </div>
    </ta-card>
  </div>
</template>
<script>
import Ellipsis from '../components/ellipsis.vue'
import AvatarList from '../components/avatarList.jsx'
import AvatarListItem from '../components/avatarListItem.jsx'
export default {
  name: 'projectList',
  components: { Ellipsis, AvatarList, AvatarListItem, },
  data () {
    return {
      data: Array.from({ length: 6, }).map((_, index) => ({ id: index, })),
      loading: true,
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

<style lang="less">
  .project-list-item-desc-text {
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
  }
.cardItemContent {
  display: flex;
  height: 20px;
  margin-top: 16px;
  margin-bottom: -4px;
  line-height: 20px;

  > span {
    flex: 1 1;
    color: rgba(0,0,0,.45);
    font-size: 12px;
  }

  /deep/ .ant-pro-avatar-list {
    flex: 0 1 auto;
  }
}
</style>
