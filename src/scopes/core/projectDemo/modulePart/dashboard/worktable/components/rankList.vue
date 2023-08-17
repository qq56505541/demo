<template>
  <card-frame :setting="setting" :id="id" @deleteCom="deleteCom">
    <span slot="header">公司动态</span>
    <ta-list
      item-layout="horizontal"
      :data-source="data"
    >
      <ta-list-item slot="renderItem" slot-scope="item, index">
        <ta-list-item-meta
          :description="item.describe"
        >
          <a slot="title" href="/#/docs/components/list-cn">{{ item.title }}</a>
          <ta-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        </ta-list-item-meta>
      </ta-list-item>
    </ta-list>
  </card-frame>
</template>

<script>
import baseMixins from '../mixins/baseMixins'
import cardFrame from './cardFrame'
const data = [
  {
    title: '李太白',
    describe: '每日7:30到公司，刷新纪录!',
  },
  {
    title: '姜太虚',
    describe: '实现xxxxx，好厉害!',
  },
  {
    title: '李xx',
    describe: 'xxx项目变更申请表（用户模板，案例用于部级项目）',
  },
  {
    title: '江流儿',
    describe: 'xxxx项目需求调研方案（用户模板，范例用于省部级项目）!',
  },
  {
    title: '李太白',
    describe: '每日7:30到公司，刷新纪录!',
  },
  {
    title: '李太白',
    describe: '每日7:30到公司，刷新纪录!',
  }
]
export default {
  name: 'rankList',
  mixins: [baseMixins],
  components: {
    cardFrame,
  },
  data () {
    return {
      data,
    }
  },
  methods: {
    deleteCom (id) {
      this.$emit('deleteCom', id)
    },
  },
}
</script>

<style scoped>

</style>
