<template>
  <card-frame :setting="setting" :id="id" @deleteCom="deleteCom">
    <span slot="header">我的团队</span>
    <ta-list
      :grid="{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 4, xxl: 4 }"
      :data-source="data"
    >
      <ta-list-item slot="renderItem" slot-scope="item, index">
        <ta-card :title="item.title">
          成员: <span style="color: #999">{{ item.user }}</span>
        </ta-card>
      </ta-list-item>
    </ta-list>
  </card-frame>
</template>

<script>
import baseMixins from '../mixins/baseMixins'
import cardFrame from './cardFrame'

const data = [
  {
    title: 'ta404 前端组',
    user: '星星的猫、弯桥儿',
  },
  {
    title: 'ta+3组',
    user: '星星的猫、弯桥儿',
  },
  {
    title: '技术研发组',
    user: '星星的猫、弯桥儿',
  },
  {
    title: 'UE组',
    user: '星星的猫、弯桥儿',
  },
  {
    title: 'Title 2动次打次多吃点',
    user: '星星的猫、弯桥儿',
  }
]
export default {
  name: 'teamList',
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
