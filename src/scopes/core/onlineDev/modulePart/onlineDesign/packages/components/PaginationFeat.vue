<template>
  <ta-label-con
    :label-col="{span:4}"
    :wrapper-col="{span:20}"
    label="分页Sizes"
    style="margin-bottom: 8px;"
  >
    <template #extra>
      <div style="color: rgba(0,0,0,.45);line-height: 1.5;height: 21px;transition: color .3s cubic-bezier(.215,.61,.355,1);margin-top: -2px;clear: both;">
        例如：10,20,50,100,200，默认Size为第二个，即20
      </div>
    </template>
    <ta-input placeholder="请输入分页Sizes" :value="featData.pagination.join()" @change="handlePaginationChange" />
  </ta-label-con>
</template>

<script>
import { mapState, } from 'vuex'
export default {
  name: 'PaginationFeat',
  computed: {
    ...mapState('design', ['featData']),
  },
  methods: {
    handlePaginationChange (e) {
      if (e.target.value === '' || e.target.value.trim() === '') {
        this.$store.dispatch('design/modifyFeatData', {
          pagination: ['10', '20', '50', '100', '200'],
        })
      } else {
        const val = e.target.value.split(',')
        if (val.length === 0) return
        this.$store.dispatch('design/modifyFeatData', {
          pagination: val,
        })
      }
    },
  },

}
</script>
