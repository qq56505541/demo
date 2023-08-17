<template>
  <div style="padding: 20px">
    <ta-row>
      <ta-label-con label="设置下拉框数据量">
        <ta-input-number :precision="0" :min="1" v-model="dataLength" />
        <ta-button type="primary" @click="setData">
          确认
        </ta-button>
      </ta-label-con>
    </ta-row>
    <ta-row>
      <ta-label-con label="组件">
        <ta-select :options="dataList" :virtual="true" />
      </ta-label-con>
    </ta-row>
  </div>
</template>

<script>
export default {
  name: 'selectTest',
  data () {
    return {
      dataLength: '20',
      dataList: [],
    }
  },
  created () {
    this.setData()
  },
  methods: {
    setData () {
      Base.submit(null, {
        url: 'http/mock/projectDemo/selectData',
        data: { length: this.dataLength, },
      }).then((res) => {
        this.dataList = res.data.list
      })
    },
  },
}
</script>

<style scoped>

</style>
