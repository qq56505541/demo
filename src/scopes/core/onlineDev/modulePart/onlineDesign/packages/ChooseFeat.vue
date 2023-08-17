<template>
  <div class="fit">
    <ta-row style="border-bottom: 1px solid #eeeeee;padding-bottom: 10px">
      <ta-col :span="6" style="text-align:center;font-size:16px;font-weight:600;padding-left: 10px">
        选择功能
      </ta-col>
      <ta-col :span="18" style="text-align:center;font-size:16px;font-weight:600;padding-left: 10px">
        功能配置
      </ta-col>
    </ta-row>
    <ta-row>
      <ta-col :span="6" style="padding-top: 15px;padding-left: 50px;height: calc(100vh - 154px);overflow-y: auto;">
        <ta-row
          v-for="item in featList"
          :key="item.value"
          :title="item.disabled ? item.title : undefined"
          style="margin-top: 15px"
        >
          <ta-checkbox
            :default-checked="chosenFeats.includes(item.value)"
            :value="item.value"
            :disabled="item.disabled"
            @change="handleCheckboxChange"
          >
            {{ item.label }}
          </ta-checkbox>
        </ta-row>
      </ta-col>
      <ta-col :span="18" style="border-left: 1px solid #EEEEEE;height: calc(100vh - 154px);overflow-y: auto;padding: 10px 20px">
        <search-feat />
        <filter-feat v-if="chosenFeats.includes('filter')" />
        <set-api />
        <size-feat v-if="chosenFeats.includes('size')" />
        <pagination-feat v-if="chosenFeats.includes('pagination')" />
      </ta-col>
    </ta-row>
  </div>
</template>

<script>
import { mapState, mapGetters, } from 'vuex'
import SearchFeat from './components/SearchFeat'
import FilterFeat from './components/FilterFeat'
import SetApi from './components/SetApi'
import SizeFeat from './components/SizeFeat'
import PaginationFeat from './components/PaginationFeat'

export default {
  name: 'ChoiceFeat',
  components: { SearchFeat, FilterFeat, SetApi, SizeFeat, PaginationFeat, },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('design', [
      'tableColumns',
      'featList',
      'chosenFeats',
      'apis'
    ]),
    ...mapGetters('design', ['collectionColumn']),
  },
  methods: {
    handleCheckboxChange (e) {
      const {
        checked,
        value,
      } = e.target
      checked && this.$store.dispatch('design/addChosenFeats', value)
      !checked && this.$store.dispatch('design/removeChosenFeats', value)
    },
  },
}
</script>

<style lang="less" type="text/less" scoped>

</style>
