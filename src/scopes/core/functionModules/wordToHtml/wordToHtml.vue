<template>
  <div>
    <ta-button @click="getCodeStr">
      获取代码字符串
    </ta-button>
    <ta-button @click="getValue">
      获取数据
    </ta-button>
    <ta-button @click="setValue">
      设置数据
    </ta-button>
    <xform ref="xform" :str="str"/>
  </div>
</template>
<script>

import xform from './resource/xform.vue'

export default {
  name: 'wordToHtml',
  components: {
    xform,
  },
  data () {
    return {
      str: '',
    }
  },
  mounted () {

  },
  methods: {
    getValue () {
      console.log(this.$refs.xform.getValue())
    },
    setValue () {
      const value = '{}'
      this.$refs.xform.setValue(value)
    },
    getCodeStr () {
      Base.submit(null, {
        data: {
          docId: 'aa',
        },
        url: 'doc2form/getDocForm ',
      }).then((rs) => {
        this.str = rs.data.div
      })
    },

  },

}
</script>

<style scoped>

</style>
