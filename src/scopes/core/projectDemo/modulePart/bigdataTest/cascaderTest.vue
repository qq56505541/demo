<template>
  <div style="padding: 20px">
    <div style="margin-bottom: 20px;border-bottom: 1px solid #eee">
      <ta-row><span style="font-size: 16px;font-weight: 600">同步测试</span></ta-row>
      <ta-row>
        <ta-label-con label="设置数据量">
          第一级数据量：<ta-input-number :precision="0" :min="1" v-model="dataFirstLenth" />
          第二级数据量：<ta-input-number :precision="0" :min="1" v-model="dataSecondLenth" />
          <ta-button type="primary" @click="setData()">
            确认
          </ta-button>
        </ta-label-con>
      </ta-row>
      <ta-row>
        <ta-label-con label="是否开启虚拟滚动">
          <ta-radio-group :value="virtual" @change="handleVirtualChange">
            <ta-radio-button :value="true">
              是
            </ta-radio-button>
            <ta-radio-button :value="false">
              否
            </ta-radio-button>
          </ta-radio-group>
        </ta-label-con>
      </ta-row>
      <ta-row>
        <ta-label-con label="联级组件示例">
          <ta-cascader :virtual="virtual" :options="options1" @change="onChange" placeholder="Please select" />
        </ta-label-con>
      </ta-row>
    </div>
    <div>
      <ta-row><span style="font-size: 16px;font-weight: 600">异步测试</span></ta-row>
      <ta-label-con label="设置数据量">
        第一级数据量：<ta-input-number :precision="0" :min="1" v-model="dataFirstLenthAsyn" />
        第二级数据量：<ta-input-number :precision="0" :min="1" v-model="dataSecondLenthAsyn" />
        <ta-button type="primary" @click="setDataAsyn()">
          确认
        </ta-button>
      </ta-label-con>
      <ta-row>
        <ta-label-con label="是否开启虚拟滚动">
          <ta-radio-group :value="asynVirtual" @change="handleVirtualChangeAsyn">
            <ta-radio-button :value="true">
              是
            </ta-radio-button>
            <ta-radio-button :value="false">
              否
            </ta-radio-button>
          </ta-radio-group>
        </ta-label-con>
      </ta-row>

      <ta-row>
        <ta-label-con label="联级选择组件">
          <ta-cascader
            :options="options"
            @change="onChange"
            :load-data="loadData"
            placeholder="请选择"
            :virtual="asynVirtual"
          />
        </ta-label-con>
      </ta-row>
    </div>
  </div>
</template>

<script>
const options1 = []
for (let i = 0; i < 100; i++) {
  options1.push({
    value: i,
    label: '节点' + i,
    children: [],
  })
}
options1.forEach((item, index) => {
  for (let i = 0; i < 100; i++) {
    item.children.push({
      value: `${index}-${i}`,
      label: `节点${index}的第${i}个子节点`,
    })
  }
})

const options = []
for (let i = 0; i < 100; i++) {
  options.push({
    value: i,
    label: '节点' + i,
    childNum: 1,
    // children: [],
  })
}
/* options.forEach((item, index) => {
  for (let i = 0; i < 100; i++) {
    item.children.push({
      value: `${index}-${i}`,
      label: `节点${index}的第${i}个子节点`,
      childNum: 1,
    })
  }
}) */

export default {
  name: 'cascaderTest',
  data () {
    return {
      options1,
      virtual: true,
      dataFirstLenth: 100,
      dataSecondLenth: 100,

      // 异步
      asynVirtual: true,
      options: options,
      dataFirstLenthAsyn: 10,
      dataSecondLenthAsyn: 10,
    }
  },
  methods: {
    onChange (value) {
      console.log(value)
    },
    handleVirtualChange (e) {
      this.virtual = e.target.value
    },
    handleVirtualChangeAsyn (e) {
      this.asynVirtual = e.target.value
    },
    setDataAsyn () {
      const options = []
      for (let i = 0; i < this.dataFirstLenthAsyn; i++) {
        options.push({
          value: i,
          label: '节点' + i,
          childNum: 1,
        })
      }
      this.options = options
    },
    setData () {
      const options1 = []
      for (let i = 0; i < this.dataFirstLenth; i++) {
        options1.push({
          value: i,
          label: '节点' + i,
          children: [],
        })
      }
      options1.forEach((item, index) => {
        for (let i = 0; i < this.dataSecondLenth; i++) {
          item.children.push({
            value: `${index}-${i}`,
            label: `节点${index}的第${i}个子节点`,
          })
        }
      })
      this.options1 = options1
    },
    loadData (selectedOptions) {
      // 获取最后一个
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      const url = 'http/mock/projectDemo/bigdataTest/cascaderTest'
      // 从后台获取数据,然后添加到当前options中
      Base.submit(null, { url: url, data: { orgId: targetOption.value, dataLength: this.dataSecondLenthAsyn, }, }).then(data => {
        targetOption.loading = false
        targetOption.children = data.data
        this.options = [...this.options]
      })
    },
    loadData1 (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      setTimeout(() => {
        targetOption.loading = false
        const children = []
        for (let i = 0; i < this.dataSecondLenthAsyn; i++) {
          children.push({
            value: '子节点' + i,
            label: '子节点' + i,
            childNum: 0,
          })
        }
        targetOption.children = children
        /* targetOption.children = [{
          value: 'xihu',
          label: 'xihu',
          childNum: 0
        }] */
        this.options = [...this.options]
      }, 200)
    },
  },
}
</script>

<style scoped>

</style>
