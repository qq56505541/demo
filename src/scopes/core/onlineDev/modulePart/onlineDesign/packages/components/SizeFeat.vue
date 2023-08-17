<template>
  <ta-label-con
    :label-col="{span:4}"
    :wrapper-col="{span:20}"
    label="表格Size"
    style="margin-bottom: 8px;"
  >
    <ta-radio-group
      :default-value="featData.size"
      @change="handleSizeChange"
    >
      <ta-radio value="default">
        Default
      </ta-radio>
      <ta-radio value="middle">
        Middle
      </ta-radio>
      <ta-radio value="small">
        Small
      </ta-radio>
    </ta-radio-group>
  </ta-label-con>
</template>

<script>
import { mapState, } from 'vuex'

export default {
  name: 'SizeFeat',
  computed: {
    ...mapState('design', ['featData']),
  },
  methods: {
    handleSizeChange (e) {
      if (e.target.value === '' || e.target.value.trim() === '') return
      this.$store.dispatch('design/modifyFeatData', {
        size: e.target.value,
      })
    },
  },
}
</script>
