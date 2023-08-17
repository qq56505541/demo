<template>
  <div style="padding: 20px">
    <div style="margin-bottom: 20px;border-bottom: 1px solid #eee">
      <ta-row><span style="font-size: 16px;font-weight: 600">同步测试</span></ta-row>
      <ta-row>
        <ta-label-con label="设置数据量">
          第一级数据量：<ta-input-number :precision="0" :min="1" v-model="dataFirstLenth" />
          第二级数据量：<ta-input-number :precision="0" :min="1" v-model="dataSecondLenth" />
          第三级数据量：<ta-input-number :precision="0" :min="1" v-model="dataThirdLenth" />
          <ta-button type="primary" @click="setData()">
            确认
          </ta-button>
        </ta-label-con>
      </ta-row>
      <ta-row>
        <ta-label-con label="是否开启虚拟滚动(用于大数据渲染)">
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
        <div style="height: 240px;">
          <ta-label-con style="height: 100%" label="联级组件示例">
            <ta-tree
              checkable
              :tree-data="treeData"
              @select="this.onSelect"
              @check="this.onCheck"
              :virtual="virtual"
            />
          </ta-label-con>
        </div>
      </ta-row>
    </div>
    <div>
      <ta-row>
        <span style="font-size: 16px;font-weight: 600;margin-right: 120px">异步测试</span>
        子节点数据量：<ta-input-number :precision="0" :min="1" v-model="dataAsynChildLenth" />

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
        <div>
          <ta-tree
            :load-data="fnLoad"
            :tree-data="treeList"
            :virtual="asynVirtual"
          />
        </div>
      </ta-row>
    </div>
  </div>
</template>

<script>

const data = []
for (let i = 0; i < 10; i++) {
  data.push({
    title: `${i}`,
    key: i,
    children: [],
  })
}
data.forEach((item, index) => {
  for (let i = 0; i < 10; i++) {
    item.children.push({
      title: `节点${index}的第${i}个子节点`,
      key: `${index}-${i}`,
      children: [],
    })
  }
  item.children.forEach((innerItem, innerIndex) => {
    for (let i = 0; i < 10; i++) {
      innerItem.children.push({
        title: `节点${index} - ${innerIndex}的第${i}个子节点`,
        key: `${index}-${innerIndex}-${i}`,
      })
    }
  })
})
export default {
  name: 'treeTest',
  data () {
    return {
      expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: true,
      checkedKeys: ['0-0-0'],
      selectedKeys: [],
      treeData: data,
      dataFirstLenth: 10,
      dataSecondLenth: 10,
      dataThirdLenth: 10,
      // treeData

      virtual: true,

      // 异步数据
      treeList: [
        {
          title: '节点1',
          key: '1',
          childNum: 1,
        },
        {
          title: '节点2',
          key: '2',
          childNum: 1,
        },
        {
          title: '节点3',
          key: '3',
          childNum: 0,
        }
      ],
      asynVirtual: true,
      dataAsynChildLenth: 10, // 异步请求的子节点数量
    }
  },
  watch: {
    checkedKeys (val) {
      console.log('onCheck', val)
    },
  },
  methods: {
    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    },

    setData () {
      const data = []
      for (let i = 0; i < this.dataFirstLenth; i++) {
        data.push({
          title: `${i}`,
          key: i,
          children: [],
        })
      }
      data.forEach((item, index) => {
        for (let i = 0; i < this.dataSecondLenth; i++) {
          item.children.push({
            title: `节点${index}的第${i}个子节点`,
            key: `${index}-${i}`,
            children: [],
          })
        }
        item.children.forEach((innerItem, innerIndex) => {
          for (let i = 0; i < this.dataThirdLenth; i++) {
            innerItem.children.push({
              title: `节点${index} - ${innerIndex}的第${i}个子节点`,
              key: `${index}-${innerIndex}-${i}`,
            })
          }
        })
      })
      this.treeData = data
    },

    // 异步加载下拉树数据
    fnLoad (treeNode) {
      const url = 'http/mock/projectDemo/bigdataTest/treeTest'
      return Base.submit(null, {
        url: url,
        data: {
          orgId: treeNode ? treeNode.eventKey : null,
          dataLength: this.dataAsynChildLenth,
        },
      }).then((data) => {
        // 将返回数据作为参数传入reslove方法进行渲染
        return data.data
      })
    },
    handleVirtualChange (e) {
      this.virtual = e.target.value
    },
    handleVirtualChangeAsyn (e) {
      this.asynVirtual = e.target.value
    },
  },
}
</script>

<style scoped>

</style>
