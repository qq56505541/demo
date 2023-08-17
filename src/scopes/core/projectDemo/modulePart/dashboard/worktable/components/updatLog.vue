<template>
  <card-frame :setting="setting" :id="id" @deleteCom="deleteCom">
    <span slot="header">平台更新</span>
    <div v-html="updateContext" />
  </card-frame>
</template>

<script>
import baseMixins from '../mixins/baseMixins'
import cardFrame from './cardFrame'
export default {
  name: 'updatLog',
  mixins: [baseMixins],
  components: {
    cardFrame,
  },
  data () {
    return {
      updateContext: '1、新增xxx功能<br>\n' +
          '            2、修复了xxxbug<br>\n' +
          '            3、修复了xxxbug<br><br>\n' +
          '            1、新增xxx功能<br>\n' +
          '            2、更新了啥啥啥<br>\n' +
          '            3、更新了啥啥啥<br>\n' +
          '            1、更新了啥啥啥<br>\n' +
          '            2、更新了啥啥啥<br>\n' +
          '            3、更新了啥啥啥<br>',
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
