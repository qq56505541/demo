<template>
  <div class="fit">
    <generator v-if="allData !== null" :all-data="allData" />
  </div>
</template>

<script>
import Generator from '../onlineDesign/packages/Generator'

export default {
  name: 'OnlinePage',
  components: { Generator, },
  data () {
    return {
      allData: null,
    }
  },
  created () {
    Base.submit(null, { url: 'onlineForm/templateMg/templateMgRestService/queryTemplateContentById', data: { templateId: this.$route.query.id, }, }).then((res) => {
      this.$nextTick(() => {
        this.allData = JSON.parse(res.data.resultData)
      })
    })
  },
}
</script>
