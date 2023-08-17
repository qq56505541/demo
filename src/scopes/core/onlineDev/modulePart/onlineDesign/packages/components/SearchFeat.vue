<template>
  <div>
    <ta-label-con
      label="查询接口"
      :label-col="{span:4}"
      :wrapper-col="{span:20}"
      style="margin-bottom: 8px;"
    >
      <ta-input :value="apis.query" @change="(e) => handleApisChange('query', e.target.value)" />
    </ta-label-con>
    <ta-label-con
      :label-col="{span:4}"
      :wrapper-col="{span:20}"
      label="搜索匹配的字段"
      style="margin-bottom: 8px;"
      v-if="chosenFeats.includes('search')"
    >
      <ta-tag-select
        ref="test"
        style="line-height: 2.5;"
        :data="tagList"
        :value="featData.search || []"
        size="small"
        required
        @change="handleTagSelectChange"
      />
    </ta-label-con>
  </div>
</template>

<script>
import { mapState, mapGetters, } from 'vuex'
export default {
  name: 'SearchFeat',
  computed: {
    ...mapState('design', ['chosenFeats', 'featData', 'apis']),
    ...mapGetters('design', ['tableColumnKeys']),
    tagList () {
      return this.tableColumnKeys.map(item => {
        return {
          value: item,
          label: item,
        }
      })
    },
  },
  methods: {
    handleTagSelectChange (value) {
      if (value.length === 0) return
      this.$store.dispatch('design/modifyFeatData', {
        search: [...value],
      })
    },
    async handleApisChange (property, val) {
      const data = {}
      data[property] = val
      await this.$store.dispatch('design/modifyApis', data)
    },
  },
}
</script>
