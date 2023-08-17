<template>
  <ta-border-layout layout-type="fixTop" class="fit">
    <ta-row slot="header">
      <ta-label-con v-show="page === '1' || page === '2'" label="数据量">
        <ta-input-number :precision="0" :min="1" v-model="bigDataLength"/>
        <ta-button @click="setData" type="primary">确认</ta-button>
      </ta-label-con>
      <ta-label-con v-show="page === '3' || page === '4'" label="树表格每级数据量">
        <ta-input-number :precision="0" :min="1" v-model="bigDataTreeLength"/>
        <ta-button @click="setData" type="primary">确认</ta-button>
      </ta-label-con>
    </ta-row>
    <ta-tabs class="fit" :default-active-key="page" @change="callback">
      <ta-tab-pane tab="10列左右" key="1">
          <bigtable-ten-colunm-test ref="tenColunm"  />
      </ta-tab-pane>
      <ta-tab-pane tab="20列左右" key="2">
        <bigtable-twenty-colunm-test ref="twentyColunm"   />
      </ta-tab-pane>
      <ta-tab-pane tab="表格树10列左右" key="3">
        <table-tree-ten-colunm ref="tenTreeTableColunm"/>
      </ta-tab-pane>
      <ta-tab-pane tab="表格树20列左右" key="4">
        <table-tree-twenty-colunm ref="twentyTreeTableColunm" />
      </ta-tab-pane>
    </ta-tabs>
  </ta-border-layout>
</template>

<script>
import bigtableTenColunmTest from './part/bigtableTenColunmTest'
import bigtableTwentyColunmTest from './part/bigtableTwentyColunmTest'
import tableTreeTenColunm from './part/bigtableTreeTenColunmTest'
import tableTreeTwentyColunm from './part/bigtableTreeTwentyColunmTest'
export default {
  name: 'bigTableTest',
  components: {
    bigtableTenColunmTest,
    bigtableTwentyColunmTest,
    tableTreeTenColunm,
    tableTreeTwentyColunm,
  },
  data () {
    return {
      bigDataLength: 2000,
      bigDataTreeLength: 200,
      page: '1'
    }
  },
  methods: {
    callback (key) {
      this.page = key
      this.setData()
      console.log(key)
    },
    setData () {
      if (this.page === '1') {
        this.$nextTick(() => {
          this.$refs.tenColunm.changeTableData(this.bigDataLength)
        })
      }
      else if (this.page === '2') {
        this.$nextTick(() => {
          this.$refs.twentyColunm.changeTableData(this.bigDataLength)
        })
      }
      else if (this.page === '3') {
        this.$nextTick(() => {
          this.$refs.tenTreeTableColunm.changeTableData(this.bigDataTreeLength)
        })
      }
      else if (this.page === '4') {
        this.$nextTick(() => {
          this.$refs.twentyTreeTableColunm.changeTableData(this.bigDataTreeLength)
        })
      }
    }
  },
}
</script>

<style scoped>


</style>
