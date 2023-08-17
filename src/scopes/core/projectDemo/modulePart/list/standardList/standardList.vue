<template>
  <div style="height:100%">
    <ta-border-layout layout-type="fixTop">
      <ta-card :bordered="false" slot="header">
        <ta-row>
          <ta-col :sm="8" :xs="24">
            <info title="我的待办" value="8个任务" :bordered="true" />
          </ta-col>
          <ta-col :sm="8" :xs="24">
            <info title="本周任务平均处理时间" value="32分钟" :bordered="true" />
          </ta-col>
          <ta-col :sm="8" :xs="24">
            <info title="本周完成任务数" value="24个" />
          </ta-col>
        </ta-row>
      </ta-card>
      <ta-card class="fit">
        <template v-slot:title>
          标准列表
        </template>
        <template v-slot:extra>
          <ta-radio-group v-model="type" style="display: inline-block;">
            <ta-radio-button value="1">
              全部
            </ta-radio-button>
            <ta-radio-button value="2">
              进行中
            </ta-radio-button>
            <ta-radio-button value="3">
              等待中
            </ta-radio-button>
          </ta-radio-group>
          <div style="display: inline-block;width: 250px;margin-left: 30px;">
            <ta-input-search />
          </div>
        </template>
        <ta-list
          size="large"
          :pagination="{showSizeChanger: true, showQuickJumper: true, pageSize: 5, total: 50, pageSizeOptions: ['5', '10', '20', '50', '100'] }"
        >
          <ta-list-item v-for="(item, index) in data" :key="index">
            <ta-list-item-meta :description="item.description">
              <ta-avatar slot="avatar" size="large" shape="square" :src="item.avatar" />
              <a slot="title">{{ item.title }}</a>
            </ta-list-item-meta>
            <div slot="actions">
              <a @click="edit(item)">编辑</a>
            </div>
            <div slot="actions">
              <ta-dropdown>
                <ta-menu slot="overlay">
                  <ta-menu-item>
                    <a>编辑</a>
                  </ta-menu-item>
                  <ta-menu-item>
                    <a>删除</a>
                  </ta-menu-item>
                </ta-menu>
                <a>更多<ta-icon type="down" /></a>
              </ta-dropdown>
            </div>
            <div class="list-content">
              <div class="list-content-item">
                <span>Owner</span>
                <p>{{ item.owner }}</p>
              </div>
              <div class="list-content-item">
                <span>开始时间</span>
                <p>{{ item.startAt }}</p>
              </div>
              <div class="list-content-item">
                <ta-progress :percent="item.progress.value" :status="!item.progress.status ? null : item.progress.status" style="width: 180px" />
              </div>
            </div>
          </ta-list-item>
        </ta-list>
      </ta-card>
    </ta-border-layout>
  </div>
</template>
<script>
import Info from './components/info'
const data = []
data.push({
  title: 'Alipay',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
  description: '那是一种内在的东西， 他们到达不了，也无法触及的',
  owner: '付晓晓',
  startAt: '2018-07-26 22:44',
  progress: {
    value: 90,
  },
})
data.push({
  title: 'Angular',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
  description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
  owner: '曲丽丽',
  startAt: '2018-07-26 22:44',
  progress: {
    value: 54,
  },
})
data.push({
  title: 'Ant Design',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
  description: '生命就像一盒巧克力，结果往往出人意料',
  owner: '林东东',
  startAt: '2018-07-26 22:44',
  progress: {
    value: 66,
  },
})
data.push({
  title: 'Ant Design Pro',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
  owner: '周星星',
  startAt: '2018-07-26 22:44',
  progress: {
    value: 30,
  },
})
data.push({
  title: 'Bootstrap',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
  description: '那时候我只会想自己想要什么，从不想自己拥有什么',
  owner: '吴加好',
  startAt: '2018-07-26 22:44',
  progress: {
    status: 'exception',
    value: 100,
  },
})
export default {
  name: 'standardList',
  components: { Info, },
  data () {
    return {
      type: '3',
      data,
    }
  },
  mounted () {

  },
}
</script>

<style lang="less" scoped>
.ant-avatar-lg {
  width: 48px;
  height: 48px;
  line-height: 48px;
}
.list-content-item {
  color: rgba(0, 0, 0, .45);
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  margin-left: 40px;
  span {
    line-height: 20px;
  }
  p {
    margin-top: 4px;
    margin-bottom: 0;
    line-height: 22px;
  }
}
</style>
