<template>
  <ta-label-con
    :label-col="{span:4}"
    :wrapper-col="{span:20}"
    label="字典类型过滤"
    style="margin-bottom: 8px;"
  >
    <ta-tag-select
      style="line-height: 2.5;"
      :data="collectionColumn"
      :value="featData.filter || []"
      size="small"
      required
      @change="handleTagSelectChange"
    />
  </ta-label-con>
</template>

<script>
import { mapState, mapGetters, } from 'vuex'
export default {
  name: 'FilterFeat',
  computed: {
    ...mapState('design', ['tableColumns', 'featData']),
    ...mapGetters('design', ['collectionColumn']),
  },
  methods: {
    handleTagSelectChange (value) {
      if (value.length === 0) return
      this.$store.dispatch('design/modifyFeatData', {
        filter: [...value],
      })
    },
  },
}
</script>
